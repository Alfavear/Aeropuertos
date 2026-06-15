import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

type BasePath = string

function useCrud<T extends { id: number }>(basePath: BasePath) {
  const queryKey = [basePath]

  const useList = (filters?: Record<string, string | number | boolean | undefined>) =>
    useQuery<T[]>({
      queryKey: [...queryKey, filters],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (filters) {
          Object.entries(filters).forEach(([k, v]) => {
            if (v !== undefined && v !== '') params.set(k, String(v))
          })
        }
        const qs = params.toString()
        const res = await api.get(`${basePath}${qs ? `?${qs}` : ''}`)
        return res.data
      },
    })

  const useGet = (id: number | undefined) =>
    useQuery<T>({
      queryKey: [...queryKey, id],
      queryFn: () => api.get(`${basePath}/${id}`).then(r => r.data),
      enabled: !!id,
    })

  const useCreate = () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (data: Partial<T>) => api.post(basePath, data).then(r => r.data),
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    })
  }

  const useUpdate = () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<T> }) =>
        api.put(`${basePath}/${id}`, data).then(r => r.data),
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    })
  }

  const useRemove = () => {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: number) => api.delete(`${basePath}/${id}`).then(r => r.data),
      onSuccess: () => qc.invalidateQueries({ queryKey }),
    })
  }

  return { useList, useGet, useCreate, useUpdate, useRemove }
}

export default useCrud
