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
import type { PersonalAerolinea } from '@/types'
import { usePersonalAerolinea, useAerolineas } from '@/hooks/modules'

const schema = z.object({
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  idAerolinea: z.coerce.number().min(1, 'Seleccione una aerolínea'),
  cargo: z.string().min(1, 'El cargo es requerido'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function PersonalAerolinea() {
  const personalAerolinea = usePersonalAerolinea()
  const { data = [], isLoading, error } = personalAerolinea.useList()
  const createMutation = personalAerolinea.useCreate()
  const updateMutation = personalAerolinea.useUpdate()
  const deleteMutation = personalAerolinea.useRemove()

  const aerolineas = useAerolineas()
  const { data: aerolineasData = [] } = aerolineas.useList()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PersonalAerolinea | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombres: '', apellidos: '', idAerolinea: 0, cargo: '', activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ nombres: '', apellidos: '', idAerolinea: 0, cargo: '', activo: true })
  }

  const handleEdit = (item: PersonalAerolinea) => {
    setEditing(item)
    reset({ nombres: item.nombres, apellidos: item.apellidos, idAerolinea: item.idAerolinea, cargo: item.cargo, activo: item.activo })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => {
    setEditing(null)
    reset({ nombres: '', apellidos: '', idAerolinea: 0, cargo: '', activo: true })
    setOpen(true)
  }

  const columns: Column<PersonalAerolinea>[] = [
    { key: 'nombres', header: 'Nombres', sortable: true },
    { key: 'apellidos', header: 'Apellidos', sortable: true },
    { key: 'aerolineaNombre', header: 'Aerolínea', render: (item) => item.aerolineaNombre || '-' },
    { key: 'cargo', header: 'Cargo', sortable: true },
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
      <PageHeader title="Personal de Aerolínea" subtitle="Tripulación y personal asignado" action={
        <Button onClick={handleAdd} disabled={createMutation.isPending || updateMutation.isPending}>
          <Plus className="h-4 w-4" /> Nuevo Personal
        </Button>
      } />

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
        <DataTable columns={columns} data={data} keyExtractor={(i) => i.id} searchKeys={['nombres', 'apellidos', 'cargo']} searchPlaceholder="Buscar personal..." />
      )}

      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.nombres} ${editing.apellidos}` : 'Nuevo Personal'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombres</label>
            <Input {...register('nombres')} placeholder="Nombres" />
            {errors.nombres && <p className="text-xs text-rose-500">{errors.nombres.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Apellidos</label>
            <Input {...register('apellidos')} placeholder="Apellidos" />
            {errors.apellidos && <p className="text-xs text-rose-500">{errors.apellidos.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <select {...register('idAerolinea')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccionar...</option>
              {aerolineasData.map((a) => <option key={a.id} value={a.id}>{a.nombre} ({a.codigo})</option>)}
            </select>
            {errors.idAerolinea && <p className="text-xs text-rose-500">{errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cargo</label>
            <Input {...register('cargo')} placeholder="Ej: Piloto" />
            {errors.cargo && <p className="text-xs text-rose-500">{errors.cargo.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Personal activo" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Personal" message="¿Está seguro de eliminar este registro?" />
    </div>
  )
}
