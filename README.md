# Product Manager

Panel de administración (product-manager) de gestión comercial, construido como pieza de
portafolio para demostrar un stack **full-stack empresarial** de extremo a extremo.

> Caso de uso universal: gestión de catálogo de productos con control de stock,
> autenticación por roles y un dashboard de métricas — el tipo de aplicación interna
> que necesita prácticamente cualquier empresa.

## Stack

| Capa      | Tecnología |
|-----------|------------|
| Backend   | Java 21 · Spring Boot 4 · Spring Security 7 (JWT) · Spring Data JPA · Liquibase · PostgreSQL / H2 |
| Frontend  | Angular 20 · Angular Material *(en construcción)* |
| Calidad   | JUnit 5 · validación · manejo de errores centralizado · CORS |

## Estructura

```
product-manager/
├── backend/     API REST (Spring Boot)  ← ✅ funcional y probado
└── frontend/    SPA (Angular)           ← 🚧 siguiente fase
```

## Funcionalidades

- 🔐 **Autenticación JWT** con roles `ADMIN` (lectura/escritura) y `VIEWER` (solo lectura).
- 📦 **CRUD de productos** con búsqueda, filtros por categoría/estado, paginación y ordenación.
- 📊 **Dashboard** con métricas agregadas (total, activos, stock bajo, valor de inventario, reparto por categoría).
- ✅ Validación de entrada, errores HTTP consistentes y control de acceso por método.

## Cómo ejecutar

Ver [`backend/README.md`](backend/README.md). Arranque en un comando (sin Docker):

```bash
cd backend && ./mvnw spring-boot:run
```
