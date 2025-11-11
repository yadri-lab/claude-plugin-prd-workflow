---
name: cleanup
description: Clean up merged branches, worktrees, and temporary files
category: Development Tools
version: 0.4.2
---

# Cleanup Command

Clean up development artifacts after PRD completion.

## Purpose

Maintain clean repository state:
- Remove merged branches (local and remote)
- Delete unused worktrees
- Clean up temporary files
- Free disk space
- Maintain organized git history

## Workflow

### 1. Scan for Cleanup Opportunities

**Identify**:
- Merged branches (local)
- Merged branches (remote)
- Orphaned worktrees
- Temporary files in `.prds/`
- Old debug sessions

**Display summary**:
```markdown
🧹 Cleanup Opportunities

Merged Branches (local):
• feature/PRD-003-oauth2 (merged 5 days ago)
• feature/PRD-005-dark-mode (merged 2 days ago)

Merged Branches (remote):
• origin/feature/PRD-003-oauth2

Worktrees:
• ../worktrees/PRD-003-oauth2 (orphaned)

Temp Files:
• .prds/thoughts/ (347 MB)
• .prds/debug-sessions/ (old sessions)

Total space recoverable: ~450 MB
```

### 2. Confirm Cleanup

Ask user to confirm:
- Which categories to clean
- Dry-run option available
- Safety checks (won't delete unmerged work)

### 3. Execute Cleanup

**Local branches**:
```bash
git branch -d feature/PRD-XXX-name
```

**Remote branches**:
```bash
git push origin --delete feature/PRD-XXX-name
```

**Worktrees**:
```bash
git worktree remove ../worktrees/PRD-XXX-name
```

**Temp files**:
- Keep last 30 days of debug sessions
- Archive old thoughts to `.prds/archive/`

### 4. Report Results

```markdown
✅ Cleanup Complete

Removed:
• 3 local branches
• 2 remote branches
• 1 worktree
• 120 MB temp files

Space freed: 450 MB

Your repository is now clean! 🎉
```

## Safety Features

**Protected branches**:
- main/master: Never deleted
- develop: Never deleted
- Current branch: Never deleted

**Unmerged work**:
- Check merge status before deletion
- Warn if branch has unmerged commits
- Require --force flag for unmerged branches

**Backup**:
- Archived files moved to `.prds/archive/`
- Can be restored if needed

## Flags

**Dry-run** (`--dry-run`):
- Show what would be deleted
- Don't actually delete anything

**Force** (`--force`):
- Delete unmerged branches (use carefully)

**Categories**:
- `--branches-only`: Only clean branches
- `--worktrees-only`: Only clean worktrees
- `--files-only`: Only clean temp files

**Examples**:
```bash
/cleanup                    # Interactive cleanup
/cleanup --dry-run          # Preview only
/cleanup --branches-only    # Only branches
/cleanup --force            # Include unmerged branches
```

## Configuration

```json
{
  "cleanup": {
    "auto_delete_remote": false,
    "keep_debug_sessions_days": 30,
    "archive_thoughts": true,
    "protected_branches": ["main", "master", "develop"]
  }
}
```

## Success Criteria

- ✅ All merged branches cleaned
- ✅ Orphaned worktrees removed
- ✅ Old temp files archived
- ✅ Disk space freed
- ✅ No unmerged work lost
- ✅ Repository clean and organized

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
