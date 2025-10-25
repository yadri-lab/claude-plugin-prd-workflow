# Best Practices

Proven workflows and recommendations for using PRD Workflow Manager effectively.

## PRD Writing

### 1. Start with Template

✅ **DO**: Use the provided template
```
/create-prd
```

❌ **DON'T**: Start from blank file

**Why**: Template ensures you don't miss critical sections

---

### 2. Define Clear Scope

✅ **DO**: Explicit IN vs OUT scope
```markdown
## Scope

### In Scope (v1.0)
- User login with email/password
- Password reset flow
- Email verification

### Out of Scope
- Social login (v1.1)
- 2FA (v1.1)
- SSO (v2.0)
```

❌ **DON'T**: Vague scope
```markdown
Build authentication system
```

**Why**: Prevents scope creep and sets clear expectations

---

### 3. Write Testable Acceptance Criteria

✅ **DO**: Specific, measurable criteria
```markdown
- [ ] User can log in with valid email/password in <2 seconds
- [ ] Invalid credentials show error message
- [ ] 5 failed attempts lock account for 15 minutes
```

❌ **DON'T**: Vague criteria
```markdown
- [ ] Login works well
- [ ] Good performance
```

**Why**: Enables objective verification of completion

---

### 4. Identify Dependencies Early

✅ **DO**: List all dependencies upfront
```markdown
## Dependencies

**Depends On** (must complete first):
- PRD-001: Database schema

**Provides For** (blocked by this):
- PRD-005: User dashboard
- PRD-007: Profile management
```

❌ **DON'T**: Discover dependencies during development

**Why**: Prevents blockers and enables planning

---

### 5. Include Risk Mitigation

✅ **DO**: Assess risks with mitigation plans
```markdown
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Email service down | Medium | High | Queue emails, retry with backoff |
| Slow password hashing | Low | Medium | Use bcrypt with 12 rounds (benchmarked) |
```

❌ **DON'T**: Ignore risks

**Why**: Reduces surprises and downtime

---

## PRD Review Process

### 1. Review Before Coding

✅ **DO**: Achieve B+ grade minimum before `/code-prd`
```
/review-prd
# Answer all calibration questions
# Make improvements
# Re-review until B+
```

❌ **DON'T**: Start coding with D/F grade PRD

**Why**: Saves 10x time vs fixing during development

---

### 2. Answer Calibration Questions Honestly

✅ **DO**: Thoughtful, realistic answers
```markdown
Q: Can we ship 50% of this in v1.0?
A: Yes, defer dark mode and theme customization to v1.1
```

❌ **DON'T**: Ignore questions or give superficial answers

**Why**: Questions expose gaps and force prioritization

---

### 3. Iterate on Feedback

✅ **DO**: Treat review as collaborative improvement
```
Claude: "Accessibility standards missing"
You: Add WCAG 2.1 AA requirement to PRD
```

❌ **DON'T**: Get defensive about feedback

**Why**: Better PRD = better product

---

## Development Workflow

### 1. Use Worktrees for Parallel Work

✅ **DO**: One worktree per feature
```bash
# Feature A (main repo)
cd ~/watchora
/code-prd  # Creates feat/PRD-003

# Feature B (worktree)
cd ~/watchora-rss
/code-prd  # Creates feat/PRD-008

# Work in parallel with no conflicts!
```

❌ **DON'T**: Switch branches frequently
```bash
git checkout feat/PRD-003
# Work...
git checkout feat/PRD-008  # Context switch!
# Work...
git checkout feat/PRD-003  # Switch again!
```

**Why**: Worktrees eliminate context switching

---

### 2. Follow Guided Implementation

✅ **DO**: Use `/work-prd` for step-by-step guidance
```
/work-prd
# Task 1: Setup types (30min)
# Complete task 1
# Task 2: Implement component (2h)
# ...
```

❌ **DON'T**: Wing it without structure

**Why**: Reduces forgotten tasks and provides progress tracking

---

### 3. Commit Frequently

✅ **DO**: Small, atomic commits
```bash
git commit -m "feat(PRD-003): Add Button component types"
git commit -m "feat(PRD-003): Implement Button variants"
git commit -m "feat(PRD-003): Add Button tests"
```

❌ **DON'T**: Large, monolithic commits
```bash
git commit -m "feat(PRD-003): Complete entire feature" # 100 files
```

**Why**: Easier to review, revert, and debug

---

### 4. Run Quality Checks Before PR

✅ **DO**: Verify quality before creating PR
```bash
/security-audit
# Fix high-severity issues

/quality-check
# Fix linting errors
# Ensure 80%+ coverage

# Then create PR
gh pr create
```

❌ **DON'T**: Create PR with known issues

**Why**: Faster PR approval, fewer review cycles

---

## Git Worktree Management

### 1. Clean Up After Merge

✅ **DO**: Remove worktree when feature complete
```bash
# After PR merged
cd ~/watchora  # Main repo
git worktree remove ../watchora-design-system
git branch -d feat/PRD-003-design-system
git pull origin main
```

❌ **DON'T**: Leave stale worktrees
```bash
# 10 worktrees laying around
git worktree list  # Shows 10 directories!
```

**Why**: Saves disk space and reduces confusion

---

### 2. Name Worktrees Clearly

✅ **DO**: Descriptive names
```
../watchora-design-system/    # Clear what this is
../watchora-rss-monitoring/
../watchora-auth/
```

❌ **DON'T**: Generic names
```
../wt1/   # What is this?
../temp/
../worktree/
```

**Why**: Easier to find the right worktree

---

### 3. Keep Worktrees Synced

✅ **DO**: Rebase regularly
```bash
cd ../watchora-design-system
git fetch origin
git rebase origin/main
```

