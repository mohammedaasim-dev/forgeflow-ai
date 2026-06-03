export interface FeatureDetail {
  name: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface RolePermission {
  role: string;
  allowed_scopes: string[];
}

export interface IntentOutput {
  appName: string;
  corePurpose: string;
  primaryActors: string[];
  essentialFeatures: { title: string; explanation: string; importance: "high" | "medium" | "low" }[];
  ambiguitiesResolved: string[];
  
  // Strict fields
  app_type: string;
  features: FeatureDetail[];
  roles: string[];
  permissions: RolePermission[];
}

export interface FileNode {
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
}

export interface EntityDetail {
  name: string;
  attributes: string[];
  relationships: string[];
}

export interface UserFlowStep {
  actor: string;
  action: string;
  systemResponse: string;
}

export interface SystemDesignOutput {
  proposedArchitecture: string;
  modularityMap: FileNode[];
  suggestedDependencies: string[];
  crucialEndpoints: { path: string; method: "GET" | "POST" | "PUT" | "DELETE"; details: string; example_payload: string }[];
  
  // Strict fields
  entities: EntityDetail[];
  userFlows: UserFlowStep[];
  rolePermissions: RolePermission[];
  systemBlueprint: string;
}

export interface SchemaGenerationOutput {
  sqlDdl: string;
  pydanticCode: string;
  ormModelsCode: string;
}

export interface ValidationErrorItem {
  ruleId: string;
  severity: "error" | "warning" | "info";
  location: string;
  message: string;
  suggestedFix: string;
}

export interface ValidationOutput {
  isValid: boolean;
  score: number; // 0 to 100
  errors: ValidationErrorItem[];
}

export interface RepairOutput {
  repairedCode: string;
  healingSummary: string;
  testRunSuccess: boolean;
  
  // Stage 5 strict fields
  repairWorkflow: string[];
  validationErrorHandling: string;
  patchStrategy: string;
  beforeRepairCode: string;
  afterRepairCode: string;
}

export interface PassFailCheck {
  name: string;
  status: "pass" | "fail";
  details: string;
}

export interface SimulationOutput {
  receivedRequest: any;
  interceptedMockRoute: string;
  simulatedDbQueries: string[];
  mockResponseBody: any;
  statusCode: number;
  computationTimeMs: number;
  
  // Stage 6 strict fields
  runtimeValidationFlow: string[];
  uiToApiMappingValid: boolean;
  apiToDbConsistencyValid: boolean;
  authRulesPassed: boolean;
  passFailChecks: PassFailCheck[];
  executable: boolean;
}
