import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [hover, setHover]       = useState(false); // for register link hover

  const handle = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())                e.email    = 'Email is required';
    else if (!emailRegex.test(form.email)) e.email    = 'Enter a valid email';
    if (!form.password)                    e.password = 'Password is required';
    else if (form.password.length < 6)     e.password = 'Minimum 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* ── Brand ── */}
        <div style={s.brand}>
          <span style={{ color: '#3B82F6' }}>Dev</span>
          <span style={{ color: '#22C55E' }}>Ops</span>
          <span style={{ color: '#3B82F6' }}>.</span>
          <span style={{ color: '#111827' }}>Academy</span>
        </div>

        {/* ── Heading ── */}
        <div style={s.headingBlock}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to continue your DevOps journey</p>
        </div>

        {/* ── Email ── */}
        <div style={s.field}>
          <label style={s.label}>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handle}
            placeholder="Enter your email"
            style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
          />
          {errors.email && <span style={s.fieldErr}>{errors.email}</span>}
        </div>

        {/* ── Password ── */}
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handle}
            placeholder="Enter your password"
            style={{ ...s.input, ...(errors.password ? s.inputErr : {}) }}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          {errors.password && <span style={s.fieldErr}>{errors.password}</span>}
        </div>

        {/* ── API Error ── */}
        {apiError && (
          <div style={s.apiError}>
            {apiError}
          </div>
        )}

        {/* ── Login Button ── */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...s.btn,
            opacity: loading ? 0.75 : 1,
            cursor:  loading ? 'not-allowed' : 'pointer',
          }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        {/* ── Divider ── */}
        <div style={s.dividerRow}>
          <div style={s.dividerLine} />
          <span style={s.dividerLabel}>or</span>
          <div style={s.dividerLine} />
        </div>

        {/* ── Register Prompt — clean SaaS style ── */}
        <div style={s.registerRow}>
          <span style={s.registerText}>Not registered yet?</span>
          <Link
            to="/register"
            style={{
              ...s.registerLink,
              ...(hover ? s.registerLinkHover : {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

const s = {
  /* ── Layout ── */
  page: {
    minHeight: '100vh',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  },

  /* ── Brand ── */
  brand: {
    fontSize: '1.5rem',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: '-.5px',
    marginBottom: '-.2rem',
  },

  /* ── Heading ── */
  headingBlock: { textAlign: 'center' },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  sub: {
    fontSize: '.875rem',
    color: '#6B7280',
    marginTop: '.35rem',
  },

  /* ── Fields ── */
  field:  { display: 'flex', flexDirection: 'column', gap: '.35rem' },
  label: {
    fontSize: '.85rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '.75rem 1rem',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '.95rem',
    color: '#111827',
    background: '#F9FAFB',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color .2s',
  },
  inputErr: { borderColor: '#EF4444', background: '#FFF9F9' },
  fieldErr: { fontSize: '.78rem', color: '#EF4444' },

  /* ── API Error ── */
  apiError: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '.65rem 1rem',
    borderRadius: '10px',
    fontSize: '.875rem',
  },

  /* ── Login Button ── */
  btn: {
    padding: '.85rem',
    background: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    fontFamily: 'inherit',
    transition: 'opacity .15s',
    marginTop: '-.1rem',
  },

  /* ── Divider ── */
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '.75rem',
  },
  dividerLine:  { flex: 1, height: '1px', background: '#F3F4F6' },
  dividerLabel: { fontSize: '.8rem', color: '#D1D5DB' },

  /* ── Register Prompt ── */
  registerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '.5rem',
    padding: '.6rem 0',
  },
  registerText: {
    fontSize: '.9rem',
    color: '#6B7280',
  },
  registerLink: {
    fontSize: '.9rem',
    fontWeight: '600',
    color: '#3B82F6',
    textDecoration: 'none',
    padding: '.3rem .75rem',
    borderRadius: '6px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    cursor: 'pointer',
    transition: 'all .2s',
    display: 'inline-block',
  },
  registerLinkHover: {
    background: '#3B82F6',
    color: '#fff',
    border: '1px solid #3B82F6',
  },
};
