---
name: estimation
description: Effort and complexity estimation for features and tasks
category: Project Management
---

# Estimation Skill

Provides expertise in estimating effort, complexity, and timelines for software development tasks using industry-standard techniques.

## Estimation Methodologies

### 1. Planning Poker (Story Points)

**Scale**: Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)

**Point Reference**:
- **1 point**: Trivial change (update config, fix typo) - 30min-1h
- **2 points**: Simple task (add simple component) - 1-2h
- **3 points**: Small feature (basic CRUD endpoint) - 2-4h
- **5 points**: Medium feature (complex component with state) - 4-8h (1 day)
- **8 points**: Large feature (auth system) - 8-16h (2 days)
- **13 points**: Very large feature (payment integration) - 16-24h (3 days)
- **21 points**: Epic (too large, split it)

**Example Estimation**:
```markdown
## Feature: User Registration

### Task Breakdown

| Task | Complexity | Points | Time Estimate |
|------|------------|--------|---------------|
| Create User model | Low | 2 | 1-2h |
| Implement signup API | Medium | 5 | 4-6h |
| Add email verification | Medium | 5 | 4-6h |
| Build registration form | Medium | 5 | 4-6h |
| Write tests | Medium | 5 | 4-6h |
| Documentation | Low | 2 | 1-2h |

**Total**: 24 points ≈ 18-28 hours ≈ 3-4 days
```

---

### 2. T-Shirt Sizing (High-Level)

**Sizes**:
- **XS**: 1-2 hours
- **S**: 2-4 hours (half day)
- **M**: 4-8 hours (1 day)
- **L**: 1-3 days
- **XL**: 3-5 days
- **XXL**: 1-2 weeks (split into smaller tasks)

**Use Case**: Quick estimation for PRDs before detailed breakdown.

**Example**:
```markdown
| Feature | Size | Estimate |
|---------|------|----------|
| Design System v1.0 | XL | 1-2 weeks |
| Landing Page | L | 2-3 days |
| RSS Monitoring | XL | 1.5-2 weeks |
| Analytics Dashboard | L | 3-4 days |
```

---

### 3. Three-Point Estimation (PERT)

**Formula**: `(Optimistic + 4×Most Likely + Pessimistic) / 6`

**Example - API Integration**:
- **Optimistic (O)**: 4 hours (everything works perfectly)
- **Most Likely (M)**: 8 hours (typical issues)
- **Pessimistic (P)**: 16 hours (many problems)
- **Estimate**: `(4 + 4×8 + 16) / 6 = 52 / 6 ≈ 8.7 hours`

**Standard Deviation**: `(P - O) / 6 = (16 - 4) / 6 = 2 hours`

**Confidence Interval (68%)**:  8.7 ± 2 hours = **6.7-10.7 hours**

---

### 4. Historical Velocity

**Track Actual vs Estimated**:
```markdown
| Sprint | Estimated (pts) | Completed (pts) | Velocity |
|--------|-----------------|-----------------|----------|
| Sprint 1 | 40 | 32 | 0.80 |
| Sprint 2 | 35 | 35 | 1.00 |
| Sprint 3 | 38 | 30 | 0.79 |

**Average Velocity**: 0.86 (complete 86% of estimated points)
**Adjustment**: Multiply estimates by 1.16 (1/0.86)
```

**Improved Estimates**:
- Original estimate: 40 points
- Adjusted: 40 × 1.16 = **46 points** (more realistic)

---

## Complexity Factors

### Code Complexity

**Low Complexity** (1-3 points):
- Pure functions (no side effects)
- Simple CRUD operations
- UI components with no state
- Configuration changes

**Medium Complexity** (5-8 points):
- Stateful components
- API integrations
- Business logic implementation
- Database schema changes

**High Complexity** (13-21 points):
- Authentication systems
- Real-time features (WebSockets)
- Payment integrations
- Complex algorithms
- Third-party integrations with poor docs

---

### Domain Knowledge

**Adjustment Multiplier**:
- **Expert** (team has built this before): 1.0x
- **Familiar** (team knows the domain): 1.2x
- **Learning** (new but well-documented): 1.5x
- **Unknown** (new + poor docs): 2.0x

**Example**:
- Base estimate: 5 points (API integration)
- Domain: Payment gateway (unknown)
- Adjusted: 5 × 2.0 = **10 points**

---

### Technical Risk

**Risk Levels**:
- **Low Risk**: Proven tech, stable APIs - 1.0x
- **Medium Risk**: New library, beta APIs - 1.3x
- **High Risk**: Experimental tech, unstable APIs - 1.8x

**Example**:
- Base estimate: 8 points (real-time dashboard)
- Risk: Using new WebSocket library (medium)
- Adjusted: 8 × 1.3 = **10.4 ≈ 11 points**

---

## Estimation Process

### Step 1: Break Down Feature

