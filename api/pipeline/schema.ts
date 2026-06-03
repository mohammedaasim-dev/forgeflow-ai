import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFallbackSchema } from '../_lib/fallbackPipeline.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { systemDesign } = req.body || {};
  if (!systemDesign) return res.status(400).json({ error: 'System Design context is required.' });

  try {
    const schema = generateFallbackSchema(systemDesign);
    return res.status(200).json(schema);
  } catch (err: any) {
    console.error('Vercel schema function error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate schema.' });
  }
}
