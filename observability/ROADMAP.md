# Observability Roadmap

Planned work only. Nothing here is built yet. The completed phases are documented in [README.md](README.md).

| Phase | Topic | Goal |
|---|---|---|
| 6 | Structured logging | Make logs filterable by field, not substring |
| 7 | Alerting | Get notified instead of watching dashboards |
| 8 | Uptime probes | Check availability from the outside |
| 9 | SLI / SLO | Define "healthy" with numbers |
| 10 | Distributed tracing | See where time goes inside a request |
| 11 | Correlation | Jump between a metric, a log and a trace |

## Phase 6: Structured JSON logging

- Backend writes JSON logs with `level`, `service`, `message` and a per-request `requestId`
- Never log passwords, tokens or full request bodies
- Alloy parses the JSON; `level` becomes a label, `requestId` stays in the log line
- Query example: `{container="devops-academy-backend-1"} | json | level="error"`
- Done when: one request can be followed across log lines by its `requestId`

## Phase 7: Alerting

- Alertmanager plus Prometheus alert rules, kept in git
- Candidate rules: target down, CPU or memory sustained high, root disk over 85%, 5xx rate, p95 latency
- Disk usage is a proven case: a full root disk already took SonarQube down once
- Notification channel still to be decided (email, Slack or Telegram)
- Done when: stopping a container produces a notification, and recovery produces a resolve message

## Phase 8: Uptime probes

- Blackbox Exporter probing the public frontend and the `/api/health` endpoint from the monitoring server
- TLS certificate expiry check for the public domain
- Done when: a probe failure shows on a dashboard and triggers an alert

## Phase 9: SLI / SLO

- SLIs: availability (successful requests / total) and latency (share of requests under a threshold)
- Targets still to be chosen, then tracked with Prometheus recording rules
- Dashboard showing SLO status and remaining error budget
- Done when: the dashboard shows current SLO compliance from real data

## Phase 10: Distributed tracing

- OpenTelemetry instrumentation in the Node.js backend, traces stored in Tempo, viewed in Grafana
- Done when: a request shows a trace with its Express route and MongoDB spans

## Phase 11: Correlation

- Trace ID written into every log line
- Loki derived fields link a log line to its trace in Tempo
- Prometheus exemplars link a latency spike to a representative trace
- Done when: one click goes from a slow-request panel to its trace to the related logs

## Later (outside this roadmap)

Production hardening, Kubernetes-level observability for the RKE2 cluster, and GitOps delivery of the observability stack.
