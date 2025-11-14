---
name: hotfix
description: Quick fix with worktree isolation (alias for /ship --worktree)
category: Git Workflow
version: 0.4.3
---

# Hotfix Command

Alias for `/ship --worktree` - always uses worktree isolation for quick fixes.

## Purpose

For developers who prefer worktree isolation by default:
- Shorter to type than `/ship --worktree`
- Always works in dedicated worktree
- Same workflow as `/ship` but with guaranteed isolation

## Usage

```bash
# Basic usage
/hotfix "Fix login button alignment"

# Equivalent to:
/ship "Fix login button alignment" --worktree

# All /ship options work
/hotfix --complete    # Finish fix
/hotfix --abort       # Cancel fix
/hotfix --status      # Check status
/hotfix --pause       # Pause fix
/hotfix --resume      # Resume fix
```

## When to Use

**Use /hotfix when**:
- ✅ You prefer worktree isolation by default
- ✅ Refactoring or multi-file changes
- ✅ Want separate Cursor window
- ✅ > 100 lines of changes expected

**Use /ship (without --worktree) when**:
- ✅ Quick typo fix (1-2 files)
- ✅ < 50 lines of changes
- ✅ < 15 minutes work
- ✅ Very low risk change

## Workflow

### Step 1: Start Fix

```bash
$ /hotfix "Refactor authentication module"

🔍 Checking worktree hotfix/...
🔄 Syncing worktree (3 commits behind)...
✅ Synced with main

✅ Started in worktrees/hotfix/
📝 Branch: hotfix/refactor-auth-module
🔒 Locked worktree

💻 Open in new window: code worktrees/hotfix/
```

### Step 2: Work in Isolation

Work in `worktrees/hotfix/`:
- Complete isolation from Main
- No size/time warnings
- Can open in separate Cursor window

### Step 3: Complete

```bash
$ /hotfix --complete

✅ Committed & pushed
📤 PR created
✅ Auto-merged (checks passed)
🧹 Cleaned up
↩️  Returned to Main
```

## Comparison: /hotfix vs /ship

| Aspect | /hotfix | /ship |
|--------|---------|-------|
| **Default** | Worktree | Main |
| **Isolation** | Always | Optional (--worktree) |
| **Best for** | Refactors, multi-file | Quick fixes, typos |
| **Warnings** | None | Size/time warnings |
| **Main usage** | Never touches Main | Works on Main |

## Examples

### Example 1: Refactor

```bash
$ /hotfix "Refactor API endpoints"

# Works in worktree
# Complete isolation
# No limits
```

### Example 2: Check Status

```bash
$ /hotfix --status

📊 Current Fix in worktrees/hotfix/
📝 Branch: hotfix/refactor-api
⏱️  Started: 25 minutes ago
```

### Example 3: Collision

```bash
# Fix already in progress
$ /hotfix "Another fix"

❌ Worktree busy

# Use /ship on Main instead
$ /ship "Another fix"
```

## Tips

- 💡 Use `/hotfix` if you always prefer worktree isolation
- 💡 Use `/ship` for flexibility (Main or worktree)
- 💡 Both commands share the same hotfix worktree
- 💡 One fix at a time = simple and focused

## Integration

- Same as `/ship --worktree`
- Uses same worktree: `worktrees/hotfix/`
- Same configuration
- Same auto-sync logic

---

**Version**: 0.4.3
**Plugin**: claude-prd-workflow v0.4.3
**Alias for**: `/ship --worktree`
