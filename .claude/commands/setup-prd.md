---
name: setup-prd
description: Set up development environment (branch + worktree) for PRD
category: PRD Management
---

# Setup PRD Command

Prepare development environment for a PRD by creating a feature branch, auto-assigning, and moving to Ready.

## Purpose

Create isolated development environment for PRD:
- Create feature branch
- Set up Git worktree (optional)
- Auto-assign to current user
- Move PRD to Ready (02-ready/)
- Update WORK_PLAN.md
- **Accept draft PRDs** (with warning) for parallel workflow

### Step 1: List Available PRDs

Scan PRD directories for available PRDs:
```bash
# Check these directories:
- product/prds/01-draft/
- product/prds/02-ready/
- product/prds/03-in-progress/ (to show what's already being worked on)
```

Display table:
```markdown
📋 **PRDs Available**

**Draft** (Review later on feature branch):
| # | PRD ID | Feature | Created |
|---|--------|---------|---------|
| 1 | PRD-007 | OAuth2 Integration | 2025-10-26 |
| 2 | PRD-008 | Dark Mode Support | 2025-10-26 |

**Approved** (Ready to code):
| # | PRD ID | Feature | Grade |
|---|--------|---------|-------|
| 3 | PRD-003 | Design System | A- |
| 4 | PRD-004 | Landing Page | B+ |

**In Progress** (Already being developed):
| # | PRD ID | Feature | Branch |
|---|--------|---------|--------|
| 5 | PRD-005 | API v2 | feature/PRD-005-api-v2 |

Which PRD? (number, PRD-XXX, or filename)
```

### Step 2: Validate and Warn if Draft

If selected PRD is in draft:
```markdown
⚠️ **PRD-007 is still in DRAFT**

This PRD hasn't been reviewed or approved yet.

**Recommended Workflow**:
1. Create feature branch now (parallel workflow)
2. Review and refine PRD on feature branch
3. Start coding after review

**Benefits**:
- Keeps your Main branch free
- Can review in separate Cursor instance
- Multiple PRDs can be prepped in parallel

**Continue anyway?** (y/n or more info)
> y

✅ Proceeding with draft PRD
💡 Remember to /review-prd PRD-007 on the feature branch!
```

If user says "no", cancel gracefully.

### Step 3: Generate Feature Branch Name

Read branch naming configuration from .claude/config.json or use defaults

Default pattern: feature/PRD-{ID}-{slug}

Examples:
- feature/PRD-007-oauth2-integration
- feature/PRD-008-dark-mode-support

Extract slug from PRD filename:
```javascript
// From: PRD-007-oauth2-integration.md
// Extract: oauth2-integration
const slug = filename.replace(/^PRD-\d+-/, '').replace('.md', '');
```

### Step 4: Create Feature Branch

```bash
# Ensure on main and up to date
git checkout main
git pull origin main

# Create branch
git branch feature/PRD-007-oauth2-integration

# Don't checkout yet (worktree will do that if enabled)
```

### Step 5: Create Git Worktree (Enforced)

**Pre-flight Health Checks**:

```bash
echo "🔍 Running pre-flight checks..."

# 1. Check Git version (need 2.25+)
GIT_VERSION=$(git --version | grep -oP '\d+\.\d+' | head -1)
MIN_VERSION="2.25"

if [ "$(printf '%s\n' "$MIN_VERSION" "$GIT_VERSION" | sort -V | head -n1)" != "$MIN_VERSION" ]; then
  echo "❌ Git version too old: $GIT_VERSION (need ≥$MIN_VERSION)"
  echo ""
  echo "📖 REMEDIATION:"
  echo "   1. Upgrade Git: https://git-scm.com/downloads"
  echo "   2. OR set fallback_on_error=true in .claude/config.json"
  echo ""
  exit 1
fi
echo "✓ Git version $GIT_VERSION compatible"

# 2. Check parent directory exists and is writable
PARENT_DIR=$(jq -r '.prd_workflow.worktree.parent_directory // ".."' .claude/config.json)

if [ ! -d "$PARENT_DIR" ]; then
  echo "❌ Parent directory does not exist: $PARENT_DIR"
  echo ""
  echo "📖 REMEDIATION:"
  echo "   1. Create directory: mkdir -p $PARENT_DIR"
  echo "   2. OR change parent_directory in .claude/config.json"
  echo ""
  exit 1
fi

if [ ! -w "$PARENT_DIR" ]; then
  echo "❌ Parent directory not writable: $PARENT_DIR"
  echo ""
  echo "📖 REMEDIATION:"
  echo "   1. Fix permissions: chmod +w $PARENT_DIR"
  echo "   2. OR change parent_directory in .claude/config.json"
  echo ""
  exit 1
fi
echo "✓ Parent directory writable: $PARENT_DIR"

# 3. Check for worktree conflicts
EXISTING_WORKTREE=$(git worktree list | grep -F "feature/PRD-007" || true)
if [ -n "$EXISTING_WORKTREE" ]; then
  echo "⚠️  Worktree already exists for this PRD"
  echo "$EXISTING_WORKTREE"
  echo ""
  echo "Options:"
  echo "  1. Remove existing: git worktree remove <path>"
  echo "  2. Use existing worktree"
  echo "  3. Cancel"
  read -p "Choice (1-3): " choice

  if [ "$choice" = "1" ]; then
    WORKTREE_PATH=$(echo "$EXISTING_WORKTREE" | awk '{print $1}')
    git worktree remove "$WORKTREE_PATH" --force
    echo "✓ Removed existing worktree"
  elif [ "$choice" = "2" ]; then
    echo "ℹ️  Using existing worktree - skipping creation"
    exit 0
  else
    exit 1
  fi
fi

echo "✅ Pre-flight checks passed"
echo ""
```

