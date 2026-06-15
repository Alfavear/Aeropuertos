import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

interface ToggleSwitchProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>
  label?: string
  description?: string
  enabledLabel?: string
  disabledLabel?: string
}

export function ToggleSwitch<T extends FieldValues>({
  field,
  label,
  description,
  enabledLabel = 'Habilitado',
  disabledLabel = 'Deshabilitado',
}: ToggleSwitchProps<T>) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${field.value ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={field.value}
        onChange={(e) => field.onChange(e.target.checked)}
      />
      <div>
        {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
        {description && <span className="text-xs text-slate-400 ml-1">{description}</span>}
        {!label && <span className="text-sm text-slate-600">{field.value ? enabledLabel : disabledLabel}</span>}
      </div>
    </label>
  )
}
