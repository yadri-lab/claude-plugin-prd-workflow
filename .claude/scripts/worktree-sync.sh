#!/bin/bash
# Worktree Sync Utilities
# Version: 0.4.3
# Description: Intelligent sync functions for fixed worktrees

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/../config-worktrees.json"

# Read config values with defaults
get_config() {
  local key=$1
  local default=$2

  if [ -f "$CONFIG_FILE" ]; then
    value=$(jq -r "$key // \"$default\"" "$CONFIG_FILE" 2>/dev/null)
    echo "${value:-$default}"
  else
    echo "$default"
  fi
}

# Sync thresholds
SILENT_SYNC_MAX=$(get_config '.sync.thresholds.silent_sync_max_commits' '10')
WARN_SYNC_MAX=$(get_config '.sync.thresholds.warn_sync_max_commits' '50')
FORCE_SYNC_MIN=$(get_config '.sync.thresholds.force_sync_min_commits' '100')
RECENT_CHANGES_COUNT=$(get_config '.sync.recent_changes_count' '5')

# Check if worktree is locked
is_worktree_locked() {
  local worktree_path=$1
  local lock_file="$worktree_path/.claude-lock"

  if [ ! -f "$lock_file" ]; then
    return 1  # Not locked (no lock file)
  fi

  local status=$(jq -r '.status // "idle"' "$lock_file" 2>/dev/null)

  if [ "$status" = "in_progress" ] || [ "$status" = "completing" ]; then
    return 0  # Locked
  else
    return 1  # Not locked
  fi
}

# Get lock info
get_lock_info() {
  local worktree_path=$1
  local lock_file="$worktree_path/.claude-lock"

  if [ -f "$lock_file" ]; then
    cat "$lock_file"
  else
    echo '{"status":"idle"}'
  fi
}

# Intelligent sync function
sync_worktree_intelligent() {
  local worktree_path=$1
  local parking_branch=$2
  local force=${3:-false}

  # Check if worktree exists
  if [ ! -d "$worktree_path" ]; then
    echo "❌ Worktree not found: $worktree_path"
    return 1
  fi

  # Check if locked
  if is_worktree_locked "$worktree_path"; then
    echo "🔒 LOCKED (work in progress)"
    lock_info=$(get_lock_info "$worktree_path")
    branch=$(echo "$lock_info" | jq -r '.branch // "unknown"')
    started=$(echo "$lock_info" | jq -r '.started_at // "unknown"')
    echo ""
    echo "  Current: $branch"
    echo "  Started: $started"
    echo ""
    echo "  ⚠️  Cannot sync while work is active"
    echo "  💡 Finish current work first"
    echo ""
    return 1
  fi

  cd "$worktree_path" || return 1

  # Save current branch
  CURRENT_BRANCH=$(git branch --show-current)

  # Checkout parking branch
  git checkout "$parking_branch" 2>/dev/null || {
    echo "⚠️  Parking branch '$parking_branch' not found"
    echo "Creating from main..."
    git checkout -b "$parking_branch" main
  }

  # Check for uncommitted changes
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Working directory has uncommitted changes"
    echo ""
    echo "  Please commit or stash changes first:"
    echo "  - git stash"
    echo "  - git add . && git commit"
    echo ""
    return 1
  fi

  # Fetch latest main
  echo "🔍 Checking sync status..."
  git fetch origin main -q

  # Calculate divergence
  BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
  AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

  # Handle divergence cases

  # Case 1: Ahead of main (should never happen for parking branch)
  if [ "$AHEAD" -gt 0 ]; then
    echo "⚠️  WARNING: Parking branch has commits ahead of main!"
    echo "This should never happen. Resetting to main..."
    git reset --hard origin/main
    echo "✅ Reset to main"
    return 0
  fi

  # Case 2: Already up-to-date
  if [ "$BEHIND" -eq 0 ]; then
    echo "✅ Already up-to-date"
    return 0
  fi

  # Case 3: Force sync (explicit request)
  if [ "$force" = true ]; then
    echo "🔄 Force syncing ($BEHIND commits)..."
    git reset --hard origin/main
    echo "✅ Synced with main"
    return 0
  fi

  # Case 4: Critical staleness (>= FORCE_SYNC_MIN commits) - Force sync
  if [ "$BEHIND" -ge "$FORCE_SYNC_MIN" ]; then
    echo "⚠️  Critically stale ($BEHIND commits behind)"
    echo "Auto-syncing required for safety..."
    echo ""
    git reset --hard origin/main
    echo "✅ Synced with main"
    return 0
  fi

  # Case 5: Moderate staleness (> WARN_SYNC_MAX) - Propose sync with preview
  if [ "$BEHIND" -gt "$WARN_SYNC_MAX" ]; then
    echo "⚠️  $BEHIND commits behind main"
    echo ""
    echo "Recent changes:"
    git log --oneline -"$RECENT_CHANGES_COUNT" origin/main ^HEAD
    echo ""
    read -p "Sync before continuing? (Y/n) " -r
    echo ""

    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
      git reset --hard origin/main
      echo "✅ Synced with main"
    else
      echo "⚠️  Continuing without sync (may cause conflicts)"
    fi
    return 0
  fi

  # Case 6: Light staleness (1 to WARN_SYNC_MAX) - Silent sync
  if [ "$BEHIND" -gt 0 ] && [ "$BEHIND" -le "$WARN_SYNC_MAX" ]; then
    echo "🔄 Syncing ($BEHIND commits)..."

    # Show changes if > SILENT_SYNC_MAX
    if [ "$BEHIND" -gt "$SILENT_SYNC_MAX" ]; then
      echo ""
      echo "Recent changes:"
      git log --oneline -"$RECENT_CHANGES_COUNT" origin/main ^HEAD
      echo ""
    fi

    git reset --hard origin/main
    echo "✅ Synced with main"
    return 0
  fi
}

