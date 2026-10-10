# 🧪 EMS Testing Guide

This project uses Node.js' built-in test runner for API integration checks. No additional test framework is required.

## Test coverage

The API integration test checks:

- API health and PostgreSQL connectivity.
- Protected employee directory access (missing JWT is rejected).
- Invalid and valid administrator login.
- Employee request validation.
- Employee creation and duplicate-email handling.
- Employee directory listing.
- Employee update and invalid status handling.
- Employee deletion and not-found handling.

The integration test uses a unique email address and removes the test employee after the test. Run it only against a local development/test database, never a production database.

## 🪟 Run on Windows 11

### 1. Start the application

Open PowerShell in the application directory:

```powershell
cd code/employee-management-system
Copy-Item .env.example .env
```

Edit `.env` and set strong local values for `POSTGRES_PASSWORD`, `JWT_SECRET` (at least 32 characters), and `BOOTSTRAP_ADMIN_PASSWORD` (at least 14 characters).

Start the services:

```powershell
docker compose up -d --build
docker compose ps
```

Wait until the database and backend containers are healthy/running.

### 2. Install backend dependencies and run checks

Open a second PowerShell terminal, then run:

```powershell
cd code/employee-management-system/backend
npm install
npm run check
npm run test:api
```

The test reads the project-level `.env` file automatically and sends requests to `http://localhost:5000`. To use another API address, set `$env:API_URL` before running the test.

### 3. Build the frontend

```powershell
cd ..\frontend
npm install
npm run build
```

A successful Vite build creates the `dist` folder.

### 4. Stop the application

Return to the application root:

```powershell
cd .. 
docker compose down
```

To remove the local database volume and all local database records as well (destructive):

```powershell
docker compose down -v
```

## 🤖 Jenkins

The Jenkinsfile runs backend checks, builds the frontend and Docker images, starts the Compose stack, and runs the API integration suite inside the backend container.

Configure the Jenkins agent with Docker Engine and Docker Compose. Supply the application's required Compose environment variables securely through Jenkins credentials or a protected `.env` file in the workspace. The pipeline tears down its Compose stack and volume after the run.

## Current limitations

- These are API integration checks, not a complete unit-test suite.
- Employee-role access tests and browser-based frontend tests are planned.
- The test suite requires a running API and a reachable development/test PostgreSQL database.
- Do not run the test suite against production data.
