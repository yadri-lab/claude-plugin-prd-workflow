# Configuration Reference

Complete reference for configuring PRD Workflow Manager.

## Configuration File

**Location**: `.claude/config.json` (in your project root)

**Format**: JSON (validated against `config/schema.json`)

**Loading Order**:
1. `config/default-config.json` (plugin defaults)
2. `.claude/config.json` (your overrides)
3. Environment variables (future)

---

## Quick Start

### Use a Preset

```bash
# Startup (fast-moving)
cp config/presets/startup.json .claude/config.json

# Enterprise (strict)
cp config/presets/enterprise.json .claude/config.json

# Open Source (community)
cp config/presets/open-source.json .claude/config.json
```

### Customize

Edit `.claude/config.json` and override specific settings:

```json
{
  "prd_workflow": {
    "directories": {
      "draft": "docs/prds/draft"  // Custom path
    },
    "worktree": {
      "enabled": false  // Disable worktrees
    }
  }
}
```

---

## Configuration Sections

### 1. PRD Workflow

#### Directories

**Purpose**: Define where PRDs are stored at each lifecycle stage

```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft",
      "review": "product/prds/02-review",
      "ready": "product/prds/03-ready",
      "in_progress": "product/prds/04-in-progress",
      "complete": "product/prds/05-complete",
      "archived": "product/prds/99-archived"
    }
  }
}
```

**Defaults**: As shown above

**Customization**:
- Use any directory structure
- Paths relative to project root
- Can use shared directories (e.g., Dropbox)

---

#### PRD ID Format

**Purpose**: Define how PRD IDs are generated and formatted

```json
{
  "prd_workflow": {
    "prd_id": {
      "prefix": "PRD",
      "separator": "-",
      "number_padding": 3
    }
  }
}
```

**Result**: `PRD-001`, `PRD-002`, `PRD-003`, ...

**Options**:

| Option | Type | Default | Description | Examples |
|--------|------|---------|-------------|----------|
| `prefix` | string | `"PRD"` | Identifier prefix | `"PRD"`, `"WTC-PRD"`, `"FEAT"`, `"ACME-PRD"` |
| `separator` | string | `"-"` | Character between prefix and number | `"-"`, `"_"`, `""` |
| `number_padding` | integer | `3` | Number of digits (zero-padded) | `3` → `"001"`, `4` → `"0001"` |

**Examples**:
```json
// Standard format (default)
{
  "prefix": "PRD",
  "separator": "-",
  "number_padding": 3
}
// Result: PRD-001, PRD-002, PRD-003

// Company-specific format
{
  "prefix": "ACME-PRD",
  "separator": "-",
  "number_padding": 3
}
// Result: ACME-PRD-001, ACME-PRD-002, ACME-PRD-003

// Short format
{
  "prefix": "F",
  "separator": "",
  "number_padding": 2
}
// Result: F01, F02, F03

// Underscore format
{
  "prefix": "FEAT",
  "separator": "_",
  "number_padding": 4
}
// Result: FEAT_0001, FEAT_0002, FEAT_0003
```

---

#### Branch Naming

**Purpose**: Control Git branch naming convention

```json
{
  "prd_workflow": {
    "branch_naming": {
      "prefix": "feat",
      "separator": "-",
      "pattern": "{prefix}/{prd_id}{separator}{feature_name}"
    }
  }
}
```

**Result**: `feat/PRD-003-design-system`

**Options**:
- **prefix**: `feat`, `feature`, `task`, `story`
- **separator**: `-`, `_`, `/`
- **pattern**: Custom template using variables

**Pattern Variables**:
- `{prefix}` - Branch prefix from config
- `{prd_id}` - Full PRD ID (e.g., `PRD-003`, `ACME-PRD-003`)
- `{separator}` - Separator from config
- `{feature_name}` - Feature name (slugified)

**Examples**:
```json
// Standard (default)
{
  "prefix": "feat",
  "pattern": "{prefix}/{prd_id}{separator}{feature_name}"
}
// Result: feat/PRD-003-design-system

// GitHub Flow style
{
  "prefix": "",
  "pattern": "{prd_id}{separator}{feature_name}"
}
// Result: PRD-003-design-system

// GitLab style
{
  "prefix": "feature",
  "pattern": "{prefix}/{feature_name}"
}
// Result: feature/design-system

// Custom with PRD ID in path
{
  "prefix": "feature",
  "pattern": "{prefix}/{prd_id}/{feature_name}"
}
// Result: feature/PRD-003/design-system
```

---

#### Worktree

**Purpose**: Configure Git worktree behavior for parallel development

