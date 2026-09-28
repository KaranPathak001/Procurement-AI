import React, { useState } from 'react';
import { Settings, Shield, Sliders, Key, Building2, Bell, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const SettingsPage: React.FC = () => {
  const [autoNegotiate, setAutoNegotiate] = useState(true);
  const [maxAutoBudget, setMaxAutoBudget] = useState(25000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>Enterprise Configuration & Governance Policy</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Organization Settings</h1>
        <p className="text-slate-400 text-sm">
          Configure autonomous agent boundaries, spending threshold limits, and approval policies.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          Autonomous Agent Guardrails
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block text-sm">Autonomous Negotiation Engine</span>
              <span className="text-slate-400">
                Allow AI to automatically propose volume discount incentives to shortlisted suppliers.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoNegotiate}
              onChange={(e) => setAutoNegotiate(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <span className="font-semibold text-white block text-sm">Human Approval Threshold</span>
            <span className="text-slate-400 block">
              Orders requiring explicit executive approval. (Rule: AI never autonomously commits money).
            </span>
            <div className="pt-2 flex items-center space-x-3">
              <span className="text-slate-300 font-mono">$0 (Always Require Human Approval)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-950/40 hover:scale-102 transition"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : null}
            <span>{saved ? 'Saved Successfully' : 'Save Governance Rules'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
