# DevOps Academy: Dockerized MERN Application

Student enrollment platform, containerized, DevSecOps hardened, deployed on a self-managed Kubernetes platform with GitOps continuous delivery and full-stack observability.

> **Note:** `app.sadiqdev.online` is a test domain used for demonstration purposes only.


<div align="center">

## Table of Contents

| |
|---|
| [Stack](#stack) |
| [Quick Start](#quick-start) |
| [Architecture](#architecture) |
| [DevSecOps Pipeline (GitHub Actions + Jenkins)](#devsecops-pipeline) |
| [Nginx Hardening](#nginx-hardening) |
| [Kubernetes Platform](#kubernetes-platform) |
| &nbsp;&nbsp;&nbsp;↳ [Cluster & Networking](#cluster--networking) |
| &nbsp;&nbsp;&nbsp;↳ [TLS (cert-manager + Let's Encrypt)](#tls) |
| &nbsp;&nbsp;&nbsp;↳ [Helm Packaging](#helm-packaging) |
| &nbsp;&nbsp;&nbsp;↳ [Security (RBAC & NetworkPolicy)](#security) |
| &nbsp;&nbsp;&nbsp;↳ [GitOps (ArgoCD)](#gitops) |
| [Observability](#observability) |
| [Project Structure](#project-structure) |
| [Roadmap](#roadmap) |
| [License](#license) |

 </div>

## Stack

- Frontend: React (Vite)
- Backend: Node.js (Express)
- Database: MongoDB
- Reverse Proxy: Nginx
- Containers: Docker (multi-stage) · Docker Compose
- CI/CD: GitHub Actions · Jenkins · ArgoCD
- Security: Trivy · OWASP Dependency-Check · SonarQube
- Orchestration: Kubernetes (RKE2) · Helm · Calico · cert-manager
- Observability: Prometheus · Grafana · Loki · Grafana Alloy · Node Exporter · cAdvisor
- Registry: GitHub Container Registry (GHCR)

## Quick Start

```bash
git clone <this-repo>
cd devops-academy-MERN
./setup.sh
```

## Architecture

```mermaid
flowchart LR
    U[👤 User] --> N[🔀 Nginx<br/>Reverse Proxy :8080]
    N --> FE[⚛️ React App]
    N -.-> BE[⚙️ Node.js API :5000]
    FE -->|REST API| BE
    BE --> DB[(🗄️ MongoDB)]

    subgraph Docker Network
    N
    FE
    BE
    DB
    end
```

- 3 containers: frontend, backend, mongodb
- Nginx serves the React build and fronts the stack
- MongoDB has no host-exposed port

## DevSecOps Pipeline

```mermaid
flowchart LR
    subgraph CI["CI dual engine"]
        GHA[GitHub Actions]
        JEN[Jenkins]
    end

    GHA --> T1[Trivy]
    GHA --> O1[OWASP Dependency-Check]
    GHA --> S1[SonarQube]
    JEN --> T2[Trivy]
    JEN --> O2[OWASP Dependency-Check]
    JEN --> S2[SonarQube]

    T1 & O1 & S1 --> QG1{Quality Gate}
    T2 & O2 & S2 --> QG2{Quality Gate}

    QG1 -->|pass| DEPLOY[Build Images / Deploy]
    QG2 -->|pass| DEPLOY
```

| Gate | Tool | Enforcement |
|---|---|---|
| Vulnerability scan | Trivy | Blocks on CRITICAL/HIGH |
| Dependency CVE audit | OWASP Dependency-Check | NVD-backed, CVSS ≥ 7 |
| Static analysis | SonarQube | Quality Gate required |
| Deploy | Docker Compose / ArgoCD | Gated on scan pass |

- Dual CI/CD engines, same three gates on each
- Self-hosted SonarQube, no third-party code exposure
- GHCR used as the registry for the Kubernetes deployment path

<p align="center"><img src="docs/screenshots/10-github-actions-pipeline.png" width="900"/></p>
<p align="center"><b>GitHub Actions: Trivy, OWASP, SonarQube, Deploy</b></p>

<p align="center"><img src="docs/screenshots/09-jenkins-pipeline.png" width="900"/></p>
<p align="center"><b>Jenkins: same gates, same server</b></p>

<p align="center"><img src="docs/screenshots/08-sonarqube-quality-gate.png" width="900"/></p>
<p align="center"><b>Self-hosted SonarQube, Quality Gate passed</b></p>

## Nginx Hardening

- Gzip compression
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- `server_tokens off`
- Hidden-file blocking (`.env`, `.git` return `403`)
- Exact-match healthcheck
- Immutable caching on static assets
- Non-root container, correct pid-file ownership
- SPA fallback routing

## Kubernetes Platform

Self-managed RKE2 cluster on a dedicated host, real domain, trusted TLS, GitOps deployment.

### Cluster & Networking

- RKE2, CIS-hardened distribution, single-node control plane
- Calico CNI (Canal), chosen for real NetworkPolicy enforcement
- Traefik Ingress, path-based routing (`/api`, `/`) behind one entry point
- Dedicated Elastic IP, custom domain via Spaceship DNS
- `local-path-provisioner` for dynamic PersistentVolumes

<p align="center"><img src="docs/screenshots/11-k8s-cluster-nodes-pods.png" width="800"/></p>
<p align="center"><b>Cluster node and workloads, Ready/Running</b></p>

### TLS

- `cert-manager` with a `ClusterIssuer` on Let's Encrypt production
- HTTP-01 challenge automated through the existing Ingress
- Auto-renewing, trusted certificate

<p align="center"><img src="docs/screenshots/12-tls-certificate.png" width="800"/></p>
<p align="center"><b>Trusted Let's Encrypt certificate</b></p>

### Helm Packaging

- Full application packaged as one versioned Helm chart
- Parameterized `values.yaml`: image tags, replicas, resource limits, domain
- Secrets excluded from version control by design

<p align="center"><img src="docs/screenshots/13-helm-deployed.png" width="800"/></p>
<p align="center"><b>Helm release, deployed</b></p>

### Security

- Dedicated ServiceAccount per workload, bound to a least-privilege Role
- Default-deny NetworkPolicy, explicit allow rules on top:
  - Ingress to frontend/backend only
  - Backend to MongoDB only, port 27017
  - MongoDB unreachable from frontend, verified directly
- Non-root containers, explicit numeric UID, dropped capabilities

<p align="center"><img src="docs/screenshots/14-networkpolicy-enforced.png" width="800"/></p>
<p align="center"><b>NetworkPolicies applied</b></p>

### GitOps

- Deployment fully decoupled from manual `kubectl`/`helm` commands
- ArgoCD reconciles live cluster state against the Helm chart in this repo
- Auto-sync, self-heal, and pruning enabled
- Deploy flow: commit, push, ArgoCD applies automatically

<p align="center"><img src="docs/screenshots/16-argocd-app-synced.png" width="800"/></p>
<p align="center"><b>ArgoCD, application synced from this repository</b></p>

<p align="center"><img src="docs/screenshots/15-argocd-resource-tree.png" width="900"/></p>
<p align="center"><b>Full resource tree, tracked and health-checked</b></p>

## Observability

Metrics and logs for the app server, collected by lightweight agents and stored on a **separate monitoring server**. Full details: **[observability/README.md](observability/README.md)**

- Prometheus scrapes host (Node Exporter), container (cAdvisor) and application (`prom-client` `/metrics`) metrics
- Grafana dashboards: Infrastructure, Docker Containers, Application, Node Exporter Full, Logs
- Loki + Grafana Alloy ship all container logs to one place, 15-day retention
- Data sources and dashboards provisioned as code, deployed by GitHub Actions
- No hardcoded IPs or secrets; the app server address is injected from GitHub Secrets
- Real problems fixed and documented: cAdvisor on containerd + cgroup v2, stale bind mounts, Compose volume naming

<p align="center"><img src="docs/screenshots/17-prometheus-targets.png" width="800"/></p>
<p align="center"><b>Prometheus: backend, cAdvisor, Node Exporter and Prometheus all UP</b></p>

<p align="center"><img src="docs/screenshots/19-grafana-node-exporter-full.png" width="800"/></p>
<p align="center"><b>Grafana: host metrics (Node Exporter Full, provisioned from git)</b></p>

<p align="center"><img src="docs/screenshots/21-grafana-application.png" width="700"/></p>
<p align="center"><b>Grafana: application metrics (requests, latency, per-route rate)</b></p>

<p align="center"><img src="docs/screenshots/18-cadvisor-containers.png" width="700"/></p>
<p align="center"><b>cAdvisor: every container detected</b></p>

<p align="center"><img src="docs/screenshots/25-grafana-logs-dashboard.png" width="800"/></p>
<p align="center"><b>Grafana: centralized logs dashboard (Loki)</b></p>

<p align="center"><img src="docs/screenshots/24-loki-explore-backend-logs.png" width="800"/></p>
<p align="center"><b>Loki: backend logs queried in Grafana Explore</b></p>

## Project Structure

```
.
├── setup.sh
├── docker-compose.yml
├── Jenkinsfile
├── argocd-app.yaml
├── .github/workflows/
│   ├── security.yml
│   ├── deploy.yml
│   ├── ghcr-build.yml
│   └── deploy-monitoring.yml
├── backend/
│   ├── Dockerfile
│   ├── metrics.js
│   ├── models/Admin.js
│   └── seedAdmin.js
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── k8s/
├── helm/devops-academy/
├── observability/
└── docs/screenshots/
```

## Roadmap

- Structured JSON logging, alerting, uptime probes, SLOs and tracing ([observability roadmap](observability/ROADMAP.md))
- Multi-environment namespaces via Helm values
- HPA load-test demonstration
- Pod/node failure and recovery testing

## License

MIT
