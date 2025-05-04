import { render } from '@testing-library/react';
import LatencyBreakdownChart from '../components/LatencyBreakdownChart';

describe('LatencyBreakdownChart', () => {
  it('renders without crashing with empty data', () => {
    render(<LatencyBreakdownChart data={[]} />);
  });
});