# Flujo de Trabajo para Desarrollo AeroGest

## 1. Schema Change
```bash
cd backend
# Editar prisma/schema.prisma
npx prisma generate   # regenerar cliente
npx prisma db push    # sync DB (dev only)
```

## 2. Nuevo Módulo
```bash
# Crear estructura
mkdir -p src/modulo/dto
touch src/modulo/modulo.module.ts
touch src/modulo/modulo.service.ts
touch src/modulo/modulo.controller.ts

# DTOs
touch src/modulo/dto/create-entidad.dto.ts
touch src/modulo/dto/update-entidad.dto.ts

# Registrar en app.module.ts
```

## 3. Build & Verify
```bash
cd backend && npm run build
# Sin errores = listo
```

## 4. Prisma Studio (explorar datos)
```bash
cd backend && npx prisma studio
```

## 5. Run Dev Server
```bash
cd backend && npm run start:dev
```
