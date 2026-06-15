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

| Módulo | Entidades | Endpoints | Estado |
|---|---|---|---|---|
| `organizacion/` | 6 | 30 | ✅ Completo |
| `aerolineas/` | 9 (incl. AerolineaCtaConcepto) | 45 | ✅ Completo |
| `tarifas/` | 7 (incl. TarifaOperacionHistorico) | 35 | ✅ Completo |
| `configuracion/` | 10 (incl. ConfigTasaAeropuerto) | 50 | ✅ Completo |
| `periodos/` | 4 | 26 | ✅ Completo |
| `reportes/` | 2 | 10 | ✅ Completo |
| `operaciones/` | 8 | 40 | ✅ Completo |
| `facturacion/` | 11 | 55 | ✅ Completo |
| `seguridad/` | 7 | 35 | ✅ Completo |
| `liquidaciones/` | 7 | 35 | ✅ Completo |
| **TOTAL** | **71** | **~361** | **10/10 módulos** |

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

#### Dominio: Períodos (`periodos_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `periodos` | `Periodos` | Períodos contables |
| `periodos_aeropuerto` | `PeriodoAeropuerto` | Apertura/cierre por aeropuerto |
| `dias_aeropuerto` | `DiasAero` | Días operativos |
| `dias_feriados` | `DiasFeriados` | Días feriados |

#### Dominio: Reportes (`reportes_*`)

| Nueva tabla | Vieja tabla | Descripción |
|---|---|---|
| `reportes` | `ReportesRPT` | Catálogo de reportes |
| `categorias_reporte` | `CategoriaRPT` | Categorías de reportes |

#### Dominio: Auditoría (`auditoria_*`)

| Nueva tabla | Descripción |
|---|---|
| `bitacora_errores` | Reemplaza `ZeusFWErrores` — errores de aplicación |
| `auditoria_operaciones` | Trazabilidad de cambios en datos sensibles |

### 2.2 Tablas eliminadas (80 tablas)

Ver listado completo en `docs/tablas_eliminadas.md`

---

## Fase 3 — Implementación Backend (Completada ✅)

### 3.1 Estructura de módulos

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo raíz (10 módulos registrados)
├── prisma/                    # PrismaService + PrismaModule
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── auth/                      # AuthModule (JWT + Passport)
├── organizacion/              # 6 entidades ✅
├── aerolineas/                # 9 entidades ✅
├── tarifas/                   # 7 entidades ✅
├── configuracion/             # 10 entidades ✅
├── periodos/                  # 4 entidades ✅
├── reportes/                  # 2 entidades ✅
├── operaciones/               # 8 entidades + CalculosService ✅
├── facturacion/               # 11 entidades ✅
├── seguridad/                 # 7 entidades ✅
└── liquidaciones/             # 7 entidades ✅
```

### 3.2 Módulos backend — Estado final

| Módulo | Ruta base | Entidades | Endpoints | Servicios | Estado |
|---|---|---|---|---|---|
| `organizacion` | `/api/v1/organizacion` | 6 | 30 | — | ✅ |
| `aerolineas` | `/api/v1/aerolineas` | 9 | 45 | — | ✅ |
| `tarifas` | `/api/v1/tarifas` | 7 | 35 | — | ✅ |
| `configuracion` | `/api/v1/configuracion` | 10 | 50 | — | ✅ |
| `periodos` | `/api/v1/periodos` | 4 | 26 | — | ✅ |
| `reportes` | `/api/v1/reportes` | 2 | 10 | — | ✅ |
| `operaciones` | `/api/v1/operaciones` | 8 | 41 | CalculosService | ✅ |
| `facturacion` | `/api/v1/facturacion` | 11 | 55 | — | ✅ |
| `seguridad` | `/api/v1/seguridad` | 7 | 35 | — | ✅ |
| `liquidaciones` | `/api/v1/liquidaciones` | 7 | 35 | — | ✅ |
| **TOTAL** | — | **71 entidades** | **~362 endpoints** | **1 motor de cálculo** | **10/10 ✅** |

### 3.3 Motor de cálculo de facturación (Nuevo)

El `CalculosService` implementa el motor de cálculo legacy (`FnGetTarifaIndexada`, `FnCalcTarifLocalForInt`, `SpCalculaParqueo`, `SpConfigConceptosInfrasas`) como código TypeScript puro en NestJS:

| Servicio | Archivo | Descripción |
|---|---|---|
| `CalculosService` | `src/operaciones/calculos.service.ts` | Motor de cálculo de conceptos (aterrizaje, parqueo, tasas, servicios) |

**Fórmulas implementadas:**
- **Aterrizaje:** `tarifaIndexada × peso` (con CPI indexing y conversión moneda para internacional)
- **Parqueo:** `tarifaBase × horasFacturables` (con horas de gracia y recargo nocturno)
- **Tasas:** `tarifa × pasajeros` (split COP/USD para internacional)
- **Tarifa Indexada** (`FnGetTarifaIndexada`): lookup por tipo de operación, rango de peso, tarifa negociada por aerolínea, indexación IPC
- **Conversión internacional** (`FnCalcTarifLocalForInt`): determina si cobrar en COP o USD

**Endpoint único:**
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/operaciones/calcular-conceptos` | Calcula conceptos sin persistir (retorna valores + traza de fórmula) |

