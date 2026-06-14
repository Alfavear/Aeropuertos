# ✈️ AeroNova (Zeus Aeropuertos)

Plataforma empresarial de próxima generación para la gestión y administración de **concesiones aeroportuarias multi-tenant**.

Este proyecto es una reingeniería completa del sistema legacy "Zeus Aeropuertos", diseñado desde cero con una arquitectura moderna para soportar altas cargas transaccionales, facturación aeronáutica/comercial y trazabilidad operativa.

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto está dividido en dos aplicaciones principales bajo un esquema *monorepo ligero*:

### 🛡️ Backend (API REST)
*   **Framework:** [NestJS 11](https://nestjs.com/) (Node.js)
*   **Lenguaje:** TypeScript
*   **ORM:** [Prisma 6](https://www.prisma.io/)
*   **Base de Datos:** PostgreSQL 16
*   **Autenticación:** JWT + Passport + Bcrypt

### 🎨 Frontend (SPA)
*   **Librería:** [React 19](https://react.dev/)
*   **Bundler:** [Vite 6](https://vitejs.dev/)
*   **Lenguaje:** TypeScript
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Estado Global:** Zustand
*   **Formularios:** React Hook Form + Zod

---

## 📂 Estructura del Proyecto

```text
/
├── backend/          # Código fuente del servidor NestJS y configuración Prisma
├── frontend/         # Código fuente de la interfaz React y componentes de UI
├── database/         # Scripts SQL heredados y de migración (histórico)
├── docs/             # Documentación extendida y listados de tablas
├── bitacora.md       # Proyección completa y estado actual del proyecto
└── AGENTS.md         # 🤖 REGLAS ESTRICTAS PARA IA Y DESARROLLADORES
```

---

## 🚀 Guía de Inicio Rápido (Desarrollo Local)

Para correr el proyecto en tu máquina local, necesitarás **Node.js v20.17.0** o superior y acceso a una base de datos **PostgreSQL**.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Alfavear/Aeropuertos.git
cd Aeropuertos
```

### 2. Configurar el Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# (Asegúrate de configurar tu DATABASE_URL en el archivo .env)

# Sincronizar la base de datos de Prisma
npx prisma db push

# Iniciar el servidor en modo desarrollo
npm run start:dev
```
El servidor backend se iniciará, por defecto, en `http://localhost:3000`.

### 3. Configurar el Frontend
Abre una nueva terminal en la raíz del proyecto:
```bash
cd frontend
npm install

# Iniciar Vite
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`.

---

## 🤖 Directrices para Inteligencia Artificial

Este proyecto cuenta con soporte intensivo de herramientas de Inteligencia Artificial (Antigravity, Google Stitch, etc). 
Si eres una IA leyendo esto, **es obligatorio que leas el archivo [`AGENTS.md`](./AGENTS.md)** antes de proponer, modificar o generar cualquier línea de código. 

> *Nota: Todo el modelado de datos debe realizarse en español, sin prefijos legacy (Mae, Cls) y enfocado en arquitecturas multi-tenant.*

---
*Desarrollado con pasión para elevar las operaciones aeronáuticas al siguiente nivel.*
