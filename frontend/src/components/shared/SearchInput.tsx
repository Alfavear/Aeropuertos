import { useState, useEffect, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  debounce?: number
  placeholder?: string
}

export function SearchInput({ value, onChange, debounce = 300, placeholder = 'Buscar...', className, ...props }: SearchInputProps) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local)
    }, debounce)
    return () => clearTimeout(timer)
  }, [local, debounce, onChange, value])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder={placeholder}
        className={`pl-9 border-slate-200 focus-visible:ring-indigo-500 bg-white ${className || ''}`}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        {...props}
      />
    </div>
  )
}
