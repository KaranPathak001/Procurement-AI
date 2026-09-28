import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, Building2, Users } from 'lucide-react';
import { BackgroundGrid, Spotlight } from '../components/aceternity';
import api from '../services/api';

// ─── Login Page ──────────────────────────────────────────────────────────────
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('procureai_token', res.data.token);
      localStorage.setItem('procureai_user', JSON.stringify(res.data.user));

      // Route based on role
      const role = res.data.user?.role;
      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Invalid credentials. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex items-center justify-center p-4">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-bold text-2xl tracking-tight text-white">
              Procure<span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400">Sign in to your procurement workspace</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-950/50 transition disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register now
          </Link>
        </div>
      </motion.div>
    </BackgroundGrid>
  );
};

// ─── Register Page ───────────────────────────────────────────────────────────
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'buyer' | 'vendor'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('50-250');
  const [vendorCategories, setVendorCategories] = useState('');
  const [vendorLocation, setVendorLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: any = { name, email, password, role, companyName };
      if (role === 'buyer') {
        payload.companySize = companySize;
      } else {
        payload.categories = vendorCategories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
        payload.location = vendorLocation;
      }

      const res = await api.post('/auth/register', payload);
      localStorage.setItem('procureai_token', res.data.token);
      localStorage.setItem('procureai_user', JSON.stringify(res.data.user));

      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex items-center justify-center p-4">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-bold text-2xl tracking-tight text-white">
              Procure<span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400">Create your account</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'buyer', label: 'Buyer / Company', icon: Building2, desc: 'Source & procure products' },
            { id: 'vendor', label: 'Vendor / Supplier', icon: Users, desc: 'List products & get orders' },
          ].map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id as any)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition ${
                role === id
                  ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{label}</span>
              <span className="text-slate-500 text-[10px] text-center">{desc}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              {role === 'buyer' ? 'Company Name' : 'Business / Brand Name'}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={role === 'buyer' ? 'Acme Technologies' : 'ErgoWorks Suppliers'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {role === 'buyer' && (
            <div>
              <label className="text-slate-300 font-medium block mb-1">Company Headcount</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              >
                <option value="1-10">1–10 employees</option>
                <option value="10-50">10–50 employees</option>
                <option value="50-250">50–250 employees</option>
                <option value="250-1000">250–1000 employees</option>
                <option value="1000+">1000+ Enterprise</option>
              </select>
            </div>
          )}

          {role === 'vendor' && (
            <>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Product Categories</label>
                <input
                  type="text"
                  value={vendorCategories}
                  onChange={(e) => setVendorCategories(e.target.value)}
                  placeholder="e.g. Office Furniture, IT Hardware, Packaging"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-slate-600 mt-0.5">Comma-separated</p>
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Business Location</label>
                <input
                  type="text"
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
                  placeholder="Mumbai, India"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-slate-300 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-950/50 transition disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </BackgroundGrid>
  );
};

// ─── Onboarding Page (Buyer only) ────────────────────────────────────────────
export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [monthlySpend, setMonthlySpend] = useState('');
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCategories = [
    'Ergonomic Office Furniture',
    'IT Hardware & Laptops',
    'Packaging & Logistics',
    'Office Pantry & Hospitality',
    'Data Infrastructure & Servers',
    'Marketing & Print Media',
    'Lab Equipment',
    'Safety & PPE',
    'Industrial Supplies',
  ];

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = async () => {
    if (!location.trim()) {
      setError('Please enter your primary procurement location.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/onboarding', {
        procurementCategories: categories,
        monthlySpendBudget: Number(monthlySpend) || 0,
        procurementLocation: location,
        preferredCurrency: currency,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex items-center justify-center p-4">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10"
      >
        <div className="space-y-1 text-center">
          <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider font-mono">
            Step 2 of 2 · Organization Setup
          </div>
          <h1 className="text-2xl font-bold text-white">Configure Procurement Preferences</h1>
          <p className="text-slate-400 text-xs">
            Tell ProcureAI what your organization buys and where your delivery facilities are located.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              What does your company regularly procure? <span className="text-slate-600">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const selected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      selected
                        ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Primary Delivery Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Delhi, India"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Preferred Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Typical Monthly Procurement Budget <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50 font-mono"
            />
          </div>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-950/50 transition disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Saving...' : 'Complete Setup & Open Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </BackgroundGrid>
  );
};
