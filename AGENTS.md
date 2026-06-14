# AGENTS.md — Guía para IA en este proyecto

> **Regla de oro:** Este NO es una migración del sistema legacy "Zeus Aeropuertos".
> Es una **reingeniería completa** para el siguiente nivel.
> No copies el código VB6. No copies los nombres de tablas legacy.
> Piensa en cómo DEBERÍA ser un sistema aeroportuario moderno.

---

## 1. IDENTIDAD DEL PROYECTO

- **Nombre:** [Por definir — en bitácora como "AeroNova" tentativo]
- **Qué es:** Sistema de administración aeroportuaria para **concesiones** que manejan **múltiples aeropuertos independientes** (multi-propiedad/multi-tenencia desde el diseño)
- **Stack:** NestJS + Prisma + PostgreSQL + React 19 + TypeScript + Tailwind CSS v4
- **Propósito:** Gestionar operaciones aeroportuarias, facturación, liquidaciones, tarifas, aerolíneas, aeronaves y seguridad para holdings con múltiples aeropuertos
- **Nivel:** Sistema enterprise multi-tenant con arquitectura moderna

### Lo que NO es:
- ❌ NO es "Zeus Aeropuertos 2.0" (borra ese nombre)
- ❌ NO es una migración 1:1 del legacy VB6
- ❌ NO usa nombres de tablas del sistema original
- ❌ NO copia formularios VB6 a React
- ❌ NO hereda bugs ni malas prácticas del original

---

## 2. STACK TECNOLÓGICO (INMODIFICABLE)

```
Frontend:   React 19 + TypeScript + Vite 6 + Tailwind CSS v4
Backend:    NestJS 11 + TypeScript + Prisma ORM 6
DB:         PostgreSQL 16
Auth:       JWT + Passport + bcryptjs
API:        REST + Swagger (OpenAPI)
Cache:      Redis (futuro)
Colas:      Bull Queue (futuro)
```

### Versiones exactas (Node v20.17.0):
- `react@^19.2.6`
- `vite@^6.4.3` (no Vite 8 — incompatible con Node 20.17.0)
- `tailwindcss@^4.3.1` (v4, no hay tailwind.config.js)
- `@prisma/client@^6.19.3`
- `@nestjs/core@^11.0.1`
- `typescript@~6.0.2` (frontend), `typescript@^5.7.3` (backend)

---

## 3. ESTRUCTURA DEL PROYECTO

```
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # ESQUEMA MAESTRO — única fuente de verdad
│   │   └── seed.ts          # Seed data (países, perfiles, admin, etc.)
│   ├── src/
│   │   ├── main.ts          # Entry point (CORS, Swagger, ValidationPipe)
│   │   ├── app.module.ts    # Root module
│   │   ├── prisma/          # PrismaService + PrismaModule (Global)
│   │   ├── auth/            # AuthModule: login JWT + Passport Strategy
│   │   ├── common/          # Guards, decorators, filters, pipes
│   │   └── modules/         # Módulos de negocio
│   │       ├── organizacion/  # Pais, Ciudad, Aeropuerto, Zona
│   │       ├── aerolineas/    # Aerolinea, Aeronave, TipoAeronave
│   │       ├── operaciones/   # Itinerario, Vuelo, Puerta, Hangar
│   │       ├── tarifas/       # Concepto, TarifaOperacion, Impuesto
│   │       ├── facturacion/   # Factura, MovimientoFacturacion
│   │       ├── liquidaciones/ # Liquidacion, Tasa, Pasajero
│   │       ├── configuracion/ # ParametroSistema, IndicadorEconomico
│   │       └── seguridad/     # Usuario, Perfil, MenuOpcion
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Card, Table, Dialog
│   │   │   └── layout/      # Sidebar, Header, AppLayout
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── modules/     # CRUDs por módulo
│   │   ├── stores/          # Zustand (authStore)
│   │   ├── lib/             # api.ts (Axios), utils.ts
│   │   └── types/           # TypeScript interfaces
│   └── package.json
├── docs/                    # Documentación complementaria
├── bitacora.md              # Proyección completa del proyecto
├── AGENTS.md                # Este archivo
└── .gitignore
```

---

## 4. CONVENCIONES DE CÓDIGO

### Backend (NestJS)

