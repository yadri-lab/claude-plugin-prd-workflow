---
name: create-prd
description: Create new PRD with interactive refinement and AI assistance
category: PRD Management
---

# Create PRD Command

Create a new Product Requirements Document with interactive questions to refine scope before generation.

## Purpose

Generate well-scoped PRDs through:
- Interactive clarifying questions
- AI-assisted content generation
- Standardized structure
- Automatic ID assignment
- Draft mode by default (review later on feature branch)

## Workflow

### Step 1: Gather Feature Description

Ask user for brief feature description:
```markdown
What feature do you want to build?

Example: "Add OAuth2 authentication with Google and GitHub"

> [User input]
```

### Step 2: Detect Feature Type & Ask Contextual Questions

**NEW**: AI detects feature type and asks **type-specific questions** instead of generic ones.

#### Step 2a: Classify Feature Type

AI analyzes description and classifies into one of these types:
- 🔐 **Authentication/Security** (login, OAuth, permissions, encryption)
- 💳 **Payment/Financial** (billing, subscriptions, invoices, PCI)
- 🎨 **UI/UX** (design, themes, layouts, components)
- 🔌 **API/Backend** (endpoints, services, data processing)
- 🗄️ **Database** (schema, migrations, data modeling)
- 🔗 **Integration** (third-party APIs, webhooks, SDKs)
- 🏗️ **Infrastructure** (CI/CD, deployment, monitoring)
- 📊 **Analytics/Reporting** (dashboards, metrics, exports)
- 🧪 **Testing/QA** (test frameworks, coverage, automation)
- 📝 **Simple/Generic** (unclear type or very simple)

#### Step 2b: Ask Type-Specific Questions (4-6 questions)

**For simple/well-defined features**: Skip questions, go straight to generation
**For complex features**: Ask targeted questions based on type

#### Example: Payment/Financial Feature

User input: "Add payment processing with Stripe"

```markdown
Great! I've detected this is a Payment/Financial feature. Let me ask a few specific questions...

❓ Question 1: Compliance & Security
Do you need PCI-DSS Level 1 compliance?
- Yes (we handle card data directly)
- No (use Stripe.js tokenization - recommended)

> [User: No, use tokenization]

❓ Question 2: Payment Methods
Which payment methods for v1?
- Credit/Debit cards only
- Cards + Apple Pay/Google Pay
- Cards + Bank transfers (ACH)
- Full suite (cards + wallets + buy-now-pay-later)

> [User: Cards + Apple Pay]

❓ Question 3: Billing Model
One-time payments or recurring?
- One-time only
- Recurring subscriptions (monthly/yearly)
- Both
- Usage-based billing

> [User: Recurring subscriptions]

❓ Question 4: Multi-Currency
Single currency or international?
- USD only
- Multiple currencies (which regions: US, EU, Asia?)
- Dynamic currency based on user location

> [User: USD only for v1]

❓ Question 5: Failed Payment Handling
How to handle failed recurring payments?
- Retry logic (how many attempts?)
- Dunning emails (automated reminders)
- Grace period before cancellation
- All of the above

> [User: Retry 3x, then 7-day grace period]

❓ Question 6: Out of Scope
What are you explicitly NOT doing in v1?
(Prevents scope creep!)

> [User: No refunds UI, no invoice PDFs, no tax calculations]
```

#### Example: UI/UX Feature

User input: "Add dark mode to the app"

```markdown
Got it! This is a UI/UX feature. A few quick questions...

❓ Question 1: Scope
Which parts get dark mode in v1?
- Entire app (all pages)
- Specific pages (dashboard, settings only)
- Just the main layout (header, sidebar)

> [User: Entire app]

❓ Question 2: User Preference
How should we remember the preference?
- localStorage (per-device)
- User account setting (synced across devices)
- Auto-detect system preference only (no toggle)

> [User: User account + system preference fallback]

❓ Question 3: Color Palette
How many themes?
- Light + Dark (2 themes)
- Light + Dark + High Contrast (3 themes)
- Custom theme builder (let users pick colors)

> [User: Just Light + Dark]

❓ Question 4: Transition
Switch between themes how?
- Instant (no animation)
- Smooth fade (300ms transition)
- Page reload required

> [User: Smooth fade]

❓ Question 5: Out of Scope
What's NOT included in v1?

> [User: No custom themes, no scheduled auto-switch, no theme previews]
```

#### Example: API/Backend Feature

