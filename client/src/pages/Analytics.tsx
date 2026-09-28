import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GlowingCard } from '../components/aceternity';

export const AnalyticsPage: React.FC = () => {
  const spendData = [
    { month: 'Apr', spend: 32000, savings: 4100 },
    { month: 'May', spend: 45000, savings: 6800 },
    { month: 'Jun', spend: 28000, savings: 3900 },
    { month: 'Jul', spend: 64000, savings: 9400 },
    { month: 'Aug', spend: 82000, savings: 13200 },
    { month: 'Sep', spend: 96400, savings: 18420 },
  ];

  const categoryData = [
    { name: 'IT & Hardware', value: 125000, color: '#8b5cf6' },
    { name: 'Office Furniture', value: 42000, color: '#3b82f6' },
    { name: 'Packaging & Cartons', value: 24000, color: '#10b981' },
    { name: 'Pantry & Hospitality', value: 14000, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 pb-20">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-purple-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Procurement Intelligence & ROI Analytics</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Spend & Savings Analytics</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Visibility into budget capture, vendor SLA performance, and negotiation alpha.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlowingCard glowColor="rgba(16, 185, 129, 0.12)">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Total Savings Realized</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">$55,820</div>
          <span className="text-[11px] text-slate-400 mt-1 block">+13.8% aggregate budget reduction</span>
        </GlowingCard>

        <GlowingCard glowColor="rgba(147, 51, 234, 0.12)">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Average Cycle Time</span>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">1.8 Days</div>
          <span className="text-[11px] text-purple-400 mt-1 block">94% faster than manual RFP cycle (30d)</span>
        </GlowingCard>

        <GlowingCard glowColor="rgba(59, 130, 246, 0.12)">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Average Negotiation Margin</span>
          <div className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">11.6%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Pre-negotiated volume discount rate</span>
        </GlowingCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spend vs Savings trend */}
        <div className="lg:col-span-8 bg-[#09090d]/80 border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <h3 className="font-semibold text-white text-xs">Monthly Spend vs Direct Budget Savings</h3>
            <span className="text-[11px] text-slate-400 font-mono">Past 6 Months</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#181822" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090d', borderColor: '#272732', borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="spend" name="Procurement Spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="AI Budget Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-[#09090d]/80 border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="border-b border-white/[0.05] pb-3">
            <h3 className="font-semibold text-white text-xs">Spend Allocation</h3>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090d', borderColor: '#272732', borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-mono font-semibold text-white">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
