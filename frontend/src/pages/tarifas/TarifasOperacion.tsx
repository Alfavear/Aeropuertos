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
import type { TarifaOperacion } from '@/types'
import { useConceptos, useTiposOperacion, useTarifasOperacion } from '@/hooks/modules'
import { useTiposAeronave } from '@/hooks/modules'

const schema = z.object({
  idConcepto: z.coerce.number().min(1, 'El concepto es requerido'),
  idTipoOperacion: z.coerce.number().min(1, 'El tipo de operación es requerido'),
  idTipoAeronave: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : Number(v)),
    z.number().optional()
  ),
  pesoMin: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  pesoMax: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  valor: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  moneda: z.enum(['COP', 'USD']),
  activo: z.boolean().default(true),
}).refine((data) => data.pesoMax > data.pesoMin, {
  message: 'Peso máximo debe ser mayor al peso mínimo',
  path: ['pesoMax'],
})

type FormValues = z.infer<typeof schema>

export default function TarifasOperacion() {
  const tarifasOperacion = useTarifasOperacion()
  const { data, isLoading, error } = tarifasOperacion.useList()
  const createMutation = tarifasOperacion.useCreate()
  const updateMutation = tarifasOperacion.useUpdate()
  const deleteMutation = tarifasOperacion.useRemove()
  const { data: conceptosList } = useConceptos().useList()
  const { data: tiposOperacionList } = useTiposOperacion().useList()
  const { data: tiposAeronaveList } = useTiposAeronave().useList()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TarifaOperacion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { idConcepto: 0, idTipoOperacion: 0, idTipoAeronave: undefined, pesoMin: 0, pesoMax: 0, valor: 0, moneda: 'COP', activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false)
    setEditing(null)
    reset({ idConcepto: 0, idTipoOperacion: 0, idTipoAeronave: undefined, pesoMin: 0, pesoMax: 0, valor: 0, moneda: 'COP', activo: true })
  }

  const handleEdit = (item: TarifaOperacion) => {
    setEditing(item)
    reset({ idConcepto: item.idConcepto, idTipoOperacion: item.idTipoOperacion, idTipoAeronave: item.idTipoAeronave, pesoMin: item.pesoMin, pesoMax: item.pesoMax, valor: item.valor, moneda: item.moneda, activo: item.activo })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }
  const handleAdd = () => { setEditing(null); reset({ idConcepto: 0, idTipoOperacion: 0, idTipoAeronave: undefined, pesoMin: 0, pesoMax: 0, valor: 0, moneda: 'COP', activo: true }); setOpen(true) }

  const conceptoName = (id: number) => conceptosList?.find((c) => c.id === id)?.nombre || `#${id}`
  const tipoOpName = (id: number) => tiposOperacionList?.find((t) => t.id === id)?.nombre || `#${id}`
  const tipoAerName = (id?: number) => id ? tiposAeronaveList?.find((t) => t.id === id)?.nombre || `#${id}` : '—'

  const columns: Column<TarifaOperacion>[] = [
    { key: 'idConcepto', header: 'Concepto', sortable: true, render: (item) => <span className="font-medium">{conceptoName(item.idConcepto)}</span> },
    { key: 'idTipoOperacion', header: 'Tipo Operación', sortable: true, render: (item) => tipoOpName(item.idTipoOperacion) },
    { key: 'idTipoAeronave', header: 'Aeronave', render: (item) => <span className="text-slate-500">{tipoAerName(item.idTipoAeronave)}</span> },
    { key: 'pesoMin', header: 'Peso Mín (kg)', sortable: true, render: (item) => <span className="font-mono text-sm">{item.pesoMin.toLocaleString()}</span> },
    { key: 'pesoMax', header: 'Peso Máx (kg)', sortable: true, render: (item) => <span className="font-mono text-sm">{item.pesoMax.toLocaleString()}</span> },
    { key: 'valor', header: 'Valor', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold">{item.valor.toLocaleString()}</span> },
    { key: 'moneda', header: 'Moneda', render: (item) => <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{item.moneda}</span> },
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
      <PageHeader title="Tarifas de Operación" subtitle="Tarifas por operación y rango de peso" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Tarifa</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['moneda', 'valor']} searchPlaceholder="Buscar tarifa..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? 'Editar Tarifa' : 'Nueva Tarifa de Operación'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)} size="lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Concepto</label>
            <Controller name="idConcepto" control={control} render={({ field }) => (
              <select value={field.value > 0 ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Seleccione...</option>
                {conceptosList?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            )} />
            {errors.idConcepto && <p className="text-xs text-rose-500">{errors.idConcepto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo Operación</label>
            <Controller name="idTipoOperacion" control={control} render={({ field }) => (
              <select value={field.value > 0 ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Seleccione...</option>
                {tiposOperacionList?.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            )} />
            {errors.idTipoOperacion && <p className="text-xs text-rose-500">{errors.idTipoOperacion.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo Aeronave</label>
            <Controller name="idTipoAeronave" control={control} render={({ field }) => (
              <select value={field.value !== undefined && field.value !== null ? String(field.value) : ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="">Todas</option>
                {tiposAeronaveList?.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            )} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Peso Mín (kg)</label>
            <Input type="number" min="0" step="1" {...register('pesoMin')} placeholder="0" className="font-mono" />
            {errors.pesoMin && <p className="text-xs text-rose-500">{errors.pesoMin.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Peso Máx (kg)</label>
            <Input type="number" min="0" step="1" {...register('pesoMax')} placeholder="50000" className="font-mono" />
            {errors.pesoMax && <p className="text-xs text-rose-500">{errors.pesoMax.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Valor</label>
            <Input type="number" min="0" step="0.01" {...register('valor')} placeholder="150000" className="font-mono" />
            {errors.valor && <p className="text-xs text-rose-500">{errors.valor.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Moneda</label>
            <Controller name="moneda" control={control} render={({ field }) => (
              <select value={field.value} onChange={(e) => field.onChange(e.target.value as 'COP' | 'USD')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
                <option value="COP">COP</option>
                <option value="USD">USD</option>
              </select>
            )} />
            {errors.moneda && <p className="text-xs text-rose-500">{errors.moneda.message}</p>}
          </div>
          <div className="col-span-3 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Tarifa activa" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Tarifa" message="¿Está seguro de eliminar esta tarifa de operación?" />
    </div>
  )
}
