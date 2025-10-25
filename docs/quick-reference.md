# Quick Reference Guide

**PRD Workflow Manager** - Essential commands and workflows at a glance

---

## 🚀 Commands Cheat Sheet

### Core PRD Workflow

```bash
# Create a new PRD from scratch
/create-prd

# Review a draft PRD (7-dimension analysis, grading, calibration questions)
/review-prd

# Start development (create branch + worktree, move PRD to in-progress)
/code-prd

# Guided implementation with task breakdown
/work-prd

# List all PRDs by status
/list-prds

# Archive completed or cancelled PRDs
/archive-prd
```

### Quality & Security

```bash
# Run security audit (dependencies, code, secrets, OWASP Top 10)
/security-audit

# Run quality checks (linting, tests, complexity, coverage)
/quality-check
```

### Multi-Feature Coordination

```bash
# View dependency graph and coordinate parallel features
/orchestrate
```

---

## 📁 Directory Structure

```
your-project/
├── product/prds/
│   ├── 01-draft/          # New PRDs being written
│   ├── 02-review/         # PRDs under review
│   ├── 03-ready/          # Approved, ready to code
│   ├── 04-in-progress/    # Currently being implemented
│   ├── 05-complete/       # Implemented and merged
│   └── 99-archived/       # Cancelled or superseded
├── .claude/
│   ├── config.json        # Plugin configuration
│   └── prd-*-progress.json # Progress tracking
└── [your code]
```

---

## 🔄 Complete Workflow Example

### 1. Create PRD
```bash
/create-prd
```
**Output**: `product/prds/01-draft/YYMMDD-feature-name-v1.md`

### 2. Review PRD
```bash
/review-prd
```
**Process**:
- Analyzes with 7 dimensions
- Generates calibration questions
- Updates PRD with Q&A
- Grades (A-F)
- Approves if grade ≥ minimum
- Moves to `03-ready/`
- Creates GitHub issue (if enabled)

### 3. Start Development
```bash
/code-prd
```
**Process**:
- Creates branch `feat/PRD-XXX-feature-name`
- Creates worktree (if enabled)
- Moves PRD to `04-in-progress/`
- Provides implementation context

### 4. Guided Implementation
```bash
/work-prd
```
**Process**:
- Breaks PRD into tasks
- For each task:
  - Shows implementation context
  - Waits for completion
  - Validates acceptance criteria
  - Updates progress
- Tracks progress in `.claude/prd-XXX-progress.json`

### 5. Quality Gates
```bash
# Before creating PR
/security-audit  # Must pass (no high-severity issues)
/quality-check   # Must pass (grade ≥ minimum)
```

### 6. Merge & Complete
```bash
# After PR is merged
git worktree remove ../project-feature
git branch -d feat/PRD-XXX-feature-name
mv product/prds/04-in-progress/*.md product/prds/05-complete/
```

---

## ⚙️ Configuration Presets

### Startup (Fast Development)
```bash
cp config/presets/startup.json .claude/config.json
```
- Test coverage: **70%**
- Min grade: **C**
- Review dimensions: **5**
- Parallel features: **2**
- Task granularity: **Coarse**

### Enterprise (Strict Quality)
```bash
cp config/presets/enterprise.json .claude/config.json
```
- Test coverage: **90%**
- Min grade: **B**
- Review dimensions: **10**
- Parallel features: **5**
- Task granularity: **Fine**
- Auto security scans

### Open Source (Community)
```bash
cp config/presets/open-source.json .claude/config.json
```
- PRD ID format: **RFC-{number}**
- Work plan: **ROADMAP.md**
- Labels: **help-wanted**, **good-first-issue**
- Community-focused review

---

## 🧠 Agents Overview

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **prd-reviewer** | 7-dimension PRD analysis | Auto-invoked by `/review-prd` |
| **prd-implementer** | Task breakdown & guidance | Auto-invoked by `/work-prd` |
| **orchestrator** | Multi-feature coordination | Auto-invoked by `/orchestrate` |
| **security-expert** | Security scanning & OWASP | Auto-invoked by `/security-audit` |
| **quality-assurance** | Code quality analysis | Auto-invoked by `/quality-check` |
| **devops-engineer** | CI/CD & infrastructure | Manual invocation for DevOps tasks |

