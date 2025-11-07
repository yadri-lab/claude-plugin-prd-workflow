---
name: cleanup
description: Clean up merged branches, worktrees, and temporary files
category: PRD Management
---

# Cleanup Command

Intelligent cleanup of your development environment: branches, worktrees, and temporary files.

## Purpose

Keep your repository clean and organized by:
- 🗑️ Removing merged feature branches
- 📂 Cleaning up obsolete worktrees
- 📄 Deleting temporary .md files
- 💾 Freeing disk space
- 🧹 Maintaining project hygiene

**Startup mindset**: Clean workspace = clear mind = faster shipping

## Usage

```bash
# Interactive cleanup (recommended)
/cleanup

# Auto-approve all (dangerous)
/cleanup --yes

# Dry-run (show what would be cleaned)
/cleanup --dry-run

# Clean specific items only
/cleanup --branches-only
/cleanup --worktrees-only
/cleanup --files-only

# Aggressive mode (includes unmerged old branches)
/cleanup --aggressive
```

## Workflow

### Step 1: Scan for Cleanup Candidates

#### 1.1 Scan Merged Branches

```bash
echo "🔍 Scanning for merged branches..."

# Get list of merged branches (exclude main, develop, master)
MERGED_BRANCHES=$(git branch --merged main 2>/dev/null | \
  grep -v '^\*' | \
  grep -v 'main$' | \
  grep -v 'master$' | \
  grep -v 'develop$' | \
  sed 's/^[* ]*//' | \
  tr '\n' ' ')

# For each merged branch, check:
# - When was it merged? (age)
# - Is there a corresponding worktree?
# - Is the PRD complete?

BRANCH_COUNT=0
declare -a BRANCHES_TO_DELETE

for BRANCH in $MERGED_BRANCHES; do
  # Get merge date
  MERGE_DATE=$(git log -1 --format=%ct "$BRANCH" 2>/dev/null || echo "0")
  CURRENT_TIME=$(date +%s)
  DAYS_SINCE_MERGE=$(( (CURRENT_TIME - MERGE_DATE) / 86400 ))

  # Extract PRD ID from branch name
  if [[ "$BRANCH" =~ (PRD-[0-9]+) ]] || [[ "$BRANCH" =~ ([A-Z]+-PRD-[0-9]+) ]]; then
    PRD_ID="${BASH_REMATCH[1]}"

    # Check if PRD is in complete directory
    PRD_FILE=$(find product/prds/04-complete/ -name "*${PRD_ID}*.md" 2>/dev/null | head -n 1)

    if [ -n "$PRD_FILE" ]; then
      PRD_STATUS="✅ Complete"
    else
      PRD_STATUS="⚠️ Not complete"
    fi
  else
    PRD_ID="N/A"
    PRD_STATUS="N/A"
  fi

  # Add to cleanup list
  BRANCHES_TO_DELETE+=("$BRANCH|$DAYS_SINCE_MERGE|$PRD_ID|$PRD_STATUS")
  ((BRANCH_COUNT++))
done
```

#### 1.2 Scan Obsolete Worktrees

