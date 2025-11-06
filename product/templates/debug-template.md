# Debug Session: {{ISSUE_DESCRIPTION}}

**Date**: {{DATE}}
**Debugger**: {{USER}}
**Related PRD**: {{PRD_ID}} or "Standalone"
**Status**: 🔴 Investigating | 🟡 Hypothesis Found | 🟢 Resolved | ⚫ Workaround Applied

---

## 🐛 Symptom

### What's Broken?

[Clear description of the bug/issue - what the user sees or experiences]

### Expected Behavior

[What should happen under normal circumstances]

### Actual Behavior

[What actually happens - be specific and include error messages]

### Reproducibility

- [ ] **Always reproduces** (100% of the time)
- [ ] **Intermittent** (X% of the time - specify percentage)
- [ ] **Only in specific conditions** (describe conditions)

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3
4. Observe error

---

## 📍 Context

### Location

**Code Location**:
- File: `path/to/file.ts`
- Function/Component: `functionName()`
- Line(s): 123-145 (approximate)

**User Context**:
- User action: [What was the user doing]
- User flow: [Where in the app]
- Data state: [Relevant data/state]

### Environment

**Where does this happen?**:
- [ ] Development (local)
- [ ] Staging
- [ ] Production
- [ ] All environments

**System Details**:
- OS: Windows / Mac / Linux
- Browser: Chrome / Firefox / Safari / Edge (if applicable)
- Version: [App version]
- Node version: [If applicable]

### Timing

- **First noticed**: {{DATE}} at {{TIME}}
- **Regression from**: [Version/Commit if known, or "Unknown"]
- **Frequency**: [How often it occurs]
- **Impact**: [How many users affected]

---

## 🔬 Investigation Log

### Hypothesis 1: {{THEORY_ABOUT_ROOT_CAUSE}}

**Reasoning**: [Why we think this might be the cause]

