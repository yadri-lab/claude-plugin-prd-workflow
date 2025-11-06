#!/bin/bash
# Quick check for open PRs related to current branch

branch=$(git branch --show-current)

echo "🔍 Checking PRs for branch: $branch"
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not installed"
    echo "   Install: https://cli.github.com/"
    exit 1
fi

# Find PRs for current branch
pr_data=$(gh pr list --head "$branch" --json number,title,state,url 2>/dev/null)

if [ -z "$pr_data" ] || [ "$pr_data" = "[]" ]; then
    echo "ℹ️  No PR found for this branch"
    echo ""
    echo "💡 Create PR with: gh pr create"
else
    echo "$pr_data" | jq -r '.[] | "PR #\(.number): \(.title)\nState: \(.state)\nURL: \(.url)\n"'
fi
