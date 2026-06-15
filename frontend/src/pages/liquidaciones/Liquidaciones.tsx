import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import type { Liquidacion } from '@/types'
import { useLiquidaciones } from '@/hooks/modules'

const estados = ['BORRADOR', 'CONFIRMADA', 'CERRADA', 'ANULADA'] as const

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  idAeropuerto: z.coerce.number().min(1, 'Seleccione un aeropuerto'),
  idPeriodo: z.coerce.number().optional(),
  fecha: z.string().min(1, 'La fecha es requerida'),
  totalPasajeros: z.coerce.number().min(0, 'No puede ser negativo'),
  totalTasas: z.coerce.number().min(0, 'No puede ser negativo'),
  estado: z.enum(estados),
})

type FormValues = z.infer<typeof schema>

const estadoVariant: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = {
  BORRADOR: 'neutral',
  CONFIRMADA: 'warning',
  CERRADA: 'success',
  ANULADA: 'error',
}

const aeropuertos = [
  { id: 1, nombre: 'Aeropuerto El Dorado' },
  { id: 2, nombre: 'Aeropuerto José María Córdova' },
]

const periodos = [
  { id: 1, nombre: 'Enero 2026' },
  { id: 2, nombre: 'Febrero 2026' },
  { id: 3, nombre: 'Marzo 2026' },
]

export default function Liquidaciones() {
  const liquidaciones = useLiquidaciones()
  const { data, isLoading, error } = liquidaciones.useList()
  const createMutation = liquidaciones.useCreate()
  const updateMutation = liquidaciones.useUpdate()
  const deleteMutation = liquidaciones.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Liquidacion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', idAeropuerto: 0, idPeriodo: undefined, fecha: '', totalPasajeros: 0, totalTasas: 0, estado: 'BORRADOR' },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ codigo: '', idAeropuerto: 0, idPeriodo: undefined, fecha: '', totalPasajeros: 0, totalTasas: 0, estado: 'BORRADOR' })
  }

  const handleEdit = (item: Liquidacion) => {
    setEditing(item)
    reset({ codigo: item.codigo, idAeropuerto: item.idAeropuerto, idPeriodo: item.idPeriodo ?? undefined, fecha: item.fecha, totalPasajeros: item.totalPasajeros, totalTasas: item.totalTasas, estado: item.estado as typeof estados[number] })
    setOpen(true)
  }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', idAeropuerto: 0, idPeriodo: undefined, fecha: '', totalPasajeros: 0, totalTasas: 0, estado: 'BORRADOR' }); setOpen(true) }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val)

  const formatNumber = (val: number) =>
    new Intl.NumberFormat('es-CO').format(val)

  const columns: Column<Liquidacion>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'aeropuertoNombre', header: 'Aeropuerto', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true, render: (item) => <span className="text-sm">{new Date(item.fecha).toLocaleDateString('es-CO')}</span> },
    { key: 'totalPasajeros', header: 'Pasajeros', sortable: true, render: (item) => <span className="font-mono text-sm">{formatNumber(item.totalPasajeros)}</span> },
    { key: 'totalTasas', header: 'Total Tasas', sortable: true, render: (item) => <span className="font-mono text-sm">{formatCurrency(item.totalTasas)}</span> },
    { key: 'estado', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={estadoVariant[item.estado] || 'neutral'} label={item.estado} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Liquidaciones" subtitle="Liquidación de tasas aeroportuarias por período" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Liquidación</Button>} />
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
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'aeropuertoNombre', 'estado']} searchPlaceholder="Buscar liquidación..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nueva Liquidación'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: LIQ-2026-001" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto</label>
            <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value={0}>Seleccione...</option>
              {aeropuertos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAeropuerto && <p className="text-xs text-rose-500">{errors.idAeropuerto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Período (opcional)</label>
            <select {...register('idPeriodo')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value="">Sin período</option>
              {periodos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Total Pasajeros</label>
            <Input type="number" {...register('totalPasajeros')} placeholder="0" />
            {errors.totalPasajeros && <p className="text-xs text-rose-500">{errors.totalPasajeros.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Total Tasas</label>
            <Input type="number" {...register('totalTasas')} placeholder="0" />
            {errors.totalTasas && <p className="text-xs text-rose-500">{errors.totalTasas.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <select {...register('estado')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Liquidación" message="¿Está seguro de eliminar esta liquidación?" />
    </div>
  )
}
