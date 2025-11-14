---
name: ship
description: Fast-track small features without full PRD process
category: Git Workflow
version: 0.4.3
aliases: [quick-ship]
---

# Quick Ship Command

Ship small features/fixes fast without full PRD overhead, with optional worktree isolation.

## Purpose

For small changes that don't need full PRD:
- Bug fixes
- Small UI tweaks
- Dependency updates
- Minor refactors
- Quick experiments

**NEW in v0.4.3**: Support for worktree isolation with `--worktree` flag.

## When to Use

**Use Quick Ship for**:
- Features < 4 hours
- Single developer work
- Clear scope, no unknowns
- Low risk changes

**Use Full PRD for**:
- Features > 1 day
- Multiple developers
- Unclear requirements
- High-risk changes
- Customer-facing features

## Usage

```bash
# Default: Work on Main (quick, simple)
/ship "Fix login button alignment"

# With worktree isolation (safer, larger fixes)
/ship "Refactor auth module" --worktree

# Manage active fix
/ship --complete           # Finish and merge
/ship --abort              # Cancel fix
/ship --status             # Show current status
/ship --pause              # Pause current fix
/ship --resume             # Resume paused fix

# Migrate from Main to worktree
/ship --to-worktree        # Move current fix to worktree
```

## Options

| Option | Description |
|--------|-------------|
| `--worktree` | Use hotfix worktree for isolation |
| `--to-worktree` | Migrate current fix from Main to worktree |
| `--complete` | Complete current fix (commit + PR + merge) |
| `--abort` | Abort current fix without merging |
| `--status` | Show current fix status |
| `--pause` | Pause fix and save state |
| `--resume` | Resume paused fix |

## Workflow: Default (Main)

### Step 1: Start Fix on Main

```bash
$ /ship "Fix dark mode toggle"

✅ Quick fix on Main
📝 Branch: quickship/fix-dark-mode-toggle

💡 Working on Main - keep it small!
```

### Step 2: Guided Implementation

AI provides inline guidance for the fix:
- File locations
- Code changes
- Testing approach

### Step 3: Smart Warnings

As you work, smart detection monitors:

```bash
# After 20 minutes, 8 files, 150 lines...

⚠️  LARGE FIX DETECTED
- 8 files changed
- 150 lines modified
- 22 minutes elapsed

💡 This is getting large. Consider:
  1. /ship --complete (finish on Main)
  2. /ship --to-worktree (migrate to worktree)
  3. Continue on Main (suppress warning)

Choose: _
```

**Thresholds**:
- Files: > 5 files
- Lines: > 100 lines
- Time: > 30 minutes

### Step 4: Complete Fix

```bash
$ /ship --complete

✅ Committed: fix: Dark mode toggle improvements
📤 PR #234 created
⏳ Waiting for checks...
✅ Checks passed, auto-merged
🎉 Merged to main
🧹 Cleaned up branch
```

## Workflow: With Worktree

### Step 1: Start Fix in Worktree

```bash
$ /ship "Refactor authentication module" --worktree

🔍 Checking worktree hotfix/...

# AUTO-SYNC (Intelligent)
🔄 Syncing worktree (3 commits behind)...

Recent changes:
  - a3f2c1d fix: OAuth timeout
  - 8d4e2a9 feat: Better logging
  - 1c8f3b2 refactor: API cleanup

✅ Synced with main

# START FIX
✅ Started in worktrees/hotfix/
📝 Branch: hotfix/refactor-auth-module
🔒 Locked worktree (one fix at a time)

💻 Open in new window: code worktrees/hotfix/
```

**Auto-sync thresholds**:
- 0 commits: ✅ No sync needed
- 1-10 commits: 🔄 Silent auto-sync
- 10-50 commits: ⚠️ Propose sync with preview
- 50+ commits: ❌ Force sync (required)

### Step 2: Isolated Development

Work in `worktrees/hotfix/`:
- No size limits
- No time warnings
- Complete isolation
- Can open in separate Cursor window

### Step 3: Complete Fix

```bash
$ /ship --complete

✅ Committed & pushed
📤 PR #235 created
⏳ Waiting for checks...
✅ Checks passed, auto-merging
🎉 Merged to main

# AUTO-CLEANUP
🔄 Returning to parking branch...
🧹 Deleted branch hotfix/refactor-auth-module
🔄 Syncing with main...
✅ Worktree ready for next fix
🔓 Unlocked worktree

↩️  Returned to Main
```

## Collision Handling

**One fix at a time** in hotfix worktree:

```bash
$ /ship "Fix autre" --worktree

❌ Fix already in progress in worktrees/hotfix/

Current fix: hotfix/refactor-auth-module
Started: 25 minutes ago
Files: 7 modified

⚠️  Only ONE fix at a time in hotfix worktree

Options:
1. Finish current fix: /ship --complete
2. Work on Main instead: /ship "Fix autre"
3. Abort current fix: /ship --abort

💡 For urgent small fixes, use Main:
  /ship "Fix autre"

Choose: _
```

