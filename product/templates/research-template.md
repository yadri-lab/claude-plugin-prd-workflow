# Research: {{PRD_ID}} - {{FEATURE_NAME}}

**Date**: {{DATE}}
**PRD**: [Link to PRD]({{PRD_PATH}})
**Context Threshold**: Stay below 60% to maintain quality

---

## Summary

[2-3 sentence overview of findings]

---

## Relevant Files

- `path/to/file.ts` - Current implementation of X
- `.claude/commands/{{COMMAND}}.md` - Command that needs modification
- `scripts/{{SCRIPT}}.sh` - Bash script implementation

---

## Current Architecture

[How the system currently works]

**Key Components**:
- Component A does X
- Component B handles Y
- Data flows from A → B → C

**Tech Stack**:
- Framework: [e.g., TypeScript, React, Node.js]
- Libraries: [e.g., zod, shadcn/ui]
- Patterns: [e.g., MVC, Repository pattern]

---

## Similar Patterns in Codebase

[Examples of similar implementations we can reference]

- **Feature Z** (similar approach in `src/path/`)
  - What it does: [Brief description]
  - How it works: [Key pattern]
  - Lessons: [What we can reuse]

- **Pattern Y** (in `lib/` handles similar case)
  - What it does: [Brief description]
  - How it works: [Key pattern]
  - Lessons: [What we can reuse]

---

## Dependencies & Impact

**Upstream Dependencies** (What we depend on):
- Dependency 1: [Description + status]
- Dependency 2: [Description + status]

**Downstream Impact** (What depends on us):
- Component X will be affected: [How?]
- Feature Y may need updates: [Why?]

**Breaking Changes**:
- [ ] None
- [ ] Minor (opt-in behavior)
- [ ] Major (requires migration)

---

## Recommendations

[Suggested implementation approach based on research]

### Approach A: {{APPROACH_NAME}}
**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

**Effort**: [Hours/Days]

### Approach B: {{APPROACH_NAME}}
**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

**Effort**: [Hours/Days]

---

## ✅ Recommended: {{CHOSEN_APPROACH}}

**Rationale**: [Why this approach is best given constraints, timeline, and risk]

---

## Next Steps

1. Review this research with team (optional)
2. Proceed to Plan phase
3. Context will be cleared after this phase
