import React from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Store,
  Send,
  Files,
  GitCompare,
  MessageSquare,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react';
import { TracingBeam } from '../aceternity';
import { ChairIcon } from '../branding/ChairIcon';

const journeySteps = [
  {
    step: '01',
    title: 'Requirement Understanding',
    category: 'NATURAL LANGUAGE INGESTION',
    desc: 'The agent digests business requests: units, budget caps, delivery deadlines, quality warranties, and delivery pin-codes.',
    icon: FileSearch,
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] space-y-2">
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>PROMPT PARSED</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center shrink-0">
            <ChairIcon size={18} color="#a78bfa" />
          </div>
          <div>
            <div className="font-semibold text-white">50 × Ergonomic Office Chairs</div>
            <div className="text-[10px] text-slate-400 font-mono">Budget: ₹10,00,000 · Delhi · 30 Days SLA</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: '02',
    title: 'Supplier Discovery',
    category: 'VERIFIED SUPPLIER NETWORK',
    desc: 'Scans enterprise directories and verified vendor networks matching manufacturing certification, location, and past reliability metrics.',
    icon: Store,
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-slate-400">Vendors Discovered:</span>
          <span className="text-blue-400 font-bold">14 Qualified</span>
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">ErgoWorks (Delhi)</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">OfficePro (Noida)</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">FurniTech (Gurgaon)</span>
        </div>
      </div>
    ),
  },
  {
    step: '03',
    title: 'Automated RFQs',
    category: 'RFQ DISPATCH & TRACKING',
    desc: 'Dispatches tailored RFP packages with engineering specifications, mandatory compliance criteria, and standardized response deadlines.',
    icon: Send,
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">RFQ Package Dispatch:</span>
          <span className="text-emerald-400 font-mono text-[10px]">100% Delivered</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Tracking token: <span className="text-slate-200">#RFQ-DEL-2026-081</span>
        </div>
      </div>
    ),
  },
  {
    step: '04',
    title: 'Quote Collection',
    category: 'INCOMING QUOTE INGESTION',
    desc: 'Ingests inbound PDFs, portal submissions, and supplier emails directly into structured parameters.',
    icon: Files,
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] space-y-1.5 text-xs">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Quotes Received:</span>
          <span className="font-mono font-bold text-white">6 Proposals</span>
        </div>
        <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[85%]" />
        </div>
      </div>
    ),
  },
  {
    step: '05',
    title: 'Quote Analysis & Matrix',
    category: 'MULTI-FACTOR EVALUATION',
    desc: 'Evaluates unit pricing, logistics lead times, commercial warranty terms, and historic vendor reliability scores.',
    icon: GitCompare,
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
        <div className="p-1 rounded bg-white/[0.02]">
          <span className="text-slate-500 block">Lowest Price</span>
          <span className="text-white font-bold">₹9,42,000</span>
        </div>
        <div className="p-1 rounded bg-white/[0.02]">
          <span className="text-slate-500 block">Fastest SLA</span>
          <span className="text-white font-bold">14 Days</span>
        </div>
        <div className="p-1 rounded bg-white/[0.02]">
          <span className="text-slate-500 block">Top Quality</span>
          <span className="text-emerald-400 font-bold">5yr Warranty</span>
        </div>
      </div>
    ),
  },
  {
    step: '06',
    title: 'Negotiation Intelligence',
    category: 'AUTONOMOUS MARGIN CAPTURE',
    desc: 'Identifies volume discount leverage and requests margin adjustments under authorized buyer rules before human review.',
    icon: MessageSquare,
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] space-y-1 text-xs">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Counter-Offer Accepted:</span>
          <span className="font-mono font-bold text-emerald-400">₹9,84,000 (-8%)</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">Vendor agreed to volume pricing in exchange for 24h PO guarantee.</p>
      </div>
    ),
  },
  {
    step: '07',
    title: 'AI Recommendation',
    category: 'EXECUTIVE PROPOSAL',
    desc: 'Formulates a clear purchase rationale highlighting savings, reliability, delivery confidence, and trade-off metrics.',
    icon: BadgeCheck,
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">ErgoWorks Global</span>
          <span className="text-[10px] font-mono text-purple-300 font-bold">94% Match</span>
        </div>
        <div className="text-[11px] text-emerald-400 font-mono font-semibold">
          ₹2,16,000 Potential Savings vs Budget
        </div>
      </div>
    ),
  },
  {
    step: '08',
    title: 'Human Spend Approval',
    category: 'GOVERNANCE & AUDIT',
    desc: 'Human managers retain absolute control. One click authorizes the purchase order within pre-set corporate spend ceilings.',
    icon: CheckCircle2,
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-slate-400">STATUS</div>
          <div className="text-xs font-bold text-teal-400">Authorized by Karan Patel</div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
          Signed
        </span>
      </div>
    ),
  },
  {
    step: '09',
    title: 'Purchase Order Automation',
    category: 'ERP & VENDOR DISPATCH',
    desc: 'Generates legally binding, cryptographically tracked purchase orders with full line items, terms, and delivery milestones.',
    icon: ClipboardList,
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
    preview: (
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.07] flex items-center justify-between text-xs">
        <div>
          <div className="font-mono text-[10px] text-slate-400">PO-2026-1048</div>
          <div className="font-bold text-white">₹9,84,000 · PO Dispatched</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
      </div>
    ),
  },
];

export const ProcurementJourneyTracing: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-2 mb-16">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          CONTINUOUS AUTONOMOUS CYCLE
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          The 9-Stage Procurement Journey
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          From natural requirement understanding to purchase order issuance — monitored every step of the way.
        </p>
      </div>

      <TracingBeam className="px-4 md:px-6">
        <div className="space-y-12 pl-4 md:pl-8">
          {journeySteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#080a12]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl hover:border-purple-500/30 transition-all group"
              >
                {/* Left detail (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-500">{item.step}</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Right UI Preview (5 cols) */}
                <div className="md:col-span-5 flex items-center justify-center">
                  <div className="w-full">{item.preview}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </TracingBeam>
    </div>
  );
};
