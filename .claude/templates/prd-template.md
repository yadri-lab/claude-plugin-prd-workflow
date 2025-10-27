# {Feature Name} - PRD

**PRD ID**: {PRD-XXX}
**Status**: Draft
**Priority**: {P0/P1/P2/P3}
**Owner**: {Product Owner Name}
**Created**: {YYYY-MM-DD}
**Last Updated**: {YYYY-MM-DD}
**Target Release**: {vX.X or date}

---

## Executive Summary

{1-2 paragraph summary of the feature. What is it? Why are we building it? What's the expected impact?}

**TL;DR**: {One sentence summary}

---

## Problem Statement

### Background

{Context about the problem. What pain point exists? Who experiences this problem?}

### User Stories

As a **{user type}**, I want to **{goal}**, so that **{benefit}**.

**Examples**:
- As a content creator, I want to schedule posts in advance, so that I don't have to manually publish at specific times.
- As a reader, I want to save articles for later, so that I can read them when I have time.

### Current State (if applicable)

{How do users currently solve this problem? What are the limitations?}

---

## Proposed Solution

### Overview

{High-level description of the solution. How will this solve the problem?}

### User Flow

```
1. User navigates to {page/screen}
2. User clicks {action}
3. System does {behavior}
4. User sees {result}
```

### Wireframes / Mockups

{Links to Figma, screenshots, or ASCII diagrams}

```
┌─────────────────────┐
│  Page Header        │
├─────────────────────┤
│                     │
│  Feature Area       │
│                     │
└─────────────────────┘
```

### Key Features

1. **Feature 1**: {Description}
2. **Feature 2**: {Description}
3. **Feature 3**: {Description}

---

## Technical Approach

### Tech Stack

- **Frontend**: {React, Vue, etc.}
- **Backend**: {Node.js, Python, etc.}
- **Database**: {PostgreSQL, MongoDB, etc.}
- **External APIs**: {Stripe, SendGrid, etc.}

### Architecture

{High-level architecture diagram or description}

```
Client → API Gateway → Service Layer → Database
                    ↓
                External APIs
```

### Data Model

**New Tables/Collections**:
```typescript
interface Feature {
  id: string;
  userId: string;
  createdAt: Date;
  // Add fields
}
```

**Modified Tables**: {List any schema changes to existing tables}

### API Endpoints (if applicable)

**New Endpoints**:
- `GET /api/features` - List all features
- `POST /api/features` - Create new feature
- `PUT /api/features/:id` - Update feature
- `DELETE /api/features/:id` - Delete feature

---

## Scope

### In Scope (v1.0)

✅ **Must Have (P0)**:
- {Feature A}
- {Feature B}

✅ **Should Have (P1)**:
- {Feature C}

### Out of Scope (Future Versions)

❌ **Will NOT be in v1.0**:
- {Feature X} - Deferred to v1.1
- {Feature Y} - Not needed yet
- {Feature Z} - Too complex, revisit later

---

## Dependencies & Blockers

### Dependencies

**Required Before Starting**:
- [ ] Design mockups complete
- [ ] API contracts finalized
- [ ] Database schema approved

**Depends On** (other features):
- **PRD-XXX** ({Feature Name}) - {Why it's needed}

**Provides For** (features waiting for this):
- **PRD-YYY** ({Feature Name}) - {How they'll use this}

### Blockers

**Hard Blockers** (cannot proceed):
- {None / List blockers}

**Soft Blockers** (can work around):
- {None / List blockers}

---

## Acceptance Criteria

### P0 (Critical - Must Work)

- [ ] **AC1**: {Specific, measurable criterion}
  - **How to verify**: {Test steps}
  - **Expected result**: {What should happen}

- [ ] **AC2**: User can {action} and see {result}

- [ ] **AC3**: System handles {edge case} gracefully

### P1 (Important - Should Work)

- [ ] **AC4**: {Criterion}

### P2 (Nice to Have)

- [ ] **AC5**: {Criterion}

### Non-Functional Requirements

**Performance**:
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms (p95)

**Security**:
- [ ] User authentication required
- [ ] Input validation on all fields
- [ ] XSS/CSRF protection

**Accessibility**:
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

**Testing**:
- [ ] Unit test coverage > 80%
- [ ] E2E tests for critical flows

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Third-party API downtime | Medium | High | Implement retry logic + fallback |
| Database migration fails | Low | Critical | Test on staging first, have rollback plan |
| Feature too complex for v1 | High | Medium | Strict scope control, defer P2 items |

### Rollback Plan

If this feature causes issues in production:

1. **Immediate**: Feature flag OFF (disable feature)
2. **Short-term**: Revert deployment (rollback to previous version)
3. **Long-term**: Fix issue, redeploy

---

## Timeline & Milestones

| Milestone | Date | Status |
|-----------|------|--------|
| Design complete | {YYYY-MM-DD} | ⏸️ Pending |
| Development start | {YYYY-MM-DD} | ⏸️ Pending |
| Internal testing | {YYYY-MM-DD} | ⏸️ Pending |
| Beta release | {YYYY-MM-DD} | ⏸️ Pending |
| Production release | {YYYY-MM-DD} | ⏸️ Pending |

**Estimated Effort**: {X weeks / Y story points}

---

## Success Metrics

**How will we measure success?**

### North Star Metric

{Primary metric that indicates success, e.g., "30% increase in user engagement"}

### Supporting Metrics

- **Adoption**: {X% of users use this feature within 30 days}
- **Usage**: {Y actions per user per week}
- **Satisfaction**: {NPS score > 8}
- **Performance**: {p95 response time < 500ms}

### Monitoring & Alerts

- Track {metric} in {analytics tool}
- Alert if {condition} (e.g., error rate > 5%)

---

## Open Questions

**Before Development Starts**:

1. ❓ {Question that needs answering}
   - **Owner**: {Who's responsible}
   - **Deadline**: {When we need an answer}

2. ❓ Should we support {feature X} in v1.0 or defer to v1.1?

3. ❓ What's the rate limit for {external API}?

---

## References

- **Design**: {Figma link}
- **Technical Spec**: {Google Docs / Notion link}
- **Related PRDs**: PRD-XXX, PRD-YYY
- **Research**: {Links to user research, competitor analysis}
- **Discussions**: {GitHub discussion / Slack thread}

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| {YYYY-MM-DD} | Initial draft created | {Name} |
| {YYYY-MM-DD} | Added acceptance criteria | {Name} |
| {YYYY-MM-DD} | Approved and moved to Ready | {Name} |
