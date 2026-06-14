import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_MODELS = [
  'pais', 'ciudad', 'aeropuerto', 'zona', 'zonaAeropuerto', 'horarioAeropuerto',
  'aerolinea', 'aeronave', 'tipoAeronave', 'fabricante', 'claseAviacion', 'personalAerolinea',
  'aerolineaConcepto', 'aerolineaConfig',
  'concepto', 'grupoConcepto', 'tipoOperacion', 'tarifaOperacion', 'tarifaAerolinea', 'impuesto',
  'itinerario', 'vuelo', 'puertaEmbarque', 'hangar', 'servicioOperacion', 'registroPeso',
  'tasa', 'tipoPasajero', 'clasePasajero',
  'parametroSistema', 'indicadorEconomico', 'codigoAeronautico', 'servicioAereo',
  'periodo', 'mensaje', 'reporte', 'categoriaReporte',
] as const;

type AllowedModel = (typeof ALLOWED_MODELS)[number];

@Injectable()
export class MaestrosService {
  private readonly modelMapping: Record<string, string> = {
    'paises': 'pais',
    'ciudades': 'ciudad',
    'aeropuertos': 'aeropuerto',
    'zonas': 'zona',
    'zonas-aeropuerto': 'zonaAeropuerto',
    'horarios-aeropuerto': 'horarioAeropuerto',
    'aerolineas': 'aerolinea',
    'aeronaves': 'aeronave',
    'tipos-aeronave': 'tipoAeronave',
    'fabricantes': 'fabricante',
    'clases-aviacion': 'claseAviacion',
    'personal-aerolinea': 'personalAerolinea',
    'aerolineas-conceptos': 'aerolineaConcepto',
    'aerolineas-config': 'aerolineaConfig',
    'conceptos': 'concepto',
    'grupos-concepto': 'grupoConcepto',
    'tipos-operacion': 'tipoOperacion',
    'tarifas-operacion': 'tarifaOperacion',
    'tarifas-aerolinea': 'tarifaAerolinea',
    'impuestos': 'impuesto',
    'itinerarios': 'itinerario',
    'vuelos': 'vuelo',
    'puertas-embarque': 'puertaEmbarque',
    'hangares': 'hangar',
    'servicios-operacion': 'servicioOperacion',
    'registros-peso': 'registroPeso',
    'tasas': 'tasa',
    'tipos-pasajero': 'tipoPasajero',
    'clases-pasajero': 'clasePasajero',
    'parametros-sistema': 'parametroSistema',
    'indicadores-economicos': 'indicadorEconomico',
    'codigos-aeronauticos': 'codigoAeronautico',
    'servicios-aereos': 'servicioAereo',
    'periodos': 'periodo',
    'mensajes': 'mensaje',
    'reportes': 'reporte',
    'categorias-reporte': 'categoriaReporte',
  };

  constructor(private readonly prisma: PrismaService) {}

  private getPrismaModel(model: string): AllowedModel {
    const prismaModel = this.modelMapping[model];
    if (!prismaModel) {
      throw new BadRequestException(`Modelo no válido: ${model}`);
    }
    return prismaModel as AllowedModel;
  }

  async findAll(model: string, query?: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    const prismaModel = this.getPrismaModel(model);
    const delegate = (this.prisma as any)[prismaModel];
    return delegate.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: { activo: true, ...query?.where },
      orderBy: query?.orderBy ?? { id: 'asc' },
    });
  }

  async findOne(model: string, id: number) {
    const prismaModel = this.getPrismaModel(model);
    const delegate = (this.prisma as any)[prismaModel];
    const record = await delegate.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Registro no encontrado en ${model}`);
    }
    return record;
  }

  async create(model: string, data: Record<string, any>) {
    const prismaModel = this.getPrismaModel(model);
    const delegate = (this.prisma as any)[prismaModel];
    return delegate.create({ data });
  }

  async update(model: string, id: number, data: Record<string, any>) {
    const prismaModel = this.getPrismaModel(model);
    const delegate = (this.prisma as any)[prismaModel];
    const record = await delegate.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Registro no encontrado en ${model}`);
    }
    return delegate.update({ where: { id }, data });
  }

  async remove(model: string, id: number) {
    const prismaModel = this.getPrismaModel(model);
    const delegate = (this.prisma as any)[prismaModel];
    const record = await delegate.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Registro no encontrado en ${model}`);
    }
    return delegate.delete({ where: { id } });
  }
}
