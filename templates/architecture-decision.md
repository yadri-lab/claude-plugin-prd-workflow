# ADR-{number}: {Title}

**Status**: Proposed | Accepted | Deprecated | Superseded
**Date**: {YYYY-MM-DD}
**Decision Makers**: {Names/Roles}
**Related PRD**: #{PRD-XXX}

---

## Context

{Describe the context and background. What situation has led to this decision?}

**Problem**:
{What problem are we trying to solve?}

**Constraints**:
- {Constraint 1}
- {Constraint 2}

**Assumptions**:
- {Assumption 1}
- {Assumption 2}

---

## Decision

{State the decision clearly and concisely}

We will {decision statement}.

**Example**:
We will use TypeScript instead of JavaScript for all new code.

---

## Rationale

{Explain why this decision was made}

### Pros
- ✅ {Pro 1}
- ✅ {Pro 2}
- ✅ {Pro 3}

### Cons
- ❌ {Con 1}
- ❌ {Con 2}

**Trade-offs**:
{Describe the trade-offs explicitly}

---

## Alternatives Considered

### Option 1: {Alternative Name}

**Description**: {What is this alternative?}

**Pros**:
- {Pro}

**Cons**:
- {Con}

**Why not chosen**: {Reason}

---

### Option 2: {Another Alternative}

**Description**: {What is this alternative?}

**Pros**:
- {Pro}

**Cons**:
- {Con}

**Why not chosen**: {Reason}

---

## Consequences

{What are the consequences of this decision?}

### Positive
- {Positive consequence 1}
- {Positive consequence 2}

### Negative
- {Negative consequence 1}
- {Negative consequence 2}

### Neutral
- {Neutral consequence}

---

## Implementation

{How will this decision be implemented?}

**Steps**:
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Timeline**: {Expected timeline}

**Effort**: {Estimated effort}

---

## Compliance

{How will we ensure this decision is followed?}

- {Compliance mechanism 1 (e.g., code review checklist)}
- {Compliance mechanism 2 (e.g., automated linting)}
- {Compliance mechanism 3 (e.g., documentation)}

---

## Metrics

{How will we measure success?}

- {Metric 1}: {Target value}
- {Metric 2}: {Target value}

---

## Review

{When should this decision be reviewed?}

**Review Date**: {YYYY-MM-DD}
**Review Trigger**: {Event that would trigger review}

---

## References

- [Related Document 1](link)
- [Related Document 2](link)
- [Technical Spec](link)
- [Research/Analysis](link)

---

## Updates

| Date | Author | Change |
|------|--------|--------|
| {YYYY-MM-DD} | {Name} | Initial draft |
| {YYYY-MM-DD} | {Name} | {Change description} |

---

## Example ADR (Reference)

**Good ADR Example**:

```markdown
# ADR-007: Use React Query for Data Fetching

**Status**: Accepted
**Date**: 2025-10-15
**Decision Makers**: Tech Lead, Frontend Team

## Context

We need a standardized approach to data fetching, caching, and state management for server data.

**Problem**: Inconsistent data fetching patterns across the app

**Constraints**:
- Must work with existing REST APIs
- Must support caching
- Must handle loading/error states

## Decision

We will use React Query (TanStack Query) for all server state management.

## Rationale

### Pros
- ✅ Built-in caching
- ✅ Automatic background refetching
- ✅ Optimistic updates
- ✅ Excellent TypeScript support

### Cons
- ❌ Learning curve
- ❌ Additional dependency (+12 KB)

## Alternatives Considered

### Option 1: Redux + RTK Query
Why not: Too heavy for our needs

### Option 2: SWR
Why not: React Query has better devtools

## Consequences

Positive:
- Faster development
- Better UX (cached data)

Negative:
- Team needs training
- Migration effort for existing code

## Implementation

1. Install React Query
2. Setup QueryClientProvider
3. Create custom hooks for each API endpoint
4. Migrate existing useState/useEffect patterns

Timeline: 2 weeks
```
