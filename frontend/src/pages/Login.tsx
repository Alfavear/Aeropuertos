import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import type { LoginResponse } from '@/types'

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      setError('')
      const res = await api.post<LoginResponse>('/auth/login', data)
      login(res.data.user, res.data.token)
      navigate('/', { replace: true })
    } catch {
      setError('Credenciales inválidas')
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Usuario</label>
              <Input {...register('username')} placeholder="Ingrese su usuario" />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="Ingrese su contraseña"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
