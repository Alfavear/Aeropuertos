import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plane, KeyRound, Building2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import type { LoginResponse, SeleccionarAeropuertoResponse } from '@/types'

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

const changePassSchema = z.object({
  passwordActual: z.string().min(1, 'La contraseña actual es requerida'),
  passwordNueva: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmar: z.string().min(1, 'Confirme la nueva contraseña'),
}).refine((d) => d.passwordNueva === d.confirmar, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar'],
})

export default function Login() {
  const navigate = useNavigate()
  const loginStore = useAuthStore()
  const [error, setError] = useState('')
  const [cambioPassOpen, setCambioPassOpen] = useState(false)
  const [aeropuertoOpen, setAeropuertoOpen] = useState(false)
  const [loginData, setLoginData] = useState<{ id: number; password: string; token: string } | null>(null)
  const [aeropuertos, setAeropuertos] = useState<LoginResponse['aeropuertos']>([])
  const [changeError, setChangeError] = useState('')

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const changeForm = useForm({
    resolver: zodResolver(changePassSchema),
    defaultValues: { passwordActual: '', passwordNueva: '', confirmar: '' },
  })

  const onSubmitLogin = async (data: { username: string; password: string }) => {
    try {
      setError('')
      const res = await api.post<LoginResponse>('/auth/login', data)
      const { token, necesitaCambioPass, necesitaSeleccionarAeropuerto, aeropuertos: aps, user } = res.data

      if (necesitaCambioPass) {
        setLoginData({ id: user.id, password: data.password, token })
        changeForm.setValue('passwordActual', data.password)
        setCambioPassOpen(true)
        return
      }

      if (necesitaSeleccionarAeropuerto && aps && aps.length > 1) {
        setLoginData({ id: user.id, password: data.password, token })
        setAeropuertos(aps)
        setAeropuertoOpen(true)
        return
      }

      const aeropuertoUnico = aps?.length === 1
        ? { id: aps[0].id, codigo: aps[0].codigo, nombre: aps[0].nombre }
        : null

      loginStore.login(user, token, aeropuertoUnico)
      navigate('/', { replace: true })
    } catch {
      setError('Credenciales inválidas')
    }
  }

  const onSubmitCambioPass = async (data: { passwordActual: string; passwordNueva: string }) => {
    if (!loginData) return
    try {
      setChangeError('')
      await api.post(`/v1/seguridad/usuarios/${loginData.id}/cambiar-password`, {
        passwordActual: data.passwordActual,
        passwordNueva: data.passwordNueva,
      })

      const res = await api.post<LoginResponse>('/auth/login', {
        username: loginForm.getValues('username'),
        password: data.passwordNueva,
      })

      const { token, necesitaSeleccionarAeropuerto, aeropuertos: aps, user } = res.data

      if (necesitaSeleccionarAeropuerto && aps && aps.length > 1) {
        setLoginData({ id: user.id, password: data.passwordNueva, token })
        setAeropuertos(aps)
        setCambioPassOpen(false)
        setAeropuertoOpen(true)
        return
      }

      const aeropuertoUnico = aps?.length === 1
        ? { id: aps[0].id, codigo: aps[0].codigo, nombre: aps[0].nombre }
        : null

      loginStore.login(user, token, aeropuertoUnico)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setChangeError(msg || 'Error al cambiar la contraseña')
    }
  }

  const handleSeleccionarAeropuerto = async (idAeropuerto: number) => {
    if (!loginData) return
    try {
      const res = await api.post<SeleccionarAeropuertoResponse>('/auth/seleccionar-aeropuerto', {
        idAeropuerto,
      })

      const userRes = await api.post<LoginResponse>('/auth/login', {
        username: loginForm.getValues('username'),
        password: loginData.password,
      })

      loginStore.login(userRes.data.user, res.data.token, res.data.aeropuertoActivo)
      setAeropuertoOpen(false)
      navigate('/', { replace: true })
    } catch {
      setError('Error al seleccionar aeropuerto')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <Plane className="h-10 w-10 text-indigo-600" />
          <CardTitle className="text-xl">AeroGest</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Usuario</label>
              <Input {...loginForm.register('username')} placeholder="Ingrese su usuario" />
              {loginForm.formState.errors.username && (
                <p className="text-xs text-red-500">{loginForm.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <Input
                {...loginForm.register('password')}
                type="password"
                placeholder="Ingrese su contraseña"
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
              {loginForm.formState.isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={cambioPassOpen} onOpenChange={(v) => { if (!v) { setCambioPassOpen(false); loginStore.logout() } }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-500" />
            Debe cambiar su contraseña
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={changeForm.handleSubmit(onSubmitCambioPass)}>
          <DialogContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Por política de seguridad, debe cambiar su contraseña antes de continuar.
            </p>
            {changeError && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{changeError}</p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Contraseña actual</label>
              <Input
                {...changeForm.register('passwordActual')}
                type="password"
                placeholder="Contraseña actual"
              />
              {changeForm.formState.errors.passwordActual && (
                <p className="text-xs text-rose-500">{changeForm.formState.errors.passwordActual.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nueva contraseña</label>
              <Input
                {...changeForm.register('passwordNueva')}
                type="password"
                placeholder="Mínimo 6 caracteres"
              />
              {changeForm.formState.errors.passwordNueva && (
                <p className="text-xs text-rose-500">{changeForm.formState.errors.passwordNueva.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirmar contraseña</label>
              <Input
                {...changeForm.register('confirmar')}
                type="password"
                placeholder="Repita la nueva contraseña"
              />
              {changeForm.formState.errors.confirmar && (
                <p className="text-xs text-rose-500">{changeForm.formState.errors.confirmar.message}</p>
              )}
            </div>
          </DialogContent>
          <DialogFooter>
            <Button type="submit" disabled={changeForm.formState.isSubmitting}>
              {changeForm.formState.isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog open={aeropuertoOpen} onOpenChange={(v) => { if (!v) { setAeropuertoOpen(false); loginStore.logout() } }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            Seleccione aeropuerto de trabajo
          </DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Tiene acceso a múltiples aeropuertos. Seleccione en cuál desea trabajar:
          </p>
          {aeropuertos.filter((a) => a).map((a) => (
            <button
              key={a.id}
              onClick={() => handleSeleccionarAeropuerto(a.id)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{a.nombre}</p>
                <p className="text-xs text-slate-500 font-mono">{a.codigo}</p>
              </div>
              <Check className="h-5 w-5 text-transparent group-hover:text-indigo-400 shrink-0" />
            </button>
          ))}
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => loginStore.logout()}>
            Cerrar sesión
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
