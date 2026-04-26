/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ExternalLink, 
  Instagram, 
  Linkedin, 
  ArrowRight, 
  Camera, 
  Cpu, 
  Layers, 
  Maximize, 
  ChevronRight,
  Mail,
  User
} from "lucide-react";
import { useRef, MouseEvent, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { APPS_COLLECTION, MASTER_PLATFORM_CONFIG } from "./constants/apps";
import { AuthForm } from "./components/AuthForm";
import { MasterDashboard } from "./components/MasterDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { SuiteSwitcher } from "./components/SuiteSwitcher";
import { UserMenu } from "./components/UserMenu";
import { Pricing } from "./components/Pricing";
import { ecosystemService, AppEntry, PlatformConfig } from "./services/ecosystemService";

// --- Components ---

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-1 cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-emerald-500 transition-colors uppercase">
        {MASTER_PLATFORM_CONFIG.name.split('WITH')[0]}
      </span>
      <span className="font-display font-light text-2xl tracking-tighter text-emerald-500/80 group-hover:text-emerald-400 transition-colors ml-0.5">
        WITH
      </span>
      <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-emerald-500 transition-colors ml-1 uppercase">
        {MASTER_PLATFORM_CONFIG.name.split('WITH')[1]}
      </span>
    </div>
    <div className="ml-1 w-1 h-1 rounded-full bg-emerald-500 animate-pulse self-end mb-2" />
  </motion.div>
);

