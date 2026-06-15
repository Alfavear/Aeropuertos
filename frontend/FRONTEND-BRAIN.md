# FRONTEND BRAIN — Sistema de Administración Aeroportuaria

> **Propósito:** Este archivo es mi cerebro. Contiene TODO lo que sé sobre la arquitectura frontend,
> paradigmas, diseño de componentes, patrones de páginas y plan de implementación.
> Lo consulto antes de cada decisión para mantener consistencia.

---

## 1. IDENTIDAD DEL PROYECTO

| Concepto | Valor |
|---|---|
| **Nombre** | AeroGest (tentativo) |
| **Qué es** | Sistema de administración aeroportuaria para concesiones multi-aeropuerto |
| **Stack** | React 19 + TypeScript 6 + Vite 6 + Tailwind CSS v4 |
| **Backend** | NestJS 11 + Prisma ORM 6 + PostgreSQL 16 (otra instancia de IA) |
| **API** | REST (`/api/v1/...`) con JWT Bearer |
| **Estado frontend** | Fase 8 (~25% — CRUDs básicos funcionando con mock data) |

### Stack tecnológico exacto (Node v20.17.0)

```
react@^19.2.6          → UI runtime
react-dom@^19.2.6       → DOM rendering
react-router-dom@^7.17.0 → Routing SPA
react-hook-form@^7.79.0 → Formularios
@hookform/resolvers@^5.4.0 → Bridge Zod <-> RHF
zod@^4.4.3              → Validación esquemas
zustand@^5.0.14         → Estado global liviano
@tanstack/react-query@^5.101.0 → Server state/caching
axios@^1.18.0           → HTTP client
lucide-react@^1.18.0    → Iconos (única librería permitida)
tailwindcss@^4.3.1      → CSS utility-first (v4, SIN config JS)
@tailwindcss/vite@^4.3.1 → Plugin Vite para Tailwind v4
class-variance-authority@^0.7.1 → Variantes de componentes
clsx@^2.1.1             → Clases condicionales
tailwind-merge@^3.6.0   → Merge inteligente de Tailwind
vite@^6.4.3             → Bundler (NO Vite 8)
typescript@~6.0.2       → Lenguaje
```

---

