export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free Trial',
    tokens: 1,
    prices: { USD: 0, INR: 0, EUR: 0, GBP: 0 },
    buttonText: 'Get Started',
    highlight: false
  },
  {
    id: 'micro',
    name: 'Micro Pack',
    tokens: 10,
    prices: { USD: 2.38, INR: 199, EUR: 2.20, GBP: 1.85 },
    buttonText: 'Buy Tokens',
    highlight: false
  },
  {
    id: 'standard',
    name: 'Standard Suite',
    tokens: 50,
    prices: { USD: 8.37, INR: 699, EUR: 7.75, GBP: 6.50 },
    buttonText: 'Popular Choice',
    highlight: true
  },
  {
    id: 'enterprise',
    name: 'Power Enterprise',
    tokens: 125,
    prices: { USD: 15.56, INR: 1299, EUR: 14.40, GBP: 12.10 },
    buttonText: 'Go Pro',
    highlight: false
  }
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
];