**Test Plan**: [What we'll do to verify this]

**Command/Steps Executed**:
```bash
# Commands run to test hypothesis
npm test
npm run lint
# etc.
```

**Result**: ❌ Disproved | ✅ Confirmed | 🤔 Inconclusive

**Findings**: [What this revealed - even if disproved, what did we learn?]

**Time Invested**: {{MINUTES}} minutes

---

### Hypothesis 2: {{ANOTHER_THEORY}}

**Reasoning**: [Why we think this might be the cause]

**Test Plan**: [What we'll do to verify this]

**Command/Steps Executed**:
```bash
# Commands run
```

**Result**: ❌ Disproved | ✅ Confirmed | 🤔 Inconclusive

**Findings**: [What this revealed]

**Time Invested**: {{MINUTES}} minutes

---

### Hypothesis 3: {{ADDITIONAL_THEORY}}

[Repeat structure for each hypothesis tested]

---

## 💡 Root Cause

### What Was Actually Wrong?

[Detailed explanation of the real issue - be technical and specific]

**Category**:
- [ ] Logic error
- [ ] Race condition
- [ ] Null/undefined handling
- [ ] Type mismatch
- [ ] Configuration issue
- [ ] Dependency bug
- [ ] Environment issue
- [ ] Other: [Specify]

### Why Did This Happen?

**Primary Cause**: [The immediate technical cause]

**Contributing Factors**:
- Factor 1: [Lack of validation? Missing test? Edge case?]
- Factor 2: [Regression from recent change? Environment config?]
- Factor 3: [Incomplete error handling? Incorrect assumption?]

### When/How Was It Introduced?

- **Commit**: [SHA if known]
- **PR**: [Link to PR if known]
- **Date**: [Approximate date introduced]
- **Change**: [What change introduced this]

---

## ✅ Solution

### Fix Applied

[Describe the fix in detail - what changed and why]

**Approach**: [Which solution approach was chosen]

**Why This Fix**: [Rationale for this specific solution]

### Code Changes

**Before**:
```typescript
// Problematic code
function badCode() {
  const result = data.value; // Can be undefined
  return result.toString(); // Crashes if undefined
}
```

**After**:
```typescript
// Fixed code
function fixedCode() {
  const result = data.value ?? 'default'; // Handle undefined
  return result.toString(); // Safe
}
```

### Files Modified

- `path/to/file1.ts` - Fixed X by adding Y
- `path/to/file2.ts` - Added validation for Z
- `path/to/file3.test.ts` - Added regression test

### Verification

**Testing**:
- [x] Bug no longer reproduces locally
- [x] Regression test added and passing
- [x] All existing tests still pass
- [x] Manual testing in affected flows
- [x] Tested in relevant environments

**Code Review**:
- [x] Code review completed
- [x] Security implications considered
- [x] Performance implications considered

**Deployment**:
- [ ] Deployed to staging
- [ ] Verified in staging
- [ ] Deployed to production
- [ ] Monitoring post-deployment

**Time to Fix**: {{HOURS}} hours

---

## 🛡️ Prevention

### How to Avoid This in Future?

**Immediate Actions**:
1. **Add validation** for {{SPECIFIC_CASE}}
   - Where: `path/to/file.ts`
   - Implementation: [Specific validation logic]

2. **Update tests** to cover {{SCENARIO}}
   - Test file: `path/to/test.ts`
   - Coverage: [What edge case now covered]

3. **Document** {{EDGE_CASE}} in {{LOCATION}}
   - Documentation: README / inline comments
   - Warning: [What future developers should know]

**Systemic Improvements**:
- [ ] Add linting rule to catch this pattern
- [ ] Update error handling guidelines
- [ ] Improve logging for similar issues
- [ ] Add monitoring/alerting

### Lessons Learned

**Technical Lessons**:
- Lesson 1: [What this taught us about the system]
- Lesson 2: [Pattern to watch for in future]

**Process Lessons**:
- Lesson 1: [How to improve debugging workflow]
- Lesson 2: [How to prevent similar issues]

---

## 📊 Impact Assessment

**User Impact**:
- Severity: Critical / High / Medium / Low
- Affected users: [Number or percentage]
- Data loss: Yes / No
- Workaround available: Yes / No

**Business Impact**:
- Revenue impact: [If applicable]
- Reputation impact: [If applicable]
- SLA breach: Yes / No

**Downtime**:
- Duration: [Time from discovery to fix deployed]
- Affected services: [Which parts of the system]

---

## 🔗 Related Issues

### Similar Bugs

**Past Incidents**:
- [Link to similar debug session]
- [Link to related GitHub issue]
- [Pattern: Why these are related]

**Future Watch**:
- [What to monitor for recurrence]
- [Related areas that might have similar issues]

### Related PRDs

**Caused By**:
- PRD-XXX: [How this PRD introduced the issue]

**Fixed In**:
- PRD-XXX: [This fix implemented as part of which PRD]

**Follow-Up Work**:
- PRD-XXX: [Additional work spawned from this bug]

---

## 📝 Communication

**Who Was Notified**:
- [ ] Team lead
- [ ] Product manager
- [ ] Affected users
- [ ] Support team

**Where Communicated**:
- Slack: [Link to thread]
- Email: [Recipients]
- Status page: [If public incident]

**Post-Mortem Required**: Yes / No

---

## ✅ Checklist

**Before Closing**:
- [ ] Root cause identified and understood
- [ ] Fix implemented and tested
- [ ] Regression tests added
- [ ] Documentation updated
- [ ] Prevention measures in place
- [ ] Related issues linked
- [ ] Team notified
- [ ] Deployed and verified

---

## 📚 References

- Stack traces: [Links or pastes]
- Logs: [Relevant log entries]
- Monitoring dashboards: [Links]
- Related documentation: [Links]
- Discussion threads: [Links]

---

*Debug template v0.4.0 - Part of Context Engineering workflow*
