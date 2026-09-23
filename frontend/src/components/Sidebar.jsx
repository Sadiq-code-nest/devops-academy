import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ links }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={s.sidebar}>
      {/* Brand */}
      <div style={s.brand} onClick={() => navigate('/')}>
        <span style={{ color:'var(--blue)' }}>Dev</span>
        <span style={{ color:'var(--green)' }}>Ops</span>
        <span style={{ color:'var(--blue)' }}>.</span>Academy
      </div>

      {/* User info */}
      <div style={s.userBox}>
        <div style={s.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={s.userName}>{user?.name}</div>
          <div style={s.userRole}>{user?.role}</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Nav links */}
      <nav style={s.nav}>
        {links.map(link => {
          const active = location.pathname === link.path;
          return (
            <button key={link.label}
              onClick={() => link.path ? navigate(link.path) : link.action?.()}
              style={{ ...s.navBtn, ...(active ? s.navBtnActive : {}) }}>
              <span style={s.navIcon}>{link.icon}</span>
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <button onClick={handleLogout} style={s.logoutBtn}>
        🚪 Logout
      </button>
    </aside>
  );
}

const s = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: 'var(--bg-alt)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    position: 'fixed',
    top: 0, left: 0,
    gap: '.25rem',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '0 .5rem .75rem',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '.75rem',
    padding: '.75rem .5rem',
  },
  avatar: {
    width: '38px', height: '38px',
    borderRadius: '50%',
    background: 'var(--blue)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1rem',
    flexShrink: 0,
  },
  userName: { fontWeight: '600', fontSize: '.9rem', color: 'var(--text)' },
  userRole: {
    fontSize: '.75rem',
    color: 'var(--text-muted)',
    textTransform: 'capitalize',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '.5rem 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.25rem',
    flex: 1,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '.6rem',
    padding: '.65rem .75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '.9rem',
    color: 'var(--text-muted)',
    textAlign: 'left',
    width: '100%',
    transition: 'all .15s',
  },
  navBtnActive: {
    background: 'var(--blue-light)',
    color: 'var(--blue)',
    fontWeight: '600',
  },
  navIcon: { fontSize: '1rem', width: '20px', textAlign: 'center' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '.6rem',
    padding: '.65rem .75rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '.9rem',
    color: 'var(--text-muted)',
    marginTop: 'auto',
    width: '100%',
  },
};
