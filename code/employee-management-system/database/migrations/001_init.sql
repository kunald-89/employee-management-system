CREATE TABLE IF NOT EXISTS employees (
 id BIGSERIAL PRIMARY KEY,
 first_name TEXT NOT NULL,
 last_name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 department TEXT NOT NULL,
 job_title TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_leave','inactive')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS app_users (
 id BIGSERIAL PRIMARY KEY,
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK (role IN ('admin','hr','employee')),
 employee_id BIGINT UNIQUE REFERENCES employees(id) ON DELETE SET NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);