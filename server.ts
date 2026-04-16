import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- SECURITY: CORS VIP LIST ---
// Only these websites are allowed to ask for payment popups
const allowedOrigins = [
  "http://localhost:3000", // Local testing
  "http://localhost:5173", // Local testing (Vite)
  "https://aiwithshyam.com", // Master Dashboard
  "https://www.aiwithshyam.com", // Master Dashboard (www)
  "https://graphtosheets.aiwithshyam.com", // App 1
  "https://headshotstudiopro.com", // App 2
  "https://geonex.aiwithshyam.com" // App 3
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // 1. Check if it's in our exact VIP list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // 2. Allow AI Studio Preview URLs dynamically
    if (origin.includes("ais-dev-") || origin.includes("ais-pre-") || origin.includes("run.app")) {
      return callback(null, true);
    }

    console.warn(`CORS Blocked Origin: ${origin}`);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
    return callback(new Error(msg), false);
  },
  credentials: true
}));

app.use(express.json());

let razorpayClient: Razorpay | null = null;

function getRazorpay() {
  if (!razorpayClient) {
    const key_id = process.env.RAZORPAY_KEY_ID || "dummy_id";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys are missing. Payment features will not work.");
    }

    try {
      // Handle various ways the library can be exported
      const RZP: any = (Razorpay as any).default || Razorpay;
      razorpayClient = new RZP({
        key_id,
        key_secret
      });
    } catch (e) {
      console.error("Razorpay Init Error:", e);
      // Final attempt: maybe the constructor is directly on Razorpay
      razorpayClient = new (Razorpay as any)({
        key_id,
        key_secret
      });
    }
  }
  return razorpayClient;
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AIwithShyam Master Hub API is active" });
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount", details: "Amount must be greater than 0" });
    }

    console.log(`Creating Razorpay order for: ${amount} ${currency}`);

    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Razorpay Options:", JSON.stringify(options));

    const rzp = getRazorpay();
    const order = await rzp.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    
    // Check if we are using dummy keys
    const isDummy = !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID === "dummy_key_id";
    
    // Razorpay often sends errors in a nested structure: { error: { code, description } }
    const errorDetails = error.error || error;
    let errorMessage = typeof errorDetails === 'object' 
      ? (errorDetails.description || errorDetails.message || JSON.stringify(errorDetails)) 
      : String(errorDetails);

    if (isDummy) {
      errorMessage = "CRITICAL: Razorpay API keys are missing or invalid in Vercel settings. " + errorMessage;
    }

    console.error(`Final Backend Error Message: ${errorMessage}`);

    res.status(500).json({ 
      error: "Failed to create order", 
      details: errorMessage,
      code: errorDetails.code || "UNKNOWN_ERROR"
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
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Setup Vite middleware for local development only
// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message || "An unexpected error occurred"
  });
});

async function setupServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        res.sendFile(indexPath);
      });
    }

    if (process.env.NODE_ENV !== "production") {
      const PORT = 3000;
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Always call setupServer to ensure routes are registered, 
// but it won't call listen() in production environments like Vercel
setupServer();

export default app;
