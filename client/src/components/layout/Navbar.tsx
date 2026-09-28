import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { ProcureLogo } from '../branding/ProcureLogo';

interface NavbarProps {
  onGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030305]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-[1400px] h-16 sm:h-[68px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Custom SVG ProcureLogo (P + Forward Arrow) + Text */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <ProcureLogo className="w-7 h-7 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg tracking-tight text-white flex items-center">
            Procure<span className="text-purple-400">AI</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-400">
          <a href="#product" className="hover:text-white transition">Product</a>
          <a href="#solutions" className="hover:text-white transition">Solutions</a>
          <a href="#resources" className="hover:text-white transition">Resources</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </nav>

        {/* Right: Sign In & Get Started CTA with purple gradient */}
        <div className="hidden md:flex items-center space-x-5 text-xs font-semibold">
          <Link to="/login" className="text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <button
            onClick={onGetStarted}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-900/40 transition hover:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#09090d] border-b border-white/[0.08] px-6 py-4 space-y-3 text-sm overflow-hidden"
          >
            <a href="#product" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Product</a>
            <a href="#solutions" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
            <a href="#resources" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Resources</a>
            <a href="#pricing" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
              <Link to="/login" className="text-slate-300 text-center py-2">Sign In</Link>
              <button
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2.5 rounded-xl text-center"
              >
                Get Started →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
