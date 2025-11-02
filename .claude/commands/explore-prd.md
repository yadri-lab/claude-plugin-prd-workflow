---
name: explore-prd
description: Early-stage feature exploration before full PRD
category: PRD Management
version: 1.0.0
---

# Explore PRD Command

Lightweight feature exploration for early-stage ideas before committing to full PRD.

## Purpose

Validate feature ideas quickly without full PRD overhead:
- **Quick feasibility assessment** (technical, business, resource)
- **Lightweight codebase research** (relevant files, patterns)
- **Decision support** (Create PRD / Explore more / Drop)
- **Persistent record** in `.prds/thoughts/explorations/`

**Use case**: "I have a vague idea - is it worth a full PRD?"

---

## Workflow

### Step 1: Capture Initial Idea & Ask Discovery Questions

```markdown
💡 **Feature Exploration**

You said: "{{USER_INPUT}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before diving deep, let me ask a few questions to understand the scope better:

**Questions to clarify the idea**:

1. **What's the core user problem this solves?** (In one sentence)
   > _

2. **Are there alternative approaches to solve this problem?** (What else could work?)
   > _

3. **What would make this a "must-have" vs "nice-to-have"?**
   > _

4. **What's the biggest unknown or concern you have about this idea?**
   > _

5. **Any specific constraints or requirements?** (Timeline, budget, tech, compliance)
   > _

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Wait for user responses before proceeding]
```

---

### Step 2: Business & User Impact Analysis

**This comes FIRST** - Always evaluate impact before feasibility.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BUSINESS & USER IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**User Impact** (Who benefits and how much?)

Target Users:
- Primary: {{USER_PERSONA_1}} ({{PERCENTAGE}}% of user base)
- Secondary: {{USER_PERSONA_2}} ({{PERCENTAGE}}% of user base)

Pain Point Severity:
- Current workaround: {{HOW_USERS_SOLVE_TODAY}}
- Frequency: {{HOW_OFTEN}} (daily/weekly/monthly/rare)
- Impact if not solved: 🔴 Critical / 🟡 Moderate / 🟢 Minor

User Value:
- Time saved: {{MINUTES_HOURS}} per {{FREQUENCY}}
- Effort reduction: {{DESCRIPTION}}
- Delight factor: High / Medium / Low

**Business Impact** (Why this matters to the business?)

Strategic Alignment:
- Current strategy: {{STRATEGY_DESCRIPTION}}
- Alignment: ✅ Strong / ⚠️ Weak / ❌ Misaligned
- Strategic reasoning: {{WHY_ALIGNED_OR_NOT}}

Business Value:
- Revenue impact: {{POSITIVE_NEGATIVE_NEUTRAL}}
  - Mechanism: {{HOW_IT_AFFECTS_REVENUE}}
- Competitive position: Unique / Parity / Lagging
  - Competitors doing this: {{LIST_COMPETITORS}}
- User retention: {{LIKELY_IMPACT}}

Risk Assessment:
- If we build this and fail: {{RISK_DESCRIPTION}}
- If we DON'T build this: {{OPPORTUNITY_COST}}
- Overall risk level: 🔴 High / 🟡 Medium / 🟢 Low

**Impact Score**: {{SCORE}}/10

