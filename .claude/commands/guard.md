---
name: guard
description: Pre-merge quality checks (TS, lint, tests, secrets)
category: Development Tools
version: 0.4.2
---

# Guard Command

Comprehensive pre-merge quality gate.

## Purpose

Catch issues before PR merge:
- TypeScript compilation
- Linting errors
- Test failures
- Security vulnerabilities
- Secrets detection
- Code quality checks

## Workflow

### 1. TypeScript Check

**Run type checking**:
```bash
npm run type-check  # or tsc --noEmit
```

**Report**:
- Type errors found
- Files affected
- Severity level

### 2. Lint Check

**Run linters**:
```bash
npm run lint  # ESLint, Prettier, etc.
```

**Report**:
- Lint errors and warnings
- Fixable vs manual
- Style violations

### 3. Test Suite

**Run full test suite**:
```bash
npm test
```

**Report**:
- Tests passing/failing
- Coverage metrics
- Slow tests flagged

### 4. Security Scan

**Check for vulnerabilities**:
```bash
npm audit
git secrets --scan  # or gitleaks
```

**Report**:
- Dependency vulnerabilities
- Secrets in code
- Security best practices

### 5. Build Verification

**Verify production build**:
```bash
npm run build
```

**Report**:
- Build success/failure
- Bundle size
- Performance metrics

### 6. Summary Report

```markdown
🛡️ Guard Results

TypeScript: ✅ No errors
Lint: ⚠️  3 warnings (auto-fixable)
Tests: ✅ 248 passing (92% coverage)
Security: ❌ 1 high vulnerability (axios@0.21.1)
Build: ✅ Success (bundle: 324 KB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCKERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Security: axios vulnerability (high)
   Fix: npm install axios@latest

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WARNINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟡 Lint: 3 auto-fixable warnings
   Fix: npm run lint:fix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: ❌ NOT READY TO MERGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix blockers before merging.
```

## Blocking vs Non-Blocking

**Blockers** (must fix):
- TypeScript errors
- Test failures
- High/Critical security vulnerabilities
- Secrets detected
- Build failures

**Warnings** (should fix):
- Lint warnings
- Low coverage
- Bundle size increase
- Slow tests

## Auto-Fix

**Fixable issues**:
```bash
/guard --fix
```

**Auto-fixes**:
- Lint errors (Prettier, ESLint --fix)
- Import sorting
- Code formatting

**Non-fixable**:
- Type errors (require manual fix)
- Test failures (require code changes)
- Security vulnerabilities (require updates)

## Flags

**Options**:
- `--fix`: Auto-fix what's possible
- `--strict`: Treat warnings as errors
- `--skip-tests`: Skip test suite (faster)
- `--skip-security`: Skip security scan

**Examples**:
```bash
/guard              # Full check
/guard --fix        # Check + auto-fix
/guard --strict     # Warnings block merge
/guard --skip-tests # Quick check (no tests)
```

## Configuration

```json
{
  "guard": {
    "block_on": ["typescript", "tests", "security_high"],
    "warn_on": ["lint", "coverage_below_80"],
    "auto_fix": true,
    "min_coverage": 80
  }
}
```

## Success Criteria

- ✅ All checks run successfully
- ✅ Blockers identified (if any)
- ✅ Clear actionable feedback
- ✅ Auto-fixes applied (if requested)
- ✅ Verdict clear: Ready/Not Ready

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
