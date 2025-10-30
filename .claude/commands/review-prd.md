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

### Step 2: Load PRD & Auto-Detect Context

**Parse PRD metadata for context-aware review**:

```bash
# Extract tags from PRD frontmatter/metadata
TAGS=$(grep -E "^Tags:|^Type:" "$PRD_FILE" | grep -oP '(?<=:\s).*' | tr '\n' ',' | tr '[:upper:]' '[:lower:]')

# Determine contextual dimensions to analyze
CONTEXTUAL_DIMS=""

if [[ "$TAGS" =~ "frontend" ]] || [[ "$TAGS" =~ "ui" ]] || [[ "$TAGS" =~ "ux" ]]; then
  CONTEXTUAL_DIMS="$CONTEXTUAL_DIMS ux_journey accessibility"
  echo "📊 Detected: Frontend context (+UX, +Accessibility)"
fi

if [[ "$TAGS" =~ "backend" ]] || [[ "$TAGS" =~ "api" ]]; then
  CONTEXTUAL_DIMS="$CONTEXTUAL_DIMS api_design data_model"
  echo "📊 Detected: Backend context (+API Design, +Data Model)"
fi

if [[ "$TAGS" =~ "security" ]] || [[ "$TAGS" =~ "auth" ]] || [[ "$TAGS" =~ "payment" ]]; then
  CONTEXTUAL_DIMS="$CONTEXTUAL_DIMS threat_model compliance"
  echo "📊 Detected: Security-sensitive (+Threat Model, +Compliance)"
fi

# Always analyze 4 core dimensions
CORE_DIMS="scope_boundaries dependencies acceptance_criteria simplification"

echo ""
echo "Review will analyze:"
echo "  Core: $(echo $CORE_DIMS | wc -w) dimensions (always)"
echo "  Contextual: $(echo $CONTEXTUAL_DIMS | wc -w) dimensions (based on tags)"
echo ""
```

### Step 3: GATE - KILL/SKIP/SHRINK (30 seconds)

**CRITICAL: Gate must pass before detailed analysis begins**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚦 GATE 0: KILL/SKIP/SHRINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PRD-XXX: [Feature Name]
📍 Current Scope: [Extract scope statement from PRD]

