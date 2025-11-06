---
name: debugging
description: Structured debugging session with team knowledge capture
category: Development Tools
version: 2.0.0
---

# Debugging Command

Fast, systematic debugging with hypothesis testing and team knowledge capture.

## Purpose

Transform chaotic debugging into efficient investigation:
- **Quick triage** with red flags detection
- **Known issues check** via web search
- **Quick wins** before deep investigation
- **Solution confidence** with alternatives
- **Team knowledge** in searchable format

**Use case**: "Bug found - investigate fast and document for team"

---

## Workflow

### Step 1: Quick Triage (30 seconds)

**Immediate assessment** - No questions, just start investigating.

```markdown
🐛 **Debug Session Started**

You reported: "{{USER_INPUT}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 QUICK TRIAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Symptom**: OAuth redirect fails in production with "Invalid state parameter"

**Environment**: Production only (not dev/staging)

**Severity**: 🔴 High
- ❌ Blocks all new user signups
- 💰 Revenue impact: High
- 👥 Affected users: 100%

**Initial observation**:
- Works fine in development
- Started happening after Redis migration (PRD-007)
- Error message: "Invalid state parameter"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Red Flags Detection (Automatic)

```markdown
🚩 **Red Flags Detected**

Based on "fails in production only":
- ⚠️  **Environment-specific** issue (config/infra difference)
- ⚠️  Possible **secrets/env vars** mismatch
- ⚠️  Could be **infrastructure** (Redis, DB, external APIs)
- ⚠️  **Timing differences** (prod load vs dev)

Based on "OAuth redirect fails" + "Invalid state":
- ⚠️  **Session/state management** issue (most likely)
- ⚠️  CSRF token validation failure
- ⚠️  Redirect URI mismatch
- ⚠️  **State parameter expiration** (timing issue)

Based on "after Redis migration":
- ⚠️  **Session storage** changed (in-memory → Redis)
- ⚠️  TTL/expiration settings
- ⚠️  Serialization issues

**Pattern match**: Environment-specific session timeout (common OAuth bug)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 2: Known Issues Check (Web Search)

**Before reinventing the wheel** - Check if it's a known problem.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 KNOWN ISSUES CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Searching: "OAuth invalid state parameter production Redis session"

**Found**:

