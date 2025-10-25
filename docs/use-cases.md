# Use Cases & Configuration Guide

This guide shows you how to configure the PRD Workflow Manager for different types of projects and teams.

---

## Table of Contents

- [Choosing the Right Mode](#choosing-the-right-mode)
- [Use Case 1: Startup with PRD Process](#use-case-1-startup-with-prd-process)
- [Use Case 2: Side Project / Prototype](#use-case-2-side-project--prototype)
- [Use Case 3: Open Source Project](#use-case-3-open-source-project)
- [Use Case 4: Enterprise Team](#use-case-4-enterprise-team)
- [Use Case 5: Solo Developer](#use-case-5-solo-developer)
- [Mode Comparison](#mode-comparison)
- [Switching Between Modes](#switching-between-modes)

---

## Choosing the Right Mode

The plugin supports **3 modes**:

| Mode | Best For | What You Get |
|------|----------|--------------|
| **Full** | Teams with structured PRD process | All features: PRDs, agents, quality, security |
| **Lightweight** | Side projects, prototypes, no PRDs | Git helpers, quality checks, security scans |
| **Skills-only** | Power users, custom workflows | Just reusable skills for composition |

---

## Use Case 1: Startup with PRD Process

**Profile**: Small team (2-10 people), fast-moving, need structure but not heavyweight

**Configuration**: Use `startup.json` preset

```json
{
  "mode": "full",
  "modules": {
    "prd": true,
    "quality": true,
    "security": true,
    "git": true,
    "orchestration": true
  }
}
```

**Setup**:

```bash
# In your project root
mkdir -p .claude
cat > .claude/config.json << 'EOF'
{
  "preset": "startup"
}
EOF
```

**Workflow**:

1. **Create PRD**: `/create-prd`
2. **Review**: `/review-prd PRD-001`
3. **Develop**: `/code-prd PRD-001`
4. **Implement**: `/work-prd PRD-001`
5. **Quality Check**: `/quality-check`
6. **Create PR**: Uses existing PR workflow

**Commands You'll Use**:
- ✅ `/create-prd`, `/review-prd`, `/code-prd`, `/work-prd`
- ✅ `/list-prds`, `/archive-prd`
- ✅ `/quality-check`, `/security-audit`
- ✅ `/orchestrate` (for multi-feature work)

**Commands You Won't Need**:
- ❌ DevOps commands (not implemented yet)

---

## Use Case 2: Side Project / Prototype

**Profile**: Solo developer or small team, quick iterations, no formal PRD process

**Configuration**: Use `lightweight.json` preset

```json
{
  "mode": "lightweight",
  "modules": {
    "prd": false,
    "quality": true,
    "security": true,
    "git": true,
    "orchestration": false
  }
}
```

**Setup**:

```bash
# In your project root
mkdir -p .claude
cat > .claude/config.json << 'EOF'
{
  "preset": "lightweight"
}
EOF
```

**Workflow**:

1. **Make changes**: Code as usual
2. **Commit**: `/smart-commit` (AI-generated commit message)
3. **Quality check**: `/quality-check` (optional)
4. **Create PR**: `/smart-pr` (AI-generated PR description)
5. **Security scan**: `/security-audit` (on demand)

**Commands You'll Use**:
- ✅ `/smart-commit` - AI-powered commit messages
- ✅ `/smart-pr` - AI-powered PR creation
- ✅ `/quality-check` - Linting, testing, coverage
- ✅ `/security-audit` - Security scans
- ✅ `/plugin-version` - Check for updates

**Commands Disabled**:
- ❌ All PRD commands (`/create-prd`, `/review-prd`, etc.)
- ❌ `/orchestrate`

**Why Lightweight Mode?**:
- No overhead of PRD management
- Still get quality and security benefits
- Fast, streamlined Git workflow
- Perfect for MVPs and experiments

---

## Use Case 3: Open Source Project

**Profile**: Public repo, contributors from community, need quality gates

**Configuration**: Custom config based on `open-source.json`

```json
{
  "mode": "full",
  "modules": {
    "prd": true,
    "quality": true,
    "security": true,
    "git": true,
    "orchestration": false
  },
  "prd_workflow": {
    "github": {
      "create_issue_on_approval": true,
      "public_prd_tracking": true
    }
  },
  "quality": {
    "testing": {
      "required_for_pr": true,
      "coverage_threshold": 80
    }
  }
}
```

**Workflow**:

1. **Create PRD** for major features: `/create-prd`
2. **Public review**: `/review-prd PRD-001` (creates GitHub issue)
3. **Contributors work**: `/work-prd PRD-001`
4. **PR submission**: `/smart-pr`
5. **Quality gates**: `/quality-check` (CI/CD integration)

**Commands You'll Use**:
- ✅ PRD commands for major features
- ✅ `/smart-commit`, `/smart-pr` for contributors
- ✅ `/quality-check` (enforced in CI)
- ✅ `/security-audit` (required before release)

---

## Use Case 4: Enterprise Team

**Profile**: Large team (10+ people), strict processes, compliance requirements

**Configuration**: Use `enterprise.json` preset

```json
{
  "mode": "full",
  "modules": {
    "prd": true,
    "quality": true,
    "security": true,
    "git": true,
    "devops": true,
    "orchestration": true
  },
  "prd_workflow": {
    "review": {
      "minimum_grade": "B",
      "require_approval": true
    }
  },
  "security": {
    "fail_on_high_severity": true,
    "auto_scan_on_commit": true
  },
  "quality": {
    "testing": {
      "required_for_pr": true,
      "coverage_threshold": 85
    }
  }
}
```

**Workflow**:

1. **PRD creation**: `/create-prd` (requires approval)
2. **Rigorous review**: `/review-prd` (minimum grade B)
3. **Parallel development**: `/orchestrate` (coordinate multiple PRDs)
4. **Implementation**: `/work-prd` with task tracking
5. **Quality gates**: `/quality-check` (strict thresholds)
6. **Security compliance**: `/security-audit` (auto-scanned)

**Commands You'll Use**:
- ✅ All PRD commands
- ✅ `/orchestrate` for multi-team coordination
- ✅ `/quality-check`, `/security-audit` (enforced)
- ✅ DevOps commands (when implemented)

---

## Use Case 5: Solo Developer

**Profile**: Individual working alone, wants AI assistance without overhead

**Configuration**: Minimal config

```json
{
  "mode": "lightweight",
  "modules": {
    "prd": false,
    "quality": true,
    "security": false,
    "git": true,
    "orchestration": false
  }
}
```

**Workflow**:

1. **Code**: Work as usual
2. **Commit**: `/smart-commit`
3. **PR**: `/smart-pr` (if using GitHub)
4. **Quality check**: `/quality-check` (optional)

**Minimal Command Set**:
- `/smart-commit`
- `/smart-pr`
- `/quality-check`
- `/plugin-version`

**No PRD overhead**, just helpful Git and quality tools.

---

## Mode Comparison

### Full Mode

**Best for**: Teams with structured product development

**What's enabled**:
- ✅ All PRD commands
- ✅ AI agents (reviewer, implementer, orchestrator)
- ✅ Git worktree support
- ✅ Quality & security checks
- ✅ Multi-PRD orchestration

**Workflow**:
```
/create-prd → /review-prd → /code-prd → /work-prd → ship
```

---

### Lightweight Mode

**Best for**: Side projects, prototypes, quick iterations

**What's enabled**:
- ✅ Smart Git commands (`/smart-commit`, `/smart-pr`)
- ✅ Quality checks (`/quality-check`)
- ✅ Security scans (`/security-audit`)
- ❌ PRD commands disabled
- ❌ Orchestration disabled

**Workflow**:
```
code → /smart-commit → /quality-check → /smart-pr → merge
```

---

### Skills-Only Mode (Future)

**Best for**: Power users who want to compose custom workflows

**What's enabled**:
- ✅ Reusable skills (git-workflow, testing, security-analysis, etc.)
- ❌ No commands (user creates custom workflows)

**Workflow**:
```
User creates custom `/my-workflow` command that uses skills
```

---

## Switching Between Modes

### From Full to Lightweight

```bash
# Edit .claude/config.json
{
  "preset": "lightweight"
}

# Or manually:
{
  "mode": "lightweight",
  "modules": {
    "prd": false
  }
}
```

**What happens**:
- PRD commands are hidden/disabled
- Git, quality, security commands still work
- Existing PRDs are preserved (just not actively used)

### From Lightweight to Full

```bash
# Edit .claude/config.json
{
  "preset": "startup"  # or "enterprise" or "open-source"
}
```

**What happens**:
- PRD commands become available
- Can start using `/create-prd`, `/review-prd`, etc.
- All features unlocked

---

## Preset Quick Reference

| Preset | Mode | PRDs | Quality | Security | Git | Orchestration | Best For |
|--------|------|------|---------|----------|-----|---------------|----------|
| **startup.json** | full | ✅ | ✅ | ✅ | ✅ | ✅ | Fast-moving teams |
| **enterprise.json** | full | ✅ | ✅ (strict) | ✅ (strict) | ✅ | ✅ | Large teams, compliance |
| **open-source.json** | full | ✅ | ✅ | ✅ | ✅ | ❌ | Public projects |
| **lightweight.json** | lightweight | ❌ | ✅ | ✅ | ✅ | ❌ | Side projects, prototypes |

---

## Configuration Locations

### Global Config (all projects)

```bash
~/.claude-code/config.json
```

Applies to ALL projects unless overridden.

### Project-Specific Config

```bash
your-project/.claude/config.json
```

Overrides global config for this project only.

**Priority**: Project config > Global config > Plugin defaults

---

## FAQ

### Q: Can I use some PRD commands but not others?

A: Not in v2.0.0. Future versions may support granular command control. For now, use lightweight mode and manually create PRD files if needed.

### Q: Does lightweight mode delete my PRDs?

A: No! It just hides the commands. Your PRD files remain untouched.

### Q: Can I switch modes mid-project?

A: Yes! Just update `.claude/config.json` and restart Claude Code.

### Q: Which mode is fastest?

A: Lightweight mode has the least overhead. Skills-only mode (future) will be even lighter.

### Q: Can I create my own preset?

A: Yes! Create `config/presets/your-preset.json` and reference it:
```json
{
  "preset": "your-preset"
}
```

---

## Next Steps

- [Configuration Reference](./configuration.md)
- [Commands Reference](./commands-reference.md)
- [Example Configurations](./examples/)
- [Getting Started](./getting-started.md)

---

**Plugin**: claude-prd-workflow
**Version**: 2.0.0
**Last Updated**: 2025-10-25
