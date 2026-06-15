import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Controller } from 'react-hook-form'
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
import type { Pais } from '@/types'
import { usePaises } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(2, 'Mínimo 2 caracteres').regex(/^[A-Z]{2}$/, 'ISO 3166-1 alpha-2 (Ej: CO, US)'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  nacionalidad: z.string().optional(),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Paises() {
  const paises = usePaises()
  const { data = [], isLoading, error } = paises.useList()
  const createMutation = paises.useCreate()
  const updateMutation = paises.useUpdate()
  const deleteMutation = paises.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pais | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', nombre: '', nacionalidad: '', activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '', nacionalidad: '', activo: true })
  }

  const handleEdit = (item: Pais) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, nacionalidad: item.nacionalidad || '', activo: item.activo })
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
    reset({ codigo: '', nombre: '', nacionalidad: '', activo: true })
    setOpen(true)
  }

  const columns: Column<Pais>[] = [
    {
      key: 'codigo',
      header: 'Código',
      sortable: true,
      render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span>,
    },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'nacionalidad', header: 'Nacionalidad', render: (item) => item.nacionalidad || '-' },
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
        title="Países"
        subtitle="Catálogo de países según norma ISO 3166-1"
        action={
          <Button onClick={handleAdd} disabled={createMutation.isPending || updateMutation.isPending}>
            <Plus className="h-4 w-4" />
            Nuevo País
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
          searchKeys={['nombre', 'codigo', 'nacionalidad']}
          searchPlaceholder="Buscar por código, nombre o nacionalidad..."
          emptyTitle="No hay países registrados"
          emptyDescription="Agregue un nuevo país para comenzar."
        />
      )}

      <CrudModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Editar País: ${editing.codigo}` : 'Nuevo País'}
        isEditing={!!editing}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código ISO</label>
            <Input {...register('codigo')} placeholder="Ej: CO" className="font-mono uppercase" maxLength={2} />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Colombia" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nacionalidad</label>
            <Input {...register('nacionalidad')} placeholder="Ej: Colombiana" />
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="País activo" />} />
          </div>
        </div>
      </CrudModal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
        onConfirm={handleDelete}
        title="Eliminar País"
        message="¿Está seguro de eliminar este país? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
      />
    </div>
  )
}
