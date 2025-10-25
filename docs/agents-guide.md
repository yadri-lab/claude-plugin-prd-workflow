# Agents Guide

Guide to the 6 specialized AI agents in PRD Workflow Manager.

## Agent Overview

| Agent | Expertise | Auto-Invoked By |
|-------|-----------|-----------------|
| `prd-reviewer` | PRD quality & feasibility | `/review-prd` |
| `prd-implementer` | Development guidance | `/work-prd` |
| `orchestrator` | Workflow coordination | `/orchestrate` |
| `security-expert` | Security & compliance | `/security-audit` |
| `quality-assurance` | Code quality & testing | `/quality-check` |
| `devops-engineer` | CI/CD & infrastructure | (Manual) |

## How Agents Work

Agents are specialized AI personalities with domain expertise. They:
- Provide expert analysis and guidance
- Follow proven methodologies
- Generate actionable recommendations
- Maintain consistent tone and standards

**Invocation**: Agents are automatically invoked by their corresponding commands. You interact with them through the command interface.

## Agent Details

### 1. PRD Reviewer

**File**: `agents/prd-reviewer.md`

**Expertise**:
- Product management
- Technical feasibility
- UX design
- Risk assessment

**Methodology**: 7-Dimension Framework
1. Clarity & Scope
2. Technical Feasibility
3. User Experience
4. Dependencies & Blockers
5. Acceptance Criteria
6. Risk Assessment
7. Simplification Opportunities

**Output**: Graded review (A-F) with calibration questions

**Configuration**:
```json
{
  "agents": {
    "prd_reviewer": {
      "strictness": "balanced"  // lenient | balanced | strict
    }
  }
}
```

---

### 2. PRD Implementer

**File**: `agents/prd-implementer.md`

**Expertise**:
- Software architecture
- Task breakdown
- Estimation
- Implementation guidance

**Methodology**: Bottom-up Approach
- Phase 0: Foundation
- Phase 1: Core Features (P0)
- Phase 2: Advanced Features (P1)
- Phase 3: QA & Polish

**Output**: Task-by-task implementation plan with code examples

**Configuration**:
```json
{
  "agents": {
    "prd_implementer": {
      "task_breakdown_granularity": "medium"  // fine | medium | coarse
    }
  }
}
```

---

### 3. Orchestrator

**File**: `agents/orchestrator.md`

**Expertise**:
- Project management
- Dependency management
- Git workflows
- Conflict resolution

**Methodology**:
- Build dependency graph
- Detect conflicts (file overlap)
- Calculate critical path
- Optimize parallelization

**Output**: Workflow plan with recommended actions

**Configuration**:
```json
{
  "agents": {
    "orchestrator": {
      "coordination_mode": "smart"  // simple | smart | advanced
    }
  }
}
```

---

### 4. Security Expert

**File**: `agents/security-expert.md`

**Expertise**:
- OWASP Top 10
- Secure coding practices
- Vulnerability detection
- Compliance

**Methodology**:
- Dependency scanning (npm audit)
- Code analysis (ESLint security)
- Secret detection (patterns)
- Best practices validation

**Output**: Security report with severity levels & auto-fix options

**Configuration**:
```json
{
  "agents": {
    "security_expert": {
      "scan_frequency": "on_demand"  // on_demand | on_commit | daily
    }
  }
}
```

---

### 5. Quality Assurance

**File**: `agents/quality-assurance.md`

**Expertise**:
- Test automation
- Code quality metrics
- Performance analysis
- Documentation coverage

**Methodology**:
- Linting & style
- Testing & coverage
- Code complexity
- Bundle size
- Performance benchmarks

**Output**: Quality report with grade (A-F) & recommendations

**Configuration**:
```json
{
  "agents": {
    "quality_assurance": {
      "check_frequency": "on_pr"  // on_demand | on_commit | on_pr
    }
  }
}
```

---

### 6. DevOps Engineer

**File**: `agents/devops-engineer.md`

**Expertise**:
- CI/CD pipelines
- Infrastructure as Code
- Monitoring & alerting
- Deployment strategies

**Methodology**:
- Pipeline design (GitHub Actions, GitLab CI)
- Infrastructure automation (Terraform)
- Deployment strategies (blue-green, canary)

**Output**: CI/CD setup, deployment configuration

**Configuration**:
```json
{
  "agents": {
    "devops_engineer": {
      "enabled": false,  // Enable when needed
      "auto_setup_ci": false
    }
  }
}
```

**Note**: DevOps Engineer is opt-in. Enable when setting up CI/CD.

---

## Agent Communication

### Tone & Style

All agents follow these principles:
- **Professional**: Expert but not condescending
- **Actionable**: Specific recommendations, not vague advice
- **Balanced**: Acknowledge strengths before gaps
- **Educational**: Explain "why" not just "what"

### Example Interaction

```
You: /review-prd

PRD Reviewer (Agent):
📊 PRD Review: Design System v1.0

Overall Assessment:
Well-structured with clear components. Scope is ambitious for v1.0
and could benefit from lotification. Missing performance requirements.

Grade: B (82%)
Recommendation: Needs minor work before approval

🎯 1. Clarity & Scope - Grade: B+

Strengths:
✅ Clear component structure
✅ Well-defined IN vs OUT scope

Questions:
1. Could we defer theme customization to v1.1?
2. What's the absolute MVP for v1.0?
...

[Continues with all 7 dimensions]

CRITICAL QUESTIONS (Answer These):
1. Scope: Can we ship 50% of components in v1.0?
2. Tech: Have you tested shadcn/ui setup locally?
...
```

---

## Customizing Agent Behavior

### Strictness Levels (PRD Reviewer)

**Lenient** (Startup):
- Minimum grade: D
- Fewer calibration questions
- Faster approval

**Balanced** (Default):
- Minimum grade: C
- Standard questions
- Thorough review

**Strict** (Enterprise):
- Minimum grade: B
- Comprehensive questions
- Rigorous review

### Task Granularity (PRD Implementer)

**Fine** (Junior developers):
- 1 task = 30min-1h
- Very detailed steps
- 10-20 tasks per feature

**Medium** (Default):
- 1 task = 1-3h
- Moderate detail
- 5-10 tasks per feature

**Coarse** (Senior developers):
- 1 task = 0.5-1 day
- High-level guidance
- 3-5 tasks per feature

---

## Best Practices

### 1. Trust the Agents

✅ **DO**: Follow agent recommendations
```
Security Expert: "High: Hardcoded API key"
You: Fix immediately ✅
```

❌ **DON'T**: Ignore critical warnings
```
You: "I'll fix it later" ❌
```

### 2. Provide Context When Asked

✅ **DO**: Thoughtful answers
```
Agent: "Can we defer dark mode to v1.1?"
You: "Yes, analytics show <5% users use dark mode"
```

❌ **DON'T**: Dismissive answers
```
You: "Maybe" or "I don't know"
```

### 3. Iterate Based on Feedback

✅ **DO**: Continuous improvement
```
Quality Agent: "Test coverage 65% (target: 80%)"
You: Add tests → Re-run → 82% ✅
```

---

## See Also

- Individual agent files in `agents/` directory
- [Commands Reference](commands-reference.md)
- [Skills Reference](skills-reference.md)
- [Configuration](configuration.md)
