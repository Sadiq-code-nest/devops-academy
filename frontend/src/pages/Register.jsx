import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', studentId: '',
  });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const handle = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name      = 'Full name is required';
    else if (form.name.trim().length < 2) e.name     = 'Name is too short';
    if (!form.studentId.trim())          e.studentId = 'Student ID is required';
    if (!form.email.trim())              e.email     = 'Email is required';
    else if (!emailRegex.test(form.email)) e.email   = 'Enter a valid email address';
    if (!form.password)                  e.password  = 'Password is required';
    else if (form.password.length < 6)   e.password  = 'Minimum 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Account created successfully! Taking you to login...');
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name', label: 'Full Name',
      type: 'text', placeholder: 'Enter your full name',
      hint: null,
    },
    {
      name: 'studentId', label: 'Student ID',
      type: 'text', placeholder: 'e.g. STU-2025-001',
      hint: 'Assigned by your institution or choose your own',
    },
    {
      name: 'email', label: 'Email Address',
      type: 'email', placeholder: 'Enter your email',
      hint: null,
    },
    {
      name: 'password', label: 'Password',
      type: 'password', placeholder: 'Minimum 6 characters',
      hint: null,
    },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Brand */}
        <div style={s.brand}>
          <span style={{ color: '#3B82F6' }}>Dev</span>
          <span style={{ color: '#22C55E' }}>Ops</span>
          <span style={{ color: '#3B82F6' }}>.</span>
          <span style={{ color: '#111827' }}>Academy</span>
        </div>

        {/* Heading */}
        <div style={s.headingBlock}>
          <h2 style={s.title}>Create Your Account</h2>
          <p style={s.sub}>Join thousands of students learning DevOps</p>
        </div>

        {/* Fields */}
        {fields.map(f => (
          <div key={f.name} style={s.field}>
            <label style={s.label}>{f.label}</label>
            <input
              name={f.name}
              type={f.type}
              value={form[f.name]}
              onChange={handle}
              placeholder={f.placeholder}
              style={{ ...s.input, ...(errors[f.name] ? s.inputErr : {}) }}
            />
            {errors[f.name] && (
              <span style={s.fieldErr}>⚠ {errors[f.name]}</span>
            )}
            {f.hint && !errors[f.name] && (
              <span style={s.hint}>{f.hint}</span>
            )}
          </div>
        ))}

        {/* API error */}
        {apiError && <div style={s.apiError}>{apiError}</div>}

        {/* Success */}
        {success && (
          <div style={s.successBox}>
            <span style={{ fontSize: '1.1rem' }}>🎉</span>
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading || !!success}
          style={{
            ...s.btn,
            opacity: loading || success ? 0.75 : 1,
            cursor:  loading || success ? 'not-allowed' : 'pointer',
          }}>
          {loading ? 'Creating account...' : success ? 'Done ✓' : 'Create Account →'}
        </button>

        {/* Divider */}
        <div style={s.dividerRow}>
          <div style={s.dividerLine} />
          <span style={s.dividerLabel}>Already registered?</span>
          <div style={s.dividerLine} />
        </div>

        {/* Login link */}
        <Link to="/login" style={s.loginBtn}>
          Login to your account
        </Link>

      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem 1rem',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2.25rem',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '.85rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: '-.5px',
  },
  headingBlock: { textAlign: 'center' },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  sub: {
    fontSize: '.85rem',
    color: '#6B7280',
    marginTop: '.3rem',
  },
  field:  { display: 'flex', flexDirection: 'column', gap: '.3rem' },
  label:  { fontSize: '.85rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '.72rem .9rem',
    border: '1.5px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '.95rem',
    color: '#111827',
    background: '#F9FAFB',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color .2s',
  },
  inputErr: { borderColor: '#EF4444' },
  fieldErr: { fontSize: '.78rem', color: '#EF4444' },
  hint:     { fontSize: '.76rem', color: '#9CA3AF' },
  apiError: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '.65rem .9rem',
    borderRadius: '8px',
    fontSize: '.85rem',
  },
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#16A34A',
    padding: '.65rem .9rem',
    borderRadius: '8px',
    fontSize: '.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '.6rem',
    fontWeight: '500',
  },
  btn: {
    padding: '.82rem',
    background: '#22C55E',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '.95rem',
    fontWeight: '700',
    fontFamily: 'inherit',
    transition: 'opacity .2s',
  },
  dividerRow:   { display: 'flex', alignItems: 'center', gap: '.6rem' },
  dividerLine:  { flex: 1, height: '1px', background: '#E5E7EB' },
  dividerLabel: { fontSize: '.78rem', color: '#9CA3AF', whiteSpace: 'nowrap' },
  loginBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '.75rem',
    background: '#EFF6FF',
    border: '1.5px solid #BFDBFE',
    borderRadius: '8px',
    color: '#3B82F6',
    fontSize: '.9rem',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
