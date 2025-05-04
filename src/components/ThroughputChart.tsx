import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ThroughputChartProps {
  data?: { name: string; bytes: number; throughput: number }[];
  dataA?: { name: string; bytes: number; throughput: number }[];
  dataB?: { name: string; bytes: number; throughput: number }[];
  overlay?: boolean;
}

const ThroughputChart: React.FC<ThroughputChartProps> = ({ data = [], dataA, dataB, overlay }) => {
  if (overlay && dataA && dataB) {
    return (
      <div style={{ width: '100%', height: 300, marginTop: 60 }}>
        <h3>Throughput Over Time (Overlay)</h3>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Bytes/sec', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bytes" data={dataA} stroke="#0288d1" name="Bytes Downloaded (A)" />
            <Line type="monotone" dataKey="bytes" data={dataB} stroke="#e53935" name="Bytes Downloaded (B)" />
            <Line type="monotone" dataKey="throughput" data={dataA} stroke="#43a047" name="Throughput (A)" />
            <Line type="monotone" dataKey="throughput" data={dataB} stroke="#ffb300" name="Throughput (B)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300, marginTop: 60 }}>
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
};

export default ThroughputChart;
