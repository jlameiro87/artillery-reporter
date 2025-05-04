import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface LatencyBreakdownChartProps {
  data: { name: string; dns: number; connect: number; firstByte: number; response: number }[];
}

const LatencyBreakdownChart: React.FC<LatencyBreakdownChartProps> = ({ data }) => (
  <div style={{ width: '100%', height: 300, marginTop: 60 }}>
    <h3>Latency Breakdown Over Time</h3>
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="dns" stroke="#1976d2" name="DNS" />
        <Line type="monotone" dataKey="connect" stroke="#388e3c" name="Connect" />
        <Line type="monotone" dataKey="firstByte" stroke="#fbc02d" name="First Byte" />
        <Line type="monotone" dataKey="response" stroke="#d32f2f" name="Response" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LatencyBreakdownChart;
