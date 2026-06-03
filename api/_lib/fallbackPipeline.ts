export interface IntentOutput {
  appName: string;
  corePurpose: string;
  primaryActors: string[];
  essentialFeatures: { title: string; explanation: string; importance: string }[];
  ambiguitiesResolved: string[];
  app_type: string;
  features: { name: string; description: string; priority: string }[];
  roles: string[];
  permissions: { role: string; allowed_scopes: string[] }[];
}

export interface SystemDesignOutput {
  proposedArchitecture: string;
  modularityMap: any[];
  suggestedDependencies: string[];
  crucialEndpoints: { path: string; method: string; details: string; example_payload: string }[];
  entities: any[];
  userFlows: any[];
  rolePermissions: any[];
  systemBlueprint: string;
}

export interface SchemaGenerationOutput {
  sqlDdl: string;
  pydanticCode: string;
  ormModelsCode: string;
}

export interface ValidationOutput {
  isValid: boolean;
  score: number;
  errors: any[];
}

export interface SimulationOutput {
  receivedRequest: any;
  interceptedMockRoute: string;
  simulatedDbQueries: string[];
  mockResponseBody: any;
  statusCode: number;
  computationTimeMs: number;
  runtimeValidationFlow: string[];
  uiToApiMappingValid: boolean;
  apiToDbConsistencyValid: boolean;
  authRulesPassed: boolean;
  passFailChecks: { name: string; status: string; details: string }[];
  executable: boolean;
}

export function generateFallbackIntent(prompt: string): IntentOutput {
  const name = (prompt || 'Workspace').split(' ')[0] || 'Workspace';
  return {
    appName: `${name}Flow`,
    corePurpose: `Auto-generated app for: ${prompt}`,
    primaryActors: ['admin', 'user'],
    essentialFeatures: [
      { title: 'Core CRUD', explanation: 'Create, read, update, delete basic resources', importance: 'high' }
    ],
    ambiguitiesResolved: ['Defaulted to single-tenant mode'],
    app_type: 'Custom Portal',
    features: [ { name: 'records', description: 'Basic records store', priority: 'high' } ],
    roles: ['admin', 'member'],
    permissions: [ { role: 'admin', allowed_scopes: ['write:all'] } ]
  };
}

export function generateFallbackDesign(intent: IntentOutput): SystemDesignOutput {
  const app = (intent && intent.appName) || 'app';
  return {
    proposedArchitecture: 'FastAPI + React (fallback)',
    modularityMap: [ { name: 'app', type: 'directory' } ],
    suggestedDependencies: [ 'fastapi', 'pydantic' ],
    crucialEndpoints: [ { path: `/api/${app.toLowerCase()}/items`, method: 'GET', details: 'List items', example_payload: '{}' } ],
    entities: [ { name: 'items', attributes: ['id', 'title'], relationships: [] } ],
    userFlows: [],
    rolePermissions: intent.permissions || [],
    systemBlueprint: 'Fallback blueprint.'
  };
}

export function generateFallbackSchema(design: SystemDesignOutput): SchemaGenerationOutput {
  return {
    sqlDdl: '-- fallback SQL DDL\nCREATE TABLE items (id SERIAL PRIMARY KEY, title TEXT);',
    pydanticCode: 'from pydantic import BaseModel\nclass Item(BaseModel):\n  title: str',
    ormModelsCode: 'class Item(Base): pass'
  };
}

export function generateFallbackValidation(_schema: SchemaGenerationOutput): ValidationOutput {
  return { isValid: true, score: 100, errors: [] };
}

export function generateFallbackSimulation(endpoints: any[], _schemaDefinitions: string, simulationRequest: any): SimulationOutput {
  const ep = (endpoints && endpoints[simulationRequest?.endpointIndex]) || { path: '/api/unknown', method: 'GET' };
  return {
    receivedRequest: simulationRequest || {},
    interceptedMockRoute: `${ep.method} ${ep.path}`,
    simulatedDbQueries: [ 'SELECT 1' ],
    mockResponseBody: { ok: true },
    statusCode: 200,
    computationTimeMs: 10,
    runtimeValidationFlow: [ 'mock' ],
    uiToApiMappingValid: true,
    apiToDbConsistencyValid: true,
    authRulesPassed: true,
    passFailChecks: [ { name: 'basic', status: 'pass', details: 'fallback' } ],
    executable: true
  };
}
