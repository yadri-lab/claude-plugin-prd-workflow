---
name: review-prd
description: Comprehensive PRD review with product and technical analysis
category: PRD Management
version: 0.4.2
---

# Review PRD Command

Comprehensive PRD review following product-first, then technical approach.

## Purpose

Review and validate PRDs before development with:
- **Product validation**: Right problem, right solution, right scope
- **Technical feasibility**: Can build it, how to build it, risks
- **Clear decision**: GO/ITERATE/KILL with honest assessment
- **Grade assignment**: A-F rating for quality tracking

## Workflow

### 1. List & Select PRD

Scan `product/prds/01-draft/` and display selection menu with PRD name, priority, and current grade.

### 2. Complete Review Analysis

**Output comprehensive review in one response** covering:

#### A. Product Review

**Problem validation**:
- User persona and pain point
- Frequency and severity
- Evidence (support tickets, user research, churn data)
- Challenge: Is this real and urgent?

**Solution assessment**:
- Proposed approach summary
- Scope (what's in, what's out, why)
- Alternative approaches considered
- Simplification opportunities

**Component challenge**:
- Each major component: Essential vs nice-to-have vs bloat
- Usage estimate and effort
- Impact if removed
- Verdict: Keep/Defer/Remove

**User experience**:
- Current vs proposed flow
- Friction points identified
- Journey improvements

**Success metrics**:
- How success is measured
- Targets with baselines
- Acceptance criteria completeness

**Strategic context**:
- Company strategy alignment
- Competitive landscape
- Timing rationale

**Product Score**: X/10 with strengths and weaknesses

#### B. Technical Review

**Architecture & design**:
- Proposed architecture fit
- Design patterns used
- Integration points
- Technical debt impact

**Implementation breakdown**:
- Major work areas with realistic estimates
- Critical paths identified
- Testing strategy

**Dependencies & blockers**:
- Technical dependencies (APIs, services, data)
- Team dependencies
- Hard blockers vs soft dependencies

**Tech stack**:
- New dependencies and their risks
- Breaking changes
- Tech debt created vs paid

**Quality & performance**:
- Performance impact and SLA targets
- Security attack surface
- Scalability considerations
- Monitoring requirements

**Risk assessment**:
- Technical risks with likelihood and impact
- Mitigation strategies
- Known unknowns and de-risking approaches

**Technical Score**: X/10 with technical feeling

#### C. Synthesis & Decision

**Final Grade**: A-F (Product score + Technical score)

**Global feeling**: Honest assessment of PRD quality and readiness

**3 Critical Challenges**:

1. **KILL Challenge**: Should we build this?
   - Problem validated?
   - Better alternatives exist?
   - Strategic fit?
   - Verdict: Build / Don't build

2. **TIMING Challenge**: Now or later?
   - Urgency level
   - Team capacity
   - Dependencies ready?
   - Opportunity cost
   - Verdict: Now / Defer (when?)

3. **SCOPE Challenge**: All or part?
   - MVP viable?
   - Effort saved by reducing
   - Value preserved
   - Verdict: Full scope / MVP first / Phased

**Blockers** (must fix before /setup-prd):
- Critical issues preventing development start
- Owner assignments

**Recommendations** (to improve grade):
- Specific improvements with effort/impact
- Priority ranking

**ROI Summary**:
- Effort estimate with confidence
- Value assessment
- Risk level
- Overall ROI: Excellent/Good/Questionable/Poor

**Next Steps**:
- ✅ Ready for development OR
- ⚠️ Needs iteration (what specifically)
- Recommended priority
- Action items with owners

## Grading System

**A (90-100)**: Exceptional PRD, ready for immediate development
**B (80-89)**: Strong PRD, minor improvements recommended
**C (70-79)**: Solid PRD, some concerns need addressing
**D (60-69)**: Weak PRD, significant gaps to fill
**F (<60)**: Not ready, major rework needed

## Principles

**Product-first thinking**:
- Most PRD failures = building wrong thing
- Challenge assumptions aggressively
- Demand evidence, not opinions
- Think ROI: Effort vs Value vs Risk

**Technical realism**:
- Research actual codebase (real files, patterns, gaps)
- Realistic estimates (not ideal case)
- Surface unknowns honestly
- Identify dependencies early

**Honest feedback**:
- Share real feeling, don't sugarcoat
- Grade reflects actual quality
- Suggest optimizations (smaller scope, phased, alternatives)
- Call out blockers clearly

**Decision clarity**:
- Clear GO/ITERATE/KILL verdict
- Specific next actions
- Owner assignments
- Timeline expectations

## Configuration

```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft",
      "ready": "product/prds/02-ready"
    },
    "review": {
      "grading_enabled": true,
      "minimum_grade": "C"
    }
  }
}
```

## Success Criteria

- ✅ Product validation complete (problem, solution, scope)
- ✅ Technical feasibility assessed (architecture, risks, estimates)
- ✅ Clear grade (A-F) with justification
- ✅ 3 critical challenges answered (KILL/TIMING/SCOPE)
- ✅ Actionable next steps with owners
- ✅ User understands PRD quality and readiness

## Example Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PRD-007: OAuth2 Integration | P0 | 9-day effort
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 PRODUCT REVIEW

Problem: 12% signup drop-off, users want one-click auth
Evidence: 47 support tickets, top-3 in user research
Challenge: ✅ Validated (strong evidence)

Solution: Google + GitHub OAuth
Alternatives: Auth0 ($300/month), magic links (doesn't solve one-click)
Recommendation: Build in-house (lower long-term cost)

Scope optimization: Remove Microsoft OAuth (2% of signups)
Impact: 64% effort saved, 95% value preserved

Product Score: 9/10 (strong validation, clear scope)

🔧 TECHNICAL REVIEW

Architecture: Passport.js (already in stack)
Estimate: 5 days MVP (Google only) + 1 day GitHub
Risk: OAuth security (state param, credential management)

Technical Score: 8/10 (low risk, proven libraries)

🎯 DECISION

Grade: A- (Product: 9/10 | Technical: 8/10)

1. KILL Challenge: ✅ Build (validated problem, clear ROI)
2. TIMING Challenge: 🚀 Now (Q1 OKR dependency, no blockers)
3. SCOPE Challenge: 📦 MVP first (Google → GitHub → Microsoft)

Blockers:
🔴 Privacy policy update (Legal review needed)

ROI: 🟢 Excellent (6 days → +8pt conversion → ~$50k ARR)

Next Steps:
✅ Ready for development after legal review
Recommended priority: P0
Actions: Legal review → /setup-prd → /code-prd

Expected delivery: Week 1 (Google), Week 2 (GitHub)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
