import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/stores/authStore'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()

// Lazy imports
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))

// Maestros / Organización
const Aeropuertos = lazy(() => import('@/pages/maestros/Aeropuertos'))
const Paises = lazy(() => import('@/pages/maestros/Paises'))
const Ciudades = lazy(() => import('@/pages/maestros/Ciudades'))
const Zonas = lazy(() => import('@/pages/maestros/Zonas'))

// Maestros / Aerolíneas
const Aerolineas = lazy(() => import('@/pages/maestros/Aerolineas'))
const Aviones = lazy(() => import('@/pages/maestros/Aviones'))
const TiposAeronave = lazy(() => import('@/pages/maestros/TiposAeronave'))
const Fabricantes = lazy(() => import('@/pages/maestros/Fabricantes'))
const ClasesAviacion = lazy(() => import('@/pages/maestros/ClasesAviacion'))
const PersonalAerolinea = lazy(() => import('@/pages/maestros/PersonalAerolinea'))

// Operaciones
const Itinerarios = lazy(() => import('@/pages/operaciones/Itinerarios'))
const Vuelos = lazy(() => import('@/pages/operaciones/Vuelos'))
const PuertasEmbarque = lazy(() => import('@/pages/operaciones/PuertasEmbarque'))
const Hangares = lazy(() => import('@/pages/operaciones/Hangares'))
const ServiciosOperacion = lazy(() => import('@/pages/operaciones/ServiciosOperacion'))
const PanelOperaciones = lazy(() => import('@/pages/operaciones/PanelOperaciones'))

// Tarifas
const GruposConcepto = lazy(() => import('@/pages/tarifas/GruposConcepto'))
const ConceptosTarifas = lazy(() => import('@/pages/tarifas/Conceptos'))
const TiposOperacion = lazy(() => import('@/pages/tarifas/TiposOperacion'))
const TarifasOperacion = lazy(() => import('@/pages/tarifas/TarifasOperacion'))
const TarifasAerolinea = lazy(() => import('@/pages/tarifas/TarifasAerolinea'))
const Impuestos = lazy(() => import('@/pages/tarifas/Impuestos'))

// Facturación
const Facturas = lazy(() => import('@/pages/facturacion/Facturas'))
const NotasContables = lazy(() => import('@/pages/facturacion/NotasContables'))
const AcuerdosPago = lazy(() => import('@/pages/facturacion/AcuerdosPago'))
const FuentesFacturacion = lazy(() => import('@/pages/facturacion/FuentesFacturacion'))
const ConfigFacturacion = lazy(() => import('@/pages/facturacion/ConfigFacturacion'))

// Liquidaciones
const Liquidaciones = lazy(() => import('@/pages/liquidaciones/Liquidaciones'))
const TasasAeroportuarias = lazy(() => import('@/pages/liquidaciones/TasasAeroportuarias'))
const Pasajeros = lazy(() => import('@/pages/liquidaciones/Pasajeros'))
const TiposPasajero = lazy(() => import('@/pages/liquidaciones/TiposPasajero'))
const ClasesPasajero = lazy(() => import('@/pages/liquidaciones/ClasesPasajero'))

// Seguridad
const Usuarios = lazy(() => import('@/pages/seguridad/Usuarios'))
const Perfiles = lazy(() => import('@/pages/seguridad/Perfiles'))
const MenuOpciones = lazy(() => import('@/pages/seguridad/MenuOpciones'))

const SeleccionarAeropuerto = lazy(() => import('@/pages/SeleccionarAeropuerto'))

// Períodos
const Periodos = lazy(() => import('@/pages/periodos/Periodos'))
const DiasFeriados = lazy(() => import('@/pages/periodos/DiasFeriados'))

// Configuración
const Parametros = lazy(() => import('@/pages/configuracion/Parametros'))
const IndicadoresEconomicos = lazy(() => import('@/pages/configuracion/IndicadoresEconomicos'))
const Secuencias = lazy(() => import('@/pages/configuracion/Secuencias'))
const CodigosAeronauticos = lazy(() => import('@/pages/configuracion/CodigosAeronauticos'))
const ServiciosAereos = lazy(() => import('@/pages/configuracion/ServiciosAereos'))
const Mensajes = lazy(() => import('@/pages/configuracion/Mensajes'))
const Eventos = lazy(() => import('@/pages/configuracion/Eventos'))
const Aplicaciones = lazy(() => import('@/pages/configuracion/Aplicaciones'))

