import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // If webhook secret is set, verify the signature
    if (webhookSecret && signature) {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const { event, payload } = req.body;
    console.log(`Received Webhook Event: ${event}`);

    // We handle payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload?.payment?.entity;
      if (!payment) {
        return res.status(400).json({ error: 'No payment entity in payload' });
      }

      const paymentId = payment.id;
      const amountInPaise = payment.amount;
      const amount = amountInPaise / 100;
      
      // Get the notes where we stored userId and tokens
      const notes = payment.notes || {};
      const userId = notes.userId || notes.user_id;
      const tokens = parseInt(notes.tokens || notes.amount_tokens || '0', 10);
      const planId = notes.planId || notes.plan_id || '';

      if (!userId || !tokens) {
        console.log(`No userId or tokens found in notes for payment ${paymentId}. Skipping allocation.`);
        return res.status(200).json({ status: 'ignored', reason: 'Missing userId or tokens in notes' });
      }

      // Initialize Supabase Admin Client
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase admin credentials not configured on server.');
      }
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Check for Idempotency using purchase_history table
      const { data: existingPurchase } = await supabaseAdmin
        .from('purchase_history')
        .select('id')
        .eq('payment_id', paymentId)
        .maybeSingle();

      if (existingPurchase) {
        console.log(`Payment ${paymentId} already processed. Skipping duplicate allocation.`);
        return res.status(200).json({ status: 'ignored', reason: 'Payment already processed' });
      }

      // 1. Get current profile to update tokens
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('tokens')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error(`Error loading profile for user ${userId}:`, profileError);
        return res.status(400).json({ error: 'Profile not found' });
      }

      const currentTokens = profile?.tokens || 0;
      const newTokens = currentTokens + tokens;

      // 2. Update profiles table
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ tokens: newTokens })
        .eq('id', userId);

      if (updateError) {
        console.error(`Error updating tokens for user ${userId}:`, updateError);
        throw updateError;
      }

      // 3. Log purchase history
      const { error: insertPurchaseError } = await supabaseAdmin
        .from('purchase_history')
        .insert([{
          user_id: userId,
          amount: amount,
          status: 'success',
          payment_id: paymentId
        }]);

      if (insertPurchaseError) {
        console.error('Error inserting purchase history:', insertPurchaseError);
      }

      // 4. Log token transaction
      const { error: insertTxError } = await supabaseAdmin
        .from('token_transactions')
        .insert([{
          user_id: userId,
          amount: tokens,
          type: 'purchase',
          description: `Credit Purchase via Webhook`,
          metadata: { 
            plan_id: planId, 
            price: amount,
            razorpay_payment_id: paymentId,
            via_webhook: true
          }
        }]);

      if (insertTxError) {
        console.error('Error logging token transaction:', insertTxError);
      }

      console.log(`Successfully allocated ${tokens} tokens to user ${userId} via webhook.`);
      return res.status(200).json({ success: true, allocated: tokens });
    }

    return res.status(200).json({ status: 'ignored', event });
  } catch (error: any) {
    console.error('Webhook processing exception:', error);
    return res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
}
