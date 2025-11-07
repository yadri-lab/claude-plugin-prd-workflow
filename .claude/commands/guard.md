---
name: guard
description: Pre-merge quality checks (TS, lint, tests, secrets)
category: PRD Management
---

# Guard Command

Lightweight pre-merge quality gate to catch issues before they hit main.

## Purpose

**CTO mindset**: Prevent stupid mistakes, not build a bureaucracy.

Quick checks:
- ✅ TypeScript compiles (if TS project)
- ✅ Linter passes (if configured)
- ✅ Unit tests pass (if exist)
- ✅ No secrets committed (API keys, tokens)
- ✅ No TODO/FIXME in critical files

**Output**: Single line status + short action items (no essays)

## Usage

```bash
# Run all checks
/guard

# Run specific checks only
/guard --ts-only
/guard --lint-only
/guard --tests-only
/guard --secrets-only

# Skip certain checks
/guard --skip-tests
/guard --skip-lint

# Auto-fix what's fixable
/guard --fix
```

## Workflow

### Step 1: Detect Project Type

```bash
echo "🛡️  Running pre-merge checks..."
echo ""

# Detect project capabilities
HAS_TS=false
HAS_LINT=false
HAS_TESTS=false

if [ -f "tsconfig.json" ] || [ -f "package.json" ]; then
  if grep -q "typescript" package.json 2>/dev/null; then
    HAS_TS=true
  fi
fi

if [ -f ".eslintrc" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
  HAS_LINT=true
elif [ -f "package.json" ]; then
  if grep -q "eslint" package.json 2>/dev/null; then
    HAS_LINT=true
  fi
fi

if [ -d "test" ] || [ -d "tests" ] || [ -d "__tests__" ] || [ -d "spec" ]; then
  HAS_TESTS=true
elif [ -f "package.json" ]; then
  if grep -q "\"test\":" package.json 2>/dev/null; then
    HAS_TESTS=true
  fi
fi
```

### Step 2: Run Checks

```bash
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Running Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

#### Check 1: TypeScript (if applicable)

```bash
if [ "$HAS_TS" = true ] && [ "$SKIP_TS" != true ]; then
  echo -n "📘 TypeScript... "

  # Try tsc --noEmit
  if command -v tsc &>/dev/null; then
    if tsc --noEmit 2>&1 | grep -q "error TS"; then
      echo "❌ FAIL"
      echo "   Run: tsc --noEmit"
      CHECKS_FAILED=$((CHECKS_FAILED + 1))
    else
      echo "✅ PASS"
      CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
  else
    echo "⚠️  SKIP (tsc not found)"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
```

#### Check 2: Linter (if applicable)

```bash
if [ "$HAS_LINT" = true ] && [ "$SKIP_LINT" != true ]; then
  echo -n "🧹 ESLint... "

  # Try npm run lint or eslint directly
  if command -v eslint &>/dev/null; then
    if [ "$AUTO_FIX" = true ]; then
      eslint . --fix --quiet 2>&1 >/dev/null
      STATUS=$?
    else
      eslint . --quiet 2>&1 >/dev/null
      STATUS=$?
    fi

    if [ $STATUS -ne 0 ]; then
      echo "❌ FAIL"
      if [ "$AUTO_FIX" = true ]; then
        echo "   Some issues auto-fixed, re-run to check"
      else
        echo "   Run: eslint . --fix"
      fi
      CHECKS_FAILED=$((CHECKS_FAILED + 1))
    else
      echo "✅ PASS"
      CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
  elif grep -q "\"lint\":" package.json 2>/dev/null; then
    npm run lint --silent 2>&1 >/dev/null
    if [ $? -ne 0 ]; then
      echo "❌ FAIL"
      echo "   Run: npm run lint"
      CHECKS_FAILED=$((CHECKS_FAILED + 1))
    else
      echo "✅ PASS"
      CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
  else
    echo "⚠️  SKIP (eslint not configured)"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
