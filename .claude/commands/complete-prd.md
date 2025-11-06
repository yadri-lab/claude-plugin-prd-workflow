---
name: complete-prd
description: Complete and close a PRD after PR is merged to production
category: PRD Management
---

# Complete PRD Command

Mark a PRD as complete - includes PR review, merge, and deployment tracking.

## Purpose

Close the PRD lifecycle loop:
- **Review PR** (if still open)
- **Merge PR** (with conflict resolution)
- **Verify deployment**
- Update PRD status to "Complete"
- Move PRD to `04-complete/` directory
- Clean up Git worktree
- Record completion metrics
- Document session summary

## Workflow

### Step 1: Identify PRD to Complete

Ask user which PRD to complete:

```bash
# List PRDs from both ready and in-progress
ls -1 product/prds/02-ready/*.md product/prds/03-in-progress/*.md 2>/dev/null
```

Show table:
```markdown
📋 **PRDs Ready for Completion**

| # | PRD ID | Feature | Branch | PR Status |
|---|--------|---------|--------|-----------|
| 1 | PRD-003 | OAuth2 Integration | feature/PRD-003-oauth2 | #42 (merged ✅) |
| 2 | PRD-005 | Dark Mode | feature/PRD-005-dark-mode | #45 (open 🔄) |
| 3 | PRD-007 | API v2 | feature/PRD-007-api-v2 | No PR yet ❌ |

Which PRD to complete? (number, PRD-XXX, or filename)
```

### Step 2: Check PR Status

```bash
# Get PR number from PRD file
PRD_FILE="product/prds/02-ready/PRD-031-url-structure-normalization.md"
PR_NUM=$(grep -oP 'PR: #\K\d+' "$PRD_FILE")

if [ -z "$PR_NUM" ]; then
  echo "⚠️  No PR found in PRD file"
  echo ""
  echo "Options:"
  echo "1. Create PR now (recommended)"
  echo "2. Add PR number manually"
  echo "3. Complete without PR (not recommended)"
  exit 1
fi

# Check PR status using GitHub CLI
PR_INFO=$(gh pr view $PR_NUM --json state,mergedAt,baseRefName,reviews,checks,url)
PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
PR_URL=$(echo "$PR_INFO" | jq -r '.url')
```

**Two paths from here**:
- ✅ **PR already MERGED** → Skip to Step 6 (Collect Completion Metadata)
- 🔄 **PR still OPEN** → Continue to Step 3 (PR Review & Merge)

### Step 3: PR Review & Merge (if PR is OPEN)

```markdown
🔄 **PR #34 is OPEN** - Let's review and merge it

📋 PR Details:
- Title: Add URL structure normalization
- Branch: feature/PRD-031-url-structure-normalization
- URL: https://github.com/user/repo/pull/34

📊 Status:
- Reviews: 0 approvals, 0 changes requested
- Checks: ✅ All passing (or ⚠️ 2 pending, ❌ 1 failed)

Options:
1. Review and merge now (recommended)
2. Wait for merge (exit)
3. Force complete without merge (not recommended)

What would you like to do? (1-3)
```

If option 1 (review and merge):

#### Step 3.1: Show PR Diff Summary

```bash
# Get PR diff stats
gh pr diff $PR_NUM --stat

# Show file changes summary
echo ""
echo "📝 Changed Files:"
gh pr diff $PR_NUM --name-only | head -20
```

```markdown
📝 **PR Changes Summary**

Files changed: 8
- src/utils/urlNormalizer.ts (+120, -0) ✨ NEW
- src/routes/api.ts (+15, -3)
- tests/urlNormalizer.test.ts (+200, -0) ✨ NEW
- package.json (+2, -0)
- README.md (+25, -5)

Quick review:
- ✅ Tests added (200 lines)
- ✅ Documentation updated
- ✅ Clean implementation
- ⚠️  No breaking changes detected

Ready to merge? (y/n)
```

