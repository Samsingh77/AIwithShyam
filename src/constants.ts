export const CURRENCIES = [
  { code: 'INR', symbol: '₹', rate: 83.5 },
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.78 }
];

export const PRICING_PLANS = [
  { 
    id: 'free', 
    name: 'Free Trial', 
    prices: { USD: 0, INR: 0, EUR: 0, GBP: 0 },
    tokens: 1, 
    features: ['1 AI Token (1 Chart)', 'Standard Precision', 'Single File Export', 'Basic Support'], 
    buttonText: 'Current Plan', 
    highlight: false 
  },
  { 
    id: 'starter', 
    name: 'Micro Pack', 
    prices: { USD: 2.38, INR: 199, EUR: 2.19, GBP: 1.86 },
    tokens: 20, 
    features: ['20 AI Credits', 'Enough for 20 Charts', '4 HD Headshots, 8 Preview Headshots', 'High Precision AI', 'No Expiration'], 
    buttonText: 'Buy Credits', 
    highlight: false 
  },
  { 
    id: 'standard', 
    name: 'Standard Suite', 
    prices: { USD: 8.37, INR: 699, EUR: 7.70, GBP: 6.53 },
    tokens: 80, 
    features: ['80 AI Credits', '80 Charts OR 16 HD Headshots, 40 Preview Headshots', 'Priority AI Processing', '24/7 Priority Support', 'Advanced Analytics'], 
    buttonText: 'Get Started', 
    highlight: true 
  },
  { 
    id: 'pro', 
    name: 'Power Enterprise', 
    prices: { USD: 15.56, INR: 1299, EUR: 14.32, GBP: 12.14 },
    tokens: 180, 
    features: ['180 AI Credits', '180 Charts OR 36 HD Headshots, 100 Preview Headshots', 'Batch Upload (Soon)', 'Custom Integration Support', 'Team Access'], 
    buttonText: 'Go Pro', 
    highlight: false 
  }
];
