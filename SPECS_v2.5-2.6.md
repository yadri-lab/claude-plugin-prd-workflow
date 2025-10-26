# Specifications v2.5.0 & v2.6.0

**Release Strategy**: Combined release as v2.6.0
**Target Date**: 2025-10-26
**Scope**: 8 major features

---

## 1. CLAUDE.md Auto-Generation

### Priority: 🥇 Critical
### Effort: 2 days
### Impact: 3x better Claude Code performance

### Specification

**Command**: `/generate-claude-md`

**Purpose**: Auto-generate a comprehensive CLAUDE.md file by analyzing the codebase structure, tech stack, and patterns.

**Workflow**:

```bash
/generate-claude-md

→ Step 1: Analyze codebase
  - Detect tech stack (package.json, requirements.txt, etc.)
  - Identify framework (React, Next.js, Django, FastAPI, etc.)
  - Scan directory structure
  - Detect testing framework
  - Find build/dev commands

→ Step 2: Generate structured CLAUDE.md
  Sections:
  1. Project Overview
  2. Tech Stack
  3. Architecture & Patterns
  4. Directory Structure
  5. Development Commands
  6. Code Style & Conventions
  7. Testing Approach
  8. Do NOT Edit (auto-generated files)
  9. Review Process

→ Step 3: Write to root CLAUDE.md
  - Creates new file or updates existing
  - Preserves custom sections (marked with <!-- CUSTOM -->)
  - Adds generation timestamp

→ Step 4: Validation
  - Checks file size (<5KB recommended)
  - Warns if too verbose
  - Suggests optimizations
```

**Example Output**:

```markdown
# Project Context

**Generated**: 2025-10-26 by claude-prd-workflow v2.6.0

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database**: PostgreSQL (Prisma ORM)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## Architecture

- **Pattern**: Server Components + Client Islands
- **Data Fetching**: React Server Components
- **API**: tRPC for type-safe APIs
- **Auth**: NextAuth.js

## Directory Structure

```
src/
  ├── app/          # Next.js App Router pages
  ├── components/   # React components (atomic design)
  ├── lib/          # Utilities & shared logic
  ├── server/       # tRPC routers & server logic
  └── stores/       # Zustand state stores
```

## Development Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run test       # Run Vitest tests
npm run lint       # ESLint + Prettier
npm run typecheck  # TypeScript check
```

## Code Style

- **Components**: Functional with hooks (no class components)
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Use `@/` alias for src/ imports
- **Exports**: Named exports preferred over default
- **Formatting**: Prettier (2 spaces, single quotes, semicolons)

## Testing Approach

- **Unit**: Vitest for utilities & hooks
- **Component**: React Testing Library
- **Coverage**: Minimum 80%
- **Location**: Co-located `__tests__` folders

## Do NOT Edit

