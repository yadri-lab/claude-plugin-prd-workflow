# E-commerce Platform - Enterprise-Grade Example

**Project Type**: Multi-vendor E-commerce Marketplace
**Team Size**: 8-12 developers
**Tech Stack**: Next.js, PostgreSQL, Redis, Elasticsearch, Stripe Connect, AWS S3
**Deployment**: AWS (ECS, RDS, ElastiCache, CloudFront)
**Scale**: 100K+ products, 10K+ daily orders

---

## Overview

This example demonstrates how a large e-commerce platform uses the PRD Workflow Manager with **strict enterprise settings** to ensure quality, security, and compliance at scale.

**Key Characteristics**:
- Quality over speed (production stability is critical)
- High test coverage (90%)
- Comprehensive review (10 dimensions)
- Grade B minimum (strict quality bar)
- Parallel development (up to 5 features)
- Mandatory security scans
- Compliance tracking (PCI-DSS, GDPR)

---

## Configuration

Using the **Enterprise Preset** with additional customizations:

### `.claude/config.json`

```json
{
  "$schema": "../config/schema.json",
  "prd_workflow": {
    "enabled": true,
    "directories": {
      "draft": "product/prds/01-draft",
      "review": "product/prds/02-review",
      "ready": "product/prds/03-ready",
      "in_progress": "product/prds/04-in-progress",
      "complete": "product/prds/05-complete",
      "archived": "product/prds/99-archived"
    },
    "branch_naming": {
      "prefix": "feat",
      "prd_id_format": "PRD-{number}",
      "separator": "-"
    },
    "worktree": {
      "enabled": true,
      "parent_directory": "../worktrees",
      "naming_pattern": "{project}-{prd_id}-{feature}",
      "auto_install_dependencies": true,
      "auto_open_editor": false
    },
    "github": {
      "enabled": true,
      "create_issue_on_approval": true,
      "issue_labels": ["feature", "P0", "P1", "P2", "compliance", "security"],
      "auto_assign": true,
      "milestone_tracking": true,
      "required_reviewers": 2
    },
    "review": {
      "dimensions": [
        "Clarity & Scope",
        "Technical Feasibility",
        "User Experience",
        "Dependencies & Blockers",
        "Acceptance Criteria",
        "Risk Assessment",
        "Simplification Opportunities",
        "Compliance & Regulatory",
        "Security Impact",
        "Performance Impact"
      ],
      "grading_enabled": true,
      "minimum_grade": "B",
      "require_approval": true,
      "calibration_questions": true,
      "require_architecture_decision": true
    },
    "work_plan": {
      "enabled": true,
      "file_path": "product/WORK_PLAN.md",
      "update_on_status_change": true,
      "track_decisions": true
    }
  },
  "security": {
    "enabled": true,
    "auto_scan_on_commit": true,
    "scan_dependencies": true,
    "scan_code": true,
    "fail_on_high_severity": true,
    "fail_on_medium_severity": true,
    "tools": {
      "npm_audit": true,
      "eslint_security": true,
      "git_secrets": true,
      "snyk": true,
      "sonarqube": true
    },
    "compliance": {
      "pci_dss": true,
      "gdpr": true,
      "sox": true
    }
  },
  "quality": {
    "enabled": true,
    "auto_format_on_save": true,
    "linting": {
      "enabled": true,
      "auto_fix": false,
      "fail_on_error": true,
      "fail_on_warning": true
    },
    "testing": {
      "enabled": true,
      "auto_run": true,
      "coverage_threshold": 90,
      "required_for_pr": true,
      "mutation_testing": true
    },
    "code_complexity": {
      "enabled": true,
      "max_complexity": 8,
      "warn_threshold": 5
    },
    "performance": {
      "bundle_size_limit": "200kb",
      "lighthouse_score_min": 90,
      "core_web_vitals": true
    }
  },
  "orchestration": {
    "enabled": true,
    "parallel_features": 5,
    "dependency_resolution": true,
    "auto_merge_strategy": "merge",
    "conflict_resolution": "manual",
    "staging_deployment": true,
    "feature_flags": true
  },
  "agents": {
    "prd_reviewer": {
      "enabled": true,
      "auto_invoke": true,
      "strictness": "strict"
    },
    "prd_implementer": {
      "enabled": true,
      "task_breakdown_granularity": "fine"
    },
    "security_expert": {
      "enabled": true,
      "scan_frequency": "on_commit",
      "owasp_compliance": true
    },
    "quality_assurance": {
      "enabled": true,
      "check_frequency": "on_commit"
    },
    "devops_engineer": {
      "enabled": true,
      "auto_setup_ci": true,
      "infrastructure_as_code": true
    }
  },
  "notifications": {
    "enabled": true,
    "slack": {
      "channel": "#engineering",
      "notify_on": ["prd_approved", "pr_merged", "deployment", "security_alert"]
    },
    "email": {
      "enabled": true,
      "recipients": ["tech-lead@company.com", "security@company.com"]
    }
  }
}
```

