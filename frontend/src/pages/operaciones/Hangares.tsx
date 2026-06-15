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
import { StatusBadge, statusVariant } from '@/components/shared/StatusBadge'
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Hangar } from '@/types'
import { useHangares } from '@/hooks/modules'
import { useAeropuertos } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  idAeropuerto: z.coerce.number().min(1, 'Seleccione un aeropuerto'),
  capacidad: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Hangares() {
  const hangares = useHangares()
  const { data, isLoading, error } = hangares.useList()
  const createMutation = hangares.useCreate()
  const updateMutation = hangares.useUpdate()
  const deleteMutation = hangares.useRemove()
  const { data: aeropuertosList } = useAeropuertos().useList()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Hangar | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', nombre: '', idAeropuerto: 0, capacidad: 1, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '', idAeropuerto: 0, capacidad: 1, activo: true })
  }

  const handleEdit = (item: Hangar) => { setEditing(item); reset({ codigo: item.codigo, nombre: item.nombre, idAeropuerto: item.idAeropuerto, capacidad: item.capacidad, activo: item.activo }); setOpen(true) }
  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', nombre: '', idAeropuerto: 0, capacidad: 1, activo: true }); setOpen(true) }

  const columns: Column<Hangar>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'aeropuertoNombre', header: 'Aeropuerto', render: (item) => item.aeropuertoNombre || '-' },
    { key: 'capacidad', header: 'Capacidad', sortable: true, render: (item) => item.capacidad + ' aeronave(s)' },
    { key: 'activo', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={statusVariant(item.activo)} label={item.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Hangares" subtitle="Infraestructura de hangares por aeropuerto" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Hangar</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre']} searchPlaceholder="Buscar hangar..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? 'Editar: ' + editing.codigo : 'Nuevo Hangar'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: HG-01" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Hangar Principal" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto</label>
            <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccionar...</option>
              {aeropuertosList?.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAeropuerto && <p className="text-xs text-rose-500">{errors.idAeropuerto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Capacidad (aeronaves)</label>
            <Input type="number" min="1" {...register('capacidad')} placeholder="3" className="font-mono" />
            {errors.capacidad && <p className="text-xs text-rose-500">{errors.capacidad.message}</p>}
          </div>
          <div className="flex items-end p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Hangar activo" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Hangar" message="¿Est\u00e1 seguro de eliminar este hangar?" />
    </div>
  )
}
