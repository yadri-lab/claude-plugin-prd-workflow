# Plugin Version Checker

Display the installed version of the `claude-prd-workflow` plugin and check for updates.

---

## Instructions

You are tasked with displaying version information for the `claude-prd-workflow` plugin.

### Steps

1. **Check installed version**:
   ```bash
   npm list -g claude-prd-workflow --depth=0
   ```
   This shows the currently installed version.

2. **Check latest version on npm**:
   ```bash
   npm view claude-prd-workflow version
   ```
   This shows the latest published version on the npm registry.

3. **Display comparison**:
   - Compare installed version vs. latest version
   - If versions match: ✅ "You're up to date!"
   - If installed < latest: ⚠️ "Update available!"
   - If check fails: Provide troubleshooting steps

4. **Format output**:

   ```
   Claude PRD Workflow Manager
   =============================

   📦 Installed version: X.Y.Z
   🌐 Latest version:    X.Y.Z

   Status: [✅ Up to date | ⚠️ Update available]

   [If update available]
   To update:
     npm install -g claude-prd-workflow@latest

   Changelog: https://github.com/Yassinello/claude-prd-workflow/blob/main/CHANGELOG.md
   ```

5. **Additional information**:
   - Installation path: Show where plugin is installed
   - Files status: Verify commands/agents/skills are properly installed
   - Quick check:
     ```bash
     # Verify files exist
     ls ~/.claude-code/commands/ | grep -E "(create-prd|review-prd|code-prd)"
     ls ~/.claude-code/agents/ | grep -E "(prd-reviewer|prd-implementer)"
     ```

### Error Handling

- **Plugin not found**: Suggest installation instructions
- **npm not available**: Explain manual verification method
- **Network issues**: Show cached info from local files

### Example Output

```
Claude PRD Workflow Manager
=============================

📦 Installed version: 1.2.0
🌐 Latest version:    1.3.0

⚠️ Update available!

New features in v1.3.0:
- Improved PRD validation
- Enhanced security scanning
- Bug fixes for Git worktree

To update:
  npm install -g claude-prd-workflow@latest

After updating, restart Claude Code.

Changelog: https://github.com/Yassinello/claude-prd-workflow/blob/main/CHANGELOG.md
```

---

## Implementation Notes

- Use bash commands to check versions
- Parse npm output to extract version numbers
- Provide clear, actionable information
- Include troubleshooting if checks fail
- Be concise but informative

---

**Plugin**: claude-prd-workflow
**Category**: Utility
**Version**: 1.2.0
