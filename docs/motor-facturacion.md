# Análisis del Motor de Facturación Legacy

> Basado en: GeneraFac.sql (Crédito/Periódica) y GeneraFacK.sql (Contado)
> Estado: Completado — Funciones clave identificadas

---

## 1. ARQUITECTURA DEL MOTOR DE FACTURACIÓN

### Dos modos de facturación:

| Modo | SP | Tipo | Disparado por |
|------|-----|------|--------------|
| **Crédito (Periódica)** | `GeneraFac` | Facturación por período (fechas) | `SpPeriodos` — cierre de período |
| **Contado (K)** | `GeneraFacK` | Facturación por operación individual | `SpFactContado` — cierre de operación |

### Flujo general:

```
Operación (aterrizaje) registrada en MovFacOp
    │
    ├── ¿Modo facturación? → FnGetTipoFacturacionClientes()
    │   ├── 'C' → Crédito → GeneraFac
    │   ├── 'K' → Contado → GeneraFacK
    │   ├── 'A' → Ambos
    │   └── 'X' → Error (sin configurar)
    │
    ├── Calcula Aterrizaje + Recargo Nocturno
    ├── Calcula Parqueo (horas, tarifa, recargo)
    ├── Calcula Puente de abordaje
    ├── Calcula Tanqueo
    ├── Calcula Extensión Horaria
    ├── Calcula Carga
    ├── Calcula Asistencia en Tierra
    ├── Calcula Asistencia al Pasajero
    ├── Calcula Tasas Aeroportuarias
    └── Calcula Conceptos Adicionales (vía DLL ConceptosAuto)
         │
         └── Genera registros en tabla MovFact[Concepto]
              │
              └── SpFactContado consolida en Factura + FacturaDetalle
```

---

## 2. TABLAS INVOLUCRADAS (LEGACY → NUEVO)

| Tabla Legacy | Nueva Tabla | Propósito |
|---|---|---|
| `MovFacOp` | `movimientos_facturacion` (tipo='OPERACION') | Registro de operación (aterrizaje/despegue) |
| `MovFactOper` | `movimientos_facturacion` (tipo='ATERRIZAJE') | Cargo por aterrizaje calculado |
| `MovFactParq` | `movimientos_facturacion` (tipo='PARQUEO') | Cargo por parqueo calculado |
| `MovFactPnte` | `movimientos_facturacion` (tipo='PUENTE') | Cargo por puente de abordaje |
| `MovFactTanq` | `movimientos_facturacion` (tipo='TANQUEO') | Cargo por combustible |
| `MovFactExtHor` | `movimientos_facturacion` (tipo='EXT_HORARIA') | Cargo por extensión horaria |
| `MovFactCarga` | `movimientos_facturacion` (tipo='CARGA') | Cargo por carga |
| `MovFactAsTierra` | `movimientos_facturacion` (tipo='ASIST_TIERRA') | Cargo por asistencia en tierra |
| `MovFactAsAlPax` | `movimientos_facturacion` (tipo='ASIST_PAX') | Cargo por asistencia al pasajero |
| `MovFactTasas` | `movimientos_facturacion` (tipo='TASA') | Cargo por tasas aeroportuarias |
| `MaeTarifaOperacion` | `tarifas_operacion` | Tarifas por operación y rango de peso |
| `MaeAerolineas` | `aerolineas` | Configuración de aerolínea |
| `MaeAviones` | `aeronaves` | Aeronaves |
| `MaeTipoAviones` | `tipos_aeronave` | Tipos/modelos de aeronave |
| `MaeAeropuertos` | `aeropuertos` | Configuración de aeropuerto |
| `MaeConceptos` | `conceptos` | Definición de conceptos de cobro |
| `Parametros` | `parametros_sistema` | Parámetros de configuración |
| `Tasas` | `indicadores_economicos` | TRM (tasa de cambio) |
| `RegPesosAviones` | `registros_peso` | Pesos registrados de aeronaves |
| `Periodos` | `periodos` | Períodos contables |
| `DiasAero` | `dias_aeropuerto` | Días hábiles por aeropuerto |

