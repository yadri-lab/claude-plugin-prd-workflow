# Plugin Repair Command

You are helping the user repair their claude-prd-workflow plugin installation.

## Your Task

Run the automatic repair tool to fix common installation issues.

## Steps

1. **Diagnose the problem**
   - First run health check to identify issues
   - Show the user what's wrong

2. **Attempt automatic repair**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   node bin/repair.js
   ```

3. **Verify repair**
   - Health check is automatically run after repair
   - Show the results to the user

4. **Provide next steps**
   - If successful: Remind user to restart Claude Code
   - If failed: Provide manual repair instructions

## What This Command Fixes

- Missing command files
- Missing agent files
- Missing skill files
- Corrupted plugin metadata
- Incomplete installations

## Example Flow

```
🔧 Running repair tool for claude-prd-workflow...

📋 Step 1: Running diagnostic check...

❌ Slash commands: Directory exists but empty
✅ AI agents: 17 files found
✅ Skills: 13 files found

============================================================

🔨 Step 2: Attempting automatic repair...

🔄 Reinstalling plugin...
   ✅ Copied commands/
   ✅ Copied agents/
   ✅ Copied skills/
   ✅ Installed 17 slash commands

✅ Reinstallation complete!

============================================================

🏥 Step 3: Verifying repair...

✅ All systems operational!

💡 Important: Restart Claude Code to see the changes.

============================================================
```

## Manual Repair (if automatic fails)

If automatic repair doesn't work, guide the user through manual steps:

1. **Backup current config** (if exists)
   ```bash
   cp ~/.claude-code/plugins/claude-prd-workflow/.claude/config.json ~/config-backup.json
   ```

2. **Reinstall plugin**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   node install.js
   ```

3. **Restore config** (if backed up)
   ```bash
   cp ~/config-backup.json ~/.claude-code/plugins/claude-prd-workflow/.claude/config.json
   ```

4. **Restart Claude Code**

5. **Verify with health check**
   ```bash
   node bin/check-health.js
   ```

## When to Use This Command

- Commands not showing up in Claude Code
- Plugin commands return errors
- After a failed update
- After manual file modifications
- When health check shows errors

## Safety

- This command backs up configs before making changes
- It's safe to run multiple times
- Non-destructive: only repairs, doesn't delete user data
- Can be interrupted safely

## Troubleshooting

If repair fails:
1. Check file permissions
2. Ensure Node.js is installed and accessible
3. Verify ~/.claude-code directory exists
4. Try manual reinstallation
5. Report issue if problem persists

## Important Notes

- Always restart Claude Code after repair
- Run `/plugin-health` to verify repair was successful
- Keep a backup of your PRD files (they're not affected by repair)
- Config files are automatically backed up during repair
