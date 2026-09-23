import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const sidebarLinks = [
  { icon:'📊', label:'Dashboard',      path:'/instructor-dashboard' },
  { icon:'📋', label:'Manage Courses', path:'/instructor-dashboard' },
  { icon:'👥', label:'Students',       path:'/instructor-dashboard' },
  { icon:'👤', label:'Profile',        path:'/instructor-dashboard' },
];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/enroll').catch(() => ({ data: [] })),
      api.get('/reviews').catch(() => ({ data: [] })),
    ]).then(([e, r]) => {
      setEnrollments(e.data);
      setReviews(r.data);
      setLoading(false);
    });
  }, []);

  const approveReview = async (id) => {
    await api.patch(`/reviews/${id}/approve`);
    setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: true } : r));
  };

  return (
    <div style={s.layout}>
      <Sidebar links={sidebarLinks} />

      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>Instructor Dashboard 👨‍🏫</h1>
            <p style={s.sub}>Hello, {user?.name} — here's your overview</p>
          </div>
          <div style={{ ...s.badge, background:'var(--green-light)',
            color:'var(--green)' }}>👨‍🏫 Instructor</div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { icon:'👥', label:'Enrollments', value: loading ? '...' : enrollments.length },
            { icon:'⭐', label:'Reviews',     value: loading ? '...' : reviews.length },
            { icon:'📚', label:'Classes',     value:'15' },
            { icon:'🏗️', label:'Projects',    value:'3'  },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statIcon}>{stat.icon}</div>
              <div style={s.statVal}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enrollments Table */}
        <div style={s.section}>
          <h2 style={s.h2}>👥 Recent Enrollments</h2>
          {loading ? <p style={{ color:'var(--text-muted)' }}>Loading...</p> : (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Name','Email','Background','Status','Date'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <tr><td colSpan={5} style={{ ...s.td, textAlign:'center',
                      color:'var(--text-muted)' }}>No enrollments yet</td></tr>
                  ) : enrollments.map(e => (
                    <tr key={e._id}>
                      <td style={s.td}>{e.name}</td>
                      <td style={s.td}>{e.email}</td>
                      <td style={s.td}>{e.background || '—'}</td>
                      <td style={s.td}>
                        <span style={{ ...s.pill,
                          background: e.status === 'enrolled' ? 'var(--green-light)' : 'var(--orange-light)',
                          color: e.status === 'enrolled' ? 'var(--green)' : 'var(--orange)' }}>
                          {e.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div style={s.section}>
          <h2 style={s.h2}>⭐ Reviews</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {reviews.length === 0
              ? <p style={{ color:'var(--text-muted)' }}>No reviews yet</p>
              : reviews.map(r => (
              <div key={r._id} style={s.reviewCard}>
                <div style={s.reviewTop}>
                  <div>
                    <span style={s.reviewName}>{r.name}</span>
                    <span style={s.reviewRole}> · {r.role}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ color:'#E07B00' }}>{'★'.repeat(r.rating)}</span>
                    {!r.approved && (
                      <button onClick={() => approveReview(r._id)} style={s.approveBtn}>
                        Approve
                      </button>
                    )}
                    {r.approved && (
                      <span style={{ fontSize:'.75rem', color:'var(--green)',
                        fontWeight:'600' }}>✓ Approved</span>
                    )}
                  </div>
                </div>
                <p style={s.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  layout:   { display:'flex', minHeight:'100vh', background:'var(--bg)' },
  main:     { marginLeft:'240px', flex:1, padding:'2rem' },
  header:   { display:'flex', justifyContent:'space-between',
              alignItems:'flex-start', marginBottom:'1.5rem' },
  h1:       { fontSize:'1.6rem', fontWeight:'700', color:'var(--text)', margin:0 },
  sub:      { color:'var(--text-muted)', fontSize:'.9rem', marginTop:'.25rem' },
  badge:    { background:'var(--blue-light)', color:'var(--blue)',
              padding:'.4rem .9rem', borderRadius:'20px', fontSize:'.85rem',
              fontWeight:'600' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)',
              gap:'1rem', marginBottom:'1.5rem' },
  statCard: { background:'var(--bg-alt)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'1.25rem', textAlign:'center' },
  statIcon: { fontSize:'1.5rem', marginBottom:'.5rem' },
  statVal:  { fontSize:'1.4rem', fontWeight:'700', color:'var(--green)' },
  statLabel:{ fontSize:'.8rem', color:'var(--text-muted)', marginTop:'.2rem' },
  section:  { marginBottom:'2rem' },
  h2:       { fontSize:'1.1rem', fontWeight:'700', color:'var(--text)',
              marginBottom:'1rem' },
  tableWrap:{ overflowX:'auto', borderRadius:'10px',
              border:'1px solid var(--border)' },
  table:    { width:'100%', borderCollapse:'collapse', fontSize:'.85rem' },
  th:       { padding:'.75rem 1rem', textAlign:'left', fontWeight:'600',
              color:'var(--text-muted)', background:'var(--bg-alt)',
              borderBottom:'1px solid var(--border)' },
  td:       { padding:'.75rem 1rem', color:'var(--text)',
              borderBottom:'1px solid var(--border)' },
  pill:     { padding:'.2rem .6rem', borderRadius:'20px',
              fontSize:'.75rem', fontWeight:'600' },
  reviewCard: { background:'var(--bg-alt)', border:'1px solid var(--border)',
                borderRadius:'10px', padding:'1rem' },
  reviewTop:  { display:'flex', justifyContent:'space-between',
                marginBottom:'.5rem' },
  reviewName: { fontWeight:'600', color:'var(--text)', fontSize:'.9rem' },
  reviewRole: { color:'var(--text-muted)', fontSize:'.85rem' },
  reviewText: { color:'var(--text-muted)', fontSize:'.875rem', lineHeight:'1.5' },
  approveBtn: { padding:'.25rem .6rem', background:'var(--green)',
                color:'#fff', border:'none', borderRadius:'6px',
                cursor:'pointer', fontSize:'.75rem', fontWeight:'600' },
};
