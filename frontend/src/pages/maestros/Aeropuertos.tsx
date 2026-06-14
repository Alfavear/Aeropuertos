import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Search, Plane, Clock, Building2 } from 'lucide-react'
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

// ----------------------------------------------------------------------
// SCHEMA & TYPES (Mapeo exacto de FrmMaeAeropuertos.frm)
// ----------------------------------------------------------------------
const aeropuertoSchema = z.object({
  // Tab 1: General
  codigoOACI: z.string().min(4, 'OACI requerido (Ej. SKBO)').max(4),
  codigoIATA: z.string().min(3, 'IATA requerido (Ej. BOG)').max(3),
  nombre: z.string().min(1, 'El nombre es requerido'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  pais: z.string().min(1, 'El país es requerido'),
  activo: z.boolean().default(true),
  controlAdministrativo: z.boolean().default(false),
  
  // Tab 2: Horarios
  opera24Horas: z.boolean().default(true),
  horaApertura: z.string().optional(),
  horaCierre: z.string().optional(),
  
  // Tab 3: Zonas (Simplificado para el form)
  countersTotales: z.coerce.number().min(0).default(0),
  puertasEmbarque: z.coerce.number().min(0).default(0),
})

type AeropuertoFormValues = z.infer<typeof aeropuertoSchema>

interface AeropuertoItem extends AeropuertoFormValues {
  id: number
}

// Mock inicial
const mockData: AeropuertoItem[] = [
  { id: 1, codigoIATA: 'BOG', codigoOACI: 'SKBO', nombre: 'Aeropuerto Internacional El Dorado', ciudad: 'Bogotá', pais: 'Colombia', activo: true, controlAdministrativo: true, opera24Horas: true, countersTotales: 120, puertasEmbarque: 40 },
  { id: 2, codigoIATA: 'MDE', codigoOACI: 'SKRG', nombre: 'Aeropuerto Internacional José María Córdova', ciudad: 'Rionegro', pais: 'Colombia', activo: true, controlAdministrativo: false, opera24Horas: true, countersTotales: 60, puertasEmbarque: 12 },
  { id: 3, codigoIATA: 'CTG', codigoOACI: 'SKCG', nombre: 'Aeropuerto Internacional Rafael Núñez', ciudad: 'Cartagena', pais: 'Colombia', activo: false, controlAdministrativo: false, opera24Horas: false, horaApertura: '06:00', horaCierre: '23:00', countersTotales: 30, puertasEmbarque: 6 },
]

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function Aeropuertos() {
  const [data, setData] = useState<AeropuertoItem[]>(mockData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AeropuertoItem | null>(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'horarios' | 'zonas'>('general')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<AeropuertoFormValues>({
    resolver: zodResolver(aeropuertoSchema),
    defaultValues: {
      codigoOACI: '', codigoIATA: '', nombre: '', ciudad: '', pais: '',
      activo: true, controlAdministrativo: false, opera24Horas: true,
      horaApertura: '', horaCierre: '', countersTotales: 0, puertasEmbarque: 0
    },
  })

  const is24Horas = watch('opera24Horas')

  const filtered = data.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigoIATA.toLowerCase().includes(search.toLowerCase()) ||
      item.codigoOACI.toLowerCase().includes(search.toLowerCase())
  )

  const onSubmit = (form: AeropuertoFormValues) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...form } : d)))
    } else {
      setData([...data, { ...form, id: Date.now() }])
    }
    setOpen(false)
    setEditing(null)
    setActiveTab('general')
  }

  const handleEdit = (item: AeropuertoItem) => {
    setEditing(item)
    reset(item)
    setActiveTab('general')
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setData(data.filter((d) => d.id !== id))
  }

  const handleAdd = () => {
    setEditing(null)
    reset({
      codigoOACI: '', codigoIATA: '', nombre: '', ciudad: '', pais: '',
      activo: true, controlAdministrativo: false, opera24Horas: true,
      horaApertura: '', horaCierre: '', countersTotales: 0, puertasEmbarque: 0
    })
    setActiveTab('general')
    setOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Aeropuertos</h2>
          <p className="text-sm text-slate-500 mt-1">Gestión de concesiones e infraestructura aeroportuaria</p>
        </div>
        <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aeropuerto
        </Button>
      </div>

      {/* DATAGRID SECTION */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por OACI, IATA o Nombre..."
              className="pl-9 border-slate-200 focus-visible:ring-indigo-500 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700">Códigos</TableHead>
                <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
                <TableHead className="font-semibold text-slate-700">Ubicación</TableHead>
                <TableHead className="font-semibold text-slate-700">Horario</TableHead>
                <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group transition-colors hover:bg-slate-50/80">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.codigoIATA}</span>
                      <span className="font-mono text-xs text-slate-500">{item.codigoOACI}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{item.nombre}</TableCell>
                  <TableCell className="text-slate-600">{item.ciudad}, {item.pais}</TableCell>
                  <TableCell>
                    {item.opera24Horas ? (
                      <span className="inline-flex items-center text-xs text-emerald-600 font-medium">
                        <Clock className="w-3 h-3 mr-1" /> 24 Hrs
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">
                        {item.horaApertura} - {item.horaCierre}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        item.activo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.activo ? 'Operativo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-indigo-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Plane className="h-8 w-8 mb-2 opacity-20" />
                      <p>No se encontraron aeropuertos operando.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL / WIZARD */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setEditing(null) } }}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {editing ? `Editar Aeropuerto: ${editing.codigoIATA}` : 'Registrar Nuevo Aeropuerto'}
            </DialogTitle>
          </div>
          
          {/* TABS NAVIGATION */}
          <div className="flex border-b border-slate-200 px-6 bg-white">
            <button
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('general')}
            >
              <Plane className="w-4 h-4" /> General
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'horarios' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('horarios')}
            >
              <Clock className="w-4 h-4" /> Horarios
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'zonas' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('zonas')}
            >
              <Building2 className="w-4 h-4" /> Infraestructura
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 h-[320px] overflow-y-auto">
              
              {/* TAB 1: GENERAL */}
              <div className={activeTab === 'general' ? 'block animate-in slide-in-from-right-4' : 'hidden'}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Código OACI</label>
                    <Input {...register('codigoOACI')} placeholder="Ej: SKBO" className="font-mono uppercase" />
                    {errors.codigoOACI && <p className="text-xs text-rose-500">{errors.codigoOACI.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Código IATA</label>
                    <Input {...register('codigoIATA')} placeholder="Ej: BOG" className="font-mono uppercase" />
                    {errors.codigoIATA && <p className="text-xs text-rose-500">{errors.codigoIATA.message}</p>}
                  </div>
                  <div className="col-span-2 space-y-2 mt-2">
                    <label className="text-sm font-semibold text-slate-700">Nombre del Aeropuerto</label>
                    <Input {...register('nombre')} placeholder="Aeropuerto Internacional..." />
                    {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
                  </div>
                  <div className="space-y-2 mt-2">
                    <label className="text-sm font-semibold text-slate-700">Ciudad</label>
                    <Input {...register('ciudad')} placeholder="Ciudad" />
                    {errors.ciudad && <p className="text-xs text-rose-500">{errors.ciudad.message}</p>}
                  </div>
                  <div className="space-y-2 mt-2">
                    <label className="text-sm font-semibold text-slate-700">País</label>
                    <Input {...register('pais')} placeholder="País" />
                    {errors.pais && <p className="text-xs text-rose-500">{errors.pais.message}</p>}
                  </div>

                  {/* CUSTOM TOGGLES */}
                  <div className="col-span-2 mt-4 flex gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Controller
                      name="activo"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                          <input type="checkbox" className="hidden" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                          <span className="text-sm font-medium text-slate-700">Activo (Operativo)</span>
                        </label>
                      )}
                    />
                     <Controller
                      name="controlAdministrativo"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                          <input type="checkbox" className="hidden" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                          <span className="text-sm font-medium text-slate-700">Control Administrativo</span>
                        </label>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* TAB 2: HORARIOS */}
              <div className={activeTab === 'horarios' ? 'block animate-in slide-in-from-right-4' : 'hidden'}>
                 <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 mb-6">
                    <Controller
                      name="opera24Horas"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                          <input type="checkbox" className="hidden" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                          <div>
                            <p className="text-sm font-bold text-indigo-900">Operación 24 Horas</p>
                            <p className="text-xs text-indigo-600">El aeropuerto no tiene restricciones de horario</p>
                          </div>
                        </label>
                      )}
                    />
                 </div>

                 {!is24Horas && (
                   <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Hora de Apertura</label>
                        <Input type="time" {...register('horaApertura')} className="font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Hora de Cierre</label>
                        <Input type="time" {...register('horaCierre')} className="font-mono" />
                      </div>
                   </div>
                 )}
              </div>

              {/* TAB 3: ZONAS E INFRAESTRUCTURA */}
              <div className={activeTab === 'zonas' ? 'block animate-in slide-in-from-right-4' : 'hidden'}>
                <p className="text-sm text-slate-500 mb-4">Registro de capacidad instalada del aeropuerto.</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Counters de Check-in</label>
                    <Input type="number" min="0" {...register('countersTotales')} className="font-mono text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Puertas de Embarque</label>
                    <Input type="number" min="0" {...register('puertasEmbarque')} className="font-mono text-lg" />
                  </div>
                </div>
              </div>

            </div>
            
            <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditing(null) }}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                {editing ? 'Guardar Cambios' : 'Registrar Aeropuerto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
