#!/bin/bash
# Quick check if current branch has uncommitted changes or needs push

branch=$(git branch --show-current)
echo "🌿 Branch: $branch"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Uncommitted changes detected:"
    git status --short
    echo ""
fi

# Check if branch needs push
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)
if [ $? -eq 0 ]; then
    local_commit=$(git rev-parse HEAD)
    remote_commit=$(git rev-parse @{u})

    if [ "$local_commit" != "$remote_commit" ]; then
        behind=$(git rev-list --count HEAD..@{u})
        ahead=$(git rev-list --count @{u}..HEAD)

        if [ "$ahead" -gt 0 ]; then
            echo "⬆️  $ahead commit(s) ahead - needs push"
        fi
        if [ "$behind" -gt 0 ]; then
            echo "⬇️  $behind commit(s) behind - needs pull"
        fi
    else
        echo "✅ Branch is up to date with remote"
    fi
else
    echo "ℹ️  No upstream branch configured"
fi
