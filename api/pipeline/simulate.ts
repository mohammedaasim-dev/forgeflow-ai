import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFallbackSimulation } from '../../src/fallbackPipeline';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { endpoints, schemaDefinitions, simulationRequest } = req.body || {};
  if (!endpoints || !schemaDefinitions || !simulationRequest) return res.status(400).json({ error: 'Endpoints, schema models, and simulation parameters are required.' });

  try {
    const simulation = generateFallbackSimulation(endpoints, schemaDefinitions, simulationRequest);
    (simulation as any).isFallback = true;
    return res.status(200).json(simulation);
  } catch (err: any) {
    console.error('Vercel simulate function error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to run simulation.' });
  }
}