function PrivateRoute({ children, requireAirport = true }: { children: ReactNode; requireAirport?: boolean }) {
  const token = useAuthStore((s) => s.token)
  const aeropuertoActivo = useAuthStore((s) => s.aeropuertoActivo)
  if (!token) return <Navigate to="/login" replace />
  if (requireAirport && !aeropuertoActivo) return <Navigate to="/seleccionar-aeropuerto" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/seleccionar-aeropuerto"
              element={
                <PrivateRoute requireAirport={false}>
                  <SeleccionarAeropuerto />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />

              {/* Organización */}
              <Route path="maestros/aeropuertos" element={<Aeropuertos />} />
              <Route path="maestros/paises" element={<Paises />} />
              <Route path="maestros/ciudades" element={<Ciudades />} />
              <Route path="maestros/zonas" element={<Zonas />} />

              {/* Aerolíneas */}
              <Route path="maestros/aerolineas" element={<Aerolineas />} />
              <Route path="maestros/aeronaves" element={<Aviones />} />
              <Route path="maestros/tipos-aeronave" element={<TiposAeronave />} />
              <Route path="maestros/fabricantes" element={<Fabricantes />} />
              <Route path="maestros/clases-aviacion" element={<ClasesAviacion />} />
              <Route path="maestros/personal-aerolinea" element={<PersonalAerolinea />} />

              {/* Operaciones */}
              <Route path="operaciones/itinerarios" element={<Itinerarios />} />
              <Route path="operaciones/vuelos" element={<Vuelos />} />
              <Route path="operaciones/puertas-embarque" element={<PuertasEmbarque />} />
              <Route path="operaciones/hangares" element={<Hangares />} />
              <Route path="operaciones/servicios" element={<ServiciosOperacion />} />
              <Route path="operaciones/panel" element={<PanelOperaciones />} />

              {/* Tarifas */}
              <Route path="tarifas/conceptos" element={<ConceptosTarifas />} />
              <Route path="tarifas/grupos" element={<GruposConcepto />} />
              <Route path="tarifas/tipos-operacion" element={<TiposOperacion />} />
              <Route path="tarifas/tarifas-operacion" element={<TarifasOperacion />} />
              <Route path="tarifas/tarifas-aerolinea" element={<TarifasAerolinea />} />
              <Route path="tarifas/impuestos" element={<Impuestos />} />

              {/* Facturación */}
              <Route path="facturacion/facturas" element={<Facturas />} />
              <Route path="facturacion/notas-contables" element={<NotasContables />} />
              <Route path="facturacion/acuerdos-pago" element={<AcuerdosPago />} />
              <Route path="facturacion/fuentes" element={<FuentesFacturacion />} />
              <Route path="facturacion/configuracion" element={<ConfigFacturacion />} />

              {/* Liquidaciones */}
              <Route path="liquidaciones/liquidaciones" element={<Liquidaciones />} />
              <Route path="liquidaciones/tasas" element={<TasasAeroportuarias />} />
              <Route path="liquidaciones/pasajeros" element={<Pasajeros />} />
              <Route path="liquidaciones/tipos-pasajero" element={<TiposPasajero />} />
              <Route path="liquidaciones/clases-pasajero" element={<ClasesPasajero />} />

              {/* Seguridad */}
              <Route path="seguridad/usuarios" element={<Usuarios />} />
              <Route path="seguridad/perfiles" element={<Perfiles />} />
              <Route path="seguridad/menu" element={<MenuOpciones />} />

              {/* Períodos */}
              <Route path="periodos/periodos" element={<Periodos />} />
              <Route path="periodos/dias-feriados" element={<DiasFeriados />} />

              {/* Configuración */}
              <Route path="configuracion/parametros" element={<Parametros />} />
              <Route path="configuracion/indicadores" element={<IndicadoresEconomicos />} />
              <Route path="configuracion/secuencias" element={<Secuencias />} />
              <Route path="configuracion/codigos-aeronauticos" element={<CodigosAeronauticos />} />
              <Route path="configuracion/servicios-aereos" element={<ServiciosAereos />} />
              <Route path="configuracion/mensajes" element={<Mensajes />} />
              <Route path="configuracion/eventos" element={<Eventos />} />
              <Route path="configuracion/aplicaciones" element={<Aplicaciones />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
