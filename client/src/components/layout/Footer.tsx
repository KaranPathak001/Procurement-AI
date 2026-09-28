import React from 'react';
import { Link } from 'react-router-dom';
import { ProcureLogo } from '../branding/ProcureLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#030305] text-slate-400 text-xs relative z-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <ProcureLogo className="w-7 h-7" />
              <span className="font-bold text-lg text-white tracking-tight">
                Procure<span className="text-purple-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The autonomous AI employee for enterprise procurement. Ingesting requests, discovering certified suppliers, negotiating volume margins, and preparing audited purchase orders.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Built with mathematical rigor for modern finance teams.
            </div>
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#product" className="hover:text-white transition">Supplier Discovery</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Automated RFQs</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Quote Matrix</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Negotiation Intelligence</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Column: Solutions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Solutions</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><span className="hover:text-white transition cursor-pointer">IT & Workstations</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Office Infrastructure</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Packaging & Logistics</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Industrial Equipment</span></li>
              <li><span className="hover:text-white transition cursor-pointer">SaaS & Licenses (Coming soon)</span></li>
            </ul>
          </div>

          {/* Column: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Governance</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><span className="hover:text-white transition cursor-pointer">Human-in-the-Loop SLA</span></li>
              <li><span className="hover:text-white transition cursor-pointer">SOC2 Compliance</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Audit Logs</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-4">
          <div>
            © 2026 ProcureAI Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-slate-300 cursor-pointer">Status: All Systems Operational</span>
            <span className="hover:text-slate-300 cursor-pointer">Delhi / Singapore / SF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
