import { create } from 'zustand'
import type { User, AeropuertoActivo } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  aeropuertoActivo: AeropuertoActivo | null
  setAeropuertoActivo: (a: AeropuertoActivo) => void
  login: (user: User, token: string, aeropuertoActivo?: AeropuertoActivo | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const stored = localStorage.getItem('aeropuertoActivo')
  return {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    aeropuertoActivo: stored ? JSON.parse(stored) : null,
    setAeropuertoActivo: (a) => {
      localStorage.setItem('aeropuertoActivo', JSON.stringify(a))
      set({ aeropuertoActivo: a })
    },
    login: (user, token, aeropuertoActivo = null) => {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (aeropuertoActivo) localStorage.setItem('aeropuertoActivo', JSON.stringify(aeropuertoActivo))
      else localStorage.removeItem('aeropuertoActivo')
      set({ user, token, aeropuertoActivo })
    },
    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('aeropuertoActivo')
      set({ user: null, token: null, aeropuertoActivo: null })
    },
  }
})
