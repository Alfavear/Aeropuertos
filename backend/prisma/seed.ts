import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // ================================================================
  // 1. PAISES
  // ================================================================
  const colombia = await prisma.pais.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'CO', nombre: 'Colombia', nacionalidad: 'Colombiana' },
  });
  const peru = await prisma.pais.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'PE', nombre: 'Perú', nacionalidad: 'Peruana' },
  });
  const usa = await prisma.pais.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'US', nombre: 'Estados Unidos', nacionalidad: 'Americana' },
  });
  const espana = await prisma.pais.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'ES', nombre: 'España', nacionalidad: 'Española' },
  });
  const mexico = await prisma.pais.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, codigo: 'MX', nombre: 'México', nacionalidad: 'Mexicana' },
  });
  const argentina = await prisma.pais.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, codigo: 'AR', nombre: 'Argentina', nacionalidad: 'Argentina' },
  });
  const brasil = await prisma.pais.upsert({
    where: { id: 7 },
    update: {},
    create: { id: 7, codigo: 'BR', nombre: 'Brasil', nacionalidad: 'Brasileña' },
  });
  const chile = await prisma.pais.upsert({
    where: { id: 8 },
    update: {},
    create: { id: 8, codigo: 'CL', nombre: 'Chile', nacionalidad: 'Chilena' },
  });
  const ecuador = await prisma.pais.upsert({
    where: { id: 9 },
    update: {},
    create: { id: 9, codigo: 'EC', nombre: 'Ecuador', nacionalidad: 'Ecuatoriana' },
  });
  const panama = await prisma.pais.upsert({
    where: { id: 10 },
    update: {},
    create: { id: 10, codigo: 'PA', nombre: 'Panamá', nacionalidad: 'Panameña' },
  });

  console.log(`  ✓ ${10} países creados`);

  // ================================================================
  // 2. CIUDADES
  // ================================================================
  const bogota = await prisma.ciudad.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'BOG', nombre: 'Bogotá', idPais: colombia.id },
  });
  const medellin = await prisma.ciudad.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'MDE', nombre: 'Medellín', idPais: colombia.id },
  });
  const cali = await prisma.ciudad.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'CLO', nombre: 'Cali', idPais: colombia.id },
  });
  const barranquilla = await prisma.ciudad.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'BAQ', nombre: 'Barranquilla', idPais: colombia.id },
  });

  console.log(`  ✓ ${4} ciudades creadas`);

  // ================================================================
  // 3. ZONAS
  // ================================================================
  const zonaNorte = await prisma.zona.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'NORTE', nombre: 'Zona Norte' },
  });
  const zonaSur = await prisma.zona.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'SUR', nombre: 'Zona Sur' },
  });
  const zonaCentro = await prisma.zona.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'CENTRO', nombre: 'Zona Centro' },
  });

  console.log(`  ✓ ${3} zonas creadas`);

  // ================================================================
  // 4. AEROPUERTOS
  // ================================================================
  await prisma.aeropuerto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, codigo: 'BOG', nombre: 'Aeropuerto Internacional El Dorado',
      idCiudad: bogota.id, idZona: zonaCentro.id, idPais: colombia.id,
      tasa: 0, manejoCarga: true, controlAdministrativo: true,
      numeroHangares: 10, cerrarDia: 0, horaCierre: '2359',
    },
  });
  await prisma.aeropuerto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, codigo: 'MDE', nombre: 'Aeropuerto Internacional José María Córdova',
      idCiudad: medellin.id, idZona: zonaNorte.id, idPais: colombia.id,
      tasa: 0, manejoCarga: true, controlAdministrativo: true,
      numeroHangares: 5, cerrarDia: 0, horaCierre: '2359',
    },
  });
  await prisma.aeropuerto.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3, codigo: 'CLO', nombre: 'Aeropuerto Internacional Alfonso Bonilla Aragón',
      idCiudad: cali.id, idZona: zonaSur.id, idPais: colombia.id,
      tasa: 0, manejoCarga: true, controlAdministrativo: false,
      numeroHangares: 3, cerrarDia: 0, horaCierre: '2359',
    },
  });
  await prisma.aeropuerto.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4, codigo: 'BAQ', nombre: 'Aeropuerto Internacional Ernesto Cortissoz',
      idCiudad: barranquilla.id, idZona: zonaNorte.id, idPais: colombia.id,
      tasa: 0, manejoCarga: false, controlAdministrativo: false,
      numeroHangares: 2, cerrarDia: 0, horaCierre: '2359',
    },
  });

  console.log(`  ✓ ${4} aeropuertos creados`);

  // ================================================================
  // 5. CLASES DE AVIACION
  // ================================================================
  await prisma.claseAviacion.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'COM', descripcion: 'Aviación Comercial' },
  });
  await prisma.claseAviacion.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'CAR', descripcion: 'Aviación de Carga' },
  });
  await prisma.claseAviacion.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'PRI', descripcion: 'Aviación Privada' },
  });
  await prisma.claseAviacion.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'MIL', descripcion: 'Aviación Militar' },
  });
  await prisma.claseAviacion.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, codigo: 'GEN', descripcion: 'Aviación General' },
  });

  console.log(`  ✓ ${5} clases de aviación creadas`);

  // ================================================================
  // 6. FABRICANTES
  // ================================================================
  await prisma.fabricante.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'BOE', nombre: 'Boeing' },
  });
  await prisma.fabricante.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'AIR', nombre: 'Airbus' },
  });
  await prisma.fabricante.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'EMB', nombre: 'Embraer' },
  });
  await prisma.fabricante.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'BOM', nombre: 'Bombardier' },
  });
  await prisma.fabricante.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, codigo: 'ATR', nombre: 'ATR' },
  });

  console.log(`  ✓ ${5} fabricantes creados`);

  // ================================================================
  // 7. TIPOS DE AERONAVE
  // ================================================================
  await prisma.tipoAeronave.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'B737', descripcion: 'Boeing 737', idFabricante: 1, capacidadPasajeros: 189, totalTripulacion: 6 },
  });
  await prisma.tipoAeronave.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'B767', descripcion: 'Boeing 767', idFabricante: 1, capacidadPasajeros: 269, totalTripulacion: 8 },
  });
  await prisma.tipoAeronave.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'A320', descripcion: 'Airbus A320', idFabricante: 2, capacidadPasajeros: 180, totalTripulacion: 6 },
  });
  await prisma.tipoAeronave.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'E190', descripcion: 'Embraer E190', idFabricante: 3, capacidadPasajeros: 114, totalTripulacion: 4 },
  });

  console.log(`  ✓ ${4} tipos de aeronave creados`);

  // ================================================================
  // 8. TIPOS DE OPERACION
  // ================================================================
  await prisma.tipoOperacion.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'ATER', nombre: 'Aterrizaje', idConcepto: 1, tipoTarifa: 1 },
  });
  await prisma.tipoOperacion.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'DESP', nombre: 'Despegue', idConcepto: 1, tipoTarifa: 1 },
  });
  await prisma.tipoOperacion.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'EST', nombre: 'Estacionamiento', idConcepto: 2, tipoTarifa: 2 },
  });
  await prisma.tipoOperacion.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'HANG', nombre: 'Hangar', idConcepto: 2, tipoTarifa: 2 },
  });

  console.log(`  ✓ ${4} tipos de operación creados`);

  // ================================================================
  // 9. GRUPOS DE CONCEPTO
  // ================================================================
  await prisma.grupoConcepto.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'OPE', descripcion: 'Operaciones' },
  });
  await prisma.grupoConcepto.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'SER', descripcion: 'Servicios' },
  });
  await prisma.grupoConcepto.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'TAS', descripcion: 'Tasas' },
  });

  console.log(`  ✓ ${3} grupos de concepto creados`);

  // ================================================================
  // 10. CONCEPTOS
  // ================================================================
  await prisma.concepto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, codigo: 'ATER', nombre: 'Aterrizaje', descripcion: 'Tarifa por aterrizaje',
      tipoTarifa: 1, activo: true, idGrupoConcepto: 1,
    },
  });
  await prisma.concepto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, codigo: 'PARQ', nombre: 'Parqueo', descripcion: 'Tarifa por estacionamiento',
      tipoTarifa: 2, activo: true, idGrupoConcepto: 1,
    },
  });
  await prisma.concepto.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3, codigo: 'HANG', nombre: 'Hangar', descripcion: 'Servicio de hangar',
      tipoTarifa: 2, activo: true, idGrupoConcepto: 1,
    },
  });
  await prisma.concepto.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4, codigo: 'TASA', nombre: 'Tasa Aeroportuaria', descripcion: 'Tasa por uso de aeropuerto',
      tipoTarifa: 3, activo: true, idGrupoConcepto: 3,
    },
  });
  await prisma.concepto.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5, codigo: 'SEG', nombre: 'Seguridad', descripcion: 'Tarifa de seguridad',
      tipoTarifa: 1, activo: true, idGrupoConcepto: 2,
    },
  });
  await prisma.concepto.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6, codigo: 'BOMB', nombre: 'Servicio de Bomberos', descripcion: 'Servicio contra incendios',
      tipoTarifa: 1, activo: true, idGrupoConcepto: 2,
    },
  });

  console.log(`  ✓ ${6} conceptos creados`);

  // ================================================================
  // 11. TIPOS DE PASAJERO
  // ================================================================
  await prisma.tipoPasajero.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'AD', nombre: 'Adulto', exento: false },
  });
  await prisma.tipoPasajero.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'ME', nombre: 'Menor', exento: false },
  });
  await prisma.tipoPasajero.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'IN', nombre: 'Infante', exento: true },
  });
  await prisma.tipoPasajero.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'EX', nombre: 'Exento', exento: true },
  });
  await prisma.tipoPasajero.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, codigo: 'TR', nombre: 'Tránsito', exento: true },
  });

  console.log(`  ✓ ${5} tipos de pasajero creados`);

  // ================================================================
  // 12. CLASES DE PASAJERO
  // ================================================================
  await prisma.clasePasajero.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'PC', nombre: 'Primera Clase', descripcion: 'First Class' },
  });
  await prisma.clasePasajero.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'EJ', nombre: 'Ejecutiva', descripcion: 'Business Class' },
  });
  await prisma.clasePasajero.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'EC', nombre: 'Económica', descripcion: 'Economy Class' },
  });

  console.log(`  ✓ ${3} clases de pasajero creadas`);

  // ================================================================
  // 13. IMPUESTOS
  // ================================================================
  await prisma.impuesto.upsert({
    where: { codigo: 'IVA19' },
    update: {},
    create: { codigo: 'IVA19', nombre: 'IVA 19%', porcentaje: 19, cuenta: '240801' },
  });
  await prisma.impuesto.upsert({
    where: { codigo: 'IVA5' },
    update: {},
    create: { codigo: 'IVA5', nombre: 'IVA 5%', porcentaje: 5, cuenta: '240802' },
  });
  await prisma.impuesto.upsert({
    where: { codigo: 'RETEICA' },
    update: {},
    create: { codigo: 'RETEICA', nombre: 'Retención ICA', porcentaje: 0.96, cuenta: '236501' },
  });

  console.log(`  ✓ ${3} impuestos creados`);

  // ================================================================
  // 14. INDICADORES ECONOMICOS
  // ================================================================
    await prisma.indicadorEconomico.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, codigo: 'TRM', descripcion: 'Tasa Representativa del Mercado', valor: 4200, valorProx: 4200, fecha: new Date() },
    });
    await prisma.indicadorEconomico.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, codigo: 'IPC', descripcion: 'Índice de Precios al Consumidor', valor: 5.2, valorProx: 5.2, fecha: new Date() },
    });
    await prisma.indicadorEconomico.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, codigo: 'UVT', descripcion: 'Unidad de Valor Tributario', valor: 47000, valorProx: 47000, fecha: new Date() },
    });

  console.log(`  ✓ ${3} indicadores económicos creados`);

  // ================================================================
  // 15. PARAMETROS DEL SISTEMA (30 esenciales)
  // ================================================================
  const parametros = [
    { id: 1, codigo: 'ModoFactParq', nombre: 'Modo de facturación parqueo', descripcion: 'Define cómo se cobra el tiempo de parqueo', valor: 'Por Hora o Fracción', tipo: 'S', modulo: 'OPERACIONES' },
    { id: 2, codigo: 'ModoFactEmpresa', nombre: 'Modelo de facturación', descripcion: 'Define el modelo de facturación por empresa', valor: 'Por evento', tipo: 'S', modulo: 'FACTURACION' },
    { id: 3, codigo: 'DiasVencTasas', nombre: 'Días vencimiento tasas', descripcion: 'Días de vencimiento para facturar tasas', valor: '30', tipo: 'N', modulo: 'FACTURACION' },
    { id: 4, codigo: 'CodBomberos', nombre: 'Código concepto bomberos', descripcion: 'Código del concepto de servicio de bomberos', valor: 'BOMB', tipo: 'S', modulo: 'TARIFAS' },
    { id: 5, codigo: 'ControlCertExplotNac', nombre: 'Control certificado explotación', descripcion: 'Controla el certificado de explotación nacional', valor: 'S', tipo: 'B', modulo: 'AEROLINEAS' },
    { id: 6, codigo: 'HrsGraciaParqueo', nombre: 'Horas de gracia parqueo', descripcion: 'Horas de gracia para cobro de parqueo', valor: '0.5', tipo: 'N', modulo: 'OPERACIONES' },
    { id: 7, codigo: 'HrsGraciaHangar', nombre: 'Horas de gracia hangar', descripcion: 'Horas de gracia para cobro de hangar', valor: '1', tipo: 'N', modulo: 'OPERACIONES' },
    { id: 8, codigo: 'PorRecargoNocturno', nombre: 'Porcentaje recargo nocturno', descripcion: 'Porcentaje de recargo para operaciones nocturnas', valor: '25', tipo: 'N', modulo: 'OPERACIONES' },
    { id: 9, codigo: 'AplicaTRMAterrizajes', nombre: 'Aplicar TRM en aterrizajes', descripcion: 'Define si se aplica TRM del día en aterrizajes internacionales', valor: 'S', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 10, codigo: 'RedondeoRecNoc', nombre: 'Redondeo recargos nocturnos', descripcion: 'Define el tipo de redondeo para recargos nocturnos', valor: 'Decimal', tipo: 'S', modulo: 'FACTURACION' },
    { id: 11, codigo: 'ActivarNotificaciones', nombre: 'Activar notificaciones', descripcion: 'Activa las notificaciones del sistema', valor: 'S', tipo: 'B', modulo: 'SEGURIDAD' },
    { id: 12, codigo: 'TiempoNotifVenceCert', nombre: 'Tiempo notificación vencimiento certificados', descripcion: 'Días antes para notificar vencimiento de certificados', valor: '30', tipo: 'N', modulo: 'AEROLINEAS' },
    { id: 13, codigo: 'FacturacionElectronica', nombre: 'Facturación electrónica', descripcion: 'Habilita facturación electrónica', valor: 'S', tipo: 'B', modulo: 'FACTURACION' },
    { id: 14, codigo: 'UsaTRMImpresionFact', nombre: 'Usar TRM en impresión factura', descripcion: 'Define si se usa la TRM al imprimir facturas', valor: 'S', tipo: 'B', modulo: 'FACTURACION' },
    { id: 15, codigo: 'GeneraRecNocPorSalida', nombre: 'Generar recargo nocturno por salida', descripcion: 'Genera recargo nocturno cuando la operación sale en horario nocturno', valor: 'N', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 16, codigo: 'OcultaCerosFact', nombre: 'Ocultar ceros en facturas', descripcion: 'Oculta líneas con valor cero en impresión de facturas', valor: 'N', tipo: 'B', modulo: 'FACTURACION' },
    { id: 17, codigo: 'BloqueaMultiplesConex', nombre: 'Bloquear múltiples conexiones', descripcion: 'Bloquea sesiones múltiples del mismo usuario', valor: 'N', tipo: 'B', modulo: 'SEGURIDAD' },
    { id: 18, codigo: 'PrecisionIVA', nombre: 'Precisión IVA', descripcion: 'Número de decimales para cálculo de IVA', valor: '2', tipo: 'N', modulo: 'FACTURACION' },
    { id: 19, codigo: 'UsaHrsGraciaHangares', nombre: 'Horas de gracia en hangares', descripcion: 'Aplica horas de gracia en hangares', valor: 'S', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 20, codigo: 'TRMporOperacion', nombre: 'TRM por operación', descripcion: 'Usa TRM del día de la operación para cálculo', valor: 'S', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 21, codigo: 'CobroExtDesdeCierre', nombre: 'Cobro extensión desde cierre', descripcion: 'Calcula cobro de extensión horaria desde el cierre', valor: 'N', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 22, codigo: 'NoVerConcSinMov', nombre: 'Ocultar conceptos sin movimiento', descripcion: 'No muestra conceptos sin movimiento en control de ingresos', valor: 'N', tipo: 'B', modulo: 'FACTURACION' },
    { id: 23, codigo: 'MaxIntentosLogin', nombre: 'Máximo intentos de login', descripcion: 'Número máximo de intentos fallidos antes de bloquear', valor: '5', tipo: 'N', modulo: 'SEGURIDAD' },
    { id: 24, codigo: 'TiempoSesionHoras', nombre: 'Duración sesión (horas)', descripcion: 'Horas de duración del token de sesión', valor: '8', tipo: 'N', modulo: 'SEGURIDAD' },
    { id: 25, codigo: 'TipoCambioDefecto', nombre: 'Tipo de cambio por defecto', descripcion: 'Tipo de cambio usado por defecto', valor: 'TRM', tipo: 'S', modulo: 'GENERAL' },
    { id: 26, codigo: 'MonedaLocal', nombre: 'Moneda local', descripcion: 'Código de la moneda local', valor: 'COP', tipo: 'S', modulo: 'GENERAL' },
    { id: 27, codigo: 'MonedaInternacional', nombre: 'Moneda internacional', descripcion: 'Código de la moneda internacional', valor: 'USD', tipo: 'S', modulo: 'GENERAL' },
    { id: 28, codigo: 'AplicaDescuentoHV', nombre: 'Aplicar descuento hora valle', descripcion: 'Aplica descuento por hora valle', valor: 'N', tipo: 'B', modulo: 'OPERACIONES' },
    { id: 29, codigo: 'PlantillaRptFE', nombre: 'Plantilla reporte FE', descripcion: 'Nombre del template de reporte de factura electrónica', valor: 'FacturaElectronica.jasper', tipo: 'S', modulo: 'FACTURACION' },
    { id: 30, codigo: 'DebugMode', nombre: 'Modo debug', descripcion: 'Activa logs de depuración', valor: 'N', tipo: 'B', modulo: 'SISTEMA' },
  ];

  for (const p of parametros) {
    await prisma.parametroSistema.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  console.log(`  ✓ ${parametros.length} parámetros del sistema creados`);

  // ================================================================
  // 16. PERFILES
  // ================================================================
  const perfilAdmin = await prisma.perfil.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'ADMIN', nombre: 'Administrador', descripcion: 'Acceso total al sistema', activo: true },
  });
  await prisma.perfil.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'OPERADOR', nombre: 'Operador', descripcion: 'Gestión de operaciones', activo: true },
  });
  await prisma.perfil.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'FACTURADOR', nombre: 'Facturador', descripcion: 'Gestión de facturación', activo: true },
  });
  await prisma.perfil.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'CONSULTA', nombre: 'Consulta', descripcion: 'Solo lectura', activo: true },
  });

  console.log(`  ✓ ${4} perfiles creados`);

  // ================================================================
  // 17. MENU OPCIONES
  // ================================================================
  const menuItems = [
    // Dashboard
    { id: 1, idPadre: null, nombre: 'Dashboard', ruta: '/', icono: 'LayoutDashboard', orden: 1 },
    // Organización
    { id: 10, idPadre: null, nombre: 'Organización', ruta: null, icono: 'Building2', orden: 10 },
    { id: 11, idPadre: 10, nombre: 'Países', ruta: '/paises', icono: 'Globe', orden: 11 },
    { id: 12, idPadre: 10, nombre: 'Ciudades', ruta: '/ciudades', icono: 'MapPin', orden: 12 },
    { id: 13, idPadre: 10, nombre: 'Aeropuertos', ruta: '/aeropuertos', icono: 'Plane', orden: 13 },
    { id: 14, idPadre: 10, nombre: 'Zonas', ruta: '/zonas', icono: 'Layers', orden: 14 },
    // Aerolíneas
    { id: 20, idPadre: null, nombre: 'Aerolíneas', ruta: null, icono: 'Building2', orden: 20 },
    { id: 21, idPadre: 20, nombre: 'Aerolíneas', ruta: '/aerolineas', icono: 'Building2', orden: 21 },
    { id: 22, idPadre: 20, nombre: 'Aeronaves', ruta: '/aeronaves', icono: 'PlaneTakeoff', orden: 22 },
    { id: 23, idPadre: 20, nombre: 'Tipos de Aeronave', ruta: '/tipos-aeronave', icono: 'Settings', orden: 23 },
    { id: 24, idPadre: 20, nombre: 'Fabricantes', ruta: '/fabricantes', icono: 'Factory', orden: 24 },
    // Operaciones
    { id: 30, idPadre: null, nombre: 'Operaciones', ruta: null, icono: 'PlaneTakeoff', orden: 30 },
    { id: 31, idPadre: 30, nombre: 'Itinerarios', ruta: '/itinerarios', icono: 'Calendar', orden: 31 },
    { id: 32, idPadre: 30, nombre: 'Vuelos', ruta: '/vuelos', icono: 'FlightTakeoff', orden: 32 },
    { id: 33, idPadre: 30, nombre: 'Puertas', ruta: '/puertas', icono: 'DoorOpen', orden: 33 },
    { id: 34, idPadre: 30, nombre: 'Hangares', ruta: '/hangares', icono: 'Warehouse', orden: 34 },
    // Tarifas
    { id: 40, idPadre: null, nombre: 'Tarifas', ruta: null, icono: 'DollarSign', orden: 40 },
    { id: 41, idPadre: 40, nombre: 'Conceptos', ruta: '/conceptos', icono: 'FileText', orden: 41 },
    { id: 42, idPadre: 40, nombre: 'Tarifas Operación', ruta: '/tarifas-operacion', icono: 'Table', orden: 42 },
    { id: 43, idPadre: 40, nombre: 'Impuestos', ruta: '/impuestos', icono: 'Percent', orden: 43 },
    // Facturación
    { id: 50, idPadre: null, nombre: 'Facturación', ruta: null, icono: 'FileText', orden: 50 },
    { id: 51, idPadre: 50, nombre: 'Facturas', ruta: '/facturas', icono: 'FileText', orden: 51 },
    { id: 52, idPadre: 50, nombre: 'Fuentes', ruta: '/fuentes-facturacion', icono: 'Settings', orden: 52 },
    // Liquidaciones
    { id: 60, idPadre: null, nombre: 'Liquidaciones', ruta: null, icono: 'BarChart', orden: 60 },
    { id: 61, idPadre: 60, nombre: 'Liquidaciones', ruta: '/liquidaciones', icono: 'BarChart', orden: 61 },
    { id: 62, idPadre: 60, nombre: 'Tasas', ruta: '/tasas', icono: 'DollarSign', orden: 62 },
    // Seguridad
    { id: 70, idPadre: null, nombre: 'Seguridad', ruta: null, icono: 'Shield', orden: 70 },
    { id: 71, idPadre: 70, nombre: 'Usuarios', ruta: '/usuarios', icono: 'Users', orden: 71 },
    { id: 72, idPadre: 70, nombre: 'Perfiles', ruta: '/perfiles', icono: 'UserCheck', orden: 72 },
    // Configuración
    { id: 80, idPadre: null, nombre: 'Configuración', ruta: null, icono: 'Settings', orden: 80 },
    { id: 81, idPadre: 80, nombre: 'Parámetros', ruta: '/parametros', icono: 'Sliders', orden: 81 },
    { id: 82, idPadre: 80, nombre: 'Indicadores', ruta: '/indicadores', icono: 'TrendingUp', orden: 82 },
  ];

  for (const item of menuItems) {
    await prisma.menuOpcion.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  console.log(`  ✓ ${menuItems.length} opciones de menú creadas`);

  // ================================================================
  // 18. USUARIO ADMIN
  // ================================================================
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.usuario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: 'admin',
      password: hashedPassword,
      nombre: 'Administrador del Sistema',
      email: 'admin@zeus.aero',
      idPerfil: perfilAdmin.id,
      activo: true,
      bloqueado: false,
    },
  });

  console.log('  ✓ Usuario admin creado (admin / admin123)');

  // ================================================================
  // 19. CATEGORIAS DE REPORTE
  // ================================================================
  await prisma.categoriaReporte.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, nombre: 'Operaciones' },
  });
  await prisma.categoriaReporte.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, nombre: 'Facturación' },
  });
  await prisma.categoriaReporte.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, nombre: 'Liquidaciones' },
  });
  await prisma.categoriaReporte.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, nombre: 'Estadísticas' },
  });

  console.log(`  ✓ ${4} categorías de reporte creadas`);

  // ================================================================
  // 20. SERVICIOS AEREOS
  // ================================================================
  await prisma.servicioAereo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, codigo: 'GH', nombre: 'Ground Handling', descripcion: 'Servicios en tierra' },
  });
  await prisma.servicioAereo.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, codigo: 'AP', nombre: 'Asistencia al Pasajero', descripcion: 'Atención a pasajeros' },
  });
  await prisma.servicioAereo.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, codigo: 'CA', nombre: 'Carga', descripcion: 'Manejo de carga' },
  });
  await prisma.servicioAereo.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, codigo: 'RM', nombre: 'Rampa', descripcion: 'Servicios de rampa' },
  });

  console.log(`  ✓ ${4} servicios aéreos creados`);

  console.log('');
  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
