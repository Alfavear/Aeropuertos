# PROJECT BRAIN — AeroGest (Sistema de Administración Aeroportuaria)

> **Propósito:** Este archivo es el cerebro del proyecto. Cualquier sesión IA debe leerlo primero
> para entender la arquitectura, lógica de negocio, estado actual y lo que falta.
>
> **Regla de oro:** Esto NO es una migración del legacy "Zeus Aeropuertos" (VB6 + SQL Server).
> Es una **reingeniería completa** para el siguiente nivel.

---

## 1. IDENTIDAD

| Atributo | Valor |
|---|---|
| Nombre | AeroGest (tentativo) |
| Qué es | Sistema de administración aeroportuaria para **concesiones multi-aeropuerto** |
| Stack | NestJS 11 + Prisma 6 + PostgreSQL 16 + React 19 + TypeScript 6 + Tailwind v4 |
| Node | `v20.17.0` (restricción: Vite ≤6, Typescript backend 5.7, frontend 6.0) |
| Repo | `https://github.com/Alfavear/Aeropuertos` |
| Root | `D:\Projects\Aeropuertos\zeus-aeropuertos\` |

### 1.1 Lo que NO es

- ❌ NO es "Zeus Aeropuertos 2.0"
- ❌ NO es una migración 1:1 del legacy VB6
- ❌ NO copia formularios VB6 a React (rediseña)
- ❌ NO usa nombres de tablas legacy (`Mae`, `Cls`, `Frm`, `Rpt`, `Infrasa`)
- ❌ NO usa SQL Server (siempre PostgreSQL)
- ❌ NO hereda bugs ni malas prácticas del original

---

## 2. ARQUITECTURA GENERAL

```
Frontend (React 19 + TS + Vite 6)
    ↕ REST API (JSON, JWT Bearer)
Backend (NestJS 11 + TypeScript + Prisma ORM)
    ↕ Prisma Client
PostgreSQL 16
```

### 2.1 Principios

1. **Domain-Driven Design** — Cada módulo NestJS es un dominio de negocio
2. **Clean Architecture** — Controller → Service → Prisma
3. **API First** — Todo expuesto via REST, documentado con Swagger (`@ApiTags`, `@ApiOperation`)
4. **Security by Design** — JWT + Passport + bcrypt + class-validator + Zod
5. **Multi-tenencia** — Cada aeropuerto es una BU (Business Unit), identificado por `idAeropuerto` en queries
6. **Polimorfismo** — Una sola tabla `MovimientoFacturacion` reemplaza 10+ tablas legacy de movimientos

### 2.2 Flujo de request

```
Cliente → Vite Proxy (/api → localhost:3000) → NestJS → JwtAuthGuard → Controller → Service → Prisma → PostgreSQL
                                                                         ↕
                                                              class-validator (DTOs)
                                                                         ↕
                                                              Swagger docs (OpenAPI)
