import { z } from "zod";
import { pool } from "../config/db.js";

const employeeSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  department: z.string().trim().min(1).max(100),
  jobTitle: z.string().trim().min(1).max(120),
  status: z.enum(["active", "on_leave", "inactive"]).optional()
});

const employeeColumns = 'id, first_name AS "firstName", last_name AS "lastName", email, department, job_title AS "jobTitle", status';

function validId(value) {
  return /^\d+$/.test(value) && Number(value) > 0;
}

export async function listEmployees(_req, res) {
  const result = await pool.query(`SELECT ${employeeColumns} FROM employees ORDER BY id DESC LIMIT 200`);
  res.json(result.rows);
}

export async function myEmployee(req, res) {
  const result = await pool.query(
    'SELECT e.id, e.first_name AS "firstName", e.last_name AS "lastName", e.email, e.department, e.job_title AS "jobTitle", e.status FROM app_users u JOIN employees e ON e.id = u.employee_id WHERE u.id = $1',
    [req.auth.sub]
  );
  if (!result.rowCount) return res.status(404).json({ error: "No employee profile is linked to this account." });
  res.json(result.rows[0]);
}

export async function createEmployee(req, res) {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid employee data.", details: parsed.error.issues });

  const employee = parsed.data;
  try {
    const result = await pool.query(
      `INSERT INTO employees (first_name, last_name, email, department, job_title, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${employeeColumns}`,
      [employee.firstName, employee.lastName, employee.email.toLowerCase(), employee.department, employee.jobTitle, employee.status || "active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "An employee with this email already exists." });
    throw error;
  }
}

export async function updateEmployee(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Employee ID must be a positive integer." });
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid employee data.", details: parsed.error.issues });

  const employee = parsed.data;
  try {
    const result = await pool.query(
      `UPDATE employees SET first_name = $1, last_name = $2, email = $3, department = $4, job_title = $5, status = $6
       WHERE id = $7 RETURNING ${employeeColumns}`,
      [employee.firstName, employee.lastName, employee.email.toLowerCase(), employee.department, employee.jobTitle, employee.status || "active", req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Employee not found." });
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "An employee with this email already exists." });
    throw error;
  }
}

export async function deleteEmployee(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Employee ID must be a positive integer." });
  const result = await pool.query("DELETE FROM employees WHERE id = $1 RETURNING id", [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Employee not found." });
  res.status(204).end();
}
