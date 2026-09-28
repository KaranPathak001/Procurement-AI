import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/hero/Hero';
import { FeatureBento } from '../components/features/FeatureBento';
import { ProcurementJourneyTracing } from '../components/workflow/ProcurementJourneyTracing';
import { SupplierDiscoverySection } from '../components/suppliers/SupplierDiscoverySection';
import { QuoteComparisonSection } from '../components/quotes/QuoteComparisonSection';
import { AIRecommendationSection } from '../components/recommendation/AIRecommendationSection';
import { PricingSection } from '../components/pricing/PricingSection';
import { Footer } from '../components/layout/Footer';
import { Spotlight, BackgroundGrid, HoverBorderGradient } from '../components/aceternity';
import api from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const handleExploreDemo = async () => {
    try {
      await api.post('/demo/seed');
    } catch (e) {}
    localStorage.setItem('procureai_token', 'demo_jwt_token_2026');
    localStorage.setItem(
      'procureai_user',
      JSON.stringify({
        name: 'Karan Patel',
        email: 'karan@acmetech.com',
        companyName: 'Acme Technologies',
        role: 'procurement_lead',
      })
    );
    navigate('/dashboard');
  };

  const handleStartProcurement = () => {
    navigate('/new-procurement');
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('workflow');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BackgroundGrid className="bg-[#030305] text-[#f4f4f6] selection:bg-purple-500/25 relative overflow-hidden font-sans">
      {/* Aceternity Spotlight Lighting Effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#8b5cf6"
      />
      <Spotlight
        className="top-1/3 right-0 md:right-40"
        fill="#6366f1"
      />

      {/* 1. Floating/Sticky Aceternity Navbar */}
      <Navbar onGetStarted={handleExploreDemo} />

      {/* Main Content Sections */}
      <main className="relative z-20">
        {/* 2. Framed Hero Section (Left 44% / Right 56% Framed Product Preview) */}
        <Hero
          onStartProcurement={handleStartProcurement}
          onSeeHowItWorks={handleSeeHowItWorks}
          onViewDetails={() => setShowQuoteModal(true)}
        />

        {/* 3. Trusted Businesses Banner */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 border-t border-white/[0.06] text-center space-y-6">
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
            TRUSTED BY MODERN BUSINESSES & SUPPLY CHAINS
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-55 grayscale hover:grayscale-0 transition-all text-xs font-semibold tracking-wider text-slate-400">
            <span className="flex items-center gap-2">❖ Microsoft</span>
            <span className="flex items-center gap-2">● Google</span>
            <span className="flex items-center gap-2">▲ amazon</span>
            <span className="flex items-center gap-2">∞ Meta</span>
            <span className="flex items-center gap-2">■ Notion</span>
            <span className="flex items-center gap-2">● Spotify</span>
            <span className="flex items-center gap-2">▲ Adobe</span>
            <span className="flex items-center gap-2"># slack</span>
          </div>
        </div>

        {/* 4. Core Feature Bento Grid with Asymmetric Sized Cards */}
        <FeatureBento onSelectFeature={handleExploreDemo} />

        {/* 5. Aceternity Tracing Beam: 9-Stage Procurement Journey */}
        <div id="workflow">
          <ProcurementJourneyTracing />
        </div>

        {/* 6. Aceternity Supplier Discovery Section */}
        <SupplierDiscoverySection onSelectSupplier={handleExploreDemo} />

        {/* 7. Quote Comparison Matrix & Scoring Section */}
        <QuoteComparisonSection onSelectQuote={handleExploreDemo} />

        {/* 8. AI Recommendation Engine Card */}
        <AIRecommendationSection onReviewRecommendation={handleExploreDemo} />

        {/* 9. Minimal Aceternity Pricing Section */}
        <PricingSection onSelectPlan={handleExploreDemo} />

        {/* 10. Call to Action Banner */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6 border-t border-white/[0.06]">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Give your business an AI procurement employee.
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Join enterprises automating supplier discovery, RFQs, tactical negotiations, and audit-ready purchases.
          </p>
          <div className="pt-4 flex justify-center">
            <HoverBorderGradient onClick={handleExploreDemo}>
              <span className="flex items-center gap-2">
                Start procurement now →
              </span>
            </HoverBorderGradient>
          </div>
        </div>
      </main>

      {/* Quote Details Modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#09090d] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-semibold text-purple-400 uppercase">Top Ingested Quotation</div>
                  <h3 className="text-lg font-bold text-white">ErgoWorks Global Proposal</h3>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="font-bold text-white font-mono text-base">₹9,84,000 (8% negotiated discount)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery SLA:</span>
                  <span className="text-slate-200">18 days (Guaranteed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty:</span>
                  <span className="text-emerald-400 font-semibold">5-Year Commercial Replacement</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleExploreDemo}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-950/50"
                >
                  <span>Open Workspace →</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </BackgroundGrid>
  );
};
