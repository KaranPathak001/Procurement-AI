import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Clock, Award, Star, ArrowRight } from 'lucide-react';
import { CardSpotlight } from '../aceternity';

interface SupplierDiscoveryProps {
  onSelectSupplier?: (supplierName: string) => void;
}

const suppliers = [
  {
    name: 'ErgoWorks Global',
    initials: 'EW',
    matchPct: 94,
    price: '₹9,84,000',
    originalPrice: '₹10,70,000',
    deliveryDays: 18,
    warranty: '5-year commercial',
    reliability: 96,
    rating: 4.9,
    reviews: 142,
    location: 'Delhi NCR Hub',
    tags: ['BIFMA Compliant', 'Immediate Stock', 'Best Match'],
    isBestMatch: true,
  },
  {
    name: 'OfficePro Direct',
    initials: 'OP',
    matchPct: 89,
    price: '₹10,20,000',
    originalPrice: '₹11,00,000',
    deliveryDays: 21,
    warranty: '3-year standard',
    reliability: 89,
    rating: 4.7,
    reviews: 98,
    location: 'Noida SEZ Hub',
    tags: ['Complimentary Assembly', 'Free Shipping'],
    isBestMatch: false,
  },
  {
    name: 'FurniTech Systems',
    initials: 'FT',
    matchPct: 82,
    price: '₹10,70,000',
    originalPrice: '₹11,40,000',
    deliveryDays: 24,
    warranty: '2-year standard',
    reliability: 82,
    rating: 4.5,
    reviews: 64,
    location: 'Gurgaon Industrial',
    tags: ['Bulk Producer', 'ISO 9001'],
    isBestMatch: false,
  },
];

export const SupplierDiscoverySection: React.FC<SupplierDiscoveryProps> = ({ onSelectSupplier }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
          SUPPLIER DISCOVERY & SCORING
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Find the right suppliers, not just more suppliers.
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          ProcureAI scans verified vendor databases, evaluating compliance history, capacity, SLA reliability, and commercial warranty before recommending engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <CardSpotlight
              color={s.isBestMatch ? '#8b5cf6' : '#6366f1'}
              className={`h-full flex flex-col justify-between space-y-6 ${
                s.isBestMatch ? 'border-purple-500/40 bg-[#090b16]' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header with Match % Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                      {s.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{s.name}</h3>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {s.location}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        s.isBestMatch
                          ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                          : 'bg-white/[0.04] border-white/[0.1] text-slate-300'
                      }`}
                    >
                      {s.matchPct}% Match
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Evaluated Quotation</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">{s.price}</span>
                    <span className="text-xs text-slate-500 line-through font-mono">{s.originalPrice}</span>
                  </div>
                </div>

                {/* Specifications Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Lead Time</span>
                    <span className="font-medium text-slate-200 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {s.deliveryDays} days
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Warranty</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" />
                      {s.warranty}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Reliability SLA</span>
                    <span className="font-medium text-slate-200 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      {s.reliability}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Rating</span>
                    <span className="font-medium text-amber-400 flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {s.rating} ({s.reviews})
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSupplier?.(s.name)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  s.isBestMatch
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span>Inspect Vendor Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
