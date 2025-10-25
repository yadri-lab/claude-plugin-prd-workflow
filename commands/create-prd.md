---
name: create-prd
description: Create new PRD from template with guided prompts
category: PRD Management
---

# Create PRD Command

Create a new Product Requirements Document from template with AI-assisted content generation.

## Purpose

Scaffold a new PRD with:
- Standardized structure
- Guided prompts for each section
- Best practices embedded
- Automatic ID assignment
- Initial placement in draft folder

## Workflow

### Step 1: Gather Basic Information

Ask user for:
1. **Feature name** (e.g., "Design System v1.0")
2. **One-line description** (e.g., "Reusable component library")
3. **Priority** (P0/P1/P2/P3)
4. **Target date** (optional)

### Step 2: Generate PRD ID

**IMPORTANT: Read PRD ID configuration from user's project**

1. **Check if `.claude/config.json` exists in project root**:
   ```bash
   # Use Read tool to read .claude/config.json
   # If file doesn't exist, use defaults
   ```

2. **Parse config and extract prd_id settings**:
   ```javascript
   // If .claude/config.json exists and has prd_workflow.prd_id:
   const prd_id_config = {
     prefix: config.prd_workflow.prd_id.prefix,           // e.g., "WTC-PRD", "PRD"
     separator: config.prd_workflow.prd_id.separator,     // e.g., "-", "_"
     number_padding: config.prd_workflow.prd_id.number_padding  // e.g., 3, 4
   }

   // Otherwise use defaults:
   const prd_id_config = {
     prefix: "PRD",
     separator: "-",
     number_padding: 3
   }
   ```

3. **Scan existing PRDs to find next number**:
   ```bash
   # Use Glob tool to find all PRD files
   glob pattern: "product/prds/**/*.md"

   # Extract PRD IDs from filenames and content
   # Look for patterns like: PRD-001, WTC-PRD-003, FEAT_0012, etc.
   # Extract the numeric part
   # Find the highest number
   ```

4. **Generate new PRD ID**:
   ```javascript
   // Example calculation:
   // If highest existing = 6, next = 7

   const next_number = highest_number + 1;  // e.g., 7

   // Pad with zeros based on number_padding
   const padded = String(next_number).padStart(prd_id_config.number_padding, '0');
   // e.g., 7 → "007" (if padding=3), or "0007" (if padding=4)

   // Combine to form PRD ID
   const prd_id = `${prd_id_config.prefix}${prd_id_config.separator}${padded}`;
   // e.g., "WTC-PRD-007" or "PRD-007" or "FEAT_0007"
   ```

**Examples with different configs**:
- Config: `{ prefix: "PRD", separator: "-", number_padding: 3 }` → `PRD-007`
- Config: `{ prefix: "WTC-PRD", separator: "-", number_padding: 3 }` → `WTC-PRD-007`
- Config: `{ prefix: "ACME-PRD", separator: "-", number_padding: 3 }` → `ACME-PRD-007`
- Config: `{ prefix: "FEAT", separator: "_", number_padding: 4 }` → `FEAT_0007`

**Error Handling**:
- If `.claude/config.json` is malformed → Use defaults + warn user
- If `number_padding` < 1 or > 6 → Use 3 + warn user
- If `prefix` is empty → Use "PRD" + warn user

### Step 3: Load Template

Read from `templates/prd-template.md` and populate:
- PRD ID
- Feature name
- Description
- Priority
- Created date
- Author (from git config)
- Initial status: "Draft"

### Step 4: AI-Assisted Section Fill (Optional)

Offer to help fill sections using AI:

For each major section, ask:
```markdown
Would you like help drafting this section?
1. Problem Statement
2. Proposed Solution
3. Technical Approach
4. Acceptance Criteria

(Enter section numbers or 'skip' to fill manually later)
```

If user selects sections, use conversational prompts:
- **Problem**: "What problem does this solve? Who has this problem?"
- **Solution**: "How will this feature solve the problem?"
- **Technical**: "What tech stack? Any architecture decisions?"
- **Criteria**: "How will you know it's done? What must work?"

Generate initial content based on answers.

### Step 5: Create File

Filename format: `YYMMDD-{feature-slug}-v1.md`
Example: `251025-design-system-v1.md`

Save to: `{config.directories.draft}/251025-design-system-v1.md`

### Step 6: Update WORK_PLAN.md (if enabled)

Add new entry to PRD pipeline table:
```markdown
| Design System v1.0 | 📝 01-draft | - | P0 | Finish writing |
```

### Step 7: Provide Next Steps

```markdown
✅ **PRD Created: PRD-018 - Design System v1.0**

**Location**: `product/prds/01-draft/251025-design-system-v1.md`
**Status**: Draft
**Priority**: P0

## Next Steps

1. **Fill in remaining sections**:
   - Dependencies
   - Risk Assessment
   - Timeline & Milestones

2. **Add acceptance criteria**: Be specific and measurable

3. **When ready for review**: Run `/review-prd`

## Quick Tips

- Keep scope tight for v1.0 (ship 50% of vision)
- Define clear IN vs OUT scope
- Add wireframes/mockups if UX-heavy
- List all dependencies and blockers
- Make acceptance criteria testable

**Open PRD**:
- In editor: `code product/prds/01-draft/251025-design-system-v1.md`
- In Claude: Say "open the new PRD"
```

## Template Structure

The PRD template includes:
- Metadata header (ID, status, priority, dates)
- Executive Summary
- Problem Statement
- Proposed Solution
- Technical Approach
- Scope (IN vs OUT)
- Dependencies & Blockers
- Acceptance Criteria (P0/P1/P2)
- Risk Assessment
- Timeline & Milestones
- Success Metrics
- Open Questions

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft"
    },
    "branch_naming": {
      "prd_id_format": "PRD-{number}"
    }
  }
}
```

## Success Criteria

- PRD file created with valid structure
- PRD ID is unique and sequential
- File saved in draft directory
- WORK_PLAN.md updated (if enabled)
- User knows next steps

## Related

- Template: `templates/prd-template.md`
- Next Command: `/review-prd` (when ready for review)
- Skill: `documentation`
