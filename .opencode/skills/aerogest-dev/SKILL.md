---
name: aerogest-dev
description: > 
  Use ONLY when the task involves backend NestJS development, Prisma schema changes,
  module creation, DTOs, services, controllers, or database modeling for the AeroGest
  airport management system. Includes billing engine logic, multi-tenancy patterns,
  and master data CRUD generation. Do NOT use for frontend React development.
---

# AeroGest Backend Development

Guía de desarrollo backend para el sistema de administración aeroportuaria multi-aeropuerto.

---

## 1. ARQUITECTURA DE MÓDULOS

Cada módulo NestJS sigue esta estructura:

```
modulo/
├── dto/
│   ├── create-entidad.dto.ts
│   └── update-entidad.dto.ts
├── modulo.service.ts
├── modulo.controller.ts
└── modulo.module.ts
```

### Patrón de Service

```typescript
@Injectable()
export class EntidadService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { skip?: number; take?: number }) {
    return this.prisma.entidad.findMany({
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.entidad.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Entidad no encontrada');
    return record;
  }

  async create(dto: CreateEntidadDto) {
    // validaciones de negocio aquí
    return this.prisma.entidad.create({ data: dto });
  }

  async update(id: number, dto: UpdateEntidadDto) {
    await this.findOne(id); // verifica existencia
    return this.prisma.entidad.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    // verificar dependencias antes de eliminar
    return this.prisma.entidad.delete({ where: { id } });
  }
}
```

### Patrón de Controller

```typescript
@ApiTags('Entidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('entidad')
export class EntidadController {
  constructor(private readonly service: EntidadService) {}

  @Get()
  @ApiOperation({ summary: 'Listar' })
  @ApiQuery({ name: 'skip', required: false })
  async findAll(@Query('skip') skip?: string) { ... }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) { ... }

  @Post()
  @ApiOperation({ summary: 'Crear' })
  async create(@Body() dto: CreateEntidadDto) { ... }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEntidadDto) { ... }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar' })
  async remove(@Param('id', ParseIntPipe) id: number) { ... }
}
```

---

## 2. CONVENCIONES PRISMA

### Nuevos modelos

```prisma
model Entidad {
  id        Int      @id @default(autoincrement())
  codigo    String   @db.VarChar(25)
  nombre    String   @db.VarChar(100)
  activo    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([codigo])
  @@map("entidades")
}
```

### Campos FK

```prisma
model Ejemplo {
  id          Int    @id @default(autoincrement())
  idAeropuerto Int   // FK siempre con prefijo "id"
  // ...
}
```

### Nombres de tabla

Siempre en snake_case plural. NO usar prefijos legacy (Mae, Cls, Frm, Rpt).

---

## 3. VALIDACIONES COMUNES

### Unicidad de código

```typescript
const existente = await this.prisma.entidad.findUnique({ where: { codigo: dto.codigo } });
if (existente) throw new BadRequestException(`El código '${dto.codigo}' ya existe`);
```

### Protección de eliminación

```typescript
async remove(id: number) {
  const dependencias = await this.prisma.entidadHija.findFirst({ where: { idEntidad: id } });
  if (dependencias) throw new BadRequestException('No se puede eliminar: tiene dependencias asociadas');
  return this.prisma.entidad.delete({ where: { id } });
}
```

### Soft delete

```typescript
async remove(id: number) {
  await this.findOne(id);
  return this.prisma.entidad.update({ where: { id }, data: { activo: false } });
}
```

---

## 4. FILTROS POR QUERY PARAMS

```typescript
@Get()
@ApiQuery({ name: 'activo', required: false })
@ApiQuery({ name: 'codigo', required: false })
async findAll(
  @Query('activo') activo?: string,
  @Query('codigo') codigo?: string,
) {
  const where: any = {};
  if (activo !== undefined) where.activo = activo === 'true';
  if (codigo) where.codigo = codigo;
  return this.service.findAll(where);
}
```

En el service:

```typescript
async findAll(where?: any) {
  return this.prisma.entidad.findMany({
    where,
    orderBy: { id: 'asc' },
  });
}
```

---

## 5. DTOs CON VALIDACIÓN

```typescript
import { IsString, IsInt, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntidadDto {
  @ApiProperty({ description: 'Código único' })
  @IsString()
  codigo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
```

---

## 6. MULTI-TENENCIA POR AEROPUERTO

Todas las entidades que pertenecen a un aeropuerto deben tener `idAeropuerto` como FK y filtrar por él:

```typescript
// Controller
@Get()
@ApiQuery({ name: 'idAeropuerto', required: false })
async findAll(@Query('idAeropuerto') idAeropuerto?: string) {
  const where: any = {};
  if (idAeropuerto) where.idAeropuerto = parseInt(idAeropuerto, 10);
  return this.service.findAll(where);
}
```

---

## 7. ENTIDADES CON ID BIGINT

Para modelos con `BigInt` en Prisma, usar `Number()` normal en TypeScript:

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}
```

---

## 8. COMMON PITFALLS

| Error | Causa | Solución |
|---|---|---|
| `Parameter 'x' implicitly has an 'any' type` | `.map((x) => ...)` sin tipo | `.map((x: Type) => ...)` |
| `Cannot find module './dto/...'` | DTO no exportado | Verificar `export class` en DTO |
| `Model does not exist on PrismaClient` | Schema no regenerado | Ejecutar `npx prisma generate` |
| `'activo' filter applied to model without activo` | Modelo no tiene campo `activo` | NO agregar `{ activo: true }` al where |
| `route conflict: /:id vs /accion` | Orden de rutas | Rutas fijas ANTES que `:id` |

---

## 9. COMANDOS FRECUENTES

```bash
# Regenerar Prisma client tras cambios en schema
cd backend && npx prisma generate

# Sincronizar schema con DB (dev)
cd backend && npx prisma db push

# Compilar backend
cd backend && npm run build

# Iniciar en dev
cd backend && npm run start:dev

# Ver schema en Prisma Studio
cd backend && npx prisma studio
```

---

*Skill generado para el proyecto AeroGest — 14 Junio 2026*
