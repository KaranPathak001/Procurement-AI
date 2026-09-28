import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sliders,
  Zap,
} from 'lucide-react';
import api from '../services/api';

export const NewProcurementPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(
    'Find 50 ergonomic office chairs under $12,000, delivered to Delhi within 30 days. They should have lumbar support, adjustable height, and arrive within 30 days.'
  );
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editable parameters
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ergonomic Office Furniture');
  const [budget, setBudget] = useState(12000);
  const [currency, setCurrency] = useState('USD');
  const [quantity, setQuantity] = useState(50);
  const [deliveryLocation, setDeliveryLocation] = useState('Delhi, India');
  const [deadline, setDeadline] = useState('30 days');
  const [priority, setPriority] = useState('high');

  const handleParseNaturalInput = async () => {
    if (!prompt.trim()) return;
    setIsParsing(true);
    try {
      const res = await api.post('/procurements/parse', { prompt });
      const parsed = res.data.parsed;
      setParsedData(parsed);

      setTitle(parsed.title);
      setCategory(parsed.category);
      setBudget(parsed.budget);
      setCurrency(parsed.currency);
      setQuantity(parsed.quantity);
      setDeliveryLocation(parsed.deliveryLocation);
      setDeadline(parsed.deadline);
      setPriority(parsed.priority);
    } catch (err) {
      setParsedData({
        title: '50x Ergonomic Office Chairs',
        category: 'Ergonomic Office Furniture',
        budget: 12000,
        currency: 'USD',
        quantity: 50,
        deliveryLocation: 'Delhi, India',
        deadline: '30 days',
        priority: 'high',
        keySpecs: [
          'Adjustable Ergonomic Lumbar Support',
          'Gas-lift Height Adjustability & Armrests',
          'Breathable High-Durability Mesh Back',
          'Multi-Year Commercial Warranty',
        ],
        summary: 'Autonomous sourcing for 50 ergonomic chairs within USD 12,000 to Delhi.',
      });
    } finally {
      setIsParsing(false);
    }
  };

  const [submitError, setSubmitError] = useState('');

  const handleConfirmAndLaunch = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        prompt,
        title: title || parsedData?.title || 'Procurement Request',
        category,
        budget,
        currency,
        quantity,
        deliveryLocation,
        deadline,
        priority,
      };

      const res = await api.post('/procurements', payload);
      const newId = res.data?.procurement?._id;
      if (newId) {
        navigate(`/procurements/${newId}`);
      } else {
        navigate('/procurements');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to create procurement request. Please verify fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-purple-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
          <span>Requisition Dispatch</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">New Procurement Request</h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Describe your corporate requirement in plain English. The system will extract parameters, scan catalogs, dispatch RFQs, and negotiate discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Box */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#09090d]/80 border border-white/[0.07] rounded-3xl p-6 backdrop-blur-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <label className="text-xs font-semibold text-slate-200">
                What does your company need?
              </label>
              <span className="text-[10px] font-mono text-slate-500">NATURAL LANGUAGE PARSER</span>
            </div>

            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find 50 ergonomic office chairs under $12,000, delivered to Delhi within 30 days..."
              className="w-full bg-black/60 border border-white/[0.07] rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition resize-none leading-relaxed font-sans"
            />

            {/* Prompt presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Enterprise Sourcing Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      'Find 50 ergonomic office chairs under $12,000, delivered to Delhi within 30 days. They should have lumbar support, adjustable height, and arrive within 30 days.'
                    )
                  }
                  className="text-[11px] bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 px-3 py-1.5 rounded-xl border border-white/[0.06] transition"
                >
                  🪑 50 Office Chairs ($12k)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      'Source 30 MacBook Pro 16" M3 Max laptops with 64GB RAM and 1TB SSD under $110,000, delivered within 15 days.'
                    )
                  }
                  className="text-[11px] bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 px-3 py-1.5 rounded-xl border border-white/[0.06] transition"
                >
                  💻 30x MacBook Pro Fleet
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPrompt(
                      'Need 5,000 custom branded recycled shipping boxes, FSC certified, double wall under $8,500 by next month.'
                    )
                  }
                  className="text-[11px] bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 px-3 py-1.5 rounded-xl border border-white/[0.06] transition"
                >
                  📦 5,000 Corrugated Boxes
                </button>
              </div>
            </div>

            <button
              onClick={handleParseNaturalInput}
              disabled={isParsing || !prompt.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-white/[0.05] hover:bg-white/[0.09] text-purple-300 font-semibold py-3 rounded-xl border border-purple-500/30 transition shadow-md text-xs disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Requisition...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Extract Parameters & Validate Criteria</span>
                </>
              )}
            </button>
          </div>

          {/* Granular Parameters */}
          <div className="bg-[#09090d]/60 border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Granular Requisition Parameters (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="50x Ergonomic Chairs"
                  className="w-full bg-black/60 border border-white/[0.07] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.07] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Budget ({currency})</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/[0.07] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/[0.07] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parameter Summary Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#09090d] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-semibold text-white text-xs">Extraction Summary</span>
              <span className="text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
                SCHEMA VALIDATED
              </span>
            </div>

            {parsedData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-2 bg-black/50 p-3.5 rounded-2xl border border-white/[0.05]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Target Requisition:</span>
                    <span className="font-semibold text-white">{parsedData.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="font-bold text-purple-300 font-mono">{parsedData.quantity} units</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Budget Ceiling:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${parsedData.budget?.toLocaleString()} {parsedData.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Delivery Window:</span>
                    <span className="text-white">{parsedData.deadline}</span>
                  </div>
                </div>

                {/* Key specs */}
                {parsedData.keySpecs && parsedData.keySpecs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      Identified Technical Criteria:
                    </span>
                    <div className="space-y-1">
                      {parsedData.keySpecs.map((spec: string, i: number) => (
                        <div key={i} className="flex items-start space-x-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl text-[11px] text-purple-200 leading-relaxed">
                  The automated cycle will scan suppliers, dispatch RFQs, analyze pricing quotes, and negotiate volume discounts for your approval.
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-xs text-rose-300">
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleConfirmAndLaunch}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-xl shadow-purple-950/50 transition-all hover:scale-[1.02] text-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Launching Sourcing Cycle...</span>
                  ) : (
                    <>
                      <span>Confirm & Launch Sourcing Cycle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <div className="py-12 text-center space-y-2 text-slate-500 text-xs">
                <p>Click "Extract Parameters" to validate natural language into structured procurement schema.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
