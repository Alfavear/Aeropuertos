# Análisis de Objetos SQL Legacy — Zeus Aeropuertos

> Generado: 14 Junio 2026
> Propósito: Homologar stored procedures, funciones y vistas del legacy a PostgreSQL/NestJS

---

## 1. INVENTARIO TOTAL

| Tipo | Cantidad |
|---|---|
| **Stored Procedures** | 566 |
| **Funciones** | 174 (122 independientes + 49 dependientes + 3 principales) |
| **Vistas** | 4 |
| **Triggers** | 0 |
| **Total objetos SQL** | **744** |

---

## 2. CATEGORIZACIÓN DE STORED PROCEDURES

### CRUD Maestros (~120 SPs) → **REEMPLAZADO por Prisma**
`SpMae*`, `SpBr_Mae*`, `spBR_Mae*` — Wrappers CRUD parametrizados. Contienen lógica mínima.
→ Prisma ORM + NestJS Services cubren todo.

### Facturación (~65 SPs) → **DEBE REIMPLEMENTARSE**
| Archivo | Líneas | Lógica |
|---|---|---|
| `SpFactContado.sql` | 5000+ | **Core**: Genera factura de contado desde operación. Orquesta aterrizaje, parqueo, puentes, tanqueo, extensión horaria, asistencia tierra/pax, tasas, conceptos adicionales. Aplica TRM, redondeos, validaciones de fecha/período. |
| `GeneraFacK.sql` | — | Genera movimientos K (contado) |
| `GeneraFac.sql` | — | Facturación crédito/periódica |
| `SpFactContadoTasas.sql` | — | Facturación tasas aeroportuarias |

### Operaciones (~50 SPs) → **DEBE REIMPLEMENTARSE**
| Archivo | Líneas | Lógica |
|---|---|---|
| `SpCalculaParqueo.sql` | 608 | **Core**: Cálculo de tarifa de parqueo con tarifas indexadas, Nac/Int, descuentos, recargos nocturnos, horas de gracia |
| `SpCalculo_ExtensionHoraria.sql` | 557 | **Core**: Detección de horas extras fuera del horario del aeropuerto |
| `SpOperacionesAero.sql` | — | CRUD de operaciones aéreas |

### Liquidaciones/Tasas (~35 SPs) → **DEBE REIMPLEMENTARSE**
| Archivo | Líneas | Lógica |
|---|---|---|
| `SpLotesTasas.sql` | 277 | **Core**: Gestión de lotes de tasas (creación, inventario, seguimiento) |
| `SpEntregaTasas.sql` | 486 | **Core**: Máquina de estados de tasas (Impresa → Custodia → Activa → Usada/Vencida/Anulada) |
| `spBR_Tasas.sql` | 296 | Búsqueda de tasas por estado |

### Reportes (~100 SPs) → **REEMPLAZAR por API + Reporting Tool**
Todos los `SpRpt*` — Queries complejas para FastReport/Crystal Reports.
→ Convertir a endpoints NestJS + herramienta de reporting.

### Seguridad (~20 SPs) → **REEMPLAZADO por NestJS Auth**
`SpUsuarios*`, `SpPerfiles*`, `SpBr_Menu*`
→ JWT Auth + Guards + Prisma.

### Configuración (~30 SPs) → **REEMPLAZADO por Prisma**
`SpConfigFact*`, `SpParametros`, `SpPeriodos`, `SpMaeConsecutivos`
→ CRUD Prisma + servicios NestJS.

### Facturación Electrónica DIAN (~30 SPs) → **DEBE REIMPLEMENTARSE**
`SpFacturaElectronica_*` — Construcción de XML DIAN, envío, anulación, notas crédito.
→ 16 archivos de XML para diferentes secciones (cabecera, cliente, emisor, líneas, impuestos, retenciones, etc.).

### Variables Dinámicas (~20 SPs) → **EXCLUIDO (obsoleto)**
`SpVariable*` — Motor de fórmulas dinámicas con VB.NET/SQL.
→ Ya eliminado del nuevo schema (documentado en bitácora).

### Utilidades (~40 SPs) → **REEMPLAZAR por librerías JS**
`SpSplit`, `SP_NumeroaLetras`, `SpCodigoBarra`, `SpLog`, `SpPrint`, `spQRCode`
→ Librerías JS estándar (lodash, numero-a-letras, JsBarcode, qrcode, etc.).

