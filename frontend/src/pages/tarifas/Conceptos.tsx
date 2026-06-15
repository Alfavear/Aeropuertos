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
import type { Concepto } from '@/types'
import { useConceptos, useGruposConcepto } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  tipo: z.enum(['INGRESO', 'EGRESO']),
  idGrupo: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
    z.number().optional()
  ),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Conceptos() {
  const conceptos = useConceptos()
  const gruposConcepto = useGruposConcepto()
  const { data, isLoading, error } = conceptos.useList()
  const { data: gruposConceptoList } = gruposConcepto.useList()
  const createMutation = conceptos.useCreate()
  const updateMutation = conceptos.useUpdate()
  const deleteMutation = conceptos.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Concepto | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', nombre: '', descripcion: '', tipo: 'INGRESO', idGrupo: undefined, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '', descripcion: '', tipo: 'INGRESO', idGrupo: undefined, activo: true })
  }

  const handleEdit = (item: Concepto) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, descripcion: item.descripcion || '', tipo: item.tipo, idGrupo: item.idGrupo, activo: item.activo })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', nombre: '', descripcion: '', tipo: 'INGRESO', idGrupo: undefined, activo: true }); setOpen(true) }

  const columns: Column<Concepto>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'tipo', header: 'Tipo', sortable: true, render: (item) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.tipo === 'INGRESO' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
        {item.tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'}
      </span>
    )},
    { key: 'idGrupo', header: 'Grupo', render: (item) => <span className="text-slate-500">{item.grupoNombre || '—'}</span> },
    { key: 'activo', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={statusVariant(item.activo)} label={item.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Conceptos de Tarifas" subtitle="Catálogo de conceptos de facturación" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Concepto</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre', 'tipo']} searchPlaceholder="Buscar concepto..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Concepto'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: ATR" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Aterrizaje" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Descripción</label>
            <Input {...register('descripcion')} placeholder="Descripción opcional del concepto" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo</label>
            <Controller name="tipo" control={control} render={({ field }) => (
              <select value={field.value} onChange={(e) => field.onChange(e.target.value as 'INGRESO' | 'EGRESO')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="INGRESO">Ingreso</option>
                <option value="EGRESO">Egreso</option>
              </select>
            )} />
            {errors.tipo && <p className="text-xs text-rose-500">{errors.tipo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Grupo</label>
            <Controller name="idGrupo" control={control} render={({ field }) => (
              <select value={field.value !== undefined && field.value !== null ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Sin grupo</option>
                {gruposConceptoList?.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            )} />
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Concepto activo" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Concepto" message="¿Está seguro de eliminar este concepto?" />
    </div>
  )
}
