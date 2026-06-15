import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No hay datos',
  description = 'No se encontraron registros para mostrar.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <Icon className="h-12 w-12 mb-3 opacity-30" />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
