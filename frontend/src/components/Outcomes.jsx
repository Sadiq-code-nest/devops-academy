const outcomes = [
  { icon:'⚙️', title:'Build CI/CD Pipelines',    desc:'Automate code from push to production with Jenkins, GitHub webhooks, and Declarative Pipelines.',   tag:'Jenkins · GitHub Actions' },
  { icon:'☁️', title:'Deploy on AWS',             desc:'Launch real infrastructure: EC2 instances behind an ALB, RDS databases, S3 buckets, VPCs, IAM.',    tag:'EC2 · ALB · RDS · S3' },
  { icon:'🐳', title:'Containerize Everything',   desc:'Write production-grade Dockerfiles, multi-stage builds, and Docker Compose for multi-service apps.',  tag:'Docker · Docker Compose' },
  { icon:'🏗️', title:'Infrastructure as Code',   desc:'Provision and version your entire AWS environment with Terraform modules and remote state.',           tag:'Terraform · HCL' },
  { icon:'📦', title:'Automate Configuration',    desc:'Use Ansible playbooks and roles to configure servers, deploy apps, and manage secrets at scale.',     tag:'Ansible · Ansible Vault' },
  { icon:'📊', title:'Monitor Production',        desc:'Set up CloudWatch dashboards, metrics, alarms, and structured logging for your live apps.',           tag:'CloudWatch · Alerting' },
];

export default function Outcomes() {
  return (
    <section className="section section-alt" id="outcomes">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">What You'll Build</div>
          <h2>Job-Ready Skills From Day One</h2>
          <p>Every class has a lab. Every lab is something you'd do on the job.</p>
        </div>
        <div className="outcomes-grid">
          {outcomes.map(o => (
            <div key={o.title} className="outcome-card fade-in">
              <div className="outcome-icon">{o.icon}</div>
              <h3>{o.title}</h3>
              <p>{o.desc}</p>
              <div className="outcome-tag">{o.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