---

## Project: "MarketHub" - Multi-Vendor Marketplace

### Product Vision

**Mission**: Connect millions of buyers with thousands of sellers in a trusted, secure marketplace.

**Scale Requirements**:
- 100,000+ products
- 10,000+ daily orders
- 1,000+ active vendors
- 99.9% uptime SLA
- <2s page load time
- PCI-DSS compliant
- GDPR compliant

---

## Q1 2025: Payment Infrastructure Overhaul

### PRD-042: Stripe Connect Multi-Vendor Payments

**Priority**: P0 (critical for marketplace model)
**Complexity**: Very High
**Effort**: 55 story points (6-8 weeks)
**Team**: 3 developers

---

#### Step 1: Draft Creation

**Created**: `product/prds/01-draft/250115-stripe-connect-v1.md`

**Executive Summary** (150 lines):
```markdown
# PRD-042: Stripe Connect Multi-Vendor Payments

## Executive Summary

Implement Stripe Connect to enable marketplace payments where sellers receive
direct payouts while platform takes a commission. Supports onboarding,
identity verification, payment routing, refunds, and compliance reporting.

**Impact**: $2M+ annual revenue from commissions

## Problem Statement

Current payment system doesn't support:
1. Direct seller payouts (we manually process via bank transfer)
2. Commission splitting (manual reconciliation)
3. Vendor onboarding (no KYC/identity verification)
4. Refund handling (complex manual process)
5. Compliance reporting (manual exports for tax reporting)

**Pain Points**:
- Manual processing: 40 hours/week (finance team)
- Payout delays: 7-14 days (vendors complain)
- Refund errors: 5% error rate
- Compliance risk: Manual processes not auditable

## Proposed Solution

Stripe Connect with "Platform + Connect Accounts" model.

**Key Components**:
1. Vendor Onboarding (Stripe Connect onboarding flow)
2. Payment Routing (application_fee for commission)
3. Identity Verification (KYC via Stripe)
4. Payout Management (automatic daily/weekly payouts)
5. Refund Handling (automated, proportional splits)
6. Reporting Dashboard (compliance, tax forms)

**Technical Architecture**:
- Stripe Connect Standard accounts (easier onboarding)
- Express accounts for small vendors
- Platform fees: 5% + Stripe fees
- Webhooks for async event handling
- Idempotent payment processing

[... 100+ more lines with schemas, flows, acceptance criteria, risks ...]
```

---

#### Step 2: Comprehensive Review

**Command**: `/review-prd`

**Review Process** (45 minutes):

**Auto-invoked Agent**: `prd-reviewer` (strictness: strict)

**Analysis Output**:

