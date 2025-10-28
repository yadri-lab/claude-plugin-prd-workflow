---
name: list-prds
description: List all PRDs with status, priority, and grade
category: PRD Management
---

# List PRDs Command

Display a comprehensive overview of all PRDs across all lifecycle stages.

## Purpose

Provide quick visibility into:
- All PRDs and their current status
- Priority and grade distribution
- Bottlenecks in the pipeline
- Next actions needed

## Usage

### Default View (Table)
```bash
/list-prds
/list-prds --status=ready
/list-prds --priority=P0
```

### Kanban View (v2.7+)
```bash
/list-prds --view=kanban
/list-prds -k
```

## Workflow

### Step 1: Scan All PRD Directories

Scan these directories (from config):
- `01-draft/` - PRDs being written
- `02-ready/` - Approved, ready to code
- `03-in-progress/` - Currently being developed
- `04-complete/` - Finished features
- `99-archived/` - Historical PRDs

### Step 2: Parse Each PRD

**IMPORTANT: Support all PRD ID formats**

The PRD ID can be in various formats depending on project configuration:
- Standard: `PRD-003`, `PRD-012`
- Watchora: `WTC-PRD-003`, `WTC-PRD-012`
- AcmeCorp: `ACME-PRD-003`, `ACME-PRD-012`
- Custom: `FEAT_0003`, `RFC-012`, etc.

Use flexible parsing to extract PRD ID from:
1. **Filename pattern**: `YYMMDD-{slug}-v1.md`
2. **Metadata header**: Look for lines like:
   - `**PRD ID**: WTC-PRD-003`
   - `**ID**: ACME-PRD-012`
   - `PRD ID: PRD-003`
3. **First heading**: `# WTC-PRD-003: Feature Name`

Extract metadata:
- PRD ID (e.g., PRD-003, WTC-PRD-003, ACME-PRD-003)
- Feature name
- Status
- Priority (P0, P1, P2, P3)
- Grade (A-F, if reviewed)
- Branch (if in progress)
- Started date (if in progress)
- Completed date (if complete)


### Step 2.5: Parse Dependencies (NEW in v0.3)

**Extract dependency information from PRD metadata**:

Look for dependency declarations in PRD header:
```yaml
**Depends On**:
- PRD-003: Database schema
- PRD-005: Auth system

**Blocks**:
- PRD-010: User dashboard
```

**Dependency status resolution**:
```bash
for dep in "${DEPENDS_ON[@]}"; do
  DEP_ID=$(echo "$dep" | cut -d: -f1 | tr -d ' ')
  
  # Find dependency PRD location
  if [ -f "product/prds/04-complete/$DEP_ID*.md" ]; then
    STATUS="✅"
  elif [ -f "product/prds/03-in-progress/$DEP_ID*.md" ]; then
    STATUS="🔨"
  elif [ -f "product/prds/02-ready/$DEP_ID*.md" ]; then
    STATUS="⏳"
  else
    STATUS="⚠️"
  fi
  
  DEPS_DISPLAY+=" $STATUS $DEP_ID"
done
```

**Status icons**:
- ✅ Complete (04-complete/)
- 🔨 In Progress (03-in-progress/)
- ⏳ Ready (02-ready/)
- ⚠️ Not Found or Draft


### Step 3: Display Summary Dashboard

```markdown
📋 **PRD Overview - AcmeCorp Project**

## Pipeline Summary
- 📝 Draft: 3 PRDs
- 🔍 Review: 2 PRDs
- ✅ Ready: 5 PRDs
- 🚧 In Progress: 2 PRDs
- ✅ Complete: 8 PRDs
- 📦 Archived: 15 PRDs

**Total Active**: 12 PRDs | **Velocity**: 2.1 PRDs/week

---

## Error Handling & Helpful Suggestions

### When No PRDs Found

Instead of just "No PRDs found", show:

```markdown
📋 No PRDs found

🚀 Get started:
  1. Create your first PRD: /create-prd
  2. Import existing: Move PRD files to product/prds/01-draft/

📖 Need help?
  - Quick guide: See docs/guide.md
  - Examples: See docs/examples.md
```

### When Specific PRD Not Found

User runs: `/review-prd PRD-999`

```markdown
❌ PRD-999 not found in any directory

📂 Available PRDs:
Draft:
  - PRD-006: OAuth Integration
  - PRD-008: Dark Mode Support

