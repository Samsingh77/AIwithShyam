/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ExternalLink, Instagram, Linkedin, ArrowRight, Camera, 
  Cpu, Layers, Maximize, ChevronRight, Mail, User
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { AuthForm } from "./components/AuthForm";
import { MasterDashboard } from "./components/MasterDashboard";
import { SuiteSwitcher } from "./components/SuiteSwitcher";
import { Pricing } from "./components/Pricing";

// --- Components ---

const Navbar = ({ user, onSignOut, onAuthClick, onDashboardClick, onLogoClick }: any) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-8 flex justify-between items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display font-bold text-xl tracking-tighter mix-blend-difference cursor-pointer"
        onClick={onLogoClick}
      >
        SHYAM SINGH
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-6"
      >
        <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest mix-blend-difference">
          <a href="#ai-suite" className="hover:text-emerald-500 transition-colors">AI Suite</a>
          <a href="#photography" className="hover:text-emerald-500 transition-colors">Photography</a>
          <a href="#pricing" className="hover:text-emerald-500 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-emerald-500 transition-colors">Contact</a>
        </div>
        
        {user ? (
          <SuiteSwitcher onLogout={onSignOut} onDashboardClick={onDashboardClick} />
        ) : isSupabaseConfigured ? (
          <button 
            onClick={onAuthClick}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl hover:shadow-emerald-500/20"
          >
            <User size={14} />
            Sign In
          </button>
        ) : null}
      </motion.div>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6 bg-[#050505]">
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/50 to-brand-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="relative z-20 text-center max-w-6xl pt-20 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500 mb-8 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            Developer & Storyteller
          </span>
          <h1 className="font-display font-bold text-[10vw] md:text-[8vw] leading-[0.85] tracking-tighter uppercase mb-12 text-white">
            INTELLIGENCE <br />
            <span className="text-transparent border-text">MEETS</span> <br />
            IMAGINATION.
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-balance leading-relaxed mb-20">
            Engineering digital intelligence through code, capturing raw narratives through the lens. 
            Where the precision of AI meets the soul of visual storytelling.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 whitespace-nowrap">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ title, description, icon: Icon, link, index, isComingSoon }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-brand-gray/30 border border-white/5 p-8 rounded-2xl hover:bg-brand-gray/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
        <Icon size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-6 text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-black transition-colors duration-500">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="font-display font-bold text-2xl tracking-tight">{title}</h3>
          {isComingSoon && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono uppercase tracking-widest text-gray-500">
              Soon
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[240px]">
          {description}
        </p>
        {isComingSoon ? (
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-600 cursor-not-allowed">
            Development Phase
          </div>
        ) : (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-accent hover:gap-4 transition-all duration-300"
          >
            Launch App <ArrowRight size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const AISuite = () => {
  const products = [
    {
      title: "GraphToSheets",
      description: "Transform chart images into editable Excel spreadsheets with AI precision.",
      icon: Layers,
      link: "https://graphtosheets.aiwithshyam.com",
      isComingSoon: false
    },
    {
      title: "HeadshotStudioPro",
      description: "Upload a simple selfie and let our AI generate premium, photorealistic headshots.",
      icon: Cpu,
      link: "https://headshotstudiopro.com/",
      isComingSoon: false
    },
    {
      title: "GeoNex",
      description: "Advanced Geospatial AI for deep spatial analysis and intelligent mapping.",
      icon: Maximize,
      link: "https://geonex.aiwithshyam.com",
      isComingSoon: false
    },
    {
      title: "Image Sharpening",
      description: "AI-driven image restoration and sharpening for crystal clear visual assets.",
      icon: Camera,
      link: "https://sharpen.aiwithshyam.com",
      isComingSoon: false
    }
  ];

  return (
    <section id="ai-suite" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4 block">The AI Suite</span>
          <h2 className="font-display font-bold text-5xl md:text-6xl tracking-tighter uppercase leading-none">
            Digital <br /> Intelligence.
          </h2>
        </div>
        <p className="text-gray-400 max-w-sm mb-2 text-sm leading-relaxed">
          A collection of specialized tools designed to bridge the gap between complex data and human intuition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.title} {...product} index={i} />
        ))}
      </div>
    </section>
  );
};

