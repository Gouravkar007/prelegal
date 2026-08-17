'use client';

import React from 'react';
import { NDAData } from '../types/nda';
import { Calendar, ShieldAlert, Scale, Clock, Sparkles, Edit3 } from 'lucide-react';

interface TermsFormProps {
  data: NDAData;
  onChange: (updated: Partial<NDAData>) => void;
}

const PURPOSE_PRESETS = [
  'Evaluating whether to enter into a commercial partnership, software integration, and joint product offering between the parties.',
  'Evaluating a potential strategic investment, merger, acquisition, or equity purchase transaction.',
  'Sharing technical specifications, proprietary code, and system architecture for a vendor software audit.',
  'Discussing a joint research & development project and mutual technological collaboration.',
];

const GOVERNING_STATES = [
  'Delaware',
  'California',
  'New York',
  'Texas',
  'Massachusetts',
  'Washington',
  'Illinois',
  'Florida',
  'Colorado',
  'United Kingdom',
];

export const TermsForm: React.FC<TermsFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Purpose Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Agreement Purpose</h3>
          </div>
          <span className="text-[11px] text-slate-400">Required Field</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400">
            How Confidential Information may be used by either party
          </label>
          <textarea
            rows={3}
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
            placeholder="Describe the evaluation or business relationship purpose..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          />

          {/* Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-500">Quick Purpose Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {PURPOSE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ purpose: preset })}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 border border-slate-700/60 transition-all text-left"
                >
                  {preset.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Duration Terms Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Effective Date & Agreement Duration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Effective Date */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" /> Effective Date
            </label>
            <input
              type="date"
              value={data.effectiveDate}
              onChange={(e) => onChange({ effectiveDate: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* MNDA Term Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">MNDA Agreement Term</label>
            <div className="flex items-center gap-2">
              <select
                value={data.mndaTermType}
                onChange={(e) => onChange({ mndaTermType: e.target.value as any })}
                className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer flex-1"
              >
                <option value="expires_years">Expires after fixed years</option>
                <option value="until_terminated">Continues until terminated</option>
              </select>

              {data.mndaTermType === 'expires_years' && (
                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={data.mndaTermYears}
                    onChange={(e) => onChange({ mndaTermYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-400">Yr(s)</span>
                </div>
              )}
            </div>
          </div>

          {/* Confidentiality Term Selection */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-slate-400">
              Term of Confidentiality Protection
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={data.confidentialityTermType}
                onChange={(e) => onChange({ confidentialityTermType: e.target.value as any })}
                className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer flex-1"
              >
                <option value="years">Fixed number of years from Effective Date</option>
                <option value="perpetuity">In perpetuity (Indefinite protection)</option>
              </select>

              {data.confidentialityTermType === 'years' && (
                <div className="flex items-center gap-1 w-full sm:w-32">
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={data.confidentialityTermYears}
                    onChange={(e) =>
                      onChange({ confidentialityTermYears: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-2 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">Yr(s) post-term</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Note: Trade secrets remain protected for as long as they constitute a trade secret under applicable law.
            </p>
          </div>
        </div>
      </div>

      {/* Governing Law & Jurisdiction */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Scale className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Governing Law & Jurisdiction</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Governing Law State */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Governing Law State</label>
            <div className="flex gap-2">
              <select
                value={data.governingLawState}
                onChange={(e) => onChange({ governingLawState: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {GOVERNING_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jurisdiction */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Court Jurisdiction Location</label>
            <input
              type="text"
              value={data.jurisdiction}
              onChange={(e) => onChange({ jurisdiction: e.target.value })}
              placeholder="e.g. courts located in Wilmington, DE"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Custom Modifications / Special Clauses */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-sm">MNDA Modifications</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">
            Special Amendments or Overrides to Standard Terms (Optional)
          </label>
          <textarea
            rows={2}
            value={data.modifications}
            onChange={(e) => onChange({ modifications: e.target.value })}
            placeholder="Type 'None.' or specify section modifications..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};
