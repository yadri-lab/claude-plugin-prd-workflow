# Getting Started with PRD Workflow Manager

Welcome! This guide will get you up and running with PRD Workflow Manager in 15 minutes.

## Prerequisites

Before starting, make sure you have:
- ✅ Claude Code v2.0.0 or higher
- ✅ Git v2.25+ (for worktree support)
- ✅ A code editor (VS Code, Cursor, etc.)

## Quick Setup (5 minutes)

### Step 1: Install the Plugin

**Option A: Clone from GitHub**
```bash
# Navigate to Claude Code plugins directory
cd ~/.claude-code/plugins  # macOS/Linux
# or
cd %USERPROFILE%\.claude-code\plugins  # Windows

# Clone the plugin
git clone https://github.com/Yassinello/claude-prd-workflow.git
```

**Option B: Download ZIP**
1. Download from [GitHub Releases](https://github.com/Yassinello/claude-prd-workflow/releases)
2. Extract to `~/.claude-code/plugins/claude-prd-workflow`

### Step 2: Restart Claude Code

Close and reopen Claude Code to load the plugin.

### Step 3: Verify Installation

In Claude Code, type:
```
/list-prds
```

If you see a response (even if no PRDs exist), the plugin is installed! ✅

---

## Initial Configuration (5 minutes)

### Choose a Preset

We provide 3 preset configurations:

**1. Startup** (Fast-moving, lean)
```bash
cp config/presets/startup.json .claude/config.json
```

**2. Enterprise** (Strict processes)
```bash
cp config/presets/enterprise.json .claude/config.json
```

**3. Open Source** (Community-focused)
```bash
cp config/presets/open-source.json .claude/config.json
```

### Or Use Default
```bash
cp config/default-config.json .claude/config.json
```

### Create PRD Directory Structure

```bash
mkdir -p product/prds/{01-draft,02-review,03-ready,04-in-progress,05-complete,99-archived}
```

**Result**:
```
product/
└── prds/
    ├── 01-draft/
    ├── 02-review/
    ├── 03-ready/
    ├── 04-in-progress/
    ├── 05-complete/
    └── 99-archived/
```

---

## Your First PRD (5 minutes)

### Create a PRD

```
/create-prd
```

Claude will ask you:
- Feature name (e.g., "User Authentication")
- Description
- Priority (P0/P1/P2)
- Target date (optional)

**Output**: A new PRD file in `product/prds/01-draft/`

### Edit the PRD

Open the created file and fill in:
- Problem statement
- Proposed solution
- Acceptance criteria (at minimum)

### Review the PRD

```
/review-prd
```

Claude will:
1. Show you available draft PRDs
2. Ask which one to review
3. Analyze across 7 dimensions
4. Ask calibration questions
5. Generate improvement suggestions
6. Grade the PRD (A-F)

### Approve the PRD

After making improvements, approve it:
```
approve
```

The PRD moves to `03-ready/` and you can start development!

---

## Start Development

### Create Feature Branch + Worktree

```
/code-prd
```

Claude will:
1. List ready PRDs
2. Create feature branch (e.g., `feat/PRD-001-user-auth`)
3. Set up Git worktree in parallel directory
4. Move PRD to `04-in-progress/`
5. Provide development context

### Guided Implementation

In the worktree directory:
```
/work-prd
```

Claude will:
1. Break down the PRD into tasks
2. Guide you step-by-step
3. Validate each task
4. Track progress

### Quality Checks

Before creating PR:
```
/security-audit
/quality-check
```

---

## Common Workflows

### Daily Workflow
```bash
# Morning: Check PRD status
/list-prds

# Work on active PRD
/work-prd

# Before lunch: Push progress
git add . && git commit && git push

# Afternoon: Continue work
/work-prd

# End of day: Quality checks
/security-audit
/quality-check
```

### Weekly Workflow
```bash
# Monday: Review new PRDs
/review-prd

# Tuesday-Thursday: Development
/work-prd

# Friday: Wrap up & plan next week
/list-prds
/orchestrate  # See dependencies
```

---

## Tips for Success

### 1. Keep PRDs Focused
- ✅ One feature per PRD
- ✅ Clear IN vs OUT scope
- ✅ Defer complexity to future versions

### 2. Use Worktrees Effectively
- ✅ One worktree per feature
- ✅ Keep main repo clean
- ✅ Delete worktrees after merge

### 3. Review Before Coding
- ✅ Achieve B+ grade minimum
- ✅ Answer all calibration questions
- ✅ Get stakeholder approval

### 4. Track Progress
- ✅ Use `/work-prd` for guided implementation
- ✅ Commit frequently
- ✅ Update WORK_PLAN.md

### 5. Maintain Quality
- ✅ Run security audit before PR
- ✅ Ensure 80%+ test coverage
- ✅ Fix all high-severity issues

---

## Next Steps

### Learn More
- [Configuration Reference](configuration.md) - Customize the plugin
- [Commands Reference](commands-reference.md) - All available commands
- [Best Practices](best-practices.md) - Proven workflows
- [Examples](examples/) - Real-world setups

### Get Help
- [Troubleshooting Guide](troubleshooting.md)
- [GitHub Discussions](https://github.com/Yassinello/claude-prd-workflow/discussions)
- Email: yassine@watchora.com

---

## FAQ

**Q: Can I use this with existing PRDs?**
A: Yes! Move your PRDs to the appropriate directory (01-draft, 03-ready, etc.) and use `/review-prd` to analyze them.

**Q: Do I have to use worktrees?**
A: No, you can disable worktrees in config. But they're highly recommended for parallel development.

**Q: Can I customize the PRD template?**
A: Yes! Edit `templates/prd-template.md` to match your needs.

**Q: How do I update the plugin?**
A: `cd ~/.claude-code/plugins/claude-prd-workflow && git pull`

**Q: Can I use this for non-software projects?**
A: Yes! The PRD workflow works for any feature-based project.

---

**You're ready! Start with `/create-prd` 🚀**