User input: "Build a REST API for product catalog"

```markdown
This is an API/Backend feature. Let's define the scope...

❓ Question 1: API Design
REST or GraphQL?
- REST (standard HTTP methods)
- GraphQL (flexible queries)
- Both (REST for simple, GraphQL for complex)

> [User: REST]

❓ Question 2: Authentication
Who can access this API?
- Public (no auth required)
- Internal only (service-to-service)
- API keys (for third-party integrations)
- OAuth 2.0 (for user-specific data)

> [User: API keys for partners]

❓ Question 3: Rate Limiting
How many requests per minute?
- None (trusted users only)
- 60 req/min per API key
- 1000 req/min (high volume)
- Tiered (different limits per plan)

> [User: 1000 req/min, tiered later]

❓ Question 4: Data Format
Response format?
- JSON only
- JSON + XML
- JSON + CSV export

> [User: JSON only]

❓ Question 5: Endpoints (v1 scope)
Which operations for v1?
- CRUD (Create, Read, Update, Delete)
- Read-only (GET endpoints)
- Create + Read only (no updates/deletes yet)

> [User: Read-only for v1]

❓ Question 6: Out of Scope
What's deferred to v2?

> [User: No webhooks, no bulk import, no API versioning]
```

#### Example: Simple Feature (Skip Questions)

User input: "Add a loading spinner to the button"

```markdown
This is a simple, well-defined UI change. No need for questions!

Generating PRD directly...
```

**Question Selection Strategy** (Enhanced)
```markdown
Great! Let me ask a few questions to refine the scope...

Question 1: Target Users
Who will use this feature?
Options:
- All users (B2C)
- Enterprise/B2B users only
- Internal team/developers
- Specific user segment

> [User answers]

Question 2: Core Requirements
What are the 2-3 must-have capabilities for v1?
(Focus on minimum viable scope)

> [User lists core requirements]

Question 3: Out of Scope
What are you explicitly NOT doing in v1?
(This prevents scope creep - be specific!)

> [User defines boundaries]

Question 4: Integration Points (if applicable)
Does this integrate with existing systems?
- Which systems/services?
- Data flow between systems?

> [User answers]

Question 5: Success Criteria
How will you measure success?
Pick 1-2 key metrics.

> [User defines metrics]

Question 6: Technical Constraints (if applicable)
Any technical decisions already made?
- Tech stack?
- Performance targets?

> [User answers or "none"]
```

### Step 3: Generate PRD ID

Read PRD ID configuration from .claude/config.json or use defaults (PRD-XXX format)

Scan existing PRDs to find next number

Generate new ID: PRD-007

### Step 4: Generate PRD Content

Using answers from Step 2, generate comprehensive PRD with all required sections

### Step 5: Quick Self-Review

Automatically perform lightweight review and assign grade

### Step 6: Create File with New Naming Format

NEW NAMING FORMAT: PRD-{ID}-{feature-slug}.md

Examples:
- PRD-003-oauth2-integration.md
- PRD-007-dark-mode-support.md

Benefits:
- ID directly in filename (grep-able)
- No date confusion (Git tracks history)
- Cleaner, more professional

Save to: product/prds/01-draft/PRD-{ID}-{feature-slug}.md

### Step 7: Update WORK_PLAN.md

Add new entry to PRD pipeline table

### Step 8: Provide Next Steps with Options

```markdown
PRD Created: PRD-007 - OAuth2 Integration

File: product/prds/01-draft/PRD-007-oauth2-integration.md
Status: Draft
Quick Review: B+ (Good scope)

Next Steps - Choose Your Path:

1. Approve Now (Quick path)
   Move to approved, start coding
   
2. Review Later (Recommended for parallel workflow)
   Keep in draft, create feature branch now
   Allows Main branch to stay free
   
3. Refine First
   Stay on Main, improve PRD now

What would you like to do? (1/2/3)
```

Handle user choice appropriately

## Configuration

Respects prd_workflow configuration in .claude/config.json

## Options

```bash
/create-prd
/create-prd "Add OAuth2 authentication"
/create-prd "Simple bug fix" --quick
/create-prd "New feature" --auto-approve
```

## Best Practices

- Ask clarifying questions - Don't assume!
- Define OUT OF SCOPE - Critical to prevent creep
- Stay in draft by default - Review on feature branch
- One feature per PRD
- Be specific
- Include success metrics

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 2.2.0
Requires: Git 2.0+
