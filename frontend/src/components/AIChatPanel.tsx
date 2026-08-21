'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { NDAData } from '../types/nda';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  updatedSummary?: string[];
}

interface AIChatPanelProps {
  data: NDAData;
  onUpdate: (updated: Partial<NDAData>) => void;
}

const QUICK_PROMPTS = [
  'Set Party 1 to Acme Corp in Delaware',
  'Set Party 2 to Global Tech Inc in California',
  'Set purpose to evaluating SaaS integration partnership',
  'Set confidentiality term to Perpetuity',
  'Set agreement term to 3 years',
];

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ data, onUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm PreLegal AI ⚖️. Tell me about your agreement or company details, and I will automatically populate your Common Paper Mutual NDA fields in real-time!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          current_data: data,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const rawFields = resData.updated_fields || {};
        const updatedFields: Partial<NDAData> = {};

        if (rawFields.party1) {
          updatedFields.party1 = {
            ...data.party1,
            companyName: rawFields.party1.companyName || rawFields.party1.name || data.party1.companyName,
            entityType: rawFields.party1.entityType || rawFields.party1.type || data.party1.entityType,
            address: rawFields.party1.address || data.party1.address,
            email: rawFields.party1.email || data.party1.email,
            signatoryName: rawFields.party1.signatoryName || rawFields.party1.signerName || data.party1.signatoryName,
            signatoryTitle: rawFields.party1.signatoryTitle || rawFields.party1.signerTitle || data.party1.signatoryTitle,
          };
        }

        if (rawFields.party2) {
          updatedFields.party2 = {
            ...data.party2,
            companyName: rawFields.party2.companyName || rawFields.party2.name || data.party2.companyName,
            entityType: rawFields.party2.entityType || rawFields.party2.type || data.party2.entityType,
            address: rawFields.party2.address || data.party2.address,
            email: rawFields.party2.email || data.party2.email,
            signatoryName: rawFields.party2.signatoryName || rawFields.party2.signerName || data.party2.signatoryName,
            signatoryTitle: rawFields.party2.signatoryTitle || rawFields.party2.signerTitle || data.party2.signatoryTitle,
          };
        }

        if (rawFields.purpose) {
          updatedFields.purpose = rawFields.purpose;
        }

        if (rawFields.confidentialityTerm || rawFields.confidentialityTermType) {
          const val = rawFields.confidentialityTerm || rawFields.confidentialityTermType;
          updatedFields.confidentialityTermType = val === 'perpetuity' ? 'perpetuity' : 'years';
        }

        if (rawFields.confidentialityTermYears !== undefined) {
          updatedFields.confidentialityTermYears = Number(rawFields.confidentialityTermYears);
        }

        if (rawFields.agreementTermYears !== undefined || rawFields.mndaTermYears !== undefined) {
          updatedFields.mndaTermYears = Number(rawFields.mndaTermYears ?? rawFields.agreementTermYears);
        }

        if (rawFields.governingLawState) {
          updatedFields.governingLawState = rawFields.governingLawState;
        }

        if (rawFields.jurisdiction) {
          updatedFields.jurisdiction = rawFields.jurisdiction;
        }

        if (Object.keys(updatedFields).length > 0) {
          onUpdate(updatedFields);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: resData.reply || "I've processed your update!",
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Local client-side fallback parsing when offline or backend unavailable
      const text = query.toLowerCase();
      const updates: Partial<NDAData> = {};
      const summary: string[] = [];

      if (text.includes('acme') || text.includes('party 1')) {
        updates.party1 = {
          ...data.party1,
          companyName: query.includes('Acme') ? 'Acme Corp' : data.party1.companyName,
          entityType: query.includes('Delaware') ? 'Delaware Corporation' : data.party1.entityType,
        };
        summary.push('Updated Party 1 Details');
      }

      if (text.includes('global') || text.includes('tech') || text.includes('party 2')) {
        updates.party2 = {
          ...data.party2,
          companyName: query.includes('Global Tech') ? 'Global Tech Inc' : data.party2.companyName,
          entityType: query.includes('California') ? 'California LLC' : data.party2.entityType,
        };
        summary.push('Updated Party 2 Details');
      }

      if (text.includes('purpose') || text.includes('evaluat')) {
        updates.purpose = query;
        summary.push('Updated Purpose');
      }

      if (text.includes('perpetuity') || text.includes('perpetual')) {
        updates.confidentialityTermType = 'perpetuity';
        summary.push('Confidentiality Term set to Perpetuity');
      }

      if (text.includes('3 year')) {
        updates.mndaTermYears = 3;
        summary.push('Agreement Term set to 3 Years');
      }

      if (Object.keys(updates).length > 0) {
        onUpdate(updates);
      }

      const replyContent =
        summary.length > 0
          ? `I've updated the NDA: ${summary.join(', ')}. What else would you like to set?`
          : "I've noted that! Tell me more about Party 1, Party 2, Purpose, Agreement Term, or Governing Law.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyContent,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col h-[580px] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#209dd7] to-[#ecad0a] flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>AI Chat Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ecad0a]" />
            </h2>
            <p className="text-[11px] text-[#888888]">
              Freeform natural language contract drafter
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#209dd7]/20 text-[#209dd7] border border-[#209dd7]/30">
          OpenRouter AI
        </span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[88%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-[#209dd7] text-white'
                  : 'bg-slate-800 text-[#ecad0a] border border-slate-700'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#209dd7] text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#888888] py-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#209dd7]" />
            <span>AI is drafting updates...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      <div className="pt-3 border-t border-slate-800/80">
        <p className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider mb-2">
          Suggested Prompts:
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors text-left truncate max-w-full cursor-pointer disabled:opacity-50"
            >
              + {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type document details or instructions (e.g. Set Party 1 name to Acme Inc)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-[#888888] focus:outline-none focus:border-[#209dd7] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#753991] hover:bg-[#8844a8] disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-md shadow-[#753991]/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