These are auto-generated (don't waste time modifying):
- `node_modules/`
- `.next/`
- `dist/`
- `*.generated.ts`
- `prisma/migrations/` (use Prisma CLI)

## Review Process

Before committing:
1. ✅ `npm run lint` - No errors
2. ✅ `npm run typecheck` - No errors
3. ✅ `npm run test` - All pass
4. ✅ Code follows conventions above
5. ✅ New components have tests
```

**Configuration**:

```json
{
  "generate_claude_md": {
    "enabled": true,
    "sections": [
      "tech_stack",
      "architecture",
      "directory_structure",
      "dev_commands",
      "code_style",
      "testing",
      "do_not_edit",
      "review_process"
    ],
    "max_size_kb": 5,
    "preserve_custom_sections": true
  }
}
```

**Files Created**:
- `commands/generate-claude-md.md` - Command definition
- `skills/claude-md-generator.md` - Analysis skill

---

## 2. Template Library

### Priority: 🥈 High
### Effort: 3 days
### Impact: -50% PRD creation time

### Specification

**Enhancement**: `/create-prd --template=<name>`

**Purpose**: Provide pre-built PRD templates for common feature types.

**Templates to Create** (7 total):

#### 1. E-Commerce Template
```yaml
name: ecommerce
description: Online store with cart, checkout, payment
sections:
  - Product catalog (search, filters, categories)
  - Shopping cart (add, remove, update quantity)
  - Checkout flow (address, shipping, payment)
  - Order management (history, tracking, returns)
  - Payment integration (Stripe/PayPal)

tech_stack_suggestions:
  - Stripe for payments
  - Algolia for search
  - Tailwind for UI

acceptance_criteria_template:
  - User can browse products by category
  - User can add items to cart
  - User can complete checkout in <3 steps
  - Payment processing is PCI-compliant
  - Order confirmation email sent
```

#### 2. SaaS Template
```yaml
name: saas
description: SaaS app with auth, billing, dashboard
sections:
  - User authentication (signup, login, OAuth)
  - Subscription billing (plans, invoices, upgrades)
  - User dashboard (metrics, settings, team)
  - Admin panel (user management, analytics)

tech_stack_suggestions:
  - NextAuth.js for auth
  - Stripe for billing
  - Recharts for analytics

acceptance_criteria_template:
  - User can sign up with email or OAuth
  - User can select subscription plan
  - Dashboard loads in <2s
  - Admin can view all users and usage
```

#### 3. Mobile App Template
```yaml
name: mobile-app
description: Mobile app (iOS/Android) with native features
sections:
  - User onboarding (splash, tutorial)
  - Authentication (biometric, OAuth)
  - Core features (push notifications, camera, location)
  - Offline support (local storage, sync)
  - App store deployment

tech_stack_suggestions:
  - React Native or Flutter
  - Firebase for push notifications
  - AsyncStorage for offline

acceptance_criteria_template:
  - App works on iOS 15+ and Android 12+
  - Push notifications delivered <10s
  - Offline mode for core features
  - App store submission ready
```

#### 4. API Service Template
```yaml
name: api-service
description: REST/GraphQL API with authentication
sections:
  - API design (REST or GraphQL endpoints)
  - Authentication (API keys, OAuth, JWT)
  - Rate limiting (per-user, per-IP)
  - Documentation (OpenAPI, Swagger)
  - Monitoring (logs, metrics, alerts)

tech_stack_suggestions:
  - FastAPI or Express
  - Redis for rate limiting
  - Swagger for docs

acceptance_criteria_template:
  - All endpoints documented with OpenAPI
  - Rate limiting: 1000 req/min per key
  - Response time <200ms p95
  - 99.9% uptime
```

#### 5. Admin Panel Template
```yaml
name: admin-panel
description: Internal admin dashboard with CRUD
sections:
  - User management (list, create, edit, delete)
  - Permissions & roles (RBAC)
  - Data tables (search, filter, export)
  - Audit logs (who changed what when)
  - Reports & analytics

tech_stack_suggestions:
  - React Admin or Django Admin
  - PostgreSQL for data
  - Chart.js for analytics

acceptance_criteria_template:
  - Admin can perform all CRUD operations
  - Permissions enforced (no unauthorized access)
  - Audit log for all changes
  - Export to CSV/Excel
```

#### 6. Analytics Dashboard Template
```yaml
name: analytics-dashboard
description: Real-time analytics and reporting
sections:
  - Metrics collection (events, pageviews)
  - Real-time dashboard (charts, KPIs)
  - Custom reports (date range, filters)
  - Alerts & notifications (thresholds)
  - Data export (CSV, JSON, API)

tech_stack_suggestions:
  - Mixpanel or Amplitude
  - Recharts for visualization
  - Postgres + TimescaleDB

acceptance_criteria_template:
  - Dashboard updates in real-time (<5s delay)
  - Custom date ranges supported
  - Alerts trigger when metrics hit thresholds
  - Export data in multiple formats
```

#### 7. Integration Template
```yaml
name: integration
description: Third-party API integration (webhooks, SDK)
sections:
  - API client setup (auth, config)
  - Webhook receiver (verify signature, queue)
  - Data synchronization (one-way or bidirectional)
  - Error handling (retry logic, dead letter queue)
  - Monitoring (success rate, latency)

tech_stack_suggestions:
  - Axios for HTTP client
  - Bull for job queue
  - Redis for caching

acceptance_criteria_template:
  - Webhook signature verified
  - Failed webhooks retried 3x with backoff
  - Sync completes in <5 minutes
  - 99% success rate
```

**Command Usage**:

```bash
# List available templates
/create-prd --list-templates

# Use template
/create-prd --template=ecommerce "Add shopping cart feature"

# Use template with customization
/create-prd --template=saas "Build admin dashboard" --skip-questions
```

**Implementation**:
- `templates/prds/` directory with 7 `.yaml` files
- Update `/create-prd` command to:
  1. Detect `--template` flag
  2. Load template YAML
  3. Pre-fill PRD sections
  4. Ask only missing questions
  5. Generate final PRD

**Files Created**:
- `templates/prds/ecommerce.yaml`
- `templates/prds/saas.yaml`
- `templates/prds/mobile-app.yaml`
- `templates/prds/api-service.yaml`
- `templates/prds/admin-panel.yaml`
- `templates/prds/analytics-dashboard.yaml`
- `templates/prds/integration.yaml`

---

## 3. /list-prds Kanban View

### Priority: 🥉 Medium
### Effort: 1 day
### Impact: Better UX

### Specification

**Enhancement**: `/list-prds --view=kanban`

**Purpose**: ASCII Kanban board in terminal for visual status overview.

**Example Output**:

```
📋 PRD Pipeline - Kanban View

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📝 DRAFT (2)    │ 🔍 REVIEW (1)   │ ✅ READY (3)    │ 🚧 IN PROGRESS  │ ✔️ COMPLETE (5) │
│                 │                 │                 │      (2)        │                 │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │                 │                 │
│ PRD-014         │ PRD-011         │ PRD-004         │ ⚡ PRD-003      │ PRD-001         │
│ Chat Feature    │ Mobile App      │ Landing Page    │ Design System   │ Project Setup   │
│ P1 │ -          │ P0 │ C          │ P0 │ B+         │ P0 │ A- │ Day 3  │ P0 │ Day 8      │
│                 │                 │                 │ 67% ██████▌░░   │                 │
│                 │                 │                 │                 │                 │
│ PRD-016         │                 │ PRD-007         │ PRD-008         │ PRD-002         │
│ Payment         │                 │ User Auth       │ RSS Monitor     │ CI/CD Pipeline  │
│ P0 │ -          │                 │ P0 │ A          │ P0 │ B │ Day 2   │ P1 │ Day 4      │
│                 │                 │ 🔒 Blocked by   │ 45% ████▌░░░    │                 │
│                 │                 │    PRD-003      │                 │                 │
│                 │                 │                 │                 │ PRD-005         │
│                 │                 │ PRD-009         │                 │ Dark Mode       │
│                 │                 │ Analytics       │                 │ P2 │ Day 2      │
│                 │                 │ P1 │ B          │                 │                 │
│                 │                 │                 │                 │ (+ 2 more)      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Legend:
  Priority: P0 (must-have), P1 (should-have), P2 (nice-to-have)
  Grade: A (excellent), B (good), C (needs work)
  🔒 = Blocked by dependencies
  ⚡ = Active work today

💡 Suggestions:
  - Complete PRD-003 to unblock PRD-007
  - Review PRD-011 (stuck in review for 4 days)
  - Start PRD-004 (no blockers, high priority)
```

**Implementation**:
- Enhance `commands/list-prds.md` with kanban option
- Use box-drawing characters (Unicode)
- Color coding (ANSI colors)
- Progress bars for in-progress PRDs
- Dependency indicators

---

## 4. MCP Server Integration

### Priority: 🥇 Critical
### Effort: 1 week
### Impact: Ecosystem alignment

### Specification

**Package**: `@claude-prd/mcp`

**Purpose**: Expose PRDs via Model Context Protocol for live access from Claude Code.

**Architecture**:

```typescript
// MCP Server Implementation

{
  "name": "@claude-prd/mcp",
  "version": "1.0.0",
  "mcpServers": {
    "prd-workflow": {
      "command": "npx",
      "args": ["@claude-prd/mcp"]
    }
  }
}

// Tools Exposed
tools: [
  {
    name: "get_prd",
    description: "Fetch a PRD by ID",
    inputSchema: {
      type: "object",
      properties: {
        prd_id: { type: "string", description: "PRD ID (e.g., PRD-003)" }
      },
      required: ["prd_id"]
    }
  },
  {
    name: "list_prds",
    description: "List all PRDs with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "review", "ready", "in-progress", "complete"] },
        priority: { type: "string", enum: ["P0", "P1", "P2", "P3"] }
      }
    }
  },
  {
    name: "get_acceptance_criteria",
    description: "Fetch just the acceptance criteria section",
    inputSchema: {
      type: "object",
      properties: {
        prd_id: { type: "string" }
      },
      required: ["prd_id"]
    }
  },
  {
    name: "get_tech_stack",
    description: "Fetch just the tech stack decisions",
    inputSchema: {
      type: "object",
      properties: {
        prd_id: { type: "string" }
      },
      required: ["prd_id"]
    }
  },
  {
    name: "update_prd_status",
    description: "Update PRD status",
    inputSchema: {
      type: "object",
      properties: {
        prd_id: { type: "string" },
        new_status: { type: "string", enum: ["draft", "review", "ready", "in-progress", "complete"] }
      },
      required: ["prd_id", "new_status"]
    }
  }
],