📄 **Stack Overflow** (42 upvotes)
- Title: "OAuth state parameter invalid after production deploy"
- Answer: "Check session TTL - OAuth flow takes 2-5min, default session = 5min"
- Link: [stackoverflow.com/...](https://...)

🐛 **GitHub Issue** (redis-session #234)
- Title: "Session expires during long OAuth flows"
- Solution: Increase session maxAge to 15min minimum
- Status: Closed (fixed in v2.1.0)

📝 **Blog Post** (auth0.com)
- Title: "Common OAuth Pitfalls in Production"
- Issue #3: "Session timeout during OAuth callback"
- Recommendation: Set session TTL > longest OAuth flow + 5min buffer

💡 **Quick Insight**:
This is a **known pattern** - session expires before OAuth completes.
Likely cause: Redis TTL too short for OAuth flow duration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3: Quick Wins (< 5 minutes)

**Try obvious checks first** - Often faster than hypothesis testing.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 QUICK WINS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Win #1: Check Logs** (might already show the issue)

```bash
# Production logs
tail -100 logs/production.log | grep -i "oauth\|session\|state"
```

Output:
```
[ERROR] Session not found for state: abc123
[ERROR] OAuth callback failed: Invalid state parameter
[WARN]  Session expired: user_session_xyz (age: 6m 12s)
```

**Observation**:
- ✅ **CLUE**: Sessions expiring (~6min)
- ✅ **CLUE**: "Session not found" errors
- 💡 Sessions lasting longer than expected

---

**Quick Win #2: Compare Configs** (prod vs dev)

```bash
diff .env.production .env.development | grep -i session
```

Output:
```diff
- SESSION_TTL=300000    # 5 minutes (production)
+ SESSION_TTL=900000    # 15 minutes (development)
```

**Observation**:
- ✅ **SMOKING GUN**: SESSION_TTL is 5min in prod, 15min in dev
- 💡 OAuth flow takes 6min average (from logs)
- 🎯 **Root cause likely found!**

---

**Quick Win #3: Recent Changes** (git blame)

```bash
git log --oneline --since="2 weeks ago" -- src/auth/
git show HEAD:src/auth/session.ts | grep -A5 maxAge
```

Output:
```
commit abc123 - PRD-007: Migrate to Redis sessions
- const maxAge = 5 * 60 * 1000; // Changed from 15min to 5min
```

**Observation**:
- ✅ **CONFIRMED**: TTL changed in PRD-007
- 💡 Dev config not updated to match prod
- 🎯 **Root cause verified**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Quick Wins Success!**

Found root cause in **3 minutes** without deep investigation:
- Session TTL = 5min in production
- OAuth flow = 6min average duration
- Session expires before OAuth callback completes

Proceeding to solution analysis...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4: Investigation Paths (if Quick Wins fail)

**Only if quick wins don't find the issue** - Systematic hypothesis testing.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ INVESTIGATION PATHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Since quick wins didn't solve it, let's investigate systematically.

**Path A: Session Management** (Likelihood: 🔴 High, Effort: 🟢 Low)
├─ H1: Redis session expires too quickly
│  Test: Check TTL in Redis vs OAuth flow duration
│  Expected: TTL < flow duration
│
├─ H2: Session cookie not persisting across redirects
│  Test: Inspect cookies during OAuth flow (browser DevTools)
│  Expected: Cookie missing or changed
│
└─ H3: State parameter not stored correctly in Redis
   Test: Redis MONITOR during OAuth flow
   Expected: State key not found or expired

**Path B: Configuration** (Likelihood: 🟡 Medium, Effort: 🟢 Low)
├─ H4: OAuth redirect URI mismatch in production
│  Test: Compare GitHub app settings vs .env.production
│  Expected: URI mismatch
│
└─ H5: OAuth client secret incorrect
   Test: Check GitHub app credentials vs env vars
   Expected: Secret mismatch or expired

**Path C: External Services** (Likelihood: 🟢 Low, Effort: 🟡 Medium)
├─ H6: GitHub API slow response causing timeout
│  Test: Measure API response times in production
│  Expected: >5min response time
│
└─ H7: Network timeout between prod server and GitHub
   Test: Check network logs, ping times
   Expected: Packet loss or high latency

**Recommended order**: Path A → Path B → Path C

Starting with Path A (highest likelihood, easiest to test)...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Hypothesis Testing (Detailed)

For each hypothesis that needs testing:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 HYPOTHESIS A1: Redis Session Expires Too Quickly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Started**: 14:32

**Theory**:
Session TTL is shorter than OAuth flow duration, causing state parameter to be lost.

**Why I think this**:
- Logs show "Session not found" errors
- OAuth callback happens 6min after initiation
- Redis default TTL might be too short
- Similar pattern in Stack Overflow post

**If TRUE, I expect to see**:
- Redis TTL < 6 minutes
- Session key missing when callback arrives
- Different behavior in dev (longer TTL)

**If FALSE, I expect to see**:
- Redis TTL > 6 minutes
- Session key still exists when callback arrives
- Same failure in dev environment

---

**Test Plan**:

1. Check current Redis TTL setting
   ```bash
   redis-cli CONFIG GET maxmemory-policy
   grep -r "maxAge\|ttl" src/auth/
   ```

2. Measure actual OAuth flow duration
   ```bash
   # Add timing logs
   console.log('[OAuth] Flow started:', Date.now())
   console.log('[OAuth] Callback received:', Date.now())
   ```

3. Monitor Redis session during OAuth flow
   ```bash
   redis-cli MONITOR | grep session
   ```

---

**Execution Log**:

**Test 1**: Check Redis TTL
```bash
cat src/auth/session.ts | grep maxAge
```

Output:
```typescript
cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
```

**Observation**: TTL is 5 minutes (300 seconds)

---

**Test 2**: Measure OAuth flow duration
```bash
tail -f logs/production.log | grep "OAuth"
```

Output:
```
[14:30:00] OAuth flow started
[14:36:12] OAuth callback received
# Duration: 6 minutes 12 seconds
```

**Observation**: Flow takes 6min 12s, exceeds 5min TTL ✅

---

**Test 3**: Verify session expiration
```bash
redis-cli
> TTL session:abc123
(integer) -2  # Key expired
```

**Observation**: Session key expired before callback ✅

---

**Result**: ✅ **CONFIRMED**

**Detailed Findings**:
- Session TTL: 5 minutes
- OAuth flow: 6+ minutes average
- Session expires before callback completes
- State parameter lost → "Invalid state" error

**Key insights**:
- Production uses shorter TTL than development
- GitHub OAuth API response is slow (4-5min)
- No buffer time in TTL setting

**Time Invested**: 8 minutes

**Next**: Root cause confirmed, proceed to solution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 5: Root Cause Analysis

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ROOT CAUSE IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What was actually wrong?**

Redis session expires (5min TTL) before OAuth flow completes (~6min average).

When user returns from GitHub OAuth approval:
1. OAuth callback arrives with state parameter
2. Server looks up state in Redis session
3. Session has expired (TTL exceeded)
4. State parameter not found → "Invalid state parameter" error
5. User sees error page instead of successful login

**Category**: ⚠️ Configuration issue

**Why did this happen?**

**Primary cause**:
TTL set too short (5min) without considering OAuth flow duration

**Contributing factors**:
1. **GitHub API slowness**: OAuth approval takes 4-5min (slow API)
2. **No buffer time**: TTL exactly matches typical flow time
3. **Dev/prod mismatch**: Dev has 15min TTL, prod has 5min
4. **No monitoring**: No alerts for slow OAuth flows

**When introduced**:
- Commit: `abc123` (PRD-007: Migrate to Redis sessions)
- PR: #234
- Date: 2025-12-15
- Change: Moved from in-memory (no expiration) to Redis (5min TTL)

**Why not caught earlier**:
- Dev environment has longer TTL (15min)
- OAuth in dev is faster (local network)
- No load testing for OAuth flows
- No production monitoring for session expiration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 6: Solution Analysis (with Alternatives)

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SOLUTION ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Root Cause**: Session TTL (5min) < OAuth flow duration (6min avg)

Let me compare solution approaches:

---

**Approach A: Increase Session TTL** ⭐ **Recommended**

**Change**:
```diff
- cookie: { maxAge: 5 * 60 * 1000 }  // 5 minutes
+ cookie: { maxAge: 15 * 60 * 1000 } // 15 minutes
```

**Pros**:
- ✅ Simple fix (1 line change)
- ✅ Immediate deployment (< 5min)
- ✅ Handles slow OAuth flows (up to 15min)
- ✅ Matches dev environment
- ✅ Low risk

**Cons**:
- ⚠️  Slightly more Redis memory (~0.2% increase)
- ⚠️  Longer session = small security trade-off

**Effort**: 🟢 5 minutes
**Risk**: 🟢 Very Low
**Confidence**: 9/10

---

**Approach B: Optimize OAuth Flow Performance**

**Change**:
- Cache GitHub API responses
- Reduce OAuth redirects
- Use GitHub API v4 (GraphQL, faster)

**Pros**:
- ✅ Addresses root performance issue
- ✅ Improves overall auth speed
- ✅ Better user experience

**Cons**:
- ❌ Complex implementation (multiple files)
- ❌ Needs extensive testing
- ❌ Takes days to implement
- ⚠️  May not fully solve issue (GitHub API still slow)

**Effort**: 🔴 2-3 days
**Risk**: 🟡 Medium
**Confidence**: 7/10

---

**Approach C: Store OAuth State in Database**

**Change**:
- Move state parameter from session to dedicated DB table
- No TTL expiration (manual cleanup)

**Pros**:
- ✅ No expiration issues ever
- ✅ Persistent across server restarts
- ✅ Can track OAuth attempts

**Cons**:
- ⚠️  Extra DB calls on each OAuth flow
- ⚠️  Needs migration + cleanup job
- ⚠️  More complex code

**Effort**: 🟡 4 hours
**Risk**: 🟡 Medium
**Confidence**: 8/10

---

**Approach D: Separate OAuth State Storage**

**Change**:
- Use Redis with separate key/TTL for OAuth state
- Keep session TTL at 5min
- OAuth state TTL = 20min

**Pros**:
- ✅ Decouples OAuth from session management
- ✅ Fine-grained control
- ✅ Best of both worlds

**Cons**:
- ⚠️  More complex architecture
- ⚠️  Two Redis keys per OAuth flow

**Effort**: 🟡 2 hours
**Risk**: 🟢 Low
**Confidence**: 8/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recommendation**: **Approach A now** + **Approach B later**

**Why**:
- Fix production immediately (5min deployment)
- Address root cause later when time permits
- Create PRD-XXX for performance optimization

**Confidence in fix**: 9/10
- 10% risk: GitHub API could be even slower (15min+)
- Mitigation: Add monitoring, increase to 20min if needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 7: Implementation & Verification

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ FIX IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Solution**: Increase session TTL to 15 minutes

**Code Changes**:

**File**: `src/auth/session.ts`

Before:
```typescript
const sessionConfig = {
  store: new RedisStore({ client: redis }),
  cookie: {
    maxAge: 5 * 60 * 1000,  // 5 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}
```

After:
```typescript
const sessionConfig = {
  store: new RedisStore({ client: redis }),
  cookie: {
    maxAge: 15 * 60 * 1000,  // 15 minutes - allows for slow OAuth flows
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}
```

**File**: `tests/auth/oauth.test.ts` (NEW)

```typescript
describe('OAuth flow with slow response', () => {
  it('should handle OAuth callback after 10 minutes', async () => {
    const state = await startOAuthFlow();

    // Simulate slow GitHub API (10 min delay)
    await delay(10 * 60 * 1000);

    const result = await handleOAuthCallback(state);
    expect(result.success).toBe(true);
  });
});
```

**Files modified**:
- `src/auth/session.ts` - Increased TTL
- `tests/auth/oauth.test.ts` - Added timeout regression test
- `.env.production` - Updated SESSION_TTL=900000 (documentation)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 **VERIFICATION**

**Testing**:
- [x] Bug no longer reproduces in staging
- [x] Regression test added and passing
- [x] All existing tests still pass (245/245)
- [x] Manual testing: OAuth flow with 8min delay ✅

**Deployment**:
- [x] Deployed to staging (14:45)
- [x] Verified in staging (14:50)
- [x] Deployed to production (15:00)
- [x] Monitoring active (15:05)

**Production Verification** (15 minutes after deploy):
```bash
# Check OAuth success rate
grep "OAuth success" logs/production.log | wc -l
# Before: 45% success rate
# After:  98% success rate ✅
```

**Time to fix**: 40 minutes total
- Investigation: 20 min
- Implementation: 5 min
- Testing: 10 min
- Deployment: 5 min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ **FIX IMPACT & ROLLBACK**

**Impact Analysis**:

**Memory**:
- Before: 500 sessions × 5min = 2,500 session-minutes
- After: 500 sessions × 15min = 7,500 session-minutes
- Increase: +5,000 session-minutes (+200%)
- Redis memory: 2MB → 6MB (+4MB, negligible)

**Security**:
- Longer session = slightly higher hijacking risk
- Mitigation: httpOnly + secure flags still active
- Acceptable trade-off for functionality

**Performance**:
- No change (session lookup time unchanged)

**Breaking Changes**:
- None (backward compatible)

---

**Rollback Plan**:

If fix doesn't work or causes issues:

```bash
# Quick rollback (< 1 minute)
cd /app
git revert HEAD
npm run build
pm2 restart app

# Or manual config change:
sed -i 's/15 \* 60/5 \* 60/' src/auth/session.ts
npm run build
pm2 restart app
```

**Rollback triggers**:
- OAuth success rate < 90% after 1 hour
- Redis memory > 50MB (unlikely)
- User complaints about security

**Monitoring** (next 24 hours):
- OAuth success rate (target: >95%)
- Session expiration timing
- Redis memory usage
- GitHub API response times

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 8: Prevention Strategy

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PREVENTION STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How to avoid this in future?**

**Immediate Actions** (done today):

1. ✅ **Add regression test**
   - File: `tests/auth/oauth.test.ts`
   - Tests OAuth flows with 10min delay
   - Prevents TTL being reduced again

2. ✅ **Document TTL requirement**
   - File: `src/auth/session.ts`
   - Comment: "// Must be > max OAuth flow time (10min) + 5min buffer"
   - Prevents accidental reduction

3. ✅ **Sync dev/prod configs**
   - Updated `.env.development` to match `.env.production`
   - Catches issues in dev before prod

---

**Systemic Improvements** (next 2 weeks):

- [ ] **Add monitoring dashboard** (PRD-XXX)
  - Track OAuth flow duration (p50, p95, p99)
  - Alert if flow > 10min
  - Alert if session expiration during OAuth

- [ ] **Load testing for OAuth** (PRD-XXX)
  - Test with slow API responses
  - Test with high concurrent OAuth flows
  - Catch timing issues before production

- [ ] **Improve GitHub API performance** (PRD-XXX)
  - Cache user profile data
  - Use GraphQL API (faster)
  - Reduce number of API calls

- [ ] **Config validation on startup**
  - Check SESSION_TTL > 10min
  - Fail fast if misconfigured
  - Prevents deployment with bad config

---

**Lessons Learned**:

**Technical**:
- Always set TTL > longest expected operation + buffer
- OAuth flows are slow (4-10min typical)
- Environment-specific configs must be documented
- Session expiration needs monitoring

**Process**:
- Quick wins (logs + config diff) are faster than hypothesis testing
- Web search for known issues saves time
- Dev/prod parity critical for timing-sensitive features
- Monitoring should exist before production deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 9: Synthèse & Mon Feeling

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SYNTHÈSE & MON FEELING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Debug Difficulty**: 3/10 ⭐ (quick wins worked perfectly)

**Time Invested**:
- 🔍 Investigation: 20 min (expected: 2h) ✅ **Much faster**
  - Quick wins: 3 min ⚡
  - Web search: 2 min
  - Log analysis: 5 min
  - Hypothesis testing: 10 min
- 🔧 Fix implementation: 5 min
- 🧪 Testing: 10 min
- 🚀 Deployment: 5 min
- **Total**: 40 min (expected: 3h)

---

**What worked well**:
- ✅ **Quick wins found issue immediately** (config diff)
- ✅ Web search confirmed known pattern (not unique bug)
- ✅ Logs were clear and helpful (showed timing)
- ✅ Simple fix (1 line change)
- ✅ Fast deployment (production fixed in 40min)

**What was tricky**:
- ⚠️  Initially suspected OAuth config, not session timing
- ⚠️  Prod-only issue made reproduction harder
- ⚠️  GitHub API slowness not documented anywhere
- ⚠️  No monitoring for session expiration

**What surprised me**:
- 💡 OAuth flow takes 6+ minutes (expected: 1-2min)
- 💡 GitHub API is really slow (4-5min for profile fetch)
- 💡 Dev had different config than prod (should be identical)

---

**Would I do differently next time**:
- 🔄 **Check configs first** before investigating code
- 🔄 Compare dev vs prod configs at start of debug
- 🔄 Always check logs immediately (not after hypothesis)
- 🔄 Web search for error message before deep investigation
- 🔄 Add session TTL to monitoring dashboard upfront

---

**Confidence in fix**: 9/10

**Why 9/10**:
- Fix addresses root cause directly ✅
- Tested in staging successfully ✅
- Simple change with low risk ✅

**Why not 10/10**:
- 10% risk: GitHub API could be even slower (>15min)
- Monitoring will catch this if it happens
- Can increase to 20min if needed

---

**Follow-up PRDs**:
- **PRD-XXX**: Optimize OAuth flow performance (reduce from 6min to <2min)
- **PRD-XXX**: Add session expiration monitoring dashboard
- **PRD-XXX**: Load testing for OAuth flows with slow API responses

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 10: Team Knowledge Capture

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 TEAM KNOWLEDGE ENTRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Searchable Tags**:
#oauth #session #production #redis #timeout #configuration

**Bug Pattern**: Environment-specific session timeout

**TL;DR**:
OAuth redirect fails in production with "Invalid state parameter" because Redis session expires (5min) before OAuth callback completes (~6min).

**Root Cause**:
- Session TTL: 5 minutes
- OAuth flow: 6+ minutes (slow GitHub API)
- Session expires → state parameter lost → error

**Solution**:
Increase session TTL to 15 minutes (allows for slow OAuth flows + buffer)

**Files Changed**:
- `src/auth/session.ts`: maxAge 5min → 15min
- `tests/auth/oauth.test.ts`: Added regression test

**Prevention**:
- Monitor OAuth flow duration
- Set TTL > longest operation + 5min buffer
- Sync dev/prod configs
- Document timing requirements

**Related**:
- PRD-007: Introduced Redis sessions (root cause)
- Similar to Stack Overflow #12345678

**Time to Resolve**: 40 minutes

**Confidence**: 9/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Debug session saved**

File: `.prds/thoughts/debugging/20250106-143000-oauth-session-timeout.md`

You can search past debugs with:
```bash
grep -r "#oauth" .prds/thoughts/debugging/
grep -r "session timeout" .prds/thoughts/debugging/
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Debug Complete!**

**Summary**:
- 🐛 Bug: OAuth redirect fails in production
- 💡 Cause: Session timeout (5min < 6min flow)
- ✅ Fix: Increase TTL to 15min
- ⏱️  Time: 40 minutes (expected: 3h)
- 🎯 Confidence: 9/10

**Next steps**:
- ✅ Production is fixed and stable
- 📊 Monitor OAuth metrics for 24h
- 🚀 Create PRD-XXX for performance optimization
- 📚 Share debug session with team

Great work! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Configuration

No special configuration needed. Uses:
- `context_engineering.thoughts_directory` from `.claude/config.json`
- Web search enabled for known issues check
- Template: `product/templates/debug-template.md` (optional)

---

## Options

```bash
# Interactive mode (recommended)
/debugging "OAuth redirect fails in production"

# Quick mode (skip optional questions, minimal output)
/debugging "Webhook delivery fails randomly" --quick

# With PRD context
/debugging "Dashboard loads slowly" --prd PRD-007

# Save without team knowledge capture (private debug)
/debugging "Security issue in auth" --private
```

---

## Examples

### Example 1: Environment-specific bug
```bash
/debugging "Feature works in dev but fails in production"
```

**Expected flow**:
1. Quick triage → Red flags (environment-specific)
2. Quick wins → Config diff shows mismatch
3. Solution → Sync configs
4. Time: < 10 minutes

---

### Example 2: Performance issue
```bash
/debugging "Dashboard loads slowly for users with >1000 items"
```

**Expected flow**:
1. Quick triage → Red flags (N+1 query suspected)
2. Web search → Known pattern (pagination needed)
3. Investigation → Query profiling
4. Solution → Add pagination + caching
5. Time: 1-2 hours

---

### Example 3: Intermittent failure
```bash
/debugging "Webhook delivery fails randomly (20% failure rate)"
```

**Expected flow**:
1. Quick triage → Red flags (race condition suspected)
2. Quick wins → Logs show timeout errors
3. Investigation → Network timing analysis
4. Solution → Add retry mechanism + increase timeout
5. Time: 2-3 hours

---

## Key Improvements (v2.0.0)

🎯 **Faster Investigation**:
- Quick wins before hypothesis testing
- Web search for known issues
- Red flags detection (automatic pattern matching)

🎯 **Honest Assessment**:
- Confidence scoring (not just "fixed")
- "Would do differently" reflection
- Debug difficulty rating (1-10)

🎯 **Team Learning**:
- Searchable tags (#oauth, #session, etc.)
- TL;DR format (scan in 10 seconds)
- Related PRDs/issues linked

🎯 **Solution Quality**:
- Multiple approaches compared
- Confidence + effort + risk for each
- Rollback plan included

---

## Related Commands

- `/explore-prd` - Explore feature before building
- `/review-prd` - Review PRD before coding
- `/code-prd` - Start implementation
- `/complete-prd` - Complete PRD with retrospective

---

## Tips

- ✅ **Try quick wins first** - Often faster than hypothesis testing
- ✅ **Web search error messages** - Many bugs are known patterns
- ✅ **Check logs immediately** - Usually show the issue
- ✅ **Compare configs** (dev vs prod) - Common source of bugs
- ✅ **Document with confidence** - Be honest about uncertainty
- ✅ **Add regression tests** - Prevent recurrence
- ✅ **Share learnings** - Help team avoid same bug

---

**Version**: 2.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Category**: Development Tools
**Requires**: Web search enabled, git, redis-cli (optional)
