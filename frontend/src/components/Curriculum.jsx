import { useState } from 'react';

const curriculum = [
  { phase: 'Phase 1 — Foundation', classes: [
    { num:'01', title:'Introduction to DevOps',   topics:['DevOps culture vs tooling, SDLC overview','Engineer role, responsibilities, career paths','Course roadmap and beginner challenges'],           task:'Research 5 DevOps job listings and note required tools' },
    { num:'02', title:'Linux Essentials',          topics:['File system, navigation, file operations','Users, groups, processes, networking basics','Shell scripting, cron jobs, SSH key auth'],           task:'Write a shell script that backs up a folder with timestamp' },
    { num:'03', title:'Git & GitHub — Part I',     topics:['VCS concepts, branching strategy: GitFlow','Remote repos, pull requests, code review','.gitignore, README best practices'],                   task:'Create a GitHub repo, make 3 branches, merge 2 PRs' },
    { num:'04', title:'Git & GitHub — Part II',    topics:['Merge vs Rebase, resolving conflicts','Cherry-pick, stash, reset — soft/mixed/hard','Reflog recovery, bisect, semantic versioning'],          task:'Resolve 3 merge conflict scenarios; recover lost commit via reflog' },
  ]},
  { phase: 'Phase 2 — Web Server', classes: [
    { num:'05', title:'Nginx & Multi-Stack Deploy',topics:['Nginx architecture, server blocks, reverse proxy','SSL/TLS with Certbot — free HTTPS','Deploy React SPA, Node API, Python Flask on Nginx'],    task:'Serve 3 different stacks on localhost with Nginx' },
  ]},
  { phase: 'Phase 3 — CI/CD', classes: [
    { num:'06', title:'Jenkins Fundamentals',      topics:['Install Jenkins via Docker','Declarative Jenkinsfile: stages, env vars, credentials','GitHub webhook trigger, Slack notifications'],          task:'End-to-end pipeline: lint → test → Docker build → deploy' },
    { num:'07', title:'Advanced Pipelines',        topics:['Parallel stages, shared libraries','Multi-branch pipelines, SonarQube quality gates','Pipeline-as-code best practices'],                      task:'Pipeline with lint + unit test + staging deploy in parallel' },
  ]},
  { phase: 'Phase 4 — Containers', classes: [
    { num:'08', title:'Docker Basics',             topics:['Containers vs VMs','Dockerfile: FROM/RUN/COPY/EXPOSE/CMD','Image layers, caching, Docker Hub push/pull'],                                    task:'Containerise a full-stack app and push to Docker Hub' },
    { num:'09', title:'Docker Advanced',           topics:['Multi-stage builds, networks, volumes','Docker Compose: services, depends_on, healthcheck','Container debugging: exec, inspect, stats'],     task:'Docker Compose for 3-tier app: React + Node API + PostgreSQL' },
  ]},
  { phase: 'Phase 5 — Cloud (AWS)', classes: [
    { num:'10', title:'AWS Core Services',         topics:['IAM, EC2, S3, EBS, VPC fundamentals','Security groups, NACLs, NAT Gateway, Elastic IP','User data scripts, key pairs'],                     task:'Launch EC2, attach EBS, host static site on S3' },
    { num:'11', title:'AWS Networking & Database', topics:['ALB vs NLB, target groups, path routing','RDS managed MySQL, multi-AZ, automated backups','CloudWatch logs, metrics, alarms, cost alerts'],  task:'App on EC2 behind ALB with RDS as database backend' },
  ]},
  { phase: 'Phase 6 — IaC', classes: [
    { num:'12', title:'Terraform',                 topics:['HCL: providers, resources, variables, outputs','State file, remote backend (S3 + DynamoDB locking)','Modules, workspaces, import existing resources'], task:'Provision VPC + EC2 + S3 entirely with Terraform' },
    { num:'13', title:'Ansible',                   topics:['Agentless over SSH, static & dynamic inventory','Playbooks, tasks, core modules, roles, Galaxy','Ansible Vault for secrets, Jinja2 templating'],     task:'Configure Nginx on EC2 and deploy app via Ansible playbook' },
  ]},
  { phase: 'Phase 7 — Capstone', classes: [
    { num:'14', title:'Mega Projects × 2',         topics:['Project A: GitHub → Jenkins → Docker → ECR → EC2 → Nginx','Project B: Terraform + Ansible + Jenkins full pipeline'],                         task:'Working pipeline + architecture diagram + README' },
    { num:'15', title:'Capstone + Career Prep',    topics:['Project C: multi-tier app on AWS (ALB, RDS, S3, CloudWatch)','Portfolio review: GitHub, LinkedIn, resume keywords','What\'s next: Kubernetes, GitOps, ArgoCD, Helm'], task:'Live demo of capstone project to the cohort' },
  ]},
];

export default function Curriculum() {
  const [open, setOpen] = useState(null);

  const toggle = (key) => setOpen(prev => prev === key ? null : key);

  return (
    <section className="section" id="curriculum">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Course Content</div>
          <h2>15 Classes · 7 Phases · 3 Projects</h2>
          <p>From zero Linux knowledge to a live AWS pipeline in 2 months.</p>
        </div>
        <div id="curriculumWrap">
          {curriculum.map((ph) => (
            <div key={ph.phase}>
              <div className="phase-label">{ph.phase}</div>
              {ph.classes.map((cl) => {
                const key = cl.num;
                const isOpen = open === key;
                return (
                  <div key={key} className="acc-item fade-in">
                    <div className="acc-header" onClick={() => toggle(key)}>
                      <span className="acc-num">Class {cl.num}</span>
                      <span className="acc-title">{cl.title}</span>
                      <span className="acc-chevron"
                        style={{ transform: isOpen ? 'rotate(180deg)' : '' }}>▼</span>
                    </div>
                    {isOpen && (
                      <div className="acc-body open">
                        <ul>{cl.topics.map(t => <li key={t}>{t}</li>)}</ul>
                        <div className="acc-task">★ Lab: {cl.task}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
