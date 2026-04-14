import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, FileText, User, ShieldCheck } from 'lucide-react';
import { PRICING_PLANS, CURRENCIES } from '../constants';
import { cn } from '../lib/utils';

interface PricingProps {
  user: any;
  onAuthClick: () => void;
  onPurchase: (plan: any, currency: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ user, onAuthClick, onPurchase }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

  const formatHeadshots = (tokens: number) => {
    const hdCount = Math.floor(tokens / 5);
    let previewCount = 0;
    if (tokens === 1) previewCount = 2;
    else if (tokens === 10) previewCount = 4;
    else if (tokens === 50) previewCount = 25;
    else if (tokens === 125) previewCount = 75;

    return (
      <div className="flex flex-col items-center">
        {hdCount > 0 && (
          <span className="text-sm font-bold text-gray-900">
            {hdCount} HD Headshot{hdCount > 1 ? 's' : ''}
          </span>
        )}
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {previewCount} Preview Headshots
        </span>
      </div>
    );
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-white text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      
      <div className="px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-5xl tracking-tighter uppercase mb-6 text-black"
          >
            Simple <span className="text-emerald-600">Token</span> Economy
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-base font-body mb-8"
          >
            One unified wallet for all Shyam Singh AI tools. Tokens never expire and work across the entire ecosystem.
          </motion.p>

          {/* Currency Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center p-1 bg-black/5 border border-black/10 rounded-xl backdrop-blur-md"
          >
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => setSelectedCurrency(curr)}
                className={cn(
                  "px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                  selectedCurrency.code === curr.code
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-gray-600 hover:text-black"
                )}
              >
                {curr.code}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 w-1/5">Plan Details</th>
                    {PRICING_PLANS.map(plan => (
                      <th key={plan.id} className="p-4 text-center w-1/5 relative">
                        {plan.highlight && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-0.5 rounded-b-md shadow-lg shadow-emerald-500/20">
                            Best Value
                          </div>
                        )}
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{plan.name}</p>
                        <div className="flex flex-col items-center">
                          <p className="text-3xl font-display font-bold text-gray-900 tracking-tighter">
                            {selectedCurrency.symbol}{(plan.prices as any)[selectedCurrency.code]}
                          </p>
                          {selectedCurrency.code !== 'USD' && (
                            <p className="text-[10px] font-bold text-gray-500">
                              (${plan.prices.USD})
                            </p>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-sans">
                  <tr className="border-b border-gray-100 bg-gray-50/30 group transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                          <Zap size={16} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">AI Tokens</span>
                      </div>
                    </td>
                    {PRICING_PLANS.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        <span className="text-xl font-display font-bold text-emerald-600">{plan.tokens.toLocaleString()}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Chart Extractions</span>
                      </div>
                    </td>
                    {PRICING_PLANS.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        <span className="text-sm font-bold text-gray-600">{plan.tokens} Charts</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                          <User size={16} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Studio Headshots</span>
                      </div>
                    </td>
                    {PRICING_PLANS.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        {formatHeadshots(plan.tokens)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50/30">
                    <td className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Action</td>
                    {PRICING_PLANS.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        <button
                          onClick={() => user ? onPurchase(plan, selectedCurrency.code) : onAuthClick()}
                          className={cn(
                            "w-full py-2.5 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all shadow-md",
                            plan.highlight
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          )}
                        >
                          {user ? plan.buttonText : "Login to Purchase"}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

