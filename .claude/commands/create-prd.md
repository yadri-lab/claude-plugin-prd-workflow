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

### Step 0: Check for Template Usage (NEW in v2.6)

**Check for --template flag**:

```bash
/create-prd --template=ecommerce "Add shopping cart feature"
```

**If template specified**:
1. List available templates if `--list-templates`
2. Load template YAML file
3. Pre-fill PRD sections from template
4. Skip to Step 3 (generation)

**Available Templates** (7 total):
- 🛒 `ecommerce` - Online store with cart, checkout, payments
- 💼 `saas` - SaaS app with auth, billing, dashboard
- 📱 `mobile-app` - Cross-platform mobile with offline support
- 🔌 `api-service` - REST/GraphQL API with documentation
- ⚙️ `admin-panel` - Admin dashboard with CRUD operations
- 📊 `analytics-dashboard` - Real-time analytics and reporting
- 🔗 `integration` - Third-party API integration with webhooks

**List templates**:
```bash
/create-prd --list-templates

📋 Available PRD Templates:

1. 🛒 ecommerce - E-Commerce Store
   Online store with product catalog, cart, checkout, and payments

2. 💼 saas - SaaS Application
   SaaS app with authentication, billing, and user dashboard

3. 📱 mobile-app - Mobile Application
   Cross-platform mobile app for iOS and Android

4. 🔌 api-service - API Service
   RESTful API or GraphQL service with documentation

5. ⚙️ admin-panel - Admin Dashboard
   Internal admin panel with CRUD and user management

6. 📊 analytics-dashboard - Analytics Dashboard
   Real-time analytics and reporting dashboard

7. 🔗 integration - Third-Party Integration
   Integration with third-party API and webhooks

Usage: /create-prd --template=<name> "Your feature description"
Example: /create-prd --template=ecommerce "Add shopping cart"
```

**Template Benefits**:
- Pre-filled acceptance criteria (P0, P1, P2)
- Tech stack recommendations
- Out-of-scope examples (prevent creep)
- Success metrics
- Risk analysis
- 50% faster PRD creation


### Step 0.5: Auto-Detect Feature Type (NEW in v0.3)

**Before generating PRD, analyze feature description for type hints**:

```bash
FEATURE_DESC="Add dark mode to the app"

# Detection logic
if echo "$FEATURE_DESC" | grep -iE "experiment|poc|prototype|test|trial|pilot" > /dev/null; then
  FEATURE_TYPE="experiment"
  TEMPLATE_FILE="product/templates/experiment.md"
  EMOJI="🧪"
elif echo "$FEATURE_DESC" | grep -iE "fix|bug|hotfix|patch|update|tweak|small|minor|quick" > /dev/null; then
  FEATURE_TYPE="quick"
  TEMPLATE_FILE="product/templates/quick-feature.md"
  EMOJI="⚡"
else
  FEATURE_TYPE="full"
  TEMPLATE_FILE="product/templates/full-feature.md"
  EMOJI="🎯"
fi
```

**Display detection result**:

```markdown
🔍 **Feature Type Auto-Detected**: ${EMOJI} ${FEATURE_TYPE^}

Based on keywords in: "${FEATURE_DESC}"

Detected as: **${FEATURE_TYPE^} Feature**
- Template: ${TEMPLATE_FILE}
- Estimated: ${ESTIMATE}

Is this correct? (y/n/change)
> _
```

**Type characteristics**:

| Type | Keywords | Estimate | Template |
|------|----------|----------|----------|
| 🎯 Full | (default) | 5+ days | full-feature.md |
| ⚡ Quick | fix, bug, update, small | 1-3 days | quick-feature.md |
| 🧪 Experiment | experiment, poc, prototype | 1-2 weeks | experiment.md |

**If user says "change"**:
```markdown
Which type should this be?
  [1] 🎯 Full Feature (5+ days)
  [2] ⚡ Quick Ship (1-3 days)
  [3] 🧪 Experiment/POC (1-2 weeks)

Choose: _
```

**Why this matters**:
- **Different templates** for different feature sizes
- **Right level of detail** - Quick features don't need extensive docs
- **Clearer expectations** - Team knows scope upfront


### Step 1: Gather Feature Description

Ask user for brief feature description:
```markdown
What feature do you want to build?

Example: "Add OAuth2 authentication with Google and GitHub"

💡 Tip: Use --template flag for faster PRD creation!
   /create-prd --list-templates

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

**Question Selection Strategy** (Enhanced):
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

NEW NAMING FORMAT: PRD-{ID}-{feature-slug}-v1.md

Examples:
- PRD-003-oauth2-integration-v1.md
- PRD-007-dark-mode-support-v1.md
- PRD-033-deployment-safety-gates-v1.md

Benefits:
- ID directly in filename (grep-able)
- No date confusion (Git tracks history)
- Cleaner, more professional
- Version suffix for future iterations

Save to: product/prds/01-draft/PRD-{ID}-{feature-slug}-v1.md

### Step 7: Update WORK_PLAN.md

Add new entry to PRD pipeline table

### Step 8: Provide Next Steps with Options

```markdown
✅ PRD Created: PRD-007 - OAuth2 Integration

📄 File: product/prds/01-draft/PRD-007-oauth2-integration-v1.md
📊 Status: Draft
🎯 Quick Review: B+ (Good scope)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps - Choose Your Path**:

1. **Review & Setup** (Recommended)
   /review-prd PRD-007  → Review and improve
   /setup-prd PRD-007   → Create branch + worktree
   
2. **Quick Setup** (Skip review for now)
   /setup-prd PRD-007   → Create branch + worktree immediately
   
3. **Refine First** (Stay on Main)
   Edit PRD manually, then /review-prd when ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Recommended**: Use /setup-prd to create worktree, then review in separate Cursor window
```

Handle user choice appropriately

## Configuration

Respects prd_workflow configuration in .claude/config.json

## Options

```bash
# Interactive
/create-prd

# With description
/create-prd "Add OAuth2 authentication"

# With template
/create-prd --template=saas "Add user billing"

# List templates
/create-prd --list-templates

# Quick ship (skip questions)
/create-prd "Simple bug fix" --quick

# Auto-approve (skip review)
/create-prd "New feature" --auto-approve
```

## Best Practices

- ✅ **Ask clarifying questions** - Don't assume!
- ✅ **Define OUT OF SCOPE** - Critical to prevent creep
- ✅ **Stay in draft by default** - Review on feature branch
- ✅ **One feature per PRD** - Keep scope focused
- ✅ **Be specific** - Vague requirements = scope creep
- ✅ **Include success metrics** - How will you measure success?
- ✅ **Use templates** - 50% faster for common patterns

## Integration

Works seamlessly with:
- /review-prd - Review and improve draft PRDs
- /setup-prd - Create branch + worktree for development
- /code-prd - Start guided implementation
- Git worktrees - Parallel feature development

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 2.6.0 (Unified Cursor + Claude Code)
Requires: Git 2.0+

**Last Updated**: 2025-11-02 (Unified commands + template support)