| Concepto | Convención |
|---|---|
| Módulos | PascalCase: `OrganizacionModule` |
| Controladores | PascalCase: `PaisController` |
| Servicios | PascalCase: `PaisService` |
| DTOs | PascalCase con sufijo: `CreatePaisDto` |
| Archivos | kebab-case: `pais.service.ts` |
| Rutas API | plural kebab-case: `/api/v1/paises` |
| Prefijo global | `/api` |
| Versiones | URI: `/api/v1/...` |
| Decoradores | Swagger en controllers, ValidationPipe en DTOs |

### Frontend (React)

| Concepto | Convención |
|---|---|
| Componentes | PascalCase: `AeropuertosTable` |
| Archivos | PascalCase: `AeropuertosPage.tsx` |
| Páginas | PascalCase export default: `export default function Aeropuertos()` |
| Stores | camelCase: `useAuthStore` |
| Hooks | camelCase prefix `use`: `useAeropuertos` |
| Tipos | PascalCase en `types/index.ts` |
| Alias imports | `@/components/ui/Button` |
| CSS | Tailwind utility classes (NO CSS modules, NO styled-components) |
| Íconos | lucide-react (NO FontAwesome, NO Material Icons) |

### Base de datos (Prisma)

| Concepto | Convención |
|---|---|
| Nombres modelo | PascalCase singular: `Pais`, `Aeropuerto`, `Factura` |
| Nombres tabla | snake_case plural: `paises`, `aeropuertos`, `facturas` |
| FK fields | camelCase: `idPais`, `idAeropuerto`, `idAerolinea` |
| Timestamps | `createdAt`, `updatedAt` (Prisma managed) |
| IDs | `Int @id @default(autoincrement())` |
| Soft delete | Boolean `activo` + filter en queries |
| Naming | **SIN** prefijos: no `Mae`, no `Cls`, no `Frm`, no `Rpt` |
| Tabla polimórfica | `MovimientoFacturacion` (tipo + campos genéricos) |
| Nombres | En español, descriptivos: `liquidaciones` no `infrasa` |

