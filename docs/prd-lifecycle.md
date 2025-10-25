# 🔄 Complete PRD Lifecycle

The complete end-to-end workflow from idea to production deployment.

---

## 📋 Quick Reference

```
💡 Idea
  ↓ /create-prd
📝 Draft PRD
  ↓ /review-prd
✅ Approved PRD
  ↓ /code-prd
💻 Development
  ↓ /work-prd
👨‍💻 Implementation
  ↓ /security-audit + /quality-check
🔒 Quality Gates
  ↓ /smart-commit + /smart-pr
🔀 Pull Request
  ↓ (Manual: Review & Merge)
✅ PR Merged
  ↓ /complete-prd
🎉 Complete
  ↓ /archive-prd (after 2-4 weeks)
📦 Archived
```

---

## 🎯 Complete Workflow with Commands

### Step 1: Create PRD

**Command**: `/create-prd`

**Input**: Brief feature description
```
/create-prd
> Feature: "Add OAuth2 authentication for Google and GitHub"
```

**What happens**:
- Claude generates complete PRD with:
  - Problem statement
  - Solution approach
  - Technical architecture
  - Acceptance criteria
  - Risk assessment
  - Success metrics
- Saves to `product/prds/01-draft/YYMMDD-oauth2-integration-v1.md`
- Creates entry in `WORK_PLAN.md`

**Output**:
```
✅ PRD Created: PRD-003
📄 File: product/prds/01-draft/250915-oauth2-integration-v1.md
📊 Status: Draft
🎯 Next: /review-prd PRD-003
```

**Time**: 2-5 minutes

---

### Step 2: Review PRD

**Command**: `/review-prd PRD-003`

**What happens**:
- AI analyzes 7 dimensions:
  1. **Clarity**: Are requirements clear and unambiguous?
  2. **Completeness**: Are all scenarios covered?
  3. **Feasibility**: Is it technically achievable?
  4. **Testability**: Can we verify success?
  5. **Security**: Any security considerations?
  6. **Performance**: Performance implications?
  7. **Dependencies**: What depends on this?
- Assigns grade: A (excellent) to F (needs major work)
- Generates calibration questions to expose gaps
- Identifies risks and mitigation strategies

**Output**:
```
📊 **PRD Review: PRD-003**

**Overall Grade**: B+ (Good, minor improvements needed)

**Dimension Scores**:
- Clarity: A (9/10)
- Completeness: B (7/10) ⚠️
- Feasibility: A (9/10)
- Testability: B+ (8/10)
- Security: B (7/10) ⚠️
- Performance: A- (8.5/10)
- Dependencies: A (9/10)

**🔴 Critical Gaps** (0):
None

**🟡 Important Questions** (3):
1. How will you handle OAuth token refresh in background?
2. What happens if Google/GitHub API is down?
3. Should we support enterprise SSO (SAML) in v2?

**Recommendations**:
- Add error handling section for API failures
- Specify token storage mechanism (Redis? Database?)
- Document rate limits and retry strategy

📝 After addressing feedback: /review-prd PRD-003 (re-review)
✅ If satisfied: Manually move to 02-approved/ or update Status
```

**Time**: 3-10 minutes (+ time to address feedback)

---

### Step 3: Start Development

**Command**: `/code-prd PRD-003`

**What happens**:
- Creates Git worktree: `worktrees/prd-003-oauth2-integration/`
- Creates feature branch: `feature/PRD-003-oauth2-integration`
- Updates PRD status → "In Progress"
- Moves PRD: `01-draft/` → `03-in-progress/`
- Updates `WORK_PLAN.md`
- Switches to worktree

**Output**:
```
🌳 **Git Worktree Created**

📂 Worktree: worktrees/prd-003-oauth2-integration/
🌿 Branch: feature/PRD-003-oauth2-integration
📄 PRD: product/prds/03-in-progress/250915-oauth2-integration-v1.md

✅ Ready to code!

Commands:
- cd worktrees/prd-003-oauth2-integration/
- /work-prd PRD-003 (guided implementation)

📍 You are now in the worktree directory.
```

**Time**: 10-30 seconds

---

### Step 4: Guided Implementation

**Command**: `/work-prd PRD-003`