```markdown
# PRD Review Report: PRD-042

## Overall Grade: B+

### Dimension Scores

1. **Clarity & Scope**: A
   - ✅ Crystal clear problem statement
   - ✅ Well-defined boundaries (Connect Standard vs Express)
   - ✅ Explicit out-of-scope items listed

2. **Technical Feasibility**: B
   - ✅ Solid architecture (webhooks, idempotency)
   - ⚠️ Missing: Webhook retry strategy
   - ⚠️ Missing: Rate limiting considerations
   - ❌ No mention of Stripe API versioning strategy

3. **User Experience**: A-
   - ✅ Smooth onboarding flow (screenshots included)
   - ✅ Clear error handling
   - ⚠️ Missing: What happens if vendor's bank rejects payout?

4. **Dependencies & Blockers**: B
   - ✅ Dependencies listed (PRD-038: Vendor Dashboard)
   - ⚠️ Missing: Database migration strategy (payment tables)
   - ❌ No rollback plan if Stripe Connect fails post-launch

5. **Acceptance Criteria**: A
   - ✅ Comprehensive (28 criteria)
   - ✅ Testable and measurable
   - ✅ Includes compliance requirements

6. **Risk Assessment**: C+
   - ✅ Technical risks identified
   - ⚠️ Missing: Financial risk (what if commission calculation is wrong?)
   - ❌ No disaster recovery plan
   - ❌ Missing: Impact if Stripe has downtime

7. **Simplification Opportunities**: B
   - ✅ Deferred Custom accounts (good call)
   - ⚠️ Could defer multi-currency to v2?
   - ⚠️ Reporting dashboard seems complex for v1

8. **Compliance & Regulatory**: B+
   - ✅ PCI-DSS compliance via Stripe (excellent)
   - ✅ GDPR data handling addressed
   - ✅ Tax reporting (1099-K) mentioned
   - ⚠️ Missing: SOX compliance for financial reporting
   - ⚠️ No mention of dispute/chargeback handling

9. **Security Impact**: B
   - ✅ Webhook signature verification
   - ✅ Idempotency keys for payment safety
   - ⚠️ Missing: How are Stripe API keys stored/rotated?
   - ❌ No mention of fraud detection integration

10. **Performance Impact**: C+
    - ⚠️ Webhook processing could block checkout flow
    - ❌ No load testing plan
    - ❌ Missing: What if 1000 vendors onboard simultaneously?
    - ❌ No database indexing strategy mentioned

## Critical Gaps

### High Priority 🔴

1. **API Versioning**: How will we handle Stripe API version upgrades?
2. **Disaster Recovery**: What if Stripe Connect goes down during checkout?
3. **Fraud Detection**: How do we prevent fraudulent vendor signups?
4. **Load Testing**: Payment infrastructure MUST be load tested before launch

### Medium Priority 🟡

1. **Webhook Retry**: Need exponential backoff strategy
2. **Rollback Plan**: How to revert to old payment system if needed?
3. **SOX Compliance**: Financial reporting requirements
4. **Multi-currency**: Can this be deferred to v2?

## Calibration Questions

1. **Stripe API Versioning**: How will we handle backwards-incompatible changes?
   - Proposed Answer: Pin to specific version, upgrade via feature flag

2. **Webhook Failures**: What if webhooks fail 3 times?
   - Proposed Answer: Alert on-call engineer, manual reconciliation

3. **Fraud Prevention**: How do we prevent shell vendor accounts?
   - Proposed Answer: Manual review for first 100 vendors, then automate

4. **Disaster Recovery**: If Stripe is down, can customers still checkout?
   - Proposed Answer: Fallback to "payment pending" flow, process async

5. **Performance**: Can our DB handle 10K concurrent payment webhook calls?
   - Proposed Answer: Load test with 50K RPS, use queue (SQS)

6. **Financial Risk**: What if commission calculation has a bug?
   - Proposed Answer: Dry-run mode for 1 week, compare against manual calc

7. **Rollback**: Can we revert to old system if Stripe Connect fails?
   - Proposed Answer: Feature flag, keep old payment code for 3 months

## Recommendations

### Must Address Before Approval ✋

1. Add disaster recovery plan (Stripe downtime scenario)
2. Define load testing strategy (10K RPS minimum)
3. Add fraud detection integration (Stripe Radar)
4. Document API versioning strategy

### Should Address (Can Update During Implementation) 👍

1. Webhook retry strategy
2. Database indexing plan
3. SOX compliance requirements
4. Rollback plan details

### Nice to Have (Defer to v2) 💡

1. Multi-currency support
2. Advanced reporting dashboard
3. Subscription billing via Connect

## Decision

**Status**: ⏸️ HOLD - Address 4 critical items, then re-review

**Expected Re-Review**: Tomorrow (after updates)
```

---

#### Step 3: Update PRD with Q&A

**Updated PRD** (now 200 lines):

Added sections:
- **Disaster Recovery**: Fallback payment flow, degraded mode
- **Load Testing**: Target 50K RPS, use SQS for webhook processing
- **Fraud Detection**: Integrate Stripe Radar, manual review for new vendors
- **API Versioning**: Pin to `2024-11-20`, feature-flagged upgrades
- **Rollback Plan**: Feature flag, parallel run for 2 weeks
- **Database Indexing**: Indexes on `payment_intent_id`, `vendor_id`, `created_at`
- **SOX Compliance**: Automated reconciliation reports, audit logs

**Re-Review Grade**: A-

**Status**: ✅ APPROVED

**Moved to**: `product/prds/03-ready/`

**GitHub Issue**: #142 created with milestone `Q1-2025`

**Architecture Decision Record**: `product/decisions/ADR-012-stripe-connect.md` created

---

#### Step 4: Implementation Planning

**Command**: `/code-prd`

