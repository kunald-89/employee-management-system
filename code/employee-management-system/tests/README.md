# Tests

The Jenkins pipeline currently performs backend syntax checks, a frontend production build and a Docker image build.

Add automated unit and integration tests before production use. Recommended coverage:
- Authentication: invalid credentials, expired JWT and missing token.
- Authorization: employee cannot list the HR directory or create records.
- Employee validation: duplicate email and invalid status.
- Database: migration from a clean PostgreSQL instance.
- Frontend: login, role-based screens, form validation and API error handling.

Run the current checks:
- cd backend && npm install && npm run check
- cd frontend && npm install && npm run build