**Create Worktree**:

```bash
# Build worktree path
PROJECT_NAME=$(basename "$(git rev-parse --show-toplevel)")
FEATURE_SLUG=$(echo "prd-007-oauth2-integration" | tr '[:upper:]' '[:lower:]')
WORKTREE_PATH="$PARENT_DIR/${PROJECT_NAME}-${FEATURE_SLUG}"

echo "🌳 Creating worktree: $WORKTREE_PATH"

# Create worktree
if git worktree add "$WORKTREE_PATH" "feature/PRD-007-oauth2-integration"; then
  echo "✅ Worktree created successfully"

  # Optional: Auto-install dependencies
  AUTO_INSTALL=$(jq -r '.prd_workflow.worktree.auto_install_dependencies // false' .claude/config.json)
  if [ "$AUTO_INSTALL" = "true" ]; then
    echo "📦 Installing dependencies..."
    (cd "$WORKTREE_PATH" && npm ci 2>/dev/null || yarn install --frozen-lockfile 2>/dev/null || echo "⏭️  No package manager found, skipping")
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Environment Ready"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📂 Worktree: $WORKTREE_PATH"
  echo "🌿 Branch: feature/PRD-007-oauth2-integration"
  echo ""
  echo "Next: cd $WORKTREE_PATH"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  # Worktree creation failed - check if fallback allowed
  ALLOW_FALLBACK=$(jq -r '.prd_workflow.worktree.fallback_on_error // false' .claude/config.json)

  if [ "$ALLOW_FALLBACK" = "true" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  WORKTREE CREATION FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔄 FALLBACK AVAILABLE: git checkout (not recommended)"
    echo ""
    echo "⚠️  Fallback consequences:"
    echo "   • No workspace isolation"
    echo "   • Main branch will be blocked"
    echo "   • Cannot work on multiple PRDs in parallel"
    echo ""
    echo "Continue with fallback? (yes/no)"
    read -r response

    if [ "$response" = "yes" ]; then
      echo ""
      echo "🔄 Falling back to git checkout..."
      git checkout "feature/PRD-007-oauth2-integration"
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "⚠️  FALLBACK MODE ACTIVE"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "🚨 You are on branch: feature/PRD-007-oauth2-integration"
      echo "🚨 Main branch is now BLOCKED"
      echo ""
      echo "Fix for next time: Upgrade Git to 2.25+"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    else
      echo "❌ Setup cancelled"
      exit 1
    fi
  else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ WORKTREE CREATION FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Fallback disabled in config (fallback_on_error=false)"
    echo ""
    echo "📖 OPTIONS:"
    echo "   1. Fix the issue above and retry"
    echo "   2. Set fallback_on_error=true in .claude/config.json"
    echo ""
    exit 1
  fi
fi
```

### Step 6: Auto-Assign to Current User

Detect GitHub username using cascade:

```bash
# Try 1: GitHub CLI
USERNAME=$(gh auth status 2>&1 | grep -oP 'Logged in to github.com as \K[^\s]+' || echo "")

# Try 2: Git config (fallback)
if [ -z "$USERNAME" ]; then
  USERNAME=$(git config user.name || echo "")
fi

# Try 3: Check cached config
if [ -z "$USERNAME" ] && [ -f .prd-config.json ]; then
  USERNAME=$(jq -r '.default_assignee // empty' .prd-config.json 2>/dev/null || echo "")
fi

# Try 4: Ask user and cache
if [ -z "$USERNAME" ]; then
  echo "💬 What's your GitHub username?"
  read USERNAME
  
  # Cache for future use
  echo "{\"default_assignee\": \"$USERNAME\"}" > .prd-config.json
  echo "✅ Saved to .prd-config.json for future PRDs"
fi
```

