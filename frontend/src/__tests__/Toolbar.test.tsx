import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toolbar } from '../components/Toolbar';
import { DEFAULT_NDA_DATA } from '../types/nda';

describe('Toolbar Component', () => {
  it('renders export buttons correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Toolbar data={DEFAULT_NDA_DATA} documentRef={ref} />);

    expect(screen.getByText('Copy Markdown')).toBeInTheDocument();
    expect(screen.getByText('Download .MD')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('triggers window.print when Print button is clicked', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Toolbar data={DEFAULT_NDA_DATA} documentRef={ref} />);

    const printBtn = screen.getByText('Print');
    fireEvent.click(printBtn);

    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
