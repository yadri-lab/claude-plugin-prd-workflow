#!/bin/bash
# Quick PRD status overview - shows all active PRDs and their branches

echo "📋 Active PRDs Status"
echo "===================="
echo ""

if [ ! -d ".prds" ]; then
    echo "❌ No .prds directory found"
    exit 1
fi

# Count PRDs by status
in_progress=$(find .prds -name "*.md" -type f ! -name "template.md" -exec grep -l "Status: In Progress" {} \; 2>/dev/null | wc -l)
review=$(find .prds -name "*.md" -type f ! -name "template.md" -exec grep -l "Status: In Review" {} \; 2>/dev/null | wc -l)
completed=$(find .prds -name "*.md" -type f ! -name "template.md" -exec grep -l "Status: Completed" {} \; 2>/dev/null | wc -l)

echo "📊 Summary:"
echo "  🚧 In Progress: $in_progress"
echo "  👀 In Review:   $review"
echo "  ✅ Completed:   $completed"
echo ""

# Show active PRDs with their branches
echo "🔥 Active PRDs:"
find .prds -name "*.md" -type f ! -name "template.md" | while read prd; do
    status=$(grep "^Status:" "$prd" | head -1 | sed 's/Status: //')
    title=$(grep "^# PRD:" "$prd" | head -1 | sed 's/# PRD: //')
    branch=$(grep "^Branch:" "$prd" | head -1 | sed 's/Branch: //')

    if [ "$status" != "Completed" ]; then
        echo ""
        echo "  📄 $title"
        echo "     Status: $status"
        [ ! -z "$branch" ] && echo "     Branch: $branch"
    fi
done
