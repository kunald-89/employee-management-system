# Employee Management System

A learning-focused full-stack EMS starter: React, Express, PostgreSQL, JWT authentication, role-based access control, Docker Compose and Jenkins CI.

## Run locally
1. Copy .env.example to .env and replace every placeholder.
2. Run: docker compose up --build
3. Open http://localhost:5173. API health: http://localhost:5000/api/health
4. Stop: docker compose down

Never commit .env, secrets, real HR records or Terraform state.

## Access model
- admin/hr: list and create employee records.
- employee: read only the profile linked to their account.

## Important
This is not production-ready HR software. Add password reset, account provisioning, audit logging, full CRUD, automated integration tests, backups, monitoring and privacy controls before real use. Kubernetes and Terraform are deployment templates only; no AWS infrastructure has been provisioned. Replace ECR image placeholders before deploying.