**Large Feature → Smaller Tasks**:
```markdown
## Feature: Design System v1.0

### Phase 0: Foundation (5 points)
- Setup TypeScript interfaces (2 pts)
- Configure Tailwind (1 pt)
- Install shadcn/ui (2 pts)

### Phase 1: Core Components (34 points)
- Button component (5 pts)
- Input component (5 pts)
- Select component (5 pts)
- Checkbox component (3 pts)
- Radio component (3 pts)
- Card component (3 pts)
- Badge component (2 pts)
- Alert component (3 pts)
- Typography system (5 pts)

### Phase 2: Documentation & Testing (21 points)
- Storybook stories (8 pts)
- Unit tests (8 pts)
- Accessibility audit (3 pts)
- Performance optimization (2 pts)

**Total**: 60 points
```

---

### Step 2: Apply Adjustments

**Example Calculation**:
```
Base estimate: 60 points
× Domain knowledge (familiar): 1.2x
× Technical risk (low): 1.0x
× Team velocity (0.86): 1.16x

Adjusted: 60 × 1.2 × 1.0 × 1.16 ≈ 84 points
```

---

### Step 3: Convert to Time

**Conversion** (team-specific):
- 1 point ≈ 1 hour (experienced team)
- 1 point ≈ 1.5 hours (mixed team)
- 1 point ≈ 2 hours (junior team)

**Example** (mixed team):
- 84 points × 1.5 hours = **126 hours**
- Productive hours per day: 6 (not 8, account for meetings, breaks)
- Days: 126 / 6 = **21 days** ≈ **4 weeks**

---

### Step 4: Add Buffer

**Buffer Recommendations**:
- **Low certainty** (new feature): +30-50% buffer
- **Medium certainty** (familiar feature): +20-30% buffer
- **High certainty** (similar to past work): +10-20% buffer

**Example**:
- Base estimate: 21 days
- Certainty: Medium (new tech but familiar problem)
- Buffer: +25%
- Final: 21 × 1.25 = **26 days** ≈ **5-6 weeks**

---

## Estimation Antipatterns

### 1. Anchoring Bias

❌ **Problem**: First number mentioned becomes reference
```
PM: "This should take 2 days, right?"
Dev: "Uh, sure, 2 days." (even if thinking 5 days)
```

✅ **Solution**: Independent estimation first, then discuss

---

### 2. Optimism Bias

❌ **Problem**: Assuming everything will go smoothly
```
"We'll integrate the API in 4 hours."
(Reality: API docs wrong, auth broken, takes 12 hours)
```

✅ **Solution**: Use PERT or add buffer

---

### 3. Scope Creep

❌ **Problem**: Feature grows during implementation
```
Initial: "Basic button component"
Later: "Add animations, tooltips, keyboard nav, dark mode..."
```

✅ **Solution**: Strict scope definition in PRD, defer extras to v2

---

### 4. Not Accounting for Unknowns

❌ **Problem**: Forgetting testing, debugging, refactoring time
```
"Coding: 8 hours"
(Forgot: testing +3h, debugging +2h, code review +1h = 14h total)
```

✅ **Solution**: Include all activities in estimate

---

## Estimation Template

```markdown
## Estimation: {Feature Name}

### Scope
- {List what's IN scope}
- {List what's OUT of scope}

### Task Breakdown

| Task | Complexity | Base Points | Adjustments | Final Points | Time Est |
|------|------------|-------------|-------------|--------------|----------|
| Task 1 | Low | 2 | Domain ×1.2 | 2.4 ≈ 3 | 3h |
| Task 2 | Medium | 5 | Risk ×1.3 | 6.5 ≈ 7 | 7h |
| Task 3 | High | 8 | - | 8 | 8h |

**Subtotal**: 18 points = 18 hours

### Adjustments
- Team velocity: ×1.16 = 20.9 ≈ 21 hours
- Buffer (medium certainty): +25% = 26.25 ≈ 26 hours

### Final Estimate
- **Optimistic**: 18 hours (2.5 days)
- **Most Likely**: 26 hours (4 days)
- **Pessimistic**: 40 hours (1 week)

**Recommendation**: Plan for **4-5 days**

### Assumptions
1. API documentation is accurate
2. No blockers from dependencies
3. Team member has 6 productive hours/day
4. Design mockups ready before coding starts

### Risks
1. **High**: Third-party API downtime (mitigation: mock API)
2. **Medium**: Design changes mid-development (mitigation: approval checkpoint)
3. **Low**: Team member sick days (mitigation: pair programming)
```

---

## Quick Reference

### Story Points to Time (Mixed Team)

| Points | Time | Complexity |
|--------|------|------------|
| 1 | 1-2h | Trivial |
| 2 | 2-3h | Very simple |
| 3 | 3-5h | Simple |
| 5 | 5-8h | Medium |
| 8 | 8-12h | Large |
| 13 | 12-20h | Very large |
| 21 | 20-30h | Epic (split!) |

### Certainty Buffer

| Certainty | Buffer |
|-----------|--------|
| High (90%) | +10-15% |
| Medium (70%) | +20-30% |
| Low (50%) | +40-50% |

---

## Related

- Commands: `/work-prd` (uses task breakdown)
- Agents: `prd-implementer` (generates estimates)
- Skills: `dependency-management`
