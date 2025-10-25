# Claude Code Plugin - PRD Workflow Manager

**Context for Claude Code**: This document provides project context, architecture overview, and development guidelines for working on this plugin.

---

## Project Overview

**Name**: PRD Workflow Manager
**Type**: Claude Code Plugin
**Purpose**: Complete workflow automation for Product-Driven Development
**Target Users**: Development teams using Claude Code for feature development
**Distribution**: npm package (`claude-prd-workflow`)

### Core Features
- 9 slash commands for PRD lifecycle management
- 6 specialized AI agents (reviewer, implementer, orchestrator, security, QA, devops)
- 8 reusable skills (git, testing, security, documentation, etc.)
- Git worktree support for parallel development
- Automated quality gates (security, testing, linting)
- Multi-PRD orchestration with dependency resolution

---

## Architecture

### Directory Structure
```
claude-prd-workflow/
├── commands/              # Slash commands (9 files)
│   ├── create-prd.md
│   ├── review-prd.md
│   ├── code-prd.md
│   ├── work-prd.md
│   ├── list-prds.md
│   ├── archive-prd.md
│   ├── security-audit.md
│   ├── quality-check.md
│   └── orchestrate.md
├── agents/                # AI agents (6 files)
│   ├── prd-reviewer.md
│   ├── prd-implementer.md
│   ├── orchestrator.md
│   ├── security-expert.md
│   ├── quality-assurance.md
│   └── devops-engineer.md
├── skills/                # Reusable skills (8 files)
│   ├── git-workflow.md
│   ├── testing.md
│   ├── security-analysis.md
│   ├── code-quality.md
│   ├── documentation.md
│   ├── performance-analysis.md
│   ├── estimation.md
│   └── dependency-management.md
├── config/                # Configuration system
│   ├── schema.json        # JSON schema for validation
│   ├── default-config.json
│   └── presets/
│       ├── startup.json
│       ├── enterprise.json
│       └── open-source.json
├── templates/             # Markdown templates
│   ├── prd-template.md
│   ├── pr-template.md
│   ├── architecture-decision.md
│   └── release-notes-template.md
├── docs/                  # Documentation
│   ├── getting-started.md
│   ├── configuration.md
│   ├── commands-reference.md
│   ├── agents-guide.md
│   ├── best-practices.md
│   └── examples/
│       ├── acmecorp-setup.md
│       ├── saas-startup.md
│       ├── ecommerce.md
│       └── microservices.md
├── .github/workflows/     # CI/CD automation
│   ├── publish-npm.yml    # **Automatic npm publish on git tags**
│   ├── release.yml        # GitHub Release creation
│   ├── validate-plugin.yml
│   └── docs.yml
├── install.js             # Post-install script (copies to ~/.claude-code/)
├── package.json
├── CHANGELOG.md
└── README.md
```

---

## Configuration System

### How Configuration Works

1. **Default config**: `config/default-config.json` (plugin defaults)
2. **User config**: `.claude/config.json` in user's project (overrides defaults)
3. **Runtime**: Commands and agents read merged config

### Key Configuration Sections

#### PRD ID Format (v1.1.0+)
```json
{
  "prd_id": {
    "prefix": "PRD",           // e.g., "PRD", "WTC-PRD", "ACME-PRD"
    "separator": "-",          // e.g., "-", "_", ""
    "number_padding": 3        // e.g., 3 → "001", 4 → "0001"
  }
}
```

**Examples**:
- `PRD-001`, `PRD-002`, `PRD-003` (default)
- `WTC-PRD-001`, `WTC-PRD-002` (Watchora-style)
- `ACME-PRD-001`, `ACME-PRD-002` (company-specific)
- `FEAT_0001`, `FEAT_0002` (underscore format)

#### Branch Naming
```json
{
  "branch_naming": {
    "prefix": "feat",                               // Branch prefix
    "separator": "-",                               // Separator in branch name
    "pattern": "{prefix}/{prd_id}{separator}{feature_name}"
  }
}
```

**Pattern variables**:
- `{prefix}` - Branch prefix from config
- `{prd_id}` - Full PRD ID (e.g., `PRD-003`, `WTC-PRD-003`)
- `{separator}` - Separator from config
- `{feature_name}` - Feature name (slugified)

#### Worktree Naming
```json
{
  "worktree": {
    "enabled": true,
    "parent_directory": "..",
    "naming_pattern": "{project}-{feature}"         // Worktree directory name
  }
}
```

**Pattern variables**:
- `{project}` - Project name from package.json or repo
- `{feature}` - Feature name (slugified)
- `{prd_id}` - Full PRD ID
- `{branch}` - Full branch name

---

## Development Guidelines

### ⚠️ BEFORE YOU START: Read These Files

**MANDATORY** at the start of every session:
1. **`SESSION_CONTEXT.md`** - Current status, recent sessions, known issues
2. **This file (`CLAUDE.md`)** - Project structure and guidelines
3. **`CHANGELOG.md`** - Recent changes

