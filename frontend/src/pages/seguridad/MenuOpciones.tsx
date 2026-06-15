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
import type { MenuOpcion } from '@/types'
import { useMenuOpciones } from '@/hooks/modules'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  ruta: z.string().min(1, 'La ruta es requerida'),
  icono: z.string().min(1, 'El icono es requerido'),
  idPadre: z.number().nullable().default(null),
  orden: z.number({ invalid_type_error: 'El orden es requerido' }).min(0, 'El orden no puede ser negativo'),
})

type FormValues = z.infer<typeof schema>

export default function MenuOpciones() {
  const menuOpciones = useMenuOpciones()
  const { data, isLoading, error } = menuOpciones.useList()
  const createMutation = menuOpciones.useCreate()
  const updateMutation = menuOpciones.useUpdate()
  const deleteMutation = menuOpciones.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MenuOpcion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { nombre: '', ruta: '', icono: '', idPadre: null, orden: 0 }

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

  const handleEdit = (item: MenuOpcion) => {
    setEditing(item)
    reset({ nombre: item.nombre, ruta: item.ruta, icono: item.icono, idPadre: item.idPadre ?? null, orden: item.orden })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const padres = data.filter((m) => !m.idPadre)

  const getPadreNombre = (idPadre?: number) => {
    if (!idPadre) return ''
    const padre = data.find((m) => m.id === idPadre)
    return padre?.nombre ?? ''
  }

  const columns: Column<MenuOpcion>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (item) => (
      <span className={`font-medium ${item.idPadre ? 'text-slate-600 ml-6' : 'text-slate-900'}`}>
        {item.idPadre && <span className="text-slate-300 mr-2">└─</span>}{item.nombre}
      </span>
    )},
    { key: 'ruta', header: 'Ruta', sortable: true, render: (item) => <span className="font-mono text-xs text-slate-500">{item.ruta}</span> },
    { key: 'icono', header: 'Icono', sortable: true, render: (item) => <span className="font-mono text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{item.icono}</span> },
    { key: 'idPadre', header: 'Padre', sortable: true, render: (item) => {
      const name = getPadreNombre(item.idPadre)
      return name ? <span className="text-sm text-slate-500">{name}</span> : <span className="text-xs text-slate-300 italic">—</span>
    }},
    { key: 'orden', header: 'Orden', sortable: true, render: (item) => <span className="text-sm font-mono text-center w-6 inline-block">{item.orden}</span> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Opciones de Menú" subtitle="Configuración de la navegación del sistema" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Opción</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['nombre', 'ruta']} searchPlaceholder="Buscar opción de menú..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.nombre}` : 'Nueva Opción de Menú'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Aerolíneas" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ruta</label>
            <Input {...register('ruta')} placeholder="Ej: /aerolineas" className="font-mono" />
            {errors.ruta && <p className="text-xs text-rose-500">{errors.ruta.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Icono (lucide-react)</label>
            <Input {...register('icono')} placeholder="Ej: Building2" className="font-mono" />
            {errors.icono && <p className="text-xs text-rose-500">{errors.icono.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Orden</label>
            <Input {...register('orden', { valueAsNumber: true })} type="number" placeholder="Ej: 1" />
            {errors.orden && <p className="text-xs text-rose-500">{errors.orden.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Opción Padre (dejar vacío para menú principal)</label>
            <select {...register('idPadre', { valueAsNumber: true })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
              <option value={0}>— Menú Principal —</option>
              {padres.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.idPadre && <p className="text-xs text-rose-500">{errors.idPadre.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Opción" message="¿Está seguro de eliminar esta opción de menú?" />
    </div>
  )
}
