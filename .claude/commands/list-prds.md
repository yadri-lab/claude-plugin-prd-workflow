---
name: list-prds
description: List all PRDs with status, priority, and grade
category: PRD Management
version: 0.4.2
---

# List PRDs Command

Display all PRDs across directories with filtering and sorting.

## Purpose

Quick overview of PRD status:
- View all PRDs at a glance
- Filter by status, priority, grade
- Sort by various criteria
- Track progress across projects

## Workflow

### 1. Scan PRD Directories

Scan all PRD directories:
- `01-draft/`: Drafts awaiting review
- `02-ready/`: Reviewed, ready for development
- `03-in-progress/`: Currently being implemented
- `04-complete/`: Completed features
- `05-archived/`: Archived PRDs

### 2. Display PRD Table

```markdown
📋 PRDs Overview (15 total)

| ID | Feature | Status | Priority | Grade | Owner | Effort |
|----|---------|--------|----------|-------|-------|--------|
| 003 | OAuth2 Integration | Complete ✅ | P0 | A- | Alice | 7d |
| 005 | Dark Mode | In Progress 🔄 | P1 | B+ | Bob | 3d |
| 007 | API v2 | Ready 📦 | P0 | A | - | 12d |
| 008 | Export Feature | Draft 📝 | P2 | C | - | 5d |
| 009 | Mobile App | Archived 🗄️ | P1 | B | - | 30d |

Summary:
• Draft: 3 PRDs
• Ready: 2 PRDs
• In Progress: 1 PRD
• Complete: 8 PRDs
• Archived: 1 PRD
```

### 3. Apply Filters (Optional)

**Filter by status**:
```bash
/list-prds --status=ready
```

**Filter by priority**:
```bash
/list-prds --priority=P0
```

**Filter by grade**:
```bash
/list-prds --min-grade=B
```

**Combine filters**:
```bash
/list-prds --status=ready --priority=P0
```

### 4. Sort Results

**Sort options**:
- `--sort=priority`: By priority (P0 first)
- `--sort=grade`: By grade (A first)
- `--sort=date`: By creation date
- `--sort=effort`: By estimated effort

## Flags

**Filters**:
- `--status={draft|ready|in-progress|complete|archived}`
- `--priority={P0|P1|P2}`
- `--min-grade={A|B|C|D|F}`
- `--owner={name}`

**Display**:
- `--sort={priority|grade|date|effort}`
- `--reverse`: Reverse sort order
- `--limit=N`: Show only N results
- `--verbose`: Show more details

**Examples**:
```bash
/list-prds
/list-prds --status=ready --priority=P0
/list-prds --min-grade=B --sort=effort
/list-prds --verbose
```

## Configuration

```json
{
  "prd_workflow": {
    "list": {
      "default_sort": "priority",
      "show_archived": false,
      "columns": ["id", "feature", "status", "priority", "grade"]
    }
  }
}
```

## Success Criteria

- ✅ All PRDs scanned from all directories
- ✅ Accurate status, priority, grade displayed
- ✅ Filters applied correctly
- ✅ Sorted as requested
- ✅ Easy to read and understand

---

**Version**: 0.4.2
**Plugin**: claude-prd-workflow v0.4.2