IN: [List what's IN scope]
OUT: [List what's OUT of scope]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 KILL Question: Should this feature exist at all?

Context analysis:
• Priority: [P0/P1/P2 from PRD]
• User demand: [Check if mentioned in PRD]
• Strategic fit: [Analyze against product goals]
• Dependencies: [List critical dependencies]

Challenge: [Generate specific challenge based on PRD content]

Examples of challenges:
- "You have 0 paying customers - why build this before PMF?"
- "This duplicates existing Feature X - why not improve X instead?"
- "No user research cited - is this solving a real problem?"

Your answer (or 'skip' to proceed anyway):
> _

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟡 SKIP Question: Can this wait 3-6 months?

Context analysis:
• Current sprint: [Check team capacity]
• Blockers: [Dependencies not ready?]
• Opportunity cost: [What else could be built?]

Challenge: [Generate specific challenge]

Examples:
- "Labeled P0 but no user complaints - what breaks if delayed?"
- "Team is at capacity - which P0 should we drop instead?"
- "Dependency PRD-003 not ready - why not wait?"

Your answer:
> _

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 SHRINK Question: Can we ship 20% of this first?

Current scope includes:
[List major features from PRD]

MVP proposal (auto-generated):
[Suggest minimal viable subset]

Examples:
- "Ship Google OAuth only (1 provider vs 3) = 60% less code"
- "Skip admin panel, just user-facing features = 2 weeks vs 5 weeks"
- "Read-only v1, add editing in v2 = ship 3x faster"

Impact: [Estimate time/complexity reduction]

Your answer (or describe your own 20% version):
> _

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Evaluate gate responses**:

```bash
# Check if user provided answers
if [ -z "$KILL_ANSWER" ] || [ -z "$SKIP_ANSWER" ] || [ -z "$SHRINK_ANSWER" ]; then
  if [ "$FORCE" != "true" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ GATE FAILED: Incomplete answers"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "All 3 questions must be answered to proceed."
    echo ""
    echo "Options:"
    echo "  1. Answer the questions above"
    echo "  2. Type 'force' to skip gate (not recommended)"
    echo ""
    exit 1
  else
    echo "⚠️  GATE BYPASSED via 'force'"
    echo "🚨 Proceeding without scope validation (risk: wasted effort)"
    echo ""
  fi
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ GATE PASSED - Proceeding to analysis"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Recorded justifications:"
  echo "• KILL: $KILL_ANSWER"
  echo "• SKIP: $SKIP_ANSWER"
  echo "• SHRINK: $SHRINK_ANSWER"
  echo ""
  echo "These will be added to PRD metadata."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi
```

### Step 4: Analyze PRD (4 Core + Contextual Dimensions)

**Use compact output format** (config: `output_format: "compact"`):

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CORE DIMENSIONS (Always Analyzed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ SCOPE & BOUNDARIES (2 min)

Current scope:
  IN: [List from PRD]
  OUT: [List from PRD]

Status: [✓ GOOD | ⚠️ GAPS | ❌ UNCLEAR]

Findings:
• [Specific gap or strength 1]
• [Specific gap or strength 2]

⚡ Action Required:
→ [Specific fix needed, or "None - boundaries clear"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2️⃣ DEPENDENCIES & BLOCKERS (1 min)

Depends on:
• PRD-XXX (Name) → Status: [✓ Complete | 🔄 In Progress | ❌ Draft]

Blocks:
• PRD-YYY (Name) → Waiting on this

Status: [✓ NO BLOCKERS | ⚠️ SOFT DEPENDENCY | ❌ HARD BLOCKER]

Findings:
[If blocker exists, describe impact]

⚡ Action Required:
→ [e.g., "Complete PRD-003 first" or "None - all deps ready"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3️⃣ ACCEPTANCE CRITERIA (2 min)

P0 Criteria: X/Y defined
P1 Criteria: X/Y defined
Coverage: [Functional, Non-functional, Edge cases]

Status: [✓ STRONG | ⚠️ INCOMPLETE | ❌ MISSING]

Findings:
• [Strength or gap in criteria]

⚡ Action Required:
→ [e.g., "Add performance SLA (login <2s)" or "None - comprehensive"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4️⃣ SIMPLIFICATION (MVP Focus) (2 min)

Current scope: [Brief summary]
Estimated effort: [Time estimate]

MVP proposal (20% rule):
[Suggest minimal version that delivers core value]

Impact if accepted:
• Time: [e.g., "2 days vs 5 days (-60%)"]
• Risk: [e.g., "Lower surface area"]
• Value: [e.g., "Still solves core problem"]

Status: [✓ ALREADY MINIMAL | ⚠️ CAN SHRINK | ❌ BLOATED]

⚡ Action Required:
→ [e.g., "Reduce to 1 provider in v1" or "None - already minimal"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTUAL DIMENSIONS (Based on Tags)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Only show if relevant tags detected]

Type 'more' to expand contextual analysis:
• UX Journey (frontend)
• Accessibility (frontend)
• API Design (backend)
• Data Model (backend)
• Threat Model (security)
• Compliance (security)

Or press Enter to skip to verdict.

[If user types 'more', expand with same compact format]
```

### Step 5: Verdict & Grade

**Compact verdict format**:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grade: [A-F] ([Previous grade if re-review])

Breakdown:
• Scope: [✓ | ⚠️ | ❌]
• Dependencies: [✓ | ⚠️ | ❌]
• Acceptance: [✓ | ⚠️ | ❌]
• Simplification: [✓ | ⚠️ | ❌]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 BLOCKERS (Must fix before /setup-prd):
1. [Blocker 1 with specific action]
2. [Blocker 2 with specific action]

🟡 RECOMMENDATIONS (Should fix for higher grade):
3. [Recommendation 1]
4. [Recommendation 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  After fixes → Expected grade: [A-F]

Next steps:
[If A/B] → ✅ Ready for /setup-prd PRD-XXX
[If C/D] → ⚠️  Fix blockers → /review-prd again
[If F]   → ❌ Consider killing this PRD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Update PRD Metadata

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
      "gate_enabled": true,
      "gate_requires_pass": true,
      "dimensions": {
        "core": ["scope_boundaries", "dependencies", "acceptance_criteria", "simplification"],
        "contextual": {
          "frontend": ["ux_journey", "accessibility"],
          "backend": ["api_design", "data_model"],
          "security": ["threat_model", "compliance"]
        }
      },
      "auto_detect_context": true,
      "output_format": "compact",
      "grading_enabled": true,
      "minimum_grade": "C"
    }
  }
}
```

## Success Criteria

- ✅ Gate passed with clear justifications (KILL/SKIP/SHRINK answered)
- ✅ PRD grade A/B after review (or clear path to A/B)
- ✅ All blockers identified and documented
- ✅ Scope reduced where possible (20% rule applied)
- ✅ Review completed in < 5 min (compact format)
- ✅ User has clear next actions (fix blockers or /setup-prd)

## Target Metrics

- **Time-to-verdict**: P50 < 3 min, P95 < 5 min
- **Shrink adoption**: ≥60% of complex PRDs reduce scope after gate
- **Re-review rate**: <20% (gate catches issues early)

## Related

- Config: `.claude/config.json` (review.gate_enabled, review.dimensions)
- Next: `/setup-prd` (if grade A/B)
- Alternative: Iterate on PRD and /review-prd again (if grade C/D/F)
