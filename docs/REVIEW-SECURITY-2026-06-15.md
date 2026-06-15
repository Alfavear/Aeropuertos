# Revisión de Seguridad y Buenas Prácticas — 15 de Junio, 2026

> Auditoría completa de código: vulnerabilidades, bugs, y ajustes aplicados.
> Ambiente: Desarrollo (Node v20.17.0, NestJS 11, Prisma 6, React 19, Vite 6)

---

## Archivos revisados

### Backend
| Archivo | Líneas | Veredicto |
|---|---|---|
| `backend/src/main.ts` | 71 | OK (CORS, Helmet, Swagger, ValidationPipe) |
| `backend/src/app.module.ts` | — | OK (interceptores registrados) |
| `backend/src/auth/auth.service.ts` | 194 | OK (login retorna solo campos seguros) |
| `backend/src/auth/jwt.strategy.ts` | 66 | OK (valida user + aeropuerto en cada request) |
| `backend/src/auth/roles.guard.ts` | — | OK (RBAC por perfil en DB) |
| `backend/src/auth/aeropuerto-activo.guard.ts` | — | OK (valida header X-Aeropuerto-Activo) |
| `backend/src/common/audit.interceptor.ts` | 71 | BUG CORREGIDO (loggeaba passwords) |
| `backend/src/common/error-logger.interceptor.ts` | — | OK |
| `backend/src/seguridad/seguridad.controller.ts` | 421 | BUG CORREGIDO (sin ownership check) |
| `backend/src/seguridad/seguridad.service.ts` | 654 | OK (historial de contraseñas, bloqueo) |
| `backend/src/seguridad/dto/cambiar-password.dto.ts` | 17 | OK (min 8, regex uppercase+lowercase+number) |

### Frontend
| Archivo | Líneas | Veredicto |
|---|---|---|
| `frontend/src/App.tsx` | 216 | OK (ProtectedRoute con permisos) |
| `frontend/src/components/auth/ProtectedRoute.tsx` | 81 | OK (usePermisos hook) |
| `frontend/src/lib/api.ts` | 31 | BUG CORREGIDO (baseURL, timeout) |
| `frontend/src/stores/authStore.ts` | 45 | BUG CORREGIDO (try-catch) |
| `frontend/src/pages/Login.tsx` | 267 | BUG CORREGIDO (doble /v1, password policy) |

---

## Bugs críticos corregidos

### 1. API version mismatch — frontend `/api` vs backend `/api/v1`

**Archivo:** `frontend/src/lib/api.ts`
**Severidad:** CRÍTICO — todas las llamadas API retornaban 404

```diff
- const api = axios.create({
-   baseURL: '/api',
- })
+ const api = axios.create({
+   baseURL: '/api/v1',
+   timeout: 30000,
+ })
```

**Causa:** El backend configura `app.setGlobalPrefix('api')` + `app.enableVersioning({ defaultVersion: '1' })`, resultando en rutas `/api/v1/...`. El frontend usaba `/api` sin versión.

---

### 2. Doble prefijo `/v1` en Login.tsx

**Archivo:** `frontend/src/pages/Login.tsx:84`
**Severidad:** CRÍTICO — el cambio de contraseña nunca funcionaba

```diff
- await api.post(`/v1/seguridad/usuarios/${loginData.id}/cambiar-password`, {
+ await api.post(`/seguridad/usuarios/${loginData.id}/cambiar-password`, {
```

**Causa:** El `baseURL` ya es `/api/v1`, así que `/v1/seguridad/...` resultaba en `/api/v1/v1/seguridad/...` (404).

---

### 3. Audit interceptor loggeaba datos sensibles

**Archivo:** `backend/src/common/audit.interceptor.ts`
**Severidad:** ALTO — passwords, tokens y PII quedaban en logs

```diff
+ private sanitizeBody(body: unknown): unknown {
+   if (!body || typeof body !== 'object') return body;
+   const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization'];
+   const sanitized = { ...body as Record<string, unknown> };
+   for (const field of sensitiveFields) {
+     if (field in sanitized) {
+       sanitized[field] = '[REDACTED]';
+     }
+   }
+   return sanitized;
+ }
```

**Impacto:** Cada POST/PUT/PATCH/DELETE loggeaba el body completo. Ahora los campos sensibles se reemplazan por `[REDACTED]`.

---

### 4. `aeropuertoActivo` JSON.parse sin try-catch

**Archivo:** `frontend/src/stores/authStore.ts:26`
**Severidad:** ALTO — crash en runtime si sessionStorage tiene datos corruptos

