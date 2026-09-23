import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminLogin() {
  const { setUserManually } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const submit = async () => {
    if (!form.username.trim() || !form.password)
      return setError('All fields are required');
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserManually(data.user);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Invalid credentials');   // always generic
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.iconWrap}>🔒</div>
        <h2 style={s.title}>Restricted Access</h2>
        <p style={s.sub}>Authorized personnel only</p>

        <div style={s.field}>
          <label style={s.label}>Username</label>
          <input name="username" value={form.username} onChange={handle}
            placeholder="Enter username" style={s.input}
            autoComplete="off" />
        </div>

        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input name="password" type="password" value={form.password}
            onChange={handle} placeholder="Enter password" style={s.input}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <button onClick={submit} disabled={loading} style={s.btn}>
          {loading ? 'Verifying...' : 'Login'}
        </button>

        <Link to="/login" style={s.back}>← Student login</Link>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', background: '#F3F4F6',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '1rem',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '380px', display: 'flex',
    flexDirection: 'column', gap: '1rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  },
  iconWrap: { fontSize: '2rem', textAlign: 'center' },
  title: { fontSize: '1.15rem', fontWeight: '700', color: '#111827',
            textAlign: 'center', margin: 0 },
  sub:   { color: '#6B7280', fontSize: '.85rem', textAlign: 'center',
            marginTop: '-.5rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '.3rem' },
  label: { fontSize: '.85rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '.7rem .9rem', border: '1.5px solid #E5E7EB',
    borderRadius: '8px', fontSize: '.95rem', color: '#111827',
    background: '#F9FAFB', outline: 'none', fontFamily: 'inherit',
  },
  btn: {
    padding: '.8rem', background: '#374151', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '.95rem',
    fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
  },
  error: {
    background: '#FEF2F2', border: '1px solid #FECACA',
    color: '#DC2626', padding: '.6rem .9rem',
    borderRadius: '8px', fontSize: '.85rem',
  },
  back: {
    textAlign: 'center', fontSize: '.82rem',
    color: '#9CA3AF', textDecoration: 'none', display: 'block',
  },
};
