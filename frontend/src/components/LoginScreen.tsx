'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Mail, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo.user@prelegal.io');
  const [name, setName] = useState('Gourav Kar');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      email: email || 'user@prelegal.io',
      name: name || 'PreLegal User',
    });
  };

  const handleQuickDemo = () => {
    onLogin({
      email: 'demo@prelegal.io',
      name: 'Demo Account',
    });
  };

  return (
    <div className="min-h-screen bg-[#032147] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#209dd7] selection:text-white">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#209dd7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#753991]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#209dd7] to-[#ecad0a] shadow-xl shadow-[#209dd7]/20 ring-2 ring-white/10 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome to <span className="text-[#ecad0a]">PreLegal</span>
          </h1>
          <p className="text-sm text-[#888888]">
            Standard Common Paper Legal Agreement Workspace (V1)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 pb-4 border-b border-slate-800 text-center sm:text-left">
            <h2 className="text-lg font-bold text-slate-100">Sign in to your workspace</h2>
            <p className="text-xs text-[#888888] mt-1">
              (Prototype Demo Mode — enter any credentials to enter platform)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-[#888888] focus:outline-none focus:border-[#209dd7] focus:ring-1 focus:ring-[#209dd7] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-[#888888] focus:outline-none focus:border-[#209dd7] focus:ring-1 focus:ring-[#209dd7] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-[#888888] focus:outline-none focus:border-[#209dd7] focus:ring-1 focus:ring-[#209dd7] transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button (Purple Secondary #753991) */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#753991] hover:bg-[#8844a8] active:scale-[0.99] shadow-lg shadow-[#753991]/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Sign In & Enter Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-xs text-[#888888] uppercase tracking-wider">
              Or Instant Access
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Demo Guest</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#888888] mt-6">
          PreLegal V1 &copy; 2026 Common Paper Legal Agreements
        </p>
      </div>
    </div>
  );
};
