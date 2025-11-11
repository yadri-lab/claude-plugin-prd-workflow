---
name: context
description: Show current development context (PRD, branch, progress)
category: PRD Management
---

# Context Command

Display your current development context to quickly resume work after interruptions.

## Purpose

Answer the question: **"Where am I and what was I doing?"**

Essential for:
- 🔄 Resuming work after meetings/interruptions
- 🎯 Remembering which PRD you're on
- 📊 Seeing progress at a glance
- ⚡ Quick status check without digging through files

## Usage

```bash
# Show current context
/context

# Show context for specific worktree
/context --worktree=worktrees/prd-007/

# Verbose mode (includes recent commits, todos)
/context --verbose
/context -v
```

## Workflow

### Step 1: Detect Current Location

```bash
# Get current Git branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Detect if in worktree
if git rev-parse --git-common-dir &>/dev/null; then
  GIT_COMMON_DIR=$(git rev-parse --git-common-dir)

  if [[ "$GIT_COMMON_DIR" != *".git"* ]] || [[ "$GIT_COMMON_DIR" == *"worktrees"* ]]; then
    IN_WORKTREE=true
    WORKTREE_PATH=$(pwd)
  else
    IN_WORKTREE=false
    WORKTREE_PATH=""
  fi
else
  IN_WORKTREE=false
  WORKTREE_PATH=""
fi
```

### Step 2: Extract PRD Information

**From branch name**:
```bash
# Extract PRD ID from branch name (supports various formats)
# Examples: feat/PRD-007-oauth, feature/WTC-PRD-007-oauth, PRD-007-oauth
if [[ "$CURRENT_BRANCH" =~ (PRD-[0-9]+) ]]; then
  PRD_ID="${BASH_REMATCH[1]}"
elif [[ "$CURRENT_BRANCH" =~ ([A-Z]+-PRD-[0-9]+) ]]; then
  PRD_ID="${BASH_REMATCH[1]}"
else
  PRD_ID="unknown"
fi
```

**Find PRD file**:
```bash
# Search for PRD file across directories
PRD_FILE=$(find product/prds/ -name "*${PRD_ID}*.md" 2>/dev/null | head -n 1)

if [ -n "$PRD_FILE" ]; then
  # Extract metadata from PRD
  PRD_TITLE=$(grep -m1 '^#' "$PRD_FILE" | sed 's/^#\+\s*//' | sed "s/${PRD_ID}:\s*//")
  PRD_STATUS=$(grep -m1 '^\*\*Status\*\*:' "$PRD_FILE" | sed 's/^\*\*Status\*\*:\s*//' || echo "Unknown")
  PRD_PRIORITY=$(grep -m1 '^\*\*Priority\*\*:' "$PRD_FILE" | sed 's/^\*\*Priority\*\*:\s*//' || echo "-")
  PRD_ASSIGNEE=$(grep -m1 '^\*\*Assignee\*\*:' "$PRD_FILE" | sed 's/^\*\*Assignee\*\*:\s*//' || echo "-")

  # Determine directory/stage
  if [[ "$PRD_FILE" == *"01-draft"* ]]; then
    PRD_STAGE="Draft"
  elif [[ "$PRD_FILE" == *"02-ready"* ]]; then
    PRD_STAGE="Ready"
  elif [[ "$PRD_FILE" == *"03-in-progress"* ]]; then
    PRD_STAGE="In Progress"
  elif [[ "$PRD_FILE" == *"04-complete"* ]]; then
    PRD_STAGE="Complete"
  else
    PRD_STAGE="Unknown"
  fi
fi
```

### Step 3: Calculate Progress Metrics

```bash
# Days since branch created
BRANCH_CREATED=$(git log --format=%ct --reverse "$CURRENT_BRANCH" 2>/dev/null | head -n1)
if [ -n "$BRANCH_CREATED" ]; then
  CURRENT_TIME=$(date +%s)
  DAYS_ELAPSED=$(( (CURRENT_TIME - BRANCH_CREATED) / 86400 ))
else
  DAYS_ELAPSED=0
fi

# Count commits on branch (vs main)
COMMIT_COUNT=$(git rev-list --count HEAD ^main 2>/dev/null || echo "0")

# Check for uncommitted changes
if git diff --quiet && git diff --cached --quiet; then
  HAS_CHANGES=false
else
  HAS_CHANGES=true
fi

# Count files changed
FILES_CHANGED=$(git diff --cached --name-only | wc -l)
UNSTAGED_FILES=$(git diff --name-only | wc -l)
```

### Step 4: Parse Work Plan (If Exists)

```bash
# Look for WORK_PLAN.md in PRD directory or worktree
if [ -f "WORK_PLAN.md" ]; then
  # Count total tasks
  TOTAL_TASKS=$(grep -c '^- \[' WORK_PLAN.md 2>/dev/null || echo "0")

  # Count completed tasks
  COMPLETED_TASKS=$(grep -c '^- \[x\]' WORK_PLAN.md 2>/dev/null || echo "0")

  # Calculate progress percentage
  if [ "$TOTAL_TASKS" -gt 0 ]; then
    PROGRESS_PERCENT=$(( 100 * COMPLETED_TASKS / TOTAL_TASKS ))
  else
    PROGRESS_PERCENT=0
  fi

  # Find next task (first unchecked)
  NEXT_TASK=$(grep -m1 '^- \[ \]' WORK_PLAN.md 2>/dev/null | sed 's/^- \[ \] //')
fi
```

