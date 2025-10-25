---
name: archive-prd
description: Archive completed or cancelled PRDs
category: PRD Management
---

# Archive PRD Command

Move completed or cancelled PRDs to archive folder with metadata preservation.

## Purpose

Keep PRD directories clean while preserving historical context:
- Archive completed features
- Archive cancelled/deprecated PRDs
- Maintain searchable history
- Generate archive summary

## Workflow

### Step 1: List Archivable PRDs

Show PRDs from:
- `05-complete/` - Completed and merged
- Any directory if user wants to cancel/deprecate

```markdown
📦 **PRDs Available for Archiving**

## Completed (Ready to Archive)
| # | PRD ID | Feature | Completed | Days Since |
|---|--------|---------|-----------|------------|
| 1 | PRD-001 | Project Setup | 2025-09-15 | 40 days |
| 2 | PRD-002 | CI/CD Pipeline | 2025-09-20 | 35 days |
| 3 | PRD-005 | Database Schema | 2025-10-10 | 15 days |

## Other PRDs
To archive a PRD from another status (e.g., cancelled):
- Enter PRD ID manually
- Enter filename

Which PRD to archive? (number, PRD-XXX, or filename)
```

### Step 2: Confirm Archive Reason

Ask user:
```markdown
Why are you archiving PRD-005 (Database Schema)?

1. ✅ Completed and shipped
2. ❌ Cancelled (no longer needed)
3. 🔀 Superseded by another PRD
4. 🚫 Blocked indefinitely
5. Other (specify)

Select reason: (1-5)
```

### Step 3: Collect Archive Metadata

Based on reason, ask relevant questions:

**If Completed**:
- PR number (if not in PRD)
- Production deploy date
- Any learnings/retrospective notes

**If Cancelled**:
- Why cancelled?
- Was any work done?
- Lessons learned

**If Superseded**:
- Superseded by which PRD?
- What changed in approach?

### Step 4: Update PRD Header

Add archive metadata to PRD:
```markdown
**Status**: Archived
**Archive Reason**: Completed and shipped
**Archived Date**: 2025-10-25
**PR**: #42
**Production Deploy**: 2025-10-15
**Archive Notes**: Successful implementation, no major issues. Performance exceeded targets.
```

### Step 5: Move to Archive

Move file:
```bash
mv product/prds/05-complete/250915-project-setup-v1.md \
   product/prds/99-archived/250915-project-setup-v1.md
```

### Step 6: Update WORK_PLAN.md

Remove from active pipeline table.

Add to archive log (if exists):
```markdown
## Archive Log

| Archive Date | PRD ID | Feature | Reason | Notes |
|--------------|--------|---------|--------|-------|
| 2025-10-25 | PRD-005 | Database Schema | Completed | Shipped in v1.0 |
| 2025-10-23 | PRD-001 | Project Setup | Completed | Initial release |
```

### Step 7: Generate Archive Summary

```markdown
✅ **PRD Archived: PRD-005 - Database Schema**

**From**: product/prds/05-complete/
**To**: product/prds/99-archived/
**Reason**: Completed and shipped

## Summary
- **Developed**: Sep 20 - Oct 10 (20 days)
- **PR**: #42 (merged Oct 10)
- **Deployed**: Oct 15
- **Grade**: A (achieved all P0 criteria)

## Impact
- Shipped to production successfully
- Performance exceeded targets (500ms → 120ms queries)
- No post-launch issues

## Learnings
- Postgres JSONB columns were excellent choice
- Should have added more indices upfront
- Migration testing saved us from downtime

**Archive Location**: `product/prds/99-archived/250915-database-schema-v1.md`

---

**Active PRDs**: 11 (down from 12)
**Archived PRDs**: 16 (up from 15)
```

## Archive Organization

Optional: Organize archives by year or quarter:
```
99-archived/
  2024/
    Q3/
      240815-feature-x.md
    Q4/
      241020-feature-y.md
  2025/
    Q4/
      251025-feature-z.md
```

Configurable via:
```json
{
  "prd_workflow": {
    "archive": {
      "organize_by": "year", // "year", "quarter", or "flat"
      "retention_days": 0 // 0 = forever
    }
  }
}
```

## Success Criteria

- PRD moved to archive directory
- Archive metadata added to PRD
- WORK_PLAN.md updated
- Archive log updated
- Historical context preserved

## Related

- Command: `/list-prds` (shows archive count)
- Archive template: `templates/archive-notes-template.md`
