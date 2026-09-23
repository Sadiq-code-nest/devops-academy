const stats = [
  { num: '6+',   label: 'Years in DevOps'   },
  { num: '200+', label: 'Students Taught'   },
  { num: '15+',  label: 'Tools in Prod Use' },
  { num: '4.9★', label: 'Average Rating'    },
];

const tools = [
  'Linux','Git','Docker','Jenkins',
  'Terraform','Ansible','AWS','Nginx',
];

export default function Instructor() {
  return (
    <section className="section section-alt" id="instructor">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Your Instructor</div>
          <h2>Taught by Someone Who Does This Daily</h2>
        </div>

        <div className="instructor-layout">
          <div className="instructor-left">
            <div className="avatar-wrap">
              <div className="avatar-initials">RA</div>
            </div>
            <div className="instructor-stats">
              {stats.map(s => (
                <div key={s.label} className="i-stat">
                  <span className="i-stat-num">{s.num}</span>
                  <span className="i-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="instructor-right">
            <h3 className="instructor-name">Rafiul Alam</h3>
            <div className="instructor-title">
              Senior DevOps Engineer · AWS Certified Solutions Architect
            </div>
            <p className="instructor-bio">
              I've been building and maintaining CI/CD pipelines, cloud infrastructure,
              and containerised systems for over 6 years across startups and enterprise teams.
              I built this course because I couldn't find one that taught DevOps the way
              it's actually done — with real tools, real AWS accounts, and real pipelines
              you can show in an interview.
            </p>
            <p className="instructor-bio">
              Every class is based on something I've done professionally.
              Every lab is something you'd encounter in your first DevOps role.
            </p>
            <div className="instructor-tools">
              {tools.map(t => (
                <span key={t} className="i-tool-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