```

#### Check 3: Unit Tests (if applicable)

```bash
if [ "$HAS_TESTS" = true ] && [ "$SKIP_TESTS" != true ]; then
  echo -n "🧪 Unit Tests... "

  # Try npm test
  if grep -q "\"test\":" package.json 2>/dev/null; then
    # Run tests with timeout
    timeout 60s npm test --silent 2>&1 >/dev/null
    STATUS=$?

    if [ $STATUS -eq 0 ]; then
      echo "✅ PASS"
      CHECKS_PASSED=$((CHECKS_PASSED + 1))
    elif [ $STATUS -eq 124 ]; then
      echo "⚠️  TIMEOUT (>60s)"
      echo "   Tests too slow or hanging"
      WARNINGS=$((WARNINGS + 1))
    else
      echo "❌ FAIL"
      echo "   Run: npm test"
      CHECKS_FAILED=$((CHECKS_FAILED + 1))
    fi
  else
    echo "⚠️  SKIP (no test script)"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
```

#### Check 4: Secrets Scan (always runs)

```bash
if [ "$SKIP_SECRETS" != true ]; then
  echo -n "🔐 Secrets Scan... "

  # Check staged files for common secret patterns
  SECRETS_FOUND=false

  # Get staged files
  STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)

  if [ -n "$STAGED_FILES" ]; then
    # Scan for API keys, tokens, passwords
    for FILE in $STAGED_FILES; do
      if [ -f "$FILE" ]; then
        # Check for common secret patterns (case-insensitive)
        if grep -iE 'api[_-]?key|api[_-]?secret|password|token|secret[_-]?key|private[_-]?key|aws[_-]?access' "$FILE" | grep -vE '^\s*(#|//|\*)' | grep -qE '=|:'; then
          if ! echo "$FILE" | grep -qE '\.(md|txt|example|sample)$'; then
            SECRETS_FOUND=true
            echo "❌ FAIL"
            echo "   Potential secret in: $FILE"
            echo "   Review and remove sensitive data"
            break
          fi
        fi
      fi
    done
  fi

  if [ "$SECRETS_FOUND" = false ]; then
    echo "✅ PASS"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
  else
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
  fi
fi
```

#### Check 5: TODOs in Critical Files (warning only)

```bash
echo -n "📝 Critical TODOs... "

# Check for TODO/FIXME in files being committed
CRITICAL_TODOS=$(git diff --cached --name-only 2>/dev/null | \
  grep -E '\.(ts|tsx|js|jsx)$' | \
  xargs grep -l 'TODO\|FIXME' 2>/dev/null | wc -l)

if [ "$CRITICAL_TODOS" -gt 0 ]; then
  echo "⚠️  $CRITICAL_TODOS file(s)"
  echo "   Consider addressing TODOs before merging"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ CLEAR"
  CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi
```

### Step 3: Summary Report

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Passed: $CHECKS_PASSED"
echo "❌ Failed: $CHECKS_FAILED"
echo "⚠️  Warnings: $WARNINGS"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo "🎉 All checks passed! Safe to merge."
  echo ""
  exit 0
else
  echo "❌ $CHECKS_FAILED check(s) failed. Fix before merging."
  echo ""
  echo "Quick fixes:"
  if [ "$HAS_TS" = true ]; then
    echo "  - tsc --noEmit       # Check TypeScript"
  fi
  if [ "$HAS_LINT" = true ]; then
    echo "  - eslint . --fix     # Auto-fix lint issues"
  fi
  if [ "$HAS_TESTS" = true ]; then
    echo "  - npm test           # Run tests"
  fi
  echo ""
  exit 1
fi
```

## Configuration

From `.claude/config.json`:

```json
{
  "prd_workflow": {
    "guard": {
      "enabled_checks": ["typescript", "lint", "tests", "secrets", "todos"],
      "auto_fix_lint": false,
      "test_timeout_seconds": 60,
      "strict_mode": false,
      "secret_patterns": [
        "api[_-]?key",
        "api[_-]?secret",
        "password",
        "token",
        "private[_-]?key",
        "aws[_-]?access"
      ]
    }
  }
}
```

