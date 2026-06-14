# Bitácora del Proyecto — [Nombre por definir]

> **Misión:** Crear un sistema de administración aeroportuaria de nueva generación
> para **concesiones multi-aeropuerto**. Esto NO es una migración del sistema legacy
> "Zeus Aeropuertos" (VB6 + SQL Server), sino una **reingeniería completa** que toma
> el dominio de negocio y lo reinventa desde cero con arquitectura moderna.
>
> **Stack:** NestJS + Prisma + PostgreSQL + React + TypeScript + Tailwind CSS
>
> **Pendiente:** Definir nombre comercial del producto

---

## Fase 0 — Análisis y Dimensionamiento (Completada ✅)

### 0.1 Inventario del sistema legacy

| Componente | Cantidad |
|---|---|
| Tablas SQL Server | 205 |
| Stored Procedures | 600+ |
| Funciones | 80+ |
| Formularios VB6 | 180+ |
| Clases VB6 de negocio | 110+ |
| Reportes (Frx) | 50+ |
| Migraciones Liquibase | 60+ |
| Archivos de parámetros | 55+ |

### 0.2 Análisis de tablas obsoletas

Se identificaron y **eliminaron** del nuevo schema las siguientes tablas por ser:

- **Temporales / Técnicas:** `TempMovFact`, `ZeusTempSpidReg`, `ZeusLogArchivoCSV`, `ZeusOperacionesCSV`, `ZeusParqueosCSV`, `Infrahd`, `PeriodoAeropuertoRespaldo`
- **Sistema de variables dinámicas (obsoleto):** 15 tablas `Variable*`, `Query*`, `SQLWIZARD`, `SentenciaPivotTable`
- **Multi-idioma (no necesario para MVP):** `Diccionario`, `DICCIONARIO_MENSAJES`, `DICCIONARIOIDIOMA`
- **Integración bancaria específica:** `ZProcesadosBancolombia`, `ZSecuenciaBancolombia`
- **CLR Assemblies (SQL Server):** `GestionAssemblies`
- **Contabilidad legacy:** `MOVIMIF0`, `MOVIMIF0Ant`, `Transac_*`, `Document_Insertar_Old`, `Document_Inv`
- **Automatización de conceptos (sobreingeniería):** 6 tablas `DLLConceptosAuto_*`
- **Exportación CSV:** `ZeusSetConfigArchivosExp`, `ZeusConfiguracionArchivosExp`, `ZeusEstructCSV*`, `ZeusArchivoPlano`
- **Redundantes:** `movangar`, `movfacop`, `movfaccarga`, `movfacasistierra`, `RegistroConceptosFact`, `RegistroConceptosRev`
- **UI específica VB6:** `ComboConceptosAero`, `LogoEmpresa`, `Relaciones`

**Total tablas eliminadas:** ~80  
**Total tablas preservadas y rediseñadas:** ~80  
**Total tablas nuevas (modernizadas):** 5

### 0.3 Análisis de vulnerabilidades legacy

| Vulnerabilidad | Impacto | Mitigación en nuevo sistema |
|---|---|---|
| SQL Injection (VB6 concatenaba queries) | 🔴 Crítico | Prisma ORM + parameterized queries |
| Sin autenticación robusta | 🔴 Crítico | JWT + Passport + bcrypt + refresh tokens |
| Password en texto plano (VB6) | 🔴 Crítico | Hashing bcrypt con salt |
| Sin control de acceso por roles | 🟡 Alto | RBAC (Role Based Access Control) |
| Sin registro de auditoría | 🟡 Alto | Logs estructurados + auditoría de cambios |
| Sin validación de entrada de datos | 🔴 Crítico | Zod + class-validator + TypeScript |
| XSS (VB6 no aplica pero web sí) | 🟡 Alto | React escape automático + CSP headers |
| Sin HTTPS | 🟡 Alto | TLS por defecto + HSTS |
| Sin rate limiting | 🟡 Medio | NestJS throttler |
| Sin sanitización de datos | 🟡 Medio | Validación en capa de aplicación |
| Base de datos sin cifrado | 🟡 Medio | PostgreSQL TDE + column encryption |
| Backups no automatizados | 🟡 Medio | Estrategia de backup definida |

