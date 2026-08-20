'use client';

import React from 'react';
import { FileText, BookOpen, RotateCcw, Sparkles, Shield, Download, Check, LogOut, User as UserIcon } from 'lucide-react';
import { SAMPLE_PRESETS, NDAData } from '../types/nda';

interface HeaderProps {
  onOpenCatalog: () => void;
  onReset: () => void;
  onSelectPreset: (data: Partial<NDAData>) => void;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  user?: { email: string; name: string } | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCatalog,
  onReset,
  onSelectPreset,
  activeTab,
  setActiveTab,
  user,
  onSignOut,
}) => {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>('');

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPresetId(val);
    if (!val) return;
    const preset = SAMPLE_PRESETS.find((p) => p.id === val);
    if (preset) {
      onSelectPreset(preset.data);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#209dd7] to-[#ecad0a] flex items-center justify-center shadow-lg shadow-[#209dd7]/20 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                PreLegal
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#209dd7]/20 text-[#209dd7] border border-[#209dd7]/30 uppercase">
                MNDA Creator (V1)
              </span>
            </div>
            <p className="text-xs text-[#888888] hidden sm:block">
              Common Paper Standard Mutual NDA
            </p>
          </div>
        </div>

        {/* Center Tab Toggle (Mobile Switcher) */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 md:hidden">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-[#209dd7] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Form
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-[#209dd7] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Preview NDA
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Badge & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-slate-800/70 border border-slate-700">
              <div className="w-6 h-6 rounded-full bg-[#209dd7]/20 text-[#209dd7] flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[120px] truncate">
                {user.name}
              </span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  aria-label="Sign out of PreLegal workspace"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Preset Scenario Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/90 rounded-lg px-2.5 py-1.5 border border-slate-700">
            <Sparkles className="w-4 h-4 text-[#ecad0a] shrink-0" />
            <select
              value={selectedPresetId}
              onChange={handlePresetChange}
              aria-label="Load Sample NDA Preset Scenario"
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[180px]"
            >
              <option value="" className="bg-slate-800 text-slate-400">
                Load Sample Preset...
              </option>
              {SAMPLE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-slate-800 text-white">
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Catalog Library Modal Trigger */}
          <button
            onClick={onOpenCatalog}
            aria-label="Browse all 12 Common Paper legal templates catalog"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
            title="Browse all 12 Common Paper Legal Templates"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#209dd7]" />
            <span className="hidden sm:inline">Templates Catalog</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            aria-label="Reset all fields to default values"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            title="Reset to default fields"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
