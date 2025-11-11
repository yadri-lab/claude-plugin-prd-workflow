---
name: create-prd-env
description: Initialize PRD structure in any project
category: PRD Management
---

# Create PRD Environment Command

Initialize the complete PRD workflow structure in any project with one command.

## Purpose

Set up everything needed for PRD-driven development:
- Folder structure (01-draft → 04-complete)
- PRD templates (full, quick, experiment)
- Configuration files
- Documentation  
- Decision log

**Use cases**:
- New project starting from scratch
- Existing project adopting PRD workflow
- Migrate from old PRD structure (v2.x → v0.3)


## Workflow

### Step 1: Detect Existing Structure

Check for existing PRD folders:

```bash
# Check for old v2.x structure
if [ -d "product/prds/02-review" ]; then
  echo "⚠️ Old structure detected (v2.x)"
  echo "Migration needed: 02-review → removed"
  echo "                  03-ready → 02-ready"
  echo "                  04-in-progress → 03-in-progress"  
  echo "                  05-complete → 04-complete"
fi

# Check if already initialized
if [ -f "product/.prd-config.json" ]; then
  echo "ℹ️ PRD environment already initialized"
  echo "Version: $(cat product/.prd-config.json | grep version)"
fi
```

**If existing found**, ask user:
```markdown
📦 Existing PRD Structure Found

Options:
  [1] Migrate to v0.3.0 structure (recommended)
  [2] Clean install (backup existing)
  [3] Validate existing structure
  [4] Cancel

Choose: _
```

**If none found**, proceed to create.

### Step 2: Create Folder Structure

```bash
# Create PRD folders (v0.3 structure)
mkdir -p product/prds/{01-draft,02-ready,03-in-progress,04-complete,99-archived}

# Create supporting folders
mkdir -p product/decisions
mkdir -p product/templates

echo "✅ Folder structure created"
```

**Structure**:
```
product/
├── prds/
│   ├── 01-draft/         # New PRDs
│   ├── 02-ready/         # Ready to code
│   ├── 03-in-progress/   # Being implemented
│   ├── 04-complete/      # Merged to production
│   └── 99-archived/      # Historical reference
├── decisions/            # Architecture Decision Records
├── templates/            # PRD templates
└── WORK_PLAN.md          # Pipeline tracker
```

### Step 3: Create Templates

Create 3 PRD templates:

**1. Full Feature Template** (`product/templates/full-feature.md`)
- Complete PRD structure
- Problem statement, solution, acceptance criteria
- Technical approach, testing strategy
- For features 5+ days

**2. Quick Feature Template** (`product/templates/quick-feature.md`)
- Lightweight PRD
- What, why, acceptance criteria
- For features 1-3 days

**3. Experiment Template** (`product/templates/experiment.md`)
- Hypothesis-driven
- Success metrics, experiment design
- For POCs and A/B tests

Templates are created from plugin's built-in templates.

### Step 4: Create Configuration

```bash
cat > product/.prd-config.json << 'CONFIG'
{
  "version": "0.3.0",
  "structure": {
    "base_dir": "product/prds",
    "folders": {
      "draft": "01-draft",
      "ready": "02-ready",
      "in_progress": "03-in-progress",
      "complete": "04-complete",
      "archived": "99-archived"
    }
  },
  "workflow": {
    "auto_assign": true,
    "progress_tracking": true,
    "checkpoints_enabled": true
  },
  "git": {
    "branch_prefix": "feature",
    "worktree_enabled": false
  }
}
CONFIG
```

### Step 5: Create Documentation

**product/README.md**:
- Folder structure explanation
- Workflow overview
- Available commands
- Best practices

**product/WORK_PLAN.md**:
- Active pipeline tables
- Draft/Ready/In Progress/Complete sections
- Metrics tracking

**product/decisions/README.md**:
- ADR template and guidelines

### Step 6: Migration (if needed)

If old structure detected:

```bash
# Backup first
cp -r product/prds product/prds.backup.$(date +%Y%m%d)

# Migrate folders
rm -rf product/prds/02-review  # Remove old review folder
mv product/prds/03-ready product/prds/02-ready
mv product/prds/04-in-progress product/prds/03-in-progress
mv product/prds/05-complete product/prds/04-complete

echo "✅ Migration complete"
echo "📦 Backup saved: product/prds.backup.YYYYMMDD"
```

### Step 7: Final Summary

```markdown
✅ **PRD Environment Ready!**

📂 Structure Created:
  • product/prds/01-draft/
  • product/prds/02-ready/
  • product/prds/03-in-progress/
  • product/prds/04-complete/
  • product/prds/99-archived/
  • product/decisions/
  • product/templates/

📄 Files Created:
  • 3 PRD templates (full, quick, experiment)
  • .prd-config.json (configuration)
  • README.md (workflow guide)
  • WORK_PLAN.md (pipeline tracker)
  • decisions/README.md (ADR guide)

🎯 Next Steps:
  1. Create your first PRD: /create-prd "Feature Name"
  2. Review templates: product/templates/
  3. Read workflow: product/README.md

💡 All PRD commands now available in this project!
```

## Configuration

Created `.prd-config.json` with:
- Folder structure definitions
- Workflow settings (auto-assign, progress tracking)
- Git configuration (branch prefix, worktree)

## Options

```bash
# Interactive (default)
/create-prd-env

# Force clean install
/create-prd-env --clean

# Migrate existing
/create-prd-env --migrate

# Custom directory
/create-prd-env --dir=custom/path
```

## Error Handling

**Already initialized**:
```markdown
ℹ️ PRD environment exists (v0.3.0)

Options:
  [1] Validate structure
  [2] Re-initialize (backup first)
  [3] Cancel
```

**Permission denied**:
```markdown
❌ Cannot create folders

Solution: Check write permissions in current directory
```

**Old structure detected**:
```markdown
⚠️ Found v2.x structure

Automatic migration available. Continue? (y/n)
```

## Success Criteria

- ✅ All 5 PRD folders created
- ✅ 3 templates generated
- ✅ Configuration file valid JSON
- ✅ Documentation files present
- ✅ Migration successful (if applicable)

## Best Practices

1. **Run once per project** - Initialize at project root
2. **Commit to git** - PRD structure is part of your repo
3. **Customize templates** - Edit product/templates/ for your needs
4. **Update WORK_PLAN** - Keep pipeline current

## Related

- `/create-prd` - Create first PRD after environment setup
- `/list-prds` - View all PRDs
- Docs: See `product/README.md` after initialization

---

**Plugin**: claude-prd-workflow  
**Version**: 0.4.2  
**Category**: PRD Management
