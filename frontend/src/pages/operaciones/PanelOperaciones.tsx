import { useState, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plane, PlaneLanding, PlaneTakeoff, Warehouse, Ticket, Receipt, Loader2,
  Search, FileText, Plus, Pencil, Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import api from '@/lib/api'
import type { Column } from '@/components/shared/DataTable'
import type {
  Vuelo, MovimientoFacturacion, ConceptoCosto, OperacionPanel,
  CalcularConceptosRequest, ResultadoCalculo, ConceptoCalculado,
} from '@/types'
import { useVuelos, useAerolineas, useAeropuertos, useAeronaves, useMovimientosFacturacion } from '@/hooks/modules'

const estadoColors: Record<string, 'active' | 'inactive' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  PROGRAMADO: 'info',
  EN_VUELO: 'warning',
  ATERRIZADO: 'success',
  DESPEGADO: 'active',
  CANCELADO: 'error',
  FINALIZADO: 'neutral',
}

const estadoLabels: Record<string, string> = {
  PROGRAMADO: 'Programado',
  EN_VUELO: 'En Vuelo',
  ATERRIZADO: 'Aterrizado',
  DESPEGADO: 'Despegado',
  CANCELADO: 'Cancelado',
  FINALIZADO: 'Finalizado',
}

const tipoMovLabels: Record<string, string> = {
  ATERR: 'Aterrizaje',
  PARQUEO: 'Parqueo',
  HANGAR: 'Hangar',
  TASA: 'Tasa',
  SERVICIO: 'Servicio',
}

function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)
}

