import { Layers, Cpu, Maximize, Globe, LayoutGrid, Zap } from 'lucide-react';

export interface AppConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: any;
  url: string;
  color: string;
  accent: string;
  status: 'Active' | 'Beta' | 'Coming Soon';
  category: 'Productivity' | 'Creative' | 'Analysis';
}

export const MASTER_PLATFORM_CONFIG = {
  name: "AIWITHSHYAM",
  shortName: "AI-S",
  tagline: "High-Performance AI Ecosystem",
  hubName: "AI Tools Hub",
  vibe: "Technical / Architectural / Minimalist",
  primaryColor: "#10b981", // Emerald 500
};

export const APPS_COLLECTION: AppConfig[] = [
  {
    id: 'graph',
    title: "GraphToSheets",
    slug: "graph-to-sheets",
    description: "Transform chart images into editable Excel spreadsheets.",
    icon: Layers,
    url: "https://graphtosheets.aiwithshyam.com",
    color: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-400",
    status: "Active",
    category: "Productivity"
  },
  {
    id: 'headshots',
    title: "HeadshotStudioPro",
    slug: "headshot-studio-pro",
    description: "Premium AI-generated professional headshots.",
    icon: Cpu,
    url: "https://headshotstudiopro.com",
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-400",
    status: "Active",
    category: "Creative"
  },
  {
    id: 'geonex',
    title: "GeonExusPro",
    slug: "geonexuspro",
    description: "Advanced Geospatial AI for deep spatial analysis.",
    icon: Maximize,
    url: "https://www.geonexuspro.aiwithshyam.com/",
    color: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-400",
    status: "Beta",
    category: "Analysis"
  }
];
