import { useState } from 'react';
import { Button } from '@/components/ui/button';
const logo = { url: '/owco-logo.svg' };

// Mock sign-in against preview members only — not real authentication.
export function Login({onLogin}:{onLogin:(id:string,key:string)=>boolean}){
  const [form,setForm]=useState(false);const [id,setId]=useState('');const [key,setKey]=useState('');const [error,setError]=useState('');
  return <div className="login-screen">
    {!form?<button type="button" className="login-splash" aria-label="Open sign in" onClick={()=>setForm(true)}><img src={logo.url} alt="OWCO.ai apple mark"/><div><strong>OWCO.ai</strong><span>Supply Chain redefined.</span></div></button>
    :<div className="login-card"><img src={logo.url} alt="OWCO.ai apple mark"/><form onSubmit={e=>{e.preventDefault();if(!onLogin(id,key))setError('Member ID or Access Key is incorrect.')}}><h1>Welcome.</h1><p>Lets get ready to dive in.</p><label>Member ID<input value={id} onChange={e=>{setId(e.target.value);setError('')}} autoComplete="username" autoFocus required/></label><label>Access Key<input type="password" value={key} onChange={e=>{setKey(e.target.value);setError('')}} autoComplete="current-password" required/></label>{error&&<small role="alert">{error}</small>}<Button type="submit" className="login-submit">Take that bite!</Button></form></div>}
  </div>;
}
