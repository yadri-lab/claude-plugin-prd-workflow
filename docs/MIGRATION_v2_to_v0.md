# Migration Guide: v2.8.0 → v0.3.0

**Estimated time**: 5-10 minutes  
**Difficulty**: Easy  
**Reversible**: Yes (instructions provided)

---

## 📋 Quick Summary

v0.3.0 introduces a **simplified folder structure** and **refined workflows**. This guide helps you migrate your existing PRDs.

### What Changed?

1. **Folder structure simplified** - `02-review/` removed, others renumbered
2. **Workflow separation** - `/setup-prd` and `/code-prd` have distinct roles
3. **Review behavior** - No automatic file movement, user stays in control

---

## 🚀 Migration Steps

### Step 1: Backup Your PRDs (Optional but Recommended)

```bash
cd your-project/
cp -r product/prds product/prds.backup
```

### Step 2: Rename PRD Folders

```bash
# Rename folders to match new structure
mv product/prds/03-ready product/prds/02-ready
mv product/prds/04-in-progress product/prds/03-in-progress
mv product/prds/05-complete product/prds/04-complete

# Remove 02-review folder (if exists)
rm -rf product/prds/02-review
```

**Windows users** (PowerShell):
```powershell
Move-Item product\prds\03-ready product\prds\02-ready
Move-Item product\prds\04-in-progress product\prds\03-in-progress
Move-Item product\prds\05-complete product\prds\04-complete
Remove-Item product\prds\02-review -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 3: Update Plugin

```bash
npm update -g claude-prd-workflow
```

Verify installation:
```bash
npm list -g claude-prd-workflow
# Should show: claude-prd-workflow@0.3.0
```

### Step 4: Update PRD Metadata (Optional)

If your PRDs reference folder names in metadata, update them:

```bash
# Find PRDs with old folder references
grep -r "03-ready\|04-in-progress\|05-complete" product/prds/

# Update them manually or with sed:
find product/prds -name "*.md" -exec sed -i 's/03-ready/02-ready/g; s/04-in-progress/03-in-progress/g; s/05-complete/04-complete/g' {} \;
```

### Step 5: Test the Migration

```bash
# List your PRDs with new structure
/list-prds

# Should show correct folder locations
```

---

## 🔄 Workflow Changes

### Old Workflow (v2.8.0)

```bash
/create-prd "New Feature"    # → 01-draft/
/review-prd PRD-007          # → Moves to 02-review/
/review-prd PRD-007          # → Approves, moves to 03-ready/
/code-prd PRD-007            # → Moves to 04-in-progress/, starts coding
```

### New Workflow (v0.3.0)

```bash
/create-prd "New Feature"    # → 01-draft/
/review-prd PRD-007          # → Updates metadata ONLY (stays in draft)
/setup-prd PRD-007           # → Moves to 02-ready/, creates branch, assigns
/code-prd PRD-007            # → Moves to 03-in-progress/, starts coding
```

**Key differences**:
- `/review-prd` no longer moves files
- New `/setup-prd` command handles branch creation + assignment
- Clearer separation between review → setup → implementation

---

## ✅ Post-Migration Checklist

- [ ] All PRD folders renamed correctly
- [ ] Plugin updated to v0.3.0 (`npm list -g`)
- [ ] `/list-prds` shows correct folder structure
- [ ] Test `/create-prd` creates in `01-draft/`
- [ ] Test `/setup-prd` moves to `02-ready/`
- [ ] Test `/code-prd` moves to `03-in-progress/`
- [ ] Backup can be deleted (`rm -rf product/prds.backup`)

---

## 🔙 Rollback Instructions

If you need to revert to v2.8.0:

### Step 1: Restore Old Folder Structure

```bash
# Rename back to old structure
mv product/prds/02-ready product/prds/03-ready
mv product/prds/03-in-progress product/prds/04-in-progress
mv product/prds/04-complete product/prds/05-complete

# Recreate 02-review folder
mkdir -p product/prds/02-review
```

### Step 2: Downgrade Plugin

```bash
npm install -g claude-prd-workflow@legacy
```

### Step 3: Restore Backup (if needed)

```bash
rm -rf product/prds
mv product/prds.backup product/prds
```

---

## 🆕 New Features to Explore

After migrating, try these new features:

### 1. Auto-Assignment
```bash
/setup-prd PRD-007
# Automatically assigns to your GitHub username
```

### 2. Progress Tracking
```bash
/code-prd PRD-007
# Shows: "✅ 12/45 tasks completed (27%)"
```

### 3. Dependency Validation

Add to your PRD metadata:
```markdown
**Depends On**:
- PRD-003: Database schema
- PRD-005: Auth system
```

Then `/code-prd` will warn if dependencies aren't complete.

---

## ❓ FAQ

### "Do I have to migrate?"

No. You can stay on v2.8.0 by installing `claude-prd-workflow@legacy`. However, v0.3.0+ is actively developed and receives new features.

### "What if I have PRDs in 02-review?"

Move them to either `01-draft/` or `02-ready/` depending on their status:
- **Not reviewed yet**: → `01-draft/`
- **Reviewed and approved**: → `02-ready/`

### "Will my Git branches break?"

No. Branch names are unaffected. The migration only renames local folders.

### "Can I migrate one PRD at a time?"

Not recommended. The plugin expects the new structure. Migrate all at once using the steps above.

### "What about WORK_PLAN.md?"

Update folder references manually:
```bash
sed -i 's/03-ready/02-ready/g; s/04-in-progress/03-in-progress/g; s/05-complete/04-complete/g' product/WORK_PLAN.md
```

---

## 🆘 Need Help?

- **Issue tracker**: https://github.com/Yassinello/claude-prd-workflow/issues
- **Discussions**: https://github.com/Yassinello/claude-prd-workflow/discussions
- **Documentation**: Check README.md for updated workflows

---

**Maintained by**: Yassine Hamou-Tahra  
**Last Updated**: 2025-10-28  
**Plugin Version**: v0.3.0
