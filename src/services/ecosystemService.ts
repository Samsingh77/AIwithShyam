import { supabase } from '../lib/supabase';
import { LayoutGrid, ImageIcon, Layers, Cpu, Maximize, Activity, Box, Globe, Zap, Shield, FileText } from 'lucide-react';

// Map icon names from DB to Lucide components
export const ICON_MAP: Record<string, any> = {
  'LayoutGrid': LayoutGrid,
  'ImageIcon': ImageIcon,
  'Layers': Layers,
  'Cpu': Cpu,
  'Maximize': Maximize,
  'Activity': Activity,
  'Box': Box,
  'Globe': Globe,
  'Zap': Zap,
  'Shield': Shield,
  'FileText': FileText
};

export interface AppEntry {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  url: string;
  accent_color: string;
  order_index: number;
}

export interface PlatformConfig {
  name: string;
  shortName: string;
  tagline: string;
  hubName: string;
  primaryColor: string;
}

export const ecosystemService = {
  async fetchPlatformConfig(): Promise<PlatformConfig | null> {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'global_config')
        .single();
      
      if (error) {
        console.warn("Supabase Platform Config Query Error:", error.message);
        return null;
      }
      return data.value;
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        console.error("CRITICAL: Network Error - Failed to connect to Supabase. Check your URL and connection.");
      } else {
        console.error("Error fetching platform config:", err);
      }
      return null;
    }
  },

  async fetchApps(): Promise<AppEntry[]> {
    try {
      const { data, error } = await supabase
        .from('apps_registry')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) {
        console.warn("Supabase Apps Registry Query Error:", error.message);
        return [];
      }
      return data || [];
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        console.error("CRITICAL: Network Error - Failed to connect to Supabase. Check your URL and connection.");
      } else {
        console.error("Error fetching apps registry:", err);
      }
      return [];
    }
  }
};
