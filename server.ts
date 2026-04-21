import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// 1. Initial configuration
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
console.log(`Server starting on port ${PORT}...`);

const app = express();

// 2.5 Admin Configuration & Supabase Admin Client
const ADMIN_EMAIL = "shyamsingh1977@gmail.com";
let supabaseAdminClient: any = null;

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase Admin credentials missing (VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
    }
    supabaseAdminClient = createClient(url, key);
  }
  return supabaseAdminClient;
}

// Middleware to verify Admin
const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user || user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid session" });
  }
};

// 2. Optimized CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://aiwithshyam.com",
  "https://www.aiwithshyam.com",
  "https://graphtosheets.aiwithshyam.com",
  "https://headshotstudiopro.com",
  "https://geonex.aiwithshyam.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow if in list or is a preview URL
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("ais-dev-") || origin.includes("ais-pre-") || origin.includes("run.app")) {
      return callback(null, true);
    }
    console.warn(`CORS Blocked: ${origin}`);
    return callback(null, false); // Just return false instead of Error for better silent failure
  },
  credentials: true
}));

app.use(express.json());

// 3. Lazy Razorpay Loader
let razorpayClient: any = null;

async function getRazorpay() {
  if (!razorpayClient) {
    console.log("Initializing Razorpay client...");
    try {
      // Dynamic import to avoid top-level load errors in serverless
      const RazorpayModule = await import("razorpay");
      const Razorpay: any = RazorpayModule.default || RazorpayModule;
      
      const key_id = process.env.RAZORPAY_KEY_ID || "dummy_id";
      const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

      razorpayClient = new Razorpay({ key_id, key_secret });
      console.log("Razorpay client initialized successfully.");
    } catch (e: any) {
      console.error("CRITICAL: Razorpay Initialization Failed:", e.message);
      throw new Error(`Razorpay Setup Failed: ${e.message}`);
    }
  }
  return razorpayClient;
}

// 4. API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

app.post("/api/create-order", async (req, res) => {
  console.log("Received order request:", req.body);
  try {
    const { amount, currency = "INR" } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be > 0" });
    }

    const rzp = await getRazorpay();
    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    console.log("Order created successfully:", order.id);
    res.json(order);
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ 
      error: "Failed to create order", 
      details: error.message || "Internal error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Verification system error" });
  }
});

// 4.5 Admin API Endpoints
app.get("/api/admin/users", verifyAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/update-tokens", verifyAdmin, async (req, res) => {
  const { userId, delta } = req.body;
  try {
    const supabase = getSupabaseAdmin();
    
    // Get current tokens
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("tokens")
      .eq("id", userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newTokens = Math.max(0, (profile?.tokens || 0) + delta);
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ tokens: newTokens })
      .eq("id", userId);
    
    if (updateError) throw updateError;
    
    // Log transaction
    await supabase.from("token_transactions").insert({
      user_id: userId,
      amount: delta,
      type: 'admin_adjustment',
      description: `Admin adjustment: ${delta > 0 ? '+' : ''}${delta} tokens`
    });

    res.json({ success: true, newTokens });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/toggle-block", verifyAdmin, async (req, res) => {
  const { userId, status } = req.body;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: status })
      .eq("id", userId);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Global Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: "Server crashed", message: err.message });
});

// 6. Server Initialization
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  
  // SPA Fallback: All non-API routes serve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production server running at http://0.0.0.0:${PORT}`);
  });
} else {
  // Local Server (Development Only)
  const setupLocal = async () => {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Local dev server running at http://localhost:${PORT}`);
      });
    } catch (e) {
      console.error("Vite startup failed:", e);
    }
  };
  setupLocal();
}

export default app;
