import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge, statusVariant } from '@/components/shared/StatusBadge'
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Vuelo } from '@/types'
import { useVuelos } from '@/hooks/modules'
import { useAerolineas, useAeronaves } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  idAerolinea: z.coerce.number().min(1, 'La aerolínea es requerida'),
  idAeronave: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
    z.number().optional()
  ),
  origen: z.string().min(1, 'El origen es requerido'),
  destino: z.string().min(1, 'El destino es requerido'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  horaSalida: z.string().min(1, 'La hora de salida es requerida'),
  horaLlegada: z.string().min(1, 'La hora de llegada es requerida'),
  estado: z.enum(['PROGRAMADO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO']),
})

type FormValues = z.infer<typeof schema>

const estadoVariantMap: Record<string, 'active' | 'inactive' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  PROGRAMADO: 'info',
  EN_VUELO: 'success',
  ATERRIZADO: 'neutral',
  CANCELADO: 'error',
}

const estadoLabelMap: Record<string, string> = {
  PROGRAMADO: 'Programado',
  EN_VUELO: 'En Vuelo',
  ATERRIZADO: 'Aterrizado',
  CANCELADO: 'Cancelado',
}

export default function Vuelos() {
  const vuelos = useVuelos()
  const { data, isLoading, error } = vuelos.useList()
  const createMutation = vuelos.useCreate()
  const updateMutation = vuelos.useUpdate()
  const deleteMutation = vuelos.useRemove()
  const { data: aerolineasList } = useAerolineas().useList()
  const { data: aeronavesList } = useAeronaves().useList()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Vuelo | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', idAerolinea: 0, idAeronave: undefined, origen: '', destino: '', fecha: '', horaSalida: '', horaLlegada: '', estado: 'PROGRAMADO' },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', idAerolinea: 0, idAeronave: undefined, origen: '', destino: '', fecha: '', horaSalida: '', horaLlegada: '', estado: 'PROGRAMADO' })
  }

  const handleEdit = (item: Vuelo) => {
    setEditing(item)
    reset({ codigo: item.codigo, idAerolinea: item.idAerolinea, idAeronave: item.idAeronave, origen: item.origen, destino: item.destino, fecha: item.fecha, horaSalida: item.horaSalida, horaLlegada: item.horaLlegada, estado: item.estado as FormValues['estado'] })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', idAerolinea: 0, idAeronave: undefined, origen: '', destino: '', fecha: '', horaSalida: '', horaLlegada: '', estado: 'PROGRAMADO' }); setOpen(true) }

  const columns: Column<Vuelo>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'aerolineaNombre', header: 'Aerolínea', sortable: true, render: (item) => <span className="font-medium">{item.aerolineaNombre || `#${item.idAerolinea}`}</span> },
    { key: 'origen', header: 'Origen', sortable: true, render: (item) => <span className="font-mono text-sm">{item.origen}</span> },
    { key: 'destino', header: 'Destino', sortable: true, render: (item) => <span className="font-mono text-sm">{item.destino}</span> },
    { key: 'fecha', header: 'Fecha', sortable: true, render: (item) => new Date(item.fecha).toLocaleDateString('es-CO') },
    { key: 'horaSalida', header: 'Salida', render: (item) => <span className="font-mono text-sm">{item.horaSalida}</span> },
    { key: 'estado', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={estadoVariantMap[item.estado] || 'neutral'} label={estadoLabelMap[item.estado] || item.estado} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Vuelos" subtitle="Catálogo de vuelos programados" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Vuelo</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'origen', 'destino', 'estado']} searchPlaceholder="Buscar vuelo..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Vuelo'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)} size="lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: AV-123" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <Controller name="idAerolinea" control={control} render={({ field }) => (
              <select value={field.value > 0 ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Seleccione...</option>
                {aerolineasList?.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            )} />
            {errors.idAerolinea && <p className="text-xs text-rose-500">{errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeronave</label>
            <Controller name="idAeronave" control={control} render={({ field }) => (
              <select value={field.value !== undefined && field.value !== null ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Sin asignar</option>
                {aeronavesList?.map((a) => <option key={a.id} value={a.id}>{a.matricula}</option>)}
              </select>
            )} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Origen</label>
            <Input {...register('origen')} placeholder="Ej: BOG" className="font-mono uppercase" />
            {errors.origen && <p className="text-xs text-rose-500">{errors.origen.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Destino</label>
            <Input {...register('destino')} placeholder="Ej: MDE" className="font-mono uppercase" />
            {errors.destino && <p className="text-xs text-rose-500">{errors.destino.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} className="font-mono" />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora Salida</label>
            <Input type="time" {...register('horaSalida')} className="font-mono" />
            {errors.horaSalida && <p className="text-xs text-rose-500">{errors.horaSalida.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hora Llegada</label>
            <Input type="time" {...register('horaLlegada')} className="font-mono" />
            {errors.horaLlegada && <p className="text-xs text-rose-500">{errors.horaLlegada.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <Controller name="estado" control={control} render={({ field }) => (
              <select value={field.value} onChange={(e) => field.onChange(e.target.value)} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="PROGRAMADO">Programado</option>
                <option value="EN_VUELO">En Vuelo</option>
                <option value="ATERRIZADO">Aterrizado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            )} />
            {errors.estado && <p className="text-xs text-rose-500">{errors.estado.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Vuelo" message="¿Está seguro de eliminar este vuelo?" />
    </div>
  )
}