function formatUSD(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

function today() {
  return new Date().toISOString().split('T')[0]
}

const entrySchema = z.object({
  idAerolinea: z.coerce.number().min(1, 'Seleccione aerolínea'),
  idAeronave: z.coerce.number().optional(),
  origen: z.string().min(1, 'Procedencia requerida'),
  destino: z.string().min(1, 'Destino requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  horaLlegada: z.string().min(1, 'Hora de llegada requerida'),
  matricula: z.string().optional(),
  peso: z.coerce.number().optional(),
  idPuerta: z.coerce.number().optional(),
})

const exitSchema = z.object({
  horaSalida: z.string().min(1, 'Hora de salida requerida'),
  idPuerta: z.coerce.number().optional(),
  destino: z.string().optional(),
  peso: z.coerce.number().optional(),
})

const parkingSchema = z.object({
  idPuerta: z.coerce.number().optional(),
  idHangar: z.coerce.number().optional(),
  horaIni: z.string().min(1, 'Hora inicio requerida'),
  horaFin: z.string().min(1, 'Hora fin requerida'),
  posicion: z.string().optional(),
})

const tasaSchema = z.object({
  nacional: z.coerce.number().min(0).default(0),
  internacionalUSD: z.coerce.number().min(0).default(0),
  internacionalCOP: z.coerce.number().min(0).default(0),
  exentos: z.coerce.number().min(0).default(0),
  transito: z.coerce.number().min(0).default(0),
})

type EntryForm = z.infer<typeof entrySchema>
type ExitForm = z.infer<typeof exitSchema>
type ParkingForm = z.infer<typeof parkingSchema>
type TasaForm = z.infer<typeof tasaSchema>

export default function PanelOperaciones() {
  const [fecha, setFecha] = useState(today())
  const [idAeropuerto, setIdAeropuerto] = useState('')
  const [idAerolineaFilter, setIdAerolineaFilter] = useState('')
  const [selected, setSelected] = useState<OperacionPanel | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const [showEntry, setShowEntry] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const [showParking, setShowParking] = useState(false)
  const [showTasas, setShowTasas] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [calculando, setCalculando] = useState(false)
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculo | null>(null)
  const [errorCalculo, setErrorCalculo] = useState<string | null>(null)

  const calcular = useCallback(async (req: CalcularConceptosRequest) => {
    setCalculando(true)
    setErrorCalculo(null)
    try {
      const res = await api.post<ResultadoCalculo>('/operaciones/calcular-conceptos', req)
      setResultadoCalculo(res.data)
      return res.data
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error al calcular conceptos'
      setErrorCalculo(msg)
      return null
    } finally {
      setCalculando(false)
    }
  }, [])

  const vuelosQ = useVuelos().useList({
    ...(fecha ? { fecha } : {}),
    ...(idAerolineaFilter ? { idAerolinea: Number(idAerolineaFilter) } : {}),
  })
  const aerolineasQ = useAerolineas().useList()
  const aeropuertosQ = useAeropuertos().useList()
  const aeronavesQ = useAeronaves().useList()
  const puertasQ = useVuelos() // placeholder — actual hook not created, use inline

  const movimientosQ = useMovimientosFacturacion().useList(
    selected ? { idOperacion: selected.id } : undefined,
  )

  const vuelos: Vuelo[] = vuelosQ.data || []
  const aerolineas = aerolineasQ.data || []
  const aeropuertos = aeropuertosQ.data || []
  const aeronaves = aeronavesQ.data || []
  const movimientos: MovimientoFacturacion[] = movimientosQ.data || []

  const operaciones: OperacionPanel[] = useMemo(() => {
    return vuelos.map((v) => ({
      id: v.id,
      codigo: v.codigo,
      idAerolinea: v.idAerolinea,
      aerolineaNombre: v.aerolineaNombre || aerolineas.find((a) => a.id === v.idAerolinea)?.nombre,
      idAeronave: v.idAeronave,
      aeronaveMatricula: v.aeronaveMatricula || aeronaves.find((a) => a.id === v.idAeronave)?.matricula,
      origen: v.origen,
      destino: v.destino,
      fecha: v.fecha,
      horaLlegada: v.horaLlegada,
      horaSalida: v.horaSalida,
      estado: v.estado,
      tieneEntrada: v.estado === 'ATERRIZADO' || v.estado === 'FINALIZADO',
      tieneSalida: v.estado === 'DESPEGADO' || v.estado === 'FINALIZADO',
    }))
  }, [vuelos, aerolineas, aeronaves])

  const conceptosCosto: ConceptoCosto[] = useMemo(() => {
    return (movimientos || []).map((m) => ({
      id: `mov-${m.id}`,
      concepto: m.conceptoNombre || tipoMovLabels[m.tipo] || m.tipo,
      conceptoId: m.idConcepto,
      tipo: m.tipo,
      valorCOP: m.tipo === 'TASA' && m.valor ? m.valor * 4500 : (m.valor || 0),
      valorUSD: m.tipo !== 'TASA' && m.valor ? m.valor / 4500 : (m.valor || 0),
      estado: m.facturado ? 'FACTURADO' : 'PENDIENTE',
      tipoFacturacion: 'CONTADO',
      documento: m.idFactura ? `FAC-${m.idFactura}` : undefined,
    }))
  }, [movimientos])

  const entryForm = useForm<EntryForm>({ resolver: zodResolver(entrySchema), defaultValues: { fecha: today() } })
  const exitForm = useForm<ExitForm>({ resolver: zodResolver(exitSchema) })
  const parkingForm = useForm<ParkingForm>({ resolver: zodResolver(parkingSchema) })
  const tasaForm = useForm<TasaForm>({ resolver: zodResolver(tasaSchema), defaultValues: { nacional: 0, internacionalUSD: 0, internacionalCOP: 0, exentos: 0, transito: 0 } })

  const columns: Column<OperacionPanel>[] = [
    {
      key: 'codigo', header: 'Vuelo', sortable: true,
      render: (r) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{r.codigo}</span>,
    },
    {
      key: 'aerolineaNombre', header: 'Aerolínea', sortable: true,
      render: (r) => <span className="font-medium text-sm">{r.aerolineaNombre || `#${r.idAerolinea}`}</span>,
    },
    {
      key: 'aeronaveMatricula', header: 'Matrícula',
      render: (r) => <span className="font-mono text-sm text-slate-500">{r.aeronaveMatricula || '—'}</span>,
    },
    { key: 'origen', header: 'Procedencia', sortable: true, render: (r) => <span className="font-mono text-xs uppercase">{r.origen}</span> },
    { key: 'destino', header: 'Destino', sortable: true, render: (r) => <span className="font-mono text-xs uppercase">{r.destino}</span> },
    {
      key: 'horaLlegada', header: 'Hra Llegada',
      render: (r) => <span className="font-mono text-sm">{r.horaLlegada || '—'}</span>,
    },
    {
      key: 'horaSalida', header: 'Hra Salida',
      render: (r) => <span className="font-mono text-sm">{r.horaSalida || '—'}</span>,
    },
    {
      key: 'estado', header: 'Estado', sortable: true,
      render: (r) => <StatusBadge variant={estadoColors[r.estado] || 'neutral'} label={estadoLabels[r.estado] || r.estado} />,
    },
    {
      key: 'acciones', header: '', className: 'text-right w-20',
      render: (r) => (
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setSelected(r); setShowEntry(true) }} title="Registrar Entrada"><PlaneLanding className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setSelected(r); setShowExit(true) }} title="Registrar Salida"><PlaneTakeoff className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  const handleEntry = async (data: EntryForm) => {
    setProcessing(true)
    try {
      await calcular({
        idAerolinea: data.idAerolinea,
        idAeropuerto: Number(idAeropuerto || 1),
        fecha: data.fecha,
        nacionalidad: 'N',
        peso: data.peso,
        horaLlegada: `${data.fecha}T${data.horaLlegada}:00`,
        conceptos: ['ATERRIZAJE'],
      })
      setShowEntry(false)
      entryForm.reset()
    } finally {
      setProcessing(false)
    }
  }

  const handleExit = async (data: ExitForm) => {
    setProcessing(true)
    try {
      if (selected) {
        await calcular({
          idAerolinea: selected.idAerolinea,
          idAeropuerto: Number(idAeropuerto || 1),
          fecha: selected.fecha,
          nacionalidad: 'N',
          peso: data.peso,
          horaLlegada: selected.horaLlegada || undefined,
          horaSalida: data.horaSalida ? `${selected.fecha}T${data.horaSalida}:00` : undefined,
          conceptos: ['PARQUEO'],
        })
      }
      setShowExit(false)
      exitForm.reset()
    } finally {
      setProcessing(false)
    }
  }

  const handleParking = async (data: ParkingForm) => {
    setProcessing(true)
    try {
      if (selected) {
        await calcular({
          idAerolinea: selected.idAerolinea,
          idAeropuerto: Number(idAeropuerto || 1),
          fecha: selected.fecha,
          nacionalidad: 'N',
          horaLlegada: data.horaIni,
          horaSalida: data.horaFin,
          conceptos: ['PARQUEO'],
        })
      }
      setShowParking(false)
      parkingForm.reset()
    } finally {
      setProcessing(false)
    }
  }

  const handleTasas = async (data: TasaForm) => {
    setProcessing(true)
    try {
      if (selected) {
        await calcular({
          idAerolinea: selected.idAerolinea,
          idAeropuerto: Number(idAeropuerto || 1),
          fecha: selected.fecha,
          nacionalidad: 'N',
          totalPaganTasa: data.nacional,
          pasajerosPesos: data.internacionalCOP,
          pasajerosDolares: data.internacionalUSD,
          conceptos: ['TASA'],
        })
      }
      setShowTasas(false)
      tasaForm.reset()
    } finally {
      setProcessing(false)
    }
  }

  const conceptosCalculados: ConceptoCosto[] = useMemo(() => {
    if (!resultadoCalculo?.conceptos?.length) return conceptosCosto
    return resultadoCalculo.conceptos.map((c: ConceptoCalculado, i: number) => ({
      id: `calc-${i}`,
      concepto: c.nombre,
      conceptoId: c.idConcepto,
      tipo: c.tipo,
      valorCOP: c.moneda === 'COP' ? c.valor : c.valor * (resultadoCalculo.totalCOP || 4500),
      valorUSD: c.moneda === 'USD' ? c.valor : c.valor / (resultadoCalculo.totalCOP || 4500),
      estado: 'PENDIENTE' as const,
      tipoFacturacion: c.moneda === 'USD' ? 'USD' : 'CONTADO',
    }))
  }, [resultadoCalculo, conceptosCosto])

  const tabs = [
    { id: 0, label: 'Detalle General', icon: FileText },
    { id: 1, label: 'Parqueo y Tasas', icon: Warehouse },
    { id: 2, label: 'Costo de Operación', icon: Receipt },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Panel Central de Operaciones" subtitle="Gestión completa de operaciones aeroportuarias" />

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Fecha</label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-40 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Aeropuerto</label>
              <select value={idAeropuerto} onChange={(e) => setIdAeropuerto(e.target.value)} className="flex h-9 w-44 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">Todos</option>
                {aeropuertos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Aerolínea</label>
              <select value={idAerolineaFilter} onChange={(e) => setIdAerolineaFilter(e.target.value)} className="flex h-9 w-44 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">Todas</option>
                {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={() => vuelosQ.refetch()}><Search className="h-4 w-4 mr-1" /> Buscar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => { setSelected(null); setShowEntry(true) }} disabled={!vuelos.length && !selected}>
          <PlaneLanding className="h-4 w-4 mr-1.5" /> Registrar Entrada
        </Button>
        <Button size="sm" onClick={() => setShowExit(true)} disabled={!selected}>
          <PlaneTakeoff className="h-4 w-4 mr-1.5" /> Registrar Salida
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShowParking(true)} disabled={!selected}>
          <Warehouse className="h-4 w-4 mr-1.5" /> Parqueo
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShowTasas(true)} disabled={!selected}>
          <Ticket className="h-4 w-4 mr-1.5" /> Tasas
        </Button>
        <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" disabled={!selected}>
          <Receipt className="h-4 w-4 mr-1.5" /> Facturar
        </Button>
      </div>

      {/* Main Grid */}
      {vuelosQ.isLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}
      {vuelosQ.error && (
        <div className="flex items-center justify-center h-48 text-rose-500 bg-rose-50 rounded-lg border border-rose-200">
          Error: {(vuelosQ.error as Error).message}
        </div>
      )}
      {!vuelosQ.isLoading && !vuelosQ.error && (
        <DataTable
          columns={columns}
          data={operaciones}
          keyExtractor={(r) => r.id}
          searchKeys={['codigo', 'aerolineaNombre', 'aeronaveMatricula', 'origen', 'destino']}
          searchPlaceholder="Buscar operación..."
          onRowClick={(r) => setSelected(r)}
          emptyTitle="No hay operaciones"
          emptyDescription="Seleccione filtros y presione Buscar"
        />
      )}

      {/* Detail Tabs */}
      {selected && (
        <Card className="border-slate-200 shadow-sm">
          <div className="border-b border-slate-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-5">
            {activeTab === 0 && <TabDetalleGeneral operacion={selected} />}
            {activeTab === 1 && (
              <TabParqueoTasas
                operacion={selected}
                movimientos={movimientos}
                onAddParking={() => setShowParking(true)}
                onAddTasas={() => setShowTasas(true)}
              />
            )}
            {activeTab === 2 && (
              <TabCostoOperacion
                conceptos={conceptosCalculados}
                movimientos={movimientos}
                calculando={calculando}
                errorCalculo={errorCalculo}
                resultado={resultadoCalculo}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CrudModal open={showEntry} onOpenChange={setShowEntry} title="Registrar Entrada (Aterrizaje)" onSubmit={entryForm.handleSubmit(handleEntry)} loading={processing} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <Controller name="idAerolinea" control={entryForm.control} render={({ field }) => (
              <select value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm">
                <option value="">Seleccione...</option>
                {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            )} />
            {entryForm.formState.errors.idAerolinea && <p className="text-xs text-rose-500">{entryForm.formState.errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeronave</label>
            <Controller name="idAeronave" control={entryForm.control} render={({ field }) => (
              <select value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm">
                <option value="">Seleccione...</option>
                {aeronaves.map((a) => <option key={a.id} value={a.id}>{a.matricula}</option>)}
              </select>
            )} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Procedencia</label>
            <Input {...entryForm.register('origen')} placeholder="Código IATA" className="font-mono uppercase" />
            {entryForm.formState.errors.origen && <p className="text-xs text-rose-500">{entryForm.formState.errors.origen.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Destino</label>
            <Input {...entryForm.register('destino')} placeholder="Código IATA" className="font-mono uppercase" />
            {entryForm.formState.errors.destino && <p className="text-xs text-rose-500">{entryForm.formState.errors.destino.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...entryForm.register('fecha')} className="font-mono" />
            {entryForm.formState.errors.fecha && <p className="text-xs text-rose-500">{entryForm.formState.errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora de Llegada</label>
            <Input type="time" {...entryForm.register('horaLlegada')} className="font-mono" />
            {entryForm.formState.errors.horaLlegada && <p className="text-xs text-rose-500">{entryForm.formState.errors.horaLlegada.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Matrícula</label>
            <Input {...entryForm.register('matricula')} placeholder="HK-XXXX" className="font-mono uppercase" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Peso (kg)</label>
            <Input type="number" {...entryForm.register('peso')} className="font-mono" />
          </div>
        </div>
      </CrudModal>

      <CrudModal open={showExit} onOpenChange={setShowExit} title="Registrar Salida (Despegue)" onSubmit={exitForm.handleSubmit(handleExit)} loading={processing}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora de Salida</label>
            <Input type="time" {...exitForm.register('horaSalida')} className="font-mono" />
            {exitForm.formState.errors.horaSalida && <p className="text-xs text-rose-500">{exitForm.formState.errors.horaSalida.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Destino</label>
            <Input {...exitForm.register('destino')} placeholder="Código IATA" className="font-mono uppercase" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Peso (kg)</label>
            <Input type="number" {...exitForm.register('peso')} className="font-mono" />
          </div>
        </div>
      </CrudModal>

      <CrudModal open={showParking} onOpenChange={setShowParking} title="Registrar Parqueo" onSubmit={parkingForm.handleSubmit(handleParking)} loading={processing}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Posición / Puerta</label>
            <Input {...parkingForm.register('posicion')} placeholder="Ej: P-12" className="font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora Inicio</label>
            <Input type="datetime-local" {...parkingForm.register('horaIni')} className="font-mono" />
            {parkingForm.formState.errors.horaIni && <p className="text-xs text-rose-500">{parkingForm.formState.errors.horaIni.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora Fin</label>
            <Input type="datetime-local" {...parkingForm.register('horaFin')} className="font-mono" />
            {parkingForm.formState.errors.horaFin && <p className="text-xs text-rose-500">{parkingForm.formState.errors.horaFin.message}</p>}
          </div>
        </div>
      </CrudModal>

      <CrudModal open={showTasas} onOpenChange={setShowTasas} title="Registrar Tasas Aeroportuarias" onSubmit={tasaForm.handleSubmit(handleTasas)} loading={processing} size="lg">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 border-b pb-1">Pasajeros Nacionales</h4>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Total Pasajeros</label>
              <Input type="number" {...tasaForm.register('nacional')} className="font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Tránsito</label>
              <Input type="number" {...tasaForm.register('transito')} className="font-mono" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 border-b pb-1">Pasajeros Internacionales</h4>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Pagan en USD</label>
              <Input type="number" {...tasaForm.register('internacionalUSD')} className="font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Pagan en COP</label>
              <Input type="number" {...tasaForm.register('internacionalCOP')} className="font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Exentos</label>
              <Input type="number" {...tasaForm.register('exentos')} className="font-mono" />
            </div>
          </div>
        </div>
      </CrudModal>
    </div>
  )
}

function TabDetalleGeneral({ operacion }: { operacion: OperacionPanel }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 border-b pb-1 flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-emerald-600" /> Llegada (Entrada)</h4>
        <div className="text-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-slate-500">Vuelo:</span><span className="font-mono font-semibold">{operacion.codigo}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Procedencia:</span><span className="font-mono">{operacion.origen}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Hora:</span><span className="font-mono">{operacion.horaLlegada || '—'}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Estado:</span><StatusBadge variant={operacion.tieneEntrada ? 'success' : 'warning'} label={operacion.tieneEntrada ? 'Registrada' : 'Pendiente'} /></p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 border-b pb-1 flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-amber-600" /> Salida (Despegue)</h4>
        <div className="text-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-slate-500">Vuelo:</span><span className="font-mono font-semibold">{operacion.codigo}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Destino:</span><span className="font-mono">{operacion.destino}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Hora:</span><span className="font-mono">{operacion.horaSalida || '—'}</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Estado:</span><StatusBadge variant={operacion.tieneSalida ? 'success' : 'warning'} label={operacion.tieneSalida ? 'Registrada' : 'Pendiente'} /></p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 border-b pb-1 flex items-center gap-2"><Ticket className="h-4 w-4 text-indigo-600" /> Pasajeros</h4>
        <div className="text-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-slate-500">Nacionales:</span><span className="font-semibold">—</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Internacionales:</span><span className="font-semibold">—</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Exentos:</span><span className="font-semibold">—</span></p>
          <p className="flex justify-between"><span className="text-slate-500">Tránsito:</span><span className="font-semibold">—</span></p>
        </div>
      </div>
    </div>
  )
}

function TabParqueoTasas({
  operacion,
  movimientos,
  onAddParking,
  onAddTasas,
}: {
  operacion: OperacionPanel
  movimientos: MovimientoFacturacion[]
  onAddParking: () => void
  onAddTasas: () => void
}) {
  const parkings = movimientos.filter((m) => m.tipo === 'PARQUEO' || m.tipo === 'HANGAR')
  const tasas = movimientos.filter((m) => m.tipo === 'TASA')

  const parkColumns: Column<MovimientoFacturacion>[] = [
    { key: 'tipo', header: 'Tipo', render: (m) => <span className="font-medium text-sm">{tipoMovLabels[m.tipo] || m.tipo}</span> },
    { key: 'horaIni', header: 'Inicio', render: (m) => <span className="font-mono text-sm">{m.horaIni ? new Date(m.horaIni).toLocaleString('es-CO') : '—'}</span> },
    { key: 'horaFin', header: 'Fin', render: (m) => <span className="font-mono text-sm">{m.horaFin ? new Date(m.horaFin).toLocaleString('es-CO') : '—'}</span> },
    { key: 'valor', header: 'Valor', render: (m) => <span className="font-mono text-sm">{m.valor ? formatCOP(m.valor) : '—'}</span> },
    { key: 'facturado', header: 'Estado', render: (m) => <StatusBadge variant={m.facturado ? 'success' : 'warning'} label={m.facturado ? 'Facturado' : 'Pendiente'} /> },
  ]

  const tasaColumns: Column<MovimientoFacturacion>[] = [
    { key: 'conceptoNombre', header: 'Tasa', render: (m) => <span className="font-medium text-sm">{m.conceptoNombre || 'Tasa'}</span> },
    { key: 'cantidad', header: 'Pax', render: (m) => <span className="font-mono text-sm">{m.cantidad || '—'}</span> },
    { key: 'tarifa', header: 'Valor Unit.', render: (m) => <span className="font-mono text-sm">{m.tarifa ? formatCOP(m.tarifa) : '—'}</span> },
    { key: 'valor', header: 'Total', render: (m) => <span className="font-mono text-sm font-semibold">{m.valor ? formatCOP(m.valor) : '—'}</span> },
    { key: 'facturado', header: 'Estado', render: (m) => <StatusBadge variant={m.facturado ? 'success' : 'warning'} label={m.facturado ? 'Facturado' : 'Pendiente'} /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-700">Registros de Parqueo</h4>
          <Button size="sm" variant="outline" onClick={onAddParking}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
        </div>
        <DataTable columns={parkColumns} data={parkings} keyExtractor={(m) => m.id} searchable={false} emptyTitle="Sin parqueos" emptyDescription="No hay registros de parqueo para este vuelo" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-700">Tasas Aeroportuarias</h4>
          <Button size="sm" variant="outline" onClick={onAddTasas}><Plus className="h-3.5 w-3.5 mr-1" /> Agregar</Button>
        </div>
        <DataTable columns={tasaColumns} data={tasas} keyExtractor={(m) => m.id} searchable={false} emptyTitle="Sin tasas" emptyDescription="No hay tasas registradas para este vuelo" />
      </div>
    </div>
  )
}

function TabCostoOperacion({
  conceptos,
  movimientos,
  calculando,
  errorCalculo,
  resultado,
}: {
  conceptos: ConceptoCosto[]
  movimientos: MovimientoFacturacion[]
  calculando?: boolean
  errorCalculo?: string | null
  resultado?: ResultadoCalculo | null
}) {
  const totalCOP = conceptos.reduce((s, c) => s + c.valorCOP, 0)
  const totalUSD = conceptos.reduce((s, c) => s + c.valorUSD, 0)

  const costColumns: Column<ConceptoCosto>[] = [
    { key: 'concepto', header: 'Concepto', sortable: true, render: (c) => <span className="font-medium text-sm">{c.concepto}</span> },
    { key: 'tipo', header: 'Tipo', render: (c) => <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{tipoMovLabels[c.tipo] || c.tipo}</span> },
    { key: 'valorCOP', header: 'Valor COP', sortable: true, render: (c) => <span className="font-mono text-sm text-right block">{formatCOP(c.valorCOP)}</span> },
    { key: 'valorUSD', header: 'Valor USD', sortable: true, render: (c) => <span className="font-mono text-sm text-right block">{formatUSD(c.valorUSD)}</span> },
    { key: 'estado', header: 'Estado', render: (c) => <StatusBadge variant={c.estado === 'FACTURADO' ? 'success' : c.estado === 'ANULADO' ? 'error' : 'warning'} label={c.estado} /> },
    { key: 'tipoFacturacion', header: 'Tipo Fac.', render: (c) => <span className="text-xs font-medium text-slate-500">{c.tipoFacturacion}</span> },
    { key: 'documento', header: 'Documento', render: (c) => <span className="font-mono text-xs">{c.documento || '—'}</span> },
  ]

  return (
    <div className="space-y-4">
      {calculando && (
        <div className="flex items-center gap-2 p-3 text-sm text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-200">
          <Loader2 className="h-4 w-4 animate-spin" />
          Calculando conceptos...
        </div>
      )}

      {errorCalculo && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-lg border border-rose-200">
          Error: {errorCalculo}
        </div>
      )}

      {resultado?.conceptos?.map((c, i) => c.formula && (
        <div key={i} className="p-2 text-xs text-slate-500 bg-slate-50 rounded border border-slate-100 font-mono">
          {c.formula}
        </div>
      ))}

      <DataTable
        columns={costColumns}
        data={conceptos}
        keyExtractor={(c) => c.id}
        searchable={false}
        emptyTitle="Sin conceptos calculados"
        emptyDescription="Registre entrada, salida, parqueo y tasas para ver los costos calculados"
      />

      {conceptos.length > 0 && (
        <div className="flex justify-end gap-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Total COP</p>
            <p className="text-xl font-bold text-slate-800">{formatCOP(totalCOP)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Total USD</p>
            <p className="text-xl font-bold text-slate-800">{formatUSD(totalUSD)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Movimientos</p>
            <p className="text-xl font-bold text-slate-800">{resultado?.conceptos?.length || movimientos.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Facturados</p>
            <p className="text-xl font-bold text-emerald-600">{movimientos.filter((m) => m.facturado).length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Pendientes</p>
            <p className="text-xl font-bold text-amber-600">{movimientos.filter((m) => !m.facturado).length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