**Worktree**: `../worktrees/markethub-PRD-042-stripe-connect/`

**Task Breakdown** (fine granularity - 42 tasks!):

##### Phase 1: Foundation (Week 1-2)

**Task 1**: Database schema migration (4h)
```sql
-- migrations/20250115_stripe_connect.sql
CREATE TABLE vendor_stripe_accounts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  stripe_account_id TEXT UNIQUE NOT NULL,
  account_type TEXT CHECK(account_type IN ('standard', 'express')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  charges_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendor_stripe_accounts_vendor_id ON vendor_stripe_accounts(vendor_id);
CREATE INDEX idx_vendor_stripe_accounts_stripe_account_id ON vendor_stripe_accounts(stripe_account_id);

CREATE TABLE platform_payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  payment_intent_id TEXT UNIQUE NOT NULL,
  vendor_stripe_account_id UUID REFERENCES vendor_stripe_accounts(id),
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  vendor_payout_cents INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_platform_payments_order_id ON platform_payments(order_id);
CREATE INDEX idx_platform_payments_payment_intent_id ON platform_payments(payment_intent_id);
CREATE INDEX idx_platform_payments_vendor_stripe_account_id ON platform_payments(vendor_stripe_account_id);
CREATE INDEX idx_platform_payments_created_at ON platform_payments(created_at);
```

**Task 2**: Stripe Connect SDK integration (2h)
**Task 3**: Webhook endpoint setup (3h)
**Task 4**: Idempotency middleware (2h)
**Task 5**: Feature flag setup (`stripe_connect_enabled`) (1h)

##### Phase 2: Vendor Onboarding (Week 3-4)

**Task 6**: Onboarding API endpoint (4h)
```typescript
// app/api/vendors/onboarding/route.ts
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20', // Pinned version
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.vendorId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await req.json(); // 'standard' or 'express'

  try {
    // Create Connect account
    const account = await stripe.accounts.create({
      type: type === 'express' ? 'express' : 'standard',
      country: 'US',
      email: session.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // TODO: Support 'company'
    });

    // Save to database
    await db.vendorStripeAccount.create({
      data: {
        vendorId: session.user.vendorId,
        stripeAccountId: account.id,
        accountType: type,
      },
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/vendor/onboarding/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/vendor/onboarding/complete`,
      type: 'account_onboarding',
    });

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect onboarding error:', error);
    return Response.json({ error: 'Onboarding failed' }, { status: 500 });
  }
}
```

**Task 7**: Onboarding UI flow (6h)
**Task 8**: KYC verification status polling (3h)
**Task 9**: Tests for onboarding (4h)

##### Phase 3: Payment Processing (Week 5-6)

**Task 10-20**: Payment intent creation, charge capture, commission calculation, refund handling, etc. (40h total)

##### Phase 4: Webhooks (Week 7)

**Task 21**: Webhook signature verification (2h)
```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Queue event for async processing (SQS)
  await queueWebhookEvent(event);

  return Response.json({ received: true });
}
```

**Task 22**: SQS queue integration (4h)
**Task 23**: Webhook event handlers (8h)
**Task 24**: Retry logic with exponential backoff (3h)
**Task 25**: Dead letter queue for failed webhooks (2h)

##### Phase 5: Security & Compliance (Week 8)

**Task 26**: Stripe Radar integration (fraud detection) (4h)
**Task 27**: API key rotation strategy (2h)
**Task 28**: Audit logging for all payment events (3h)
**Task 29**: SOX compliance reports (4h)
**Task 30**: GDPR data export for vendor payment data (3h)

##### Phase 6: Testing (Week 9-10)

**Task 31**: Unit tests (coverage target: 95%) (12h)
**Task 32**: Integration tests (Stripe test mode) (8h)
**Task 33**: Load testing (Artillery, 50K RPS) (6h)
**Task 34**: Chaos engineering (simulate Stripe downtime) (4h)
**Task 35**: Security testing (OWASP) (4h)
**Task 36**: Mutation testing (Stryker) (3h)

##### Phase 7: Dry Run (Week 11)

**Task 37**: Parallel run (old + new system, compare results) (8h)
**Task 38**: Manual QA (finance team validation) (4h)
**Task 39**: Performance profiling (3h)
**Task 40**: Documentation (internal wiki) (4h)

##### Phase 8: Deployment (Week 12)

**Task 41**: Feature flag rollout (0% → 10% → 50% → 100%) (1 week)
**Task 42**: Monitoring dashboard (Datadog) (4h)

**Total Tasks**: 42
**Total Estimate**: 150 hours (6-8 weeks with 3 developers)

---

#### Step 5: Continuous Quality Checks

**Auto-scan on every commit**:

```bash
git commit -m "feat(PRD-042): Add webhook signature verification"
# Automatically triggers:
# 1. /security-audit
# 2. /quality-check
# 3. Unit tests
# 4. Linting
```

**Security Audit Output** (Task 21 commit):
```
🔒 Security Audit Report

