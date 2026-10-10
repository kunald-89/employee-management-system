# EMS Java API

Spring Boot backend foundation for the Employee Management System.

## Requirements
- Java 21
- Maven 3.9+
- PostgreSQL 15+

## Configure
Set these environment variables before starting the application:

```powershell
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/ems"
$env:DB_USERNAME = "ems_app"
$env:DB_PASSWORD = "your-local-password"
$env:FRONTEND_ORIGIN = "http://localhost:5173"
```

## Run on Windows
From this folder:

```powershell
mvnw.cmd spring-boot:run
```

If Maven Wrapper has not yet been added, use:

```powershell
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

> Migration note: this is the first Java API foundation. Authentication, role-based authorization, database migrations, integration tests, and Docker/Jenkins integration are subsequent steps. The existing Node.js backend remains in the repository until the Java replacement is fully implemented and verified.
