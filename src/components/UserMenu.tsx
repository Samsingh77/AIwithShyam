import React, { useState } from 'react';
import { User, LogOut, LayoutDashboard, Shield, Activity, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MASTER_PLATFORM_CONFIG } from '../constants/apps';
import { PlatformConfig } from '../services/ecosystemService';

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
  onDashboardClick?: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  variant?: 'nav' | 'dashboard';
  platformConfig?: PlatformConfig | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({ 
  user, 
  onSignOut, 
  onDashboardClick, 
  onAdminClick, 
  isAdmin,
  variant = 'nav',
  platformConfig
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = name.charAt(0).toUpperCase();

  const hubName = platformConfig?.hubName || MASTER_PLATFORM_CONFIG.hubName;

  return (
    <div className="relative font-sans z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center transition-all rounded-full p-0.5 hover:bg-white/10 ring-offset-black focus:ring-2 focus:ring-emerald-500/50 outline-none",
          variant === 'dashboard' && "ml-4 border-l border-white/10 pl-4"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10 hover:border-emerald-500/50 transition-colors">
          {user.is_anonymous ? <User size={16} /> : <div className="text-[10px] font-bold">{initial}</div>}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-3 w-56 bg-black/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 p-1.5"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">Signed in as</p>
                <p className="text-xs font-medium text-white truncate">{user.email}</p>
              </div>

              <button 
                onClick={() => {
                  setIsOpen(false);
                  onDashboardClick?.();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-left"
              >
                <LayoutDashboard size={16} strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium whitespace-nowrap">Platform Hub</span>
                  <span className="text-[9px] text-gray-600 truncate">{hubName}</span>
                </div>
              </button>

              {isAdmin && onAdminClick && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onAdminClick();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all text-left"
                >
                  <Shield size={16} strokeWidth={1.5} />
                  <span className="text-xs font-medium">Admin Portal</span>
                </button>
              )}

              <div className="h-px bg-white/5 my-1.5" />

              <button 
                onClick={() => {
                  setIsOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all text-left group"
              >
                <LogOut size={16} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-medium">Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
