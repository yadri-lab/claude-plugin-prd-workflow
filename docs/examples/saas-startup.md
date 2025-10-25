# SaaS Startup - Fast-Paced Development Example

**Project Type**: B2B SaaS MVP
**Team Size**: 2-4 developers
**Tech Stack**: Next.js, PostgreSQL, Prisma, Stripe, NextAuth
**Deployment**: Vercel
**Timeline**: 3 months to launch

---

## Overview

This example demonstrates how a fast-moving SaaS startup uses the PRD Workflow Manager with **lenient settings** to ship features quickly while maintaining minimum quality standards.

**Key Characteristics**:
- Speed over perfection (MVP mindset)
- Lower test coverage threshold (70%)
- Coarser task granularity (faster breakdown)
- Fewer review dimensions (5 instead of 7)
- Grade C minimum (instead of B)
- Parallel development (2 features max)

---

## Configuration

Using the **Startup Preset** as a base:

### `.claude/config.json`

```json
{
  "$schema": "../config/schema.json",
  "prd_workflow": {
    "enabled": true,
    "directories": {
      "draft": "docs/prds/draft",
      "review": "docs/prds/review",
      "ready": "docs/prds/ready",
      "in_progress": "docs/prds/in-progress",
      "complete": "docs/prds/complete",
      "archived": "docs/prds/archived"
    },
    "branch_naming": {
      "prefix": "feat",
      "prd_id_format": "PRD-{number}",
      "separator": "-"
    },
    "worktree": {
      "enabled": true,
      "parent_directory": "..",
      "naming_pattern": "{project}-{feature}",
      "auto_install_dependencies": true,
      "auto_open_editor": true
    },
    "github": {
      "enabled": true,
      "create_issue_on_approval": true,
      "issue_labels": ["mvp", "feature", "P0", "P1"],
      "auto_assign": true
    },
    "review": {
      "dimensions": [
        "Clarity & Scope",
        "Technical Feasibility",
        "User Experience",
        "Acceptance Criteria",
        "Simplification Opportunities"
      ],
      "grading_enabled": true,
      "minimum_grade": "C",
      "require_approval": true,
      "calibration_questions": true
    },
    "work_plan": {
      "enabled": true,
      "file_path": "docs/ROADMAP.md",
      "update_on_status_change": true
    }
  },
  "security": {
    "enabled": true,
    "auto_scan_on_commit": false,
    "scan_dependencies": true,
    "scan_code": false,
    "fail_on_high_severity": true
  },
  "quality": {
    "enabled": true,
    "linting": {
      "enabled": true,
      "auto_fix": true,
      "fail_on_error": false
    },
    "testing": {
      "enabled": true,
      "auto_run": false,
      "coverage_threshold": 70,
      "required_for_pr": false
    },
    "code_complexity": {
      "enabled": true,
      "max_complexity": 15,
      "warn_threshold": 12
    }
  },
  "orchestration": {
    "enabled": true,
    "parallel_features": 2,
    "dependency_resolution": true,
    "auto_merge_strategy": "squash"
  },
  "agents": {
    "prd_reviewer": {
      "enabled": true,
      "auto_invoke": false,
      "strictness": "lenient"
    },
    "prd_implementer": {
      "enabled": true,
      "task_breakdown_granularity": "coarse"
    }
  }
}
```

**Key Differences from Default**:
- ✅ Lower test coverage (70% vs 80%)
- ✅ Fewer review dimensions (5 vs 7)
- ✅ Lower minimum grade (C vs B)
- ✅ Coarse task granularity (faster breakdowns)
- ✅ Auto-fix linting errors
- ✅ Don't fail on linting errors
- ✅ Tests not required for PRs (recommended but not blocking)
- ✅ Max 2 parallel features (smaller team)

---

## Project: "InvoiceFlow" - Invoicing SaaS for Freelancers

### Product Vision

**Problem**: Freelancers waste 5+ hours/week manually creating and tracking invoices.

**Solution**: InvoiceFlow - Beautiful, automated invoicing in 30 seconds. Pay-as-you-go pricing.

**MVP Features** (Launch in 3 months):
1. Authentication (Google OAuth)
2. Client Management
3. Invoice Creation & Templates
4. Payment Tracking
5. Stripe Billing
6. Email Notifications

---

## Week 1-2: Foundation

### PRD-001: Authentication System

**Created**: `docs/prds/draft/251201-auth-system-v1.md`

**Executive Summary**:
> Implement Google OAuth authentication with NextAuth.js. Users can sign up, log in, and manage their profile. Session management with JWT tokens.

**Review Output** (after `/review-prd`):
```
Grade: C+

Strengths:
✅ Clear scope (Google OAuth only, no email/password)
✅ Well-defined acceptance criteria
✅ Solid technical approach (NextAuth.js)

Gaps:
⚠️ No mention of session expiry handling
⚠️ Missing error handling for OAuth failures

Calibration Questions:
1. What happens if Google OAuth is down?
2. How long should sessions last?
3. Do we need "Remember me" functionality?

Recommendation: APPROVE with notes
```