---

## 3. FUNCIONES CLAVE DEL MOTOR DE CÁLCULO

### 3.1 FnGetValParam(ParamId)
Obtiene el valor de un parámetro del sistema por su ID numérico.

| ID | Propósito | Código |
|----|-----------|--------|
| 1088 | Precisión decimal tarifas | `@PrecTarifa` |
| 1089 | Código concepto aterrizaje | `@ConcAterrizaje` |
| 1090 | Código concepto recargo nocturno operación | `@ConcRecNocTOper` |
| 1091 | Código concepto parqueo | `@ConcParqueo` |
| 1092 | Código concepto parqueo puente | `@ConcParqueoPnt` |
| 1094 | Código concepto puente | `@ConcPuente` |
| 1095 | Código concepto tanqueo | `@ConcTanqueo` |
| 1096 | Código concepto extensión horaria | `@ConcExtHor` |
| 1097 | Código concepto tasas | `@ConcTasas` |
| 1098 | Código concepto carga | `@ConcCarga` |
| 1099 | Redondeo pesos | `@RedondeoPesos` |
| 1100 | Redondeo dólar | `@RedondeoDolar` |
| 1111 | Aplicar horas gracia parqueo | `@ParqGlobal` |
| 1112 | Código concepto asistencia tierra | `@ConcAsTierra` |
| 1129 | Cobrar recargo nocturno aterrizaje | `@CobraRecNoctAT` |
| 1132 | Código concepto recargo nocturno parqueo | `@ConcRecNocTParq` |
| 1147 | Código concepto asistencia pasajero | `@ConcAsAlPax` |
| 1148 | Código concepto traslado pasajeros | `@ConcServTrasLPax` |
| 1161 | Precisión valores factura | `@Precision` |
| 1164 | Modelo facturación | `@ModeloFact` |
| 1181 | Cobrar recargo nocturno parqueo | `@CobraRecNoctPQ` |
| 1210 | Cobrar tanqueos adicionales | `@CobraTanqueosAdd` |
| 9001 | Precisión IVA | `@PrecisionIVA` |
| 9997 | Fecha vencimiento día hábil | `@ActiveFechaVcto` |
| 9999 | Tasa facturación (día/cierre) | `@TasaFacturacion` |
| 2018 | Control certificado explotación | `@AplControlExplotNac` |
| 3333 | Habilitar descuento nativo | `@HabilAplDescConcNativo` |
| 90 | Usar tasa del día de operación | `@UsarTasaDiaOper` |
| 95 | Redondeo recargo nocturno RN | `@RedondeoPesosRN` |
| 96 | Redondeo recargo nocturno RN (USD) | `@RedondeoDolarRN` |

### 3.2 FnGetTarifaIndexada(CodigoTarifa, Fecha, TipoNac, Aerolinea, Aeropuerto)
Obtiene la tarifa aplicable considerando:
- Si existe tarifa negociada por aerolínea (`MaeTarifaPorAerolineas`)
- Si no, usa la tarifa base (`MaeTarifaOperacion`)
- Indexación por fecha
- `TipoNac` = 'N' (nacional) o 'I' (internacional)

### 3.3 FnCalcTarifLocalForInt(MonedaOperInt, TarifaNal, TarifaInt, CalcFromZero, Tasa, PrecTarifa)
Convierte tarifa internacional a moneda local:
```
Si MonedaOperInt = 1 (USD):
    resultado = TarifaInt * Tasa
Si no:
    resultado = TarifaInt  (ya está en moneda local)
Si TarifaInt = 0 y CalcFromZero = true:
    resultado = TarifaNal
```

### 3.4 FnGetNacByCtrlCertExplotNac(Control, Clase, Matricula, Fecha)
Determina si una operación es Nacional ('N') o Internacional ('I'):
- Si `Control` = 'S' y la aeronave tiene certificado de explotación nacional → 'N'
- Si no, usa la clase del aeropuerto de destino