```bash
echo "🔍 Scanning for obsolete worktrees..."

# Check if worktrees/ directory exists
if [ -d "worktrees" ]; then
  # Get list of worktrees
  WORKTREE_LIST=$(git worktree list --porcelain 2>/dev/null)

  declare -a WORKTREES_TO_DELETE
  WORKTREE_COUNT=0

  while IFS= read -r line; do
    if [[ "$line" =~ ^worktree\ (.+)$ ]]; then
      WORKTREE_PATH="${BASH_REMATCH[1]}"

      # Only process worktrees in worktrees/ subdirectory
      if [[ "$WORKTREE_PATH" == *"worktrees/"* ]]; then
        # Get branch for this worktree
        BRANCH=$(git -C "$WORKTREE_PATH" branch --show-current 2>/dev/null || echo "unknown")

        # Check if branch still exists in remote
        if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
          # Check if branch is merged
          if git branch --merged main 2>/dev/null | grep -q "^[* ]*$BRANCH$"; then
            STATUS="✅ Merged"
            SHOULD_DELETE=true
          else
            STATUS="🔄 Active"
            SHOULD_DELETE=false
          fi
        else
          STATUS="⚠️ Branch deleted"
          SHOULD_DELETE=true
        fi

        # Check last activity
        LAST_COMMIT=$(git -C "$WORKTREE_PATH" log -1 --format=%ct 2>/dev/null || echo "0")
        CURRENT_TIME=$(date +%s)
        DAYS_INACTIVE=$(( (CURRENT_TIME - LAST_COMMIT) / 86400 ))

        # Calculate disk usage
        if command -v du &>/dev/null; then
          DISK_USAGE=$(du -sh "$WORKTREE_PATH" 2>/dev/null | cut -f1)
        else
          DISK_USAGE="Unknown"
        fi

        if [ "$SHOULD_DELETE" = true ]; then
          WORKTREES_TO_DELETE+=("$WORKTREE_PATH|$BRANCH|$STATUS|$DAYS_INACTIVE|$DISK_USAGE")
          ((WORKTREE_COUNT++))
        fi
      fi
    fi
  done <<< "$WORKTREE_LIST"
fi
```

#### 1.3 Scan Temporary Files

```bash
echo "🔍 Scanning for temporary files..."

declare -a FILES_TO_DELETE
FILE_COUNT=0
TOTAL_SIZE=0

# Patterns to match temporary files
TEMP_PATTERNS=(
  "*.tmp.md"
  "*_temp.md"
  "*-temp.md"
  "temp-*.md"
  "draft-*.md"
  "scratch-*.md"
  "test-*.md"
  "backup-*.md"
  "*.backup.md"
  "*~"
  ".*.swp"
  ".*.swo"
)

# Search in root directory and common temp locations
SEARCH_DIRS=(
  "."
  "product/prds/"
  "docs/"
)

for DIR in "${SEARCH_DIRS[@]}"; do
  if [ -d "$DIR" ]; then
    for PATTERN in "${TEMP_PATTERNS[@]}"; do
      while IFS= read -r FILE; do
        # Skip if in .git directory
        if [[ "$FILE" != *".git"* ]]; then
          # Get file age
          if [ -f "$FILE" ]; then
            FILE_TIME=$(stat -c %Y "$FILE" 2>/dev/null || stat -f %m "$FILE" 2>/dev/null || echo "0")
            CURRENT_TIME=$(date +%s)
            DAYS_OLD=$(( (CURRENT_TIME - FILE_TIME) / 86400 ))

            # Get file size
            if command -v du &>/dev/null; then
              FILE_SIZE=$(du -sh "$FILE" 2>/dev/null | cut -f1)
              FILE_SIZE_BYTES=$(du -b "$FILE" 2>/dev/null | cut -f1)
              TOTAL_SIZE=$((TOTAL_SIZE + FILE_SIZE_BYTES))
            else
              FILE_SIZE="Unknown"
            fi

            # Only include files older than 1 day (avoid cleaning active work)
            if [ "$DAYS_OLD" -ge 1 ]; then
              FILES_TO_DELETE+=("$FILE|$DAYS_OLD|$FILE_SIZE")
              ((FILE_COUNT++))
            fi
          fi
        fi
      done < <(find "$DIR" -maxdepth 2 -name "$PATTERN" -type f 2>/dev/null)
    done
  fi
done

# Convert total size to human readable
if [ "$TOTAL_SIZE" -gt 0 ]; then
  TOTAL_SIZE_HR=$(numfmt --to=iec-i --suffix=B "$TOTAL_SIZE" 2>/dev/null || echo "${TOTAL_SIZE} bytes")
else
  TOTAL_SIZE_HR="0 B"
fi
```

### Step 2: Display Cleanup Report

