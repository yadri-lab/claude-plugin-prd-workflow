---
name: code-prd
description: 4-phase Context Engineering workflow with guided implementation
category: PRD Management
version: 2.0.0
---

# Code PRD Command (v2.0 - Context Engineering)

**NEW**: Now includes 4-phase workflow (Research → Plan → Implement → Validate) with automatic context management.

## Breaking Changes

⚠️ **Default behavior changed in v0.4.0**:
- `/code-prd PRD-XXX` now runs full 4-phase workflow by default
- Use `--quick` flag for old behavior (direct implementation)
- Use `--skip-research` or `--skip-plan` to skip individual phases

## Purpose

Bridge PRD to implementation using Context Engineering principles:
- **Never exceed 60% context** for quality outputs
- **4-Phase workflow** with automatic context clearing
- **Persistent memory** via thoughts/ directory
- **Guided implementation** with task breakdown
- **Continuous validation** against acceptance criteria

---

## Pre-Flight Checks

### Check 1: Feature Flag

```bash
# Check if context engineering is enabled
if [ -f ".claude/config.json" ]; then
  CE_ENABLED=$(jq -r '.context_engineering.enabled // false' .claude/config.json)

  if [ "$CE_ENABLED" != "true" ]; then
    echo "ℹ️  Context Engineering disabled in config"
    echo "   Using legacy workflow"
    # Fall back to old behavior
    exit 0
  fi
fi
```

### Check 2: Parse Flags

```bash
# Parse command line flags
QUICK_MODE=false
SKIP_RESEARCH=false
SKIP_PLAN=false
MANUAL_CHECKPOINTS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --quick)
      QUICK_MODE=true
      shift
      ;;
    --skip-research)
      SKIP_RESEARCH=true
      shift
      ;;
    --skip-plan)
      SKIP_PLAN=true
      shift
      ;;
    --manual-checkpoints)
      MANUAL_CHECKPOINTS=true
      shift
      ;;
    *)
      PRD_ARG="$1"
      shift
      ;;
  esac
done

# Quick mode skips all phases
if [ "$QUICK_MODE" = "true" ]; then
  echo "⚡ Quick mode: Skipping all phases (legacy behavior)"
  # Jump to old implementation workflow
  SKIP_RESEARCH=true
  SKIP_PLAN=true
  SKIP_VALIDATION=true
fi

# Show confirmation if phases are being skipped
if [ "$SKIP_RESEARCH" = "true" ] || [ "$SKIP_PLAN" = "true" ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⚠️  PHASE SKIP CONFIRMATION"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  if [ "$SKIP_RESEARCH" = "true" ]; then
    echo "Skipping Phase 1: Research"
    echo ""
    echo "You will miss:"
    echo "  • Codebase analysis and pattern discovery"
    echo "  • Identification of similar implementations"
    echo "  • Architectural constraint detection"
    echo "  • Dependency mapping"
    echo ""
    echo "Risk: Higher chance of:"
    echo "  • Missing existing solutions to reuse"
    echo "  • Breaking changes to dependencies"
    echo "  • Architectural conflicts"
    echo ""
  fi

  if [ "$SKIP_PLAN" = "true" ]; then
    echo "Skipping Phase 2: Planning"
    echo ""
    echo "You will miss:"
    echo "  • Structured implementation roadmap"
    echo "  • Sub-phase breakdown with clear boundaries"
    echo "  • Success criteria per step"
    echo "  • Context management strategy"
    echo ""
    echo "Risk: Higher chance of:"
    echo "  • Implementation drift from PRD"
    echo "  • Context bloat during implementation"
    echo "  • Missing edge cases"
    echo ""
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  read -p "Continue with skipped phases? (y/n) " -n 1 -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted. Remove skip flags to run full 4-phase workflow."
    exit 1
  fi

  echo "✅ Proceeding with skipped phases"
  echo ""
fi
```

### Check 3: Detect PRD

```bash
# Extract PRD ID from argument or branch
if [ -z "$PRD_ARG" ]; then
  BRANCH=$(git branch --show-current)
  PRD_ID=$(echo "$BRANCH" | grep -oP 'PRD-\d+' || echo "")

  if [ -z "$PRD_ID" ]; then
    echo "❌ Could not detect PRD from branch: $BRANCH"
    echo "Usage: /code-prd PRD-XXX"
    exit 1
  fi
else
  PRD_ID=$(echo "$PRD_ARG" | grep -oP 'PRD-\d+' || echo "$PRD_ARG")
fi

echo "📋 Working on: $PRD_ID"
```

