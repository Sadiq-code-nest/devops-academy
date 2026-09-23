import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const navItems = [
  { icon:'📊', label:'Dashboard' },
  { icon:'🎓', label:'Students'  },
];

export default function AdminDashboard() {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData]     = useState({ total:0, students:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/students')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/adminlogin'); };

  return (
    <div style={s.layout}>

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <span style={{ color:'#1A6ED4' }}>Dev</span>
          <span style={{ color:'#2EA043' }}>Ops</span>
          <span style={{ color:'#1A6ED4' }}>.</span>
          <span>Academy</span>
        </div>

        <div style={s.adminBadge}>🔒 Admin Panel</div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <button key={item.label}
              onClick={() => setActiveTab(item.label)}
              style={{ ...s.navBtn,
                ...(activeTab === item.label ? s.navActive : {}) }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={s.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>
              {activeTab === 'Dashboard' ? '📊 Dashboard' : '🎓 Students'}
            </h1>
            <p style={s.sub}>DevOps Academy — Admin View</p>
          </div>
          <div style={s.adminTag}>Admin</div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'Dashboard' && (
          <>
            <div style={s.statsRow}>
              {[
                { icon:'🎓', label:'Total Students', value: loading ? '...' : data.total },
                { icon:'📚', label:'Total Classes',  value:'15'  },
                { icon:'🏗️', label:'Projects',       value:'3'   },
                { icon:'⭐', label:'Avg Rating',     value:'4.9' },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={s.statIcon}>{stat.icon}</div>
                  <div style={s.statVal}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick preview table */}
            <div style={s.section}>
              <h2 style={s.h2}>Recent Registrations</h2>
              <StudentTable
                students={data.students.slice(0, 5)}
                loading={loading} />
            </div>
          </>
        )}

        {/* Full Students Tab */}
        {activeTab === 'Students' && (
          <div style={s.section}>
            <div style={s.tableHeader}>
              <h2 style={s.h2}>All Students ({data.total})</h2>
            </div>
            <StudentTable students={data.students} loading={loading} />
          </div>
        )}

      </main>
    </div>
  );
}

// ── Reusable table component ──
function StudentTable({ students, loading }) {
  if (loading) return <p style={{ color:'#586069' }}>Loading...</p>;
  if (!students.length)
    return <p style={{ color:'#586069' }}>No students registered yet.</p>;

  return (
    <div style={{ overflowX:'auto', borderRadius:'10px',
      border:'1px solid #E0DED8' }}>
      <table style={{ width:'100%', borderCollapse:'collapse',
        fontSize:'.875rem' }}>
        <thead>
          <tr>
            {['#','Name','Email','Student ID','Joined'].map(h => (
              <th key={h} style={st.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, i) => (
            <tr key={student._id}
              style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
              <td style={st.td}>{i + 1}</td>
              <td style={{ ...st.td, fontWeight:'600', color:'#0D1117' }}>
                {student.name}
              </td>
              <td style={st.td}>{student.email}</td>
              <td style={{ ...st.td, fontFamily:'monospace',
                color:'#1A6ED4' }}>{student.studentId}</td>
              <td style={{ ...st.td, color:'#586069' }}>
                {new Date(student.createdAt).toLocaleDateString('en-GB', {
                  day:'2-digit', month:'short', year:'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const st = {
  th: {
    padding:'.75rem 1rem', textAlign:'left', fontWeight:'600',
    color:'#586069', background:'#F8F7F4',
    borderBottom:'1px solid #E0DED8', whiteSpace:'nowrap',
  },
  td: {
    padding:'.75rem 1rem', color:'#0D1117',
    borderBottom:'1px solid #F0EFEB',
  },
};

const s = {
  layout:  { display:'flex', minHeight:'100vh', background:'#F8F7F4' },
  sidebar: {
    width:'220px', minHeight:'100vh', background:'#fff',
    borderRight:'1px solid #E0DED8', display:'flex',
    flexDirection:'column', padding:'1.5rem 1rem',
    position:'fixed', top:0, left:0,
  },
  brand: {
    fontSize:'1.15rem', fontWeight:'700', padding:'.5rem',
    marginBottom:'.5rem', cursor:'default',
  },
  adminBadge: {
    background:'#F0F2F5', color:'#586069', fontSize:'.75rem',
    fontWeight:'600', padding:'.35rem .75rem', borderRadius:'6px',
    marginBottom:'1rem', textAlign:'center',
  },
  nav:     { display:'flex', flexDirection:'column', gap:'.25rem', flex:1 },
  navBtn: {
    display:'flex', alignItems:'center', gap:'.6rem',
    padding:'.65rem .75rem', borderRadius:'8px',
    border:'none', background:'transparent', cursor:'pointer',
    fontSize:'.9rem', color:'#586069', textAlign:'left',
    width:'100%', fontFamily:'inherit',
  },
  navActive: { background:'#EBF3FF', color:'#1A6ED4', fontWeight:'600' },
  logoutBtn: {
    display:'flex', alignItems:'center', gap:'.6rem',
    padding:'.65rem .75rem', borderRadius:'8px',
    border:'1px solid #E0DED8', background:'transparent',
    cursor:'pointer', fontSize:'.9rem', color:'#586069',
    width:'100%', fontFamily:'inherit', marginTop:'auto',
  },
  main:    { marginLeft:'220px', flex:1, padding:'2rem', maxWidth:'960px' },
  header:  { display:'flex', justifyContent:'space-between',
             alignItems:'flex-start', marginBottom:'1.5rem' },
  h1:      { fontSize:'1.5rem', fontWeight:'700', color:'#0D1117', margin:0 },
  sub:     { color:'#586069', fontSize:'.875rem', marginTop:'.25rem' },
  adminTag:{ background:'#0D1117', color:'#fff', padding:'.35rem .9rem',
             borderRadius:'20px', fontSize:'.8rem', fontWeight:'600' },
  statsRow:{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
             gap:'1rem', marginBottom:'1.5rem' },
  statCard:{ background:'#fff', border:'1px solid #E0DED8',
             borderRadius:'12px', padding:'1.25rem', textAlign:'center' },
  statIcon:{ fontSize:'1.5rem', marginBottom:'.5rem' },
  statVal: { fontSize:'1.5rem', fontWeight:'700', color:'#1A6ED4' },
  statLabel:{ fontSize:'.8rem', color:'#586069', marginTop:'.2rem' },
  section: { marginBottom:'2rem' },
  tableHeader:{ display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:'1rem' },
  h2:      { fontSize:'1rem', fontWeight:'700', color:'#0D1117', margin:0 },
};
