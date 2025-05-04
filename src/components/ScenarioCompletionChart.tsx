import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioCompletionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#43a047', '#e53935'];

const ScenarioCompletionChart: React.FC<ScenarioCompletionChartProps> = ({ data }) => {
  if (!data.some(item => item.value > 0)) return null;
  return (
    <div style={{ width: '100%', height: 300, marginTop: 60 }}>
      <h3 style={{ marginBottom: 32 }} data-testid="scenario-completion-title">Scenario Completion Rates</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name }) => <tspan data-testid={`scenario-label-${name}`}>{name}</tspan>}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScenarioCompletionChart;
