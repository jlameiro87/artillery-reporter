import { render, screen } from '@testing-library/react';
import ScenarioCompletionChart from '../components/ScenarioCompletionChart';

describe('ScenarioCompletionChart', () => {
  it('renders chart when data is present', () => {
    const data = [
      { name: 'Completed', value: 10 },
      { name: 'Failed', value: 2 },
    ];
    render(<ScenarioCompletionChart data={data} />);
    // Check for the chart title and container
    expect(screen.getByTestId('scenario-completion-title')).toBeInTheDocument();
    // Check for the recharts container
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders nothing if all values are zero', () => {
    const data = [
      { name: 'Completed', value: 0 },
      { name: 'Failed', value: 0 },
    ];
    const { container } = render(<ScenarioCompletionChart data={data} />);
    expect(container).toBeEmptyDOMElement();
  });
});