**Updated PRD** (after Q&A):
- Session expiry: 30 days
- OAuth failure: Show friendly error, allow retry
- No "Remember me" (session is 30 days by default)

**Moved to**: `docs/prds/ready/`
**GitHub Issue**: #1 created

---

### Implementation (PRD-001)

**Command**: `/code-prd`

**Worktree Created**: `../invoiceflow-auth/`

**Tasks** (Coarse granularity):

1. **NextAuth Setup** (2h)
   - Install dependencies
   - Configure Google OAuth
   - Set up session management

2. **Protected Routes** (1h)
   - Middleware for auth checks
   - Redirect logic

3. **UI Components** (2h)
   - Login page
   - Profile page
   - Logout button

4. **Testing** (1h)
   - Auth flow tests
   - Session tests

**Total Estimate**: 6 hours (1 day)

**Actual Time**: 7 hours (close enough for MVP!)

**Test Coverage**: 72% ✅ (threshold: 70%)

**Quality Check**:
```bash
/quality-check
```
**Grade**: B

**PR**: Merged in 1 day

---

## Week 3-4: Core Features

### PRD-002: Client Management

**Fast-tracked** - Minimal review (C grade acceptable)

**Key Implementation Decisions**:
- PostgreSQL with Prisma ORM
- Simple CRUD (no advanced features)
- Client schema: name, email, company, address
- No client tags/categories (defer to v2)

**Test Coverage**: 71% ✅

**Time**: 2 days (PR merged)

---

### PRD-003: Invoice Creation

**Parallel Development** with PRD-002 using worktrees:

```bash
git worktree list
# ../invoiceflow/                 [main]
# ../invoiceflow-auth/            [feat/PRD-001-auth-system]
# ../invoiceflow-clients/         [feat/PRD-002-client-management]
# ../invoiceflow-invoices/        [feat/PRD-003-invoice-creation]
```

**Orchestration**:
```bash
/orchestrate
```

**Output**:
```
Active Features (2):
1. PRD-002: Client Management (80% complete)
2. PRD-003: Invoice Creation (20% complete, BLOCKED by PRD-002)

Recommendation: Complete PRD-002 first (1 day), then unblock PRD-003.
```

**Invoice Features** (MVP scope):
- Line items (description, quantity, rate, amount)
- Subtotal, tax, total calculation
- Invoice status: Draft, Sent, Paid, Overdue
- PDF generation (simple template)
- No recurring invoices (v2)
- No multi-currency (USD only for MVP)

**Test Coverage**: 68% ⚠️ (below threshold)
**Decision**: Merge anyway (MVP urgency), add to backlog

---

## Week 5-6: Monetization

### PRD-004: Stripe Billing

