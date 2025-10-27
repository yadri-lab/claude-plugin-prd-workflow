---
name: dependency-management
description: Package dependency analysis, resolution, and optimization
category: Development Tools
---

# Dependency Management Skill

Provides expertise in managing npm/yarn dependencies, analyzing package sizes, resolving conflicts, and optimizing dependency trees.

## 1. Dependency Analysis

### List Dependencies

```bash
# List all dependencies
npm list

# List only direct dependencies (depth 1)
npm list --depth=0

# List specific package
npm list react

# List outdated packages
npm outdated

# List globally installed packages
npm list -g --depth=0
```

---

### Dependency Tree Visualization

**depcheck**:
```bash
npm install -g depcheck

# Find unused dependencies
depcheck

# Output:
# Unused dependencies
#   - lodash
#   - moment
# Missing dependencies (used but not in package.json)
#   - react-dom
```

**npm-check**:
```bash
npm install -g npm-check

# Interactive update tool
npm-check -u
```

---

## 2. Package Size Analysis

### bundlephobia

**CLI**:
```bash
npx bundlephobia lodash

# Output:
# lodash@4.17.21
# Size: 72.4 kB (24.4 kB gzipped)
# Tree-shakeable: Yes
```

**Website**: [bundlephobia.com](https://bundlephobia.com/)

---

### webpack-bundle-analyzer

**Install**:
```bash
npm install --save-dev webpack-bundle-analyzer
```

**webpack.config.js**:
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
    }),
  ],
};
```

**Run**:
```bash
npm run build
# Opens bundle-report.html showing package sizes visually
```

---

## 3. Dependency Updates

### Safe Updates

**Update patch/minor versions**:
```bash
# Update within semver ranges (respects ^, ~)
npm update

# Update specific package
npm update react

# Update to specific version
npm install react@18.2.0
```

---

### Major Version Updates

**ncu (npm-check-updates)**:
```bash
npm install -g npm-check-updates

# Check for major updates
ncu

# Update package.json (without installing)
ncu -u

# Then install
npm install
```

---

### Update Strategy

**Before Updating**:
1. Check changelog for breaking changes
2. Review migration guides
3. Update in dev environment first
4. Run full test suite
5. Check for deprecation warnings

**Example Workflow**:
```bash
# 1. Create update branch
git checkout -b deps/update-react-18

# 2. Check what's outdated
npm outdated

# 3. Update package.json
ncu -u react react-dom

# 4. Install
npm install

# 5. Run tests
npm test

# 6. Check for warnings
npm run build 2>&1 | grep -i "deprecated\|warning"

# 7. If tests pass, commit
git add package.json package-lock.json
git commit -m "deps: Update React to v18"
```

---

## 4. Dependency Conflicts

### Peer Dependency Conflicts

**Problem**:
```bash
npm ERR! peer dep missing: react@^17.0.0, required by some-library@1.0.0
```

**Solutions**:

**Option 1**: Update dependency
```bash
npm install some-library@latest  # Supports React 18
```

**Option 2**: Use legacy peer deps (npm 7+)
```bash
npm install --legacy-peer-deps
```

**Option 3**: Override (npm 8.3+)
```json
// package.json
{
  "overrides": {
    "some-library": {
      "react": "^18.0.0"
    }
  }
}
```

---

### Duplicate Dependencies

**Detect**:
```bash
npm dedupe --dry-run
```

**Fix**:
```bash
# Deduplicate dependencies
npm dedupe

# Verify
npm list react  # Should show single version
```

---

## 5. Lock Files

### package-lock.json (npm)

**Purpose**:
- Ensures consistent installs across environments
- Locks exact versions (including transitive deps)
- Improves install speed (uses cache)

**Best Practices**:
- ✅ **Always commit** package-lock.json
- ✅ Use `npm ci` in CI/CD (faster, stricter)
- ❌ Don't manually edit package-lock.json

**Regenerate**:
```bash
# If corrupted
rm package-lock.json
npm install
```

---

### yarn.lock (Yarn)

**Similar to package-lock.json**:
```bash
# Equivalent to npm ci
yarn install --frozen-lockfile
```

---

## 6. Dependency Security

### npm audit

**Scan for vulnerabilities**:
```bash
npm audit

# Output:
# found 3 vulnerabilities (1 moderate, 2 high)
```

**Fix automatically**:
```bash
npm audit fix

# Fix breaking changes
npm audit fix --force
```

**Ignore specific vulnerability** (.npmrc):
```
audit-level=moderate  # Only fail on moderate+
```

---

### Snyk

**More comprehensive than npm audit**:
```bash
npm install -g snyk
snyk auth
snyk test
snyk monitor
```

---

## 7. Dependency Optimization

### Tree-Shaking

**Import only what you need**:
```typescript
// ❌ Bad (imports entire library)
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good (tree-shakeable)
import { debounce } from 'lodash-es';
debounce(fn, 300);