#### Step 3.2: Pre-Merge Checks

```bash
# Fetch latest main
git fetch origin main

# Check if already on feature branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/PRD-031-url-structure-normalization" ]; then
  echo "⚠️  Not on feature branch, switching..."
  git checkout feature/PRD-031-url-structure-normalization
fi

# Check for conflicts with main (dry-run)
MERGE_BASE=$(git merge-base HEAD origin/main)
CONFLICTS=$(git merge-tree $MERGE_BASE HEAD origin/main 2>&1 | grep -c "^<<<<<< ")

if [ "$CONFLICTS" -gt 0 ]; then
  echo "🔀 Merge conflicts detected ($CONFLICTS files)"
else
  echo "✅ No conflicts detected"
fi
```

#### Step 3.3: Conflict Resolution (if needed)

**If conflicts detected**:

```markdown
🔀 **Merge Conflicts Detected**

📂 Files with conflicts:
  - src/auth.ts (lines 45-67)
  - src/config/env.ts (lines 12-18)

Let me analyze each conflict...
```

For each conflict:

```markdown
🤖 **Conflict Analysis: src/auth.ts**

**Your changes** (PRD-031 - URL normalization):
```typescript
function processUrl(url: string) {
  return normalizeUrl(url);
}
```

**Main branch** (from PRD-030 - Auth refactor):
```typescript
function processUrl(url: string) {
  return validateAndClean(url);
}
```

💡 **AI Recommendation**: Chain both operations

```typescript
function processUrl(url: string) {
  const validated = validateAndClean(url);
  return normalizeUrl(validated);
}
```

**Why this works**:
- Both validations needed
- Chaining preserves both features
- Order matters: validate first, normalize second
- Backward compatible

🔧 Actions:
  [A] Accept AI suggestion (auto-resolve)
  [M] Manual resolution (I'll open editor)
  [S] Skip this file (resolve later)
  [C] Cancel merge

> [User choice]
```

**If user accepts AI suggestion**:

```bash
# Apply AI-suggested resolution
cat > src/auth.ts.resolved <<EOF
function processUrl(url: string) {
  const validated = validateAndClean(url);
  return normalizeUrl(validated);
}
EOF

mv src/auth.ts.resolved src/auth.ts
git add src/auth.ts
```

```markdown
✅ Auto-resolved conflict in src/auth.ts

Applied changes:
  - Chained validation → normalization
  - Preserved both feature requirements
  - Maintained backward compatibility

✔️ Conflict 1/2 resolved

🔀 Next conflict: src/config/env.ts...
```

**After all conflicts resolved**:

```markdown
✅ **All conflicts resolved!**

📊 Resolution Summary:
  - 2 files had conflicts
  - 2 auto-resolved by AI
  - 0 manual edits needed

🧪 **Next: Verify resolution**
  Running tests to ensure everything works...
```

#### Step 3.4: Run Tests

```bash
# Run test suite
echo "🧪 Running tests..."
npm test

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ All tests passed"
else
  echo "❌ Tests failed - review needed"
  echo ""
  echo "Options:"
  echo "1. Fix tests now"
  echo "2. Cancel merge"
  exit 1
fi
```

```markdown
✅ **Tests Passed!**

Test Results:
- ✅ 245 tests passed
- ⚠️  0 tests skipped
- ❌ 0 tests failed
- ⏱️  Completed in 12.3s

Ready to merge? (y/n)
```

#### Step 3.5: Perform Merge

```bash
# Merge PR using GitHub CLI
gh pr merge $PR_NUM --squash --delete-branch

# Or if user prefers merge commit
# gh pr merge $PR_NUM --merge --delete-branch

# Or rebase
# gh pr merge $PR_NUM --rebase --delete-branch
```

```markdown
🎉 **PR #34 Merged Successfully!**

- ✅ Merged to main
- ✅ Remote branch deleted
- 🔄 Pulling latest main...

git checkout main
git pull origin main
```

