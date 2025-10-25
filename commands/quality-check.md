---
name: quality-check
description: Run comprehensive code quality analysis
category: Security & Quality
---

# Quality Check Command

Perform comprehensive code quality analysis including linting, testing, complexity, and performance.

## Purpose

Ensure code meets quality standards before PR/merge:
- Code style and linting (ESLint, Prettier)
- Test coverage and passing tests
- Code complexity metrics
- Performance benchmarks
- Documentation coverage
- Bundle size analysis

## Workflow

### Step 1: Determine Scope

```markdown
📊 **Code Quality Check**

Scope options:
1. 🎯 Current PRD changes (git diff)
2. 📦 Entire codebase
3. 📂 Specific directory

Select scope: (1-3)
```

### Step 2: Linting Analysis

Run configured linters:
```bash
# ESLint
npx eslint . --ext .ts,.tsx,.js,.jsx --format json

# Prettier
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"

# TypeScript
npx tsc --noEmit
```

Report:
- Error count
- Warning count
- Auto-fixable issues
- Manual fixes needed

### Step 3: Test Execution

Run test suites:
```bash
# Unit tests
npm test -- --coverage --json

# Integration tests (if configured)
npm run test:integration

# E2E tests (if configured)
npm run test:e2e
```

Analyze:
- Total tests (passed/failed)
- Coverage percentage (lines, branches, functions)
- Slow tests (>1s)
- Flaky tests

### Step 4: Code Complexity Analysis

Calculate complexity metrics:
```bash
# Complexity analysis (using eslint-plugin-complexity)
npx eslint . --rule 'complexity: [error, 10]' --format json
```

Report:
- Average cyclomatic complexity
- Functions exceeding threshold (>15)
- Most complex functions (top 10)
- Suggested refactoring targets

### Step 5: Performance Metrics

Analyze bundle size and performance:
```bash
# Bundle size
npm run build
npx bundlesize

# Type check performance
time npx tsc --noEmit
```

Report:
- Bundle size (current vs target)
- Largest dependencies
- Build time
- Type check time

### Step 6: Documentation Coverage

Check documentation:
- JSDoc coverage for public APIs
- README completeness
- Component stories (Storybook)
- API documentation
- Migration guides (if breaking changes)

### Step 7: Generate Quality Report