## Options

| Flag | Description |
|------|-------------|
| `--ts-only` | Run only TypeScript check |
| `--lint-only` | Run only linter check |
| `--tests-only` | Run only tests |
| `--secrets-only` | Run only secrets scan |
| `--skip-ts` | Skip TypeScript check |
| `--skip-lint` | Skip linter check |
| `--skip-tests` | Skip tests |
| `--skip-secrets` | Skip secrets scan |
| `--fix` | Auto-fix what's fixable (lint) |
| `--strict` | Warnings become failures |

## Examples

**Example 1: Pre-commit check**
```bash
$ /guard

🛡️  Running pre-merge checks...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Running Checks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 TypeScript... ✅ PASS
🧹 ESLint... ✅ PASS
🧪 Unit Tests... ✅ PASS
🔐 Secrets Scan... ✅ PASS
📝 Critical TODOs... ⚠️  2 file(s)
   Consider addressing TODOs before merging

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Passed: 4
❌ Failed: 0
⚠️  Warnings: 1

🎉 All checks passed! Safe to merge.
```

**Example 2: Failed check**
```bash
$ /guard

🛡️  Running pre-merge checks...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Running Checks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 TypeScript... ❌ FAIL
   Run: tsc --noEmit
🧹 ESLint... ✅ PASS
🧪 Unit Tests... ❌ FAIL
   Run: npm test
🔐 Secrets Scan... ✅ PASS
📝 Critical TODOs... ✅ CLEAR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Passed: 3
❌ Failed: 2
⚠️  Warnings: 0

❌ 2 check(s) failed. Fix before merging.

Quick fixes:
  - tsc --noEmit       # Check TypeScript
  - npm test           # Run tests
```

**Example 3: Auto-fix**
```bash
$ /guard --fix

🛡️  Running pre-merge checks...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Running Checks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 TypeScript... ✅ PASS
🧹 ESLint... ❌ FAIL
   Some issues auto-fixed, re-run to check
🧪 Unit Tests... ✅ PASS
🔐 Secrets Scan... ✅ PASS
📝 Critical TODOs... ✅ CLEAR

💡 Lint issues auto-fixed. Re-run /guard to verify.
```

## Integration

Works seamlessly with:
- Git pre-commit hooks (via husky, pre-commit, etc.)
- CI/CD pipelines (GitHub Actions, GitLab CI)
- `/complete-prd` - Run before marking PRD complete
- `/code-prd` - Optional check before Phase 4

## Performance

- ⚡ **Fast**: 5-30 seconds typical (depends on test suite)
- 📦 **Lightweight**: No external dependencies
- 🎯 **Focused**: Only checks what matters

## Best Practices

**When to run /guard**:
- ✅ Before committing
- ✅ Before creating PR
- ✅ Before merging to main
- ✅ After fixing bugs

**When NOT to run**:
- ❌ During active development (too disruptive)
- ❌ On every file save (use watch mode for that)

**Pro tips**:
- Add to git pre-push hook: `git config core.hooksPath .githooks`
- Use `--skip-tests` during rapid iteration
- Use `--fix` to auto-resolve lint issues
- Check /guard output before creating PR

## CI/CD Integration

**GitHub Actions**:
```yaml
# .github/workflows/guard.yml
name: Guard Checks

on: [push, pull_request]

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: /guard
```

**Git Hook** (`.githooks/pre-push`):
```bash
#!/bin/bash
echo "Running pre-push checks..."
/guard || {
  echo ""
  echo "❌ Pre-push checks failed. Push aborted."
  echo "Fix issues or use: git push --no-verify (not recommended)"
  exit 1
}
```

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 0.4.0
Author: CTO Mindset - Pragmatic Tools

**Last Updated**: 2025-11-07
**Philosophy**: Prevent stupid mistakes, not build bureaucracy
