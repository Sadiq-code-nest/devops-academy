/* ═══════════════════════════════════════════════════════
   DevOps Academy — Main JavaScript
   ═══════════════════════════════════════════════════════ */

/* ── Dark Mode ── */
const darkToggle = document.getElementById('darkToggle');
const root = document.documentElement;

function setTheme(dark) {
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  darkToggle.querySelector('.toggle-icon').textContent = dark ? '☀' : '◐';
  localStorage.setItem('devops-theme', dark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('devops-theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setTheme(true);
}

darkToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') !== 'dark');
});

/* ── Hamburger / Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ── Sticky Nav Scroll Highlight ── */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === current);
  });
}

/* ── Sticky CTA ── */
const stickyCta = document.getElementById('stickyCta');
function updateStickyCta() {
  stickyCta.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', () => {
  updateActiveNav();
  updateStickyCta();
}, { passive: true });

/* ── Fade-in Animation ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.outcome-card, .proj-card, .review-card, .wf-step, .acc-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* ── Curriculum Data ── */
const curriculum = [
  { phase: 'Phase 1 — Foundation', phaseIdx: 0, classes: [
    { num: '01', title: 'Introduction to DevOps', topics: ['What is DevOps — culture vs tooling, SDLC overview', 'DevOps engineer role, day-to-day responsibilities', 'Career paths, salary, market demand', 'Common beginner challenges and how to handle them', 'Your course roadmap'], task: 'Research 5 job listings for DevOps engineers and note the tools they require' },
    { num: '02', title: 'Linux Essentials', topics: ['File system hierarchy — /etc, /var, /home, /opt', 'Navigation: ls, cd, pwd, find, locate', 'File ops: cp, mv, rm, chmod, chown', 'Users, groups, processes (ps/top/kill)', 'Networking: curl, ssh, netstat, ping', 'Shell scripting basics, cron jobs, SSH key auth'], task: 'Write a shell script that backs up a folder with timestamp and logs the result' },
    { num: '03', title: 'Git & GitHub — Part I', topics: ['VCS concepts, git init/clone/add/commit/log', 'Branching strategy: GitFlow vs trunk-based', 'Remote repos: push/pull/fetch, origin/upstream', 'Pull requests, code review, branch protection', '.gitignore, README best practices'], task: 'Create a GitHub repo, make 3 branches, raise and merge 2 PRs' },
    { num: '04', title: 'Git & GitHub — Part II', topics: ['Merge vs Rebase — when and why', 'Resolving 3-way merge conflicts', 'Cherry-pick, stash (save/pop/list/apply)', 'git reset — soft / mixed / hard', 'Reflog recovery after hard reset', 'git bisect, tagging, semantic versioning'], task: 'Resolve 3 realistic merge conflict scenarios; recover a lost commit using reflog' },
  ]},
  { phase: 'Phase 2 — Web Server & Local Deployment', phaseIdx: 1, classes: [
    { num: '05', title: 'Nginx & Multi-Stack Deployment', topics: ['Nginx architecture, server blocks, reverse proxy', 'SSL/TLS with Certbot — free HTTPS', 'Deploy React SPA, Node API, Python Flask — all on Nginx', 'Different routing configs per stack', 'Load balancing basics: round-robin, least-conn'], task: 'Serve 3 different stacks simultaneously on localhost with Nginx' },
  ]},
  { phase: 'Phase 3 — CI/CD with Jenkins', phaseIdx: 2, classes: [
    { num: '06', title: 'Jenkins Fundamentals', topics: ['Why CI/CD — the cost of manual deploy', 'Install Jenkins via Docker', 'Declarative Jenkinsfile: stages, env vars, credentials', 'GitHub webhook trigger, git hooks', 'Blue Ocean UI, Slack notifications'], task: 'Build an end-to-end pipeline: lint → test → Docker build → deploy' },
    { num: '07', title: 'Advanced Pipelines', topics: ['Parallel stages, shared libraries', 'Multi-branch pipelines', 'Quality gates with SonarQube', 'Artifact archiving, rolling & blue-green concepts', 'Pipeline-as-code best practices'], task: 'Pipeline with lint + unit test + staging deploy stages using parallel execution' },
  ]},
  { phase: 'Phase 4 — Containerisation', phaseIdx: 3, classes: [
    { num: '08', title: 'Docker Basics', topics: ['Containers vs VMs — what actually changes', 'Docker daemon, client, registry', 'Dockerfile: FROM/RUN/COPY/EXPOSE/CMD/ENTRYPOINT', 'Image layers, caching, .dockerignore', 'Docker Hub: push/pull/tagging strategy'], task: 'Containerise a full-stack app and push image to Docker Hub' },
    { num: '09', title: 'Docker Advanced', topics: ['Multi-stage builds — lean production images', 'Networks: bridge, host, overlay', 'Volumes and bind mounts', 'Docker Compose: services, depends_on, healthcheck', 'Container debugging: exec, inspect, stats'], task: 'Docker Compose for 3-tier app: React + Node API + PostgreSQL' },
  ]},
  { phase: 'Phase 5 — Cloud (AWS)', phaseIdx: 4, classes: [
    { num: '10', title: 'AWS Core Services', topics: ['IAM: users, groups, roles, policies, MFA', 'EC2: launch, key pairs, security groups, user data', 'S3: buckets, policies, static hosting, versioning', 'EBS: attach, resize, snapshots', 'VPC: subnets, IGW, route tables, NACL vs SG', 'NAT Gateway, Elastic IP'], task: 'Launch EC2, attach EBS, host static site on S3, connect via SSH' },
    { num: '11', title: 'AWS Networking & Database', topics: ['VPC deep dive — multi-AZ, peering, flow logs', 'ALB vs NLB — target groups, health checks, path routing', 'RDS: managed MySQL, multi-AZ, automated backups', 'Route 53: hosted zones, A/CNAME records', 'CloudWatch: logs, metrics, alarms, dashboards', 'Cost Explorer and budget alerts'], task: 'App on EC2 behind ALB with RDS as the database backend' },
  ]},
  { phase: 'Phase 6 — Infrastructure as Code', phaseIdx: 5, classes: [
    { num: '12', title: 'Terraform', topics: ['IaC concepts — drift, repeatability, auditability', 'HCL: providers, resources, data sources, variables, outputs', 'State file, remote backend (S3 + DynamoDB locking)', 'plan / apply / destroy workflow', 'Modules, workspaces, import existing resources'], task: 'Provision VPC + EC2 + S3 entirely with Terraform' },
    { num: '13', title: 'Ansible', topics: ['Config mgmt vs provisioning — where Ansible fits', 'Agentless over SSH, inventory (static & dynamic)', 'Playbooks, tasks, core modules (apt/service/copy/template)', 'Roles, Galaxy, idempotency, Jinja2 templating', 'Ansible Vault for secrets'], task: 'Configure Nginx on EC2 and deploy your app using an Ansible playbook' },
  ]},
  { phase: 'Phase 7 — Capstone Projects', phaseIdx: 6, classes: [
    { num: '14', title: 'Mega Projects × 2', topics: ['Project A: GitHub → Jenkins → Docker → ECR → EC2 (blue-green) → Nginx + Slack', 'Project B: Terraform provisions infra, Ansible configures, Jenkins deploys on merge to main'], task: 'Deliverable: working pipeline + architecture diagram + README' },
    { num: '15', title: 'Capstone + Career Prep', topics: ['Project C: multi-tier app on AWS — ALB, RDS, S3, Route 53, CloudWatch', 'Portfolio review: GitHub, LinkedIn, resume keywords', 'What comes next: Kubernetes, DevSecOps, GitOps (ArgoCD), Helm'], task: 'Live demo of your capstone project to the cohort' },
  ]},
];