✅ Dependencies: No vulnerabilities (scanned 1,247 packages)
✅ Code: No issues found
✅ Secrets: No secrets detected
✅ OWASP Top 10: All checks passed

Compliance:
✅ PCI-DSS: Level 1 compliant (via Stripe)
✅ GDPR: Data handling compliant
✅ SOX: Audit logs enabled

Grade: A+
```

**Quality Check Output**:
```
📊 Quality Check Report

✅ Linting: 0 errors, 0 warnings
✅ TypeScript: 0 errors
✅ Tests: 247 passing, 0 failing (94% coverage)
⚠️ Complexity: 1 function exceeds threshold
    - processRefundWebhook: complexity 12 (max: 8)
    - Suggestion: Extract helper functions

✅ Performance: Bundle size +8 KB (within limit)
✅ Lighthouse: 95/100 (target: 90)

Grade: A-

Recommendation: Refactor processRefundWebhook before merging.
```

**Refactored**: Complexity reduced to 6 ✅

---

#### Step 6: Load Testing (Task 33)

**Artillery Configuration**:
```yaml
# load-test/stripe-webhooks.yml
config:
  target: "https://staging.markethub.com"
  phases:
    - duration: 60
      arrivalRate: 100 # 100 RPS
    - duration: 120
      arrivalRate: 500 # Ramp to 500 RPS
    - duration: 300
      arrivalRate: 1000 # Sustained 1K RPS

scenarios:
  - name: "Webhook processing"
    flow:
      - post:
          url: "/api/webhooks/stripe"
          headers:
            stripe-signature: "{{ signature }}"
          json:
            type: "payment_intent.succeeded"
            data:
              object:
                id: "pi_{{ $randomString() }}"
                amount: 10000
```

**Results**:
```
Load Test Report
────────────────
Scenarios launched: 420,000
Scenarios completed: 419,987
Requests completed: 419,987

Response times:
  min: 42ms
  max: 1,247ms
  median: 156ms
  p95: 320ms
  p99: 890ms

Status codes:
  200: 419,987 (100%)

Throughput: 1,399 RPS (target: 1,000 RPS) ✅

SQS Queue Depth: Peak 2,340 messages (processed within 5s) ✅

Database:
  Connections: 87 / 100 (healthy) ✅
  Query latency p99: 12ms ✅

✅ PASSED - System can handle 10K concurrent orders/minute
```

---

#### Step 7: Parallel Run (Task 37)

**Strategy**: Run old and new payment systems side-by-side for 1 week, compare results.

**Implementation**:
```typescript
// lib/payments/process-payment.ts
import { featureFlags } from '@/lib/feature-flags';

export async function processPayment(order: Order) {
  const useStripeConnect = await featureFlags.isEnabled('stripe_connect_enabled');

  if (useStripeConnect) {
    // New system (Stripe Connect)
    const result = await processStripeConnectPayment(order);

    // Parallel run: Also process with old system, compare
    if (process.env.PARALLEL_RUN === 'true') {
      const oldResult = await processLegacyPayment(order);
      await compareResults(result, oldResult); // Log discrepancies
    }

    return result;
  } else {
    // Old system (fallback)
    return await processLegacyPayment(order);
  }
}
```

**Parallel Run Results** (1 week):
```
Parallel Run Report
───────────────────
Orders processed: 42,387

Matches: 42,381 (99.986%) ✅
Discrepancies: 6 (0.014%)

Discrepancy Analysis:
1. Commission rounding differences (5 orders) - ACCEPTABLE
2. Webhook timing delay (1 order) - ACCEPTABLE

