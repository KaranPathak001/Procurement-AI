import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { MovingBorder } from '../aceternity';

interface AIRecommendationCardProps {
  onReviewRecommendation?: () => void;
}

export const AIRecommendationSection: React.FC<AIRecommendationCardProps> = ({
  onReviewRecommendation,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-2 mb-10">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          RECOMMENDATION SYNTHESIS
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Recommendation Engine
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          The agent correlates all qualitative and quantitative factors into an executive purchase dossier.
        </p>
      </div>

      <MovingBorder duration={4500} className="p-8">
        <div className="w-full text-left space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-purple-400" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  TOP RECOMMENDED SUPPLIER
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                ErgoWorks Global
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono font-bold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500 text-purple-300">
                94% Match
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                Saves ₹2,16,000
              </span>
            </div>
          </div>

          {/* Pricing Highlight Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-black/50 border border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Proposal</span>
              <span className="text-2xl font-black text-white font-mono">₹9,84,000</span>
              <span className="text-[11px] text-slate-400 block font-mono">₹19,680 / unit</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Target Budget Ceiling</span>
              <span className="text-2xl font-black text-slate-400 line-through font-mono">₹12,00,000</span>
              <span className="text-[11px] text-emerald-400 block font-mono">18.0% Under Budget</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Autonomous Savings</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">+₹2,16,000</span>
              <span className="text-[11px] text-purple-300 block font-mono">Includes 8% volume concession</span>
            </div>
          </div>

          {/* Strategic Why Factors */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Strategic Rationale (Why this supplier?):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Strong Reliability (96%)</span>
                  <span className="text-slate-400 text-[11px]">24 previous enterprise deliveries with zero SLA breaches.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Meets Critical Deadline</span>
                  <span className="text-slate-400 text-[11px]">18-day turnaround safely within your 30-day requirement window.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Best Warranty Covenant</span>
                  <span className="text-slate-400 text-[11px]">5-year commercial warranty with full gas-spring replacement.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Negotiated Volume Discount</span>
                  <span className="text-slate-400 text-[11px]">Autonomous agent locked in an 8% concession from original ₹10.7L quote.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Prepared for human authorization. Zero funds committed until signed.</span>
            </div>

            <button
              onClick={onReviewRecommendation}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center space-x-2 transition hover:scale-[1.02]"
            >
              <span>Review Recommendation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </MovingBorder>
    </div>
  );
};
