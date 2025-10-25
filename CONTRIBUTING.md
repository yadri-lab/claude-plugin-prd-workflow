# Contributing to PRD Workflow Manager

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the PRD Workflow Manager plugin.

## How to Contribute

### Reporting Issues

**Before creating an issue**:
1. Search existing issues to avoid duplicates
2. Check the [troubleshooting guide](docs/troubleshooting.md)
3. Verify you're using a supported version of Claude Code (v2.0.0+)

**When creating an issue**:
- Use the issue templates provided
- Include Claude Code version
- Provide clear reproduction steps
- Include relevant logs or screenshots

### Suggesting Features

We welcome feature suggestions! Please:
1. Check existing feature requests
2. Describe the problem you're trying to solve
3. Explain your proposed solution
4. Consider if this could be a separate plugin instead

### Pull Requests

**Before submitting a PR**:
1. Discuss major changes in an issue first
2. Fork the repository
3. Create a feature branch (`feat/your-feature-name`)
4. Follow the coding standards below
5. Test your changes thoroughly

**PR Guidelines**:
- One feature/fix per PR
- Clear, descriptive commit messages
- Update documentation if needed
- Add to CHANGELOG.md
- Link related issues

## Development Setup

### Prerequisites
- Git v2.25+
- Node.js v18+ (for testing JavaScript examples)
- Claude Code v2.0.0+

### Local Development

1. **Fork and clone**:
```bash
git clone https://github.com/your-username/claude-prd-workflow.git
cd claude-prd-workflow
```

2. **Create a branch**:
```bash
git checkout -b feat/my-feature
```

3. **Make changes**:
```bash
# Edit files
# Test in Claude Code
```

4. **Commit**:
```bash
git add .
git commit -m "feat: Add new feature

- Implemented X
- Updated docs
- Added tests"
```

5. **Push and create PR**:
```bash
git push origin feat/my-feature
# Create PR on GitHub
```

## Coding Standards

### Markdown Files

**Headers**: Use ATX-style headers (`#`, `##`, etc.)
```markdown
# Top Level
## Second Level
### Third Level
```

**Lists**: Use hyphens (`-`) for unordered lists
```markdown
- Item 1
- Item 2
  - Nested item
```

**Code blocks**: Always specify language
````markdown
```typescript
const example = 'code';
```
````

**Links**: Use reference-style for repeated links
```markdown
[Claude Code][claude-code] is awesome.

[claude-code]: https://claude.com/claude-code
```

### Configuration Files (JSON)

**Formatting**:
- 2-space indentation
- No trailing commas
- Double quotes for strings
- Comments via `$comment` key

**Example**:
```json
{
  "$comment": "This is a comment",
  "property": "value",
  "nested": {
    "key": "value"
  }
}
```

### Commands (`commands/*.md`)

**Structure**:
1. Frontmatter (name, description, category)
2. Purpose section
3. Workflow section (step-by-step)
4. Configuration section
5. Success criteria
6. Related links

**Example**:
```markdown
---
name: command-name
description: Short description
category: Category Name
---

# Command Name

Description of what this command does.

## Purpose
...

## Workflow

### Step 1: ...
### Step 2: ...

## Configuration
...

## Success Criteria
...

## Related
- Command: `/other-command`
- Agent: `agent-name`
```

### Agents (`agents/*.md`)

**Structure**:
1. Frontmatter
2. Role & expertise
3. Methodology/process
4. Output format
5. Tone & style
6. Success criteria
7. Related links

### Skills (`skills/*.md`)

**Structure**:
1. Frontmatter
2. Overview
3. Capabilities (numbered sections)
4. Code examples
5. Best practices
6. Related links

## Documentation Standards

### Writing Style

**Voice**: Second person, active voice
```markdown
✅ "Run this command to install dependencies"
❌ "Dependencies can be installed by running"
```

**Tense**: Present tense
```markdown
✅ "This command creates a new PRD"
❌ "This command will create a new PRD"
```

**Code examples**: Always include expected output
```bash
# Command
npm install

# Expected output
added 450 packages in 12s
```

### Documentation Updates

When adding/changing features:
- [ ] Update README.md
- [ ] Update relevant docs/
- [ ] Add to CHANGELOG.md
- [ ] Update configuration examples
- [ ] Add/update code examples

## Testing

### Manual Testing

Test your changes:
1. Install plugin in Claude Code
2. Test all affected commands
3. Verify configuration changes work
4. Test edge cases
5. Check error messages are helpful

### Test Checklist

- [ ] All commands work as expected
- [ ] Configuration validates correctly
- [ ] Error handling is graceful
- [ ] Documentation is accurate
- [ ] No broken links
- [ ] Examples work

## Release Process

(For maintainers)

1. Update version in `plugin.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.1.0`
4. Push tag: `git push origin v1.1.0`
5. Create GitHub release with changelog
6. Announce in discussions

## Code of Conduct

Please be respectful and constructive:
- Be welcoming to newcomers
- Respect differing viewpoints
- Accept constructive criticism
- Focus on what's best for the community

## Questions?

- Open a discussion on GitHub
- Email: yassine@acmecorp.com
- Join our Discord (link TBD)

---

**Thank you for contributing!** 🎉