```

---

## 3. ESTRUCTURA DEL PROYECTO

```
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # ESQUEMA MAESTRO — 74 modelos
│   │   └── seed.ts              # Seed data (países, perfiles, admin)
│   ├── src/
│   │   ├── main.ts              # Entry point (CORS, Swagger, ValidationPipe)
│   │   ├── app.module.ts        # Root module (10 módulos)
│   │   ├── prisma/              # PrismaService + PrismaModule (global)
│   │   ├── auth/                # JWT + Passport + multi-aeropuerto
│   │   ├── organizacion/        # 6 entidades: Pais, Ciudad, Aeropuerto, Zona...
│   │   ├── aerolineas/          # 9 entidades: Aerolinea, Aeronave...
│   │   ├── tarifas/             # 7 entidades: Concepto, TarifaOperacion...
│   │   ├── configuracion/       # 10 entidades: ParametroSistema, Indicador...
│   │   ├── periodos/            # 4 entidades: Periodo, DiasFeriados...
│   │   ├── reportes/            # 2 entidades: Reporte, CategoriaReporte
│   │   ├── operaciones/         # 8 entidades + CalculosService
│   │   ├── facturacion/         # 11 entidades + FacturacionEngineService
│   │   ├── seguridad/           # 7 entidades: Usuario, Perfil, Permisos...
│   │   └── liquidaciones/       # 7 entidades: Liquidacion, Tasa, Pasajero...
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Button, Input, Table, Card, Dialog (Radix)
│   │   │   ├── shared/          # PageHeader, DataTable, CrudModal, StatusBadge...
│   │   │   └── layout/          # Sidebar, Header, AppLayout
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Auth
│   │   │   ├── Dashboard.tsx    # Home
│   │   │   ├── SeleccionarAeropuerto.tsx  # Post-login multi-aeropuerto
│   │   │   ├── configuracion/   # 8 páginas
│   │   │   ├── facturacion/     # 5 páginas
│   │   │   ├── liquidaciones/   # 5 páginas
│   │   │   ├── maestros/        # 10 páginas
│   │   │   ├── operaciones/     # 6 páginas (incl. PanelOperaciones)
│   │   │   ├── periodos/        # 2 páginas
│   │   │   ├── seguridad/       # 3 páginas
│   │   │   └── tarifas/         # 6 páginas
│   │   ├── hooks/
│   │   │   ├── useCrud.ts       # Generic React Query CRUD factory
│   │   │   └── modules.ts       # 43 per-entity hooks
│   │   ├── stores/              # Zustand (authStore)
│   │   ├── lib/                 # api.ts (Axios + JWT interceptor)
│   │   └── types/               # 50+ entity interfaces
│   └── package.json
├── docs/
│   ├── PROJECT-BRAIN.md         # ← ESTE ARCHIVO
│   ├── motor-facturacion.md     # Análisis detallado motor facturación legacy
│   ├── analisis-legacy-sql.md   # Inventario completo 744 objetos SQL
│   └── verificacion-maestros.md # Verificación cobertura maestros legacy (100%)
├── bitacora.md                  # Bitácora completa del proyecto
└── AGENTS.md                    # Guía para IAs
```

---

## 4. MÓDULOS BACKEND — MAPA COMPLETO

### 4.1 Resumen

| Módulo | Entidades | Endpoints | Servicios especiales |
|---|---|---|---|
| `organizacion` | 6 | 30 | — |
| `aerolineas` | 9 | 45 | — |
| `tarifas` | 7 | 35 | — |
| `configuracion` | 10 | 50 | — |
| `periodos` | 4 | 26 | — |
| `reportes` | 2 | 10 | — |
| `operaciones` | 8 | 41 | **CalculosService** |
| `facturacion` | 11 | 55 | FacturacionEngineService |
| `seguridad` | 7 | 35 | — |
| `liquidaciones` | 7 | 35 | — |
| **TOTAL** | **71** | **~362** | **2 motores** |

### 4.2 Convenciones de código backend

| Concepto | Regla |
|---|---|
| Archivos | kebab-case: `calculos.service.ts` |
| Clases | PascalCase: `CalculosService` |
| DTOs | `Create{PascalEntidad}Dto`, `Update{PascalEntidad}Dto` |
| Rutas API | plural kebab-case: `/operaciones/calcular-conceptos` |
| Prefijo global | `/api` |
| Autenticación | `@UseGuards(JwtAuthGuard)` en cada controller |
| Validación | `class-validator` + `ValidationPipe` global |
| Documentación | Swagger decorators: `@ApiTags`, `@ApiOperation`, `@ApiQuery` |
| Prisma | Sin `@relation` explícito en la mayoría de modelos (FKs implícitas) |
| Build | `npm run build` (NestJS compiler) |

### 4.3 Patrón CRUD estándar

```typescript
@Controller('entidad')
export class EntidadController {
  constructor(private readonly service: EntidadService) {}

