# Verificación de Maestros — Legacy → Nuevo Sistema

> **Propósito:** Garantizar que TODOS los maestros del sistema legacy
> tengan su equivalente en el nuevo sistema o una justificación de exclusión.
>
> **Cobertura:** 28 tablas `Mae_` + 20 tablas de catálogo + tablas de seguridad/configuración

---

## Convenciones

| Símbolo | Significado |
|---------|-------------|
| ✅ Completo | Modelo en schema + módulo NestJS con CRUD + DTOs |
| 🟡 En schema | Modelo en Prisma pero sin módulo dedicado |
| 🔴 Faltante | No existe en schema ni en módulo |
| ➡️ Unificado | Fusionado con otro modelo en el nuevo diseño |
| ❌ Excluido | No se migra (justificado) |

---

## 1. TABLAS Mae_ (Maestros Principales) — 28 tablas

| # | Legacy | Nuevo Modelo | Módulo | Estado | Observaciones |
|---|---|---|---|---|---|
| 1 | MaeAerolineas | `Aerolinea` | `aerolineas/` | ✅ Completo | 22 campos, DTOs, validación unicidad|
| 2 | MaeAeropuertos | `Aeropuerto` | `organizacion/` | ✅ Completo | Código único, multi-BU, filtros |
| 3 | MaeAviones | `Aeronave` | `aerolineas/` | ✅ Completo | Matrícula única, validación FK |
| 4 | MaeVuelos | `Vuelo` | `operaciones/` | ✅ Completo | DTOs dedicados, filtros |
| 5 | MaeCiudades | `Ciudad` | `organizacion/` | ✅ Completo | FK a país, cascada |
| 6 | MaePaises | `Pais` | `organizacion/` | ✅ Completo | ISO 3166 |
| 7 | MaeConceptos | `Concepto` | `tarifas/` | ✅ Completo | CRITICO: tipoTarifa, rangos |
| 8 | MaeTipoAviones | `TipoAeronave` | `aerolineas/` | ✅ Completo | FK a fabricante |
| 9 | MaeTipoAviacion | `ClaseAviacion` | `aerolineas/` | ✅ Completo | Jerarquía claseSuperior |
| 10 | MaeTipoOperacion | `TipoOperacion` | `tarifas/` | ✅ Completo | FK a Concepto |
| 11 | MaeTipoPasajero | `TipoPasajero` | `liquidaciones/` | ✅ Completo | Filtro exento, FK clase |
| 12 | MaeTarifaOperacion | `TarifaOperacion` | `tarifas/` | ✅ Completo | Rangos S/R, tarifaLocal/Extranjero |
| 13 | MaeTarifaOperacion_His | `TarifaOperacionHistorico` | `tarifas/` | ✅ Completo | Nuevo — historial de tarifas |
| 14 | MaeTarifaPorAerolineas | `TarifaAerolinea` | `tarifas/` | ✅ Completo | Tarifas negociadas |
| 15 | MaeHangares | `Hangar` | `operaciones/` | ✅ Completo | DTOs, validación unicidad |
| 16 | MaePuertas | `PuertaEmbarque` | `operaciones/` | ✅ Completo | Código único por aeropuerto |
| 17 | MaeZonas | `Zona` | `organizacion/` | ✅ Completo | |
| 18 | MaeZonasAeropuertos | `ZonaAeropuerto` | `organizacion/` | ✅ Completo | |
| 19 | MaeConsecutivos | `Secuencia` | `configuracion/` | ✅ Completo | +idAeropuerto para BU |
| 20 | MaeConsecutivosBu | `Secuencia` (con idAeropuerto) | `configuracion/` | ✅ Completo | Integrado en Secuencia |
| 21 | MaeImpuestos | `Impuesto` | `tarifas/` | ✅ Completo | PK string codigo |
| 22 | MaeItinerario | `Itinerario` | `operaciones/` | ✅ Completo | DTOs, filtros |
| 23 | MaePersonal | `PersonalAerolinea` | `aerolineas/` | ✅ Completo | |
| 24 | MaeHorarioAeropuerto | `HorarioAeropuerto` | `organizacion/` | ✅ Completo | |
| 25 | MaeConfTasasAero | `ConfigTasaAeropuerto` | `configuracion/` | ✅ Completo | Nuevo — config EAN13 |
| 26 | MaeAerolineasConceptosAsig | `AerolineaConcepto` | `aerolineas/` | ✅ Completo | N:M aerolínea-concepto |
| 27 | MaeAerolineasConFigAdd | `AerolineaConfig` | `aerolineas/` | ✅ Completo | Config por aerolínea+aeropuerto |
| 28 | MaeAerolineasCtaConcepto | `AerolineaCtaConcepto` | `aerolineas/` | ✅ Completo | Nuevo — cuentas contables |

