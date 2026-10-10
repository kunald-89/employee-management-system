import "dotenv/config";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";

// Load the project-level .env when running on a Windows development machine.
// In Docker/Jenkins, Compose injects these values into the backend container.
const here = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(here, "../../.env") });

const apiBase = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
const adminEmail = process.env.EMS_TEST_ADMIN_EMAIL || process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.EMS_TEST_ADMIN_PASSWORD || process.env.BOOTSTRAP_ADMIN_PASSWORD;

async function api(path, { token, ...options } = {}) {
  const response = await fetch(apiBase + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(options.headers || {})
    }
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  return { response, body };
}

test("EMS API integration: health, authentication and employee CRUD", async () => {
  assert.ok(adminEmail, "Set BOOTSTRAP_ADMIN_EMAIL in the project .env file.");
  assert.ok(adminPassword, "Set BOOTSTRAP_ADMIN_PASSWORD in the project .env file.");

  const health = await api("/api/health");
  assert.equal(health.response.status, 200, "Health endpoint should return HTTP 200.");
  assert.equal(health.body?.status, "ok");
  assert.equal(health.body?.database, "connected");

  const noToken = await api("/api/employees");
  assert.equal(noToken.response.status, 401, "Employee directory must require authentication.");

  const invalidLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: "definitely-wrong-password" })
  });
  assert.equal(invalidLogin.response.status, 401, "Invalid credentials must be rejected.");

  const login = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  assert.equal(login.response.status, 200, "Bootstrap admin login should succeed.");
  assert.ok(login.body?.token, "Login response should contain a JWT.");
  assert.equal(login.body?.user?.role, "admin");
  const token = login.body.token;

  const invalidEmployee = await api("/api/employees", {
    token,
    method: "POST",
    body: JSON.stringify({ firstName: "", email: "not-an-email" })
  });
  assert.equal(invalidEmployee.response.status, 400, "Invalid employee input must be rejected.");

  const uniqueEmail = "ems-test-" + randomUUID() + "@example.test";
  let employeeId;
  try {
    const created = await api("/api/employees", {
      token,
      method: "POST",
      body: JSON.stringify({
        firstName: "API",
        lastName: "Test",
        email: uniqueEmail,
        department: "Quality Assurance",
        jobTitle: "Test Engineer",
        status: "active"
      })
    });
    assert.equal(created.response.status, 201, "Valid employee should be created.");
    employeeId = created.body?.id;
    assert.ok(employeeId, "Create response should include the employee ID.");

    const duplicate = await api("/api/employees", {
      token,
      method: "POST",
      body: JSON.stringify({
        firstName: "Duplicate",
        lastName: "Test",
        email: uniqueEmail,
        department: "Quality Assurance",
        jobTitle: "Test Engineer",
        status: "active"
      })
    });
    assert.equal(duplicate.response.status, 409, "Duplicate email should return HTTP 409.");

    const directory = await api("/api/employees", { token });
    assert.equal(directory.response.status, 200);
    assert.ok(directory.body.some((employee) => employee.id === employeeId));

    const updated = await api("/api/employees/" + employeeId, {
      token,
      method: "PUT",
      body: JSON.stringify({
        firstName: "API",
        lastName: "Updated",
        email: uniqueEmail,
        department: "Engineering",
        jobTitle: "Senior Test Engineer",
        status: "on_leave"
      })
    });
    assert.equal(updated.response.status, 200, "Employee update should succeed.");
    assert.equal(updated.body?.lastName, "Updated");
    assert.equal(updated.body?.department, "Engineering");
    assert.equal(updated.body?.status, "on_leave");

    const invalidUpdate = await api("/api/employees/" + employeeId, {
      token,
      method: "PUT",
      body: JSON.stringify({
        firstName: "API",
        lastName: "Updated",
        email: uniqueEmail,
        department: "Engineering",
        jobTitle: "Test Engineer",
        status: "unknown"
      })
    });
    assert.equal(invalidUpdate.response.status, 400, "Invalid status must be rejected.");

    const deleted = await api("/api/employees/" + employeeId, { token, method: "DELETE" });
    assert.equal(deleted.response.status, 204, "Employee delete should return HTTP 204.");
    employeeId = undefined;

    const missing = await api("/api/employees/" + created.body.id, { token, method: "DELETE" });
    assert.equal(missing.response.status, 404, "Deleting a missing employee should return HTTP 404.");
  } finally {
    if (employeeId) {
      await api("/api/employees/" + employeeId, { token, method: "DELETE" }).catch(() => {});
    }
  }

  console.log("EMS API integration tests passed.");
}, { timeout: 60_000 });