```markdown
🧹 **Cleanup Report**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Summary**:
- 🌿 Merged branches: 4 found
- 📂 Obsolete worktrees: 2 found
- 📄 Temporary files: 7 found
- 💾 Disk space to free: 1.2 GB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🌿 Merged Branches (4)

| Branch | Merged | PRD | Status |
|--------|--------|-----|--------|
| feat/PRD-003-design-system | 12 days ago | PRD-003 | ✅ Complete |
| feat/PRD-004-landing-page | 8 days ago | PRD-004 | ✅ Complete |
| feat/PRD-005-auth-system | 5 days ago | PRD-005 | ⚠️ Not complete |
| fix/hotfix-login-bug | 2 days ago | N/A | N/A |

**Safe to delete**: 4 branches

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📂 Obsolete Worktrees (2)

| Path | Branch | Status | Inactive | Size |
|------|--------|--------|----------|------|
| worktrees/prd-003/ | feat/PRD-003-design-system | ✅ Merged | 12 days | 245 MB |
| worktrees/prd-004/ | feat/PRD-004-landing-page | ✅ Merged | 8 days | 198 MB |

**Space to free**: 443 MB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 Temporary Files (7)

| File | Age | Size |
|------|-----|------|
| ./temp-notes.md | 5 days | 12 KB |
| ./draft-ideas.md | 3 days | 8 KB |
| ./PRD-draft-temp.md | 2 days | 45 KB |
| product/prds/backup-PRD-006.md | 14 days | 89 KB |
| docs/scratch-architecture.md | 7 days | 23 KB |
| .notes.md.swp | 1 day | 4 KB |
| test-migration.md | 9 days | 156 KB |

**Space to free**: 337 KB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  **Warning**: PRD-005 branch is merged but PRD not marked complete
    Consider running: /complete-prd PRD-005

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with cleanup? (y/n)
> _
```

### Step 3: Confirm and Execute

**Interactive confirmation**:
```bash
echo "Proceed with cleanup? (y/n)"
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "❌ Cleanup cancelled"
  exit 0
fi
```

**Execute cleanup**:
```bash
echo ""
echo "🧹 Cleaning up..."
echo ""

# Delete branches
if [ "$BRANCH_COUNT" -gt 0 ]; then
  echo "🌿 Deleting merged branches..."
  for ENTRY in "${BRANCHES_TO_DELETE[@]}"; do
    IFS='|' read -r BRANCH DAYS PRD STATUS <<< "$ENTRY"

    echo "  Deleting: $BRANCH"
    git branch -d "$BRANCH" 2>&1
  done
  echo "  ✅ Deleted $BRANCH_COUNT branches"
  echo ""
fi

# Remove worktrees
if [ "$WORKTREE_COUNT" -gt 0 ]; then
  echo "📂 Removing obsolete worktrees..."
  for ENTRY in "${WORKTREES_TO_DELETE[@]}"; do
    IFS='|' read -r PATH BRANCH STATUS DAYS SIZE <<< "$ENTRY"

    echo "  Removing: $PATH ($SIZE)"
    git worktree remove "$PATH" --force 2>&1
  done
  echo "  ✅ Removed $WORKTREE_COUNT worktrees"
  echo ""
fi

# Delete temporary files
if [ "$FILE_COUNT" -gt 0 ]; then
  echo "📄 Deleting temporary files..."
  for ENTRY in "${FILES_TO_DELETE[@]}"; do
    IFS='|' read -r FILE DAYS SIZE <<< "$ENTRY"

    echo "  Deleting: $FILE ($SIZE)"
    rm -f "$FILE" 2>&1
  done
  echo "  ✅ Deleted $FILE_COUNT files"
  echo ""
fi

# Final summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ **Cleanup Complete**"
echo ""
echo "📊 Results:"
echo "  - Branches deleted: $BRANCH_COUNT"
echo "  - Worktrees removed: $WORKTREE_COUNT"
echo "  - Files deleted: $FILE_COUNT"
echo "  - Space freed: $TOTAL_SIZE_HR"
echo ""
echo "💡 Your repository is now clean and organized!"
```

### Step 4: Post-Cleanup Actions

```bash
# Run git gc to optimize repository
echo "🔧 Optimizing repository..."
git gc --auto --quiet

# Prune unreachable objects
git prune --expire=now --quiet 2>/dev/null || true

echo "✅ Repository optimized"
```

