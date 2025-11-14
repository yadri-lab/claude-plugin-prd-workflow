---
name: worktree
description: Manage fixed worktrees (hotfix, debug) and their lifecycle
category: Development Tools
version: 0.4.3
---

# Worktree Management Command

Centralized management for fixed worktrees (hotfix, debug) with intelligent sync.

## Purpose

Manage permanent worktrees for quick fixes and debugging sessions:
- 🔧 **hotfix/** - Quick fixes and UI tweaks
- 🐛 **debug/** - Debugging sessions with modifications

## Commands

### Setup

```bash
/worktree setup
```

**Initial setup of fixed worktrees**:
- Creates `worktrees/hotfix/` on branch `hotfix`
- Creates `worktrees/debug/` on branch `debug`
- Configures lock files
- Sets up Git hooks (optional)

**What happens**:
```bash
1. Create worktrees/ directory if needed
2. git worktree add worktrees/hotfix hotfix
3. git checkout -b hotfix main  # Parking branch
4. git worktree add worktrees/debug debug
5. git checkout -b debug main   # Parking branch
6. Create .claude-lock files
7. git checkout main            # Return to main
```

### Sync

```bash
/worktree sync
/worktree sync --force
/worktree sync hotfix
/worktree sync debug
```

**Sync all or specific worktrees with main**:
- Intelligent sync strategy (Option C)
- Skips locked worktrees (fix in progress)
- Shows recent changes preview
- Force sync bypasses thresholds

**Sync Strategy (Intelligent)**:
- **0 commits behind**: ✅ Nothing to do
- **1-10 commits**: 🔄 Silent auto-sync
- **10-50 commits**: ⚠️ Propose sync with preview
- **50+ commits**: ❌ Force sync (required)

### Status

```bash
/worktree status
/worktree status --verbose
/worktree status hotfix
```

**Show status of all worktrees**:
- Lock status (idle/in_progress)
- Current branch
- Sync status (commits behind main)
- Last used timestamp
- Available actions

### List

```bash
/worktree list
```

**List all worktrees** (including PRD worktrees):
- Path and branch
- Status
- Sync info

### Prune

```bash
/worktree prune
/worktree prune --force
```

**Clean up obsolete worktrees**:
- Remove merged PRD worktrees
- Clean orphaned worktree directories
- Reset fixed worktrees to clean state (if idle)

## Workflow

### Initial Setup (Once)

```bash
$ /worktree setup

🔧 Setting up fixed worktrees...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Creating worktrees/hotfix/
✅ Worktree created
📝 Branch: hotfix (parking, synced with main)
🔒 Lock file initialized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Creating worktrees/debug/
✅ Worktree created
📝 Branch: debug (parking, synced with main)
🔒 Lock file initialized
📁 Session directory: .prds/debug-sessions/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Setup complete!

Next steps:
- Use /ship "fix" --worktree for isolated fixes
- Use /debugging "issue" --worktree for debug sessions
- Use /worktree status to check worktree state
```

### Daily Sync (Morning Routine)

```bash
$ /worktree sync

🔄 Syncing all fixed worktrees with main...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 worktrees/hotfix/
  🔍 Checking status...
  🔓 Idle (no active fix)
  🔄 Was 3 commits behind, syncing...

  Recent changes:
    - a3f2c1d fix: OAuth timeout handling
    - 8d4e2a9 feat: Improved error logging
    - 1c8f3b2 refactor: API restructure

  ✅ Synced successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 worktrees/debug/
  🔍 Checking status...
  🔓 Idle (no active session)
  ✅ Already up-to-date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All worktrees synced
```

### Check Status

```bash
$ /worktree status

📊 Worktree Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 worktrees/hotfix/
  Status: 🔒 IN_PROGRESS
  Branch: hotfix/fix-login-button
  Started: 15 minutes ago
  Sync: ✅ Up-to-date with main
  Files: 3 modified, 87 lines changed
  Commits: 2 commits on branch

  Actions:
  - /ship --complete (finish)
  - /ship --abort (cancel)
  - /ship --status (details)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 worktrees/debug/
  Status: 🔓 IDLE
  Branch: debug (parking)
  Sync: ✅ Up-to-date with main
  Last used: 2 days ago

  Actions:
  - /debugging "issue" --worktree (start)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Total fixed worktrees: 2
  Active: 1 (hotfix)
  Idle: 1 (debug)
  Need sync: 0

💡 All worktrees up-to-date!
```

## Intelligent Sync Logic

### Auto-Sync on Start

When starting `/ship --worktree` or `/debugging --worktree`:

```bash
1. Fetch latest main
2. Check commits behind
3. Apply sync strategy:
   - 0 commits: ✅ Continue
   - 1-10 commits: 🔄 Silent sync
   - 10-50 commits: ⚠️ Propose sync with preview
   - 50+ commits: ❌ Force sync (required)
```

### Sync Algorithm

```bash
sync_worktree_intelligent() {
  local worktree_path=$1
  local parking_branch=$2
  local force=${3:-false}

  cd "$worktree_path"
  git fetch origin main -q

  BEHIND=$(git rev-list --count HEAD..origin/main)

  # Force sync (explicit request)
  if [ "$force" = true ]; then
    git reset --hard origin/main
    return 0
  fi

  # Critical staleness (50+ commits) - Force sync
  if [ $BEHIND -gt 50 ]; then
    echo "⚠️  Critically stale ($BEHIND commits)"
    echo "Auto-syncing required..."
    git reset --hard origin/main
    return 0
  fi

  # Moderate staleness (10-50) - Propose sync
  if [ $BEHIND -gt 10 ]; then
    echo "⚠️  $BEHIND commits behind main"
    echo "Recent changes:"
    git log --oneline -5 origin/main ^HEAD
    read -p "Sync before starting? (Y/n) " -r
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
      git reset --hard origin/main
    else
      echo "⚠️  Continuing without sync"
    fi
    return 0
  fi

  # Light staleness (1-10) - Silent sync
  if [ $BEHIND -gt 0 ]; then
    echo "🔄 Syncing ($BEHIND commits)..."
    git reset --hard origin/main
    return 0
  fi

  # Up-to-date
  echo "✅ Already up-to-date"
}
```

## Lock File Format

`.claude-lock` in each worktree:

```json
{
  "status": "in_progress",
  "type": "hotfix",
  "branch": "hotfix/fix-login-button",
  "started_at": "2025-01-13T10:30:00Z",
  "started_by": "/ship --worktree",
  "files_changed": 3,
  "lines_changed": 87,
  "commits": 2,
  "last_commit": "a3f2c1d Fix login button alignment"
}
```

**Status values**:
- `idle` - No active work
- `in_progress` - Fix/debug session active
- `completing` - Finishing up (PR merge in progress)

## Configuration

Respects `.claude/config-worktrees.json`:

```json
{
  "worktrees": {
    "hotfix": {
      "path": "worktrees/hotfix",
      "branch_parking": "hotfix",
      "max_concurrent": 1
    },
    "debug": {
      "path": "worktrees/debug",
      "branch_parking": "debug",
      "max_concurrent": 1
    }
  },
  "sync": {
    "strategy": "intelligent",
    "auto_sync_on_start": true,
    "thresholds": {
      "silent_sync": 10,
      "warn_sync": 50,
      "force_sync": 100
    }
  }
}
```

## Error Handling

### Locked Worktree

```bash
$ /worktree sync

worktrees/hotfix/:
  🔒 LOCKED (fix in progress)
  ⚠️  Cannot sync while fix is active

  💡 Finish current fix first: /ship --complete
  ⏭️  Skipping sync for this worktree
```

### Dirty Working Directory

```bash
$ /worktree sync hotfix

worktrees/hotfix/:
  ⚠️  Working directory has uncommitted changes

  Options:
  1. Commit changes first
  2. Stash changes: git stash
  3. Abort sync

  ❌ Cannot sync with dirty working directory
```

## Best Practices

### When to Sync

✅ **Morning routine**: `/worktree sync` before starting work
✅ **After big merge**: Sync after merging large PRs to main
✅ **Before starting**: Auto-sync happens automatically
✅ **Weekly**: Run `/worktree sync` at least weekly

### When NOT to Sync

❌ **During active fix**: Locked worktrees cannot be synced
❌ **With uncommitted changes**: Commit or stash first

## Integration

Works seamlessly with:
- `/ship --worktree` - Auto-syncs on start
- `/debugging --worktree` - Auto-syncs on start
- `/cleanup` - Uses /worktree prune
- `/context` - Shows sync status

## Examples

### Example 1: Daily Sync Routine

```bash
# Morning, before starting work
$ /worktree sync

# All worktrees synced
# Ready to start fixes/debugging
```

### Example 2: Check Before Starting

```bash
$ /worktree status

# See which worktrees need sync
# See active fixes/sessions
```

### Example 3: Force Sync All

```bash
$ /worktree sync --force

# Forces sync even if < threshold
# Useful after major refactors
```

---

**Version**: 0.4.3
**Plugin**: claude-prd-workflow v0.4.3
**Category**: Development Tools
