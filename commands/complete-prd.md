---
name: complete-prd
description: Complete and close a PRD after PR is merged to production
category: PRD Management
---

# Complete PRD Command

Mark a PRD as complete after its PR has been merged and deployed to production.

## Purpose

Close the PRD lifecycle loop:
- Verify PR is merged
- Update PRD status to "Complete"
- Move PRD to `05-complete/` directory
- Clean up Git worktree (optional)
- Update WORK_PLAN.md
- Record completion metrics

## Workflow

### Step 1: Identify PRD to Complete

Ask user which PRD to complete:

```bash
# List in-progress PRDs
ls -1 product/prds/03-in-progress/*.md
```

Show table:
```markdown
📋 **In-Progress PRDs**

| # | PRD ID | Feature | Branch | PR Status |
|---|--------|---------|--------|-----------|
| 1 | PRD-003 | OAuth2 Integration | feature/PRD-003-oauth2 | #42 (merged ✅) |
| 2 | PRD-005 | Dark Mode | feature/PRD-005-dark-mode | #45 (open) |
| 3 | PRD-007 | API v2 | feature/PRD-007-api-v2 | No PR yet |

Which PRD to complete? (number, PRD-XXX, or filename)
```

### Step 2: Verify PR Status

Check if PR is actually merged:

```bash
# Get PR number from PRD file
PR_NUM=$(grep -oP 'PR: #\K\d+' product/prds/03-in-progress/YYMMDD-oauth2-integration-v1.md)

# Check PR status using GitHub CLI
gh pr view $PR_NUM --json state,mergedAt,baseRefName

# Example output:
# {
#   "state": "MERGED",
#   "mergedAt": "2025-10-25T14:32:00Z",
#   "baseRefName": "main"
# }
```

**Validation**:
- ✅ PR must be **MERGED** (not just closed)
- ✅ Merged into main/master branch
- ❌ If not merged, show warning:

```markdown
⚠️ **PR #42 is not merged yet**

Current status: OPEN
Reviewers: @user1, @user2

Options:
1. Wait for merge (exit for now)
2. Mark as complete anyway (not recommended)
3. Check a different PR number

What would you like to do? (1-3)
```

### Step 3: Collect Completion Metadata

Ask user for completion details:

```markdown
✅ PR #42 merged successfully!

Let's record some completion metrics:

1. **Production deploy date** (YYYY-MM-DD or "not yet"):
   > 2025-10-25

2. **Did everything go as planned?** (y/n):
   > y

3. **Any deployment issues?** (optional):
   > Minor issue with cache invalidation, resolved in 10 mins

4. **Performance vs. targets** (optional):
   - Expected: Response time < 200ms
   - Actual: 150ms ✅

5. **Key learnings** (optional):
   > OAuth2 library v3 works better than v2 for our use case.
   > Should document token refresh flow more clearly.

6. **Follow-up tasks** (optional PRD IDs or descriptions):
   > PRD-008: Improve OAuth error messages
```

### Step 4: Update PRD File

Add completion metadata to PRD header:

```markdown
**Status**: Complete ✅
**Completed Date**: 2025-10-25
**PR**: #42
**Production Deploy**: 2025-10-25
**Development Duration**: 12 days
**Estimated vs Actual**: 10 days estimated, 12 days actual (+20%)

---

## Completion Notes

### Deployment
- Merged: 2025-10-25T14:32:00Z
- Deployed to production: 2025-10-25T15:00:00Z
- Deployment issues: Minor cache invalidation issue (resolved in 10 mins)

### Performance
- ✅ Response time: 150ms (target: <200ms)
- ✅ Test coverage: 92% (target: >80%)
- ✅ Security scan: All checks passed

### Learnings
- OAuth2 library v3 works better than v2 for our use case
- Should document token refresh flow more clearly
- Error handling for token expiration needs better UX

### Follow-up Tasks
- PRD-008: Improve OAuth error messages
- TODO: Add monitoring alerts for failed auth attempts

---
```

### Step 5: Move PRD to Complete Directory

```bash
# Get PRD filename
PRD_FILE="product/prds/03-in-progress/250915-oauth2-integration-v1.md"

# Move to complete
mv "$PRD_FILE" "product/prds/05-complete/250915-oauth2-integration-v1.md"

echo "✅ Moved PRD to 05-complete/"
```

### Step 6: Clean Up Git Worktree (Optional)

Ask user if they want to clean up the worktree:

```markdown
🌳 **Clean up Git worktree?**

Current worktree: worktrees/prd-003-oauth2-integration/
Branch: feature/PRD-003-oauth2-integration (merged ✅)

Options:
1. Remove worktree and delete branch (recommended)
2. Remove worktree, keep branch
3. Keep worktree (not recommended)

What would you like to do? (1-3)
```

