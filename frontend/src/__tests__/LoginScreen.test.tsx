import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginScreen } from '../components/LoginScreen';

describe('LoginScreen Component', () => {
  it('renders login screen title and inputs', () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    expect(screen.getByText('Sign in to your workspace')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    expect(screen.getByText('Sign In & Enter Platform')).toBeInTheDocument();
  });

  it('triggers onLogin when form is submitted', () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const submitButton = screen.getByText('Sign In & Enter Platform');
    fireEvent.click(submitButton);

    expect(handleLogin).toHaveBeenCalledWith({
      email: 'demo.user@prelegal.io',
      name: 'Gourav Kar',
    });
  });

  it('triggers onLogin when guest demo button is clicked', () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const guestButton = screen.getByText('Continue as Demo Guest');
    fireEvent.click(guestButton);

    expect(handleLogin).toHaveBeenCalledWith({
      email: 'demo@prelegal.io',
      name: 'Demo Account',
    });
  });
});