Reasoning: {{WHY_THIS_SCORE}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3: Product Approaches & Scope Options

**Explore multiple ways to solve the problem** - Not just one solution.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PRODUCT APPROACH OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approach A: {{APPROACH_NAME}}** (e.g., "Minimal MVP")

Scope:
- Core feature: {{WHAT_IS_INCLUDED}}
- Out of scope: {{WHAT_IS_NOT_INCLUDED}}
- User flow: {{HIGH_LEVEL_STEPS}}

Pros:
- ✅ {{PRO_1}}
- ✅ {{PRO_2}}
- ✅ {{PRO_3}}

Cons:
- ❌ {{CON_1}}
- ❌ {{CON_2}}

Key Challenges:
1. {{CHALLENGE_1}} - {{HOW_TO_MITIGATE}}
2. {{CHALLENGE_2}} - {{HOW_TO_MITIGATE}}

Estimated Scope: {{DAYS_WEEKS}} ({{COMPLEXITY}})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approach B: {{APPROACH_NAME}}** (e.g., "Full-Featured")

Scope:
- Core feature: {{WHAT_IS_INCLUDED}}
- Additional capabilities: {{EXTRA_FEATURES}}
- User flow: {{HIGH_LEVEL_STEPS}}

Pros:
- ✅ {{PRO_1}}
- ✅ {{PRO_2}}

Cons:
- ❌ {{CON_1}}
- ❌ {{CON_2}}

Key Challenges:
1. {{CHALLENGE_1}} - {{HOW_TO_MITIGATE}}
2. {{CHALLENGE_2}} - {{HOW_TO_MITIGATE}}

Estimated Scope: {{DAYS_WEEKS}} ({{COMPLEXITY}})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approach C: {{APPROACH_NAME}}** (e.g., "Phased Rollout")

Scope:
- Phase 1: {{WHAT_FIRST}}
- Phase 2: {{WHAT_NEXT}}
- Phase 3: {{WHAT_LAST}}

Pros:
- ✅ {{PRO_1}}
- ✅ {{PRO_2}}

Cons:
- ❌ {{CON_1}}
- ❌ {{CON_2}}

Key Challenges:
1. {{CHALLENGE_1}} - {{HOW_TO_MITIGATE}}
2. {{CHALLENGE_2}} - {{HOW_TO_MITIGATE}}

Estimated Scope: {{TOTAL_TIME}} ({{COMPLEXITY}})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Comparison Matrix**:

| Criteria | Approach A | Approach B | Approach C |
|----------|------------|------------|------------|
| Time to market | {{FAST_SLOW}} | {{FAST_SLOW}} | {{FAST_SLOW}} |
| User value delivered | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} |
| Risk level | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} |
| Iteration flexibility | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} |
| Resource requirement | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} | {{HIGH_MED_LOW}} |

**Recommended Approach**: {{LETTER}} - {{APPROACH_NAME}}

Reasoning: {{WHY_THIS_IS_BEST}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4: Technical Feasibility

**NOW evaluate technical feasibility** - After understanding impact and scope.

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 TECHNICAL FEASIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Codebase Research**:

Searching for:
- Related functionality
- Similar patterns
- Potential integration points

Found:
- `path/to/file.ts` - Related functionality
- `path/to/pattern.ts` - Similar pattern we could reuse
- `lib/component.ts` - Integration point

**Tech Stack Compatibility**:
- Current stack: {{TECH_STACK}}
- Required for this: {{REQUIREMENTS}}
- Gaps to fill: {{MISSING_PIECES}}
- External dependencies: {{LIBRARIES_SERVICES}}

**Similar Features Analysis**:

In our codebase:
- Feature X (`path/`) uses {{APPROACH}}
  - What works: {{REUSABLE_PATTERNS}}
  - What to avoid: {{KNOWN_ISSUES}}

In other products:
- Product A: {{THEIR_APPROACH}}
  - Learning: {{WHAT_TO_COPY_OR_AVOID}}

**Technical Complexity Estimate**:

Complexity Level: Simple / Medium / Complex / Very Complex

Breakdown:
- Backend work: {{DESCRIPTION}} ({{TIME_ESTIMATE}})
- Frontend work: {{DESCRIPTION}} ({{TIME_ESTIMATE}})
- Integration work: {{DESCRIPTION}} ({{TIME_ESTIMATE}})
- Infrastructure work: {{DESCRIPTION}} ({{TIME_ESTIMATE}})

**Technical Blockers**:
- 🚫 {{BLOCKER_1}} - {{SEVERITY}} - {{MITIGATION}}
- 🚫 {{BLOCKER_2}} - {{SEVERITY}} - {{MITIGATION}}

**Architecture Impact**:
- Breaking changes: Yes / No
- Migration needed: Yes / No
- Performance concerns: {{DESCRIPTION}}
- Security considerations: {{DESCRIPTION}}

**Resource Needs**:
- Timeline estimate: {{DAYS_WEEKS}}
- Team availability: ✅ Available / ⚠️ Tight / ❌ Blocked
- Special skills needed: {{SKILLS}}
  - Current team: ✅ Have / ⚠️ Need training / ❌ Need hire

**Technical Feasibility**: ✅ Feasible / ⚠️ Challenging / ❌ Blocked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 5: Final Decision & Recommendation

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 EXPLORATION SUMMARY & DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Overall Assessment**:

Impact: {{SCORE}}/10
Technical Feasibility: ✅ Feasible / ⚠️ Challenging / ❌ Blocked
Resource Availability: ✅ Available / ⚠️ Tight / ❌ Blocked

**Decision**: 🟢 GO / 🟡 EXPLORE MORE / 🔴 DROP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if GO}}
✅ **CREATE PRD**

