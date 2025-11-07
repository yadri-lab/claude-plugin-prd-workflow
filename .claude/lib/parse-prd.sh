#!/usr/bin/env bash
#
# PRD Parsing Library - Flexible PRD metadata extraction
#
# Supports multiple PRD ID formats:
# - Standard: PRD-003, PRD-012
# - Company-prefixed: WTC-PRD-003, ACME-PRD-012
# - Custom: FEAT_0003, RFC-012
#
# Usage:
#   source .claude/lib/parse-prd.sh
#   extract_prd_id "feat/PRD-007-oauth2"
#   extract_prd_metadata "/path/to/PRD-007.md"
#

# Extract PRD ID from string (branch name, filename, or direct ID)
# Supports: PRD-XXX, ABC-PRD-XXX, FEAT_XXX, RFC-XXX
extract_prd_id() {
  local input="$1"
  local prd_id=""

  # Try standard format: PRD-XXX
  if echo "$input" | grep -qE 'PRD-[0-9]+'; then
    prd_id=$(echo "$input" | grep -oE 'PRD-[0-9]+' | head -1)
  # Try company-prefixed: ABC-PRD-XXX
  elif echo "$input" | grep -qE '[A-Z]+-PRD-[0-9]+'; then
    prd_id=$(echo "$input" | grep -oE '[A-Z]+-PRD-[0-9]+' | head -1)
  # Try custom formats: FEAT_XXX, RFC-XXX
  elif echo "$input" | grep -qE '[A-Z]+[_-][0-9]+'; then
    prd_id=$(echo "$input" | grep -oE '[A-Z]+[_-][0-9]+' | head -1)
  fi

  echo "$prd_id"
}

# Find PRD file across all directories
# Usage: find_prd_file "PRD-007"
find_prd_file() {
  local prd_id="$1"
  local prd_file=""

  # Search in all PRD directories
  for dir in "product/prds/01-draft" "product/prds/02-ready" "product/prds/03-in-progress" "product/prds/04-complete" "product/prds/99-archived"; do
    if [ -d "$dir" ]; then
      # Try exact match first
      prd_file=$(find "$dir" -name "${prd_id}*.md" 2>/dev/null | head -1)
      if [ -n "$prd_file" ]; then
        echo "$prd_file"
        return 0
      fi
    fi
  done

  # Not found
  return 1
}

# Extract PRD title from file
# Supports:
# - # PRD-XXX: Title
# - # WTC-PRD-XXX: Title
# - **Title**: Something
extract_prd_title() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo ""
    return 1
  fi

  # Try H1 heading with PRD ID
  local title=$(grep -m1 '^#\s' "$prd_file" | sed 's/^#\s*//' | sed 's/^[A-Z-]*PRD[_-][0-9]*:\s*//')

  # Try **Title**: format
  if [ -z "$title" ]; then
    title=$(grep -m1 '^\*\*Title\*\*:' "$prd_file" | sed 's/^\*\*Title\*\*:\s*//')
  fi

  echo "$title"
}

# Extract PRD status from file
# Supports: **Status**: ..., Status: ...
extract_prd_status() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "Unknown"
    return 1
  fi

  local status=$(grep -m1 '^\*\*Status\*\*:' "$prd_file" | sed 's/^\*\*Status\*\*:\s*//')

  if [ -z "$status" ]; then
    status=$(grep -m1 '^Status:' "$prd_file" | sed 's/^Status:\s*//')
  fi

  # Default based on directory if not found
  if [ -z "$status" ]; then
    if [[ "$prd_file" == *"01-draft"* ]]; then
      status="Draft"
    elif [[ "$prd_file" == *"02-ready"* ]]; then
      status="Ready"
    elif [[ "$prd_file" == *"03-in-progress"* ]]; then
      status="In Progress"
    elif [[ "$prd_file" == *"04-complete"* ]]; then
      status="Complete"
    else
      status="Unknown"
    fi
  fi

  echo "$status"
}

# Extract PRD priority from file
# Supports: **Priority**: P0, Priority: P1, etc.
extract_prd_priority() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "-"
    return 1
  fi

  local priority=$(grep -m1 '^\*\*Priority\*\*:' "$prd_file" | sed 's/^\*\*Priority\*\*:\s*//')

  if [ -z "$priority" ]; then
    priority=$(grep -m1 '^Priority:' "$prd_file" | sed 's/^Priority:\s*//')
  fi

  if [ -z "$priority" ]; then
    priority="-"
  fi

  echo "$priority"
}