### Check 4: Find PRD File

```bash
# Search for PRD in ready/ or in-progress/
PRD_FILE=""
for dir in "product/prds/03-ready" "product/prds/04-in-progress"; do
  FOUND=$(find "$dir" -name "${PRD_ID}*.md" 2>/dev/null | head -1)
  if [ -n "$FOUND" ]; then
    PRD_FILE="$FOUND"
    break
  fi
done

if [ -z "$PRD_FILE" ]; then
  echo "❌ PRD not found in ready/ or in-progress/"
  echo "Run: /setup-prd $PRD_ID"
  exit 1
fi

echo "✅ Found: $PRD_FILE"
```

### Check 5: Move to In-Progress (First Run)

```bash
# Move from ready/ to in-progress/ if needed
if [[ "$PRD_FILE" == *"/03-ready/"* ]]; then
  echo "📦 Moving PRD to in-progress..."

  NEW_PATH=$(echo "$PRD_FILE" | sed 's/03-ready/04-in-progress/')
  mv "$PRD_FILE" "$NEW_PATH"
  PRD_FILE="$NEW_PATH"

  # Update metadata
  sed -i 's/Status: Ready for Development/Status: In Progress/' "$PRD_FILE"
  sed -i "/\*\*Status\*\*/a **Started**: $(date +%Y-%m-%d)" "$PRD_FILE"

  echo "✅ PRD moved to in-progress/"
fi
```

---

## Phase 0: Context Check (Automatic)

**Always runs before starting work**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PHASE 0: CONTEXT CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Context Engineering Rule: Never exceed 60% context for quality outputs

Current context: {{CONTEXT_PERCENT}}%

