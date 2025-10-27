---
name: recall
description: Search past PRDs and decisions with full-text and semantic search
category: Memory
---

# Recall Command

Search project history for past PRDs, decisions, and learnings.

## Purpose

Enable quick access to historical context:
- Find similar past features ("How did we implement OAuth?")
- Recall technical decisions ("What database schema did we use?")
- Learn from past blockers ("What issues came up with Stripe integration?")
- Discover reusable patterns ("Show me all API implementations")

## Usage

### Basic Search (Full-Text)

```bash
/recall "OAuth implementation"
/recall "Stripe payment"
/recall "database schema"
```

### Filters

```bash
# Search only completed PRDs
/recall "authentication" --status=complete

# Search by priority
/recall "feature" --priority=P0

# Search by date range
/recall "api" --since=30d
/recall "bug" --before=2025-10-01

# Search specific PRD
/recall "performance" --prd=PRD-003
```

### Semantic Search (Optional)

```bash
# Find similar features (requires embeddings)
/recall --similar-to=PRD-003
/recall --similar-to="real-time chat"
```

## Workflow

### Step 1: Initialize Memory Index (First Run)

On first use, create SQLite FTS5 index:

```bash
→ Initializing search index...
→ Scanning product/prds/...
  • Found 25 PRDs
  • Indexing content...
  • Building FTS5 index...
✓ Index created (.claude/memory/index.db)

This will speed up future searches significantly.
```

Index updates automatically when PRDs change.

### Step 2: Full-Text Search

Search using SQLite FTS5:

```sql
SELECT
  prd_id,
  name,
  status,
  priority,
  snippet(prds_fts, -1, '<mark>', '</mark>', '...', 30) AS snippet,
  rank
FROM prds_fts
WHERE prds_fts MATCH 'oauth OR authentication'
ORDER BY rank
LIMIT 10;
```

### Step 3: Rank and Display Results

Show most relevant PRDs:

```
🔍 Search Results for "OAuth implementation"

Found 3 matches:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 PRD-003: User Authentication System
✅ Status: Complete | P0 | Completed 2 months ago

🔑 Key Decisions:
  • Used OAuth 2.0 with PKCE flow
  • Chose NextAuth.js over Passport.js
  • Token refresh every 30 minutes
  • Stored refresh tokens in HttpOnly cookies

⚠️ Blockers Encountered:
  • CORS issues with Google OAuth (fixed with proxy)
  • Token rotation edge cases (solved in v1.1)
  • Safari third-party cookie restrictions (used workaround)

💡 Learnings:
  • Always test token expiration scenarios
  • Document OAuth redirect URLs clearly
  • Consider token security vs UX tradeoffs

📎 Related PRDs:
  • PRD-007: SSO Integration (similar pattern)
  • PRD-012: API Authentication (depends on this)

📄 File: product/prds/05-complete/241015-user-auth-PRD-003-v1.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 PRD-007: SSO Integration
🚧 Status: In Progress | P1 | Day 3

Snippet: "...building on <mark>OAuth</mark> foundation from PRD-003, add SAML..."

📄 File: product/prds/04-in-progress/241020-sso-PRD-007-v1.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 PRD-012: Third-Party API Auth
✅ Status: Ready | P0

Snippet: "...reuse <mark>OAuth</mark> client credentials flow for API-to-API..."

📄 File: product/prds/03-ready/241023-api-auth-PRD-012-v1.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Actions:
  • View PRD-003: Read PRD-003 file
  • Copy decision: "Used OAuth 2.0 with PKCE flow"
  • Find more: /recall "authentication" --status=complete
```

### Step 4: Semantic Search (Optional)

If embeddings are enabled, use vector similarity:

```bash
/recall --similar-to=PRD-003

→ Finding similar PRDs...
→ Using embeddings for semantic search...

Found 4 similar PRDs (by concept, not keywords):

1. PRD-007: SSO Integration (89% similar)
   Reason: Both involve authentication flows

2. PRD-015: Password Reset (76% similar)
   Reason: User identity verification

3. PRD-021: API Keys Management (68% similar)
   Reason: Authentication credentials

4. PRD-009: User Permissions (61% similar)
   Reason: Authorization system
```

## Memory Index Structure

```
.claude/memory/
  ├── index.db                    # SQLite FTS5 full-text index
  ├── embeddings/                 # Vector embeddings (optional)
  │   ├── PRD-003.json
  │   ├── PRD-007.json
  │   └── index.json
  │
  ├── compressed/                 # Archived conversations (future)
  │   ├── 2025-10-01.jsonl.gz
  │   └── 2025-10-15.jsonl.gz
  │
  └── config.json                 # Memory settings
```

### SQLite Schema