### 0.4 Oportunidades de mejora detectadas

- **Arquitectura monolítica VB6** → Microservicios modulares (NestJS)
- **Sin API** → RESTful API con documentación Swagger
- **Desktop-only** → Web responsive multi-dispositivo
- **Sin integración continua** → CI/CD pipeline (GitHub Actions)
- **Sin tests automatizados** → Test unitarios + e2e (Jest + Supertest)
- **Acoplamiento UI-negocio** → Separación de capas (Controller → Service → Repository)
- **Sin caché** → Redis para consultas frecuentes (catalogs)
- **Sin colas de procesamiento** → Bull Queue para tareas pesadas (reportes, facturación masiva)

---

## Fase 1 — Diseño Arquitectónico (Completada ✅)

### 1.1 Stack tecnológico

```
Frontend (React 19 + TS + Vite 6)
    ↕ REST API (JSON)
Backend (NestJS 11 + TypeScript)
    ↕ Prisma ORM
PostgreSQL 16
```

### 1.2 Principios de diseño

1. **Domain-Driven Design** — Cada módulo es un dominio de negocio
2. **Clean Architecture** — Separación en capas (presentación → aplicación → infraestructura → dominio)
3. **API First** — Todo expuesto via REST, documentado con Swagger
4. **Security by Design** — Autenticación, autorización, validación desde el inicio
5. **Data Sovereignty** — Cada aeropuerto puede tener sus datos aislados (multi-tenencia por BU)

### 1.3 Módulos del sistema

| Módulo | Descripción | Estado |
|---|---|---|
| `organizacion` | Países, ciudades, aeropuertos, zonas | ✅ |
| `aerolineas` | Aerolíneas, aeronaves, tipos, fabricantes | ✅ |
| `operaciones` | Vuelos, itinerarios, puertas, hangares | ✅ |
| `tarifas` | Conceptos, tarifas, impuestos | ✅ |
| `facturacion` | Facturas, notas, pagos, acuerdos | ✅ |
| `liquidaciones` | Infraestructura, tasas, pasajeros | ✅ |
| `seguridad` | Usuarios, roles, permisos, menú | ✅ |
| `configuracion` | Parámetros, fuentes, secuencias | ✅ |
| `auditoria` | Logs, trazabilidad | 🟡 Parcial |

---

## Fase 2 — Modelado de Datos (Completada ✅)

### 2.1 Nuevo esquema de base de datos

> **Nota:** Se rediseñaron los nombres de todas las tablas con nomenclatura limpia,
> eliminando prefijos (`Mae`, `Cls`, `Frm`, `Rpt`, `Dto`) y usando nombres descriptivos en español.

#### Dominio: Organización (`organizacion_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `paises` | `MaePaises` | Catálogo de países |
| `ciudades` | `MaeCiudades` | Ciudades con FK a país |
| `aeropuertos` | `MaeAeropuertos` | Aeropuertos administrados |
| `zonas` | `MaeZonas` | Zonas geográficas |
| `zonas_aeropuerto` | `MaeZonasAeropuertos` | Zonas por aeropuerto |
| `horarios_aeropuerto` | `MaeHorarioAeropuerto` | Horarios operativos por aeropuerto |

#### Dominio: Aerolíneas (`aerolineas_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `aerolineas` | `MaeAerolineas` | Aerolíneas registradas |
| `aeronaves` | `MaeAviones` | Aeronaves (aviones) |
| `tipos_aeronave` | `MaeTipoAviones` | Tipos/modelos de aeronave |
| `fabricantes` | `Fabricantes` | Fabricantes de aeronaves |
| `clases_aviacion` | `MaeTipoAviacion` | Clasificación de aviación |
| `personal_aerolinea` | `MaePersonal` | Personal por aerolínea |