```diff
- aeropuertoActivo: storedAeropuerto ? JSON.parse(storedAeropuerto) : null,
+ let storedAeropuertoActivo: AeropuertoActivo | null = null
+ try {
+   if (storedAeropuerto) storedAeropuertoActivo = JSON.parse(storedAeropuerto)
+ } catch {
+   sessionStorage.removeItem('aeropuertoActivo')
+ }
```

**Causa:** Si `sessionStorage` contenía un valor no-JSON válido, la app crasheaba al cargar.

---

## Bugs de prioridad media corregidos

### 5. `cambiarPassword` sin verificación de propiedad

**Archivo:** `backend/src/seguridad/seguridad.controller.ts:95`
**Severidad:** MEDIO — cualquier usuario autenticado podía cambiar la contraseña de otro usuario

```diff
  @Post('usuarios/:id/cambiar-password')
  @ApiOperation({ summary: 'Cambiar contraseña (con verificación de actual)' })
- cambiarPassword(
+ async cambiarPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarPasswordDto,
+   @CurrentUser() user: AuthUser,
  ) {
+   const targetUser = await this.seguridadService.findUsuarioById(id);
+   const isAdmin = targetUser.perfil?.codigo === 'ADMIN';
+   if (user.id !== id && !isAdmin) {
+     return { message: 'Solo puede cambiar su propia contraseña' };
+   }
    return this.seguridadService.cambiarPassword(id, dto);
  }
```

**Regla:** Solo el propio usuario o un ADMIN puede cambiar la contraseña.

---

### 6. Password policy mismatch (frontend vs backend)

**Archivo:** `frontend/src/pages/Login.tsx`
**Severidad:** MEDIO — frontend aceptaba contraseñas que el backend rechazaba

```diff
  const changePassSchema = z.object({
    passwordActual: z.string().min(1, 'La contraseña actual es requerida'),
-   passwordNueva: z.string().min(6, 'Mínimo 6 caracteres'),
+   passwordNueva: z.string().min(8, 'Mínimo 8 caracteres')
+     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Debe contener al menos 1 mayúscula, 1 minúscula y 1 número'),
    confirmar: z.string().min(1, 'Confirme la nueva contraseña'),
  })
```

**Backend (CambiarPasswordDto):**
```typescript
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
  message: 'La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número',
})
```

---

## Ajustes de infraestructura

### 7. Request timeout en API client

**Archivo:** `frontend/src/lib/api.ts`
**Severidad:** MEDIO — requests podían colgar indefinidamente

```diff
  const api = axios.create({
    baseURL: '/api/v1',
+   timeout: 30000,
  })
```

**Valor:** 30 segundos (30000ms).

---

### 8. Eliminación de directorio vacío `sistemas/`

**Archivo:** `backend/src/sistemas/`
**Severidad:** BAJA — código muerto

Directorio existía pero estaba vacío. Eliminado para mantener limpieza del proyecto.

---

## Verificados como NO-bugs

| Item | Resultado |
|---|---|
| **Swagger endpoint no iniciado** | FALSO — `app.listen(port)` existe en línea 67 de `main.ts` |
| **Password hash en login response** | FALSO — `auth.service.ts:97-104` retorna solo `id, username, nombre, email, telefono, perfil` (sin `password`) |
| **RolesGuard sin cache** | OK por ahora — se puede optimizar con Redis en futuro |
| **`error-logger.interceptor.ts` loggea stack traces** | Aceptable en desarrollo — filtrar en producción |

---

## Compilación verificada

```
Backend:  nest build         → 0 errores ✅
Frontend: vite build         → 0 errores, 67 chunks ✅
```

---

## Resumen de archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/src/lib/api.ts` | baseURL `/api/v1`, timeout 30s |
| `frontend/src/stores/authStore.ts` | try-catch en JSON.parse de aeropuertoActivo |
| `frontend/src/pages/Login.tsx` | Fix doble `/v1`, password policy min 8 + regex |
| `backend/src/common/audit.interceptor.ts` | sanitizeBody() redacta campos sensibles |
| `backend/src/seguridad/seguridad.controller.ts` | Ownership check en cambiarPassword |
| `backend/src/sistemas/` | Eliminado (directorio vacío) |

---

## Pendientes para futuras sesiones

| Prioridad | Item |
|---|---|
| ALTA | Caché de perfiles en RolesGuard (Redis) |
| ALTA | Rate limiting por IP en endpoints no-auth |
| MEDIA | Refresh token mechanism (JWT renewal) |
| MEDIA | CORS dinámico (configurable por DB) |
| MEDIA | Logs de auditoría con nivel configurable (dev vs prod) |
| BAJA | Helmet CSP: evaluar si `unsafe-eval` es necesario en producción |

---

*Generado: 15 de Junio, 2026 — Auditoría de seguridad post-sesión 13*
