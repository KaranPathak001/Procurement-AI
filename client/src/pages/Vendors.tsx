import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import api from '../services/api';

export const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        const list = res.data.vendors || [];
        setVendors(list);
        if (list.length > 0) {
          setSelectedVendor(list[0]);
        }
      } catch (err) {
        setVendors([]);
      }
    };
    fetchVendors();
  }, []);

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categories?.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Supplier Intelligence & Performance Scoring</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Vendor Directory</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            AI-evaluated supplier profiles, historical SLA ratings, and aggregate enterprise savings.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090d] border border-white/[0.07] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vendor cards list */}
        <div className="lg:col-span-7">
          {filtered.length === 0 ? (
            <div className="bg-[#09090d]/60 border border-white/[0.07] rounded-3xl p-12 text-center text-slate-400">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-200">No Suppliers Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery ? `No vendors match "${searchQuery}".` : 'No vendors have registered or been added to the directory yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((vendor) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    selectedVendor?._id === vendor._id
                      ? 'bg-purple-950/20 border-purple-500/50 shadow-xl'
                      : 'bg-[#09090d]/60 border-white/[0.07] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{vendor.name}</h3>
                      <span className="text-xs text-slate-400">{vendor.location}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded-full">
                      {vendor.reliabilityScore || 90}% SLA
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {vendor.categories?.slice(0, 2).map((cat: string, i: number) => (
                      <span key={i} className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-slate-400 border border-white/[0.04]">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 pt-3 border-t border-white/[0.05] grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Avg Lead</span>
                      <span className="font-semibold text-slate-200 font-mono">{vendor.averageDeliveryDays || 14}d</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Avg Discount</span>
                      <span className="font-semibold text-emerald-400 font-mono">+{vendor.historicalSavingsPct || 10}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total Spend</span>
                      <span className="font-semibold text-white font-mono">{formatCurrency(vendor.totalSpendAmount || 0)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Vendor Detail Panel */}
        <div className="lg:col-span-5">
          {selectedVendor && (
            <div className="bg-[#09090d] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-24">
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">{selectedVendor.name}</h2>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedVendor.location}</p>
                </div>
                <span className="text-[9px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                  VERIFIED SUPPLIER
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.05]">
                  <span className="text-slate-500 block text-[10px]">Reliability SLA</span>
                  <span className="text-lg font-bold text-white font-mono">{selectedVendor.reliabilityScore}%</span>
                </div>
                <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.05]">
                  <span className="text-slate-500 block text-[10px]">Historical Discount</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">+{selectedVendor.historicalSavingsPct}%</span>
                </div>
                <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.05]">
                  <span className="text-slate-500 block text-[10px]">Orders Completed</span>
                  <span className="text-lg font-bold text-white font-mono">{selectedVendor.completedOrdersCount}</span>
                </div>
                <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.05]">
                  <span className="text-slate-500 block text-[10px]">Cumulative Spend</span>
                  <span className="text-lg font-bold text-white font-mono">{formatCurrency(selectedVendor.totalSpendAmount)}</span>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-300">Supplier Key Contacts</span>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.05] space-y-1">
                  <p className="font-medium text-white">{selectedVendor.contacts?.[0]?.name || 'Enterprise Sales VP'}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedVendor.contacts?.[0]?.email || 'sales@vendor.com'}</p>
                  <p className="text-slate-500 text-[10px]">Primary contact for RFQ dispatch & volume discount negotiation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
