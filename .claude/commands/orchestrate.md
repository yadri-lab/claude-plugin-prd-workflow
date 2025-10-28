---
name: orchestrate
description: Orchestrate multi-PRD workflow with dependency management
category: Workflow Orchestration
---

# Orchestrate Command

Coordinate parallel development of multiple PRDs with automatic dependency resolution and conflict prevention.

## Purpose

Enable efficient multi-feature development:
- Visualize PRD dependencies
- Suggest optimal development order
- Coordinate parallel work (using worktrees)
- Prevent merge conflicts
- Track cross-PRD blockers
- Automate sequential merges

## Workflow

### Step 1: Analyze PRD Landscape (Parallel Execution)

**NEW: Parallel Analysis for Speed**

Instead of analyzing PRDs sequentially (slow), analyze all in parallel:

```typescript
// OLD (Sequential - SLOW):
for (const prd of allPRDs) {
  await analyzePRD(prd);  // 10s per PRD × 10 PRDs = 100s total
}

// NEW (Parallel - FAST):
await Promise.all(
  allPRDs.map(prd => analyzePRD(prd))  // All at once = 10s total
);
```

**Performance Impact**:
- 10 PRDs: 100s → 10s (-90%)
- 20 PRDs: 200s → 10s (-95%)

Scan all PRDs across statuses and extract (in parallel):
- PRD dependencies (declared in PRDs)
- File overlap (potential conflicts)
- Priority levels
- Current status (draft/review/ready/in-progress)
- Developer assignments (if tracked)

```markdown
🔍 Analyzing PRDs...

⚡ Parallel analysis of 10 PRDs:
  [████████████████████] PRD-001 ✓
  [████████████████████] PRD-002 ✓
  [████████████████████] PRD-003 ✓
  [████████████████████] PRD-004 ✓
  [████████████████████] PRD-005 ✓
  [████████████████████] PRD-006 ✓
  [████████████████████] PRD-007 ✓
  [████████████████████] PRD-008 ✓
  [████████████████████] PRD-009 ✓
  [████████████████████] PRD-010 ✓

✅ Analysis complete in 12s (vs 120s sequential)
```

### Step 2: Build Dependency Graph

Create directed graph:
- Nodes = PRDs
- Edges = dependencies
- Edge labels = dependency type (hard/soft)

Detect:
- ✅ Valid linear chains (A → B → C)
- ✅ Parallel branches (A → C, B → C)
- ⚠️ Circular dependencies (A → B → A)
- ⚠️ Missing dependencies

### Step 3: Identify Conflicts (Parallel Execution)

**NEW: Parallel Conflict Detection**

Analyze all PRD pairs in parallel instead of sequentially:

```typescript
// Generate all pairs of in-progress PRDs
const prdPairs = [];
for (let i = 0; i < inProgressPRDs.length; i++) {
  for (let j = i + 1; j < inProgressPRDs.length; j++) {
    prdPairs.push([inProgressPRDs[i], inProgressPRDs[j]]);
  }
}

// Check all pairs in parallel
const conflicts = await Promise.all(
  prdPairs.map(([prdA, prdB]) => detectConflicts(prdA, prdB))
);
```

Analyze file overlap:
```bash
# For each pair of in-progress PRDs (in parallel)
git diff main...feat/PRD-003 --name-only &
git diff main...feat/PRD-008 --name-only &
wait  # Wait for all parallel git commands
# Find intersection
```

Classify conflicts:
- 🔴 High risk: Same file, same lines
- 🟡 Medium risk: Same file, different sections
- 🔵 Low risk: Same directory, different files

**Performance**:
- 5 in-progress PRDs = 10 pairs
- Sequential: 10 pairs × 2s = 20s
- Parallel: All pairs at once = 2s (-90%)

### Step 4: Generate Orchestration Plan

