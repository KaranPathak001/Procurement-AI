import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, CheckCircle2, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

interface QuoteComparisonProps {
  onSelectQuote?: (quote: any) => void;
}

const comparisonData = [
  {
    supplier: 'ErgoWorks Global',
    initials: 'EW',
    price: '₹9,84,000',
    unitPrice: '₹19,680',
    delivery: '18 Days',
    warranty: '5 Years Commercial',
    reliability: '96%',
    matchScore: 94,
    bestMatch: true,
    highlights: ['Lowest TCO over 5-year lifecycle', 'Full gas-spring replacement covenant', 'Direct Delhi delivery fleet'],
    category: 'all',
  },
  {
    supplier: 'OfficePro Direct',
    initials: 'OP',
    price: '₹10,20,000',
    unitPrice: '₹20,400',
    delivery: '21 Days',
    warranty: '3 Years Standard',
    reliability: '89%',
    matchScore: 89,
    bestMatch: false,
    highlights: ['Free on-site assembly team included', 'Reputable regional corporate supplier'],
    category: 'speed',
  },
  {
    supplier: 'FurniTech Commercial',
    initials: 'FT',
    price: '₹9,42,000',
    unitPrice: '₹18,840',
    delivery: '27 Days',
    warranty: '2 Years Standard',
    reliability: '82%',
    matchScore: 82,
    bestMatch: false,
    highlights: ['Lowest initial purchase cost', 'Close to 30-day critical delivery ceiling'],
    category: 'price',
  },
];

export const QuoteComparisonSection: React.FC<QuoteComparisonProps> = ({ onSelectQuote }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'price' | 'warranty' | 'reliability'>('all');

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
            INTELLIGENT TRADE-OFF ANALYSIS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quote Comparison & Scoring Matrix
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Multi-dimensional evaluation normalized across purchase price, SLA penalties, durability covenants, and supplier historic fulfillment.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Criteria
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'price'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lowest Price
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'warranty'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Best Warranty
          </button>
          <button
            onClick={() => setActiveTab('reliability')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'reliability'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Highest Reliability
          </button>
        </div>
      </div>

      {/* Comparison Table / Matrix */}
      <div className="rounded-2xl bg-[#080a12]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-4 px-6">Supplier</th>
                <th className="py-4 px-6">Total Price</th>
                <th className="py-4 px-6">Delivery SLA</th>
                <th className="py-4 px-6">Commercial Warranty</th>
                <th className="py-4 px-6">Reliability Score</th>
                <th className="py-4 px-6">AI Evaluation</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {comparisonData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`hover:bg-white/[0.03] transition-colors group ${
                    row.bestMatch ? 'bg-purple-950/10' : ''
                  }`}
                >
                  {/* Supplier */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-700/50 flex items-center justify-center font-bold font-mono text-[10px] text-purple-300">
                        {row.initials}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{row.supplier}</span>
                          {row.bestMatch && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500 text-purple-300 font-semibold">
                              Best Match
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Unit: {row.unitPrice}</span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-white text-sm font-mono">{row.price}</div>
                    <span className="text-[10px] text-emerald-400 font-mono">Within budget</span>
                  </td>

                  {/* Delivery */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-200 font-mono">{row.delivery}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Ahead of 30d</span>
                  </td>

                  {/* Warranty */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{row.warranty}</span>
                    </div>
                  </td>

                  {/* Reliability */}
                  <td className="py-4 px-6">
                    <div className="font-mono font-bold text-slate-200">{row.reliability}</div>
                    <div className="w-16 bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: row.reliability }}
                      />
                    </div>
                  </td>

                  {/* AI Match */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-purple-300 text-sm">{row.matchScore}%</span>
                      <span className="text-[10px] text-slate-400 font-mono">Overall</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelectQuote?.(row)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] hover:bg-purple-600 text-slate-300 hover:text-white transition-all inline-flex items-center gap-1 group-hover:border-purple-500/50 border border-white/[0.08]"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
