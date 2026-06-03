export interface StarterFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export const starterCodeFiles: Record<string, StarterFile> = {
  "app/__init__.py": {
    name: "__init__.py",
    path: "app/__init__.py",
    language: "python",
    content: `"""
AI App Generator System Backend Package
"""
`
  },
  "app/main.py": {
    name: "main.py",
    path: "app/main.py",
    language: "python",
    content: `from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    IntentInput, IntentResponse,
    DesignInput, DesignResponse,
    SchemaInput, SchemaResponse,
    ValidationInput, ValidationResponse,
    RepairInput, RepairResponse,
    SimulationInput, SimulationResponse
)
from app.services.intent import IntentService
from app.services.design import DesignService
from app.services.schema import SchemaService
from app.services.validation import ValidationService
from app.services.repair import RepairService
from app.services.simulation import SimulationService

app = FastAPI(
    title="AI App Generator Core",
    description="FastAPI Backend executing a 6-stage Pipeline: Intent extraction, System design, Schema generation, Validation, Self-repair, and Runtime simulation.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "system": "AI App Generator Engine",
        "stages": [
            "1. Intent Extraction",
            "2. System Design",
            "3. Schema Generation",
            "4. Validation",
            "5. Schema Repair",
            "6. Runtime Simulation"
        ]
    }

@app.post("/api/stages/intent", response_model=IntentResponse, status_code=status.HTTP_200_OK)
async def extract_intent(payload: IntentInput, service: IntentService = Depends()):
    """
    Stage 1: Intent Extraction
    Extracts semantic purpose, key requirements, tech stack preferences, and high-level structure.
    """
    try:
        return await service.execute(payload.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intent Extraction failed: {str(e)}")

@app.post("/api/stages/design", response_model=DesignResponse, status_code=status.HTTP_200_OK)
async def generate_system_design(payload: DesignInput, service: DesignService = Depends()):
    """
    Stage 2: System Design
    Translates intent into a modular folder structure, endpoint lists, and third party APIs.
    """
    try:
        return await service.execute(payload.intent_summary, payload.target_framework)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"System Design failed: {str(e)}")

@app.post("/api/stages/schema", response_model=SchemaResponse, status_code=status.HTTP_200_OK)
async def generate_schemas(payload: SchemaInput, service: SchemaService = Depends()):
    """
    Stage 3: Schema Generation
    Generates fully formulated database schemas and Pydantic validation models.
    """
    try:
        return await service.execute(payload.system_design_components)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schema Generation failed: {str(e)}")

@app.post("/api/stages/validate", response_model=ValidationResponse, status_code=status.HTTP_200_OK)
async def validate_schemas(payload: ValidationInput, service: ValidationService = Depends()):
    """
    Stage 4: Validation Engine
    Lints the generated schema for circular imports, syntax issues, security vulnerabilites, and relations.
    """
    try:
        return await service.execute(payload.schema_code, payload.pydantic_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@app.post("/api/stages/repair", response_model=RepairResponse, status_code=status.HTTP_200_OK)
async def repair_schemas(payload: RepairInput, service: RepairService = Depends()):
    """
    Stage 5: Repair Engine
    Applies multi-agent iterative code-healing schemas based on error reports.
    """
    try:
        return await service.execute(payload.source_code, payload.error_report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Repair failed: {str(e)}")

@app.post("/api/stages/simulate", response_model=SimulationResponse, status_code=status.HTTP_200_OK)
async def execute_simulation(payload: SimulationInput, service: SimulationService = Depends()):
    """
    Stage 6: Runtime Simulation
    Simulates actual endpoint executions and hypothetical query logic in a sandboxed runtime.
    """
    try:
        return await service.execute(payload.endpoints, payload.schema_definitions, payload.simulation_request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Runtime Simulation failed: {str(e)}")
`
  },
  "app/config.py": {
    name: "config.py",
    path: "app/config.py",
    language: "python",
    content: `from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Gateway Configurations
    GEMINI_API_KEY: str = "YOUR_GEMINI_API_KEY"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Model defaults
    DEFAULT_GENERATION_MODEL: str = "gemini-2.5-flash"
    
    # Runtime limits
    MAX_REPAIR_ATTEMPTS: int = 3
    SIMULATOR_SANDBOX_TIMEOUT: int = 5 # seconds

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
`
  },
  "app/schemas.py": {
    name: "schemas.py",
    path: "app/schemas.py",
    language: "python",
    content: `from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Stage 1: Intent extraction ---
class IntentInput(BaseModel):
    prompt: str = Field(..., description="The natural language prompt describing the user's dream app.")

class FeatureDetail(BaseModel):
    name: str = Field(..., description="Feature component name.")
    description: str = Field(..., description="Description of the functional behavior.")
    priority: str = Field(..., description="Priority level: high, medium, or low.")

class RolePermission(BaseModel):
    role: str = Field(..., description="Role identity identifier.")
    allowed_scopes: List[str] = Field(..., description="Allowed interactions/actions.")

class IntentResponse(BaseModel):
    app_name: str = Field(..., description="Deduced name of the app.")
    core_purpose: str = Field(..., description="Core purpose statement.")
    primary_actors: List[str] = Field(..., description="Target users or roles.")
    essential_features: List[Dict[str, Any]] = Field(..., description="Identified core features and goals.")
    ambiguities_resolved: List[str] = Field(..., description="Assumptions made to clean initial intent.")
    
    # Strict fields
    app_type: str = Field(..., description="The architectural class or type of the application.")
    features: List[FeatureDetail] = Field(...)
    roles: List[str] = Field(...)
    permissions: List[RolePermission] = Field(...)

# --- Stage 2: System design ---
class DesignInput(BaseModel):
    intent_summary: str
    target_framework: str = "FastAPI + React"

class FileNode(BaseModel):
    name: str
    type: str # 'file' or 'directory'
    children: Optional[List['FileNode']] = None

class EntityDetail(BaseModel):
    name: str = Field(..., description="The name of the database table / entity.")
    attributes: List[str] = Field(..., description="Array of database attributes/fields.")
    relationships: List[str] = Field(..., description="Array of foreign keys or logical relations.")

class UserFlowStep(BaseModel):
    actor: str = Field(..., description="Actor / persona initiating the task.")
    action: str = Field(..., description="The action they perform on the system.")
    system_response: str = Field(..., description="The reaction / validation of the system.")

class DesignResponse(BaseModel):
    proposed_architecture: str = Field(..., description="General pattern (e.g. monolithic, microservices, local-first).")
    modularity_map: List[FileNode] = Field(..., description="Complete folder structure of the proposed app.")
    suggested_dependencies: List[str] = Field(..., description="List of required packages/dependencies.")
    crucial_endpoints: List[Dict[str, str]] = Field(..., description="Listing of HTTP paths, methods, and details.")
    
    # Strict fields
    entities: List[EntityDetail] = Field(..., description="Core entities and relations.")
    user_flows: List[UserFlowStep] = Field(..., description="Chronological flows of use cases.")
    role_permissions: List[RolePermission] = Field(..., description="Role-based scopes detailing RBAC logic.")
    system_blueprint: str = Field(..., description="High-level systemic blueprint and processing rules.")

# --- Stage 3: Schema generation ---
class SchemaInput(BaseModel):
    system_design_components: str

class SchemaResponse(BaseModel):
    sql_ddl: str = Field(..., description="SQL DDL statements for PostgreSQL/MySQL.")
    pydantic_code: str = Field(..., description="Pydantic validation code mapping these schemas.")
    orm_models_code: str = Field(..., description="SQLAlchemy/SQLModel codebase.")

# --- Stage 4: Validation engine ---
class ValidationInput(BaseModel):
    schema_code: str
    pydantic_code: str

class ValidationErrorItem(BaseModel):
    rule_id: str
    severity: str # 'error' | 'warning' | 'info'
    location: str
    message: str
    suggested_fix: str

class ValidationResponse(BaseModel):
    is_valid: bool
    score: int = Field(..., description="Security & design score from 0 to 100.")
    errors: List[ValidationErrorItem]

# --- Stage 5: Repair engine ---
class RepairInput(BaseModel):
    source_code: str
    error_report: str

class RepairResponse(BaseModel):
    repaired_code: str
    healing_summary: str
    test_run_success: bool
    
    # Stage 5 strict fields
    repair_workflow: List[str] = Field(..., description="Chronological list of healing pipeline stages executed.")
    validation_error_handling: str = Field(..., description="Summary of how validation errors were triaged.")
    patch_strategy: str = Field(..., description="Method used to modify and stitch the fixed code segments.")
    before_repair_code: str = Field(..., description="Damaged or buggy original snippet.")
    after_repair_code: str = Field(..., description="Cleansed, revalidated fixed snippet.")

# --- Stage 6: Runtime simulation ---
class SimulationInput(BaseModel):
    endpoints: List[Dict[str, str]]
    schema_definitions: str
    simulation_request: Dict[str, Any]

class PassFailCheck(BaseModel):
    name: str = Field(..., description="The name of the validation check requirement.")
    status: str = Field(..., description="The pass/fail status outcome: pass or fail.")
    details: str = Field(..., description="Specific validation result explanation.")

class SimulationResponse(BaseModel):
    received_request: Dict[str, Any]
    intercepted_mock_route: str
    simulated_db_queries: List[str]
    mock_response_body: Dict[str, Any]
    status_code: int
    computation_time_ms: float
    
    # Stage 6 strict fields
    runtime_validation_flow: List[str] = Field(..., description="Chronological sequence of validation checks executed during runtime.")
    ui_to_api_mapping_valid: bool = Field(..., description="Indicates if frontend UI parameters correctly map to API endpoints.")
    api_to_db_consistency_valid: bool = Field(..., description="Indicates if API queries are clean with DB tables definition.")
    auth_rules_passed: bool = Field(..., description="Indicates if call metadata satisfied the RBAC access rule parameters.")
    pass_fail_checks: List[PassFailCheck] = Field(..., description="Granular pass/fail validation metrics.")
    executable: bool = Field(..., description="Final logical judgment verifying execution viability.")
`
  },
  "app/services/intent.py": {
    name: "intent.py",
    path: "app/services/intent.py",
    language: "python",
    content: `import json
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import IntentResponse

class IntentService:
    def __init__(self):
        # Initializing unified Google GenAI client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(self, prompt: str) -> IntentResponse:
        system_instruction = (
            "You are an expert system analyst. Your job is to extract clear intents, "
            "intended stakeholders, essential features, assumptions, and assign a beautiful, "
            "simple literal name to the targeted application."
        )

        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=f"Analyze the following application idea and isolate key specs:\n{prompt}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=IntentResponse,
                temperature=0.2
            )
        )
        # Parse the JSON matching the IntentResponse Pydantic payload
        data = json.loads(response.text)
        return IntentResponse(**data)
`
  },
  "app/services/design.py": {
    name: "design.py",
    path: "app/services/design.py",
    language: "python",
    content: `import json
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import DesignResponse

class DesignService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(self, intent_summary: str, target_framework: str) -> DesignResponse:
        prompt = (
            f"Given this intent summary: {intent_summary}\\n"
            f"Draft a modern system designed for {target_framework}. "
            f"Define a beautiful, realistic directory file tree with FileNodes ('file' or 'directory'), "
            f"suggest critical external dependencies, and specify key HTTP endpoints."
        )
        
        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a Principal Software Architect crafting modular layouts.",
                response_mime_type="application/json",
                response_schema=DesignResponse,
                temperature=0.3
            )
        )
        return DesignResponse(**json.loads(response.text))
`
  },
  "app/services/schema.py": {
    name: "schema.py",
    path: "app/services/schema.py",
    language: "python",
    content: `import json
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import SchemaResponse

class SchemaService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(self, system_design_components: str) -> SchemaResponse:
        prompt = (
            f"Generate database representations and validate structs based on these design specifications:\\n"
            f"{system_design_components}\\n\\n"
            f"Generate standard clean code snippets for PostgreSQL SQL DDL, Python Pydantic Models, and SQLAlchemy Models."
        )

        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a senior database administrator producing valid codebase structures.",
                response_mime_type="application/json",
                response_schema=SchemaResponse,
                temperature=0.1
            )
        )
        return SchemaResponse(**json.loads(response.text))
`
  },
  "app/services/validation.py": {
    name: "validation.py",
    path: "app/services/validation.py",
    language: "python",
    content: `import json
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import ValidationResponse

class ValidationService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(self, schema_code: str, pydantic_code: str) -> ValidationResponse:
        prompt = (
            f"Verify the following ORM / DLL schema and Pydantic validation code:\\n"
            f"=== Schema ===\\n{schema_code}\\n\\n"
            f"=== Pydantic Models ===\\n{pydantic_code}\\n\\n"
            f"Scan for syntax faults, relation bugs (missing keys), security traps, "
            f"or non-standard naming schemas."
        )

        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a security auditor and compiler parser checks engine.",
                response_mime_type="application/json",
                response_schema=ValidationResponse,
                temperature=0.1
            )
        )
        return ValidationResponse(**json.loads(response.text))
`
  },
  "app/services/repair.py": {
    name: "repair.py",
    path: "app/services/repair.py",
    language: "python",
    content: `import json
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import RepairResponse

class RepairService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(self, source_code: str, error_report: str) -> RepairResponse:
        prompt = (
            f"Analyze this broken code:\\n{source_code}\\n\\n"
            f"Analyze the compiler/lint diagnostics:\\n{error_report}\\n\\n"
            f"Produce fully repaired and cleaned self-healed code with a descriptive healing log summary."
        )

        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are an automated self-healing compilers agent returning correct code fixes.",
                response_mime_type="application/json",
                response_schema=RepairResponse,
                temperature=0.15
            )
        )
        return RepairResponse(**json.loads(response.text))
`
  },
  "app/services/simulation.py": {
    name: "simulation.py",
    path: "app/services/simulation.py",
    language: "python",
    content: `import json
import time
from google import genai
from google.genai import types
from app.config import settings
from app.schemas import SimulationResponse

class SimulationService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def execute(
        self, 
        endpoints: list, 
        schema_definitions: str, 
        simulation_request: dict
    ) -> SimulationResponse:
        start_time = time.time()
        
        prompt = (
            f"Database schemas:\\n{schema_definitions}\\n\\n"
            f"Configured Route endpoints:\\n{json.dumps(endpoints, indent=2)}\\n\\n"
            f"The client simulated this request payload:\\n{json.dumps(simulation_request, indent=2)}\\n\\n"
            f"Simulate standard transactional database queries (SQL or ORM actions) executed by this step, "
            f"intercept the matched URI endpoint, and simulate standard JSON response and server HTTP logs."
        )

        response = self.client.models.generate_content(
            model=settings.DEFAULT_GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a server simulator, interpreting schema constraints and mock routes.",
                response_mime_type="application/json",
                response_schema=SimulationResponse,
                temperature=0.2
            )
        )
        
        sim_data = json.loads(response.text)
        sim_data["computation_time_ms"] = round((time.time() - start_time) * 1000, 2)
        return SimulationResponse(**sim_data)
`
  },
  "requirements.txt": {
    name: "requirements.txt",
    path: "requirements.txt",
    language: "text",
    content: `fastapi==0.110.0
pydantic==2.6.4
pydantic-settings==2.2.1
google-genai==2.4.0
uvicorn==0.28.0
sqlalchemy==2.0.28
`
  },
  "README.md": {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    content: `# AI App Generator Core System

This is the fully modular, structured FastAPI core backend for an AI-powered Application Generator system.

## 🏗️ Architecture Blueprint
Our pipeline is designed from the ground up to support iterative generation and validation:

1. **Intent Extraction** (\`/api/stages/intent\`): Analyzes natural language prompts, creates unified specs, and assigns standard descriptive schema names.
2. **System Design** (\`/api/stages/design\`): Structures file directory blueprints, critical endpoints, and dependencies.
3. **Schema Generation** (\`/api/stages/schema\`): Drafts live relational DDL code, Pydantic structures, and ORM objects.
4. **Validation** (\`/api/stages/validate\`): Statically parses security configurations, structural overlaps, or missing reference keys.
5. **Self-Heal/Repair** (\`/api/stages/repair\`): Iteratively heals damaged code schemas using detailed diagnostics.
6. **Simulate Runtime** (\`/api/stages/simulate\`): Intercepts payload paths, outputs active dry-run state data, and returns standard mock answers.

## 🚀 Speedrun Guide

### 1. Installation
Build a fresh Python virtual environment and run the dependency installation:
\`\`\`bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### 2. Configuration (\`.env\`)
Provide your Gemini credentials:
\`\`\`env
GEMINI_API_KEY="AIzaSyYourKeyHere..."
default_generation_model="gemini-2.5-flash"
\`\`\`

### 3. Launching Dev Network
Execute the local listener daemon using uvicorn:
\`\`\`bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
\`\`\`

Navigate to \`http://localhost:8000/docs\` to open the interactive OpenAPI (Swagger) web dashboard!
`
  },
  ".env.example": {
    name: ".env.example",
    path: ".env.example",
    language: "env",
    content: `# API Configuration
GEMINI_API_KEY="your-google-api-key-here"
DEFAULT_GENERATION_MODEL="gemini-2.5-flash"

# Port configurations
PORT=8000
HOST="0.0.0.0"
`
  }
};
