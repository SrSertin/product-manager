# Backoffice Demo — API (backend)

API REST de un backoffice de gestión comercial. Construida como pieza de portafolio
para demostrar un stack empresarial moderno de extremo a extremo.

## Stack

- **Java 21** · **Spring Boot 4** · **Spring Security 7**
- **Spring Data JPA** (Hibernate) con **Specifications** para filtros dinámicos
- **JWT** (jjwt) — autenticación stateless con roles (`ADMIN` / `VIEWER`)
- **Liquibase** — esquema versionado, agnóstico de base de datos
- **H2** (desarrollo, sin Docker) y **PostgreSQL** (producción)
- **JUnit 5** — tests de integración
- Manejo de errores centralizado, validación de entrada y CORS configurable

## Arranque rápido (sin Docker, 1 comando)

```bash
./mvnw spring-boot:run
```

Levanta en `http://localhost:8080` con base de datos H2 en memoria y datos de ejemplo
(48 productos + 2 usuarios). Consola H2 en `http://localhost:8080/h2-console`.

### Con PostgreSQL (producción)

```bash
docker compose up -d                       # arranca Postgres
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

## Usuarios de ejemplo

| Usuario  | Contraseña  | Rol    | Permisos               |
|----------|-------------|--------|------------------------|
| `admin`  | `admin123`  | ADMIN  | Lectura + escritura    |
| `viewer` | `viewer123` | VIEWER | Solo lectura           |

## Endpoints

| Método | Ruta                         | Rol      | Descripción                          |
|--------|------------------------------|----------|--------------------------------------|
| POST   | `/api/auth/login`            | público  | Devuelve un JWT                      |
| GET    | `/api/products`              | cualquiera autenticado | Listado paginado + filtros (`search`, `category`, `active`, `sort`) |
| GET    | `/api/products/{id}`         | autenticado | Detalle                           |
| GET    | `/api/products/dashboard`    | autenticado | Métricas agregadas                |
| POST   | `/api/products`              | ADMIN    | Crear                                |
| PUT    | `/api/products/{id}`         | ADMIN    | Actualizar                           |
| DELETE | `/api/products/{id}`         | ADMIN    | Eliminar                             |

Ejemplos listos para usar en [`requests.http`](requests.http).

### Ejemplo con curl

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r .token)

curl "http://localhost:8080/api/products?size=5&category=Electrónica" \
  -H "Authorization: Bearer $TOKEN"
```

## Tests

```bash
./mvnw test
```

11 tests que cubren las dos capas críticas:

- **`ProductServiceTest`** — lógica de negocio: alta, lectura, SKU duplicado, no encontrado, búsqueda con filtros y agregados del dashboard.
- **`SecurityIntegrationTest`** (MockMvc) — seguridad de extremo a extremo: login + JWT, credenciales inválidas (401), acceso sin token (401), `VIEWER` sin permiso de escritura (403) y `ADMIN` autorizado (201).

## Arquitectura

Paquetes organizados por **feature** (`auth`, `product`, `user`, `security`, `common`):

- `security/` — `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`, entry point 401.
- `product/` — entidad, repositorio (`JpaSpecificationExecutor`), specifications, servicio, controlador, DTOs.
- `common/` — `PageResponse`, `ApiError`, excepciones y `@RestControllerAdvice` global.

Principios aplicados: capas separadas (controlador → servicio → repositorio), DTOs
inmutables (`record`), esquema gobernado por Liquibase (Hibernate en modo `validate`),
seguridad por método (`@PreAuthorize`) y respuestas de error consistentes.
