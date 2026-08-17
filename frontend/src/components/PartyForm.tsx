'use client';

import React from 'react';
import { NDAData, NDAParty } from '../types/nda';
import { Building2, User, Mail, MapPin, ArrowLeftRight } from 'lucide-react';

interface PartyFormProps {
  data: NDAData;
  onChange: (updated: Partial<NDAData>) => void;
  onSwapParties: () => void;
}

export const PartyForm: React.FC<PartyFormProps> = ({ data, onChange, onSwapParties }) => {
  const updateParty = (partyKey: 'party1' | 'party2', field: keyof NDAParty, value: string) => {
    onChange({
      [partyKey]: {
        ...data[partyKey],
        [field]: value,
      },
    });
  };

  const renderPartyInputs = (partyKey: 'party1' | 'party2', title: string, badgeText: string, colorScheme: 'indigo' | 'cyan') => {
    const party = data[partyKey];
    const borderAccent = colorScheme === 'indigo' ? 'border-indigo-500/30 hover:border-indigo-500/50' : 'border-cyan-500/30 hover:border-cyan-500/50';
    const badgeBg = colorScheme === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    const pPrefix = partyKey;

    return (
      <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900/60 border ${borderAccent} backdrop-blur-sm transition-all space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className={`w-4 h-4 ${colorScheme === 'indigo' ? 'text-indigo-400' : 'text-cyan-400'}`} />
            <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${badgeBg}`}>
            {badgeText}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Company Name */}
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor={`${pPrefix}-companyName`} className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <span>Company Legal Name</span>
            </label>
            <input
              id={`${pPrefix}-companyName`}
              type="text"
              value={party.companyName}
              onChange={(e) => updateParty(partyKey, 'companyName', e.target.value)}
              placeholder="e.g. Acme Corporation Inc."
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Entity Type */}
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor={`${pPrefix}-entityType`} className="text-xs font-medium text-slate-400">Entity Type & Jurisdiction</label>
            <input
              id={`${pPrefix}-entityType`}
              type="text"
              value={party.entityType}
              onChange={(e) => updateParty(partyKey, 'entityType', e.target.value)}
              placeholder="e.g. Delaware Corporation, California LLC"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Address */}
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor={`${pPrefix}-address`} className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" /> Notice Address
            </label>
            <input
              id={`${pPrefix}-address`}
              type="text"
              value={party.address}
              onChange={(e) => updateParty(partyKey, 'address', e.target.value)}
              placeholder="Full mailing or registered office address"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor={`${pPrefix}-email`} className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" /> Notice Email
            </label>
            <input
              id={`${pPrefix}-email`}
              type="email"
              value={party.email}
              onChange={(e) => updateParty(partyKey, 'email', e.target.value)}
              placeholder="legal@company.com"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Signatory Name */}
          <div className="space-y-1">
            <label htmlFor={`${pPrefix}-signatoryName`} className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-500" /> Signatory Name
            </label>
            <input
              id={`${pPrefix}-signatoryName`}
              type="text"
              value={party.signatoryName}
              onChange={(e) => updateParty(partyKey, 'signatoryName', e.target.value)}
              placeholder="John Smith"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Signatory Title */}
          <div className="space-y-1">
            <label htmlFor={`${pPrefix}-signatoryTitle`} className="text-xs font-medium text-slate-400">Signatory Title</label>
            <input
              id={`${pPrefix}-signatoryTitle`}
              type="text"
              value={party.signatoryTitle}
              onChange={(e) => updateParty(partyKey, 'signatoryTitle', e.target.value)}
              placeholder="CEO / VP Business Dev"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Party 1 */}
      {renderPartyInputs('party1', 'Party 1 (First Disclosing / Receiving Party)', 'Discloser & Recipient', 'indigo')}

      {/* Swap Parties Divider Action */}
      <div className="flex items-center justify-center py-1">
        <button
          type="button"
          onClick={onSwapParties}
          aria-label="Swap Party 1 and Party 2 details"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-all shadow-sm group hover:scale-105 active:scale-95"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-180 transition-transform duration-300" />
          <span>Swap Party 1 & Party 2</span>
        </button>
      </div>

      {/* Party 2 */}
      {renderPartyInputs('party2', 'Party 2 (Second Disclosing / Receiving Party)', 'Discloser & Recipient', 'cyan')}
    </div>
  );
};