### API REST

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/v1/paises` | Listar |
| GET | `/api/v1/paises/:id` | Obtener |
| POST | `/api/v1/paises` | Crear |
| PUT | `/api/v1/paises/:id` | Actualizar |
| DELETE | `/api/v1/paises/:id` | Eliminar |

---

## 5. REGLAS CRÍTICAS DE SEGURIDAD

- **NUNCA** expongas passwords en logs o respuestas
- **NUNCA** guardes tokens en sessionStorage (solo localStorage con authStore)
- **SIEMPRE** usa guards JWT en rutas protegidas
- **SIEMPRE** valida input con class-validator (backend) + Zod (frontend)
- **TODAS** las contraseñas hash con bcryptjs (salt rounds: 10)
- **CORS** configurado para solo orígenes conocidos
- **Helmet** activado para headers de seguridad
- **Rate limiting** pendiente (NestJS throttler)

---

## 6. MÓDULOS Y SUS RESPONSABILIDADES

### ORGANIZACION (organizacion/)
- `Pais` — Catálogo de países (ISO 3166)
- `Ciudad` — Ciudades con FK a país
- `Aeropuerto` — Aeropuertos (multi-tenencia: cada aeropuerto es una unidad de negocio)
- `Zona` / `ZonaAeropuerto` — Zonas geográficas
- `HorarioAeropuerto` — Horarios operativos

### AEROLINEAS (aerolineas/)
- `Aerolinea` — Aerolíneas registradas con configuración contable
- `Aeronave` — Aeronaves con matrícula, tipo, pesos
- `TipoAeronave` — Modelos de aeronaves (B737, A320, etc.)
- `Fabricante` — Fabricantes (Boeing, Airbus, etc.)
- `ClaseAviacion` — Clasificación (Comercial, Carga, Privada, Militar)
- `PersonalAerolinea` — Tripulación y personal

### OPERACIONES (operaciones/)
- `Itinerario` — Itinerarios de vuelo (programación)
- `Vuelo` — Catálogo de vuelos
- `PuertaEmbarque` — Puertas de embarque por aeropuerto
- `Hangar` — Hangares por aeropuerto
- `ServicioOperacion` — Servicios adicionales
- `RegistroPeso` — Pesos registrados
- `AsignacionPuertaVuelo` — Asignación puerta-vuelo dinámica
- `NotaOperacion` — Notas y observaciones

### TARIFAS (tarifas/)
- `Concepto` — Conceptos de facturación (aterrizaje, parqueo, hangar, etc.)
- `GrupoConcepto` — Agrupación de conceptos
- `TipoOperacion` — Tipos de operación
- `TarifaOperacion` — Tarifas por operación y rango de peso
- `TarifaAerolinea` — Tarifas negociadas por aerolínea
- `Impuesto` — Catálogo de impuestos (IVA, reteICA, etc.)

### FACTURACION (facturacion/)
- `Factura` — Cabecera de factura
- `FacturaDetalle` — Líneas de detalle
- `FacturaPago` — Pagos aplicados
- `FacturaImpuesto` — Impuestos por factura
- `NotaContable` — Notas contables (débito/crédito)
- `AcuerdoPago` — Acuerdos de pago
- `FuenteFacturacion` — Fuentes y series por aeropuerto
- `ConfigFacturacion` — Configuración por cliente
- `MovimientoFacturacion` — **Tabla polimórfica** que unifica todos los movimientos
- `Folio` / `FolioDetalle` — Folios de liquidación

### LIQUIDACIONES (liquidaciones/)
- `Liquidacion` — Liquidación de infraestructura (antes "Infrasa")
- `ItemLiquidacion` — Items de liquidación
- `PasajeroNacional` — Pasajeros nacionales
- `PasajeroInternacional` — Pasajeros internacionales
- `Tasa` — Tasas aeroportuarias
- `TipoPasajero` — Adulto, Menor, Infante, Exento, Tránsito
- `ClasePasajero` — Primera Clase, Ejecutiva, Económica

### SEGURIDAD (seguridad/)
- `Usuario` — Usuarios del sistema
- `Perfil` — Roles (Admin, Operador, Facturador, Consulta)
- `PermisoPerfil` — Permisos granular por recurso
- `MenuOpcion` — Estructura jerárquica del menú
- `SesionUsuario` — Historial de sesiones
- `AccesoAeropuerto` — Restricción de acceso por aeropuerto
- `UsuarioCuenta` — Cuentas contables por usuario

### CONFIGURACION (configuracion/)
- `ParametroSistema` — ~30 parámetros esenciales (de 55+ originales)
- `IndicadorEconomico` — TRM, IPC, UVT
- `CodigoAeronautico` — Códigos OACI/IATA
- `ServicioAereo` — Servicios aeroportuarios (Ground Handling, etc.)
- `Secuencia` — Consecutivos
- `Mensaje` — Mensajes del sistema
- `TipoEvento` / `Evento` — Eventos programados

### AUDITORIA (en prisma/schema pero sin módulo aún)
- `BitacoraError` — Log de errores (reemplaza ZeusFWErrores)
- `AuditoriaOperacion` — Trazabilidad de cambios

---

## 7. CRITICAL — QUÉ NO HACER NUNCA

1. **NO** agregues tablas con prefijos `Mae`, `Cls`, `Frm`, `Rpt`
2. **NO** crees tablas separadas para cada tipo de movimiento (usa `MovimientoFacturacion`)
3. **NO** copies la lógica de negocios VB6 directamente — rediseña
4. **NO** uses SQL Server — siempre PostgreSQL
5. **NO** uses nombres en inglés para tablas/modelos — todo en español
6. **NO** modifiques `schema.prisma` sin regenerar el cliente (`npx prisma generate`)
7. **NO** uses `any` en TypeScript a menos que sea estrictamente necesario
8. **NO** agregues dependencias sin verificar compatibilidad con Node 20.17.0
9. **NO** subas Vite a v8 (incompatible con Node 20.17.0)
10. **NO** crees archivos tailwind.config.js (Tailwind v4 no lo usa)
11. **NO** guardes secrets en el código
12. **NO** modifiques `main.ts` (entry point) sin entender impacto global
13. **NO** borres campos del schema que ya estén en uso por los services
14. **SIEMPRE** que agregues un modelo nuevo, crea su servicio y controlador

---

## 8. FLUJO DE TRABAJO SEGURO

```
1. Entender el dominio de negocio
   └─ Lee la bitácora primero
   └─ Lee el schema.prisma para entender modelos

2. Hacer cambios en schema.prisma (si aplica)
   └─ npx prisma generate (regenerar cliente)
   └─ npx prisma db push (sync DB - dev only)