**What happens**:
- Reads PRD requirements
- Breaks into granular tasks (~2-4 hours each)
- For each task:
  - Provides context and approach
  - Suggests file locations
  - Gives code examples
  - Defines acceptance criteria
- Updates `WORK_PLAN.md` with task breakdown

**Output**:
```
📋 **Implementation Plan: PRD-003**

**Total Tasks**: 8 tasks (~24 hours estimated)

---

### Task 1: Setup OAuth2 Library (2h)

**Goal**: Install and configure OAuth2 client library

**Files**:
- `package.json`
- `src/config/oauth.ts`
- `.env.example`

**Steps**:
1. Install `@auth/core` and `@auth/express` packages
2. Create OAuth config with Google/GitHub credentials
3. Add environment variables for client ID/secret
4. Configure redirect URLs

**Acceptance Criteria**:
- [ ] Library installed and types available
- [ ] Config file exports OAuth providers
- [ ] Environment variables documented

**Code Example**:
```typescript
// src/config/oauth.ts
import { GoogleProvider, GitHubProvider } from '@auth/core/providers';

export const oauthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
```

Ready to start? (y/n)
> y

[Claude helps implement Task 1]

✅ Task 1 complete!

### Task 2: Implement Login Routes (3h)
...
```

**Time**: Ongoing (tracks throughout development)

---

### Step 5: Quality Gates

**Commands**: `/security-audit` + `/quality-check`

#### Security Audit

```bash
/security-audit
```

**Checks**:
- ✅ OWASP Top 10 vulnerabilities
- ✅ Dependency vulnerabilities (npm audit)
- ✅ Secrets detection (no credentials in code)
- ✅ SQL injection risks
- ✅ XSS vulnerabilities
- ✅ Authentication flaws
- ✅ Insecure dependencies

**Output**:
```
🔒 **Security Audit: PASSED** ✅

**Summary**:
- OWASP Top 10: All checks passed
- Dependencies: 0 high/critical vulnerabilities
- Secrets: No credentials detected in code
- Authentication: Secure token handling ✅

**Recommendations**:
- Consider adding rate limiting on /auth endpoints
- Add CSP headers for XSS protection

⏱️ Completed in 18 seconds
```

#### Quality Check

```bash
/quality-check
```

**Checks**:
- ✅ Linting (ESLint/Prettier)
- ✅ Type checking (TypeScript)
- ✅ Test coverage (>80%)
- ✅ Code complexity (max 10)
- ✅ Bundle size (<500KB)
- ✅ Performance budgets

**Output**:
```
✅ **Quality Check: PASSED**

**Code Quality**:
- Linting: 0 errors, 2 warnings
- Type Safety: 100% (no 'any' types)
- Test Coverage: 89% (target: 80%) ✅
- Complexity: Max 7 (target: <10) ✅
- Bundle Size: 342KB (target: <500KB) ✅

**Warnings**:
- src/auth/callback.ts:42 - Unused variable 'error'
- src/utils/token.ts:18 - Consider extracting to constant

⏱️ Completed in 24 seconds
```

**Time**: 30-60 seconds

---

### Step 6: Smart Commits

**Command**: `/smart-commit`

**What happens**:
- Analyzes current changes (`git diff`)
- Determines commit type (feat, fix, docs, refactor, etc.)
- Generates conventional commit message
- Stages and commits changes

**Example**:

```bash
/smart-commit
```

**Output**:
```
📝 **Smart Commit**

**Changes Detected**:
- src/auth/providers/google.ts (new file)
- src/auth/providers/github.ts (new file)
- src/routes/auth.ts (modified)
- package.json (modified)

**Generated Commit Message**:

feat(auth): Add Google and GitHub OAuth providers

- Implement GoogleProvider with token exchange
- Implement GitHubProvider with scope management
- Add /auth/google and /auth/github endpoints
- Install @auth/core and @auth/express packages

Relates to PRD-003

---

Commit this? (y/n/edit)
> y

✅ Committed: feat(auth): Add Google and GitHub OAuth providers
📊 Files changed: 4 (+342, -12)
🔗 Commit: a1b2c3d
```

**Time**: 10-20 seconds per commit

---

### Step 7: Create Pull Request