Recommendation: ✅ PROCEED with full rollout
```

---

#### Step 8: Feature Flag Rollout (Task 41)

**Week 12 Schedule**:

**Monday**: 10% rollout (internal orders only)
```bash
featureFlags.set('stripe_connect_enabled', {
  percentage: 10,
  filter: { internal: true }
});
```

**Wednesday**: 50% rollout (all orders)
```bash
featureFlags.set('stripe_connect_enabled', {
  percentage: 50
});
```

**Friday**: 100% rollout
```bash
featureFlags.set('stripe_connect_enabled', {
  percentage: 100
});
```

**Monitoring**: Real-time Datadog dashboard tracking error rates, latency, revenue

**Results**:
- 0 critical incidents ✅
- Error rate: 0.02% (within SLA) ✅
- Latency p99: 890ms (target: <1s) ✅
- Revenue: +2.3% (faster checkout conversion) 🎉

---

## Lessons Learned

### What Made This Successful ✅

1. **Strict Review Process** - Caught 10 critical gaps before coding
2. **Fine-Grained Tasks** - 42 tasks kept team aligned
3. **Comprehensive Testing** - Load testing prevented production issues
4. **Parallel Run** - Validated correctness before full rollout
5. **Feature Flags** - Safe, gradual rollout
6. **Continuous Security Scans** - Zero vulnerabilities shipped
7. **ADR Documentation** - Future teams understand "why"

### Enterprise-Specific Practices

1. **Compliance First** - PCI-DSS, GDPR, SOX built-in from day 1
2. **Disaster Recovery** - Tested Stripe downtime scenario
3. **Financial Risk Mitigation** - Dry run caught commission bugs
4. **Multi-Team Coordination** - 3 developers, 1 PM, 1 security engineer, 1 finance stakeholder
5. **Long Timeline** - 12 weeks (startup would do 4 weeks)
6. **High Test Coverage** - 94% (startups often 60-70%)

---

## Metrics

**Development**:
- Timeline: 12 weeks (on schedule)
- Team: 3 developers
- Total hours: 450 hours (3 devs × 150 hours)
- PRD review time: 45 minutes (strict review)
- Tasks completed: 42/42 (100%)

**Quality**:
- Test coverage: 94% (target: 90%) ✅
- Security issues: 0 ✅
- Complexity: Average 4.2 (max: 8) ✅
- Code review time: 3.2 hours/PR average

**Impact**:
- Revenue: +$2.3M annually (commission model)
- Manual processing: 40 hours/week → 0 hours/week (-100%)
- Payout delays: 7-14 days → 1-2 days (-85%)
- Refund errors: 5% → 0.02% (-99.6%)
- Compliance risk: High → Low ✅

---

## Tips for Enterprise Projects

### DO ✅

1. **Use Enterprise Preset** - Strict quality gates prevent disasters
2. **Require Architecture Decisions** - Document "why" for future teams
3. **Enable All Security Scans** - Auto-scan on commit is essential
4. **Load Test Everything** - Production scale MUST be tested
5. **Parallel Run Critical Systems** - Validate before full rollout
6. **Feature Flag Deployments** - Gradual rollouts reduce risk
7. **Track Compliance** - PCI-DSS, GDPR, SOX from day 1
8. **Fine-Grained Tasks** - Large teams need detailed breakdown
9. **Multiple PR Reviewers** - 2+ reviewers for critical code
10. **Monitor Everything** - Datadog, Sentry, PagerDuty

### DON'T ❌

1. **Skip Load Testing** - "It'll be fine" = famous last words
2. **Rush Critical Systems** - Payments/auth deserve extra time
3. **Merge Without Reviews** - Even senior devs need reviews
4. **Ignore Medium Severity** - Medium issues compound
5. **Deploy Friday Afternoon** - Deploy Tuesday, monitor 48 hours
6. **Disable Security Scans** - "Just this once" becomes "always"
7. **Skip Disaster Recovery** - Hope is not a strategy
8. **Neglect Documentation** - Future you will be angry

---

## Configuration Summary

**Enterprise vs Startup**:

| Setting | Startup | Enterprise |
|---------|---------|-----------|
| Test Coverage | 70% | 90% |
| Min Grade | C | B |
| Review Dimensions | 5 | 10 |
| Security Auto-Scan | On PR | On Commit |
| Task Granularity | Coarse | Fine |
| Complexity Max | 15 | 8 |
| Parallel Features | 2 | 5 |
| Required Reviewers | 1 | 2 |
| Feature Flags | Optional | Required |
| Load Testing | Optional | Required |
| Compliance Tracking | No | Yes |
| ADRs | Optional | Required |

**Timeline Impact**:
- Startup: 4 weeks (same feature, lower quality)
- Enterprise: 12 weeks (production-grade)

**Worth it?** YES - Zero incidents, $2.3M revenue, audit-ready.
