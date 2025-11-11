---
name: complete-prd
description: Complete and close a PRD after PR is merged to production
category: PRD Management
version: 0.4.2
---

# Complete PRD Command

Mark a PRD as complete after successful PR merge and deployment.

## Purpose

Close the PRD lifecycle:
- Review and merge PR (if needed)
- Verify production deployment
- Update PRD status to "Complete"
- Move PRD to `04-complete/`
- Clean up worktree and branch
- Document completion metrics

## Workflow

### 1. Identify PRD to Complete

List PRDs from `02-ready/` and `03-in-progress/` with their PR status:
- PRD ID and feature name
- Branch name
- PR status (merged ✅ / open 🔄 / none ❌)

User selects PRD by number, ID, or filename.

### 2. Check PR Status

**If no PR**:
- ❌ Cannot complete without PR
- Suggest: Create PR first or use `/code-prd` to finish implementation

**If PR open**:
- Show PR details (branch, checks, approvals, conflicts)
- Ask: Review and merge now? (yes/no)

**If PR merged**:
- ✅ Proceed to deployment verification

### 3. Review & Merge PR (if open)

**PR Review checklist**:
- Code quality: Clean, readable, follows patterns
- Tests: Coverage adequate, passing
- Security: No obvious vulnerabilities
- Performance: No regressions
- Documentation: Updated if needed

**Merge process**:
- Check CI/CD status (all green?)
- Check conflicts (rebase if needed)
- Merge to main branch
- Delete feature branch (optional)

### 4. Verify Deployment

**Check deployment status**:
- Latest commit on main deployed?
- Deployment successful?
- Health checks passing?
- Rollback needed?

**If not deployed**:
- Wait for auto-deployment OR
- Trigger manual deployment OR
- Schedule completion after deployment

### 5. Update PRD Document

Add completion section to PRD frontmatter:

```yaml
---
status: complete
completed_date: YYYY-MM-DD
pr_number: #XX
pr_url: https://github.com/...
deployment_verified: true
actual_effort: X days
notes: |
  Brief completion notes
---
```

### 6. Move to Complete

```bash
git mv product/prds/03-in-progress/PRD-XXX-name.md product/prds/04-complete/
git commit -m "docs: Complete PRD-XXX - Feature Name"
git push origin main
```

### 7. Cleanup

**Worktree cleanup**:
- Remove worktree (if exists)
- Delete local feature branch
- Optionally delete remote branch (if not auto-deleted)

**Verification**:
- PRD in `04-complete/` directory
- Worktree removed
- Branch cleaned up
- Git status clean

### 8. Completion Summary

Output summary for user:

```markdown
✅ PRD-XXX Complete

Feature: {Feature Name}
PR: #{number} (merged on {date})
Deployment: Verified in production
Effort: {estimated} → {actual} days

Files moved:
• PRD → product/prds/04-complete/PRD-XXX-name.md

Cleanup:
• Worktree removed
• Branch deleted

Next: Ready for /archive-prd (if project complete)
```

## Edge Cases

**Merge conflicts**:
- Show conflict files
- Suggest: Rebase feature branch on main
- Offer to help resolve conflicts

**Failed CI/CD**:
- Show failing checks
- Cannot merge until fixed
- Suggest: Fix issues in feature branch

**Deployment not verified**:
- Cannot mark complete
- Options: Wait, verify manually, or defer completion

**Missing PR metadata**:
- PRD doesn't have PR number
- Search for PR by branch name
- Ask user to confirm PR number

## Principles

**Safety first**:
- Don't merge failing PRs
- Verify deployment before marking complete
- Keep PRD metadata accurate

**Clean state**:
- Remove worktrees to free disk space
- Delete merged branches to reduce clutter
- Keep git history clean

**Accurate tracking**:
- Update actual effort vs estimate
- Record deployment date
- Note any issues encountered

**Reversible**:
- Can manually move PRD back if needed
- Git history preserves all changes
- Branch can be recreated from main

## Configuration

```json
{
  "prd_workflow": {
    "directories": {
      "ready": "product/prds/02-ready",
      "in_progress": "product/prds/03-in-progress",
      "complete": "product/prds/04-complete"
    },
    "completion": {
      "require_pr": true,
      "verify_deployment": true,
      "auto_cleanup": true,
      "delete_remote_branch": false
    }
  }
}
```

## Success Criteria

- ✅ PR merged to main branch
- ✅ Deployment verified in production
- ✅ PRD moved to `04-complete/` with metadata
- ✅ Worktree and branches cleaned up
- ✅ Git status clean
- ✅ User has completion summary

## Example

```markdown
$ /complete-prd PRD-007

📋 Completing PRD-007: OAuth2 Integration

PR Status: #42 (merged ✅)
Deployment: Production (verified ✅)

Updating PRD metadata...
Moving to product/prds/04-complete/PRD-007-oauth2.md
Cleaning up worktree at ../worktrees/PRD-007-oauth2
Removing branch feature/PRD-007-oauth2

✅ PRD-007 Complete

Effort: 9 days (estimated) → 7 days (actual)
Delivered: 2 days early

Next: Feature live in production
```

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
