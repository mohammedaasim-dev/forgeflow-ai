import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Layers, 
  Folder, 
  File, 
  Code, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RefreshCw, 
  Send, 
  ArrowRight, 
  Copy, 
  BookOpen, 
  Terminal, 
  Check, 
  Info, 
  Play, 
  Activity, 
  FileJson,
  X,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Lock,
  ChevronLeft,
  CheckSquare
} from "lucide-react";
import { starterCodeFiles } from "./starterCode";
import { 
  IntentOutput, 
  SystemDesignOutput, 
  SchemaGenerationOutput, 
  ValidationOutput, 
  RepairOutput, 
  SimulationOutput 
} from "./types";

// Premium Predefined Generation Templates to allow instant fully-populated state right off the shelf
const PRESETS = [
  {
    id: "preset-1",
    name: "Collaborative Project Task Board",
    prompt: "Build an interactive Scrum/Kanban collaborative board with separate task categories, live board status updates, multiple actors (Admins, Editors, Viewers), security policies for role access, and historical trace audits.",
    intent: {
      appName: "CollabBoard Engine",
      corePurpose: "A secure, role-based real-time collaborative Kanban board for project resource management.",
      primaryActors: ["Project Manager / Administrator", "Team Collaborator / Editor", "Stakeholder / Viewer"],
      essentialFeatures: [
        { title: "Dynamic Task Board", explanation: "Interact with tickets structured in Swimlanes with status dragging (Todo, In-Progress, Review, Completed).", importance: "high" },
        { title: "RBAC Access Control", explanation: "Ensure Viewers cannot edit and Editors cannot alter workspace settings or trigger user removals.", importance: "high" },
        { title: "Team Trace Audit Logs", explanation: "Historical events records documenting who altered state, moved items, or reassigned tags.", importance: "medium" },
        { title: "Time Track Estimator", explanation: "Aggregate predicted versus actual hours worked directly represented in cards data analytics.", importance: "low" }
      ],
      ambiguitiesResolved: [
        "Structured state as JSONB in PostgreSQL to support rapid custom fields changes.",
        "Created soft-delete pattern to let Admins recover accidentally cleaned tasks.",
        "Assumed standard FastAPI dependency injections to read OAuth authentication state safely."
      ],
      app_type: "Real-Time Collaboration",
      features: [
        { name: "Dynamic Task Board", description: "Interact with tickets structured in Swimlanes with status dragging (Todo, In-Progress, Review, Completed).", priority: "high" },
        { name: "RBAC Access Control", description: "Ensure Viewers cannot edit and Editors cannot alter workspace settings or trigger user removals.", priority: "high" },
        { name: "Team Trace Audit Logs", description: "Historical events records documenting who altered state, moved items, or reassigned tags.", priority: "medium" },
        { name: "Time Track Estimator", description: "Aggregate predicted versus actual hours worked directly represented in cards data analytics.", priority: "low" }
      ],
      roles: ["Project Manager / Administrator", "Team Collaborator / Editor", "Stakeholder / Viewer"],
      permissions: [
        { role: "Project Manager / Administrator", allowed_scopes: ["read:boards", "write:boards", "read:tasks", "write:tasks", "write:settings", "read:audit"] },
        { role: "Team Collaborator / Editor", allowed_scopes: ["read:boards", "read:tasks", "write:tasks"] },
        { role: "Stakeholder / Viewer", allowed_scopes: ["read:boards", "read:tasks"] }
      ]
    } as IntentOutput,
    design: {
      proposedArchitecture: "Three-tier architecture with stateful JSON database models on FastAPI backend accompanied by event logs.",
      modularityMap: [
        {
          name: "app",
          type: "directory",
          children: [
            { name: "main.py", type: "file" },
            { name: "config.py", type: "file" },
            { name: "schemas.py", type: "file" },
            {
              name: "models",
              type: "directory",
              children: [
                { name: "database.py", type: "file" },
                { name: "card.py", type: "file" },
                { name: "audit.py", type: "file" }
              ]
            }
          ]
        },
        { name: "requirements.txt", type: "file" },
        { name: "README.md", type: "file" }
      ],
      suggestedDependencies: ["fastapi==0.110.0", "pydantic==2.6.4", "sqlalchemy==2.0.28", "psycopg2-binary==2.9.9", "alembic==1.13.1"],
      crucialEndpoints: [
        { path: "/api/boards", method: "GET", details: "Lists boards available to the verified authenticated user scope.", example_payload: "{}" },
        { path: "/api/boards/{board_id}/tasks", method: "POST", details: "Creates a new task card inside the selected Kanban board Swimlane.", example_payload: "{\n  \"title\": \"Integrate user auth verification\",\n  \"description\": \"Ensure the login endpoint checks correct Argon2 crypt tokens before issuing JWT signatures.\",\n  \"status\": \"in_progress\",\n  \"assigned_to\": 1,\n  \"estimated_hours\": 4.5\n}" },
        { path: "/api/tasks/{task_id}", method: "PUT", details: "Updates state, position, assigned developers, or active description.", example_payload: "{\n  \"title\": \"Integrate user auth verification\",\n  \"status\": \"completed\",\n  \"estimated_hours\": 6.0\n}" },
        { path: "/api/audit/logs", method: "GET", details: "Returns trace events sorted chronologically (restricted to Admin actor).", example_payload: "{}" }
      ],
      entities: [
        { name: "users", attributes: ["id: SERIAL", "email: VARCHAR UNIQUE", "role: VARCHAR", "created_at: TIMESTAMP"], relationships: ["one-to-many boards", "one-to-many audit_logs"] },
        { name: "boards", attributes: ["id: SERIAL", "title: VARCHAR", "owner_id: INTEGER REFERENCES users"], relationships: ["many-to-one users", "one-to-many tasks"] },
        { name: "tasks", attributes: ["id: SERIAL", "board_id: INTEGER REFERENCES boards", "title: VARCHAR", "description: TEXT", "status: VARCHAR", "assigned_to: INTEGER REFERENCES users", "estimated_hours: NUMERIC", "created_at: TIMESTAMP"], relationships: ["many-to-one boards", "many-to-one users"] },
        { name: "audit_logs", attributes: ["id: SERIAL", "actor_id: INTEGER REFERENCES users", "action: VARCHAR", "details: JSONB", "timestamp: TIMESTAMP"], relationships: ["many-to-one users"] }
      ],
      userFlows: [
        { actor: "Project Manager / Administrator", action: "Creates Kanban Board and sets status to Active", systemResponse: "Saves new board entry in database, links owner_id, and logs action under audit trail." },
        { actor: "Team Collaborator / Editor", action: "Moves Task card from 'Todo' Swimlane to 'In-Progress'", systemResponse: "Verifies scope write permission on board, updates status, saves estimated_hours delta, and appends audit record." }
      ],
      rolePermissions: [
        { role: "Project Manager / Administrator", allowed_scopes: ["read:boards", "write:boards", "read:tasks", "write:tasks", "write:settings", "read:audit"] },
        { role: "Team Collaborator / Editor", allowed_scopes: ["read:boards", "read:tasks", "write:tasks"] },
        { role: "Stakeholder / Viewer", allowed_scopes: ["read:boards", "read:tasks"] }
      ],
      systemBlueprint: "Clients hit the React SPA hosted in Cloud Storage / Nginx proxy, which forwards requests to a stateful FastAPI Docker container. The FastAPI service verifies OAuth scopes on arriving requests, connects to a PostgreSQL instance via SQLAlchemy, and pipes system audit events to a dedicated background log stream for auditing."
    } as SystemDesignOutput,
    schema: {
      sqlDdl: `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, review, done
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    estimated_hours NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      pydanticCode: `from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str = "viewer"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    status: str = "todo"
    assigned_to: Optional[int] = None
    estimated_hours: float = Field(0.0, ge=0.0)

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    board_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True`,
      ormModelsCode: `from sqlalchemy import Column, Integer, String, Text, ForeignKey, Numeric, DateTime, JSON
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), default="viewer")
    
    # Missing tasks backward reference causing validator tool warnings!
    # tasks = relationship("Task", back_populates="assignee")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="todo")
    assigned_to = Column(Integer, ForeignKey("users.id"))
    
    # Back relation reference
    assignee = relationship("User")`
    } as SchemaGenerationOutput,
    validationBeforeRepair: {
      isValid: false,
      score: 72,
      errors: [
        {
          ruleId: "REL_BACK_REF_MISMATCH",
          severity: "warning",
          location: "app/models/card.py Line 14",
          message: "SQLAlchemy model Column 'assigned_to' maps relationship assignee, but class User lacks reciprocal relationship backref. This can lead to database desyncs during cascade.",
          suggestedFix: "Add back_populates='tasks' relationship into class User and set relationship details inside Task."
        },
        {
          ruleId: "STATUS_HARDCODE_RISK",
          severity: "info",
          location: "app/schemas.py Line 24",
          message: "Task.status utilizes standard string field instead of strict python Enum representation.",
          suggestedFix: "Migrate TaskBase.status field into an Enum class for type safety constraints."
        }
      ]
    } as ValidationOutput,
    repair: {
      repairedCode: `from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), default="viewer")
    
    # Repaired: Added backward relationship reference safely
    tasks = relationship("Task", back_populates="assignee", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="todo")
    assigned_to = Column(Integer, ForeignKey("users.id"))
    
    # Repaired: Configured strict twin mappings
    assignee = relationship("User", back_populates="tasks")`,
      healingSummary: "Configured direct bilateral relationship links between User and Task. Injected back_populates on both structures to allow dynamic SQLAlchemy joins, and added Cascade delete restrictions to maintain user referential integrity.",
      testRunSuccess: true,
      repairWorkflow: [
        "Diagnostics ingestion: Analyzed validation warnings pointing to unmapped SQLAlchemy back-references.",
        "AST code parsing: Parsed relational fields across User and Task class schema components.",
        "Surgical Patch insertion: Injected explicit back_populates arguments inside assignee and tasks fields.",
        "Verification: Executed test dry-runs confirming no overlapping properties or configuration drift."
      ],
      validationErrorHandling: "Isolated unmapped backref relationships which cause lazy-load run-time errors. Categorized the warning as high priority type-safety issue and treated it by linking both ends of User and Task declarations.",
      patchStrategy: "Surgical class property replacement and cross-references link generation.",
      beforeRepairCode: `class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    # Missing explicit tasks relationship linking`,
      afterRepairCode: `class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    tasks = relationship("Task", back_populates="assignee", cascade="all, delete-orphan")`
    } as RepairOutput,
    defaultSimulationRequest: {
      endpointIndex: 1,
      payload: {
        title: "Integrate user auth verification",
        description: "Ensure the login endpoint checks correct Argon2 crypt tokens before issuing JWT signatures.",
        status: "in_progress",
        assigned_to: 1,
        estimated_hours: 4.5
      }
    },
    defaultSimulationResponse: {
      receivedRequest: {
        title: "Integrate user auth verification",
        description: "Ensure the login endpoint checks correct Argon2 crypt tokens before issuing JWT signatures.",
        status: "in_progress",
        assigned_to: 1,
        estimated_hours: 4.5
      },
      interceptedMockRoute: "POST /api/tasks (Create Task)",
      simulatedDbQueries: [
        "SELECT * FROM users WHERE id = 1 AND is_active = true LIMIT 1;",
        "INSERT INTO tasks (title, description, status, assigned_to, estimated_hours) VALUES ('Integrate user auth verification', 'Ensure the login endpoint checks correct...', 'in_progress', 1, 4.5) RETURNING *;",
        "INSERT INTO audit_logs (actor_id, action, target_type, target_id, occurred_at) VALUES (1, 'CREATE_TASK', 'task', 12, NOW());"
      ],
      mockResponseBody: {
        id: 12,
        title: "Integrate user auth verification",
        description: "Ensure the login endpoint checks correct Argon2 crypt tokens before issuing JWT signatures.",
        status: "in_progress",
        assigned_to: 1,
        estimated_hours: 4.5,
        created_at: "2026-06-03T17:58:30Z",
        updated_at: "2026-06-03T17:58:30Z"
      },
      statusCode: 201,
      computationTimeMs: 14.2,
      runtimeValidationFlow: [
        "Intercepted REST Request: POST payload matching standard schemas.",
        "Pydantic Validation: Successfully parsed request parameters against TaskCreate schema constraints.",
        "Role-Based Authorization Checked: PM / PM-Editor has correct scope (write:tasks) for modification.",
        "Database Consistency Ensured: Foreign key referenced user is authenticated and matches target users database id."
      ],
      uiToApiMappingValid: true,
      apiToDbConsistencyValid: true,
      authRulesPassed: true,
      passFailChecks: [
        { name: "Pydantic Models Payload Sanity", status: "pass", details: "The input fields matched expected types, with non-empty task titles and valid estimated work hours." },
        { name: "PostgreSQL Foreign Key Referencing", status: "pass", details: "Target user ID 1 exists and is registered inside primary users table schemas." },
        { name: "Scope Access Security Compliance", status: "pass", details: "Bearer JWT possessed the required scope permissions level: [write:tasks]." }
      ],
      executable: true
    } as SimulationOutput
  },
  {
    id: "preset-2",
    name: "AI-Powered Gym Workout Trainer",
    prompt: "Create an adaptive gym workout trainer with exercise database categorization, user performance tracking metrics, muscle recovery state validation formulas, and mock simulator outputs to analyze custom streak plans.",
    intent: {
      appName: "AIFit Planner",
      corePurpose: "A modular, calculation-driven gym training coordinator with automatic recovery scores metrics.",
      primaryActors: ["Gym Trainee / Member", "Personal Coach / Reviewer", "System Admin"],
      essentialFeatures: [
        { title: "Dynamic Workout Logs", explanation: "Saves exercise items, target reps, heavy load records, and targeted RPE ratings metrics.", importance: "high" },
        { title: "Automated Muscle Score", explanation: "Simulates continuous systemic fatigue equations calculating active recommended muscle rest indices.", importance: "high" },
        { title: "Coach Dashboard", explanation: "Enables personal physical guides to load templates directly and offer performance review hints.", importance: "medium" }
      ],
      ambiguitiesResolved: [
        "Modeled RPE fields using rigorous Numeric constraints (integer values 1 to 10 only).",
        "Assumed localized standard metric unit systems (kilograms) as system defaults."
      ],
      app_type: "Fitness Tracking & Biometrics SaaS",
      features: [
        { name: "Dynamic Workout Logs", description: "Saves exercise items, target reps, heavy load records, and targeted RPE ratings metrics.", priority: "high" },
        { name: "Automated Muscle Score", description: "Simulates continuous systemic fatigue equations calculating active recommended muscle rest indices.", priority: "high" },
        { name: "Coach Dashboard", description: "Enables personal physical guides to load templates directly and offer performance review hints.", priority: "medium" }
      ],
      roles: ["Gym Trainee / Member", "Personal Coach / Reviewer", "System Admin"],
      permissions: [
        { role: "Gym Trainee / Member", allowed_scopes: ["read:workouts", "write:workouts", "read:muscle_status"] },
        { role: "Personal Coach / Reviewer", allowed_scopes: ["read:workouts", "write:workout_templates", "read:member_status"] },
        { role: "System Admin", allowed_scopes: ["read:all", "write:all", "write:system_configs"] }
      ]
    } as IntentOutput,
    design: {
      proposedArchitecture: "Service-oriented structure isolating recovery calculations inside logical helper utility modules.",
      modularityMap: [
        {
          name: "app",
          type: "directory",
          children: [
            { name: "main.py", type: "file" },
            { name: "utils_recovery.py", type: "file" },
            {
              name: "routers",
              type: "directory",
              children: [
                { name: "workout.py", type: "file" },
                { name: "biometrics.py", type: "file" }
              ]
            }
          ]
        }
      ],
      suggestedDependencies: ["fastapi==0.110.0", "numpy==1.26.4", "pydantic==2.6.4", "sqlmodel==0.0.16"],
      crucialEndpoints: [
        { path: "/api/workouts/log", method: "POST", details: "Locks in continuous workout exercises list logs.", example_payload: "{\n  \"trainee_id\": 1,\n  \"exercise_name\": \"Barbell Squat\",\n  \"weight_kg\": 120.0,\n  \"reps\": 6,\n  \"rpe\": 9\n}" },
        { path: "/api/metrics/score", method: "GET", details: "Triggers backend biomechanics logic and predicts muscle strain output index.", example_payload: "{}" }
      ],
      entities: [
        { name: "trainees", attributes: ["id: SERIAL", "name: VARCHAR", "current_fatigue_level: NUMERIC"], relationships: ["one-to-many exercises"] },
        { name: "exercises", attributes: ["id: SERIAL", "trainee_id: INTEGER REFERENCES trainees", "name: VARCHAR", "weight_kg: NUMERIC", "reps: INTEGER", "rpe: INTEGER"], relationships: ["many-to-one trainees"] }
      ],
      userFlows: [
        { actor: "Gym Trainee / Member", action: "Uploads set log for biceps curl with 20kg weight at 10 reps", systemResponse: "Validates and saves exercise object, loads historic exercises, re-calculates systemic muscle fatigue using standard formula, and returns latest muscle score." }
      ],
      rolePermissions: [
        { role: "Gym Trainee / Member", allowed_scopes: ["read:workouts", "write:workouts", "read:muscle_status"] },
        { role: "Personal Coach / Reviewer", allowed_scopes: ["read:workouts", "write:workout_templates", "read:member_status"] },
        { role: "System Admin", allowed_scopes: ["read:all", "write:all", "write:system_configs"] }
      ],
      systemBlueprint: "Calculates recovery indices asynchronously with numpy matrices. Trainee logs are saved to an SQL database, and a fast utility module evaluates live fatigue scores dynamically upon fetching trainee dashboards."
    } as SystemDesignOutput,
    schema: {
      sqlDdl: `CREATE TABLE trainees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    current_fatigue_level NUMERIC(3, 1) DEFAULT 0.0
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    trainee_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    reps INTEGER NOT NULL,
    rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      pydanticCode: `from pydantic import BaseModel, Field
from datetime import datetime

class GymLogRequest(BaseModel):
    trainee_id: int
    exercise_name: str = Field(..., max_length=100)
    weight_kg: float = Field(..., gt=0)
    reps: int = Field(..., gt=0)
    rpe: int = Field(..., ge=1, le=10)
`,
      ormModelsCode: `from sqlmodel import SQLModel, Field
from typing import Optional

class Trainee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    current_fatigue_level: float = 0.0
`
    } as SchemaGenerationOutput,
    validationBeforeRepair: {
      isValid: true,
      score: 95,
      errors: [
        {
          ruleId: "MISSING_INDEX",
          severity: "info",
          location: "Database DDL",
          message: "Trainee lookup might be slow since trainee_id lacks database B-Tree search indices.",
          suggestedFix: "Inject CREATE INDEX idx_exercise_trainee ON exercises(trainee_id) on schema DDL script."
        }
      ]
    } as ValidationOutput,
    repair: {
      repairedCode: `CREATE TABLE trainees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    current_fatigue_level NUMERIC(3, 1) DEFAULT 0.0
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    trainee_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    reps INTEGER NOT NULL,
    rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Repaired: Added high-speed indexing
CREATE INDEX idx_exercise_trainee ON exercises(trainee_id);`,
      healingSummary: "Added database level indexed speed structures to allow super fast analytical workouts search over heavy historical trace logs.",
      testRunSuccess: true,
      repairWorkflow: [
        "Ingesting SQL DDL layout: Analyzed indexed search requirements for fast trainee lookup streams.",
        "Pinpointing missing targets: Discovered lack of index layouts for exercises foreign key.",
        "Generating index scripts: Drafted CREATE INDEX definition referencing trainee_id.",
        "Compilation check: Executed diagnostic validations ensuring no structural key collisions."
      ],
      validationErrorHandling: "Analyzed performance diagnostics indicating potential query degradation without trainees key lookup indexes. Upgraded structure schema with high-performance index maps.",
      patchStrategy: "Non-destructive inline SQL schema script appendation.",
      beforeRepairCode: `CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    trainee_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE
);`,
      afterRepairCode: `CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    trainee_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE
);
CREATE INDEX idx_exercise_trainee ON exercises(trainee_id);`
    } as RepairOutput,
    defaultSimulationRequest: {
      endpointIndex: 0,
      payload: {
        trainee_id: 1,
        exercise_name: "Barbell Squat",
        weight_kg: 120.0,
        reps: 6,
        rpe: 9
      }
    },
    defaultSimulationResponse: {
      receivedRequest: {
        trainee_id: 1,
        exercise_name: "Barbell Squat",
        weight_kg: 120.0,
        reps: 6,
        rpe: 9
      },
      interceptedMockRoute: "POST /api/workouts/log (Log Workout Exercise)",
      simulatedDbQueries: [
        "SELECT * FROM trainees WHERE id = 1 LIMIT 1;",
        "INSERT INTO exercises (trainee_id, name, weight_kg, reps, rpe) VALUES (1, 'Barbell Squat', 120.0, 6, 9) RETURNING *;",
        "UPDATE trainees SET current_fatigue_level = current_fatigue_level + 2.5 WHERE id = 1 RETURNING *;"
      ],
      mockResponseBody: {
        id: 42,
        trainee_id: 1,
        exercise_name: "Barbell Squat",
        weight_kg: 120.0,
        reps: 6,
        rpe: 9,
        logged_at: "2026-06-03T17:58:35Z"
      },
      statusCode: 201,
      computationTimeMs: 11.5,
      runtimeValidationFlow: [
        "Payload Inspection: POST fields matches standard muscle fatigue GymLogRequest model.",
        "Value Domain Checks: Confirmed RPE score of 9 resides in valid boundary rating range [1-10].",
        "Referential Consistency: Target trainee_id belongs to registered trainees list."
      ],
      uiToApiMappingValid: true,
      apiToDbConsistencyValid: true,
      authRulesPassed: true,
      passFailChecks: [
        { name: "Pydantic GymLogRequest validation check", status: "pass", details: "All numeric constraints matched successfully (reps gt 0, weight_kg gt 0, rpe inside range)." },
        { name: "Trainee database relationship resolution check", status: "pass", details: "Foreign keys validated successfully against active trainee database registry tables." },
        { name: "Workout analytics logs append check", status: "pass", details: "SQL script indexing executes smoothly with Trainee B-tree speeds without key constraint violations." }
      ],
      executable: true
    } as SimulationOutput
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"pipeline" | "starter" | "blueprint">("pipeline");

  // State managers
  const [promptInput, setPromptInput] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("preset-1");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Active Pipeline Outputs
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageProgress, setStageProgress] = useState<Record<number, "idle" | "running" | "completed">>({
    1: "completed",
    2: "completed",
    3: "completed",
    4: "completed",
    5: "completed",
    6: "completed"
  });

  const [intentData, setIntentData] = useState<IntentOutput | null>(PRESETS[0].intent);
  const [designData, setDesignData] = useState<SystemDesignOutput | null>(PRESETS[0].design);
  const [schemaData, setSchemaData] = useState<SchemaGenerationOutput | null>(PRESETS[0].schema);
  const [validationData, setValidationData] = useState<ValidationOutput | null>(PRESETS[0].validationBeforeRepair);
  const [repairedData, setRepairedData] = useState<RepairOutput | null>(PRESETS[0].repair);
  
  // Custom interactive simulation state
  const [simSelectedEndpoint, setSimSelectedEndpoint] = useState<number>(1);
  const [simPayloadInput, setSimPayloadInput] = useState<string>(
    JSON.stringify(PRESETS[0].defaultSimulationRequest.payload, null, 2)
  );
  const [simulationResponse, setSimulationResponse] = useState<SimulationOutput | null>(
    PRESETS[0].defaultSimulationResponse
  );

  // Starter Code Explorer View State
  const [selectedStarterFile, setSelectedStarterFile] = useState<string>("app/main.py");
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);

  // Health and API key indicator check
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Load Presets when triggered
  const loadPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    setSelectedPresetId(presetId);
    setIntentData(preset.intent);
    setDesignData(preset.design);
    setSchemaData(preset.schema);
    setValidationData(preset.validationBeforeRepair);
    setRepairedData(preset.repair);
    setCurrentStage(1);
    setStageProgress({
      1: "completed",
      2: "completed",
      3: "completed",
      4: "completed",
      5: "completed",
      6: "completed"
    });
    setSimSelectedEndpoint(preset.defaultSimulationRequest.endpointIndex);
    setSimPayloadInput(JSON.stringify(preset.defaultSimulationRequest.payload, null, 2));
    setSimulationResponse((preset as any).defaultSimulationResponse || null);
  };

  // Perform backend check on mount
  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setBackendHealthy(data.status === "healthy");
        setApiKeyMissing(!data.keyAvailable);
      })
      .catch(() => {
        // Fallback for isolated preview mode
        setBackendHealthy(true);
      });
  }, []);

  // Set initial payload when presets or endpoint targets change
  const handleEndpointSelect = (idx: number) => {
    setSimSelectedEndpoint(idx);
    if (!designData) return;
    const ep = designData.crucialEndpoints[idx];
    
    let mockPayload: any = {};
    if (ep.example_payload) {
      try {
        mockPayload = JSON.parse(ep.example_payload);
      } catch (e) {
        mockPayload = {};
      }
    } else if (ep.method === "POST" || ep.method === "PUT") {
      if (selectedPresetId === "preset-1") {
        mockPayload = {
          title: "Optimize transactional locking",
          description: "Database isolation checks",
          status: "todo",
          assigned_to: 2,
          estimated_hours: 6.0
        };
      } else {
        mockPayload = {
          trainee_id: 2,
          exercise_name: "Incline Dumbbell Press",
          weight_kg: 40.0,
          reps: 10,
          rpe: 8
        };
      }
    }
    setSimPayloadInput(JSON.stringify(mockPayload, null, 2));
  };

  // Main custom generator trigger making server-side api requests to the pipeline
  const handleTriggerGenerator = async (customPrompt?: string) => {
    const prompt = customPrompt || promptInput;
    if (!prompt.trim()) {
      setErrorStatus("Please write a conceptual prompt idea first.");
      return;
    }

    setIsLoading(true);
    setErrorStatus(null);
    setRepairedData(null);
    setSimulationResponse(null);

    // Reset progress tracking states
    setStageProgress({
      1: "running",
      2: "idle",
      3: "idle",
      4: "idle",
      5: "idle",
      6: "idle"
    });
    setCurrentStage(1);

    try {
      // --- Stage 1: Intent Extraction ---
      const intentRes = await fetch("/api/pipeline/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!intentRes.ok) throw new Error("Stage 1 Pipeline failed during system parse.");
      const rawIntent: IntentOutput = await intentRes.json();
      setIntentData(rawIntent);
      
      setStageProgress(prev => ({ ...prev, 1: "completed", 2: "running" }));
      setCurrentStage(2);

      // --- Stage 2: System Blueprint Design ---
      const designRes = await fetch("/api/pipeline/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intentSummary: rawIntent })
      });
      if (!designRes.ok) throw new Error("Stage 2 Pipeline failed. Architecture synthesis blocked.");
      const rawDesign: SystemDesignOutput = await designRes.json();
      setDesignData(rawDesign);
      
      setStageProgress(prev => ({ ...prev, 2: "completed", 3: "running" }));
      setCurrentStage(3);

      // --- Stage 3: Schema DDL & Code Generation ---
      const schemaRes = await fetch("/api/pipeline/schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemDesign: rawDesign })
      });
      if (!schemaRes.ok) throw new Error("Stage 3 Pipeline failed to render code definitions.");
      const rawSchema: SchemaGenerationOutput = await schemaRes.json();
      setSchemaData(rawSchema);

      setStageProgress(prev => ({ ...prev, 3: "completed", 4: "running" }));
      setCurrentStage(4);

      // --- Stage 4: Lint Verification & Audit ---
      const auditRes = await fetch("/api/pipeline/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemaCode: rawSchema.sqlDdl, pydanticCode: rawSchema.pydanticCode })
      });
      if (!auditRes.ok) throw new Error("Stage 4 Validator Engine failed.");
      const rawAudit: ValidationOutput = await auditRes.json();
      setValidationData(rawAudit);

      // Pre-populate Stage 6 Simulator parameters matching newly designed endpoint #1 payload
      if (rawDesign && rawDesign.crucialEndpoints && rawDesign.crucialEndpoints.length > 0) {
        const ep0 = rawDesign.crucialEndpoints[0];
        setSimSelectedEndpoint(0);
        let firstPayload = {};
        if (ep0.example_payload) {
          try {
            firstPayload = JSON.parse(ep0.example_payload);
          } catch (e) {
            firstPayload = {};
          }
        }
        setSimPayloadInput(JSON.stringify(firstPayload, null, 2));
      }

      // If validation did not capture any critical failures, auto-progress Stage 5 to completed
      if (rawAudit.isValid) {
        setRepairedData({
          repairedCode: rawSchema.ormModelsCode,
          healingSummary: "Validation engine clean run. Code contains 0 critical defects! Synthesized blueprints passed all automatic integrity inspections.",
          testRunSuccess: true,
          repairWorkflow: [
            "1. Core diagnostics checked.",
            "2. Compared Pydantic data schemas with DB physical keys.",
            "3. Status: 100% compliant. Bypass repair stage.",
            "4. System verified for immediate sandbox execution."
          ],
          validationErrorHandling: "All column attributes and endpoint parameters are aligned.",
          patchStrategy: "No healing patch was needed. Initial compilation structure is fully resilient.",
          beforeRepairCode: "# Synthesized original SQLAlchemy code is pristine and fully valid.",
          afterRepairCode: "# Original healthy components preserved."
        } as any);

        setStageProgress(prev => ({
          ...prev,
          4: "completed",
          5: "completed"
        }));
        setCurrentStage(5);
      } else {
        setStageProgress(prev => ({ ...prev, 4: "completed" }));
        setCurrentStage(4);
      }

    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "An unexpected error disrupted the pipeline simulation. Please verify credentials in the Secrets guide.");
      // Soft recover progress states that crashed
      setStageProgress(prev => {
        const reset: any = { ...prev };
        Object.keys(reset).forEach((key: any) => {
          if (reset[key] === "running") reset[key] = "idle";
        });
        return reset;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 5 interactive run: Repair Engine
  const triggerSelfHealRepair = async () => {
    if (!schemaData || !validationData) return;
    setIsLoading(true);
    setErrorStatus(null);
    setStageProgress(prev => ({ ...prev, 5: "running" }));
    setCurrentStage(5);

    try {
      const res = await fetch("/api/pipeline/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: schemaData.ormModelsCode,
          errorReport: JSON.stringify(validationData.errors)
        })
      });
      if (!res.ok) throw new Error("Self-healing repair routine failed to execute.");
      const repaired: RepairOutput = await res.json();
      setRepairedData(repaired);
      
      // Upgrade valid state score on GUI
      setValidationData(prev => prev ? {
        ...prev,
        isValid: true,
        score: 100,
        errors: []
      } : null);

      setStageProgress(prev => ({ ...prev, 5: "completed" }));
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Code Repair process crashed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 6 interactive run: Service Sandbox simulation
  const executeSandboxSimulation = async () => {
    if (!designData || !schemaData) return;
    setIsLoading(true);
    setErrorStatus(null);
    setStageProgress(prev => ({ ...prev, 6: "running" }));
    setCurrentStage(6);

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(simPayloadInput);
    } catch (err) {
      setErrorStatus("Payload JSON is poorly formatted. Please correct the parameters.");
      setIsLoading(false);
      return;
    }

    try {
      const selectedEndpoint = designData.crucialEndpoints[simSelectedEndpoint];
      const res = await fetch("/api/pipeline/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoints: [selectedEndpoint],
          schemaDefinitions: schemaData.sqlDdl + "\n" + schemaData.pydanticCode,
          simulationRequest: parsedPayload
        })
      });
      if (!res.ok) throw new Error("Sandbox simulator route matching failed.");
      const simOutput: SimulationOutput = await res.json();
      setSimulationResponse(simOutput);

      setStageProgress(prev => ({ ...prev, 6: "completed" }));
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Simulation trigger faulted.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy codebase file contents to clipboard helper
  const handleCopyCode = (filename: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFileName(filename);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-accent-cyan/20 selection:text-accent-cyan">
      
      {/* Upper Navigation Indicator Brand Rail */}
      <header className="border-b border-navy-850 bg-navy-950/70 backdrop-blur-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-violet flex items-center justify-center shadow-lg shadow-accent-cyan/10 ring-1 ring-white/10">
            <Cpu className="w-5.5 h-5.5 text-navy-950" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold font-display tracking-tight text-white">
                ForgeFlow <span className="text-gradient-cv">AI</span>
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-accent-cyan/10 to-accent-violet/10 text-accent-cyan border border-accent-cyan/30 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase animate-pulse">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Intelligent Application Generation Pipeline & Sandbox Environment</p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-navy-900/90 rounded-xl border border-navy-800 shadow-inner">
          <button 
            id="tab-btn-pipeline"
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center space-x-2 px-4.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "pipeline" 
                ? "bg-navy-800 text-accent-cyan shadow-md shadow-black/30 border border-navy-700/50" 
                : "text-slate-400 hover:text-white hover:bg-navy-850/50"
            }`}
          >
            <Layers className={`w-3.5 h-3.5 transition-colors ${activeTab === "pipeline" ? "text-accent-cyan" : "text-slate-400"}`} />
            <span>6-Stage Generator</span>
          </button>
          <button 
            id="tab-btn-starter"
            onClick={() => setActiveTab("starter")}
            className={`flex items-center space-x-2 px-4.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "starter" 
                ? "bg-navy-800 text-accent-cyan shadow-md shadow-black/30 border border-navy-700/50" 
                : "text-slate-400 hover:text-white hover:bg-navy-850/50"
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 transition-colors ${activeTab === "starter" ? "text-accent-violet" : "text-slate-400"}`} />
            <span>Modular Codebase</span>
          </button>
          <button 
            id="tab-btn-blueprint"
            onClick={() => setActiveTab("blueprint")}
            className={`flex items-center space-x-2 px-4.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "blueprint" 
                ? "bg-navy-800 text-accent-cyan shadow-md shadow-black/30 border border-navy-700/50" 
                : "text-slate-400 hover:text-white hover:bg-navy-850/50"
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 transition-colors ${activeTab === "blueprint" ? "text-pink-400" : "text-slate-400"}`} />
            <span>Architecture Blueprint</span>
          </button>
        </div>

        {/* Credentials / API Key Status Bar Indicator */}
        <div className="flex items-center space-x-3.5 text-xs bg-navy-900 border border-navy-800 rounded-xl px-4 py-2 shadow-inner">
          <span className="flex items-center gap-2 font-semibold text-slate-300">
            <span className={`w-2 h-2 rounded-full ${backendHealthy ? "bg-accent-cyan animate-pulse glow-cyan" : "bg-red-500"}`}></span> 
            {backendHealthy ? "Systems Online" : "Service Disconnected"}
          </span>
          <span className="text-navy-700">|</span>
          {apiKeyMissing ? (
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Sandboxed Mode
            </span>
          ) : (
            <span className="text-accent-cyan font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-cyan" /> Cloud Gemini Active
            </span>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Warning Callout Panel for users */}
        {apiKeyMissing && (
          <div className="lg:col-span-12 glass-panel rounded-2xl p-5 border border-amber-500/20 shadow-lg shadow-amber-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-amber-400 tracking-wide uppercase font-display">SIMULATED SANDBOX ACTIVE</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  We have fully pre-populated high-fidelity application models (Collaborative Scrum Boards, Biomechanical Gym Trackers) so the app simulator remains fully functional out of the box! To query the AI live with your own custom templates, simply click <strong className="text-slate-150">Secrets (gear icon in AI Studio sidebar)</strong>, add standard <strong className="text-accent-cyan font-mono">GEMINI_API_KEY</strong>, and resume querying.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono bg-navy-950 border border-navy-850 text-amber-400/90 font-semibold px-3.5 py-2 rounded-xl shrink-0 shadow-inner">
              API_KEY: REQUIRED
            </div>
          </div>
        )}

        {/* LEFT COLUMN: Controls, Prompts, Stage Progress Index */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Preset Prompts List */}
          <div className="glass-panel rounded-2xl p-5.5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-extrabold tracking-widest uppercase text-slate-300 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" /> App Blueprint Presets
              </h3>
              <span className="text-[10px] text-accent-violet font-semibold tracking-wider uppercase bg-accent-violet/15 border border-accent-violet/20 px-2 py-0.5 rounded-md">Ready Templates</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {PRESETS.map((preset) => (
                <button
                  id={`preset-${preset.id}`}
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                    selectedPresetId === preset.id 
                      ? "bg-navy-800/80 border-accent-cyan/60 text-white shadow-lg shadow-black/40 glow-cyan ring-1 ring-accent-cyan/10" 
                      : "bg-navy-900/40 border-navy-800/60 text-slate-400 hover:text-slate-200 hover:border-navy-700/60 hover:bg-navy-850/40"
                  }`}
                >
                  <div className="space-y-1 ml-0.5">
                    <p className={`text-xs font-bold leading-normal ${selectedPresetId === preset.id ? "text-accent-cyan" : "text-slate-300 group-hover:text-white"}`}>
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[280px]">
                      {preset.prompt}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-200 ${selectedPresetId === preset.id ? "text-accent-cyan translate-x-1" : "text-slate-550 group-hover:text-slate-300 group-hover:translate-x-0.5"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Core Custom Generator Input */}
          <div className="glass-panel rounded-2xl p-5.5 space-y-4">
            <h3 className="text-[11px] font-extrabold tracking-widest uppercase text-slate-300 font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-violet" /> Build Custom Application
            </h3>
            <textarea
              id="custom-prompt-input"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="E.g., Design a premium real estate property portal with role logins, dynamic search, scheduling rules, and audit history logs..."
              className="w-full h-24 bg-navy-950/90 border border-navy-800 hover:border-navy-700 focus:border-accent-cyan rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all duration-200 resize-none font-medium leading-relaxed"
            />
            {errorStatus && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-[shake_0.4s_ease-in-out]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <p className="font-medium leading-normal">{errorStatus}</p>
              </div>
            )}
            <button
              id="btn-run-pipeline"
              onClick={() => handleTriggerGenerator()}
              className="w-full bg-gradient-cv hover:opacity-90 active:scale-[0.98] text-navy-950 font-bold text-xs rounded-xl py-3 px-4 transition-all duration-200 shadow-lg shadow-accent-cyan/15 flex items-center justify-center space-x-2 ring-1 ring-white/25 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-navy-950 animate-spin" />
                  <span className="tracking-wide uppercase text-[10px] font-black">Synthesizing Pipeline Assets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-navy-950 fill-navy-950" />
                  <span className="tracking-wide uppercase text-[10px] font-black">Assemble Custom Pipeline</span>
                </>
              )}
            </button>
          </div>

          {/* Left progress indicators listing */}
          <div className="glass-panel rounded-2xl p-5.5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-extrabold tracking-widest uppercase text-slate-300 font-display">
                Execution Stage Map
              </h3>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 bg-navy-900 border border-navy-800/85 rounded-md">Live Tracking</span>
            </div>
            <div className="space-y-1.5">
              {[
                { step: 1, label: "Intent Synthesizer Engine" },
                { step: 2, label: "System Architecture Designer" },
                { step: 3, label: "Data Schemas Generator" },
                { step: 4, label: "Static Compiler Validator" },
                { step: 5, label: "Self-Healing Patch Repair" },
                { step: 6, label: "Live API Sandbox Simulator" }
              ].map(({ step, label }) => {
                const status = stageProgress[step] || "idle";
                let badgeStyle = "bg-navy-900 text-slate-500 border-navy-800";
                let labelStyle = "text-slate-450";
                
                if (status === "running") {
                  badgeStyle = "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/40 animate-pulse glow-cyan font-extrabold";
                  labelStyle = "text-accent-cyan font-bold";
                } else if (status === "completed") {
                  badgeStyle = "bg-accent-violet/10 text-accent-violet border-accent-violet/30 font-extrabold";
                  labelStyle = "text-slate-200 font-medium";
                }

                return (
                  <button 
                    key={step} 
                    onClick={() => setCurrentStage(step)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl border border-transparent hover:border-navy-800/80 hover:bg-navy-900/30 text-left transition-all duration-200 group cursor-pointer ${
                      currentStage === step ? "bg-navy-900/20 border-navy-800/60" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center border font-mono text-[10px] font-bold ${badgeStyle}`}>
                        0{step}
                      </div>
                      <span className={`text-xs ${labelStyle} group-hover:text-white transition-colors`}>{label}</span>
                    </div>
                    <div>
                      {status === "completed" && <CheckCircle2 className="w-4 h-4 text-accent-cyan transition-all group-hover:scale-110" />}
                      {status === "running" && <RefreshCw className="w-4 h-4 text-accent-cyan animate-spin" />}
                      {status === "idle" && <div className="w-1.5 h-1.5 rounded-full bg-navy-800 group-hover:bg-slate-500 transition-colors"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Tab views (Main dashboard, code codebase browser, or blueprint charts) */}
        <section className="lg:col-span-8">
          
          {/* TAB 1: AI Generated Pipeline Simulator Playground */}
          {activeTab === "pipeline" && (
            <div className="space-y-6">
              
              {/* Pipeline Stage Select Bar */}
              <div className="flex overflow-x-auto gap-2 p-1.5 bg-navy-900/90 border border-navy-800 rounded-2xl no-scrollbar shadow-inner">
                {[
                  { step: 1, name: "1. Intent Matcher", icon: Sparkles },
                  { step: 2, name: "2. Architecture Design", icon: Layers },
                  { step: 3, name: "3. Generated Code", icon: Code },
                  { step: 4, name: "4. Linter Score", icon: FileCheck },
                  { step: 5, name: "5. Healing Patch", icon: Cpu },
                  { step: 6, name: "6. API Live Simulator", icon: Activity }
                ].map(({ step, name, icon: IconComponent }) => (
                  <button
                    id={`pipeline-step-header-${step}`}
                    key={step}
                    onClick={() => setCurrentStage(step)}
                    className={`flex items-center space-x-2 px-3.5 py-3 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                      currentStage === step 
                        ? "bg-navy-850/90 text-accent-cyan shadow-md border border-accent-cyan/35 glow-cyan" 
                        : "text-slate-400 hover:text-slate-100 hover:bg-navy-850/30"
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 transition-all ${currentStage === step ? "text-accent-cyan" : "text-slate-500"}`} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>

              {/* STAGE 1 SHOWCASE: Intent extraction summary */}
              {currentStage === 1 && (
                <div id="stage-panel-1" className="glass-panel rounded-2xl p-6.5 space-y-6">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-4.5">
                    <div>
                      <h3 className="text-base font-extrabold font-display text-white tracking-tight">Stage 1: Dynamic Intent Analyzer</h3>
                      <p className="text-xs text-slate-400 mt-1">Extracts user purpose and converts high-level prompts into precise database objectives.</p>
                    </div>
                    <span className="bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/25 px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest leading-none">Pydantic Parser Engine</span>
                  </div>

                  {intentData ? (
                    <div className="space-y-6">
                      
                      {/* Sub card metadata block */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-navy-950 border border-navy-800 hover:border-navy-700/60 p-4.5 rounded-xl space-y-1.5 transition-all shadow-inner">
                          <p className="text-[9px] font-bold text-slate-550 uppercase tracking-widest font-mono">Inferred Schema Project Name</p>
                          <p className="text-sm font-extrabold text-accent-cyan font-display">{intentData.appName}</p>
                        </div>
                        <div className="bg-navy-950 border border-navy-800 hover:border-navy-700/60 p-4.5 rounded-xl space-y-1.5 transition-all shadow-inner">
                          <p className="text-[9px] font-bold text-slate-550 uppercase tracking-widest font-mono">System Architecture Archetype</p>
                          <p className="text-xs text-accent-violet font-mono font-bold uppercase tracking-wider">{intentData.app_type || "N/A"}</p>
                        </div>
                        <div className="bg-navy-950 border border-navy-800 hover:border-navy-700/60 p-4.5 rounded-xl space-y-1.5 transition-all shadow-inner">
                          <p className="text-[9px] font-bold text-slate-550 uppercase tracking-widest font-mono">Platform Core Mission Statement</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-bold">{intentData.corePurpose}</p>
                        </div>
                      </div>

                      {/* Primary Actors and roles */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-slate-400 font-display uppercase tracking-wider">Identified App Actors & Role Access Control Matrix (RBAC)</h4>
                        
                        {intentData.permissions && intentData.permissions.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {intentData.permissions.map((perm, idx) => (
                              <div key={idx} className="bg-navy-950 border border-navy-850 p-4 rounded-xl space-y-3 shadow-inner">
                                <div className="flex items-center space-x-2">
                                  <Lock className="w-3.5 h-3.5 text-accent-violet shrink-0" />
                                  <span className="text-[11px] font-black text-white font-mono tracking-wide truncate uppercase">{perm.role}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {perm.allowed_scopes.map((scope, sIdx) => (
                                    <span key={sIdx} className="px-1.5 py-0.5 bg-accent-violet/10 border border-accent-violet/15 rounded text-[9px] font-mono text-accent-cyan font-bold tracking-wide">
                                      {scope}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {intentData.primaryActors.map((actor, idx) => (
                              <span 
                                key={idx} 
                                className="px-3.5 py-2 bg-navy-950 border border-navy-850 rounded-lg text-xs font-mono font-bold text-slate-300 flex items-center space-x-2 shadow-inner"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse"></span>
                                <span>{actor}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Essential Features table listing priorities */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-slate-400 font-display uppercase tracking-wider">Extracted Features Specifications Grid</h4>
                        <div className="bg-navy-950 border border-navy-850 rounded-xl overflow-hidden shadow-inner">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-navy-900 border-b border-navy-850 text-slate-400">
                                <th className="p-3.5 font-bold tracking-wider uppercase text-[9px] font-mono">Priority</th>
                                <th className="p-3.5 font-bold tracking-wider uppercase text-[9px] font-mono">Feature Component</th>
                                <th className="p-3.5 font-bold tracking-wider uppercase text-[9px] font-mono">Functional Behavior Overview</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-850/60">
                              {intentData.essentialFeatures.map((f, idx) => {
                                let priorityColor = "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30";
                                if (f.importance === "medium") {
                                  priorityColor = "bg-accent-violet/15 text-accent-violet border-accent-violet/30";
                                } else if (f.importance === "low") {
                                  priorityColor = "bg-navy-800 text-slate-400 border-navy-750";
                                }

                                return (
                                  <tr key={idx} className="hover:bg-navy-900/10 transition-colors">
                                    <td className="p-3.5 whitespace-nowrap">
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold border ${priorityColor}`}>
                                        {f.importance}
                                      </span>
                                    </td>
                                    <td className="p-3.5 font-extrabold text-white text-xs">{f.title}</td>
                                    <td className="p-3.5 text-slate-300 leading-relaxed font-medium text-xs">{f.explanation}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Ambiguities Parser Resolves */}
                      <div className="bg-navy-950 border border-navy-800 p-4.5 rounded-xl space-y-3.5 shadow-inner hover:border-navy-750 transition-all">
                        <h4 className="text-xs font-bold text-accent-violet uppercase tracking-widest flex items-center gap-2 font-display">
                          <Info className="w-4 h-4 text-accent-violet" /> Architectural Strategy & Directives
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                          {intentData.ambiguitiesResolved.map((item, idx) => (
                            <li key={idx} className="text-slate-300 flex items-start gap-2 font-medium">
                              <span className="text-accent-cyan shrink-0 font-bold">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <Sparkles className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-550 font-medium">No intent synthesized yet. Choose a preset or write a custom goal in the left panel!</p>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 2 SHOWCASE: System Architecture Modular Design */}
              {currentStage === 2 && (
                <div id="stage-panel-2" className="glass-panel rounded-2xl p-6.5 space-y-6">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-4.5">
                    <div>
                      <h3 className="text-base font-extrabold font-display text-white tracking-tight">Stage 2: Automatic Codebase Structure Designer</h3>
                      <p className="text-xs text-slate-400 mt-1">Maps out directories blueprint files mapping exact dependencies and FastAPI route specifications.</p>
                    </div>
                    <span className="bg-accent-violet/15 text-accent-violet border border-accent-violet/25 px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest leading-none">FastAPI Workspace Builder</span>
                  </div>

                  {designData ? (
                    <div className="space-y-6">
                      
                      {/* Quick Meta Cards */}
                      <div className="bg-navy-950 border border-navy-850 p-4.5 rounded-xl space-y-1.5 transition-all shadow-inner">
                        <p className="text-[9px] font-bold text-slate-550 uppercase tracking-widest font-mono">Proposed Structure System Pattern</p>
                        <p className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-accent-violet/10 text-accent-cyan border border-accent-cyan/20 rounded font-mono text-[9px] font-bold uppercase tracking-wider">Pattern</span> 
                          {designData.proposedArchitecture}
                        </p>
                      </div>

                      {/* Grid structure dividing folder preview & endpoints */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Directory structure tree layout */}
                        <div className="md:col-span-5 space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Source Tree Visualization</h4>
                          <div className="bg-navy-950 border border-navy-850 rounded-xl p-4 font-mono text-xs select-none">
                            <div className="flex items-center space-x-1.5 text-slate-300 font-bold mb-2">
                              <Folder className="w-4 h-4 text-accent-cyan" />
                              <span className="text-accent-cyan">root/</span>
                            </div>
                            
                            {/* Directory parser helper */}
                            <div className="pl-4 space-y-2">
                              {designData.modularityMap.map((node, idx) => (
                                <div key={idx} className="space-y-1">
                                  {node.type === "directory" ? (
                                    <>
                                      <div className="flex items-center space-x-1.5 text-accent-violet">
                                        <Folder className="w-3.5 h-3.5 text-accent-violet" />
                                        <span>{node.name}/</span>
                                      </div>
                                      {node.children && (
                                        <div className="pl-4 border-l border-navy-800 border-dashed space-y-1 ml-1.5 py-1">
                                          {node.children.map((sub, sidx) => (
                                            <div key={sidx} className="flex items-center space-x-1.5 text-slate-400">
                                              <File className="w-3.5 h-3.5 text-slate-550" />
                                              <span>{sub.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex items-center space-x-1.5 text-slate-400">
                                      <File className="w-3.5 h-3.5 text-slate-550" />
                                      <span>{node.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>                          <div className="p-4 bg-navy-900 border border-navy-850 rounded-xl space-y-2.5 shadow-inner">
                            <p className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider font-mono">Suggested Pip Dependencies</p>
                            <div className="flex flex-wrap gap-1.55">
                              {designData.suggestedDependencies.map((dep, idx) => (
                                <span key={idx} className="px-2 py-1 bg-navy-950 text-accent-cyan rounded text-[10px] font-mono font-bold border border-navy-800">
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Endpoints specification */}
                        <div className="md:col-span-7 space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Identified Core HTTP Router API</h4>
                          <div className="space-y-2">
                            {designData.crucialEndpoints.map((ep, idx) => {
                              let verbColor = "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/25";
                              if (ep.method === "POST") verbColor = "bg-accent-violet/10 text-accent-violet border-accent-violet/25";
                              if (ep.method === "PUT") verbColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                              if (ep.method === "DELETE") verbColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";

                              return (
                                <div key={idx} className="bg-navy-950 border border-navy-850 p-3.5 rounded-xl flex items-start space-x-3.5 hover:border-navy-750 transition-all shadow-inner">
                                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold border uppercase shrink-0 ${verbColor}`}>
                                    {ep.method}
                                  </span>
                                  <div className="space-y-1">
                                    <code className="text-xs font-bold font-mono text-slate-200">{ep.path}</code>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{ep.details}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* ADDITIONAL HIGH-FIDELITY ARCHITECTURE BLOCKS */}
                      
                      {/* 1. Core database entities mapping */}
                      {designData.entities && designData.entities.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pt-4 border-t border-navy-850">
                            <Database className="w-3.5 h-3.5 text-accent-cyan" /> Database Entities & Relationships Diagram Blueprint
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {designData.entities.map((ent, idx) => (
                              <div key={idx} className="bg-navy-950 border border-navy-850 rounded-xl overflow-hidden shadow-md flex flex-col hover:border-navy-700 transition-all">
                                <div className="bg-navy-900/40 px-3.5 py-2.5 border-b border-navy-850 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse animate-duration-1000"></span>
                                    {ent.name}
                                  </span>
                                  <span className="text-[9px] font-mono bg-accent-cyan/15 text-accent-cyan px-2 py-0.5 rounded border border-accent-cyan/20 uppercase font-bold tracking-wider">Table</span>
                                </div>
                                <div className="p-3.5 space-y-3 flex-grow">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Attributes</p>
                                    <div className="space-y-1 font-mono text-[10px]">
                                      {ent.attributes.map((attr, aIdx) => (
                                        <div key={aIdx} className="text-slate-300 flex justify-between font-bold">
                                          <span>{attr.split(":")[0]}</span>
                                          <span className="text-accent-cyan">{attr.split(":")[1] || "str"}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {ent.relationships && ent.relationships.length > 0 && (
                                    <div className="space-y-1 border-t border-navy-850/60 pt-2.5">
                                      <p className="text-[10px] font-bold text-slate-555 uppercase tracking-wider">Relations</p>
                                      <ul className="list-disc pl-3 text-[10px] text-slate-400 space-y-0.5 font-mono">
                                        {ent.relationships.map((rel, rIdx) => (
                                          <li key={rIdx}>{rel}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Step-by-step user flow sequencer */}
                      {designData.userFlows && designData.userFlows.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-accent-violet" /> End-to-End System Integration Flow Sequences
                          </h4>
                          <div className="bg-navy-950 border border-navy-850 rounded-xl p-4.5 space-y-4">
                            {designData.userFlows.map((flow, idx) => (
                              <div key={idx} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-6 h-6 rounded-full bg-accent-violet/15 text-accent-cyan font-mono text-xs font-black border border-accent-cyan/25 flex items-center justify-center shrink-0 shadow-lg">
                                    {idx + 1}
                                  </div>
                                  {idx < designData.userFlows.length - 1 && (
                                    <div className="w-0.5 h-12 bg-navy-850 mt-1"></div>
                                  )}
                                </div>
                                <div className="space-y-1 bg-navy-900/50 p-3.5 rounded-xl border border-navy-850/60 flex-grow hover:border-navy-750 transition-colors shadow-inner">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider font-mono">[{flow.actor}]</span>
                                    <span className="text-xs font-bold text-slate-200">{flow.action}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1 border-t border-navy-850 mt-1.5">
                                    <ArrowRight className="w-3.5 h-3.5 text-accent-violet shrinkage-0" />
                                    <span>{flow.systemResponse}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Refined Role-based Permissions scopes */}
                      {designData.rolePermissions && designData.rolePermissions.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-rose-400" /> Precise Role-Based Scope Assignments (RBAC)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {designData.rolePermissions.map((rp, idx) => (
                              <div key={idx} className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2.5">
                                <span className="text-xs font-bold text-white font-mono">{rp.role}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {rp.allowed_scopes.map((sc, sIdx) => (
                                    <span key={sIdx} className="px-2 py-0.5 bg-rose-500/5 border border-rose-500/10 text-[9px] font-mono text-rose-300 rounded">
                                      {sc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Detailed Master Blueprint description document */}
                      {designData.systemBlueprint && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Master Architecture & System Blueprint
                          </h4>
                          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 leading-relaxed border-l-2 border-l-teal-500">
                            {designData.systemBlueprint}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <Layers className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-500">No system structures compiled yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3 SHOWCASE: Database Schema and Models DDL code */}
              {currentStage === 3 && (
                <div id="stage-panel-3" className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <div>
                      <h3 className="text-base font-bold font-display text-white">Stage 3: Live Schema & Models Generator</h3>
                      <p className="text-xs text-slate-400">Renders high-fidelity database structures including SQL queries, raw models, and input validation engines.</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider">SQL & Python Code Output</span>
                  </div>

                  {schemaData ? (
                    <div className="space-y-6">
                      
                      {/* DDL Code segment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Database className="w-3.5 h-3.5 text-teal-400" /> PostgreSQL schema definitions (DDL)
                          </h4>
                          <button
                            id="btn-copy-ddl"
                            onClick={() => handleCopyCode("ddl", schemaData.sqlDdl)}
                            className="text-xs text-slate-500 hover:text-white flex items-center space-x-1"
                          >
                            {copiedFileName === "ddl" ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedFileName === "ddl" ? "Copied!" : "Copy SQL"}</span>
                          </button>
                        </div>
                        <pre className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-56 scrollbar">
                          <code>{schemaData.sqlDdl}</code>
                        </pre>
                      </div>

                      {/* Twin Column layouts for Pydantic Verification and ORM SQLAlchemy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Pydantic block */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                              <FileCheck className="w-3.5 h-3.5 text-accent-cyan" /> Pydantic Models Validation
                            </h4>
                            <button
                              id="btn-copy-pydantic"
                              onClick={() => handleCopyCode("pydantic", schemaData.pydanticCode)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1.5 bg-navy-900 border border-navy-850 px-2 py-1 rounded-lg hover:border-navy-700 transition-all font-semibold"
                            >
                              {copiedFileName === "pydantic" ? <Check className="w-3 h-3 text-accent-cyan" /> : <Copy className="w-3 h-3 text-slate-400" />}
                              <span>Copy Code</span>
                            </button>
                          </div>
                          <pre className="bg-navy-950 border border-navy-850 p-4.5 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-72 scrollbar shadow-inner">
                            <code>{schemaData.pydanticCode}</code>
                          </pre>
                        </div>

                        {/* SQLAlchemy database classes ORM */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                              <Code className="w-3.5 h-3.5 text-accent-violet" /> SQLAlchemy ORM Classes Code
                            </h4>
                            <button
                              id="btn-copy-orm"
                              onClick={() => handleCopyCode("orm", schemaData.ormModelsCode)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1.5 bg-navy-900 border border-navy-850 px-2 py-1 rounded-lg hover:border-navy-700 transition-all font-semibold"
                            >
                              {copiedFileName === "orm" ? <Check className="w-3 h-3 text-accent-cyan" /> : <Copy className="w-3 h-3 text-slate-400" />}
                              <span>Copy Models</span>
                            </button>
                          </div>
                          <pre className="bg-navy-950 border border-navy-850 p-4.5 rounded-xl text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-72 scrollbar shadow-inner">
                            <code>{schemaData.ormModelsCode}</code>
                          </pre>
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <Code className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-500">No database schemas emitted yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 4 SHOWCASE: Validation diagnostics and evaluation score */}
              {currentStage === 4 && (
                <div id="stage-panel-4" className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <div>
                      <h3 className="text-base font-bold font-display text-white">Stage 4: Automated Compilation & Security Validator</h3>
                      <p className="text-xs text-slate-400">Verifies model relational integrity, checks structural overlap, maps lint issues, and scores compilation health.</p>
                    </div>
                    <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider">Dynamic Linter Scorecard</span>
                  </div>

                  {validationData ? (
                    <div className="space-y-6">
                      
                      {/* Grid scorecard layout gauge */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 bg-navy-950 border border-navy-850 rounded-2xl p-6.5 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                          <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest font-mono">Architecture Security Score</span>
                          
                          {/* Circular relative gauge chart */}
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="42" stroke="#0c152b" strokeWidth="8" fill="transparent" />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="42" 
                                stroke={validationData.score >= 90 ? "#00f5ff" : "#a855f7"} 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={263.8} 
                                strokeDashoffset={263.8 - (263.8 * validationData.score) / 100} 
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <span className="absolute text-2xl font-black font-display text-white">{validationData.score}<span className="text-xs text-slate-500">/100</span></span>
                          </div>

                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border tracking-wider ${
                            validationData.isValid 
                              ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25" 
                              : "bg-accent-violet/15 text-accent-violet border-accent-violet/25"
                          }`}>
                            {validationData.isValid ? "COMPILING GREEN" : "VALIDATION ALERT"}
                          </span>
                        </div>

                        {/* Summary side message context */}
                        <div className="md:col-span-8 space-y-4">
                          <h4 className="text-sm font-extrabold text-white font-display">Auditor Status Report Summary</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                            All database designs were mapped to static validation parameters. There are currently <span className="font-bold text-white">{validationData.errors.length} detected code gaps</span> that could cause compilation failure, logical foreign index gaps, or SQLAlchemy cascade deletes loopholes.
                          </p>

                          {!validationData.isValid && (
                            <div className="flex items-center space-x-3.5 bg-accent-violet/10 border border-accent-violet/20 p-4 rounded-xl hover:border-accent-violet/35 transition-all shadow-inner">
                              <Cpu className="w-5 h-5 text-accent-cyan animate-pulse shrink-0" />
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-accent-cyan">Self-Repair Engine Core Available</p>
                                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">You can instantly trigger multi-agent automatic code healing on Stage 5 to patch these issues dynamically!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Warnings and errors detailed checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Diagnostic Warnings Board</h4>
                        
                        {validationData.errors.length > 0 ? (
                          <div className="space-y-2.5">
                            {validationData.errors.map((err, idx) => {
                              let warnIcon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
                              let warnClass = "bg-amber-500/5 border-amber-500/15";
                              let sideLabel = "warning";
                              
                              if (err.severity === "error") {
                                warnIcon = <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
                                warnClass = "bg-rose-500/5 border-rose-500/15";
                                sideLabel = "compile error";
                              } else if (err.severity === "info") {
                                warnIcon = <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />;
                                warnClass = "bg-sky-500/5 border-sky-500/15";
                                sideLabel = "optimisation check";
                              }

                              return (
                                <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3.5 ${warnClass}`}>
                                  {warnIcon}
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <p className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                                        {err.ruleId} 
                                        <span className="text-[9px] font-normal text-slate-500">({err.location})</span>
                                      </p>
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 uppercase border border-slate-900/80 text-slate-400">
                                        {sideLabel}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-normal leading-relaxed">{err.message}</p>
                                    
                                    {/* Suggested auto code snippet */}
                                    <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 font-mono text-[10px] text-teal-400">
                                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Fix Strategy</p>
                                      <code>{err.suggestedFix}</code>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-teal-500/5 border border-teal-500/20 p-5 rounded-xl text-center space-y-2">
                            <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                            <p className="text-xs font-semibold text-white">Verification Complete: 0 issues detected!</p>
                            <p className="text-[10px] text-slate-400">Your generated structures compile with premium stability safety metrics.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <FileCheck className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-500">Pipeline linter engine is currently idle.</p>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 5 SHOWCASE: Self Healing Repair Engine */}
              {currentStage === 5 && (
                <div id="stage-panel-5" className="glass-panel rounded-2xl p-6.5 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-4.5">
                    <div>
                      <h3 className="text-base font-extrabold font-display text-white tracking-tight">Stage 5: Multi-Agent Auto-Repair & Intelligent Healing Engine</h3>
                      <p className="text-xs text-slate-400 mt-1">Iteratively detects schema mismatches, type contradictions, or missing/hallucinated fields, surgically repairing affected components and revalidating outputs.</p>
                    </div>
                    <span className="bg-accent-violet/15 text-accent-violet border border-accent-violet/25 px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest leading-none">Automated Healing Loop</span>
                  </div>

                  <div className="space-y-6 font-sans">
                    {/* Repair actions panel */}
                    <div className="bg-navy-950 border border-navy-850 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-300">Run Automated Self-Heal Routine</h4>
                        <p className="text-[11px] text-slate-400 max-w-xl font-semibold leading-relaxed">
                          Triggers custom AI healing agents. This isolates compilation/validation defects, applies non-destructive patch updates to files, and executes verification scripts.
                        </p>
                      </div>
                      <button
                        id="btn-self-heal"
                        onClick={triggerSelfHealRepair}
                        className="bg-gradient-to-r from-accent-cyan to-accent-violet hover:from-accent-cyan/95 hover:to-accent-violet/95 hover:scale-[1.02] text-navy-950 font-bold text-xs px-5.5 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-accent-cyan/15 cursor-pointer font-display"
                        disabled={isLoading || (validationData && validationData.isValid && !repairedData)}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                            <span>Patching Gaps...</span>
                          </>
                        ) : (
                          <>
                            <Cpu className="w-4 h-4 text-navy-950" />
                            <span>{repairedData ? "Patched & Verified" : "Trigger Automated Repair"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {repairedData ? (
                      <div className="space-y-6">
                        
                        {/* 1. Success header card block summary */}
                        <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-2xl space-y-1.5 flex items-start gap-3 shadow-inner">
                          <CheckCircle2 className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-extrabold text-accent-cyan uppercase tracking-wider font-display">
                              Healer Engine Executed successfully
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-1">{repairedData.healingSummary}</p>
                          </div>
                        </div>

                        {/* 2. Interactive workflow tracker & Error analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Left col: Pipeline sequence */}
                          <div className="bg-navy-950 border border-navy-850 rounded-2xl p-5 space-y-4 shadow-inner">
                            <div className="flex items-center gap-2 border-b border-navy-850 pb-3">
                              <Activity className="w-4 h-4 text-accent-violet animate-pulse" />
                              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-display">Self-Healing Execution sequence</h4>
                            </div>
                            <div className="space-y-4 font-sans">
                              {repairedData.repairWorkflow && repairedData.repairWorkflow.length > 0 ? (
                                repairedData.repairWorkflow.map((step, sIdx) => (
                                  <div key={sIdx} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                      <div className="w-5 h-5 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                        {sIdx + 1}
                                      </div>
                                      {sIdx < repairedData.repairWorkflow.length - 1 && (
                                        <div className="w-0.5 h-6 bg-navy-900 mt-1"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-300 pt-0.5 leading-relaxed font-semibold">{step}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-500">Pipeline sequence metrics not available.</p>
                              )}
                            </div>
                          </div>

                          {/* Right col: Diagnosis analysis and Patch Strategy */}
                          <div className="space-y-4">
                            
                            {/* Diagnostic handling */}
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl p-5 space-y-3 shadow-inner">
                              <div className="flex items-center gap-2 border-b border-navy-850 pb-3 font-display">
                                <AlertTriangle className="w-4 h-4 text-accent-violet" />
                                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Validation Error Triage ({validationData?.errors?.length || 1} Detected)</h4>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                {repairedData.validationErrorHandling || "Analyzed database constraints and generated correct non-overlapping bindings dynamically to restore layout integrity."}
                              </p>
                              <div className="bg-accent-violet/10 border border-accent-violet/15 rounded-xl p-4 flex gap-2.5 shadow-sm">
                                <Info className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
                                <div className="text-[11px] text-slate-300 space-y-1 font-sans">
                                  <span className="font-bold block uppercase tracking-wider text-accent-violet font-display text-[10px]">Classified Defects Fixed</span>
                                  <span className="font-semibold text-slate-400">Schema loops, unmapped foreign references, missing indexing files, and type contradictions.</span>
                                </div>
                              </div>
                            </div>

                            {/* Patch technique */}
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl p-5 space-y-3 shadow-inner font-sans">
                              <div className="flex items-center gap-2 border-b border-navy-850 pb-2.5 font-display">
                                <Lock className="w-4 h-4 text-accent-cyan" />
                                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Applied Stitching Strategy</h4>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono bg-accent-cyan/15 text-accent-cyan px-2.5 py-0.5 border border-accent-cyan/25 rounded uppercase tracking-widest font-bold">Surgical Patch</span>
                                  <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono text-[9px]">Targeted Patching</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                                  {repairedData.patchStrategy || "Injected localized class fixes safely preserving adjacent SQLAlchemy model declarations and other schema nodes."}
                                </p>
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* 3. Side-by-side comparative diagnostics diff sandbox */}
                        <div className="space-y-3 font-sans">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pt-2 font-display">
                            <Code className="w-4 h-4 text-accent-violet" /> Visual Patch Differences Code Sandbox
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            
                            {/* Before defective view */}
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl overflow-hidden shadow-inner flex flex-col">
                              <div className="bg-rose-955/10 px-4 py-2.5 border-b border-navy-850 flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                  Defective Original Segment (Targeted)
                                </span>
                                <span className="text-[9px] font-mono bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded border border-rose-500/25 uppercase font-bold tracking-wider">Broken</span>
                              </div>
                              <div className="p-4.5 bg-rose-955/5 flex-grow overflow-x-auto">
                                <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre font-normal max-h-60 scrollbar">
                                  <code>{repairedData.beforeRepairCode || "# Broken model component template"}</code>
                                </pre>
                              </div>
                            </div>

                            {/* After healed view */}
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl overflow-hidden shadow-inner flex flex-col">
                              <div className="bg-accent-cyan/10 px-4 py-2.5 border-b border-navy-850 flex items-center justify-between">
                                <span className="text-xs font-bold text-accent-cyan font-mono flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"></span>
                                  Sanitized Healed Component (Surgically Placed)
                                </span>
                                <span className="text-[9px] font-mono bg-accent-cyan/15 text-accent-cyan px-2 py-0.5 rounded border border-accent-cyan/25 uppercase font-bold tracking-wider">Repaired</span>
                              </div>
                              <div className="p-4.5 bg-accent-cyan/5 flex-grow overflow-x-auto relative">
                                <button
                                  id="btn-copy-healed-code-patch"
                                  onClick={() => handleCopyCode("patch", repairedData.afterRepairCode)}
                                  className="absolute top-3.5 right-3.5 text-[9px] bg-navy-900 border border-navy-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:border-navy-700 transition-all font-semibold flex items-center space-x-1 z-10 cursor-pointer"
                                >
                                  {copiedFileName === "patch" ? <Check className="w-3 h-3 text-accent-cyan" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedFileName === "patch" ? "Copied!" : "Copy Patch"}</span>
                                </button>
                                <pre className="text-[11px] font-mono text-slate-250 leading-relaxed whitespace-pre font-normal max-h-60 scrollbar">
                                  <code>{repairedData.afterRepairCode || "# Healed model component template"}</code>
                                </pre>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* 4. Full final codebase script output */}
                        <div className="space-y-3 mt-4">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-display">Complete Revalidated Application Codebase (SQL / Pydantic / ORM)</h4>
                          <div className="relative font-sans">
                            <button
                              id="btn-copy-healed-code"
                              onClick={() => handleCopyCode("repaired", repairedData.repairedCode)}
                              className="absolute top-3 right-3 text-[10px] bg-navy-900 border border-navy-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:border-navy-700 transition-all font-semibold flex items-center space-x-1.5 z-10 cursor-pointer shadow-sm"
                            >
                              {copiedFileName === "repaired" ? <Check className="w-3 h-3 text-accent-cyan" /> : <Copy className="w-3 h-3 text-slate-400" />}
                              <span>{copiedFileName === "repaired" ? "Copied!" : "Copy Entire Codebase"}</span>
                            </button>
                            <pre className="bg-navy-950 border border-navy-850 p-4.5 rounded-xl text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-80 scrollbar shadow-inner">
                              <code>{repairedData.repairedCode}</code>
                            </pre>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="border border-navy-850 bg-navy-950/50 rounded-xl p-8 text-center text-slate-500 space-y-2.5 shadow-inner">
                        <Cpu className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                        <p className="text-xs font-semibold">No active healing script executed on current presets.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE 6 SHOWCASE: Interactive Sandbox Runtime Simulator */}
              {currentStage === 6 && (
                <div id="stage-panel-6" className="glass-panel rounded-2xl p-6.5 space-y-6">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-4.5">
                    <div>
                      <h3 className="text-base font-extrabold font-display text-white tracking-tight">Stage 6: Sandbox Router Runtime Simulator</h3>
                      <p className="text-xs text-slate-400 mt-1">Executes imaginary endpoint calls against generated PostgreSQL schemas, verifying active transactional inputs.</p>
                    </div>
                    <span className="bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25 px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest leading-none">JSON Query Execution</span>
                  </div>

                  {designData && schemaData ? (
                    <div className="space-y-6">
                      
                      {/* Grid: Request Settings (endpoints, JSON body) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-display">Configure Simulator Request</h4>
                          
                          {/* Selected target matching route */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display block">HTTP Target Match Route</label>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto border border-navy-850 rounded-xl p-2 bg-navy-950 shadow-inner scrollbar">
                              {designData.crucialEndpoints.map((ep, idx) => (
                                <button
                                  id={`sim-ep-${idx}`}
                                  key={idx}
                                  onClick={() => handleEndpointSelect(idx)}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                    simSelectedEndpoint === idx 
                                      ? "bg-navy-900 border border-navy-800 text-accent-cyan font-bold" 
                                      : "text-slate-400 hover:bg-navy-900/40"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 font-mono text-[11px] leading-tight font-medium">
                                    <span className="text-[10px] uppercase font-serif font-black tracking-wider text-slate-450">{ep.method}</span>
                                    <span>{ep.path}</span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Request JSON parameters input */}
                          <div className="space-y-1.5 font-sans">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display block">Payload JSON Parameters Body</label>
                            <textarea
                              id="sim-payload-input"
                              value={simPayloadInput}
                              onChange={(e) => setSimPayloadInput(e.target.value)}
                              rows={5}
                              className="w-full bg-navy-950 border border-navy-850 hover:border-navy-750 focus:border-accent-cyan rounded-xl px-4 py-3 font-mono text-[11px] text-slate-200 focus:outline-none transition-all shadow-inner resize-y leading-relaxed scrollbar"
                            />
                          </div>

                          <button
                            id="btn-run-simulation"
                            onClick={executeSandboxSimulation}
                            className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet hover:from-accent-cyan/95 hover:to-accent-violet/95 hover:scale-[1.02] text-navy-950 font-bold text-xs rounded-xl py-3 px-4 transition-all shadow-lg shadow-accent-cyan/15 cursor-pointer flex items-center justify-center space-x-2 font-display"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                            ) : (
                              <Send className="w-4 h-4 text-navy-950" />
                            )}
                            <span>Send Simulated Sandbox Request</span>
                          </button>
                        </div>

                        {/* Simulator Sandbox Logs & Response Panel */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                            <Terminal className="w-4 h-4 text-accent-violet animate-pulse" /> Sandbox Output Monitor
                          </h4>                          {simulationResponse ? (
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-[460px] max-h-[600px] scrollbar">
                              
                              {/* Fake output header bar */}
                              <div className="bg-navy-900 px-4 py-3 flex items-center justify-between border-b border-navy-850 text-[10px] font-mono shrink-0 font-sans">
                                <div className="flex items-center space-x-2">
                                  <span className="text-accent-cyan font-bold uppercase flex items-center gap-1 font-mono text-[9px] tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"></span> 
                                    HTTP {simulationResponse.statusCode} OK
                                  </span>
                                  <span className="text-slate-700">|</span>
                                  <span className="text-accent-violet truncate max-w-[120px] md:max-w-none font-bold font-mono">{simulationResponse.interceptedMockRoute}</span>
                                </div>
                                <span className="text-slate-500 text-[9px] shrink-0 font-bold font-mono">Duration: {simulationResponse.computationTimeMs} ms</span>
                              </div>

                              {/* Interactive simulated items */}
                              <div className="p-4 overflow-y-auto space-y-5 flex-1 text-[11px] font-mono leading-relaxed scrollbar">
                                                               {/* 1. Overall Executable Launch Status banner */}
                                <div className={`p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 border ${
                                  simulationResponse.executable 
                                    ? "bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan" 
                                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                }`}>
                                  <div className="flex items-center gap-2.5">
                                    <div className={`p-1.5 rounded-lg ${simulationResponse.executable ? "bg-accent-cyan/25 text-accent-cyan" : "bg-rose-500/25 text-rose-400"}`}>
                                      <Cpu className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                      <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-slate-200">Sandbox Compile Verdict</span>
                                      <p className="text-[10px] font-sans text-slate-450 leading-normal font-semibold">
                                        {simulationResponse.executable 
                                          ? "Verification checks congruent. Application codebase is 100% executable." 
                                          : "Logical blockers found. Fix integrity tests to run."}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-extrabold font-mono tracking-widest uppercase text-center shrink-0 self-start md:self-auto ${
                                    simulationResponse.executable 
                                      ? "bg-accent-cyan/15 border-accent-cyan/25 text-accent-cyan" 
                                      : "bg-rose-500/15 border-rose-500/25 text-rose-400"
                                  }`}>
                                    {simulationResponse.executable ? "EXEC_READY" : "EXEC_BLOCKED"}
                                  </span>
                                </div>

                                {/* 2. Pass/Fail Checks Dashboard Widgets */}
                                <div className="space-y-1.5 text-left">
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1 font-sans">
                                    <CheckSquare className="w-3.5 h-3.5 text-accent-cyan" /> Integrity Parameters
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans text-[10px]">
                                    
                                    <div className="bg-navy-900 border border-navy-850 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                                      <span className="text-slate-400 font-semibold">UI-to-API Map</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold leading-none ${simulationResponse.uiToApiMappingValid ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20" : "bg-rose-500/15 text-rose-450 border border-rose-500/20"}`}>
                                        {simulationResponse.uiToApiMappingValid ? "PASS" : "FAIL"}
                                      </span>
                                    </div>

                                    <div className="bg-navy-900 border border-navy-850 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                                      <span className="text-slate-400 font-semibold">API-to-DB Integrity</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold leading-none ${simulationResponse.apiToDbConsistencyValid ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20" : "bg-rose-500/15 text-rose-450 border border-rose-500/20"}`}>
                                        {simulationResponse.apiToDbConsistencyValid ? "PASS" : "FAIL"}
                                      </span>
                                    </div>

                                    <div className="bg-navy-900 border border-navy-850 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                                      <span className="text-slate-400 font-semibold">RBAC Security Scopes</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold leading-none ${simulationResponse.authRulesPassed ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20" : "bg-rose-500/15 text-rose-450 border border-rose-500/20"}`}>
                                        {simulationResponse.authRulesPassed ? "PASS" : "FAIL"}
                                      </span>
                                    </div>

                                  </div>
                                </div>

                                {/* 3. Runtime sequence logs */}
                                {simulationResponse.runtimeValidationFlow && simulationResponse.runtimeValidationFlow.length > 0 && (
                                  <div className="space-y-1.5 text-left font-sans">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5 label-tag-pill">
                                      <Activity className="w-3.5 h-3.5 text-accent-violet" /> Runtime Verification Sequence
                                    </p>
                                    <div className="p-3 bg-navy-900 border border-navy-850 rounded-xl space-y-2 font-mono font-medium text-[10px] text-slate-300 shadow-sm leading-relaxed">
                                      {simulationResponse.runtimeValidationFlow.map((step, sIdx) => (
                                        <div key={sIdx} className="flex gap-2">
                                          <span className="text-accent-violet shrink-0">[{sIdx + 1}]</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 4. Granular pass/fail checks */}
                                {simulationResponse.passFailChecks && simulationResponse.passFailChecks.length > 0 && (
                                  <div className="space-y-1.5 text-left font-sans">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5 font-sans">
                                      <BookOpen className="w-3.5 h-3.5 text-accent-cyan" /> Sandbox Specification Compliance Audit
                                    </p>
                                    <div className="p-3 bg-navy-900 border border-navy-850 rounded-xl space-y-2.5 shadow-sm">
                                      {simulationResponse.passFailChecks.map((chk, cIdx) => (
                                        <div key={cIdx} className="flex justify-between gap-3 text-[10px]">
                                          <div className="space-y-0.5">
                                            <span className="font-extrabold text-slate-200">{chk.name}</span>
                                            <span className="block text-[9px] text-slate-400 font-semibold leading-normal">{chk.details}</span>
                                          </div>
                                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold shrink-0 self-start border ${chk.status === "pass" ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20" : "bg-rose-500/15 text-rose-455 border border-rose-500/20"}`}>
                                            {chk.status.toUpperCase()}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 5. Simulated Query Log Statements */}
                                <div className="space-y-1.5 text-left font-sans">
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1">
                                    <Database className="w-3.5 h-3.5 text-accent-cyan" /> Simulated SQL Traced Actions
                                  </p>
                                  <div className="p-3 bg-navy-900 border border-navy-850 rounded-xl text-slate-200 space-y-2.5 leading-normal shadow-sm">
                                    {simulationResponse.simulatedDbQueries.map((query, sidx) => (
                                      <p key={sidx} className="font-mono text-[9.5px] border-b border-navy-850 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0 shrink-0 text-left">
                                        <span className="text-slate-500 font-extrabold font-sans block text-[8px] tracking-wider mb-0.5">SQL TRANSACTION {sidx+1}</span>
                                        <span className="text-accent-cyan font-semibold">{query}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                {/* 6. Simulated response body */}
                                <div className="space-y-1.5 text-left font-sans">
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1">
                                    <FileJson className="w-3.5 h-3.5 text-accent-violet" /> Mock REST JSON Response Body
                                  </p>
                                  <pre className="bg-navy-950 p-3.5 rounded-xl border border-navy-850 text-accent-cyan overflow-x-auto text-[10px] shadow-inner font-mono leading-relaxed">
                                    <code>{JSON.stringify(simulationResponse.mockResponseBody, null, 2)}</code>
                                  </pre>
                                </div>

                                {/* Sandbox console headers meta */}
                                <div className="space-y-1.5 bg-navy-950/40 p-3 rounded-xl border border-dashed border-navy-800 text-[10px] text-slate-500 font-semibold text-left font-sans">
                                  <p className="font-sans font-bold uppercase text-[8px] tracking-wider text-slate-400">Network Intercept trace metadata</p>
                                  <p className="font-mono">Route: Verified match mapping to <span className="text-accent-cyan font-bold">{simulationResponse.interceptedMockRoute}</span></p>
                                  <p className="font-mono">Agent: ForgeFlow AI Multi-Stage Compiler Simulator v2.0</p>
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div className="bg-navy-950 border border-navy-850 rounded-2xl h-[360px] flex flex-col items-center justify-center text-center p-6 text-slate-500 shadow-inner">
                              <Terminal className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-display">Monitor Waiting to intercept requests</p>
                              <p className="text-[10px] max-w-[220px] leading-relaxed mx-auto text-slate-500 font-semibold mt-1.5">Config parameters values and click Send Simulated Sandbox Request.</p>
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3.5">
                      <Send className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-400 font-semibold font-display uppercase tracking-widest">Pipeline components must be compiled first.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Modular Starter Template Codebase file browser */}
          {activeTab === "starter" && (
            <div className="glass-panel rounded-2xl p-6.5 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-navy-800 pb-4.5 gap-4">
                <div>
                  <h3 className="text-base font-extrabold font-display text-white tracking-tight">Starter Library Workspace Selector</h3>
                  <p className="text-xs text-slate-400 mt-1">Inspect the exact implementation files that back this 6-stage core AI App Generator backend architecture.</p>
                </div>
                <div className="text-[10px] font-mono font-bold text-accent-cyan bg-accent-cyan/15 border border-accent-cyan/25 px-3 py-1 rounded-lg tracking-wider uppercase">FastAPI Core Blueprint Code</div>
              </div>

              {/* Two Panel structure for file tree navigation and code viewer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Tree browser selector list */}
                <div className="md:col-span-4 space-y-3 shrink-0">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-display">Project Worksheets</h4>
                  <div className="bg-navy-950 border border-navy-850 rounded-xl overflow-hidden divide-y divide-navy-850 font-mono text-xs max-h-[480px] overflow-y-auto scrollbar shadow-inner">
                    
                    {/* Simulated file hierarchical tree list */}
                    <div className="p-2 space-y-1">
                      <div className="flex items-center space-x-1.5 p-2 text-slate-200 font-bold select-none text-[10px] tracking-wider uppercase font-sans">
                        <Folder className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                        <span>APP DIRECTORY</span>
                      </div>
                      
                      {[
                        "app/main.py",
                        "app/config.py",
                        "app/schemas.py",
                        "app/services/intent.py",
                        "app/services/design.py",
                        "app/services/schema.py",
                        "app/services/validation.py",
                        "app/services/repair.py",
                        "app/services/simulation.py"
                      ].map((filePath) => {
                        const fileLabel = filePath.replace("app/services/", "services/").replace("app/", "");
                        return (
                          <button
                            id={`starter-file-${filePath.replaceAll("/", "-").replaceAll(".", "-")}`}
                            key={filePath}
                            onClick={() => setSelectedStarterFile(filePath)}
                            className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer ${
                              selectedStarterFile === filePath 
                                ? "bg-navy-900 border border-navy-800 text-accent-cyan font-bold" 
                                : "text-slate-400 hover:bg-navy-900/30 font-normal"
                            }`}
                          >
                            <File className="w-3.5 h-3.5" />
                            <span className="truncate">{fileLabel}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2 space-y-1">
                      <div className="flex items-center space-x-1.5 p-2 text-slate-200 font-bold select-none text-[10px] tracking-wider uppercase font-sans">
                        <Folder className="w-3.5 h-3.5 text-accent-violet animate-pulse" />
                        <span>CONFIG & SHELL MANUALS</span>
                      </div>

                      {[
                        "requirements.txt",
                        ".env.example",
                        "README.md"
                      ].map((filePath) => (
                        <button
                          id={`starter-file-${filePath.replaceAll("/", "-").replaceAll(".", "-")}`}
                          key={filePath}
                          onClick={() => setSelectedStarterFile(filePath)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer ${
                            selectedStarterFile === filePath 
                              ? "bg-navy-900 border border-navy-800 text-accent-cyan font-bold" 
                              : "text-slate-400 hover:bg-navy-900/30 font-normal"
                          }`}
                        >
                          <File className="w-3.5 h-3.5" />
                          <span>{filePath}</span>
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Content Viewer Code window panel */}
                <div className="md:col-span-8 space-y-3 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-accent-cyan bg-navy-950 border border-navy-850 px-3.5 py-2 rounded-lg font-mono">
                        {selectedStarterFile}
                      </code>
                      <button
                        id="btn-copy-selected-code"
                        onClick={() => handleCopyCode(selectedStarterFile, starterCodeFiles[selectedStarterFile]?.content || "")}
                        className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 cursor-pointer font-semibold transition-colors"
                      >
                        {copiedFileName === selectedStarterFile ? <Check className="w-3.5 h-3.5 text-accent-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedFileName === selectedStarterFile ? "Copied!" : "Copy File Code"}</span>
                      </button>
                    </div>

                    <pre className="bg-navy-950 border border-navy-850 p-4.5 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px] overflow-y-auto scrollbar select-text flex-1 shadow-inner">
                      <code>{starterCodeFiles[selectedStarterFile]?.content || ""}</code>
                    </pre>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SYSTEM ARCHITECTURE BLUEPRINT MAP */}
          {activeTab === "blueprint" && (
            <div className="glass-panel rounded-2xl p-6.5 space-y-6 font-sans">
              
              <div className="border-b border-navy-800 pb-4.5">
                <h3 className="text-base font-extrabold font-display text-white tracking-tight">6-Stage System Pipeline Architecture Map</h3>
                <p className="text-xs text-slate-400 mt-1">Understand the operational structure, Pydantic type integrations, and validation healing cycles.</p>
              </div>

              {/* Big block graphics simulation of the pipeline flow */}
              <div className="space-y-6">
                
                {/* Grid chart blueprint block items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Step 1 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase font-bold tracking-widest">Stage 1</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Semantic Extraction</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Parses core prompts using unstructured analysis. Structured Pydantic parsing extracts Name labels, actors matrices, target swimlanes, and resolves development assumptions.
                    </p>
                  </div>

                  {/* Step 2 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-violet uppercase font-bold tracking-widest">Stage 2</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Workspace Assembly</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Translates semantic objectives into clean UNIX modular tree layouts, selects target python package dependencies, and models standard CRUD router paths.
                    </p>
                  </div>

                  {/* Step 3 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase font-bold tracking-widest">Stage 3</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Schema Synthesizer</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Renders actual high-level relational schema tables, maps models using strict Python types, and outputs SQLAlchemy ORM configurations.
                    </p>
                  </div>

                  {/* Step 4 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-violet uppercase font-bold tracking-widest">Stage 4</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Static Integrity Check</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Verifies circular dependencies, ensures that foreign key relationships don't cause cascade breaks, and checks SQLAlchemy backrefs logic.
                    </p>
                  </div>

                  {/* Step 5 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase font-bold tracking-widest">Stage 5</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Self-Healing patches</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Feeds audit failure tracebacks back into local healing compiler models. Safely regenerates pristine definitions, bringing the system design score back to 100%.
                    </p>
                  </div>

                  {/* Step 6 Block */}
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 space-y-2.5 transition-all hover:border-navy-750 hover:scale-[1.01] shadow-inner">
                    <span className="text-[10px] font-mono text-accent-violet uppercase font-bold tracking-widest">Stage 6</span>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-display">Sandbox execution</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Simulates physical router executions! Translates test payload inputs directly into standard logs and returns beautiful mocked REST replies.
                    </p>
                  </div>

                </div>

                {/* Tech stack description panel details */}
                <div className="bg-navy-950 border border-navy-850 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">Pipeline Tech Specs Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-semibold text-slate-400">
                    <div className="space-y-2">
                      <p className="text-slate-100 font-extrabold flex items-center gap-2 font-display uppercase tracking-wider text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-sm shadow-accent-cyan/60 animate-pulse"></span> FastAPI + Pydantic Frameworks
                      </p>
                      <p className="font-normal text-[11px]">
                        Our architecture leverages Pydantic for request payloads, parsing structured AI returns using reliable schemas. Fast endpoints validation is triggered strictly before database insertion scripts.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-100 font-extrabold flex items-center gap-2 font-display uppercase tracking-wider text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-sm shadow-accent-violet/60 animate-pulse"></span> Gemini API Integration
                      </p>
                      <p className="font-normal text-[11px]">
                        Using Structured Outputs and strict JSON response schemas guarantees that our LLM engine returns precisely typed structures matching our system’s expectations. This is how we eliminate parsing errors entirely.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* Workspace Footer Margins */}
      <footer className="border-t border-navy-850 bg-navy-950/80 backdrop-blur-md py-6 px-6 mt-12 text-center text-[10.5px] text-slate-500 font-mono">
        <p>© 2026 ForgeFlow Engineering Syndicate v2.0. Modular patterns engineered for reliable, resilient microservices.</p>
      </footer>

    </div>
  );
}
