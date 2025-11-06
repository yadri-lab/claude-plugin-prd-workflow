#!/bin/bash
# Archive old session files to keep workspace clean

session_file=".claude/session-context.json"
archive_dir=".claude/archives/sessions"

if [ ! -f "$session_file" ]; then
    echo "ℹ️  No active session file found"
    exit 0
fi

# Create archives directory if needed
mkdir -p "$archive_dir"

# Get session age
if command -v stat &> /dev/null; then
    # Linux/Mac
    mod_time=$(stat -c %Y "$session_file" 2>/dev/null || stat -f %m "$session_file" 2>/dev/null)
    current_time=$(date +%s)
    age_days=$(( ($current_time - $mod_time) / 86400 ))

    echo "📅 Session age: $age_days days"

    if [ $age_days -gt 7 ]; then
        timestamp=$(date +%Y%m%d-%H%M%S)
        archive_file="$archive_dir/session-$timestamp.json"

        mv "$session_file" "$archive_file"
        echo "✅ Archived old session to: $archive_file"
        echo ""
        echo "💡 Start fresh with: /explore-prd or /create-prd"
    else
        echo "✅ Session is recent, no cleanup needed"
    fi
else
    echo "⚠️  Cannot determine session age (stat command not available)"
fi
