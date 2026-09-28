import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Printer,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import api from '../services/api';

export const PurchaseOrdersPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const res = await api.get('/purchase-orders');
        const list = res.data.purchaseOrders || [];
        setPurchaseOrders(list);
        if (list.length > 0) {
          setSelectedPO(list[0]);
        }
      } catch (err) {
        setPurchaseOrders([]);
      }
    };
    fetchPOs();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Commercial Contracts & Commitments</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Purchase Orders</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Audited, legally binding purchase orders automatically generated post human approval.
          </p>
        </div>

        {selectedPO && (
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/[0.08] transition"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span>Export / Print PO PDF</span>
          </button>
        )}
      </div>

      {purchaseOrders.length === 0 ? (
        <div className="bg-[#09090d]/60 border border-white/[0.07] rounded-3xl p-16 text-center text-slate-400">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Purchase Orders Issued</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once you review quotes and approve a purchase proposal in Approvals, binding POs will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: PO list */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-1">
              Issued Orders ({purchaseOrders.length})
            </h3>
            {purchaseOrders.map((po) => (
              <div
                key={po._id}
                onClick={() => setSelectedPO(po)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedPO?._id === po._id
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-md'
                    : 'bg-[#09090d]/60 border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-purple-300">{po.poNumber}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                    {po.status}
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-100">{po.vendorName}</div>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                  <span>{po.items?.length || 1} line item(s)</span>
                  <span className="font-bold text-white font-mono">{formatCurrency(po.totalAmount, po.currency)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detailed PO Document Viewer */}
          <div className="lg:col-span-8">
          {selectedPO ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#09090d] border border-white/[0.08] rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start border-b border-white/[0.06] pb-6">
                <div>
                  <div className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>Procure<span className="text-purple-400">AI</span></span>
                    <span className="text-xs font-mono font-normal text-slate-400">Official PO</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Acme Technologies Inc · Strategic Sourcing</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-bold text-purple-400">{selectedPO.poNumber}</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized: {new Date(selectedPO.approvedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Vendor & Shipping specs */}
              <div className="grid grid-cols-2 gap-6 text-xs bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05]">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block text-[10px]">Vendor:</span>
                  <p className="font-bold text-slate-200 text-sm">{selectedPO.vendorName}</p>
                  <p className="text-slate-400">Enterprise Accounts & Fulfillment Hub</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block text-[10px]">Ship To:</span>
                  <p className="font-medium text-slate-200">{selectedPO.deliveryAddress}</p>
                  <p className="text-slate-400">Delivery Window: {selectedPO.deliveryDeadline}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-white/[0.06] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/[0.06]">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-slate-300">
                    {selectedPO.items?.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.01]">
                        <td className="p-3 font-medium text-white">{item.description}</td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">{formatCurrency(item.unitPrice, selectedPO.currency)}</td>
                        <td className="p-3 text-right font-mono font-bold text-white">
                          {formatCurrency(item.subtotal, selectedPO.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Terms & Total */}
              <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 border-t border-white/[0.06] text-xs">
                <div className="space-y-1 max-w-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Payment Terms:</span>
                  <p>{selectedPO.paymentTerms}</p>
                  <p className="text-[10px] font-mono text-purple-400">AUDITED SIGNATURE: VERIFIED</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-slate-400 text-xs">Total Authorized Spend</span>
                  <div className="text-2xl font-bold text-white font-mono">
                    {formatCurrency(selectedPO.totalAmount, selectedPO.currency)}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Authorized Signer: {selectedPO.approvedByName || selectedPO.approvedBy || 'Procurement Lead'}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Select an order to inspect details.</div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
