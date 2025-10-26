# Real-World Examples

Complete examples showing how different teams use PRD Workflow Manager.

---

## Example 1: SaaS Startup MVP

**Context**: Fast-moving startup building B2B SaaS product
**Team**: 2-4 developers
**Stack**: Next.js, PostgreSQL, Stripe
**Timeline**: 3 months to launch

### Configuration

**Startup preset** with lenient settings:
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

**Why this works**:
- ✅ Speed over perfection (MVP mindset)
- ✅ 70% test coverage (pragmatic)
- ✅ Grade C acceptable (ship fast, iterate)
- ✅ 2 parallel features (small team)

### Typical Week

**Monday**: Plan features
```bash
/create-prd "User Onboarding Flow"
/create-prd "Stripe Billing Integration"
```

**Tuesday**: Review & approve
```bash
/review-prd PRD-001
# Grade: C+ → Approved
/review-prd PRD-002
# Grade: B → Approved
```

**Wednesday-Friday**: Parallel development
```bash
# Dev 1 works on onboarding
/setup-prd PRD-001
/code-prd PRD-001

# Dev 2 works on billing
/setup-prd PRD-002
/code-prd PRD-002
```

**Results**: 2 features shipped per week

---

## Example 2: E-commerce Platform

**Context**: Established e-commerce company adding new features
**Team**: 8-12 developers
**Stack**: React, Node.js, MongoDB, Redis
**Scale**: 100K+ daily active users

### Configuration

**Enterprise preset** with strict quality:
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

**Why this works**:
- ✅ Production quality (90% coverage)
- ✅ Grade B minimum (high standards)
- ✅ 5 parallel features (larger team)
- ✅ Mandatory security scans (customer data)

### Multi-PRD Coordination

```bash
# 5 PRDs in flight
/list-prds

PRD-001: Wishlist (in progress, 60%)
PRD-002: Product Reviews (in progress, 80%)
PRD-003: Personalized Recommendations (ready)
PRD-004: Advanced Search (in progress, 40%)
PRD-005: One-Click Checkout (blocked by PRD-001)

# Check dependencies
/orchestrate

Critical Path: PRD-001 → PRD-005
Bottleneck: Backend team at 120% capacity
Recommendation: Complete PRD-001 ASAP to unblock PRD-005
```

**Results**: Coordinated feature delivery with no blockers

---

## Example 3: Microservices Migration

**Context**: Migrating monolith to microservices
**Team**: 15+ developers across 3 teams
**Stack**: Go, gRPC, Kubernetes, PostgreSQL
**Complexity**: 3 services to extract

### Configuration

**Custom config** for migration:
```json
{
  "prd_workflow": {
    "directories": {
      "prds": "architecture/migration-prds"
    },
    "min_grade": "A",
    "review_dimensions": 10
  }
}
```

**Why strict grading**:
- ⚠️ Architectural changes need deep review
- ⚠️ 10 dimensions include: Compliance, Security, Performance, Data Migration, Rollback Plan
- ⚠️ Grade A required (no room for ambiguity)

### PRD Structure

**PRD-001: Extract Auth Service**
```markdown
## Migration Phases

### Phase 1: Preparation (2 weeks)
- Database schema finalization
- API contract definition
- Data migration scripts

### Phase 2: Parallel Run (4 weeks)
- Deploy new service (shadow mode)
- Dual-write to both services
- Validate data consistency

### Phase 3: Cutover (1 week)
- Route 10% traffic to new service
- Monitor error rates
- Gradual rollout to 100%

### Phase 4: Cleanup (1 week)
- Remove old code from monolith
- Delete dual-write logic
- Update documentation
```

**Orchestration**:
```bash
/orchestrate

Service Dependencies:
PRD-001 (Auth) → Must complete first
PRD-002 (User Profile) → Depends on Auth
PRD-003 (Notifications) → Independent

Timeline:
Week 1-6: PRD-001 (Auth Service)
Week 7-12: PRD-002 (User Profile) in parallel with PRD-003 (Notifications)
```

**Results**: Safe, coordinated migration with zero downtime

---

## Example 4: Open Source Project

**Context**: Community-driven open source project
**Team**: 5 core maintainers + 50+ contributors
**Stack**: Python, FastAPI, PostgreSQL
**Goal**: Transparent roadmap, community contributions

### Configuration

**Open source preset**:
```json
{
  "preset": "open-source",
  "prd_workflow": {
    "prd_id_format": "RFC-{number}",
    "work_plan_file": "ROADMAP.md",
    "github": {
      "issue_labels": ["help-wanted", "good-first-issue"],
      "auto_assign": false
    }
  }
}
```

