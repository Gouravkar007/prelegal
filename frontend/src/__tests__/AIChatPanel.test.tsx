import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AIChatPanel } from '../components/AIChatPanel';
import { DEFAULT_NDA_DATA } from '../types/nda';

describe('AIChatPanel Component', () => {
  it('renders chat assistant title and welcome message', () => {
    const handleUpdate = vi.fn();
    render(<AIChatPanel data={DEFAULT_NDA_DATA} onUpdate={handleUpdate} />);

    expect(screen.getByText('AI Chat Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Hello! I'm PreLegal AI/i)).toBeInTheDocument();
  });

  it('renders quick prompt suggestions', () => {
    const handleUpdate = vi.fn();
    render(<AIChatPanel data={DEFAULT_NDA_DATA} onUpdate={handleUpdate} />);

    expect(screen.getByText('+ Set Party 1 to Acme Corp in Delaware')).toBeInTheDocument();
  });

  it('handles sending user message and updates document via fallback parser', async () => {
    const handleUpdate = vi.fn();
    render(<AIChatPanel data={DEFAULT_NDA_DATA} onUpdate={handleUpdate} />);

    const promptBtn = screen.getByText('+ Set Party 1 to Acme Corp in Delaware');
    fireEvent.click(promptBtn);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalled();
    });
  });
});
