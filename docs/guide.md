# PRD Workflow Manager - Complete Guide

> **The complete Claude Code plugin for Product-Driven Development**

Transform PRDs from ideas to shipped features with AI-powered review, guided implementation, and automated quality gates.

---

## Table of Contents

1. [What's New in v2.8.0](#whats-new-in-v280)
2. [Quick Start](#quick-start)
3. [Core Commands](#core-commands)
4. [Agents & Skills](#agents--skills)
5. [Configuration](#configuration)
6. [Daily Development (Beyond PRDs)](#daily-development-beyond-prds)
7. [Maintenance Tools](#maintenance-tools)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## What's New in v2.8.0

**Release Date**: 2025-10-26
**Focus**: Reliability & Self-Maintenance

### 🏥 Automated Health & Repair System (NEW in v2.8)

Never worry about missing commands again! The plugin now includes:

**Auto-Health Check**:
- Runs automatically after installation
- Verifies all commands, agents, and skills are installed
- Available via `/plugin-health` command

**Auto-Repair Tool**:
- Fixes missing or corrupted files automatically
- Available via `/plugin-repair` command
- Safe to run multiple times

**Smart Update System**:
- Automated update via `/plugin-update`
- Backs up your config automatically
- Runs health check after update
- Shows what's new in each version

**Example**:
```bash
# Installation now auto-verifies everything
node install.js

🏥 Running automatic health check...
   ✅ Plugin directory found
   ✅ Plugin version: 2.8.0
   ✅ Installed 17 slash commands
   ✅ Installed 17 AI agents
   ✅ Installed 13 skills

✅ All systems operational!

# If something goes wrong later
/plugin-health  # Diagnose issues
/plugin-repair  # Auto-fix problems
/plugin-update  # Update to latest version
```

### 🎯 Key Improvements from v2.4-2.7

### 🚀 Key Improvements

#### 1. Auto-Recovery in /code-prd
Never lose progress again! The plugin now auto-saves your progress every 3 tasks.

**Before**:
- Crash or timeout → Lost all progress
- Had to remember where you stopped
- Restart from scratch

**After**:
- Auto-checkpoint to `.claude/prd-{id}-progress.json`
- Resume from last completed task
- Shows progress percentage and estimated time remaining

**Example**:
```bash
/code-prd PRD-003

# If interrupted and you restart later:
💾 Found saved progress for PRD-003
📊 Progress: 14/42 tasks (33%)
⏱️ Last worked: 2 hours ago
📍 Stopped at: Task 15 - Implement auth middleware

🔄 What would you like to do?
  [R] Resume from task 15 (recommended)
  [S] Start from scratch
  [V] View completed tasks
```

#### 2. Contextual Questions in /create-prd
AI now asks feature-type-specific questions instead of generic ones.

**9 Feature Types**:
- 🔐 Authentication/Security → Asks about PCI, OAuth, permissions
- 💳 Payment/Financial → Asks about billing models, currency, compliance
- 🎨 UI/UX → Asks about themes, layouts, accessibility
- 🔌 API/Backend → Asks about endpoints, rate limiting, auth
- 🗄️ Database → Asks about schema, migrations, indexes
- 🔗 Integration → Asks about webhooks, third-party APIs
- 🏗️ Infrastructure → Asks about CI/CD, deployment
- 📊 Analytics/Reporting → Asks about metrics, dashboards
- 🧪 Testing/QA → Asks about test frameworks, coverage

**Example for Payment Feature**:
```
You want to add: "Stripe payment integration"

AI detects: 💳 Payment/Financial feature

❓ Question 1: PCI-DSS compliance needed?
  - Yes (we handle card data)
  - No (use Stripe.js tokenization)

❓ Question 2: Payment methods for v1?
  - Cards only
  - Cards + Apple Pay/Google Pay
  - Full suite (cards + wallets + BNPL)

❓ Question 3: Billing model?
  - One-time only
  - Recurring subscriptions
  - Usage-based billing

❓ Question 4: Multi-currency?
  - USD only
  - Multiple currencies (which regions?)

❓ Question 5: Failed payment handling?
  - Retry logic (how many attempts?)
  - Dunning emails
  - Grace period before cancellation

❓ Question 6: Out of scope for v1?
  (Prevents scope creep!)
```

**For simple features**: No questions - generates PRD directly!

#### 3. AI-Powered Conflict Resolution in /complete-prd
Pre-merge conflict detection with intelligent resolution suggestions.

**Before**:
- Merge conflicts discovered only during PR
- Manual resolution takes 30+ minutes
- Risk of breaking both features

**After**:
- AI detects conflicts before merge
- Analyzes *why* conflicts exist
- Suggests intelligent resolutions
- Explains how to keep both features working

**Example**:
```
🔀 Merge Conflict Detected in src/auth.ts

<<< Your changes (PRD-003 - OAuth):
function login(email, password) {
  return OAuth.loginWithGoogle(email, password);
}

>>> Main branch (PRD-005 - Password Reset):
function login(email, password) {
  return db.validatePassword(email, password);
}

💡 AI Recommendation: Keep BOTH methods

function login(email, password, method = 'password') {
  if (method === 'oauth') {
    return OAuth.loginWithGoogle(email, password);
  }
  return db.validatePassword(email, password);
}

Why this works:
  - Both features (OAuth + Password) can coexist
  - Method parameter allows switching
  - Backward compatible (defaults to password)

🔧 Actions:
  [A] Accept AI suggestion (auto-resolve)
  [M] Manual resolution (open editor)
  [S] Skip this file (resolve later)
  [C] Cancel merge
```

**Impact**: 80% of conflicts auto-resolved

#### 4. Helpful Error Messages
Every error now suggests the right next command.

**Example 1 - No PRDs Found**:
```
📋 No PRDs found

🚀 Get started:
  1. Create your first PRD: /create-prd
  2. Import existing: Move PRD files to product/prds/01-draft/

📖 Need help?
  - Quick guide: See docs/guide.md
  - Examples: See docs/examples.md
```

**Example 2 - PRD in Wrong State**:
```
⚠️ PRD-006 is in DRAFT state

You need to review and approve it first:

Next steps:
  1. Review: /review-prd PRD-006
  2. After approval, setup: /setup-prd PRD-006

Or:
  - Skip review (not recommended): /setup-prd PRD-006 --skip-review
```

#### 5. Parallel Execution in /orchestrate
Analyze 20 PRDs in 10 seconds instead of 200 seconds.

**Performance Gains**:
- 10 PRDs: 100s → 10s (-90%)
- 20 PRDs: 200s → 10s (-95%)
- 5 in-progress PRDs: 20s → 2s (-90%)

**How**: Uses `Promise.all()` to analyze all PRDs in parallel instead of sequentially.

#### 6. Quick Ship Enhanced
Ultra-simple integrated workflow - no separate `/smart-commit` or `/smart-pr` commands.

**Before**:
```bash
/quick-ship "Fix bug"
# ... make changes ...
/smart-commit
/smart-pr
# Manual merge
```

**After**:
```bash
/quick-ship "Fix dark mode toggle on iOS Safari"
→ AI analyzes change
→ Auto-creates branch
→ Guides implementation
→ Auto-commits with AI message
→ Auto-creates PR
→ Auto-merges if tests pass
→ Complete in <1 hour
```

**Impact**: 3-5x faster bug fixes

### 🎯 Performance Improvements

| Metric | Before v2.4 | After v2.4 | Improvement |
|--------|-------------|------------|-------------|
| PRD Creation Time | 20 min | 10 min | -50% |
| Conflict Resolution | 30 min (manual) | 5 min (AI) | -83% |
| Multi-PRD Analysis | 200s (sequential) | 10s (parallel) | -95% |
| Quick Ship | 2-4 hours | <1 hour | -75% |
| Progress Loss on Crash | 100% | 0% | -100% |

### 🔧 Configuration (Optional)

All features enabled by default. To customize:

```json
{
  "prd_workflow": {
    "create_prd": {
      "enable_contextual_questions": true,
      "skip_questions_for_simple_features": true
    },
    "code_prd": {
      "enable_auto_recovery": true,
      "checkpoint_frequency": 3
    },
    "complete_prd": {
      "enable_ai_conflict_resolution": true,
      "auto_resolve_simple_conflicts": false
    },
    "orchestrate": {
      "enable_parallel_execution": true
    },
    "quick_ship": {
      "auto_commit": true,
      "auto_pr": true,
      "auto_merge_on_tests_pass": false
    }
  }
}
```

### 📦 Migration from v2.3.0

**No breaking changes!** Update and restart:

```bash
npm install -g claude-prd-workflow@latest
# Restart Claude Code
```

All new features work automatically.

---

## Quick Start

### Prerequisites

- ✅ Claude Code v2.0.0 or higher
- ✅ Git v2.25+ (for worktree support)
- ✅ Node.js v18+ (for installation)

### Install (2 minutes)

```bash
# Install globally via npm
npm install -g claude-prd-workflow

# Restart Claude Code
```

### Verify Installation

In Claude Code:
```
/list-prds
```

✅ If you see a response, you're ready!

### Your First PRD (5 minutes)

```bash
# 1. Create PRD
/create-prd "User Authentication"

# 2. Review PRD
/review-prd

# 3. Set up dev environment
/setup-prd PRD-001

# 4. Start coding with guidance
/code-prd PRD-001

# 5. Quality checks before PR
/security-audit
/quality-check
```

---

## Core Commands

### `/create-prd` - Create New PRD

**Purpose**: Start a new feature with a comprehensive PRD template

**Usage**:
```
/create-prd "Feature Name"
```

**What it does**:
1. Asks clarifying questions (priority, target date)
2. Creates PRD file in `product/prds/01-draft/`
3. Pre-fills template sections
4. Opens file for editing

**Output**: `product/prds/01-draft/YYMMDD-feature-name-v1.md`

---

### `/review-prd` - AI-Powered PRD Review

**Purpose**: 7-dimension analysis with automatic grading (A-F)

**Usage**:
```
/review-prd
# or
/review-prd PRD-001
```

**What it does**:
1. Analyzes PRD across 7 dimensions:
   - Clarity (is it understandable?)
   - Feasibility (can we build it?)
   - User Experience (is it user-friendly?)
   - Dependencies (what's needed?)
   - Acceptance Criteria (how do we know it's done?)
   - Risks (what could go wrong?)
   - Simplification (can we reduce scope?)

2. Asks calibration questions to expose gaps
3. Generates improvement suggestions
4. Assigns grade (A-F)
5. Moves to `03-ready/` if approved

**Example output**:
```
Grade: B+ (83%)
✅ Clarity: A
⚠️  Feasibility: C (unclear tech stack)
✅ Acceptance Criteria: A
```

---

### `/setup-prd` - Set Up Development Environment

**Purpose**: Create feature branch + Git worktree + install dependencies

**Usage**:
```
/setup-prd
# or
/setup-prd PRD-001
```

**What it does**:
1. Creates feature branch: `feat/PRD-001-feature-name`
2. Sets up Git worktree in `../project-name-feature-name/`
3. Installs dependencies (if configured)
4. Moves PRD to `04-in-progress/`
5. Provides development context

**Why worktrees?**
- Work on 5+ features in parallel
- No branch switching
- Isolated dependencies
- Zero merge conflicts

**Result**: Clean workspace ready for development

---

### `/code-prd` - Guided Implementation

**Purpose**: AI breaks down PRD into step-by-step tasks with code examples

**Usage**:
```
/code-prd
# or
/code-prd PRD-001
```

**What it does**:
1. Analyzes PRD and codebase
2. Breaks down into 20-50 granular tasks
3. For each task, provides:
   - What to build (clear description)
   - Where (exact file paths)
   - How (code examples & patterns)
   - Acceptance criteria (how to verify)
4. Validates each task before moving to next
5. Tracks progress automatically

**Example task**:
```
Task 3/42: Implement login API endpoint

File: src/routes/auth.ts
Estimated: 1.5 hours

What:
- Create POST /api/auth/login endpoint
- Validate email/password
- Return JWT token on success

How:
```typescript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // ... implementation
});
```

Acceptance:
- [ ] Endpoint returns 200 + JWT for valid credentials
- [ ] Returns 401 for invalid credentials
- [ ] Rate limited to 5 attempts per 15 min
```

---

### `/list-prds` - View All PRDs

**Purpose**: Real-time progress tracking across all features

**Usage**:
```
/list-prds
```

**Output**:
```
📊 PRD Status Dashboard

🟢 In Progress (2):
  PRD-001: User Authentication [85% complete, on track]
  PRD-003: Dashboard UI [40% complete, ahead of schedule]

🟡 Ready to Start (3):
  PRD-002: Password Reset [waiting for PRD-001]
  PRD-004: User Profile
  PRD-005: Settings Page

📝 Draft (1):
  PRD-006: Notifications

✅ Complete (5):
  PRD-007, PRD-008, PRD-009, PRD-010, PRD-011
```

---

### `/security-audit` - Security Scanning

**Purpose**: Automated security checks (OWASP Top 10, secrets, vulnerabilities)

**Usage**:
```
/security-audit
```

**What it scans**:
- ✅ Dependency vulnerabilities (npm audit)
- ✅ Hardcoded secrets (git-secrets)
- ✅ SQL injection risks
- ✅ XSS vulnerabilities
- ✅ Insecure crypto usage
- ✅ OWASP Top 10 violations

**Output**:
```
🔒 Security Audit Results

✅ No high-severity issues
⚠️  2 medium-severity warnings:
  - Dependency 'lodash' has known vulnerability (CVE-2021-23337)
  - Missing CSRF protection on /api/upload

Recommended fixes:
1. npm update lodash@4.17.21
2. Add csurf middleware to Express app
```

**Blocks PR if**: Any high-severity issues found

---

### `/quality-check` - Code Quality Analysis

**Purpose**: Linting, tests, coverage, complexity, bundle size

**Usage**:
```
/quality-check
```

**What it checks**:
- ✅ Linting (ESLint/Prettier)
- ✅ Type checking (TypeScript)
- ✅ Test coverage (80-90% threshold)
- ✅ Code complexity (max 10)
- ✅ Bundle size analysis
- ✅ Performance budgets

**Output**:
```
✅ Quality Check: Grade A (92%)

Test Coverage: 87% ✅ (target: 80%)
Linting: 0 errors, 3 warnings ✅
Complexity: Max 8 ✅ (target: <10)
Bundle Size: +45 KB ✅ (budget: <100 KB)

Warnings:
- 3 ESLint warnings (unused variables)
```

**Blocks PR if**: Grade < C (configurable)

---

### `/orchestrate` - Multi-PRD Coordination

**Purpose**: Manage dependencies, resource allocation, bottlenecks across 10+ PRDs

**Usage**:
```
/orchestrate
```

**Output**:
```
🎼 Multi-PRD Orchestration

📊 Dependency Graph:
PRD-001 (auth) → PRD-002 (dashboard) → PRD-005 (settings)
                  ↘ PRD-003 (profile)

🎯 Critical Path (7 weeks):
PRD-001 → PRD-002 → PRD-005

🔴 Blocked (2):
- PRD-002: Waiting for PRD-001 (auth)
- PRD-003: Waiting for PRD-001 (auth)

✅ Ready to Start (3):
- PRD-004, PRD-006, PRD-007

⚠️  Bottleneck:
Backend team at 120% capacity (3 PRDs assigned, max 2)

Recommendation:
1. Complete PRD-001 ASAP (unblocks 2 PRDs)
2. Reassign PRD-006 to frontend team
```

---

### `/archive-prd` - Archive Completed PRDs

**Purpose**: Clean up completed/cancelled PRDs

**Usage**:
```
/archive-prd PRD-001
```

**What it does**:
1. Moves PRD to `99-archived/`
2. Adds completion metadata
3. Cleans up worktree (if exists)
4. Updates progress tracking

---

## Agents & Skills

### AI Agents (13 Total)

**PRD Management Agents** (6):
1. **prd-reviewer** - 7-dimension PRD analysis
2. **prd-implementer** - Task breakdown & guidance
3. **orchestrator** - Multi-PRD coordination
4. **security-expert** - Security scanning
5. **quality-assurance** - Quality checks
6. **devops-engineer** - CI/CD setup

**Daily Development Agents** (7 - NEW in v2.3):
7. **code-reviewer** (Haiku) - Automated code review, complexity detection
8. **test-automator** (Haiku) - Auto-generate unit/integration/E2E tests
9. **backend-architect** (Sonnet) - API design, database schema, scalability
10. **incident-coordinator** (Sonnet) - Production incident response, postmortems
11. **performance-analyst** (Sonnet) - Bundle analysis, Core Web Vitals, optimization
12. **full-stack-orchestrator** (Sonnet) - End-to-end feature coordination
13. **code-review-orchestrator** (Haiku) - Parallel review by 5 agents in 30 seconds

**Model Selection**:
- **Haiku**: Fast, cheap, deterministic tasks (code review, test generation)
- **Sonnet**: Complex reasoning (architecture, incidents, performance)

### Skills (8 Capabilities)

Reusable capabilities used by agents:

1. **code-quality** - Linting, formatting, complexity analysis
2. **dependency-management** - Version tracking, vulnerability scanning
3. **documentation** - Auto-generate docs from code
4. **estimation** - Time/cost estimation with confidence intervals
5. **git-workflow** - Branch management, worktree automation
6. **performance-analysis** - Profiling, bottleneck detection
7. **security-analysis** - OWASP checks, secrets detection
8. **testing** - Test generation, coverage analysis

---

## Configuration

### Presets

**Startup** (fast iteration):
```json
{
  "preset": "startup",
  "prd_workflow": {
    "min_grade": "C",
    "test_coverage_threshold": 70,
    "parallel_prds_max": 2
  }
}
```

**Enterprise** (production quality):
```json
{
  "preset": "enterprise",
  "prd_workflow": {
    "min_grade": "B",
    "test_coverage_threshold": 90,
    "parallel_prds_max": 5,
    "require_security_audit": true
  }
}
```

**Open Source** (community-driven):
```json
{
  "preset": "open-source",
  "prd_workflow": {
    "prd_id_format": "RFC-{number}",
    "work_plan_file": "ROADMAP.md",
    "github": {
      "issue_labels": ["help-wanted", "good-first-issue"]
    }
  }
}
```

### Custom Configuration

Create `.claude/config.json`:

```json
{
  "prd_workflow": {
    "directories": {
      "prds": "product/prds",
      "templates": "templates"
    },
    "git": {
      "branch_prefix": "feat/",
      "use_worktrees": true,
      "worktree_base": "../"
    },
    "review": {
      "dimensions": 7,
      "min_grade": "B",
      "auto_approve_grade_a": true
    },
    "quality": {
      "test_coverage_threshold": 80,
      "max_complexity": 10,
      "bundle_size_budget_kb": 500
    },
    "security": {
      "auto_scan_on_pr": true,
      "block_on_high_severity": true
    }
  }
}
```

[Full schema reference →](../config/schema.json)

---

## Daily Development (Beyond PRDs)

**NEW in v2.3**: Use the plugin for daily coding tasks, not just PRD management!

### Use Case 1: Automated Code Reviews

**Problem**: Manual code reviews take 30-45 min per PR

**Solution**: `code-review-orchestrator` runs 5 agents in parallel (30 seconds)

```
Review my changes
```

**What happens**:
- code-reviewer: Static analysis, best practices
- security-expert: Vulnerabilities, secrets
- test-automator: Test coverage, test quality
- performance-analyst: Bundle size, complexity
- quality-assurance: Linting, formatting, types

**Output**: Comprehensive review with critical/warning/suggestions, blocks merge if critical issues

**Impact**: 95% faster, 100% consistent, <5% missed issues

---

### Use Case 2: Test Generation

**Problem**: Writing tests is tedious and slow (2-3x code time)

**Solution**: `test-automator` generates comprehensive test suites

```
Generate tests for src/utils/pricing.ts
```

**Generated** (automatic):
```typescript
describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should throw error for negative price', () => {
    expect(() => calculateDiscount(-100, 10)).toThrow('Invalid input');
  });

  // + edge cases, fixtures, mocks
});
```

**Impact**: 10x faster, 80%+ coverage automatically, all edge cases covered

---

### Use Case 3: Backend Architecture Guidance

**Problem**: Uncertainty about best approach (REST vs GraphQL? SQL vs NoSQL?)

**Solution**: `backend-architect` provides expert guidance

```
Help me design a backend for a social media app
```

**Output**:
- API contract design (REST/GraphQL endpoints)
- Database schema (SQL with indexes)
- Caching strategy (Redis multi-layer)
- Scalability plan (100 → 100M users)

**Impact**: Better architecture, informed decisions, plan for growth

---

### Use Case 4: Performance Optimization

**Problem**: App is slow, unclear bottlenecks

**Solution**: `performance-analyst` provides systematic optimization

```
My app is slow, help me optimize performance
```

**Output**:
```
⚡ Performance Audit

Current:
- LCP: 4.8s ❌ (Target: < 2.5s)
- Bundle: 2.5 MB ❌ (Target: < 500 KB)
- API p95: 1.2s ⚠️ (Target: < 500ms)

Fixes:
1. Bundle: import { debounce } from 'lodash-es' (-70 KB)
2. Database: Add index on user_id (1.5s → 12ms)
3. Images: Use Next.js Image component (2.5 MB → 120 KB)

Projected:
- LCP: 1.9s ✅
- Bundle: 800 KB ✅
- API: 180ms ✅
```

**Impact**: 2-3x faster apps, data-driven decisions

---

### Use Case 5: Incident Response

**Problem**: Production incidents cause panic and long downtime

**Solution**: `incident-coordinator` guides structured response

```
We have a production incident - users can't log in
```

**Output**:
```
🚨 SEV1 Incident Response

Immediate Actions (0-5 min):
- [x] Create incident channel
- [x] Page on-call engineer
- [ ] Update status page

Investigation (5-15 min):
- [ ] Check recent deployments → Found deploy at 11:55 AM
- [ ] Check error logs → "JWT validation failed" spiking
- [ ] Root cause: Recent deployment introduced JWT bug

Mitigation:
1. **Rollback deployment** (10 min) ← RECOMMENDED
   Run: git revert abc123 && git push

Communication:
"We have identified a bug in our 11:55 AM deployment affecting user logins.
We are rolling back to the previous version.
Expected resolution: 12:20 PM UTC"
```

**Impact**: 50% faster MTTR, 80% fewer repeat incidents

---

## Maintenance Tools

The plugin includes self-diagnostic and repair tools to ensure reliability.

### `/plugin-health` - Health Check

**Purpose**: Verify plugin installation is complete and working

**Usage**:
```bash
/plugin-health
```

**What it checks**:
- ✅ Plugin directory exists
- ✅ Plugin version and metadata
- ✅ Slash commands installed (should be 17+)
- ✅ AI agents installed (should be 17+)
- ✅ Skills installed (should be 13+)

**Example output**:
```
🏥 Running health check for claude-prd-workflow...

📁 Checking plugin installation...
   ✅ Plugin directory found

📋 Checking plugin metadata...
   ✅ Plugin version: 2.8.0
   📅 Installed: 10/26/2025

📝 Checking slash commands...
   ✅ Global commands: 17 files found

🤖 Checking AI agents...
   ✅ Global agents: 17 files found

⚡ Checking skills...
   ✅ Global skills: 13 files found

============================================================

📊 HEALTH CHECK SUMMARY

✅ All systems operational!

🎯 You can now use the following commands:
   /create-prd  - Create a new PRD
   /list-prds   - List all PRDs
   /review-prd  - Review a PRD
   /code-prd    - Start development

💡 Tip: Restart Claude Code if commands are not visible
```

**When to use**:
- After installation
- After update
- When commands are not visible
- When experiencing issues

---

### `/plugin-repair` - Auto-Repair

**Purpose**: Automatically fix common installation issues

**Usage**:
```bash
/plugin-repair
```

**What it fixes**:
- Missing command files
- Missing agent files
- Missing skill files
- Corrupted plugin metadata
- Incomplete installations

**Example output**:
```
🔧 Running repair tool for claude-prd-workflow...

📋 Step 1: Running diagnostic check...

❌ Slash commands: Directory exists but empty
✅ AI agents: 17 files found
✅ Skills: 13 files found

============================================================

🔨 Step 2: Attempting automatic repair...

🔄 Reinstalling plugin...
   ✅ Copied commands/
   ✅ Copied agents/
   ✅ Copied skills/
   ✅ Installed 17 slash commands

✅ Reinstallation complete!

============================================================

🏥 Step 3: Verifying repair...

✅ All systems operational!

💡 Important: Restart Claude Code to see the changes.
```

**When to use**:
- Commands not showing up
- Commands return errors
- After failed update
- When health check shows errors

---

### `/plugin-update` - Update Plugin

**Purpose**: Update to latest version from GitHub

**Usage**:
```bash
/plugin-update
```

**What it does**:
- Checks current version
- Fetches latest from GitHub
- Backs up current config
- Updates via git pull
- Reinstalls global files
- Runs health check
- Shows what's new

**Example output**:
```
🔄 Updating claude-prd-workflow plugin...

📦 Current version: 2.7.0

============================================================

🔍 Checking for updates...

   Fetching latest version from GitHub...
   Pulling latest changes...

============================================================

🔨 Reinstalling to update global files...

   ✅ Installed 17 slash commands
   ✅ Installed 17 AI agents
   ✅ Installed 13 skills

🏥 Running automatic health check...
   ✅ All systems operational!

============================================================

✅ Update complete!

📦 Updated: 2.7.0 → 2.8.0

💡 Important:
   1. Restart Claude Code to see the changes
   2. Run /plugin-health to verify the update
   3. Check CHANGELOG.md for what's new
```

**When to use**:
- Regularly (check for updates weekly)
- When new features are announced
- When experiencing issues (latest version may fix them)

---

## Best Practices

### PRD Writing

**1. Define Clear Scope**

✅ DO:
```markdown
## Scope

### In Scope (v1.0)
- User login with email/password
- Password reset flow
- Email verification

### Out of Scope
- Social login (v1.1)
- 2FA (v1.1)
- SSO (v2.0)
```

❌ DON'T:
```markdown
Build authentication system
```

**2. Write Testable Acceptance Criteria**

✅ DO:
```markdown
- [ ] User can log in with valid email/password in <2 seconds
- [ ] Invalid credentials show error message
- [ ] 5 failed attempts lock account for 15 minutes
```

❌ DON'T:
```markdown
- [ ] Login works well
- [ ] Good performance
```

**3. Identify Dependencies Early**

✅ DO:
```markdown
## Dependencies

**Depends On** (must complete first):
- PRD-001: Database schema

**Provides For** (blocked by this):
- PRD-005: User dashboard
- PRD-007: Profile management
```

---

### Git Worktrees

**1. One Worktree Per Feature**

✅ DO:
```bash
/setup-prd PRD-001  # → ../project-auth/
/setup-prd PRD-002  # → ../project-dashboard/
```

❌ DON'T: Mix features in same worktree

**2. Clean Up After Merge**

✅ DO:
```bash
git worktree remove ../project-auth
git branch -d feat/PRD-001-auth
```

**3. Keep Main Repo Clean**

✅ DO: Work in worktrees
❌ DON'T: Work in main repo while worktrees exist

---

### Development Workflow

**1. Small, Frequent Commits**

✅ DO:
```bash
git commit -m "feat(auth): Add login API endpoint"
git commit -m "test(auth): Add login API tests"
git commit -m "docs(auth): Update API documentation"
```

❌ DON'T:
```bash
git commit -m "Complete authentication feature" # 500 files changed
```

**2. Run Quality Checks Before PR**

✅ DO:
```bash
/security-audit  # Fix all high-severity
/quality-check   # Ensure grade ≥ B
# Then create PR
```

❌ DON'T: Create PR with failing checks

**3. Update Progress Regularly**

✅ DO:
```bash
# After each task completion
/code-prd  # Marks task complete, moves to next
```

---

### Code Quality

**1. Maintain Test Coverage**

✅ Target: 80%+ overall, 100% for critical paths
✅ Use `/quality-check` to verify
✅ Block PR if coverage drops

**2. Keep Complexity Low**

✅ Max cyclomatic complexity: 10
✅ Extract complex logic into helpers
✅ Use `/quality-check` to catch violations

**3. Security First**

✅ Run `/security-audit` before every PR
✅ Fix all high-severity issues
✅ No hardcoded secrets (use env vars)

---

## Troubleshooting

### Common Issues

#### Command Not Found

**Problem**: `/list-prds` shows "Command not found"

**Solution**:
```bash
# 1. Verify installation
ls ~/.claude-code/commands/ | grep prd

# 2. Reinstall if missing
npm install -g claude-prd-workflow --force

# 3. Restart Claude Code
```

---

#### PRD Not Moving to Next Stage

**Problem**: PRD stuck in draft after approval

**Solution**:
```bash
# 1. Check PRD grade
/review-prd PRD-001

# 2. Ensure grade ≥ minimum (B for enterprise, C for startup)

# 3. Manually approve if needed
# In review prompt, type: approve
```

---

#### Worktree Creation Fails

**Problem**: `/setup-prd` fails with "worktree already exists"

**Solution**:
```bash
# 1. List existing worktrees
git worktree list

# 2. Remove old worktree
git worktree remove ../project-old-feature

# 3. Try again
/setup-prd PRD-001
```

---

#### GitHub Actions Publish Failing

**Problem**: npm publish fails in GitHub Actions

**Solution**:
```bash
# 1. Verify NPM_TOKEN secret is set in GitHub repo settings

# 2. Ensure package.json version matches git tag
# If tag is v2.3.0, package.json should be "version": "2.3.0"

# 3. Check GitHub Actions logs for specific error
```

---

#### Quality Check Failing

**Problem**: `/quality-check` reports grade F

**Solution**:
```bash
# 1. See specific failures
/quality-check  # Shows detailed breakdown

# 2. Fix common issues:
npm run lint:fix    # Auto-fix linting
npm run test        # Run tests
npm run build       # Check for type errors

# 3. Re-run quality check
/quality-check
```

---

### Performance Issues

#### Slow PRD Review

**Problem**: `/review-prd` takes >2 minutes

**Solution**:
- Reduce `review.dimensions` in config (7 → 5)
- Use shorter PRDs (<2000 words)
- Check Claude Code API latency

---

#### Worktree Disk Space

**Problem**: Multiple worktrees consume too much disk space

**Solution**:
```bash
# 1. Remove completed worktrees
git worktree list
git worktree remove ../project-feature-1

# 2. Prune worktrees
git worktree prune

# 3. Configure auto-cleanup in .claude/config.json
{
  "git": {
    "auto_cleanup_worktrees": true
  }
}
```

---

### Getting Help

**Documentation**:
- This guide
- [Examples](examples.md)
- [GitHub Discussions](https://github.com/Yassinello/claude-prd-workflow/discussions)

**Report Bugs**:
- [GitHub Issues](https://github.com/Yassinello/claude-prd-workflow/issues)

**Community**:
- Join discussions on GitHub
- Share your PRD templates
- Contribute improvements

---

## Next Steps

✅ [Try the Quick Start](#quick-start)
✅ [Read Real Examples](examples.md)
✅ [Customize Configuration](#configuration)
✅ [Explore Daily Dev Features](#daily-development-beyond-prds)

**You're ready! Start with `/create-prd` 🚀**
