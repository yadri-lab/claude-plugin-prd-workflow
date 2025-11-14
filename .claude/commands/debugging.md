---
name: debugging
description: Structured debugging session with team knowledge capture
category: Development Tools
version: 0.4.4
---

# Debugging Command

Fast, systematic debugging with hypothesis testing and team knowledge capture, with optional worktree isolation.

## Purpose

Transform chaotic debugging into efficient investigation with:
- Quick triage and pattern recognition
- Known issues search before reinventing solutions
- Hypothesis-driven testing
- Team knowledge documentation

**NEW in v0.4.4**: Automatic context detection - run from Main OR from worktree directly!
**v0.4.3**: Support for worktree isolation with `--worktree` flag for debugging sessions requiring code modifications.

## Context Detection (Auto)

The `/debugging` command **automatically detects** where you run it from:

### From Main Repository
```bash
# Working directory: ~/Documents/watchora
$ /debugging "Check API timeout"
→ Behavior: Read-only investigation on Main (default)
→ Optional: Add --worktree for code modifications
```

### From Debug Worktree
```bash
# Working directory: ~/Documents/watchora/worktrees/debug
$ /debugging "Check API timeout"
→ Behavior: Automatically uses worktree (no --worktree needed!)
→ Syncs, locks, creates branch, works in current directory
```

**Key Point**: If you have a dedicated Cursor window open on `worktrees/debug/`, you can use `/debugging` directly from there!

## Usage

```bash
# From Main: Investigate on Main (read-only, quick)
/debugging "Check why API returns 500"

# From Main: With worktree isolation (modifications needed)
/debugging "Memory leak in WebSocket handler" --worktree

# From Worktree: Auto-detects worktree context
cd worktrees/debug/
/debugging "Memory leak issue"  # Automatically uses worktree!

# Manage active session (works from anywhere)
/debugging --resolve          # Complete and document
/debugging --abort            # Cancel session
/debugging --status           # Show current status
/debugging --pause            # Pause session
/debugging --resume           # Resume paused session

# Migrate from Main to worktree
/debugging --to-worktree      # Move current session to worktree

# List past sessions
/debugging --list             # Show all debug sessions
```

## Options

| Option | Description |
|--------|-------------|
| `--worktree` | Use debug worktree for isolation |
| `--to-worktree` | Migrate current session from Main to worktree |
| `--resolve` | Resolve session (document + cleanup) |
| `--abort` | Abort session without documenting |
| `--status` | Show current session status |
| `--pause` | Pause session and save state |
| `--resume` | Resume paused session |
| `--list` | List all past debug sessions |

## Workflow

### 1. Quick Triage (30 seconds)

**Assess immediately**:
- Symptom description
- Environment (production/staging/dev/all)
- Severity (revenue impact, user impact, scope)
- Initial observations

**Auto-detect red flags**:
- "production only" → env/config difference
- "after deployment" → migration/change issue
- "intermittent" → race condition/timing
- "specific users" → data/permission issue

### 2. Known Issues Check (2 min)

**Web search** for existing solutions:
- Error message + library/framework name
- GitHub issues in relevant repos
- Stack Overflow matches
- Release notes if recent upgrade

**If found**: Link solution, adapt, skip investigation.

### 3. Quick Wins (5 min)

Test obvious fixes before deep dive:
- Restart service/clear cache
- Check recent changes (git log)
- Verify environment variables
- Check dependency versions
- Review recent deployments

## Workflow: Default (Main)

### Step 1: Start Investigation on Main

```bash
$ /debugging "OAuth timeout in production"

🔍 Debugging on Main (read-only investigation)

📝 Session: .prds/debug-sessions/2025-01-13-oauth-timeout-production.md

💡 On Main - for read-only investigation
   Use --worktree if you need to make changes
```

### Step 2: Investigation

- Read code
- Check logs
- Analyze stack traces
- Form hypotheses
- No modifications (read-only)

### Step 3: Resolve

