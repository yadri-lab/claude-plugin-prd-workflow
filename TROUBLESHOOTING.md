# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the claude-prd-workflow plugin.

## Quick Diagnosis

Not sure what's wrong? Run the health check:

```bash
cd ~/.claude-code/plugins/claude-prd-workflow
node bin/check-health.js
```

Or use the slash command in Claude Code:

```
/plugin-health
```

## Common Issues

### 1. Commands Not Showing Up

**Symptoms:**
- Slash commands like `/create-prd` don't appear in autocomplete
- Claude Code doesn't recognize plugin commands

**Solutions:**

1. **Restart Claude Code** (most common fix)
   - Close Claude Code completely
   - Reopen it
   - Try the command again

2. **Verify Installation**
   ```bash
   claude plugin-list
   ```
   - Should show `claude-prd-workflow` in the list
   - Check version number

3. **Check Command Files**
   ```bash
   ls ~/.claude-code/commands/ | grep prd
   ```
   - Should see multiple `*-prd.md` files
   - If empty, reinstall the plugin

4. **Reinstall Plugin**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   node install.js
   ```

5. **Use Auto-Repair**
   ```
   /plugin-repair
   ```

### 2. Plugin Installed But Commands Missing

**Symptoms:**
- `claude plugin-list` shows the plugin
- But `/create-prd` and other commands don't work

**Solutions:**

1. **Check Global Commands Directory**
   ```bash
   ls -la ~/.claude-code/commands/
   ```
   - Should contain `.md` files for each command
   - If missing, commands won't be available

2. **Run Repair Tool**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   node bin/repair.js
   ```

3. **Manual Reinstall**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   node install.js
   # Restart Claude Code
   ```

### 3. "Plugin Not Found" Error

**Symptoms:**
- Error message: "Plugin 'claude-prd-workflow' not found"
- Health check shows plugin directory missing

**Solutions:**

1. **Install from Source**
   ```bash
   cd ~/.claude-code/plugins
   git clone https://github.com/Yassinello/claude-prd-workflow.git
   cd claude-prd-workflow
   node install.js
   ```

2. **Check Plugin Directory**
   ```bash
   ls ~/.claude-code/plugins/
   ```
   - Should show `claude-prd-workflow` directory

3. **Verify Permissions**
   ```bash
   chmod -R 755 ~/.claude-code/plugins/claude-prd-workflow
   ```

### 4. Update Failed

**Symptoms:**
- Update process stopped with error
- Plugin partially updated
- Commands broken after update

**Solutions:**

1. **Check Current State**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   git status
   ```

2. **Clean and Reinstall**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   git reset --hard
   git pull
   node install.js
   ```

3. **Backup and Fresh Install**
   ```bash
   # Backup configs
   cp -r ~/.claude-code/plugins/claude-prd-workflow/.claude ~/prd-config-backup

   # Remove and reinstall
   rm -rf ~/.claude-code/plugins/claude-prd-workflow
   cd ~/.claude-code/plugins
   git clone https://github.com/Yassinello/claude-prd-workflow.git
   cd claude-prd-workflow
   node install.js

   # Restore configs if needed
   cp -r ~/prd-config-backup ~/.claude-code/plugins/claude-prd-workflow/.claude
   ```

### 5. Commands Return Errors

**Symptoms:**
- Commands are visible but fail when executed
- Error messages about missing files or modules

**Solutions:**

1. **Check Plugin Integrity**
   ```
   /plugin-health
   ```

2. **Verify All Components**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow

   # Check commands
   ls commands/*.md | wc -l
   # Should be 17+

   # Check agents
   ls agents/*.md | wc -l
   # Should be 17+

   # Check skills
   ls skills/*.md | wc -l
   # Should be 13+
   ```

3. **Reinstall Missing Components**
   ```bash
   node bin/repair.js
   ```

### 6. Version Mismatch

**Symptoms:**
- `claude plugin-list` shows old version
- New features not available
- Update command says "already up to date"

**Solutions:**

1. **Force Update**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   git fetch --all
   git reset --hard origin/main
   node install.js
   ```

2. **Check Version**
   ```bash
   cat ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json | grep version
   ```

3. **Verify Latest Version**
   - Visit: https://github.com/Yassinello/claude-prd-workflow/releases
   - Compare with your installed version

### 7. Config File Corrupted

**Symptoms:**
- Plugin fails to load
- Commands work but with wrong settings
- Error messages about JSON parsing

**Solutions:**

1. **Check Config Syntax**
   ```bash
   cat ~/.claude-code/plugins/claude-prd-workflow/.claude/config.json
   ```
   - Should be valid JSON

2. **Restore Default Config**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   cp config/default-config.json .claude/config.json
   ```

