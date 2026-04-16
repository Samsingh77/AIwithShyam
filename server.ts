import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";

// 1. Initial configuration
dotenv.config();
console.log("Server module loading...");

const app = express();

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

// 5. Global Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: "Server crashed", message: err.message });
});

// 6. Local Server (Development Only)
if (process.env.NODE_ENV !== "production") {
  const setupLocal = async () => {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      app.listen(3000, "0.0.0.0", () => {
        console.log("Local dev server running at http://localhost:3000");
      });
    } catch (e) {
      console.error("Vite startup failed:", e);
    }
  };
  setupLocal();
}

export default app;