### Step 4: Verify Deployment (Optional)

```markdown
📦 **Deployment Tracking**

Is this feature deployed to production? (y/n/skip)
> y

Production deploy date (YYYY-MM-DD or "today"):
> today

Any deployment issues? (Enter to skip)
> Minor cache invalidation, resolved in 10min

Performance check (optional):
- Expected: Response time < 200ms
- Actual:
> 150ms

✅ Deployment verified
```

### Step 5: Structured Retrospective

```markdown
🎯 **PRD Retrospective**

Let's reflect on this PRD implementation:

**1. What went well?** ⭐
   > Clean implementation, tests worked first time

**2. What didn't go as planned?** 🤔
   > URL edge cases took longer than expected (3h → 8h)

**3. What surprised you?** 💡
   > International URL support was simpler than expected

**4. Confidence Score** (1-10, 10 = fully confident)
   > 9

**5. Would you do anything differently?** 🔄
   > Start with edge cases instead of happy path

**6. Tech Debt Created** (optional)
   > TODO: Refactor URL validator to reduce duplication

**7. Key Learnings** (optional)
   > URL normalization needs encoding awareness upfront

**8. Follow-up PRDs** (optional)
   > PRD-032: Add URL schema validation
```

**Retrospective Summary**:
```markdown
📊 **Implementation Assessment**

✅ **What Worked**:
- Clean implementation
- Tests worked first time
- International URL support simpler than expected

⚠️ **Challenges**:
- URL edge cases: 3h estimated → 8h actual (+167%)

💡 **Learnings**:
- URL normalization needs encoding awareness upfront
- Start with edge cases instead of happy path

🔧 **Tech Debt**:
- TODO: Refactor URL validator to reduce duplication

🎯 **Confidence**: 9/10

📋 **Follow-up**:
- PRD-032: Add URL schema validation
```

### Step 6: Document Session Summary (Auto)

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
## Session 15: PRD-031 (2025-11-06, 8h)
- Implemented URL structure normalization with edge case handling and international support.
- **Decision**: Used WHATWG URL API over regex for better standards compliance
```

### Step 7: Update PRD File

Add completion metadata to PRD header:

```markdown
**Status**: Complete ✅
**Completed Date**: 2025-11-06
**PR**: #34
**Production Deploy**: 2025-11-06
**Development Duration**: 8 days
**Estimated vs Actual**: 5 days estimated, 8 days actual (+60%)
**Confidence Score**: 9/10

---

## 🎯 Completion Retrospective

### ✅ What Went Well
- Clean implementation with good test coverage
- Tests worked first time
- International URL support simpler than expected

### ⚠️ Challenges & Surprises
- **Challenge**: URL edge cases took longer than expected (3h → 8h, +167%)
- **Surprise**: International URL support was simpler than expected

### 💡 Key Learnings
- URL normalization needs encoding awareness upfront
- Start with edge cases instead of happy path

### 🔧 Tech Debt Created
- TODO: Refactor URL validator to reduce duplication

### 🔄 Would Do Differently
- Start with edge cases instead of happy path
- Add encoding tests earlier

### 📋 Follow-up Tasks
- PRD-032: Add URL schema validation

---

## 📊 Deployment

- **Merged**: 2025-11-06T14:32:00Z
- **Deployed to production**: 2025-11-06T15:00:00Z
- **Deployment issues**: Minor cache invalidation (resolved in 10 mins)

### Performance
- ✅ Response time: 150ms (target: <200ms)
- ✅ Test coverage: 95% (target: >80%)
- ✅ Security scan: All checks passed

---
```

### Step 8: Move PRD to Complete Directory

```bash
# Get PRD filename
PRD_FILE="product/prds/02-ready/PRD-031-url-structure-normalization.md"

# Determine target directory
if [ -f "product/prds/02-ready/$(basename $PRD_FILE)" ]; then
  SRC_DIR="02-ready"
