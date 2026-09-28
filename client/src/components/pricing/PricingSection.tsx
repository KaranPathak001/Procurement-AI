import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '../aceternity';

interface PricingProps {
  onSelectPlan?: (planName: string) => void;
}

const plans = [
  {
    name: 'Starter',
    badge: 'FOR GROWING TEAMS',
    monthlyPrice: '₹14,999',
    annualPrice: '₹11,999',
    period: '/ month',
    description: 'Autonomous procurement sourcing and RFQ tracking for teams with up to ₹25 lakh monthly spend.',
    features: [
      'Up to 10 active procurement requests/mo',
      'AI supplier discovery across verified networks',
      'Automated RFQ dispatches & quote matrix',
      'Human-in-the-loop spend approvals',
      'Standard email & portal vendor communication',
      'PDF Purchase Order generation',
    ],
    highlighted: false,
    cta: 'Start with Starter',
  },
  {
    name: 'Growth',
    badge: 'MOST POPULAR',
    monthlyPrice: '₹39,999',
    annualPrice: '₹31,999',
    period: '/ month',
    description: 'Full autonomous sourcing, tactical negotiation intelligence, and multi-tier approval workflows.',
    features: [
      'Unlimited procurement requests',
      'Autonomous margin negotiation assistant',
      'Multi-factor decision matrices (TCO scoring)',
      'Multi-level team approval workflows',
      'Custom vendor contract & SLA templates',
      'ERP & Accounting integrations (Coming Soon)',
      'Dedicated procurement success manager',
    ],
    highlighted: true,
    cta: 'Start 14-Day Free Trial',
  },
  {
    name: 'Enterprise',
    badge: 'FOR LARGE ENTERPRISES',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    period: '',
    description: 'Custom governance rules, dedicated vendor networks, custom ERP pipelines, and tailored AI models.',
    features: [
      'Dedicated on-premise or sovereign cloud',
      'Custom ERP connectors (SAP, Oracle, NetSuite)',
      'Bespoke category-specific vendor directories',
      'Custom spend governance & compliance covenants',
      '99.9% uptime SLA with 24/7 dedicated support',
      'Tailored LLM fine-tuned on historical purchase orders',
    ],
    highlighted: false,
    cta: 'Talk to Enterprise Team',
  },
];

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div id="pricing" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          TRANSPARENT VALUE-BASED PRICING
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Invest in an AI employee that pays for itself.
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Customers routinely save 8% to 18% on their first procurement requisition.
        </p>

        {/* Billing Toggle */}
        <div className="pt-4 flex items-center justify-center space-x-3">
          <span className={`text-xs ${!isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-white/[0.08] p-1 border border-white/[0.1] relative transition-colors"
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
            <span>Annual</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all ${
              p.highlighted
                ? 'bg-gradient-to-b from-[#0f1026] to-[#080a14] border-purple-500/50 shadow-2xl shadow-purple-950/40 relative'
                : 'bg-[#080a12]/80 border-white/[0.08] hover:border-white/[0.15]'
            }`}
          >
            {p.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-mono font-bold text-white tracking-wider uppercase shadow-md">
                RECOMMENDED
              </div>
            )}

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  {p.badge}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {isAnnual ? p.annualPrice : p.monthlyPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{p.period}</span>
                </div>
                {isAnnual && p.monthlyPrice !== 'Custom' && (
                  <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                    Billed annually (₹{(parseInt(p.annualPrice.replace(/[^0-9]/g, '')) * 12).toLocaleString('en-IN')}/yr)
                  </span>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-3 border-t border-white/[0.06] text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  What's included:
                </span>
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start space-x-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              {p.highlighted ? (
                <button
                  onClick={() => onSelectPlan?.(p.name)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center space-x-2 transition hover:scale-[1.02]"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onSelectPlan?.(p.name)}
                  className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] font-semibold text-xs flex items-center justify-center space-x-2 transition"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