## 2. ARQUITECTURA FRONTEND

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Primitive atoms (Button, Input, Card, Table, Dialog)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   └── dialog.tsx
│   │   ├── layout/          # App shell
│   │   │   ├── AppLayout.tsx (Sidebar + Header + <Outlet/>)
│   │   │   ├── Sidebar.tsx  (NavLinks + Logout)
│   │   │   └── Header.tsx   (User info + title)
│   │   └── shared/          # 🆕 Moleculas/organismos reutilizables
│   │       ├── SearchInput.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── ToggleSwitch.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmptyState.tsx
│   │       ├── PageHeader.tsx
│   │       ├── DataTable.tsx     # 🆕 Generic table with search/sort/pagination
│   │       ├── CrudModal.tsx     # 🆕 Generic CRUD form dialog
│   │       └── ModuleLayout.tsx  # 🆕 Sidebar + content (para config)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── modules/              # CRUD pages grouped by domain
│   │   │   ├── organizacion/     # 🆕 Paises, Ciudades, Zonas
│   │   │   ├── aerolineas/       # 🆕 Fabricantes, Personal, Config
│   │   │   ├── operaciones/      # 🆕 Puertas, Hangares, Itinerarios
│   │   │   ├── tarifas/          # 🆕 Grupos, Tarifas, Impuestos
│   │   │   ├── facturacion/      # 🆕 Facturas, Notas, Pagos
│   │   │   ├── liquidaciones/    # 🆕 Tasas, Pasajeros
│   │   │   ├── seguridad/        # 🆕 Usuarios, Perfiles, Permisos
│   │   │   └── periodos/         # 🆕 Periodos, Dias Feriados
│   │   └── configuracion/
│   │       ├── Parametros.tsx     # ✅ EXISTE (Panel completo)
│   │       └── ...               # 🆕 Indicadores, Secuencias, Codigos
│   ├── stores/                    # Zustand stores
│   │   ├── authStore.ts           # ✅ EXISTE
│   │   └── ...                    # 🆕 uiStore (sidebar, theme)
│   ├── hooks/                     # 🆕 Custom hooks
│   │   ├── useCrud.ts             # 🆕 Generic CRUD hook (list/create/update/delete)
│   │   └── useParametros.ts       # 🆕 Hook específico
│   ├── services/                  # 🆕 API service layer
│   │   ├── api.ts                 # ✅ EXISTE (Axios instance)
│   │   └── modules/               # 🆕 One file per module
│   │       ├── organizacion.service.ts
│   │       ├── aerolineas.service.ts
│   │       └── ...
│   ├── lib/
│   │   ├── utils.ts               # ✅ EXISTE (cn())
│   │   └── constants.ts           # 🆕 Constantes globales
│   ├── types/
│   │   └── index.ts               # ✅ EXISTE (expandir)
│   └── assets/
│       ├── hero.png
│       └── ...
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── eslint.config.js
```

**Leyenda:** ✅ EXISTE | 🆕 Por crear

---

## 3. DISEÑO — PARADIGMAS VISUALES

### 3.1 Sistema de diseño

| Token | Valor | Uso |
|---|---|---|
| `bg-gray-900` | Sidebar fondo oscuro | Navegación principal |
| `bg-white` | Cards, modales, fondos de contenido | Contenedores |
| `bg-slate-50` | Background de página | `/pages/modules/*.tsx` |
| `indigo-600` | Color primario (acciones, active states) | Botones, links activos, badges |
| `emerald-500/600` | Color éxito (activo, habilitado) | Status badges, toggles ON |
| `rose-500/600` | Color error/peligro | Errores, delete, inactivo |
| `amber-50/100` | Color advertencia | Alertas, opciones especiales |
| `slate-400/500` | Texto secundario/placeholder | Descripciones, hints |
| `slate-700/800/900` | Texto principal | Títulos, labels, celdas |
| `font-mono` | Códigos técnicos (OACI, IATA, códigos) | Badges de código |
| `shadow-sm` | Sombras sutiles | Cards, tablas, modales |

### 3.2 Layout estándar

```
┌──────────────────────────────────────────────┐
│ Sidebar (w-64, bg-gray-900)  │  Header (h-16, bg-white)       │
│                              │  "Panel de Control" | [User]   │
│  [Logo] AeroGest            ├─────────────────────────────────┤
│                              │  Main Content (overflow-y-auto) │
│  ● Dashboard                 │  p-6                            │
│  ● Aeropuertos               │                                │
│  ● Aerolíneas                │  [Page content here]           │
│  ● Aviones                   │                                │
│  ● Conceptos                 │                                │
│                              │                                │
│  ─────────────────────       │                                │
│  Cerrar sesión               │                                │
└──────────────────────────────┴─────────────────────────────────┘
```

### 3.3 Patrón de página CRUD estándar

Cada página de módulo sigue esta estructura:

```
┌─────────────────────────────────────────────────┐
│ PageHeader                                       │
│  Título                          [Botón Acción]  │
│  Subtítulo descriptivo                           │
├─────────────────────────────────────────────────┤
│ Card                                             │
│  CardHeader                                      │
│    SearchInput (w-full max-w-md)                 │
│  CardContent (p-0)                               │
│    Table                                         │
│      HeaderRow (bg-slate-50)                     │
│      DataRows (hover:bg-slate-50/80)             │
│        [Código badge] | Nombre | ... | Acciones   │
│      EmptyState (cuando no hay resultados)        │
│  CardFooter (opcional, paginación)               │
└─────────────────────────────────────────────────┘
│ Modal (Dialog) para Create/Edit                  │
│  Wizard tabs si aplica                           │
│  React Hook Form + Zod validation                │
│  Footer: [Cancelar] [Guardar]                    │
└─────────────────────────────────────────────────┘
```

### 3.4 Patrón de página Configuración (ej: Parametros.tsx)

```
┌──────────────────────────────────────────────────┐
│ Sidebar (w-64)           │ Main Content           │
│  "Configuración"         │                        │
│  Variables de entorno    │ Header: Search + Actions│
│                          │                        │
│  ● Todos los Parámetros  │ Cards grid (2 cols)    │
│  ● Módulo General        │  ┌──────┐ ┌──────┐    │
│  ● Módulo Operaciones    │  │ Card │ │ Card │    │
│  ● Módulo Aerolíneas     │  └──────┘ └──────┘    │
│  ● Módulo Facturación    │  ┌──────┐ ┌──────┐    │
│  ● Módulo Seguridad      │  │ Card │ │ Card │    │
│                          │  └──────┘ └──────┘    │
└──────────────────────────────────────────────────┘
```

---

## 4. CATÁLOGO DE COMPONENTES UI

### 4.1 `Button`

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Crear</Button>           // bg-indigo-600
<Button variant="outline">Cancelar</Button>        // border + ghost
<Button variant="destructive">Eliminar</Button>    // bg-red-600
<Button variant="ghost" size="icon"><Pencil/></Button>  // icon only
<Button variant="secondary">Filtrar</Button>
<Button variant="link">Ver más</Button>
```

| Variant | Propósito |
|---|---|
| `default` | Acción principal (crear, guardar, enviar) |
| `outline` | Acción secundaria (cancelar, cerrar) |
| `destructive` | Acción destructiva (eliminar, desactivar) |
| `ghost` | Botones de tabla (editar, ver) |
| `secondary` | Acciones alternas |
| `link` | Navegación inline |

### 4.2 `Input`

```tsx
<Input placeholder="Buscar..." className="pl-9" />  // Search con icono
<Input type="number" className="w-32 font-mono" /> // Numérico
<Input type="time" className="font-mono" />        // Hora
<Input className="font-mono uppercase" />           // Códigos
```

### 4.3 `Card`

```tsx
<Card className="border-slate-200 shadow-sm">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent className="p-0"> // para tablas
    ...
  </CardContent>
  <CardFooter>
    ...
  </CardFooter>
</Card>
```

### 4.4 `Dialog`

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Crear X</DialogTitle>
    </DialogHeader>
    <form onSubmit={...}>
      ...fields...
      <DialogFooter>
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

| Clase | Propósito |
|---|---|
| `sm:max-w-[500px]` | Form simple |
| `sm:max-w-[600px]` | Form con tabs/wizard |
| `sm:max-w-[800px]` | Form grande |

### 4.5 `Table`

```tsx
<Table>
  <TableHeader className="bg-slate-50">
    <TableRow>
      <TableHead className="font-semibold text-slate-700">Columna</TableHead>
      <TableHead className="text-right">Acciones</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="group transition-colors hover:bg-slate-50/80">
      <TableCell>Valor</TableCell>
      <TableCell className="text-right opacity-0 group-hover:opacity-100">
        <Button variant="ghost" size="icon"><Pencil/></Button>
        <Button variant="ghost" size="icon" className="hover:text-rose-600"><Trash2/></Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Convenciones de tabla:**
- `TableHeader` en `bg-slate-50` con `font-semibold`
- Acciones visibles SOLO en hover (`opacity-0 group-hover:opacity-100`)
- Badge de código en `font-mono` con `bg-indigo-50 text-indigo-600`
- Status badge con variante `emerald` (activo) / `rose` (inactivo)
- Row vacío: icono grande + mensaje + `EmptyState`

---

## 5. PATRONES DE ESTADO Y DATOS

### 5.1 Estado global (Zustand)

Solo para estado **global síncrono**:
- `authStore` — ✅ user + token + login/logout
- `uiStore` — 🆕 sidebarCollapsed, theme

### 5.2 Server state (React Query)

Para datos **asíncronos del servidor**:
```tsx
// Ejemplo de hook para CRUD
export function usePaises() {
  return useQuery({
    queryKey: ['paises'],
    queryFn: () => api.get('/api/v1/paises').then(r => r.data),
  })
}

export function useCreatePais() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/api/v1/paises', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paises'] }),
  })
}
```

### 5.3 Servicios API

Cada módulo tiene su archivo de servicio en `services/modules/`:
```ts
// services/modules/organizacion.service.ts
import api from '@/lib/api'

export const paisService = {
  list: (params?) => api.get('/api/v1/paises', { params }),
  getById: (id: number) => api.get(`/api/v1/paises/${id}`),
  create: (data) => api.post('/api/v1/paises', data),
  update: (id: number, data) => api.put(`/api/v1/paises/${id}`, data),
  delete: (id: number) => api.delete(`/api/v1/paises/${id}`),
}
```

---

## 6. PATRONES DE FORMULARIO

### 6.1 Schema con Zod

```ts
const schema = z.object({
  codigo: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[A-Z0-9_]+$/, 'Solo mayúsculas'),
  nombre: z.string().min(1, 'Requerido'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>
```

### 6.2 Hook estandarizado

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: editing ?? { activo: true, ... },
})

const { register, handleSubmit, control, watch, reset, formState: { errors } } = form
```

### 6.3 Patrón Toggle Switch (checkbox custom)

```tsx
<Controller
  name="activo"
  control={control}
  render={({ field }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <input type="checkbox" className="hidden" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
      <span className="text-sm font-medium text-slate-700">Activo</span>
    </label>
  )}
/>
```

### 6.4 Patrón Select nativo

```tsx
<select {...register('tipo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
  <option value="">Seleccionar...</option>
  <option value="A">Opción A</option>
  <option value="B">Opción B</option>
</select>
```

### 6.5 Wizard / Tabs en modal

```tsx
const [activeTab, setActiveTab] = useState<'general' | 'detalle'>('general')

// En el modal:
<div className="flex border-b border-slate-200 px-6 bg-white">
  <button onClick={() => setActiveTab('general')}
    className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
    General
  </button>
  <button onClick={() => setActiveTab('detalle')}
    className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'detalle' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
    Detalle
  </button>
</div>
```

---

## 7. RUTAS COMPLETAS DEL SISTEMA

```
/login                              → Login.tsx
/                                   → Dashboard.tsx (index)

# ORGANIZACION
/maestros/paises                    → Paises.tsx
/maestros/ciudades                  → Ciudades.tsx
/maestros/aeropuertos               → Aeropuertos.tsx ✅
/maestros/zonas                     → Zonas.tsx

# AEROLINEAS
/maestros/aerolineas                → Aerolineas.tsx ✅
/maestros/aeronaves                 → Aviones.tsx ✅
/maestros/tipos-aeronave            → TiposAeronave.tsx
/maestros/fabricantes               → Fabricantes.tsx
/maestros/clases-aviacion           → ClasesAviacion.tsx
/maestros/personal-aerolinea        → PersonalAerolinea.tsx

# OPERACIONES
/operaciones/itinerarios            → Itinerarios.tsx
/operaciones/vuelos                 → Vuelos.tsx
/operaciones/puertas-embarque       → PuertasEmbarque.tsx
/operaciones/hangares               → Hangares.tsx
/operaciones/servicios              → ServiciosOperacion.tsx

# TARIFAS
/tarifas/conceptos                  → Conceptos.tsx ✅ (pasar a /tarifas/)
/tarifas/grupos                     → GruposConcepto.tsx
/tarifas/tipos-operacion            → TiposOperacion.tsx
/tarifas/tarifas-operacion          → TarifasOperacion.tsx
/tarifas/tarifas-aerolinea          → TarifasAerolinea.tsx
/tarifas/impuestos                  → Impuestos.tsx

# FACTURACION
/facturacion/facturas              → Facturas.tsx
/facturacion/notas-contables        → NotasContables.tsx
/facturacion/acuerdos-pago          → AcuerdosPago.tsx
/facturacion/fuentes                → FuentesFacturacion.tsx
/facturacion/configuracion          → ConfigFacturacion.tsx

# LIQUIDACIONES
/liquidaciones/liquidaciones       → Liquidaciones.tsx
/liquidaciones/tasas                → TasasAeroportuarias.tsx
/liquidaciones/pasajeros            → Pasajeros.tsx

# SEGURIDAD
/seguridad/usuarios                 → Usuarios.tsx
/seguridad/perfiles                 → Perfiles.tsx
/seguridad/menu                     → MenuOpciones.tsx

# PERIODOS
/periodos/periodos                  → Periodos.tsx
/periodos/dias-feriados             → DiasFeriados.tsx

# CONFIGURACION
/configuracion/parametros           → Parametros.tsx ✅
/configuracion/indicadores          → IndicadoresEconomicos.tsx
/configuracion/secuencias           → Secuencias.tsx
/configuracion/codigos-aeronauticos → CodigosAeronauticos.tsx
/configuracion/servicios-aereos     → ServiciosAereos.tsx
/configuracion/mensajes             → Mensajes.tsx
/configuracion/eventos              → Eventos.tsx
/configuracion/aplicaciones         → Aplicaciones.tsx
```

---

## 8. PLAN DE IMPLEMENTACIÓN — FASES

### Fase 8A — Shared components (ahora)
| Componente | Prioridad | Descripción |
|---|---|---|
| `SearchInput` | 🔴 Alta | Input con icono de search + debounce |
| `StatusBadge` | 🔴 Alta | Badge reutilizable (activo/inactivo) con colores |
| `ToggleSwitch` | 🔴 Alta | Toggle custom reutilizable con Controller |
| `ConfirmDialog` | 🔴 Alta | Diálogo de confirmación para eliminar |
| `EmptyState` | 🔴 Alta | Estado vacío con icono + mensaje |
| `PageHeader` | 🔴 Alta | Header de página con título + botón acción |
| `DataTable` | 🟡 Media | Tabla genérica con sort/paginación |
| `CrudModal` | 🟡 Media | Modal genérico para crear/editar |
| `ModuleLayout` | 🟢 Baja | Layout con sidebar para config pages |

### Fase 8B — CRUDs faltantes (inmediato)
| Página | Módulo | Tipo | Depende de |
|---|---|---|---|
| `Paises.tsx` | Organización | Simple | — |
| `Ciudades.tsx` | Organización | Simple (FK País) | Paises |
| `Zonas.tsx` | Organización | Simple | — |
| `TiposAeronave.tsx` | Aerolíneas | Simple | — |
| `Fabricantes.tsx` | Aerolíneas | Simple | — |
| `ClasesAviacion.tsx` | Aerolíneas | Simple | — |
| `PersonalAerolinea.tsx` | Aerolíneas | Media (FK Aerolínea) | Aerolíneas |
| `PuertasEmbarque.tsx` | Operaciones | Simple | Aeropuertos |
| `Hangares.tsx` | Operaciones | Simple | Aeropuertos |
| `TiposOperacion.tsx` | Tarifas | Simple | — |
| `GruposConcepto.tsx` | Tarifas | Simple | — |
| `Impuestos.tsx` | Tarifas | Simple | — |
| `IndicadoresEconomicos.tsx` | Configuración | Simple | — |
| `Secuencias.tsx` | Configuración | Simple | — |
| `CodigosAeronauticos.tsx` | Configuración | Simple | — |
| `ServiciosAereos.tsx` | Configuración | Simple | — |
| `Mensajes.tsx` | Configuración | Media | — |
| `TiposPasajero.tsx` | Liquidaciones | Simple | — |
| `ClasesPasajero.tsx` | Liquidaciones | Simple | — |

### Fase 8C — CRUDs complejos
| Página | Módulo | Complejidad | Razón |
|---|---|---|---|
| `Itinerarios.tsx` | Operaciones | 🔴 Alta | FK múltiples + fechas |
| `Vuelos.tsx` | Operaciones | 🔴 Alta | FK Itinerario + estados |
| `AerolineaConceptos.tsx` | Aerolíneas | 🟡 Media | Tabla asignación |
| `AerolineaConfig.tsx` | Aerolíneas | 🟡 Media | Config por aerolínea+aeropuerto |
| `TarifasOperacion.tsx` | Tarifas | 🔴 Alta | Rangos de peso + tarifas |
| `TarifasAerolinea.tsx` | Tarifas | 🟡 Media | Tarifas negociadas |
| `ConfigTasaAeropuerto.tsx` | Configuración | 🟡 Media | Config por aeropuerto |
| `Eventos.tsx` | Configuración | 🟡 Media | FK TipoEvento |

### Fase 8D — CRUDs transaccionales
| Página | Módulo | Prioridad |
|---|---|---|
| `Facturas.tsx` | Facturación | 🔴 Alta (Fase 9) |
| `NotasContables.tsx` | Facturación | 🟡 Media |
| `AcuerdosPago.tsx` | Facturación | 🟡 Media |
| `Liquidaciones.tsx` | Liquidaciones | 🔴 Alta |
| `Pasajeros.tsx` | Liquidaciones | 🔴 Alta |
| `Usuarios.tsx` | Seguridad | 🔴 Alta |
| `Perfiles.tsx` | Seguridad | 🔴 Alta |
| `Periodos.tsx` | Periodos | 🟡 Media |
| `DiasFeriados.tsx` | Periodos | 🟢 Baja |

### Fase 9 — Motor de facturación (frontend)
- Página de cálculo de aterrizaje/parqueo
- Wizard de facturación
- Vista de detalle de factura
- Resumen de cargos

### Fase 10 — Dashboard real
- Migrar de mock data a API real
- Gráficos con datos del backend
- KPIs actualizados

---

## 9. CONVENCIONES DE CÓDIGO

### 9.1 Nombres

| Concepto | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `AeropuertosTable` |
| Archivos de página | PascalCase | `AeropuertosPage.tsx` → export default `function Aeropuertos()` |
| Archivos UI | kebab-case | `button.tsx`, `card.tsx` |
| Servicios | camelCase + `.service.ts` | `organizacion.service.ts` |
| Stores | camelCase | `useAuthStore`, `useUiStore` |
| Hooks | camelCase + `use` prefix | `usePaises`, `useParametros` |
| Tipos/Interfaces | PascalCase | `AeropuertoItem`, `CreatePaisDto` |
| Constantes | UPPER_SNAKE | `MODULOS_DISPONIBLES` |

### 9.2 Estructura de página

```tsx
// 1. Imports (librería → local)
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// 2. Zod schema
const schema = z.object({ ... })
type FormValues = z.infer<typeof schema>

// 3. Tipos de item (interfaz)
interface Item { ... }

// 4. Mock data (temporal)
const mockData: Item[] = [ ... ]

// 5. Componente principal (export default)
export default function NombrePage() {
  // 5a. Estado
  const [data, setData] = useState(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [search, setSearch] = useState('')

  // 5b. Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ... },
  })

  // 5c. Filtered data
  const filtered = useMemo(() => data.filter(...), [data, search])

  // 5d. Handlers
  const onSubmit = (form: FormValues) => { ... }
  const handleEdit = (item: Item) => { ... }
  const handleDelete = (id: number) => { ... }

  // 5e. JSX
  return (
    <div className="space-y-6">
      <PageHeader title="..." subtitle="..." />
      <Card>...</Card>
      <Dialog>...</Dialog>
    </div>
  )
}
```

### 9.3 Imports

```tsx
// Orden:
// 1. React / hooks
import { useState, useMemo } from 'react'

// 2. Librerías externas
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 3. Iconos (lucide-react)
import { Plus, Search } from 'lucide-react'

// 4. Componentes UI (alias @/)
import { Button } from '@/components/ui/button'

// 5. Componentes shared
import { PageHeader } from '@/components/shared/PageHeader'

// 6. Stores / Services / Types
import { useAuthStore } from '@/stores/authStore'
import { paisService } from '@/services/modules/organizacion.service'
import type { Pais } from '@/types'
```

---

## 10. APIs DEL BACKEND (Endpoints disponibles)

### Organización
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/paises` | Listar países |
| GET | `/api/v1/paises/:id` | Obtener país |
| POST | `/api/v1/paises` | Crear país |
| PUT | `/api/v1/paises/:id` | Actualizar país |
| DELETE | `/api/v1/paises/:id` | Eliminar país |
| GET | `/api/v1/ciudades` | Listar ciudades |
| GET | `/api/v1/ciudades/:id` | Obtener ciudad |
| POST | `/api/v1/ciudades` | Crear ciudad |
| PUT | `/api/v1/ciudades/:id` | Actualizar ciudad |
| DELETE | `/api/v1/ciudades/:id` | Eliminar ciudad |
| GET | `/api/v1/aeropuertos` | Listar aeropuertos |
| POST | `/api/v1/aeropuertos` | Crear aeropuerto |
| GET | `/api/v1/aeropuertos/:id` | Obtener aeropuerto |
| PUT | `/api/v1/aeropuertos/:id` | Actualizar aeropuerto |
| DELETE | `/api/v1/aeropuertos/:id` | Eliminar aeropuerto |

### Aerolíneas
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/aerolineas` | Listar aerolíneas |
| GET | `/api/v1/aerolineas/:id` | Obtener aerolínea |
| POST | `/api/v1/aerolineas` | Crear aerolínea |
| PUT | `/api/v1/aerolineas/:id` | Actualizar aerolínea |
| DELETE | `/api/v1/aerolineas/:id` | Eliminar aerolínea |
| GET | `/api/v1/tipos-aeronave` | Listar tipos aeronave |
| GET | `/api/v1/fabricantes` | Listar fabricantes |
| GET | `/api/v1/clases-aviacion` | Listar clases aviación |
| GET | `/api/v1/aeronaves` | Listar aeronaves |
| GET | `/api/v1/personal-aerolinea` | Listar personal |

### Configuración
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/configuracion/parametros-sistema` | Listar parámetros |
| GET | `/api/configuracion/parametros-sistema/modulos` | Módulos disponibles |
| GET | `/api/configuracion/parametros-sistema/:id` | Obtener parámetro |
| POST | `/api/configuracion/parametros-sistema` | Crear parámetro |
| PUT | `/api/configuracion/parametros-sistema/:id` | Actualizar |
| PATCH | `/api/configuracion/parametros-sistema/:id/valor` | Actualizar valor |
| DELETE | `/api/configuracion/parametros-sistema/:id` | Soft-delete |
| GET | `/api/configuracion/indicadores-economicos` | Listar indicadores |
| GET | `/api/configuracion/secuencias` | Listar secuencias |
| GET | `/api/configuracion/codigos-aeronauticos` | Listar códigos |
| GET | `/api/configuracion/servicios-aereos` | Listar servicios |
| GET | `/api/configuracion/mensajes` | Listar mensajes |
| GET | `/api/configuracion/tipos-evento` | Listar tipos evento |
| GET | `/api/configuracion/eventos` | Listar eventos |
| GET | `/api/configuracion/aplicaciones` | Listar aplicaciones |

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login (JWT) |
| POST | `/api/auth/register` | Registro |

---

## 11. TYPESCRIPT — INTERFACES COMPLETAS

```ts
// ============================================================
// ORGANIZACIÓN
// ============================================================
export interface Pais {
  id: number
  codigo: string        // ISO 3166-1 alpha-2 (CO, US, etc.)
  nombre: string
  nacionalidad?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Ciudad {
  id: number
  nombre: string
  idPais: number
  paisNombre?: string
  activo: boolean
}

export interface Aeropuerto {
  id: number
  codigoOACI: string    // SKBO
  codigoIATA: string    // BOG
  nombre: string
  idCiudad: number
  ciudadNombre?: string
  paisNombre?: string
  activo: boolean
  controlAdministrativo: boolean
  opera24Horas: boolean
  horaApertura?: string
  horaCierre?: string
}

export interface Zona { id: number; codigo: string; nombre: string; activo: boolean }

export interface ZonaAeropuerto {
  id: number
  idAeropuerto: number
  idZona: number
  aeropuertoNombre?: string
  zonaNombre?: string
}

export interface HorarioAeropuerto {
  id: number
  idAeropuerto: number
  diaSemana: number      // 0=Dom, 1=Lun...6=Sáb
  horaApertura: string
  horaCierre: string
  activo: boolean
}

// ============================================================
// AEROLÍNEAS
// ============================================================
export interface Aerolinea {
  id: number
  codigo: string         // Código IATA (2 chars)
  nombre: string
  idPais?: number
  activo: boolean
  recargoNocturno?: number
  horasGraciaParqueo?: number
  horasGraciaHangar?: number
}

export interface TipoAeronave {
  id: number
  codigo: string         // B738, A320
  nombre: string
  idFabricante?: number
  pesoMaxDespegue?: number
  pesoMaxAterrizaje?: number
  capacidadPasajeros?: number
  activo: boolean
}

export interface Fabricante {
  id: number
  codigo: string
  nombre: string         // Boeing, Airbus
  activo: boolean
}

export interface Aeronave {
  id: number
  matricula: string
  idTipoAeronave: number
  idAerolinea: number
  idFabricante?: number
  activo: boolean
  tipoCodigo?: string
  aerolineaNombre?: string
}

export interface ClaseAviacion {
  id: number
  codigo: string
  nombre: string         // Comercial, Carga, Privada
  activo: boolean
}

export interface PersonalAerolinea {
  id: number
  nombres: string
  apellidos: string
  idAerolinea: number
  cargo: string
  activo: boolean
}

// ============================================================
// TARIFAS
// ============================================================
export interface Concepto {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  tipo: 'INGRESO' | 'EGRESO'
  idGrupo?: number
  activo: boolean
}

export interface GrupoConcepto {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface TipoOperacion {
  id: number
  codigo: string
  nombre: string         // Aterrizaje, Despegue, Estacionamiento
  activo: boolean
}

export interface TarifaOperacion {
  id: number
  idConcepto: number
  idTipoOperacion: number
  idTipoAeronave?: number
  pesoMin: number
  pesoMax: number
  valor: number
  moneda: 'COP' | 'USD'
  activo: boolean
}

export interface Impuesto {
  id: number
  codigo: string         // IVA, reteICA, reteFuente
  nombre: string
  porcentaje: number
  activo: boolean
}

// ============================================================
// OPERACIONES
// ============================================================
export interface PuertaEmbarque {
  id: number
  codigo: string
  nombre: string
  idAeropuerto: number
  activo: boolean
}

export interface Hangar {
  id: number
  codigo: string
  nombre: string
  idAeropuerto: number
  capacidad: number
  activo: boolean
}

// ============================================================
// CONFIGURACIÓN
// ============================================================
export interface ParametroSistema {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  valor: string
  tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OPTIONS'
  modulo: string
  opciones?: string
  orden: number
  editable: boolean
  visible: boolean
}

export interface IndicadorEconomico {
  id: number
  codigo: string         // TRM, IPC, UVT
  nombre: string
  valor: number
  fecha: string
}

export interface Secuencia {
  id: number
  nombre: string
  prefijo: string
  consecutivo: number
  longitud: number
  idAeropuerto?: number
}

export interface CodigoAeronautico {
  id: number
  codigo: string
  tipo: number           // 1=OACI aerolínea, 2=IATA aerolínea, etc.
  descripcion: string
}

export interface ServicioAereo {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface Mensaje {
  id: number
  codigo: string
  titulo: string
  contenido: string
  tipo: string
  idUsuario?: number
  leido: boolean
}

export interface TipoEvento {
  codigo: string
  nombre: string
  descripcion?: string
}

export interface Evento {
  id: number
  codigoTipo: string
  codigo: string
  nombre: string
  descripcion?: string
  deshabilitar: boolean
}

// ============================================================
// SEGURIDAD
// ============================================================
export interface Usuario {
  id: number
  username: string
  email: string
  nombre: string
  activo: boolean
  idPerfil: number
  perfilNombre?: string
}

export interface Perfil {
  id: number
  codigo: string
  nombre: string         // Admin, Operador, Facturador, Consulta
  activo: boolean
}

export interface MenuOpcion {
  id: number
  nombre: string
  ruta: string
  icono: string
  idPadre?: number
  orden: number
}

// ============================================================
// LIQUIDACIONES
// ============================================================
export interface Tasa {
  id: number
  codigo: string
  nombre: string
  valor: number
  moneda: 'COP' | 'USD'
  activo: boolean
  idAeropuerto?: number
}

export interface TipoPasajero {
  id: number
  codigo: string         // ADULTO, MENOR, INFANTE, EXENTO, TRANSITO
  nombre: string
  activo: boolean
}

export interface ClasePasajero {
  id: number
  codigo: string         // PRIMERA, EJECUTIVA, ECONOMICA
  nombre: string
  activo: boolean
}

// ============================================================
// PERIODOS
// ============================================================
export interface Periodo {
  id: number
  codigo: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  abierto: boolean
  activo: boolean
}

export interface DiaFeriado {
  id: number
  fecha: string
  nombre: string
  idAeropuerto?: number
}

// ============================================================
// GENERICOS
// ============================================================
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}
```

---

## 12. GOOGLE STITCH — DISEÑO DE UI

- **Herramienta:** Google Stitch (stitch.withgoogle.com) — Generador de UI con IA
- **API Key:** `[REDACTED]`
- **Propósito:** Generar diseños de UI/UX para el proyecto usando prompts de texto
- **Uso en flujo:** Diseñar en Stitch → Exportar HTML/CSS → Adaptar a componentes React
- **Modo actual:** Standard Mode (prompts de texto)

### Diseños pendientes con Stitch:
- [ ] Dashboard con KPIs reales y gráficos
- [ ] Wizard de facturación (aterrizaje + parqueo + recargos)
- [ ] Página de liquidación de pasajeros
- [ ] Tablero de itinerarios/vuelos (calendario)
- [ ] Formulario de tarifas con rangos de peso
- [ ] Panel de usuario/perfiles con permisos
- [ ] Diseño responsive mobile

---

## 13. RECORDATORIOS CRÍTICOS

- ⚠️ **NO** usar CSS modules, styled-components, Material UI, FontAwesome
- ⚠️ **NO** crear `tailwind.config.js` (Tailwind v4 no lo usa)
- ⚠️ **NO** subir Vite a v8 (incompatible con Node 20.17.0)
- ⚠️ **NO** guardar tokens/API keys en código fuente
- ⚠️ **SÍEMPRE** validar formularios con Zod
- ⚠️ **SÍEMPRE** usar `cn()` de `@/lib/utils` para clases condicionales
- ⚠️ **SÍEMPRE** tipar con interfaces, nunca `any`
- ⚠️ **SÍEMPRE** iconos desde `lucide-react`
- ⚠️ Las páginas son `export default function Nombre()` (no arrow functions)
- ⚠️ Los componentes compartidos son `export function Nombre()` (named exports)

---

*Última actualización: 14 de Junio, 2026*
*Este archivo es mi cerebro — lo actualizo con cada decisión de diseño importante.*
