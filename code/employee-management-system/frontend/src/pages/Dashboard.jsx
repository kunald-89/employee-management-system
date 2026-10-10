import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import Header from "../components/Header.jsx";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
async function request(path, options = {}) {
  const { token, ...rest } = options;
  const response = await fetch(API + path, { ...rest, headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}), ...(rest.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
export default function Dashboard() {
  const [token,setToken]=useState(sessionStorage.getItem("ems_token")||"");
  const [user,setUser]=useState(null),[employees,setEmployees]=useState([]),[error,setError]=useState("");
  async function load(t) {
    const me=await request("/auth/me",{token:t}); setUser(me);
    const rows=["admin","hr"].includes(me.role) ? await request("/employees",{token:t}) : await request("/employees/me",{token:t}).then(x=>[x]).catch(()=>[]);
    setEmployees(rows);
  }
  useEffect(()=>{ if(token) load(token).catch(e=>{setError(e.message);sessionStorage.removeItem("ems_token");setToken("");}); },[token]);
  async function signIn(credentials) {
    const result=await request("/auth/login",{method:"POST",body:JSON.stringify(credentials)});
    sessionStorage.setItem("ems_token",result.token);setUser(result.user);setToken(result.token);
  }
  async function addEmployee(employee) { await request("/employees",{token,method:"POST",body:JSON.stringify(employee)}); await load(token); }
  function signOut(){sessionStorage.removeItem("ems_token");setToken("");setUser(null);setEmployees([]);}
  if(!token||!user) return <LoginForm onSubmit={signIn} error={error}/>;
  return <main className="shell"><Header user={user} onSignOut={signOut}/>
    <section className="hero"><p className="eyebrow">PEOPLE OPERATIONS</p><h1>Employee Management System</h1><p>Manage employee information with role-based access.</p></section>
    <section className="summary"><article><span>Employees visible to you</span><strong>{employees.length}</strong></article><article><span>Your role</span><strong>{user.role.toUpperCase()}</strong></article><article><span>API protection</span><strong>JWT + RBAC</strong></article></section>
    {error&&<p className="error">{error}</p>}
    {["admin","hr"].includes(user.role)&&<EmployeeForm onSubmit={addEmployee}/>}
    <EmployeeTable employees={employees}/>
  </main>;
}