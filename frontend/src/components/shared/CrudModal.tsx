import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CrudModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  onSubmit?: () => void
  submitLabel?: string
  isEditing?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CrudModal({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  submitLabel,
  isEditing = false,
  loading = false,
  size = 'md',
}: CrudModalProps) {
  const sizeClass = size === 'sm' ? 'sm:max-w-[500px]' : size === 'lg' ? 'sm:max-w-[800px]' : 'sm:max-w-[600px]'

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onOpenChange(false) }}>
      <DialogContent className={`${sizeClass} p-0 overflow-hidden bg-white`}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-bold text-slate-800">{title}</DialogTitle>
        </div>

        <form
          onSubmit={(e) => {
            if (onSubmit) {
              e.preventDefault()
              onSubmit()
            }
          }}
        >
          <div className="p-6 max-h-[400px] overflow-y-auto">{children}</div>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            {onSubmit && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : submitLabel || (isEditing ? 'Guardar Cambios' : 'Crear')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
