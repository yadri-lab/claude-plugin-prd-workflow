---
description: Check PR status for current branch
---

# PR Check

Quick check for PRs associated with your current branch.

## Usage

```bash
bash .claude/scripts/pr-check.sh
```

## What it shows

- PR number and title (if exists)
- PR state (open, merged, closed)
- Direct URL to PR
- Suggestion to create PR if none exists

## Requirements

- GitHub CLI (`gh`) must be installed
- Repository must have GitHub remote configured

## When to use

- After pushing feature branch to check PR status
- Before running /complete-prd to verify PR exists
- Quick check during code review
