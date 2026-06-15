import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Users, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { CrudModal } from '@/components/shared/CrudModal'
import { StatusBadge, statusVariant } from '@/components/shared/StatusBadge'
import { ToggleSwitch } from '@/components/shared/ToggleSwitch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Column } from '@/components/shared/DataTable'
import type { Perfil, MenuOpcion, MenuOpcionConPermiso } from '@/types'
import { usePerfiles, useMenuOpciones } from '@/hooks/modules'
import api from '@/lib/api'

const schema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  activo: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

function MenuTree({ items, selected, onChange }: {
  items: MenuOpcion[]
  selected: number[]
  onChange: (ids: number[]) => void
}) {
  const padres = items.filter((m) => !m.idPadre).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  const toggle = (id: number) => {
    const ids = new Set(selected)
    if (ids.has(id)) ids.delete(id); else ids.add(id)
    onChange([...ids])
  }

  const getHijos = (padreId: number) =>
    items.filter((m) => m.idPadre === padreId).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  return (
    <div className="max-h-96 overflow-y-auto space-y-1">
      {padres.map((padre) => {
        const hijos = getHijos(padre.id)
        const todosSeleccionados = hijos.length > 0 && hijos.every((h) => selected.includes(h.id))
        return (
          <div key={padre.id}>
            <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={todosSeleccionados || selected.includes(padre.id)}
                onChange={() => toggle(padre.id)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold text-slate-800">{padre.nombre}</span>
            </label>
            {hijos.map((hijo) => (
              <label key={hijo.id} className="flex items-center gap-2 ml-6 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(hijo.id)}
                  onChange={() => toggle(hijo.id)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{hijo.nombre}</span>
                <span className="text-xs text-slate-300 font-mono ml-auto">{hijo.ruta}</span>
              </label>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default function Perfiles() {
  const perfiles = usePerfiles()
  const { data, isLoading, error } = perfiles.useList()
  const createMutation = perfiles.useCreate()
  const updateMutation = perfiles.useUpdate()
  const deleteMutation = perfiles.useRemove()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Perfil | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Menu assignment state
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPerfil, setMenuPerfil] = useState<Perfil | null>(null)
  const [menuItems, setMenuItems] = useState<MenuOpcion[]>([])
  const [menuSelected, setMenuSelected] = useState<number[]>([])
  const [menuLoading, setMenuLoading] = useState(false)

  const defaultValues: FormValues = { codigo: '', nombre: '', descripcion: '', activo: true }

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
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

  const handleEdit = (item: Perfil) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, descripcion: item.descripcion ?? '', activo: item.activo })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) }
  }

  const handleAdd = () => { setEditing(null); reset(defaultValues); setOpen(true) }

  const handleOpenMenu = async (item: Perfil) => {
    setMenuPerfil(item)
    setMenuLoading(true)
    setMenuOpen(true)
    try {
      const [allMenusRes, assignedRes] = await Promise.all([
        api.get('/v1/seguridad/menu-opciones'),
        api.get(`/v1/seguridad/perfiles/${item.id}/menus`),
      ])
      setMenuItems(allMenusRes.data)
      const assigned = assignedRes.data.filter((m: MenuOpcion) => m.permitido).map((m: MenuOpcion) => m.id)
      setMenuSelected(assigned)
    } catch {
      setMenuItems([])
      setMenuSelected([])
    }
    setMenuLoading(false)
  }

  const handleSaveMenu = async () => {
    if (!menuPerfil) return
    await api.post(`/v1/seguridad/perfiles/${menuPerfil.id}/menus`, menuSelected)
    setMenuOpen(false)
    setMenuPerfil(null)
  }

  const columns: Column<Perfil>[] = [
    { key: 'codigo', header: 'Código', sortable: true, render: (item) => <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigo}</span> },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'descripcion', header: 'Descripción', sortable: true, render: (item) =>
      item.descripcion ? <span className="text-sm text-slate-500">{item.descripcion}</span> : <span className="text-xs text-slate-300 italic">—</span>
    },
    { key: 'totalUsuarios', header: 'Usuarios', sortable: true, render: (item) => (
      <span className="inline-flex items-center gap-1 text-sm text-slate-600">
        <Users className="h-3.5 w-3.5" />
        {item.totalUsuarios ?? 0}
      </span>
    )},
    { key: 'activo', header: 'Estado', sortable: true, render: (item) => <StatusBadge variant={statusVariant(item.activo)} label={item.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'acciones', header: 'Acciones', className: 'text-right', render: (item) => (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-0.5">
        <Button variant="ghost" size="icon" onClick={() => handleOpenMenu(item)} className="hover:text-indigo-600" title="Asignar Menús"><Menu className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600" title="Editar"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="hover:text-rose-600" title="Eliminar"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Perfiles" subtitle="Roles y perfiles de usuario" action={<Button onClick={handleAdd}><Plus className="h-4 w-4" /> Nuevo Perfil</Button>} />
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
        <DataTable columns={columns} data={data || []} keyExtractor={(i) => i.id} searchKeys={['codigo', 'nombre', 'descripcion']} searchPlaceholder="Buscar perfil..." />
      )}

      {/* Modal crear/editar */}
      <CrudModal open={open} onOpenChange={setOpen} title={editing ? `Editar: ${editing.codigo}` : 'Nuevo Perfil'} isEditing={!!editing} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Código</label>
            <Input {...register('codigo')} placeholder="Ej: ADMIN" className="font-mono uppercase" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <Input {...register('nombre')} placeholder="Ej: Administrador" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Descripción</label>
            <Input {...register('descripcion')} placeholder="Descripción del perfil" />
          </div>
          <div className="col-span-2 flex items-center p-3 bg-slate-50 rounded-lg">
            <Controller name="activo" control={control} render={({ field }) => <ToggleSwitch field={field} label="Perfil activo" />} />
          </div>
        </div>
      </CrudModal>

      {/* Modal asignación de menús */}
      <CrudModal open={menuOpen} onOpenChange={(v) => { if (!v) setMenuOpen(false) }} title={`Menús: ${menuPerfil?.nombre ?? ''}`} onSubmit={handleSaveMenu} size="lg">
        {menuLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <MenuTree items={menuItems} selected={menuSelected} onChange={setMenuSelected} />
        )}
      </CrudModal>

      <ConfirmDialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }} onConfirm={handleDelete} title="Eliminar Perfil" message="¿Está seguro de eliminar este perfil?" />
    </div>
  )
}
