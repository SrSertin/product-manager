# Product Manager

A full-stack product management dashboard built as a portfolio piece to showcase an end-to-end enterprise stack.

> Universal use case: product catalogue management with stock control, role-based authentication and a metrics dashboard — the kind of internal tool virtually every business needs.

## Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 21 · Spring Boot 4 · Spring Security 7 (JWT) · Spring Data JPA · Liquibase · PostgreSQL / H2 |
| Frontend | Angular · Angular Material |
| Quality  | JUnit 5 · MockMvc integration tests · Bean Validation · centralised error handling |

## Structure

```
product-manager/
├── backend/    REST API (Spring Boot)  ← ✅ fully functional & tested
└── frontend/   SPA (Angular)           ← ✅ fully functional
```

## Features

- 🔐 **JWT authentication** with `ADMIN` (read/write) and `VIEWER` (read-only) roles.
- 📦 **Product CRUD** with real-time search, category/status filters, pagination and column sorting.
- 📊 **Dashboard** with aggregated KPIs (total, active, low stock, inventory value) and a category breakdown chart.
- ✅ Input validation, consistent HTTP error responses and method-level access control.

## Getting started

See [`backend/README.md`](backend/README.md). Runs with a single command — no Docker required:

```bash
cd backend && ./mvnw spring-boot:run
```

Then start the frontend:

```bash
cd frontend && npm install && npx -p @angular/cli@19 ng serve
```

Open `http://localhost:4200` and log in with `admin / admin123`.
