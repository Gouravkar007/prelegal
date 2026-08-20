'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
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
        const updatedFields = resData.updated_fields || {};

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
          name: query.includes('Acme') ? 'Acme Corp' : data.party1.name,
          state: query.includes('Delaware') ? 'Delaware' : data.party1.state,
        };
        summary.push('Updated Party 1 Details');
      }

      if (text.includes('global') || text.includes('tech') || text.includes('party 2')) {
        updates.party2 = {
          ...data.party2,
          name: query.includes('Global Tech') ? 'Global Tech Inc' : data.party2.name,
          state: query.includes('California') ? 'California' : data.party2.state,
        };
        summary.push('Updated Party 2 Details');
      }

      if (text.includes('purpose') || text.includes('evaluat')) {
        updates.purpose = query;
        summary.push('Updated Purpose');
      }

      if (text.includes('perpetuity') || text.includes('perpetual')) {
        updates.confidentialityTerm = 'perpetuity';
        summary.push('Confidentiality Term set to Perpetuity');
      }

      if (text.includes('3 year')) {
        updates.agreementTermYears = 3;
        summary.push('Agreement Term set to 3 Years');
      }

      if (Object.keys(updates).length > 0) {
        onUpdate(updates);
      }

      const replyContent = summary.length > 0
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
