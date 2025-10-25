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

## Workflow

### Step 1: Describe Change

```markdown
What are you shipping?

Example: "Fix dark mode toggle on iOS Safari"

> [User input]
```

### Step 2: Quick Analysis

AI analyzes and shows plan:
```markdown
Quick Ship: Fix dark mode toggle on iOS Safari

Detected Type: Bug Fix
Estimated Time: 1 hour
Risk Level: Low

Implementation Plan:
1. Root cause: CSS variables not supported in iOS <15
2. Solution: Add fallback using media queries
3. Files: src/styles/theme.css, src/components/ThemeToggle.tsx
4. Testing: iOS Safari 14.5+

Proceed? (y/n/adjust)
```

### Step 3: Create Branch and Log

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

### Step 4: Guided Implementation

AI guides through implementation with code examples

### Step 5: Test and Commit

```bash
# Run tests
npm test

# Smart commit
/smart-commit

# Or manual:
git add .
git commit -m "fix(ui): Add iOS Safari fallback for dark mode toggle"
```

### Step 6: Create PR

```bash
# Auto-create PR
/smart-pr

# PR includes:
- Problem/Solution from log
- Files changed
- Testing checklist
```

### Step 7: Auto-Merge

If all checks pass:
```markdown
Tests: PASSING
Security: PASSED
Linting: PASSED

Auto-merging to main...

MERGED
Deployed to production

Cleanup...
- Deleted branch: quickship/fix-dark-mode-ios
- Updated log with completion time

Quick Ship Complete!
Duration: 47 minutes
```

### Step 8: Update Log

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

## Options

```bash
# Interactive
/quick-ship

# With description
/quick-ship "Fix login button alignment"

# No auto-merge
/quick-ship "Risky change" --manual
```

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
