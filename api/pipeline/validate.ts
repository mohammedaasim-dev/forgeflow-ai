import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateFallbackValidation } from '../../src/fallbackPipeline';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { schemaCode, pydanticCode } = req.body || {};
  if (!schemaCode || !pydanticCode) return res.status(400).json({ error: 'Schema and Pydantic validation files are required.' });

  try {
    const validation = generateFallbackValidation({ sqlDdl: schemaCode, pydanticCode, ormModelsCode: '' });
    return res.status(200).json(validation);
  } catch (err: any) {
    console.error('Vercel validate function error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to validate components.' });
  }
}
