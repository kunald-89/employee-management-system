import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import Header from "../components/Header.jsx";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";

const API = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const { token, ...rest } = options;
  const response = await fetch(API + path, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(rest.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function Dashboard() {
  const [token, setToken] = useState(sessionStorage.getItem("ems_token") || "");
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  async function load(currentToken) {
    const me = await request("/auth/me", { token: currentToken });
    setUser(me);
    const rows = ["admin", "hr"].includes(me.role)
      ? await request("/employees", { token: currentToken })
      : await request("/employees/me", { token: currentToken }).then((employee) => [employee]).catch(() => []);
    setEmployees(rows);
  }

  useEffect(() => {
    if (token) {
      load(token).catch((err) => {
        setError(err.message);
        sessionStorage.removeItem("ems_token");
        setToken("");
      });
    }
  }, [token]);

  async function signIn(credentials) {
    const result = await request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
    sessionStorage.setItem("ems_token", result.token);
    setUser(result.user);
    setToken(result.token);
    setError("");
  }

  async function addEmployee(employee) {
    await request("/employees", { token, method: "POST", body: JSON.stringify(employee) });
    await load(token);
  }

  async function updateEmployee(employee) {
    await request("/employees/" + editingEmployee.id, {
      token,
      method: "PUT",
      body: JSON.stringify(employee)
    });
    setEditingEmployee(null);
    await load(token);
  }

  async function deleteEmployee(employee) {
    const confirmed = window.confirm(`Delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`);
    if (!confirmed) return;
    setError("");
    try {
      await request("/employees/" + employee.id, { token, method: "DELETE" });
      await load(token);
      if (editingEmployee?.id === employee.id) setEditingEmployee(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function signOut() {
    sessionStorage.removeItem("ems_token");
    setToken("");
    setUser(null);
    setEmployees([]);
    setEditingEmployee(null);
  }

  if (!token || !user) return <LoginForm onSubmit={signIn} error={error} />;

  const canManage = ["admin", "hr"].includes(user.role);

  return (
    <main className="shell">
      <Header user={user} onSignOut={signOut} />
      <section className="hero">
        <p className="eyebrow">PEOPLE OPERATIONS</p>
        <h1>Employee Management System</h1>
        <p>Manage employee information with role-based access.</p>
      </section>
      <section className="summary">
        <article><span>Employees visible to you</span><strong>{employees.length}</strong></article>
        <article><span>Your role</span><strong>{user.role.toUpperCase()}</strong></article>
        <article><span>API protection</span><strong>JWT + RBAC</strong></article>
      </section>
      {error && <p className="error">{error}</p>}
      {canManage && (
        <EmployeeForm
          key={editingEmployee ? "edit-" + editingEmployee.id : "new"}
          initialData={editingEmployee || undefined}
          onSubmit={editingEmployee ? updateEmployee : addEmployee}
          onCancel={() => setEditingEmployee(null)}
        />
      )}
      <EmployeeTable
        employees={employees}
        canManage={canManage}
        onEdit={setEditingEmployee}
        onDelete={deleteEmployee}
      />
    </main>
  );
}
