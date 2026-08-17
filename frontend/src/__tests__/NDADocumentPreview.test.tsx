import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NDADocumentPreview } from '../components/NDADocumentPreview';
import { DEFAULT_NDA_DATA } from '../types/nda';

describe('NDADocumentPreview Component', () => {
  it('renders party names and standard terms in the document canvas', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NDADocumentPreview data={DEFAULT_NDA_DATA} documentRef={ref} />);

    expect(screen.getAllByText(/Apex Innovations Inc./i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nexus Cloud Technologies LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Common Paper Mutual Non-Disclosure Agreement/i).length).toBeGreaterThan(0);
  });

  it('allows toggling between full agreement, cover page, and standard terms', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NDADocumentPreview data={DEFAULT_NDA_DATA} documentRef={ref} />);

    const coverOnlyBtn = screen.getByRole('button', { name: 'Cover Page' });
    fireEvent.click(coverOnlyBtn);
    expect(screen.getByText('USING THIS MUTUAL NON-DISCLOSURE AGREEMENT')).toBeInTheDocument();

    const termsOnlyBtn = screen.getByRole('button', { name: 'Standard Terms' });
    fireEvent.click(termsOnlyBtn);
    expect(screen.getByText(/1. Introduction./i)).toBeInTheDocument();
  });
});
