---
name: scope-analyzer
description: Scope creep detection and prevention
model: haiku
temperature: 0.3
---

# Scope Analyzer Skill

Detect and prevent scope creep in PRDs.

## Purpose

Identify features mentioned in PRD but not in acceptance criteria:
- Find hidden requirements
- Estimate scope creep impact
- Suggest defer or promote decisions
- Keep PRDs focused and achievable

## Detection Algorithm

### Step 1: Extract All Feature Mentions

Scan entire PRD for feature descriptions:

```javascript
function extractFeatureMentions(prd) {
  const sections = [
    'Implementation Notes',
    'Technical Approach',
    'Design Considerations',
    'Future Considerations',
    'Notes'
  ];

  const mentions = [];

  for (const section of sections) {
    const sectionContent = extractSection(prd.content, section);

    // Find sentences with action verbs (can, should, will, must)
    const patterns = [
      /users? (?:can|should|will|must) ([^.]+)/gi,
      /system (?:can|should|will|must) ([^.]+)/gi,
      /(?:we|i) (?:can|should|will|must) ([^.]+)/gi,
      /(?:allow|enable|support) ([^.]+)/gi
    ];

    for (const pattern of patterns) {
      const matches = [...sectionContent.matchAll(pattern)];
      mentions.push(...matches.map(m => ({
        feature: m[1].trim(),
        section: section,
        line: findLineNumber(prd.content, m[0])
      })));
    }
  }

  return mentions;
}
```

### Step 2: Compare with Acceptance Criteria

```javascript
function findScopeCreep(mentions, acceptanceCriteria) {
  const creep = [];

  for (const mention of mentions) {
    // Check if this feature is in acceptance criteria
    const inAC = acceptanceCriteria.some(ac =>
      ac.toLowerCase().includes(mention.feature.toLowerCase()) ||
      mention.feature.toLowerCase().includes(ac.toLowerCase())
    );

    if (!inAC) {
      creep.push(mention);
    }
  }

  return creep;
}
```

### Step 3: Estimate Impact

```javascript
function estimateImpact(feature) {
  const keywords = {
    high: ['admin', 'bulk', 'export', 'import', 'migration', 'security', 'integration'],
    medium: ['customize', 'configure', 'filter', 'sort', 'search'],
    low: ['show', 'display', 'hide', 'toggle']
  };

  for (const [level, words] of Object.entries(keywords)) {
    if (words.some(w => feature.toLowerCase().includes(w))) {
      return {
        level,
        days: level === 'high' ? '5-7' : level === 'medium' ? '2-3' : '0.5-1'
      };
    }
  }

  return { level: 'medium', days: '2-3' };
}
```

## Output Format

```
⚠️ Scope Creep Detected:

This PRD mentions 3 features not in acceptance criteria:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "Users can customize notification sounds"

   Found in: Implementation Notes (line 45)
   Risk: Medium (adds 2-3 days)

   Context:
   > "Users can customize notification sounds for different event types"

   Action:
     [A] Add to acceptance criteria (P2 - nice to have)
     [D] Defer to v2 (recommend)
     [K] Keep as implementation detail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. "Admin can bulk delete users"

   Found in: Technical Approach (line 78)
   Risk: High (security implications, adds 5-7 days)

   Context:
   > "Admin panel will support bulk operations like bulk delete users"

   Action:
     [A] Add to acceptance criteria (P1 - should have)
     [D] Defer to separate PRD (recommend)
     [R] Remove completely

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. "Export data to CSV"

   Found in: Design Considerations (line 92)
   Risk: Low (adds 0.5-1 day)

   Context:
   > "Consider adding export to CSV for reporting purposes"

   Action:
     [A] Add to acceptance criteria (P3 - maybe)
     [D] Defer to v2
     [K] Keep as optional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recommendation:

Current scope: ~10 days
With all 3 features: ~18 days (+80% 🚨)

Suggested approach:
  • Keep features #3 (low risk)
  • Defer #1 and #2 to v2
  • Updated scope: ~11 days (+10% ✅)

Apply recommendations? [Y/n]
```

