import { render, screen } from '@testing-library/react';
import ComparisonDashboard from '../components/ComparisonDashboard';

describe('ComparisonDashboard', () => {
  it('renders without crashing', () => {
    const fakeResource = { read: () => ({ aggregate: { counters: {}, rates: {}, histograms: {} } }) };
    render(<ComparisonDashboard resourceA={fakeResource} resourceB={fakeResource} />);
    // Check for a known text or element from the dashboard
    expect(screen.getByText(/comparison/i)).toBeInTheDocument();
  });
});