import { useState } from "react";
export default function LoginForm({onSubmit,error}) {
  const [email,setEmail]=useState("admin@example.local"),[password,setPassword]=useState(""),[busy,setBusy]=useState(false),[localError,setLocalError]=useState("");
  async function submit(e){
    e.preventDefault();setBusy(true);setLocalError("");
    try{await onSubmit({email,password});}
    catch(err){setLocalError(err.message||"Unable to sign in.");}
    finally{setBusy(false);}
  }
  return <main className="login-wrap"><form className="login" onSubmit={submit}>
    <p className="eyebrow">PEOPLEDESK · EMPLOYEE CLOUD</p><h1>Sign in securely</h1>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
    {(localError||error)&&<p className="error">{localError||error}</p>}
    <button disabled={busy}>{busy?"Signing in…":"Sign in"}</button>
    <small>Use the bootstrap administrator credentials from your local .env file.</small>
  </form></main>;
}