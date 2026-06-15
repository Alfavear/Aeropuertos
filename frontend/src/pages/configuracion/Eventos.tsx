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
import type { Evento } from '@/types'
import { useEventos } from '@/hooks/modules'

const schema = z.object({
  codigoTipo: z.string().min(1, 'El tipo de evento es requerido'),
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  deshabilitar: z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

export default function Eventos() {
  const eventos = useEventos()
  const { data, isLoading, error } = eventos.useList()
  const createMutation = eventos.useCreate()
  const updateMutation = eventos.useUpdate()
  const deleteMutation = eventos.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Evento | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { codigoTipo: '', codigo: '', nombre: '', descripcion: '', deshabilitar: false }

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

  const handleEdit = (item: Evento) => { setEditing(item); reset({ codigoTipo: item.codigoTipo, codigo: item.codigo, nombre: item.nombre, descripcion: item.descripcion || '', deshabilitar: item.deshabilitar }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<Evento>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'codigoTipo', header: 'Tipo', sortable: true, render: (item) => <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-200">{item.codigoTipo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'descripcion', header: 'Descripción', sortable: true, render: (item) => <span className="text-sm text-slate-500 truncate block max-w-[250px]">{item.descripcion || '—'}</span> },
    { key: 'deshabilitar', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={statusVariant(!item.deshabilitar)} label={item.deshabilitar ? 'Deshabilitado' : 'Habilitado'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Eventos" subtitle="Catálogo de eventos del sistema" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Evento</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre', 'codigoTipo']} searchPlaceholder="Buscar evento..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Evento'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo de Evento</label>
            <Input {...register('codigoTipo')} placeholder="Ej: MANTENIMIENTO" className="font-mono uppercase" />
            {errors.codigoTipo && <p className="text-xs text-rose-500">{errors.codigoTipo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: MTTO-PISTA" className="font-mono" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Mantenimiento de Pista" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Descripción</label>
            <textarea {...register('descripcion')} rows={3} placeholder="Descripción del evento..." className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none" />
            {errors.descripcion && <p className="text-xs text-rose-500">{errors.descripcion.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="deshabilitar" control={control} render={({ field }) => <ToggleSwitch field={field} label="Deshabilitar evento" enabledLabel="Deshabilitado" disabledLabel="Habilitado" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Evento" message="¿Está seguro de eliminar este evento?" />
    </div>
  )
}
