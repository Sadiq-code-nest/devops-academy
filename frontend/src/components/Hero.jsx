import { useEffect } from 'react';

const tools = [
  { emoji: '🐧', label: 'Linux'      },
  { emoji: '🌿', label: 'Git & GitHub'},
  { emoji: '🐳', label: 'Docker'     },
  { emoji: '⚙️', label: 'Jenkins'    },
  { emoji: '☁️', label: 'AWS'        },
  { emoji: '🏗️', label: 'Terraform'  },
  { emoji: '📦', label: 'Ansible'    },
  { emoji: '🔒', label: 'Nginx'      },
];

export default function Hero() {
  useEffect(() => {
    document.querySelectorAll('.t-line').forEach((line, i) => {
      line.style.opacity = '0';
      setTimeout(() => {
        line.style.transition = 'opacity 0.3s';
        line.style.opacity = '1';
      }, i * 500 + 800);
    });
  }, []);

  return (
    <section className="section" id="home">
      <div className="hero-bg" />
      <div className="container hero-container">
        <div className="hero-content">

          <div className="hero-badge">
            <span className="badge-dot" />
            NEXT BATCH STARTS SOON · 25 SEATS ONLY
          </div>

          {/* ✅ UPDATED HEADLINE */}
          <h1 className="hero-headline">
            Start Your Real<br />
            <span className="highlight">DevOps Journey</span><br />
            &amp; Build Skills in <em>2 Months</em>
          </h1>

          <p className="hero-sub">
            15 live classes. Real AWS infrastructure. 3 job-ready portfolio
            projects. Land your first DevOps role with the exact tools
            companies use today.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() =>
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }>
              Enroll Now — Free First Class{' '}
              <span className="btn-arrow">→</span>
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })
              }>
              View Curriculum
            </button>
          </div>

          <div className="trust-row">
            {[
              ['200+', 'Students'    ],
              ['15',   'Live Classes'],
              ['3',    'Real Projects'],
              ['4.9★', 'Rating'      ],
            ].map(([num, label]) => (
              <div key={label} className="trust-item">
                <span className="trust-num">{num}</span>
                <span className="trust-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="hero-visual">
          <div className="terminal-card">
            <div className="terminal-bar">
              <span className="t-dot t-red" />
              <span className="t-dot t-yellow" />
              <span className="t-dot t-green" />
              <span className="t-title">jenkins-pipeline.log</span>
            </div>
            <div className="terminal-body">
              {[
                ['Stage 1', '✓', 'Checkout SCM'              ],
                ['Stage 2', '✓', 'Run unit tests'            ],
                ['Stage 3', '✓', 'Docker build & push → ECR' ],
                ['Stage 4', '✓', 'Ansible deploy → EC2'      ],
              ].map(([step, ok, msg]) => (
                <div key={step} className="t-line">
                  <span className="t-step">{step}</span>{' '}
                  <span className="t-ok">{ok}</span>{' '}
                  <span className="t-msg">{msg}</span>
                </div>
              ))}
              <div className="t-line t-typing">
                <span className="t-step">Stage 5</span>{' '}
                <span className="t-run">⟳</span>{' '}
                <span className="t-msg">Health check...</span>
              </div>
              <div className="t-line t-success">✓ Pipeline completed in 2m 14s</div>
              <div className="t-line t-info">→ Deployed to: app.devops.academy</div>
              <div className="t-cursor">▌</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools strip */}
      <div className="tools-strip">
        <div className="tools-label">Technologies you'll master:</div>
        <div className="tools-row">
          {tools.map(t => (
            <div key={t.label} className="tool-chip">
              <span className="tool-emoji">{t.emoji}</span> {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
