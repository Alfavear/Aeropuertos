import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCrud from './useCrud'
import api from '@/lib/api'
import type {
  Pais, Ciudad, Zona, Aeropuerto,
  Aerolinea, TipoAeronave, Fabricante, ClaseAviacion, PersonalAerolinea, Aeronave,
  Concepto, GrupoConcepto, TipoOperacion, TarifaOperacion, TarifaAerolinea, Impuesto,
  Itinerario, Vuelo, PuertaEmbarque, Hangar, ServicioOperacion,
  Factura, NotaContable, AcuerdoPago, FuenteFacturacion, ConfigFacturacion,
  Liquidacion, Tasa, Pasajero, TipoPasajero, ClasePasajero,
  Usuario, Perfil, MenuOpcion, BloqueoUsuario,
  Periodo, DiaFeriado,
  ParametroSistema, IndicadorEconomico, Secuencia, CodigoAeronautico, ServicioAereo,
  Mensaje, Evento, Aplicacion,
  MovimientoFacturacion, RegistroPeso, AsignacionPuertaVuelo, NotaOperacion,
  ItemLiquidacion, PasajeroNacional, PasajeroInternacional,
} from '@/types'
import { useAuthStore } from '@/stores/authStore'

// ── Organización ──
export const usePaises = () => useCrud<Pais>('/v1/organizacion/paises')
export const useCiudades = () => useCrud<Ciudad>('/v1/organizacion/ciudades')
export const useZonas = () => useCrud<Zona>('/v1/organizacion/zonas')
export const useAeropuertos = () => useCrud<Aeropuerto>('/v1/organizacion/aeropuertos')

// ── Aerolíneas ──
export const useAerolineas = () => useCrud<Aerolinea>('/v1/aerolineas/aerolineas')
export const useAeronaves = () => useCrud<Aeronave>('/v1/aerolineas/aeronaves')
export const useTiposAeronave = () => useCrud<TipoAeronave>('/v1/aerolineas/tipos-aeronave')
export const useFabricantes = () => useCrud<Fabricante>('/v1/aerolineas/fabricantes')
export const useClasesAviacion = () => useCrud<ClaseAviacion>('/v1/aerolineas/clases-aviacion')
export const usePersonalAerolinea = () => useCrud<PersonalAerolinea>('/v1/aerolineas/personal-aerolinea')

// ── Tarifas ──
export const useConceptos = () => useCrud<Concepto>('/v1/tarifas/conceptos')
export const useGruposConcepto = () => useCrud<GrupoConcepto>('/v1/tarifas/grupos-concepto')
export const useTiposOperacion = () => useCrud<TipoOperacion>('/v1/tarifas/tipos-operacion')
export const useTarifasOperacion = () => useCrud<TarifaOperacion>('/v1/tarifas/tarifas-operacion')
export const useTarifasAerolinea = () => useCrud<TarifaAerolinea>('/v1/tarifas/tarifas-aerolinea')
export const useImpuestos = () => useCrud<Impuesto>('/v1/tarifas/impuestos')

// ── Operaciones ──
export const useItinerarios = () => useCrud<Itinerario>('/v1/operaciones/itinerarios')
export const useVuelos = () => useCrud<Vuelo>('/v1/operaciones/vuelos')
export const usePuertasEmbarque = () => useCrud<PuertaEmbarque>('/v1/operaciones/puertas-embarque')
export const useHangares = () => useCrud<Hangar>('/v1/operaciones/hangares')
export const useServiciosOperacion = () => useCrud<ServicioOperacion>('/v1/operaciones/servicios-operacion')

// ── Facturación ──
export const useFacturas = () => useCrud<Factura>('/v1/facturacion/facturas')
export const useNotasContables = () => useCrud<NotaContable>('/v1/facturacion/notas-contables')
export const useAcuerdosPago = () => useCrud<AcuerdoPago>('/v1/facturacion/acuerdos-pago')
export const useFuentesFacturacion = () => useCrud<FuenteFacturacion>('/v1/facturacion/fuentes-facturacion')
export const useConfigFacturacion = () => useCrud<ConfigFacturacion>('/v1/facturacion/configuracion-facturacion')

