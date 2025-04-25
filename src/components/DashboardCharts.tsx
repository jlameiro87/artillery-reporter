import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ChartDataPoint } from '../types/artillery';

interface DashboardChartsProps {
  chartData: ChartDataPoint[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ chartData }) => (
  <Box>
    <Typography variant="h6" gutterBottom>Requests & Responses Over Time</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Shows the number of requests sent and responses received during each time interval. Useful for visualizing load patterns and server responsiveness.
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip content={({ active, payload, label }) => {
          if (!active || !payload) return null;
          return (
            <Paper sx={{ p: 1, bgcolor: '#232326' }}>
              <Typography variant="subtitle2">{label}</Typography>
              {payload.map((item, idx) => (
                <Typography key={idx} color={item.color}>{item.name}: {item.value?.toLocaleString()}</Typography>
              ))}
              <Typography variant="caption" color="text.secondary">
                Requests: Number of HTTP requests sent. Responses: Number of responses received from the server.
              </Typography>
            </Paper>
          );
        }} />
        <Legend formatter={(value) => {
          if (value === 'requests') return 'Requests (sent)';
          if (value === 'responses') return 'Responses (received)';
          return value;
        }} />
        <Bar dataKey="requests" fill="#e53935" name="Requests" />
        <Bar dataKey="responses" fill="#43a047" name="Responses" />
      </BarChart>
    </ResponsiveContainer>
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Response Time Percentiles</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Shows how fast the server responded to requests. Percentiles (p50, p90, p99) indicate the response time below which that percentage of requests were completed. Lower is better.
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            return (
              <Paper sx={{ p: 1, bgcolor: '#232326' }}>
                <Typography variant="subtitle2">{label}</Typography>
                {payload.map((item, idx) => (
                  <Typography key={idx} color={item.color}>{item.name}: {item.value} ms</Typography>
                ))}
                <Typography variant="caption" color="text.secondary">
                  p50: 50% of requests were faster than this. p90: 90% faster. p99: 99% faster.
                </Typography>
              </Paper>
            );
          }} />
          <Legend formatter={(value) => {
            if (value === 'p50') return 'p50 (Median)';
            if (value === 'p90') return 'p90';
            if (value === 'p99') return 'p99';
            return value;
          }} />
          <Line type="monotone" dataKey="p50" stroke="#e53935" name="p50" strokeWidth={2} />
          <Line type="monotone" dataKey="p90" stroke="#ffb300" name="p90" strokeWidth={2} />
          <Line type="monotone" dataKey="p99" stroke="#1e88e5" name="p99" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Request Rate & Apdex</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Shows how many requests per second were sent and how users perceived performance (Apdex: higher is better, 1.0 is best).
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            return (
              <Paper sx={{ p: 1, bgcolor: '#232326' }}>
                <Typography variant="subtitle2">{label}</Typography>
                {payload.map((item, idx) => (
                  <Typography key={idx} color={item.color}>{item.name}: {item.value}</Typography>
                ))}
                <Typography variant="caption" color="text.secondary">
                  Request Rate: Number of requests sent per second. Apdex: User satisfaction index (Tolerated/Frustrated).
                </Typography>
              </Paper>
            );
          }} />
          <Legend formatter={(value) => {
            if (value === 'request_rate') return 'Request Rate (req/s)';
            if (value === 'apdex_tolerated') return 'Apdex Tolerated';
            if (value === 'apdex_frustrated') return 'Apdex Frustrated';
            return value;
          }} />
          <Bar dataKey="request_rate" fill="#1e88e5" name="Request Rate" />
          <Bar dataKey="apdex_tolerated" fill="#43a047" name="Apdex Tolerated" />
          <Bar dataKey="apdex_frustrated" fill="#fbc02d" name="Apdex Frustrated" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

export default DashboardCharts;
