---
name: code-quality
description: Code quality analysis including linting, complexity, and maintainability
category: Quality Assurance
---

# Code Quality Skill

Provides expertise in maintaining high code quality through linting, complexity analysis, code style enforcement, and maintainability metrics.

## 1. Linting & Formatting

### ESLint Configuration

**.eslintrc.json**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks", "import"],
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc" }
    }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

**Run Linting**:
```bash
# Check
npx eslint . --ext .ts,.tsx

# Fix auto-fixable issues
npx eslint . --ext .ts,.tsx --fix

# JSON output for parsing
npx eslint . --ext .ts,.tsx --format json > eslint-report.json
```

---

### Prettier Configuration

**.prettierrc.json**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**.prettierignore**:
```
node_modules
dist
build
.next
coverage
*.min.js
```

**Run Formatting**:
```bash
# Check formatting
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"

# Fix formatting
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
```

---

## 2. Code Complexity Analysis

### Cyclomatic Complexity

**ESLint Complexity Rule**:
```json
{
  "rules": {
    "complexity": ["error", 15]  // Max 15 decision paths
  }
}
```

**Example**:
```typescript
// Complexity: 9 (too high)
function processOrder(order: Order) {
  if (order.status === 'pending') {
    if (order.paymentMethod === 'credit_card') {
      if (order.amount > 1000) {
        // complexity +1
        if (order.user.verified) {
          // complexity +1
          // ...
        }
      }
    } else if (order.paymentMethod === 'paypal') {
      // complexity +1
      // ...
    }
  }
  return result;
}

// Refactored (complexity: 3)
function processOrder(order: Order) {
  const processor = getPaymentProcessor(order.paymentMethod);
  const validator = getValidator(order);

  if (!validator.isValid(order)) {
    throw new ValidationError();
  }

  return processor.process(order);
}
```

---

### Cognitive Complexity

**SonarQube Integration**:
```yaml
# sonar-project.properties
sonar.projectKey=acmecorp
sonar.sources=src
sonar.exclusions=**/*.test.ts,**/*.spec.ts
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

**Run Analysis**:
```bash
npx sonar-scanner
```

**Metrics**:
- Cognitive Complexity (how hard to understand)
- Cyclomatic Complexity (number of paths)
- Code Smells (maintainability issues)
- Technical Debt (estimated time to fix issues)

---

## 3. Code Metrics

### Lines of Code (LOC)

**cloc** (Count Lines of Code):
```bash
# Install
npm install -g cloc

# Run
cloc src/

# Output:
# Language  files  blank  comment  code
# --------------------------------
# TypeScript  45    520     180    2450
# JSON         8     10       0     450
# Markdown     3     45      20     120
```

---

### Maintainability Index

**Formula**: `171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)`

Where:
- HV = Halstead Volume
- CC = Cyclomatic Complexity
- LOC = Lines of Code

**Scale**:
- 100-20: High maintainability (green)
- 20-10: Medium maintainability (yellow)
- <10: Low maintainability (red)

**TypeScript Analyzer**:
```bash
npm install -g ts-complex

ts-complex src/**/*.ts
```

---

## 4. Code Duplication

### jscpd (Copy/Paste Detector)

```bash
# Install
npm install -g jscpd

# Run
jscpd src/

# Output:
# Duplications detection: Found 3 clones
# Files: 45
# Lines: 2450
# Duplicated lines: 120 (4.9%)
```

**Config** (.jscpd.json):
```json
{
  "threshold": 5,
  "reporters": ["html", "console"],
  "ignore": [
    "**/node_modules/**",
    "**/*.test.ts"
  ],
  "format": ["typescript", "javascript"],
  "minLines": 5,
  "minTokens": 50
}
```

---

## 5. Type Coverage (TypeScript)

**type-coverage**:
```bash
# Install
npm install --save-dev type-coverage

# Run
npx type-coverage

