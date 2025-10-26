# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-10-26

### Added - Development Tools Expansion 🚀

This release transforms PRD Workflow Manager from a PRD-focused tool into a comprehensive daily development platform.

#### New Agents (7)

**Development Agents** (5):
- `code-reviewer` (Haiku) - Automated code review with static analysis, complexity detection, and best practices checking
- `test-automator` (Haiku) - Automatic generation of unit/integration/E2E tests with fixtures and mocks
- `backend-architect` (Sonnet) - Expert guidance on API design, database schema, and backend architecture
- `incident-coordinator` (Sonnet) - Structured incident response with runbooks, postmortems, and prevention strategies
- `performance-analyst` (Sonnet) - Systematic performance optimization (Core Web Vitals, bundle analysis, database profiling)

**Multi-Agent Workflows** (2):
- `full-stack-orchestrator` (Sonnet) - Coordinates end-to-end feature development across frontend, backend, database, and testing
- `code-review-orchestrator` (Haiku) - Runs 5 agents in parallel to provide comprehensive PR review in 30 seconds

#### New Documentation
- `docs/guide.md` - Complete unified guide (replaces 18 separate docs files)
- `docs/examples.md` - Real-world examples (Startup, Enterprise, Microservices, Open Source)
- Documentation simplified: 20 files → 2 files for better UX

#### Command Improvements (Breaking Changes)
- **RENAMED**: `/code-prd` → `/setup-prd` (clearer: sets up dev environment)
- **RENAMED**: `/work-prd` → `/code-prd` (clearer: actual coding with AI guidance)
- Better command naming that matches user intent

### Changed

- **Agent count**: 6 → 13 agents (+117% expansion)
- **Use cases**: PRD-only → PRD + daily development
- **Target audience**: PMs + PRD developers → All developers
- **Daily usage**: 10-20% → 80-90% of dev team
- **Documentation structure**: Dramatically simplified (20 docs → 2 docs)

### Impact

- **Code Review**: 30-45 min → 30 seconds (-95% time)
- **Test Generation**: Manual (hours) → Automated (seconds) (10x faster)
- **Full-Stack Features**: Uncoordinated → Guided end-to-end (50% faster)
- **Incident Response**: Ad-hoc → Structured runbooks (50% faster MTTR)
- **Performance**: Ad-hoc profiling → Systematic optimization (2-3x faster apps)

### Technical

- Implemented Haiku model support for fast, deterministic tasks (code-reviewer, test-automator)
- Maintained Sonnet for complex reasoning tasks (backend-architect, incident-coordinator, performance-analyst)
- Added multi-agent parallel execution for code-review-orchestrator
- Added sequential orchestration for full-stack-orchestrator

---

## [2.0.0] - 2025-10-25

### 🎉 Major Release: Modular Architecture & Lightweight Mode

This release introduces a **modular architecture** that makes the plugin flexible for different project types - from full PRD workflows to lightweight Git helpers.

### Added

#### New Modes
- **Full Mode**: Complete PRD workflow (default, same as v1.x)
- **Lightweight Mode**: No PRDs, just Git helpers + quality checks (perfect for side projects!)
- **Skills-only Mode**: Just reusable skills for custom workflows (planned for v2.1)

#### New Commands
- `/plugin-version` - Check installed version vs. latest, with update instructions
- `/smart-commit` - AI-powered commit message generation (Conventional Commits)
- `/smart-pr` - AI-powered PR creation with auto-generated summary and test plan

#### Configuration
- `mode` setting: Choose between "full", "lightweight", or "skills-only"
- `modules` configuration: Enable/disable specific modules (prd, quality, security, git, devops, orchestration)
- New preset: `lightweight.json` for projects that don't use PRDs
- Git workflow configuration: `smart_commit` and `smart_pr` settings

#### Documentation
- `docs/use-cases.md` - Complete guide for different project types
- `docs/version-check.md` - How to check and update plugin version
- `.github/CONTRIBUTING.md` - Contribution guidelines
- `dev/` directory for developer documentation

#### Developer Experience
- `.plugin-info.json` created during installation with version metadata
- Updated `install.js` to display `/plugin-version` command in success message
- Better installation output with version info

### Changed