const PhotographyShowcase = () => {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1000",
      title: "The King",
      category: "Wildlife",
      span: "md:col-span-2 md:row-span-2"
    },
    {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
      title: "Soul",
      category: "Portrait",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      url: "https://images.unsplash.com/photo-1516422213484-214444ae4eb7?auto=format&fit=crop&q=80&w=1000",
      title: "Vastness",
      category: "Landscape",
      span: "md:col-span-1 md:row-span-2"
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
      title: "Gaze",
      category: "Portrait",
      span: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <section id="photography" className="py-32 px-6 bg-brand-gray/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4 block">The Artist's Eye</span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase mb-6">
            Visual Storytelling.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl ${photo.span}`}
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                <span className="text-brand-accent font-mono text-[10px] uppercase tracking-widest mb-2">{photo.category}</span>
                <h4 className="text-white font-display font-bold text-2xl tracking-tight">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-display font-bold text-6xl md:text-8xl tracking-tighter uppercase mb-8">
              LET'S <br /> COLLABORATE.
            </h2>
            <div className="flex flex-wrap gap-6">
              <a href="mailto:shyamsingh1977@gmail.com" className="group flex items-center gap-4 bg-white text-brand-black px-8 py-4 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-brand-accent transition-all duration-300 ease-out">
                Get in Touch <Mail size={18} />
              </a>
              <div className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-black transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-black transition-all">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-6">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#ai-suite" className="hover:text-brand-accent transition-colors">AI Suite</a></li>
                <li><a href="#photography" className="hover:text-brand-accent transition-colors">Photography</a></li>
                <li><a href="#pricing" className="hover:text-brand-accent transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-600">
          <p>© 2024 Shyam Singh. All rights reserved.</p>
          <p>Built with Intelligence & Imagination</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setView('landing');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  const handlePurchase = async (plan: any, currency: string = "USD") => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.prices[currency],
          currency: currency,
          planId: plan.id,
          userId: user.id
        })
      });

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shyam Singh AI Suite",
        description: `Purchase ${plan.tokens} Tokens`,
        order_id: order.id,
        handler: async (response: any) => {
          await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              tokens: plan.tokens
            })
          });
          alert("Payment Successful! Tokens added to your wallet.");
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Purchase Error:", err);
      alert("An error occurred during the purchase process.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-white/10 rounded-full animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative font-sans selection:bg-brand-accent selection:text-brand-black overflow-x-hidden bg-[#0a0a0a] text-white min-h-screen">
      <div className="cinematic-grain" />
      
      {view !== 'dashboard' && (
        <Navbar 
          user={user} 
          onSignOut={handleSignOut} 
          onAuthClick={() => setView('auth')} 
          onDashboardClick={() => setView('dashboard')}
          onLogoClick={() => setView('landing')}
        />
      )}

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <AISuite />
            <Pricing 
              user={user} 
              onAuthClick={() => setView('auth')} 
              onPurchase={handlePurchase} 
            />
            <PhotographyShowcase />
            <Footer />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center px-6 pt-20"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
              <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10 w-full">
              <button 
                onClick={() => setView('landing')}
                className="absolute -top-12 left-0 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
                Back to Home
              </button>
              <AuthForm onSuccess={() => setView('dashboard')} />
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && user && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MasterDashboard 
              user={user} 
              onBackToLanding={() => setView('landing')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .cinematic-grain {
          position: fixed;
          inset: 0;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.03;
          pointer-events: none;
          z-index: 50;
        }
        .border-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
          color: transparent;
        }
        @media (min-width: 768px) {
          .border-text {
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </main>
  );
}
