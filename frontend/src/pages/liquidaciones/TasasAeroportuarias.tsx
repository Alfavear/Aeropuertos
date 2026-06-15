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
import type { Tasa } from '@/types'
import { useTasas } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  valor: z.coerce.number().positive('El valor debe ser positivo'),
  moneda: z.enum(['COP', 'USD']),
  idAeropuerto: z.coerce.number().optional(),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const aeropuertos = [
  { id: 1, nombre: 'Aeropuerto El Dorado' },
  { id: 2, nombre: 'Aeropuerto José María Córdova' },
]

export default function TasasAeroportuarias() {
  const tasas = useTasas()
  const { data, isLoading, error } = tasas.useList()
  const createMutation = tasas.useCreate()
  const updateMutation = tasas.useUpdate()
  const deleteMutation = tasas.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tasa | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', nombre: '', valor: 0, moneda: 'COP', idAeropuerto: undefined, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ codigo: '', nombre: '', valor: 0, moneda: 'COP', idAeropuerto: undefined, activo: true })
  }

  const handleEdit = (item: Tasa) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, valor: item.valor, moneda: item.moneda, idAeropuerto: item.idAeropuerto ?? undefined, activo: item.activo })
    setOpen(true)
  }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', nombre: '', valor: 0, moneda: 'COP', idAeropuerto: undefined, activo: true }); setOpen(true) }

  const formatCurrency = (val: number, moneda: string) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: moneda, minimumFractionDigits: 0 }).format(val)

  const columns: Column<Tasa>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'valor', header: 'Valor', sortable: true, render: (item) => <span className="font-mono text-sm">{formatCurrency(item.valor, item.moneda)}</span> },
    { key: 'moneda', header: 'Moneda', sortable: true, render: (item) => <span className="text-xs font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.moneda}</span> },
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
      <PageHeader title="Tasas Aeroportuarias" subtitle="Configuración de tasas aplicables a pasajeros" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Tasa</Button>} />
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
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre']} searchPlaceholder="Buscar tasa..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nueva Tasa Aeroportuaria'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: TUA-NAC" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: TUA Nacional" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Valor</label>
            <Input type="number" {...register('valor')} placeholder="0" />
            {errors.valor && <p className="text-xs text-rose-500">{errors.valor.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Moneda</label>
            <select {...register('moneda')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto (opcional)</label>
            <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400">
              <option value="">Todos los aeropuertos</option>
              {aeropuertos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Tasa activa" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Tasa" message="¿Está seguro de eliminar esta tasa aeroportuaria?" />
    </div>
  )
}