If option 1 (recommended):
```bash
# Remove worktree
git worktree remove worktrees/prd-003-oauth2-integration/

# Delete local branch
git branch -d feature/PRD-003-oauth2-integration

# Delete remote branch (optional, ask user)
git push origin --delete feature/PRD-003-oauth2-integration

echo "✅ Cleaned up worktree and branches"
```

### Step 7: Update WORK_PLAN.md

Update the active pipeline table:

```bash
# Remove from "In Progress" section
# Add to "Completed" section with metrics

# Update in WORK_PLAN.md:
```

**Before**:
```markdown
## 📊 Active Pipeline

### In Progress (3 PRDs)
| PRD ID | Feature | Owner | Started | Days | Status |
|--------|---------|-------|---------|------|--------|
| PRD-003 | OAuth2 Integration | @alice | 2025-10-13 | 12 | In Dev |
| PRD-005 | Dark Mode | @bob | 2025-10-20 | 5 | In Dev |
```

**After**:
```markdown
## 📊 Active Pipeline

### In Progress (2 PRDs)
| PRD ID | Feature | Owner | Started | Days | Status |
|--------|---------|-------|---------|------|--------|
| PRD-005 | Dark Mode | @bob | 2025-10-20 | 5 | In Dev |

### Recently Completed (Last 30 days)
| PRD ID | Feature | Completed | Duration | PR | Deploy |
|--------|---------|-----------|----------|----|----|
| PRD-003 | OAuth2 Integration | 2025-10-25 | 12 days | #42 | 2025-10-25 |
| PRD-001 | Project Setup | 2025-09-15 | 8 days | #12 | 2025-09-15 |
```

### Step 8: Generate Completion Summary

Show final summary:

```markdown
✅ **PRD-003 Complete!**

📝 **Feature**: OAuth2 Integration
🗓️ **Completed**: 2025-10-25
⏱️ **Duration**: 12 days (estimated: 10 days, +20%)

📊 **Metrics**:
- PR #42: Merged ✅
- Production: Deployed 2025-10-25
- Performance: 150ms response time (target: <200ms) ✅
- Test Coverage: 92% (target: >80%) ✅
- Security: All checks passed ✅

🧹 **Cleanup**:
- ✅ PRD moved to 05-complete/
- ✅ Worktree removed
- ✅ Branches deleted
- ✅ WORK_PLAN.md updated

📚 **Follow-up**:
- PRD-008: Improve OAuth error messages

🎉 **Great work! Feature is live in production.**

Next steps:
- Monitor production metrics
- Watch for user feedback
- Consider /archive-prd in 2-4 weeks
```

## Configuration

Respects `prd_workflow.completion` configuration:

```json
{
  "prd_workflow": {
    "completion": {
      "enabled": true,
      "auto_cleanup_worktree": true,
      "auto_delete_branches": false,
      "require_pr_merged": true,
      "require_production_deploy": false,
      "collect_metrics": true,
      "collect_learnings": true
    }
  }
}
```

## Options

```bash
# Interactive (default)
/complete-prd

# Specify PRD
/complete-prd PRD-003
/complete-prd 250915-oauth2-integration-v1

# Quick mode (skip optional questions)
/complete-prd PRD-003 --quick

# Force complete without PR check (not recommended)
/complete-prd PRD-003 --force
```

## Error Handling

**PR not merged**:
```
❌ Cannot complete PRD-003: PR #42 is still OPEN

Options:
1. Wait for merge
2. Complete anyway (--force)

Recommendation: Wait for PR to be merged first.
```

**No PR found**:
```
⚠️ No PR found for PRD-003

Was a PR created? If yes:
1. Add PR number to PRD manually
2. Re-run /complete-prd

If no PR was needed (hotfix, etc.):
1. Run /complete-prd PRD-003 --no-pr
```

**PRD already complete**:
```
ℹ️ PRD-003 is already in 05-complete/

Completed: 2025-10-25
PR: #42

Did you mean to /archive-prd instead?
```

## Best Practices

- ✅ Always verify PR is merged before completing
- ✅ Record deployment date for tracking
- ✅ Document learnings for retrospectives
- ✅ Clean up worktrees to avoid clutter
- ✅ Update WORK_PLAN.md for visibility
- ✅ Archive PRDs after 2-4 weeks in complete

## Integration

Works seamlessly with:
- **`/smart-pr`**: Creates PR that this command will verify
- **`/archive-prd`**: Next step after PRD sits in complete for a while
- **`/list-prds`**: Shows completed PRDs
- **GitHub CLI**: Verifies PR merge status
- **Git Worktree**: Cleans up feature worktrees

---

## Related Commands

- `/code-prd` - Start development (creates worktree)
- `/work-prd` - Guided implementation
- `/smart-pr` - Create pull request
- `/archive-prd` - Archive old completed PRDs
- `/list-prds` - View all PRDs and their status

---

**Plugin**: claude-prd-workflow
**Category**: PRD Management
**Version**: 2.0.0
**Requires**: Git 2.25+, GitHub CLI (gh)