```sql
-- Main PRD content table
CREATE TABLE prds (
  prd_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT,
  grade TEXT,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FTS5 full-text search table
CREATE VIRTUAL TABLE prds_fts USING fts5(
  prd_id UNINDEXED,
  name,
  content,
  decisions,
  blockers,
  learnings,
  tech_stack,
  tokenize = 'porter unicode61'
);

-- Trigger to keep FTS in sync
CREATE TRIGGER prds_ai AFTER INSERT ON prds BEGIN
  INSERT INTO prds_fts (prd_id, name, content, decisions, blockers, learnings, tech_stack)
  VALUES (new.prd_id, new.name, new.content, ...);
END;

-- Index for filters
CREATE INDEX idx_prds_status ON prds(status);
CREATE INDEX idx_prds_priority ON prds(priority);
CREATE INDEX idx_prds_completed_at ON prds(completed_at);
```

## Embeddings (Optional)

For semantic search, generate embeddings using OpenAI API:

```javascript
// Generate embedding for PRD
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: prd.content
});

// Save to .claude/memory/embeddings/PRD-003.json
{
  "prd_id": "PRD-003",
  "embedding": [0.123, -0.456, ...], // 1536 dimensions
  "generated_at": "2025-10-26T10:00:00Z"
}

// Find similar PRDs using cosine similarity
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}
```

**Note**: Embeddings are optional and require OpenAI API key. Falls back to FTS5 only if not configured.

## Auto-Index Updates

Index updates automatically when:
- New PRD created (`/create-prd`)
- PRD status changes (`/code-prd`, `/complete-prd`)
- PRD content edited

```bash
# Manual reindex (if needed)
/recall --reindex

→ Rebuilding search index...
→ Scanning all PRDs...
  • Found 30 PRDs (5 new, 2 updated)
  • Updating index...
✓ Index updated
```

## Search Tips

### Keyword Search

```bash
# Multiple keywords (OR)
/recall "stripe OR payment OR billing"

# Phrase search
/recall '"database schema design"'

# Exclude terms
/recall "api -graphql"

# Prefix matching
/recall "auth*"  # Matches: auth, authentication, authorize, etc.
```

### Field-Specific Search

```bash
# Search only in decisions
/recall "decisions:postgres"

# Search only in blockers
/recall "blockers:cors"

# Search only in tech stack
/recall "tech_stack:nextjs"
```

### Date Filters

```bash
# Last 30 days
/recall "feature" --since=30d

# Last 3 months
/recall "api" --since=3m

# Before specific date
/recall "bug" --before=2025-10-01

# Date range
/recall "integration" --since=2025-09-01 --before=2025-10-01
```

## Configuration

```json
{
  "memory": {
    "enabled": true,
    "index_path": ".claude/memory/index.db",
    "embeddings_enabled": false,
    "embeddings_model": "text-embedding-3-small",
    "auto_index": true,
    "max_results": 10,
    "snippet_length": 150
  }
}
```

## Performance

- **FTS5 Search**: <10ms for 1000+ PRDs
- **Index Size**: ~1MB per 100 PRDs
- **Embeddings**: ~6KB per PRD (if enabled)
- **Auto-indexing**: <100ms per PRD update

## Error Handling

### Index Not Found

```
ℹ️ Search index not found

Creating index for the first time...
→ Scanning product/prds/...
→ Indexing 25 PRDs...
✓ Index created

Now searching...
```

### No Results

```
🔍 No results found for "xyz"

Suggestions:
  • Try broader terms: "authentication" instead of "oauth2.0-with-pkce"
  • Check spelling: "stripe" not "stirpe"
  • Use OR: "payment OR billing"
  • List all PRDs: /list-prds
```

### Embeddings API Error

```
⚠️ Embeddings API unavailable (using FTS only)

Error: OpenAI API key not configured

To enable semantic search:
  1. Add OPENAI_API_KEY to environment
  2. Or disable embeddings: Set memory.embeddings_enabled = false

Continuing with full-text search...
```

## Use Cases

### 1. Find Similar Features

```bash
User: "I'm implementing Stripe. Has anyone done payment integration before?"

/recall "stripe OR payment OR billing"

→ Shows PRD-015: PayPal Integration (similar patterns)
```

### 2. Recall Tech Decisions

```bash
User: "Why did we choose PostgreSQL over MySQL?"

/recall "decisions:database"

→ Shows decision rationale from PRD-002
```

### 3. Learn from Past Blockers

```bash
User: "What problems came up with the last API integration?"

/recall "api integration" --section=blockers

→ Shows common blockers from PRD-008, PRD-012
```

### 4. Discover Reusable Code

```bash
User: "Show me examples of real-time features we've built"

/recall "realtime OR websocket OR live"

→ Shows PRD-019: Chat, PRD-024: Notifications
```

## Related Commands

- `/list-prds` - Browse all PRDs by status
- `/review-prd` - Review specific PRD in detail
- `Read <file>` - Read full PRD content

## Technical Implementation

Uses:
- **SQLite FTS5**: Full-text search with ranking
- **Better-sqlite3** (Node.js): Fast synchronous SQLite
- **OpenAI Embeddings API** (optional): Semantic search
- **Cosine Similarity**: Vector comparison