#### Dominio: Operaciones (`operaciones_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `itinerarios` | `MaeItinerario` | Itinerarios de vuelo |
| `vuelos` | `MaeVuelos` | Catálogo de vuelos |
| `puertas_embarque` | `MaePuertas` | Puertas de embarque |
| `hangares` | `MaeHangares` | Hangares por aeropuerto |
| `servicios_operacion` | `ServOperacion` | Servicios adicionales por operación |
| `registro_pesos` | `RegPesosAviones` | Pesos registrados de aeronaves |
| `asignacion_puerta_vuelo` | `MovControlVueloPuerta` | Asignación puerta-vuelo |
| `notas_operacion` | `NotasAOperaciones` | Notas sobre operaciones |

#### Dominio: Tarifas (`tarifas_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `conceptos` | `MaeConceptos` | Conceptos de facturación |
| `grupos_concepto` | `GruposdeConceptos` | Grupos de conceptos |
| `tipos_operacion` | `MaeTipoOperacion` | Tipos de operación (aterrizaje, despegue, etc.) |
| `tarifas_operacion` | `MaeTarifaOperacion` | Tarifas por operación |
| `tarifas_aerolinea` | `MaeTarifaPorAerolineas` | Tarifas negociadas por aerolínea |
| `impuestos` | `MaeImpuestos` | Catálogo de impuestos |

#### Dominio: Facturación (`facturacion_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `facturas` | `FacturasAero` | Cabecera de facturas |
| `factura_detalles` | `FacturaConceptos` | Detalle de factura |
| `factura_pagos` | `FacturaPagos` | Pagos aplicados |
| `factura_impuestos` | `FacturaImpuesto` | Impuestos por factura |
| `notas_contables` | `NotasContables` | Notas contables |
| `acuerdos_pago` | `AcuerdosdePago` | Acuerdos de pago |
| `fuentes_facturacion` | `FuentesFacturacionAeropuerto` | Fuentes y series por aeropuerto |
| `configuracion_facturacion` | `ConfigFact` | Configuración por cliente |

#### Dominio: Liquidaciones (`liquidaciones_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `liquidaciones` | `Infrasa` | Liquidación de infraestructura |
| `items_liquidacion` | `ItemsInfrasa` | Items de liquidación |
| `pasajeros_nacionales` | `InfrasaPasxNac` | Pasajeros nacionales |
| `pasajeros_internacionales` | `InfrasaPasxInt` | Pasajeros internacionales |
| `tasas_aeroportuarias` | `Tasas` | Tasas aeroportuarias |
| `tipos_pasajero` | `MaeTipoPasajero` | Tipos de pasajero |
| `clases_pasajero` | `ClasesPasajeros` | Clases de pasajero |

#### Dominio: Movimientos Contables (`movimientos_*`)

Se unificaron las 10+ tablas de movimientos (`MovFactTasas`, `MovFactParq`, `MovFactOper`, etc.)
en una sola tabla polimórfica `movimientos_facturacion` con campos genéricos + tipo.

#### Dominio: Seguridad (`seguridad_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `usuarios` | `Usuario` | Usuarios del sistema |
| `perfiles` | `Perfil` | Roles y perfiles |
| `permisos_perfil` | `PerfilProceso` | Permisos por perfil |
| `menu_opciones` | `Menu` | Opciones de menú |
| `sesiones_usuario` | `UsuarioAccesos` | Historial de sesiones |
| `accesos_aeropuerto` | `UsuarioAeropuerto` | Acceso por aeropuerto |

#### Dominio: Configuración (`configuracion_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `parametros_sistema` | `Parametros` | Parámetros (simplificado: solo 30 esenciales) |
| `secuencias` | `MaeConsecutivos` | Secuencias de documentos |
| `indicadores_economicos` | `Indicadores` | TRM, IPC, indicadores |
| `codigos_aeronauticos` | `CodigosAeronauticos` | Códigos OACI/IATA |
| `servicios_aereos` | `MaeServiciosAereos` | Servicios aeroportuarios |

