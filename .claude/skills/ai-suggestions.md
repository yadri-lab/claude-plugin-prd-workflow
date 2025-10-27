---
name: ai-suggestions
description: AI-powered PRD suggestions and pattern detection
model: sonnet
temperature: 0.5
---

# AI Suggestions Skill

Intelligent PRD analysis and suggestions based on historical patterns.

## Purpose

Provide AI-powered insights during PRD creation and review:
- Detect similar past PRDs
- Suggest reusable tech stack choices
- Recommend acceptance criteria from similar features
- Identify missing requirements

## Capabilities

### 1. Similar PRD Detection

When user creates new PRD, scan all past PRDs to find similar ones:

**Algorithm**:
1. Extract key concepts from new PRD title/description
2. Scan all completed PRDs for keyword matches
3. Calculate similarity score (0-100%)
4. Return top 3 most similar PRDs

**Output**:
```
💡 Similar PRD found: PRD-002 (PayPal integration) - 70% similar

Would you like to:
  [1] Reuse tech stack from PRD-002? (Express + Stripe SDK)
  [2] Import acceptance criteria? (12 criteria found)
  [3] Copy "Out of Scope" section?
  [4] Skip (start fresh)
```

### 2. Tech Stack Recommendations

Based on:
- Existing project tech stack (from CLAUDE.md)
- Past PRDs with similar features
- Current best practices

**Example**:
```
🛠️ Tech Stack Recommendations:

**Based on your existing stack** (Next.js + TypeScript):

Option 1: Socket.io (Recommended) ⭐
  Pros:
    • Easy integration with Next.js
    • You used it successfully in PRD-012
    • Fallback to polling if WebSocket fails
  Cons:
    • Adds 200KB to bundle

Option 2: Pusher
  Pros:
    • Managed service (no infra)
    • 100% reliability
  Cons:
    • Costs $49/mo for your scale

Which option? [1/2]
```

### 3. Acceptance Criteria Suggestions

Suggest common criteria based on feature type:

**Pattern Detection**:
- "auth" → Suggest security, session management, logout criteria
- "payment" → Suggest PCI compliance, error handling, receipts
- "dashboard" → Suggest loading states, empty states, responsiveness
- "API" → Suggest rate limiting, docs, versioning, error codes

**Example**:
```
📋 Suggested Acceptance Criteria:

Based on similar PRDs (PRD-003, PRD-007):

P0 (Must-Have):
  • User can log in with email/password
  • Session persists for 30 days
  • User can log out
  • Passwords hashed with bcrypt

P1 (Should-Have):
  • "Remember me" option
  • Password strength indicator
  • Email verification

Add all? [Y/n]
```

### 4. Scope Creep Detection

During `/review-prd`, detect features mentioned but not in acceptance criteria:

**Analysis**:
1. Extract all features mentioned in PRD (Implementation Notes, Tech Approach, etc.)
2. Compare with Acceptance Criteria section
3. Flag mismatches

**Example**:
```
⚠️ Scope Creep Detected:

This PRD mentions features not in acceptance criteria:

1. "Users can customize notification sounds"
   Found in: Implementation Notes (line 45)
   Risk: Medium (adds 2-3 days)

   Action:
     [A] Add to acceptance criteria (P2)
     [D] Defer to v2 (recommend)
     [K] Keep as implementation detail

2. "Admin can bulk delete users"
   Found in: Technical Approach (line 78)
   Risk: High (security implications, adds 5 days)

   Action:
     [D] Defer to separate PRD (recommend)
```

## Implementation Patterns

### Similarity Scoring

```javascript
function calculateSimilarity(newPRD, existingPRD) {
  const newKeywords = extractKeywords(newPRD.title + " " + newPRD.description);
  const existingKeywords = extractKeywords(existingPRD.title + " " + existingPRD.description);

  const intersection = newKeywords.filter(k => existingKeywords.includes(k));
  const union = [...new Set([...newKeywords, ...existingKeywords])];

  const jaccardSimilarity = intersection.length / union.length;

  // Boost score if same domain (auth, payment, API, etc.)
  const domainMatch = detectDomain(newPRD) === detectDomain(existingPRD);
  const finalScore = jaccardSimilarity * (domainMatch ? 1.5 : 1);

  return Math.min(finalScore * 100, 100); // 0-100%
}
```

### Keyword Extraction

```javascript
function extractKeywords(text) {
  // Remove stop words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', ...];

  // Tokenize
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));

  // Stem (simple)
  return words.map(stemWord);
}

function stemWord(word) {
  // Simple stemming: remove common suffixes
  return word
    .replace(/(ing|ed|s)$/, '')
    .replace(/ies$/, 'y');
}
```

### Domain Detection

```javascript
function detectDomain(prd) {
  const text = (prd.title + " " + prd.description).toLowerCase();

  const domains = {
    auth: ['auth', 'login', 'signup', 'oauth', 'session', 'password'],
    payment: ['payment', 'stripe', 'checkout', 'billing', 'invoice'],
    api: ['api', 'endpoint', 'rest', 'graphql', 'webhook'],
    dashboard: ['dashboard', 'analytics', 'metrics', 'chart', 'report'],
    mobile: ['mobile', 'ios', 'android', 'app', 'native'],
  };

  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(k => text.includes(k))) {
      return domain;
    }
  }

  return 'general';
}
```

## Usage in Commands

### During /create-prd

After user provides title and description:

```bash
→ Analyzing similar PRDs...

💡 Found similar feature: PRD-002 (PayPal Integration)

Reuse decisions from PRD-002?
  • Tech stack: Express.js + Stripe SDK
  • Database: PostgreSQL
  • Queue: Bull (Redis)

Import? [Y/n]
```

### During /review-prd

After PRD is scanned:

```bash
→ Running AI analysis...

✅ No scope creep detected
✅ All acceptance criteria clear
💡 Suggested tech stack: Next.js + Vercel (matches existing stack)
```

## Configuration

```json
{
  "ai_suggestions": {
    "enabled": true,
    "similarity_threshold": 0.6,
    "auto_suggest_tech_stack": true,
    "auto_detect_scope_creep": true,
    "suggest_acceptance_criteria": true,
    "max_suggestions": 3
  }
}
```

## Performance

- Similarity scan: <200ms for 100 PRDs
- Scope creep detection: <100ms per PRD
- No external API calls (all local analysis)

## Best Practices

1. **Always show confidence score**: Let user know how confident the suggestion is
2. **Provide context**: Explain WHY suggesting something
3. **Make it optional**: User can always skip suggestions
4. **Learn from feedback**: Track which suggestions users accept/reject
