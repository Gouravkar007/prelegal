import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginScreen } from '../components/LoginScreen';

describe('LoginScreen Component', () => {
  it('renders login screen title and inputs', () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    expect(screen.getByText('Sign In & Enter Workspace')).toBeInTheDocument();
  });

  it('triggers onLogin when form is submitted', async () => {
    const handleLogin = vi.fn();
    const mockUser = { id: 1, email: 'demo.user@prelegal.io', name: 'Gourav Kar' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: mockUser }),
    }));

    render(<LoginScreen onLogin={handleLogin} />);

    const submitButton = screen.getByText('Sign In & Enter Workspace');
    fireEvent.click(submitButton);

    await vi.waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith(mockUser);
    });

    vi.unstubAllGlobals();
  });

  it('triggers onLogin when guest demo button is clicked', () => {
    const handleLogin = vi.fn();
    render(<LoginScreen onLogin={handleLogin} />);

    const guestButton = screen.getByText('Continue as Demo Guest');
    fireEvent.click(guestButton);

    expect(handleLogin).toHaveBeenCalledWith({
      id: 1,
      email: 'demo.user@prelegal.io',
      name: 'Gourav Kar',
    });
  });
});
