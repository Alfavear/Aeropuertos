// ============================================================
// ORGANIZACIÓN
// ============================================================
export interface Pais {
  id: number
  codigo: string
  nombre: string
  nacionalidad?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Ciudad {
  id: number
  nombre: string
  idPais: number
  paisNombre?: string
  activo: boolean
}

export interface Aeropuerto {
  id: number
  codigoOACI: string
  codigoIATA: string
  nombre: string
  idCiudad: number
  ciudadNombre?: string
  paisNombre?: string
  activo: boolean
  controlAdministrativo: boolean
  opera24Horas: boolean
  horaApertura?: string
  horaCierre?: string
}

export interface Zona {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface ZonaAeropuerto {
  id: number
  idAeropuerto: number
  idZona: number
  aeropuertoNombre?: string
  zonaNombre?: string
}

export interface HorarioAeropuerto {
  id: number
  idAeropuerto: number
  diaSemana: number
  horaApertura: string
  horaCierre: string
  activo: boolean
}

// ============================================================
// AEROLÍNEAS
// ============================================================
export interface Aerolinea {
  id: number
  codigo: string
  nombre: string
  idPais?: number
  paisNombre?: string
  activo: boolean
  recargoNocturno?: number
  horasGraciaParqueo?: number
  horasGraciaHangar?: number
}

export interface TipoAeronave {
  id: number
  codigo: string
  nombre: string
  idFabricante?: number
  fabricanteNombre?: string
  pesoMaxDespegue?: number
  pesoMaxAterrizaje?: number
  capacidadPasajeros?: number
  activo: boolean
}

export interface Fabricante {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface Aeronave {
  id: number
  matricula: string
  idTipoAeronave: number
  idAerolinea: number
  idFabricante?: number
  activo: boolean
  tipoCodigo?: string
  aerolineaNombre?: string
}

export interface ClaseAviacion {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface PersonalAerolinea {
  id: number
  nombres: string
  apellidos: string
  idAerolinea: number
  aerolineaNombre?: string
  cargo: string
  activo: boolean
}

// ============================================================
// TARIFAS
// ============================================================
export interface Concepto {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  tipo: 'INGRESO' | 'EGRESO'
  idGrupo?: number
  grupoNombre?: string
  activo: boolean
}

export interface GrupoConcepto {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface TipoOperacion {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface TarifaOperacion {
  id: number
  idConcepto: number
  idTipoOperacion: number
  idTipoAeronave?: number
  pesoMin: number
  pesoMax: number
  valor: number
  moneda: 'COP' | 'USD'
  activo: boolean
}

export interface Impuesto {
  id: number
  codigo: string
  nombre: string
  porcentaje: number
  activo: boolean
}

export interface TarifaAerolinea {
  id: number
  idConcepto: number
  idAerolinea: number
  aerolineaNombre?: string
  idTipoAeronave?: number
  valor: number
  moneda: 'COP' | 'USD'
  activo: boolean
}

// ============================================================
// OPERACIONES
// ============================================================
export interface Vuelo {
  id: number
  codigo: string
  idAerolinea: number
  aerolineaNombre?: string
  idAeronave?: number
  aeronaveMatricula?: string
  origen: string
  destino: string
  fecha: string
  horaSalida: string
  horaLlegada: string
  estado: string
}

export interface Itinerario {
  id: number
  codigo: string
  idAerolinea: number
  aerolineaNombre?: string
  origen: string
  destino: string
  diaSemana: number
  horaSalida: string
  horaLlegada: string
  activo: boolean
}

export interface ServicioOperacion {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}
export interface PuertaEmbarque {
  id: number
  codigo: string
  nombre: string
  idAeropuerto: number
  aeropuertoNombre?: string
  activo: boolean
}

export interface Hangar {
  id: number
  codigo: string
  nombre: string
  idAeropuerto: number
  aeropuertoNombre?: string
  capacidad: number
  activo: boolean
}

// ============================================================
// CONFIGURACIÓN
// ============================================================
export interface ParametroSistema {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  valor: string
  tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OPTIONS'
  modulo: string
  opciones?: string
  orden: number
  editable: boolean
  visible: boolean
}

export interface IndicadorEconomico {
  id: number
  codigo: string
  nombre: string
  valor: number
  fecha: string
}

export interface Secuencia {
  id: number
  nombre: string
  prefijo: string
  consecutivo: number
  longitud: number
  idAeropuerto?: number
}

export interface CodigoAeronautico {
  id: number
  codigo: string
  tipo: number
  descripcion: string
}

export interface ServicioAereo {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface Mensaje {
  id: number
  codigo: string
  titulo: string
  contenido: string
  tipo: string
  idUsuario?: number
  leido: boolean
}

export interface TipoEvento {
  codigo: string
  nombre: string
  descripcion?: string
}

export interface Evento {
  id: number
  codigoTipo: string
  codigo: string
  nombre: string
  descripcion?: string
  deshabilitar: boolean
}

// ============================================================
// SEGURIDAD
// ============================================================
export interface Usuario {
  id: number
  username: string
  email: string
  nombre: string
  telefono?: string
  activo: boolean
  bloqueado: boolean
  bloqueoProgramado: boolean
  bloqueoMovimiento: boolean
  bloqueoSevero: boolean
  fechaInicioBloqueo?: string
  debeCambiarPass: boolean
  ultimoCambioPass?: string
  idPerfil: number
  perfil?: { id: number; codigo: string; nombre: string }
  fechaVence?: string
  ultimoAcceso?: string
  intentosFallidos?: number
  createdAt: string
  updatedAt: string
}

export interface Perfil {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  activo: boolean
  totalUsuarios?: number
  createdAt: string
  updatedAt: string
}

export interface MenuOpcion {
  id: number
  nombre: string
  ruta: string
  icono: string
  idPadre?: number
  orden: number
  activo?: boolean
  descripcion?: string
  permitido?: boolean
}

export interface MenuOpcionConPermiso extends MenuOpcion {
  permitido: boolean
  children?: MenuOpcionConPermiso[]
}

export interface Aplicacion {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  habilitada: boolean
}

export interface BloqueoUsuario {
  bloqueoProgramado?: boolean
  bloqueoMovimiento?: boolean
  bloqueoSevero?: boolean
  fechaInicioBloqueo?: string
}

export interface ValidacionBloqueo {
  bloqueado: boolean
  tipo: string | null
  mensaje: string | null
}

export interface AccesoAeropuerto {
  id: number
  idUsuario: number
  idAeropuerto: number
  aeropuerto?: {
    id: number
    codigo: string
    nombre: string
  }
  activo: boolean
  cambiarAeropuerto: boolean
  cambiarFechaFact: boolean
  cambiarFuente: boolean
  cambiarSerie: boolean
  administradorPeriodos: boolean
  cambiarEstadoInclusoFacturado: boolean
  controlaTasas: boolean
  idPuertaControla?: number
  permitirReversiones: boolean
  revertirSoloPOS: boolean
  habilOperInter: boolean
  usaFuenteContado: boolean
  fuenteContado?: string
  serieContado?: string
  usaFuenteCredito: boolean
  fuenteCredito?: string
  serieCredito?: string
  usaFuenteNotasDB: boolean
  fuenteNotaDB?: string
  serieNotaDB?: string
  usaFuenteNotasCR: boolean
  fuenteNotaCR?: string
  serieNotaCR?: string
}

// ============================================================
// FACTURACIÓN
// ============================================================
export interface Factura {
  id: number
  numero: string
  idAerolinea: number
  aerolineaNombre?: string
  idAeropuerto: number
  aeropuertoNombre?: string
  fecha: string
  subtotal: number
  total: number
  estado: string
}

export interface NotaContable {
  id: number
  numero: string
  tipo: 'DEBITO' | 'CREDITO'
  idFactura?: number
  concepto: string
  valor: number
  activo: boolean
}

export interface AcuerdoPago {
  id: number
  codigo: string
  idAerolinea: number
  aerolineaNombre?: string
  fecha: string
  monto: number
  saldo: number
  estado: string
}

export interface FuenteFacturacion {
  id: number
  codigo: string
  nombre: string
  idAeropuerto?: number
  aeropuertoNombre?: string
  activo: boolean
}

export interface ConfigFacturacion {
  id: number
  idAerolinea: number
  aerolineaNombre?: string
  idConcepto: number
  idAeropuerto?: number
  activo: boolean
}

// ============================================================
// LIQUIDACIONES
// ============================================================
export interface Liquidacion {
  id: number
  codigo: string
  idAeropuerto: number
  aeropuertoNombre?: string
  idPeriodo?: number
  fecha: string
  totalPasajeros: number
  totalTasas: number
  estado: string
}

export interface Pasajero {
  id: number
  idLiquidacion: number
  tipo: string
  cantidad: number
  valorTasa: number
  subtotal: number
}
export interface Tasa {
  id: number
  codigo: string
  nombre: string
  valor: number
  moneda: 'COP' | 'USD'
  activo: boolean
  idAeropuerto?: number
}

export interface TipoPasajero {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface ClasePasajero {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

// ============================================================
// PERIODOS
// ============================================================
export interface Periodo {
  id: number
  codigo: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  abierto: boolean
  activo: boolean
}

export interface DiaFeriado {
  id: number
  fecha: string
  nombre: string
  idAeropuerto?: number
}

// ============================================================
// OPERACIONES — Registros transaccionales
// ============================================================
export interface RegistroPeso {
  id: number
  idOperacion: number
  peso: number
  fecha: string
}

export interface AsignacionPuertaVuelo {
  id: number
  idOperacion?: number
  idPuerta?: number
  fecha?: string
  horaIni?: string
  horaFin?: string
  puertaCodigo?: string
}

export interface NotaOperacion {
  id: number
  idOperacion?: number
  nota?: string
  usuario?: string
  fecha?: string
}

export interface MovimientoFacturacion {
  id: number
  tipo: 'ATERR' | 'PARQUEO' | 'HANGAR' | 'TASA' | 'SERVICIO'
  idOperacion?: number
  idConcepto?: number
  idAerolinea?: number
  idAeropuerto?: number
  idHangar?: number
  idPuerta?: number
  idServicio?: number
  idTasa?: number
  idPasajero?: number
  horaIni?: string
  horaFin?: string
  peso?: number
  tarifa?: number
  cantidad?: number
  valor?: number
  facturado: boolean
  idFactura?: number
  fecha: string
  conceptoNombre?: string
  tipoDescripcion?: string
}

export interface ItemLiquidacion {
  id: number
  idLiquidacion: number
  codigo?: string
  matricula?: string
  vuelo?: string
  totalEmbNac?: number
  transitoNacional?: number
  exentosNacional?: number
  totalPaganTasaNac?: number
  pasajerosDolaresInt?: number
  pasajerosPesosInt?: number
  totalPasajerosInt?: number
  exentosInternacional?: number
  transitoInternacional?: number
  totalEmbInt?: number
  totalPasajeros?: number
  tasaNacContado?: number
  pasajerosPesosIntCont?: number
  pasajerosDolaresIntCont?: number
}

export interface PasajeroNacional {
  id: number
  idLiquidacion: number
  matricula: string
  vuelo: string
  idAeropuertoDestino: number
  totalPasajero: number
  idAerolinea: number
  fecha: string
  idTipoPasajero: number
  idClasePasajero?: number
}

export interface PasajeroInternacional {
  id: number
  idLiquidacion: number
  matricula: string
  vuelo: string
  idAeropuertoDestino?: number
  totalPasajero: number
  idAerolinea?: number
  fecha: string
  pasajDolares: number
  pasajPesos: number
}

// ── Calculation Engine (frontend mirror of backend) ──

export interface CalcularConceptosRequest {
  idAerolinea: number
  idAeropuerto: number
  fecha: string
  nacionalidad: 'N' | 'I'
  peso?: number
  monedaPago?: number
  horaLlegada?: string
  horaSalida?: string
  totalPaganTasa?: number
  pasajerosPesos?: number
  pasajerosDolares?: number
  cantidad?: number
  conceptos: string[]
}

export interface ConceptoCalculado {
  idConcepto: number
  codigo: string
  nombre: string
  tipo: string
  valor: number
  tarifa: number
  cantidad: number
  moneda: string
  formula?: string
}

export interface ResultadoCalculo {
  exito: boolean
  idAerolinea: number
  idAeropuerto: number
  fecha: string
  nacionalidad: string
  peso?: number
  conceptos: ConceptoCalculado[]
  totalCOP?: number
  totalUSD?: number
  error?: string
}

// ── Frontend composite types for Operations Panel ──

export interface ConceptoCosto {
  id: string
  concepto: string
  conceptoId?: number
  tipo: string
  valorCOP: number
  valorUSD: number
  estado: 'PENDIENTE' | 'FACTURADO' | 'ANULADO'
  tipoFacturacion: string
  documento?: string
}

export interface OperacionPanel {
  id: number
  codigo: string
  idAerolinea: number
  aerolineaNombre?: string
  idAeronave?: number
  aeronaveMatricula?: string
  origen: string
  destino: string
  fecha: string
  horaLlegada?: string
  horaSalida?: string
  estado: string
  tieneEntrada: boolean
  tieneSalida: boolean
  totalMovimientos?: number
  totalFacturado?: number
}

// ============================================================
// GENÉRICOS
// ============================================================
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  necesitaCambioPass?: boolean
  necesitaSeleccionarAeropuerto?: boolean
  aeropuertos?: {
    id: number
    codigo: string
    nombre: string
    permisos: Record<string, boolean>
  }[]
  user: User
}

export interface SeleccionarAeropuertoResponse {
  token: string
  aeropuertoActivo: AeropuertoActivo
}

export interface User {
  id: number
  username: string
  email: string
  nombre: string
  telefono?: string
  perfil?: { id: number; codigo: string; nombre: string } | null
}

export interface AeropuertoActivo {
  id: number
  codigo: string
  nombre: string
}