```bash
$ /debugging --resolve

💬 Resolution status?
1. Resolved with fix → Create PR (requires worktree)
2. Resolved without fix (config/data issue) → Document only
3. Workaround → Document + TODO
4. Not resolved → Save state for later

Choose: 2

# If option 2 (no fix needed):
✅ Documented in .prds/debug-sessions/2025-01-13-oauth-timeout-production.md

Root cause: Redis session TTL too short in production config
Solution: Updated production config (no code changes)

Session closed.
```

## Workflow: With Worktree (from Main)

### Step 1: Start Session in Worktree

```bash
$ /debugging "Memory leak in WebSocket handler" --worktree

🔍 Checking worktree debug/...

# AUTO-SYNC (Intelligent)
🔄 Syncing worktree (5 commits behind)...

Recent changes:
  - a3f2c1d fix: WebSocket cleanup
  - 8d4e2a9 feat: Connection pooling
  - 1c8f3b2 refactor: Event handlers

✅ Synced with main

# START SESSION
✅ Started in worktrees/debug/
📝 Branch: debug/memory-leak-websocket
📄 Session: .prds/debug-sessions/2025-01-13-memory-leak-websocket.md
🔒 Locked worktree (one session at a time)

💻 Open in new window: code worktrees/debug/
```

**Auto-sync thresholds** (same as /ship):
- 0 commits: ✅ No sync needed
- 1-10 commits: 🔄 Silent auto-sync
- 10-50 commits: ⚠️ Propose sync with preview
- 50+ commits: ❌ Force sync (required)

### Step 2: Investigation with Modifications

Work in `worktrees/debug/`:
- Reproduce bug
- Test hypotheses
- Add debug logging
- Experimental fixes
- Complete isolation

### Step 3: Resolve with Fix

```bash
$ /debugging --resolve

💬 Resolution status?
1. Resolved with fix → Create PR
2. Resolved without fix → Document only
3. Workaround → Document + TODO
4. Not resolved → Save state

Choose: 1

# Fix found - create PR
✅ Committed fix
📤 PR #236: fix: Memory leak in WebSocket close handler
📝 Updated session doc:
   Root cause: Event listeners not cleaned up
   Solution: Added cleanup in close handler
   Prevention: Added tests for cleanup

# AUTO-CLEANUP
🔄 Returning to parking branch...
🧹 Deleted branch debug/memory-leak-websocket
🔄 Syncing with main...
✅ Worktree ready for next session
🔓 Unlocked worktree

↩️  Returned to Main
```

## Workflow: From Worktree Directly (NEW in v0.4.4)

### Setup: Open Cursor Window on Worktree

```bash
# One-time setup: Open dedicated Cursor window
cd ~/Documents/watchora/worktrees/debug/
code .  # Opens Cursor in worktree directory
```

### Step 1: Start Session (from Worktree)

```bash
# You're already in worktrees/debug/
$ pwd
~/Documents/watchora/worktrees/debug

# Run /debugging directly - no --worktree flag needed!
$ /debugging "Memory leak in WebSocket handler"

🔍 Detected: Running from worktree debug/
🎯 Auto-enabling worktree mode

# AUTO-SYNC (Intelligent)
🔄 Checking sync status...
✅ Synced with main (or auto-sync if needed)

# START SESSION
✅ Started in current directory
📝 Branch: debug/memory-leak-websocket
📄 Session: .prds/debug-sessions/2025-01-14-memory-leak-websocket.md
🔒 Locked worktree (one session at a time)

💡 Working in worktree - full debugging power!
```

### Step 2: Investigation (Same Directory)

You work in the **same directory** where you launched `/debugging`:
- Already in `worktrees/debug/`
- Add debug logging
- Reproduce bugs
- Test hypotheses
- All your tools work normally

### Step 3: Resolve (from Worktree)

```bash
# Still in worktrees/debug/
$ /debugging --resolve

💬 Resolution status?
1. Resolved with fix → Create PR
2. Resolved without fix → Document only
3. Workaround → Document + TODO
4. Not resolved → Save state

Choose: 1

# Fix found - create PR
✅ Committed fix
📤 PR #237: fix: Memory leak in WebSocket close handler
📝 Updated session doc

# AUTO-CLEANUP
🔄 Returning to parking branch...
🧹 Deleted branch debug/memory-leak-websocket
🔄 Syncing with main...
✅ Worktree ready for next session
🔓 Unlocked worktree

📍 Still in: worktrees/debug/ (ready for next session)
```