## Safety Features

### Protected Branches

Never delete these branches:
- `main`
- `master`
- `develop`
- `staging`
- `production`

### Safeguards

1. **Merged-only by default**: Only deletes merged branches
2. **Confirmation required**: Interactive prompt before deletion
3. **Dry-run option**: See what would be deleted without action
4. **Backup suggestion**: Warns about PRD status mismatches
5. **Age threshold**: Temp files must be 1+ days old

### Aggressive Mode

Use `--aggressive` flag to also clean:
- Unmerged branches older than 30 days
- Stale worktrees (no activity in 7+ days)
- Any temp files regardless of age

**Use with caution!**

```bash
/cleanup --aggressive

⚠️  **Aggressive Mode Enabled**

This will also clean:
- Unmerged old branches (30+ days)
- Inactive worktrees (7+ days)
- All temporary files

Are you SURE? (type 'yes' to confirm)
> _
```

## Options Reference

| Option | Description |
|--------|-------------|
| `--yes` | Auto-approve all (skip confirmation) |
| `--dry-run` | Show what would be cleaned (no action) |
| `--branches-only` | Only clean branches |
| `--worktrees-only` | Only clean worktrees |
| `--files-only` | Only clean temporary files |
| `--aggressive` | Include unmerged old items (dangerous) |
| `--min-age=N` | Only clean items older than N days |

## Configuration

From `.claude/config.json`:

```json
{
  "prd_workflow": {
    "cleanup": {
      "temp_file_patterns": [
        "*.tmp.md",
        "*_temp.md",
        "*-temp.md",
        "temp-*.md",
        "draft-*.md",
        "scratch-*.md"
      ],
      "min_temp_file_age_days": 1,
      "min_branch_age_days": 0,
      "min_worktree_age_days": 7,
      "aggressive_branch_age_days": 30,
      "auto_gc": true,
      "protected_branches": ["main", "master", "develop", "staging", "production"]
    }
  }
}
```

## Examples

**Example 1: Standard cleanup**
```bash
$ /cleanup

🧹 Cleanup Report
━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
- 🌿 Merged branches: 3 found
- 📂 Obsolete worktrees: 2 found
- 📄 Temporary files: 5 found
- 💾 Disk space to free: 847 MB

Proceed? (y/n) > y

✅ Cleanup Complete
Space freed: 847 MB
```

**Example 2: Dry-run first**
```bash
$ /cleanup --dry-run

🧹 Cleanup Report (DRY RUN - No changes will be made)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... shows what would be deleted ...]

💡 To execute: /cleanup
```

**Example 3: Only clean files**
```bash
$ /cleanup --files-only

🧹 Cleanup Report
━━━━━━━━━━━━━━━━━━━━━━━
📄 Temporary files: 5 found

Proceed? (y/n) > y

✅ Deleted 5 temporary files
```

## Best Practices

**Weekly cleanup routine**:
```bash
# Every Friday afternoon
/cleanup --dry-run  # Review first
/cleanup            # Execute if looks good
```

**Before major release**:
```bash
# Clean everything before tagging release
/cleanup --aggressive
git tag v1.0.0
```

**Monthly deep clean**:
```bash
# First Monday of month
/cleanup --aggressive
```

## Integration

Works with:
- `/context` - See current state before cleanup
- `/list-prds` - Verify PRD statuses
- `/complete-prd` - Mark PRDs complete before cleanup
- `/archive-prd` - Archive old PRDs

## Troubleshooting

**"Cannot delete branch, not fully merged"**
- Branch has unmerged commits
- Use `--aggressive` if you're sure
- Or merge/rebase first

**"Worktree removal failed"**
- Worktree may have uncommitted changes
- Check with: `git -C <path> status`
- Stash or commit first

**"Permission denied deleting file"**
- File may be open in editor
- Close file and retry
- Check file permissions

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 0.4.0
Author: CTO Mindset - Pragmatic Tools

**Last Updated**: 2025-11-07
**Disk space saved since inception**: Run `/cleanup --stats` to see! 🚀
