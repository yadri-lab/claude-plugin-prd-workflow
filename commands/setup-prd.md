---
name: setup-prd
description: Set up development environment (branch + worktree) for PRD
category: PRD Management
---

# Setup PRD Command

Prepare development environment for a PRD by creating a feature branch and Git worktree.

## Purpose

Create isolated development environment for PRD:
- Create feature branch
- Set up Git worktree (optional)
- Move PRD to in-progress
- Update WORK_PLAN.md
- **Accept draft PRDs** (with warning) for parallel workflow

## Workflow

### Step 1: List Available PRDs

Scan PRD directories for available PRDs:
```bash
# Check these directories:
- product/prds/01-draft/
- product/prds/02-approved/
- product/prds/03-in-progress/ (to show what's already being worked on)
```

Display table:
```markdown
📋 **PRDs Available**

**Draft** (Review later on feature branch):
| # | PRD ID | Feature | Created |
|---|--------|---------|---------|
| 1 | PRD-007 | OAuth2 Integration | 2025-10-26 |
| 2 | PRD-008 | Dark Mode Support | 2025-10-26 |

**Approved** (Ready to code):
| # | PRD ID | Feature | Grade |
|---|--------|---------|-------|
| 3 | PRD-003 | Design System | A- |
| 4 | PRD-004 | Landing Page | B+ |

**In Progress** (Already being developed):
| # | PRD ID | Feature | Branch |
|---|--------|---------|--------|
| 5 | PRD-005 | API v2 | feature/PRD-005-api-v2 |

Which PRD? (number, PRD-XXX, or filename)
```

### Step 2: Validate and Warn if Draft

If selected PRD is in draft:
```markdown
⚠️ **PRD-007 is still in DRAFT**

This PRD hasn't been reviewed or approved yet.

**Recommended Workflow**:
1. Create feature branch now (parallel workflow)
2. Review and refine PRD on feature branch
3. Start coding after review

**Benefits**:
- Keeps your Main branch free
- Can review in separate Cursor instance
- Multiple PRDs can be prepped in parallel

**Continue anyway?** (y/n or more info)
> y

✅ Proceeding with draft PRD
💡 Remember to /review-prd PRD-007 on the feature branch!
```

If user says "no", cancel gracefully.

### Step 3: Generate Feature Branch Name

Read branch naming configuration from .claude/config.json or use defaults

Default pattern: feature/PRD-{ID}-{slug}

Examples:
- feature/PRD-007-oauth2-integration
- feature/PRD-008-dark-mode-support

Extract slug from PRD filename:
```javascript
// From: PRD-007-oauth2-integration.md
// Extract: oauth2-integration
const slug = filename.replace(/^PRD-\d+-/, '').replace('.md', '');
```

### Step 4: Create Feature Branch

```bash
# Ensure on main and up to date
git checkout main
git pull origin main

# Create branch
git branch feature/PRD-007-oauth2-integration

# Don't checkout yet (worktree will do that if enabled)
```

### Step 5: Create Git Worktree (Optional)

If worktree enabled in config:
```bash
# Worktree path based on config or default
# Default: worktrees/prd-007-oauth2-integration/

git worktree add worktrees/prd-007-oauth2-integration feature/PRD-007-oauth2-integration

✅ Created worktree: worktrees/prd-007-oauth2-integration/
```

If worktree disabled:
```bash
# Just checkout the branch
git checkout feature/PRD-007-oauth2-integration

✅ Switched to branch: feature/PRD-007-oauth2-integration
```

### Step 6: Move PRD to In-Progress

```bash
# Move from draft or approved to in-progress
mv product/prds/01-draft/PRD-007-oauth2-integration.md \
   product/prds/03-in-progress/PRD-007-oauth2-integration.md

# Or from approved:
mv product/prds/02-approved/PRD-007-oauth2-integration.md \
   product/prds/03-in-progress/PRD-007-oauth2-integration.md
```

Update PRD status field:
```markdown
**Status**: In Progress
**Started**: 2025-10-26
**Branch**: feature/PRD-007-oauth2-integration
```

### Step 7: Update WORK_PLAN.md

Move PRD from draft/approved to in-progress section:
```markdown
## In Progress (1 PRD)
| PRD ID | Feature | Owner | Started | Branch |
|--------|---------|-------|---------|--------|
| PRD-007 | OAuth2 Integration | @alice | 2025-10-26 | feature/PRD-007-oauth2-integration |
```

### Step 8: Provide Next Steps

```markdown
🌳 **Development Environment Ready**

📂 Worktree: worktrees/prd-007-oauth2-integration/
🌿 Branch: feature/PRD-007-oauth2-integration
📄 PRD: product/prds/03-in-progress/PRD-007-oauth2-integration.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**If PRD was DRAFT**:
⚠️ Remember to review first: /review-prd PRD-007

**Next Steps**:
1. cd worktrees/prd-007-oauth2-integration/
2. /review-prd PRD-007 (if still draft)
3. /work-prd PRD-007 (guided implementation)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Main branch is now free** for other work!

💡 **Parallel Workflow Tip**:
Open a new Cursor window in the worktree directory:
  code worktrees/prd-007-oauth2-integration/

This allows you to:
- Work on PRD-007 in one Cursor instance
- Continue other work on Main in another instance
```

## Configuration

Respects prd_workflow configuration:
```json
{
  "prd_workflow": {
    "branch_naming": {
      "prefix": "feature",
      "separator": "/",
      "pattern": "{prefix}/{prd_id_prefix}-{prd_number}-{slug}"
    },
    "worktree": {
      "enabled": true,
      "base_path": "worktrees"
    },
    "allow_draft_checkout": true
  }
}
```

## Options

```bash
# Interactive
/code-prd

# Specify PRD
/code-prd PRD-007

# Skip worktree creation
/code-prd PRD-007 --no-worktree

# Force draft (skip warning)
/code-prd PRD-007 --force
```

## Error Handling

**PRD already in progress**:
```markdown
⚠️ PRD-007 is already in progress

Branch: feature/PRD-007-oauth2-integration
Worktree: worktrees/prd-007-oauth2-integration/

Options:
1. Switch to existing branch
2. Create new branch (PRD-007-v2)
3. Cancel

Choose: (1-3)
```

**Git not clean**:
```markdown
❌ Git working directory not clean

Uncommitted changes detected. Please:
1. Commit changes
2. Stash changes
3. Or resolve conflicts

Then try again.
```

## Best Practices

- ✅ **Create branch even for drafts** - Enables parallel workflow
- ✅ **Use worktrees** - Isolate features, no branch switching
- ✅ **Review on feature branch** - Keeps Main free
- ✅ **Open separate Cursor** - One instance per feature
- ⚠️ **Don't forget to review** - If starting from draft

## Integration

Works seamlessly with:
- /create-prd - Creates draft PRDs
- /review-prd - Review on feature branch
- /work-prd - Guided development
- Git worktrees - Parallel feature development

---

Plugin: claude-prd-workflow
Category: PRD Management  
Version: 2.2.0
Requires: Git 2.25+