# Output:
# 2245 / 2280 98.46%
# type-coverage success.
```

**Config** (package.json):
```json
{
  "typeCoverage": {
    "atLeast": 95,
    "ignoreFiles": [
      "**/*.test.ts",
      "**/*.spec.ts"
    ]
  }
}
```

---

## 6. Import Organization

**ESLint Import Plugin**:
```json
{
  "rules": {
    "import/order": ["error", {
      "groups": [
        "builtin",      // Node built-ins (fs, path)
        "external",     // npm packages
        "internal",     // Aliased imports (@/)
        ["parent", "sibling", "index"]
      ],
      "pathGroups": [
        {
          "pattern": "react",
          "group": "external",
          "position": "before"
        },
        {
          "pattern": "@/**",
          "group": "internal"
        }
      ],
      "pathGroupsExcludedImportTypes": ["builtin"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    "import/no-duplicates": "error",
    "import/no-unused-modules": "warn",
    "import/no-cycle": "error"
  }
}
```

**Example**:
```typescript
// ✅ Correct import order
import { useState, useEffect } from 'react';

import { debounce } from 'lodash';
import axios from 'axios';

import { formatDate } from '@/utils/date';
import { API_URL } from '@/config';

import { UserService } from '../services/UserService';

import { Button } from './Button';
import type { ButtonProps } from './Button.types';
```

---

## 7. Code Review Checklist

### Automated Checks

- [ ] Linting passes (0 errors)
- [ ] Formatting passes (Prettier)
- [ ] TypeScript compiles (no errors)
- [ ] Tests pass (100%)
- [ ] Coverage meets threshold (>80%)
- [ ] No high-complexity functions (>15)
- [ ] No code duplication (>5%)
- [ ] Type coverage >95%

### Manual Review

**Readability**:
- [ ] Code is self-documenting
- [ ] Variable names are descriptive
- [ ] Functions do one thing
- [ ] Magic numbers extracted to constants

**Design**:
- [ ] Follows SOLID principles
- [ ] No premature optimization
- [ ] Appropriate abstractions
- [ ] Separation of concerns

**Error Handling**:
- [ ] All errors handled
- [ ] No silent failures
- [ ] Meaningful error messages
- [ ] Proper logging

**Security**:
- [ ] Input validated
- [ ] Output escaped
- [ ] No hardcoded secrets
- [ ] Auth/authz checks in place

**Performance**:
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms
- [ ] Lazy loading where appropriate
- [ ] Memoization where needed

---

## 8. Code Smells to Avoid

### Long Method/Function

```typescript
// ❌ Code Smell (100 lines)
function processUserData(user: User) {
  // 100 lines of complex logic
}

// ✅ Refactored
function processUserData(user: User) {
  const validated = validateUser(user);
  const enriched = enrichUserData(validated);
  const transformed = transformUserData(enriched);
  return transformed;
}
```

---

### Large Class

```typescript
// ❌ Code Smell (500 lines, 30 methods)
class UserService {
  // 500 lines
}

// ✅ Refactored (Single Responsibility)
class UserAuthService {}
class UserProfileService {}
class UserNotificationService {}
```

---

### Too Many Parameters

```typescript
// ❌ Code Smell
function createUser(
  name: string,
  email: string,
  password: string,
  age: number,
  country: string,
  phone: string
) {}

// ✅ Refactored (Object parameter)
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  age: number;
  country: string;
  phone: string;
}

function createUser(params: CreateUserParams) {}
```

---

### Deep Nesting

```typescript
// ❌ Code Smell (5 levels deep)
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (resource.isAvailable) {
        if (timeSlot.isFree) {
          // action
        }
      }
    }
  }
}

// ✅ Refactored (Guard clauses)
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
if (!resource.isAvailable) return;
if (!timeSlot.isFree) return;

// action
```

---

### Magic Numbers

```typescript
// ❌ Code Smell
setTimeout(() => {}, 86400000);
if (age < 18) {}

// ✅ Refactored
const ONE_DAY_MS = 86400000;
const MINIMUM_AGE = 18;

setTimeout(() => {}, ONE_DAY_MS);
if (age < MINIMUM_AGE) {}
```

---

## 9. Quality Gates (CI)

**GitHub Actions**:
```yaml
name: Code Quality

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Type check
        run: npm run type-check

      - name: Complexity check
        run: npx eslint . --rule 'complexity: [error, 15]'

      - name: Duplication check
        run: npx jscpd src/ --threshold 5

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Code quality checks passed!'
            })
```

---

## 10. Editor Integration

### VSCode Settings

**.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**.vscode/extensions.json**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## Best Practices

1. **Automate everything**: Use pre-commit hooks
2. **Fail fast**: Block PRs that don't meet quality gates
3. **Incremental improvement**: Don't rewrite everything at once
4. **Team agreement**: Align on style guide
5. **Document exceptions**: When breaking rules, explain why
6. **Regular reviews**: Review and update quality standards quarterly

---

## Related

- Commands: `/quality-check` (runs all quality checks)
- Agents: `quality-assurance` (analyzes results)
- Skills: `testing`, `security-analysis`
