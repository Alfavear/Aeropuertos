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
import type { NotaContable } from '@/types'
import { useNotasContables } from '@/hooks/modules'

const schema = z.object({
  numero: z.string().min(1, 'El número es requerido'),
  tipo: z.enum(['DEBITO', 'CREDITO']),
  idFactura: z.coerce.number().optional(),
  concepto: z.string().min(1, 'El concepto es requerido'),
  valor: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const facturas = [
  { id: 1, numero: 'FAC-2026-001' },
  { id: 2, numero: 'FAC-2026-002' },
  { id: 3, numero: 'FAC-2026-003' },
  { id: 4, numero: 'FAC-2026-004' },
]

const tipoVariant = (tipo: string) => {
  return tipo === 'DEBITO' ? 'warning' : 'info'
}

export default function NotasContables() {
  const notas = useNotasContables()
  const { data, isLoading, error } = notas.useList()
  const createMutation = notas.useCreate()
  const updateMutation = notas.useUpdate()
  const deleteMutation = notas.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<NotaContable | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { numero: '', tipo: 'DEBITO', idFactura: undefined, concepto: '', valor: 0, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ numero: '', tipo: 'DEBITO', idFactura: undefined, concepto: '', valor: 0, activo: true })
  }

  const handleEdit = (item: NotaContable) => { setEditing(item); reset({ numero: item.numero, tipo: item.tipo, idFactura: item.idFactura, concepto: item.concepto, valor: item.valor, activo: item.activo }); setOpen(true) }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ numero: '', tipo: 'DEBITO', idFactura: undefined, concepto: '', valor: 0, activo: true }); setOpen(true) }

  const columns: Column<NotaContable>[] = [
    { key: 'numero', header: 'Número', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.numero}</span> },
    { key: 'tipo', header: 'Tipo', sortable: true, render: (item) => <StatusBadge variant={tipoVariant(item.tipo)} label={item.tipo} /> },
    { key: 'idFactura', header: 'Factura', sortable: true, render: (item) => item.idFactura ? <span className="font-mono text-xs">{facturas.find((f) => f.id === item.idFactura)?.numero || '—'}</span> : <span className="text-slate-400">Sin factura</span> },
    { key: 'concepto', header: 'Concepto', sortable: true, render: (item) => <span className="max-w-[200px] truncate block">{item.concepto}</span> },
    { key: 'valor', header: 'Valor', sortable: true, render: (item) => <span className="font-semibold">{item.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span> },
    { key: 'activo', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={item.activo ? 'active' : 'inactive'} label={item.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Notas Contables" subtitle="Notas débito y crédito para ajustes de facturación" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Nota</Button>} />
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
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['numero', 'concepto']} searchPlaceholder="Buscar nota contable..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.numero}` : 'Nueva Nota Contable'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Número</label>
            <Input {...register('numero')} placeholder="Ej: NC-2026-001" className="font-mono" />
            {errors.numero && <p className="text-xs text-rose-500">{errors.numero.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo</label>
            <select {...register('tipo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
            </select>
            {errors.tipo && <p className="text-xs text-rose-500">{errors.tipo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Factura (opcional)</label>
            <select {...register('idFactura')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value="">Sin factura</option>
              {facturas.map((f) => <option key={f.id} value={f.id}>{f.numero}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Valor</label>
            <Input type="number" step="0.01" {...register('valor')} />
            {errors.valor && <p className="text-xs text-rose-500">{errors.valor.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Concepto</label>
            <textarea {...register('concepto')} rows={3} placeholder="Describa el motivo de la nota..."
              className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 placeholder:text-slate-400" />
            {errors.concepto && <p className="text-xs text-rose-500">{errors.concepto.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Nota activa" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Nota Contable" message="¿Está seguro de eliminar esta nota contable?" />
    </div>
  )
}
