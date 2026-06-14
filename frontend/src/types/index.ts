export interface User {
  id: number
  username: string
  email: string
  nombre: string
  rol: string
}

export interface Aeropuerto {
  id: number
  codigo: string
  nombre: string
  ciudad: string
  pais: string
  activo: boolean
}

export interface Aerolinea {
  id: number
  codigo: string
  nombre: string
  activo: boolean
}

export interface Avion {
  id: number
  matricula: string
  modelo: string
  fabricante: string
  capacidad_pasajeros: number
  aerolinea_id: number
  aerolinea_nombre?: string
  activo: boolean
}

export interface Concepto {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  tipo: string
  activo: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}
