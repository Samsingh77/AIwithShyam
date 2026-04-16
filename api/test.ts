import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
    message: "Vercel function is working!"
  });
}