This idea should move forward because:
- High impact ({{SCORE}}/10) - {{WHY_HIGH_IMPACT}}
- Technically feasible ({{APPROACH_RECOMMENDED}})
- Resources available
- Strong value/effort ratio

**Recommended Approach**: {{APPROACH_NAME}}

**Suggested Priority**: {{P0_P1_P2}}

**Key Requirements** (to include in PRD):
1. {{REQUIREMENT_1}}
2. {{REQUIREMENT_2}}
3. {{REQUIREMENT_3}}

**Success Metrics** (to define in PRD):
- {{METRIC_1}}
- {{METRIC_2}}

**Next Step**: `/create-prd` with this exploration as reference
{{/if}}

{{#if EXPLORE_MORE}}
🔍 **EXPLORE MORE**

This idea needs more validation before PRD:

**Open Questions**:
1. {{QUESTION_1}}
   - How to answer: {{METHOD}}
   - Who to ask: {{STAKEHOLDER}}

2. {{QUESTION_2}}
   - How to answer: {{METHOD}}
   - Who to ask: {{STAKEHOLDER}}

**Next Actions**:
1. {{ACTION_1}} (Owner: {{WHO}}, Due: {{WHEN}})
2. {{ACTION_2}} (Owner: {{WHO}}, Due: {{WHEN}})

**Revisit**: {{TIMELINE}} (e.g., "After user research sprint")

**What would change the decision**:
- If {{CONDITION_1}}, then GO
- If {{CONDITION_2}}, then DROP
{{/if}}

{{#if DROP}}
❌ **DROP**

This idea should not be pursued because:

**Primary Reason**: {{MAIN_REASON}}

**Supporting Reasons**:
- {{REASON_1}}
- {{REASON_2}}

**Alternatives Considered**:
- {{ALTERNATIVE_1}}: {{WHY_NOT_THIS}}
- {{ALTERNATIVE_2}}: {{WHY_NOT_THIS}}

**Could Revisit If**:
- {{CONDITION_THAT_WOULD_CHANGE_MIND}}

**Lessons Learned**:
- {{LESSON_1}}
- {{LESSON_2}}

**Documentation**: Saving to explorations/ for future reference
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 6: Save Exploration Document

```bash
# Generate filename
EXPLORATION_ID=$(date +%Y%m%d-%H%M%S)
FEATURE_SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | cut -c1-50)
EXPLORATION_FILE=".prds/thoughts/explorations/${EXPLORATION_ID}-${FEATURE_SLUG}.md"

# Save exploration
echo "✅ Exploration saved: $EXPLORATION_FILE"
echo ""
echo "Decision: {{DECISION}}"

{{#if GO}}
echo ""
echo "📝 Ready to create PRD?"
echo "Run: /create-prd @$EXPLORATION_FILE"
{{/if}}

{{#if EXPLORE_MORE}}
echo ""
echo "🔍 Next actions:"
echo "  1. {{ACTION_1}}"
echo "  2. {{ACTION_2}}"
echo ""
echo "Revisit: {{TIMELINE}}"
{{/if}}
```

---

## Updated Workflow Summary

**New Order** (based on your feedback):

1. **Discovery Questions** - Open-ended questions to understand the idea better (NOT to build the answer)
2. **Business & User Impact** - WHY this matters (impact first!)
3. **Product Approaches** - WHAT we could build (multiple options with scope/challenges)
4. **Technical Feasibility** - HOW we could build it (after knowing what)
5. **Decision & Next Steps** - Clear GO/EXPLORE/DROP with reasoning

**Key Changes**:
- ✅ Questions are now about clarifying/exploring, not gathering data to build response
- ✅ Impact analysis comes BEFORE technical feasibility
- ✅ Multiple product approaches explored with comparison matrix
- ✅ Scope and challenges clearly highlighted per approach
- ✅ Technical feasibility evaluated AFTER understanding impact and scope
- Required: {{SKILLS}}
- Team readiness: ✅ Have / ⚠️ Need training / ❌ Need hire

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Similar Features Analysis

```markdown
🔗 **Similar Features**

**In Our Codebase**:
- Feature X (`path/`): {{APPROACH}}
  - What works: {{PROS}}
  - What to avoid: {{CONS}}

**In Other Products**:
- Product A: {{APPROACH}}
  - Learnings: {{INSIGHTS}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Decision Recommendation

```markdown
🎯 **Exploration Summary**

**Technical**: ✅ Feasible / ⚠️ Challenging / ❌ Blocked
**Business**: ✅ Aligned / ⚠️ Weak fit / ❌ Misaligned
**Resources**: ✅ Available / ⚠️ Tight / ❌ Unavailable

**Overall Assessment**: 🟢 GO / 🟡 MAYBE / 🔴 NO-GO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recommendation**:

{{#if GO}}
✅ **Create PRD**

This idea is:
- Technically feasible ({{COMPLEXITY}})
- Strategically aligned
- Worth the effort (value > cost)

**Suggested Priority**: {{PRIORITY}}

**Key Requirements**:
1. {{REQ1}}
2. {{REQ2}}
3. {{REQ3}}

**Next**: `/create-prd` with this exploration as reference
{{/if}}

{{#if MAYBE}}
🔍 **Explore More**

This idea needs more validation:

**Questions to answer**:
1. {{QUESTION1}}
2. {{QUESTION2}}

**Next actions**:
1. {{ACTION1}}
2. {{ACTION2}}

**Revisit**: {{TIMELINE}}
{{/if}}

{{#if NO}}
❌ **Drop**

This idea is not viable because:
- {{REASON1}}
- {{REASON2}}

**Alternatives considered**:
- {{ALT1}}: {{WHY_NOT}}

**Lessons learned**: {{LESSONS}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 8: Save Exploration Document

```bash
# Generate filename
EXPLORATION_ID=$(date +%Y%m%d-%H%M%S)
FEATURE_SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
EXPLORATION_FILE=".prds/thoughts/explorations/${EXPLORATION_ID}-${FEATURE_SLUG}.md"

# Save using template
cat "product/templates/exploration-template.md" | \
  sed "s/{{FEATURE_IDEA}}/$FEATURE_NAME/g" | \
  sed "s/{{DATE}}/$(date +%Y-%m-%d)/g" | \
  sed "s/{{USER}}/$USER/g" \
  > "$EXPLORATION_FILE"

echo "✅ Exploration saved: $EXPLORATION_FILE"
```

---

## Output Example

```markdown
# Exploration: Real-time Collaboration

**Date**: 2025-01-02
**Status**: 🟢 Ready for PRD
**Explorer**: yassine

## 💡 Initial Idea
Add real-time collaboration like Google Docs - multiple users editing same PRD simultaneously.

## ❓ Feasibility Questions
### Technical Feasibility
- [x] Tech stack compatible (WebSocket support via Socket.io)
- [x] No architectural blockers
- [x] Medium complexity (5-7 days)

### Business Feasibility
- [x] Strongly aligned with "team collaboration" strategy
- [x] High value (top user request)
- [x] Unique differentiator

### Resource Feasibility
- [x] 1-2 weeks timeline
- [x] Team capacity available
- [x] Have required skills (WebSocket experience)

## 🔍 Quick Codebase Research
**Relevant Files**:
- `src/editor/Editor.tsx` - Main editor component
- `lib/socket.ts` - WebSocket infrastructure (exists!)

**Current State**: Single-user editing only
**Gaps**: Operational Transform or CRDT for conflict resolution

## 🔗 Similar Features
**In Our Codebase**: None
**In Other Products**:
- Google Docs: OT approach
- Figma: CRDT approach (better for our use case)

## 🎯 Next Steps
**Decision**: ✅ Create PRD

**Estimated Priority**: P1
**Key Requirements**:
1. WebSocket connection per user
2. CRDT for conflict-free merging
3. Presence awareness (who's editing)

**Command**: `/create-prd` based on this exploration
```

---

## Integration with `/create-prd`

Exploration files can be referenced when creating PRDs:

```bash
/create-prd @.prds/thoughts/explorations/20250102-real-time-collaboration.md
```

This pre-populates PRD with exploration findings.

---

## Configuration

No special configuration needed. Uses:
- `context_engineering.thoughts_directory` from config
- Template: `product/templates/exploration-template.md`

---

## Examples

**Basic exploration**:
```bash
/explore-prd "Add dark mode support"
```

**With initial context**:
```bash
/explore-prd "OAuth integration for GitHub and Google"
```

**Strategic exploration**:
```bash
/explore-prd "Real-time analytics dashboard"
```

---

## Tips

- **Be honest about feasibility** - better to drop early than after PRD
- **Focus on blockers** - what would prevent this from working?
- **Compare to similar features** - learn from what exists
- **Document decision** - even "drop" decisions teach us
- **Quick is key** - aim for < 30 minutes total

---

**Version**: 1.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Category**: Context Engineering