  @Get()        findAll(@Query() query?)  { return this.service.findAll(query) }
  @Get(':id')   findOne(@Param('id', ParseIntPipe) id) { return this.service.findOne(id) }
  @Post()       create(@Body() dto)       { return this.service.create(dto) }
  @Put(':id')   update(@Param('id') id, @Body() dto) { return this.service.update(id, dto) }
  @Delete(':id') remove(@Param('id') id)  { return this.service.remove(id) }
}
```

Cada `findOne` lanza `NotFoundException` si no existe. Cada `create`/`update` valida unicidad y FKs.

---

## 5. MODELO DE DATOS (PRISMA — 74 MODELOS)

### 5.1 Modelos clave para el motor de cálculo

```
TarifaOperacion           → Tarifas por operación + rango de peso
TarifaAerolinea           → Tarifas negociadas por aerolínea (FK: idTarifaOperacion)
TipoOperacion             → Tipo de operación (tipoTarifa: 3=aterrizaje, 4=parqueo, 5=tasa)
Concepto                  → Concepto de facturación (FK: idGrupoConcepto, activo, tipoTarifa)
Aerolinea                 → Aerolínea (horasGraciaParqueo, porRecargoNocturno)
IndicadorEconomico        → TRM, IPC, UVT (lookup por codigo + fecha)
ParametroSistema          → Parámetros de configuración (modulo='Operaciones')
MovimientoFacturacion     → Tabla polimórfica: tipo, idOperacion, idConcepto, valor, facturado
Vuelo                     → Catálogo de vuelos (NO tiene datos operacionales)
Itinerario                → Programación de vuelos (tiene horaVuelo, ejecutado)
```

### 5.2 Nota importante sobre relaciones

La mayoría de modelos **NO tienen decoradores `@relation`** de Prisma. Las FKs existen en BD pero no se pueden usar `include` en queries. En su lugar, se hacen queries separadas y se unen en servicios.

### 5.3 Modelos sin `activo` (no tienen soft-delete)

- `TarifaOperacion` — NO tiene campo activo
- `TipoOperacion` — NO tiene campo activo
- `TarifaAerolinea` — NO tiene campo activo

---

## 6. MOTOR DE CÁLCULO — CalculosService

### 6.1 Archivo

`backend/src/operaciones/calculos.service.ts` (452 líneas)

### 6.2 Endpoint único

| Método | Ruta | Request | Response |
|---|---|---|---|
| `POST` | `/operaciones/calcular-conceptos` | `CalcularConceptosDto` | `ResultadoCalculoDto` |

### 6.3 Fórmulas implementadas

#### Aterrizaje (tipoTarifa = 3)

```
tarifaBase = buscarTarifaAplicable(idTipoOperacion, nacionalidad, peso, aerolinea)
  → lookup en TarifaOperacion por idTipoOperacion + rango de peso
  → si existe TarifaAerolinea negociada, usa ese valor
  → selecciona tarifaKiloLocal (si 'N') o tarifaKiloExtranjero (si 'I')

tarifaIndexada = aplicarIPC ? tarifaBase × (1 + IPC / 100) : tarifaBase
valorBruto = tarifaIndexada × peso
valor = ROUND(valorBruto, redondeoPesos)

Si nacionalidad = 'I':
  Si monedaPago = 1 → valor en USD (tarifaExtranjera)
  Si monedaPago = 0 AND tarifaLocal = 0 → valor = tarifaExtranjera × TRM
  Sino → valor en COP (tarifaLocal)
```

#### Parqueo (tipoTarifa = 4)

```
horasTotales = (horaSalida - horaLlegada) / 3600000
horasFacturables = MAX(0, horasTotales - horasGraciaAerolinea)

tarifaBase = buscarTarifaAplicable(...)  // siempre nacional para parqueo
tarifaBase = aplicarIPC ? tarifaBase × (1 + IPC/100) : tarifaBase

valorBase = tarifaBase × horasFacturables

// Recargo nocturno (18:00-06:00)
Si porRecargoNocturno > 0:
  horasNocturnas = contarHorasNocturnas(llegada, salida)
  recargo = tarifaBase × (porRecargoNocturno / 100) × FLOOR(horasNocturnas)

valorTotal = ROUND(valorBase + recargo, redondeoPesos)
```

#### Tasas (tipoTarifa = 5)

```
tarifaLoc = buscarTarifaAplicable(idTipoOperacion, 'N')  → tarifaKiloLocal
tarifaExt = buscarTarifaAplicable(idTipoOperacion, 'I')  → tarifaKiloExtranjero

// Nacionales
valorCOP = tarifaLoc × totalPaganTasa