### 3.5 FnZGetRecargoNoctOper(IdenOperacion)
Calcula el porcentaje de recargo nocturno para una operación:
- Retorna 0 si la operación no está en horario nocturno
- Retorna el porcentaje configurado en la aerolínea si está en horario nocturno
- Horario nocturno definido por parámetros 1038 (hora inicio) y 1039 (hora fin)

### 3.6 FnGetHrsFactbyParK(Metodo, IdAterrizaje, IdenPark, Tipo, Aeropuerto)
Calcula las horas facturables de parqueo:
- Considera horas de gracia (configurables por aerolínea)
- `Metodo` = 'HF' (horas facturables), 'RN' (recargo nocturno)
- Tipo de cálculo según parámetro 1163 (ModoFactParK): 'Por Fracción' o 'Por Hora o Fracción'

### 3.7 FnGetTiposOpConc(CodigoConcepto)
Retorna los tipos de operación asociados a un concepto:
- `IdTipoOp` — ID del tipo de operación en MaeTarifaOperacion
- `CodTipoOp` — Código del tipo de operación
- `TiposdeTarifas` — 0 (todos) o 1 (por nacionalidad)
- `TipoNac` — 'N' (nacional) o 'I' (internacional)
- `PorcentImpuestoNal` — % de IVA aplicable

---

## 4. FÓRMULA DE CÁLCULO — ATERRIZAJE

```
Nacional + PorUnidad='N':
    Valor = redondear(FnGetTarifaIndexada(..., 'N', ...), Redondeo)

Nacional + PorUnidad='S':
    Valor = redondear(FnGetTarifaIndexada(..., 'N', ...) * Peso_Kilos, Redondeo)

Internacional + PorUnidad='N':
    Valor = redondear(
              FnCalcTarifLocalForInt(MonedaOperInt, TarifaNal, TarifaInt, CalcFromZero, Tasa, Prec)
              , Redondeo)
            * (Si Moneda=USD entonces Tasa sino 1)

Internacional + PorUnidad='S':
    Valor = redondear(
              FnCalcTarifLocalForInt(...) * Peso_Kilos
              , Redondeo)
            * (Si Moneda=USD entonces Tasa sino 1)
```

### Recargo Nocturno:
```
ValorRecargo = redondear(
                redondear(ValorAterrizaje / Tasa, 2) * (PorcentajeRecargo / 100)
                , 2)
               * (Si Moneda=USD entonces Tasa sino 1)
```

---

## 5. FÓRMULA DE CÁLCULO — PARQUEO

### Cálculo de horas:
```
HorasEstacionamiento = (FechaSalida - FechaIngreso) en minutos / 60
HorasFacturables = HorasEstacionamiento - HorasGracia
```

### Cálculo de valor:
```
ValorParqueo = redondear(
                redondear(TarifaBase * HorasFacturables, Redondeo)
                , Precision)
```

### Recargo Nocturno Parqueo:
```
TiempoRecNoct = FnGetHrsFactbyParK('RN', ...)
ValorRecNoct = TarifaBase * TiempoRecNoct * (PorcRecNoct / 100)
```

---

## 6. FLUJO DE FACTURACIÓN CONTADO (GeneraFacK)

```
SpFactContado (Op='GenerarMov')
    │
    ├── 1. Valida fecha (no futura, día abierto, período existe)
    ├── 2. Valida conceptos parametrizados (SpValidaConceptosAeroportuarios)
    ├── 3. Valida ubicación geográfica del usuario
    ├── 4. Valida precisión de tarifas
    │
    ├── 5. BEGIN TRANSACTION
    │       │
    │       ├── 5.1 GeneraFacK → genera movimientos en MovFact*
    │       │       ├── MovFactOper (aterrizaje + recargo nocturno)
    │       │       ├── MovFactParq (parqueo + recargo nocturno)
    │       │       ├── MovFactPnte (puente)
    │       │       ├── MovFactCarga (carga)
    │       │       ├── MovFactTanq (tanqueo)
    │       │       ├── MovFactExtHor (ext. horaria)
    │       │       ├── MovFactAsTierra (asistencia tierra)
    │       │       ├── MovFactAsAlPax (asistencia pasajeros)
    │       │       ├── MovFactTasas (tasas aeroportuarias)
    │       │       └── RegistroConceptosFact (conceptos adicionales)
    │       │
    │       ├── 5.2 Recolecta valores agrupados por operación/tipo/nacionalidad
    │       ├── 5.3 Genera Factura (cabecera + detalle + impuestos)
    │       ├── 5.4 Actualiza consecutivos por aeropuerto
    │       └── 5.5 Marca operaciones como facturadas
    │
    └── 6. COMMIT TRANSACTION
```

