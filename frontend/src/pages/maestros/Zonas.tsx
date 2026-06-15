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
import type { Zona } from '@/types'
import { useZonas } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Zonas() {
  const zonas = useZonas()
  const { data = [], isLoading, error } = zonas.useList()
  const createMutation = zonas.useCreate()
  const updateMutation = zonas.useUpdate()
  const deleteMutation = zonas.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Zona | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', nombre: '', activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '', activo: true })
  }

  const handleEdit = (item: Zona) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, activo: item.activo })
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
    reset({ codigo: '', nombre: '', activo: true })
    setOpen(true)
  }

  const columns: Column<Zona>[] = [
    {
      key: 'codigo',
      header: 'Código',
      sortable: true,
      render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span>,
    },
    { key: 'nombre', header: 'Nombre', sortable: true },
    {
      key: 'activo',
      header: 'Estado',
      sortable: true,
      render: (item) => <StatusBadge variant={statusVariant(item.activo)} label={item.activo ? 'Activo' : 'Inactivo'} />,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      className: 'text-right',
      render: (item) => (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zonas"
        subtitle="Catálogo de zonas geográficas"
        action={
          <Button onClick={handleAdd} disabled={createMutation.isPending || updateMutation.isPending}>
            <Plus className="h-4 w-4" />
            Nueva Zona
          </Button>
        }
      />

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
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(item) => item.id}
          searchKeys={['codigo', 'nombre']}
          searchPlaceholder="Buscar por código o nombre..."
          emptyTitle="No hay zonas registradas"
        />
      )}

      <CrudModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Editar Zona: ${editing.codigo}` : 'Nueva Zona'}
        isEditing={!!editing}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: NORTE" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Zona Norte" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Zona activa" />} />
          </div>
        </div>
      </CrudModal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
        onConfirm={handleDelete}
        title="Eliminar Zona"
        message="¿Está seguro de eliminar esta zona?"
        confirmLabel="Eliminar"
      />
    </div>
  )
}
