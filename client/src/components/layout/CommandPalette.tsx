import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const navigationCommands = [
    { title: 'New Procurement Request', icon: Search, path: '/new-procurement', shortcut: 'N' },
    { title: 'Active Procurements Workspace', icon: Search, path: '/procurements', shortcut: 'P' },
    { title: 'Pending Purchase Approvals', icon: FileCheck, path: '/approvals', shortcut: 'A' },
    { title: 'Vendor Intelligence & Catalogs', icon: TrendingUp, path: '/vendors', shortcut: 'V' },
    { title: 'Purchase Orders Archive', icon: FileCheck, path: '/purchase-orders', shortcut: 'O' },
    { title: 'Analytics & Spend Intelligence', icon: TrendingUp, path: '/analytics', shortcut: 'S' },
  ];

  const handleRunCommand = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleAskAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/chat', { query });
      setAiResponse(res.data.reply);
      if (res.data.structuredAction?.type === 'NAVIGATE') {
        setTimeout(() => {
          navigate(res.data.structuredAction.path);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setAiResponse('You can query approvals, supplier savings, or order statuses.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header / Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/40">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Enter' && isAiMode) handleAskAgent(e);
              }}
              placeholder={
                isAiMode
                  ? "Ask procurement agent: 'Show pending approvals' or 'Why ErgoWorks?'..."
                  : "Type a command or search..."
              }
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
            />
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                isAiMode
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Agent Query
            </button>
            <button onClick={onClose} className="ml-3 text-slate-500 hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Mode Output */}
          {isAiMode ? (
            <div className="p-5 max-h-96 overflow-y-auto space-y-4">
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Agent Query Response
              </div>
              {isAiLoading && (
                <div className="flex items-center space-x-3 text-slate-400 text-sm py-4">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing procurement data...</span>
                </div>
              )}
              {aiResponse && (
                <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </div>
              )}
              {!aiResponse && !isAiLoading && (
                <div className="text-xs text-slate-500 space-y-1.5">
                  <p>Try querying:</p>
                  <p className="text-slate-400 italic">"Show me all pending purchase approvals"</p>
                  <p className="text-slate-400 italic">"Why did you recommend ErgoWorks over FurniTech?"</p>
                  <p className="text-slate-400 italic">"Which vendor saved us the most money this quarter?"</p>
                </div>
              )}
            </div>
          ) : (
            /* Navigation List */
            <div className="py-2 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Navigation
              </div>
              {navigationCommands
                .filter((cmd) => cmd.title.toLowerCase().includes(query.toLowerCase()))
                .map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunCommand(cmd.path)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <cmd.icon className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      <span>{cmd.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {cmd.shortcut}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Navigation: ↑ ↓ · Select: ↵ · Close: ESC</span>
            <span className="text-purple-400 font-medium">ProcureAI v2.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
