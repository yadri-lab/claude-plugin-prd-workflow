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
- Move PRD to `04-complete/` directory
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

### Step 2: Pre-Merge Conflict Detection & Resolution

**NEW: AI-Powered Conflict Helper**

Before attempting to merge, check for conflicts:

```bash
# Fetch latest main
git fetch origin main

# Check if merge would cause conflicts (dry-run)
git merge-tree $(git merge-base HEAD origin/main) HEAD origin/main
```

#### If Conflicts Detected

```markdown
🔀 Merge Conflict Detected

📂 Files with conflicts:
  - src/auth.ts (lines 45-67)
  - src/config/env.ts (lines 12-18)

🤖 AI Conflict Analysis

**Conflict 1: src/auth.ts**

<<< Your changes (PRD-003 - OAuth):
```typescript
function login(email, password) {
  return OAuth.loginWithGoogle(email, password);
}
```

=======

>>> Main branch (from PRD-005 - Password Reset):
```typescript
function login(email, password) {
  return db.validatePassword(email, password);
}
```

💡 **AI Recommendation**: Keep BOTH (different authentication methods)

```typescript
function login(email, password, method = 'password') {
  if (method === 'oauth') {
    return OAuth.loginWithGoogle(email, password);
  }
  return db.validatePassword(email, password);
}
```

**Why this works**:
- Both features (OAuth + Password) can coexist
- Method parameter allows switching
- Backward compatible (defaults to password)

🔧 Actions:
  [A] Accept AI suggestion (auto-resolve)
  [M] Manual resolution (open editor)
  [S] Skip this file (resolve later)
  [C] Cancel merge

> [User choice]
```

#### If User Accepts AI Suggestion

```markdown
✅ Auto-resolving conflict in src/auth.ts

Applied fix:
  - Merged both login methods
  - Added method parameter
  - Maintained backward compatibility

✔️ Conflict 1/2 resolved

🔀 Next conflict: src/config/env.ts
...
```

#### After All Conflicts Resolved

```markdown
✅ All conflicts resolved!

📊 Summary:
  - 2 files had conflicts
  - 2 auto-resolved by AI
  - 0 manual resolutions needed

🧪 Next: Run tests to verify merge
  npm test

Continue with merge? (y/n)
```

### Step 3: Verify PR Status

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

### Step 3.5: Document Session Summary (Auto)

Automatically capture work session for SESSION_CONTEXT tracking:

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 SESSION DOCUMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Quick summary for context tracking (1-2 sentences):"
echo ""
read -p "> " SESSION_SUMMARY

# Optional: key technical decision
echo ""
echo "Any key technical decision? (optional, Enter to skip)"
read -p "> " SESSION_DECISION

# Optional: total time spent
echo ""
echo "Total time spent on PRD-${PRD_NUM}? (e.g., 12h, 3d, optional)"
read -p "> " TOTAL_TIME
TOTAL_TIME=${TOTAL_TIME:-""}

# Prepare SESSION_CONTEXT
SESSION_CONTEXT="docs/SESSION_CONTEXT.md"
TODAY=$(date +%Y-%m-%d)

# Create SESSION_CONTEXT if doesn't exist
if [ ! -f "$SESSION_CONTEXT" ]; then
  mkdir -p docs
  cat > "$SESSION_CONTEXT" <<EOF
# Session Context

Work sessions documenting development progress, decisions, and context.

**Format**: Synthetic entries (concise, actionable)
**Archival**: Oldest sessions archived automatically when >10 sessions exist

---

EOF
fi

# Get next session number
LAST_SESSION=$(grep -oP '^## Session \K\d+' "$SESSION_CONTEXT" | sort -n | tail -1)
NEXT_SESSION=$((${LAST_SESSION:-0} + 1))

