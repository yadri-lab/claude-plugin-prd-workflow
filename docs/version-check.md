# How to Check Plugin Version

This guide shows you how to easily check the version of `claude-prd-workflow` plugin installed on your system.

---

## Quick Method: `/plugin-version` Command

The easiest way to check your plugin version is using the built-in command:

```bash
/plugin-version
```

### Example Output

```
Claude PRD Workflow Manager
=============================

📦 Installed version: 1.2.0
🌐 Latest version:    1.3.0

⚠️ Update available!

New features in v1.3.0:
- Version checking command (/plugin-version)
- Improved installation with .plugin-info.json
- Better error handling

To update:
  npm install -g claude-prd-workflow@latest

After updating, restart Claude Code.

Changelog: https://github.com/Yassinello/claude-prd-workflow/blob/main/CHANGELOG.md
```

---

## Alternative Methods

### Method 1: npm (Terminal)

Check installed version:
```bash
npm list -g claude-prd-workflow --depth=0
```

Output:
```
/usr/local/lib
└── claude-prd-workflow@1.2.0
```

Check latest version on npm:
```bash
npm view claude-prd-workflow version
```

Output:
```
1.3.0
```

### Method 2: Check .plugin-info.json (Manual)

The plugin installs a metadata file during installation:

```bash
# macOS/Linux
cat ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json

# Windows (PowerShell)
Get-Content $env:USERPROFILE\.claude-code\plugins\claude-prd-workflow\.plugin-info.json

# Windows (Git Bash)
cat ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json
```

Output:
```json
{
  "name": "claude-prd-workflow",
  "version": "1.2.0",
  "description": "The complete Claude Code plugin for Product-Driven Development...",
  "installedAt": "2025-10-25T20:53:31.168Z",
  "repository": "https://github.com/Yassinello/claude-prd-workflow.git",
  "homepage": "https://github.com/Yassinello/claude-prd-workflow#readme"
}
```

### Method 3: Check CHANGELOG.md

Read the first few lines of the CHANGELOG:

```bash
head -20 ~/.claude-code/plugins/claude-prd-workflow/CHANGELOG.md
```

The most recent version will be at the top.

---

## Updating the Plugin

If you find an update is available:

### Recommended: npm update

```bash
# Update to latest version
npm install -g claude-prd-workflow@latest

# Restart Claude Code after updating
```

### Alternative: Reinstall from scratch

```bash
# Remove old version
npm uninstall -g claude-prd-workflow

# Install latest
npm install -g claude-prd-workflow

# Restart Claude Code
```

---

## Troubleshooting

### `/plugin-version` command not found

**Problem**: The command wasn't installed properly.

**Solution**:
```bash
# Reinstall the plugin
npm install -g claude-prd-workflow --force

# Restart Claude Code
```

### npm command shows wrong version

**Problem**: Multiple installations or cached version.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g claude-prd-workflow --force

# Verify
npm list -g claude-prd-workflow --depth=0
```

### .plugin-info.json doesn't exist

**Problem**: Installed with version < 1.3.0 (before .plugin-info.json was added).

**Solution**:
```bash
# Update to latest version
npm install -g claude-prd-workflow@latest

# The file will be created during installation
```

---

## Version History

See the full version history and changelog:

- **Online**: https://github.com/Yassinello/claude-prd-workflow/blob/main/CHANGELOG.md
- **Local**: `~/.claude-code/plugins/claude-prd-workflow/CHANGELOG.md`

---

## For Watchora Project

Quick check for Watchora team members:

```bash
# 1. Check current version
/plugin-version

# 2. If update available, update:
npm install -g claude-prd-workflow@latest

# 3. Restart Claude Code

# 4. Verify update:
/plugin-version
```

**Expected version for Watchora**: 1.3.0+ (includes version checking)

---

## Related

- [Installation Guide](./getting-started.md)
- [Configuration Guide](./configuration.md)
- [Troubleshooting](./best-practices.md#troubleshooting)
- [Changelog](../CHANGELOG.md)