```json
{
  "prd_workflow": {
    "worktree": {
      "enabled": true,
      "parent_directory": "..",
      "naming_pattern": "{project}-{feature}",
      "auto_install_dependencies": true,
      "auto_open_editor": false
    }
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable worktree creation |
| `parent_directory` | string | `".."` | Where to create worktrees |
| `naming_pattern` | string | `"{project}-{feature}"` | Worktree directory naming |
| `auto_install_dependencies` | boolean | `true` | Run `npm install` in worktree |
| `auto_open_editor` | boolean | `false` | Open editor in worktree |

**Naming Pattern Variables**:
- `{project}`: Project name from package.json or repo name
- `{feature}`: Feature name (slug)
- `{prd_id}`: PRD ID (e.g., PRD-003)
- `{branch}`: Full branch name

**Examples**:
```json
// Simple
{ "naming_pattern": "{feature}" }
// Result: ../design-system/

// With PRD ID
{ "naming_pattern": "{prd_id}-{feature}" }
// Result: ../PRD-003-design-system/

// In subdirectory
{
  "parent_directory": "../worktrees",
  "naming_pattern": "{feature}"
}
// Result: ../worktrees/design-system/
```

---

#### GitHub Integration

**Purpose**: Auto-create GitHub issues from approved PRDs

```json
{
  "prd_workflow": {
    "github": {
      "enabled": true,
      "create_issue_on_approval": true,
      "issue_labels": ["PRD", "P0", "P1", "P2"],
      "auto_assign": true,
      "milestone_tracking": true
    }
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable GitHub integration |
| `create_issue_on_approval` | boolean | `true` | Auto-create issue when PRD approved |
| `issue_labels` | array | `["PRD", ...]` | Labels to apply |
| `auto_assign` | boolean | `true` | Assign issue to PR creator |
| `milestone_tracking` | boolean | `true` | Link issues to milestones |

**Requirements**:
- GitHub CLI (`gh`) installed
- Authenticated: `gh auth login`

---

#### Review

**Purpose**: Configure PRD review process

```json
{
  "prd_workflow": {
    "review": {
      "dimensions": [
        "Clarity & Scope",
        "Technical Feasibility",
        "User Experience",
        "Dependencies & Blockers",
        "Acceptance Criteria",
        "Risk Assessment",
        "Simplification Opportunities"
      ],
      "grading_enabled": true,
      "minimum_grade": "C",
      "require_approval": true,
      "calibration_questions": true
    }
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dimensions` | array | (7 dimensions) | Review dimensions to analyze |
| `grading_enabled` | boolean | `true` | Enable A-F grading |
| `minimum_grade` | string | `"C"` | Min grade to approve PRD |
| `require_approval` | boolean | `true` | Require explicit approval |
| `calibration_questions` | boolean | `true` | Ask calibration questions |

**Grading Scale**:
- **A** (90-100%): Excellent, ready for development
- **B** (80-89%): Good, minor improvements
- **C** (70-79%): Acceptable, needs work
- **D** (60-69%): Poor, major gaps
- **F** (<60%): Failing, rewrite needed

**Custom Dimensions**:
```json
{
  "dimensions": [
    "Business Value",
    "Technical Debt Impact",
    "Customer Impact",
    "Regulatory Compliance"
  ]
}
```

---

#### Work Plan

**Purpose**: Configure WORK_PLAN.md tracking

```json
{
  "prd_workflow": {
    "work_plan": {
      "enabled": true,
      "file_path": "product/WORK_PLAN.md",
      "update_on_status_change": true,
      "track_decisions": true
    }
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable WORK_PLAN.md tracking |
| `file_path` | string | `"product/WORK_PLAN.md"` | Path to work plan file |
| `update_on_status_change` | boolean | `true` | Auto-update when PRD moves |
| `track_decisions` | boolean | `true` | Log technical decisions |

---

### 2. Security

**Purpose**: Configure security scanning behavior

```json
{
  "security": {
    "enabled": true,
    "auto_scan_on_commit": false,
    "scan_dependencies": true,
    "scan_code": true,
    "fail_on_high_severity": true,
    "ignore_patterns": [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**"
    ],
    "tools": {
      "npm_audit": true,
      "eslint_security": true,
      "git_secrets": false
    }
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable security features |
| `auto_scan_on_commit` | boolean | `false` | Scan before every commit |
| `scan_dependencies` | boolean | `true` | Check npm/yarn for CVEs |
| `scan_code` | boolean | `true` | Static code analysis |
| `fail_on_high_severity` | boolean | `true` | Block on high/critical |
| `ignore_patterns` | array | (common excludes) | Paths to skip |

**Tools**:
- `npm_audit`: Use `npm audit` for dependency scanning
- `eslint_security`: Use ESLint security plugin
- `git_secrets`: Scan for secrets in commits

---

### 3. Quality

**Purpose**: Configure code quality standards

```json
{
  "quality": {
    "enabled": true,
    "auto_format_on_save": false,
    "linting": {
      "enabled": true,
      "auto_fix": false,
      "fail_on_error": false
    },
    "testing": {
      "enabled": true,
      "auto_run": false,
      "coverage_threshold": 80,
      "required_for_pr": true
    },
    "code_complexity": {
      "enabled": true,
      "max_complexity": 15,
      "warn_threshold": 10
    }
  }
}
```

**Coverage Thresholds**:
- **Startup**: 70%
- **Standard**: 80%
- **Enterprise**: 90%

---

### 4. Orchestration

**Purpose**: Configure multi-PRD workflow coordination

```json
{
  "orchestration": {
    "enabled": true,
    "parallel_features": 3,
    "dependency_resolution": true,
    "auto_merge_strategy": "squash",
    "conflict_resolution": "manual"
  }
}
```

**Options**:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable orchestration |
| `parallel_features` | number | `3` | Max concurrent worktrees |
| `dependency_resolution` | boolean | `true` | Auto-detect dependencies |
| `auto_merge_strategy` | string | `"squash"` | Merge strategy |
| `conflict_resolution` | string | `"manual"` | How to handle conflicts |

**Merge Strategies**:
- `squash`: Squash all commits (clean history)
- `merge`: Regular merge (preserves commits)
- `rebase`: Rebase then merge (linear history)

**Conflict Resolution**:
- `manual`: User resolves (recommended)
- `auto`: Attempt automatic resolution (risky)

---

### 5. Agents

**Purpose**: Configure AI agent behavior

```json
{
  "agents": {
    "prd_reviewer": {
      "enabled": true,
      "auto_invoke": false,
      "strictness": "balanced"
    },
    "prd_implementer": {
      "enabled": true,
      "task_breakdown_granularity": "medium"
    },
    "orchestrator": {
      "enabled": true,
      "coordination_mode": "smart"
    },
    "security_expert": {
      "enabled": true,
      "scan_frequency": "on_demand"
    },
    "quality_assurance": {
      "enabled": true,
      "check_frequency": "on_pr"
    },
    "devops_engineer": {
      "enabled": false,
      "auto_setup_ci": false
    }
  }
}
```

**Agent-Specific Options**:

#### prd_reviewer
- `strictness`: `"lenient"` | `"balanced"` | `"strict"`

#### prd_implementer
- `task_breakdown_granularity`: `"fine"` | `"medium"` | `"coarse"`

#### orchestrator
- `coordination_mode`: `"simple"` | `"smart"` | `"advanced"`

#### security_expert
- `scan_frequency`: `"on_demand"` | `"on_commit"` | `"daily"`

#### quality_assurance
- `check_frequency`: `"on_demand"` | `"on_commit"` | `"on_pr"`

---

### 6. Notifications (Future)

```json
{
  "notifications": {
    "enabled": false,
    "slack": {
      "enabled": false,
      "webhook_url": ""
    },
    "email": {
      "enabled": false,
      "smtp_server": "",
      "from": ""
    }
  }
}
```

---

## Environment Variables

Override config via environment variables:

```bash
# PRD directories
export PRD_DRAFT_DIR="docs/prds/draft"
export PRD_READY_DIR="docs/prds/ready"

# Worktree
export PRD_WORKTREE_ENABLED="false"

# Security
export PRD_SECURITY_FAIL_ON_HIGH="false"

# Quality
export PRD_TEST_COVERAGE_THRESHOLD="90"
```

**Format**: `PRD_<SECTION>_<KEY>=<value>`

---

## Validation

### Validate Config

```bash
# Check if config is valid JSON
cat .claude/config.json | jq .

# Validate against schema
npx ajv validate -s config/schema.json -d .claude/config.json
```

### Common Errors

**Error**: `SyntaxError: Unexpected token`
- **Cause**: Invalid JSON (trailing comma, missing quote)
- **Fix**: Use JSON validator

**Error**: `Config validation failed`
- **Cause**: Invalid value (e.g., `parallel_features: -1`)
- **Fix**: Check schema.json for allowed values

---

## Best Practices

### 1. Start with Preset

Choose a preset close to your needs, then customize:
```bash
cp config/presets/startup.json .claude/config.json
# Edit .claude/config.json
```

### 2. Version Control

**Commit** `.claude/config.json` to share with team:
```bash
git add .claude/config.json
git commit -m "chore: Add PRD workflow config"
```

### 3. Document Overrides

Add comments (via separate file):
```bash
# .claude/config-notes.md
## Custom Configuration

- Disabled worktrees: Team prefers single branch workflow
- Coverage threshold 90%: Enterprise requirement
- Strict PRD review: Product team requirement
```

### 4. Periodic Review

Review config quarterly:
- Remove unused features
- Adjust thresholds based on team velocity
- Update patterns based on learnings

---

## Troubleshooting

**Config not loading?**
- Check file location: `.claude/config.json` in project root
- Validate JSON syntax
- Restart Claude Code

**Worktrees not working?**
- Verify Git v2.25+: `git --version`
- Check `worktree.enabled: true`
- Ensure parent directory exists

**GitHub integration failing?**
- Install GitHub CLI: `gh auth login`
- Check `github.enabled: true`
- Verify repository has remote

---

## Examples

See [examples/](examples/) for full configurations:
- [AcmeCorp Setup](examples/acmecorp-setup.md)
- [SaaS Startup](examples/saas-startup.md)
- [Enterprise](examples/enterprise.md)

---

**Next**: [Commands Reference](commands-reference.md)
