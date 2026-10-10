import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const TODAY_LABEL = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();
const EMPTY_FORM = {
  employeeCode: "", firstName: "", lastName: "", email: "",
  department: "Engineering", designation: "", status: "ACTIVE", joiningDate: ""
};

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || body.message || body.error || "Something went wrong.");
  return body;
}

function initials(employee) {
  return `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase();
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    setError("");
    try {
      setEmployees(await api("/employees"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  const visibleEmployees = useMemo(() => employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const search = query.toLowerCase();
    const matchesQuery = [fullName, employee.email, employee.employeeCode, employee.department, employee.designation]
      .some((value) => (value || "").toLowerCase().includes(search));
    return matchesQuery && (statusFilter === "ALL" || employee.status === statusFilter);
  }), [employees, query, statusFilter]);

  const activeCount = employees.filter((employee) => employee.status === "ACTIVE").length;
  const departments = new Set(employees.map((employee) => employee.department).filter(Boolean)).size;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(employee) {
    setEditing(employee);
    setForm({
      employeeCode: employee.employeeCode || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      department: employee.department || "",
      designation: employee.designation || "",
      status: employee.status || "ACTIVE",
      joiningDate: employee.joiningDate || ""
    });
    setModalOpen(true);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api(editing ? `/employees/${editing.id}` : "/employees", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({ ...form, joiningDate: form.joiningDate || null })
      });
      setModalOpen(false);
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeEmployee(employee) {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) return;
    try {
      await api(`/employees/${employee.id}`, { method: "DELETE" });
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home"><span className="brand-mark">P</span><span>people<span className="brand-light">flow</span><small>WORKFORCE PLATFORM</small></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-item active" href="#overview"><span>▦</span> Overview</a>
          <a className="nav-item" href="#employees"><span>♙</span> Employees <b>{employees.length}</b></a>
          <a className="nav-item disabled" href="#attendance"><span>◷</span> Attendance <small>SOON</small></a>
          <a className="nav-item disabled" href="#leave"><span>▤</span> Leave management <small>SOON</small></a>
          <a className="nav-item disabled" href="#reports"><span>▥</span> Reports <small>SOON</small></a>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">✦</span><strong>Need a hand?</strong><p>Find your way around PeopleFlow.</p><a href="mailto:support@example.com">Visit help centre ↗</a></div><div className="profile-mini"><div className="avatar avatar-dark">KD</div><div><strong>Kunal Dange</strong><small>Workspace owner</small></div><span className="more">•••</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="top-avatar">KD</div></div></header>
        <div className="content">
          <section className="welcome-row"><div><div className="date-label">{TODAY_LABEL}</div><h1>Good morning, Kunal <span>✦</span></h1><p>Here’s what’s happening with your team today.</p></div><button className="primary-button" onClick={openCreate}><span>＋</span> Add employee</button></section>

          {error && <div className="alert" role="alert"><span>!</span>{error}<button onClick={() => setError("")}>×</button></div>}

          <section className="metric-grid">
            <article className="metric-card"><div className="metric-top"><span>Total employees</span><span className="metric-icon purple">♙</span></div><strong>{employees.length}</strong><div className="metric-foot"><span className="metric-neutral">People in your workspace</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Active employees</span><span className="metric-icon green">✓</span></div><strong>{activeCount}</strong><div className="metric-foot"><span className="metric-positive">● Active workforce</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Departments</span><span className="metric-icon orange">▦</span></div><strong>{departments}</strong><div className="metric-foot"><span className="metric-neutral">Across your organisation</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Inactive employees</span><span className="metric-icon blue">◷</span></div><strong>{employees.length - activeCount}</strong><div className="metric-foot"><span className="metric-neutral">Not currently active</span></div></article>
          </section>

          <section className="panel employee-panel" id="employees">
            <div className="panel-heading"><div><h2>All employees</h2><p>Manage your people and their information.</p></div><button className="outline-button" onClick={loadEmployees}>↻ <span>Refresh</span></button></div>
            <div className="toolbar"><label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, department..." /></label><div className="filter-wrap"><span>Show:</span><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="ALL">All employees</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div></div>
            <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>EMPLOYEE ID</th><th>DEPARTMENT</th><th>DESIGNATION</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
              {loading ? <tr><td colSpan="6" className="empty-state">Loading employees…</td></tr> : visibleEmployees.length === 0 ? <tr><td colSpan="6" className="empty-state"><span>♙</span><strong>No employees found</strong><small>Try changing your search or add a new employee.</small></td></tr> : visibleEmployees.map((employee) => <tr key={employee.id}><td><div className="employee-cell"><div className="avatar">{initials(employee)}</div><div><strong>{employee.firstName} {employee.lastName}</strong><small>{employee.email}</small></div></div></td><td className="code-cell">{employee.employeeCode}</td><td>{employee.department || "—"}</td><td>{employee.designation || "—"}</td><td><span className={`status-pill ${employee.status === "ACTIVE" ? "status-active" : "status-inactive"}`}><i />{employee.status}</span></td><td><div className="row-actions"><button onClick={() => openEdit(employee)} aria-label={`Edit ${employee.firstName}`}>Edit</button><button className="delete-action" onClick={() => removeEmployee(employee)} aria-label={`Delete ${employee.firstName}`}>Delete</button></div></td></tr>)}
            </tbody></table></div>
            <div className="table-footer"><span>Showing <strong>{visibleEmployees.length}</strong> of <strong>{employees.length}</strong> employees</span><span>PeopleFlow · Employee directory</span></div>
          </section>
          <footer className="page-footer">© 2026 PeopleFlow · Employee Management System <span>Made for better workdays.</span></footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="employee-modal-title"><div className="modal-heading"><div><span className="modal-kicker">PEOPLE DIRECTORY</span><h2 id="employee-modal-title">{editing ? "Edit employee" : "Add new employee"}</h2><p>Enter the employee’s details below.</p></div><button className="close-button" onClick={() => setModalOpen(false)} aria-label="Close">×</button></div><form onSubmit={submit}><div className="form-grid">
        <label>Employee ID<input required maxLength="30" value={form.employeeCode} onChange={(e) => setForm({...form, employeeCode:e.target.value})} placeholder="EMP-1001" /></label>
        <label>First name<input required maxLength="80" value={form.firstName} onChange={(e) => setForm({...form, firstName:e.target.value})} placeholder="First name" /></label>
        <label>Last name<input required maxLength="80" value={form.lastName} onChange={(e) => setForm({...form, lastName:e.target.value})} placeholder="Last name" /></label>
        <label>Work email<input required type="email" maxLength="180" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} placeholder="name@company.com" /></label>
        <label>Department<select value={form.department} onChange={(e) => setForm({...form, department:e.target.value})}><option>Engineering</option><option>Human Resources</option><option>Finance</option><option>Sales</option><option>Marketing</option><option>Operations</option></select></label>
        <label>Designation<input maxLength="100" value={form.designation} onChange={(e) => setForm({...form, designation:e.target.value})} placeholder="e.g. Software Engineer" /></label>
        <label>Joining date<input type="date" value={form.joiningDate} onChange={(e) => setForm({...form, joiningDate:e.target.value})} /></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({...form, status:e.target.value})}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label>
      </div><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add employee"}</button></div></form></section></div>}
    </div>
  );
}
