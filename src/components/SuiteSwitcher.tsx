import React, { useState } from 'react';
import { ChevronDown, LayoutGrid, Layers, Cpu, Maximize, ExternalLink, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { APPS_COLLECTION, MASTER_PLATFORM_CONFIG } from '../constants/apps';
import { ICON_MAP, AppEntry } from '../services/ecosystemService';

interface SuiteSwitcherProps {
  currentApp?: string;
  onLogout?: () => void;
  onDashboardClick?: () => void;
  dynamicApps?: AppEntry[];
}

export const SuiteSwitcher: React.FC<SuiteSwitcherProps> = ({ 
  currentApp = 'dashboard', 
  onLogout, 
  onDashboardClick,
  dynamicApps = [] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Transition to dynamic apps if provided, otherwise fallback
  const baseApps = dynamicApps.length > 0 
    ? dynamicApps.map(app => ({
        id: app.id,
        title: app.title,
        description: app.description,
        icon: ICON_MAP[app.icon_name] || LayoutGrid,
        url: app.url,
        accent: app.accent_color
      }))
    : APPS_COLLECTION;

  const apps = baseApps;
  const activeApp = apps.find(a => a.id === currentApp) || { 
    id: 'suite', 
    title: 'Ecosystem', 
    icon: LayoutGrid, 
    accent: 'text-emerald-400' 
  };

  return (
    <div className="relative z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0a0a0a] hover:bg-black border border-white/20 rounded-full transition-all group shadow-xl"
      >
        <div className="p-1 px-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black tracking-tighter">
          HUB
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-0.5">Ecosystem</p>
          <p className="text-[11px] font-bold text-white leading-none">AI Suite</p>
        </div>
        <ChevronDown size={11} className={cn("text-gray-500 transition-transform duration-300 ml-0.5", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full right-0 mt-3 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <div className="p-3 bg-white/[0.02] border-b border-white/5">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Connected Hub</p>
              </div>
              <div className="p-1 grid gap-0.5">
                {apps.map((app) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all group",
                      app.id === currentApp ? "bg-white/5" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 transition-all group-hover:scale-105 group-hover:border-white/10",
                      app.accent
                    )}>
                      <app.icon size={16} strokeWidth={2.5} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">{app.title}</p>
                      <p className="text-[10px] text-white/40 leading-relaxed font-medium whitespace-normal">{app.description}</p>
                    </div>
                    <ExternalLink size={10} className="text-white/20 group-hover:text-white/60 transition-colors" />
                  </a>
                ))}
              </div>
              <div className="p-3 bg-white/[0.01] border-t border-white/5 text-center">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Connected to Supabase Live</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
