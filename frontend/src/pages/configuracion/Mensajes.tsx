import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Mensaje } from '@/types'
import { useMensajes } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  titulo: z.string().min(1, 'El título es requerido'),
  contenido: z.string().min(1, 'El contenido es requerido'),
  tipo: z.string().min(1, 'El tipo es requerido'),
})

type FormValues = z.infer<typeof schema>

const tipos = ['INFO', 'SUCCESS', 'WARNING', 'ERROR']

export default function Mensajes() {
  const mensajes = useMensajes()
  const { data, isLoading, error } = mensajes.useList()
  const createMutation = mensajes.useCreate()
  const updateMutation = mensajes.useUpdate()
  const deleteMutation = mensajes.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Mensaje | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { codigo: '', titulo: '', contenido: '', tipo: 'INFO' }

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

  const handleEdit = (item: Mensaje) => { setEditing(item); reset({ codigo: item.codigo, titulo: item.titulo, contenido: item.contenido, tipo: item.tipo }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const variantMap: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
    INFO: 'info', SUCCESS: 'success', WARNING: 'warning', ERROR: 'error',
  }

  const columns: Column<Mensaje>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'titulo', header: 'Título', sortable: true },
    { key: 'tipo', header: 'Tipo', render: (item) => <StatusBadge variant={variantMap[item.tipo] || 'neutral'} label={item.tipo} /> },
    { key: 'leido', header: 'Estado', render: (item) => item.leido ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Mensajes del Sistema" subtitle="Gestión de notificaciones y avisos" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Mensaje</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'titulo']} />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Mensaje'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: BIENVENIDA" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo</label>
            <select {...register('tipo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Título</label>
            <Input {...register('titulo')} placeholder="Ej: Bienvenido al Sistema" />
            {errors.titulo && <p className="text-xs text-rose-500">{errors.titulo.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contenido</label>
            <textarea {...register('contenido')} rows={3} className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="Contenido del mensaje..." />
            {errors.contenido && <p className="text-xs text-rose-500">{errors.contenido.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Mensaje" message="¿Está seguro de eliminar este mensaje?" />
    </div>
  )
}
