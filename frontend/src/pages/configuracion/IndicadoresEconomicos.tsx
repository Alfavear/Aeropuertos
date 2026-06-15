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
import type { IndicadorEconomico } from '@/types'
import { useIndicadoresEconomicos } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  valor: z.coerce.number().min(0, 'Debe ser un valor positivo'),
  fecha: z.string().min(1, 'La fecha es requerida'),
})

type FormValues = z.infer<typeof schema>

export default function IndicadoresEconomicos() {
  const indicadoresEconomicos = useIndicadoresEconomicos()
  const { data, isLoading, error } = indicadoresEconomicos.useList()
  const createMutation = indicadoresEconomicos.useCreate()
  const updateMutation = indicadoresEconomicos.useUpdate()
  const deleteMutation = indicadoresEconomicos.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IndicadorEconomico | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { codigo: '', nombre: '', valor: 0, fecha: '' }

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

  const handleEdit = (item: IndicadorEconomico) => { setEditing(item); reset({ codigo: item.codigo, nombre: item.nombre, valor: item.valor, fecha: item.fecha }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<IndicadorEconomico>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'valor', header: 'Valor', sortable: true, render: (item) => <span className="font-mono font-semibold">{item.valor.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span> },
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Indicadores Económicos" subtitle="TRM, IPC, UVT y otros indicadores" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Indicador</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre']} />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Indicador'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: TRM" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Tasa Representativa del Mercado" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Valor</label>
            <Input type="number" step="0.01" {...register('valor')} placeholder="4150.50" className="font-mono" />
            {errors.valor && <p className="text-xs text-rose-500">{errors.valor.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Indicador" message="¿Está seguro de eliminar este indicador?" />
    </div>
  )
}
