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
│   │   ├── schema.prisma    # ESQUEMA MAESTRO — 74 modelos
│   │   └── seed.ts          # Seed data (países, perfiles, admin, etc.)
│   ├── src/
│   │   ├── main.ts          # Entry point (CORS, Swagger, ValidationPipe)
│   │   ├── app.module.ts    # Root module (10 módulos registrados)
│   │   ├── prisma/          # PrismaService + PrismaModule (Global)
│   │   ├── auth/            # AuthModule: login JWT + Passport Strategy
│   │   ├── organizacion/    # 6 entidades: Pais, Ciudad, Aeropuerto, Zona...
│   │   ├── aerolineas/      # 9 entidades: Aerolinea, Aeronave, TipoAeronave...
│   │   ├── tarifas/         # 7 entidades: Concepto, TarifaOperacion, Impuesto...
│   │   ├── configuracion/   # 10 entidades: ParametroSistema, Indicador...
│   │   ├── periodos/        # 4 entidades: Periodo, PeriodoAeropuerto, Dias...
│   │   ├── reportes/        # 2 entidades: Reporte, CategoriaReporte
│   │   ├── operaciones/     # 8 entidades: Itinerario, Vuelo, Puerta, Hangar...
│   │   ├── facturacion/     # 11 entidades: Factura, Detalle, Pagos...
│   │   ├── seguridad/       # 7 entidades: Usuario, Perfil, Permisos...
│   │   └── liquidaciones/   # 7 entidades: Liquidacion, Tasa, Pasajero...
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
- `Aerolinea` — Aerolíneas registradas con configuración contable (recargos, horas gracia, OACI/IATA, facturación)
- `Aeronave` — Aeronaves con matrícula, tipo, pesos, certificación explotación nacional
- `TipoAeronave` — Modelos de aeronaves (B737, A320, etc.)
- `Fabricante` — Fabricantes (Boeing, Airbus, etc.)
- `ClaseAviacion` — Clasificación (Comercial, Carga, Privada, Militar)
- `PersonalAerolinea` — Tripulación y personal
- `AerolineaConcepto` — Conceptos de facturación asignados por aerolínea
- `AerolineaConfig` — Configuración de horario único, hora valle y descuentos por aerolínea+aeropuerto

### OPERACIONES (operaciones/)
- `Itinerario` — Itinerarios de vuelo (programación)
- `Vuelo` — Catálogo de vuelos
- `PuertaEmbarque` — Puertas de embarque por aeropuerto
- `Hangar` — Hangares por aeropuerto
- `ServicioOperacion` — Servicios adicionales
- `RegistroPeso` — Pesos registrados
- `AsignacionPuertaVuelo` — Asignación puerta-vuelo dinámica
- `NotaOperacion` — Notas y observaciones
- `CalculosService` — Motor de cálculo de conceptos (aterrizaje, parqueo, tasas, servicios)
  - `POST /operaciones/calcular-conceptos` — Calcula conceptos sin persistir (retorna valores + fórmula)

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
- `PasajeroNacional` — Pasajeros nacionales con detalle por tipo
- `PasajeroInternacional` — Pasajeros internacionales (dólares/pesos)
- `Tasa` — Tasas aeroportuarias (valor fijo)
- `TipoPasajero` — Adulto, Menor, Infante, Exento, Tránsito
- `ClasePasajero` — Primera Clase, Ejecutiva, Económica

### SEGURIDAD (seguridad/)
- `Usuario` — Usuarios del sistema (bcrypt, soft-delete, oculta password)
- `Perfil` — Roles (Admin, Operador, Facturador, Consulta)
- `PermisoPerfil` — Permisos granular por recurso
- `MenuOpcion` — Estructura jerárquica del menú (idPadre)
- `SesionUsuario` — Historial de sesiones
- `AccesoAeropuerto` — Restricción de acceso por aeropuerto
- `UsuarioCuenta` — Cuentas contables por usuario

### CONFIGURACION (configuracion/)
- `ParametroSistema` — ~30 parámetros esenciales (cambian comportamiento: redondeos, recargos, modelo facturación)
- `IndicadorEconomico` — TRM, IPC, UVT (con lookup por código + fecha más reciente)
- `CodigoAeronautico` — Códigos OACI/IATA por tipo (aerolínea, aeropuerto)
- `ServicioAereo` — Servicios aeroportuarios (Ground Handling, etc.)
- `Secuencia` — Consecutivos automáticos con incremento atómico
- `Mensaje` — Mensajes del sistema (globales o por usuario)
- `TipoEvento` / `Evento` — Catálogo de eventos programados
- `Aplicacion` — Feature toggles (habilita/bloquea módulos)

