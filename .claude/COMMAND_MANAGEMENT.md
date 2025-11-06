# Command Management Guide

## How Claude Code Loads Commands

Claude Code loads slash commands from **two locations**:

1. **Project commands**: `.claude/commands/` (local to this project)
2. **Global cache**: `~/.claude-code/commands/` (shared across all projects)

Both locations are scanned at startup and **merged together**.

## Common Issues

### Duplicate Commands

**Cause**: Backup files (`.backup.md`) in `.claude/commands/` are detected as valid commands.

**Solution**:
```bash
# Move backups to safe location
mv .claude/commands/*.backup* .claude-plugin.bak/commands/
```

### Commands Not Updating

**Cause**: Global cache (`~/.claude-code/commands/`) is stale.

**Solution**:
```bash
# Run sync script
./.claude/scripts/sync-commands.sh

# Or manually
cp -f .claude/commands/*.md ~/.claude-code/commands/
```

**Then restart Claude Code.**

## Best Practices

### 1. Never commit backup files

The `.gitignore` is configured to exclude:
- `*.backup.md`
- `*.backup`
- `.claude/commands/*.backup.md`
- `.claude-plugin.bak/`

### 2. Use the sync script after changes

```bash
# After creating/updating commands
./.claude/scripts/sync-commands.sh
```

### 3. Validate before commit

The pre-commit hook (`.husky/pre-commit`) automatically:
- ✅ Blocks commits with backup files in `.claude/commands/`
- ⚠️ Warns about duplicate command names

### 4. Testing new commands

When adding new commands:

1. Create the `.md` file in `.claude/commands/`
2. Verify frontmatter format:
   ```yaml
   ---
   name: my-command
   description: What it does
   category: Category Name
   version: 1.0.0
   ---
   ```
3. Run sync script: `./.claude/scripts/sync-commands.sh`
4. Restart Claude Code
5. Test with `/my-command`

## Troubleshooting

### Issue: Command appears multiple times

```bash
# Check for duplicates in project
find .claude/commands -name "*command-name*"

# Check for duplicates in global cache
find ~/.claude-code/commands -name "*command-name*"

# Clean and resync
./.claude/scripts/sync-commands.sh
```

### Issue: Old command won't go away

```bash
# Nuclear option: clear global cache
rm ~/.claude-code/commands/*.md
cp .claude/commands/*.md ~/.claude-code/commands/

# Restart Claude Code
```

### Issue: Command not detected

1. Check file extension is `.md` (not `.md.backup.md`)
2. Check frontmatter has `name:` field
3. Check file is in `.claude/commands/` (not subdirectory)
4. Run sync script
5. Restart Claude Code

## Command Lifecycle

```
Development → Testing → Production
     ↓           ↓          ↓
  .claude/   Restart   ~/.claude-code/
  commands/   Claude      commands/
```

1. **Create**: Add `.md` file to `.claude/commands/`
2. **Sync**: Run `./.claude/scripts/sync-commands.sh`
3. **Load**: Restart Claude Code
4. **Use**: Type `/command-name`

## File Structure

```
.claude/
├── commands/              # Source of truth
│   ├── command-1.md      # ✅ Active command
│   ├── command-2.md      # ✅ Active command
│   └── old.backup.md     # ❌ Will be blocked by git
├── scripts/
│   └── sync-commands.sh  # Maintenance script
└── COMMAND_MANAGEMENT.md # This file

.claude-plugin.bak/        # Safe backup location
└── commands/
    └── old.backup.md      # ✅ Archived safely

~/.claude-code/            # Global cache
└── commands/              # Auto-synced from project
    ├── command-1.md
    └── command-2.md
```

## Version Control

**Always commit**:
- ✅ `.claude/commands/*.md` (active commands)
- ✅ `.gitignore` rules
- ✅ `.husky/pre-commit` hook
- ✅ `.claude/scripts/sync-commands.sh`

**Never commit**:
- ❌ `.claude/commands/*.backup.md`
- ❌ `.claude-plugin.bak/` (local backups)
- ❌ `~/.claude-code/` (global cache)

## Quick Reference

```bash
# Add new command
vim .claude/commands/my-command.md
./.claude/scripts/sync-commands.sh
# Restart Claude Code

# Update existing command
vim .claude/commands/existing.md
./.claude/scripts/sync-commands.sh
# Restart Claude Code

# Remove command
rm .claude/commands/old-command.md
rm ~/.claude-code/commands/old-command.md
# Restart Claude Code

# Clean all backups
find .claude/commands -name "*.backup*" -delete
find ~/.claude-code/commands -name "*.backup*" -delete
```
