import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const links = ['home','outcomes','curriculum','workflow','projects','instructor','reviews','pricing'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark]         = useState(() =>
    localStorage.getItem('devops-theme') === 'dark' ||
    (!localStorage.getItem('devops-theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('devops-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 66, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <header className="nav" id="mainNav">
        <a href="#home" className="nav-brand">
          <span className="brand-prefix">Dev</span>
          <span className="brand-suffix">Ops</span>
          <span className="brand-dot">.</span>Academy
        </a>
        <nav className="nav-links">
          {links.map(l => (
            <button key={l} className="nav-link" onClick={() => scrollTo(l)}>
              {l === 'workflow' ? 'DevOps Flow' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </nav>


        {/* updates from here*/}

     <div className="nav-right">
  <button className="dark-toggle" onClick={() => setDark(d => !d)}>
    <span className="toggle-icon">{dark ? '☀' : '◐'}</span>
  </button>

  {/* ── ADD THIS BLOCK ── */}
  {user ? (
    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
      <span style={{ fontSize:'.8rem', opacity:.7 }}>{user.name}</span>
      <button className="nav-cta" style={{ background:'transparent',
        border:'1px solid var(--blue)', color:'var(--blue)' }}
        onClick={() => {
          logout();
          navigate('/');
        }}>
        Logout
      </button>
      <button className="nav-cta" onClick={() =>
        navigate(user.role === 'instructor' ? '/instructor-dashboard' : '/student-dashboard')
      }>
        Dashboard
      </button>
    </div>
  ) : (
    <button className="nav-cta" onClick={() => navigate('/login')}>
      Login
    </button>
  )}
  {/* ── END BLOCK ── */}

  <button className="nav-cta" onClick={() => scrollTo('pricing')}
    style={{ display: user ? 'none' : 'inline-flex' }}>
    Enroll Now
  </button>
  <button className={`hamburger ${menuOpen ? 'open' : ''}`}
    onClick={() => setMenuOpen(o => !o)}>
    <span /><span /><span />
  </button>
</div>




        
      </header>

      {menuOpen && (
        <div className="mobile-menu open">
          {links.map(l => (
            <button key={l} className="mob-link" onClick={() => scrollTo(l)}>
              {l === 'workflow' ? 'DevOps Flow' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
          <button className="mob-cta" onClick={() => scrollTo('pricing')}>Enroll Now →</button>
        </div>
      )}
    </>
  );
}