```markdown
🎼 **Workflow Orchestration Plan**

**Context**: 12 active PRDs, 2 in progress, 5 ready, 3 under review, 2 draft

---

## 📊 Dependency Graph

```
┌─────────────┐
│ PRD-003     │ P0: Design System (in progress, day 2)
│ Design      │ ├─ Provides: Component library
│ System      │ └─ Blocks: PRD-004, PRD-007, PRD-010
└─────────────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
       v              v              v              v
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ PRD-004  │  │ PRD-007  │  │ PRD-010  │  │ PRD-012  │
│ Landing  │  │ Auth UI  │  │ Dashboard│  │ Settings │
│ Page     │  │ (ready)  │  │ (review) │  │ (draft)  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
    (ready)

┌─────────────┐
│ PRD-008     │ P0: RSS Monitoring (in progress, day 1)
│ RSS         │ ├─ No dependencies
│ Monitor     │ └─ Blocks: PRD-009
└─────────────┘
       │
       v
┌──────────┐
│ PRD-009  │
│ Analytics│
│ Dashboard│
└──────────┘
    (ready)
```

---

## 🚦 Current Bottlenecks

### Critical Path: PRD-003 (Design System)
- **Blocking**: 3 ready PRDs, 1 under review
- **Status**: 36% complete (~2 more days)
- **Impact**: Landing page, Auth UI, Dashboard waiting
- **Recommendation**: Focus on completing PRD-003 first

### Parallel Opportunity: PRD-008 (RSS Monitoring)
- **Independent**: No shared files with PRD-003
- **Status**: 20% complete (~3 more days)
- **Can run**: Fully parallel in worktree

---

## 🎯 Recommended Development Strategy

### Phase 1: Complete Active Work (Now - Day 3)
**Parallel execution** (using worktrees):

```bash
# Worktree 1 (main repo): PRD-003
cd acmecorp/
git worktree list  # feat/PRD-003-design-system

# Worktree 2: PRD-008
cd ../acmecorp-rss/
git worktree list  # feat/PRD-008-rss-monitoring
```

**Action**: Continue both PRDs in parallel
- No file conflicts detected ✅
- Different tech areas (UI vs backend)
- Can merge independently

**ETA**: Day 3 (both complete)

---

### Phase 2: Merge & Unblock (Day 3)
**Merge order** (automated by orchestrator):

1. ✅ Merge PRD-008 first (no dependencies)
   - `gh pr merge #XX --squash`
   - Clean up worktree: `git worktree remove ../acmecorp-rss`

2. ✅ Merge PRD-003 second (unblocks 3 PRDs)
   - `gh pr merge #YY --squash`
   - Clean up worktree: `git worktree remove ../acmecorp-design-system`

---

### Phase 3: Start Next Wave (Day 4)
**Parallel batch** (3 worktrees):

Since PRD-003 (Design System) is merged:

```bash
# Start 3 PRDs in parallel (config: max 3)
/code-prd PRD-004  # Landing Page (worktree 1)
/code-prd PRD-007  # Auth UI (worktree 2)
/code-prd PRD-009  # Analytics Dashboard (worktree 3)
```

**Conflict Analysis**:
- 🟢 PRD-004 ↔ PRD-007: Low risk (different pages)
- 🟡 PRD-004 ↔ PRD-009: Medium risk (shared header component)
- 🟢 PRD-007 ↔ PRD-009: Low risk

**Recommendation**:
- Start all 3 in parallel
- Merge PRD-004 first (others depend on header)
- Then merge PRD-007 and PRD-009

**ETA**: Day 6 (all 3 complete)

---

### Phase 4: Final Wave (Day 7+)
- PRD-010 (Dashboard) - depends on PRD-009 merge
- PRD-012 (Settings) - after review

---

## ⚠️ Issues & Recommendations

### Issue 1: Circular Dependency Detected
**PRD-010** (Dashboard) lists **PRD-009** (Analytics) as dependency
**PRD-009** (Analytics) lists **PRD-010** (Dashboard) in "Related Features"

**Resolution**: Clarify true dependency direction
**Action**: Review both PRDs, update dependency metadata

