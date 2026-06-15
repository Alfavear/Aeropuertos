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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { AcuerdoPago } from '@/types'
import { useAcuerdosPago } from '@/hooks/modules'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  idAerolinea: z.coerce.number().min(1, 'Seleccione una aerolínea'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  monto: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  saldo: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  estado: z.enum(['ACTIVO', 'PAGADO', 'VENCIDO']),
})

type FormValues = z.infer<typeof schema>

const aerolineas = [
  { id: 1, nombre: 'Avianca' },
  { id: 2, nombre: 'LATAM Airlines' },
  { id: 3, nombre: 'American Airlines' },
  { id: 4, nombre: 'JetBlue' },
  { id: 5, nombre: 'Spirit Airlines' },
]

const estadoVariant = (estado: string) => {
  switch (estado) {
    case 'ACTIVO': return 'success'
    case 'PAGADO': return 'info'
    case 'VENCIDO': return 'error'
    default: return 'neutral'
  }
}

export default function AcuerdosPago() {
  const acuerdos = useAcuerdosPago()
  const { data, isLoading, error } = acuerdos.useList()
  const createMutation = acuerdos.useCreate()
  const updateMutation = acuerdos.useUpdate()
  const deleteMutation = acuerdos.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AcuerdoPago | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: '', idAerolinea: 0, fecha: '', monto: 0, saldo: 0, estado: 'ACTIVO' },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ codigo: '', idAerolinea: 0, fecha: '', monto: 0, saldo: 0, estado: 'ACTIVO' })
  }

  const handleEdit = (item: AcuerdoPago) => { setEditing(item); reset({ codigo: item.codigo, idAerolinea: item.idAerolinea, fecha: item.fecha, monto: item.monto, saldo: item.saldo, estado: item.estado as FormValues['estado'] }); setOpen(true) }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ codigo: '', idAerolinea: 0, fecha: '', monto: 0, saldo: 0, estado: 'ACTIVO' }); setOpen(true) }

  const columns: Column<AcuerdoPago>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'aerolineaNombre', header: 'Aerolínea', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'monto', header: 'Monto', sortable: true, render: (item) => <span>{item.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span> },
    { key: 'saldo', header: 'Saldo', sortable: true, render: (item) => <span className="font-semibold">{item.saldo.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span> },
    { key: 'estado', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={estadoVariant(item.estado)} label={item.estado} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Acuerdos de Pago" subtitle="Gestión de acuerdos de pago con aerolíneas" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Acuerdo</Button>} />
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
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'aerolineaNombre']} searchPlaceholder="Buscar acuerdo de pago..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Acuerdo de Pago'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: AP-2026-001" className="font-mono" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-xs text-rose-500">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <select {...register('idAerolinea')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccione...</option>
              {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAerolinea && <p className="text-xs text-rose-500">{errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <select {...register('estado')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value="ACTIVO">Activo</option>
              <option value="PAGADO">Pagado</option>
              <option value="VENCIDO">Vencido</option>
            </select>
            {errors.estado && <p className="text-xs text-rose-500">{errors.estado.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Monto</label>
            <Input type="number" step="0.01" {...register('monto')} />
            {errors.monto && <p className="text-xs text-rose-500">{errors.monto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Saldo</label>
            <Input type="number" step="0.01" {...register('saldo')} />
            {errors.saldo && <p className="text-xs text-rose-500">{errors.saldo.message}</p>}
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Acuerdo" message="¿Está seguro de eliminar este acuerdo de pago?" />
    </div>
  )
}