### Faltantes Mae_ detectados (4):

| # | Tabla Legacy | Impacto | Acción recomendada |
|---|---|---|---|
| 1 | **MaeTarifaOperacion_His** | 🟡 Medio — Histórico de cambios de tarifas | Agregar `TarifaOperacionHistorico` o audit trail |
| 2 | **MaeConsecutivosBu** | 🟡 Medio — Consecutivos por BU para multi-aeropuerto | Unificar con `Secuencia` agregando campo `idAeropuerto` |
| 3 | **MaeConfTasasAero** | 🟡 Bajo — Config de EAN13/reporte de tasa | Evaluar si se necesita en MVP |
| 4 | **MaeAerolineasCtaConcepto** | 🟡 Medio — Cuentas contables para contabilidad | Pendiente de módulo contable |

---

## 2. TABLAS DE CATÁLOGO (Maestros Secundarios) — 20 tablas

| # | Legacy | Nuevo Modelo | Módulo | Estado | Observaciones |
|---|---|---|---|---|---|
| 1 | Fabricantes | `Fabricante` | `aerolineas/` | ✅ Completo | Boeing, Airbus, etc. |
| 2 | ClasesPasajeros | `ClasePasajero` | `liquidaciones/` | ✅ Completo | DTOs, validación cascada |
| 3 | CodigosAeronauticos | `CodigoAeronautico` | `configuracion/` | ✅ Completo | OACI/IATA por tipo |
| 4 | ComboConceptosAero | — | — | ❌ Excluido | UI legacy, no aplica |
| 5 | ConsecutivosAero | `Secuencia` | `configuracion/` | ➡️ Unificado | Integrado |
| 6 | DiasAero | `DiaAeropuerto` | `periodos/` | ✅ Completo | |
| 7 | DiasFeriados | `DiaFeriado` | `periodos/` | ✅ Completo | |
| 8 | DiasFeriadosNL | — | — | ➡️ Unificado | En DiaFeriado |
| 9 | GruposdeConceptos | `GrupoConcepto` | `tarifas/` | ✅ Completo | |
| 10 | Indicadores | `IndicadorEconomico` | `configuracion/` | ✅ Completo | TRM, IPC, UVT |
| 11 | IndicadorNacionalidad | — | — | ❌ Excluido | Campo `nacional` en Aerolinea |
| 12 | Periodos | `Periodo` | `periodos/` | ✅ Completo | |
| 13 | PeriodoAeropuerto | `PeriodoAeropuerto` | `periodos/` | ✅ Completo | |
| 14 | PeriodoAeropuertoRespaldo | — | — | ❌ Excluido | Backup legacy |
| 15 | Tasas | `Tasa` | `liquidaciones/` | ✅ Completo | CRUD con código único |
| 16 | MaeTipodeEventos | `TipoEvento` | `configuracion/` | ✅ Completo | PK string, cascada |
| 17 | MaeventosI | `Evento` | `configuracion/` | ✅ Completo | |
| 18 | CategoriaRPT | `CategoriaReporte` | `reportes/` | ✅ Completo | |
| 19 | ReportesRPT | `Reporte` | `reportes/` | ✅ Completo | |
| 20 | Menu | `MenuOpcion` | `seguridad/` | ✅ Completo | Jerárquico, activo/inactivo |

---

## 3. SEGURIDAD — 7 tablas

| # | Legacy | Nuevo Modelo | Módulo | Estado | Observaciones |
|---|---|---|---|---|---|
| 1 | Usuario | `Usuario` | `seguridad/` | ✅ Completo | bcrypt, soft-delete, sin password en respuestas |
| 2 | Usuario_Accesos | `SesionUsuario` | `seguridad/` | ✅ Completo | Historial de sesiones |
| 3 | UsuarioAeropuerto | `AccesoAeropuerto` | `seguridad/` | ✅ Completo | Permisos por aeropuerto |
| 4 | UsuarioConfigEmailAeropuertos | — | — | ❌ Excluido | Config email legacy, se manejará por entorno |
| 5 | UsuarioCuentas | `UsuarioCuenta` | `seguridad/` | ✅ Completo | Cuentas contables por usuario |
| 6 | Perfil | `Perfil` | `seguridad/` | ✅ Completo | CRUD con DTOs |
| 7 | PerfilProceso | `PermisoPerfil` | `seguridad/` | ✅ Completo | Permisos granulares por recurso |

