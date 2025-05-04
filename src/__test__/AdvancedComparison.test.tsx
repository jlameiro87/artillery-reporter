import { render, screen } from '@testing-library/react';
import AdvancedComparison from '../components/AdvancedComparison';

const mockReport = (overrides = {}) => ({
  aggregate: {
    counters: {
      'http.requests': 1000,
      'http.responses': 990,
      'apdex.satisfied': 900,
      'apdex.tolerated': 80,
      'http.downloaded_bytes': 1000000,
    },
    rates: { 'http.request_rate': 100 },
    histograms: {
      'vusers.session_length': { mean: 5000 },
      'http.response_time': { mean: 100, p95: 200, max: 300 },
    },
  },
  ...overrides,
});

describe('AdvancedComparison', () => {
  it('renders summary table and tooltips', () => {
    render(<AdvancedComparison reportA={mockReport()} reportB={mockReport({ aggregate: { ...mockReport().aggregate, counters: { ...mockReport().aggregate.counters, 'http.requests': 800 } } })} />);
    expect(screen.getByTestId('metric-header')).toBeInTheDocument();
    expect(screen.getByTestId('report-a-header')).toBeInTheDocument();
    expect(screen.getByTestId('report-b-header')).toBeInTheDocument();
    // Tooltip test: hover over a metric row
    const metricRows = screen.getAllByText('Total Requests');
    expect(metricRows.length).toBeGreaterThan(0);
  });

  it('shows correct summary line when A is better', () => {
    // Make reportA better in more metrics (higher requests, lower errors, higher apdex, etc.)
    const reportA = mockReport({
      aggregate: {
        ...mockReport().aggregate,
        counters: {
          ...mockReport().aggregate.counters,
          'http.requests': 2000, // higher is better
          'http.responses': 2000,
          'apdex.satisfied': 1900,
          'apdex.tolerated': 80,
          'http.downloaded_bytes': 2000000,
        },
        rates: { 'http.request_rate': 200 },
        histograms: {
          'vusers.session_length': { mean: 4000 }, // lower is better
          'http.response_time': { mean: 80, p95: 150, max: 200 }, // lower is better
        },
      },
    });
    const reportB = mockReport();
    render(<AdvancedComparison reportA={reportA} reportB={reportB} />);
    expect(screen.getByTestId('summary-line').textContent).toMatch(/report A behaved better/i);
  });

  it('shows correct summary line when B is better', () => {
    // Make reportB better in more metrics
    const reportA = mockReport();
    const reportB = mockReport({
      aggregate: {
        ...mockReport().aggregate,
        counters: {
          ...mockReport().aggregate.counters,
          'http.requests': 2000,
          'http.responses': 2000,
          'apdex.satisfied': 1900,
          'apdex.tolerated': 80,
          'http.downloaded_bytes': 2000000,
        },
        rates: { 'http.request_rate': 200 },
        histograms: {
          'vusers.session_length': { mean: 4000 },
          'http.response_time': { mean: 80, p95: 150, max: 200 },
        },
      },
    });
    render(<AdvancedComparison reportA={reportA} reportB={reportB} />);
    expect(screen.getByTestId('summary-line').textContent).toMatch(/report B behaved better/i);
  });

  it('shows correct summary line when both are similar', () => {
    render(<AdvancedComparison reportA={mockReport()} reportB={mockReport()} />);
    expect(screen.getByTestId('summary-line').textContent).toMatch(/performed similarly overall/i);
  });
});