function buildCurriculum() {
  const wrap = document.getElementById('curriculumWrap');
  curriculum.forEach((ph) => {
    const lbl = document.createElement('div');
    lbl.className = 'phase-label';
    lbl.textContent = ph.phase;
    wrap.appendChild(lbl);

    ph.classes.forEach(cl => {
      const item = document.createElement('div');
      item.className = 'acc-item fade-in';
      item.innerHTML = `
        <div class="acc-header" onclick="toggleAcc(this)">
          <span class="acc-num">Class ${cl.num}</span>
          <span class="acc-title">${cl.title}</span>
          <span class="acc-chevron">▼</span>
        </div>
        <div class="acc-body">
          <ul>${cl.topics.map(t => `<li>${t}</li>`).join('')}</ul>
          <div class="acc-task">★ Lab: ${cl.task}</div>
        </div>`;
      wrap.appendChild(item);
      observer.observe(item);
    });
  });
}

function toggleAcc(hdr) {
  const body = hdr.nextElementSibling;
  const chev = hdr.querySelector('.acc-chevron');
  const open = body.classList.toggle('open');
  chev.style.transform = open ? 'rotate(180deg)' : '';
}

/* ── Phase Stepper Interaction ── */
const phaseSteps = document.querySelectorAll('.phase-step');
phaseSteps.forEach(step => {
  step.addEventListener('click', () => {
    phaseSteps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    const phaseIdx = parseInt(step.getAttribute('data-phase'));
    const phaseLabel = document.querySelectorAll('.phase-label')[phaseIdx];
    if (phaseLabel) {
      phaseLabel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Reviews Data ── */
const reviewsData = [
  { name: 'Rakib Hasan', role: 'Junior DevOps Engineer', rating: 5, text: 'This course changed everything for me. The Jenkins + Docker project is exactly what I needed to land my first DevOps job. The labs after every class are genuinely useful.', transformation: 'Student → DevOps Engineer' },
  { name: 'Fatema Akter', role: 'Software Developer', rating: 5, text: 'Finally understood how CI/CD actually works in production, not just theory. The AWS section is thorough and beginner-friendly at the same time.', transformation: 'Dev → Cloud Engineer' },
  { name: 'Tanvir Ahmed', role: 'CS Student', rating: 4, text: 'Great content and well-structured. Terraform and Ansible were new to me — the instructor explains them in a way that actually sticks. Would love a Kubernetes module next!', transformation: 'CS Student → DevOps Intern' },
  { name: 'Nusrat Jahan', role: 'System Administrator', rating: 5, text: 'Coming from a sysadmin background, this course helped me bridge into modern DevOps. The real-world projects are production-quality, not toy examples.', transformation: 'SysAdmin → DevOps Engineer' },
  { name: 'Saiful Islam', role: 'Backend Developer', rating: 5, text: 'The DevOps workflow section is a great overview. By class 8 I had a full pipeline running. Highly recommend for anyone wanting to go from dev to DevOps.', transformation: 'Backend Dev → DevOps' },
  { name: 'Mim Akhter', role: 'Fresher', rating: 4, text: 'Started with zero knowledge of Linux. By class 5 I had deployed a real app. The pace is fast but manageable if you do the labs consistently.', transformation: 'Fresher → DevOps Track' },
];

const avatarColors = [
  'linear-gradient(135deg, #1A6ED4, #5B5FCF)',
  'linear-gradient(135deg, #2EA043, #1A6ED4)',
  'linear-gradient(135deg, #E07B00, #CF222E)',
  'linear-gradient(135deg, #5B5FCF, #E07B00)',
  'linear-gradient(135deg, #1A6ED4, #2EA043)',
  'linear-gradient(135deg, #CF222E, #5B5FCF)',
];

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = '';
  reviewsData.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'review-card fade-in';
    card.innerHTML = `
      <div class="review-stars">${stars(r.rating)}</div>
      <p class="review-text">${r.text}</p>
      <div class="review-author">
        <div class="review-avatar" style="background:${avatarColors[i % avatarColors.length]}">${initials(r.name)}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-role">${r.role}</div>
          ${r.transformation ? `<div class="review-transformation">${r.transformation}</div>` : ''}
        </div>
      </div>`;
    grid.appendChild(card);
    observer.observe(card);
  });
}

function postReview() {
  const name = document.getElementById('rName').value.trim();
  const role = document.getElementById('rRole').value.trim() || 'Student';
  const rating = parseInt(document.getElementById('rRating').value);
  const text = document.getElementById('rText').value.trim();
  if (!name || !text) {
    alert('Please fill in your name and review.');
    return;
  }
  reviewsData.unshift({ name, role, rating, text, transformation: '' });
  renderReviews();
  document.getElementById('rName').value = '';
  document.getElementById('rRole').value = '';
  document.getElementById('rText').value = '';
}

/* ── Enrollment ── */
function submitEnroll() {
  const name = document.getElementById('eName').value.trim();
  const email = document.getElementById('eEmail').value.trim();
  if (!name || !email) {
    alert('Please enter your name and email address.');
    return;
  }
  const msg = document.getElementById('successMsg');
  msg.style.display = 'block';
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('eName').value = '';
  document.getElementById('eEmail').value = '';
  document.getElementById('ePhone').value = '';
  document.getElementById('eBg').value = '';

  /* TODO (backend readiness):
     fetch('/api/enroll', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name, email, phone, background })
     })
     .then(res => res.json())
     .then(data => { ... trigger email automation ... })
  */
}

/* ── Terminal Typing Animation ── */
function animateTerminal() {
  const lines = document.querySelectorAll('.t-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    setTimeout(() => {
      line.style.transition = 'opacity 0.3s';
      line.style.opacity = '1';
    }, i * 500 + 800);
  });
}

/* ── Init ── */
buildCurriculum();
renderReviews();
animateTerminal();

/* ── Smooth anchor scrolling (offset for sticky nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 66;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