### Integraciones (~15 SPs) → **REEMPLAZAR por NestJS**
`spWSG_*`, `Sp_Assemblies_*`, `ZeusInterfazArchivoPlano`
→ REST APIs en NestJS + librerías nativas (nodemailer, axios).

### Contabilidad NIIF (~10 SPs) → **DEBE REIMPLEMENTARSE**
| Archivo | Líneas | Lógica |
|---|---|---|
| `SpCierreCaja.sql` | 610 | **Core**: Cierre de caja con asientos contables, soporte NIIF dual |
| `SpContabilizarNotaContable.sql` | 1673 | **Core**: Generación de asientos contables para notas débito/crédito |

---

## 3. CATEGORIZACIÓN DE FUNCIONES

### Cálculo de Tarifas (~15) → **DEBE REIMPLEMENTARSE**
| Función | Lógica |
|---|---|
| `FnGetTarifaIndexada` | **Core**: Resolución de tarifa en 3 niveles (aerolínea > actual > histórica) |
| `FnCalcTarifLocalForInt` | Conversión de tarifa internacional a moneda local |
| `FnMaeTarifaOperacionIndex` | Indexación de tarifas de operación |

### Cálculo de Parqueo (~12) → **DEBE REIMPLEMENTARSE**
| Función | Lógica |
|---|---|
| `FnGetHrsFactbyParK` | Horas facturables de parqueo con horas de gracia |
| `FnGetHorasParqueo` | Cálculo de horas de parqueo |
| `FnSeccionaDiasPark` | División por días para períodos de parqueo |
| `FnValorParqueo` | Valor de parqueo |
| `FnGetHorasValleDesc` | Descuento por hora valle |

### Validación (~10) → **IMPLEMENTAR como servicios NestJS**
`FnValidaConceptoFacturado`, `FnValidaFacturaElectronica`, `FnVerificarOper`, etc.

### TRM/Tasas (~8) → **IMPLEMENTAR como servicio NestJS**
| Función | Lógica |
|---|---|
| `FnTasaCambio` | **Core**: Consulta de TRM por fecha |
| `FnTasaCambioHoy` | TRM del día |
| `FnWSG_TRM` | Consumo de WS para TRM |

### Fechas (~10) → **REEMPLAZAR por date-fns / Moment**
`FnFecha`, `FnPeriodo`, `FnGetFechaRealVencimiento`, etc.

### Utilidades Generales (~80) → **REEMPLAZAR por JS/PostgreSQL**
| Función | Reemplazo |
|---|---|
| `FnGetValParam` | Servicio de parámetros cacheado (Redis + DB) |
| `FnGetTiposOpConc` | Relación Prisma Concepto → TipoOperacion |
| `FnZGetRecargoNoctOper` | Lógica de recargo nocturno en TypeScript |
| `FnGetIdenPeriodo` | Servicio de períodos NestJS |
| `FnSplit` | `String.split()` o `string_to_array()` PG |
| `FnNumeroaLetras` | Librería `numero-a-letras` |

### Facturación Electrónica (~12) → **DEBE REIMPLEMENTARSE**
`FnFacturaElectronica_*` — Extensiones dinámicas, IDs de autorización DIAN, equivalencias.

---

## 4. VISTAS

| Vista | Tipo | Lógica |
|---|---|---|
| `GeneraConceptosFijos` | Materialización | Genera filas de conceptos fijos por período |
| `MovFactTasasManagEsp` | Desnormalización | Estado derivado de tasas (6 estados booleanos → texto) |
| `FnFacturaElectronica_ExtensionesDinamicas` | TVF | Template para extensiones dinámicas FE (cuerpo vacío) |
| `LvFacturaElectronica_ExtensionesDinamicas_DocumentosItems` | Vista | Items de factura con columnas fijas + extensiones dinámicas |

---

## 5. QUÉ DEBE REIMPLEMENTARSE SÍ O SÍ (~35 artifacts clave)

