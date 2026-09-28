import React from 'react';
import { motion } from 'framer-motion';
import { Search, Send, GitCompare, TrendingDown, ShieldCheck, ClipboardList, ArrowRight } from 'lucide-react';

interface FeatureBentoProps {
  onSelectFeature?: () => void;
}

export const FeatureBento: React.FC<FeatureBentoProps> = ({ onSelectFeature }) => {
  return (
    <div id="product" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8 text-left">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          AUTONOMOUS CAPABILITIES BENTO
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Procurement operations engineered for high velocity.
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
          Every aspect of business purchasing automated under your explicit rules and spend limits.
        </p>
      </div>

      {/* Asymmetric Bento Layout: 6 Bento Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Large Card 1: AI Supplier Discovery (8 cols) */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={onSelectFeature}
          className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#080a14]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/50 border border-blue-600/40 flex items-center justify-center text-blue-400">
              <Search className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-purple-400 transition flex items-center gap-1">
              <span>EXPLORE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                AI Supplier Discovery & Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                Scans 20,000+ verified enterprise manufacturers and suppliers. Validates BIFMA, ISO certifications, production capacity, and SLA compliance within seconds.
              </p>
            </div>

            {/* Miniature Supplier Search Preview */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1.5 border-b border-white/[0.05]">
                <span>SEARCH QUERY: "50x ergonomic office chair Delhi &lt; ₹10L"</span>
                <span className="text-emerald-400 font-bold">14 VERIFIED FOUND</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="font-semibold text-white">ErgoWorks Global</div>
                  <div className="text-[10px] text-purple-400 font-mono">94% Match · 18d SLA</div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="font-semibold text-white">OfficePro Direct</div>
                  <div className="text-[10px] text-blue-400 font-mono">89% Match · 21d SLA</div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="font-semibold text-white">FurniTech Systems</div>
                  <div className="text-[10px] text-slate-400 font-mono">82% Match · 24d SLA</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small Card 2: Smart Quote Comparison (4 cols) */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={onSelectFeature}
          className="md:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#080a14]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-600/40 flex items-center justify-center text-indigo-400">
              <GitCompare className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Smart Quote Matrix
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes incoming bids across raw pricing, guaranteed delivery windows, payment terms, and warranty terms.
            </p>

            {/* Mini comparison preview */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">ErgoWorks</span>
                <span className="text-emerald-400 font-bold">₹9,84,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OfficePro</span>
                <span className="text-slate-300">₹10,20,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">FurniTech</span>
                <span className="text-slate-300">₹10,70,000</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Large Card 3: Negotiation Intelligence (7 cols) */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={onSelectFeature}
          className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#080a14]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
              SAVINGS ASSISTANT
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Negotiation Intelligence & Margin Capture
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ProcureAI spots volume pricing opportunities, suggests optimal counter-offer targets, and engages vendor desks before human approval.
              </p>
            </div>

            {/* Mini Negotiation Timeline */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Starting Quote: ₹10,70,000</span>
                <span className="text-emerald-400 font-bold">Counter Accepted: ₹9,84,000</span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[82%]" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                <span>Autonomous margin discount: 8.04%</span>
                <span className="text-purple-300">Surplus: +₹86,000</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small Card 4: Human-in-the-Loop Spend Governance (5 cols) */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={onSelectFeature}
          className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#080a14]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-950/50 border border-teal-600/40 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Human-in-the-Loop Approval
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete executive governance. No expenditure is committed without explicit human authorization.
            </p>

            {/* Mini Approval UI */}
            <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-800/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono text-teal-400 block uppercase">Ready for sign-off</span>
                <span className="font-bold text-white">Approve ₹9,84,000</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-teal-600 text-white font-semibold">
                Sign PO
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