# Extract PRD grade from file (if reviewed)
# Supports: **Grade**: A-, Grade: B+, etc.
extract_prd_grade() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "-"
    return 1
  fi

  local grade=$(grep -m1 '^\*\*Grade\*\*:' "$prd_file" | sed 's/^\*\*Grade\*\*:\s*//')

  if [ -z "$grade" ]; then
    grade=$(grep -m1 '^Grade:' "$prd_file" | sed 's/^Grade:\s*//')
  fi

  if [ -z "$grade" ]; then
    grade="-"
  fi

  echo "$grade"
}

# Extract PRD assignee from file
extract_prd_assignee() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "-"
    return 1
  fi

  local assignee=$(grep -m1 '^\*\*Assignee\*\*:' "$prd_file" | sed 's/^\*\*Assignee\*\*:\s*//')

  if [ -z "$assignee" ]; then
    assignee=$(grep -m1 '^Assignee:' "$prd_file" | sed 's/^Assignee:\s*//')
  fi

  if [ -z "$assignee" ]; then
    assignee="-"
  fi

  echo "$assignee"
}

# Extract PRD branch from file
extract_prd_branch() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "-"
    return 1
  fi

  local branch=$(grep -m1 '^\*\*Branch\*\*:' "$prd_file" | sed 's/^\*\*Branch\*\*:\s*//')

  if [ -z "$branch" ]; then
    branch=$(grep -m1 '^Branch:' "$prd_file" | sed 's/^Branch:\s*//')
  fi

  if [ -z "$branch" ]; then
    branch="-"
  fi

  echo "$branch"
}

# Extract all PRD metadata as JSON
# Usage: extract_prd_metadata "/path/to/PRD-007.md"
extract_prd_metadata() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "{\"error\": \"File not found\"}"
    return 1
  fi

  local prd_id=$(basename "$prd_file" | grep -oE '[A-Z-]*PRD[_-][0-9]+' | head -1)
  local title=$(extract_prd_title "$prd_file")
  local status=$(extract_prd_status "$prd_file")
  local priority=$(extract_prd_priority "$prd_file")
  local grade=$(extract_prd_grade "$prd_file")
  local assignee=$(extract_prd_assignee "$prd_file")
  local branch=$(extract_prd_branch "$prd_file")

  # Output as JSON
  cat <<EOF
{
  "prd_id": "$prd_id",
  "title": "$title",
  "status": "$status",
  "priority": "$priority",
  "grade": "$grade",
  "assignee": "$assignee",
  "branch": "$branch",
  "file_path": "$prd_file"
}
EOF
}

# Extract P0 criteria from PRD
# Returns list of P0 requirements
extract_p0_criteria() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo ""
    return 1
  fi

  # Find ### P0 section and extract checkboxes
  awk '/^### P0/,/^###/ {
    if (/^- \[/) print
  }' "$prd_file" | head -10
}

# Validate PRD file structure
# Returns 0 if valid, 1 if invalid
validate_prd_structure() {
  local prd_file="$1"

  if [ ! -f "$prd_file" ]; then
    echo "❌ File not found"
    return 1
  fi

  local errors=0

  # Check for PRD ID in filename or content
  if ! basename "$prd_file" | grep -qE '[A-Z-]*PRD[_-][0-9]+'; then
    if ! grep -qE '^#.*[A-Z-]*PRD[_-][0-9]+' "$prd_file"; then
      echo "⚠️  Warning: No PRD ID found in filename or H1"
      errors=$((errors + 1))
    fi
  fi

  # Check for title
  if ! grep -qE '^#\s' "$prd_file"; then
    echo "⚠️  Warning: No H1 title found"
    errors=$((errors + 1))
  fi

  if [ $errors -eq 0 ]; then
    echo "✅ PRD structure valid"
    return 0
  else
    return 1
  fi
}

# Export functions for use in other scripts
export -f extract_prd_id
export -f find_prd_file
export -f extract_prd_title
export -f extract_prd_status
export -f extract_prd_priority
export -f extract_prd_grade
export -f extract_prd_assignee
export -f extract_prd_branch
export -f extract_prd_metadata
export -f extract_p0_criteria
export -f validate_prd_structure