3. Implementar backend
   └─ Crear/editar service en módulo correspondiente
   └─ Crear/editar controller con Swagger decorators
   └─ npm run build (verificar compilación)

4. Implementar frontend
   └─ Crear/editar página en pages/modules/
   └─ Actualizar stores o servicios si necesario
   └─ npx vite build (verificar compilación)

5. Verificar
   └─ Backend: npm run build
   └─ Frontend: npx vite build
   └─ No warnings ni errores
```

---

## 9. DECISIONES ARQUITECTÓNICAS CLAVE

| Decisión | Opción elegida | Alternativas descartadas |
|---|---|---|
| ORM | Prisma | TypeORM (más verboso, menos DX) |
| CSS | Tailwind v4 (CSS-only) | Tailwind v3 (JS config), CSS Modules |
| Auth | JWT + Passport + bcrypt | Sessions, Firebase Auth |
| Estado frontend | Zustand + React Query | Redux, Context API |
| Formularios | React Hook Form + Zod | Formik, Final Form |
| API | REST (inicial) | GraphQL (futuro si se necesita) |
| Multi-tenencia | Por ID de aeropuerto (columna idAeropuerto) | Schema-based, DB isolation |
| Polimorfismo | Una tabla MovimientoFacturacion con tipo | 10+ tablas separadas (legacy) |
| DB naming | Español, sin prefijos | Inglés, con prefijos (legacy) |

---

## 10. CONCEPTOS DE NEGOCIO CLAVE

| Término | Significado |
|---|---|
| **Concesión aeroportuaria** | Empresa que administra uno o varios aeropuertos por concesión del estado |
| **Multi-propiedad** | Un mismo sistema manejando aeropuertos con dueños/operadores distintos |
| **BU** (Business Unit) | Unidad de negocio — cada aeropuerto es una BU |
| **Liquidación** | Proceso de conteo de pasajeros para cobro de tasas aeroportuarias |
| **Tasa aeroportuaria** | Cargo que paga el pasajero por uso del aeropuerto |
| **Itinerario** | Programación de vuelos (frecuencias) |
| **Movimiento facturación** | Registro atómico de un cargo (aterrizaje, parqueo, hangar, etc.) |
| **TRM** | Tasa Representativa del Mercado (tipo de cambio COP/USD) |
| **Horas de gracia** | Tiempo sin cobro antes de iniciar la tarifa de parqueo/hangar |
| **Recargo nocturno** | Porcentaje adicional por operaciones en horario nocturno |
| **Hora valle** | Período con tarifa reducida por baja demanda |

---

## 11. ESTADO ACTUAL DEL PROYECTO

```
Fase 0: Análisis y dimensionamiento     [100%]
Fase 1: Diseño arquitectónico            [100%]
Fase 2: Modelado de datos (schema)       [100%]
Fase 3: Backend base                     [100%]
Fase 4: Frontend base                    [100%]
Fase 5: Seeds y datos iniciales          [100%]
────────────────────────────────────────
Fase 6: Módulos completos backend        [30%]  ← EN PROGRESO
Fase 7: CRUDs completos frontend         [20%]  ← SIGUIENTE
Fase 8: Reportes                         [0%]
Fase 9: Seguridad y calidad              [0%]
Fase 10: Despliegue y CI/CD              [0%]
```

### Próximos pasos prioritarios:
1. Definir nombre del proyecto (pendiente)
2. Crear módulos completos backend para cada dominio
3. Crear CRUDs frontend para cada módulo
4. Implementar multi-tenencia por aeropuerto
5. Dashboard con métricas reales

---

## 12. ARCHIVOS QUE NO DEBEN MODIFICARSE SIN AUTORIZACIÓN

- `backend/src/main.ts` — Entry point global
- `backend/src/app.module.ts` — Root module (importa todos los módulos)
- `backend/prisma/schema.prisma` — **Solo agregar**, no eliminar sin validar
- `frontend/vite.config.ts` — Proxy y build config
- `frontend/src/main.tsx` — Entry point React
- `backend/prisma/prisma.config.ts` — Prisma configuration
- `AGENTS.md` — Este archivo
- `bitacora.md` — Proyección del proyecto

---

*Última actualización: 14 de Junio, 2026*
*Mantén este archivo actualizado con cada decisión importante.*
