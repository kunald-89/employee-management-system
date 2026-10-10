export default function EmployeeTable({employees}) {
  return <section className="panel"><h2>Employee directory</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Job title</th><th>Status</th></tr></thead>
    <tbody>{employees.map(e=><tr key={e.id}><td>{e.firstName} {e.lastName}</td><td>{e.email}</td><td>{e.department}</td><td>{e.jobTitle}</td><td>{e.status}</td></tr>)}
    {!employees.length&&<tr><td colSpan="5">No employee records available for your account.</td></tr>}</tbody></table></div></section>;
}