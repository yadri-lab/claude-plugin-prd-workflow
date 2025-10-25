# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-25

### Added
- **Configurable PRD ID format**: Support for custom prefixes, separators, and number padding
  - New `prd_id` config section with `prefix`, `separator`, and `number_padding` options
  - Examples: `PRD-001`, `WTC-PRD-001`, `ACME-PRD-001`, `FEAT_0001`
- Enhanced configuration schema with detailed descriptions for all options
- Alternative configuration example in AcmeCorp docs showing custom prefix usage
- Pattern variables documentation for branch and worktree naming

### Changed
- **BREAKING**: Replaced `branch_naming.prd_id_format` with new `prd_id` configuration section
  - Old: `"prd_id_format": "PRD-{number}"`
  - New: `"prd_id": { "prefix": "PRD", "separator": "-", "number_padding": 3 }`
- Updated all presets (startup, enterprise, open-source) to use new config format
- Updated AcmeCorp example with new configuration structure
- Enhanced configuration documentation with more examples and use cases
- Improved `/create-prd` command documentation with detailed PRD ID generation logic

### Migration Guide
For existing projects, update your `.claude/config.json`:
```json
// Before
"branch_naming": {
  "prd_id_format": "PRD-{number}"
}

// After
"prd_id": {
  "prefix": "PRD",
  "separator": "-",
  "number_padding": 3
}
```

## [1.0.4] - 2025-10-25

### Added
- Complete "Keeping the Plugin Updated" section in README
- Version checking commands and workflow documentation
- Update best practices and semantic versioning guide
- Links to GitHub releases and npm package page

### Changed
- Improved documentation structure with dedicated update section

## [1.0.3] - 2025-10-25

### Added
- Concrete real-world example in Quick Start (MCP Server Prioritization)
- Example PRD in `product/prds/01-draft/` demonstrating plugin usage
- Interactive installation guide (Option C: From Claude Code)
- "Using in an Existing Project" section with step-by-step instructions

### Changed
- Improved installation documentation with correct paths (`~/.claude-code/`)
- Enhanced Quick Start section with real scenario walkthrough
- Reorganized installation steps for better clarity
- Updated troubleshooting section with specific verification commands

### Fixed
- Corrected all file paths in README (was incorrectly using `~/.config/Claude/`)
- Restored critical `node install.js` step in Git Clone installation option
- Removed mixed language content (FR/EN) for consistency

## [1.0.2] - 2025-10-25

### Fixed
- **Critical installation bug**: `install.js` now correctly copies commands, agents, and skills to global Claude Code directories (`~/.claude-code/commands/`, `~/.claude-code/agents/`, `~/.claude-code/skills/`)
- Commands now appear immediately after installation and restart (no manual copy required)
- Added installation verification section in README

### Changed
- Updated installation instructions with clearer steps and troubleshooting guide
- Reorganized installation options (npm now recommended as primary method)
- Enhanced installation script output to show global directory installation status

## [1.0.1] - 2025-10-25

### Changed
- Improved README tagline for clarity
- Set up automated GitHub to npm publishing via GitHub Actions

### Fixed
- Removed obsolete email references from documentation

## [1.0.0] - 2025-10-25

### Added

#### Commands (9 total)
- `/review-prd` - Comprehensive PRD review with 7-dimension analysis
- `/code-prd` - Start development with Git worktree setup
- `/work-prd` - Guided implementation with task breakdown
- `/list-prds` - List all PRDs with status and metrics
- `/create-prd` - Create new PRD from template
- `/archive-prd` - Archive completed or cancelled PRDs
- `/security-audit` - Comprehensive security vulnerability scanning
- `/quality-check` - Code quality analysis (linting, testing, complexity)
- `/orchestrate` - Multi-PRD workflow orchestration

#### Agents (6 total)
- **prd-reviewer**: PRD quality & feasibility expert (7-dimension review)
- **prd-implementer**: Development guide with task breakdown
- **orchestrator**: Workflow coordination & dependency management
- **security-expert**: Security vulnerability detection & remediation
- **quality-assurance**: Code quality & testing analysis
- **devops-engineer**: CI/CD & infrastructure automation

#### Skills (8 total)
- **git-workflow**: Git operations, branching, worktrees, conflict resolution
- **testing**: Unit, integration, E2E testing with coverage analysis
- **security-analysis**: Vulnerability scanning & secure coding practices
- **code-quality**: Linting, complexity analysis, maintainability metrics
- **documentation**: README, API docs, ADRs, migration guides
- **estimation**: Effort & complexity estimation (story points, PERT)
- **dependency-management**: npm/yarn dependency analysis & optimization
- **performance-analysis**: Performance profiling, optimization, benchmarking

#### Features
- Git worktree support for parallel development
- PRD grading system (A-F)
- Automatic GitHub issue creation
- WORK_PLAN.md tracking
- Progress persistence (resume work sessions)
- Security & quality gates
- Dependency graph visualization
- Conflict detection
- Historical velocity tracking

#### Configuration
- Fully customizable config system
- JSON schema validation
- 3 preset configurations (startup, enterprise, open-source)
- Environment-specific overrides

#### Templates
- PRD template with comprehensive sections
- GitHub issue template
- Pull request template
- Release notes template
- Architecture decision record (ADR) template

#### Documentation
- Comprehensive README
- Getting started guide
- Configuration reference
- Commands reference
- Agents guide
- Skills reference
- Best practices
- Troubleshooting guide
- 4 real-world examples (AcmeCorp, SaaS, e-commerce, microservices)

### Technical Details
- Compatible with Claude Code v2.0.0+
- Supports Windows, macOS, Linux
- Git v2.25+ required (for worktrees)
- Zero external dependencies (pure markdown)

---

## [Unreleased]

### Planned for v1.1.0
- Slack/Discord notifications integration
- Visual PRD dependency graph (Mermaid diagrams)
- Automated PR creation from completed PRDs
- PRD templates library (API, UI component, infrastructure)
- Team collaboration features (assign PRDs, comments)
- Analytics dashboard (velocity, completion rate)

[1.0.4]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.4
[1.0.3]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.3
[1.0.2]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.2
[1.0.1]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.1
[1.0.0]: https://github.com/Yassinello/claude-prd-workflow/releases/tag/v1.0.0
[Unreleased]: https://github.com/Yassinello/claude-prd-workflow/compare/v1.0.4...HEAD