### Prioridad 1 — Motor de Facturación y Tarifas
1. `FnGetValParam` → Servicio de parámetros cacheado
2. `FnGetTiposOpConc` → Relaciones Prisma + service
3. `FnGetTarifaIndexada` → Servicio de tarifas con 3 niveles
4. `SpCalculaParqueo` → Servicio de cálculo de parqueo
5. `SpCalculo_ExtensionHoraria` → Servicio de extensión horaria
6. `SpFactContado` → Descomponer en múltiples servicios NestJS
7. `GeneraFac` / `GeneraFacK` → Lógica de facturación crédito/contado
8. `FnCalcTarifLocalForInt` → Conversión de moneda
9. `FnGetHrsFactbyParK` → Cálculo de horas facturables
10. `FnZGetRecargoNoctOper` → Recargo nocturno

### Prioridad 2 — Ciclo de Vida de Tasas
11. `SpLotesTasas` → Servicio de lotes
12. `SpEntregaTasas` → Máquina de estados
13. `spBR_Tasas` → Consultas de tasas

### Prioridad 3 — Contabilidad y Cierres
14. `SpCierreCaja` → Servicio de cierre de caja
15. `SpContabilizarNotaContable` → Servicio de contabilización
16. `SpAcuerdosdePago` → Servicio de acuerdos de pago

### Prioridad 4 — Facturación Electrónica DIAN
17. `SpFacturaElectronica_Configurar` → Configuración FE
18. `SpFacturaElectronica_XmlFactura*` → Generación XML DIAN
19. `SpFacturaElectronica_XmlAprobar` → Aprobación DIAN

### Prioridad 5 — Utilidades de Negocio
20. `FnTasaCambio` / `FnTasaCambioHoy` → Servicio TRM
21. `FnGetNacionalidadErop` → Determinación de nacionalidad
22. `SpIndexarTarifas` → Indexación de tarifas

### Prioridad 6 — Vistas
23. `GeneraConceptosFijos` → Lógica en servicio NestJS
24. `MovFactTasasManagEsp` → Estado derivado en TypeScript

---

## 6. QUÉ SE EXCLUYE SEGURAMENTE

| Grupo | Cantidad | Motivo |
|---|---|---|
| CRUD Maestros (SpMae*/SpBr_Mae*) | ~120 | Prisma ORM + NestJS CRUD |
| Reportes (SpRpt*) | ~100 | Endpoints API + reporting tool |
| Variables Dinámicas (SpVariable*) | ~20 | Obsoleto (bitácora lo confirma) |
| Utilidades (Split, Letras, QR, etc.) | ~40 | Librerías JS |
| Excel/Impresión (SpExcel*, SpPrint*) | ~30 | Servicios NestJS |
| Integraciones CLR (Sp_Assemblies*) | ~10 | Librerías nativas JS |
| Migración/Compatibilidad | ~10 | No aplica |

---

## 7. ESTIMACIÓN DE ESFUERZO

| Fase | Área | Estimación |
|---|---|---|
| **Fase 1** | Fundación (Prisma + CRUD + Auth) | 2-3 semanas |
| **Fase 2** | Motor Tarifas + Parqueo + Ext. Horaria | 8-10 semanas |
| **Fase 3** | Motor Facturación (Contado + Crédito) | 6-8 semanas |
| **Fase 4** | Tasas + Liquidaciones | 4-6 semanas |
| **Fase 5** | Contabilidad + Cierres + Acuerdos Pago | 6-8 semanas |
| **Fase 6** | Facturación Electrónica DIAN | 8-10 semanas |
| **Fase 7** | Reportes | 6-8 semanas |
| **Total** | | **~40-53 semanas** |

> **Nota:** El motor de facturación (Fase 2+3) representa ~60% de la lógica de negocio.
> Las Fases 5-7 dependen de las fases anteriores y pueden priorizarse según necesidad.

---

## 8. RECOMENDACIONES TÉCNICAS

1. **No migrar SPs a PostgreSQL functions** — La lógica debe vivir en TypeScript (NestJS Services) para testabilidad y mantenibilidad.
2. **Descomponer SpFactContado (5000+ líneas)** — Separar en servicios por concepto (aterrizaje, parqueo, puente, etc.).
3. **Usar Redis para parámetros** — `FnGetValParam` es la función más llamada; caché en Redis con invalidación por evento.
4. **Patrón State Machine para tasas** — Usar enum + máquina de estados en TypeScript.
5. **NIIF Dual-Book** — Si se requiere, mantener mapeo de cuentas como tabla Prisma.
6. **Simplificar variables dinámicas** — No reimplementar el motor de fórmulas VB.NET; reemplazar por reglas configurables en NestJS.
