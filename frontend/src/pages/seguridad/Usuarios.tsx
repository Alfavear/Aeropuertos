import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, KeyRound, Lock, Unlock, ShieldAlert, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge, statusVariant } from '@/components/shared/StatusBadge'
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Usuario } from '@/types'
import { useUsuarios, usePerfiles, useResetPassword, useBloquearUsuario, useDesbloquearUsuario } from '@/hooks/modules'

const schema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Correo inválido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  telefono: z.string().optional(),
  idPerfil: z.number({ invalid_type_error: 'Seleccione un perfil' }).min(1, 'Seleccione un perfil'),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function Usuarios() {
  const usuarios = useUsuarios()
  const { data, isLoading, error } = usuarios.useList()
  const createMutation = usuarios.useCreate()
  const updateMutation = usuarios.useUpdate()
  const deleteMutation = usuarios.useRemove()
  const { data: perfiles } = usePerfiles().useList()
  const resetPassword = useResetPassword()
  const bloquearUsuario = useBloquearUsuario()
  const desbloquearUsuario = useDesbloquearUsuario()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [resetId, setResetId] = useState<number | null>(null)
  const [resetPass, setResetPass] = useState('')
  const [blockId, setBlockId] = useState<number | null>(null)
  const [blockTipo, setBlockTipo] = useState<'programado' | 'movimiento' | 'severo'>('severo')

  const defaultValues: FormValues = { username: '', email: '', nombre: '', telefono: '', idPerfil: 0, activo: true }

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (form: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: form })
    } else {
      await createMutation.mutateAsync({ ...form, password: 'temporal123' })
    }
    setOpen(false)
    setEditing(null)
    reset(defaultValues)
  }

  const handleEdit = (item: Usuario) => {
    setEditing(item)
    reset({ username: item.username, email: item.email, nombre: item.nombre, telefono: item.telefono ?? '', idPerfil: item.idPerfil, activo: item.activo })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const handleResetPassword = async () => {
    if (resetId && resetPass) {
      await resetPassword.mutateAsync({ id: resetId, password: resetPass })
      setResetId(null); setResetPass('')
    }
  }

  const handleBloquear = async () => {
    if (blockId) {
      const data = blockTipo === 'programado'
        ? { bloqueoProgramado: true, fechaInicioBloqueo: new Date().toISOString() }
        : blockTipo === 'movimiento'
          ? { bloqueoMovimiento: true }
          : { bloqueoSevero: true }
      await bloquearUsuario.mutateAsync({ id: blockId, data })
      setBlockId(null)
    }
  }

  const handleDesbloquear = async (id: number) => {
    await desbloquearUsuario.mutateAsync(id)
  }

  const getEstadoBloqueo = (item: Usuario) => {
    if (item.bloqueoSevero) return { label: 'Severo', variant: 'destructive' as const }
    if (item.bloqueoMovimiento) return { label: 'Movimiento', variant: 'warning' as const }
    if (item.bloqueoProgramado) return { label: 'Programado', variant: 'warning' as const }
    if (item.bloqueado && (item.intentosFallidos ?? 0) >= 9) return { label: 'Intentos', variant: 'warning' as const }
    return null
  }

  const columns: Column<Usuario>[] = [
    { key: 'username', header: 'Usuario', sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold">{item.username}</span>
        {item.debeCambiarPass && <KeyRound className="h-3.5 w-3.5 text-amber-500" title="Debe cambiar contraseña" />}
      </div>
    )},
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'telefono', header: 'Teléfono', sortable: true, render: (item) =>
      item.telefono ? <span className="text-sm text-slate-500">{item.telefono}</span> : <span className="text-xs text-slate-300 italic">—</span>
    },
    { key: 'perfil', header: 'Perfil', sortable: true, render: (item) =>
      item.perfil
        ? <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">{item.perfil.nombre}</span>
        : <span className="text-xs text-slate-300 italic">Sin perfil</span>
    },
    {
      key: 'bloqueado', header: 'Bloqueo', sortable: true, render: (item) => {
        const bloqueo = getEstadoBloqueo(item)
        return bloqueo
          ? <StatusBadge variant={bloqueo.variant} label={bloqueo.label} />
          : <StatusBadge variant="success" label="Normal" />
      }
    },
    { key: 'activo', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={statusVariant(item.activo)} label={item.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'ultimoAcceso', header: 'Últ. Acceso', sortable: true, render: (item) =>
      item.ultimoAcceso ? <span className="text-xs text-slate-500">{new Date(item.ultimoAcceso).toLocaleDateString()}</span> : <span className="text-xs text-slate-300 italic">Nunca</span>
    },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-0.5">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600" title="Editar"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => { setResetId(item.id); setResetPass('') }} className="hover:text-amber-600" title="Resetear contraseña"><KeyRound className="h-4 w-4" /></Button>
        {item.bloqueado || item.bloqueoSevero || item.bloqueoMovimiento || item.bloqueoProgramado
          ? <Button variant="ghost" size="icon" onClick={() => handleDesbloquear(item.id)} className="hover:text-green-600" title="Desbloquear"><Unlock className="h-4 w-4" /></Button>
          : <Button variant="ghost" size="icon" onClick={() => { setBlockId(item.id); setBlockTipo('severo') }} className="hover:text-rose-600" title="Bloquear"><Lock className="h-4 w-4" /></Button>
        }
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600" title="Eliminar"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Usuario</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['username', 'nombre', 'email', 'telefono']} searchPlaceholder="Buscar usuario..." />
      )}

      {/* Modal crear/editar */}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.username}` : 'Nuevo Usuario'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Usuario</label>
            <Input {...register('username')} placeholder="Ej: jperez" className="font-mono" />
            {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <Input {...register('email')} placeholder="Ej: jperez@aeropuertos.com" />
            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
            <Input {...register('nombre')} placeholder="Ej: Juan Pérez" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Teléfono</label>
            <Input {...register('telefono')} placeholder="Ej: +57 300 123 4567" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Perfil</label>
            <select {...register('idPerfil', { valueAsNumber: true })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
              <option value={0}>Seleccione un perfil</option>
              {(perfiles ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.idPerfil && <p className="text-xs text-rose-500">{errors.idPerfil.message}</p>}
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Usuario activo" />} />
          </div>
          {!editing && (
            <div className="col-span-2 p-3 bg-amber-50 rounded-lg text-xs text-amber-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Se asignará una contraseña temporal. El usuario deberá cambiarla en el primer inicio de sesión.
            </div>
          )}
        </div>
      </CrudModal>

      {/* Modal reset password */}
      <CrudModal open={resetId !== null} onOpenChange={(v) => { if (!v) setResetId(null) }} title="Resetear Contraseña" onSubmit={handleResetPassword} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Ingrese la nueva contraseña para el usuario. El usuario deberá cambiarla al iniciar sesión.</p>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nueva Contraseña</label>
            <Input type="text" value={resetPass} onChange={(e) => setResetPass(e.target.value)} placeholder="Mínimo 6 caracteres" className="font-mono" />
          </div>
        </div>
      </CrudModal>

      {/* Modal bloquear */}
      <CrudModal open={blockId !== null} onOpenChange={(v) => { if (!v) setBlockId(null) }} title="Bloquear Usuario" onSubmit={handleBloquear} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Seleccione el tipo de bloqueo:</p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50">
              <input type="radio" name="blockTipo" value="severo" checked={blockTipo === 'severo'} onChange={() => setBlockTipo('severo')} className="text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Bloqueo Severo</p>
                <p className="text-xs text-slate-500">Bloquea completamente el acceso al sistema</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50">
              <input type="radio" name="blockTipo" value="movimiento" checked={blockTipo === 'movimiento'} onChange={() => setBlockTipo('movimiento')} className="text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Bloqueo por Movimiento</p>
                <p className="text-xs text-slate-500">Bloquea operaciones de movimiento</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50">
              <input type="radio" name="blockTipo" value="programado" checked={blockTipo === 'programado'} onChange={() => setBlockTipo('programado')} className="text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Bloqueo Programado</p>
                <p className="text-xs text-slate-500">Bloquea a partir de la fecha actual</p>
              </div>
            </label>
          </div>
        </div>
      </CrudModal>

      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Usuario" message="¿Está seguro de eliminar este usuario?" />
    </div>
  )
}