# Build session entry (synthetic format)
SESSION_ENTRY="## Session ${NEXT_SESSION}: PRD-${PRD_NUM} (${TODAY}$([ -n "$TOTAL_TIME" ] && echo ", $TOTAL_TIME"))
- ${SESSION_SUMMARY}$([ -n "$SESSION_DECISION" ] && echo "
- **Decision**: ${SESSION_DECISION}")

"

# Append to SESSION_CONTEXT
echo "$SESSION_ENTRY" >> "$SESSION_CONTEXT"

echo ""
echo "✅ Session $NEXT_SESSION added to SESSION_CONTEXT"

# Auto-archive if >10 sessions
SESSION_COUNT=$(grep -c '^## Session' "$SESSION_CONTEXT")

echo ""
echo "🔍 Checking session count: $SESSION_COUNT sessions"

if [ "$SESSION_COUNT" -gt 10 ]; then
  echo ""
  echo "🗄️  Auto-archiving (keeping last 10 sessions)..."

  # Find oldest session (lowest number)
  OLDEST_SESSION=$(grep -oP '^## Session \K\d+' "$SESSION_CONTEXT" | sort -n | head -1)

  # Extract oldest session content
  OLDEST_CONTENT=$(awk "/^## Session ${OLDEST_SESSION}:/{flag=1} flag; /^## Session /{if(flag && !/^## Session ${OLDEST_SESSION}:/) exit}" "$SESSION_CONTEXT")

  # Determine archive file path (by month)
  YEAR=$(date +%Y)
  MONTH=$(date +%m)
  ARCHIVE_DIR="docs/archives"
  ARCHIVE_FILE="$ARCHIVE_DIR/session-history-${YEAR}-${MONTH}.md"

  # Create archive directory if needed
  mkdir -p "$ARCHIVE_DIR"

  # Create or append to archive file
  if [ ! -f "$ARCHIVE_FILE" ]; then
    cat > "$ARCHIVE_FILE" <<EOF
# Session History - $YEAR-$MONTH

Archived sessions from SESSION_CONTEXT to keep main file manageable (≤10 sessions).

---

EOF
  fi

  # Append oldest session to archive
  echo "$OLDEST_CONTENT" >> "$ARCHIVE_FILE"
  echo "" >> "$ARCHIVE_FILE"

  # Remove oldest session from SESSION_CONTEXT
  awk "/^## Session ${OLDEST_SESSION}:/{flag=1; next} /^## Session /{flag=0} !flag" "$SESSION_CONTEXT" > "${SESSION_CONTEXT}.tmp"
  mv "${SESSION_CONTEXT}.tmp" "$SESSION_CONTEXT"

  echo "   ✅ Archived Session $OLDEST_SESSION → $ARCHIVE_FILE"
  echo "   ✅ SESSION_CONTEXT now has $((SESSION_COUNT - 1)) sessions"
else
  echo "   ✅ No archival needed (≤10 sessions)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Example session entry**:
```markdown
## Session 15: PRD-003 (2025-10-25, 12h)
- Implemented OAuth2 integration with Google. Added token refresh logic and error handling.
- **Decision**: Chose OAuth2 library v3 over v2 for better TypeScript support
```

**Behavior**:
- Automatically captures session summary during PRD completion
- Synthetic format (1-2 sentences + optional decision)
- Auto-archives when >10 sessions exist
- Non-blocking if user skips summary (Enter)
- Creates monthly archive files in `docs/archives/`

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
mv "$PRD_FILE" "product/prds/04-complete/250915-oauth2-integration-v1.md"

echo "✅ Moved PRD to 04-complete/"
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
- ✅ PRD moved to 04-complete/
- ✅ Worktree removed
- ✅ Branches deleted
- ✅ WORK_PLAN.md updated
- ✅ Session documented in SESSION_CONTEXT

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
  },
  "session_management": {
    "enabled": true,
    "max_sessions": 10,
    "archive_path": "docs/archives",
    "archive_format": "session-history-{YYYY}-{MM}.md"
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
ℹ️ PRD-003 is already in 04-complete/

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