Ready:
  - PRD-005: Dashboard UI
  - PRD-007: User Profile

💡 Did you mean?
  - PRD-006 (most similar name)

Or:
  - Create it: /create-prd
  - List all: /list-prds
```

### When PRD in Wrong State

User runs: `/code-prd PRD-006` but PRD-006 is in draft

```markdown
⚠️ PRD-006 is in DRAFT state

You need to review and approve it first:

Next steps:
  1. Review: /review-prd PRD-006
  2. After approval, setup: /setup-prd PRD-006

Or:
  - Skip review (not recommended): /setup-prd PRD-006 --skip-review
```

---

## 🚧 In Progress (2)

| PRD ID | Feature | Priority | Grade | Branch | Days |
|--------|---------|----------|-------|--------|------|
| PRD-003 | Design System v1.0 | P0 | A- | feat/PRD-003-design-system | 2 |
| PRD-008 | RSS Monitoring | P0 | A | feat/PRD-008-rss-monitoring | 1 |

---

## ✅ Ready for Development (5)

| PRD ID | Feature | Priority | Grade | Dependencies | Next Action |
|--------|---------|----------|-------|--------------|-------------|
| PRD-004 | Landing Page | P0 | B+ | - | Run `/code-prd` |
| PRD-007 | User Authentication | P0 | A | - | Waiting for PRD-003 |
| PRD-009 | Analytics Dashboard | P1 | B | - | Run `/code-prd` |
| PRD-012 | Email Notifications | P1 | B | - | Run `/code-prd` |
| PRD-015 | Search Functionality | P2 | C+ | - | Consider re-review |

---

## 🔍 Under Review (2)

| PRD ID | Feature | Priority | Grade | Status |
|--------|---------|----------|-------|--------|
| PRD-011 | Mobile App | P0 | C | Needs improvement |
| PRD-013 | API v2 | P1 | B- | Almost ready |

---

## 📝 Draft (3)

| PRD ID | Feature | Priority | Next Action |
|--------|---------|----------|-------------|
| PRD-014 | Chat Feature | P1 | Finish writing, then `/review-prd` |
| PRD-016 | Payment Integration | P0 | Finish writing |
| PRD-017 | Admin Panel | P2 | On hold |

---

## ✅ Recently Completed (Last 3)

| PRD ID | Feature | Completed | Time |
|--------|---------|-----------|------|
| PRD-006 | Database Setup | 2025-10-23 | 3 days |
| PRD-005 | CI/CD Pipeline | 2025-10-20 | 2 days |
| PRD-002 | Repository Setup | 2025-10-18 | 1 day |

---

## 🎯 Recommendations

1. **Priority Focus**: 2 P0 PRDs ready for development
2. **Bottleneck**: PRD-011 (Mobile App) stuck in review (C grade)
3. **Dependency**: PRD-007 blocked by PRD-003 (Design System)
4. **Capacity**: 2 PRDs in progress, capacity for 1 more (if using worktrees)

**Suggested Next Action**:
- Complete PRD-003 (Design System) to unblock PRD-007
- Start PRD-004 (Landing Page) in parallel using `/code-prd`
- Review PRD-011 to improve grade: `/review-prd`
```

### Step 4: Provide Filtering Options

If user wants to filter:
- By status: `/list-prds --status=ready`
- By priority: `/list-prds --priority=P0`
- By grade: `/list-prds --grade=A,B`

### Step 5: Kanban View (Optional)

When user specifies `--view=kanban` or `-k`, display an ASCII Kanban board:

