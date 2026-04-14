import React, { useState } from 'react';
import { ChevronDown, LayoutGrid, Layers, Cpu, Maximize, ExternalLink, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SuiteSwitcherProps {
  currentApp?: string;
  onLogout?: () => void;
  onDashboardClick?: () => void;
}

const apps = [
  {
    id: 'dashboard',
    name: 'Master Dashboard',
    description: 'Central Hub',
    icon: LayoutGrid,
    url: '/',
    color: 'text-emerald-400'
  },
  {
    id: 'graphtosheets',
    name: 'GraphToSheets',
    description: 'Chart to Excel',
    icon: Layers,
    url: 'https://graphtosheets.aiwithshyam.com',
    color: 'text-emerald-400'
  },
  {
    id: 'headshot',
    name: 'HeadshotStudioPro',
    description: 'AI Photography',
    icon: Cpu,
    url: 'https://headshotstudiopro.com',
    color: 'text-purple-400'
  },
  {
    id: 'geonex',
    name: 'GeoNex',
    description: 'Spatial AI',
    icon: Maximize,
    url: 'https://geonex.aiwithshyam.com',
    color: 'text-amber-400'
  }
];

export const SuiteSwitcher: React.FC<SuiteSwitcherProps> = ({ currentApp = 'dashboard', onLogout, onDashboardClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeApp = apps.find(a => a.id === currentApp) || apps[0];

  return (
    <div className="relative z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
      >
        <div className={cn("p-1.5 rounded-lg bg-black/40", activeApp.color)}>
          <activeApp.icon size={18} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">Master Suite</p>
          <p className="text-sm font-bold text-white leading-none">{activeApp.name}</p>
        </div>
        <ChevronDown size={16} className={cn("text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-2 grid gap-1">
                {apps.map((app) => (
                  app.id === 'dashboard' ? (
                    <button
                      key={app.id}
                      onClick={() => {
                        onDashboardClick?.();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all group",
                        app.id === currentApp ? "bg-white/5" : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors",
                        app.color
                      )}>
                        <app.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-white truncate">{app.name}</p>
                        <p className="text-xs text-gray-500 truncate">{app.description}</p>
                      </div>
                    </button>
                  ) : (
                    <a
                      key={app.id}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all group",
                        app.id === currentApp ? "bg-white/5" : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors",
                        app.color
                      )}>
                        <app.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{app.name}</p>
                        <p className="text-xs text-gray-500 truncate">{app.description}</p>
                      </div>
                      <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400" />
                    </a>
                  )
                ))}
              </div>

              <div className="border-t border-white/5 p-2 bg-white/[0.02]">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-red-500/20">
                    <LogOut size={18} />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
