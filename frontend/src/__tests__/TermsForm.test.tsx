import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TermsForm } from '../components/TermsForm';
import { DEFAULT_NDA_DATA } from '../types/nda';

describe('TermsForm Component', () => {
  it('renders purpose textarea and governing law controls', () => {
    const handleChange = vi.fn();
    render(<TermsForm data={DEFAULT_NDA_DATA} onChange={handleChange} />);

    expect(screen.getByDisplayValue(DEFAULT_NDA_DATA.purpose)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Delaware')).toBeInTheDocument();
  });

  it('updates purpose when a quick preset button is clicked', () => {
    const handleChange = vi.fn();
    render(<TermsForm data={DEFAULT_NDA_DATA} onChange={handleChange} />);

    const presetBtn = screen.getByText(/Evaluating a potential/i);
    fireEvent.click(presetBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose: expect.stringContaining('strategic investment'),
      })
    );
  });

  it('updates governing law state on dropdown selection', () => {
    const handleChange = vi.fn();
    render(<TermsForm data={DEFAULT_NDA_DATA} onChange={handleChange} />);

    const select = screen.getByDisplayValue('Delaware');
    fireEvent.change(select, { target: { value: 'California' } });

    expect(handleChange).toHaveBeenCalledWith({ governingLawState: 'California' });
  });
});
