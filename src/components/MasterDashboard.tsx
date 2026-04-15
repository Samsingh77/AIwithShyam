import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Shield, Zap, Layers, Cpu, Maximize, 
  ArrowUpRight, Settings, CreditCard, Bell, Wallet, 
  History, LayoutDashboard, Grid, Image as ImageIcon,
  LogOut, ChevronRight, Activity
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '../lib/utils';
import { TransactionHistory } from './TransactionHistory';
import { RecentAssets } from './RecentAssets';

interface MasterDashboardProps {
  user: any;
  onBackToLanding?: () => void;
}

const tools = [
  {
    id: 'graph',
    title: "GraphToSheets",
    description: "Transform chart images into editable Excel spreadsheets.",
    icon: Layers,
    url: "https://graphtosheets.aiwithshyam.com",
    color: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-400",
    status: "Active"
  },
  {
    id: 'headshots',
    title: "HeadshotStudioPro",
    description: "Premium AI-generated professional headshots.",
    icon: Cpu,
    url: "https://headshotstudiopro.com",
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-400",
    status: "Active"
  },
  {
    id: 'geonex',
    title: "GeoNex",
    description: "Advanced Geospatial AI for deep spatial analysis.",
    icon: Maximize,
    url: "https://geonex.aiwithshyam.com",
    color: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-400",
    status: "Beta"
  }
];

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ user, onBackToLanding }) => {
  const [profile, setProfile] = useState<any>(null);
  const [tokens, setTokens] = useState<number>(0);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'assets' | 'billing'>('overview');

  useEffect(() => {
    if (user) {
      const isGuest = user.is_anonymous;
      setProfile({
        name: isGuest ? 'Guest Explorer' : (user.user_metadata?.full_name || user.email?.split('@')[0]),
        email: isGuest ? 'Anonymous Session' : user.email,
        avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        plan: isGuest ? 'Guest Access' : 'Pro Member',
        joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isGuest
      });

      const fetchTokens = async () => {
        if (!isSupabaseConfigured) return;
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('tokens')
            .eq('id', user.id)
            .single();
          
          if (error) {
            if (error.code === 'PGRST116') {
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([{ id: user.id, tokens: 1 }])
                .select()
                .single();
              if (!createError) setTokens(newProfile.tokens);
            }
          } else {
            setTokens(data.tokens || 0);
          }
        } catch (err) {
          console.error("Error fetching tokens:", err);
        } finally {
          setLoadingTokens(false);
        }
      };

      fetchTokens();

      const channel = supabase
        .channel('profile_changes')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, (payload) => {
          setTokens(payload.new.tokens);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  if (!profile) return null;

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        activeTab === id 
          ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={18} className={cn(activeTab === id ? "text-black" : "group-hover:text-emerald-400")} />
      <span className="text-sm font-sans">{label}</span>
      {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="max-w-[1600px] mx-auto flex">
        
        {/* Left Sidebar */}
        <aside className="w-72 h-screen sticky top-0 border-r border-white/5 p-6 flex flex-col bg-[#080808]">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-3 mb-12 px-2 group hover:opacity-80 transition-all"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-black fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter uppercase text-white">AI Suite</span>
          </button>

          <nav className="space-y-2 flex-1">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
            <SidebarItem id="apps" icon={Grid} label="AI Apps" />
            <SidebarItem id="assets" icon={ImageIcon} label="My Assets" />
            <SidebarItem id="billing" icon={CreditCard} label="Billing & Credits" />
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-2">
            {onBackToLanding && (
              <button 
                onClick={onBackToLanding}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all"
              >
                <ArrowUpRight size={18} className="rotate-180" />
                <span className="text-sm font-sans">Back to Home</span>
              </button>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all">
              <Settings size={18} />
              <span className="text-sm font-sans">Settings</span>
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-sans">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10">
          
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
                {activeTab === 'overview' && `Welcome, ${profile.name.split(' ')[0]}`}
                {activeTab === 'apps' && 'AI Application Suite'}
                {activeTab === 'assets' && 'Asset Management'}
                {activeTab === 'billing' && 'Wallet & Transactions'}
              </h1>
              <p className="text-gray-500 text-sm font-body">
                {activeTab === 'overview' && "Here's what's happening across your ecosystem."}
                {activeTab === 'apps' && 'Launch specialized AI tools for your workflow.'}
                {activeTab === 'assets' && 'Access all your generated images and data.'}
                {activeTab === 'billing' && 'Manage your shared wallet and audit trail.'}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Token Quick View */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 hover:border-emerald-500/30 transition-all">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Wallet size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1.5">Balance</p>
                  <p className="text-lg font-mono font-bold text-white leading-none">
                    {loadingTokens ? '...' : tokens.toLocaleString()} <span className="text-xs text-emerald-500/50">CRDTS</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="relative">
                  <img src={profile.avatar} className="w-11 h-11 rounded-full border-2 border-white/10 bg-black" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
                </div>
                <div className="hidden xl:block">
                  <p className="text-sm font-bold text-white leading-none mb-1.5">{profile.name}</p>
                  <p className="text-[10px] text-gray-500 leading-none uppercase tracking-wider font-bold">{profile.plan}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/10 rounded-3xl p-8 hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Activity size={20} className="text-emerald-400" />
                        </div>
                        <h4 className="font-bold text-gray-300 font-sans">Usage Stats</h4>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-sm text-gray-500 font-body">Charts Extracted</span>
                          <span className="text-3xl font-display font-bold text-white">12</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-sm text-gray-500 font-body">Headshots Generated</span>
                          <span className="text-3xl font-display font-bold text-white">4</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 rounded-3xl p-8 hover:border-purple-500/20 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <ImageIcon size={20} className="text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-300 font-sans">Recent Assets</h4>
                      </div>
                      <div className="flex -space-x-4 overflow-hidden mb-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-14 h-14 rounded-2xl border-2 border-[#0a0a0a] bg-white/5 overflow-hidden">
                            <img src={`https://picsum.photos/seed/${i+10}/100/100`} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                        <div className="w-14 h-14 rounded-2xl border-2 border-[#0a0a0a] bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 backdrop-blur-sm">
                          +8
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-body">Last generated 45 mins ago</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-white/10 rounded-3xl p-8 hover:border-amber-500/20 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Shield size={20} className="text-amber-400" />
                        </div>
                        <h4 className="font-bold text-gray-300 font-sans">Security Status</h4>
                      </div>
                      <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        System Protected
                      </div>
                      <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Encrypted Session Active</p>
                    </div>
                  </div>

                  {/* Quick Launch */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-white">Quick Launch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {tools.map(tool => (
                        <button 
                          key={tool.id}
                          onClick={() => window.open(tool.url, '_blank')}
                          className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-emerald-500/30 transition-all hover:bg-emerald-500/[0.02]"
                        >
                          <div className={cn("p-3 rounded-xl bg-black/40 border border-white/5 w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg", tool.accent)}>
                            <tool.icon size={22} />
                          </div>
                          <h4 className="font-bold text-white mb-1 font-sans">{tool.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1 font-body">{tool.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'apps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tools.map((tool, idx) => (
                    <motion.div
                      key={tool.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "group relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl p-8 transition-all hover:border-emerald-500/30",
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", tool.color)} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                          <div className={cn("p-5 rounded-2xl bg-black/40 border border-white/5 shadow-xl", tool.accent)}>
                            <tool.icon size={32} />
                          </div>
                          <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-black/40", tool.accent)}>
                            {tool.status}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">{tool.title}</h3>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed font-body">
                          {tool.description}
                        </p>
                        
                        <a 
                          href={tool.url}
                          className="flex items-center justify-between w-full px-8 py-4 bg-white/5 hover:bg-emerald-500 text-gray-300 hover:text-black rounded-2xl font-bold transition-all group/btn shadow-lg"
                        >
                          Launch App
                          <ArrowUpRight size={20} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'assets' && (
                <RecentAssets userId={user.id} />
              )}

              {activeTab === 'billing' && (
                <div className="space-y-10">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                      <Wallet size={200} className="text-emerald-500" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div>
                        <h3 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">Shared Wallet Balance</h3>
                        <p className="text-gray-400 text-base max-w-md font-body leading-relaxed">Your tokens are shared across all Shyam Singh AI tools. Purchase once, use everywhere.</p>
                      </div>
                      <div className="text-center md:text-right bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-w-[240px]">
                        <p className="text-6xl font-display font-bold text-white mb-2 tracking-tighter">{tokens.toLocaleString()}</p>
                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-[0.2em]">Available Credits</p>
                      </div>
                    </div>
                  </div>
                  <TransactionHistory userId={user.id} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
