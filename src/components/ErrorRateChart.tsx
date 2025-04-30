import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ErrorRateChartProps {
  data: { name: string; errors: number; errorRate: number; total: number }[];
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({ data }) => (
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

export default ErrorRateChart;