---

## 7. MULTI-TENENCIA Y CONSECUTIVOS

### Consecutivos por Aeropuerto:
- Cada aeropuerto tiene su propia secuencia de facturas
- `FuentesFacturacionAeropuerto` define: fuente contado, fuente crédito, serie
- La tabla `consecutivos_aero` (`ConsecutivosAero`) maneja el consecutivo por código
- `MaeConsecutivosBu` maneja consecutivos por unidad de negocio (BU)

### Lógica de fuente/documento:
```
Fuente = fuenteFacturacion.fuenteContado (para contado) o fuenteCredito (para crédito)
Documento = consecutivo + 1 para la fuente
```

---

## 8. MODELO DE FACTURACIÓN (Parámetro 1164)

| Valor | Significado |
|-------|-------------|
| `AIRPLAN` | Modelo estándar — calcula recargo nocturno con redondeo específico |
| `SACSA` | Variante SACSA |
| `AIRPLAN-OLD` | Modelo antiguo (compatibilidad) |
| (vacío) | Default → `AIRPLAN` |

---

## 9. CONCEPTOS DE COBRO (Códigos desde parámetros)

| Concepto | # Parám | Cálculo basado en |
|---|---|---|
| Aterrizaje | 1089 | Peso de la aeronave × Tarifa (por unidad o peso) |
| Recargo Nocturno Operación | 1090 | % sobre valor de aterrizaje en horario nocturno |
| Parqueo | 1091 | Horas × Tarifa horaria |
| Parqueo en Puente | 1092 | Horas × Tarifa (tarifa diferente) |
| Puente de Abordaje | 1094 | Por uso (unitario) |
| Tanqueo | 1095 | Galones × Tarifa |
| Extensión Horaria | 1096 | Horas extra × Tarifa |
| Tasas Aeroportuarias | 1097 | Por pasajero (según liquidación) |
| Carga | 1098 | Kilos × Tarifa |
| Asistencia en Tierra | 1112 | Por operación |
| Asistencia al Pasajero | 1147 | Por pasajero |
| Traslado de Pasajeros | 1148 | Por pasajero |
| Recargo Nocturno Parqueo | 1132 | % sobre valor parqueo en hora nocturna |

---

## 10. HALLAZGOS Y OPORTUNIDADES DE MEJORA

### Problemas del legacy que NO replicar:
1. **Acoplamiento total** — Toda la lógica en un solo SP de 2000+ líneas
2. **Sin tests** — No hay manera de verificar cálculos individuales
3. **Fórmulas VB6 embebidas** — SpEjecutaFormulaVB_Nativo ejecuta código VB6 desde la BD
4. **Parámetros hardcodeados** — IDs numéricos sin validación
5. **Redondeos inconsistentes** — Diferentes redondeos para diferentes conceptos
6. **Sin auditoría** — No hay registro de quién calculó qué y cuándo
7. **Sin manejo de errores granular** — Un error en un concepto mata toda la factura

### Mejoras a implementar:
1. **Motor de cálculo como servicio TypeScript** — Modular, testeable
2. **Fórmulas configurables vía expresión engine** (sin VB6)
3. **Pipeline de conceptos** — Cada concepto es un paso independiente
4. **Auditoría por cálculo** — Log de cada valor generado
5. **Cálculo preview** — Mostrar desglose antes de facturar
6. **Manejo de errores por concepto** — Un concepto falla, los otros continúan

---

*Documento generado el 14 de Junio, 2026*
*Basado en análisis de GeneraFac.sql, GeneraFacK.sql, SpFactContado.sql*
