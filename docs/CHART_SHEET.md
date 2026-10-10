# EMS Chart Sheet

## Component map

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React + Vite | Sign-in, employee directory, dashboard, chat UI |
| API | Node.js + Express | API endpoints and validation |
| Authentication | JWT + bcrypt | Token validation and password hashing |
| Authorization | Role-based access control | Limits access by role |
| Database | PostgreSQL | Employee and account records |
| Containers | Docker Compose | Local service orchestration |
| CI example | Jenkins | Example build/check pipeline |
| Future orchestration | AWS EKS | Planned target; not provisioned |

## Local endpoints

| Endpoint | Purpose |
|---|---|
| `http://localhost:5173` | Web frontend |
| `http://localhost:5000/api/health` | API health check |
| `POST /api/auth/login` | Sign in |
| `GET /api/auth/me` | Current account |
| `GET /api/employees` | Authorized HR/Admin directory |
| `GET /api/employees/me` | Own linked profile |
| `POST /api/employees` | Authorized HR/Admin create |
| `POST /api/chat` | Optional authenticated chatbot |

## Workflow summary

User → React/Vite → Express API → JWT/RBAC checks → PostgreSQL

Optional chatbot path: authenticated user → chatbot endpoint → approved server-side tool → role check → limited response.

## Cost awareness

Local Docker is the recommended starting point. AWS EKS, worker nodes, NAT Gateway, load balancers, RDS, ECR, logs, network transfer, domains, and OpenAI API calls can incur charges. Set budget alerts and review estimates before cloud work.
