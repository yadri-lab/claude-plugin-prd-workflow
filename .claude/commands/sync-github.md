---
name: sync-github
description: Sync PRD with GitHub Issues (bidirectional)
category: Integration
---

# Sync GitHub Command

Synchronize PRDs with GitHub Issues for team collaboration.

## Purpose

Enable bidirectional sync between PRDs and GitHub Issues:
- Create GitHub Issues from PRDs
- Update PRD status when Issues close
- Link PRDs to Issues for easy access
- Enable team collaboration outside Claude Code

## Usage

### Create GitHub Issue from PRD

```bash
/sync-github PRD-003
```

Creates a GitHub Issue with:
- Title: "PRD-003: Feature Name"
- Body: Full PRD markdown
- Labels: Priority (P0/P1/P2) + "feature" + "PRD-003"
- Adds issue link to PRD metadata

### Options

```bash
# Specify assignee
/sync-github PRD-003 --assignee=johndoe

# Add to milestone
/sync-github PRD-003 --milestone=v2.0

# Custom labels
/sync-github PRD-003 --labels=backend,api,urgent

# Skip confirmation
/sync-github PRD-003 --yes
```

## Workflow

### Step 1: Verify Prerequisites

Check that:
- GitHub CLI (`gh`) is installed and authenticated
- User is in a git repository
- PRD exists and is readable
- PRD not already synced (unless `--force`)

```bash
# Check gh auth
gh auth status

# If not authenticated, prompt user
gh auth login
```

### Step 2: Read PRD Content

Load PRD file and extract metadata:
- PRD ID (e.g., PRD-003)
- Feature name
- Status
- Priority (P0/P1/P2/P3)
- Full markdown content

### Step 3: Create GitHub Issue

Use GitHub CLI to create issue:

```bash
gh issue create \
  --title "PRD-003: Feature Name" \
  --body "$(cat prd_content.md)" \
  --label "P0,feature,PRD-003" \
  --assignee "johndoe" \
  --milestone "v2.0"
```

### Step 4: Update PRD with Issue Link

Add to PRD metadata section (after Priority):

```markdown
**Priority**: P0
**GitHub Issue**: #42 (https://github.com/org/repo/issues/42)
**Synced**: 2025-10-26
```

### Step 5: Setup Bidirectional Sync (Optional)

Ask user if they want automatic status sync:

```
✅ GitHub Issue #42 created

🔗 Bidirectional sync available:
  • When issue closes → PRD moves to complete automatically
  • When PRD completes → Issue closes automatically

Enable? [Y/n]
```

If yes, add webhook handler (see below).

## Bidirectional Sync Implementation

### GitHub → PRD (Issue closes → Complete PRD)

Use GitHub CLI watch:

```bash
# In background (or via cron/systemd)
gh issue view 42 --json state -q .state

# When state changes to "CLOSED":
/complete-prd PRD-003
```

Better approach: GitHub Actions workflow

`.github/workflows/sync-prd-issue.yml`:

```yaml
name: Sync PRD from Issue

on:
  issues:
    types: [closed, reopened]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Extract PRD ID from labels
        id: prd
        run: |
          LABELS=$(gh issue view ${{ github.event.issue.number }} --json labels -q '.labels[].name')
          PRD_ID=$(echo "$LABELS" | grep -o 'PRD-[0-9]\+')
          echo "prd_id=$PRD_ID" >> $GITHUB_OUTPUT

      - name: Complete PRD
        if: github.event.action == 'closed' && steps.prd.outputs.prd_id
        run: |
          # Find PRD file in 04-in-progress/
          PRD_FILE=$(find product/prds/04-in-progress -name "*${{ steps.prd.outputs.prd_id }}*")

          if [ -n "$PRD_FILE" ]; then
            # Move to 05-complete/
            mv "$PRD_FILE" product/prds/05-complete/

            # Commit
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add .
            git commit -m "Complete ${{ steps.prd.outputs.prd_id }} (Issue #${{ github.event.issue.number }} closed)"
            git push
          fi

      - name: Reopen PRD
        if: github.event.action == 'reopened' && steps.prd.outputs.prd_id
        run: |
          # Move PRD back to 04-in-progress/
          PRD_FILE=$(find product/prds/05-complete -name "*${{ steps.prd.outputs.prd_id }}*")

          if [ -n "$PRD_FILE" ]; then
            mv "$PRD_FILE" product/prds/04-in-progress/
            git add .
            git commit -m "Reopen ${{ steps.prd.outputs.prd_id }} (Issue #${{ github.event.issue.number }} reopened)"
            git push
          fi
```

