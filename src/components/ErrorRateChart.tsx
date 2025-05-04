import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ErrorRateChartProps {
  data?: { name: string; errors: number; errorRate: number; total: number }[];
  dataA?: { name: string; errors: number; errorRate: number; total: number }[];
  dataB?: { name: string; errors: number; errorRate: number; total: number }[];
  overlay?: boolean;
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({ data = [], dataA, dataB, overlay }) => {
  if (overlay && dataA && dataB) {
    return (
      <div style={{ width: '100%', height: 300 }}>
        <h3>Error Rate Over Time (Overlay)</h3>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" label={{ value: 'Errors', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Error Rate (%)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="errors" data={dataA} stroke="#e57373" name="Errors (A)" />
            <Line yAxisId="left" type="monotone" dataKey="errors" data={dataB} stroke="#1976d2" name="Errors (B)" />
            <Line yAxisId="right" type="monotone" dataKey="errorRate" data={dataA} stroke="#ffb300" name="Error Rate (%) (A)" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="errorRate" data={dataB} stroke="#43a047" name="Error Rate (%) (B)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Error Rate Over Time</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" label={{ value: 'Errors', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Error Rate (%)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="errors" stroke="#e57373" name="Errors" />
          <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ffb300" name="Error Rate (%)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ErrorRateChart;
