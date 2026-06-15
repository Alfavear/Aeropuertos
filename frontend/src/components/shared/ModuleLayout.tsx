import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModuleSidebarItem {
  id: string
  label: string
  icon?: ReactNode
}

interface ModuleLayoutProps {
  title: string
  subtitle?: string
  sidebarItems: ModuleSidebarItem[]
  activeId: string
  onSelect: (id: string) => void
  children: ReactNode
  headerActions?: ReactNode
}

export function ModuleLayout({
  title,
  subtitle,
  sidebarItems,
  activeId,
  onSelect,
  children,
  headerActions,
}: ModuleLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                activeId === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        {headerActions && (
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            {headerActions}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
