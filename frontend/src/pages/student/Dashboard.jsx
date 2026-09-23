import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Static Data ── */
const courses = [
  { num:'01', title:'Introduction to DevOps',    phase:'Phase 1', status:'available' },
  { num:'02', title:'Linux Essentials',           phase:'Phase 1', status:'available' },
  { num:'03', title:'Git & GitHub — Part I',      phase:'Phase 1', status:'available' },
  { num:'04', title:'Git & GitHub — Part II',     phase:'Phase 1', status:'available' },
  { num:'05', title:'Nginx & Multi-Stack Deploy', phase:'Phase 2', status:'available' },
  { num:'06', title:'Jenkins Fundamentals',       phase:'Phase 3', status:'upcoming'  },
  { num:'07', title:'Advanced Pipelines',         phase:'Phase 3', status:'upcoming'  },
  { num:'08', title:'Docker Basics',              phase:'Phase 4', status:'upcoming'  },
  { num:'09', title:'Docker Advanced',            phase:'Phase 4', status:'upcoming'  },
  { num:'10', title:'AWS Core Services',          phase:'Phase 5', status:'upcoming'  },
  { num:'11', title:'AWS Networking & Database',  phase:'Phase 5', status:'upcoming'  },
  { num:'12', title:'Terraform',                  phase:'Phase 6', status:'upcoming'  },
  { num:'13', title:'Ansible',                    phase:'Phase 6', status:'upcoming'  },
  { num:'14', title:'Mega Projects × 2',          phase:'Phase 7', status:'upcoming'  },
  { num:'15', title:'Capstone + Career Prep',     phase:'Phase 7', status:'upcoming'  },
];

const motivations = [
  { emoji:'🚀', text:'Every pipeline you build brings you one step closer to your first DevOps role.' },
  { emoji:'💡', text:'Consistency beats intensity. Show up to every class and do every lab.' },
  { emoji:'🛠️', text:'The tools you are learning today are used by engineers at Netflix, Amazon, and Google.' },
  { emoji:'🌱', text:'One small step a day. In two months you will look back and not recognize your old self.' },
  { emoji:'🔥', text:'Real DevOps engineers break things and fix them. Every error is a lesson.' },
];