elif [ -f "product/prds/03-in-progress/$(basename $PRD_FILE)" ]; then
  SRC_DIR="03-in-progress"
fi

# Move to complete
mv "product/prds/$SRC_DIR/$(basename $PRD_FILE)" "product/prds/04-complete/$(basename $PRD_FILE)"

echo "✅ Moved PRD from $SRC_DIR/ to 04-complete/"
```

### Step 9: Clean Up Git Worktree

```markdown
🌳 **Clean up Git worktree?**

Current worktree: worktrees/prd-031-url-structure-normalization/
Branch: feature/PRD-031-url-structure-normalization (merged ✅, remote deleted ✅)

Options:
1. Remove worktree and delete local branch (recommended)
2. Remove worktree, keep local branch
3. Keep worktree (not recommended)

What would you like to do? (1-3)
```

If option 1 (recommended):
```bash
# Remove worktree
git worktree remove worktrees/prd-031-url-structure-normalization/

# Delete local branch (safe since merged)
git branch -d feature/PRD-031-url-structure-normalization

echo "✅ Cleaned up worktree and local branch"
```

### Step 10: Update WORK_PLAN.md

Update the active pipeline table:

```bash
# Remove from "Ready" or "In Progress" section
# Add to "Completed" section with metrics
```

**Before**:
```markdown
## 📊 Active Pipeline

### Ready to Code (2 PRDs)
| PRD ID | Feature | Priority | Created |
|--------|---------|----------|---------|
| PRD-031 | URL Structure Normalization | P1 | 2025-10-29 |
| PRD-032 | Schema Validation | P2 | 2025-10-30 |

### In Progress (1 PRDs)
| PRD ID | Feature | Owner | Started | Days | Status |
|--------|---------|-------|---------|------|--------|
| PRD-033 | Rate Limiting | @bob | 2025-11-01 | 5 | In Dev |
```

**After**:
```markdown
## 📊 Active Pipeline

### Ready to Code (1 PRDs)
| PRD ID | Feature | Priority | Created |
|--------|---------|----------|---------|
| PRD-032 | Schema Validation | P2 | 2025-10-30 |

### In Progress (1 PRDs)
| PRD ID | Feature | Owner | Started | Days | Status |
|--------|---------|-------|---------|------|--------|
| PRD-033 | Rate Limiting | @bob | 2025-11-01 | 5 | In Dev |

### Recently Completed (Last 30 days)
| PRD ID | Feature | Completed | Duration | PR | Confidence | Deploy |
|--------|---------|-----------|----------|----|-----------|----|
| PRD-031 | URL Structure Normalization | 2025-11-06 | 8 days | #34 | 9/10 | 2025-11-06 |
| PRD-030 | Auth Refactor | 2025-11-04 | 6 days | #33 | 8/10 | 2025-11-04 |
```

### Step 11: Generate Completion Summary

Show final summary:

```markdown
✅ **PRD-031 Complete!**

📝 **Feature**: URL Structure Normalization
🗓️ **Completed**: 2025-11-06
⏱️ **Duration**: 8 days (estimated: 5 days, +60%)

📊 **Metrics**:
- PR #34: Merged ✅ (today at 14:32)
- Production: Deployed 2025-11-06
- Performance: 150ms response time (target: <200ms) ✅
- Test Coverage: 95% (target: >80%) ✅
- Confidence: 9/10

🎯 **Retrospective**:
- ✅ Clean implementation, tests worked first time
- ⚠️  URL edge cases took longer (+167% time)
- 💡 Start with edge cases instead of happy path next time
- 🔧 Tech debt: Refactor URL validator

🧹 **Cleanup**:
- ✅ PR merged and remote branch deleted
- ✅ PRD moved to 04-complete/
- ✅ Worktree removed
- ✅ Local branch deleted
- ✅ WORK_PLAN.md updated
- ✅ Session documented in SESSION_CONTEXT

