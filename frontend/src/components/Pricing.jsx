import { useState } from 'react';
import api from '../api/axios';

export default function Pricing() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', background:'' });
  const [success, setSuccess] = useState(false);
  const [err, setErr]         = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email) return setErr('Name and email are required.');
    try {
      await api.post('/enroll', form);
      setSuccess(true);
      setForm({ name:'', email:'', phone:'', background:'' });
      setErr('');
    } catch {
      setErr('Submission failed. Please try again.');
    }
  };

  return (
    <section className="section section-dark" id="pricing">
      <div className="container">
        <div className="section-header light">
          <div className="section-tag light">Enrollment</div>
          <h2>Join the Next Batch</h2>
          <p>Limited seats. Live instruction. Lifetime recording access.</p>
        </div>

        <div className="pricing-layout">
          <div className="batch-card">
            <div className="batch-header">
              <div className="batch-status"><span className="status-dot" /> Enrolling Now</div>
              <h3>Next Batch</h3>
            </div>
            <div className="batch-details">
              {[
                ['📅','Start Date','May 5, 2025'],
                ['⏱️','Duration','2 months · 2 classes/week'],
                ['🎥','Format','Live online + recorded'],
                ['💻','Requirements','8 GB RAM, stable internet'],
              ].map(([icon, label, value]) => (
                <div key={label} className="batch-item">
                  <span className="bi-icon">{icon}</span>
                  <div>
                    <div className="bi-label">{label}</div>
                    <div className="bi-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="seats-indicator">
              <div className="seats-label">
                <span>Seats Remaining</span>
                <span className="seats-count">11 / 25</span>
              </div>
              <div className="seats-bar">
                <div className="seats-fill" style={{ width:'56%' }} />
              </div>
              <div className="seats-warning">⚡ Filling fast — secure your seat now</div>
            </div>
          </div>

          <div className="price-card">
            <div className="price-tag">
              <div className="price-original">৳15,000</div>
              <div className="price-current">৳9,999</div>
              <div className="price-save">Save 33% — Early Bird</div>
            </div>
            <div className="price-includes">
              {['15 live classes (recorded for review)','Labs after every single class',
                '3 portfolio projects with code review','Private Discord community',
                'Resume & LinkedIn review','Free first class — no commitment',
              ].map(item => (
                <div key={item} className="pi-item">✓ {item}</div>
              ))}
            </div>

            <div className="enroll-form">
              {['name','email','phone'].map(field => (
                <div key={field} className="ef-field">
                  <input
                    name={field} type={field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'name' ? 'Full Name *' : field === 'email' ? 'Email Address *' : 'Phone / WhatsApp'}
                    value={form[field]} onChange={handle}
                  />
                </div>
              ))}
              <div className="ef-field">
                <select name="background" value={form.background} onChange={handle}>
                  <option value="">Your Background</option>
                  <option>Student — CS / IT</option>
                  <option>Working professional — switching to DevOps</option>
                  <option>Developer wanting to learn infra</option>
                  <option>Complete beginner</option>
                </select>
              </div>
              {err && <p style={{ color:'#CF222E', fontSize:'.85rem' }}>{err}</p>}
              {success
                ? <div className="success-msg" style={{ display:'block' }}>
                    🎉 Registration received! We'll reach out within 24 hours.
                  </div>
                : <button className="enroll-btn" onClick={submit}>Secure My Seat →</button>
              }
              <div className="enroll-note">Free first class · No advance payment needed</div>
            </div>
          </div>
        </div>

        <div className="resources-section">
          <div className="resources-header">Free Resources for All Students</div>
          <div className="resources-row">
            {[['📄','Linux Cheat Sheet'],['📝','Git Commands Guide'],['🗺️','DevOps Roadmap PDF']].map(([icon, label]) => (
              <a key={label} href="#" className="resource-btn">{icon} {label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
