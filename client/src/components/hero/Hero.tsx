import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { ChairIcon } from '../branding/ChairIcon';

interface HeroProps {
  onStartProcurement: () => void;
  onSeeHowItWorks: () => void;
  onViewDetails: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartProcurement,
  onSeeHowItWorks,
  onViewDetails,
}) => {
  // Live simulation progression of the agent
  const [activeStep, setActiveStep] = useState(3); // 'Collecting quotes' initially active

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < 5 ? prev + 1 : 0));
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: 'Understanding requirement',
      subtitle: 'Extracting key details from your request...',
      time: '10:24 AM',
    },
    {
      title: 'Finding suppliers',
      subtitle: 'Searching verified suppliers...',
      time: '10:25 AM',
    },
    {
      title: 'Sending RFQs',
      subtitle: 'Sent to 14 relevant suppliers',
      time: '10:26 AM',
    },
    {
      title: 'Collecting quotes',
      subtitle: '6 quotes received',
      time: '10:28 AM',
    },
    {
      title: 'Analyzing offers',
      subtitle: 'Multi-factor matrix scoring',
      time: '10:29 AM',
    },
    {
      title: 'Preparing recommendation',
      subtitle: 'Synthesizing purchase proposal',
      time: '10:31 AM',
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ================= LEFT COLUMN: 44% ================= */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Outlined Pill: PROCUREMENT AUTOMATION */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/20 text-purple-300 text-[11px] font-mono tracking-wider"
          >
            <span>PROCUREMENT AUTOMATION</span>
          </motion.div>

          {/* Headline with exact gradient emphasis from screenshot */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Turn your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              procurement
            </span>{' '}
            request into real{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              supplier quotes.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-[550px]"
          >
            Describe what your company needs. Our agent handles the entire procurement process — from supplier discovery to quote comparison and final recommendation.
          </motion.p>

          {/* CTA Buttons: Primary & Secondary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={onStartProcurement}
              className="h-[48px] px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Start procurement</span>
              <span>→</span>
            </button>

            <button
              onClick={onSeeHowItWorks}
              className="h-[48px] px-6 rounded-xl border border-white/[0.12] bg-[#050507]/60 hover:bg-white/[0.04] hover:border-white/[0.2] text-slate-200 hover:text-white font-semibold text-xs transition-all flex items-center justify-center"
            >
              <span>See how it works</span>
            </button>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN: 56% (Floating Dashboard) ================= */}
        <div className="lg:col-span-7 relative">
          {/* Subtle curved background flow lighting (Requirement -> Quotes -> Purchase) */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600/20 via-blue-600/15 to-transparent blur-3xl rounded-3xl pointer-events-none" />

          {/* Main Floating Product Dashboard Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative bg-[#080a12]/90 border border-white/[0.1] rounded-[22px] p-5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-5"
          >
            {/* Dashboard Header Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  P
                </div>
                <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
                  Procurement Agent
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </div>
            </div>

            {/* Dashboard 2-Subcolumn Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Subcolumn: Vertical Agent Workflow Timeline (7 cols) */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="relative pl-6 border-l border-white/[0.08] space-y-4 text-xs">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < activeStep;
                    const isCurrent = idx === activeStep;
                    return (
                      <div key={idx} className="relative group">
                        {/* Status Circle indicator on timeline */}
                        <div
                          className={`absolute -left-[30px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400'
                              : isCurrent
                              ? 'bg-purple-950 border border-purple-400 text-purple-300 shadow-md shadow-purple-500/50 animate-pulse'
                              : 'bg-[#09090d] border border-white/[0.1] text-slate-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold text-xs ${
                                isCompleted
                                  ? 'text-slate-200'
                                  : isCurrent
                                  ? 'text-purple-300'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">{step.time}</span>
                          </div>
                          <p
                            className={`text-[11px] leading-tight ${
                              isCompleted
                                ? 'text-slate-400'
                                : isCurrent
                                ? 'text-purple-300/80'
                                : 'text-slate-600'
                            }`}
                          >
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Subcolumn: Context Cards & Best Quote (5 cols) */}
              <div className="md:col-span-5 space-y-3">
                {/* 1. Requirement Card */}
                <div className="p-3 rounded-2xl bg-[#0d0f1a] border border-white/[0.08] shadow-md flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-center shrink-0">
                    <ChairIcon size={26} color="#a78bfa" />
                  </div>
                  <div className="space-y-0.5 text-xs overflow-hidden">
                    <h4 className="font-bold text-white truncate text-xs">50 × Ergonomic Office Chair</h4>
                    <p className="text-[10px] text-slate-400 font-mono">$12,000 budget · 30 days</p>
                    <p className="text-[10px] text-purple-400 font-mono">Delhi, India</p>
                  </div>
                </div>

                {/* 2. Statistics Grid */}
                <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-2xl bg-[#0d0f1a] border border-white/[0.08] text-center">
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white font-mono">14</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Suppliers Found</div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white font-mono">6</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Quotes Received</div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">8%</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Potential Savings</div>
                  </div>
                </div>

                {/* 3. Top Quote Found Card (ErgoWorks) */}
                <div className="p-3.5 rounded-2xl bg-[#0d0f1a] border border-purple-500/40 shadow-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Top Quote Found</span>
                    <span className="text-[9px] font-mono font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      Best Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">ErgoWorks</h4>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                        <span className="text-emerald-400 font-semibold font-mono">94% match</span>
                        <span>·</span>
                        <span className="text-amber-400 flex items-center text-[10px]">★ 4.8 (120 reviews)</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center font-bold text-[9px] text-indigo-300">
                      EW
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-0.5">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-extrabold text-white font-mono">$9,840</span>
                      <span className="text-xs text-slate-500 line-through font-mono">$10,700</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                      8% lower
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1 border-t border-white/[0.05]">
                    <div>✓ Delivery: <span className="text-slate-200">18 days</span></div>
                    <div>✓ Warranty: <span className="text-emerald-400">5 years</span></div>
                  </div>

                  <button
                    onClick={onViewDetails}
                    className="w-full flex items-center justify-center space-x-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-950/30 hover:bg-purple-950/60 border border-purple-800/40 py-1.5 rounded-xl transition"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