#### Dominio: Auditoría (`auditoria_*`)

| Nueva tabla | Descripción |
|---|---|
| `bitacora_errores` | Reemplaza `ZeusFWErrores` — errores de aplicación |
| `auditoria_operaciones` | Trazabilidad de cambios en datos sensibles |

### 2.2 Tablas eliminadas (80 tablas)

Ver listado completo en `docs/tablas_eliminadas.md`

---

## Fase 3 — Implementación Backend (En Progreso 🟡)

### 3.1 Estructura de módulos

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo raíz
├── common/                    # Código compartido
│   ├── guards/                # Guards de autenticación
│   ├── decorators/            # Decoradores personalizados
│   ├── filters/               # Filtros de excepción
│   ├── interceptors/          # Interceptores (logging, transform)
│   └── pipes/                 # Pipes de validación
├── modules/
│   ├── organizacion/          # CRUD paises, ciudades, aeropuertos
│   ├── aerolineas/            # CRUD aerolíneas, aeronaves
│   ├── operaciones/           # Itinerarios, vuelos
│   ├── tarifas/               # Conceptos, tarifas, impuestos
│   ├── facturacion/           # Facturación
│   ├── liquidaciones/         # Infraestructura, tasas
│   ├── seguridad/             # Usuarios, roles
│   └── configuracion/         # Parámetros, secuencias
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```

### 3.2 Endpoints API

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Inicio de sesión | No |
| POST | `/api/auth/refresh` | Refrescar token | Sí |
| GET | `/api/health` | Health check | No |
| GET | `/api/:modulo` | Listar entidades | Sí |
| GET | `/api/:modulo/:id` | Obtener entidad | Sí |
| POST | `/api/:modulo` | Crear entidad | Sí |
| PUT | `/api/:modulo/:id` | Actualizar entidad | Sí |
| DELETE | `/api/:modulo/:id` | Eliminar entidad | Sí* |

> \* Los delete son lógicos (soft delete) con campo `fecha_baja`

### 3.3 Pendiente backend

- [ ] Módulo de reportes (generación PDF/Excel)
- [ ] Facturación electrónica
- [ ] Integración con pasarela de pagos
- [ ] Cache Redis para catálogos
- [ ] Pruebas unitarias (Jest)
- [ ] Documentación Swagger completa
- [ ] Rate limiting (throttler)
- [ ] Auditoría de cambios (trigger en Prisma)

---

## Fase 4 — Implementación Frontend (En Progreso 🟡)

### 4.1 Estructura de páginas

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, Table, Card, Dialog)
│   └── layout/          # Sidebar, Header, AppLayout
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── modules/         # CRUDs por módulo
│       ├── organizacion/
│       │   ├── Paises.tsx
│       │   ├── Ciudades.tsx
│       │   └── Aeropuertos.tsx
│       ├── aerolineas/
│       │   ├── Aerolineas.tsx
│       │   └── Aeronaves.tsx
│       └── ...
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
├── services/            # API calls (Axios)
└── types/               # TypeScript interfaces
```

### 4.2 Pendiente frontend

- [ ] CRUD completo para todos los módulos
- [ ] Dashboard con métricas reales
- [ ] Tablero de reportes
- [ ] Módulo de operaciones (check-in, boarding)
- [ ] Tema claro/oscuro
- [ ] Responsive design
- [ ] Internacionalización (i18n)
- [ ] Pruebas (Vitest + Testing Library)
- [ ] Modo offline (PWA)

---

## Fase 5 — Datos Iniciales (Seed) (Pendiente 🔴)

### 5.1 Catálogos obligatorios

Estos datos deben cargarse al inicializar la base:

