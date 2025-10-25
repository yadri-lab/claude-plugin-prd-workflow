---
name: code-prd
description: Start feature development with Git worktree setup
category: PRD Management
---

# Code PRD Command

Start development on an approved PRD with Git worktree isolation.

## Purpose

Create feature branch, set up isolated worktree, and prepare development environment for parallel feature work.

## Workflow

### Step 1: List Ready PRDs

Scan `product/prds/03-ready/` for approved PRDs.

Display table:
```markdown
📋 **PRDs Ready for Development (03-ready/)**

| # | PRD ID | Feature | Priority | Grade |
|---|--------|---------|----------|-------|
| 1 | PRD-003 | Design System | P0 | A- |
| 2 | PRD-004 | Landing Page | P0 | B+ |
| 3 | PRD-008 | RSS Monitoring | P0 | A |

Which PRD are you working on? (1-3 or PRD-XXX)
```

### Step 2: Verify PRD Status

Read selected PRD and validate:
- ✅ Status = "Ready for Development" or "Approved"
- ✅ PRD ID exists and follows format
- ✅ Acceptance criteria defined
- ✅ No hard blockers

If validation fails, warn user but allow proceeding.

### Step 3: Create Feature Branch

**Read branch naming configuration**:

1. **Check `.claude/config.json` for branch_naming settings**:
   ```javascript
   // If config exists:
   const branch_config = {
     prefix: config.prd_workflow.branch_naming.prefix || "feat",
     separator: config.prd_workflow.branch_naming.separator || "-",
     pattern: config.prd_workflow.branch_naming.pattern || "{prefix}/{prd_id}{separator}{feature_name}"
   }
   ```

2. **Generate branch name** using pattern and PRD ID from selected PRD:
   ```javascript
   // Extract PRD ID and feature name from selected PRD
   const prd_id = "WTC-PRD-003";  // From PRD metadata
   const feature_name = "design-system";  // Slugified from feature name

   // Apply pattern
   let branch_name = branch_config.pattern;
   branch_name = branch_name.replace("{prefix}", branch_config.prefix);
   branch_name = branch_name.replace("{prd_id}", prd_id);
   branch_name = branch_name.replace("{separator}", branch_config.separator);
   branch_name = branch_name.replace("{feature_name}", feature_name);

   // Result: "feat/WTC-PRD-003-design-system" (if using WTC-PRD prefix)
   // Or: "feat/PRD-003-design-system" (if using default PRD prefix)
   ```

**Examples with different configs**:
- Default: `feat/PRD-003-design-system`
- Watchora: `feat/WTC-PRD-003-design-system`
- AcmeCorp: `feat/ACME-PRD-003-design-system`
- Custom: `feature/PRD-003/design-system` (if pattern changed)

Create branch WITHOUT checking out (important for worktree):
```bash
git checkout main
git pull origin main
git branch feat/WTC-PRD-003-design-system
```

### Step 4: Create Git Worktree (if enabled)

If `config.prd_workflow.worktree.enabled`:

1. Determine worktree path using config pattern
2. Create worktree: `git worktree add <path> <branch>`
3. List all worktrees for confirmation

Example:
```bash
git worktree add ../acmecorp-design-system feat/PRD-003-design-system
git worktree list
```

**Benefits of Worktrees**:
- Work on multiple features in parallel
- No branch switching required
- Isolated dependencies per feature
- Independent dev servers
- Clean Cursor contexts

### Step 5: Move PRD to In Progress

**Important**: Navigate to worktree directory first!

```bash
cd ../acmecorp-design-system
mv product/prds/03-ready/251024-design-system-v1.md \
   product/prds/04-in-progress/251024-design-system-v1.md
```

Update PRD header metadata:
```markdown
**Status**: In Progress
**Started**: 2025-10-25
**Branch**: feat/PRD-003-design-system
**Worktree**: ../acmecorp-design-system/
```

### Step 6: Update WORK_PLAN.md

If enabled, update the PRD pipeline status table to reflect in-progress status.

### Step 7: Commit & Push (from worktree)

Create initial commit from worktree:
```bash
git add product/prds/
git add product/WORK_PLAN.md
git commit -m "feat(PRD-003): Start development in worktree

- Moved PRD to 04-in-progress/
- Updated WORK_PLAN.md status
- Created worktree: ../acmecorp-design-system/

🤖 Generated with Claude Code"

git push -u origin feat/PRD-003-design-system
```

### Step 8: Provide Development Context

Output comprehensive context summary including:
- PRD details (ID, file path, priority, branch, worktree)
- Instructions for opening new editor instance
- Scope summary from PRD
- Tech stack overview
- Acceptance criteria checklist
- Dependencies and blockers
- Next steps for implementation
- Worktree cleanup instructions

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "branch_naming": {
      "prefix": "feat",
      "prd_id_format": "PRD-{number}",
      "pattern": "{prefix}/{prd_id}-{feature_name}"
    },
    "worktree": {
      "enabled": true,
      "parent_directory": "..",
      "naming_pattern": "{project}-{feature}",
      "auto_install_dependencies": true
    }
  }
}
```

## Success Criteria

- Feature branch created successfully
- Worktree directory exists and is functional
- PRD moved to in-progress state
- Initial commit pushed to remote
- Clear development context provided to user

## Related

- Next Command: `/work-prd` (guided implementation)
- Skill: `git-workflow`
- Cleanup: `git worktree remove <path>` when done