📚 **Follow-up**:
- PRD-032: Add URL schema validation

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
      "auto_merge_pr": true,
      "auto_cleanup_worktree": true,
      "auto_delete_branches": true,
      "require_production_deploy": false,
      "collect_retrospective": true,
      "confidence_scoring": true,
      "ai_conflict_resolution": true
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
# Interactive (default) - handles both open and merged PRs
/complete-prd

# Specify PRD
/complete-prd PRD-031
/complete-prd PRD-031-url-structure-normalization

# Quick mode (skip optional questions, auto-merge if tests pass)
/complete-prd PRD-031 --quick

# No merge (assume PR is already merged)
/complete-prd PRD-031 --no-merge

# Force complete without PR (not recommended)
/complete-prd PRD-031 --force
```

## Error Handling

**PR has failing checks**:
```
⚠️ PR #34 has failing checks

❌ Failed checks:
  - Build (failed at 12:34)
  - Lint (2 errors)

Options:
1. Fix checks now
2. Wait for checks to pass
3. Force merge anyway (not recommended)

What would you like to do? (1-3)
```

**No PR found**:
```
⚠️ No PR found for PRD-031

Was a PR created? If yes:
1. Add PR number to PRD manually
2. Re-run /complete-prd

If no PR was needed (hotfix, docs-only, etc.):
1. Run /complete-prd PRD-031 --no-pr
```

**PRD already complete**:
```
ℹ️ PRD-031 is already in 04-complete/

Completed: 2025-11-06
PR: #34
Confidence: 9/10

Did you mean to /archive-prd instead?
```

**Merge conflicts can't be auto-resolved**:
```
🔀 Complex merge conflicts detected

These conflicts need manual resolution:
  - src/complex-logic.ts (20 lines affected)
  - database/schema.sql (structural changes)

I've started the merge process. Please:
1. Resolve conflicts manually
2. Run tests: npm test
3. Complete merge: git commit
4. Re-run: /complete-prd PRD-031

Opening files with conflicts...
```

## Best Practices

- ✅ Review PR changes before merging
- ✅ Trust AI conflict resolution for simple cases
- ✅ Always run tests after conflict resolution
- ✅ Record honest retrospective (what worked, what didn't)
- ✅ Use confidence scoring (be realistic)
- ✅ Document tech debt created
- ✅ Track "would do differently" learnings
- ✅ Clean up worktrees immediately
- ✅ Archive PRDs after 2-4 weeks in complete

## Integration

Works seamlessly with:
- **`/code-prd`**: Creates worktree that this command will clean up
- **`/smart-pr`**: Creates PR that this command will merge
- **GitHub CLI**: Handles PR merge and checks
- **Git Worktree**: Manages feature branch cleanup
- **SESSION_CONTEXT**: Tracks work sessions
- **WORK_PLAN.md**: Updates pipeline status

## Key Improvements (v3.0.0)

🎯 **Integrated PR Merge**:
- No longer blocks on OPEN PRs
- Reviews and merges PR within completion flow
- Handles conflict detection and AI resolution
- Runs tests before merging

🎯 **Structured Retrospective**:
- What went well / didn't / surprises
- Confidence scoring (1-10)
- "Would do differently" reflection
- Tech debt tracking

🎯 **Honest Assessment**:
- Not just "done" but "how confident"
- Captures challenges and learnings
- Documents time estimation accuracy
- Tracks follow-up PRDs

---

## Related Commands

- `/code-prd` - Start development (creates worktree)
- `/work-prd` - Guided implementation
- `/smart-pr` - Create pull request
- `/review-prd` - Review PRD before coding
- `/archive-prd` - Archive old completed PRDs
- `/list-prds` - View all PRDs and their status

---

**Plugin**: claude-prd-workflow
**Category**: PRD Management
**Version**: 3.0.0
**Requires**: Git 2.25+, GitHub CLI (gh), Node.js (for tests)
