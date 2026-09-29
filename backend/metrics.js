const client = require('prom-client');

// Collect default Node.js process metrics (CPU, memory, event loop lag, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metric: count every HTTP request, labeled by method, route, status code
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Custom metric: how long each request takes, same labels
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Express middleware — wraps every request
function metricsMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9;

    // Use the matched route pattern (e.g. "/api/enroll/:id"), not the raw URL,
    // to avoid unbounded label cardinality from dynamic IDs.
    const route = req.route ? `${req.baseUrl}${req.route.path}` : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });

  next();
}

module.exports = { register, metricsMiddleware };