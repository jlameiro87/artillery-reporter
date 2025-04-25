// Artillery report structure types
export interface ArtilleryCounters {
  [key: string]: number;
}

export interface ArtilleryRates {
  [key: string]: number;
}

export interface ArtilleryHistogram {
  min?: number;
  max?: number;
  count?: number;
  mean?: number;
  p50?: number;
  median?: number;
  p75?: number;
  p90?: number;
  p95?: number;
  p99?: number;
  p999?: number;
  [key: string]: number | undefined;
}

export interface ArtilleryAggregate {
  counters: ArtilleryCounters;
  rates: ArtilleryRates;
  histograms: { [key: string]: ArtilleryHistogram };
}

export interface ArtilleryIntermediateEntry {
  counters: ArtilleryCounters;
  rates: ArtilleryRates;
  summaries: { [key: string]: ArtilleryHistogram };
}

export interface ArtilleryReport {
  aggregate?: ArtilleryAggregate;
  intermediate?: ArtilleryIntermediateEntry[];
}

export interface ChartDataPoint {
  name: string;
  requests: number;
  responses: number;
  apdex_tolerated: number;
  apdex_frustrated: number;
  request_rate: number;
  p50: number;
  p90: number;
  p99: number;
}

export interface SummaryAggregate {
  requests: number;
  responses: number;
  errors: number;
  apdex: number;
  throughput: number;
  data: number;
  sessionLength: number;
  latencyMean: number;
  latencyP95: number;
  latencyMax: number;
}