### Issue 2: PRD-011 (Mobile App) Stuck in Review (C grade)
**Impact**: Not blocking anything, but P0 priority
**Days in review**: 4 days
**Action**: Run `/review-prd PRD-011` to improve grade → ready

### Issue 3: File Conflict Risk - Header Component
**PRD-004** (Landing Page) and **PRD-009** (Analytics) both modify `apps/web/src/components/Header.tsx`

**Mitigation**:
1. Create shared ticket: "Header refactor" (new PRD?)
2. Or: Merge PRD-004 first, PRD-009 rebases
3. Or: Extract Header to design system (PRD-003)

**Recommended**: Option 3 (add to PRD-003 scope)

---

## 📅 Timeline Projection

| Week | PRDs Complete | Cumulative | Notes |
|------|---------------|------------|-------|
| This week | 2 (003, 008) | 2 | Active work |
| Next week | 3 (004, 007, 009) | 5 | Parallel batch |
| Week after | 2 (010, 012) | 7 | Final wave |

**Total delivery**: 7 PRDs in ~3 weeks
**Velocity**: 2.3 PRDs/week (good!)

---

## 🤖 Automated Actions Available

Would you like me to:

1. **Fix circular dependency** (PRD-009 ↔ PRD-010)?
   - Review both PRDs
   - Update dependency metadata
   - Regenerate graph

2. **Review stuck PRD** (PRD-011 Mobile App)?
   - Run `/review-prd PRD-011`
   - Identify gaps
   - Improve grade to A/B

3. **Prevent header conflict**?
   - Add Header component to PRD-003 scope
   - Update PRD-004 and PRD-009 dependencies
   - Sequence properly

4. **Start next batch** (when PRD-003 + PRD-008 merge)?
   - Auto-detect merge
   - Trigger `/code-prd` for PRD-004, 007, 009
   - Set up 3 worktrees

5. **Monitor progress**?
   - Track PRD-003 and PRD-008 completion
   - Notify when ready to merge
   - Show daily progress updates

Select actions: (1-5, comma-separated, or 'all')
```

### Step 5: Execute Automated Actions

Based on user selection, perform orchestration:

**Example: Auto-merge on completion**
```bash
# Monitor active PRs
while true; do
  # Check if PRD-003 PR is approved and checks pass
  if gh pr view 42 --json state,mergeable | jq -r '.mergeable' == 'MERGEABLE'; then
    echo "PRD-003 ready to merge!"
    gh pr merge 42 --squash

    # Update status
    mv product/prds/03-in-progress/251024-design-system-v1.md \
       product/prds/04-complete/251024-design-system-v1.md

    # Trigger next wave
    /code-prd PRD-004
    /code-prd PRD-007

    break
  fi
  sleep 300  # Check every 5 min
done
```

### Step 6: Generate Daily Status Update

If monitoring enabled:
```markdown
📊 **Daily Orchestration Status - Day 2**

## 🚧 In Progress (2)
- PRD-003: 58% complete (+22% today) - on track ✅
- PRD-008: 45% complete (+25% today) - ahead of schedule ⚡

## ✅ Merged Today (0)

## 🎯 Next Up (Ready to Start)
- PRD-004: Waiting for PRD-003 merge (~1 day)
- PRD-007: Waiting for PRD-003 merge (~1 day)

## ⚠️ Blockers
- None

**ETA for next wave**: Tomorrow afternoon (Oct 26)
```

## Configuration

Uses these config settings:
```json
{
  "orchestration": {
    "enabled": true,
    "parallel_features": 3,
    "dependency_resolution": true,
    "auto_merge_strategy": "squash",
    "conflict_resolution": "manual"
  }
}
```

## Success Criteria

- Dependency graph accurate
- Conflicts identified and mitigated
- Optimal parallelization strategy
- Automated monitoring (if requested)
- Faster time-to-production

## Related

- Agent: `orchestrator` (automatically invoked)
- Skill: `git-workflow`, `dependency-management`
- Commands: `/list-prds`, `/code-prd`, `/work-prd`
