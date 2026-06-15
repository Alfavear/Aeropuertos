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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Secuencia } from '@/types'
import { useSecuencias } from '@/hooks/modules'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  prefijo: z.string().min(1, 'El prefijo es requerido'),
  consecutivo: z.coerce.number().min(1, 'Debe ser mayor a 0'),
  longitud: z.coerce.number().min(1, 'Debe ser mayor a 0'),
})

type FormValues = z.infer<typeof schema>

export default function Secuencias() {
  const secuencias = useSecuencias()
  const { data, isLoading, error } = secuencias.useList()
  const createMutation = secuencias.useCreate()
  const updateMutation = secuencias.useUpdate()
  const deleteMutation = secuencias.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Secuencia | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { nombre: '', prefijo: '', consecutivo: 1, longitud: 8 }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
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

  const handleEdit = (item: Secuencia) => { setEditing(item); reset({ nombre: item.nombre, prefijo: item.prefijo, consecutivo: item.consecutivo, longitud: item.longitud }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<Secuencia>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'prefijo', header: 'Prefijo', sortable: true, render: (item) => <span className="font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">{item.prefijo}</span> },
    { key: 'consecutivo', header: 'Siguiente', sortable: true, render: (item) => <span className="font-mono">{String(item.consecutivo).padStart(item.longitud, '0')}</span> },
    { key: 'longitud', header: 'Longitud', render: (item) => `${item.longitud} dígitos` },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Secuencias" subtitle="Consecutivos automáticos del sistema" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Secuencia</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['nombre', 'prefijo']} />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.nombre}` : 'Nueva Secuencia'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Facturas" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Prefijo</label>
            <Input {...register('prefijo')} placeholder="Ej: FAC" className="font-mono uppercase" />
            {errors.prefijo && <p className="text-xs text-rose-500">{errors.prefijo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Longitud</label>
            <Input type="number" {...register('longitud')} placeholder="8" className="font-mono" />
            {errors.longitud && <p className="text-xs text-rose-500">{errors.longitud.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Siguiente Consecutivo</label>
            <Input type="number" {...register('consecutivo')} placeholder="10245" className="font-mono" />
            {errors.consecutivo && <p className="text-xs text-rose-500">{errors.consecutivo.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Secuencia" message="¿Está seguro de eliminar esta secuencia?" />
    </div>
  )
}
