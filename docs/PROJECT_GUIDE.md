# Project Guide — PeopleDesk EMS

## What is this project?
An Employee Management System starter used to learn full-stack development and DevOps. It combines a web interface, backend API, database, authentication, and an optional employee Q&A chatbot.

## Main technologies
- React + Vite: the web page employees use.
- Node.js + Express: receives API requests and applies business rules.
- PostgreSQL: stores application records.
- JWT + RBAC: signs users in and controls access by role.
- Docker Compose: runs the services locally as containers.
- Jenkins: example CI pipeline.
- Kubernetes, Terraform, Ansible, and AWS: learning/deployment documentation and future steps.

## Start locally
1. Extract the project ZIP.
2. Copy `.env.example` to `.env`.
3. Replace every placeholder secret with a strong local value. Never commit `.env`.
4. Run `docker compose up --build` from the project root.
5. Open `http://localhost:5173`.
6. Check `http://localhost:5000/api/health`.
7. Sign in with the bootstrap admin credentials configured in your local `.env`.

To stop: press Ctrl+C, then run `docker compose down`. Using `docker compose down -v` deletes the local database volume.

## Important limitations
This is a learning starter, not a production-certified HR system. Employee-account linking, complete edit/delete flows, password reset, audit logging, refresh-token handling, and comprehensive automated tests still need implementation. Do not use real employee data before a security review.
