---
name: security-audit
description: Run comprehensive security audit on codebase
category: Security & Quality
---

# Security Audit Command

Perform comprehensive security analysis using multiple tools and best practices.

## Purpose

Detect security vulnerabilities before they reach production:
- Dependency vulnerabilities (npm audit)
- Code security issues (ESLint security rules)
- Hardcoded secrets (git-secrets, pattern matching)
- Common vulnerability patterns (XSS, SQL injection, etc.)
- Security best practices compliance

## Workflow

### Step 1: Determine Scope

Ask user or auto-detect:
```markdown
🔒 **Security Audit**

Scope options:
1. 🎯 Current PRD (feat/PRD-003-design-system)
2. 📦 Entire codebase
3. 📂 Specific directory

Select scope: (1-3)
```

### Step 2: Dependency Scanning

Run npm/yarn audit:
```bash
npm audit --json > .claude/security-audit-deps.json
npm audit
```

Parse results:
- Critical vulnerabilities
- High severity issues
- Moderate/low issues
- Recommended fixes

### Step 3: Code Security Analysis

Run ESLint with security plugins:
```bash
npx eslint . \
  --ext .js,.jsx,.ts,.tsx \
  --config .eslintrc.security.json \
  --format json > .claude/security-audit-code.json
```

Check for:
- `eval()` usage
- `dangerouslySetInnerHTML` without sanitization
- Unvalidated redirects
- Hardcoded credentials patterns
- Unsafe RegExp
- Prototype pollution vectors

### Step 4: Secret Detection

Scan for hardcoded secrets:
```bash
# Pattern-based detection
grep -r -E "(api[_-]?key|password|secret|token)[\s]*=[\s]*['\"][^'\"]+['\"]" \
  --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  .
```

Common patterns to detect:
- API keys
- Database passwords
- JWT secrets
- AWS credentials
- Private keys

### Step 5: Security Best Practices Check

Validate:
- **Environment Variables**: Sensitive data in `.env` files?
- **.gitignore**: Are `.env`, `credentials.json`, etc. ignored?
- **HTTPS**: Are external API calls using HTTPS?
- **Input Validation**: Are user inputs validated?
- **Authentication**: Proper auth implementation?
- **CORS**: Properly configured?

### Step 6: Generate Security Report

```markdown
🔒 **Security Audit Report - PRD-003: Design System**

**Date**: 2025-10-25
**Scope**: feat/PRD-003-design-system branch
**Duration**: 45 seconds

---

## 🚨 Critical Issues (0)

✅ No critical vulnerabilities found

---

## ⚠️ High Severity (2)

### 1. Dependency Vulnerability: lodash@4.17.20
- **Severity**: High
- **CVE**: CVE-2021-23337
- **Impact**: Prototype pollution
- **Affected**: `packages/ui/package.json`
- **Fix**: `npm install lodash@4.17.21`

### 2. Hardcoded API URL
- **File**: `packages/ui/src/utils/api.ts:12`
- **Issue**: Hardcoded production API URL
- **Risk**: Exposed internal endpoint
- **Fix**: Move to environment variable

```typescript
// ❌ Current (line 12)
const API_URL = "https://internal-api.watchora.com/v1";

// ✅ Recommended
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

---

## ⚡ Medium Severity (3)

### 3. Missing Input Sanitization
- **File**: `packages/ui/src/components/Input.tsx:45`
- **Issue**: User input not sanitized before rendering
- **Risk**: XSS vulnerability
- **Fix**: Use DOMPurify or escape HTML

### 4. Weak Password Validation
- **File**: `apps/web/src/utils/validation.ts:23`
- **Issue**: Password regex allows weak passwords
- **Fix**: Enforce min 12 chars, special chars, numbers

### 5. CORS Wildcard
- **File**: `apps/api/src/middleware/cors.ts:8`
- **Issue**: `Access-Control-Allow-Origin: *`
- **Risk**: Any domain can access API
- **Fix**: Whitelist specific domains

---

## ℹ️ Low Severity (5)

- Missing security headers (X-Frame-Options, CSP)
- Console.log statements in production build
- Overly permissive file permissions
- Missing rate limiting
- No CSRF protection

---

## ✅ Best Practices Compliance

| Category | Status | Notes |
|----------|--------|-------|
| Secrets Management | ⚠️ Partial | Some hardcoded values found |
| HTTPS Enforcement | ✅ Pass | All external calls use HTTPS |
| Input Validation | ⚠️ Partial | Missing in 3 components |
| Authentication | ✅ Pass | JWT properly implemented |
| Authorization | ✅ Pass | RBAC correctly applied |
| Error Handling | ✅ Pass | No sensitive data in errors |
| Dependency Updates | ⚠️ Needs Update | 2 high-severity deps |

---

## 📊 Summary

- **Critical**: 0 ❌
- **High**: 2 🔴
- **Medium**: 3 🟡
- **Low**: 5 🔵
- **Total**: 10 issues

**Overall Grade**: B- (needs improvement)

**Action Required**: Fix 2 high-severity issues before PR merge

---

## 🛠️ Recommended Actions

### Immediate (Block PR)
1. ✅ Update lodash to 4.17.21: `npm install lodash@4.17.21`
2. ✅ Move API_URL to environment variable

### Before Production
3. Add input sanitization to Input component
4. Strengthen password validation
5. Restrict CORS to specific domains

### Nice to Have
6. Add security headers
7. Remove console.logs from production
8. Implement rate limiting
9. Add CSRF tokens

---

## 🔧 Auto-Fix Available

Would you like me to fix the high-severity issues automatically?
(Y/n)
```

### Step 7: Offer Auto-Fix

If user approves, automatically fix:
- Update vulnerable dependencies
- Move hardcoded values to `.env`
- Add basic sanitization
- Update `.gitignore` if needed

Commit changes:
```bash
git add .
git commit -m "security: Fix high-severity vulnerabilities

- Updated lodash to 4.17.21 (CVE-2021-23337)
- Moved hardcoded API URL to environment variable
- Added input sanitization to Input component

🤖 Generated by /security-audit"
```

### Step 8: Save Report

Save to `.claude/security-audit-{date}.md` for historical tracking.

## Configuration

Uses these config settings:
```json
{
  "security": {
    "enabled": true,
    "scan_dependencies": true,
    "scan_code": true,
    "fail_on_high_severity": true,
    "ignore_patterns": [
      "**/node_modules/**",
      "**/dist/**"
    ],
    "tools": {
      "npm_audit": true,
      "eslint_security": true,
      "git_secrets": false
    }
  }
}
```

## Success Criteria

- All security checks completed
- Vulnerabilities categorized by severity
- Clear remediation steps provided
- High-severity issues fixed (if auto-fix enabled)
- Report saved for audit trail

## Related

- Agent: `security-expert` (invoked for complex analysis)
- Skill: `security-analysis`
- Command: `/quality-check` (complementary)
