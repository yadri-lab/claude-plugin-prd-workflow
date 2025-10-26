---
name: quick-ship
description: Fast-track small features without full PRD process
category: Git Workflow
---

# Quick Ship Command

Ship small features/fixes fast without full PRD overhead.

## Purpose

For small changes that don't need full PRD:
- Bug fixes
- Small UI tweaks
- Dependency updates
- Minor refactors
- Quick experiments

Creates minimal tracking log instead of full PRD.

## When to Use

Use Quick Ship for:
- Features < 4 hours
- Single developer work
- Clear scope, no unknowns
- Low risk changes

Use Full PRD for:
- Features > 1 day
- Multiple developers
- Unclear requirements
- High-risk changes
- Customer-facing features

## Workflow (Ultra-Simple - Option B)

### Step 1: Describe Change

```markdown
What are you shipping?

Example: "Fix dark mode toggle on iOS Safari"

> [User input]
```

### Step 2: AI Quick Analysis & Auto-Setup

AI analyzes in ONE step and auto-creates everything:

```markdown
🚀 Quick Ship: Fix dark mode toggle on iOS Safari

📊 Analysis:
  Type: Bug Fix
  Time: ~1 hour
  Risk: Low
  Files: src/styles/theme.css, src/components/ThemeToggle.tsx

💡 Plan:
  1. Root cause: CSS variables not supported in iOS <15
  2. Solution: Add fallback using media queries
  3. Testing: iOS Safari 14.5+

✅ Auto-created:
  - Branch: quickship/fix-dark-mode-ios
  - Log: .claude/quick-ships/2025-10-26-dark-mode-ios.md

Ready to code! Here's what to do next...
```

**No user confirmation needed** - AI is confident, just go!

### Step 3: Guided Implementation (Inline)

```bash
# Create quick-ship branch
git checkout -b quickship/fix-dark-mode-ios

# Create minimal log
mkdir -p .claude/quick-ships/
cat > .claude/quick-ships/2025-10-26-dark-mode-ios.md
```

Log format:
```markdown
# Fix: Dark Mode Toggle on iOS Safari

**Date**: 2025-10-26
**Type**: Bug Fix
**Estimated Time**: 1 hour

## Problem
Dark mode toggle not working on iOS Safari <15

## Solution
Add CSS fallback using media queries instead of CSS variables

## Files
- src/styles/theme.css
- src/components/ThemeToggle.tsx

## Testing Plan
- iOS Safari 14.5
- iOS Safari 15+
- Chrome/Firefox (regression check)
```

AI provides inline guidance:
```markdown
📝 Task 1/3: Update CSS fallback

Edit: src/styles/theme.css

Add this code:
```css
/* Fallback for iOS <15 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}
```

When done, type: next
```

### Step 4: Auto-Commit & Auto-PR (Integrated)

**No separate commands needed!** When user finishes coding:

```markdown
✅ Changes detected in src/styles/theme.css, src/components/ThemeToggle.tsx

🔍 Running checks:
  - Linting... ✅
  - Tests... ✅
  - Security... ✅

🤖 Auto-committing:
  Message: "fix(ui): Add iOS Safari fallback for dark mode toggle"

📤 Auto-creating PR #89:
  Title: "Fix: Dark mode toggle on iOS Safari"
  Description: Auto-generated from quick-ship log

🔀 PR checks passing... Auto-merging to main...
```

**All automatic - zero manual steps!**

### Step 5: Auto-Completion

```markdown
✅ MERGED to main
🚀 Deployed to production

🧹 Auto-cleanup:
  - Branch deleted: quickship/fix-dark-mode-ios
  - Log updated with metrics

🎉 Quick Ship Complete!
  Duration: 47 min (estimated: 1h)
  Files: 2 changed (+20 -5)
  Tests: +2% coverage
```

### Step 6: Updated Log (Automatic)

```markdown
# Fix: Dark Mode Toggle on iOS Safari

**Date**: 2025-10-26  
**Duration**: 47 minutes (estimated: 1 hour)
**PR**: #89 (auto-merged)

## Problem  
Dark mode toggle not working on iOS Safari <15

## Solution
Added CSS fallback using media queries

## Files Changed
- src/styles/theme.css (+12 -3)
- src/components/ThemeToggle.tsx (+8 -2)

## Testing
- iOS Safari 14.5: PASS
- iOS Safari 15+: PASS
- Chrome/Firefox: PASS (no regression)

## Metrics
- Build size: +0.2KB
- Performance: No impact
- Test coverage: +2%

STATUS: COMPLETE
```

## Configuration

```json
{
  "prd_workflow": {
    "quick_ship": {
      "enabled": true,
      "auto_merge": true,
      "log_directory": ".claude/quick-ships",
      "branch_prefix": "quickship",
      "max_estimated_time": 4
    }
  }
}
```

## Usage Examples

```bash
# Interactive (asks for description)
/quick-ship

# Direct (one command, done)
/quick-ship "Fix login button alignment"

# Risky change (manual merge)
/quick-ship "Refactor auth module" --manual-merge
```

## Key Features (Option B - Ultra Simple)

✅ **One command, zero friction**
- No separate /smart-commit or /smart-pr needed
- Everything automated from description to deployment

✅ **Intelligent auto-detection**
- AI detects files to change
- AI generates commit message
- AI creates PR description
- AI decides safe to auto-merge

✅ **Inline guidance**
- Code examples shown directly
- Task-by-task breakdown
- No context switching

✅ **Safe defaults**
- Auto-merge only if all checks pass
- Manual flag for risky changes
- Complete rollback if issues detected

## Quick Ships vs PRDs

| Aspect | Quick Ship | Full PRD |
|--------|-----------|----------|
| Duration | <4 hours | >1 day |
| Documentation | Minimal log | Full PRD |
| Review | Auto (AI) | Manual + AI |
| Tracking | Log file | PRD file |
| Workflow | Single branch | Worktree |
| Best for | Fixes, tweaks | Features |

## Best Practices

- Use for truly small changes
- Still write tests
- Update log after completion
- Review logs monthly for patterns

---

Plugin: claude-prd-workflow
Category: Git Workflow
Version: 2.2.0
Requires: Git 2.0+
