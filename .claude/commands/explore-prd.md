---
name: explore-prd
description: Early-stage feature exploration before full PRD
category: PRD Management
version: 0.4.2
---

# Explore PRD Command

Lightweight exploration of feature ideas before committing to full PRD.

## Purpose

Validate feature ideas early:
- Quick problem validation
- Solution brainstorming
- Effort estimation
- Go/No-Go decision
- Lightweight documentation

## Workflow

### 1. Problem Definition

**Capture initial idea**:
- User pain point
- Current workaround
- Frequency and impact
- Evidence (if available)

**Example**:
```markdown
🔍 Exploring: Export to PDF

Problem: Users can't share reports offline
Current: Screenshots or manual copy-paste
Frequency: ~20 requests/month
Impact: Medium (workaround exists)
```

### 2. Solution Brainstorming

**Generate alternatives**:
- Approach A: Build custom PDF generator
- Approach B: Use third-party service (e.g., PDFKit)
- Approach C: Browser print-to-PDF
- Approach D: Export to Google Docs, then PDF

**Quick pros/cons** for each.

### 3. Rough Effort Estimate

**T-shirt sizing**:
- S (1-2 days)
- M (3-5 days)
- L (1-2 weeks)
- XL (2+ weeks)

**Include**:
- Development time
- Testing time
- Documentation time

### 4. Competitive Check

**Quick research**:
- What do competitors do?
- Industry standard approach?
- Open source libraries available?

### 5. Decision Point

**Three outcomes**:

1. **GO → Create PRD**:
   - Problem validated
   - Solution promising
   - Effort acceptable
   - Action: `/create-prd` with exploration as input

2. **DEFER**:
   - Good idea but not now
   - Timing not right
   - Action: Save in `.prds/ideas/` for later

3. **KILL**:
   - Not worth doing
   - Better alternatives exist
   - Action: Document reasoning, close exploration

### 6. Document Exploration

**Save exploration** to `.prds/explorations/YYYY-MM-DD-feature-name.md`:

```markdown
# Exploration: Feature Name

**Date**: YYYY-MM-DD
**Status**: Go/Defer/Kill

## Problem
{What user pain we're solving}

## Solutions Considered
1. Approach A: {pros/cons}
2. Approach B: {pros/cons}

## Recommended Approach
{Which solution to pursue and why}

## Effort
{T-shirt size with rough breakdown}

## Decision
{Go/Defer/Kill with reasoning}

## Next Steps
{What to do next}
```

## When to Use

**Use explore-prd when**:
- New feature idea needs validation
- Unsure if worth full PRD effort
- Want quick estimate before committing
- Multiple solutions need comparison

**Don't use when**:
- Feature already decided (go straight to /create-prd)
- Tiny change (just do it)
- Urgent bug fix (use /debugging)

## Success Criteria

- ✅ Problem clearly defined
- ✅ Multiple solutions considered
- ✅ Rough effort estimated
- ✅ Clear decision made (Go/Defer/Kill)
- ✅ Exploration documented
- ✅ Next steps identified

## Example

```markdown
🔍 Exploring: Export to PDF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Users can't export reports for offline sharing
Current: Manual screenshots (painful)
Evidence: 23 support tickets in last 3 months

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOLUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Custom PDF Generator (Puppeteer)
   ✓ Full control
   ✗ Complex, 2 weeks effort

2. Browser Print-to-PDF
   ✓ Simple, 2 days effort
   ✓ No dependencies
   ✗ Limited formatting control

3. Third-party API (PDFShift)
   ✓ Quick, 1 day integration
   ✗ Recurring cost ($29/month)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Approach: Browser Print-to-PDF (Option 2)
Effort: M (3 days)
ROI: Good (solves 80% of use cases, minimal cost)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DECISION: ✅ GO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reasoning: Validated problem, simple solution, small effort

Next: Create PRD with full acceptance criteria
Command: /create-prd with this exploration as input
```

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
