import { useState } from "react";

const empty = { firstName: "", lastName: "", email: "", department: "", jobTitle: "", status: "active" };

export default function EmployeeForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(() => initialData ? { ...initialData } : empty);
  const [error, setError] = useState("");
  const editing = Boolean(initialData);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(form);
      if (!editing) setForm(empty);
    } catch (err) {
      setError(err.message);
    }
  }

  const fields = [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["email", "Work email"],
    ["department", "Department"],
    ["jobTitle", "Job title"]
  ];

  return (
    <section className="panel">
      <h2>{editing ? "Edit employee" : "Add employee"}</h2>
      <form className="employee-form" onSubmit={submit}>
        {fields.map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type={key === "email" ? "email" : "text"}
              value={form[key] || ""}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              required
            />
          </label>
        ))}
        <label>
          Employment status
          <select value={form.status || "active"} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="active">Active</option>
            <option value="on_leave">On leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">{editing ? "Save changes" : "Add employee"}</button>
          {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
