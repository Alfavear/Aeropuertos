import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Check, Plane, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSeleccionarAeropuerto, useMisAeropuertos } from '@/hooks/modules'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AccesoAeropuerto } from '@/types/index'

export default function SeleccionarAeropuerto() {
  const navigate = useNavigate()
  const { aeropuertoActivo, logout } = useAuthStore()
  const seleccionar = useSeleccionarAeropuerto()
  const misAeropuertos = useMisAeropuertos()
  const [aeropuertos, setAeropuertos] = useState<AccesoAeropuerto[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (aeropuertoActivo) {
      navigate('/', { replace: true })
      return
    }
    misAeropuertos.mutate(undefined, {
      onSuccess: (data) => {
        setAeropuertos(data)
        setLoading(false)
      },
      onError: () => {
        setError('Error al cargar aeropuertos')
        setLoading(false)
      },
    })
  }, [])

  const handleSelect = (id: number) => {
    seleccionar.mutate(id, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: () => setError('Error al seleccionar aeropuerto'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <Plane className="h-10 w-10 text-indigo-600" />
          <CardTitle className="text-xl">Seleccionar Aeropuerto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}
          {loading ? (
            <p className="text-center text-slate-500 py-8">Cargando aeropuertos...</p>
          ) : aeropuertos.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No tiene acceso a ningún aeropuerto.
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {aeropuertos
                .filter((a: AccesoAeropuerto) => a.aeropuerto)
                .map((a: AccesoAeropuerto) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(a.idAeropuerto)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {a.aeropuerto?.nombre || `Aeropuerto #${a.idAeropuerto}`}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {a.aeropuerto?.codigo || ''}
                      </p>
                    </div>
                    <Check className="h-5 w-5 text-transparent shrink-0" />
                  </button>
                ))}
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
