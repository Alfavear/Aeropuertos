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
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Aplicacion } from '@/types'
import { useAplicaciones } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  habilitada: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Aplicaciones() {
  const aplicaciones = useAplicaciones()
  const { data, isLoading, error } = aplicaciones.useList()
  const createMutation = aplicaciones.useCreate()
  const updateMutation = aplicaciones.useUpdate()
  const deleteMutation = aplicaciones.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Aplicacion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { codigo: '', nombre: '', descripcion: '', habilitada: true }

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset(defaultValues)
  }

  const handleEdit = (item: Aplicacion) => { setEditing(item); reset({ codigo: item.codigo, nombre: item.nombre, descripcion: item.descripcion || '', habilitada: item.habilitada }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<Aplicacion>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'descripcion', header: 'Descripción', sortable: false, render: (item) => <span className="text-slate-500 max-w-[300px] truncate block">{item.descripcion || '—'}</span> },
    { key: 'habilitada', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={item.habilitada ? 'active' : 'inactive'} label={item.habilitada ? 'Habilitada' : 'Deshabilitada'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Aplicaciones" subtitle="Feature toggles del sistema" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Aplicación</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre', 'descripcion']} searchPlaceholder="Buscar aplicación..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nueva Aplicación'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: FACTURACION_ELECTRONICA" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Facturación Electrónica" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Descripción</label>
            <textarea {...register('descripcion')} rows={3} placeholder="Describa el propósito de esta aplicación..."
              className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 placeholder:text-slate-400" />
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="habilitada" control={control} render={({ field }) => <ToggleSwitch field={field} label="Aplicación habilitada" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Aplicación" message="¿Está seguro de eliminar esta aplicación?" />
    </div>
  )
}
