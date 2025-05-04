import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing and shows main dashboard', () => {
    render(<App />);
    // Check for a known text or element from the dashboard
    expect(screen.getByText(/artillery/i)).toBeInTheDocument();
  });
});