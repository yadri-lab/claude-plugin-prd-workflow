---
name: github-sync
description: GitHub Issues integration for PRD synchronization
model: haiku
temperature: 0.3
---

# GitHub Sync Skill

Expert integration with GitHub Issues using the GitHub CLI.

## Purpose

Handle all GitHub operations for PRD synchronization:
- Create GitHub Issues from PRD content
- Parse PRD metadata (ID, name, priority)
- Update PRD files with Issue links
- Check GitHub CLI installation and authentication

## Capabilities

### 1. Verify GitHub CLI

Check if `gh` is installed and authenticated:

```bash
# Check installation
which gh

# Check authentication
gh auth status

# If not authenticated, show instructions
echo "Run: gh auth login"
```

### 2. Extract PRD Metadata

Parse PRD markdown to extract:
- PRD ID (e.g., PRD-003)
- Feature name from heading
- Priority (P0/P1/P2/P3)
- Current status (from directory location)

```bash
# Extract PRD ID
grep -o "PRD-[0-9]\+" prd-file.md | head -1

# Extract feature name
grep "^# PRD-" prd-file.md | sed 's/# PRD-[0-9]\+: //'

# Extract priority
grep "Priority.*: P[0-9]" prd-file.md | grep -o "P[0-9]"
```

### 3. Create GitHub Issue

Use `gh issue create` to create issue from PRD:

```bash
gh issue create \
  --title "PRD-003: Design System v1.0" \
  --body "$(cat prd-file.md)" \
  --label "P0,feature,PRD-003" \
  --assignee "username" \
  --milestone "v2.0"
```

**Label Format**:
- Always include priority (P0/P1/P2/P3)
- Always include "feature"
- Always include PRD ID for tracking
- Optional: User-provided custom labels

### 4. Update PRD with Issue Link

Add GitHub Issue reference to PRD metadata:

```markdown
**Priority**: P0
**GitHub Issue**: #42 (https://github.com/org/repo/issues/42)
**Synced**: 2025-10-26
```

Use `sed` or Edit tool to insert after Priority line.

### 5. Close Linked Issue

When completing a PRD, close the linked GitHub Issue:

```bash
# Extract issue number from PRD
ISSUE_NUM=$(grep "GitHub Issue.*#" prd.md | grep -o '#[0-9]\+' | tr -d '#')

# Close issue
gh issue close $ISSUE_NUM \
  --comment "✅ Completed via claude-prd-workflow" \
  --reason completed
```

## Error Handling

### GitHub CLI Not Found

```markdown
❌ GitHub CLI (gh) not found

Install it:
  macOS: brew install gh
  Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
  Windows: winget install --id GitHub.cli

Then authenticate:
  gh auth login
```

### Not Authenticated

```markdown
❌ Not authenticated with GitHub

Run:
  gh auth login

And follow the prompts to authenticate.
```

### Issue Creation Failed

```markdown
❌ Failed to create GitHub Issue

Error: {error message from gh}

Troubleshooting:
  1. Check network connection
  2. Verify repository permissions (write access required)
  3. Check if repository exists: gh repo view
  4. Try manual creation: gh issue create --title "Test"
```

### Already Synced

```markdown
⚠️ PRD already has linked GitHub Issue #42

Options:
  1. View existing issue: gh issue view 42 --web
  2. Update issue body: Use --update flag
  3. Create new issue: Use --force flag

What would you like to do?
```

## Workflow Helpers

### Check for Existing Sync

```bash
# Check if PRD already has GitHub Issue link
if grep -q "GitHub Issue.*#" prd-file.md; then
  # Extract issue number
  ISSUE_NUM=$(grep "GitHub Issue.*#" prd-file.md | grep -o '#[0-9]\+' | tr -d '#')

  # Check if issue still exists
  if gh issue view $ISSUE_NUM &>/dev/null; then
    echo "Already synced to Issue #$ISSUE_NUM"
    exit 1
  else
    echo "Issue #$ISSUE_NUM no longer exists, can re-sync"
  fi
fi
```

### Extract Repository Info

```bash
# Get current repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# Get default branch
BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)

# Get repository URL
URL=$(gh repo view --json url -q .url)
```

### Validate PRD File

Before syncing, ensure PRD is valid:

```bash
# Check PRD has required metadata
if ! grep -q "PRD-[0-9]\+" prd.md; then
  echo "❌ No PRD ID found in file"
  exit 1
fi

if ! grep -q "Priority.*: P[0-9]" prd.md; then
  echo "❌ No Priority found in PRD"
  exit 1
fi

# Check PRD is not in draft status (optional)
if [[ "$PRD_DIR" == *"01-draft"* ]]; then
  echo "⚠️ PRD is still in draft. Consider reviewing first: /review-prd"
  echo "Continue anyway? [y/N]"
  # Wait for user confirmation
fi
```

## Usage Examples

### Example 1: Basic Sync

```bash
/sync-github PRD-003

→ Skills invoked: github-sync
→ Checking GitHub CLI...
✓ GitHub CLI installed and authenticated

→ Reading PRD-003 from product/prds/04-in-progress/...
✓ Found: 241026-design-system-v1-PRD-003-v1.md

→ Extracting metadata...
  • ID: PRD-003
  • Name: Design System v1.0
  • Priority: P0
  • Status: in-progress

→ Creating GitHub Issue...
✓ Created Issue #42: PRD-003: Design System v1.0
  https://github.com/org/repo/issues/42

→ Updating PRD with issue link...
✓ Added GitHub Issue reference to PRD

✅ Sync complete!
```

### Example 2: Sync with Custom Options

```bash
/sync-github PRD-007 --assignee=alice --milestone=v2.0

→ Creating GitHub Issue with options...
  • Assignee: alice
  • Milestone: v2.0
  • Labels: P0, feature, PRD-007

✓ Created Issue #45
✓ Assigned to alice
✓ Added to milestone v2.0
```

## Integration Points

### With /complete-prd

When user runs `/complete-prd PRD-003`:

1. Move PRD to 05-complete/
2. Check if PRD has linked GitHub Issue
3. If yes, close the Issue automatically
4. Add completion comment to Issue

### With /list-prds

Show GitHub Issue links in PRD list:

```markdown
## 🚧 In Progress (2)

| PRD ID | Feature | Priority | Branch | GitHub |
|--------|---------|----------|--------|--------|
| PRD-003 | Design System | P0 | feat/PRD-003 | [#42](https://github.com/org/repo/issues/42) |
| PRD-008 | RSS Monitor | P0 | feat/PRD-008 | - |
```

## Best Practices

1. **Always sync after approval**: `/review-prd` → `/sync-github`
2. **Include PRD ID in labels**: Enables automatic tracking
3. **Use milestones**: Group related PRDs
4. **Close issues when PRD completes**: Keep GitHub in sync
5. **Link PRD in issue**: Add PRD file path in issue description

## Technical Notes

- Uses GitHub CLI (`gh`) - no direct API calls
- Authentication handled by `gh auth`
- Works in any git repository with GitHub remote
- Supports GitHub Enterprise (via `gh auth login --hostname`)
- Issue body is full PRD markdown (searchable in GitHub)