{{#if CONTEXT_PERCENT > 60}}
⚠️  **WARNING**: Context already at {{CONTEXT_PERCENT}}% (threshold: 60%)

**Recommendation**:
1. Save current work
2. Clear context with /clear
3. Resume from saved state

Continue anyway? (not recommended) (y/n)
> _
{{/if}}

{{#if CONTEXT_PERCENT <= 60}}
✅ Context healthy ({{CONTEXT_PERCENT}}% < 60%)
   Proceeding with 4-phase workflow
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 1: Research (Default ON)

**Skipped if**: `--quick` or `--skip-research` flag provided

**Purpose**: Deep codebase analysis before planning

**Output**: `.prds/thoughts/research/{{PRD_ID}}-research.md`

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 PHASE 1: RESEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Goal**: Understand codebase before planning implementation

**Tasks**:
1. Find relevant files and patterns
2. Analyze current architecture
3. Identify similar implementations
4. Document dependencies and impact

**Output**: Research document in thoughts/research/

⏱️  Target time: < 2 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Research Steps

**Step 1: Spawn Parallel Agents** (Optional - P1)

```bash
# If parallel agents enabled in config
if [ "$(jq -r '.context_engineering.parallel_agents // false' .claude/config.json)" = "true" ]; then
  echo "🚀 Spawning parallel research agents..."

  # Agent 1: File locator
  claude task --agent=Explore --thoroughness=quick \
    "Find files related to: {{FEATURE_NAME}}" \
    > /tmp/agent1.txt &
  PID1=$!

  # Agent 2: Pattern finder
  claude task --agent=Explore --thoroughness=quick \
    "Find similar patterns for: {{FEATURE_DESCRIPTION}}" \
    > /tmp/agent2.txt &
  PID2=$!

  # Wait for agents
  wait $PID1 $PID2

  echo "✅ Parallel agents complete"
fi
```

**Step 2: Conduct Research**

Use Explore agent or direct analysis:

```markdown
I need to conduct research for {{PRD_ID}}: {{FEATURE_NAME}}

Please analyze the codebase and create a research document following this structure:

# Research: {{PRD_ID}} - {{FEATURE_NAME}}

**Date**: {{DATE}}
**PRD**: {{PRD_PATH}}

## Summary
[2-3 sentence overview]

## Relevant Files
[List files that will need modification]

## Current Architecture
[How the system currently works]

## Similar Patterns
[Examples of similar implementations]

## Dependencies & Impact
[What we depend on, what depends on us]

## Recommendations
[Suggested approaches with pros/cons]

**Save to**: `.prds/thoughts/research/{{PRD_ID}}-research.md`

Use template: `product/templates/research-template.md`
```

**Step 3: Validate Research**

```bash
# Check research file was created
RESEARCH_FILE=".prds/thoughts/research/${PRD_ID}-research.md"

if [ ! -f "$RESEARCH_FILE" ]; then
  echo "❌ Research file not created"
  exit 1
fi

echo "✅ Research saved: $RESEARCH_FILE"
echo "📊 File size: $(wc -l < "$RESEARCH_FILE") lines"
```

**Step 4: Phase 1 Complete - Auto-Chaining to Phase 2**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE 1 COMPLETE: RESEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Research saved: {{RESEARCH_FILE}}
📊 Research size: {{LINES}} lines

**Key findings**:
- Relevant files: {{FILE_COUNT}}
- Similar patterns: {{PATTERN_COUNT}}
- Dependencies: {{DEP_COUNT}}

🗑️  Context will now be cleared

**Auto-chaining to Phase 2: Planning**
- Will load: Research document
- Will NOT load: Full PRD (saves context)
- Planning uses: Research + PRD metadata only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 2: Plan (Default ON)

**Skipped if**: `--quick` or `--skip-plan` flag provided

**Purpose**: Generate implementation plan from research

**Input**: Research document + PRD metadata
**Output**: `.prds/thoughts/plans/{{PRD_ID}}-plan.md`

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PHASE 2: PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Goal**: Create detailed implementation plan

**Inputs**:
- Research document: {{RESEARCH_FILE}}
- PRD metadata: {{PRD_FILE}} (high-level only)

**Tasks**:
1. Break into sub-phases with clear boundaries
2. Define success criteria per sub-phase
3. Identify critical path
4. Estimate effort per sub-phase

**Output**: Implementation plan in thoughts/plans/

⏱️  Target time: < 3 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Planning Steps

**Step 1: Load Research (Not Full PRD)**

```bash
# Load research document for context
RESEARCH_FILE=".prds/thoughts/research/${PRD_ID}-research.md"

echo "📖 Loading research: $RESEARCH_FILE"
# Research file is now in context
```

**Step 2: Extract PRD Metadata**

```bash
# Extract only key metadata from PRD (not full content)
PRD_TITLE=$(grep "^# PRD-" "$PRD_FILE" | head -1 | sed 's/# //')
PRD_P0=$(grep -A 50 "### P0" "$PRD_FILE" | grep "^- \[" | head -10)

echo "📄 PRD: $PRD_TITLE"
echo "🎯 P0 Criteria: $(echo "$PRD_P0" | wc -l) items"
```

**Step 3: Generate Plan**

```markdown
I need to create an implementation plan for {{PRD_ID}}: {{FEATURE_NAME}}

**Context loaded**:
- ✅ Research document (full context)
- ✅ PRD metadata (title, P0 criteria only)

Please create a plan following this structure:

# Implementation Plan: {{PRD_ID}} - {{FEATURE_NAME}}

**Date**: {{DATE}}
**Based on Research**: {{RESEARCH_FILE}}
**Estimated Effort**: [Hours/Days]

## Overview
[What we're building - 2-3 sentences]

## Sub-Phase 1: [Name]
### What to Change
### Implementation Steps
### Success Criteria
**Estimated Time**: [X hours]

## Sub-Phase 2: [Name]
[Repeat structure...]

## Final Validation Checklist
[All P0 criteria from PRD]

**Save to**: `.prds/thoughts/plans/{{PRD_ID}}-plan.md`

Use template: `product/templates/plan-template.md`
```

**Step 4: Validate Plan**

```bash
# Check plan file was created
PLAN_FILE=".prds/thoughts/plans/${PRD_ID}-plan.md"

if [ ! -f "$PLAN_FILE" ]; then
  echo "❌ Plan file not created"
  exit 1
fi

echo "✅ Plan saved: $PLAN_FILE"
echo "📊 Sub-phases: $(grep "^## Sub-Phase" "$PLAN_FILE" | wc -l)"
```

**Step 5: Phase 2 Complete - Auto-Chaining to Phase 3**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE 2 COMPLETE: PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Plan saved: {{PLAN_FILE}}
📊 Sub-phases: {{SUBPHASE_COUNT}}

**Plan overview**:
- Total estimated effort: {{ESTIMATED_HOURS}} hours
- Critical path: {{CRITICAL_SUBPHASES}}
- Context strategy: Clear between sub-phases if > 60%

🗑️  Context will now be cleared

**Auto-chaining to Phase 3: Implementation**
- Will load: Implementation plan only
- Will NOT load: Research, PRD (saves context)
- Implementation: Follows plan sub-phases sequentially

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 3: Implementation (Always ON)

**Purpose**: Implement according to plan

**Input**: Plan document
**Output**: Code changes

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  PHASE 3: IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Goal**: Implement feature according to plan

**Input**: Implementation plan (not PRD, not research)

**Strategy**:
- Follow plan sub-phases sequentially
- Monitor context throughout
- Clear context between sub-phases if > 60%
- Validate each sub-phase before continuing

⏱️  Target: Stay below 60% context throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Implementation Steps

**Step 1: Load Plan (Not PRD/Research)**

```bash
# Load plan document for context
PLAN_FILE=".prds/thoughts/plans/${PRD_ID}-plan.md"

echo "📖 Loading plan: $PLAN_FILE"
# Plan file is now in context
# Research and PRD are NOT loaded (saves context)
```

**Step 2: Extract Sub-Phases**

```bash
# Parse plan for sub-phases
SUBPHASES=$(grep "^## Sub-Phase" "$PLAN_FILE" | sed 's/## Sub-Phase //')
NUM_SUBPHASES=$(echo "$SUBPHASES" | wc -l)

echo "📋 Found $NUM_SUBPHASES sub-phases to implement"
echo "$SUBPHASES" | nl
```

**Step 3: Implement Sub-Phases**

For each sub-phase:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  SUB-PHASE {{N}}/{{TOTAL}}: {{SUBPHASE_NAME}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**From plan**:
{{SUBPHASE_DESCRIPTION}}

**Implementation steps**:
{{SUBPHASE_STEPS}}

**Success criteria**:
{{SUBPHASE_CRITERIA}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to implement? (y/n)
> y

[Implement according to steps...]

✅ Sub-phase {{N}} complete

**Validation**:
{{Run tests, linting, etc.}}

Context check: {{CONTEXT_PERCENT}}%

{{#if CONTEXT_PERCENT > 60}}
⚠️  Context at {{CONTEXT_PERCENT}}% - clearing before next sub-phase
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 4: Progress Tracking**

```bash
# Save progress after each sub-phase
echo "💾 Saving progress..."

cat > ".claude/prd-${PRD_ID}-progress.json" <<EOF
{
  "prd_id": "$PRD_ID",
  "phase": "implementation",
  "completed_subphases": $N,
  "total_subphases": $TOTAL,
  "last_checkpoint": "$(date -Iseconds)",
  "context_percent": $CONTEXT_PERCENT
}
EOF
```

---

## Phase 4: Validation (Default ON)

**Skipped if**: `--quick` flag provided

**Purpose**: Compare implementation vs plan vs PRD

**Output**: `.prds/thoughts/validation/{{PRD_ID}}-validation.md`

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE 4: VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Goal**: Validate implementation against plan and PRD

**Tasks**:
1. Compare implementation vs plan
2. Check all P0 acceptance criteria met
3. Identify deviations (beneficial or problematic)
4. Generate validation report

**Output**: Validation report in thoughts/validation/

⏱️  Target time: < 1 minute

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Validation Steps

**Step 1: Load All Context**

```bash
# Load plan, research, and PRD for validation
PLAN_FILE=".prds/thoughts/plans/${PRD_ID}-plan.md"
RESEARCH_FILE=".prds/thoughts/research/${PRD_ID}-research.md"
PRD_FILE="$(find product/prds/04-in-progress -name "${PRD_ID}*.md" | head -1)"

echo "📖 Loading for validation:"
echo "   - Plan: $PLAN_FILE"
echo "   - Research: $RESEARCH_FILE"
echo "   - PRD: $PRD_FILE"
```

**Step 2: Generate Validation Report**

```markdown
Please generate a validation report for {{PRD_ID}}:

**Compare**:
1. Implementation vs Plan (what was implemented vs what was planned)
2. Plan vs PRD (was the plan aligned with PRD goals)
3. Implementation vs PRD (do we meet acceptance criteria)

**Structure**:

# Validation Report: {{PRD_ID}} - {{FEATURE_NAME}}

## ✅ Implemented Correctly
[What matches plan and PRD]

## ⚠️ Deviations from Plan
**Beneficial Changes**: [Improvements made]
**Unplanned Omissions**: [What was skipped]

## ❌ Issues Found
**Critical**: [Must fix]
**Non-Critical**: [Nice to fix]

## 📊 Acceptance Criteria Review
[Check each P0/P1 criterion]

## 🎯 Recommendation
**Status**: ✅ Ready to Merge / ⚠️ Needs Fixes / ❌ Not Ready

**Save to**: `.prds/thoughts/validation/{{PRD_ID}}-validation.md`

Use template: `product/templates/validation-template.md`
```

**Step 3: Display Results**

```bash
# Show validation summary
VALIDATION_FILE=".prds/thoughts/validation/${PRD_ID}-validation.md"

echo "✅ Validation complete: $VALIDATION_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat "$VALIDATION_FILE" | grep "^## 🎯 Recommendation" -A 5
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## Final Summary

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 IMPLEMENTATION COMPLETE: {{PRD_ID}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phases Completed**:
✅ Phase 1: Research ({{RESEARCH_TIME}} min)
✅ Phase 2: Planning ({{PLAN_TIME}} min)
✅ Phase 3: Implementation ({{IMPL_TIME}} min)
✅ Phase 4: Validation ({{VALIDATION_TIME}} min)

**Artifacts Created**:
- 📄 Research: {{RESEARCH_FILE}}
- 📄 Plan: {{PLAN_FILE}}
- 📄 Validation: {{VALIDATION_FILE}}

**Context Management**:
- Average context: {{AVG_CONTEXT}}% (Target: <60%)
- Context cleared: {{CLEAR_COUNT}} times

**Validation Status**: {{STATUS}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps**:

{{#if STATUS == "Ready to Merge"}}
1. ✅ Create PR: `gh pr create --title "feat({{PRD_ID}}): {{FEATURE_NAME}}"`
2. ✅ Link validation report in PR description
3. ✅ Run `/complete-prd {{PRD_ID}}` after merge
{{/if}}

{{#if STATUS == "Needs Fixes"}}
1. ⚠️ Address issues in validation report
2. ⚠️ Re-run validation: `/code-prd {{PRD_ID}} --skip-research --skip-plan`
3. ⚠️ Update validation report
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Configuration

Respects these settings from `.claude/config.json`:

```json
{
  "context_engineering": {
    "enabled": true,
    "four_phase_workflow": {
      "enabled": true,
      "phases": {
        "research": true,
        "plan": true,
        "implement": true,
        "validate": true
      },
      "context_threshold": 60
    },
    "thoughts_directory": ".prds/thoughts"
  }
}
```

---

## Examples

**Full workflow** (default):
```bash
/code-prd PRD-009
# Runs: Research → Plan → Implement → Validate
```

**Quick mode** (legacy):
```bash
/code-prd PRD-009 --quick
# Skips all phases, direct implementation
```

**Skip research** (have existing knowledge):
```bash
/code-prd PRD-009 --skip-research
# Runs: Plan → Implement → Validate
```

**Skip plan** (simple change):
```bash
/code-prd PRD-009 --skip-plan
# Runs: Research → Implement → Validate
```

**Manual checkpoints** (interactive):
```bash
/code-prd PRD-009 --manual-checkpoints
# Pauses after each phase for review
```

---

## Migration Guide

**For existing PRDs** (created before v0.4.0):
- Old behavior preserved automatically
- Version detected from PRD metadata
- No action required

**For new PRDs** (created after v0.4.0):
- 4-phase workflow by default
- Use `--quick` if you want old behavior
- Thoughts/ directory auto-created

---

**Version**: 2.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Context Engineering**: Enabled