# Sync all fixed worktrees
sync_all_worktrees() {
  local force=${1:-false}

  echo "🔄 Syncing all fixed worktrees with main..."
  echo ""

  # Get worktree paths from config
  HOTFIX_PATH=$(get_config '.worktrees.hotfix.path' 'worktrees/hotfix')
  DEBUG_PATH=$(get_config '.worktrees.debug.path' 'worktrees/debug')
  HOTFIX_PARKING=$(get_config '.worktrees.hotfix.branch_parking' 'hotfix')
  DEBUG_PARKING=$(get_config '.worktrees.debug.branch_parking' 'debug')

  local synced=0
  local skipped=0
  local failed=0

  # Sync hotfix
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📂 $HOTFIX_PATH"

  if sync_worktree_intelligent "$HOTFIX_PATH" "$HOTFIX_PARKING" "$force"; then
    ((synced++))
  else
    if is_worktree_locked "$HOTFIX_PATH"; then
      ((skipped++))
    else
      ((failed++))
    fi
  fi

  echo ""

  # Sync debug
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📂 $DEBUG_PATH"

  if sync_worktree_intelligent "$DEBUG_PATH" "$DEBUG_PARKING" "$force"; then
    ((synced++))
  else
    if is_worktree_locked "$DEBUG_PATH"; then
      ((skipped++))
    else
      ((failed++))
    fi
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Summary
  if [ $synced -gt 0 ]; then
    echo "✅ $synced worktree(s) synced"
  fi

  if [ $skipped -gt 0 ]; then
    echo "⏭️  $skipped worktree(s) skipped (locked)"
  fi

  if [ $failed -gt 0 ]; then
    echo "❌ $failed worktree(s) failed"
  fi

  echo ""
}

# Get worktree status
get_worktree_status() {
  local worktree_path=$1
  local parking_branch=$2

  if [ ! -d "$worktree_path" ]; then
    echo "not_found"
    return
  fi

  cd "$worktree_path" || return 1

  # Check lock
  if is_worktree_locked "$worktree_path"; then
    echo "locked"
    return
  fi

  # Check current branch
  CURRENT_BRANCH=$(git branch --show-current)

  if [ "$CURRENT_BRANCH" = "$parking_branch" ]; then
    echo "idle"
  else
    echo "active"
  fi
}

# Export functions
export -f sync_worktree_intelligent
export -f sync_all_worktrees
export -f is_worktree_locked
export -f get_lock_info
export -f get_worktree_status
