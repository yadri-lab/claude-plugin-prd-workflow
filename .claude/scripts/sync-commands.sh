#!/bin/bash
# Sync commands from project to global Claude Code cache
# Run this after updating commands to ensure consistency

set -e

PROJECT_COMMANDS=".claude/commands"
GLOBAL_COMMANDS="$HOME/.claude-code/commands"

echo "🔄 Syncing Claude Code commands..."

# 1. Clean backup files from project
echo "🧹 Cleaning backup files from project..."
find "$PROJECT_COMMANDS" -name "*.backup.md" -o -name "*.backup" -exec rm -f {} \; 2>/dev/null || true

# 2. Clean backup files from global cache
if [ -d "$GLOBAL_COMMANDS" ]; then
  echo "🧹 Cleaning backup files from global cache..."
  find "$GLOBAL_COMMANDS" -name "*.backup.md" -o -name "*.backup" -exec rm -f {} \; 2>/dev/null || true

  # 3. Sync all commands to global cache
  echo "📦 Copying commands to global cache..."
  cp -f "$PROJECT_COMMANDS"/*.md "$GLOBAL_COMMANDS/" 2>/dev/null || true

  echo "✅ Commands synced successfully!"
  echo ""
  echo "📋 Commands in global cache:"
  ls -1 "$GLOBAL_COMMANDS"/*.md | wc -l | xargs echo "  Total:"
else
  echo "⚠️  Global cache directory not found: $GLOBAL_COMMANDS"
  echo "Commands will be synced when Claude Code starts."
fi

echo ""
echo "🔄 Please restart Claude Code to see the changes."