// ── Liquidaciones ──
export const useLiquidaciones = () => useCrud<Liquidacion>('/v1/liquidaciones')
export const useTasas = () => useCrud<Tasa>('/v1/liquidaciones/tasas')
export const useTiposPasajero = () => useCrud<TipoPasajero>('/v1/liquidaciones/tipos-pasajero')
export const useClasesPasajero = () => useCrud<ClasePasajero>('/v1/liquidaciones/clases-pasajero')

// ── Seguridad ──
export const useUsuarios = () => useCrud<Usuario>('/v1/seguridad/usuarios')
export const usePerfiles = () => useCrud<Perfil>('/v1/seguridad/perfiles')
export const useMenuOpciones = () => useCrud<MenuOpcion>('/v1/seguridad/menu-opciones')

export const useResetPassword = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      api.post(`/v1/seguridad/usuarios/${id}/reset-password`, { password }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/v1/seguridad/usuarios'] }),
  })
}

export const useBloquearUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BloqueoUsuario }) =>
      api.post(`/v1/seguridad/usuarios/${id}/bloquear`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/v1/seguridad/usuarios'] }),
  })
}

export const useDesbloquearUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`/v1/seguridad/usuarios/${id}/desbloquear`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/v1/seguridad/usuarios'] }),
  })
}

export const useSeleccionarAeropuerto = () => {
  return useMutation({
    mutationFn: (idAeropuerto: number) =>
      api.post('/auth/seleccionar-aeropuerto', { idAeropuerto }).then(r => r.data),
    onSuccess: (data) => {
      useAuthStore.getState().setAeropuertoActivo(data.aeropuertoActivo)
    },
  })
}

export const useMisAeropuertos = () => {
  return useMutation({
    mutationFn: () =>
      api.get('/v1/seguridad/mis-aeropuertos').then(r => r.data),
  })
}

// ── Períodos ──
export const usePeriodos = () => useCrud<Periodo>('/v1/periodos')
export const useDiasFeriados = () => useCrud<DiaFeriado>('/v1/periodos/dias-feriados')

// ── Configuración ──
export const useParametrosSistema = () => useCrud<ParametroSistema>('/v1/configuracion/parametros-sistema')
export const useIndicadoresEconomicos = () => useCrud<IndicadorEconomico>('/v1/configuracion/indicadores-economicos')
export const useSecuencias = () => useCrud<Secuencia>('/v1/configuracion/secuencias')
export const useCodigosAeronauticos = () => useCrud<CodigoAeronautico>('/v1/configuracion/codigos-aeronauticos')
export const useServiciosAereos = () => useCrud<ServicioAereo>('/v1/configuracion/servicios-aereos')
export const useMensajes = () => useCrud<Mensaje>('/v1/configuracion/mensajes')
export const useEventos = () => useCrud<Evento>('/v1/configuracion/eventos')
export const useAplicaciones = () => useCrud<Aplicacion>('/v1/configuracion/aplicaciones')

// ── Facturación (transaccional) ──
export const useMovimientosFacturacion = () => useCrud<MovimientoFacturacion>('/v1/facturacion/movimientos-facturacion')

// ── Operaciones (transaccional) ──
export const useRegistrosPeso = () => useCrud<RegistroPeso>('/v1/operaciones/registros-peso')
export const useAsignacionesPuertaVuelo = () => useCrud<AsignacionPuertaVuelo>('/v1/operaciones/asignaciones-puerta-vuelo')
export const useNotasOperacion = () => useCrud<NotaOperacion>('/v1/operaciones/notas-operacion')

// ── Liquidaciones (transaccional) ──
export const useItemsLiquidacion = () => useCrud<ItemLiquidacion>('/v1/liquidaciones/items-liquidacion')
export const usePasajerosNacionales = () => useCrud<PasajeroNacional>('/v1/liquidaciones/pasajeros-nacionales')
export const usePasajerosInternacionales = () => useCrud<PasajeroInternacional>('/v1/liquidaciones/pasajeros-internacionales')
