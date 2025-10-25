---
name: create-prd
description: Create new PRD with interactive refinement and AI assistance
category: PRD Management
---

# Create PRD Command

Create a new Product Requirements Document with interactive questions to refine scope before generation.

## Purpose

Generate well-scoped PRDs through:
- Interactive clarifying questions
- AI-assisted content generation
- Standardized structure
- Automatic ID assignment
- Draft mode by default (review later on feature branch)

## Workflow

### Step 1: Gather Feature Description

Ask user for brief feature description:
```markdown
What feature do you want to build?

Example: "Add OAuth2 authentication with Google and GitHub"

> [User input]
```

### Step 2: Interactive Refinement Questions

**CRITICAL**: Ask 4-6 targeted questions to refine scope BEFORE generating full PRD.

Question Selection Strategy:
- Choose questions based on feature type
- Focus on scope boundaries and key decisions  
- Avoid obvious questions
- Keep it conversational

Example Question Flow:
```markdown
Great! Let me ask a few questions to refine the scope...

Question 1: Target Users
Who will use this feature?
Options:
- All users (B2C)
- Enterprise/B2B users only
- Internal team/developers
- Specific user segment

> [User answers]

Question 2: Core Requirements
What are the 2-3 must-have capabilities for v1?
(Focus on minimum viable scope)

> [User lists core requirements]

Question 3: Out of Scope
What are you explicitly NOT doing in v1?
(This prevents scope creep - be specific!)

> [User defines boundaries]

Question 4: Integration Points (if applicable)
Does this integrate with existing systems?
- Which systems/services?
- Data flow between systems?

> [User answers]

Question 5: Success Criteria
How will you measure success?
Pick 1-2 key metrics.

> [User defines metrics]

Question 6: Technical Constraints (if applicable)
Any technical decisions already made?
- Tech stack?
- Performance targets?

> [User answers or "none"]
```

### Step 3: Generate PRD ID

Read PRD ID configuration from .claude/config.json or use defaults (PRD-XXX format)

Scan existing PRDs to find next number

Generate new ID: PRD-007

### Step 4: Generate PRD Content

Using answers from Step 2, generate comprehensive PRD with all required sections

### Step 5: Quick Self-Review

Automatically perform lightweight review and assign grade

### Step 6: Create File with New Naming Format

NEW NAMING FORMAT: PRD-{ID}-{feature-slug}.md

Examples:
- PRD-003-oauth2-integration.md
- PRD-007-dark-mode-support.md

Benefits:
- ID directly in filename (grep-able)
- No date confusion (Git tracks history)
- Cleaner, more professional

Save to: product/prds/01-draft/PRD-{ID}-{feature-slug}.md

### Step 7: Update WORK_PLAN.md

Add new entry to PRD pipeline table

### Step 8: Provide Next Steps with Options

```markdown
PRD Created: PRD-007 - OAuth2 Integration

File: product/prds/01-draft/PRD-007-oauth2-integration.md
Status: Draft
Quick Review: B+ (Good scope)

Next Steps - Choose Your Path:

1. Approve Now (Quick path)
   Move to approved, start coding
   
2. Review Later (Recommended for parallel workflow)
   Keep in draft, create feature branch now
   Allows Main branch to stay free
   
3. Refine First
   Stay on Main, improve PRD now

What would you like to do? (1/2/3)
```

Handle user choice appropriately

## Configuration

Respects prd_workflow configuration in .claude/config.json

## Options

```bash
/create-prd
/create-prd "Add OAuth2 authentication"
/create-prd "Simple bug fix" --quick
/create-prd "New feature" --auto-approve
```

## Best Practices

- Ask clarifying questions - Don't assume!
- Define OUT OF SCOPE - Critical to prevent creep
- Stay in draft by default - Review on feature branch
- One feature per PRD
- Be specific
- Include success metrics

---

Plugin: claude-prd-workflow
Category: PRD Management
Version: 2.2.0
Requires: Git 2.0+
