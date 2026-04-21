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
  onAdminClick?: () => void;
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

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ user, onBackToLanding, onAdminClick }) => {
  const [profile, setProfile] = useState<any>(null);
  const [tokens, setTokens] = useState<number>(0);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const ADMIN_EMAIL = "shyamsingh1977@gmail.com";
  const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (user) {
      const isGuest = user.is_anonymous;
      const metaName = user.user_metadata?.full_name || user.email?.split('@')[0];
      const metaPhone = user.user_metadata?.phone_number || '';
      
      setProfile({
        name: isGuest ? 'Guest Explorer' : metaName,
        email: isGuest ? 'Anonymous Session' : user.email,
        phone: metaPhone,
        plan: isGuest ? 'Guest Access' : 'Pro Member',
        joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isGuest
      });

      setProfileData({
        fullName: metaName,
        phone: metaPhone
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

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.isGuest) return;
    
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileData.fullName,
          phone_number: profileData.phone
        }
      });
      
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        name: profileData.fullName,
        phone: profileData.phone
      }));
      
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!profile) return null;

  const SidebarItem = ({ icon: Icon, label, active }: any) => (
    <div
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        active 
          ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" 
          : "text-gray-400"
      )}
    >
      <Icon size={18} />
      <span className="text-sm font-sans">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="max-w-[1600px] mx-auto flex">
        
        {/* Left Sidebar */}
        <aside className="w-72 h-screen sticky top-0 border-r border-white/5 p-6 flex flex-col bg-[#080808]">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-2 mb-12 px-2 group hover:opacity-80 transition-all text-left"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-black text-xl tracking-tighter text-white group-hover:text-emerald-500 transition-colors">AI</span>
                <span className="font-display font-light text-xl tracking-tighter text-emerald-500/60 group-hover:text-emerald-400 transition-colors">WITH</span>
                <span className="font-display font-black text-xl tracking-tighter text-white group-hover:text-emerald-500 transition-colors">SHYAM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/10 group-hover:bg-emerald-500/30 transition-colors" />
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">Master Suite</span>
              </div>
            </div>
          </button>

          <nav className="space-y-1 flex-1">
            <SidebarItem icon={LayoutDashboard} label="Main Suite" active />
            
            {isAdmin && onAdminClick && (
               <button
                 onClick={onAdminClick}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-red-400/60 hover:bg-red-500/10 hover:text-red-400 mt-4 border border-red-500/10"
               >
                 <Shield size={18} className="group-hover:text-red-400" />
                 <span className="text-sm font-sans font-bold">Admin Portal</span>
               </button>
            )}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-2">
            {onBackToLanding && (
              <button 
                onClick={onBackToLanding}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-white/5 hover:text-emerald-400 transition-all group"
              >
                <LogOut size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-sans font-medium">Exit to Landing Page</span>
              </button>
            )}
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut size={16} />
              <span className="text-xs font-sans">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10">
          
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-xl font-display font-bold text-white mb-0.5 tracking-tight">
                Master Command Center
              </h1>
              <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
                {profile.name.split(' ')[0]}'s Private Ecosystem
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                  <User size={16} />
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-white leading-none">{profile.name}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Assets (Main Content) */}
            <div className="lg:col-span-8 space-y-12">
              <RecentAssets userId={user.id} />
              
              <div className="pb-10">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest px-1 mb-6">Recent Transactions</h3>
                <TransactionHistory userId={user.id} />
              </div>
            </div>

            {/* Right Column: Account & Wallet */}
            <div className="lg:col-span-4 space-y-6 sticky top-10 h-fit">
              {/* Wallet Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet size={16} className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live Credits</span>
                  </div>
                  <p className="text-4xl font-display font-bold text-white leading-none mb-1">{tokens.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 font-mono tracking-tighter">Unified Shared Balance</p>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                  <User size={14} /> Identity Details
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-5 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-emerald-500 outline-none transition-all"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Number</label>
                    <input 
                      type="tel" 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-emerald-500 outline-none transition-all"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isUpdatingProfile || profile.isGuest}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                  >
                    {isUpdatingProfile ? <Activity size={14} className="animate-spin" /> : 'Update Identity'}
                  </button>
                </form>
              </div>

              {/* Status Info */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-[10px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-mono">ACCOUNT TYPE</span>
                  <span className="text-emerald-400 font-bold uppercase">{profile.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-mono">JOINED</span>
                  <span className="text-white font-bold">{profile.joined}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
