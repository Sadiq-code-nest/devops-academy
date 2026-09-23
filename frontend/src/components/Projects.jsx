const projects = [
  {
    tag:   'Project 01',
    title: 'Full CI/CD Pipeline',
    desc:  'Push code to GitHub → Jenkins detects webhook → runs tests → builds Docker image → pushes to ECR → Ansible deploys to EC2 → Nginx serves it live.',
    stack: ['GitHub','Jenkins','Docker','AWS ECR','Ansible','Nginx'],
    badge: 'Portfolio-Ready',
  },
  {
    tag:   'Project 02',
    title: 'AWS Infrastructure with Terraform',
    desc:  'Write HCL to provision a full VPC, public/private subnets, EC2 auto-scaling group, ALB, RDS instance — all versioned in Git, deployed with one command.',
    stack: ['Terraform','AWS VPC','EC2','ALB','RDS','S3'],
    badge: 'IaC',
  },
  {
    tag:   'Project 03',
    title: 'Multi-Tier Production App',
    desc:  'React frontend on S3 + CloudFront, Node API on EC2 behind ALB, PostgreSQL on RDS, secrets in Parameter Store, monitored with CloudWatch dashboards.',
    stack: ['React','Node.js','PostgreSQL','S3','CloudFront','CloudWatch'],
    badge: 'Capstone',
  },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Portfolio Projects</div>
          <h2>3 Real Projects. Production Quality.</h2>
          <p>Not toy examples — actual systems you'd build on the job.</p>
        </div>
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.title} className="proj-card fade-in">
              <div className="proj-header">
                <div className="proj-tag">{p.tag}</div>
                <div className="proj-badge">{p.badge}</div>
              </div>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-stack">
                {p.stack.map(s => (
                  <span key={s} className="stack-chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
