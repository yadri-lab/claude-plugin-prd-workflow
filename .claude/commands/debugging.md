---
name: debugging
description: Structured debugging session with team knowledge capture
category: Development Tools
version: 1.0.0
---

# Debugging Command

Structured debugging workflow that captures investigation process and builds team knowledge base.

## Purpose

Transform chaotic debugging into systematic investigation:
- **Structured investigation** with hypothesis testing
- **Root cause documentation** for team learning
- **Solution capture** with prevention strategies
- **Persistent record** in `.prds/thoughts/debugging/`

**Use case**: "Bug found - need to investigate and document for team"

---

## Workflow

### Step 1: Quick Start - Essential Info Only

**Lightweight initial capture** - Just the essentials to get started.

```markdown
🐛 **Debug Session Started**

You reported: "{{USER_INPUT}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**In 1-2 sentences, what's broken?**
> {{SHORT_DESCRIPTION}}

**Where** (file/function if known):
> {{LOCATION}} (or "Unknown")

**Environment** (dev/staging/prod):
> {{ENVIRONMENT}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's investigate systematically. I'll track each hypothesis we test.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 2: Hypothesis-Driven Investigation Loop

**THIS IS THE CORE** - Iterative hypothesis testing with detailed tracking.

#### Initial Hypotheses Brainstorm

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 BRAINSTORM: POSSIBLE CAUSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on "{{SYMPTOM}}", here are possible root causes:

**Hypothesis 1**: {{THEORY_1}}
- Likelihood: High / Medium / Low
- Quick to test: Yes / No

**Hypothesis 2**: {{THEORY_2}}
- Likelihood: High / Medium / Low
- Quick to test: Yes / No

**Hypothesis 3**: {{THEORY_3}}
- Likelihood: High / Medium / Low
- Quick to test: Yes / No

**Hypothesis 4**: {{THEORY_4}}
- Likelihood: High / Medium / Low
- Quick to test: Yes / No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Testing Order** (highest likelihood + easiest to test first):
1. Hypothesis {{N}} - {{THEORY}}
2. Hypothesis {{N}} - {{THEORY}}
3. ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### Hypothesis Testing Loop

For **each** hypothesis, create a detailed test record:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 HYPOTHESIS {{N}}: {{THEORY}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Started**: {{TIMESTAMP}}

**Theory**: {{DETAILED_EXPLANATION}}

**Why I think this**: {{REASONING}}
- Observation 1: {{WHAT_I_SAW}}
- Observation 2: {{WHAT_I_SAW}}
- Similar to: {{PAST_EXPERIENCE_OR_PATTERN}}

**If TRUE, I expect to see**:
- {{EXPECTED_EVIDENCE_1}}
- {{EXPECTED_EVIDENCE_2}}

**If FALSE, I expect to see**:
- {{DISPROVING_EVIDENCE_1}}
- {{DISPROVING_EVIDENCE_2}}

---

**Test Plan**:
1. {{WHAT_TO_CHECK_FIRST}}
   - Tool/Command: {{HOW}}
   - Expected result if hypothesis true: {{RESULT}}

2. {{WHAT_TO_CHECK_SECOND}}
   - Tool/Command: {{HOW}}
   - Expected result if hypothesis true: {{RESULT}}

---

**Execution Log**:

Test 1: {{WHAT_I_CHECKED}}
```bash
# Commands run
{{COMMAND_1}}
{{COMMAND_2}}
```

Output:
```
{{ACTUAL_OUTPUT}}
```

Observation: {{WHAT_THIS_MEANS}}

---

Test 2: {{WHAT_I_CHECKED}}
```bash
{{COMMAND}}
```

Output:
```
{{ACTUAL_OUTPUT}}
```

Observation: {{WHAT_THIS_MEANS}}

---

**Result**: ❌ Disproved | ✅ Confirmed | 🤔 Inconclusive

**Detailed Findings**:
{{WHAT_I_LEARNED_FROM_THIS_TEST}}

Key insights:
- {{INSIGHT_1}}
- {{INSIGHT_2}}

**Time Invested**: {{MINUTES}} minutes

**Next**: {{IF_DISPROVED_WHAT_NEXT}} / {{IF_CONFIRMED_WHAT_NEXT}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### After Each Hypothesis: Update Investigation State

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INVESTIGATION STATE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Hypotheses Tested**: {{N}}

**Status**:
- ❌ Hypothesis 1: {{THEORY}} - Disproved
- ❌ Hypothesis 2: {{THEORY}} - Disproved
- ✅ Hypothesis 3: {{THEORY}} - **CONFIRMED** ← Root cause found!
- ⏸️  Hypothesis 4: {{THEORY}} - Not tested yet

**What we now know**:
- {{LEARNED_FACT_1}}
- {{LEARNED_FACT_2}}
- {{LEARNED_FACT_3}}

**What we can rule out**:
- ❌ NOT a {{DISPROVED_THEORY}}
- ❌ NOT caused by {{DISPROVED_CAUSE}}

{{#if ROOT_CAUSE_FOUND}}
**Root Cause Identified**: {{THE_ACTUAL_PROBLEM}}

Proceeding to Step 3: Root Cause Analysis
{{else}}
**Still investigating...**

Next hypothesis to test: {{NEXT_THEORY}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3: Root Cause Analysis

Once root cause confirmed:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 HYPOTHESIS {{N}}: {{THEORY}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Reasoning**: {{WHY_THIS_THEORY}}

**Test Plan**: {{HOW_TO_VERIFY}}

**Commands/Steps to test**:
```bash
{{COMMANDS}}
```

Running tests...

**Result**: ❌ Disproved | ✅ Confirmed | 🤔 Inconclusive

**Findings**: {{WHAT_WE_LEARNED}}

**Time invested**: {{MINUTES}} minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test another hypothesis? (y/n)
> _
```