**Why?** Prevents repeating work and ensures you have full context.

---

### Adding New Features

1. **Update schema first**: `config/schema.json`
2. **Update default config**: `config/default-config.json`
3. **Update presets if needed**: `config/presets/*.json`
4. **Document in**: `docs/configuration.md`
5. **Add examples**: `docs/examples/acmecorp-setup.md` or similar
6. **Update CHANGELOG**: `CHANGELOG.md`
7. **Update SESSION_CONTEXT.md**: Document the work in current session
8. **Write tests** (when test framework exists)

### Configuration Changes

**IMPORTANT**: When changing config structure:
- Mark as `BREAKING CHANGE` if it changes existing keys
- Provide migration guide in CHANGELOG
- Update all presets
- Update documentation
- Consider backward compatibility

Example from v1.1.0:
```
BREAKING CHANGE: Replaced branch_naming.prd_id_format with prd_id section

Migration:
// Before
"branch_naming": { "prd_id_format": "PRD-{number}" }

// After
"prd_id": { "prefix": "PRD", "separator": "-", "number_padding": 3 }
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Scopes**: `commands`, `agents`, `config`, `docs`, `ci`

**Examples**:
```
feat(config): Add configurable PRD ID format
fix(commands): Fix PRD ID generation in /create-prd
docs(examples): Add Watchora configuration example
chore(ci): Update GitHub Actions workflow
```

---

## Release Process

### **IMPORTANT: Automated npm Publishing** 🤖

**GitHub Actions automatically publishes to npm** - DO NOT run `npm publish` manually!

### How it works:

1. **Make changes** → Commit and push
2. **Update version** → `package.json`, `CHANGELOG.md`
3. **Create git tag** → `git tag v1.2.0 && git push origin v1.2.0`
4. **GitHub Actions triggers** → `.github/workflows/publish-npm.yml`
5. **Automatic npm publish** → Published to npm registry
6. **GitHub Release created** → `.github/workflows/release.yml`

### Step-by-step Release Workflow

```bash
# 1. Update version in package.json
# (e.g., 1.0.4 → 1.1.0)

# 2. Update CHANGELOG.md
# Add new version section with changes

# 3. Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: Bump version to 1.1.0"

# 4. Create and push tag
git tag v1.1.0
git push origin main
git push origin v1.1.0

# 5. Wait for GitHub Actions
# - Check: https://github.com/Yassinello/claude-prd-workflow/actions
# - Workflow "Publish to npm" should run automatically
# - Verify success: npm view claude-prd-workflow version

# 6. Update local installation (for testing)
npm install -g claude-prd-workflow@latest
```

### Versioning (Semantic Versioning)

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Patch** (1.0.0 → 1.0.1): Bug fixes

**When to bump**:
- `feat:` commits → Minor version
- `fix:` commits → Patch version
- `BREAKING CHANGE:` in commit → Major version
- `docs:`, `chore:` → No version bump (unless releasing)

### Pre-release Checklist

Before creating a tag:
- [ ] Version updated in `package.json`
- [ ] CHANGELOG.md updated with new version section
- [ ] All tests passing (when tests exist)
- [ ] Documentation updated (if feature changes)
- [ ] Examples updated (if config changes)
- [ ] README.md reflects new features

### Post-release

After GitHub Actions completes:
- [ ] Verify npm package: `npm view claude-prd-workflow version`
- [ ] Check GitHub Release created
- [ ] Test installation: `npm install -g claude-prd-workflow@latest`
- [ ] Announce in project channels (if applicable)

---

## Testing Locally

### Before Publishing

```bash
# 1. Clone repo
git clone https://github.com/Yassinello/claude-prd-workflow.git
cd claude-prd-workflow

# 2. Install globally from local directory
npm install -g .

# 3. Verify installation
npm list -g claude-prd-workflow

# 4. Check files copied to Claude Code
ls ~/.claude-code/commands/ | grep prd
ls ~/.claude-code/agents/ | grep prd
ls ~/.claude-code/skills/

# 5. Restart Claude Code

# 6. Test commands
/create-prd
/list-prds
```

### Testing Configuration Changes

Create test project with custom config:

```bash
mkdir test-project
cd test-project
git init

# Create .claude/config.json
mkdir -p .claude
cat > .claude/config.json << 'EOF'
{
  "prd_workflow": {
    "prd_id": {
      "prefix": "TEST-PRD",
      "separator": "_",
      "number_padding": 2
    }
  }
}
EOF

