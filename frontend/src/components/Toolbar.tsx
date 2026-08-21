'use client';

import React from 'react';
import { NDAData } from '../types/nda';
import { Download, Copy, Printer, Check, FileDown, Sparkles, Loader2, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ToolbarProps {
  data: NDAData;
  documentRef: React.RefObject<HTMLDivElement | null>;
  userId?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({ data, documentRef, userId }) => {
  const [copied, setCopied] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSaveDocument = async () => {
    try {
      setIsSaving(true);
      const title = `${data.party1.companyName || 'Party 1'} vs ${data.party2.companyName || 'Party 2'} Agreement`;
      const docType = data.documentType || 'Common Paper Mutual NDA';

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || 1,
          title,
          document_type: docType,
          data,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        triggerConfetti();
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'],
    });
  };

  const generateMarkdown = () => {
    return `# Mutual Non-Disclosure Agreement

## Cover Page

### Purpose
${data.purpose}

### Effective Date
${data.effectiveDate}

### MNDA Term
${data.mndaTermType === 'expires_years' ? `- [x] Expires ${data.mndaTermYears} year(s) from Effective Date.` : `- [x] Continues until terminated.`}

### Term of Confidentiality
${data.confidentialityTermType === 'years' ? `- [x] ${data.confidentialityTermYears} year(s) from Effective Date.` : `- [x] In perpetuity.`}

### Governing Law & Jurisdiction
Governing Law: ${data.governingLawState}
Jurisdiction: ${data.jurisdiction}

### MNDA Modifications
${data.modifications}

### Signatures

| FIELD | PARTY 1 | PARTY 2 |
|:--- |:--- |:--- |
| **Print Name** | ${data.party1.signatoryName} | ${data.party2.signatoryName} |
| **Title** | ${data.party1.signatoryTitle} | ${data.party2.signatoryTitle} |
| **Company** | ${data.party1.companyName} (${data.party1.entityType}) | ${data.party2.companyName} (${data.party2.entityType}) |
| **Notice Address** | ${data.party1.address} (${data.party1.email}) | ${data.party2.address} (${data.party2.email}) |
| **Date** | ${data.effectiveDate} | ${data.effectiveDate} |

---

# Common Paper Mutual NDA Standard Terms (v1.0)

1. **Introduction**. This Mutual Non-Disclosure Agreement...
2. **Use and Protection of Confidential Information**...
3. **Exceptions**...
4. **Disclosures Required by Law**...
5. **Term and Termination**...
6. **Return or Destruction of Confidential Information**...
7. **Proprietary Rights**...
8. **Disclaimer**...
9. **Governing Law and Jurisdiction**. State of ${data.governingLawState}, courts in ${data.jurisdiction}.
10. **Equitable Relief**...
11. **General**...
`;
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = md;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy markdown failed:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const p1 = (data.party1.companyName || 'Party1').replace(/[^a-zA-Z0-9_-]/g, '');
    const p2 = (data.party2.companyName || 'Party2').replace(/[^a-zA-Z0-9_-]/g, '');
    link.download = `MNDA_${p1}_vs_${p2}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerConfetti();
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsExportingPdf(true);
      const canvasEl = documentRef.current;

      const canvas = await html2canvas(canvasEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 2) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const p1Name = (data.party1.companyName || 'Party1').replace(/[^a-zA-Z0-9_-]/g, '');
      const p2Name = (data.party2.companyName || 'Party2').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `MNDA_${p1Name}_vs_${p2Name}.pdf`;

      pdf.save(filename);
      triggerConfetti();
    } catch (err) {
      console.error('PDF Export failed, falling back to print dialog:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    triggerConfetti();
    window.print();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xl print:hidden">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-semibold text-slate-200">Export & Share NDA</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Save Document */}
        <button
          type="button"
          onClick={handleSaveDocument}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#753991] hover:bg-[#8844a8] text-white transition-all shadow-md shadow-[#753991]/20 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{isSaving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Document'}</span>
        </button>
        {/* Copy Markdown */}
        <button
          type="button"
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
        </button>

        {/* Download .md */}
        <button
          type="button"
          onClick={handleDownloadMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
        >
          <FileDown className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download .MD</span>
        </button>

        {/* Direct PDF File Download */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isExportingPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          {isExportingPdf ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
        </button>

        {/* Browser Print / Save PDF Dialog */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white transition-all shadow-md shadow-indigo-500/20"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};