### Step 5: Root Cause Analysis

Once confirmed:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ROOT CAUSE IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What was actually wrong?**
{{DETAILED_EXPLANATION}}

**Category**:
[ ] Logic error
[ ] Race condition
[ ] Null/undefined handling
[ ] Type mismatch
[ ] Configuration issue
[ ] Dependency bug
[ ] Environment issue
[ ] Other: {{SPECIFY}}

**Why did this happen?**
**Primary cause**: {{IMMEDIATE_CAUSE}}

**Contributing factors**:
1. {{FACTOR1}}
2. {{FACTOR2}}

**When introduced**:
- Commit: {{SHA}} (if known)
- PR: {{LINK}} (if known)
- Date: {{DATE}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Implement Solution

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Fix approach**: {{APPROACH_NAME}}

**Why this fix**: {{RATIONALE}}

**Code changes**:

Before:
```{{LANGUAGE}}
{{BAD_CODE}}
```

After:
```{{LANGUAGE}}
{{FIXED_CODE}}
```

**Files modified**:
- `path/to/file1.ts` - Fixed {{WHAT}}
- `path/to/file2.ts` - Added validation for {{WHAT}}
- `path/to/test.ts` - Added regression test

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Verification

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Testing**:
- [x] Bug no longer reproduces locally
- [x] Regression test added and passing
- [x] All existing tests still pass
- [x] Manual testing in affected flows

**Code Review**:
- [ ] Code review requested
- [ ] Security implications reviewed
- [ ] Performance implications reviewed

**Deployment**:
- [ ] Deployed to staging
- [ ] Verified in staging
- [ ] Ready for production

**Time to fix**: {{HOURS}} hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 8: Prevention Strategy

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PREVENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How to avoid this in future?**

**Immediate actions**:
1. Add validation for {{CASE}}
   - Location: `path/to/file.ts`
   - Implementation: {{LOGIC}}

2. Update tests to cover {{SCENARIO}}
   - Test file: `path/to/test.ts`
   - Coverage: {{WHAT}}

3. Document {{EDGE_CASE}} in {{LOCATION}}
   - Type: README / inline comments
   - Warning: {{WHAT_TO_KNOW}}

**Systemic improvements**:
- [ ] Add linting rule to catch this pattern
- [ ] Update error handling guidelines
- [ ] Improve logging for similar issues
- [ ] Add monitoring/alerting

**Lessons learned**:
- Technical: {{LESSON1}}
- Process: {{LESSON2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 9: Impact Assessment

```markdown
📊 **Impact Assessment**

**User Impact**:
- Severity: Critical / High / Medium / Low
- Affected users: {{NUMBER}} or {{PERCENTAGE}}
- Data loss: Yes / No
- Workaround available: Yes / No

**Business Impact**:
- Revenue impact: {{IMPACT}}
- Reputation impact: {{IMPACT}}
- SLA breach: Yes / No

**Downtime**:
- Duration: {{TIME}} from discovery to fix
- Affected services: {{SERVICES}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 10: Save Debug Session

```bash
# Generate filename
DEBUG_ID=$(date +%Y%m%d-%H%M%S)
ISSUE_SLUG=$(echo "$ISSUE_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | cut -c1-50)
DEBUG_FILE=".prds/thoughts/debugging/${DEBUG_ID}-${ISSUE_SLUG}.md"

# Save using template
echo "✅ Debug session saved: $DEBUG_FILE"

# Link to PRD if applicable
if [ "$RELATED_PRD" != "Standalone" ]; then
  echo "🔗 Linked to PRD: $RELATED_PRD"
  # Add reference in PRD metadata
fi
```

---

## Output Example

```markdown
# Debug Session: OAuth Redirect Fails in Production

**Date**: 2025-01-02
**Debugger**: yassine
**Related PRD**: PRD-009
**Status**: 🟢 Resolved

## 🐛 Symptom
### What's Broken?
OAuth redirect fails after GitHub authorization in production only.

### Expected Behavior
After GitHub OAuth approval, user redirected to /dashboard

### Actual Behavior
User redirected to /error with "Invalid state parameter"

### Reproducibility
- [x] Always reproduces in production
- [ ] Never reproduces in development

## 📍 Context
**Location**:
- File: `src/auth/oauth.ts`
- Function: `validateOAuthCallback()`
- Lines: 45-67

**Environment**: Production only (not dev/staging)

## 🔬 Investigation Log

### Hypothesis 1: State parameter mismatch
**Reasoning**: Error mentions "invalid state" - could be session issue

**Test**: Check session storage in prod vs dev
```bash
# Production uses Redis, dev uses in-memory
cat .env.production | grep SESSION_
```

**Result**: ✅ Confirmed

**Findings**: Production Redis has 5-minute TTL, OAuth flow takes 6 minutes

### Hypothesis 2: [Disproved - skip for brevity]

## 💡 Root Cause
**What**: Redis session expires before OAuth callback completes

**Why**:
- Primary: TTL too short (5 min) for OAuth flow
- Contributing: Slow GitHub API responses (4-5 min average)

**When introduced**: PRD-007 (moved to Redis sessions)

## ✅ Solution
**Fix**: Increase session TTL to 15 minutes

Before:
```typescript
const sessionConfig = {
  store: new RedisStore({ client: redis }),
  cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}
```

After:
```typescript
const sessionConfig = {
  store: new RedisStore({ client: redis }),
  cookie: { maxAge: 15 * 60 * 1000 } // 15 minutes
}
```

**Files modified**:
- `src/auth/session.ts` - Increased TTL
- `tests/auth/oauth.test.ts` - Added timeout test

## 🛡️ Prevention
**Immediate**:
1. Add test for slow OAuth flows
2. Document minimum TTL in README
3. Add monitoring for OAuth timing

**Systemic**:
- Add alerting when OAuth > 10 minutes

**Lessons**:
- Environment differences matter (Redis vs in-memory)
- OAuth flows need generous timeouts

## 📊 Impact Assessment
**User Impact**: High (all OAuth users affected)
**Affected users**: 100% of new signups
**Downtime**: 2 hours (discovery to deploy)
```

---

## Integration

**With PRDs**:
- Debug sessions can reference PRD that introduced bug
- PRD validation reports can reference related debug sessions

**With Team**:
- Searchable knowledge base in `.prds/thoughts/debugging/`
- Similar bugs findable via grep/search
- New team members learn from past investigations

---

## Configuration

No special configuration needed. Uses:
- `context_engineering.thoughts_directory` from config
- Template: `product/templates/debug-template.md`

---

## Examples

**Bug investigation**:
```bash
/debugging "OAuth redirect fails in production"
```

**Performance issue**:
```bash
/debugging "Dashboard loads slowly for large datasets"
```

**Intermittent failure**:
```bash
/debugging "Webhook delivery fails randomly"
```

---

## Tips

- **Be systematic** - test one hypothesis at a time
- **Document failures** - disproved hypotheses teach us too
- **Time-box investigation** - set a limit before escalating
- **Share findings** - even if not fixed, document what you learned
- **Link to PRD** - helps trace regressions
- **Prevention matters** - how to avoid this in future?

---

## Related

- **When bug found**: Use `/debugging` to investigate
- **After fix**: Reference debug session in commit message
- **In PR**: Link debug session for context
- **Team onboarding**: Review past debug sessions

---

**Version**: 1.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Category**: Context Engineering
