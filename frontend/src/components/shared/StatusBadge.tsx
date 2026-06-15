import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
  {
    variants: {
      variant: {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        inactive: 'bg-rose-50 text-rose-700 border-rose-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        error: 'bg-rose-50 text-rose-700 border-rose-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        neutral: 'bg-slate-50 text-slate-600 border-slate-200',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label: string
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ variant }))}>{label}</span>
}

export function statusVariant(activo: boolean): 'active' | 'inactive' {
  return activo ? 'active' : 'inactive'
}
