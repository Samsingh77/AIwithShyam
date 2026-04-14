import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Download, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Asset {
  id: string;
  url: string;
  type: string;
  app_id: string;
  created_at: string;
  metadata: any;
}

export const RecentAssets: React.FC<{ userId: string }> = ({ userId }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      // Assuming a table named 'generated_assets' exists
      const { data, error } = await supabase
        .from('generated_assets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAssets(data);
      }
      setLoading(false);
    };

    fetchAssets();

    const channel = supabase
      .channel('asset_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'generated_assets',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setAssets(prev => [payload.new as Asset, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <ImageIcon size={20} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Generated Assets</h3>
        </div>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          {assets.length} Items
        </span>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-12 text-center">
          <ImageIcon size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No assets generated yet. Launch an app to start creating!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10"
            >
              <img 
                src={asset.url} 
                alt="Generated Asset"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end gap-2">
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                    <Clock size={10} />
                    {new Date(asset.created_at).toLocaleDateString()}
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {asset.app_id === 'headshots' ? 'Studio Headshot' : 'AI Generation'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
