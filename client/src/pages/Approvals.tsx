import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  X,
  Clock,
  DollarSign,
  TrendingDown,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GlowingCard } from '../components/aceternity';
import api from '../services/api';

export const ApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeModalApproval, setActiveModalApproval] = useState<any | null>(null);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/approvals');
      setApprovals(res.data.approvals || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('procureai_token');
        localStorage.removeItem('procureai_user');
        navigate('/login');
      } else {
        setApprovals([]);
      }
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.post(`/approvals/${id}/approve`, { notes: 'Approved by procurement officer.' });
      await fetchApprovals();
      setActiveModalApproval(null);
      navigate('/purchase-orders');
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await api.post(`/approvals/${id}/reject`, { reason: 'Budget allocation deferred.' });
      await fetchApprovals();
      setActiveModalApproval(null);
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 pb-20">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-amber-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Governance & Human Authorization Gate</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Purchase Approvals</h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          The AI negotiates and structures purchase proposals. Every purchase commitment requires explicit human review and authorization.
        </p>
      </div>

      {/* Approvals Cards */}
      <div className="space-y-4">
        {approvals.length === 0 ? (
          <div className="bg-[#09090d]/60 border border-white/[0.07] rounded-3xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-slate-200">No Pending Approvals</h3>
            <p className="text-xs text-slate-500 mt-1">All AI procurement proposals have been authorized.</p>
          </div>
        ) : (
          approvals.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#09090d]/80 border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                      {app.procurementId?.referenceNumber || 'PR-1048'}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-xs text-slate-400">Recommended Supplier: {app.vendorName}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{app.title}</h2>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-white tracking-tight font-mono">
                    {formatCurrency(app.subtotal)}
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold font-mono">
                    Saved {formatCurrency(app.estimatedSavings)} ({app.savingsPct}%)
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
                <span className="text-purple-400 font-semibold block mb-1">AI Recommendation Rationale:</span>
                {app.justification}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Lead Time</span>
                  <span className="font-semibold text-slate-200">{app.deliveryDays} Business Days</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Warranty</span>
                  <span className="font-semibold text-emerald-400">5-Year Commercial</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Covenant</span>
                  <span className="font-semibold text-slate-200">Net 30 Post QA</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Status</span>
                  <span className={`font-semibold capitalize font-mono ${app.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {app.status === 'pending' && (
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    onClick={() => handleReject(app._id)}
                    disabled={processingId === app._id}
                    className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-950/20 text-xs font-semibold transition"
                  >
                    Reject Proposal
                  </button>
                  <button
                    onClick={() => setActiveModalApproval(app)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Purchase & Issue PO</span>
                  </button>
                </div>
              )}

              {app.status === 'approved' && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-xl">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Authorized by Procurement Lead. Official Purchase Order issued.
                  </span>
                  <button
                    onClick={() => navigate('/purchase-orders')}
                    className="text-white underline font-semibold flex items-center gap-1 hover:text-emerald-300"
                  >
                    View Purchase Order <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {activeModalApproval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#09090d] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">Human Authorization</div>
                  <h3 className="text-lg font-bold text-white">Authorize Purchase Order</h3>
                </div>
                <button
                  onClick={() => setActiveModalApproval(null)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-black/60 rounded-2xl border border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Supplier:</span>
                  <span className="font-bold text-white">{activeModalApproval.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Purchase Commitment:</span>
                  <span className="font-bold text-lg text-emerald-400 font-mono">
                    {formatCurrency(activeModalApproval.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Savings:</span>
                  <span className="font-bold text-purple-300 font-mono">
                    +{formatCurrency(activeModalApproval.estimatedSavings)} ({activeModalApproval.savingsPct}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setActiveModalApproval(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(activeModalApproval._id)}
                  disabled={processingId === activeModalApproval._id}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{processingId === activeModalApproval._id ? 'Generating PO...' : 'Confirm Authorization'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
