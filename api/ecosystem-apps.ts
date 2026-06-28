import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

  try {
    // Try to fetch from remote master domain
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const response = await fetch('https://aiwithshyam.com/suite-config.json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            const data = await response.json();
            return res.status(200).json(data);
          } catch (jsonErr) {
            console.warn("Failed to parse remote suite-config.json as JSON, falling back:", jsonErr);
          }
        } else {
          console.warn("Remote suite-config.json returned non-JSON content type:", contentType);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch suite-config.json from production, falling back to local file:", e);
    }

    // Fallback: Read local file
    const localPath = path.join(process.cwd(), 'suite-config.json');
    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, 'utf-8');
      return res.status(200).json(JSON.parse(content));
    }

    return res.status(404).json({ error: "Suite config not found" });
  } catch (error: any) {
    console.error("Vercel Ecosystem Apps Error:", error);
    return res.status(500).json({ error: "Failed to load ecosystem apps", details: error.message });
  }
}
