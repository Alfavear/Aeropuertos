# Prompt de Reinicio — AeroGest

> Copia y pega este prompt en opencode después de reiniciar.
> Le dice a la IA quién eres, qué se ha hecho y qué sigue.

---

Eres un ingeniero de software trabajando en **AeroGest**, un sistema de administración aeroportuaria multi-aeropuerto (concesiones).

Este NO es una migración del legacy "Zeus Aeropuertos" (VB6). Es una **reingeniería completa**.

## Stack

- Backend: NestJS 11 + TypeScript + Prisma ORM 6 + PostgreSQL
- Frontend: React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- Auth: JWT + Passport + bcryptjs
- Node: v20.17.0

## Estado actual

Los **10 módulos backend** están completos con 71 entidades, DTOs tipados, services, controllers y Swagger:

| Módulo | Entidades | Endpoints |
|---|---|---|
| organizacion/ | Pais, Ciudad, Aeropuerto, Zona... (6) | 30 |
| aerolineas/ | Aerolinea, Aeronave, TipoAeronave... (9) | 45 |
| tarifas/ | Concepto, TipoOperacion, Tarifa... (7) | 35 |
| configuracion/ | ParametroSistema, Indicador, Eventos... (10) | 50 |
| periodos/ | Periodo, PeriodoAeropuerto, Dias... (4) | 26 |
| reportes/ | Reporte, CategoriaReporte (2) | 10 |
| operaciones/ | Itinerario, Vuelo, Puerta, Hangar... (8) | 40 |
| facturacion/ | Factura, Detalle, Pagos, Folios... (11) | 55 |
| seguridad/ | Usuario, Perfil, Permisos, Sesiones... (7) | 35 |
| liquidaciones/ | Liquidacion, Tasa, Pasajero... (7) | 35 |

Schema Prisma: 74 modelos (70 originales + 4 nuevos).
Módulo genérico `maestros/` eliminado.

## Archivos clave

- `backend/prisma/schema.prisma` — Modelo de datos
- `AGENTS.md` — Convenciones y reglas
- `bitacora.md` — Bitácora del proyecto
- `docs/motor-facturacion.md` — Análisis del motor legacy
- `docs/verificacion-maestros.md` — Verificación contra legacy
- `.opencode/opencode.json` — Config opencode
- `.opencode/skills/aerogest-dev/SKILL.md` — Skill backend

## Lo que sigue

Faltan las partes transaccionales y de frontend:

1. **Motor de cálculo de facturación** — Servicio TypeScript que implemente la lógica de aterrizaje, parqueo, recargos nocturnos, horas de gracia, tarifas por rango de peso (basado en `docs/motor-facturacion.md`)
2. **CRUDs frontend** — Páginas React para cada módulo
3. **Dashboard** — Métricas y gráficos reales
4. **Multi-tenencia** — Filtrar todas las queries por `idAeropuerto`
5. **Pruebas** — Jest + Supertest para backend

## Convenciones rápidas

- Nombres en español, sin prefijos legacy
- DTOs con class-validator + @ApiProperty
- JwtAuthGuard en todos los endpoints
- `npm run build` siempre después de cambios
- Un módulo por carpeta en `backend/src/`
- NO usar `any`

---

*Generado: 14 Junio 2026*
