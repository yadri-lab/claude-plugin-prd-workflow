---
name: archive-prd
description: Archive completed or cancelled PRDs
category: PRD Management
---

# Archive PRD Command

Move completed or cancelled PRDs to archive folder with metadata preservation.

## Purpose

Keep PRD directories clean while preserving historical context:
- Archive completed features
- Archive cancelled/deprecated PRDs
- Maintain searchable history
- Generate archive summary

## Workflow

### Step 1: List Archivable PRDs

Show PRDs from:
- `04-complete/` - Completed and merged
- Any directory if user wants to cancel/deprecate

```markdown
📦 **PRDs Available for Archiving**

## Completed (Ready to Archive)
| # | PRD ID | Feature | Completed | Days Since |
|---|--------|---------|-----------|------------|
| 1 | PRD-001 | Project Setup | 2025-09-15 | 40 days |
| 2 | PRD-002 | CI/CD Pipeline | 2025-09-20 | 35 days |
| 3 | PRD-005 | Database Schema | 2025-10-10 | 15 days |

## Other PRDs
To archive a PRD from another status (e.g., cancelled):
- Enter PRD ID manually
- Enter filename

Which PRD to archive? (number, PRD-XXX, or filename)
```

### Step 2: Confirm Archive Reason

Ask user:
```markdown
Why are you archiving PRD-005 (Database Schema)?

1. ✅ Completed and shipped
2. ❌ Cancelled (no longer needed)
3. 🔀 Superseded by another PRD
4. 🚫 Blocked indefinitely
5. Other (specify)

Select reason: (1-5)
```

### Step 3: Collect Archive Metadata

Based on reason, ask relevant questions:

**If Completed**:
- PR number (if not in PRD)
- Production deploy date
- Any learnings/retrospective notes

**If Cancelled**:
- Why cancelled?
- Was any work done?
- Lessons learned

**If Superseded**:
- Superseded by which PRD?
- What changed in approach?

### Step 4: Update PRD Header

Add archive metadata to PRD:
```markdown
**Status**: Archived
**Archive Reason**: Completed and shipped
**Archived Date**: 2025-10-25
**PR**: #42
**Production Deploy**: 2025-10-15
**Archive Notes**: Successful implementation, no major issues. Performance exceeded targets.
```

### Step 4.5: Auto-Close Orphaned PRs (NEW)

**Purpose**: Clean up draft PRs that were never developed

```bash
echo "🔍 Checking for linked PR..."

# Extract PRD number
PRD_NUMBER=$(basename "$PRD_FILE" | grep -oP 'PRD-\K\d+')

# Find linked PR from PRD metadata
PR_NUMBER=$(grep -m1 '^\*\*PR\*\*:' "$PRD_FILE" | grep -oP '#\K\d+' || echo "")

if [ -z "$PR_NUMBER" ]; then
  # Try to find PR by branch name
  BRANCH_PREFIX=$(jq -r '.prd_workflow.branch_naming.prefix // "feat"' .claude/config.json)
  FEATURE_SLUG=$(basename "$PRD_FILE" .md | sed 's/^PRD-[0-9]*-//')
  BRANCH_NAME="${BRANCH_PREFIX}/PRD-${PRD_NUMBER}-${FEATURE_SLUG}"

  PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number --jq '.[0].number' 2>/dev/null || echo "")
fi

if [ -n "$PR_NUMBER" ]; then
  echo "✅ Found linked PR #$PR_NUMBER"

  # Get PR details
  PR_DETAILS=$(gh pr view "$PR_NUMBER" --json state,isDraft,additions,deletions,commits,mergeable 2>/dev/null)

  if [ -n "$PR_DETAILS" ]; then
    STATE=$(echo "$PR_DETAILS" | jq -r '.state')
    IS_DRAFT=$(echo "$PR_DETAILS" | jq -r '.isDraft')
    ADDITIONS=$(echo "$PR_DETAILS" | jq -r '.additions // 0')
    DELETIONS=$(echo "$PR_DETAILS" | jq -r '.deletions // 0')
    COMMITS=$(echo "$PR_DETAILS" | jq -r '.commits | length')

    echo ""
    echo "PR #$PR_NUMBER Status:"
    echo "  • State: $STATE"
    echo "  • Draft: $IS_DRAFT"
    echo "  • Commits: $COMMITS"
    echo "  • Changes: +$ADDITIONS -$DELETIONS lines"
    echo ""

    # Determine if PR should be auto-closed
    AUTO_CLOSE=false

    if [ "$STATE" = "OPEN" ]; then
      # Check if PR is empty (draft with no real commits)
      TOTAL_CHANGES=$((ADDITIONS + DELETIONS))

      if [ "$IS_DRAFT" = "true" ] && [ "$COMMITS" -le 1 ] && [ "$TOTAL_CHANGES" -le 10 ]; then
        echo "🗑️  PR #$PR_NUMBER is an empty draft (orphaned)"
        echo "   This PR was likely created by /create-prd but never developed"
        echo ""

        # Determine reason for archiving
        ARCHIVE_REASON=$(grep -m1 '^\*\*Archive Reason\*\*:' "$PRD_FILE" | sed 's/.*: //')

        if [[ "$ARCHIVE_REASON" =~ (Cancelled|Blocked|Superseded) ]]; then
          AUTO_CLOSE=true
          CLOSE_REASON="PRD was $ARCHIVE_REASON - work never started"
        else
          # Completed - check if PR has meaningful changes
          echo "⚠️  Warning: PR marked as Draft but PRD is marked as Complete"
          echo "   This might indicate the work was done elsewhere"
          echo ""
          echo "Should this PR be closed? (y/n)"
          read -r response

          if [ "$response" = "y" ]; then
            AUTO_CLOSE=true
            CLOSE_REASON="Work completed elsewhere - draft PR no longer needed"
          fi
        fi

      elif [ "$IS_DRAFT" = "false" ] && [ "$COMMITS" -gt 1 ]; then
        echo "✅ PR #$PR_NUMBER has meaningful work (not closing)"
        echo "   Consider merging or closing manually if no longer needed"

      else
        echo "ℹ️  PR #$PR_NUMBER is $STATE"
        echo "   Manual review recommended"
      fi

      # Auto-close if determined
      if [ "$AUTO_CLOSE" = "true" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🗑️  AUTO-CLOSING ORPHANED PR"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Create closing comment
        CLOSE_COMMENT="🗑️ **Auto-closed by \`/archive-prd\`**

**Reason**: $CLOSE_REASON

## Context
- **PRD**: PRD-${PRD_NUMBER} has been archived
- **Archive Reason**: $ARCHIVE_REASON
- **PR Status**: Empty draft (no development occurred)

This PR was created to reserve the PR number (PRD-PR alignment) but work never started or was completed through other means.

---
*Auto-closed: $(date +%Y-%m-%d\ %H:%M:%S)*"

        # Close the PR with comment
        gh pr close "$PR_NUMBER" --comment "$CLOSE_COMMENT" 2>/dev/null

        if [ $? -eq 0 ]; then
          echo "✅ PR #$PR_NUMBER closed successfully"
          echo ""
          echo "Comment added explaining closure reason"
        else
          echo "⚠️  Failed to close PR #$PR_NUMBER"
          echo "   Close manually: gh pr close $PR_NUMBER"
        fi

        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
      fi

    elif [ "$STATE" = "CLOSED" ]; then
      echo "ℹ️  PR #$PR_NUMBER already closed - no action needed"

    elif [ "$STATE" = "MERGED" ]; then
      echo "✅ PR #$PR_NUMBER was merged - this is expected for completed PRDs"
    fi

  else
    echo "⚠️  Could not fetch PR #$PR_NUMBER details"
    echo "   PR may have been deleted"
  fi
else
  echo "ℹ️  No linked PR found for PRD-${PRD_NUMBER}"
  echo "   This is OK if PR was never created or already closed"
fi

echo ""
```

