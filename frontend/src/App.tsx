import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Aeropuertos from '@/pages/maestros/Aeropuertos'
import Aerolineas from '@/pages/maestros/Aerolineas'
import Aviones from '@/pages/maestros/Aviones'
import Conceptos from '@/pages/maestros/Conceptos'
import { useAuthStore } from '@/stores/authStore'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="maestros/aeropuertos" element={<Aeropuertos />} />
            <Route path="maestros/aerolineas" element={<Aerolineas />} />
            <Route path="maestros/aviones" element={<Aviones />} />
            <Route path="maestros/conceptos" element={<Conceptos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
