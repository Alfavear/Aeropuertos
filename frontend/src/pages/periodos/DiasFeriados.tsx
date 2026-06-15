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
import type { DiaFeriado } from '@/types'
import { useDiasFeriados, useAeropuertos } from '@/hooks/modules'

const schema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  idAeropuerto: z.coerce.number().optional(),
})

type FormValues = z.infer<typeof schema>

export default function DiasFeriados() {
  const diasFeriados = useDiasFeriados()
  const { data, isLoading, error } = diasFeriados.useList()
  const createMutation = diasFeriados.useCreate()
  const updateMutation = diasFeriados.useUpdate()
  const deleteMutation = diasFeriados.useRemove()
  const { data: aeropuertos } = useAeropuertos().useList()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DiaFeriado | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { fecha: '', nombre: '', idAeropuerto: undefined }

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

  const handleEdit = (item: DiaFeriado) => {
    setEditing(item)
    reset({ fecha: item.fecha, nombre: item.nombre, idAeropuerto: item.idAeropuerto ?? undefined })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<DiaFeriado>[] = [
    { key: 'fecha', header: 'Fecha', sortable: true, render: (item) => <span className="text-sm">{new Date(item.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Días Feriados" subtitle="Catálogo de días feriados para cálculos de tarifas" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Feriado</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['nombre']} searchPlaceholder="Buscar feriado..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.nombre}` : 'Nuevo Día Feriado'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Año Nuevo" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto (opcional)</label>
              <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value="">Todos los aeropuertos</option>
              {(aeropuertos ?? []).map((a: any) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Feriado" message="¿Está seguro de eliminar este día feriado?" />
    </div>
  )
}
