---
name: code-prd
description: Guided implementation with task breakdown and validation
category: PRD Management
---

# Code PRD Command

Guide step-by-step implementation of active PRD with task breakdown and continuous validation.

## Purpose

Bridge the gap between approved PRD and completed feature through:
- Intelligent task breakdown (phases → tasks)
- Step-by-step guided implementation
- Continuous validation against acceptance criteria
- **Auto-recovery from interruptions** (NEW)
- Progress tracking with checkpoints
- Quality gates at each phase

## Workflow

### Phase 1: Context Loading

#### Step 1: Detect Active PRD

**Method A**: Extract from current branch name
```bash
git branch --show-current
# Example output: feat/PRD-003-design-system
# Extract: PRD-003
```

**Method B**: Ask user if detection fails

Find corresponding PRD file in `product/prds/04-in-progress/`

#### Step 2: Load PRD Content

Read and parse:
- Acceptance criteria (P0, P1, P2)
- Tech stack and architecture
- Dependencies and constraints
- Success metrics

#### Step 3: Check for Existing Progress & Auto-Recovery

**NEW: Automatic Progress Checkpoints**

Before starting, check for `.claude/prd-{id}-progress.json`:

```json
{
  "prd_id": "PRD-003",
  "total_tasks": 42,
  "completed_tasks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  "current_task": 15,
  "phases": {
    "phase_1_setup": "completed",
    "phase_2_backend": "in_progress",
    "phase_3_frontend": "pending"
  },
  "last_checkpoint": "2025-10-26T14:23:17Z",
  "estimated_time_remaining": "6 hours"
}
```

**If progress file exists**, show recovery prompt:

```markdown
💾 Found saved progress for PRD-003

📊 Progress: 14/42 tasks completed (33%)
⏱️ Last worked: 2 hours ago
📍 Stopped at: Task 15 - Implement auth middleware

🔄 What would you like to do?
  [R] Resume from task 15 (recommended)
  [S] Start from scratch (discard progress)
  [V] View completed tasks

> [User choice]
```

**If user chooses Resume**:

```markdown
✅ Resuming from task 15/42

Already completed:
  ✓ Phase 1: Setup (tasks 1-8)
  ✓ Phase 2: Backend - Part 1 (tasks 9-14)

Next up:
  📝 Task 15: Implement auth middleware
  📝 Task 16: Add JWT validation
  ...
```

**Auto-save progress after each task**:

```markdown
✅ Task 15 complete

💾 Progress auto-saved
  - Checkpoint: 15/42 tasks (35%)
  - Next: Task 16 - Add JWT validation
  - Safe to pause anytime
```

**If crash/timeout occurs**, next run automatically offers to resume!

### Phase 2: Task Breakdown

Invoke `prd-implementer` agent + `estimation` skill to generate:

1. **Phased Plan** (Foundation → Core → Advanced → QA)
2. **Task List** with:
   - Task ID and description
   - Files to create/modify
   - Complexity estimate (Low/Medium/High)
   - Time estimate
   - Dependencies
   - Acceptance criteria (from PRD)

3. **Critical Path** identification
4. **Parallelization opportunities**

Example output structure:
```markdown
📋 **Implementation Plan - PRD-003: Design System v1.0**

## Phase 0: Foundation (Critical Path)
- Task 1: Setup Types & Interfaces (30min, Low)
- Task 2: Configure Tailwind (30min, Low)
- Task 3: Install shadcn/ui (1h, Medium)

## Phase 1: Core Components
- Task 4-8: Implement 5 core components (8h, Medium)

## Phase 2: Documentation & Testing
- Task 12-14: Storybook + Tests + Accessibility (9h, High)

**Total**: 14 tasks, 18-22h estimated
```

Wait for user confirmation before proceeding.

### Phase 3: Task-by-Task Execution

For each task:

#### 1. Present Task Context
- Task number and description
- Files to touch
- Dependencies status
- Related PRD section
- What to implement (code examples)
- Acceptance criteria for this task

#### 2. Wait for User Confirmation
Ask: "Ready to implement this task? (Y/n/skip)"

#### 3. Implement if Confirmed
- Create/modify files as specified
- Follow best practices from skills
- Add tests if required
- Update documentation

#### 4. Validate Implementation
Run appropriate checks:
- TypeScript compilation
- Linting
- Unit tests
- Build verification

#### 5. Show Task Completion Summary
- Validation results
- Files changed
- Progress percentage
- Time spent vs estimate
- Next task preview

Ask: "Continue? (Y/n/pause)"

### Phase 4: Progress Checkpoints

Every 3-5 tasks or on user request:

Show comprehensive checkpoint:
```markdown
📊 **Progress Checkpoint - Task 5/14**

## Summary
- Completed: 5/14 (36%)
- Time: 4h invested, 14-16h remaining
- Velocity: On track ✅

## PRD Alignment
- ✅ 2/8 components done
- 🔄 Testing: 85% coverage
- ⏸️ Accessibility: Pending

## Technical Decisions Made
1. Decision X - Rationale - Impact
2. Decision Y - Rationale - Impact

## Blockers: None ✅

## Recommendations
- Run lint fixes
- Consider visual regression tests
```

### Phase 5: Completion & PR Readiness

When all P0 tasks complete:

#### 1. Final Quality Dashboard
- Test coverage
- Linting status
- TypeScript errors
- Complexity metrics
- Bundle size
- Performance metrics
- Security scan results
- Accessibility audit

#### 2. Files Changed Summary
- Created files count
- Modified files count
- Total LOC added/removed

#### 3. Documentation Status
- README updated?
- Storybook stories?
- Migration guide?
- API docs?

#### 4. Recommend Next Actions
Based on config and context:
- Run `/security-audit` if security is enabled
- Run `/quality-check` if quality checks needed
- Create PR with `/create-pr`
- Move PRD to complete

#### 5. Save Final Progress
Update progress file with completion data.

## Progress Persistence

Progress saved to `.claude/prd-{id}-progress.json`:
```json
{
  "prd_id": "PRD-003",
  "feature": "Design System v1.0",
  "started_at": "2025-10-25T14:30:00Z",
  "tasks": {
    "total": 14,
    "completed": 5,
    "current": 6
  },
  "progress_percent": 36,
  "time_invested_hours": 4.5,
  "estimate_remaining_hours": 15,
  "completed_tasks": [...],
  "decisions": [...],
  "blockers": []
}
```

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "work_plan": {
      "enabled": true,
      "track_decisions": true
    }
  },
  "agents": {
    "prd_implementer": {
      "task_breakdown_granularity": "medium"
    }
  }
}
```

## Pause & Resume

User can pause at any time:
- Progress automatically saved
- Resume with `/work-prd` in same worktree
- Will continue from last task

## Success Criteria

- All P0 acceptance criteria met
- Quality gates passed (tests, linting, security)
- Documentation complete
- User confident in implementation
- Ready for PR creation

## Related

- Agent: `prd-implementer` (automatically invoked)
- Skills: `estimation`, `testing`, `code-quality`, `documentation`
- Previous: `/code-prd` (setup worktree)
- Next: `/security-audit`, `/quality-check`, or create PR
