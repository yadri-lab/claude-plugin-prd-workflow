---
name: debugging
description: Structured debugging session with team knowledge capture
category: Development Tools
version: 0.4.2
---

# Debugging Command

Fast, systematic debugging with hypothesis testing and team knowledge capture.

## Purpose

Transform chaotic debugging into efficient investigation with:
- Quick triage and pattern recognition
- Known issues search before reinventing solutions
- Hypothesis-driven testing
- Team knowledge documentation

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

### 4. Investigation (Core)

**Codebase research**:
- Find relevant files (search error message, stack trace)
- Understand flow (trace from symptom to root)
- Identify change points (git blame suspicious areas)

**Hypothesis formation**:
- What changed? (code, config, data, dependencies)
- What's different? (env, load, timing, permissions)
- What could cause this? (list 3-5 hypotheses)

**Testing**:
- Prioritize by likelihood
- Test one hypothesis at a time
- Document results (proved/disproved)
- Iterate until root cause found

### 5. Solution & Validation

**Propose fix**:
- Root cause identified
- Solution approach
- Alternative approaches (if applicable)
- Risks and trade-offs

**Validation plan**:
- How to test the fix
- Regression prevention
- Monitoring/alerts to add

### 6. Knowledge Capture

**Create searchable record** in `.prds/debug-sessions/YYYY-MM-DD-{issue-slug}.md`:

```markdown
# {Issue Title}

**Date**: YYYY-MM-DD
**Severity**: High/Medium/Low
**Status**: Resolved/Mitigated/Workaround

## Symptom
{What users/team observed}

## Root Cause
{Technical explanation}

## Solution
{What fixed it}

## Prevention
{How to avoid in future}

## References
- Relevant files: {file paths}
- Related PRs: {links}
- External resources: {links}
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

```json
{
  "debugging": {
    "session_dir": ".prds/debug-sessions",
    "auto_web_search": true,
    "knowledge_capture": true
  }
}
```

## Success Criteria

- ✅ Root cause identified or strong hypothesis formed
- ✅ Solution proposed with confidence level
- ✅ Validation plan clear
- ✅ Knowledge captured for team
- ✅ Prevention strategy defined

## Example Output

```markdown
🐛 **OAuth State Parameter Invalid (Production Only)**

**Quick Triage**: High severity, blocks 100% signups, production-only

**Known Issues**: Found Stack Overflow - Redis session TTL mismatch

**Root Cause**: Session expires in Redis (30s) before OAuth callback (45s avg)

**Solution**: Increase session TTL to 5 minutes in production config

**Confidence**: 🟢 High (matches symptoms, proven in Stack Overflow)

**Validation**: Test OAuth flow, monitor session expiration metrics

**Knowledge**: Captured in .prds/debug-sessions/2025-01-11-oauth-state-timeout.md
```

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
