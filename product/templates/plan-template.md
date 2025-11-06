# Implementation Plan: {{PRD_ID}} - {{FEATURE_NAME}}

**Date**: {{DATE}}
**Based on Research**: [Link to research document]({{RESEARCH_PATH}})
**PRD**: [Link to PRD]({{PRD_PATH}})
**Estimated Effort**: {{EFFORT}}

---

## Overview

[What we're building in 2-3 sentences based on research findings]

**Chosen Approach**: {{APPROACH}}

**Why this approach**: [Brief rationale from research]

---

## Sub-Phase 1: {{PHASE_NAME}}

### What to Change

- Modify `.claude/commands/{{COMMAND}}.md` to add {{FEATURE}}
- Update `scripts/{{SCRIPT}}.sh` to implement {{LOGIC}}
- Create {{NEW_FILE}} in `{{DIRECTORY}}/`

### Implementation Steps

1. **Step 1**: [Specific action with file references]
   - File: `path/to/file.ts`
   - Change: [What exactly to modify]

2. **Step 2**: [Next specific action]
   - File: `path/to/file.ts`
   - Change: [What exactly to modify]

3. **Step 3**: [Continue...]

### Success Criteria

- [ ] Feature {{X}} executes successfully
- [ ] No regressions in existing behavior
- [ ] {{ARTIFACT}} generated correctly
- [ ] Tests pass: `npm test` (if applicable)
- [ ] Linting clean: `npm run lint` (if applicable)
- [ ] Context stays below 60% threshold

**Estimated Time**: {{TIME_ESTIMATE}}

---

## Sub-Phase 2: {{PHASE_NAME}}

### What to Change

[Similar structure...]

### Implementation Steps

1. **Step 1**: [Specific action]
2. **Step 2**: [Next action]
3. ...

### Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] ...

**Estimated Time**: {{TIME_ESTIMATE}}

---

## Sub-Phase 3: {{PHASE_NAME}}

[Continue for all sub-phases...]

---

## Final Validation Checklist

**From PRD P0 Acceptance Criteria**:
- [ ] AC 1: [From PRD]
- [ ] AC 2: [From PRD]
- [ ] AC 3: [From PRD]

**Technical Quality**:
- [ ] No regressions in existing behavior
- [ ] Documentation updated (README, command help)
- [ ] Templates/examples created
- [ ] Config files updated
- [ ] Error handling implemented

**Performance** (if applicable):
- [ ] Meets performance targets from config
- [ ] No noticeable slowdown

**Breaking Changes** (if any):
- [ ] Migration path documented
- [ ] Backward compatibility preserved (or opt-out provided)
- [ ] Team notified of changes

---

## Context Management Strategy

**When to clear context**:
- After Research phase (already cleared)
- Between sub-phases if context > 60%
- Load this plan (not full PRD) to save context

**What to reference**:
- This plan for implementation steps
- Research document for technical details
- PRD only for acceptance criteria validation

---

## Notes

[Any additional notes, risks, or considerations discovered during planning]
