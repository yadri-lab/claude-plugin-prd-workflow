# Quick Reference Guide

**PRD Workflow Manager v2.2+** - Essential commands and workflows

---

## Two Workflow Modes

**Mode 1: Full PRD** - Substantial features (>1 day)
**Mode 2: Quick Ship** - Small changes (<4 hours)

---

## Commands Cheat Sheet

### Full PRD Workflow

```bash
/create-prd              # Create PRD with interactive questions
/code-prd PRD-XXX        # Create feature branch (accepts drafts!)
/review-prd PRD-XXX      # 7-dimension analysis on feature branch
/work-prd PRD-XXX        # Guided implementation
/complete-prd PRD-XXX    # AI review + auto-merge
/list-prds               # List all PRDs by status
/archive-prd PRD-XXX     # Archive old completed PRDs
```

### Quick Ship Workflow

```bash
/quick-ship "Fix bug"    # Fast-track small changes, no PRD
```

### Git Commands (Standalone)

```bash
/smart-commit            # AI-generated commit message
/smart-pr                # AI-generated PR description
```

### Quality & Security

```bash
/security-audit          # OWASP Top 10, secrets, dependencies
/quality-check           # Linting, tests, coverage, complexity
```

### Multi-PRD

```bash
/orchestrate             # Dependency graph, parallel features
```

---

## Quick Start Workflows

### Full PRD Workflow (Parallel Development)

```bash
# Main branch (Cursor instance 1)
/create-prd "Add OAuth2 authentication"
→ Answer questions
→ Choose "Review later"
→ Main branch stays FREE

# Feature branch (Cursor instance 2)
/code-prd PRD-007
→ Creates feature branch + worktree

/review-prd PRD-007
→ Refine PRD on feature branch

/work-prd PRD-007
→ Guided dev

/complete-prd PRD-007
→ AI review + auto-merge + cleanup
```

### Quick Ship Workflow

```bash
/quick-ship "Fix dark mode on iOS"
→ 47 minutes later: MERGED & DEPLOYED
```

---

## PRD File Naming

**Format**: `PRD-{ID}-{feature-slug}.md`

Examples:
- `PRD-003-oauth2-integration.md`
- `PRD-007-dark-mode-support.md`
- `PRD-011-api-rate-limiting.md`

---

## Directory Structure

```
product/prds/
├── 01-draft/          # New PRDs (not yet reviewed)
├── 02-approved/       # Reviewed and approved
├── 03-in-progress/    # Currently being developed
├── 05-complete/       # Merged to main
└── 99-archived/       # Old completed PRDs

.claude/
├── config.json        # Plugin configuration
└── quick-ships/       # Quick ship logs
```

---

## Key Concepts

### Parallel Workflow
- Create PRD on Main (draft mode)
- Create feature branch immediately
- Review PRD on feature branch (separate Cursor)
- Main branch never blocked

### PRD States
1. **Draft** - Created, not reviewed
2. **Approved** - Reviewed, ready to code
3. **In Progress** - Being developed
4. **Complete** - Merged to main
5. **Archived** - Old, for reference only

### Auto-Merge
`/complete-prd` will:
1. AI review code vs acceptance criteria
2. Check tests pass
3. Auto-merge if all good
4. Monitor staging + production
5. Cleanup branches/worktrees

---

## Configuration

`.claude/config.json`:
```json
{
  "prd_workflow": {
    "prd_id": {
      "prefix": "PRD",
      "separator": "-",
      "number_padding": 3
    },
    "quick_ship": {
      "enabled": true,
      "auto_merge": true
    }
  }
}
```

---

## Tips

- Use Quick Ship for 80% of changes (bugs, tweaks)
- Use Full PRD for 20% (real features)
- Review on feature branch (keeps Main free)
- Trust AI review for standard features
- Archive PRDs after 2-4 weeks in complete

---

**Plugin**: claude-prd-workflow  
**Version**: 2.2.0  
**Documentation**: [Full Docs](https://github.com/Yassinello/claude-prd-workflow)