### Step 5: Display Context

**Standard output**:

```markdown
📍 **Current Context**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 **Branch**: feat/PRD-007-oauth2-integration
📄 **PRD**: PRD-007 - OAuth2 Integration System
📂 **Stage**: In Progress
📍 **Location**: worktrees/prd-007-oauth2-integration/
⏱️  **Started**: 2 days ago
👤 **Assignee**: @yassinello

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Progress**: 3/8 tasks (38%)
▓▓▓▓░░░░░░ 38%

✅ **Completed**:
- OAuth provider configuration
- Database schema migration
- Basic auth flow implementation

🎯 **Next Task**:
- Implement OAuth callback handler

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 **Git Status**:
- 🔨 Commits: 5 commits ahead of main
- 📝 Staged: 3 files
- ⚠️  Unstaged: 2 files
- 💾 Working directory: Modified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 **Quick Actions**:
- Continue work: (already in right location)
- View PRD: cat product/prds/03-in-progress/PRD-007-oauth2-integration.md
- View work plan: cat WORK_PLAN.md
- Commit progress: git add . && git commit
- Switch PRD: /switch <other-prd-id>
```

**Verbose output** (with `--verbose` or `-v`):

```markdown
📍 **Current Context** (Detailed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... same as above ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Recent Activity**:

Last 3 commits:
- a3f2c1d (2 hours ago) Implement token refresh logic
- 8d4e2a9 (5 hours ago) Add OAuth callback route
- 1c8f3b2 (1 day ago) Set up OAuth provider config

Modified files:
  M  src/auth/oauth-provider.ts
  M  src/routes/auth.ts
  A  src/auth/token-manager.ts
  ?? src/auth/oauth-callback.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 **Dependencies**:
- ✅ PRD-003 (Database schema) - Complete
- 🔨 PRD-005 (Auth system) - In Progress
```

### Step 6: Handle Edge Cases

**Case 1: On main branch**
```markdown
📍 **Current Context**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 **Branch**: main
📂 **Location**: Main repository (no active PRD)

💡 **Ready to start work?**
- List available PRDs: /list-prds
- Set up a PRD: /setup-prd <prd-id>
- Create new PRD: /create-prd
```

**Case 2: No PRD associated with branch**
```markdown
📍 **Current Context**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 **Branch**: feature/random-work
⚠️  **PRD**: Not found (not following PRD workflow)
📂 **Location**: Main repository

💡 This branch doesn't follow PRD naming conventions.
- View PRD workflow: See .claude/commands/setup-prd.md
- Migrate to PRD: Consider creating a PRD for this work
```

**Case 3: PRD complete but still on branch**
```markdown
📍 **Current Context**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 **Branch**: feat/PRD-005-auth-system
📄 **PRD**: PRD-005 - Authentication System
✅ **Stage**: Complete
⚠️  **Note**: This PRD is marked complete but branch still exists

💡 **Recommended Actions**:
- Switch to another PRD: /switch <prd-id>
- Clean up this branch: /cleanup
- Archive the PRD: /archive-prd PRD-005
```

## Configuration

Respects configuration from `.claude/config.json`:

```json
{
  "prd_workflow": {
    "context": {
      "show_progress_bar": true,
      "show_git_status": true,
      "show_next_task": true,
      "recent_commits_count": 3,
      "show_dependencies": false
    }
  }
}
```

## Integration

Works seamlessly with:
- `/switch` - Switch to different PRD context
- `/list-prds` - See all available PRDs
- `/cleanup` - Clean up after completing PRD
- Git worktrees - Detects and displays worktree info

## Performance

- ⚡ Fast: < 100ms execution time
- 📦 Lightweight: Only reads git metadata + 1-2 files
- 🔄 No external dependencies

## Best Practices

**When to use /context**:
- ✅ After returning from meeting/break
- ✅ When switching between terminal windows
- ✅ Before starting daily standup
- ✅ When resuming work next day
- ✅ After being interrupted

**Pro tips**:
- Add alias: `alias ctx="/context"`
- Use in tmux/screen session titles
- Include in shell prompt (if desired)

## Examples

**Scenario 1: Resuming after lunch**
```bash
$ /context

📍 Current Context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 Branch: feat/PRD-007-oauth2
📄 PRD: PRD-007 - OAuth2 Integration
📊 Progress: 3/8 tasks (38%)
🎯 Next: Implement OAuth callback

# Perfect! I remember now. Let me continue...
```

**Scenario 2: After git pulling updates**
```bash
$ git checkout main
$ git pull
$ /context

📍 Current Context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 Branch: main
📂 No active PRD

💡 Ready to start work?
- /list-prds
- /switch PRD-007
```

**Scenario 3: Checking progress before standup**
```bash
$ /context -v

📍 Current Context (Detailed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
...
📝 Recent Activity:
Last 3 commits:
- Implement token refresh (2h ago)
- Add callback route (5h ago)
- OAuth provider config (1d ago)

# Great, now I can give my standup update!
```

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 0.4.2
