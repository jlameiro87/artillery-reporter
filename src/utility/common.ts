import { ArtilleryIntermediateEntry, ArtilleryReport, ChartDataPoint, SummaryAggregate } from "../types/artillery";
import { useState, useEffect } from 'react';

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
    .filter(
      (k) =>
        k.startsWith("plugins.metrics-by-endpoint./") &&
        k.endsWith(".codes.200")
    )
    .map((k) =>
      k.replace("plugins.metrics-by-endpoint.", "").replace(".codes.200", "")
    );
  return endpoints.map((endpoint) => {
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

// Extract error rates over time
export function getErrorRates(report: ArtilleryReport) {
  if (!report?.intermediate) return [];
  return report.intermediate.map((entry, idx) => ({
    name: `T${idx + 1}`,
    errors:
      (entry.counters?.["http.requests"] || 0) -
      (entry.counters?.["http.responses"] || 0),
    total: entry.counters?.["http.requests"] || 0,
    errorRate: entry.counters?.["http.requests"]
      ? ((entry.counters["http.requests"] -
          (entry.counters["http.responses"] || 0)) /
          entry.counters["http.requests"]) *
        100
      : 0,
  }));
}

// Extract latency breakdown if available (DNS, connect, first byte, total)
export function getLatencyBreakdown(report: ArtilleryReport) {
  if (!report?.intermediate) return [];
  return report.intermediate.map((entry, idx) => ({
    name: `T${idx + 1}`,
    dns: entry.summaries?.["http.dns"]?.mean || 0,
    connect: entry.summaries?.["http.connect"]?.mean || 0,
    firstByte: entry.summaries?.["http.first_byte"]?.mean || 0,
    response: entry.summaries?.["http.response_time"]?.mean || 0,
  }));
}

// Extract throughput metrics (bytes/sec over time)
export function getThroughput(report: ArtilleryReport) {
  if (!report?.intermediate) return [];
  return report.intermediate.map((entry, idx) => ({
    name: `T${idx + 1}`,
    bytes: entry.counters?.["http.downloaded_bytes"] || 0,
    throughput: entry.rates?.["http.throughput"] || 0,
  }));
}

// Extract scenario completion rates (if available)
export function getScenarioCompletion(report: ArtilleryReport) {
  if (!report?.aggregate?.counters) return [];
  const counters = report.aggregate.counters;
  // Use vusers.completed and vusers.failed as Artillery does not provide scenarios.completed/failed
  return [
    { name: "Completed", value: counters["vusers.completed"] || 0 },
    { name: "Failed", value: counters["vusers.failed"] || 0 },
  ];
}

// Suspense resource utility
export function createResource<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;
  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}

export function highlight(
  valA: number,
  valB: number,
  better: "lower" | "higher"
) {
  if (valA === valB) return {};
  if (
    (better === "lower" && valA < valB) ||
    (better === "higher" && valA > valB)
  ) {
    return { fontWeight: "bold", color: "#43a047" };
  }
  return { fontWeight: "bold", color: "#e53935" };
}

export const toChartData = (intermediate: ArtilleryIntermediateEntry[] | undefined): ChartDataPoint[] =>
  (intermediate || []).map((entry, idx) => ({
    name: `T${idx + 1}`,
    requests: entry.counters?.["http.requests"] || 0,
    responses: entry.counters?.["http.responses"] || 0,
    apdex_tolerated: entry.counters?.["apdex.tolerated"] || 0,
    apdex_frustrated: entry.counters?.["apdex.frustrated"] || 0,
    request_rate: entry.rates?.["http.request_rate"] || 0,
    p50: entry.summaries?.["http.response_time"]?.p50 || 0,
    p90: entry.summaries?.["http.response_time"]?.p90 || 0,
    p99: entry.summaries?.["http.response_time"]?.p99 || 0,
  }));

// Generic hook for localStorage-backed state
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
