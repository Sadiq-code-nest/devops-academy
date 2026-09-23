const steps = [
  { icon:'💻', title:'Code',       desc:'Developer pushes to GitHub feature branch' },
  { icon:'🔀', title:'PR & Review',desc:'Pull request triggers automated lint + test' },
  { icon:'⚙️', title:'CI Build',   desc:'Jenkins pipeline builds & tags Docker image' },
  { icon:'🐳', title:'Registry',   desc:'Image pushed to AWS ECR with commit SHA tag' },
  { icon:'📦', title:'Deploy',     desc:'Ansible pulls image, rolling deploy to EC2' },
  { icon:'📊', title:'Monitor',    desc:'CloudWatch alarms watch error rate & latency' },
];

export default function Workflow() {
  return (
    <section className="section section-alt" id="workflow">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2>The DevOps Workflow You'll Master</h2>
          <p>Every step of the pipeline — hands-on, not just slides.</p>
        </div>
        <div className="workflow-steps">
          {steps.map((s, i) => (
            <div key={s.title} className="wf-step fade-in">
              <div className="wf-icon">{s.icon}</div>
              <div className="wf-num">0{i + 1}</div>
              <div className="wf-title">{s.title}</div>
              <div className="wf-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