## Migration: Main → Worktree

Started on Main but fix is growing:

```bash
# Working on Main...
⚠️  LARGE FIX DETECTED (warning appears)

$ /ship --to-worktree

🔄 Migrating to worktree...

# Process:
1. ✅ Commit WIP on Main
   git add .
   git commit -m "WIP: Large fix"

2. ✅ Setup worktree hotfix/
   Auto-sync if needed

3. ✅ Cherry-pick WIP to worktree
   cd worktrees/hotfix/
   git checkout -b hotfix/large-fix
   git cherry-pick <wip-commit>

4. ✅ Reset Main
   cd main-repo/
   git reset --hard HEAD~1

5. ✅ Continue in worktree
   💻 Open: code worktrees/hotfix/

Migration complete!
Continue working in worktrees/hotfix/
```

## State Management

### Lock File

`.claude-lock` in `worktrees/hotfix/`:

```json
{
  "status": "in_progress",
  "type": "hotfix",
  "branch": "hotfix/refactor-auth",
  "started_at": "2025-01-13T10:30:00Z",
  "started_by": "/ship --worktree",
  "description": "Refactor authentication module",
  "files_changed": 7,
  "lines_changed": 234,
  "commits": 3,
  "last_commit": "a3f2c1d Improve auth flow"
}
```

### Status Check

```bash
$ /ship --status

📊 Current Fix Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: worktrees/hotfix/
📝 Branch: hotfix/refactor-auth-module
⏱️  Started: 25 minutes ago
📊 Progress:
  - Files: 7 modified
  - Lines: +234 -87
  - Commits: 3

Recent commits:
  - a3f2c1d Improve auth flow
  - 8d4e2a9 Add tests
  - 1c8f3b2 Refactor middleware

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actions:
  - /ship --complete (finish)
  - /ship --pause (save for later)
  - /ship --abort (cancel)
```

## Pause & Resume

### Pause Fix

```bash
$ /ship --pause

💾 Pausing fix...

✅ Committed WIP state
📝 Updated lock file (status: paused)
🔄 Returned to parking branch

Fix paused. Resume with: /ship --resume
```

### Resume Fix

```bash
$ /ship --resume

📋 Paused fixes:

1. hotfix/refactor-auth-module
   Started: 2 hours ago
   Files: 7 modified
   Last: Improve auth flow

Resume which fix? (1): 1

🔄 Resuming fix...
✅ Checked out branch: hotfix/refactor-auth-module
📊 Fix status loaded

Continue working!
```

## Configuration

Respects `.claude/config-worktrees.json`:

```json
{
  "worktrees": {
    "hotfix": {
      "path": "worktrees/hotfix",
      "branch_parking": "hotfix"
    }
  },
  "warnings": {
    "files_threshold": 5,
    "lines_threshold": 100,
    "time_threshold_minutes": 30
  },
  "auto_complete": {
    "auto_merge_if_checks_pass": true,
    "cleanup_after_merge": true
  }
}
```

## Examples

### Example 1: Simple Fix on Main

```bash
$ /ship "Fix typo in error message"

# Small fix, 1 file, 2 lines
# No warnings
# Complete quickly

$ /ship --complete

✅ Done!
```

### Example 2: Fix Grows, Migrate to Worktree

```bash
$ /ship "Fix dark mode issues"

# Start on Main
# After 20 min: 8 files, 150 lines

⚠️  LARGE FIX DETECTED

$ /ship --to-worktree

# Migrated to worktree
# Continue safely
```

### Example 3: Direct Worktree Usage

```bash
$ /ship "Large refactor" --worktree

# Starts in worktree
# No limits
# Complete isolation
```

### Example 4: Urgent Fix During Active Fix

```bash
# Fix in progress in worktree
$ /ship "Critical bug" --worktree

❌ Worktree busy

# Use Main instead
$ /ship "Critical bug"

# Quick fix on Main
# Worktree unaffected
```

## Best Practices

### When to Use Main

✅ **Typos, small text changes**
✅ **1-2 file modifications**
✅ **< 50 lines changed**
✅ **< 15 minutes work**
✅ **Low risk, obvious fix**

### When to Use Worktree

✅ **Refactors**
✅ **Multiple files (5+)**
✅ **> 100 lines changed**
✅ **> 30 minutes work**
✅ **Need isolation**
✅ **Want separate Cursor window**

### Tips

- 💡 Start on Main, migrate if it grows
- 💡 Use worktree for anything "refactor"
- 💡 One worktree fix at a time = simple
- 💡 Urgent fixes on Main = no blocking

## Integration

Works seamlessly with:
- `/worktree` - Manage worktrees
- `/context` - Shows current fix
- `/cleanup` - Cleans up after merge
- `/hotfix` - Alias for `/ship --worktree`

---

**Version**: 0.4.3
**Plugin**: claude-prd-workflow v0.4.3
**Changes**: Added worktree support, intelligent sync, collision handling
