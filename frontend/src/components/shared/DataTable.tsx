import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from './EmptyState'
import { SearchInput } from './SearchInput'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  searchable?: boolean
  searchKeys?: (keyof T)[]
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchable = true,
  searchKeys,
  searchPlaceholder = 'Buscar...',
  emptyTitle,
  emptyDescription,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    let items = data
    if (search && searchKeys) {
      const q = search.toLowerCase()
      items = data.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key]
          return String(val ?? '').toLowerCase().includes(q)
        }),
      )
    }
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey]
        const bVal = (b as Record<string, unknown>)[sortKey]
        const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), 'es', { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return items
  }, [data, search, searchKeys, sortKey, sortDir])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      {searchable && (
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder} />
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`font-semibold text-slate-700 ${col.sortable ? 'cursor-pointer select-none' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-30" />
                      )
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                className={`group transition-colors hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className || ''}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