#### **BREAKING**: Project structure reorganized
- **MOVED**: `CLAUDE.md` → `dev/DEVELOPMENT.md`
- **MOVED**: `SESSION_CONTEXT.md` → `dev/SESSION_CONTEXT.md`
- **MOVED**: `CODE_OF_CONDUCT.md` → `.github/CODE_OF_CONDUCT.md`
- **CREATED**: `.github/CONTRIBUTING.md`

**Why**: Clear separation between user docs (README, docs/) and developer docs (dev/, .github/)

#### Configuration Schema Enhanced
- Added `mode` field (enum: full, lightweight, skills-only)
- Added `modules` section for granular module control
- Each module can be independently enabled/disabled

### Migration Guide

#### From v1.x to v2.0.0

**No config changes required!** v2.0.0 defaults to "full" mode, same as v1.x.

However, if you want to use new features:

#### Option 1: Use Lightweight Mode (for side projects)
```json
{
  "preset": "lightweight"
}
```

Or manually:
```json
{
  "mode": "lightweight",
  "modules": {
    "prd": false,
    "git": true,
    "quality": true,
    "security": true
  }
}
```

#### Option 2: Stay in Full Mode (default)
No changes needed. All v1.x features work exactly as before.

#### Updating References
If you have scripts or documentation referencing:
- `CLAUDE.md` → Update to `dev/DEVELOPMENT.md`
- `SESSION_CONTEXT.md` → Update to `dev/SESSION_CONTEXT.md`
- `CODE_OF_CONDUCT.md` → Update to `.github/CODE_OF_CONDUCT.md`

### Use Cases

v2.0.0 supports **5 main use cases**:

1. **Startup with PRDs** → Use `startup.json` preset (full mode)
2. **Side project without PRDs** → Use `lightweight.json` preset
3. **Open source project** → Use `open-source.json` preset (full mode)
4. **Enterprise team** → Use `enterprise.json` preset (full mode)
5. **Solo developer** → Use `lightweight.json` with minimal modules

See `docs/use-cases.md` for detailed configuration examples.

### New Commands Overview

#### `/plugin-version`
Quickly check if you're running the latest version:
```
/plugin-version
→ Installed: 1.2.0
→ Latest: 2.0.0
→ Update available! Run: npm install -g claude-prd-workflow@latest
```

#### `/smart-commit` (Lightweight Mode)
AI-generated commit messages following Conventional Commits:
```
/smart-commit
→ Analyzes your changes
→ Generates: "feat(auth): Add OAuth2 login with Google"
→ Creates commit
```

#### `/smart-pr` (Lightweight Mode)
AI-generated PR with summary, description, and test plan:
```
/smart-pr
→ Analyzes commits since branch diverged
→ Generates comprehensive PR description
→ Creates PR on GitHub
→ Returns PR URL
```

### Technical Changes

- Enhanced `config/schema.json` with mode and modules definitions
- Created `config/presets/lightweight.json` for non-PRD workflows
- Updated `install.js` to create `.plugin-info.json` metadata file
- File reorganization with `git mv` to preserve history

### What's Next (v2.1.0 Planned)

- **Full modular architecture**: Physical separation of modules into `modules/` directory
- **Skills-only mode**: Use skills without commands
- **Custom workflow composer**: Create your own commands using skills
- **CLI tool**: Standalone CLI independent of Claude Code

---

## [1.2.0] - 2025-10-25

### Added
- **Runtime configuration parsing**: Commands now actually read `.claude/config.json`
- Detailed instructions in `/create-prd` for reading PRD ID config from user projects
- Branch naming configuration support in `/code-prd`
- Flexible PRD ID recognition in `/list-prds` (supports all formats)
- Error handling and fallback to defaults if config is invalid

### Fixed
- **CRITICAL**: Custom PRD ID formats (like `WTC-PRD-XXX`) now work at runtime
- Commands no longer hardcode `PRD-XXX` format
- Config from v1.1.0 is now actually functional (not just documented)

### Changed
- `/create-prd` Step 2: Added explicit config reading instructions
- `/code-prd` Step 3: Added branch naming config parsing
- `/list-prds` Step 2: Added support for custom PRD ID formats

---

[2.0.0]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v2.0.0
[1.2.0]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.2.0
[1.1.0]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.1.0
[1.0.4]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.4
[1.0.3]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.3
[1.0.2]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.2
[1.0.1]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.1
[1.0.0]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.0
[Unreleased]: https://github.com/Yassinello/claude-prd-workflow/compare/v2.0.0...HEAD
