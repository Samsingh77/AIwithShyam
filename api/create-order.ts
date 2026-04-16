import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  else res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { amount, currency = "INR" } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    // Lazy load to prevent top-level ESM/bundling issues
    const RazorpayModule = await import("razorpay");
    const Razorpay: any = (RazorpayModule as any).default || RazorpayModule;
    
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "dummy_id",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    return res.status(200).json(order);
  } catch (error: any) {
    console.error("Vercel Create Order Error:", error);
    return res.status(500).json({ error: "Order creation failed", details: error.message });
  }
}
