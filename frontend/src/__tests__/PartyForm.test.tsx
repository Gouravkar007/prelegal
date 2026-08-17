import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PartyForm } from '../components/PartyForm';
import { DEFAULT_NDA_DATA } from '../types/nda';

describe('PartyForm Component', () => {
  it('renders party 1 and party 2 form inputs correctly', () => {
    const handleChange = vi.fn();
    const handleSwap = vi.fn();

    render(<PartyForm data={DEFAULT_NDA_DATA} onChange={handleChange} onSwapParties={handleSwap} />);

    expect(screen.getByDisplayValue('Apex Innovations Inc.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nexus Cloud Technologies LLC')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sarah Jenkins')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Marcus Vance')).toBeInTheDocument();
  });

  it('triggers onChange when company name is modified', () => {
    const handleChange = vi.fn();
    const handleSwap = vi.fn();

    render(<PartyForm data={DEFAULT_NDA_DATA} onChange={handleChange} onSwapParties={handleSwap} />);

    const party1Input = screen.getByDisplayValue('Apex Innovations Inc.');
    fireEvent.change(party1Input, { target: { value: 'Updated Company LLC' } });

    expect(handleChange).toHaveBeenCalledWith({
      party1: {
        ...DEFAULT_NDA_DATA.party1,
        companyName: 'Updated Company LLC',
      },
    });
  });

  it('calls onSwapParties when swap button is clicked', () => {
    const handleChange = vi.fn();
    const handleSwap = vi.fn();

    render(<PartyForm data={DEFAULT_NDA_DATA} onChange={handleChange} onSwapParties={handleSwap} />);

    const swapBtn = screen.getByText(/Swap Party 1 & Party 2/i);
    fireEvent.click(swapBtn);

    expect(handleSwap).toHaveBeenCalledTimes(1);
  });
});