---

## 🛠️ Skills Reference

| Skill | Capabilities |
|-------|--------------|
| **git-workflow** | Branching, worktrees, merging, conflict resolution |
| **testing** | Unit, integration, E2E tests; coverage analysis |
| **security-analysis** | Vulnerability scanning, OWASP Top 10, secrets detection |
| **code-quality** | Linting, complexity analysis, code smells |
| **documentation** | README, API docs, comments |
| **estimation** | Story points, PERT, task breakdown |
| **dependency-management** | Dependency analysis, version management |
| **performance-analysis** | Profiling, optimization, benchmarking |

---

## 📊 PRD Review Framework

### 7 Review Dimensions

1. **Clarity & Scope**
   - Problem clearly defined?
   - Scope well-bounded?
   - In-scope vs out-of-scope explicit?

2. **Technical Feasibility**
   - Solution technically sound?
   - Architecture decisions justified?
   - Dependencies identified?

3. **User Experience**
   - User flows clear?
   - Edge cases considered?
   - Error handling defined?

4. **Dependencies & Blockers**
   - Upstream dependencies listed?
   - Blocking issues identified?
   - Mitigation strategies?

5. **Acceptance Criteria**
   - Criteria testable?
   - Success metrics defined?
   - Complete coverage?

6. **Risk Assessment**
   - Technical risks identified?
   - Mitigation plans?
   - Rollback strategy?

7. **Simplification Opportunities**
   - Can scope be reduced?
   - MVP vs v2 split?
   - Over-engineering avoided?

**Enterprise adds 3 more**:
8. Compliance & Regulatory
9. Security Impact
10. Performance Impact

---

## 🎯 Grading Scale

| Grade | Meaning | Action |
|-------|---------|--------|
| **A** | Exceptional - crystal clear, comprehensive | ✅ Approve immediately |
| **B** | Good - ready to implement with minor notes | ✅ Approve (enterprise minimum) |
| **C** | Acceptable - some gaps but workable | ✅ Approve (startup minimum) |
| **D** | Needs work - significant gaps | ❌ Require updates |
| **F** | Not ready - major issues | ❌ Reject, rewrite needed |

---

## 🔧 Common Configuration Options

### Enable Git Worktrees
```json
{
  "prd_workflow": {
    "worktree": {
      "enabled": true,
      "parent_directory": "..",
      "auto_install_dependencies": true
    }
  }
}
```

### Adjust Test Coverage
```json
{
  "quality": {
    "testing": {
      "coverage_threshold": 80,
      "required_for_pr": true
    }
  }
}
```

### Configure GitHub Integration
```json
{
  "prd_workflow": {
    "github": {
      "enabled": true,
      "create_issue_on_approval": true,
      "issue_labels": ["feature", "P0", "P1"],
      "auto_assign": true
    }
  }
}
```

### Set Review Strictness
```json
{
  "prd_workflow": {
    "review": {
      "minimum_grade": "B",
      "require_approval": true,
      "calibration_questions": true
    }
  }
}
```

---

## 🔍 Troubleshooting Quick Fixes

### Plugin not loading
```bash
# Verify installation
ls ~/.claude-plugins/claude-prd-workflow

# Check plugin.json
cat ~/.claude-plugins/claude-prd-workflow/.claude-plugin/plugin.json
```

### Worktree creation fails
```bash
# Check if worktree already exists
git worktree list

# Remove stale worktree
git worktree remove ../project-feature --force
```

### PRD not found
```bash
# List all PRDs
/list-prds

# Check directory structure
ls -la product/prds/*/
```

### Security scan fails
```bash
# Update dependencies
npm audit fix

# Check ignore patterns
cat .gitignore
```

