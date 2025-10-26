---
name: dependency-detector
description: Automatic PRD dependency detection and validation
model: haiku
temperature: 0.3
---

# Dependency Detector Skill

Automatically detect dependencies between PRDs.

## Purpose

Identify when a new PRD depends on existing features:
- Detect required foundational features (auth, database, API)
- Find blocking PRDs
- Suggest dependency relationships
- Prevent circular dependencies

## Detection Patterns

### Pattern 1: Explicit Mentions

Scan PRD content for mentions of other PRDs:

```regex
PRD-\d+
```

Example:
```markdown
This feature builds on PRD-003 (User Authentication).
```

→ Detected dependency: PRD-003

### Pattern 2: Keyword-Based Detection

Common dependency patterns:

| Keyword | Likely Dependency |
|---------|------------------|
| "user", "login", "session" | Authentication system |
| "database", "schema", "table" | Database setup |
| "api", "endpoint" | API foundation |
| "payment", "checkout" | Payment integration |
| "email", "notification" | Email service |
| "analytics", "tracking" | Analytics setup |

Example:
```markdown
Title: "User Dashboard with Metrics"

Detects:
  • "user" → Needs authentication (PRD-003)
  • "metrics" → Needs analytics (PRD-008)
```

### Pattern 3: Tech Stack Dependencies

If PRD requires tech not yet in stack:

```markdown
Tech Stack: PostgreSQL, Redis, GraphQL

Checks CLAUDE.md:
  ✓ PostgreSQL: Already setup (PRD-002)
  ✓ Redis: Already setup (PRD-005)
  ✗ GraphQL: Not found → Needs GraphQL setup PRD
```

## Workflow

### Step 1: Scan PRD Content

Extract keywords and references:

```javascript
function extractDependencies(prd) {
  const dependencies = {
    explicit: [],    // PRD-XXX mentions
    implicit: [],    // Keyword-based
    tech: []         // Tech stack needs
  };

  // Explicit PRD references
  const prdMatches = prd.content.match(/PRD-\d+/g);
  dependencies.explicit = [...new Set(prdMatches || [])];

  // Keyword detection
  const keywords = {
    auth: ['user', 'login', 'signup', 'session', 'authentication'],
    database: ['database', 'db', 'schema', 'table', 'query'],
    api: ['api', 'endpoint', 'rest', 'graphql'],
    payment: ['payment', 'stripe', 'checkout', 'billing'],
  };

  for (const [feature, words] of Object.entries(keywords)) {
    if (words.some(w => prd.content.toLowerCase().includes(w))) {
      dependencies.implicit.push(feature);
    }
  }

  return dependencies;
}
```

### Step 2: Match to Existing PRDs

Search for PRDs that provide needed features:

```javascript
function findProviderPRDs(dependencies, allPRDs) {
  const providers = {};

  for (const feature of dependencies.implicit) {
    // Find PRD that implements this feature
    const provider = allPRDs.find(p =>
      p.status === 'complete' &&
      (p.title.toLowerCase().includes(feature) ||
       p.tags.includes(feature))
    );

    if (provider) {
      providers[feature] = provider.id;
    } else {
      providers[feature] = null; // Missing!
    }
  }

  return providers;
}
```

### Step 3: Report Dependencies

```
🔗 Dependencies detected:

1. PRD-003: User Authentication
   Status: ✅ Complete
   → You can use existing auth system

2. PRD-008: Analytics Tracking
   Status: 🚧 In Progress (Day 2)
   ⚠️ Should this PRD depend on PRD-008?

   [Y] Yes, add as dependency (wait for PRD-008)
   [N] No, implement separately
   [S] Soft dependency (optional)

3. GraphQL API (MISSING)
   ❌ No existing GraphQL setup found
   → Consider creating PRD for GraphQL setup first

Add dependencies? [Y/n]
```

## Dependency Types

### Hard Dependency

PRD cannot start until dependency is complete:

```markdown
**Dependencies**:
  - Hard: PRD-003 (User Authentication) - Required
```

PRD is blocked from moving to "in-progress" until PRD-003 is complete.

### Soft Dependency

PRD can start, but better if dependency is done:

```markdown
**Dependencies**:
  - Soft: PRD-008 (Analytics) - Optional
```

Warning shown, but not blocking.

### Circular Dependency Detection

```javascript
function detectCircular(prdId, dependencies, allPRDs) {
  const visited = new Set();
  const stack = [prdId];

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) {
      return true; // Circular!
    }

    visited.add(current);

    const deps = allPRDs.find(p => p.id === current)?.dependencies || [];
    stack.push(...deps);
  }

  return false;
}
```

If circular detected:

```
❌ Circular dependency detected!

PRD-007 depends on PRD-012
PRD-012 depends on PRD-007

This creates a cycle. Please remove one dependency.
```

## Integration Points

### In /create-prd

After user provides description:

```bash
→ Detecting dependencies...

💡 Suggested dependencies:
  • PRD-003 (User Auth) - Hard dependency
  • PRD-008 (Analytics) - Soft dependency

Add these? [Y/n]
```

### In /code-prd

Before starting:

```bash
/code-prd PRD-007

→ Checking dependencies...

⚠️ PRD-007 depends on PRD-003 (User Auth)
   Status: 🚧 In Progress (not complete yet)

Options:
  [W] Wait for PRD-003 to complete
  [C] Continue anyway (may cause issues)
  [R] Remove dependency

Choose: [W/c/r]
```

### In /list-prds

Show dependency chains:

```markdown
## 🚧 In Progress

| PRD ID | Feature | Dependencies | Status |
|--------|---------|--------------|--------|
| PRD-003 | User Auth | - | Day 3 |
| PRD-007 | Dashboard | 🔒 Waiting for PRD-003 | Blocked |
| PRD-012 | API | ✅ All met | Day 1 |
```

## Validation Rules

1. **No circular dependencies**: A → B → A not allowed
2. **Complete dependencies first**: Warn if starting PRD with incomplete deps
3. **Tech stack alignment**: Warn if tech not in existing stack
4. **Orphan detection**: Warn if PRD has no dependencies (unusual for large projects)

## Configuration

```json
{
  "dependency_detection": {
    "enabled": true,
    "auto_detect": true,
    "require_explicit_approval": true,
    "block_on_hard_dependencies": true,
    "warn_on_soft_dependencies": true,
    "detect_circular": true
  }
}
```

## Benefits

- **Prevents blocking issues**: Identify dependencies before starting work
- **Improves planning**: See dependency chains in `/list-prds`
- **Reduces rework**: Don't build features that depend on incomplete work
- **Better estimates**: Factor in dependency completion time
