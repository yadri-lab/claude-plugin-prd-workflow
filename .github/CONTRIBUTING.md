# Contributing to PRD Workflow Manager

Thank you for your interest in contributing to the PRD Workflow Manager! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Getting Started

### Prerequisites

- Node.js v18+
- Git v2.25+
- Claude Code v2.0+
- npm or yarn

### Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-prd-workflow.git
   cd claude-prd-workflow
   ```

2. **Install dependencies** (if any):
   ```bash
   npm install
   ```

3. **Install plugin locally for testing**:
   ```bash
   npm install -g .
   ```

4. **Verify installation**:
   ```bash
   # In Claude Code
   /plugin-version
   /list-prds
   ```

---

## How to Contribute

### Types of Contributions

We welcome the following types of contributions:

1. **Bug fixes** - Fix issues in commands, agents, or skills
2. **New features** - Add new commands, agents, or skills
3. **Documentation** - Improve guides, examples, or README
4. **Configuration presets** - Add new config presets for different use cases
5. **Examples** - Add real-world usage examples
6. **Tests** - Add test coverage (when test framework is set up)

### Before You Start

- **Check existing issues** to avoid duplicate work
- **Open an issue** to discuss major changes before implementing
- **Read the development guide** in `dev/DEVELOPMENT.md`
- **Check session context** in `dev/SESSION_CONTEXT.md` for recent work

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Scopes

- `commands` - Slash commands
- `agents` - AI agents
- `skills` - Reusable skills
- `config` - Configuration system
- `docs` - Documentation
- `ci` - CI/CD workflows

### Examples

```bash
feat(commands): Add /plugin-version command
fix(agents): Fix PRD ID parsing in prd-implementer
docs(examples): Add Watchora configuration example
chore(ci): Update GitHub Actions workflow
```

---

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style
- Update documentation as needed
- Add examples if applicable
- Test your changes locally

### 3. Update Documentation

If your change affects:
- **Commands**: Update `docs/commands-reference.md`
- **Configuration**: Update `docs/configuration.md`
- **Features**: Update `README.md`

### 4. Update CHANGELOG

Add an entry to `CHANGELOG.md` under the "Unreleased" section:

```markdown
## [Unreleased]

### Added
- New `/plugin-version` command for easy version checking

### Changed
- Improved error handling in `/create-prd` command

### Fixed
- Fixed PRD ID generation bug in multi-digit numbers
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat(commands): Add /plugin-version command"
```

### 6. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a pull request on GitHub with:
- **Clear title** following commit convention
- **Description** of what changed and why
- **Screenshots** or examples (if applicable)
- **Testing steps** to verify the change
- **Breaking changes** clearly marked

---

## Testing

### Manual Testing

1. **Install locally**:
   ```bash
   npm install -g .
   ```

2. **Test in Claude Code**:
   ```bash
   /plugin-version
   /create-prd
   /list-prds
   # etc.
   ```

3. **Test in a real project**:
   ```bash
   cd ~/test-project
   # Test full workflow
   ```

### Automated Testing (TODO)

We plan to add automated tests with Jest/Vitest. For now, manual testing is required.

---

## Documentation

### Where to Add Documentation

- **User guides**: `docs/`
- **Examples**: `docs/examples/`
- **API reference**: `docs/commands-reference.md`, `docs/agents-guide.md`
- **Development**: `dev/DEVELOPMENT.md`

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep examples realistic and practical
- Test all code snippets

---

## Project Structure

```
claude-prd-workflow/
├── commands/              # Slash commands
├── agents/                # AI agents
├── skills/                # Reusable skills
├── templates/             # Markdown templates
├── config/                # Configuration system
│   ├── schema.json        # JSON schema
│   ├── default-config.json
│   └── presets/           # Config presets
├── docs/                  # User documentation
├── dev/                   # Developer documentation
│   ├── DEVELOPMENT.md     # Development guide
│   └── SESSION_CONTEXT.md # Work session tracking
├── .github/               # GitHub metadata
│   ├── workflows/         # CI/CD
│   ├── CODE_OF_CONDUCT.md
│   └── CONTRIBUTING.md    # This file
└── install.js             # Installation script
```

---

## Configuration Changes

### Adding New Config Options

1. **Update schema**: `config/schema.json`
2. **Update defaults**: `config/default-config.json`
3. **Update presets**: `config/presets/*.json`
4. **Document**: `docs/configuration.md`
5. **Add example**: `docs/examples/`

### Breaking Changes

If your change modifies existing config structure:
- Mark as `BREAKING CHANGE` in commit message
- Provide migration guide in CHANGELOG
- Update all presets
- Update documentation
- Consider backward compatibility

Example:
```
feat(config)!: Restructure PRD ID configuration

BREAKING CHANGE: Replaced branch_naming.prd_id_format with prd_id section

Migration:
// Before
"branch_naming": { "prd_id_format": "PRD-{number}" }

// After
"prd_id": { "prefix": "PRD", "separator": "-", "number_padding": 3 }
```

---

## Release Process (Maintainers Only)

**Note**: Releases are automated via GitHub Actions. DO NOT run `npm publish` manually.

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with version number and date
3. **Commit changes**:
   ```bash
   git commit -m "chore: Bump version to X.Y.Z"
   ```
4. **Create and push tag**:
   ```bash
   git tag vX.Y.Z
   git push origin main
   git push origin vX.Y.Z
   ```
5. **GitHub Actions will automatically**:
   - Publish to npm
   - Create GitHub Release

---

## Getting Help

- **Issues**: https://github.com/Yassinello/claude-prd-workflow/issues
- **Discussions**: https://github.com/Yassinello/claude-prd-workflow/discussions
- **Documentation**: https://github.com/Yassinello/claude-prd-workflow/blob/main/README.md

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- CHANGELOG.md (for significant contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to PRD Workflow Manager!** 🚀
