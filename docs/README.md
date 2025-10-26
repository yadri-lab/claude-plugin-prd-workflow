# Documentation Index

Welcome to the claude-prd-workflow plugin documentation.

## 📚 Main Documentation

### Getting Started
- [**Complete Guide**](guide.md) - Comprehensive guide covering all features and workflows
- [**Real-World Examples**](examples.md) - See how different teams use the plugin

### Troubleshooting
- [**Troubleshooting Guide**](../TROUBLESHOOTING.md) - Fix common issues quickly
- Run `/plugin-health` - Automated health check
- Run `/plugin-repair` - Automated repair tool

## 🔧 Maintenance Tools

The plugin includes self-diagnostic and repair tools:

### Health Check
```bash
# Via command
/plugin-health

# Or directly
cd ~/.claude-code/plugins/claude-prd-workflow
node bin/check-health.js
```

Verifies:
- ✅ Plugin installation
- ✅ Commands installed (should be 17+)
- ✅ Agents installed (should be 17+)
- ✅ Skills installed (should be 13+)
- ✅ Plugin metadata

### Automatic Repair
```bash
# Via command
/plugin-repair

# Or directly
cd ~/.claude-code/plugins/claude-prd-workflow
node bin/repair.js
```

Fixes:
- Missing command files
- Missing agent files
- Missing skill files
- Corrupted metadata
- Incomplete installations

### Update Plugin
```bash
# Via command
/plugin-update

# Or directly
cd ~/.claude-code/plugins/claude-prd-workflow
node bin/update.js
```

Updates to latest version from GitHub.

## 📁 Documentation Structure

```
docs/
├── README.md          # This file - documentation index
├── guide.md           # Complete feature guide
├── examples.md        # Real-world usage examples
└── archive/           # Historical specs and documents
    └── SPECS_v2.5-2.6.md
```

## 🚀 Quick Reference

### Core Commands
- `/create-prd` - Create a new PRD
- `/list-prds` - List all PRDs with status
- `/review-prd` - AI-powered 7-dimension review
- `/code-prd` - Start guided implementation
- `/complete-prd` - Finish and merge to main

### Maintenance Commands
- `/plugin-health` - Run health check
- `/plugin-repair` - Auto-repair installation
- `/plugin-update` - Update to latest version

### Daily Dev Commands (Beyond PRDs)
- `/quick-review` - 30-second code review
- `/test-gen` - Auto-generate test suites
- `/api-design` - Backend architecture help
- `/perf-boost` - Performance optimization
- `/incident` - Production incident response

## 🆘 Getting Help

1. **Self-Service**
   - Run `/plugin-health` to diagnose issues
   - Run `/plugin-repair` to fix common problems
   - Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

2. **Community**
   - [GitHub Issues](https://github.com/Yassinello/claude-prd-workflow/issues)
   - [GitHub Discussions](https://github.com/Yassinello/claude-prd-workflow/discussions)

3. **Updates**
   - [CHANGELOG.md](../CHANGELOG.md) - Version history
   - [Releases](https://github.com/Yassinello/claude-prd-workflow/releases) - Download specific versions

## 🎯 Version Information

Current version: **2.8.0** (check your version with `/plugin-version`)

Key features in latest version:
- 🏥 Automated health check system
- 🔧 Automatic repair tools
- 🔄 Smart update mechanism
- 📊 Better error messages and diagnostics
- ✅ Post-install verification

## 🔗 External Resources

- [Main Repository](https://github.com/Yassinello/claude-prd-workflow)
- [NPM Package](https://www.npmjs.com/package/claude-prd-workflow) (coming soon)
- [Contributing Guide](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)

---

**Need help?** Start with `/plugin-health` or check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
