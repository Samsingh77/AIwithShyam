import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    status: "ok",
    node_env: process.env.NODE_ENV,
    time: new Date().toISOString(),
    message: "Master Hub API is healthy (Vercel Native)"
  });
}
