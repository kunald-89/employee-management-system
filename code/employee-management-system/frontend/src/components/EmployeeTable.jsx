export default function EmployeeTable({ employees, canManage = false, onEdit, onDelete }) {
  return (
    <section className="panel">
      <h2>Employee directory</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Department</th><th>Job title</th><th>Status</th>
              {canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.jobTitle}</td>
                <td>{employee.status.replace("_", " ")}</td>
                {canManage && (
                  <td className="actions">
                    <button type="button" className="secondary" onClick={() => onEdit(employee)}>Edit</button>
                    <button type="button" className="danger" onClick={() => onDelete(employee)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {!employees.length && <tr><td colSpan={canManage ? 6 : 5}>No employee records available for your account.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
