import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, ArrowUpRight, ArrowDownLeft, Clock, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  metadata: any;
}

export const TransactionHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();

    // Subscribe to new transactions
    const channel = supabase
      .channel('transaction_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'token_transactions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setTransactions(prev => [payload.new as Transaction, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <History size={20} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-white">Transaction History</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">Date</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">Description</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">Type</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-gray-500 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500 text-sm">
                  No transactions found in your paper trail.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={12} />
                      {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {tx.description}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      tx.type === 'purchase' 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    )}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className={cn(
                      "flex items-center justify-end gap-1 font-mono font-bold",
                      tx.amount > 0 ? "text-emerald-400" : "text-purple-400"
                    )}>
                      {tx.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      {Math.abs(tx.amount).toLocaleString()}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