3. **Use Backup**
   ```bash
   ls ~/.claude-code/plugins/claude-prd-workflow/.claude/
   # Look for config.backup.json
   cp .claude/config.backup.json .claude/config.json
   ```

## Diagnostic Commands

### Health Check
```bash
cd ~/.claude-code/plugins/claude-prd-workflow
node bin/check-health.js
```

Shows:
- ✅ Plugin installation status
- ✅ Version information
- ✅ Commands count
- ✅ Agents count
- ✅ Skills count

### Manual Component Check

**Commands:**
```bash
ls -la ~/.claude-code/commands/ | grep -E "(create-prd|list-prd|review-prd)"
```

**Agents:**
```bash
ls -la ~/.claude-code/agents/ | grep -E "(prd-|orchestrator|devops)"
```

**Skills:**
```bash
ls -la ~/.claude-code/skills/ | grep -E "(quality|security)"
```

### Plugin Info
```bash
cat ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json
```

Should show:
```json
{
  "name": "claude-prd-workflow",
  "version": "2.7.0",
  "description": "...",
  "installedAt": "2025-10-26T...",
  "repository": "...",
  "homepage": "..."
}
```

## Prevention Tips

### 1. Regular Health Checks
Run health check after:
- Installing the plugin
- Updating to new version
- Modifying any files
- Claude Code not responding as expected

### 2. Keep Updated
Check for updates regularly:
```
/plugin-update
```

### 3. Backup Configs
Before major changes:
```bash
cp -r ~/.claude-code/plugins/claude-prd-workflow/.claude ~/prd-config-backup-$(date +%Y%m%d)
```

### 4. Use Version Control
If you customize the plugin:
```bash
cd ~/.claude-code/plugins/claude-prd-workflow
git init
git add .
git commit -m "My customizations"
```

## Getting Help

### Self-Service Tools

1. **Health Check**: `/plugin-health`
2. **Auto-Repair**: `/plugin-repair`
3. **Update**: `/plugin-update`

### Manual Verification

```bash
# Full diagnostic
cd ~/.claude-code/plugins/claude-prd-workflow
echo "=== Plugin Version ==="
cat .plugin-info.json | grep version

echo "=== Commands Count ==="
ls ~/.claude-code/commands/*.md 2>/dev/null | wc -l

echo "=== Agents Count ==="
ls ~/.claude-code/agents/*.md 2>/dev/null | wc -l

echo "=== Skills Count ==="
ls ~/.claude-code/skills/*.md 2>/dev/null | wc -l

echo "=== Health Check ==="
node bin/check-health.js
```

### Report an Issue

If problems persist:

1. Run full diagnostic (above)
2. Save the output
3. Create an issue at: https://github.com/Yassinello/claude-prd-workflow/issues
4. Include:
   - Operating system
   - Claude Code version
   - Plugin version
   - Error messages
   - Steps to reproduce

## Emergency Recovery

If nothing works:

```bash
# 1. Backup your PRDs (important!)
cp -r product ~/prd-backup-$(date +%Y%m%d)

# 2. Remove plugin completely
rm -rf ~/.claude-code/plugins/claude-prd-workflow
rm ~/.claude-code/commands/*-prd.md
rm ~/.claude-code/agents/prd-*.md
rm ~/.claude-code/skills/quality-*.md

# 3. Fresh installation
cd ~/.claude-code/plugins
git clone https://github.com/Yassinello/claude-prd-workflow.git
cd claude-prd-workflow
node install.js

# 4. Restart Claude Code

# 5. Verify
node bin/check-health.js

# 6. Restore your PRDs if needed
cp -r ~/prd-backup-$(date +%Y%m%d) product
```

## FAQ

### Q: Do I need to restart Claude Code after every change?
**A:** Yes, Claude Code needs to be restarted to recognize new or updated commands.

### Q: Will repair/update delete my PRDs?
**A:** No, your PRD files in the `product/` directory are never touched by repair or update.

### Q: Can I use the plugin in multiple projects?
**A:** Yes, the plugin is installed globally but can be used in any project with a `product/` directory.

### Q: How do I know which version I have?
**A:** Run `/plugin-version` or `claude plugin-list`

### Q: The health check passes but commands still don't work
**A:** Try:
1. Restart Claude Code
2. Check if you're in the right directory (should have `product/` folder)
3. Run `/plugin-repair` to ensure everything is in sync

### Q: Can I customize the plugin?
**A:** Yes, but keep your changes in separate files or fork the repo. Updates will overwrite modified files.

---

**Still having issues?** Open an issue: https://github.com/Yassinello/claude-prd-workflow/issues
