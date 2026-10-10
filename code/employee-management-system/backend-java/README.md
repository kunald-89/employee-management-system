# EMS Java API

Spring Boot backend foundation for the Employee Management System.

## Requirements
- Java 21
- Maven 3.9+
- Docker Desktop (for the local PostgreSQL container)

## Start PostgreSQL on Windows
From the `code/employee-management-system` folder, make sure the existing `.env` file has the database values, then run:

```powershell
docker compose up -d db
```

The Compose file publishes PostgreSQL only on `127.0.0.1:5432` for local development.

## Configure and run
Open a new PowerShell window, navigate to this folder, and set the connection values. Use the same password configured as `POSTGRES_PASSWORD` in the project-root `.env` file.

```powershell
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/ems"
$env:DB_USERNAME = "ems_app"
$env:DB_PASSWORD = "your-local-password"
$env:FRONTEND_ORIGIN = "http://localhost:5173"
mvn spring-boot:run
```

Health check: http://localhost:8080/api/health

## Employee API
- GET /api/employees
- GET /api/employees/{id}
- POST /api/employees
- PUT /api/employees/{id}
- DELETE /api/employees/{id}

Example request:

```json
{
  "employeeCode": "EMP-1001",
  "firstName": "Aarav",
  "lastName": "Shah",
  "email": "aarav@example.com",
  "department": "Engineering",
  "designation": "Software Engineer",
  "status": "ACTIVE",
  "joiningDate": "2026-10-01"
}
```

## Important migration status
This is the first Java API foundation. The current employee endpoints and React CRUD screen are intended for local development only. The temporary Spring Security configuration permits requests so the initial UI can be connected; **do not deploy this version**. JWT authentication, ADMIN / HR / EMPLOYEE authorization, database migrations, integration tests, and Docker/Jenkins integration are still to be implemented.

The existing Node.js backend remains in the repository and the default `main` branch is unchanged. The Java migration is being developed on `feature/java-spring-react-foundation` until it is complete and verified.
