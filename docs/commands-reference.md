# Commands Reference

Quick reference for all 9 PRD Workflow Manager commands.

## Command Overview

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/create-prd` | Create new PRD | Starting new feature |
| `/review-prd` | Review & approve PRD | Before development |
| `/code-prd` | Start development | After PRD approved |
| `/work-prd` | Guided implementation | During development |
| `/list-prds` | View all PRDs | Check status |
| `/archive-prd` | Archive PRDs | Feature complete |
| `/security-audit` | Security scan | Before PR |
| `/quality-check` | Quality analysis | Before PR |
| `/orchestrate` | Multi-PRD coordination | Multiple features |

Full details: See individual command files in `commands/` directory.

## Quick Usage

**Typical Workflow**:
```
/create-prd → /review-prd → approve → /code-prd → /work-prd → /security-audit → /quality-check → Create PR
```

**Check Status**:
```
/list-prds
```

**Coordinate Multiple Features**:
```
/orchestrate
```

For detailed information, see each command's documentation file or [Best Practices](best-practices.md).
