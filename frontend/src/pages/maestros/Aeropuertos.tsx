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

const aeropuertoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  pais: z.string().min(1, 'El país es requerido'),
})

interface AeropuertoItem {
  id: number
  codigo: string
  nombre: string
  ciudad: string
  pais: string
  activo: boolean
}

const mockData: AeropuertoItem[] = [
  { id: 1, codigo: 'LIM', nombre: 'Aeropuerto Internacional Jorge Chávez', ciudad: 'Lima', pais: 'Perú', activo: true },
  { id: 2, codigo: 'CUZ', nombre: 'Aeropuerto Internacional Alejandro Velasco Astete', ciudad: 'Cusco', pais: 'Perú', activo: true },
  { id: 3, codigo: 'AQP', nombre: 'Aeropuerto Internacional Rodríguez Ballón', ciudad: 'Arequipa', pais: 'Perú', activo: true },
]

export default function Aeropuertos() {
  const [data, setData] = useState<AeropuertoItem[]>(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AeropuertoItem | null>(null)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aeropuertoSchema),
    defaultValues: { codigo: '', nombre: '', ciudad: '', pais: '' },
  })

  const filtered = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase()),
  )

  const onSubmit = (form: { codigo: string; nombre: string; ciudad: string; pais: string }) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...form } : d)))
    } else {
      setData([...data, { ...form, id: Date.now(), activo: true }])
    }
    setOpen(false)
    setEditing(null)
    reset({ codigo: '', nombre: '', ciudad: '', pais: '' })
  }

  const handleEdit = (item: AeropuertoItem) => {
    setEditing(item)
    reset({ codigo: item.codigo, nombre: item.nombre, ciudad: item.ciudad, pais: item.pais })
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setData(data.filter((d) => d.id !== id))
  }

  const handleAdd = () => {
    setEditing(null)
    reset({ codigo: '', nombre: '', ciudad: '', pais: '' })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aeropuertos</h2>
          <p className="text-sm text-gray-500">Gestión de aeropuertos</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Nuevo aeropuerto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar aeropuertos..."
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
                <TableHead>Ciudad</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.ciudad}</TableCell>
                  <TableCell>{item.pais}</TableCell>
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
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No se encontraron aeropuertos
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
            <DialogTitle>{editing ? 'Editar aeropuerto' : 'Nuevo aeropuerto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Código</label>
                <Input {...register('codigo')} placeholder="Ej: LIM" />
                {errors.codigo && <p className="text-xs text-red-500">{errors.codigo.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <Input {...register('nombre')} placeholder="Nombre del aeropuerto" />
                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ciudad</label>
                <Input {...register('ciudad')} placeholder="Ciudad" />
                {errors.ciudad && <p className="text-xs text-red-500">{errors.ciudad.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">País</label>
                <Input {...register('pais')} placeholder="País" />
                {errors.pais && <p className="text-xs text-red-500">{errors.pais.message}</p>}
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
