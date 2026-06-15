import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Plane,
  Globe,
  Building2,
  PlaneTakeoff,
  FileText,
  Settings2,
  LogOut,
  ChevronDown,
  ChevronRight,
  MapPin,
  Building,
  Layers,
  Wrench,
  Users,
  Clock,
  DoorOpen,
  Warehouse,
  DollarSign,
  Receipt,
  Calculator,
  Shield,
  Calendar,
  Sun,
  BarChart3,
  Hash,
  MessageSquare,
  Zap,
  BookOpen,
  UserCheck,
  Menu,
  Ticket,
  Luggage,
} from 'lucide-react'

interface NavGroup {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  items: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ to: '/', icon: LayoutDashboard, label: 'Panel de Control' }],
  },
  {
    label: 'Organización',
    icon: Globe,
    items: [
      { to: '/maestros/aeropuertos', icon: Plane, label: 'Aeropuertos' },
      { to: '/maestros/paises', icon: MapPin, label: 'Países' },
      { to: '/maestros/ciudades', icon: Building, label: 'Ciudades' },
      { to: '/maestros/zonas', icon: Layers, label: 'Zonas' },
    ],
  },
  {
    label: 'Aerolíneas',
    icon: Building2,
    items: [
      { to: '/maestros/aerolineas', icon: Building2, label: 'Aerolíneas' },
      { to: '/maestros/aeronaves', icon: PlaneTakeoff, label: 'Aeronaves' },
      { to: '/maestros/tipos-aeronave', icon: Wrench, label: 'Tipos de Aeronave' },
      { to: '/maestros/fabricantes', icon: Settings2, label: 'Fabricantes' },
      { to: '/maestros/clases-aviacion', icon: BookOpen, label: 'Clases de Aviación' },
      { to: '/maestros/personal-aerolinea', icon: Users, label: 'Personal' },
    ],
  },
  {
    label: 'Operaciones',
    icon: Clock,
    items: [
      { to: '/operaciones/panel', icon: LayoutDashboard, label: 'Panel Central' },
      { to: '/operaciones/itinerarios', icon: Calendar, label: 'Itinerarios' },
      { to: '/operaciones/vuelos', icon: Plane, label: 'Vuelos' },
      { to: '/operaciones/puertas-embarque', icon: DoorOpen, label: 'Puertas' },
      { to: '/operaciones/hangares', icon: Warehouse, label: 'Hangares' },
      { to: '/operaciones/servicios', icon: Wrench, label: 'Servicios' },
    ],
  },
  {
    label: 'Tarifas',
    icon: DollarSign,
    items: [
      { to: '/tarifas/conceptos', icon: FileText, label: 'Conceptos' },
      { to: '/tarifas/grupos', icon: Layers, label: 'Grupos' },
      { to: '/tarifas/tipos-operacion', icon: Zap, label: 'Tipos de Operación' },
      { to: '/tarifas/tarifas-operacion', icon: Calculator, label: 'Tarifas Operación' },
      { to: '/tarifas/tarifas-aerolinea', icon: Building2, label: 'Tarifas Aerolínea' },
      { to: '/tarifas/impuestos', icon: Receipt, label: 'Impuestos' },
    ],
  },
  {
    label: 'Facturación',
    icon: Receipt,
    items: [
      { to: '/facturacion/facturas', icon: FileText, label: 'Facturas' },
      { to: '/facturacion/notas-contables', icon: BookOpen, label: 'Notas Contables' },
      { to: '/facturacion/acuerdos-pago', icon: DollarSign, label: 'Acuerdos de Pago' },
      { to: '/facturacion/fuentes', icon: Layers, label: 'Fuentes' },
      { to: '/facturacion/configuracion', icon: Settings2, label: 'Configuración' },
    ],
  },
  {
    label: 'Liquidaciones',
    icon: Calculator,
    items: [
      { to: '/liquidaciones/liquidaciones', icon: Calculator, label: 'Liquidaciones' },
      { to: '/liquidaciones/tasas', icon: Ticket, label: 'Tasas' },
      { to: '/liquidaciones/pasajeros', icon: Luggage, label: 'Pasajeros' },
      { to: '/liquidaciones/tipos-pasajero', icon: Users, label: 'Tipos Pasajero' },
      { to: '/liquidaciones/clases-pasajero', icon: UserCheck, label: 'Clases Pasajero' },
    ],
  },
  {
    label: 'Seguridad',
    icon: Shield,
    items: [
      { to: '/seguridad/usuarios', icon: Users, label: 'Usuarios' },
      { to: '/seguridad/perfiles', icon: UserCheck, label: 'Perfiles' },
      { to: '/seguridad/menu', icon: Menu, label: 'Menú Opciones' },
    ],
  },
  {
    label: 'Períodos',
    icon: Calendar,
    items: [
      { to: '/periodos/periodos', icon: Calendar, label: 'Períodos' },
      { to: '/periodos/dias-feriados', icon: Sun, label: 'Días Feriados' },
    ],
  },
  {
    label: 'Configuración',
    icon: Settings2,
    items: [
      { to: '/configuracion/parametros', icon: Settings2, label: 'Parámetros' },
      { to: '/configuracion/indicadores', icon: BarChart3, label: 'Indicadores' },
      { to: '/configuracion/secuencias', icon: Hash, label: 'Secuencias' },
      { to: '/configuracion/codigos-aeronauticos', icon: BookOpen, label: 'Códigos' },
      { to: '/configuracion/servicios-aereos', icon: Plane, label: 'Servicios Aéreos' },
      { to: '/configuracion/mensajes', icon: MessageSquare, label: 'Mensajes' },
      { to: '/configuracion/eventos', icon: Zap, label: 'Eventos' },
      { to: '/configuracion/aplicaciones', icon: Wrench, label: 'Aplicaciones' },
    ],
  },
]

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('sidebar-groups')
    return saved ? new Set(JSON.parse(saved)) : new Set(navGroups.map(g => g.label))
  })

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      localStorage.setItem('sidebar-groups', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-gray-300">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Plane className="h-6 w-6 text-indigo-400" />
        <span className="text-lg font-bold text-white">AeroGest</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label)
          const isSingle = group.items.length === 1 && group.label === 'Dashboard'

          if (isSingle) {
            const item = group.items[0]
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            )
          }

          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {group.label}
              </button>

              {isExpanded && (
                <div className="ml-2 space-y-0.5 mt-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                        )
                      }
                    >
                      <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
