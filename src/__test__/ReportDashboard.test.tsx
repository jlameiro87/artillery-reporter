import { render, screen } from '@testing-library/react';
import ReportDashboard from '../components/ReportDashboard';

describe('ReportDashboard', () => {
  it('renders without crashing', () => {
    const fakeResource = { read: () => ({ aggregate: { counters: {}, rates: {}, histograms: {} } }) };
    render(<ReportDashboard resource={fakeResource} />);
    // Check that at least one element with the label is present
    expect(screen.getAllByText(/total_requests/i).length).toBeGreaterThan(0);
  });
});