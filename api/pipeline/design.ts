import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFallbackDesign } from '../../src/fallbackPipeline';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { intentSummary } = req.body || {};
  if (!intentSummary) return res.status(400).json({ error: 'Intent summary is required.' });

  try {
    const design = generateFallbackDesign(intentSummary);
    return res.status(200).json(design);
  } catch (err: any) {
    console.error('Vercel design function error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate design.' });
  }
}
