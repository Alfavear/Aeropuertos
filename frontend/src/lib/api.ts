import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const store = useAuthStore.getState()
  const token = store.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const aeropuertoActivo = store.aeropuertoActivo
  if (aeropuertoActivo) {
    config.headers['X-Aeropuerto-Activo'] = String(aeropuertoActivo.id)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default api