**Priority**: P0 (can't launch without payments!)

**Review Grade**: B- (better than usual because it's critical)

**Stripe Integration**:
- Subscription model: $9/month for unlimited invoices
- Free tier: 5 invoices/month
- Stripe Checkout for onboarding
- Webhook handling for subscription events

**Security Audit** (first time!):
```bash
/security-audit
```

**Output**:
```
🔒 Security Audit Report

✅ Dependencies: No vulnerabilities
❌ Code: 2 issues found

HIGH SEVERITY (1):
- Stripe webhook signature not verified
  File: app/api/webhooks/stripe/route.ts:15
  Fix: Use stripe.webhooks.constructEvent()

MEDIUM SEVERITY (1):
- API key in environment variable (good) but no validation
  File: lib/stripe.ts:3
  Fix: Add runtime validation

Recommendation: Fix HIGH severity before merging.
```

**Fixed**: Verified webhook signatures before merging ✅

**Test Coverage**: 75% ✅ (above threshold because billing is critical)

---

## Week 7-8: Polish

### PRD-005: Email Notifications

**Scope**:
- Invoice sent → Email to client with PDF attachment
- Payment received → Email to user
- Subscription expiring → Email to user (7 days before)

**Tech Stack**: Resend (transactional emails)

**Review Grade**: C (acceptable)

**Simplification** (from calibration questions):
- ❌ No email templates editor (use hardcoded templates)
- ❌ No email scheduling (send immediately)
- ✅ Simple, transactional emails only

**Test Coverage**: 69% ⚠️ (slightly below threshold)
**Decision**: Merge (non-critical feature, can improve later)

---

## Launch Readiness

### Quality Overview

```bash
/quality-check
```

**Aggregate Stats**:
- **Total PRDs**: 5 (all complete)
- **Test Coverage**: 71% average (target: 70%) ✅
- **Security Issues**: 0 high, 2 medium (documented, accepted)
- **Code Complexity**: Average 8.5 (max: 15) ✅
- **Build Status**: ✅ Passing
- **Deployment**: ✅ Vercel production ready

**Overall Grade**: B-

**Launch Decision**: ✅ SHIP IT

---

## Post-Launch Learnings

### What Worked ✅

1. **Lenient Review** - Didn't over-engineer, shipped fast
2. **Coarse Tasks** - Less planning overhead, more coding
3. **Worktrees** - Parallel work was crucial with 2 devs
4. **Security Audits** - Caught critical webhook issue
5. **Grade C Minimum** - Prevented complete chaos while staying fast

### What Didn't Work ❌

1. **Test Coverage** - 70% was too low; hit bugs in production
2. **No Code Scanning** - Should have enabled ESLint security plugin
3. **PRD Scope Creep** - Even with review, some PRDs grew (Invoice Creation)
4. **Manual Quality Checks** - Should have automated in CI/CD

---

## Recommended Adjustments After Launch

### Phase 2 Config (Post-Launch Stability)

**Changes**:
```json
{
  "quality": {
    "testing": {
      "coverage_threshold": 75,
      "required_for_pr": true
    }
  },
  "security": {
    "scan_code": true,
    "auto_scan_on_commit": true
  },
  "prd_workflow": {
    "review": {
      "minimum_grade": "B"
    }
  }
}
```

**Rationale**: Now that we've launched, we can afford to slow down slightly for better quality.

---

## Metrics

### Development Velocity

**Timeline**:
- Week 1-2: PRD-001 (Auth)
- Week 3-4: PRD-002 (Clients) + PRD-003 (Invoices) - PARALLEL
- Week 5-6: PRD-004 (Billing)
- Week 7-8: PRD-005 (Emails)
- **Total**: 8 weeks (ahead of 12-week goal!)

**Throughput**:
- 5 PRDs in 8 weeks = 0.625 PRDs/week
- Average cycle time: 1.6 weeks/PRD
- Parallelization: 40% of work done in parallel

### Quality vs. Speed Trade-offs

**Tests Below Threshold**:
- PRD-003: 68% (merged anyway)
- PRD-005: 69% (merged anyway)
- **Decision**: Worth it for speed, but created tech debt

**Post-Launch Bugs**:
- 3 bugs in production (all from low-coverage areas)
- 0 security incidents (security audit FTW!)
- 0 critical bugs (quality gates prevented disasters)

---

## Tips for Fast-Moving Startups

### DO ✅

1. **Use Startup Preset** - Optimized for speed
2. **Enable Worktrees** - Parallel work is essential
3. **Keep PRDs Short** - 1-2 pages max
4. **Review Every PRD** - Even C grade is better than no review
5. **Security Audit Critical Paths** - Especially billing/auth
6. **Accept Tech Debt** - Document it, prioritize later
7. **Ship Fast, Iterate** - Perfect is the enemy of done

### DON'T ❌

1. **Skip Review Entirely** - Even fast review prevents disasters
2. **Disable Security Scanning** - Always scan dependencies
3. **Set Coverage to 0%** - Minimum 60-70% is reasonable
4. **Ignore High Severity Issues** - Fix before merging
5. **Over-Parallelize** - Max 2-3 features for small teams
6. **Defer ALL Testing** - Critical paths need tests

---

## Sample PRD (Simplified)

**PRD-003: Invoice Creation** (abridged)

```markdown
# PRD-003: Invoice Creation

**Status**: Complete
**Priority**: P0
**Effort**: 8 story points

## Executive Summary

Users can create professional invoices with line items, tax calculations, and PDF export. Invoices have statuses (Draft, Sent, Paid, Overdue).

## Problem

Freelancers spend 30+ minutes manually formatting invoices in Word/Google Docs.

## Solution

Simple invoice builder with automatic calculations and PDF generation.

## Scope

### In Scope ✅
- Line items (description, qty, rate)
- Tax calculation (single tax rate)
- Status management
- PDF generation (basic template)

### Out of Scope ❌
- Multi-currency (USD only)
- Recurring invoices (v2)
- Custom templates (v2)
- Late fees (v2)

## Technical Approach

**Stack**: Prisma, React Hook Form, jsPDF

**Schema**:
```prisma
model Invoice {
  id          String   @id @default(cuid())
  userId      String
  clientId    String
  number      String
  date        DateTime
  dueDate     DateTime
  status      InvoiceStatus
  lineItems   LineItem[]
  subtotal    Decimal
  tax         Decimal
  total       Decimal
}
```

## Acceptance Criteria

1. ✅ User can add/edit/remove line items
2. ✅ Totals auto-calculate
3. ✅ Can save as draft
4. ✅ Can mark as sent/paid
5. ✅ PDF downloads correctly

## Risks

- PDF generation might be slow for large invoices (100+ line items)
  - Mitigation: Limit to 50 line items for MVP

## Estimate

**Effort**: 8 story points (2-3 days)

## Success Metrics

- Time to create invoice: <2 minutes
- PDF generation: <3 seconds
```

---

## Next Steps

**Immediate Backlog** (Post-Launch v1.1):
- PRD-006: Fix test coverage gaps (tech debt)
- PRD-007: Invoice templates (customer request)
- PRD-008: Dashboard analytics
- PRD-009: Recurring invoices

**Future** (v2.0):
- Multi-currency
- Expense tracking
- Time tracking
- Mobile app

**Growth Strategy**:
- Launch on Product Hunt
- Content marketing (SEO)
- Freemium conversion optimization