### Quality check fails
```bash
# Fix linting errors
npm run lint -- --fix

# Run tests
npm test

# Check coverage
npm run test:coverage
```

---

## 📈 Metrics & Benchmarks

### Development Velocity

**Typical timelines**:
- PRD creation: 30-60 min
- PRD review: 15-30 min
- Task breakdown: 10-20 min
- Implementation: Varies by complexity

**Expected improvements**:
- Cycle time: -30% to -50%
- Failed PRs: -80% to -100%
- Context switching: -70% to -90%

### Quality Metrics

**Targets**:
- Test coverage: 80-90%
- Code complexity: Max 8-15
- Security issues: 0 high-severity
- PRD grade: B or higher

---

## 🎓 Best Practices

### DO ✅

1. **Review every PRD** - Even fast review beats no review
2. **Use worktrees for parallel work** - Avoid branch switching
3. **Run quality checks before PR** - Catch issues early
4. **Keep PRDs concise** - 2-3 pages max
5. **Track decisions in ADRs** - Document "why" not just "what"
6. **Use feature flags** - Safe rollouts
7. **Update work plan** - Keep team aligned

### DON'T ❌

1. **Skip PRD review** - Prevents scope creep & tech debt
2. **Ignore calibration questions** - They expose gaps
3. **Merge failing quality checks** - Technical debt compounds
4. **Over-engineer** - MVP first, iterate later
5. **Skip security scans** - Especially for auth/payments
6. **Forget to update PRD status** - Keeps work plan accurate

---

## 🔗 Quick Links

- [Full Documentation](README.md)
- [Getting Started (15 min)](docs/getting-started.md)
- [Configuration Reference](docs/configuration.md)
- [Best Practices](docs/best-practices.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Examples](docs/examples/)

---

## 💡 Tips by Project Type

### Startups
- Use **startup preset**
- Focus on speed (grade C ok)
- Lower coverage (70%)
- Coarse tasks (faster)
- 2 parallel features max

### Enterprise
- Use **enterprise preset**
- Focus on quality (grade B minimum)
- High coverage (90%)
- Fine tasks (detailed)
- 5+ parallel features
- Mandatory security scans
- Compliance tracking

### Open Source
- Use **open-source preset**
- RFC-style PRD IDs
- Community labels (help-wanted)
- Public roadmap (ROADMAP.md)
- Transparent decisions (ADRs)

### Microservices
- API contracts first (Protobuf, OpenAPI)
- Service dependency graphs
- Contract testing (Pact)
- Distributed tracing
- Service mesh (Istio)
- Canary deployments

---

## 🚦 Status Indicators

### PRD Status

| Status | Directory | Meaning |
|--------|-----------|---------|
| 📝 Draft | `01-draft/` | Being written |
| 🔍 Review | `02-review/` | Under review |
| ✅ Ready | `03-ready/` | Approved, ready to code |
| 🚧 In Progress | `04-in-progress/` | Being implemented |
| ✔️ Complete | `05-complete/` | Implemented & merged |
| 📦 Archived | `99-archived/` | Cancelled or superseded |

### Quality Status

| Grade | Symbol | Meaning |
|-------|--------|---------|
| A | ✅ | Excellent |
| B | ✅ | Good |
| C | ⚠️ | Acceptable |
| D | ❌ | Needs work |
| F | 🔴 | Not ready |

---

## 📞 Getting Help

### Resources
- [Documentation](docs/)
- [Examples](docs/examples/)
- [Troubleshooting Guide](docs/troubleshooting.md)
- [GitHub Issues](https://github.com/Yassinello/claude-plugin-prd-workflow/issues)
- [Discussions](https://github.com/Yassinello/claude-plugin-prd-workflow/discussions)

### Issue Templates
- [🐛 Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [✨ Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)
- [⚙️ Configuration Help](.github/ISSUE_TEMPLATE/configuration_help.yml)
- [📚 Documentation Issue](.github/ISSUE_TEMPLATE/documentation.yml)

---

**Version**: 1.0.0
**Last Updated**: 2025-10-25
