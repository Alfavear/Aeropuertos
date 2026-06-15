import { useState, useCallback } from 'react'
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
import type { Pasajero } from '@/types'

const schema = z.object({
  idLiquidacion: z.coerce.number().min(1, 'Seleccione una liquidación'),
  tipo: z.string().min(1, 'El tipo es requerido'),
  cantidad: z.coerce.number().min(0, 'No puede ser negativo'),
  valorTasa: z.coerce.number().min(0, 'No puede ser negativo'),
})

type FormValues = z.infer<typeof schema>

const mockData: Pasajero[] = [
  { id: 1, idLiquidacion: 1, tipo: 'NACIONAL', cantidad: 8500, valorTasa: 42000, subtotal: 357000000 },
  { id: 2, idLiquidacion: 1, tipo: 'INTERNACIONAL', cantidad: 3200, valorTasa: 38000, subtotal: 121600000 },
  { id: 3, idLiquidacion: 1, tipo: 'TRANSITO', cantidad: 800, valorTasa: 15000, subtotal: 12000000 },
  { id: 4, idLiquidacion: 2, tipo: 'NACIONAL', cantidad: 9200, valorTasa: 42000, subtotal: 386400000 },
  { id: 5, idLiquidacion: 2, tipo: 'INTERNACIONAL', cantidad: 3800, valorTasa: 38000, subtotal: 144400000 },
  { id: 6, idLiquidacion: 2, tipo: 'TRANSITO', cantidad: 1800, valorTasa: 15000, subtotal: 27000000 },
  { id: 7, idLiquidacion: 3, tipo: 'NACIONAL', cantidad: 3400, valorTasa: 42000, subtotal: 142800000 },
  { id: 8, idLiquidacion: 3, tipo: 'INTERNACIONAL', cantidad: 1200, valorTasa: 38000, subtotal: 45600000 },
]

const liquidaciones = [
  { id: 1, codigo: 'LIQ-2026-001' },
  { id: 2, codigo: 'LIQ-2026-002' },
  { id: 3, codigo: 'LIQ-2026-003' },
]

export default function Pasajeros() {
  const [data, setData] = useState<Pasajero[]>(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pasajero | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { idLiquidacion: 0, tipo: '', cantidad: 0, valorTasa: 0 },
  })

  const cantidad = watch('cantidad')
  const valorTasa = watch('valorTasa')
  const subtotalPreview = (cantidad ?? 0) * (valorTasa ?? 0)

  const onSubmit = (form: FormValues) => {
    const subtotal = form.cantidad * form.valorTasa
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...form, subtotal } : d)))
    } else {
      setData([...data, { ...form, subtotal, id: Date.now() }])
    }
    setOpen(false); setEditing(null)
  }

  const handleEdit = (item: Pasajero) => {
    setEditing(item)
    reset({ idLiquidacion: item.idLiquidacion, tipo: item.tipo, cantidad: item.cantidad, valorTasa: item.valorTasa })
    setOpen(true)
  }
  const handleDelete = () => { if (deleteId) { setData(data.filter((d) => d.id !== deleteId)); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ idLiquidacion: 0, tipo: '', cantidad: 0, valorTasa: 0 }); setOpen(true) }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val)

  const formatNumber = (val: number) =>
    new Intl.NumberFormat('es-CO').format(val)

  const columns: Column<Pasajero>[] = [
    { key: 'idLiquidacion', header: 'Liquidación', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">LIQ-2026-{String(item.idLiquidacion).padStart(3, '0')}</span> },
    { key: 'tipo', header: 'Tipo', sortable: true, render: (item) => <span className="text-xs font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.tipo}</span> },
    { key: 'cantidad', header: 'Cantidad', sortable: true, render: (item) => <span className="font-mono text-sm">{formatNumber(item.cantidad)}</span> },
    { key: 'valorTasa', header: 'Valor Tasa', sortable: true, render: (item) => <span className="font-mono text-sm">{formatCurrency(item.valorTasa)}</span> },
    { key: 'subtotal', header: 'Subtotal', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-emerald-600">{formatCurrency(item.subtotal)}</span> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Pasajeros" subtitle="Registro de pasajeros por tipo en liquidaciones" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Registro</Button>} />
      <DataTable columns={columns} data={data} keyExtractor={(i) => i.id} searchKeys={['tipo']} searchPlaceholder="Buscar por tipo de pasajero..." />
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.tipo} - LIQ-${String(editing.idLiquidacion).padStart(3, '0')}` : 'Nuevo Registro de Pasajeros'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Liquidación</label>
            <select {...register('idLiquidacion')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value={0}>Seleccione...</option>
              {liquidaciones.map((l) => <option key={l.id} value={l.id}>{l.codigo}</option>)}
            </select>
            {errors.idLiquidacion && <p className="text-xs text-rose-500">{errors.idLiquidacion.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tipo</label>
            <Input {...register('tipo')} placeholder="Ej: NACIONAL, INTERNACIONAL, TRANSITO" className="uppercase" />
            {errors.tipo && <p className="text-xs text-rose-500">{errors.tipo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cantidad</label>
            <Input type="number" {...register('cantidad')} placeholder="0" />
            {errors.cantidad && <p className="text-xs text-rose-500">{errors.cantidad.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Valor Tasa</label>
            <Input type="number" {...register('valorTasa')} placeholder="0" />
            {errors.valorTasa && <p className="text-xs text-rose-500">{errors.valorTasa.message}</p>}
          </div>
          <div className="col-span-2 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Subtotal calculado</span>
            <span className="font-mono text-lg font-bold text-emerald-600">{formatCurrency(subtotalPreview)}</span>
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Registro" message="¿Está seguro de eliminar este registro de pasajeros?" />
    </div>
  )
}
