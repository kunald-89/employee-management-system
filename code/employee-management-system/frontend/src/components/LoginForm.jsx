import { useState } from "react";
export default function LoginForm({onSubmit,error}) {
  const [email,setEmail]=useState("admin@example.local"),[password,setPassword]=useState(""),[busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);try{await onSubmit({email,password});}catch(err){/* parent error is rendered below */}finally{setBusy(false);}}
  return <main className="login-wrap"><form className="login" onSubmit={submit}><p className="eyebrow">PEOPLEDESK · EMPLOYEE CLOUD</p><h1>Sign in securely</h1>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
    {error&&<p className="error">{error}</p>}<button disabled={busy}>{busy?"Signing in…":"Sign in"}</button>
    <small>Use the bootstrap administrator credentials from your local .env file.</small></form></main>;
}