**Advantage**: You stay in the same Cursor window the entire time!

## Collision Handling

**One session at a time** in debug worktree:

```bash
$ /debugging "Another issue" --worktree

❌ Debug session already in progress in worktrees/debug/

Current session: debug/memory-leak-websocket
Started: 45 minutes ago
Files: 5 modified

⚠️  Only ONE debug session at a time in debug worktree

Options:
1. Finish current session: /debugging --resolve
2. Investigate on Main instead: /debugging "Another issue"
3. Abort current session: /debugging --abort

💡 For quick investigations, use Main:
  /debugging "Another issue"

Choose: _
```

## Migration: Main → Worktree

Started investigation on Main but need to make changes:

```bash
# Investigating on Main (read-only)...
# Found the bug, need to test a fix

$ /debugging --to-worktree

🔄 Migrating to worktree...

# Process:
1. ✅ Create session snapshot
2. ✅ Setup worktree debug/
   Auto-sync if needed
3. ✅ Create debug branch
   cd worktrees/debug/
   git checkout -b debug/issue-name
4. ✅ Copy session doc
   Update with worktree context
5. ✅ Continue in worktree
   💻 Open: code worktrees/debug/

Migration complete!
Continue debugging in worktrees/debug/
```

## Session Documentation

### Session File Format

`.prds/debug-sessions/YYYY-MM-DD-{issue-slug}.md`:

```markdown
# OAuth Timeout in Production

**Date**: 2025-01-13
**Severity**: High
**Status**: Resolved
**Location**: Main (read-only)

## Symptom

OAuth flow times out in production but works in staging.
100% of signup attempts failing.

## Investigation

### Hypothesis 1: Session TTL mismatch
- Redis session expires (30s) before OAuth callback (~45s avg)
- ✅ CONFIRMED via logs

### Hypothesis 2: Network latency
- ❌ DISPROVED - same timeout in different regions

## Root Cause

Session TTL in production Redis is 30 seconds.
OAuth callback takes 45 seconds average.
Session expires before callback completes.

## Solution

Updated production Redis config: session TTL 5 minutes
No code changes needed.

## Prevention

- Add monitoring for session expiration rates
- Add alert if OAuth callback > 4 minutes
- Document session TTL requirements

## References

- Production config: config/production.yaml
- Similar issue: https://stackoverflow.com/questions/...
- Redis docs: https://redis.io/docs/...

## Resolution

✅ Config updated in production
✅ Monitoring added
✅ Team notified
```

### Status Check

```bash
$ /debugging --status

📊 Current Debug Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: worktrees/debug/
📝 Branch: debug/memory-leak-websocket
📄 Session: 2025-01-13-memory-leak-websocket.md
⏱️  Started: 45 minutes ago
🔍 Status: Investigation

Progress:
  - Hypotheses tested: 3
  - Root cause: Identified
  - Fix: In progress
  - Files modified: 5

Recent activity:
  - ✅ Reproduced leak
  - ✅ Identified event listener issue
  - 🔨 Testing fix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actions:
  - /debugging --resolve (complete)
  - /debugging --pause (save for later)
  - /debugging --abort (cancel)
```

## Pause & Resume

### Pause Session

```bash
$ /debugging --pause

💾 Pausing debug session...

✅ Committed WIP state
📝 Updated session doc (status: paused)
🔄 Returned to parking branch

Session paused. Resume with: /debugging --resume
```

### Resume Session

```bash
$ /debugging --resume

📋 Paused sessions:

1. debug/memory-leak-websocket
   Started: 3 hours ago
   Status: Root cause identified, testing fix
   Files: 5 modified

2. debug/cache-invalidation
   Started: 2 days ago
   Status: Hypothesis testing
   Files: 2 modified

Resume which session? (1-2): 1

🔄 Resuming session...
✅ Checked out branch: debug/memory-leak-websocket
📄 Loaded session doc
📊 Session state restored

Continue debugging!
```