**Auto-close conditions**:
1. ✅ PR is **draft** (not ready for review)
2. ✅ PR has **≤1 commit** (only initial branch creation)
3. ✅ PR has **≤10 lines changed** (no real work)
4. ✅ PRD is being archived for **non-completion** reasons (Cancelled, Blocked, Superseded)

**Manual review recommended** if:
- PR has multiple commits
- PR has significant code changes
- PRD marked as Complete (but PR still draft)

### Step 5: Move to Archive

Move file:
```bash
mv product/prds/04-complete/250915-project-setup-v1.md \
   product/prds/99-archived/250915-project-setup-v1.md
```

### Step 6: Update WORK_PLAN.md

Remove from active pipeline table.

Add to archive log (if exists):
```markdown
## Archive Log

| Archive Date | PRD ID | Feature | Reason | Notes |
|--------------|--------|---------|--------|-------|
| 2025-10-25 | PRD-005 | Database Schema | Completed | Shipped in v1.0 |
| 2025-10-23 | PRD-001 | Project Setup | Completed | Initial release |
```

### Step 7: Generate Archive Summary

```markdown
✅ **PRD Archived: PRD-005 - Database Schema**

**From**: product/prds/04-complete/
**To**: product/prds/99-archived/
**Reason**: Completed and shipped

## Summary
- **Developed**: Sep 20 - Oct 10 (20 days)
- **PR**: #42 (merged Oct 10)
- **Deployed**: Oct 15
- **Grade**: A (achieved all P0 criteria)

## Impact
- Shipped to production successfully
- Performance exceeded targets (500ms → 120ms queries)
- No post-launch issues

## Learnings
- Postgres JSONB columns were excellent choice
- Should have added more indices upfront
- Migration testing saved us from downtime

**Archive Location**: `product/prds/99-archived/250915-database-schema-v1.md`

---

**Active PRDs**: 11 (down from 12)
**Archived PRDs**: 16 (up from 15)
```

## Archive Organization

Optional: Organize archives by year or quarter:
```
99-archived/
  2024/
    Q3/
      240815-feature-x.md
    Q4/
      241020-feature-y.md
  2025/
    Q4/
      251025-feature-z.md
```

Configurable via:
```json
{
  "prd_workflow": {
    "archive": {
      "organize_by": "year", // "year", "quarter", or "flat"
      "retention_days": 0 // 0 = forever
    }
  }
}
```

## Success Criteria

- PRD moved to archive directory
- Archive metadata added to PRD
- WORK_PLAN.md updated
- Archive log updated
- Historical context preserved

## Related

- Command: `/list-prds` (shows archive count)
- Archive template: `templates/archive-notes-template.md`