// Internacionales
Si paxPesos > 0: valorCOP += FnCalcTarifLocalForInt(tarifaLoc, tarifaExt, TRM, monedaPago) × paxPesos
Si paxUSD > 0:   valorUSD += tarifaExt × paxDolares
```

#### Servicio

```
valor = valorUnitarioConcepto × cantidad
```

### 6.4 Helpers

| Función | Equivalente legacy | Descripción |
|---|---|---|
| `buscarTarifaAplicable()` | `FnGetTarifaIndexada` | Lookup tarifa por tipo operación + rango peso + negociación aerolínea |
| `aplicarIndexacion()` | — | Multiplica tarifa por factor IPC |
| `fnCalcTarifLocalForInt()` | `FnCalcTarifLocalForInt` | Conversión COP/USD para tráfico internacional |
| `calcularHorasNocturnas()` | (parte de parqueo) | Cuenta horas entre 18:00-06:00 |
| `redondear()` | ROUND de SQL | Redondeo a N decimales |

### 6.5 Parámetros del sistema usados

| Código | Default | Uso |
|---|---|---|
| `REDONDEO_PESOS` | 0 | Decimales para redondeo de valores |
| `CALC_NAL_FROM_INT_IF_ZERO` | 1 | Si tarifaLocal=0, calcular desde tarifaExt×TRM |
| `APLICAR_IPC_TARIFAS` | 0 | Habilita indexación por IPC |

### 6.6 Pendiente (próximas implementaciones)

- [ ] **Hangar:** similar a parqueo pero con `Hangar.horasGracia` y `Hangar.genRecNoc`
- [ ] **Handling / Puente:** lookup directo en `ServicioAereo` o `Concepto.valorUnitario`
- [ ] **Recargos valle/punta:** usar `AerolineaConfig.horaValleIni/Fin` y `aplicaDescHV`
- [ ] **Horas de gracia configurables:** por tipo de operación, no solo por aerolínea
- [ ] **Persistencia:** endpoint `POST /guardar-conceptos` que cree registros en `MovimientoFacturacion`
- [ ] **Facturación automática:** endpoint que genere `Factura` + `FacturaDetalle` desde movimientos

---

## 7. FRONTEND — ESTRUCTURA Y PARADIGMA

### 7.1 Stack exacto

- React 19.2.6 + TypeScript 6.0.2 + Vite 6.4.3
- Tailwind CSS 4.3.1 (sin `tailwind.config.js`, CSS-only)
- React Router 7 (lazy-loaded routes con `React.lazy` + `Suspense`)
- Zustand (authStore: token, user, aeropuertoActivo)
- React Query/TanStack Query (@tanstack/react-query)
- Axios (instancia con interceptor JWT en `lib/api.ts`)
- React Hook Form + Zod (validación de formularios)
- lucide-react (íconos)
- clsx + tailwind-merge (class utilities)

### 7.2 Patrón de página CRUD

Cada página CRUD sigue esta estructura (ej: `Paises.tsx`):

```typescript
export default function Paises() {
  const query = usePaises().useList(filter)    // React Query
  const create = usePaises().useCreate()        // useMutation
  const update = usePaises().useUpdate()
  const remove = usePaises().useRemove()

  const form = useForm<Schema>({ resolver: zodResolver(schema) })

  return (
    <ModuleLayout ...>
      <PageHeader title="..." subtitle="..." />
      <DataTable columns={...} data={...} searchKeys={...} onRowClick={...} />
      <CrudModal open={...} onSubmit={form.handleSubmit(handleSubmit)}>
        <Controller name="..." control={form.control} render={...} />
      </CrudModal>
      <ConfirmDialog open={...} onConfirm={handleDelete} />
    </ModuleLayout>
  )
}
```

### 7.3 Hook genérico useCrud

`hooks/useCrud.ts` — fábrica que crea hooks CRUD tipados:

```typescript
function useCrud<T>(basePath: string) {
  return {
    useList: (filters?) => useQuery({ queryKey: [basePath, filters], queryFn: () => api.get(basePath, { params: filters }).then(r => r.data) }),
    useCreate: () => useMutation({ mutationFn: (data) => api.post(basePath, data) }),
    useUpdate: () => useMutation({ mutationFn: ({ id, data }) => api.put(`${basePath}/${id}`, data) }),
    useRemove: () => useMutation({ mutationFn: (id) => api.delete(`${basePath}/${id}`) }),
  }
}
```

### 7.4 Módulos de hooks

`hooks/modules.ts` — 43 hooks per-entity, ej:

```typescript
export const usePaises = () => useCrud<Pais>('api/v1/organizacion/paises')
export const useVuelos = () => useCrud<Vuelo>('api/v1/operaciones/vuelos')
export const useMovimientosFacturacion = () => useCrud<MovimientoFacturacion>('api/v1/facturacion/movimientos-facturacion')
```

### 7.5 Componentes compartidos (9)

| Componente | Props clave | Uso |
|---|---|---|
| `PageHeader` | title, subtitle, actions | Encabezado de página |
| `DataTable` | columns, data, searchKeys, onRowClick | Grid con search + sort |
| `CrudModal` | open, title, onSubmit, size, loading | Modal de formulario |
| `ConfirmDialog` | open, title, message, onConfirm | Diálogo de confirmación |
| `StatusBadge` | variant, label | Badge de estado (active/warning/success/error) |
| `SearchInput` | value, onChange, placeholder | Input de búsqueda |
| `ToggleSwitch` | checked, onChange | Switch on/off |
| `EmptyState` | title, description, icon | Estado vacío |
| `ModuleLayout` | children | Layout con padding consistente |

### 7.6 Tipos (50+ interfaces en `types/index.ts`)

Todas las entidades tienen interfaz TypeScript. Las más importantes:

```typescript
Vuelo               { id, codigo, idAerolinea, origen, destino, fecha, estado, horaLlegada, horaSalida }
MovimientoFacturacion { id, tipo, idOperacion, idConcepto, valor, tarifa, cantidad, facturado, idFactura }
OperacionPanel      { id, codigo, aerolineaNombre, origen, destino, estado, horaLlegada, horaSalida, tieneEntrada, tieneSalida }
ConceptoCosto       { id, concepto, tipo, valorCOP, valorUSD, estado }
CalcularConceptosRequest { idAerolinea, idAeropuerto, fecha, nacionalidad, peso, conceptos[] }
ResultadoCalculo    { exito, conceptos[], totalCOP, totalUSD }
```

### 7.7 Auth flow

```
Login → POST /auth/login → JWT token → authStore.setToken()
  → GET /auth/mis-aeropuertos → si > 1: SeleccionarAeropuerto
  → POST /auth/seleccionar-aeropuerto → nuevo JWT con aeropuertoActivo
  → Dashboard (Home)
