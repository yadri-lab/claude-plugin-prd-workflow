# Skills Reference

Reference for the 8 reusable skills in PRD Workflow Manager.

## Skills Overview

| Skill | Purpose | Used By |
|-------|---------|---------|
| `git-workflow` | Git operations & worktrees | All commands |
| `testing` | Test creation & coverage | `/work-prd`, `/quality-check` |
| `security-analysis` | Vulnerability detection | `/security-audit` |
| `code-quality` | Linting & complexity | `/quality-check` |
| `documentation` | Docs generation | `/work-prd`, `/create-prd` |
| `estimation` | Effort estimation | `/work-prd`, `/review-prd` |
| `dependency-management` | Package management | `/security-audit`, `/quality-check` |
| `performance-analysis` | Performance optimization | `/quality-check` |

## What Are Skills?

Skills are reusable knowledge modules that agents and commands leverage. Think of them as specialized toolkits.

**Example**: The `git-workflow` skill provides Git expertise that's used by:
- `/code-prd` (create branch & worktree)
- `/orchestrate` (merge strategies)
- `/work-prd` (commit best practices)

---

## Skills Detail

### 1. Git Workflow

**File**: `skills/git-workflow.md`

**Capabilities**:
- Branch management
- Git worktree operations
- Merge strategies
- Conflict resolution
- Commit conventions

**Key Techniques**:
- Worktree creation & cleanup
- Conventional commits
- Squash vs merge vs rebase
- Cherry-picking
- Interactive rebase

**Example**:
```bash
# Create worktree (from skill)
git worktree add ../project-feature feat/PRD-003-feature

# Conventional commit (from skill)
git commit -m "feat(PRD-003): Add Button component

- Implemented variants (primary, secondary, outline)
- Added size props (sm, md, lg)
- 92% test coverage"
```

---

### 2. Testing

**File**: `skills/testing.md`

**Capabilities**:
- Unit testing (Vitest, Jest)
- Integration testing (MSW)
- E2E testing (Playwright)
- Coverage analysis
- Test patterns (AAA, mocks, stubs)

**Testing Pyramid**:
```
   /\
  /E2E\    10%
 /------\
/Integr.\ 20%
/--------\
/  Unit  \ 70%
/----------\
```

**Example**:
```typescript
// From skill: React component test pattern
import { render, screen } from '@testing-library/react';

it('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

### 3. Security Analysis

**File**: `skills/security-analysis.md`

**Capabilities**:
- Dependency scanning (npm audit, Snyk)
- Code vulnerability detection
- Secret detection (patterns, git-secrets)
- OWASP Top 10 compliance
- Security best practices

**Common Vulnerabilities Covered**:
- SQL/NoSQL injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication issues
- Data exposure

**Example**:
```typescript
// From skill: SQL injection prevention
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

// ✅ Fixed (parameterized)
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [req.params.id]);
```

---

### 4. Code Quality

**File**: `skills/code-quality.md`

**Capabilities**:
- ESLint configuration
- Prettier formatting
- TypeScript strictness
- Complexity analysis
- Code duplication detection

**Metrics**:
- Cyclomatic complexity (<15)
- Code coverage (>80%)
- Type coverage (>95%)
- Duplication (<5%)

**Example**:
```json
// From skill: ESLint config
{
  "rules": {
    "complexity": ["error", 15],
    "max-lines-per-function": ["warn", 50]
  }
}
```

---

### 5. Documentation

**File**: `skills/documentation.md`

**Capabilities**:
- README generation
- API documentation (JSDoc, TypeDoc)
- Component docs (Storybook)
- ADRs (Architecture Decision Records)
- Migration guides

**Templates Provided**:
- README template
- API documentation
- Changelog format
- ADR template

**Example**:
```typescript
// From skill: JSDoc example
/**
 * Fetches a user by ID.
 *
 * @param userId - The unique user identifier
 * @returns Promise resolving to user object
 * @throws {UserNotFoundError} When user doesn't exist
 *
 * @example
 * ```typescript
 * const user = await getUser('123');
 * ```
 */
export async function getUser(userId: string): Promise<User> {}
```

---

### 6. Estimation

**File**: `skills/estimation.md`

**Capabilities**:
- Story point estimation (Fibonacci)
- T-shirt sizing (XS-XXL)
- PERT (3-point estimation)
- Historical velocity tracking
- Complexity factors

**Estimation Techniques**:
- Planning poker
- Bottom-up estimation
- Analogous estimation
- Expert judgment

**Example**:
```
Task: API Integration
- Optimistic: 4 hours
- Most Likely: 8 hours
- Pessimistic: 16 hours
- PERT Estimate: (4 + 4×8 + 16) / 6 ≈ 8.7 hours
```

---

### 7. Dependency Management

**File**: `skills/dependency-management.md`

**Capabilities**:
- npm/yarn dependency analysis
- Vulnerability scanning
- Update strategies
- Bundle size optimization
- Tree-shaking

**Tools Covered**:
- npm audit
- Snyk
- bundlephobia
- webpack-bundle-analyzer

**Example**:
```bash
# From skill: Dependency audit
npm audit
npm audit fix

# Bundle size analysis
npx bundlephobia lodash
# Output: 72.4 KB (24.4 KB gzipped)
```

---

### 8. Performance Analysis

**File**: `skills/performance-analysis.md`

**Capabilities**:
- Core Web Vitals (LCP, FID, CLS)
- Bundle optimization
- Runtime performance
- Database query optimization
- Load testing

**Metrics Tracked**:
- LCP (Largest Contentful Paint) <2.5s
- FID (First Input Delay) <100ms
- CLS (Cumulative Layout Shift) <0.1
- Bundle size <300 KB gzipped

**Example**:
```typescript
// From skill: React performance
import { useMemo, useCallback } from 'react';

// Memoize expensive calculation
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Prevent function recreation
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## How to Use Skills

Skills are reference materials. Access them:

1. **During Commands**: Agents automatically use skills
   ```
   /work-prd
   # PRD Implementer agent uses estimation skill
   ```

2. **Manual Reference**: Read skill files directly
   ```bash
   cat skills/git-workflow.md
   # Learn about worktrees
   ```

3. **Copy Patterns**: Use code examples from skills
   ```typescript
   // Copy test pattern from testing skill
   // Adapt to your needs
   ```

---

## Skill Best Practices

### 1. Reference, Don't Memorize

✅ **DO**: Refer to skills when needed
```
Need to set up testing? → Read skills/testing.md
```

❌ **DON'T**: Try to remember everything

### 2. Adapt to Your Context

✅ **DO**: Customize patterns
```typescript
// Skill provides generic pattern
// You adapt to your project
```

❌ **DON'T**: Copy-paste blindly

### 3. Combine Skills

✅ **DO**: Use multiple skills together
```
/work-prd uses:
- estimation (task breakdown)
- git-workflow (commits)
- testing (test creation)
- documentation (comments)
```

---

## Contributing Skills

Skills can be extended! To add a new skill:

1. Create `skills/your-skill.md`
2. Follow existing structure
3. Include code examples
4. Add to this reference
5. Submit PR

**Ideas for New Skills**:
- `api-design.md` - REST API best practices
- `database-design.md` - Schema design patterns
- `ui-ux.md` - UI component patterns
- `deployment.md` - Deployment strategies

---

## See Also

- Individual skill files in `skills/` directory
- [Agents Guide](agents-guide.md) - How agents use skills
- [Commands Reference](commands-reference.md)
- [Best Practices](best-practices.md)
