#!/bin/bash

# Context Detection for Worktree Commands
# Detects whether command is run from Main or from a worktree
# Used by /ship and /debugging commands

detect_execution_context() {
  local current_dir=$(pwd)
  local git_root=$(git rev-parse --show-toplevel 2>/dev/null)

  if [ -z "$git_root" ]; then
    echo "ERROR: Not in a git repository"
    return 1
  fi

  # Normalize paths for comparison (handle Windows paths)
  current_dir=$(realpath "$current_dir" 2>/dev/null || echo "$current_dir")
  git_root=$(realpath "$git_root" 2>/dev/null || echo "$git_root")

  # Check if we're in a worktree
  local worktree_path=$(git rev-parse --git-common-dir 2>/dev/null)

  # Are we in the hotfix worktree?
  if [[ "$current_dir" == *"/worktrees/hotfix"* ]] || [[ "$current_dir" == *"\\worktrees\\hotfix"* ]]; then
    echo "WORKTREE_HOTFIX"
    return 0
  fi

  # Are we in the debug worktree?
  if [[ "$current_dir" == *"/worktrees/debug"* ]] || [[ "$current_dir" == *"\\worktrees\\debug"* ]]; then
    echo "WORKTREE_DEBUG"
    return 0
  fi

  # Are we in the main repository?
  if [ "$current_dir" == "$git_root" ] || [[ "$current_dir" == "$git_root"* ]]; then
    # Check if we're in a worktrees subdirectory
    if [[ "$current_dir" != *"/worktrees/"* ]] && [[ "$current_dir" != *"\\worktrees\\"* ]]; then
      echo "MAIN"
      return 0
    fi
  fi

  # Unknown location
  echo "UNKNOWN"
  return 2
}

get_main_repo_path() {
  # Get the path to the main repository (not worktree)
  local git_common=$(git rev-parse --git-common-dir 2>/dev/null)

  if [ -n "$git_common" ]; then
    # Remove .git from the end
    echo "$(dirname "$git_common")"
  else
    echo "$(git rev-parse --show-toplevel 2>/dev/null)"
  fi
}

get_worktree_type() {
  local context=$(detect_execution_context)

  case "$context" in
    WORKTREE_HOTFIX)
      echo "hotfix"
      ;;
    WORKTREE_DEBUG)
      echo "debug"
      ;;
    *)
      echo ""
      ;;
  esac
}

# Check if lock file exists and is active
is_worktree_locked() {
  local worktree_path="$1"

  if [ ! -f "$worktree_path/.claude-lock" ]; then
    return 1  # Not locked
  fi

  local status=$(jq -r '.status' "$worktree_path/.claude-lock" 2>/dev/null)

  if [ "$status" == "in_progress" ]; then
    return 0  # Locked
  fi

  return 1  # Not locked
}

# Get lock information
get_lock_info() {
  local worktree_path="$1"

  if [ ! -f "$worktree_path/.claude-lock" ]; then
    echo "{}"
    return
  fi

  cat "$worktree_path/.claude-lock"
}

# Export functions for use in other scripts
export -f detect_execution_context
export -f get_main_repo_path
export -f get_worktree_type
export -f is_worktree_locked
export -f get_lock_info