const Navbar = ({ user, onSignOut, onAuthClick, onDashboardClick, onLogoClick, onAdminClick, isAdmin, dynamicApps, platformConfig }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 flex justify-between items-center ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <Logo onClick={onLogoClick} />
      
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
          <div className="flex items-center gap-3">
            {/* <SuiteSwitcher 
              onDashboardClick={onDashboardClick} 
              dynamicApps={dynamicApps}
            /> */}
            <UserMenu 
              user={user} 
              onSignOut={onSignOut} 
              onDashboardClick={onDashboardClick}
              onAdminClick={onAdminClick}
              isAdmin={isAdmin}
              platformConfig={platformConfig}
            />
          </div>
        ) : isSupabaseConfigured ? (
          <button 
            onClick={onAuthClick}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20"
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

      <div className="relative z-20 text-center max-w-6xl pt-40 pb-40">
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
      className="group relative bg-brand-gray/30 border border-white/5 p-6 rounded-2xl hover:bg-brand-gray/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
        <Icon size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-4 text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-black transition-colors duration-500">
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-display font-bold text-lg tracking-tight">{title}</h3>
          {isComingSoon && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono uppercase tracking-widest text-gray-500">
              Soon
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-6 max-w-[240px]">
          {description}
        </p>
        {isComingSoon ? (
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-600 cursor-not-allowed">
            Development Phase
          </div>
        ) : (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-accent hover:gap-4 transition-all duration-300"
          >
            Launch App <ArrowRight size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const AISuite = () => {
  return (
    <section id="ai-suite" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4 block">The AI Suite</span>
          <h2 className="font-display font-bold text-5xl md:text-6xl tracking-tighter uppercase leading-none">
            Digital <br /> Intelligence.
          </h2>
        </div>
        <p className="text-gray-500 max-w-xs text-sm font-mono uppercase tracking-wider leading-relaxed">
          Building tools that bridge the gap between complex data and human intuition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {APPS_COLLECTION.map((app, i) => (
          <ProductCard 
            key={app.id} 
            title={app.title} 
            description={app.description} 
            icon={app.icon} 
            link={app.url} 
            index={i} 
            isComingSoon={app.status === 'Coming Soon'} 
          />
        ))}
      </div>
    </section>
  );
};

const PhotographyShowcase = () => {
  const photos = [
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography0.png",
      title: "Wildlife Harmony",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography1.png",
      title: "Maternal Bond",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography4.png",
      title: "Elephant Twilight",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography5.png",
      title: "Leopard Repose",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography6.png",
      title: "Golden Hour Sentinel",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography7.png",
      title: "Kingfisher Precision",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography8.png",
      title: "Shadow Hunter",
      category: "Wildlife"
    },
    {
      url: "https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/Photography3.png",
      title: "Wild Majesty",
      category: "Wildlife"
    }
  ];

  return (
    <section id="photography" className="py-32 px-6 bg-brand-gray/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4 block">The Artist's Eye</span>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter uppercase mb-6 text-balance text-white">
            Visual Storytelling.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-balance">
            Capturing the raw beauty of the wild in its true form.
            Every frame preserves the natural proportions and light of the moment.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="break-inside-avoid relative group overflow-hidden rounded-xl border border-white/5 bg-black/20"
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent mb-1">{photo.category}</span>
                <h4 className="font-display font-bold text-lg uppercase tracking-wider text-white">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = `translate(0px, 0px)`;
  };

  return (
    <footer id="contact" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-display font-bold text-6xl md:text-8xl tracking-tighter uppercase mb-8">
              LET'S <br /> COLLABORATE.
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-xl leading-relaxed">
              I am <span className="text-white">Shyam Kishore Singh</span>, a creator standing at the crossroads of logic and light. 
              By day, I engineer the future as an <span className="text-white">AI Developer</span>, building systems that solve complex problems. 
              Through my lens, I am a <span className="text-white">Wildlife Photographer</span>, capturing the raw, silent stories of the wild. 
              My work is a simple mission: to blend the precision of technology with the soul of storytelling.
            </p>
            <div className="flex flex-wrap gap-6">
              <a 
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                href="mailto:aiwithshyamsingh@gmail.com" 
                className="group flex items-center gap-4 bg-white text-brand-black px-8 py-4 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-brand-accent transition-all duration-300 ease-out"
              >
                Get in Touch <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/shyam-singh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-brand-black transition-all duration-300"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/thesamphotography_shyamsingh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-brand-black transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden transition-all duration-1000 group">
            <img 
              src="https://auqwezpczravciclsemz.supabase.co/storage/v1/object/public/headshost/indexpage_img/collaborate.png" 
              alt="Shyam Kishore Singh" 
              className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo />
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-gray-600">© 2026 SHYAM KISHORE SINGH</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <div className="w-px h-4 bg-white/10 hidden md:block" />
            <span className="text-gray-600">Built with Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'admin'>('landing');
  const [dynamicApps, setDynamicApps] = useState<AppEntry[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);

  const ADMIN_EMAIL = "shyamsingh1977@gmail.com";
  const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    // Fetch Dynamic Ecosystem Config
    if (isSupabaseConfigured) {
      ecosystemService.fetchApps().then(apps => {
        console.log("Supabase Apps Fetched:", apps.length);
        if (apps.length === 0) {
          console.warn("⚠️ No apps found in Supabase. Check 'apps_registry' table and RLS policies.");
        }
        setDynamicApps(apps);
      });
      ecosystemService.fetchPlatformConfig().then(config => {
        if (!config) {
          console.warn("⚠️ Platform config not found. Check 'platform_settings' table.");
        }
        setPlatformConfig(config);
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Supabase session check failed:", error.message);
        // If there's an error like "Refresh Token Not Found", force a sign out to clear stale local storage
        if (error.message.toLowerCase().includes('refresh token')) {
          supabase.auth.signOut();
        }
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("Uncaught Supabase session check failure:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        setView('landing');
      }

      // Handle potential refresh token errors emitted through events
      if (event === 'USER_UPDATED' && !session) {
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  const handlePurchase = async (plan: any, currency: string = "INR") => {
    if (!user) return;
    
    // Don't process free trial or 0 amount plans through Razorpay
    if (plan.prices[currency] <= 0) {
      alert("This is a free plan and doesn't require payment.");
      return;
    }
    
    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: plan.prices[currency],
          currency: currency
        }),
      });

      if (!orderResponse.ok) {
        let errorMsg = `Payment Server Error (${orderResponse.status})`;
        try {
          // Clone the response because we might need to read text() if json() fails
          const clone = orderResponse.clone();
          const errorData = await clone.json();
          errorMsg = errorData.details || errorData.error || errorMsg;
        } catch (e) {
          // Fallback if not JSON
          const text = await orderResponse.text().catch(() => "");
          if (text) errorMsg = `${errorMsg}: ${text.slice(0, 100)}`;
          else errorMsg = `${errorMsg}: ${orderResponse.statusText || "No response body"}`;
        }
        throw new Error(errorMsg);
      }
      const orderData = await orderResponse.json();

      // 2. Initialize Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AIwithShyam",
        description: `${plan.name} - ${plan.tokens} Credits`,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shyam",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify Payment on Backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // 4. Update Tokens in Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('tokens')
              .eq('id', user.id)
              .single();
            
            const currentTokens = profile?.tokens || 0;
            const newTokens = currentTokens + plan.tokens;

            await supabase
              .from('profiles')
              .update({ tokens: newTokens })
              .eq('id', user.id);

            // 5. Log Transaction
            await supabase
              .from('token_transactions')
              .insert([{
                user_id: user.id,
                amount: plan.tokens,
                type: 'purchase',
                description: `${plan.name} Purchase`,
                metadata: { 
                  plan_id: plan.id, 
                  price: plan.price,
                  razorpay_payment_id: response.razorpay_payment_id 
                }
              }]);

            alert("Payment Successful! Your tokens have been added.");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
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
      alert(`An error occurred during the purchase process: ${err.message || "Unknown error"}`);
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
      
      {view !== 'dashboard' && view !== 'admin' && (
        <Navbar 
          user={user} 
          onSignOut={handleSignOut} 
          onAuthClick={() => setView('auth')} 
          onDashboardClick={() => setView('dashboard')}
          onLogoClick={() => setView('landing')}
          onAdminClick={() => setView('admin')}
          isAdmin={isAdmin}
          dynamicApps={dynamicApps}
          platformConfig={platformConfig}
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
              onAdminClick={() => setView('admin')}
              dynamicApps={dynamicApps}
              platformConfig={platformConfig}
            />
          </motion.div>
        )}
        {view === 'admin' && isAdmin && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard onBack={() => setView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom Styles for the border-text effect */}
      <style>{`
        .border-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        @media (min-width: 768px) {
          .border-text {
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          }
        }
        .cinematic-grain {
          position: fixed;
          top: -100px;
          left: -100px;
          width: calc(100% + 200px);
          height: calc(100% + 200px);
          pointer-events: none;
          z-index: 50;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: grain 8s steps(10) infinite;
        }
        @keyframes grain {
          0%, 100% { transform:translate(0, 0); }
          10% { transform:translate(-1%, -2%); }
          20% { transform:translate(-3%, 1%); }
          30% { transform:translate(2%, -5%); }
          40% { transform:translate(-1%, 5%); }
          50% { transform:translate(-3%, 2%); }
          60% { transform:translate(3%, 0%); }
          70% { transform:translate(0%, 3%); }
          80% { transform:translate(1%, 7%); }
          90% { transform:translate(-2%, 2%); }
        }
      `}</style>
    </main>
  );
}