---

## 4. FACTURACIÓN (Configuración) — 4 tablas

| # | Legacy | Nuevo Modelo | Módulo | Estado | Observaciones |
|---|---|---|---|---|---|
| 1 | ConfigFact | `ConfigFacturacion` | `facturacion/` | ✅ Completo | Filtros por cliente, tipo |
| 2 | FuentesFacturacionAeropuerto | `FuenteFacturacion` | `facturacion/` | ✅ Completo | Validación FK aeropuerto |
| 3 | FoliosAeropuerto | `Folio` | `facturacion/` | ✅ Completo | Filtros por aeropuerto, aerolínea |
| 4 | FolioDetalleInfrasas | `FolioDetalle` | `facturacion/` | ✅ Completo | Filtros por folio |

---

## 5. PARÁMETROS Y CONFIGURACIÓN — 2 tablas

| # | Legacy | Nuevo Modelo | Módulo | Estado | Observaciones |
|---|---|---|---|---|---|
| 1 | Parametros | `ParametroSistema` | `configuracion/` | ✅ Completo | 55+ → 30 esenciales |
| 2 | LogoEmpresa | — | — | ❌ Excluido | No aplica en web |

---

## 6. RESULTADOS

### Cobertura total

| Categoría | Total | ✅ Completo | ➡️ Unificado | ❌ Excluido |
|---|---|---|---|---|
| Mae_ (maestros) | 28 | 28 | 0 | 0 |
| Catálogos | 20 | 14 | 2 | 4 |
| Seguridad | 7 | 6 | 0 | 1 |
| Facturación (config) | 4 | 4 | 0 | 0 |
| Parámetros | 2 | 1 | 0 | 1 |
| **TOTAL** | **61** | **53 (87%)** | **2 (3%)** | **6 (10%)** |

### Tablas legacy NO migradas deliberadamente (6):

| Tabla | Motivo |
|---|---|
| ComboConceptosAero | UI legacy, no aplica en web |
| DiasFeriadosNL | Unificado en DiaFeriado |
| IndicadorNacionalidad | Reemplazado por campo `nacional` Boolean |
| PeriodoAeropuertoRespaldo | Backup table innecesaria |
| UsuarioConfigEmailAeropuertos | Se manejará por configuración de entorno |
| LogoEmpresa | No aplica en arquitectura web |

### Estado actual: ✅ CobertURA TOTAL

**No hay maestros legacy pendientes.** Las 6 exclusiones están justificadas. Todos los modelos en schema.prisma tienen su módulo NestJS correspondiente con DTOs tipados, validaciones y lógica de negocio.

---

## 7. MAPA DE RUTAS API COMPLETO

