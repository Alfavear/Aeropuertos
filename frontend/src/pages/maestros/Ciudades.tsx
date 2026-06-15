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
import type { Ciudad } from '@/types'
import { useCiudades, usePaises } from '@/hooks/modules'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  idPais: z.coerce.number().min(1, 'Seleccione un país'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Ciudades() {
  const ciudades = useCiudades()
  const { data = [], isLoading, error } = ciudades.useList()
  const createMutation = ciudades.useCreate()
  const updateMutation = ciudades.useUpdate()
  const deleteMutation = ciudades.useRemove()

  const paises = usePaises()
  const { data: paisesData = [] } = paises.useList()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Ciudad | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: '', idPais: 0, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ nombre: '', idPais: 0, activo: true })
  }

  const handleEdit = (item: Ciudad) => {
    setEditing(item)
    reset({ nombre: item.nombre, idPais: item.idPais, activo: item.activo })
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
    reset({ nombre: '', idPais: 0, activo: true })
    setOpen(true)
  }

  const columns: Column<Ciudad>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'paisNombre', header: 'País', sortable: true, render: (item) => item.paisNombre || '-' },
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
        title="Ciudades"
        subtitle="Catálogo de ciudades por país"
        action={
          <Button onClick={handleAdd} disabled={createMutation.isPending || updateMutation.isPending}>
            <Plus className="h-4 w-4" />
            Nueva Ciudad
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
          searchKeys={['nombre', 'paisNombre']}
          searchPlaceholder="Buscar por ciudad o país..."
          emptyTitle="No hay ciudades registradas"
          emptyDescription="Agregue una nueva ciudad para comenzar."
        />
      )}

      <CrudModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Editar Ciudad: ${editing.nombre}` : 'Nueva Ciudad'}
        isEditing={!!editing}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Bogotá" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">País</label>
            <select {...register('idPais')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
              <option value={0}>Seleccionar país...</option>
              {paisesData.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>
              ))}
            </select>
            {errors.idPais && <p className="text-xs text-rose-500">{errors.idPais.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Ciudad activa" />} />
          </div>
        </div>
      </CrudModal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
        onConfirm={handleDelete}
        title="Eliminar Ciudad"
        message="¿Está seguro de eliminar esta ciudad?"
        confirmLabel="Eliminar"
      />
    </div>
  )
}