### PRD → GitHub (Complete PRD → Close Issue)

Update `/complete-prd` command to close linked Issue:

```bash
# In /complete-prd workflow, after moving PRD to 05-complete/:

# Extract Issue number from PRD
ISSUE_NUMBER=$(grep "GitHub Issue.*#" "$PRD_FILE" | grep -o '#[0-9]\+' | tr -d '#')

if [ -n "$ISSUE_NUMBER" ]; then
  # Close issue
  gh issue close $ISSUE_NUMBER \
    --comment "✅ Completed via claude-prd-workflow" \
    --reason completed

  echo "Closed GitHub Issue #$ISSUE_NUMBER"
fi
```

## Configuration

Add to plugin config (optional):

```json
{
  "github": {
    "enabled": true,
    "auto_create_issue": false,
    "auto_sync_status": true,
    "default_labels": ["feature"],
    "sync_direction": "bidirectional"
  }
}
```

## Error Handling

### No GitHub CLI

```
❌ GitHub CLI (gh) not found

Install it:
  macOS: brew install gh
  Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
  Windows: winget install --id GitHub.cli

Then authenticate:
  gh auth login
```

### Not Authenticated

```
❌ Not authenticated with GitHub

Run:
  gh auth login

And follow the prompts.
```

### PRD Not Found

```
❌ PRD-999 not found

Available PRDs:
  - PRD-003 (in progress)
  - PRD-007 (ready)

Use:
  /list-prds
```

### Already Synced

```
⚠️ PRD-003 already synced to GitHub Issue #42

Options:
  1. View issue: gh issue view 42 --web
  2. Update issue body: /sync-github PRD-003 --update
  3. Force create new: /sync-github PRD-003 --force

Continue? [y/N]
```

## Success Criteria

- GitHub Issue created with correct title, body, labels
- Issue link added to PRD metadata
- User can view issue: `gh issue view 42 --web`
- Bidirectional sync works (if enabled)

## Related Commands

- `/complete-prd` - Closes linked GitHub Issue
- `/list-prds` - Shows GitHub Issue links if synced

## Examples

### Example 1: Basic Sync

```bash
/sync-github PRD-003

→ Reading PRD-003...
→ Creating GitHub Issue...
✅ Created Issue #42: PRD-003: Design System v1.0
   https://github.com/org/repo/issues/42

→ Updating PRD with issue link...
✅ Done!

Next:
  • View issue: gh issue view 42 --web
  • Share with team: Send issue URL
  • Track progress: Issue updates when PRD status changes
```

### Example 2: With Options

```bash
/sync-github PRD-007 --assignee=alice --milestone=v2.0 --labels=backend,auth

→ Creating GitHub Issue...
✅ Created Issue #45: PRD-007: User Authentication
   • Assigned to: alice
   • Milestone: v2.0
   • Labels: P0, feature, PRD-007, backend, auth

→ Bidirectional sync enabled:
   ✓ Issue #45 closes → PRD-007 completes automatically
   ✓ PRD-007 completes → Issue #45 closes automatically
```

## Technical Details

Uses GitHub CLI (`gh`) for all GitHub operations:
- `gh issue create` - Create issues
- `gh issue close` - Close issues
- `gh issue view` - Check issue status
- `gh issue list` - List issues

No direct GitHub API calls needed - `gh` handles authentication and API.

For bidirectional sync, uses:
- GitHub Actions (recommended) - automatic, no local service
- OR: Local watcher script (for projects without Actions)