---

## Fase 4 — Implementación Frontend (En Progreso 🟡)

### 4.1 Estructura de páginas

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, Table, Card, Dialog)
│   ├── shared/          # PageHeader, DataTable, CrudModal, StatusBadge, etc.
│   └── layout/          # Sidebar, Header, AppLayout
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── SeleccionarAeropuerto.tsx
│   ├── configuracion/       # 7 páginas (Parametros, Indicadores, Servicios, etc.)
│   ├── facturacion/         # 5 páginas (Facturas, NotasContables, Acuerdos, etc.)
│   ├── liquidaciones/       # 4 páginas (Liquidaciones, Tasas, Pasajeros, etc.)
│   ├── maestros/            # 8 páginas (Paises, Ciudades, Aeropuertos, etc.)
│   ├── operaciones/         # 5 páginas (Vuelos, Itinerarios, PanelOperaciones, etc.)
│   ├── periodos/            # 2 páginas (Periodos, DiasFeriados)
│   ├── seguridad/           # 3 páginas (Usuarios, Perfiles, MenuOpciones)
│   └── tarifas/             # 7 páginas (Conceptos, Tarifas, Impuestos, etc.)
├── hooks/               # useCrud.ts genérico + modules.ts (43 hooks por entidad)
├── stores/              # Zustand (authStore)
├── lib/                 # api.ts (Axios + JWT interceptor)
└── types/               # TypeScript interfaces (50+ entidades)
```

### 4.2 Estado de páginas CRUD (43 páginas)

| Módulo | Páginas | Estado |
|---|---|---|
| `maestros/` | Paises, Ciudades, Zonas, Aeropuertos, Aerolineas, Aviones, Fabricantes, TiposAeronave, ClasesAviacion, PersonalAerolinea | ✅ 10 |
| `tarifas/` | Conceptos, GruposConcepto, TiposOperacion, TarifasOperacion, TarifasAerolinea, Impuestos | ✅ 6 |
| `operaciones/` | Vuelos, Itinerarios, PuertasEmbarque, Hangares, ServiciosOperacion, **PanelOperaciones** | ✅ 6 |
| `configuracion/` | Parametros, IndicadoresEconomicos, CodigosAeronauticos, ServiciosAereos, Secuencias, Mensajes, Eventos, Aplicaciones | ✅ 8 |
| `facturacion/` | Facturas, NotasContables, AcuerdosPago, FuentesFacturacion, ConfigFacturacion | ✅ 5 |
| `liquidaciones/` | Liquidaciones, TasasAeroportuarias, Pasajeros, TiposPasajero, ClasesPasajero | ✅ 5 |
| `seguridad/` | Usuarios, Perfiles, MenuOpciones | ✅ 3 |
| **TOTAL** | **43 páginas** | **🟡 43/43** |

### 4.3 Página personalizada: Panel Central de Operaciones

`PanelOperaciones.tsx` (627 líneas) — réplica moderna de `FrmMagnaInfrasas`:
- **Filtros:** fecha, aeropuerto, aerolínea + botón Buscar
- **Toolbar:** Registrar Entrada/Salida, Parqueo, Tasas, Facturar
- **DataTable:** grid con columnas de vuelo, aerolínea, matrícula, procedencia/destino, horas, estado, acciones
- **Selector de fila:** activa tabs de detalle
- **3 Tabs de detalle:** Detalle General (llegada/salida/pasajeros), Parqueo y Tasas, Costo de Operación
- **4 Modales:** Entry (aterrizaje), Exit (despegue), Parking, Tasas — todos con Zod validation
- **Cálculo en vivo:** llama a `POST /operaciones/calcular-conceptos` al registrar cada evento; muestra resultados y traza de fórmula en el tab de costos
- **Estado:** loading/error/empty para cada consulta, spinner de cálculo, badges de estado/facturación

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

---

## Sesión 13 — Motor de Cálculo + Panel Operaciones (14/06/2026)

### Objetivo
Construir el motor de cálculo de facturación (aterrizaje, parqueo, tasas) y conectar el Panel Central de Operaciones a datos reales.

### Logros

#### Análisis legacy completo
- Leído `FrmMagnaInfrasas.frm` (~5800 líneas, núcleo operacional VB6)
- Leídos y documentados todos los stored procedures clave:
  - `FnGetTarifaIndexada` — lookup de tarifas con indexación IPC y rangos de peso
  - `FnCalcTarifLocalForInt` — conversión de moneda internacional (COP/USD)
  - `FnSeccionaDiasPark` — división de períodos de parqueo en días calendario
  - `FnGetValorParqueoLiq` — valor de liquidación de parqueo
  - `FnGetValorTasasLiq` — valor de liquidación de tasas
  - `SpCalculaParqueo` / `SpCalculaParqueo_Infrasa` / `SpConfigConceptosInfrasas` (encriptados, pero estructura inferible)
- Confirmado: **backend no tenía motor de cálculo** — toda la lógica estaba solo en SQL

#### Backend — CalculosService
| Archivo | Descripción |
|---|---|
| `src/operaciones/calculos.service.ts` | 280 líneas — motor de cálculo completo |
| `src/operaciones/dto/calcular-conceptos.dto.ts` | Request DTO con validación class-validator |
| `src/operaciones/dto/resultado-calculo.dto.ts` | Response DTO con ConceptoCalculado + totales |

**Fórmulas implementadas:**
1. **Aterrizaje:** `tarifaIndexada × peso` → CPI indexación → conversión moneda si internacional
2. **Parqueo:** `tarifaBase × horasFacturables` → descuento horas gracia → recargo nocturno (18:00-06:00)
3. **Tasas:** nacional: `tarifaNal × paxCOP`; internacional: split `tarifaExt × paxUSD` + `tarifaConv × paxCOP`
4. **FnGetTarifaIndexada:** lookup por `idTipoOperacion` + rango de peso + tarifa negociada por aerolínea (`TarifaAerolinea`)
5. **FnCalcTarifLocalForInt:** monedaPago=1→USD; si tarifaLocal=0→convierte `tarifaExt × TRM`
6. **Indexación IPC:** `tarifa × (1 + ipcValor/100)` si parámetro habilitado

| Método HTTP | Ruta | Descripción |
|---|---|---|
| `POST` | `/operaciones/calcular-conceptos` | Calcula conceptos y retorna valores + traza de fórmula |

#### Frontend — PanelOperaciones conectado
- **`POST /operaciones/calcular-conceptos`** se llama al registrar cada evento (entrada, salida, parqueo, tasas)
- **Estado de cálculo:** loading spinner, error message, formula trace en el tab de Costo de Operación
- **conceptosCalculados:** memo que fusiona resultados del backend con datos locales para visualización
- **Tipos nuevos:** `CalcularConceptosRequest`, `ConceptoCalculado`, `ResultadoCalculo`
- **Builds:** backend 0 errores + frontend 0 errores (Vite produce 67 chunks)

#### Resumen de archivos creados/modificados
| Archivo | Acción |
|---|---|
| `backend/src/operaciones/calculos.service.ts` | ✨ Nuevo |
| `backend/src/operaciones/dto/calcular-conceptos.dto.ts` | ✨ Nuevo |
| `backend/src/operaciones/dto/resultado-calculo.dto.ts` | ✨ Nuevo |
| `backend/src/operaciones/operaciones.controller.ts` | 🔧 + endpoint calcular-conceptos |
| `backend/src/operaciones/operaciones.module.ts` | 🔧 + CalculosService provider |
| `frontend/src/types/index.ts` | 🔧 + 3 interfaces de cálculo |
| `frontend/src/pages/operaciones/PanelOperaciones.tsx` | 🔧 Conexión a backend real |
| `bitacora.md` | 🔧 Actualizada |
| `AGENTS.md` | 🔧 Actualizado |

### Pendiente para próxima sesión
1. Persistencia de cálculos: endpoint `POST /operaciones/guardar-conceptos` (crea registros en `MovimientoFacturacion`)
2. Cálculo de hangar, handling, puente, recargos valle/punta
3. Integración con facturación (generar Factura desde movimientos calculados)
4. Hook `usePuertasEmbarque` real (actualmente placeholder)
5. Dashboard con métricas operacionales en tiempo real

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
| Módulos backend | Ninguno (monolítico) | 10 módulos NestJS |
| Entidades con CRUD completo | N/A | 71 |
| Páginas frontend CRUD | N/A | 43 |
| Páginas personalizadas frontend | N/A | 2 (Dashboard, PanelOperaciones) |
| Endpoints API | 0 | ~362 REST + Swagger |
| Servicios de cálculo | 0 | 1 (CalculosService) |
| Autenticación | Básica | JWT + bcrypt |
| Frontend | Windows Forms | React 19 + Tailwind v4 |
| Pruebas | Manual | Jest + Supertest + Vitest |
| Despliegue | Instalador MSI | Docker + CI/CD |

---

*Última actualización: 14 de Junio, 2026 — Sesión 13: Motor de cálculo de facturación + Panel Operaciones conectado a backend real*
