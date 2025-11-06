---
description: Archive old session files to keep workspace clean
---

# Session Cleanup

Archive old session context files that are no longer needed.

## Usage

```bash
bash .claude/scripts/session-clean.sh
```

## What it does

- Checks age of current session file
- Archives sessions older than 7 days
- Keeps workspace organized
- Moves old sessions to `.claude/archives/sessions/`

## When to use

- Weekly cleanup routine
- When starting a new project phase
- If Claude Code seems confused by stale context
- Before important PRD work to start fresh

## Safe to run

This script only archives (moves) files, never deletes them. You can always recover old sessions from the archives directory.
