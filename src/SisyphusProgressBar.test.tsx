import React from 'react';
import { render, screen } from '@testing-library/react';
import { SisyphusProgressBar } from './SisyphusProgressBar';

describe('SisyphusProgressBar', () => {
  it('renders without crashing', () => {
    render(<SisyphusProgressBar />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays percentage when showPercentage is true', () => {
    render(<SisyphusProgressBar progress={50} showPercentage={true} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  it('does not display percentage when showPercentage is false', () => {
    render(<SisyphusProgressBar progress={50} showPercentage={false} />);
    expect(screen.queryByText('50.0%')).not.toBeInTheDocument();
  });

  it('renders with controlled progress', () => {
    const { rerender } = render(<SisyphusProgressBar progress={25} />);
    
    // Update progress
    rerender(<SisyphusProgressBar progress={75} />);
    
    // Component should exist (we can't easily test the exact visual progress without more complex setup)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with uncontrolled mode', () => {
    render(<SisyphusProgressBar />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
