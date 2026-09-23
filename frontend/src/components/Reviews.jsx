import { useState, useEffect } from 'react';
import api from '../api/axios';

const colors = [
  'linear-gradient(135deg,#1A6ED4,#5B5FCF)',
  'linear-gradient(135deg,#2EA043,#1A6ED4)',
  'linear-gradient(135deg,#E07B00,#CF222E)',
  'linear-gradient(135deg,#5B5FCF,#E07B00)',
  'linear-gradient(135deg,#1A6ED4,#2EA043)',
  'linear-gradient(135deg,#CF222E,#5B5FCF)',
];

const stars  = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

const FALLBACK = [
  { _id:'1', name:'Rakib Hasan',  role:'Junior DevOps Engineer', rating:5, text:'This course changed everything for me. The Jenkins + Docker project is exactly what I needed to land my first DevOps job.', transformation:'Student → DevOps Engineer' },
  { _id:'2', name:'Fatema Akter', role:'Software Developer',     rating:5, text:'Finally understood how CI/CD actually works in production. The AWS section is thorough and beginner-friendly.',             transformation:'Dev → Cloud Engineer' },
  { _id:'3', name:'Tanvir Ahmed', role:'CS Student',             rating:4, text:'Great content. Terraform and Ansible were new to me — the instructor explains them in a way that actually sticks.',           transformation:'CS Student → DevOps Intern' },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(FALLBACK);
  const [form, setForm]       = useState({ name:'', role:'', rating:'5', text:'' });
  const [msg,  setMsg]        = useState('');

  useEffect(() => {
    api.get('/reviews')
      .then(r => { if (r.data.length) setReviews(r.data); })
      .catch(() => {});
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.text) return setMsg('Please fill in name and review.');
    try {
      await api.post('/reviews', { ...form, rating: Number(form.rating) });
      setMsg('✅ Review submitted — pending approval.');
      setForm({ name:'', role:'', rating:'5', text:'' });
    } catch {
      setMsg('❌ Submission failed. Try again.');
    }
  };

  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Student Reviews</div>
          <h2>What Happens After the Course</h2>
          <p>Real feedback from students who shipped real pipelines.</p>
        </div>
        <div className="rating-summary">
          <div className="rating-big">4.9</div>
          <div className="rating-stars">★★★★★</div>
          <div className="rating-count">from 200+ students</div>
        </div>

        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={r._id} className="review-card fade-in">
              <div className="review-stars">{stars(r.rating)}</div>
              <p className="review-text">{r.text}</p>
              <div className="review-author">
                <div className="review-avatar"
                  style={{ background: colors[i % colors.length] }}>
                  {initials(r.name)}
                </div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                  {r.transformation && (
                    <div className="review-transformation">{r.transformation}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="add-review">
          <h4>Share Your Experience</h4>
          <div className="review-form-grid">
            <div className="rf-field">
              <label>Your Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Rakib Hasan" />
            </div>
            <div className="rf-field">
              <label>Your Role</label>
              <input name="role" value={form.role} onChange={handle} placeholder="Student / DevOps Engineer" />
            </div>
            <div className="rf-field">
              <label>Rating</label>
              <select name="rating" value={form.rating} onChange={handle}>
                <option value="5">★★★★★ — Excellent</option>
                <option value="4">★★★★☆ — Good</option>
                <option value="3">★★★☆☆ — Average</option>
              </select>
            </div>
            <div className="rf-field rf-full">
              <label>Your Review</label>
              <textarea name="text" value={form.text} onChange={handle}
                placeholder="Share your experience..." />
            </div>
          </div>
          {msg && <p style={{ marginBottom:'1rem', fontSize:'.9rem' }}>{msg}</p>}
          <button className="post-btn" onClick={submit}>Post Review →</button>
        </div>
      </div>
    </section>
  );
}