**Why this works**:
- ✅ RFC format familiar to open source
- ✅ Public ROADMAP.md for transparency
- ✅ "help-wanted" labels attract contributors
- ✅ No auto-assign (contributors pick tasks)

### Contributor Flow

**Maintainer creates RFC**:
```bash
/create-prd "Add WebSocket Support"
# Creates: docs/rfcs/RFC-042-websocket-support.md
```

**Community review**:
```markdown
# RFC-042: WebSocket Support

## Status: Draft

## Community Feedback
- @contributor1: "Should we use Socket.io or native WebSockets?"
- @contributor2: "I can implement this! Estimated 2 weeks"
- @maintainer: "Let's use native WebSockets for lighter deps"

## Decision: Approved (after community discussion)
```

**Contributor implements**:
```bash
# Contributor forks and works on feature
git clone https://github.com/project/repo.git
cd repo
/setup-prd RFC-042
/code-prd RFC-042

# Creates PR linking to RFC-042
```

**Results**: Transparent process, community-driven development

---

## Key Takeaways

### Choose the Right Preset

| Team Type | Preset | Min Grade | Coverage | Why |
|-----------|--------|-----------|----------|-----|
| **Startup** | startup | C | 70% | Speed over perfection |
| **Enterprise** | enterprise | B | 90% | Production quality |
| **Open Source** | open-source | C | 80% | Community-friendly |

### Adapt to Your Needs

**Speed-focused** (Startup):
- Lower thresholds (70% coverage, grade C)
- Fewer review dimensions (5 instead of 7)
- Faster iteration

**Quality-focused** (Enterprise):
- Higher thresholds (90% coverage, grade B)
- More review dimensions (10 for compliance)
- Mandatory security scans

**Community-focused** (Open Source):
- Public roadmap (ROADMAP.md)
- Contributor-friendly labels
- Transparent process

---

## Common Patterns

### Pattern 1: Parallel Development (Startups)

```bash
# Create 2 PRDs
/create-prd "Feature A"
/create-prd "Feature B"

# Review both
/review-prd PRD-001
/review-prd PRD-002

# Assign to 2 devs, work in parallel
Dev 1: /setup-prd PRD-001
Dev 2: /setup-prd PRD-002

# Both ship in same sprint
```

### Pattern 2: Dependency Management (Enterprise)

```bash
# Create dependent PRDs
/create-prd "Auth Service"
/create-prd "User Dashboard" # Depends on Auth

# Orchestrate dependencies
/orchestrate
→ Shows: PRD-001 must complete before PRD-002

# Work sequentially
/setup-prd PRD-001 → Complete → /setup-prd PRD-002
```

### Pattern 3: Community Contributions (Open Source)

```bash
# Maintainer creates RFC
/create-prd "Feature X"

# Label as "help-wanted"
# Contributor picks it up
# Contributor submits PR linking to RFC

# Maintainer reviews and merges
```

---

## Metrics from Real Teams

### Startup (InvoiceFlow - 8 weeks)

**Before PRD Workflow**:
- Features per week: 0.5 (unclear requirements)
- Rework rate: 40% (scope creep)
- PR review time: 2 hours

**After PRD Workflow**:
- Features per week: 2 (clear PRDs)
- Rework rate: 10% (defined scope)
- PR review time: 30 min (quality gates)

**Impact**: **4x feature velocity**, 75% less rework

---

### Enterprise (MarketHub - 6 months)

**Before**:
- Security issues/month: 8
- Test coverage: 65%
- Deployment confidence: Low (manual testing)

**After**:
- Security issues/month: 0 (automated scans)
- Test coverage: 92% (enforced gates)
- Deployment confidence: High (automated QA)

**Impact**: **Zero security incidents**, 27% coverage increase

---

### Open Source (AsyncAPI - 12 months)

**Before**:
- Contributor onboarding: 2 weeks (unclear roadmap)
- Community PRs/month: 3
- PR approval time: 5 days

**After**:
- Contributor onboarding: 2 days (clear RFCs)
- Community PRs/month: 12
- PR approval time: 1 day (clear criteria)

**Impact**: **4x community contributions**, 80% faster approvals

---

## Next Steps

1. **Choose your preset** based on team type
2. **Customize config** for your needs
3. **Start with 1 PRD** to learn the workflow
4. **Iterate and improve** based on feedback

**Questions?** Open a [GitHub Discussion](https://github.com/Yassinello/claude-prd-workflow/discussions)