Update PRD metadata by adding/updating these fields:
```markdown
**Assignee**: @$USERNAME
**Assigned**: $(date +%Y-%m-%d)
```

### Step 7: Move PRD to Ready

**Important**: `/setup-prd` moves Draft → Ready (NOT In-Progress)

```bash
# Move from draft to ready
mv product/prds/01-draft/PRD-007-oauth2-integration.md \
   product/prds/02-ready/PRD-007-oauth2-integration.md
```

If PRD is already in Ready, skip the move (idempotent):
```bash
if [ -f product/prds/02-ready/PRD-007-oauth2-integration.md ]; then
  echo "ℹ️  PRD already in Ready, skipping move"
fi
```

Update PRD status field:
```markdown
**Status**: Ready for Development
**Branch**: feature/PRD-007-oauth2-integration
**Assignee**: @yassinello
**Setup Date**: 2025-10-28
```

### Step 8: Update WORK_PLAN.md

Move PRD from draft to ready section:
```markdown
## Ready for Development (1 PRD)
| PRD ID | Feature | Owner | Branch |
|--------|---------|-------|--------|
| PRD-007 | OAuth2 Integration | @yassinello | feature/PRD-007-oauth2-integration |
```

### Step 9: Provide Next Steps

```markdown
🌳 **Development Environment Ready**

📂 Worktree: worktrees/prd-007-oauth2-integration/
🌿 Branch: feature/PRD-007-oauth2-integration
📄 PRD: product/prds/02-ready/PRD-007-oauth2-integration.md
👤 Assignee: @yassinello

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps**:
1. cd worktrees/prd-007-oauth2-integration/ (if using worktree)
2. /review-prd PRD-007 (optional, refine the PRD)
3. /code-prd PRD-007 (start guided implementation)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Main branch is now free** for other work!

💡 **Parallel Workflow Tip**:
Open a new Cursor window in the worktree directory:
  code worktrees/prd-007-oauth2-integration/

This allows you to:
- Work on PRD-007 in one Cursor instance
- Continue other work on Main in another instance
## Configuration

Respects prd_workflow configuration:
```json
{
  "prd_workflow": {
    "branch_naming": {
      "prefix": "feature",
      "separator": "/",
      "pattern": "{prefix}/{prd_id_prefix}-{prd_number}-{slug}"
    },
    "worktree": {
      "enabled": true,
      "base_path": "worktrees"
    },
    "allow_draft_checkout": true
  }
}
```

## Options

```bash
# Interactive
/setup-prd

# Specify PRD
/setup-prd PRD-007

# Force draft (skip warning)
/setup-prd PRD-007 --force
```

## Emergency Override (Hidden)

**Only for system limitations or testing** - not supported for production use:

```bash
# Bypass worktree enforcement (use git checkout instead)
FORCE_NO_WORKTREE=1 /setup-prd PRD-007
```

This will:
- Skip worktree creation entirely
- Use plain `git checkout` on the feature branch
- Block your main branch (no parallel work possible)
- Not be recommended or supported

⚠️  Use only when:
- Testing the plugin without worktree support
- System has filesystem limitations
- Temporary workaround for urgent fixes

**Recommended instead**: Set `fallback_on_error=true` in config for automatic fallback with proper warnings.

## Error Handling

**PRD already in progress**:
```markdown
⚠️ PRD-007 is already in progress

Branch: feature/PRD-007-oauth2-integration
Worktree: worktrees/prd-007-oauth2-integration/

Options:
1. Switch to existing branch
2. Create new branch (PRD-007-v2)
3. Cancel

Choose: (1-3)
```

**Git not clean**:
```markdown
❌ Git working directory not clean

Uncommitted changes detected. Please:
1. Commit changes
2. Stash changes
3. Or resolve conflicts

Then try again.
```

## Best Practices

- ✅ **Worktrees enforced by default** - Automatic isolation, parallel workflow enabled
- ✅ **Create branch even for drafts** - Enables review on feature branch
- ✅ **Review on feature branch** - Keeps Main free
- ✅ **Open separate editor instance** - One Cursor/VSCode window per feature
- ✅ **Auto-dependency installation** - Enable in config for faster setup
- ⚠️ **Git 2.25+ required** - Upgrade if you see version errors
- ⚠️ **Don't forget to review** - If starting from draft

## Integration

Works seamlessly with:
- /create-prd - Creates draft PRDs
- /review-prd - Review on feature branch
- /work-prd - Guided development
- Git worktrees - Parallel feature development

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 0.3.1
Requires: Git 2.25+ (enforced)