```

El interceptor de Axios (lib/api.ts) añade:
- `Authorization: Bearer {token}`
- `X-Aeropuerto-Activo: {idAeropuerto}`

### 7.8 Páginas CRUD completadas (43)

Todas en `frontend/src/pages/`:
- **maestros/ (10):** Paises, Ciudades, Zonas, Aeropuertos, Aerolineas, Aviones, Fabricantes, TiposAeronave, ClasesAviacion, PersonalAerolinea
- **tarifas/ (6):** Conceptos, GruposConcepto, TiposOperacion, TarifasOperacion, TarifasAerolinea, Impuestos
- **operaciones/ (6):** Vuelos, Itinerarios, PuertasEmbarque, Hangares, ServiciosOperacion, **PanelOperaciones** (custom)
- **configuracion/ (8):** Parametros, IndicadoresEconomicos, CodigosAeronauticos, ServiciosAereos, Secuencias, Mensajes, Eventos, Aplicaciones
- **facturacion/ (5):** Facturas, NotasContables, AcuerdosPago, FuentesFacturacion, ConfigFacturacion
- **liquidaciones/ (5):** Liquidaciones, TasasAeroportuarias, Pasajeros, TiposPasajero, ClasesPasajero
- **seguridad/ (3):** Usuarios, Perfiles, MenuOpciones
- **periodos/ (2):** Periodos, DiasFeriados
- **+2 páginas base:** Login, Dashboard, SeleccionarAeropuerto

---

## 8. PANEL CENTRAL DE OPERACIONES (PanelOperaciones.tsx)

### 8.1 Propósito

Reemplazo moderno del formulario legacy `FrmMagnaInfrasas.frm` (~5800 líneas VB6). Es el centro de comando para operaciones aeroportuarias: registrar llegadas/salidas, calcular tarifas, gestionar parqueo y tasas.

### 8.2 Anatomía

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader: "Panel Central de Operaciones"               │
├─────────────────────────────────────────────────────────┤
│ Filtros: [Fecha █] [Aeropuerto █] [Aerolínea █] [Buscar]│
├─────────────────────────────────────────────────────────┤
│ [✈ Entrada] [✈ Salida] [🏭 Parqueo] [🎫 Tasas] [💰 Fac]│
├─────────────────────────────────────────────────────────┤
│ DataTable: Vuelo | Aerolínea | Matrícula | Origen | ... │
│ (click en fila → activa tabs de detalle)                │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Detalle General] [Parqueo y Tasas] [Costo Op.]   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Tab content según selección                         │ │
│ │ - Tab 0: info llegada/salida/pasajeros              │ │
│ │ - Tab 1: grillas parqueo + tasas                    │ │
│ │ - Tab 2: costos calculados + traza fórmula          │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 8.3 Modales (4, con Zod validation)

| Modal | Campos | Llama a |
|---|---|---|
| Entry | aerolínea, aeronave, origen, destino, fecha, hora, matrícula, peso | `POST /operaciones/calcular-conceptos` con `['ATERRIZAJE']` |
| Exit | horaSalida, destino, peso | `POST /operaciones/calcular-conceptos` con `['PARQUEO']` |
| Parking | posición, horaIni, horaFin | `POST /operaciones/calcular-conceptos` con `['PARQUEO']` |
| Tasas | nacional, internacionalUSD, internacionalCOP, exentos, tránsito | `POST /operaciones/calcular-conceptos` con `['TASA']` |

### 8.4 Limitaciones conocidas

- El modelo `Vuelo` en backend es solo un catálogo (no tiene `horaLlegada`, `horaSalida`, `estado` reales). El panel usa una versión "virtual" enriquecida en frontend.
- No existe entidad `Operacion` en Prisma — los datos de la operación (aterrizaje/despegue) se manejan provisionalmente en frontend.
- `usePuertasEmbarque` es un placeholder que usa `useVuelos()` (no hay hook dedicado).

---

## 9. ESTADO DEL PROYECTO

### 9.1 Porcentaje por fase

```
Fase 0: Análisis y dimensionamiento     [100%]
Fase 1: Diseño arquitectónico            [100%]
Fase 2: Modelado de datos (schema)       [100%]
Fase 3: Backend base + cálculo           [100%]  ← COMPLETADO
Fase 4: Frontend CRUD + páginas custom   [100%]  ← 43 páginas + Panel + Dashboard
Fase 5: Seeds y datos iniciales          [100%]
Fase 6: Módulos maestros backend         [100%]
Fase 7: Módulos transaccionales backend  [30%]   ← CalculosService + FacturacionEngineService básicos
Fase 8: CRUDs frontend                   [100%]  ← 43 páginas
Fase 9: Motor de facturación             [30%]   ← CalculosService (aterrizaje, parqueo, tasas, servicio)
Fase 10: Seguridad y calidad             [0%]
Fase 11: Despliegue y CI/CD              [0%]
```

### 9.2 Archivos clave que NO deben modificarse sin autorización

- `backend/src/main.ts` — Entry point global
- `backend/src/app.module.ts` — Root module (importa módulos)
- `backend/prisma/schema.prisma` — Solo agregar modelos, no eliminar
- `frontend/vite.config.ts` — Proxy y build config
- `frontend/src/main.tsx` — Entry point React
- `AGENTS.md` — Guía IA del proyecto
- `bitacora.md` — Bitácora del proyecto

### 9.3 Builds

| Componente | Comando | Resultado |
|---|---|---|
| Backend | `npm run build` (nest build) | 0 errores |
| Frontend | `npx vite build` | ~67 chunks, 0 errores |

---

## 10. PRÓXIMOS PASOS (Priorizados)

### 10.1 Corto plazo (Alta prioridad)

1. **Persistencia de cálculos:** Endpoint `POST /operaciones/guardar-conceptos` que reciba un array de conceptos calculados y cree registros en `MovimientoFacturacion`
2. **Integración facturación:** Endpoint que, desde una lista de movimientos, genere `Factura` + `FacturaDetalle` con secuencias, fuentes, impuestos
3. **Hook real `usePuertasEmbarque`:** Actualmente placeholder (usa `useVuelos()` en lugar de `useCrud<PuertaEmbarque>`)
4. **Cálculo de hangar:** Similar a parqueo pero usando config de `Hangar` (horasGracia, genRecNoc)

### 10.2 Mediano plazo

5. **Recargos valle/punta:** Implementar descuento por hora valle desde `AerolineaConfig`
6. **Dashboard real:** Endpoint de métricas (operaciones hoy, ingresos del día, vuelos por estado) y frontend con gráficos
7. **Módulo de reportes:** Generación PDF/Excel con plantillas
8. **Multi-tenencia en queries:** Asegurar que todos los endpoints filtren por `idAeropuerto` del header `X-Aeropuerto-Activo`

### 10.3 Largo plazo

9. **Pruebas unitarias:** Jest backend + Vitest frontend + Testing Library
10. **Rate limiting:** NestJS throttler module
11. **Auditoría de cambios:** Trigger Prisma para `AuditoriaOperacion`
12. **CI/CD:** GitHub Actions + Docker Compose
13. **Cache Redis:** Para catálogos de baja frecuencia de cambio
14. **Facturación electrónica:** Integración con DIAN (Colombia)

---

## 11. CONCEPTOS DE NEGOCIO CLAVE

| Término | Significado |
|---|---|
| **Concesión aeroportuaria** | Empresa que administra uno o varios aeropuertos por concesión del estado |
| **BU** (Business Unit) | Unidad de negocio — cada aeropuerto es una BU independiente |
| **Liquidación** | Proceso de conteo de pasajeros para cobro de tasas aeroportuarias (antes "Infrasa") |
| **Tasa aeroportuaria (TUA)** | Cargo que paga cada pasajero por uso del aeropuerto |
| **Itinerario** | Programación de vuelos (frecuencias diarias/semanales) |
| **Movimiento facturación** | Registro atómico de un cargo (aterrizaje, parqueo, hangar, etc.) |
| **TRM** | Tasa Representativa del Mercado (tipo de cambio COP/USD) |
| **Horas de gracia** | Tiempo sin cobro antes de iniciar la tarifa de parqueo/hangar |
| **Recargo nocturno** | Porcentaje adicional por operaciones en horario nocturno (18:00-06:00) |
| **Hora valle** | Período con tarifa reducida por baja demanda |
| **Indexación IPC** | Ajuste de tarifas según Índice de Precios al Consumidor |

---

## 12. DOCUMENTACIÓN RELACIONADA

| Archivo | Contenido |
|---|---|
| `AGENTS.md` | Guía IA con convenciones, stack, estructura, reglas críticas |
| `bitacora.md` | Bitácora histórica del proyecto (fases, sesiones) |
| `docs/motor-facturacion.md` | Análisis profundo del motor de facturación legacy (315 líneas) |
| `docs/analisis-legacy-sql.md` | Inventario completo de 744 objetos SQL legacy |
| `docs/verificacion-maestros.md` | Verificación de cobertura de maestros legacy (100%) |
| `frontend/FRONTEND-BRAIN.md` | Documentación específica del frontend (1127 líneas) |
| `.opencode/prompt-reinicio.md` | Prompt de reinicio para nueva sesión IA |
| `.opencode/agents/aerogest-backend.md` | Agente IA especializado en backend |

---

## 13. COMANDOS ÚTILES

```bash
# Backend
cd backend
npm run build                # Compilar NestJS
npx prisma generate          # Regenerar cliente Prisma
npx prisma db push           # Sincronizar schema con BD (dev)
npx prisma studio            # UI de BD

# Frontend
cd frontend
npx vite build               # Build producción
npx vite                     # Dev server (puerto 5173, proxy /api → 3000)

# Ambos
cd backend && npm run build  # Verificar backend
cd frontend && npx vite build # Verificar frontend
```

---

*Última actualización: 14 de Junio, 2026 — Sesión 13*
*Creado para que cualquier IA retome el proyecto instantáneamente.*
