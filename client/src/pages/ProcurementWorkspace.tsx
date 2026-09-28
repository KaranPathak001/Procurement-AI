import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  GitCompare,
  TrendingDown,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  X,
  TrendingUp,
  FileSearch,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { MovingBorder } from '../components/aceternity';
import api from '../services/api';

export const ProcurementWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [procurement, setProcurement] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [approval, setApproval] = useState<any>(null);
  const [purchaseOrder, setPurchaseOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'quotes' | 'negotiation'>('timeline');

  const fetchProcurementData = async () => {
    try {
      const res = await api.get(`/procurements/${id || 'demo_1048'}`);
      setProcurement(res.data.procurement);
      setQuotes(res.data.quotes || []);
      setEvents(res.data.events || []);
      setNegotiations(res.data.negotiations || []);
      setApproval(res.data.approval);
      setPurchaseOrder(res.data.purchaseOrder);
    } catch (err) {
      setProcurement({
        _id: 'demo_1048',
        referenceNumber: 'PR-1048',
        title: '50x Ergonomic Office Chairs',
        category: 'Ergonomic Office Furniture',
        budget: 12000,
        currency: 'USD',
        quantity: 50,
        deliveryLocation: 'Delhi, India',
        requiredByDate: '30 days',
        status: 'pending_approval',
        assignedAgentStage: 'Ready for Human Approval',
        agentProgressPct: 100,
        specs: {
          keyRequirements: [
            'Adjustable Ergonomic Lumbar Support',
            'Gas-lift Height Adjustability & 3D Armrests',
            'Breathable High-Durability Mesh Back',
            'Minimum 3-5 Year Commercial Warranty',
          ],
        },
        aiRecommendation: {
          vendorName: 'ErgoWorks Global',
          finalPrice: 9840,
          savingsAmount: 2160,
          savingsPct: 18.0,
          summary: 'ErgoWorks is the optimal choice balancing superior 5-year warranty, proven SLA compliance, and $2,160 in direct budget savings.',
          reasoning: [
            'Strong vendor reliability (96%) with 24 previous flawless orders',
            '5-year commercial replacement warranty',
            'Delivery in 18 days (comfortably ahead of 30-day requirement)',
            'Autonomous negotiation yielded $860 extra reduction',
          ],
        },
      });

      setQuotes([
        {
          _id: 'q1',
          vendorName: 'ErgoWorks Global',
          unitPrice: 196.8,
          originalPrice: 10700,
          totalPrice: 9840,
          leadTimeDays: 18,
          warrantyYears: 5,
          overallScore: 94,
          priceScore: 92,
          reliabilityScore: 96,
          deliveryScore: 93,
          complianceScore: 98,
          aiPros: [
            'Strong vendor reliability (96%) with 24 past verified deliveries',
            'Unrivaled 5-year commercial warranty and free replacement on gas-springs',
            'Delivery in 18 days — well inside your 30-day threshold',
            'Negotiated an 8% volume incentive discount from starting $10,700 quote',
          ],
          aiCons: ['Slightly higher raw base price than lowest bidder FurniTech ($9,420)'],
          status: 'selected',
        },
        {
          _id: 'q2',
          vendorName: 'OfficePro Direct Solutions',
          unitPrice: 205,
          originalPrice: 11000,
          totalPrice: 10250,
          leadTimeDays: 14,
          warrantyYears: 3,
          overallScore: 91,
          priceScore: 86,
          reliabilityScore: 92,
          deliveryScore: 98,
          complianceScore: 90,
          aiPros: ['Fastest logistics (14 days guaranteed delivery)', 'Includes complimentary assembly team'],
          aiCons: ['Standard 3-year warranty', 'Total price is $410 higher than ErgoWorks'],
          status: 'active',
        },
        {
          _id: 'q3',
          vendorName: 'FurniTech Commercial Systems',
          unitPrice: 188.4,
          originalPrice: 10200,
          totalPrice: 9420,
          leadTimeDays: 27,
          warrantyYears: 2,
          overallScore: 86,
          priceScore: 96,
          reliabilityScore: 88,
          deliveryScore: 74,
          complianceScore: 82,
          aiPros: ['Lowest upfront quotation ($9,420 total)', 'High raw price competitiveness'],
          aiCons: ['27 days delivery is close to 30-day deadline', 'Base warranty limited to 2 years'],
          status: 'active',
        },
      ]);

      setEvents([
        {
          stage: 'Requirement Parser',
          title: 'Requirement Understood & Structured',
          detail: 'Parsed 50 ergonomic chairs with lumbar support and 30-day delivery deadline at $12,000 budget ceiling.',
          timestamp: '09:41',
          iconType: 'CheckCircle2',
        },
        {
          stage: 'Supplier Discovery',
          title: 'Found 14 Relevant Enterprise Suppliers',
          detail: 'Filtered qualified suppliers in Delhi NCR and global hubs matching BIFMA commercial durability standards.',
          timestamp: '09:42',
          iconType: 'Search',
        },
        {
          stage: 'RFQ Dispatch',
          title: 'Sent RFQ Packages to 14 Suppliers',
          detail: 'Automated RFQ packages with CAD specs, warranty criteria, and mandatory delivery windows sent via vendor portals.',
          timestamp: '09:43',
          iconType: 'Send',
        },
        {
          stage: 'Quote Matrix',
          title: 'Received & Evaluated 6 Formal Quotations',
          detail: 'Ingested raw quote documents and constructed weighted decision trade-off matrix.',
          timestamp: '09:48',
          iconType: 'GitCompare',
        },
        {
          stage: 'Negotiation Engine',
          title: 'Identified 8% Volume Negotiation Opportunity',
          detail: 'Triggered tactical bulk volume discount request with ErgoWorks Global targeting immediate PO release.',
          timestamp: '09:49',
          iconType: 'TrendingDown',
        },
        {
          stage: 'Supplier Intelligence',
          title: 'ErgoWorks Conceded to $9,840 (8.04% Discount)',
          detail: 'Vendor agreed to adjust quote from $10,700 to $9,840 while maintaining the 5-year warranty covenant.',
          timestamp: '09:50',
          iconType: 'CheckCircle2',
        },
        {
          stage: 'Recommendation Synthesis',
          title: 'Recommendation Synthesized: ErgoWorks Global',
          detail: 'Saved $2,160 (18.0%) against $12,000 budget. Prepared purchase authorization for human sign-off.',
          timestamp: '09:51',
          iconType: 'BadgeCheck',
        },
      ]);

      setApproval({
        _id: 'app_1048',
        title: 'Purchase Authorization: 50x Ergonomic Office Chairs',
        subtotal: 9840,
        estimatedSavings: 2160,
        savingsPct: 18.0,
        deliveryDays: 18,
        status: 'pending',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurementData();
  }, [id]);

  const handleApprovePurchase = async () => {
    if (!approval?._id) return;
    setIsAuthorizing(true);
    try {
      await api.post(`/approvals/${approval._id}/approve`, { notes: 'Authorized via procurement workspace' });
      await fetchProcurementData();
      setShowApprovalModal(false);
      navigate('/purchase-orders');
    } catch (err) {
      if (procurement) procurement.status = 'po_issued';
      if (approval) approval.status = 'approved';
      setShowApprovalModal(false);
      navigate('/purchase-orders');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const getEventIcon = (iconType: string) => {
    switch (iconType) {
      case 'Search':
        return <Search className="w-3.5 h-3.5 text-blue-400" />;
      case 'Send':
        return <Send className="w-3.5 h-3.5 text-amber-400" />;
      case 'GitCompare':
        return <GitCompare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'TrendingDown':
        return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-3.5 h-3.5 text-purple-400" />;
      case 'FileSearch':
        return <FileSearch className="w-3.5 h-3.5 text-violet-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  if (loading || !procurement) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Loading workspace...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 pb-20">
      {/* Header Bar */}
      <div className="bg-[#09090d]/80 border border-white/[0.07] rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="font-mono text-[10px] font-bold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
              {procurement.referenceNumber}
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400">{procurement.category}</span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400">Destination: {procurement.deliveryLocation}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{procurement.title}</h1>
        </div>

        {/* Status Pill & Action */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-slate-400 text-xs bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-xl font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXECUTION ACTIVE</span>
          </div>

          {procurement.status === 'pending_approval' && (
            <button
              onClick={() => setShowApprovalModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Review & Authorize ($9,840)</span>
            </button>
          )}

          {procurement.status === 'po_issued' && (
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PO Issued</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/[0.05] pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'timeline'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          Activity Stream ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'quotes'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          Quote Comparison Matrix ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('negotiation')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'negotiation'
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          Negotiation Intelligence
        </button>
      </div>

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Tab Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: Live Activity Stream */}
          {activeTab === 'timeline' && (
            <div className="bg-[#09090d]/80 border border-white/[0.07] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                <span className="font-semibold text-white text-xs">Execution Feed</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Cycle Complete
                </span>
              </div>

              {/* Timeline */}
              <div className="relative pl-6 border-l border-white/[0.08] space-y-6">
                {events.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="relative group"
                  >
                    <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-[#050507] border border-purple-500/50 flex items-center justify-center shadow-md">
                      {getEventIcon(event.iconType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-semibold text-purple-400">{event.timestamp}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs font-semibold text-slate-200">{event.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/[0.05]">
                        {event.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Quote Comparison Matrix */}
          {activeTab === 'quotes' && (
            <div className="bg-[#09090d]/80 border border-white/[0.07] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                <h3 className="font-semibold text-white text-xs">Ingested Quotations & Multi-Factor Scoring</h3>
                <span className="text-xs text-slate-400 font-mono">Budget: {formatCurrency(procurement.budget)}</span>
              </div>

              <div className="space-y-3">
                {quotes.map((q, idx) => (
                  <div
                    key={q._id || idx}
                    className={`p-4 rounded-xl border transition-all ${
                      q.status === 'selected'
                        ? 'bg-purple-950/15 border-purple-500/40 shadow-lg shadow-purple-950/20'
                        : 'bg-black/40 border-white/[0.06]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.05]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-100 text-sm">{q.vendorName}</span>
                          {q.status === 'selected' && (
                            <span className="text-[9px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          Lead Time: {q.leadTimeDays}d · Warranty: {q.warrantyYears}yr
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-white tracking-tight font-mono">
                          {formatCurrency(q.totalPrice, procurement.currency)}
                        </div>
                        <div className="text-[11px] text-purple-400 font-mono font-semibold">
                          Score: {q.overallScore}/100
                        </div>
                      </div>
                    </div>

                    {/* Multi criteria breakdown */}
                    <div className="grid grid-cols-4 gap-2 py-2 text-center text-[10px] font-mono bg-white/[0.02] rounded-lg my-2 border border-white/[0.04]">
                      <div>
                        <span className="text-slate-500 block">Price</span>
                        <span className="font-semibold text-slate-200">{q.priceScore || 90}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Reliability</span>
                        <span className="font-semibold text-slate-200">{q.reliabilityScore || 95}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Delivery</span>
                        <span className="font-semibold text-slate-200">{q.deliveryScore || 92}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Compliance</span>
                        <span className="font-semibold text-slate-200">{q.complianceScore || 98}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 text-xs">
                      {q.aiPros?.map((pro: string, i: number) => (
                        <div key={i} className="flex items-start space-x-2 text-emerald-400">
                          <span className="font-bold">+</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                      {q.aiCons?.map((con: string, i: number) => (
                        <div key={i} className="flex items-start space-x-2 text-amber-400">
                          <span className="font-bold">-</span>
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Negotiation */}
          {activeTab === 'negotiation' && (
            <div className="bg-[#09090d]/80 border border-white/[0.07] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-white text-xs">Negotiation Strategy & Margin Capture</h3>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full">
                  8.04% Captured
                </span>
              </div>

              <div className="bg-black/50 border border-white/[0.06] rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Starting Quote:</span>
                  <span className="font-mono line-through text-slate-500">$10,700</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Negotiated Price:</span>
                  <span className="font-mono font-bold text-emerald-400">$9,840</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Captured Budget Surplus:</span>
                  <span className="font-mono font-bold text-purple-300">+$860 (8.04%)</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Tactical Negotiation Audit Trail:</span>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-xs text-slate-300 font-mono leading-relaxed">
                  "We're evaluating several suppliers for an order of 50 units. If you can offer an 8% volume incentive discount, our finance team can release the Purchase Order within 24 business hours."
                </div>
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 leading-relaxed">
                  <strong className="text-white">Supplier Confirmation (ErgoWorks):</strong> "Accepted. We have adjusted commercial invoice #EW-982 to $9,840 with full 5-year replacement warranty intact."
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recommended Supplier Card */}
        <div className="lg:col-span-5 space-y-6">
          <MovingBorder duration={5000} className="p-6">
            <div className="space-y-5 w-full text-left">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-slate-100 text-xs">Recommended Supplier</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded-full">
                  Score: 94/100
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">
                  {procurement.aiRecommendation?.vendorName || 'ErgoWorks Global'}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white tracking-tight font-mono">
                    {formatCurrency(procurement.aiRecommendation?.finalPrice || 9840, procurement.currency)}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">
                    {formatCurrency(procurement.budget, procurement.currency)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>
                    Saves {formatCurrency(procurement.aiRecommendation?.savingsAmount || 2160, procurement.currency)} (
                    {procurement.aiRecommendation?.savingsPct || 18.0}% surplus)
                  </span>
                </div>
              </div>

              {/* Justification Pillars */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Strategic Justification:
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {procurement.aiRecommendation?.reasoning?.map((r: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Trigger */}
              {procurement.status === 'pending_approval' ? (
                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Sourced and negotiated terms. Human authorization is required to commit funds.
                  </p>
                  <button
                    onClick={() => setShowApprovalModal(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-xl shadow-xl shadow-emerald-950/40 transition hover:scale-[1.02] text-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Purchase ($9,840)</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/[0.08] text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized & Issued to Purchase Order</span>
                </div>
              )}
            </div>
          </MovingBorder>

          {/* Requisition Parameters Card */}
          <div className="bg-[#09090d]/60 border border-white/[0.07] rounded-2xl p-5 backdrop-blur-md space-y-3 text-xs">
            <h4 className="font-semibold text-slate-200">Requisition Parameters</h4>
            <div className="space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="text-slate-200 font-mono font-medium">{procurement.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery SLA:</span>
                <span className="text-slate-200 font-medium">18 days (Cap: {procurement.requiredByDate})</span>
              </div>
              <div className="flex justify-between">
                <span>Warranty:</span>
                <span className="text-emerald-400 font-medium">5-Year Commercial Replacement</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Terms:</span>
                <span className="text-slate-200 font-medium">Net 30 post-delivery QA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#09090d] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">Human-in-the-Loop Governance</div>
                  <h3 className="text-lg font-bold text-white">Authorize Corporate Purchase</h3>
                </div>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommended Vendor:</span>
                  <span className="font-bold text-white">{procurement.aiRecommendation?.vendorName || 'ErgoWorks Global'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Items:</span>
                  <span className="text-slate-200">{procurement.quantity} × Ergonomic Office Chairs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Purchase Commitment:</span>
                  <span className="font-bold text-lg text-emerald-400 font-mono">
                    {formatCurrency(procurement.aiRecommendation?.finalPrice || 9840)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Realized Budget Surplus:</span>
                  <span className="font-bold text-purple-300 font-mono">
                    +{formatCurrency(procurement.aiRecommendation?.savingsAmount || 2160)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Confirming authorization will lock in the negotiated terms and generate a legally compliant Purchase Order for vendor distribution.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprovePurchase}
                  disabled={isAuthorizing}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAuthorizing ? 'Issuing Purchase Order...' : 'Approve & Issue PO'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
