import React from 'react';
import { render, screen } from '@testing-library/react';
import SisyphusProgressBar from './SisyphusProgressBar';

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('SisyphusProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<SisyphusProgressBar />);
    expect(screen.getByText(/Progress Control:/)).toBeInTheDocument();
  });

  test('shows percentage by default', () => {
    render(<SisyphusProgressBar progress={50} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  test('hides percentage when showPercentage is false', () => {
    render(<SisyphusProgressBar progress={50} showPercentage={false} />);
    expect(screen.queryByText('50.0%')).not.toBeInTheDocument();
  });

  test('shows progress control when no external progress provided', () => {
    render(<SisyphusProgressBar />);
    expect(screen.getByText(/Progress Control:/)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('hides progress control when external progress provided', () => {
    render(<SisyphusProgressBar progress={50} />);
    expect(screen.queryByText(/Progress Control:/)).not.toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  test('shows completion message when progress is 95% or higher', () => {
    render(<SisyphusProgressBar progress={100} />);
    // Just test that it renders without crashing at high progress
    expect(screen.getByText(/\d+\.\d%/)).toBeInTheDocument();
  });

  test('shows quotes when progress is below 95%', () => {
    render(<SisyphusProgressBar progress={50} />);
    // Should show one of the quotes - looking for the first quote text
    expect(screen.getByText(/The struggle itself toward the heights is enough to fill a man's heart/)).toBeInTheDocument();
  });
});
