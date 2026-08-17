'use client';

import React from 'react';
import { X, Search, FileText, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TemplateItem {
  name: string;
  description: string;
  filename: string;
}

const CATALOG_DATA: TemplateItem[] = [
  {
    name: "Common Paper Mutual NDA",
    description: "Standard mutual non-disclosure agreement for sharing confidential information between two parties.",
    filename: "Mutual-NDA.md"
  },
  {
    name: "Common Paper Mutual NDA Cover Page",
    description: "Cover page and key terms summary sheet for the Common Paper Mutual NDA.",
    filename: "Mutual-NDA-coverpage.md"
  },
  {
    name: "Common Paper Cloud Service Agreement (CSA)",
    description: "Standard cloud service agreement (SaaS agreement) establishing terms for software subscriptions, service availability, and usage.",
    filename: "CSA.md"
  },
  {
    name: "Common Paper Service Level Agreement (SLA) Addendum",
    description: "Service level agreement addendum defining uptime commitments, support response times, and service credits.",
    filename: "sla.md"
  },
  {
    name: "Common Paper Data Processing Addendum (DPA)",
    description: "Data processing addendum governing data privacy, GDPR compliance, and data controller/processor responsibilities.",
    filename: "DPA.md"
  },
  {
    name: "Common Paper Design Partner Agreement",
    description: "Agreement for early-stage design partners testing products and providing feedback.",
    filename: "design-partner-agreement.md"
  },
  {
    name: "Common Paper Professional Services Agreement (PSA)",
    description: "Framework agreement for professional services, consulting, and statements of work (SOW).",
    filename: "psa.md"
  },
  {
    name: "Common Paper Partnership Agreement",
    description: "Commercial partnership agreement for co-marketing, referral, or reseller partnerships.",
    filename: "Partnership-Agreement.md"
  },
  {
    name: "Common Paper Business Associate Agreement (BAA) Addendum",
    description: "Business associate agreement addendum for HIPAA compliance and handling Protected Health Information (PHI).",
    filename: "BAA.md"
  },
  {
    name: "Common Paper Software License Agreement",
    description: "On-premises or downloadable software license agreement governing software installation, scope of use, and audit rights.",
    filename: "Software-License-Agreement.md"
  },
  {
    name: "Common Paper Pilot Agreement",
    description: "Short-term pilot agreement for evaluating software or services during a trial period.",
    filename: "Pilot-Agreement.md"
  },
  {
    name: "Common Paper AI Addendum",
    description: "Addendum governing the use of Artificial Intelligence features, model training rights, and AI output ownership.",
    filename: "AI-Addendum.md"
  }
];

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = CATALOG_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-100">Common Paper Legal Templates Dataset</h2>
              <p className="text-xs text-slate-400">12 standard open-source legal agreements & addendums</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close catalog modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search legal templates"
              placeholder="Search legal templates by name or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* List of Templates */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h3>
                </div>
                {item.filename.includes('Mutual-NDA') ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active in Editor
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">{item.filename}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{item.description}</p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              No templates found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