**Command**: `/smart-pr`

**What happens**:
- Analyzes all commits on feature branch
- Generates comprehensive PR description:
  - Summary (bullet points)
  - Detailed description
  - Test plan
  - Screenshots (if UI changes)
  - Related issues
- Pushes branch to remote
- Creates PR on GitHub

**Example**:

```bash
/smart-pr
```

**Output**:
```
🔀 **Creating Pull Request**

**Branch**: feature/PRD-003-oauth2-integration
**Base**: main
**Commits**: 12 commits

**Generated PR**:

---

### Title
feat: Add OAuth2 authentication with Google and GitHub

### Summary
- Implement OAuth2 authentication flow
- Add Google and GitHub provider support
- Create secure token storage with Redis
- Add comprehensive error handling and retry logic
- Implement automatic token refresh
- Add rate limiting on auth endpoints

### Description

#### What changed?
Added OAuth2 authentication to allow users to sign in with Google or GitHub accounts. This provides a more seamless login experience and reduces password fatigue.

#### Why?
Users requested social login to avoid creating yet another password. OAuth2 also provides better security through delegated authentication and supports MFA.

#### How?
Used @auth/core library with custom providers for Google and GitHub. Tokens are stored in Redis with 7-day expiration and automatic refresh. Rate limiting prevents abuse of auth endpoints.

### Breaking Changes
None. Existing email/password auth continues to work.

### Test Plan
- [x] Google OAuth flow (login, token refresh, logout)
- [x] GitHub OAuth flow (login, token refresh, logout)
- [x] Token expiration and refresh
- [x] Error handling (provider down, invalid credentials)
- [x] Rate limiting (max 10 attempts/hour)
- [x] Unit tests (89% coverage)
- [x] Integration tests for auth routes

### Related Issues
Closes #28
Relates to PRD-003

---

✅ PR Created: https://github.com/user/repo/pull/42

📋 Next steps:
1. Wait for CI/CD checks to pass
2. Request reviews from team
3. Address review feedback
4. Merge when approved
5. Run /complete-prd PRD-003 after merge
```

**Time**: 20-40 seconds

---

### Step 8: Review & Merge (Manual)

**Platform**: GitHub

**What happens**:
- Team reviews PR
- CI/CD runs tests
- Address feedback
- Get approvals
- Merge to main

**Time**: 1-48 hours (depends on team availability)

---

### Step 9: Complete PRD

**Command**: `/complete-prd PRD-003`

**What happens**:
- Verifies PR is merged (not just closed)
- Collects completion metadata:
  - Production deploy date
  - Performance vs. targets
  - Deployment issues (if any)
  - Key learnings
  - Follow-up tasks
- Updates PRD with completion notes
- Moves PRD: `03-in-progress/` → `05-complete/`
- Cleans up Git worktree (optional)
- Deletes feature branch (optional)
- Updates `WORK_PLAN.md`

**Example**:

```bash
/complete-prd PRD-003
```

**Output**:
```
✅ **PRD-003 Complete!**

📝 **Feature**: OAuth2 Integration
🗓️ **Completed**: 2025-10-25
⏱️ **Duration**: 12 days (estimated: 10 days, +20%)

📊 **Metrics**:
- PR #42: Merged ✅ (2025-10-25T14:32:00Z)
- Production: Deployed 2025-10-25T15:00:00Z
- Performance: 150ms response time (target: <200ms) ✅
- Test Coverage: 89% (target: >80%) ✅
- Security: All checks passed ✅

🧹 **Cleanup**:
- ✅ PRD moved to 05-complete/
- ✅ Worktree removed: worktrees/prd-003-oauth2-integration/
- ✅ Branch deleted: feature/PRD-003-oauth2-integration
- ✅ WORK_PLAN.md updated

📚 **Learnings**:
- OAuth2 library v3 works better than v2 for our use case
- Should document token refresh flow more clearly
- Error handling for token expiration needs better UX

📋 **Follow-up**:
- PRD-008: Improve OAuth error messages

🎉 **Great work! Feature is live in production.**

Next steps:
- Monitor production metrics
- Watch for user feedback
- Consider /archive-prd in 2-4 weeks
```

**Time**: 1-3 minutes