```markdown
📊 **Code Quality Report - PRD-003: Design System**

**Date**: 2025-10-25
**Scope**: feat/PRD-003-design-system (18 files, 2,450 LOC)
**Grade**: A- (87/100)

---

## ✅ Linting & Style

### ESLint
- ✅ **Errors**: 0
- ⚠️ **Warnings**: 3 (all auto-fixable)
- **Auto-fix available**: Run `npm run lint -- --fix`

**Warnings**:
- `packages/ui/src/components/Button.tsx:45` - Unused variable 'variant'
- `packages/ui/src/components/Input.tsx:23` - Missing dependency in useEffect
- `packages/ui/src/utils/cn.ts:12` - Prefer const assertion

### Prettier
- ✅ **Formatted**: 100%
- **Files**: 18/18 compliant

### TypeScript
- ✅ **Errors**: 0
- ✅ **Strict mode**: Enabled
- **Type coverage**: 98.5%

**Score**: 9.5/10

---

## 🧪 Testing

### Unit Tests
- ✅ **Tests**: 42 passed, 0 failed
- ✅ **Coverage**: 87.3% (target: 80%)
  - Lines: 88.1%
  - Branches: 85.2%
  - Functions: 89.5%
  - Statements: 87.9%
- ⚡ **Duration**: 3.2s (fast!)
- ✅ **Flaky tests**: 0

**Coverage by File**:
| File | Coverage | Missing |
|------|----------|---------|
| Button.tsx | 95% | Error state handler |
| Input.tsx | 92% | Async validation |
| Select.tsx | 85% | Edge cases |
| Card.tsx | 100% | - |

**Slow Tests** (>500ms):
- None! All tests fast ⚡

**Score**: 9/10

---

## 🎯 Code Complexity

### Metrics
- ✅ **Average Complexity**: 4.2 (excellent, <5)
- ✅ **Max Complexity**: 9 (acceptable, <15)
- **Functions >10 complexity**: 0

**Most Complex Functions** (all acceptable):
1. `parseVariants` - 9 (packages/ui/src/utils/variants.ts:24)
2. `validateInput` - 7 (packages/ui/src/components/Input.tsx:56)
3. `mergeRefs` - 6 (packages/ui/src/utils/refs.ts:12)

**Recommendations**: None, complexity is well-managed ✅

**Score**: 10/10

---

## 📦 Bundle Size

### Production Build
- ✅ **Total**: 42.3 KB gzipped (target: <50 KB)
- ✅ **Code**: 28.1 KB
- ✅ **Dependencies**: 14.2 KB

**Largest Dependencies**:
1. `clsx` - 4.2 KB (used for className merging)
2. `@radix-ui/react-slot` - 3.8 KB (primitives)
3. `class-variance-authority` - 3.1 KB (variant generation)

**Tree-shaking**: ✅ Verified (reduced from 68 KB)

**Score**: 9.5/10

---

## ⚡ Performance

### Build Performance
- ✅ **Build time**: 12.3s (fast)
- ✅ **Type check**: 2.1s
- ✅ **Lint time**: 3.4s

### Runtime Performance (from tests)
- ✅ **Render time**: 18ms avg (target: <50ms)
- ✅ **Re-render time**: 6ms avg
- ✅ **Mount time**: 24ms avg

**Score**: 9/10

---

## 📚 Documentation

### Coverage
- ✅ **JSDoc comments**: 95% of public APIs
- ✅ **README.md**: Complete
- ✅ **Storybook stories**: 8/8 components (100%)
- ⚠️ **Migration guide**: Missing
- ✅ **TypeScript types**: Fully documented

**Missing Documentation**:
- Migration guide from old component library
- Design token documentation

**Score**: 8.5/10

---

## 🎯 Overall Summary

| Category | Score | Grade |
|----------|-------|-------|
| Linting & Style | 9.5/10 | A |
| Testing | 9.0/10 | A |
| Code Complexity | 10/10 | A+ |
| Bundle Size | 9.5/10 | A |
| Performance | 9.0/10 | A |
| Documentation | 8.5/10 | B+ |

**Overall Grade**: A- (87/100)

**Quality Level**: Production-ready ✅

---

## 🛠️ Recommended Actions

### Before Merge (Optional)
1. Fix 3 ESLint warnings: `npm run lint -- --fix`
2. Add migration guide to docs/
3. Document design tokens in README

### Nice to Have
- Increase Input.tsx coverage to 95%+ (async validation tests)
- Add visual regression tests (Chromatic/Percy)
- Performance monitoring (bundle size CI check)

---

## 🔧 Quick Fixes

Would you like me to:
1. Auto-fix linting warnings? (Y/n)
2. Generate migration guide template? (Y/n)
3. Add missing JSDoc comments? (Y/n)
```

### Step 8: Offer Auto-Fix

If user approves:
```bash
# Fix linting
npm run lint -- --fix

# Format code
npm run format

# Commit
git add .
git commit -m "chore: Fix code quality issues

- Fixed 3 ESLint warnings
- Formatted all files with Prettier
- Added missing JSDoc comments

🤖 Generated by /quality-check"
```

### Step 9: Save Report

Save to `.claude/quality-check-{date}.md`.

## Configuration

Uses these config settings:
```json
{
  "quality": {
    "enabled": true,
    "linting": {
      "enabled": true,
      "auto_fix": false
    },
    "testing": {
      "enabled": true,
      "coverage_threshold": 80
    },
    "code_complexity": {
      "enabled": true,
      "max_complexity": 15,
      "warn_threshold": 10
    }
  }
}
```

## Success Criteria

- All quality checks completed
- Clear grade assigned (A-F)
- Actionable recommendations provided
- Auto-fix applied (if requested)
- Report saved for historical tracking

## Related

- Agent: `quality-assurance` (invoked for analysis)
- Skill: `code-quality`, `testing`
- Command: `/security-audit` (complementary)
