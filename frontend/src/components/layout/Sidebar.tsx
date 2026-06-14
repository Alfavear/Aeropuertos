import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Plane,
  Building2,
  PlaneTakeoff,
  FileText,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/maestros/aeropuertos', icon: Plane, label: 'Aeropuertos' },
  { to: '/maestros/aerolineas', icon: Building2, label: 'Aerolíneas' },
  { to: '/maestros/aviones', icon: PlaneTakeoff, label: 'Aviones' },
  { to: '/maestros/conceptos', icon: FileText, label: 'Conceptos' },
]

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-gray-300">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Plane className="h-6 w-6 text-indigo-400" />
        <span className="text-lg font-bold text-white">AeroGest</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
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