# Test commands
/create-prd
# Expected PRD ID: TEST-PRD_01, TEST-PRD_02, etc.
```

---

## Common Pitfalls

### ❌ DON'T: Run npm publish manually
**Why**: GitHub Actions handles this automatically on git tags
**Do instead**: Create git tag, push, wait for automation

### ❌ DON'T: Forget to update CHANGELOG.md
**Why**: Release notes come from CHANGELOG
**Do instead**: Update CHANGELOG before creating tag

### ❌ DON'T: Change config structure without migration guide
**Why**: Breaks existing user configs
**Do instead**: Mark as BREAKING CHANGE, provide migration steps

### ❌ DON'T: Hardcode values that should be configurable
**Why**: Reduces plugin flexibility
**Do instead**: Read from config, provide sensible defaults

### ❌ DON'T: Update version in package.json without git tag
**Why**: npm package version won't match git tag
**Do instead**: Update version → commit → create matching tag

---

## Known Limitations & TODOs

### Current Limitations (v1.1.0)

1. **Config not fully implemented in runtime**
   - `prd_id` config is documented but agents don't read it yet
   - Commands still hardcode `PRD-XXX` format
   - **TODO**: Implement config parsing in agents

2. **No config validation**
   - Invalid `number_padding` values not caught
   - No fallback to defaults if config malformed
   - **TODO**: Add runtime validation

3. **No migration script**
   - Users must manually update from `prd_id_format` to `prd_id`
   - **TODO**: Create migration helper command

4. **Limited test coverage**
   - No automated tests for commands/agents
   - **TODO**: Set up test framework (Jest/Vitest)

### Future Enhancements

- [ ] Runtime config parsing in all agents
- [ ] Config validation with helpful error messages
- [ ] Migration script for breaking changes
- [ ] Test suite for commands and agents
- [ ] TypeScript for config parsing
- [ ] Config schema validation on plugin load
- [ ] Interactive config setup wizard (`/setup-config`)

---

## Troubleshooting

### Plugin not showing in Claude Code

```bash
# 1. Check installation
npm list -g claude-prd-workflow

# 2. Verify files in Claude Code directory
ls ~/.claude-code/commands/ | grep -i prd
ls ~/.claude-code/agents/

# 3. Reinstall
npm uninstall -g claude-prd-workflow
npm install -g claude-prd-workflow

# 4. Restart Claude Code
```

### GitHub Actions failing

```bash
# Check workflow logs
gh run list --workflow=publish-npm.yml --limit 1
gh run view <run-id> --log

# Common issues:
# - Missing NPM_TOKEN secret → Add to GitHub repo secrets
# - Version mismatch → package.json must match git tag
# - CHANGELOG not updated → Add version section
```

### Local testing not working

```bash
# Ensure you're in plugin directory
pwd  # Should be .../claude-prd-workflow

# Reinstall from local
npm install -g .

# Check postinstall script ran
# Should see output about copying to ~/.claude-code/

# Verify global install location
npm root -g
# Should contain claude-prd-workflow/
```

---

## Contributing

### For External Contributors

1. Fork repo
2. Create feature branch: `git checkout -b feat/my-feature`
3. Make changes following guidelines above
4. Update documentation
5. Add entry to CHANGELOG (Unreleased section)
6. Submit PR with clear description

### For Maintainers

1. Review PR for:
   - Follows commit conventions
   - Updates documentation
   - Includes tests (when framework exists)
   - Updates CHANGELOG
   - No breaking changes without migration guide
2. Merge to main
3. Create release tag when ready
4. Monitor GitHub Actions for auto-publish

---

## Resources

- **npm package**: https://www.npmjs.com/package/claude-prd-workflow
- **GitHub repo**: https://github.com/Yassinello/claude-prd-workflow
- **GitHub Actions**: https://github.com/Yassinello/claude-prd-workflow/actions
- **Issues**: https://github.com/Yassinello/claude-prd-workflow/issues
- **Releases**: https://github.com/Yassinello/claude-prd-workflow/releases

---

## ⚠️ CRITICAL: End-of-Session Checklist

**MANDATORY** - Do this at the end of EVERY session:

### 1. Update SESSION_CONTEXT.md

**Location**: `SESSION_CONTEXT.md` in project root

**What to update**:
- [ ] Add new session entry to "Session History"
- [ ] Update "Current Status" section (version, active work)
- [ ] Update "Known Issues" (mark resolved, add new)
- [ ] Add decisions to "Decision Log" if any major decisions made

**Template** is in SESSION_CONTEXT.md - copy/paste and fill in.

**WHY**: This ensures continuity between sessions. Without it, context is lost and we repeat work.

### 2. Commit SESSION_CONTEXT.md

```bash
git add SESSION_CONTEXT.md
git commit -m "docs: Update SESSION_CONTEXT with session #X"
git push origin main
```

**NEVER skip this step!** It's how we maintain project memory.

---

## Questions?

If Claude (or a contributor) is unclear about:
- Release process → Re-read "Release Process" section above
- Config changes → Re-read "Configuration Changes" section
- Publishing → **Remember: GitHub Actions does it automatically!**
- Session documentation → **ALWAYS update SESSION_CONTEXT.md at end of session!**

---

*Last updated: 2025-10-25*
*Plugin version: 1.2.0*
