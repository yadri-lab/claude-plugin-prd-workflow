# Plugin Health Check Command

You are helping the user verify the health of their claude-prd-workflow plugin installation.

## Your Task

Run the health check script and interpret the results for the user.

## Steps

1. **Navigate to plugin directory**
   ```bash
   cd ~/.claude-code/plugins/claude-prd-workflow
   ```

2. **Run health check**
   ```bash
   node bin/check-health.js
   ```

3. **Interpret results**
   - If all checks pass: Confirm plugin is healthy
   - If warnings found: Explain what they mean
   - If errors found: Suggest remediation steps

4. **Provide next steps**
   - If healthy: User can use the plugin normally
   - If issues: Offer to run `/plugin-repair` or manual fix steps

## Health Check Components

The health check verifies:
- ✅ Plugin directory exists
- ✅ Plugin metadata is valid
- ✅ Slash commands are installed
- ✅ AI agents are installed
- ✅ Skills are installed

## Example Output

```
🏥 Running health check for claude-prd-workflow...

📁 Checking plugin installation...
   ✅ Plugin directory found: ~/.claude-code/plugins/claude-prd-workflow

📋 Checking plugin metadata...
   ✅ Plugin version: 2.7.0
   📅 Installed: 10/26/2025

📝 Checking slash commands...
   ✅ Global commands: 17 files found

🤖 Checking AI agents...
   ✅ Global agents: 17 files found

⚡ Checking skills...
   ✅ Global skills: 13 files found

============================================================

📊 HEALTH CHECK SUMMARY

✅ All systems operational!

🎯 You can now use the following commands:
   /create-prd  - Create a new PRD
   /list-prds   - List all PRDs
   /review-prd  - Review a PRD
   /code-prd    - Start development

💡 Tip: Restart Claude Code if commands are not visible

============================================================
```

## Troubleshooting

If health check fails:
1. Offer to run automatic repair: `/plugin-repair`
2. Suggest manual reinstallation: `node install.js`
3. Link to troubleshooting guide
4. Suggest reporting issue if problem persists

## Important Notes

- This command is non-destructive (read-only)
- Safe to run anytime
- Useful after updates or when commands not visible
- Can help diagnose installation issues