// Resources Exposed
resources: [
  {
    uri: "prd://{id}",
    name: "PRD Document",
    description: "Full PRD content",
    mimeType: "text/markdown"
  },
  {
    uri: "prds://all",
    name: "All PRDs",
    description: "List of all PRDs",
    mimeType: "application/json"
  },
  {
    uri: "prds://status/{status}",
    name: "PRDs by status",
    description: "Filtered list",
    mimeType: "application/json"
  }
]
```

**Usage Example**:

```typescript
// In Claude Code, after MCP server is configured:

User: "What are the acceptance criteria for PRD-003?"

Claude internally calls:
  → get_acceptance_criteria({ prd_id: "PRD-003" })

Response:
  {
    prd_id: "PRD-003",
    acceptance_criteria: [
      "P0: All components render without errors",
      "P0: Storybook stories for each component",
      "P1: Accessibility audit passes WCAG AA",
      "P1: Visual regression tests in place"
    ]
  }

User: "Show me all P0 PRDs that are ready"

Claude internally calls:
  → list_prds({ priority: "P0", status: "ready" })

Response: [
  { id: "PRD-004", name: "Landing Page", priority: "P0", status: "ready", grade: "B+" },
  { id: "PRD-007", name: "User Auth", priority: "P0", status: "ready", grade: "A" }
]
```

**Files Created**:
- `mcp/server.ts` - MCP server implementation
- `mcp/package.json` - Separate npm package
- `mcp/README.md` - Usage instructions
- `mcp/tools/` - Tool implementations
- `mcp/resources/` - Resource handlers

**Installation**:
```bash
# User adds to their Claude Code config:
{
  "mcpServers": {
    "prd-workflow": {
      "command": "npx",
      "args": ["@claude-prd/mcp"]
    }
  }
}
```

---

## 5. GitHub Issues Sync

### Priority: 🥈 High
### Effort: 4 days
### Impact: Team collaboration

### Specification

**Command**: `/sync-github <PRD-ID>`

**Purpose**: Bidirectional sync between PRDs and GitHub Issues.

**Workflow**:

```bash
# Create GitHub Issue from PRD
/sync-github PRD-003

