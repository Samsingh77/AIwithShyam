import { 
  Sliders, 
  Columns, 
  Table2, 
  Target, 
  ShieldAlert, 
  Map, 
  Camera, 
  Sparkles, 
  Type, 
  Palette, 
  Printer, 
  Plus,
  Layers, 
  Cpu, 
  Maximize, 
  Globe, 
  LayoutGrid, 
  Zap 
} from 'lucide-react';

export interface AppConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: any;
  url: string;
  color: string;
  accent: string;
  status: 'Active' | 'Beta' | 'Coming Soon' | 'Suggest';
  category: 'Productivity' | 'Creative' | 'Analysis';
  version?: string;
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
    title: "GraphToSheet",
    slug: "graph-to-sheets",
    description: "Convert any chart image into fully editable interactive digital charts and export structured spreadsheets instantly.",
    icon: Table2,
    url: "https://graphtosheet.vercel.app/",
    color: "bg-white",
    accent: "text-emerald-500",
    status: "Active",
    category: "Productivity",
    version: "V0.9"
  },
  {
    id: 'logo-insight',
    title: "Logo Insight Engine",
    slug: "logo-insight-engine",
    description: "Instantly extract key brand guidelines, hex color codes, typography details, and high-resolution assets from any uploaded logo image.",
    icon: Target,
    url: "https://logoinsight.vercel.app/",
    color: "bg-white",
    accent: "text-emerald-500",
    status: "Active",
    category: "Analysis",
    version: "V1.1"
  },
  {
    id: 'headshots',
    title: "Headshot Studio",
    slug: "headshot-studio-pro",
    description: "Take a selfie or upload an image to convert it into a studio-grade professional business photograph with endless customizations.",
    icon: Camera,
    url: "https://headshotstudiopro.com/",
    color: "bg-white",
    accent: "text-purple-500",
    status: "Active",
    category: "Creative",
    version: "V1.0"
  },
  {
    id: 'design-toolkit',
    title: "AI Design Toolkit",
    slug: "ai-design-toolkit",
    description: "An advanced, comprehensive desktop AI toolkit for pixel-accurate image enhancement, creative asset modernizations, and batch generation.",
    icon: Sliders,
    url: "#", // Changed to '#' as per Coming Soon status request
    color: "bg-white",
    accent: "text-purple-500",
    status: "Coming Soon", // Changed to Coming Soon as per user request
    category: "Creative",
    version: "V1.0"
  },
  {
    id: 'geonex',
    title: "GeoNexus",
    slug: "geonexuspro",
    description: "High-fidelity geospatial vector mapping and automated spatial data visualization custom-built for modern architectural layout planning.",
    icon: Map,
    url: "https://mygeonexus.vercel.app/",
    color: "bg-white",
    accent: "text-amber-500",
    status: "Active",
    category: "Analysis",
    version: "V1.2"
  },
  {
    id: 'dtp-compare',
    title: "DTP Compare",
    slug: "dtp-compare",
    description: "Automate desktop publishing layout auditing, high-fidelity pixel-comparisons, and real-time visual system diff detection.",
    icon: Columns,
    url: "#", // Changed to '#' as per Coming Soon status request
    color: "bg-white",
    accent: "text-emerald-500",
    status: "Coming Soon", // Changed to Coming Soon as per user request
    category: "Analysis",
    version: "V1.0"
  },
  {
    id: 'pdf-redact',
    title: "AI PDF Redact",
    slug: "ai-pdf-redact",
    description: "Accelerate compliance workflows through automated, AI-powered high-risk sensitive data discovery and irreversible PDF redactions.",
    icon: ShieldAlert,
    url: "#", // Changed to '#' as per Coming Soon status request
    color: "bg-white",
    accent: "text-red-500",
    status: "Coming Soon", // Changed to Coming Soon as per user request
    category: "Productivity",
    version: "V1.0"
  },
  {
    id: 'logovision',
    title: "LogoVision AI",
    slug: "logovision-ai",
    description: "Advanced deep neural rendering pipelines designed for brand safety audits, asset placement detection, and fully automated layout styling.",
    icon: Sparkles,
    url: "#", // Changed to '#' as per Coming Soon status request
    color: "bg-white",
    accent: "text-emerald-500",
    status: "Coming Soon", // Changed to Coming Soon as per user request
    category: "Creative",
    version: "V2.0"
  },
  {
    id: 'typematrix',
    title: "TYPEMATRIX",
    slug: "typematrix",
    description: "Procedural Kern & Hierarchy Engine for structural print layout engineering.",
    icon: Type,
    url: "#",
    color: "",
    accent: "text-gray-400",
    status: "Coming Soon",
    category: "Productivity"
  },
  {
    id: 'chromasync',
    title: "CHROMASYNC",
    slug: "chromasync",
    description: "Perceptual Color Space Analyzer mapping coordinates to standard CMYK gamuts.",
    icon: Palette,
    url: "#",
    color: "",
    accent: "text-gray-400",
    status: "Coming Soon",
    category: "Creative"
  },
  {
    id: 'pressspec',
    title: "PRESSSPEC",
    slug: "pressspec",
    description: "Automated Pre-flight & CMYK Verification for commercial prepress systems.",
    icon: Printer,
    url: "#",
    color: "",
    accent: "text-gray-400",
    status: "Coming Soon",
    category: "Analysis"
  },
  {
    id: 'suggest-module',
    title: "SUGGEST MODULE",
    slug: "suggest-module",
    description: "Shape the future of precise DTP instrumentation.",
    icon: Plus,
    url: "#",
    color: "bg-transparent",
    accent: "text-emerald-500",
    status: "Suggest",
    category: "Productivity"
  }
];
