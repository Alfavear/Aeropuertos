import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Factura } from '@/types'
import { useFacturas } from '@/hooks/modules'

const schema = z.object({
  numero: z.string().min(1, 'El número es requerido'),
  idAerolinea: z.coerce.number().min(1, 'Seleccione una aerolínea'),
  idAeropuerto: z.coerce.number().min(1, 'Seleccione un aeropuerto'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  subtotal: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  total: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  estado: z.enum(['EMITIDA', 'PAGADA', 'VENCIDA', 'ANULADA']),
})

type FormValues = z.infer<typeof schema>

const aerolineas = [
  { id: 1, nombre: 'Avianca' },
  { id: 2, nombre: 'LATAM Airlines' },
  { id: 3, nombre: 'American Airlines' },
  { id: 4, nombre: 'JetBlue' },
  { id: 5, nombre: 'Spirit Airlines' },
]

const aeropuertos = [
  { id: 1, nombre: 'El Dorado (BOG)' },
  { id: 2, nombre: 'José María Córdova (MDE)' },
  { id: 3, nombre: 'Rafael Núñez (CTG)' },
]

const estadoVariant = (estado: string) => {
  switch (estado) {
    case 'EMITIDA': return 'warning'
    case 'PAGADA': return 'success'
    case 'VENCIDA': return 'error'
    case 'ANULADA': return 'neutral'
    default: return 'neutral'
  }
}

export default function Facturas() {
  const facturas = useFacturas()
  const { data, isLoading, error } = facturas.useList()
  const createMutation = facturas.useCreate()
  const updateMutation = facturas.useUpdate()
  const deleteMutation = facturas.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Factura | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { numero: '', idAerolinea: 0, idAeropuerto: 0, fecha: '', subtotal: 0, total: 0, estado: 'EMITIDA' },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ numero: '', idAerolinea: 0, idAeropuerto: 0, fecha: '', subtotal: 0, total: 0, estado: 'EMITIDA' })
  }

  const handleEdit = (item: Factura) => {
    setEditing(item)
    reset({ numero: item.numero, idAerolinea: item.idAerolinea, idAeropuerto: item.idAeropuerto, fecha: item.fecha, subtotal: item.subtotal, total: item.total, estado: item.estado as FormValues['estado'] })
    setOpen(true)
  }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ numero: '', idAerolinea: 0, idAeropuerto: 0, fecha: '', subtotal: 0, total: 0, estado: 'EMITIDA' }); setOpen(true) }

  const columns: Column<Factura>[] = [
    { key: 'numero', header: 'Número', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.numero}</span> },
    { key: 'aerolineaNombre', header: 'Aerolínea', sortable: true },
    { key: 'aeropuertoNombre', header: 'Aeropuerto', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'subtotal', header: 'Subtotal', sortable: true, render: (item) => <span>{item.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span> },
    { key: 'total', header: 'Total', sortable: true, render: (item) => <span className="font-semibold">{item.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span> },
    { key: 'estado', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={estadoVariant(item.estado)} label={item.estado} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Facturas" subtitle="Gestión de facturas emitidas a aerolíneas" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Factura</Button>} />
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-64 text-rose-500">
          Error al cargar datos: {(error as Error).message}
        </div>
      )}
      {!isLoading && !error && (
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['numero', 'aerolineaNombre', 'aeropuertoNombre']} searchPlaceholder="Buscar factura..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.numero}` : 'Nueva Factura'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Número</label>
            <Input {...register('numero')} placeholder="Ej: FAC-2026-001" className="font-mono" />
            {errors.numero && <p className="text-xs text-rose-500">{errors.numero.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <select {...register('idAerolinea')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccione...</option>
              {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAerolinea && <p className="text-xs text-rose-500">{errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto</label>
            <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccione...</option>
              {aeropuertos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAeropuerto && <p className="text-xs text-rose-500">{errors.idAeropuerto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Subtotal</label>
            <Input type="number" step="0.01" {...register('subtotal')} />
            {errors.subtotal && <p className="text-xs text-rose-500">{errors.subtotal.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Total</label>
            <Input type="number" step="0.01" {...register('total')} />
            {errors.total && <p className="text-xs text-rose-500">{errors.total.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <select {...register('estado')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value="EMITIDA">Emitida</option>
              <option value="PAGADA">Pagada</option>
              <option value="VENCIDA">Vencida</option>
              <option value="ANULADA">Anulada</option>
            </select>
            {errors.estado && <p className="text-xs text-rose-500">{errors.estado.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Factura" message="¿Está seguro de eliminar esta factura?" />
    </div>
  )
}
