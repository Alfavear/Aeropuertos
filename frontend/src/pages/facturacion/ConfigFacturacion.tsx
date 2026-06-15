import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge, statusVariant } from '@/components/shared/StatusBadge'
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { ConfigFacturacion } from '@/types'
import { useConfigFacturacion } from '@/hooks/modules'

const schema = z.object({
  idAerolinea: z.coerce.number().min(1, 'Seleccione una aerolínea'),
  idConcepto: z.coerce.number().min(1, 'Seleccione un concepto'),
  idAeropuerto: z.coerce.number().optional(),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const aerolineas = [
  { id: 1, nombre: 'Avianca' },
  { id: 2, nombre: 'LATAM Airlines' },
  { id: 3, nombre: 'American Airlines' },
  { id: 4, nombre: 'JetBlue' },
  { id: 5, nombre: 'Spirit Airlines' },
]

const conceptos = [
  { id: 1, nombre: 'Aterrizaje' },
  { id: 2, nombre: 'Parqueo' },
  { id: 3, nombre: 'Hangar' },
  { id: 4, nombre: 'Puente de Abordaje' },
  { id: 5, nombre: 'Asistencia en Tierra' },
]

const aeropuertos = [
  { id: 1, nombre: 'El Dorado (BOG)' },
  { id: 2, nombre: 'José María Córdova (MDE)' },
  { id: 3, nombre: 'Rafael Núñez (CTG)' },
]

export default function ConfigFacturacion() {
  const config = useConfigFacturacion()
  const { data, isLoading, error } = config.useList()
  const createMutation = config.useCreate()
  const updateMutation = config.useUpdate()
  const deleteMutation = config.useRemove()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ConfigFacturacion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { idAerolinea: 0, idConcepto: 0, idAeropuerto: undefined, activo: true },
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync(form)
    }
    setOpen(false); setEditing(null)
    reset({ idAerolinea: 0, idConcepto: 0, idAeropuerto: undefined, activo: true })
  }

  const handleEdit = (item: ConfigFacturacion) => { setEditing(item); reset({ idAerolinea: item.idAerolinea, idConcepto: item.idConcepto, idAeropuerto: item.idAeropuerto, activo: item.activo }); setOpen(true) }
  const handleDelete = async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }
  const handleAdd = () => { setEditing(null); reset({ idAerolinea: 0, idConcepto: 0, idAeropuerto: undefined, activo: true }); setOpen(true) }

  const columns: Column<ConfigFacturacion>[] = [
    { key: 'aerolineaNombre', header: 'Aerolínea', sortable: true },
    { key: 'idConcepto', header: 'Concepto', sortable: true, render: (item) => <span>{conceptos.find((c) => c.id === item.idConcepto)?.nombre || '—'}</span> },
    { key: 'idAeropuerto', header: 'Aeropuerto', sortable: true, render: (item) => { const ap = aeropuertos.find((a) => a.id === item.idAeropuerto); return ap ? <span>{ap.nombre}</span> : <span className="text-slate-400">General</span> } },
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
      <PageHeader title="Configuración de Facturación" subtitle="Asignación de conceptos de facturación por aerolínea" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nueva Configuración</Button>} />
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
        <DataTable columns={columns} data={data ?? []} keyExtractor={(i) => i.id} searchKeys={['aerolineaNombre']} searchPlaceholder="Buscar configuración..." />
      )}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar configuración de ${editing.aerolineaNombre}` : 'Nueva Configuración de Facturación'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aerolínea</label>
            <select {...register('idAerolinea')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccione...</option>
              {aerolineas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.idAerolinea && <p className="text-xs text-rose-500">{errors.idAerolinea.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Concepto</label>
            <select {...register('idConcepto')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value={0}>Seleccione...</option>
              {conceptos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.idConcepto && <p className="text-xs text-rose-500">{errors.idConcepto.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Aeropuerto (opcional)</label>
            <select {...register('idAeropuerto')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
              <option value="">General</option>
              {aeropuertos.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Configuración activa" />} />
          </div>
        </div>
      </CrudModal>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Configuración" message="¿Está seguro de eliminar esta configuración de facturación?" />
    </div>
  )
}