/* ── Sidebar config ── */
const sidebarItems = [
  { icon:'📊', label:'Dashboard'   },
  { icon:'📚', label:'My Courses'  },
  { icon:'💡', label:'Motivation'  },
  { icon:'👤', label:'Profile'     },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('Dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={s.layout}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <span style={{ color:'#3B82F6' }}>Dev</span>
          <span style={{ color:'#22C55E' }}>Ops</span>
          <span style={{ color:'#3B82F6' }}>.</span>
          <span style={{ color:'#111827' }}>Academy</span>
        </div>

        {/* User pill */}
        <div style={s.userPill}>
          <div style={s.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={s.userName}>{user?.name}</div>
            <div style={s.userRole}>Student</div>
          </div>
        </div>

        <div style={s.divider} />

        {/* Nav */}
        <nav style={s.nav}>
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{
                ...s.navBtn,
                ...(active === item.label ? s.navActive : {}),
              }}>
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} style={s.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main style={s.main}>
        {active === 'Dashboard'  && <DashboardHome user={user} setActive={setActive} />}
        {active === 'My Courses' && <MyCourses />}
        {active === 'Motivation' && <MotivationPage />}
        {active === 'Profile'    && <Profile user={user} />}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Dashboard Home
══════════════════════════════════════════ */
function DashboardHome({ user, setActive }) {
  return (
    <div>
      <div style={p.header}>
        <div>
          <h1 style={p.h1}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={p.sub}>Here's your learning overview</p>
        </div>
        <div style={p.badge}>🎓 Student</div>
      </div>

      {/* Stats */}
      <div style={p.statsRow}>
        {[
          { icon:'📚', label:'Total Classes', value:'15'  },
          { icon:'✅', label:'Available Now', value:'5'   },
          { icon:'🏗️', label:'Projects',      value:'3'   },
          { icon:'⏱️', label:'Duration',      value:'2mo' },
        ].map(stat => (
          <div key={stat.label} style={p.statCard}>
            <div style={p.statIcon}>{stat.icon}</div>
            <div style={p.statVal}>{stat.value}</div>
            <div style={p.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={p.quickRow}>
        <button onClick={() => setActive('My Courses')} style={p.quickCard}>
          <span style={{ fontSize:'1.5rem' }}>📚</span>
          <span style={p.quickLabel}>View My Courses</span>
          <span style={p.quickArrow}>→</span>
        </button>
        <button onClick={() => setActive('Motivation')} style={p.quickCard}>
          <span style={{ fontSize:'1.5rem' }}>💡</span>
          <span style={p.quickLabel}>Daily Motivation</span>
          <span style={p.quickArrow}>→</span>
        </button>
        <button onClick={() => setActive('Profile')} style={p.quickCard}>
          <span style={{ fontSize:'1.5rem' }}>👤</span>
          <span style={p.quickLabel}>My Profile</span>
          <span style={p.quickArrow}>→</span>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: My Courses
══════════════════════════════════════════ */
function MyCourses() {
  return (
    <div>
      <h1 style={p.h1}>📚 My Courses</h1>
      <p style={{ ...p.sub, marginBottom:'1.5rem' }}>
        15 classes across 7 phases
      </p>
      <div style={p.courseGrid}>
        {courses.map(c => (
          <div key={c.num} style={{
            ...p.courseCard,
            borderLeft: `3px solid ${c.status === 'available' ? '#22C55E' : '#E5E7EB'}`,
          }}>
            <div style={p.courseTop}>
              <span style={p.courseNum}>Class {c.num}</span>
              <span style={{
                ...p.coursePill,
                background: c.status === 'available' ? '#F0FDF4' : '#F9FAFB',
                color:      c.status === 'available' ? '#16A34A' : '#9CA3AF',
              }}>
                {c.status === 'available' ? '✓ Available' : 'Upcoming'}
              </span>
            </div>
            <div style={p.courseTitle}>{c.title}</div>
            <div style={p.coursePhase}>{c.phase}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Motivation
══════════════════════════════════════════ */
function MotivationPage() {
  return (
    <div>
      <h1 style={p.h1}>💡 Daily Motivation</h1>
      <p style={{ ...p.sub, marginBottom:'1.5rem' }}>
        Keep going — you are doing great
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {motivations.map((m, i) => (
          <div key={i} style={p.motivCard}>
            <span style={p.motivEmoji}>{m.emoji}</span>
            <p style={p.motivText}>{m.text}</p>
          </div>
        ))}
      </div>

      {/* Roadmap reminder */}
      <div style={p.roadmapBox}>
        <h3 style={{ margin:'0 0 .75rem', fontSize:'1rem', color:'#111827' }}>
          🗺️ Your Journey
        </h3>
        <div style={p.roadmapSteps}>
          {['Foundation','Web Server','CI/CD','Containers','AWS','IaC','Capstone'].map((step, i) => (
            <div key={step} style={p.roadmapStep}>
              <div style={{ ...p.roadmapDot,
                background: i < 2 ? '#22C55E' : '#E5E7EB' }} />
              <span style={{ fontSize:'.8rem', color: i < 2 ? '#16A34A' : '#9CA3AF' }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Profile
══════════════════════════════════════════ */
function Profile({ user }) {
  const fields = [
    { label:'Full Name',   value: user?.name      },
    { label:'Email',       value: user?.email     },
    { label:'Student ID',  value: user?.studentId },
    { label:'Role',        value: 'Student'       },
  ];

  return (
    <div>
      <h1 style={p.h1}>👤 My Profile</h1>
      <p style={{ ...p.sub, marginBottom:'1.5rem' }}>Your account information</p>

      {/* Avatar */}
      <div style={p.profileCard}>
        <div style={p.profileAvatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:'1.2rem', fontWeight:'700', color:'#111827' }}>
            {user?.name}
          </div>
          <div style={{ fontSize:'.875rem', color:'#6B7280' }}>
            DevOps Academy Student
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div style={p.infoGrid}>
        {fields.map(f => (
          <div key={f.label} style={p.infoField}>
            <div style={p.infoLabel}>{f.label}</div>
            <div style={p.infoValue}>{f.value || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const s = {
  layout:  { display:'flex', minHeight:'100vh', background:'#F3F4F6' },
  sidebar: {
    width: '220px', minHeight:'100vh',
    background: '#fff', borderRight:'1px solid #E5E7EB',
    display:'flex', flexDirection:'column',
    padding:'1.25rem 1rem', position:'fixed',
    top:0, left:0, gap:'.25rem',
  },
  brand: {
    fontSize:'1.1rem', fontWeight:'800',
    padding:'.25rem .5rem .75rem', letterSpacing:'-.3px',
  },
  userPill: {
    display:'flex', alignItems:'center', gap:'.6rem',
    background:'#F9FAFB', borderRadius:'10px',
    padding:'.6rem .75rem', margin:'.25rem 0',
  },
  avatar: {
    width:'34px', height:'34px', borderRadius:'50%',
    background:'#3B82F6', color:'#fff',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:'700', fontSize:'.95rem', flexShrink:0,
  },
  userName:  { fontWeight:'600', fontSize:'.85rem', color:'#111827',
               whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  userRole:  { fontSize:'.72rem', color:'#6B7280' },
  divider:   { height:'1px', background:'#F3F4F6', margin:'.25rem 0' },
  nav:       { display:'flex', flexDirection:'column', gap:'.2rem', flex:1 },
  navBtn: {
    display:'flex', alignItems:'center', gap:'.55rem',
    padding:'.6rem .75rem', borderRadius:'8px',
    border:'none', background:'transparent', cursor:'pointer',
    fontSize:'.875rem', color:'#6B7280', textAlign:'left',
    width:'100%', fontFamily:'inherit', transition:'all .15s',
  },
  navActive: { background:'#EFF6FF', color:'#3B82F6', fontWeight:'600' },
  navIcon:   { fontSize:'.95rem', width:'18px', textAlign:'center' },
  logoutBtn: {
    display:'flex', alignItems:'center', gap:'.55rem',
    padding:'.6rem .75rem', borderRadius:'8px',
    border:'1px solid #E5E7EB', background:'transparent',
    cursor:'pointer', fontSize:'.875rem', color:'#6B7280',
    fontFamily:'inherit', marginTop:'auto', width:'100%',
  },
  main: { marginLeft:'220px', flex:1, padding:'2rem', maxWidth:'860px' },
};

const p = {
  header:  { display:'flex', justifyContent:'space-between',
             alignItems:'flex-start', marginBottom:'1.5rem' },
  h1:      { fontSize:'1.4rem', fontWeight:'700', color:'#111827', margin:0 },
  sub:     { color:'#6B7280', fontSize:'.875rem', marginTop:'.3rem' },
  badge:   { background:'#EFF6FF', color:'#3B82F6', padding:'.35rem .9rem',
             borderRadius:'20px', fontSize:'.82rem', fontWeight:'600' },
  statsRow:{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
             gap:'1rem', marginBottom:'1.5rem' },
  statCard:{ background:'#fff', border:'1px solid #E5E7EB',
             borderRadius:'12px', padding:'1.1rem', textAlign:'center' },
  statIcon:{ fontSize:'1.4rem', marginBottom:'.4rem' },
  statVal: { fontSize:'1.3rem', fontWeight:'700', color:'#3B82F6' },
  statLabel:{ fontSize:'.78rem', color:'#6B7280', marginTop:'.2rem' },
  quickRow:{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
             gap:'1rem', marginBottom:'1.5rem' },
  quickCard:{
    display:'flex', alignItems:'center', gap:'.75rem',
    background:'#fff', border:'1px solid #E5E7EB',
    borderRadius:'12px', padding:'1rem 1.1rem', cursor:'pointer',
    fontFamily:'inherit', textAlign:'left', transition:'box-shadow .2s',
  },
  quickLabel:{ flex:1, fontSize:'.9rem', fontWeight:'600', color:'#111827' },
  quickArrow:{ color:'#9CA3AF', fontSize:'1rem' },
  courseGrid:{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.75rem' },
  courseCard:{ background:'#fff', border:'1px solid #E5E7EB',
               borderRadius:'10px', padding:'1rem' },
  courseTop: { display:'flex', justifyContent:'space-between',
               alignItems:'center', marginBottom:'.35rem' },
  courseNum: { fontSize:'.75rem', fontFamily:'monospace',
               color:'#6B7280', fontWeight:'600' },
  coursePill:{ fontSize:'.72rem', padding:'.2rem .55rem',
               borderRadius:'20px', fontWeight:'600' },
  courseTitle:{ fontSize:'.9rem', fontWeight:'600', color:'#111827',
                marginBottom:'.2rem' },
  coursePhase:{ fontSize:'.75rem', color:'#9CA3AF' },
  motivCard: { background:'#fff', border:'1px solid #E5E7EB',
               borderRadius:'12px', padding:'1.25rem',
               display:'flex', gap:'1rem', alignItems:'flex-start' },
  motivEmoji:{ fontSize:'1.5rem', flexShrink:0 },
  motivText: { fontSize:'.9rem', color:'#374151', lineHeight:'1.6', margin:0 },
  roadmapBox:{ background:'#F0FDF4', border:'1px solid #BBF7D0',
               borderRadius:'12px', padding:'1.25rem', marginTop:'1.5rem' },
  roadmapSteps:{ display:'flex', gap:'0', alignItems:'center' },
  roadmapStep: { display:'flex', flexDirection:'column',
                 alignItems:'center', flex:1, gap:'.35rem' },
  roadmapDot:{ width:'12px', height:'12px', borderRadius:'50%' },
  profileCard:{ background:'#fff', border:'1px solid #E5E7EB',
                borderRadius:'12px', padding:'1.5rem',
                display:'flex', gap:'1rem', alignItems:'center',
                marginBottom:'1.25rem' },
  profileAvatar:{ width:'56px', height:'56px', borderRadius:'50%',
                  background:'#3B82F6', color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.4rem', fontWeight:'700', flexShrink:0 },
  infoGrid:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
  infoField: { background:'#fff', border:'1px solid #E5E7EB',
               borderRadius:'10px', padding:'1rem' },
  infoLabel: { fontSize:'.78rem', color:'#6B7280', fontWeight:'600',
               marginBottom:'.35rem', textTransform:'uppercase',
               letterSpacing:'.5px' },
  infoValue: { fontSize:'.95rem', fontWeight:'600', color:'#111827',
               fontFamily: 'inherit' },
};