### PERIODOS (periodos/)
- `Periodo` — Períodos contables (abiertos/cerrados) con validación de fechas
- `PeriodoAeropuerto` — Apertura/cierre de período por aeropuerto
- `DiaAeropuerto` — Días operativos por período y aeropuerto
- `DiaFeriado` — Catálogo de días feriados con verificación

### REPORTES (reportes/)
- `Reporte` — Catálogo de reportes del sistema
- `CategoriaReporte` — Categorías de reportes

### AUDITORIA (pendiente de módulo)
- `BitacoraError` — Log de errores (en schema, sin endpoint aún)
- `AuditoriaOperacion` — Trazabilidad de cambios (en schema, sin endpoint aún)

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
Fase 3: Backend base                     [100%]  ← COMPLETADO (incluye motor cálculo)
Fase 4: Frontend base                    [100%]
Fase 5: Seeds y datos iniciales          [100%]
────────────────────────────────────────
Fase 6: Módulos maestros backend         [100%]  ← COMPLETADO
Fase 7: Módulos transaccionales backend  [30%]   ← CalculosService operacional
Fase 8: CRUDs frontend                   [100%]  ← 43 páginas CRUD completadas
Fase 9: Motor de facturación             [30%]   ← CalculosService (aterrizaje, parqueo, tasas)
Fase 10: Seguridad y calidad             [0%]
Fase 11: Despliegue y CI/CD              [0%]
```

### Módulos backend completados (10 módulos, 71 entidades):
| Módulo | Entidades | Endpoints |
|---|---|---|
| `organizacion` | Pais, Ciudad, Aeropuerto, Zona, ZonaAeropuerto, HorarioAeropuerto | 30 |
| `aerolineas` | Aerolinea, Aeronave, TipoAeronave, Fabricante, ClaseAviacion, PersonalAerolinea, AerolineaConcepto, AerolineaConfig, AerolineaCtaConcepto | 45 |
| `tarifas` | Concepto, GrupoConcepto, TipoOperacion, TarifaOperacion, TarifaAerolinea, Impuesto, TarifaOperacionHistorico | 35 |
| `configuracion` | ParametroSistema, IndicadorEconomico, CodigoAeronautico, ServicioAereo, Secuencia, Mensaje, TipoEvento, Evento, Aplicacion, ConfigTasaAeropuerto | 50 |
| `periodos` | Periodo, PeriodoAeropuerto, DiaAeropuerto, DiaFeriado | 26 |
| `reportes` | Reporte, CategoriaReporte | 10 |
| `operaciones` | Itinerario, Vuelo, PuertaEmbarque, Hangar, ServicioOperacion, RegistroPeso, AsignacionPuertaVuelo, NotaOperacion | 40 |
| `facturacion` | Factura, FacturaDetalle, FacturaPago, FacturaImpuesto, NotaContable, AcuerdoPago, FuenteFacturacion, ConfigFacturacion, MovimientoFacturacion, Folio, FolioDetalle | 55 |
| `seguridad` | Usuario, Perfil, PermisoPerfil, MenuOpcion, SesionUsuario, AccesoAeropuerto, UsuarioCuenta | 35 |
| `liquidaciones` | Liquidacion, ItemLiquidacion, PasajeroNacional, PasajeroInternacional, Tasa, TipoPasajero, ClasePasajero | 35 |

### Observaciones:
- Se eliminó el módulo genérico `maestros/` — cada entidad tiene su módulo dedicado
- Se agregaron 4 modelos nuevos al schema: `AerolineaCtaConcepto`, `TarifaOperacionHistorico`, `ConfigTasaAeropuerto`, y `idAeropuerto` a `Secuencia` (reemplaza MaeConsecutivosBu)
- Schema actualizado a 74 modelos (70 originales + 4 nuevos)
- Cobertura total de maestros legacy verificada: 53/61 migrados, 2 unificados, 6 excluidos justificadamente

### Próximos pasos prioritarios:
1. Completar motor de cálculo con hangar, handling, puente, recargos valle/punta
2. Persistencia de cálculos: `POST /operaciones/guardar-conceptos` (crea MovimientoFacturacion)
3. Integración con facturación: generar factura desde movimientos calculados
4. Dashboard con métricas reales (operaciones hoy, ingresos, etc.)
5. Módulo de reportes (generación PDF/Excel)
6. Multi-tenencia por aeropuerto en todas las queries
7. Hook `usePuertasEmbarque` real (actualmente placeholder en PanelOperaciones)
8. Sesiones de usuario con selección de aeropuerto activo en sidebar

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

*Última actualización: 14 de Junio, 2026 — Sesión 13: Motor de cálculo (CalculosService) + PanelOperaciones conectado + 43/43 CRUDs frontend*
*Mantén este archivo actualizado con cada decisión importante.*