- [ ] **Países** — Colombia y principales (ISO 3166)
- [ ] **Tipos de operación** — Aterrizaje, Despegue, Estacionamiento, etc.
- [ ] **Clases de aviación** — Comercial, Carga, Privada, Militar
- [ ] **Tipos de pasajero** — Adulto, Menor, Infante, Exento
- [ ] **Clases de pasajero** — Primera Clase, Ejecutiva, Económica
- [ ] **Parámetros del sistema** — ~30 parámetros esenciales
- [ ] **Perfiles base** — Administrador, Operador, Facturador, Consulta
- [ ] **Menú base** — Estructura de navegación
- [ ] **Usuario admin** — admin/admin123 (cambiar en producción)

### 5.2 Parámetros esenciales (30 de 55+ originales)

Se redujeron de 55+ a 30 parámetros. Se eliminaron:
- Parámetros de UI obsoletos (colores de grilla, ocultar funciones)
- Parámetros de versión (manejado por migrations)
- Parámetros de configuración email (se maneja por entorno)
- Parámetros específicos de clientes (AeroOriente)

Los 30 parámetros esenciales cubren:
1. Cálculo de parqueo (Por Hora/Fracción)
2. Modelo de facturación (Por evento/Periódica)
3. Días vencimiento para facturar tasas
4. Código concepto bomberos
5. Control certificado explotación nacional
6. Horas de gracia parqueo/hangar
7. Recargos nocturnos
8. TRM en aterrizajes
9. Redondeos
10. Facturación electrónica
11. Entre otros...

---

## Fase 6 — Seguridad y Calidad (Pendiente 🔴)

- [ ] Análisis de vulnerabilidades OWASP Top 10
- [ ] Pruebas de penetración
- [ ] Code review checklist
- [ ] Estándares de codificación (ESLint + Prettier)
- [ ] Husky + lint-staged (pre-commit hooks)
- [ ] Análisis estático (SonarQube)
- [ ] Pruebas de carga (k6)
- [ ] Monitoreo (Sentry + Prometheus + Grafana)

---

## Fase 7 — Despliegue (Pendiente 🔴)

- [ ] Docker Compose (PostgreSQL + Backend + Frontend + Redis)
- [ ] CI/CD con GitHub Actions
- [ ] Variables de entorno (envíos)
- [ ] SSL/TLS (Let's Encrypt)
- [ ] Backup automático de BD
- [ ] Health checks
- [ ] Documentación de despliegue

---

## Glosario de cambios importantes

| Concepto legacy | Cambio | Motivo |
|---|---|---|
| `MaeXxx` → prefijo | Eliminado | Sin prefijos, nombres claros |
| `Infrasa` → concepto confuso | `liquidaciones` | Claridad del negocio |
| `MovFactXxx` → 10 tablas separadas | `movimientos_facturacion` unificada | Polimorfismo, menos tablas |
| `DLLConceptosAuto_*` | Eliminado | Sobreingeniería, no esencial |
| 15 tablas `Variable*` | Eliminado | Sistema de variables no utilizado |
| `ZeusFWErrores` | `bitacora_errores` | Nombre más descriptivo |
| Sistema de parámetros (55+) | 30 parámetros | Solo esenciales |

---

## Estadísticas del proyecto

| Métrica | Legacy (VB6) | Nuevo (Web) |
|---|---|---|
| Lenguaje | VB6 + T-SQL | TypeScript |
| Base de datos | SQL Server | PostgreSQL 16 |
| Tablas | 205 | ~85 |
| Arquitectura | Desktop monolítico | Web modular (NestJS) |
| API | Ninguna | RESTful + Swagger |
| Autenticación | Básica | JWT + bcrypt |
| Frontend | Windows Forms | React 19 + Tailwind |
| Testing | Manual | Jest + Supertest + Vitest |
| Despliegue | Instalador MSI | Docker + CI/CD |

---

*Última actualización: 14 de Junio, 2026*
