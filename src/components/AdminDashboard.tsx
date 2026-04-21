import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Shield, Search, Lock, Unlock, 
  Coins, ArrowLeft, RefreshCw, AlertCircle,
  CheckCircle2, Filter, Trash2, Ban
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface UserProfile {
  id: string;
  email: string;
  tokens: number;
  is_blocked: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data || []);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setMessage({ type: 'error', text: `Failed to fetch users: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateTokens = async (userId: string, currentTokens: number, delta: number) => {
    setUpdatingId(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const response = await fetch('/api/admin/update-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId, delta })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update tokens");
      }

      const { newTokens } = await response.json();

      setUsers(users.map(u => u.id === userId ? { ...u, tokens: newTokens } : u));
      setMessage({ type: 'success', text: `Updated tokens for user.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const response = await fetch('/api/admin/toggle-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId, status: !currentStatus })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to toggle block status");
      }

      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u));
      setMessage({ type: 'success', text: `User ${!currentStatus ? 'blocked' : 'unblocked'} successfully.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-1 mb-6">
              <span className="font-display font-black text-xs tracking-tighter text-white">AI</span>
              <span className="font-display font-light text-xs tracking-tighter text-emerald-500/60 uppercase">with</span>
              <span className="font-display font-black text-xs tracking-tighter text-white">Shyam</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-700 ml-2">Admin Terminal</span>
            </div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <Shield className="text-red-500" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold tracking-tight">Ecosystem Control</h1>
                <p className="text-gray-500 text-sm font-body">Manage users, credits, and platform security.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search users by email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all font-body"
              />
            </div>
            <button 
              onClick={fetchUsers}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
            >
              <RefreshCw className={cn("text-gray-400", loading && "animate-spin")} size={20} />
            </button>
          </div>
        </header>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl border mb-8",
              message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto hover:opacity-70">×</button>
          </motion.div>
        )}

        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">User / Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Credits</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-500">
                        <RefreshCw className="animate-spin" size={24} />
                        <p className="font-mono text-[10px] uppercase tracking-widest">Waking up the database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-xs font-body">No users found matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <p className="text-xs font-bold text-white mb-0.5">{user.email || 'Anonymous Guest'}</p>
                          <p className="text-[9px] text-gray-500 font-mono tracking-tighter opacity-50">{user.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {user.is_blocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-widest">
                            <Ban size={10} /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-tight">{user.tokens.toLocaleString()}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleUpdateTokens(user.id, user.tokens, 10)}
                              disabled={updatingId === user.id}
                              className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all text-[10px]"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => handleUpdateTokens(user.id, user.tokens, -10)}
                              disabled={updatingId === user.id}
                              className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all text-[10px]"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleBlock(user.id, user.is_blocked || false)}
                            disabled={updatingId === user.id}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                              user.is_blocked 
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black" 
                                : "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black"
                            )}
                          >
                            {user.is_blocked ? "Unblock" : "Block User"}
                          </button>
                          <button 
                            className="p-1.5 text-gray-600 hover:text-white transition-colors"
                            title="Reset Credits to 0"
                            onClick={() => handleUpdateTokens(user.id, user.tokens, -user.tokens)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-white/5 bg-black/40 flex justify-between items-center">
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              Total Managed Accounts: <span className="text-white font-bold">{users.length}</span>
            </p>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                 <Lock size={12} className="text-red-500" />
                 <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Admin Authorization: Granted</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
