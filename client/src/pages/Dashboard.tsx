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
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GlowingCard } from '../components/aceternity';
import api from '../services/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    activeRequests: 4,
    potentialSavings: 18420,
    vendorSpend: 180600,
    pendingApprovals: 1,
  });
  const [procurements, setProcurements] = useState<any[]>([]);

  const userJson = localStorage.getItem('procureai_user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Karan' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricRes, procRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/procurements'),
        ]);
        if (metricRes.data?.metrics) setMetrics(metricRes.data.metrics);
        if (procRes.data?.procurements) setProcurements(procRes.data.procurements);
      } catch (err) {
        setProcurements([
          {
            _id: 'demo_1048',
            referenceNumber: 'PR-1048',
            title: '50x Ergonomic Office Chairs',
            category: 'Ergonomic Office Furniture',
            budget: 12000,
            currency: 'USD',
            quantity: 50,
            status: 'pending_approval',
            assignedAgentStage: 'Ready for Human Approval',
            agentProgressPct: 100,
            aiRecommendation: {
              vendorName: 'ErgoWorks Global',
              finalPrice: 9840,
              savingsAmount: 2160,
              savingsPct: 18.0,
            },
          },
          {
            _id: 'demo_1049',
            referenceNumber: 'PR-1049',
            title: '30x MacBook Pro 16" M3 Max',
            category: 'IT Hardware & Workstations',
            budget: 110000,
            currency: 'USD',
            quantity: 30,
            status: 'po_issued',
            assignedAgentStage: 'Purchase Order Issued to TechSource',
            agentProgressPct: 100,
            aiRecommendation: {
              vendorName: 'TechSource Enterprise Logistics',
              finalPrice: 96400,
              savingsAmount: 13600,
              savingsPct: 12.3,
            },
          },
          {
            _id: 'demo_1050',
            referenceNumber: 'PR-1050',
            title: '5,000x Custom Recycled Shipping Boxes',
            category: 'Packaging & Logistics',
            budget: 8500,
            currency: 'USD',
            quantity: 5000,
            status: 'negotiating',
            assignedAgentStage: 'Negotiating Bulk Margin with PackPro',
            agentProgressPct: 75,
          },
          {
            _id: 'demo_1051',
            referenceNumber: 'PR-1051',
            title: 'Quarterly Office Coffee & Pantry Replenishment',
            category: 'Office Pantry & Hospitality',
            budget: 4500,
            currency: 'USD',
            quantity: 1,
            status: 'recommended',
            assignedAgentStage: 'Vendor Quotes Synthesized',
            agentProgressPct: 90,
          },
        ]);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pending Approval
          </span>
        );
      case 'po_issued':
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            PO Issued
          </span>
        );
      case 'negotiating':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 animate-pulse">
            Negotiating
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Ingestion
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Command Center Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[#09090d]/80 border border-white/[0.07] backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
              Procurement Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Good morning, {user.name ? user.name.split(' ')[0] : 'Karan'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Your procurement engine is actively sourcing and negotiating in the background. It captured{' '}
            <span className="text-emerald-400 font-semibold font-mono">
              {formatCurrency(metrics.potentialSavings)}
            </span>{' '}
            in authorized budget savings this cycle.
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

      {/* Hero Metric & Bento Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowingCard glowColor="rgba(147, 51, 234, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Sourcing Tasks</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{metrics.activeRequests}</div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-purple-400">Automated cycle active</span>
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(16, 185, 129, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Captured Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
            {formatCurrency(metrics.potentialSavings)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium font-mono">+13.8%</span> vs authorized ceiling
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(59, 130, 246, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Vendor Spend (YTD)</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {formatCurrency(metrics.vendorSpend)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            Across 5 Tier-1 qualified suppliers
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(245, 158, 11, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Approvals</span>
            <BadgeCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">
            {metrics.pendingApprovals}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Link to="/approvals" className="text-amber-400/90 hover:underline flex items-center gap-0.5">
              Requires human sign-off <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </GlowingCard>
      </div>

      {/* Active Procurement Requisitions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Procurements</h2>
            <p className="text-xs text-slate-400">
              Live corporate sourcing operations managed under your parameters.
            </p>
          </div>
          <Link
            to="/procurements"
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition"
          >
            <span>View all requisitions</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Procurements Grid */}
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
                      {item.referenceNumber || 'PR-1048'}
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

              {/* Budget & Recommendation Grid */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Target Budget</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {formatCurrency(item.budget, item.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Best Proposal</span>
                  <span className="font-semibold text-white font-mono">
                    {item.aiRecommendation?.finalPrice
                      ? formatCurrency(item.aiRecommendation.finalPrice, item.currency)
                      : 'Evaluating...'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Savings</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {item.aiRecommendation?.savingsAmount
                      ? `+${formatCurrency(item.aiRecommendation.savingsAmount, item.currency)}`
                      : 'Calculating...'}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Current Stage */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    {item.assignedAgentStage || 'Processing Sourcing Cycle'}
                  </span>
                  <span className="text-purple-300 font-mono font-semibold">{item.agentProgressPct || 85}%</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-1 overflow-hidden border border-white/[0.05]">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.agentProgressPct || 85}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