// ✅ Even better (individual import)
import debounce from 'lodash/debounce';
```

---

### Replace Heavy Dependencies

**Examples**:

| Heavy | Lightweight | Savings |
|-------|-------------|---------|
| moment (72KB) | date-fns (12KB) | 60KB |
| lodash (72KB) | Native JS | 72KB |
| axios (13KB) | fetch (native) | 13KB |
| jquery (89KB) | Native DOM | 89KB |

**Replace moment with date-fns**:
```typescript
// Before (moment)
import moment from 'moment';
const formatted = moment().format('YYYY-MM-DD');

// After (date-fns)
import { format } from 'date-fns';
const formatted = format(new Date(), 'yyyy-MM-dd');
```

---

### Lazy Loading

**Dynamic imports**:
```typescript
// ❌ Eager load (always loaded)
import { HeavyComponent } from './HeavyComponent';

// ✅ Lazy load (loaded on demand)
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 8. Workspace Management (Monorepos)

### npm Workspaces

**package.json** (root):
```json
{
  "name": "my-monorepo",
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**Directory Structure**:
```
monorepo/
  package.json
  packages/
    ui/
      package.json
    utils/
      package.json
  apps/
    web/
      package.json
    api/
      package.json
```

**Install all workspaces**:
```bash
npm install
```

**Run script in workspace**:
```bash
npm run build --workspace=packages/ui
```

**Add dependency to workspace**:
```bash
npm install react --workspace=apps/web
```

---

## 9. Dependency Policies

### Allowed/Blocked Packages

**.npmrc**:
```
# Block specific package
banned-packages=moment,request

# Require approval for new deps
package-approval=required
```

---

### License Compliance

**license-checker**:
```bash
npm install -g license-checker

# List all licenses
license-checker --summary

# Output:
# MIT: 450
# Apache-2.0: 32
# BSD-3-Clause: 15
# GPL-3.0: 1  ← WARNING
```

**Block GPL licenses** (.npmrc):
```
license-filter=MIT,Apache-2.0,BSD-3-Clause
```

---

## 10. Best Practices

### Dependency Hygiene

✅ **DO**:
- Keep dependencies up-to-date (monthly reviews)
- Remove unused dependencies
- Use exact versions for critical deps
- Commit lock files
- Run `npm audit` regularly
- Document why each dependency is needed

❌ **DON'T**:
- Install packages without reviewing
- Use `--force` without understanding why
- Ignore security warnings
- Install global packages (use `npx` instead)
- Commit `node_modules/`

---

### Version Pinning Strategy

**package.json strategies**:
```json
{
  "dependencies": {
    "react": "18.2.0",        // Exact version (critical deps)
    "lodash": "^4.17.21",     // Caret (allow patches + minors)
    "axios": "~1.3.0"         // Tilde (allow patches only)
  },
  "devDependencies": {
    "eslint": "*"             // Latest (dev tools, less critical)
  }
}
```

**When to use**:
- **Exact** (`18.2.0`): Critical deps (React, payment SDKs)
- **Caret** (`^1.0.0`): Most deps (safe with semver)
- **Tilde** (`~1.0.0`): Conservative (only patches)
- **Latest** (`*`): Dev tools (linters, formatters)

---

### Dependency Review Checklist

Before adding new dependency:
- [ ] Is it actively maintained? (recent commits, releases)
- [ ] How many weekly downloads? (>10k preferred)
- [ ] License compatible? (MIT, Apache, BSD)
- [ ] Bundle size acceptable? (<50KB gzipped)
- [ ] TypeScript types available?
- [ ] Good documentation?
- [ ] Stable API? (v1.0+)
- [ ] Can I implement this in <2 hours? (if yes, skip dep)

---

## 11. Useful Commands Cheatsheet

```bash
# Install
npm install <package>          # Add to dependencies
npm install -D <package>       # Add to devDependencies
npm install -g <package>       # Install globally
npx <package>                  # Run without installing

# Remove
npm uninstall <package>

# Update
npm update                     # Update within semver
npm outdated                   # Check for updates
ncu -u                         # Update major versions

# Audit
npm audit                      # Security scan
npm audit fix                  # Auto-fix vulnerabilities

# Clean
npm cache clean --force        # Clear cache
rm -rf node_modules package-lock.json && npm install  # Fresh install

# Info
npm list                       # Dependency tree
npm list --depth=0             # Direct deps only
npm view <package>             # Package info
npm view <package> versions    # Available versions

# Dedupe
npm dedupe                     # Remove duplicate deps

# CI/CD
npm ci                         # Fast, strict install (use in CI)
```

---

## Related

- Commands: `/security-audit` (checks vulnerabilities)
- Agents: `orchestrator` (manages dependencies across PRDs)
- Skills: `security-analysis`
