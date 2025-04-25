import { ArtilleryReport, SummaryAggregate } from "../types/artillery";

// Helper to extract aggregate stats
export function getAggregateStats(report: ArtilleryReport): SummaryAggregate {
  const agg = report?.aggregate;
  if (!agg) {
    return {
      requests: 0,
      responses: 0,
      errors: 0,
      apdex: 0,
      throughput: 0,
      data: 0,
      sessionLength: 0,
      latencyMean: 0,
      latencyP95: 0,
      latencyMax: 0,
    };
  }
  const c = agg.counters || {};
  const r = agg.rates || {};
  const h = agg.histograms || {};
  return {
    requests: c["http.requests"] || 0,
    responses: c["http.responses"] || 0,
    errors: c["http.requests"] - c["http.responses"] || 0,
    apdex:
      ((c["apdex.satisfied"] || 0) + 0.5 * (c["apdex.tolerated"] || 0)) /
      (c["http.requests"] || 1),
    throughput: r["http.request_rate"] || 0,
    data: c["http.downloaded_bytes"] || 0,
    sessionLength: h["vusers.session_length"]?.mean || 0,
    latencyMean: h["http.response_time"]?.mean || 0,
    latencyP95: h["http.response_time"]?.p95 || 0,
    latencyMax: h["http.response_time"]?.max || 0,
  };
}

// Helper to extract endpoint breakdown
export function getEndpointBreakdown(report: ArtilleryReport) {
  const agg = report?.aggregate;
  if (!agg) return [];
  const c = agg.counters || {};
  const h = agg.histograms || {};
  // Find endpoints from keys like plugins.metrics-by-endpoint./dino.codes.200
  const endpoints = Object.keys(c)
    .filter(k => k.startsWith('plugins.metrics-by-endpoint./') && k.endsWith('.codes.200'))
    .map(k => k.replace('plugins.metrics-by-endpoint.', '').replace('.codes.200', ''));
  return endpoints.map(endpoint => {
    const codeKey = `plugins.metrics-by-endpoint.${endpoint}.codes.200`;
    const latencyKey = `plugins.metrics-by-endpoint.response_time.${endpoint}`;
    const latency = h[latencyKey] || {};
    return {
      endpoint,
      requests: c[codeKey] || 0,
      mean: latency.mean || 0,
      p95: latency.p95 || 0,
      max: latency.max || 0,
      min: latency.min || 0,
      count: latency.count || 0,
    };
  });
}
