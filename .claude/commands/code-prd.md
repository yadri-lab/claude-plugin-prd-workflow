---
name: code-prd
description: 4-phase Context Engineering workflow with guided implementation
category: PRD Management
version: 0.4.2
---

# Code PRD Command

Guided implementation using 4-phase Context Engineering workflow.

## Purpose

Bridge PRD to implementation with:
- **Context management**: Never exceed 60% context for quality
- **4-Phase workflow**: Research → Plan → Implement → Validate
- **Persistent memory**: Thoughts saved in `.prds/thoughts/`
- **Incremental progress**: Clear checkpoints and validation
- **Quality assurance**: Continuous alignment with PRD

## Workflow

### Phase 1: Research (Context Gathering)

**Goal**: Deep codebase understanding before writing code.

**Activities**:
- Read PRD acceptance criteria and technical design
- Explore relevant codebase areas
- Identify existing patterns and conventions
- Find dependencies and integration points
- Note architectural constraints
- Document unknowns and questions

**Output**: Research summary saved in `.prds/thoughts/research/PRD-XXX-research.md`

**Key questions**:
- Where does this feature fit in the codebase?
- What patterns/conventions should I follow?
- What dependencies exist?
- What could go wrong?

### Phase 2: Plan (Task Breakdown)

**Goal**: Detailed implementation plan with tasks and estimates.

**Activities**:
- Break down PRD into concrete tasks
- Identify task dependencies
- Estimate effort per task
- Plan testing strategy
- Define validation checkpoints
- Risk mitigation planning

**Output**: Implementation plan saved in `.prds/thoughts/plans/PRD-XXX-plan.md`

**Plan structure**:
- Task list with estimates
- Dependency graph
- Critical path identified
- Testing approach
- Validation criteria

### Phase 3: Implement (Guided Development)

**Goal**: Execute plan incrementally with continuous validation.

**Activities**:
- Work task-by-task from plan
- Checkpoint after each major task
- Validate against acceptance criteria
- Adapt plan based on learnings
- Document decisions and trade-offs
- Keep context under 60%

**Checkpoints**:
- After each task: Does it work? Tests pass? Aligned with PRD?
- Before next task: Context cleanup if needed
- Major milestones: User validation opportunity

**Best practices**:
- Small commits with clear messages
- Test as you go
- Document non-obvious decisions
- Ask user if stuck or uncertain

### Phase 4: Validate (Quality Assurance)

**Goal**: Ensure implementation meets all PRD requirements.

**Activities**:
- Run full test suite
- Verify all acceptance criteria met
- Check code quality and patterns
- Security review
- Performance check
- Documentation updated

**Output**: Validation report in `.prds/thoughts/validation/PRD-XXX-validation.md`

**Validation checklist**:
- ✅ All acceptance criteria met
- ✅ Tests passing (unit, integration, e2e)
- ✅ No security issues
- ✅ Performance acceptable
- ✅ Code quality good
- ✅ Documentation complete

### Final: Create PR

**After validation passes**:
- Commit all changes
- Create pull request
- Link to PRD
- Add PR number to PRD metadata
- Move PRD to `03-in-progress/`

## Flags & Options

**Quick mode** (`--quick`):
- Skip research and planning phases
- Direct implementation (legacy behavior)
- Use for: Tiny changes, bug fixes

**Skip phases**:
- `--skip-research`: Start with planning
- `--skip-plan`: Direct implementation with research
- `--manual-checkpoints`: User approves each checkpoint

**Examples**:
```bash
/code-prd PRD-007                    # Full 4-phase workflow
/code-prd PRD-007 --quick            # Legacy quick mode
/code-prd PRD-007 --skip-research    # Plan + Implement + Validate
/code-prd PRD-007 --manual-checkpoints  # User approval at each phase
```

## Context Engineering Principles

**60% Rule**:
- Never let context exceed 60% capacity
- Clear context between phases
- Persist learnings in thoughts/ directory
- Quality degrades beyond 60%

**Incremental Progress**:
- Small, validated steps
- Checkpoint frequently
- Adapt plan based on reality
- User can jump in anytime

**Persistent Memory**:
- Research findings saved
- Plan documented
- Decisions recorded
- Learnings preserved for team

**Validation First**:
- Test continuously
- Validate against PRD
- Catch issues early
- User feedback integrated

## Directory Structure

```
.prds/
├── thoughts/
│   ├── research/
│   │   └── PRD-XXX-research.md    # Phase 1 output
│   ├── plans/
│   │   └── PRD-XXX-plan.md        # Phase 2 output
│   └── validation/
│       └── PRD-XXX-validation.md  # Phase 4 output
```

## Configuration

```json
{
  "context_engineering": {
    "enabled": true,
    "max_context_threshold": 0.60,
    "checkpoint_frequency": "per_task",
    "auto_save_thoughts": true
  },
  "prd_workflow": {
    "directories": {
      "ready": "product/prds/02-ready",
      "in_progress": "product/prds/03-in-progress"
    }
  }
}
```

## Success Criteria

- ✅ All 4 phases completed (or skipped intentionally)
- ✅ Implementation aligns with PRD
- ✅ All acceptance criteria met
- ✅ Tests passing
- ✅ PR created and linked
- ✅ Context stayed under 60% throughout
- ✅ Thoughts documented for team

## Example Output

```markdown
🚀 Starting PRD-007: OAuth2 Integration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 PHASE 1: RESEARCH (15 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Exploring codebase...
✓ Found auth/ directory with Passport.js setup
✓ Identified user model in models/User.js
✓ Existing local strategy pattern to follow

Research saved → .prds/thoughts/research/PRD-007-research.md
Context: 45% ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PHASE 2: PLAN (20 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Breaking down into tasks...

1. Configure Passport Google strategy (2h)
2. Add OAuth routes (1h)
3. Update User model (1h)
4. Add OAuth buttons to UI (2h)
5. Write tests (3h)

Total: ~9h (1.2 days)

Plan saved → .prds/thoughts/plans/PRD-007-plan.md
Context: 38% ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PHASE 3: IMPLEMENT (6h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task 1/5: Configure Passport Google strategy
✓ Created auth/strategies/google.js
✓ Tests passing
Context: 52% ✓

Task 2/5: Add OAuth routes
✓ Created routes/auth/oauth.js
✓ Tests passing
Context: 59% ⚠️

[Context cleanup before next task...]
Context: 41% ✓

[... continue through all tasks ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE 4: VALIDATE (30 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running validation...
✓ All acceptance criteria met (12/12)
✓ Tests passing (24 tests, 96% coverage)
✓ No security issues
✓ Performance acceptable (<200ms)

Validation saved → .prds/thoughts/validation/PRD-007-validation.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 IMPLEMENTATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created PR: #42 - OAuth2 Integration
PRD moved: 02-ready → 03-in-progress

Next: Review PR, merge, /complete-prd
```

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
