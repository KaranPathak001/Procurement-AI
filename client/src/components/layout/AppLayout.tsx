import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  BadgeCheck,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Search,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { ProcureLogo } from '../branding/ProcureLogo';
import { CommandPalette } from './CommandPalette';
import api from '../../services/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userJson = localStorage.getItem('procureai_user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Karan Patel', companyName: 'Acme Technologies' };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    api.get('/notifications')
      .then((res) => {
        if (res.data?.notifications) {
          setNotifications(res.data.notifications);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Procurements', path: '/procurements', icon: ShoppingBag },
    { label: 'Vendors', path: '/vendors', icon: Building2 },
    { label: 'Approvals', path: '/approvals', icon: BadgeCheck, badge: '1' },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: ClipboardList },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('procureai_token');
    localStorage.removeItem('procureai_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f6] flex flex-col antialiased selection:bg-purple-500/25">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-white/[0.07] bg-[#050507]/90 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Custom ProcureLogo + Brand Text */}
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <ProcureLogo className="w-6 h-6 group-hover:scale-105 transition-transform" />
            <span className="font-bold text-base tracking-tight text-white flex items-center">
              Procure<span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center text-[11px] text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            <span className="text-slate-300 font-medium">{user.companyName || 'Acme Technologies'}</span>
            <span className="mx-1.5 text-slate-600">/</span>
            <span className="text-slate-400 font-mono text-[10px]">ENGINE READY</span>
          </div>
        </div>

        {/* Global Search & Command Trigger (⌘K) */}
        <div className="flex-1 max-w-sm mx-6 hidden sm:block">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/[0.12] rounded-lg transition-all"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Type a command or search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-black/50 border border-white/10 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          <Link
            to="/new-procurement"
            className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-purple-950/40 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Procurement</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] relative transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#09090d] border border-white/[0.1] rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs font-semibold text-slate-300">
                  <span>Notifications</span>
                  <span className="text-[10px] text-purple-400 font-mono">FEED</span>
                </div>
                <div className="py-2 space-y-2 max-h-64 overflow-y-auto text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="font-medium text-slate-200">6 Quotations Received</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">ErgoWorks and OfficePro quotes ingested for PR-1048.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
                    <p className="font-medium text-purple-200">Purchase Requires Approval</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">50x Ergonomic Chairs ($9,840) awaiting authorization.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile & Logout */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-white/[0.08]">
            <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-[11px] font-bold text-purple-300">
              {user.name ? user.name.charAt(0) : 'K'}
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1 text-slate-500 hover:text-slate-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Secondary Navigation Tab Bar */}
      <nav className="border-b border-white/[0.05] bg-[#050507]/60 backdrop-blur-md px-4 lg:px-8 flex items-center space-x-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-purple-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 text-[9px] px-1.5 py-0.2 font-mono rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="flex-1" />
        <Link
          to="/settings"
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition ${
            location.pathname === '/settings' ? 'text-purple-400' : ''
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative pb-16">{children}</main>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
};
