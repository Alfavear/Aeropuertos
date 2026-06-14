import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const aerolineaSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
})

interface AerolineaItem {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

const mockData: AerolineaItem[] = [
  { id: 1, codigo: 'LA', nombre: 'LATAM Airlines Perú', activo: true },
  { id: 2, codigo: 'LP', nombre: 'LATAM Airlines Perú (Cargo)', activo: true },
  { id: 3, codigo: '2K', nombre: 'Aerolínea del Sur', activo: false },
]

export default function Aerolineas() {
  const [data, setData] = useState<AerolineaItem[]>(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AerolineaItem | null>(null)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aerolineaSchema),
    defaultValues: { codigo: '', nombre: '' },
  })

  const filtered = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase()),
  )

  const onSubmit = (form: { codigo: string; nombre: string }) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...form } : d)))
    } else {
      setData([...data, { ...form, id: Date.now(), activo: true }])
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '' })
  }

  const handleEdit = (item: AerolineaItem) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre })
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setData(data.filter((d) => d.id !== id))
  }

  const handleAdd = () => {
    setEditing(null)
    reset({ codigo: '', nombre: '' })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aerolíneas</h2>
          <p className="text-sm text-gray-500">Gestión de aerolíneas</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Nueva aerolínea
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar aerolíneas..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No se encontraron aerolíneas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setEditing(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar aerolínea' : 'Nueva aerolínea'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Código</label>
                <Input {...register('codigo')} placeholder="Ej: LA" />
                {errors.codigo && <p className="text-xs text-red-500">{errors.codigo.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <Input {...register('nombre')} placeholder="Nombre de la aerolínea" />
                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditing(null) }}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? 'Guardar cambios' : 'Crear'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
