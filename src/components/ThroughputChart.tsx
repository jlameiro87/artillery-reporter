import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ThroughputChartProps {
  data: { name: string; bytes: number; throughput: number }[];
}

const ThroughputChart: React.FC<ThroughputChartProps> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <h3>Throughput Over Time</h3>
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'Bytes/sec', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="bytes" stroke="#0288d1" name="Bytes Downloaded" />
        <Line type="monotone" dataKey="throughput" stroke="#43a047" name="Throughput (rate)" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ThroughputChart;