❌ **DON'T**: Let worktree drift from main
```bash
# 2 weeks behind main
git log main..HEAD --oneline  # 150 commits!
```

**Why**: Reduces merge conflicts

---

## Quality & Security

### 1. Fix High-Severity Issues Immediately

✅ **DO**: Prioritize security
```
/security-audit
# High: Hardcoded API key found
# Fix immediately before continuing
```

❌ **DON'T**: Defer security fixes

**Why**: Security vulnerabilities compound over time

---

### 2. Maintain Test Coverage

✅ **DO**: Write tests as you code
```
Task 1: Implement Button
  - Write Button.tsx
  - Write Button.test.tsx ← Do this immediately
Task 2: Implement Input
  - Write Input.tsx
  - Write Input.test.tsx
```

❌ **DON'T**: "I'll write tests later"

**Why**: Never happens, or takes 2x time

---

### 3. Use Auto-Fix When Safe

✅ **DO**: Auto-fix linting/formatting
```
/quality-check
# 10 auto-fixable warnings
# Choose "Yes" to auto-fix
```

❌ **DON'T**: Manually fix 100 formatting issues

**Why**: Saves time, more consistent

---

## Multi-PRD Orchestration

### 1. Start with Dependency Graph

✅ **DO**: Visualize dependencies before starting
```
/orchestrate
# See which PRDs block others
# Plan optimal sequence
```

❌ **DON'T**: Start all PRDs randomly

**Why**: Avoids blockers and wasted work

---

### 2. Respect Parallel Limits

✅ **DO**: Stay within config limits
```json
{ "parallel_features": 3 }
```
```
2 PRDs in progress ✅
Start 1 more ✅
Start 4th? ❌ Wait for one to complete
```

❌ **DON'T**: 10 PRDs in progress simultaneously

**Why**: Context switching kills productivity

---

### 3. Merge Frequently

✅ **DO**: Merge completed PRDs quickly
```
PRD-003 complete → Merge within 24h
PRD-008 complete → Merge within 24h
```

❌ **DON'T**: Hold completed PRDs for weeks

**Why**: Reduces merge conflicts for dependent PRDs

---

## Team Collaboration

### 1. Share Configuration

✅ **DO**: Commit config to repo
```bash
git add .claude/config.json
git commit -m "chore: Add PRD workflow config"
git push
```

❌ **DON'T**: Everyone has different config

**Why**: Ensures consistent workflow across team

---

### 2. Use Consistent PRD IDs

✅ **DO**: Sequential numbering
```
PRD-001, PRD-002, PRD-003, ...
```

❌ **DON'T**: Random IDs
```
PRD-A, PRD-TEMP, PRD-NEW, ...
```

**Why**: Easy to reference and track

---

### 3. Document Decisions

✅ **DO**: Update PRD with decisions made during implementation
```markdown
## Technical Decisions

1. **Use Radix UI primitives** (2025-10-25)
   - Rationale: Better accessibility than building from scratch
   - Impact: +50KB bundle size (acceptable)
```

❌ **DON'T**: Decisions lost in Slack/email

**Why**: Context for future maintainers

---

## Common Pitfalls

### 1. Scope Creep

**Problem**: Feature grows during development
```
Initial: "Basic button component"
Week 2: "...with animations, tooltips, keyboard nav..."
Week 4: "...dark mode, custom themes, icon library..."
```

**Solution**: Strict scope enforcement
- Defer extras to v1.1
- Use `/review-prd` dimension #7 (Simplification)
- Ask: "Can we ship without this?"

---

### 2. Over-Engineering

**Problem**: Building for hypothetical future needs
```
"Let's make this configurable for 10 use cases!"
(Reality: Only 1 use case exists)
```

**Solution**: YAGNI (You Aren't Gonna Need It)
- Build for current requirements
- Refactor when 2nd use case appears
- Trust: Refactoring is easier than you think

---

### 3. Skipping Review

**Problem**: "This PRD is simple, no need to review"
```
# Starts coding
# Discovers missing requirements
# 3 days wasted
```

**Solution**: Always review
- Even "simple" PRDs have gaps
- 30min review saves 3 days of work
- `/review-prd` is free insurance

---

### 4. Ignoring Dependencies

**Problem**: Starting PRD-007 before PRD-003 completes
```
PRD-007: Landing page (needs design system)
PRD-003: Design system (in progress, 50% done)
# Now PRD-007 is blocked!
```

**Solution**: Use `/orchestrate`
- Visualize dependencies
- Start independent PRDs first
- Sequence dependent PRDs

---

## Metrics to Track

### Individual

- **Velocity**: PRDs completed per week
- **Quality**: % of PRDs with A/B grade
- **Rework**: % of PRDs requiring major changes post-approval
- **Time to Completion**: Days from draft to production

### Team

- **Throughput**: PRDs in progress → complete per week
- **Cycle Time**: Average days per PRD
- **Blocked Rate**: % of PRDs blocked by dependencies
- **Defect Rate**: Issues found post-release per PRD

**How to Use**:
```
/list-prds
# Track over time
# Identify bottlenecks
# Adjust process
```

---

## Continuous Improvement

### Monthly Review

**Questions to ask**:
1. Which PRDs took longer than estimated? Why?
2. Which PRDs had major changes post-approval?
3. What security/quality issues recur?
4. Are we using all plugin features effectively?

**Actions**:
- Update PRD template based on learnings
- Adjust configuration (coverage threshold, etc.)
- Add custom review dimensions for domain-specific concerns
- Share lessons learned with team

---

## Resources

- [Configuration Reference](configuration.md)
- [Commands Reference](commands-reference.md)
- [Troubleshooting](troubleshooting.md)
- [Examples](examples/)

---

**Remember**: Good process evolves with the team. Start simple, add complexity only when needed.
