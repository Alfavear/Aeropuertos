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
import type { CodigoAeronautico } from '@/types'
import { useCodigosAeronauticos } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  tipo: z.coerce.number().min(1, 'Seleccione un tipo'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
})

type FormValues = z.infer<typeof schema>

const tipos = [
  { value: 1, label: 'OACI Aerolínea' },
  { value: 2, label: 'IATA Aerolínea' },
  { value: 3, label: 'OACI Aeropuerto' },
  { value: 4, label: 'IATA Aeropuerto' },
]

export default function CodigosAeronauticos() {
  const codigosAeronauticos = useCodigosAeronauticos()
  const { data, isLoading, error } = codigosAeronauticos.useList()
  const createMutation = codigosAeronauticos.useCreate()
  const updateMutation = codigosAeronauticos.useUpdate()
  const deleteMutation = codigosAeronauticos.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CodigoAeronautico | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const defaultValues = { codigo: '', tipo: 1, descripcion: '' }

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

  const handleEdit = (item: CodigoAeronautico) => { setEditing(item); reset({ codigo: item.codigo, tipo: item.tipo, descripcion: item.descripcion }); setOpen(true) }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const columns: Column<CodigoAeronautico>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'tipo', header: 'Tipo', sortable: true, render: (item) => <span className="text-xs bg-slate-100 px-2 py-1 rounded">{tipos.find(t => t.value === item.tipo)?.label || item.tipo}</span> },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Códigos Aeronáuticos" subtitle="Códigos OACI e IATA" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Código</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'descripcion']} />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Código'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: SKBO" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo</label>
            <select {...register('tipo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Descripción</label>
            <Input {...register('descripcion')} placeholder="Ej: Aeropuerto El Dorado (OACI)" />
            {errors.descripcion && <p className="text-xs text-rose-500">{errors.descripcion.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Código" message="¿Está seguro de eliminar este código?" />
    </div>
  )
}