---

### Step 10: Archive (Optional, after 2-4 weeks)

**Command**: `/archive-prd PRD-003`

**What happens**:
- Adds archive metadata
- Moves PRD: `05-complete/` → `99-archived/`
- Removes from active `WORK_PLAN.md`
- Adds to archive summary

**Time**: 30 seconds

---

## 📊 Summary Table

| Step | Command | Input | Time | Output Status |
|------|---------|-------|------|---------------|
| 1. Create | `/create-prd` | Feature description | 2-5 min | `01-draft/` |
| 2. Review | `/review-prd PRD-XXX` | - | 3-10 min | `02-approved/` |
| 3. Code | `/code-prd PRD-XXX` | - | 10-30 sec | `03-in-progress/` |
| 4. Work | `/work-prd PRD-XXX` | - | Ongoing | `03-in-progress/` |
| 5. Audit | `/security-audit` + `/quality-check` | - | 30-60 sec | `03-in-progress/` |
| 6. Commit | `/smart-commit` | - | 10-20 sec | `03-in-progress/` |
| 7. PR | `/smart-pr` | - | 20-40 sec | `03-in-progress/` |
| 8. Review | (GitHub) | - | 1-48 hrs | `03-in-progress/` |
| 9. Complete | `/complete-prd PRD-XXX` | Completion data | 1-3 min | `05-complete/` |
| 10. Archive | `/archive-prd PRD-XXX` | Archive reason | 30 sec | `99-archived/` |

---

## 🎯 Parallel Workflow (Multiple PRDs)

Use `/orchestrate` to manage dependencies across multiple PRDs:

```bash
/orchestrate

# Shows:
# - Active PRDs and their dependencies
# - Bottlenecks and resource conflicts
# - Recommended prioritization
# - Team capacity and allocation
```

Example:
```
📊 **Multi-PRD Orchestration**

### Active PRDs (3)

**PRD-003**: OAuth2 Integration
- Status: In Progress (80% done)
- Dependencies: None
- Blocking: PRD-005, PRD-007
- Team: @alice (2 days remaining)

**PRD-005**: Dark Mode
- Status: Blocked ⚠️
- Dependencies: PRD-003 (needs auth context)
- Team: @bob (waiting)

**PRD-007**: API v2
- Status: Blocked ⚠️
- Dependencies: PRD-003 (needs OAuth tokens)
- Team: @charlie (waiting)

### Recommendations
1. ⚡ Focus: PRD-003 is blocking 2 other PRDs
2. 🔄 Next: PRD-005 and PRD-007 can start in parallel after PRD-003
3. ⏱️ Timeline: All 3 PRDs can complete in 8 days if PRD-003 finishes on time
```

---

## 🚀 Pro Tips

### 1. Use Git Worktrees for Parallel Development
```bash
# Work on multiple PRDs simultaneously
/code-prd PRD-003  # OAuth in worktrees/prd-003/
/code-prd PRD-005  # Dark mode in worktrees/prd-005/
/code-prd PRD-007  # API v2 in worktrees/prd-007/

# Switch between worktrees instantly
cd worktrees/prd-003/
cd worktrees/prd-005/
```

### 2. Automate Quality Gates
```json
// .claude/config.json
{
  "prd_workflow": {
    "git": {
      "pre_commit_hooks": ["quality-check"],
      "pre_pr_hooks": ["security-audit", "quality-check"]
    }
  }
}
```

### 3. Track Metrics Across PRDs
```bash
/list-prds --metrics

# Shows:
# - Average completion time
# - Estimated vs actual duration
# - Common blockers
# - Team velocity
```

### 4. Quick Mode for Small Features
```bash
# Skip /review-prd for small changes
/create-prd
/code-prd PRD-XXX --quick
/work-prd PRD-XXX
# ... develop ...
/smart-pr
/complete-prd PRD-XXX --quick
```

---

## 📚 Related Documentation

- [Commands Reference](commands-reference.md)
- [Configuration Guide](configuration.md)
- [Best Practices](best-practices.md)
- [Troubleshooting](troubleshooting.md)

---

**Plugin**: claude-prd-workflow
**Version**: 2.0.1
**Updated**: 2025-10-25
