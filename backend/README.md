# Product Manager — REST API

REST API for a product management dashboard. Built as a portfolio piece to showcase a modern enterprise backend stack end-to-end.

## Stack

- **Java 21** · **Spring Boot 4** · **Spring Security 7**
- **Spring Data JPA** (Hibernate) with **Specifications** for dynamic filtering
- **JWT** (jjwt) — stateless authentication with roles (`ADMIN` / `VIEWER`)
- **Liquibase** — versioned, database-agnostic schema migrations
- **H2** (development, no Docker needed) and **PostgreSQL** (production)
- **JUnit 5** — integration tests
- Centralised error handling, input validation and configurable CORS

## Quick start (no Docker required)

```bash
./mvnw spring-boot:run
```

Starts on `http://localhost:8080` with an in-memory H2 database and seed data (48 products + 2 users). H2 console available at `http://localhost:8080/h2-console`.

### With PostgreSQL (production-like)

```bash
docker compose up -d
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

## Demo credentials

| Username | Password   | Role   | Access              |
|----------|------------|--------|---------------------|
| `admin`  | `admin123` | ADMIN  | Read + write        |
| `viewer` | `viewer123`| VIEWER | Read-only           |

## Endpoints

| Method | Path                      | Role        | Description                                                     |
|--------|---------------------------|-------------|-----------------------------------------------------------------|
| POST   | `/api/auth/login`         | public      | Returns a signed JWT                                            |
| GET    | `/api/products`           | authenticated | Paginated list with filters (`search`, `category`, `active`, `sort`) |
| GET    | `/api/products/{id}`      | authenticated | Product detail                                                  |
| GET    | `/api/products/dashboard` | authenticated | Aggregated metrics                                              |
| POST   | `/api/products`           | ADMIN       | Create product                                                  |
| PUT    | `/api/products/{id}`      | ADMIN       | Update product                                                  |
| DELETE | `/api/products/{id}`      | ADMIN       | Delete product                                                  |

Ready-to-use request examples in [`requests.http`](requests.http).

### curl example

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r .token)

curl "http://localhost:8080/api/products?size=5&category=Electronics" \
  -H "Authorization: Bearer $TOKEN"
```

## Tests

```bash
./mvnw test
```

11 tests covering two critical layers:

- **`ProductServiceTest`** — business logic: create, read, duplicate SKU, not found, search with filters and dashboard aggregates.
- **`SecurityIntegrationTest`** (MockMvc) — end-to-end security: login + JWT, invalid credentials (401), missing token (401), `VIEWER` write attempt (403) and `ADMIN` authorised create (201).

## Architecture

Packages organised by **feature** (`auth`, `product`, `user`, `security`, `common`):

- `security/` — `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`, custom 401 entry point.
- `product/` — entity, repository (`JpaSpecificationExecutor`), specifications, service, controller, DTOs.
- `common/` — `PageResponse`, `ApiError`, custom exceptions and `@RestControllerAdvice`.

Key principles: layered architecture (controller → service → repository), immutable DTOs (`record`), Liquibase-owned schema (Hibernate in `validate` mode), method-level security (`@PreAuthorize`) and consistent error responses.
