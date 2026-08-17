import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatalogModal } from '../components/CatalogModal';

describe('CatalogModal Component', () => {
  it('renders modal content when open', () => {
    const handleClose = vi.fn();
    render(<CatalogModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('Common Paper Legal Templates Dataset')).toBeInTheDocument();
    expect(screen.getByText('Common Paper Cloud Service Agreement (CSA)')).toBeInTheDocument();
  });

  it('filters templates when searching', () => {
    const handleClose = vi.fn();
    render(<CatalogModal isOpen={true} onClose={handleClose} />);

    const searchInput = screen.getByPlaceholderText(/Search legal templates/i);
    fireEvent.change(searchInput, { target: { value: 'AI Addendum' } });

    expect(screen.getByText('Common Paper AI Addendum')).toBeInTheDocument();
    expect(screen.queryByText('Common Paper Cloud Service Agreement (CSA)')).not.toBeInTheDocument();
  });
});
