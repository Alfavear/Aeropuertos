import { useState, useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Settings2, Plus, Save, Search, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useParametrosSistema } from '@/hooks/modules'

// ----------------------------------------------------------------------
// SCHEMA & TYPES
// ----------------------------------------------------------------------
type ParamTipo = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OPTIONS'

interface ParametroItem {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  valor: string
  tipo: ParamTipo
  modulo: string
  opciones?: string[] // Solo si tipo === 'OPTIONS'
}

const modulosDisponibles = ['General', 'Operaciones', 'Aerolíneas', 'Facturación', 'Seguridad']

// Zod schema para CREAR nuevo parámetro
const newParamSchema = z.object({
  modulo: z.string().min(1, 'Selecciona un módulo'),
  codigo: z.string().min(3, 'Código muy corto').regex(/^[A-Z_]+$/, 'Solo mayúsculas y guiones bajos (ej. SYS_CONFIG)'),
  nombre: z.string().min(3, 'Nombre requerido'),
  descripcion: z.string().optional(),
  tipo: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'OPTIONS']),
  valor: z.string().optional(),
  opcionesStr: z.string().optional() // Para parsear luego a array
})

type NewParamFormValues = z.infer<typeof newParamSchema>

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------
export default function Parametros() {
  const parametrosSistema = useParametrosSistema()
  const { data: apiData, isLoading, error } = parametrosSistema.useList()
  const createMutation = parametrosSistema.useCreate()

  const [params, setParams] = useState<ParametroItem[]>([])
  const [activeModule, setActiveModule] = useState<string>('Todos')
  const [search, setSearch] = useState('')
  const [openCreator, setOpenCreator] = useState(false)

  useEffect(() => {
    if (apiData) setParams(apiData as ParametroItem[])
  }, [apiData])

  // -- FORMULARIO DE CREACIÓN --
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<NewParamFormValues>({
    resolver: zodResolver(newParamSchema),
    defaultValues: { modulo: 'General', tipo: 'STRING', valor: '', opcionesStr: '' }
  })
  const selectedTipo = watch('tipo')

  // -- LOGICA DE RENDERIZADO --
  const filteredParams = useMemo(() => {
    return params.filter(p => {
      const matchModule = activeModule === 'Todos' || p.modulo === activeModule
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
      return matchModule && matchSearch
    })
  }, [params, activeModule, search])

  // Handlers para actualizar un parámetro existente
  const handleUpdateParam = (id: number, newValue: string) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, valor: newValue } : p))
  }

  // Guardar nuevo parámetro
  const onSubmitNewParam = async (data: NewParamFormValues) => {
    await createMutation.mutateAsync({
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      tipo: data.tipo,
      modulo: data.modulo,
      valor: data.tipo === 'BOOLEAN' ? 'false' : (data.valor || ''),
      opciones: data.tipo === 'OPTIONS' ? data.opcionesStr?.split(',').map(s => s.trim()) : undefined
    })
    setOpenCreator(false)
    reset()
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in">
      
      {/* SIDEBAR DE MODULOS */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            Configuración
          </h3>
          <p className="text-xs text-slate-500 mt-1">Variables de entorno</p>
        </div>
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <button
            onClick={() => setActiveModule('Todos')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeModule === 'Todos' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Todos los Parámetros
          </button>
          {modulosDisponibles.map(mod => (
            <button
              key={mod}
              onClick={() => setActiveModule(mod)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeModule === mod ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Módulo {mod}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col bg-slate-50">
        
        {/* HEADER DE ACCIONES */}
        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar parámetro..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-300 text-slate-700">
              <Save className="w-4 h-4 mr-2" /> Guardar Cambios
            </Button>
            <Button onClick={() => setOpenCreator(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Parámetro
            </Button>
          </div>
        </div>

        {/* LOADING / ERROR */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="flex-1 flex items-center justify-center text-rose-500">
            Error al cargar datos: {(error as Error).message}
          </div>
        )}
        {!isLoading && !error && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {modulosDisponibles.filter(m => activeModule === 'Todos' || activeModule === m).map(mod => {
            const paramsInModule = filteredParams.filter(p => p.modulo === mod)
            if (paramsInModule.length === 0) return null

            return (
              <div key={mod} className="space-y-4 animate-in slide-in-from-bottom-2">
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">{mod}</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {paramsInModule.map(p => (
                    <Card key={p.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3 bg-white rounded-t-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base text-slate-800">{p.nombre}</CardTitle>
                            <CardDescription className="text-xs font-mono text-indigo-600 mt-1 bg-indigo-50 inline-block px-1.5 py-0.5 rounded">{p.codigo}</CardDescription>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{p.tipo}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.descripcion}</p>
                      </CardHeader>
                      <CardContent className="pt-0 bg-white rounded-b-xl pb-4 flex items-center">
                        
                        {/* RENDERIZADO CONDICIONAL DE INPUTS */}
                        {p.tipo === 'BOOLEAN' && (
                          <label className="flex items-center gap-3 cursor-pointer mt-2">
                            <div className={`relative w-12 h-6 rounded-full transition-colors ${p.valor === 'true' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${p.valor === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{p.valor === 'true' ? 'Habilitado' : 'Deshabilitado'}</span>
                          </label>
                        )}

                        {p.tipo === 'STRING' && (
                          <Input 
                            value={p.valor} 
                            onChange={(e) => handleUpdateParam(p.id, e.target.value)}
                            className="mt-2"
                          />
                        )}

                        {p.tipo === 'NUMBER' && (
                          <Input 
                            type="number" 
                            value={p.valor} 
                            onChange={(e) => handleUpdateParam(p.id, e.target.value)}
                            className="mt-2 w-32 font-mono"
                          />
                        )}

                        {p.tipo === 'OPTIONS' && p.opciones && (
                          <select 
                            value={p.valor}
                            onChange={(e) => handleUpdateParam(p.id, e.target.value)}
                            className="mt-2 flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                          >
                            {p.opciones.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
          
          {filteredParams.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>No se encontraron parámetros en este módulo.</p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* MODAL CREADOR DE PARÁMETROS */}
      <Dialog open={openCreator} onOpenChange={setOpenCreator}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Crear Parámetro de Sistema</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitNewParam)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Módulo</label>
                <select {...register('modulo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
                  {modulosDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tipo de Dato</label>
                <select {...register('tipo')} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm">
                  <option value="STRING">Texto libre (String)</option>
                  <option value="NUMBER">Numérico (Number)</option>
                  <option value="BOOLEAN">Alternador (Booleano)</option>
                  <option value="OPTIONS">Lista de opciones</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Código Técnico</label>
              <Input {...register('codigo')} placeholder="Ej: OP_TIEMPO_MAX" className="font-mono uppercase" />
              {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nombre Visible</label>
              <Input {...register('nombre')} placeholder="Ej: Tiempo Máximo de Operación" />
              {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Descripción (Opcional)</label>
              <Input {...register('descripcion')} placeholder="Explica para qué sirve este parámetro..." />
            </div>

            {selectedTipo === 'OPTIONS' && (
              <div className="space-y-2 p-3 bg-amber-50 rounded-md border border-amber-100">
                <label className="text-sm font-semibold text-amber-900">Opciones Permitidas</label>
                <Input {...register('opcionesStr')} placeholder="Ej: COP, USD, EUR (separado por comas)" />
                <p className="text-[10px] text-amber-700">Separa cada opción con una coma.</p>
              </div>
            )}

            <DialogFooter className="mt-6 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenCreator(false)}>Cancelar</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Crear Parámetro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
