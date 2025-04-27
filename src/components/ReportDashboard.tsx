import { ArtilleryIntermediateEntry, ArtilleryReport, ChartDataPoint } from "../types/artillery";
import { createResource, getAggregateStats, getEndpointBreakdown } from "../utility/common";
import DashboardCharts from "./DashboardCharts";
import EndpointTable from "./EndpointTable";
import SummaryCards from "./SummaryCards";

interface ReportDashboardProps {
  resource: ReturnType<typeof createResource<ArtilleryReport>>;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ resource }) => {
  const report = resource.read();
  // Prepare data for charts
  let chartData: ChartDataPoint[] = [];
  if (report?.intermediate) {
    chartData = report.intermediate.map(
      (entry: ArtilleryIntermediateEntry, idx: number) => ({
        name: `T${idx + 1}`,
        requests: entry.counters?.["http.requests"] || 0,
        responses: entry.counters?.["http.responses"] || 0,
        apdex_tolerated: entry.counters?.["apdex.tolerated"] || 0,
        apdex_frustrated: entry.counters?.["apdex.frustrated"] || 0,
        request_rate: entry.rates?.["http.request_rate"] || 0,
        p50: entry.summaries?.["http.response_time"]?.p50 || 0,
        p90: entry.summaries?.["http.response_time"]?.p90 || 0,
        p99: entry.summaries?.["http.response_time"]?.p99 || 0,
      })
    );
  }

  const aggregate = getAggregateStats(report ?? ({} as ArtilleryReport));
  const endpoints = getEndpointBreakdown(report ?? ({} as ArtilleryReport));

  return (
    <>
      <SummaryCards aggregate={aggregate} />
      <EndpointTable endpoints={endpoints} />
      <DashboardCharts chartData={chartData} />
    </>
  );
};

export default ReportDashboard;
