export default function Header({user,onSignOut}) {
  return <header className="topbar"><strong>PeopleDesk <small>· Employee Cloud</small></strong><div className="user"><span>{user.email} · {user.role}</span><button className="secondary" onClick={onSignOut}>Sign out</button></div></header>;
}