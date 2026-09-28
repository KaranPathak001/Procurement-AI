import React from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Store,
  Send,
  Files,
  MessageSquare,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Truck,
  CircleCheck,
} from 'lucide-react';

const flowSteps = [
  {
    num: '01',
    icon: FileSearch,
    title: 'Requirement',
    desc: 'Natural specification parsed & scoped',
    color: 'text-purple-400',
    bg: 'bg-purple-950/30',
    border: 'border-purple-800/40',
  },
  {
    num: '02',
    icon: Store,
    title: 'Supplier Discovery',
    desc: 'SLA database scanned for verified matches',
    color: 'text-blue-400',
    bg: 'bg-blue-950/30',
    border: 'border-blue-800/40',
  },
  {
    num: '03',
    icon: Send,
    title: 'RFQs',
    desc: 'Automated RFQ packages sent to suppliers',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-800/40',
  },
  {
    num: '04',
    icon: Files,
    title: 'Quote Analysis',
    desc: 'Ingested into multi-factor scoring matrix',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/30',
    border: 'border-indigo-800/40',
  },
  {
    num: '05',
    icon: MessageSquare,
    title: 'Negotiation',
    desc: 'Volume discount margin captured autonomously',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-800/40',
  },
  {
    num: '06',
    icon: BadgeCheck,
    title: 'Recommendation',
    desc: 'Executive purchase proposal formulated',
    color: 'text-purple-400',
    bg: 'bg-purple-950/30',
    border: 'border-purple-800/40',
  },
  {
    num: '07',
    icon: CheckCircle2,
    title: 'Approval',
    desc: 'Human-in-the-loop spend authorization',
    color: 'text-teal-400',
    bg: 'bg-teal-950/30',
    border: 'border-teal-800/40',
  },
  {
    num: '08',
    icon: ClipboardCheck,
    title: 'Purchase Order',
    desc: 'Cryptographically signed PO issued',
    color: 'text-violet-400',
    bg: 'bg-violet-950/30',
    border: 'border-violet-800/40',
  },
  {
    num: '09',
    icon: Truck,
    title: 'Delivery',
    desc: 'SLA-tracked logistics & delivery confirmation',
    color: 'text-sky-400',
    bg: 'bg-sky-950/30',
    border: 'border-sky-800/40',
  },
  {
    num: '10',
    icon: CircleCheck,
    title: 'Completed',
    desc: 'Cycle closed, savings locked & audited',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-800/40',
  },
];

export const ProcurementFlow: React.FC = () => {
  return (
    <div id="workflow" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          FROM REQUEST TO PURCHASE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How Procurement Flow is Automated
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          A continuous, audited operating cycle designed to maximize enterprise savings.
        </p>
      </div>

      {/* Horizontal grid on desktop / vertical stack on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 text-left">
        {flowSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl bg-[#080a12]/80 border border-white/[0.06] hover:border-purple-500/30 transition-all space-y-2.5 group"
            >
              {/* Icon in colored pill */}
              <div className={`w-8 h-8 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${step.color}`} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-600 group-hover:text-slate-500 transition">
                  {step.num}
                </span>
                <h4 className="font-bold text-white text-xs tracking-tight mt-0.5">{step.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