## List Past Sessions

```bash
$ /debugging --list

📚 Debug Sessions History
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recent** (Last 7 days):

✅ 2025-01-13 - OAuth timeout production (Resolved)
   Root cause: Session TTL config
   No code changes

✅ 2025-01-12 - API 500 errors (Resolved)
   Root cause: Database connection pool
   PR #234 merged

🔄 2025-01-11 - Cache invalidation (In Progress)
   Status: Testing hypothesis 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Older** (> 7 days):

✅ 2025-01-08 - Memory leak WebSocket (Resolved)
   PR #230 merged

✅ 2025-01-05 - CORS errors (Resolved)
   Config fix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total sessions: 12
Resolved: 10
In progress: 1
Paused: 1

💡 View session: cat .prds/debug-sessions/<filename>
```

## Principles

**Speed over perfection**:
- Start investigating immediately
- Test quick wins before deep analysis
- Document as you go (not at the end)

**Hypothesis-driven**:
- Form theories based on evidence
- Test one thing at a time
- Eliminate possibilities systematically

**Knowledge sharing**:
- Future you/team will face similar issues
- Searchable format (grep-able keywords)
- Links to code, not just descriptions

**Confidence levels**:
- 🟢 High confidence: Root cause proven, fix validated
- 🟡 Medium confidence: Likely cause, fix plausible
- 🔴 Low confidence: Workaround only, need monitoring

## Configuration

Respects `.claude/config-worktrees.json`:

```json
{
  "worktrees": {
    "debug": {
      "path": "worktrees/debug",
      "branch_parking": "debug",
      "session_dir": ".prds/debug-sessions"
    }
  },
  "sync": {
    "strategy": "intelligent",
    "auto_sync_on_start": true
  }
}
```

## Examples

### Example 1: Quick Investigation on Main

```bash
$ /debugging "Check why API returns 500"

# Read-only investigation
# Found issue: missing env var
# No code changes

$ /debugging --resolve
# Documented, session closed
```

### Example 2: Investigation Needs Code Changes (from Main)

```bash
$ /debugging "Performance degradation" --worktree

# Isolated investigation
# Profiling, testing
# Found bottleneck, implemented fix

$ /debugging --resolve
# PR created, session documented
```

### Example 3: Investigation from Worktree - NEW!

```bash
# Cursor window open on worktrees/debug/
$ pwd
~/Documents/watchora/worktrees/debug

$ /debugging "Performance degradation"

# Auto-detects worktree context
# No --worktree flag needed
# Works in current directory
```

### Example 4: Migration to Worktree

```bash
$ /debugging "Bug in production"

# Started on Main
# Found bug, need to test fix

$ /debugging --to-worktree

# Migrated to worktree
# Testing fix in isolation
```

### Example 5: Long Investigation with Pause

```bash
$ /debugging "Complex race condition" --worktree

# 2 hours of investigation
# Meeting interruption

$ /debugging --pause

# Later...
$ /debugging --resume
# Continue where left off
```

## Best Practices

### When to Use Main

✅ **Quick log checks**
✅ **Config verification**
✅ **Code reading**
✅ **No modifications needed**
✅ **< 30 minutes**

### When to Use Worktree

✅ **Need to add debug logging**
✅ **Testing hypotheses with code changes**
✅ **Reproducing bugs**
✅ **Experimental fixes**
✅ **> 30 minutes**
✅ **Want separate Cursor window**

### Tips

- 💡 Start on Main, migrate if changes needed
- 💡 Use worktree for "hard to reproduce" bugs
- 💡 Document as you investigate (don't wait)
- 💡 One session at a time = focus
- 💡 Search past sessions before investigating

## Integration

Works seamlessly with:
- `/worktree` - Manage debug worktree
- `/context` - Shows current session
- `/ship` - Same worktree patterns
- WebSearch - Auto-search known issues

---

**Version**: 0.4.4
**Plugin**: claude-prd-workflow v0.4.4
**Changes**:
- v0.4.4: Added automatic context detection - run from Main OR worktree directly
- v0.4.3: Added worktree support, intelligent sync, session management, collision handling
