import { useState } from "react";
const empty={firstName:"",lastName:"",email:"",department:"",jobTitle:""};
export default function EmployeeForm({onSubmit}) {
  const [form,setForm]=useState(empty),[error,setError]=useState("");
  async function submit(e){e.preventDefault();setError("");try{await onSubmit(form);setForm(empty);}catch(err){setError(err.message);}}
  const fields=[["firstName","First name"],["lastName","Last name"],["email","Work email"],["department","Department"],["jobTitle","Job title"]];
  return <section className="panel"><h2>Add employee</h2><form className="employee-form" onSubmit={submit}>
    {fields.map(([key,label])=><label key={key}>{label}<input type={key==="email"?"email":"text"} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required/></label>)}
    <button>Add employee</button></form>{error&&<p className="error">{error}</p>}</section>;
}