→ Step 1: Read PRD file
→ Step 2: Create GitHub Issue with:
  - Title: "PRD-003: Design System v1.0"
  - Body: Full PRD markdown
  - Labels: ["P0", "feature", "PRD-003", "design"]
  - Milestone: Auto-detect or ask user
  - Assignee: Auto-assign or ask user

→ Step 3: Update PRD with issue link
  Add to PRD header:
  **GitHub Issue**: #42 (https://github.com/org/repo/issues/42)

→ Step 4: Setup webhook (optional)
  If user approves, setup webhook for bidirectional sync:
  - Issue status changed → Update PRD status
  - Issue closed → Move PRD to complete
  - Comments → Append to PRD notes
```

**Bidirectional Sync**:

```bash
# When GitHub Issue status changes:
GitHub Issue #42: "In Progress" → "Closed"

Auto-detects via webhook:
  → Finds PRD-003 (linked to #42)
  → Runs /complete-prd PRD-003 automatically
  → Moves to 05-complete/
  → Posts comment on Issue: "✅ PRD-003 completed and archived"

# When PRD status changes:
/complete-prd PRD-003

Auto-updates GitHub:
  → Finds Issue #42 (linked to PRD-003)
  → Closes Issue #42
  → Posts comment: "Completed via claude-prd-workflow"
  → Adds "completed" label
```

**Configuration**:

```json
{
  "github": {
    "enabled": true,
    "auto_create_issue": true,
    "auto_sync_status": true,
    "default_labels": ["P0", "feature"],
    "webhook_url": "https://your-server.com/webhook",
    "sync_direction": "bidirectional"  // "one-way" or "bidirectional"
  }
}
```

**Files Created**:
- `commands/sync-github.md` - Command definition
- `skills/github-sync.md` - GitHub API integration skill

**Requirements**:
- GitHub CLI (`gh`) installed
- GitHub token with repo permissions
- Optional: Webhook server for real-time sync

---

## 6. Session Memory Compression

### Priority: 🥉 Medium
### Effort: 3 days
### Impact: Better long-term context

### Specification

**Directory**: `.claude/memory/`

**Purpose**: Compress old conversations and enable full-text search on project history.

**Architecture**:

```
.claude/memory/
  ├── conversations/
  │   ├── 2025-10-01.jsonl.gz     # Compressed daily logs
  │   ├── 2025-10-02.jsonl.gz
  │   └── 2025-10-26.jsonl        # Today (not compressed yet)
  │
  ├── prds/
  │   ├── PRD-003-embeddings.json # Vector embeddings
  │   ├── PRD-008-embeddings.json
  │   └── index.json              # Search index
  │
  └── index.db                    # SQLite FTS index
```

**Command**: `/recall <query>`

**Usage Example**:

```bash
/recall "OAuth implementation"

→ Searches memory:
  - Full-text search in index.db
  - Vector similarity in embeddings
  - Ranks by relevance

→ Results:
  📅 PRD-003 (2 months ago)
  ✅ Status: Complete
  🔑 Key Decisions:
    - Used OAuth 2.0 with PKCE
    - Chose NextAuth.js over Passport
    - Token refresh every 30 min

  ⚠️ Blockers Encountered:
    - CORS issues with Google OAuth (fixed with proxy)
    - Refresh token rotation (solved in v1.1)

  💡 Learnings:
    - Always test token expiration edge cases
    - Document OAuth redirect URLs clearly

  📎 Related PRDs:
    - PRD-007: User Auth (depends on PRD-003)
    - PRD-012: SSO Integration (similar pattern)
```

**Auto-Compression**:

```bash
# Runs automatically daily (via hook)
# Compresses conversations older than 7 days

cron job:
  0 3 * * * /claude/memory/compress.sh

compress.sh:
  - Find .jsonl files older than 7 days
  - gzip each file
  - Update index.db
  - Generate embeddings for new PRDs
```

**Search Features**:

1. **Full-text search** (SQLite FTS5)
   - Index: PRD content, decisions, blockers, learnings
   - Fast keyword search

2. **Vector similarity** (embeddings)
   - Semantic search ("find similar problems")
   - Uses OpenAI embeddings API (optional)

3. **Filters**:
   - Date range
   - PRD status
   - Priority
   - Author

**Files Created**:
- `commands/recall.md` - Command definition
- `skills/memory-compression.md` - Compression logic
- `skills/memory-search.md` - Search implementation
- `.claude/memory/compress.sh` - Daily cron job

---

## 7. AI-Powered Suggestions

### Priority: 🥇 Critical
### Effort: 1 week
### Impact: Unique differentiator

### Specification

**Integration Point**: Enhanced `/create-prd` and `/review-prd`

**Purpose**: AI suggests reusable components, detects dependencies, and recommends tech stack based on past PRDs.

**Features**:

#### Feature 7.1: Similar PRD Detection

```bash
User: /create-prd "Add Stripe payment integration"

AI analyzes:
  - Scans all past PRDs
  - Finds PRD-002: "PayPal integration" (70% similar)
  - Finds PRD-015: "Billing dashboard" (mentions Stripe)

AI suggests:
  💡 Similar PRD found: PRD-002 (PayPal integration)

  Would you like to:
    [1] Reuse tech stack from PRD-002? (Express + Stripe SDK)
    [2] Import acceptance criteria? (12 criteria found)
    [3] Copy "Out of Scope" section? (helps prevent scope creep)
    [4] Skip (start fresh)

  > User selects: 1, 2

  ✅ Imported:
    - Tech stack: Express, Stripe SDK, PostgreSQL
    - Acceptance criteria: 12 items (you can edit)
```

#### Feature 7.2: Dependency Detection

```bash
User: /create-prd "Build user dashboard with metrics"

AI analyzes:
  - Detects "user" → Needs authentication
  - Detects "metrics" → Needs analytics tracking
  - Scans existing PRDs

AI suggests:
  🔗 Dependencies detected:

  1. PRD-003: User Authentication
     Status: ✅ Complete
     → You can use existing auth system

  2. PRD-008: Analytics Tracking
     Status: 🚧 In Progress (Day 2)
     ⚠️ Should this PRD depend on PRD-008?

     [Y] Yes, add as dependency (wait for PRD-008)
     [N] No, implement separately
     [S] Soft dependency (optional)

  > User selects: S (soft dependency)

  ✅ Added to PRD:
    Dependencies:
      - Hard: PRD-003 (User Authentication) - Required
      - Soft: PRD-008 (Analytics Tracking) - Optional
```

#### Feature 7.3: Tech Stack Recommendations

```bash
User: /create-prd "Build real-time chat feature"

AI analyzes:
  - Detects "real-time" → Needs WebSockets or SSE
  - Checks existing tech stack (from CLAUDE.md)
  - Scans similar past PRDs

AI suggests:
  🛠️ Tech Stack Recommendations:

  **Based on your existing stack** (Next.js + TypeScript):

  Option 1: Socket.io (Recommended) ⭐
    Pros:
      - Easy integration with Next.js
      - Fallback to polling if WebSocket fails
      - You used it in PRD-012 (Notifications)
    Cons:
      - Adds 200KB to bundle

  Option 2: Pusher
    Pros:
      - Managed service (no infra)
      - 100% reliability
    Cons:
      - Costs $49/mo for your scale
      - Vendor lock-in

  Option 3: Native WebSockets
    Pros:
      - No dependencies
      - Smallest bundle
    Cons:
      - More complex (need to handle reconnection)

  Which option? [1/2/3]

  > User selects: 1

  ✅ Added to PRD:
    Tech Stack:
      - Socket.io for real-time messaging
      - Redis for pub/sub (multi-server support)
```

#### Feature 7.4: Scope Creep Prevention

```bash
During /review-prd PRD-014

AI analyzes PRD content:
  - Detects 15 acceptance criteria (high)
  - Detects feature mentions outside acceptance criteria
  - Compares to similar PRDs

AI suggests:
  ⚠️ Scope Creep Detected:

  This PRD mentions these features but they're not in acceptance criteria:

  1. "Users can customize notification sounds"
     Found in: Implementation Notes
     Risk: Medium (adds 2-3 days)

     Action:
       [A] Add to acceptance criteria (P2 - nice to have)
       [D] Defer to v2 (recommend)
       [K] Keep as implementation detail

  2. "Admin can bulk delete users"
     Found in: Technical Approach
     Risk: High (security implications, adds 5 days)

     Action:
       [A] Add to acceptance criteria (P1)
       [D] Defer to separate PRD (recommend)
       [K] Keep as stretch goal

  > User selects: D, D (defer both)

  ✅ Updated PRD:
    - Removed creep items from implementation notes
    - Added to "Future Considerations" section
    - Estimated time: 12 days → 8 days (-33%)
```

**Implementation**:

1. **Vector Embeddings**:
   - Generate embeddings for each PRD on creation
   - Store in `.claude/memory/prds/{id}-embeddings.json`
   - Use cosine similarity for "similar PRD" detection

2. **Pattern Matching**:
   - Regex for common keywords (payment, auth, dashboard, etc.)
   - Mapping to known dependencies

3. **Historical Analysis**:
   - Scan completed PRDs for tech stack patterns
   - Build knowledge base of what worked

**Files Created**:
- `skills/ai-suggestions.md` - Suggestion engine
- `skills/dependency-detector.md` - Dependency analysis
- `skills/scope-analyzer.md` - Scope creep detection

---

## 8. New Specialized Agents (4 total)

### Priority: 🥉 Medium
### Effort: 2 days
### Impact: Specialized expertise

### Specification

#### Agent 8.1: database-architect

**Model**: Sonnet (complex reasoning)

**Purpose**: Expert guidance on database schema, migrations, indexes, and query optimization.

**Capabilities**:
- Design normalized schemas (3NF)
- Suggest indexes for common queries
- Migration strategy (zero-downtime)
- Query optimization (EXPLAIN analysis)
- Relationship modeling (1:1, 1:N, N:N)

**Example Usage**:
```
User: "Design schema for e-commerce product catalog"

database-architect:
  📊 Schema Design:

  ```sql
  -- Products table (core entity)
  CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Categories (hierarchical)
  CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Many-to-many: products <-> categories
  CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
  );

  -- Indexes for common queries
  CREATE INDEX idx_products_sku ON products(sku);
  CREATE INDEX idx_products_price ON products(price_cents);
  CREATE INDEX idx_categories_parent ON categories(parent_id);
  CREATE INDEX idx_product_categories_category ON product_categories(category_id);
  ```

  💡 Recommendations:
  1. Use UUID for IDs (better for distributed systems)
  2. Price in cents (avoid float precision issues)
  3. Soft delete? Add `deleted_at TIMESTAMPTZ` column
  4. Full-text search? Add GIN index on description

  🚀 Migration Strategy:
  1. Create tables in order (categories → products → junction)
  2. Add indexes CONCURRENTLY (zero downtime)
  3. Backfill data if migrating from existing system
```

#### Agent 8.2: api-designer

**Model**: Sonnet (complex reasoning)

**Purpose**: Design REST/GraphQL APIs following best practices (OpenAPI, versioning, pagination).

**Capabilities**:
- Design RESTful endpoints
- GraphQL schema design
- API versioning strategy
- Pagination (cursor vs offset)
- Error response formatting
- OpenAPI spec generation

**Example Usage**:
```
User: "Design API for user management"

api-designer:
  🔌 REST API Design:

  **Base URL**: `/api/v1/users`

  **Endpoints**:

  1. List Users (with pagination)
  GET /api/v1/users?page=1&limit=20&sort=created_at&order=desc

  Response:
  ```json
  {
    "data": [
      { "id": "usr_123", "email": "user@example.com", ... }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "next": "/api/v1/users?page=2&limit=20"
    }
  }
  ```

  2. Get User
  GET /api/v1/users/:id

  3. Create User
  POST /api/v1/users
  Body: { "email": "...", "name": "..." }

  4. Update User (partial)
  PATCH /api/v1/users/:id
  Body: { "name": "New Name" }

  5. Delete User (soft delete)
  DELETE /api/v1/users/:id

  **Error Responses**:
  ```json
  {
    "error": {
      "code": "USER_NOT_FOUND",
      "message": "User with ID usr_123 not found",
      "status": 404
    }
  }
  ```

  **Rate Limiting**: 1000 req/hour per API key
  **Auth**: Bearer token (JWT)
  **Versioning**: URL path (/v1/, /v2/)

  📄 OpenAPI Spec: (auto-generated)
```

#### Agent 8.3: mobile-specialist

**Model**: Haiku (fast, patterns-based)

**Purpose**: Mobile-specific patterns (iOS/Android), push notifications, offline support, app store guidelines.

**Capabilities**:
- React Native vs Flutter recommendations
- Native module integration
- Push notification setup
- Offline-first architecture
- App store submission checklist
- Deep linking

**Example Usage**:
```
User: "Build offline-first mobile app"

mobile-specialist:
  📱 Offline-First Architecture:

  **Tech Stack**:
  - React Native (better for your team's JS skills)
  - AsyncStorage for local data
  - NetInfo for connectivity detection
  - Redux Persist for state persistence

  **Sync Strategy**:

  1. Local-First Writes:
  ```js
  // User action (always succeeds immediately)
  async function createPost(data) {
    // 1. Save locally first
    const localId = await AsyncStorage.setItem(`post_${uuid()}`, data);

    // 2. Queue for sync
    await SyncQueue.add({ action: 'CREATE_POST', data, localId });

    // 3. Attempt sync in background
    if (await NetInfo.isConnected()) {
      await syncNow();
    }

    return localId;  // Instant feedback to user
  }
  ```

  2. Background Sync:
  ```js
  // Runs when connectivity restored
  async function syncQueue() {
    const pending = await SyncQueue.getAll();

    for (const item of pending) {
      try {
        const serverResponse = await api.post(item.data);
        // Replace local ID with server ID
        await AsyncStorage.replaceItem(item.localId, serverResponse.id);
        await SyncQueue.remove(item);
      } catch (error) {
        // Keep in queue, retry later with exponential backoff
      }
    }
  }
  ```

  3. Conflict Resolution:
  - Last-write-wins (simple)
  - OR: Server timestamp comparison
  - OR: Operational Transformation (complex, for real-time collab)

  **Best Practices**:
  ✅ Show sync status indicator ("Syncing...", "Offline", "Synced")
  ✅ Retry failed syncs with exponential backoff
  ✅ Handle "out of sync" errors gracefully
  ✅ Test airplane mode edge cases
```

#### Agent 8.4: accessibility-auditor

**Model**: Haiku (checklist-based)

**Purpose**: WCAG 2.1 compliance, screen reader testing, keyboard navigation, color contrast.

**Capabilities**:
- WCAG AA/AAA compliance checks
- Screen reader testing guides
- Keyboard navigation validation
- Color contrast analysis
- ARIA attributes recommendations
- Accessibility testing automation

**Example Usage**:
```
User: "Audit form component for accessibility"

accessibility-auditor:
  ♿ Accessibility Audit Report:

  **Component**: User Registration Form
  **WCAG Level**: AA (target)

  ❌ CRITICAL Issues (3):

  1. Missing form labels
     Problem: <input> has no associated <label>
     Impact: Screen readers can't announce field purpose
     Fix:
     ```jsx
     // Bad
     <input type="email" placeholder="Email" />

     // Good
     <label htmlFor="email">Email Address</label>
     <input id="email" type="email" aria-required="true" />
     ```
     WCAG: 3.3.2 Labels or Instructions (Level A)

  2. Low color contrast (2.8:1)
     Problem: Gray text (#888) on white background
     Impact: Users with low vision can't read
     Fix: Use #595959 or darker (meets 4.5:1 ratio)
     WCAG: 1.4.3 Contrast (Level AA)

  3. No keyboard focus indicator
     Problem: Can't see which field is focused when tabbing
     Impact: Keyboard-only users lost
     Fix:
     ```css
     input:focus {
       outline: 2px solid #0066CC;
       outline-offset: 2px;
     }
     ```
     WCAG: 2.4.7 Focus Visible (Level AA)

  ⚠️ WARNINGS (2):

  1. Submit button too small (32x32px)
     Problem: Touch target < 44x44px
     Impact: Hard to tap on mobile
     Fix: Increase to min 44x44px
     WCAG: 2.5.5 Target Size (Level AAA)

  2. Error messages not announced
     Problem: <div className="error"> not linked to field
     Impact: Screen reader doesn't read errors
     Fix:
     ```jsx
     <input aria-describedby="email-error" />
     <div id="email-error" role="alert">Invalid email</div>
     ```
     WCAG: 3.3.1 Error Identification (Level A)

  ✅ PASSED (8):
  - Form has proper heading structure
  - All images have alt text
  - Page has skip navigation link
  - (+ 5 more)

  📊 Score: 7/13 (54%) - FAIL
  Target: 100% for WCAG AA

  🧪 Testing Checklist:
  [ ] Test with VoiceOver (macOS/iOS)
  [ ] Test with NVDA (Windows)
  [ ] Test keyboard-only navigation
  [ ] Run axe DevTools
  [ ] Manual color contrast check
```

**Files Created**:
- `agents/database-architect.md`
- `agents/api-designer.md`
- `agents/mobile-specialist.md`
- `agents/accessibility-auditor.md`

---

## Summary

### v2.6.0 Scope (8 features):

1. ✅ CLAUDE.md auto-generation (2 days)
2. ✅ Template library (3 days)
3. ✅ Kanban view (1 day)
4. ✅ MCP server (1 week)
5. ✅ GitHub sync (4 days)
6. ✅ Session memory (3 days)
7. ✅ AI suggestions (1 week)
8. ✅ 4 new agents (2 days)

**Total Effort**: ~3-4 weeks
**Impact**: Ecosystem alignment + unique differentiators

---

**Next Steps**:
1. Review specs
2. Implement features incrementally
3. Test each feature
4. Update docs
5. Deploy v2.6.0
