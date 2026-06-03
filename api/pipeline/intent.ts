import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFallbackIntent } from '../_lib/fallbackPipeline.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  try {
    // For Vercel deployments it's common to not expose a remote AI key.
    // Use the high-fidelity fallback generator so the UI receives a valid JSON intent.
    const intent = generateFallbackIntent(prompt);
    res.status(200).json(intent);
  } catch (err: any) {
    console.error('Vercel intent function error:', err?.message || err);
    res.status(500).json({ error: 'Failed to generate intent.' });
  }
}
