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
    
    // 2. Allow AI Studio Preview URLs dynamically (so you can test GraphToSheets!)
    if (origin.includes("ais-dev-") || origin.includes("ais-pre-")) {
      return callback(null, true);
    }

    var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));

app.use(express.json());

let razorpayClient: Razorpay | null = null;

function getRazorpay() {
  if (!razorpayClient) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_id || !key_secret) {
      console.warn("Razorpay keys are missing. Payment features will not work.");
    }
    
    razorpayClient = new Razorpay({
      key_id: key_id || "dummy_key_id",
      key_secret: key_secret || "dummy_key_secret",
    });
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
    // Razorpay often sends errors in a nested structure: { error: { code, description } }
    const errorDetails = error.error || error;
    const errorMessage = typeof errorDetails === 'object' 
      ? (errorDetails.description || errorDetails.message || JSON.stringify(errorDetails)) 
      : errorDetails;

    res.status(500).json({ 
      error: "Failed to create order", 
      details: errorMessage 
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
async function setupServer() {
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
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupServer();
}

export default app;