```
📋 PRD Pipeline - Kanban View

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📝 DRAFT (3)    │ 🔍 REVIEW (2)   │ ✅ READY (5)    │ 🚧 IN PROGRESS  │ ✔️ COMPLETE (8) │
│                 │                 │                 │      (2)        │                 │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │                 │                 │
│ PRD-014         │ PRD-011         │ PRD-004         │ ⚡ PRD-003      │ PRD-001         │
│ Chat Feature    │ Mobile App      │ Landing Page    │ Design System   │ Project Setup   │
│ P1 │ -          │ P0 │ C          │ P0 │ B+         │ P0 │ A- │ Day 3  │ P0 │ 8 days     │
│                 │                 │                 │ 67% ██████▌░░   │ Completed       │
│                 │                 │                 │                 │                 │
│ PRD-016         │                 │ PRD-007         │ PRD-008         │ PRD-002         │
│ Payment Integ.  │ PRD-013         │ User Auth       │ RSS Monitor     │ CI/CD Pipeline  │
│ P0 │ -          │ API v2          │ P0 │ A          │ P0 │ B │ Day 2   │ P1 │ 4 days     │
│                 │ P1 │ B-         │ 🔒 Blocked by   │ 45% ████▌░░░    │ Completed       │
│                 │                 │    PRD-003      │                 │                 │
│ PRD-017         │                 │ PRD-009         │                 │ PRD-005         │
│ Admin Panel     │                 │ Analytics       │                 │ Dark Mode       │
│ P2 │ -          │                 │ P1 │ B          │                 │ P2 │ 2 days     │
│ On hold         │                 │                 │                 │ Completed       │
│                 │                 │ PRD-012         │                 │                 │
│                 │                 │ Email Notify    │                 │ (+ 5 more)      │
│                 │                 │ P1 │ B          │                 │                 │
│                 │                 │                 │                 │                 │
│                 │                 │ PRD-015         │                 │                 │
│                 │                 │ Search          │                 │                 │
│                 │                 │ P2 │ C+         │                 │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Legend:
  Priority: P0 (must-have), P1 (should-have), P2 (nice-to-have), P3 (maybe)
  Grade: A (excellent), B (good), C (needs work), D/F (major issues)
  🔒 = Blocked by dependencies
  ⚡ = Active work today
  Progress bar: █ = 10% complete

💡 Actionable Insights:
  • Complete PRD-003 (Design System) to unblock PRD-007
  • PRD-011 stuck in review for 4 days (C grade) - needs attention
  • PRD-004 (Landing Page) ready, no blockers, P0 priority - start next
  • 2 PRDs in progress, capacity for 1 more with worktrees

🎯 Suggested Next Action: /code-prd PRD-004
```

**Kanban Layout Rules**:

1. **Column Widths**: Each column is 17 characters wide
2. **Card Format**:
   ```
   PRD-XXX          # PRD ID
   Feature Name     # Truncate to 15 chars if needed
   P0 | A           # Priority | Grade (or - if no grade)
   Additional Info  # Status-specific (days, progress, etc.)
   ```

3. **Progress Bars** (for in-progress only):
   - Calculate from git commit activity or time elapsed
   - Format: `XX% ████░░░░░░` (10 blocks, █ for done, ░ for remaining)

4. **Status-Specific Info**:
   - Draft: Show "On hold" if not updated in 7+ days
   - Review: Show grade
   - Ready: Show blockers if any (🔒)
   - In Progress: Show progress bar + days elapsed
   - Complete: Show total days taken

5. **Active Work Indicator**: Use ⚡ for PRDs modified today

6. **Truncation**: If more than 3 PRDs in a column, show first 3 + "(+ N more)"

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft",
      "ready": "product/prds/02-ready",
      "in_progress": "product/prds/03-in-progress",
      "complete": "product/prds/04-complete",
      "archived": "product/prds/99-archived"
    }
  }
}
```

## Success Criteria

- All PRDs discovered and categorized
- Clear status and metrics shown
- Actionable recommendations provided
- User can quickly identify what to work on next

## Related

- Command: `/review-prd` (for PRDs in review)
- Command: `/code-prd` (for ready PRDs)
- Command: `/work-prd` (for in-progress PRDs)

### Dependencies Display Example (NEW in v0.3)

**With dependencies shown**:

```markdown
## ✅ Ready for Development

| PRD ID | Feature | Priority | Grade | Dependencies | Next Action |
|--------|---------|----------|-------|--------------|-------------|
| PRD-004 | Landing Page | P0 | B+ | - | Run `/code-prd` |
| PRD-007 | User Auth | P0 | A | ⏳ PRD-003, 🔨 PRD-005 | Waiting |
| PRD-009 | Analytics | P1 | B | ✅ PRD-003 | Run `/code-prd` |
| PRD-015 | Search | P2 | C+ | ⚠️ PRD-999 | Blocker missing |
```

**Dependency status legend**:
- ✅ Complete and merged
- 🔨 In progress
- ⏳ Ready but not started
- ⚠️ Not found (draft or missing)
- `-` No dependencies

**Actionable insights**:
- PRD-007: Blocked by PRD-003 (ready) and PRD-005 (in progress)
- PRD-009: Ready to start (PRD-003 complete)
- PRD-015: Blocker PRD-999 doesn't exist - needs fixing

