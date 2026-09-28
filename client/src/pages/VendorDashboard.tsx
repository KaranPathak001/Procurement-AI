import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  FileText,
  CheckCircle,
  ShoppingCart,
  Plus,
  PackageOpen,
  DollarSign,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GlowingCard } from '../components/aceternity';
import api from '../services/api';

export const VendorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('procureai_user');
  const user = userJson ? JSON.parse(userJson) : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, rfqRes] = await Promise.all([
          api.get('/vendor/dashboard'),
          api.get('/vendor/rfqs'),
        ]);
        if (dashRes.data?.metrics) setMetrics(dashRes.data.metrics);
        if (dashRes.data?.recentOrders) setOrders(dashRes.data.recentOrders);
        if (rfqRes.data?.rfqs) setRfqs(rfqRes.data.rfqs.slice(0, 5));
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('procureai_token');
          localStorage.removeItem('procureai_user');
          navigate('/login');
        } else {
          setError(err.response?.data?.error || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const firstName = user.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[#09090d]/80 border border-white/[0.07] backdrop-blur-2xl"
      >
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-400">
            Vendor Portal · {user.companyName || 'Supplier Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hello, {firstName}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            {metrics.pendingRFQs > 0
              ? `You have ${metrics.pendingRFQs} new RFQ${metrics.pendingRFQs > 1 ? 's' : ''} awaiting your quote.`
              : 'Your supplier workspace is ready. Add products to appear in buyer searches.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vendor/products"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>
        </div>
      </motion.div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowingCard glowColor="rgba(147, 51, 234, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending RFQs</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{loading ? '—' : (metrics.pendingRFQs ?? 0)}</div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.pendingRFQs > 0 ? (
              <Link to="/vendor/rfqs" className="text-purple-400 hover:underline flex items-center gap-0.5">
                Submit quotes <ArrowUpRight className="w-3 h-3" />
              </Link>
            ) : 'No new RFQs'}
          </div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(59, 130, 246, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Quotes</span>
            <Send className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{loading ? '—' : (metrics.activeQuotes ?? 0)}</div>
          <div className="text-[11px] text-slate-400 mt-2">Submitted, awaiting buyer decision</div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(16, 185, 129, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Won Quotes</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{loading ? '—' : (metrics.acceptedQuotes ?? 0)}</div>
          <div className="text-[11px] text-slate-400 mt-2">Selected by buyers</div>
        </GlowingCard>

        <GlowingCard glowColor="rgba(245, 158, 11, 0.12)">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {loading ? '—' : formatCurrency(metrics.totalRevenue ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.productsListed > 0 ? `${metrics.productsListed} products listed` : 'No products yet'}
          </div>
        </GlowingCard>
      </div>

      {/* Pending RFQs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Pending RFQs</h2>
            <p className="text-xs text-slate-400">Buyers requesting your quotes. Respond quickly to win orders.</p>
          </div>
          {rfqs.length > 0 && (
            <Link to="/vendor/rfqs" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {!loading && rfqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 rounded-2xl bg-[#09090d]/60 border border-dashed border-white/[0.08] text-center"
          >
            <Package className="w-10 h-10 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">No RFQs yet</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Add products to your catalog and buyers will send you RFQs when they need items in your categories.
            </p>
            <Link
              to="/vendor/products"
              className="mt-5 flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Products</span>
            </Link>
          </motion.div>
        )}

        {rfqs.length > 0 && (
          <div className="space-y-3">
            {rfqs.map((rfq, idx) => (
              <motion.div
                key={rfq._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center justify-between p-4 rounded-xl bg-[#09090d]/70 border border-white/[0.07] hover:border-purple-500/30 transition group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    {rfq.procurementRequestId?.title || 'Procurement Request'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {rfq.procurementRequestId?.category} · Qty: {rfq.procurementRequestId?.quantity}
                    {rfq.procurementRequestId?.budget
                      ? ` · Budget: ${formatCurrency(rfq.procurementRequestId.budget, rfq.procurementRequestId.currency)}`
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    rfq.status === 'quoted'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {rfq.status === 'quoted' ? 'Quoted' : 'Awaiting Quote'}
                  </span>
                  {rfq.status !== 'quoted' && (
                    <Link
                      to={`/vendor/rfqs/${rfq._id}`}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                    >
                      Submit Quote →
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Recent Orders</h2>
        {!loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl bg-[#09090d]/60 border border-dashed border-white/[0.08] text-center">
            <PackageOpen className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">No orders yet. Win RFQs to receive purchase orders.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order, idx) => (
              <div
                key={order._id || idx}
                className="flex items-center justify-between p-4 rounded-xl bg-[#09090d]/70 border border-white/[0.07]"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-200">{order.poNumber}</p>
                  <p className="text-[11px] text-slate-500">
                    {order.procurementId?.title || 'Purchase Order'} · {order.companyId?.name || 'Buyer'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-white">{formatCurrency(order.totalAmount, order.currency)}</p>
                  <p className="text-[11px] text-emerald-400">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
