# Plugin Update Command

You are helping the user update the claude-prd-workflow plugin to the latest version.

## Your Task

Run the automated update script that handles everything.

## Steps

1. **Navigate to plugin directory**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   ```

2. **Run update script**
   ```bash
   node bin/update.js
   ```

The script automatically:
- ✅ Checks current version
- ✅ Fetches latest version from GitHub
- ✅ Backs up current state
- ✅ Updates via git pull or manual download
- ✅ Reinstalls to update global commands/agents/skills
- ✅ Runs health check to verify installation
- ✅ Shows what's new

3. **Post-update**
   - Remind user to restart Claude Code
   - Suggest running `/plugin-health` to verify
   - Link to CHANGELOG.md for details

## Alternative: Manual Update

If automatic update fails, provide manual instructions:

```bash
# Backup config
cp -r ~/.claude-code/plugins/claude-prd-workflow/.claude ~/prd-config-backup

# Update via git
cd ~/.claude-code/plugins/claude-prd-workflow
git pull origin main
node install.js

# Or fresh install
cd ~/.claude-code/plugins
rm -rf claude-prd-workflow
git clone https://github.com/Yassinello/claude-prd-workflow
cd claude-prd-workflow
node install.js

# Restore config if needed
cp -r ~/prd-config-backup ~/.claude-code/plugins/claude-prd-workflow/.claude

# Verify
node bin/check-health.js
```

## Important Notes

- The update script automatically backs up your config
- Your PRD files in `product/` are never touched
- If update fails, the plugin stays on the old version (safe)
- Always restart Claude Code after updating
- Run `/plugin-health` to verify the update succeeded

## Example Output

```
🔄 Updating claude-prd-workflow plugin...

📦 Current version: 2.7.0

============================================================

🔍 Checking for updates...

   Checking git status...
   Fetching latest version from GitHub...
   Pulling latest changes...

============================================================

🔨 Reinstalling to update global files...

   Running install.js...
   ✅ Copied commands/
   ✅ Copied agents/
   ✅ Copied skills/
   ✅ Installed 17 slash commands
   ✅ Installed 17 AI agents
   ✅ Installed 13 skills

🏥 Running automatic health check...
   ✅ All systems operational!

============================================================

✅ Update complete!

📦 Updated: 2.7.0 → 2.8.0

💡 Important:
   1. Restart Claude Code to see the changes
   2. Run /plugin-health to verify the update
   3. Check CHANGELOG.md for what's new

============================================================
```

## Troubleshooting

If update fails:
1. Check internet connection
2. Verify git is installed (for git-based updates)
3. Try manual update steps above
4. Run `/plugin-repair` after manual update
5. Check TROUBLESHOOTING.md
6. Report issue if problem persists
