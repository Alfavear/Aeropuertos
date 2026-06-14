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

const avionSchema = z.object({
  matricula: z.string().min(1, 'La matrícula es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  fabricante: z.string().min(1, 'El fabricante es requerido'),
  capacidad_pasajeros: z.coerce.number().int().min(1, 'La capacidad debe ser mayor a 0'),
})

interface AvionItem {
  id: number
  matricula: string
  modelo: string
  fabricante: string
  capacidad_pasajeros: number
  activo: boolean
}

const mockData: AvionItem[] = [
  { id: 1, matricula: 'OB-2014', modelo: 'Boeing 737-800', fabricante: 'Boeing', capacidad_pasajeros: 189, activo: true },
  { id: 2, matricula: 'OB-2015', modelo: 'Airbus A320-200', fabricante: 'Airbus', capacidad_pasajeros: 180, activo: true },
  { id: 3, matricula: 'OB-2016', modelo: 'Boeing 767-300ER', fabricante: 'Boeing', capacidad_pasajeros: 269, activo: false },
]

export default function Aviones() {
  const [data, setData] = useState<AvionItem[]>(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AvionItem | null>(null)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(avionSchema),
    defaultValues: { matricula: '', modelo: '', fabricante: '', capacidad_pasajeros: 0 },
  })

  const filtered = data.filter(
    (item) =>
      item.matricula.toLowerCase().includes(search.toLowerCase()) ||
      item.modelo.toLowerCase().includes(search.toLowerCase()),
  )

  const onSubmit = (form: { matricula: string; modelo: string; fabricante: string; capacidad_pasajeros: number }) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...form } : d)))
    } else {
      setData([...data, { ...form, id: Date.now(), activo: true }])
    }
    setOpen(false)
    setEditing(null)
    reset({ matricula: '', modelo: '', fabricante: '', capacidad_pasajeros: 0 })
  }

  const handleEdit = (item: AvionItem) => {
    setEditing(item)
    reset({ matricula: item.matricula, modelo: item.modelo, fabricante: item.fabricante, capacidad_pasajeros: item.capacidad_pasajeros })
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setData(data.filter((d) => d.id !== id))
  }

  const handleAdd = () => {
    setEditing(null)
    reset({ matricula: '', modelo: '', fabricante: '', capacidad_pasajeros: 0 })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aviones</h2>
          <p className="text-sm text-gray-500">Gestión de aeronaves</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Nuevo avión
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar aviones..."
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
                <TableHead>Matrícula</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.matricula}</TableCell>
                  <TableCell>{item.modelo}</TableCell>
                  <TableCell>{item.fabricante}</TableCell>
                  <TableCell>{item.capacidad_pasajeros} pasajeros</TableCell>
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
                    No se encontraron aviones
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
            <DialogTitle>{editing ? 'Editar avión' : 'Nuevo avión'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Matrícula</label>
                <Input {...register('matricula')} placeholder="Ej: OB-2014" />
                {errors.matricula && <p className="text-xs text-red-500">{errors.matricula.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Modelo</label>
                <Input {...register('modelo')} placeholder="Ej: Boeing 737-800" />
                {errors.modelo && <p className="text-xs text-red-500">{errors.modelo.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fabricante</label>
                <Input {...register('fabricante')} placeholder="Ej: Boeing" />
                {errors.fabricante && <p className="text-xs text-red-500">{errors.fabricante.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Capacidad de pasajeros</label>
                <Input {...register('capacidad_pasajeros')} type="number" placeholder="Ej: 189" />
                {errors.capacidad_pasajeros && <p className="text-xs text-red-500">{errors.capacidad_pasajeros.message}</p>}
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