## Scope Metrics

Track scope creep over time:

```javascript
function calculateScopeMetrics(prd) {
  return {
    acceptance_criteria_count: prd.acceptanceCriteria.length,
    mentioned_features_count: extractFeatureMentions(prd).length,
    scope_creep_count: findScopeCreep(...).length,
    scope_creep_percentage: (creepCount / mentionedCount) * 100,
    estimated_base_days: calculateBaseDays(prd),
    estimated_with_creep_days: calculateTotalDays(prd),
    creep_impact_percentage: ((totalDays - baseDays) / baseDays) * 100
  };
}
```

Example metrics display:

```
📊 Scope Analysis:

Acceptance Criteria: 12 items
Mentioned Features: 18 total
Scope Creep: 6 features (33%)

Estimated Time:
  Base (AC only): 8 days
  With creep: 15 days
  Impact: +87% 🚨

Recommendation: Review and defer scope creep
```

## Integration Points

### In /review-prd

Automatically run during PRD review:

```bash
/review-prd PRD-003

→ Analyzing PRD structure...
→ Running scope creep detection...

⚠️ Found 3 scope creep items (see above)

Continue with review? [Y/n]
```

### In /create-prd

Optional: Check during creation:

```bash
/create-prd "Add user dashboard"

[... user fills in PRD ...]

→ Analyzing scope...

✅ No scope creep detected
   All mentioned features are in acceptance criteria
```

## Prevention Strategies

### 1. Clear Section Names

Mark sections that should NOT contain acceptance criteria:

```markdown
## Acceptance Criteria
[Official requirements]

## Implementation Notes
**Note: Items here are NOT requirements, just suggestions**

## Future Considerations
**Note: These are explicitly OUT OF SCOPE for this PRD**
```

### 2. Template Guardrails

PRD template includes warnings:

```markdown
## Implementation Notes

⚠️ **Important**: Only add implementation guidance here, NOT new requirements.
If you need to add a requirement, add it to "Acceptance Criteria" above.
```

### 3. Review Checklist

Add to `/review-prd`:

```
✅ All requirements in Acceptance Criteria section?
✅ No hidden requirements in Implementation Notes?
✅ Future Considerations clearly marked as out-of-scope?
```

## Configuration

```json
{
  "scope_analyzer": {
    "enabled": true,
    "strict_mode": false,
    "auto_detect_in_review": true,
    "warn_threshold_percentage": 20,
    "sections_to_scan": [
      "Implementation Notes",
      "Technical Approach",
      "Design Considerations"
    ],
    "excluded_sections": [
      "Future Considerations",
      "Out of Scope"
    ]
  }
}
```

## Benefits

- **Prevent scope creep**: Catch hidden requirements early
- **Accurate estimates**: Base estimates on explicit criteria only
- **Focused PRDs**: Keep PRDs achievable and clear
- **Better planning**: Know true scope before starting work
- **Historical data**: Track how often scope creep occurs

## Common Patterns

### Pattern 1: "Nice to Have" Creep

```
Found: "It would be nice to add export to PDF"
→ Risk: Low, but adds time
→ Action: Move to "Future Considerations"
```

### Pattern 2: Security Creep

```
Found: "Admin can delete all user data"
→ Risk: High (security, legal implications)
→ Action: Create separate PRD with security review
```

### Pattern 3: UI Polish Creep

```
Found: "Add animations and transitions"
→ Risk: Medium (design time, testing)
→ Action: Defer to polish phase (separate PRD)
```

## Success Metrics

Track scope creep reduction:

```
📈 Scope Creep Trends (Last 10 PRDs):

Average scope creep: 15% (down from 35%)
PRDs with 0% creep: 6/10 (60%)
Time saved: ~20 days total
```
