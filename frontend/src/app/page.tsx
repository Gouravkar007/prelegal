'use client';

import React from 'react';
import { DEFAULT_NDA_DATA, NDAData } from '../types/nda';
import { Header } from '../components/Header';
import { PartyForm } from '../components/PartyForm';
import { TermsForm } from '../components/TermsForm';
import { NDADocumentPreview } from '../components/NDADocumentPreview';
import { Toolbar } from '../components/Toolbar';
import { CatalogModal } from '../components/CatalogModal';
import { SavedDocumentsModal } from '../components/SavedDocumentsModal';
import { LoginScreen } from '../components/LoginScreen';
import { AIChatPanel } from '../components/AIChatPanel';
import { Users, FileText, Bot, Sparkles } from 'lucide-react';

export default function Home() {
  const [user, setUser] = React.useState<{ id?: number; email: string; name: string } | null>(null);
  const [ndaData, setNdaData] = React.useState<NDAData>(DEFAULT_NDA_DATA);
  const [stepTab, setStepTab] = React.useState<'chat' | 'parties' | 'terms'>('chat');
  const [mobileActiveTab, setMobileActiveTab] = React.useState<'edit' | 'preview'>('edit');
  const [isCatalogOpen, setIsCatalogOpen] = React.useState(false);
  const [isSavedDocsOpen, setIsSavedDocsOpen] = React.useState(false);

  const documentRef = React.useRef<HTMLDivElement | null>(null);

  const handleLogin = (userCreds: { id?: number; email: string; name: string }) => {
    setUser(userCreds);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleUpdate = (updated: Partial<NDAData>) => {
    setNdaData((prev) => ({ ...prev, ...updated }));
  };

  const handleSwapParties = () => {
    setNdaData((prev) => ({
      ...prev,
      party1: prev.party2,
      party2: prev.party1,
    }));
  };

  const handleSelectPreset = (presetData: Partial<NDAData>) => {
    setNdaData((prev) => ({ ...prev, ...presetData }));
  };

  const handleReset = () => {
    setNdaData(DEFAULT_NDA_DATA);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenSavedDocs={() => setIsSavedDocsOpen(true)}
        onReset={handleReset}
        onSelectPreset={handleSelectPreset}
        activeTab={mobileActiveTab}
        setActiveTab={setMobileActiveTab}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block print:w-full print:p-0 print:m-0">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDITOR (Tabs: AI Chat, Party Details, MNDA Terms) */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileActiveTab === 'preview' ? 'hidden lg:block' : 'block'
          } print:hidden`}
        >
          {/* Sub-header step selector */}
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setStepTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                stepTab === 'chat'
                  ? 'bg-gradient-to-r from-[#209dd7] to-[#753991] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setStepTab('parties')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                stepTab === 'parties'
                  ? 'bg-[#209dd7] text-white shadow-md shadow-[#209dd7]/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Parties</span>
            </button>
            <button
              onClick={() => setStepTab('terms')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                stepTab === 'terms'
                  ? 'bg-[#209dd7] text-white shadow-md shadow-[#209dd7]/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>
          </div>

          {/* Form / Chat Step Content */}
          <div className="transition-all duration-300">
            {stepTab === 'chat' ? (
              <AIChatPanel data={ndaData} onUpdate={handleUpdate} />
            ) : stepTab === 'parties' ? (
              <PartyForm data={ndaData} onChange={handleUpdate} onSwapParties={handleSwapParties} />
            ) : (
              <TermsForm data={ndaData} onChange={handleUpdate} />
            )}
          </div>

          {/* Quick step navigation bar */}
          <div className="flex items-center justify-between pt-2">
            {stepTab === 'terms' ? (
              <button
                onClick={() => setStepTab('parties')}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                &larr; Back to Party Details
              </button>
            ) : (
              <div />
            )}

            {stepTab === 'parties' && (
              <button
                onClick={() => setStepTab('terms')}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#209dd7] hover:bg-[#1a85b8] text-white text-xs font-semibold shadow-md shadow-[#209dd7]/20 transition-all cursor-pointer"
              >
                <span>Continue to Agreement Terms</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE DOCUMENT PREVIEW & TOOLBAR */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileActiveTab === 'edit' ? 'hidden lg:block' : 'block'
          } print:block print:w-full print:m-0 print:p-0`}
        >
          {/* Action Toolbar */}
          <Toolbar data={ndaData} documentRef={documentRef} userId={user.id} />

          {/* Document Render Canvas */}
          <NDADocumentPreview data={ndaData} documentRef={documentRef} />
        </div>
      </main>

      {/* Common Paper Catalog Modal */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        currentDocumentType={ndaData.documentType}
        onSelectTemplate={(templateName) => handleUpdate({ documentType: templateName })}
      />

      {/* Saved Documents History Modal */}
      <SavedDocumentsModal
        isOpen={isSavedDocsOpen}
        onClose={() => setIsSavedDocsOpen(false)}
        userId={user.id}
        onLoadDocument={(loadedData) => setNdaData(loadedData)}
      />
    </div>
  );
}

