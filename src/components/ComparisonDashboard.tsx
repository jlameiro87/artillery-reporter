import React from 'react';
import DashboardCharts from './DashboardCharts';
import ErrorRateChart from './ErrorRateChart';
import LatencyBreakdownChart from './LatencyBreakdownChart';
import ThroughputChart from './ThroughputChart';
import ScenarioCompletionChart from './ScenarioCompletionChart';
import AdvancedComparison from './AdvancedComparison';
import { getErrorRates, getLatencyBreakdown, getThroughput, getScenarioCompletion, createResource, toChartData } from '../utility/common';
import { ArtilleryReport } from '../types/artillery';
import { Typography, Box } from '@mui/material';

interface ReportDashboardProps {
  resourceA: ReturnType<typeof createResource<ArtilleryReport>>;
  resourceB: ReturnType<typeof createResource<ArtilleryReport>>;
}

const ComparisonDashboard: React.FC<ReportDashboardProps> = ({ resourceA, resourceB }) => {
  const reportA = resourceA.read();
  const reportB = resourceB.read();
  return (
    <>
      <Box sx={{ display: 'flex', gap: 4, mb: 6 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Report A</Typography>
          <DashboardCharts chartData={toChartData(reportA.intermediate)} />
          <ErrorRateChart data={getErrorRates(reportA)} />
          <LatencyBreakdownChart data={getLatencyBreakdown(reportA)} />
          <ThroughputChart data={getThroughput(reportA)} />
          <ScenarioCompletionChart data={getScenarioCompletion(reportA)} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Report B</Typography>
          <DashboardCharts chartData={toChartData(reportB.intermediate)} />
          <ErrorRateChart data={getErrorRates(reportB)} />
          <LatencyBreakdownChart data={getLatencyBreakdown(reportB)} />
          <ThroughputChart data={getThroughput(reportB)} />
          <ScenarioCompletionChart data={getScenarioCompletion(reportB)} />
        </Box>
      </Box>
      <AdvancedComparison reportA={reportA} reportB={reportB} />
    </>
  );
};

export default ComparisonDashboard;
