import { useAuthStore } from '@/stores/authStore'
import { User } from 'lucide-react'

export function Header() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-xl font-semibold text-gray-900">Panel de Control</h1>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{user?.nombre || user?.username}</p>
          <p className="text-xs text-gray-500">{user?.rol}</p>
        </div>
      </div>
    </header>
  )
}
