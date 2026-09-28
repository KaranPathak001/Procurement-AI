import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { BackgroundGrid, Spotlight } from '../components/aceternity';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('karan@acmetech.com');
  const [password, setPassword] = useState('password123');
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
      navigate('/dashboard');
    } catch (err: any) {
      localStorage.setItem('procureai_token', 'demo_jwt_token_2026');
      localStorage.setItem(
        'procureai_user',
        JSON.stringify({ name: 'Karan Patel', email, companyName: 'Acme Technologies', role: 'procurement_lead' })
      );
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      await api.post('/demo/seed');
    } catch (e) {}
    localStorage.setItem('procureai_token', 'demo_jwt_token_2026');
    localStorage.setItem(
      'procureai_user',
      JSON.stringify({ name: 'Karan Patel', email: 'karan@acmetech.com', companyName: 'Acme Technologies', role: 'procurement_lead' })
    );
    navigate('/dashboard');
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
          <p className="text-xs text-slate-400">Sign in to your enterprise procurement workspace</p>
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
                placeholder="karan@acmetech.com"
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
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-950/50 transition hover:scale-102 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
          >
            Launch Instant Demo Workspace (Karan Patel / Acme)
          </button>

          <div className="text-center text-xs text-slate-500">
            Don't have an organization account?{' '}
            <Link to="/register" className="text-purple-400 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </BackgroundGrid>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Karan Patel');
  const [email, setEmail] = useState('karan@acmetech.com');
  const [password, setPassword] = useState('password123');
  const [companyName, setCompanyName] = useState('Acme Technologies');
  const [companySize, setCompanySize] = useState('50-250');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        companyName,
        companySize,
      });
      localStorage.setItem('procureai_token', res.data.token);
      localStorage.setItem('procureai_user', JSON.stringify(res.data.user));
      navigate('/onboarding');
    } catch (err) {
      localStorage.setItem('procureai_token', 'demo_jwt_token_2026');
      localStorage.setItem('procureai_user', JSON.stringify({ name, email, companyName }));
      navigate('/onboarding');
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
          <p className="text-xs text-slate-400">Create your company's procurement account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Company / Organization Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Company Headcount</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
            >
              <option value="10-50">10-50 employees</option>
              <option value="50-250">50-250 employees</option>
              <option value="250-1000">250-1000 employees</option>
              <option value="1000+">1000+ Enterprise</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-950/50 transition hover:scale-102 mt-2"
          >
            <span>{loading ? 'Creating...' : 'Continue to Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </BackgroundGrid>
  );
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([
    'Ergonomic Office Furniture',
    'IT Hardware & Laptops',
    'Packaging & Logistics',
  ]);
  const [monthlySpend, setMonthlySpend] = useState('50000');
  const [location, setLocation] = useState('Delhi, India');
  const [currency, setCurrency] = useState('USD');

  const availableCategories = [
    'Ergonomic Office Furniture',
    'IT Hardware & Laptops',
    'Packaging & Logistics',
    'Office Pantry & Hospitality',
    'Data Infrastructure & Servers',
    'Marketing & Print Media',
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleFinish = async () => {
    try {
      await api.post('/onboarding', {
        procurementCategories: categories,
        monthlySpendBudget: Number(monthlySpend),
        procurementLocation: location,
        preferredCurrency: currency,
      });
    } catch (e) {}
    navigate('/dashboard');
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

        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">What does your company regularly buy?</label>
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
              <label className="text-slate-300 font-semibold block mb-1">Primary Procurement Location</label>
              <input
                type="text"
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
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Typical Monthly Procurement Budget</label>
            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500/50 font-mono"
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-950/50 transition hover:scale-102 mt-4"
          >
            <span>Complete Setup & Open Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </BackgroundGrid>
  );
};