```
ORGANIZACION      /api/v1/organizacion/paises                  ✅
                  /api/v1/organizacion/ciudades                ✅
                  /api/v1/organizacion/aeropuertos             ✅
                  /api/v1/organizacion/zonas                   ✅
                  /api/v1/organizacion/zonas-aeropuerto        ✅
                  /api/v1/organizacion/horarios-aeropuerto     ✅

AEROLINEAS        /api/v1/aerolineas/aerolineas               ✅
                  /api/v1/aerolineas/aeronaves                 ✅
                  /api/v1/aerolineas/tipos-aeronave            ✅
                  /api/v1/aerolineas/fabricantes               ✅
                  /api/v1/aerolineas/clases-aviacion           ✅
                  /api/v1/aerolineas/personal-aerolinea        ✅
                  /api/v1/aerolineas/aerolineas-conceptos      ✅
                  /api/v1/aerolineas/aerolineas-config         ✅

TARIFAS           /api/v1/tarifas/conceptos                    ✅
                  /api/v1/tarifas/grupos-concepto              ✅
                  /api/v1/tarifas/tipos-operacion              ✅
                  /api/v1/tarifas/tarifas-operacion            ✅
                  /api/v1/tarifas/tarifas-aerolinea            ✅
                  /api/v1/tarifas/impuestos                    ✅

CONFIGURACION     /api/v1/configuracion/parametros-sistema     ✅
                  /api/v1/configuracion/indicadores-economicos ✅
                  /api/v1/configuracion/codigos-aeronauticos   ✅
                  /api/v1/configuracion/servicios-aereos       ✅
                  /api/v1/configuracion/secuencias             ✅
                  /api/v1/configuracion/mensajes               ✅
                  /api/v1/configuracion/tipos-evento           ✅
                  /api/v1/configuracion/eventos                ✅
                  /api/v1/configuracion/aplicaciones           ✅

PERIODOS          /api/v1/periodos/periodos                    ✅
                  /api/v1/periodos/periodos-aeropuerto         ✅
                  /api/v1/periodos/dias-aeropuerto             ✅
                  /api/v1/periodos/dias-feriados               ✅

REPORTES          /api/v1/reportes/reportes                    ✅
                  /api/v1/reportes/categorias-reporte          ✅

OPERACIONES       /api/v1/operaciones/itinerarios              ✅
                  /api/v1/operaciones/vuelos                   ✅
                  /api/v1/operaciones/puertas-embarque         ✅
                  /api/v1/operaciones/hangares                 ✅
                  /api/v1/operaciones/servicios-operacion      ✅
                  /api/v1/operaciones/registros-peso           ✅
                  /api/v1/operaciones/asignaciones-puerta-vuelo ✅
                  /api/v1/operaciones/notas-operacion          ✅

FACTURACION       /api/v1/facturacion/facturas                 ✅
                  /api/v1/facturacion/facturas-detalle         ✅
                  /api/v1/facturacion/facturas-pagos           ✅
                  /api/v1/facturacion/facturas-impuestos       ✅
                  /api/v1/facturacion/notas-contables          ✅
                  /api/v1/facturacion/acuerdos-pago            ✅
                  /api/v1/facturacion/fuentes-facturacion      ✅
                  /api/v1/facturacion/configuracion-facturacion ✅
                  /api/v1/facturacion/movimientos-facturacion  ✅
                  /api/v1/facturacion/folios                   ✅
                  /api/v1/facturacion/folios-detalle           ✅

LIQUIDACIONES     /api/v1/liquidaciones/liquidaciones          ✅
                  /api/v1/liquidaciones/items-liquidacion      ✅
                  /api/v1/liquidaciones/pasajeros-nacionales   ✅
                  /api/v1/liquidaciones/pasajeros-internacionales ✅
                  /api/v1/liquidaciones/tasas                  ✅
                  /api/v1/liquidaciones/tipos-pasajero         ✅
                  /api/v1/liquidaciones/clases-pasajero        ✅

SEGURIDAD         /api/v1/seguridad/usuarios                   ✅
                  /api/v1/seguridad/perfiles                   ✅
                  /api/v1/seguridad/permisos-perfil            ✅
                  /api/v1/seguridad/menu-opciones              ✅
                  /api/v1/seguridad/sesiones-usuario           ✅
                  /api/v1/seguridad/accesos-aeropuerto         ✅
                  /api/v1/seguridad/usuarios-cuentas           ✅
```

---

## 8. CONCLUSIÓN

De **61 tablas maestro/catálogo** del sistema legacy (28 Mae_ + 20 catálogo + 7 seguridad + 4 facturación config + 2 parámetros):

- **53 (87%)** → Migradas a módulo dedicado completo con DTOs tipados y lógica de negocio ✅
- **2 (3%)** → Unificadas en otros modelos ➡️
- **6 (10%)** → Excluidas deliberadamente (justificadas) ❌

**Cobertura total: 100% de maestros legacy representados en el nuevo sistema.**
El módulo genérico `maestros/` fue eliminado. Cada entidad tiene su módulo dedicado.

### Resumen de módulos backend (10 módulos, 74 entidades):

| Módulo | Entidades | Endpoints |
|---|---|---|
| `organizacion/` | 6 | 30 |
| `aerolineas/` | 9 (+1 new) | 45 |
| `tarifas/` | 7 (+1 new) | 35 |
| `configuracion/` | 10 (+1 new) | 50 |
| `periodos/` | 4 | 26 |
| `reportes/` | 2 | 10 |
| `operaciones/` | 8 | 40 |
| `facturacion/` | 11 | 55 |
| `seguridad/` | 7 | 35 |
| `liquidaciones/` | 7 | 35 |
| **TOTAL** | **71 entidades** | **~361 endpoints** |

---

*Última actualización: 14 de Junio, 2026 — Cobertura total de maestros validada*
