import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  BadgeCheck,
  ArrowUpRight,
  ChevronRight,
  Plus,
  PackageOpen,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GlowingCard } from '../components/aceternity';
import api from '../services/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>({});
  const [procurements, setProcurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('procureai_user');
  const user = userJson ? JSON.parse(userJson) : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricRes, procRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/procurements'),
        ]);
        if (metricRes.data?.metrics) setMetrics(metricRes.data.metrics);
        if (procRes.data?.procurements) setProcurements(procRes.data.procurements);
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message;
        if (err.response?.status === 401) {
          localStorage.removeItem('procureai_token');
          localStorage.removeItem('procureai_user');
          navigate('/login');
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      pending_approval: { label: 'Pending Approval', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      po_issued: { label: 'PO Issued', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      approved: { label: 'PO Issued', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      fulfilled: { label: 'Fulfilled', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      negotiating: { label: 'Negotiating', class: 'bg-purple-500/10 text-purple-300 border-purple-500/30 animate-pulse' },
      quotes_received: { label: 'Quotes Received', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      rfq_sent: { label: 'RFQ Sent', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
      supplier_discovery: { label: 'Sourcing Vendors', class: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
      understanding: { label: 'AI Processing', class: 'bg-slate-500/10 text-slate-400 border-slate-500/30 animate-pulse' },
    };
    const cfg = map[status] || { label: status, class: 'bg-slate-800 text-slate-400 border-slate-700' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${cfg.class}`}>
        {cfg.label}
      </span>
    );
  };

  const firstName = user.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[#09090d]/80 border border-white/[0.07] backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
              {user.companyName || 'Procurement Operations'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Good morning, {firstName}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            {procurements.length > 0
              ? `You have ${procurements.length} active procurement cycle${procurements.length > 1 ? 's' : ''} running. Your AI agent is working in the background.`
              : 'Your AI procurement workspace is ready. Create your first procurement request to get started.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            to="/new-procurement"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-950/40 transition-all hover:scale-[1.02] text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Procurement</span>
          </Link>
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowingCard glowColor="rgba(147, 51, 234, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Sourcing</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? '—' : (metrics.activeRequests ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.activeRequests > 0 ? 'Automated cycle active' : 'No active requests'}
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(16, 185, 129, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Captured Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
            {loading ? '—' : formatCurrency(metrics.potentialSavings ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.potentialSavings > 0 ? 'From approved POs' : 'No orders yet'}
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(59, 130, 246, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Vendor Spend</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {loading ? '—' : formatCurrency(metrics.vendorSpend ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.totalOrders > 0
              ? `Across ${metrics.totalOrders} purchase order${metrics.totalOrders > 1 ? 's' : ''}`
              : 'No spend yet'}
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(245, 158, 11, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Approvals</span>
            <BadgeCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">
            {loading ? '—' : (metrics.pendingApprovals ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.pendingApprovals > 0 ? (
              <Link to="/approvals" className="text-amber-400/90 hover:underline flex items-center gap-0.5">
                Requires sign-off <ChevronRight className="w-3 h-3" />
              </Link>
            ) : (
              'All clear'
            )}
          </div>
        </GlowingCard>
      </div>

      {/* Active Procurements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Procurements</h2>
            <p className="text-xs text-slate-400">Live sourcing operations managed by your AI agent.</p>
          </div>
          {procurements.length > 0 && (
            <Link
              to="/procurements"
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {!loading && procurements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-2xl bg-[#09090d]/60 border border-dashed border-white/[0.08] text-center"
          >
            <PackageOpen className="w-10 h-10 text-slate-600 mb-4" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">No procurement requests yet</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Create your first procurement request and let your AI agent handle vendor discovery, RFQs, and negotiation automatically.
            </p>
            <Link
              to="/new-procurement"
              className="mt-6 flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Procurement</span>
            </Link>
          </motion.div>
        )}

        {/* Procurements Grid */}
        {procurements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procurements.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/procurements/${item._id}`)}
                className="p-5 rounded-2xl bg-[#09090d]/70 border border-white/[0.07] hover:border-purple-500/30 cursor-pointer backdrop-blur-md transition-all group hover:shadow-2xl hover:shadow-purple-950/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
                        {item.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-purple-200 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Budget & Recommendation */}
                <div className="mt-4 pt-3 border-t border-white/[0.05] grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Budget</span>
                    <span className="font-semibold text-slate-200 font-mono">
                      {formatCurrency(item.budget, item.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Best Quote</span>
                    <span className="font-semibold text-white font-mono">
                      {item.aiRecommendation?.finalPrice
                        ? formatCurrency(item.aiRecommendation.finalPrice, item.currency)
                        : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Savings</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      {item.aiRecommendation?.savingsAmount
                        ? `+${formatCurrency(item.aiRecommendation.savingsAmount, item.currency)}`
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {item.assignedAgentStage || 'Processing'}
                    </span>
                    <span className="text-purple-300 font-mono font-semibold">
                      {item.agentProgressPct ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-1 overflow-hidden border border-white/[0.05]">
                    <div
                      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.agentProgressPct ?? 0}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
