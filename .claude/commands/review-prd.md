---
name: review-prd
description: Conduct comprehensive PRD review with 7-dimension analysis
category: PRD Management
---

# Review PRD Command

Conduct a comprehensive PRD review following structured methodology.

## Purpose

Review and validate PRDs before development starts, ensuring quality, feasibility, and completeness.

## Workflow

### Step 1: List Draft PRDs

Scan the draft PRD directory (default: `product/prds/01-draft/`) for available PRD files.

Display a table of available PRDs:

```markdown
📋 **PRDs Available for Review (01-draft/)**

| # | PRD File | Feature Name | Priority | Grade |
|---|----------|--------------|----------|-------|
| 1 | 251024-design-system-v1.md | Design System | P0 | B |
| 2 | 251024-landing-page-v1.md | Landing Page | P0 | C+ |
| 3 | 251024-analytics-v1.md | Analytics | P1 | D |

Which PRD would you like to review? (1-3 or filename)
```

### Step 2: Move to Review Folder


### Step 3: Analyze PRD (7 Dimensions)

Review the PRD across these dimensions:

1. **Clarity & Scope** 🎯
   - Is the problem clearly defined?
   - Is the scope well-bounded (IN vs OUT)?
   - Are edge cases considered?

2. **Technical Feasibility** ⚙️
   - Is the tech stack appropriate?
   - Are there technical risks?
   - Do we have the required expertise?

3. **User Experience** 🧑‍💻
   - Is the user journey clear?
   - Are wireframes/mockups provided?
   - Is accessibility considered?

4. **Dependencies & Blockers** 🚧
   - What features does this depend on?
   - What features are waiting for this?
   - Are there any hard blockers?

5. **Acceptance Criteria** ✅
   - Are criteria specific and measurable?
   - Can we verify completion objectively?
   - Are non-functional requirements included?

6. **Risk Assessment** ⚠️
   - What could go wrong?
   - What are mitigation strategies?
   - Is there a rollback plan?

7. **Simplification Opportunities** 🪓
   - Can we ship 50% of this in v1.0?
   - What's the absolute MVP?
   - Can we defer complexity?

### Step 4: Generate Summary + Critical Questions

Output a comprehensive review with:
- Overall assessment and grade (A-F)
- Strengths and gaps for each dimension
- 5-10 critical questions that MUST be answered
- Recommendations for improvement

### Step 5: Wait for User Answers

Do NOT proceed until user responds to the critical questions.

### Step 6: Apply Changes

Based on answers:
1. Summarize proposed changes
2. Wait for approval
4. Update WORK_PLAN.md (if enabled in config)

### Step 7: Grade & Recommend

Show before/after grade and recommend next steps:
- If grade improved to A/B: recommend approval
- If still C/D: recommend more refinement
- If grade declined: identify what went wrong

### Step 8: Update PRD Metadata

**NEW: Update metadata only, NO file movement**

Add/update review metadata in PRD header:

```markdown
**Review Status**: Reviewed
**Review Date**: 2025-10-28
**Review Grade**: A-
**Reviewer**: Claude
**Last Review**: 2025-10-28
```

**Recommendation based on grade**:

```markdown
✅ Review Complete: PRD-007 - OAuth2 Integration

📊 Final Grade: A-

📝 **Status**: Draft (no movement)
📂 **Location**: product/prds/01-draft/PRD-007-oauth2.md

**Next Steps**:
✅ Grade A/B detected - Ready for setup!

Run: /setup-prd PRD-007
  → Creates feature branch
  → Auto-assigns to you
  → Moves to 02-ready/
  
Then: /code-prd PRD-007 (when ready to implement)
```

**If Grade C/D**:
```markdown
⚠️ Review Complete: PRD-008 - Dark Mode

📊 Final Grade: C

**Recommendation**: Iterate on PRD before setup
- Address critical questions
- Clarify scope boundaries
- Define acceptance criteria

Run /review-prd PRD-008 again after improvements.
```

**NO automatic file movement** - User decides when to run /setup-prd.

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft",
      "ready": "product/prds/02-ready"
    },
    "review": {
      "dimensions": [...],
      "grading_enabled": true,
      "minimum_grade": "C",
      "calibration_questions": true
    }
  }
}
```

## Success Criteria

- PRD moves from C/D to A/B grade
- All critical gaps identified and filled
- User consciously approves moving to development
- GitHub issue created (if configured)

## Related

- Agent: `prd-reviewer` (automatically invoked)
- Skills: `estimation`, `documentation`
- Next Command: `/code-prd` (start development)
