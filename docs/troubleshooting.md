# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Plugin Not Loading

**Symptoms**: Commands like `/list-prds` not recognized

**Solutions**:

1. **Verify installation location**
   ```bash
   ls ~/.claude-code/plugins/claude-prd-workflow
   # Should show: commands/, agents/, config/, etc.
   ```

2. **Check plugin.json exists**
   ```bash
   cat ~/.claude-code/plugins/claude-prd-workflow/.claude-plugin/plugin.json
   ```

3. **Restart Claude Code completely**
   - Quit Claude Code (not just close window)
   - Reopen

4. **Check Claude Code version**
   ```bash
   claude --version  # Should be >=2.0.0
   ```

---

### Configuration Not Loading

**Symptoms**: Using default config despite custom `.claude/config.json`

**Solutions**:

1. **Verify config location**
   ```bash
   # Must be in PROJECT root, not plugin directory
   ls .claude/config.json  # From your project root
   ```

2. **Validate JSON syntax**
   ```bash
   cat .claude/config.json | jq .
   # If error: fix JSON syntax (trailing commas, quotes, etc.)
   ```

3. **Check schema validation**
   ```bash
   # Compare against schema
   cat config/schema.json
   ```

4. **Use preset as starting point**
   ```bash
   cp config/presets/startup.json .claude/config.json
   ```

---

## Command Issues

### `/review-prd` Finds No PRDs

**Symptoms**: "No PRDs found in 01-draft/"

**Solutions**:

1. **Check directory exists**
   ```bash
   ls product/prds/01-draft/
   ```

2. **Create directory structure**
   ```bash
   mkdir -p product/prds/{01-draft,02-review,03-ready,04-in-progress,05-complete,99-archived}
   ```

3. **Verify PRD file format**
   - Must be `.md` file
   - Must be in correct directory
   ```bash
   # Create test PRD
   cp templates/prd-template.md product/prds/01-draft/test-prd.md
   ```

4. **Check config paths**
   ```json
   {
     "prd_workflow": {
       "directories": {
         "draft": "product/prds/01-draft"  // Must match actual path
       }
     }
   }
   ```

---

### `/code-prd` Worktree Creation Fails

**Symptoms**: Error creating worktree

**Solutions**:

1. **Check Git version**
   ```bash
   git --version  # Must be >=2.25
   ```

2. **Verify branch doesn't exist**
   ```bash
   git branch --list feat/PRD-*
   # If exists, delete: git branch -D feat/PRD-003
   ```

3. **Check parent directory exists**
   ```bash
   ls ..  # Parent directory must exist
   ```

4. **Ensure on main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

5. **Manual worktree creation**
   ```bash
   git worktree add ../project-feature feat/PRD-003-feature
   ```

6. **Disable worktrees if needed**
   ```json
   {
     "prd_workflow": {
       "worktree": {
         "enabled": false
       }
     }
   }
   ```

---

### `/work-prd` Can't Detect Active PRD

**Symptoms**: "No active PRD detected"

**Solutions**:

1. **Check current branch name**
   ```bash
   git branch --show-current
   # Should be feat/PRD-XXX-feature-name
   ```

2. **Check PRD exists in 04-in-progress/**
   ```bash
   ls product/prds/04-in-progress/
   ```

3. **Extract PRD ID from branch**
   - Branch must contain PRD ID (e.g., `PRD-003`)
   - Format: `feat/PRD-003-design-system`

4. **Manually specify PRD**
   ```
   /work-prd PRD-003
   ```

---

## Git Worktree Issues

### Can't Remove Worktree

**Symptoms**: `git worktree remove` fails

**Solutions**:

1. **Check if worktree has uncommitted changes**
   ```bash
   cd ../worktree-directory
   git status
   # If changes exist, commit or stash them
   ```

2. **Force remove**
   ```bash
   git worktree remove ../worktree-directory --force
   ```

3. **Clean up manually**
   ```bash
   rm -rf ../worktree-directory
   git worktree prune
   ```

---

### Multiple Worktrees Confusing

**Symptoms**: Forgot which worktree is which

**Solutions**:

1. **List all worktrees**
   ```bash
   git worktree list
   ```

2. **Check current worktree**
   ```bash
   git rev-parse --show-toplevel  # Shows worktree path
   git branch --show-current      # Shows branch
   ```

3. **Use clear naming**
   ```json
   {
     "worktree": {
       "naming_pattern": "{prd_id}-{feature}"
     }
   }
   ```

---

## Security & Quality Issues

### `/security-audit` Fails

**Symptoms**: Security scan errors

**Solutions**:

1. **Check npm/yarn installed**
   ```bash
   npm --version
   yarn --version
   ```

2. **Install dependencies**
   ```bash
   npm install  # Or yarn install
   ```

3. **Check for lock file**
   ```bash
   ls package-lock.json  # npm
   ls yarn.lock          # yarn
   ```

4. **Skip dependency scan if needed**
   ```json
   {
     "security": {
       "scan_dependencies": false
     }
   }
   ```

---

### `/quality-check` Linting Fails

**Symptoms**: ESLint errors

**Solutions**:

1. **Check ESLint installed**
   ```bash
   npx eslint --version
   ```

2. **Install ESLint**
   ```bash
   npm install --save-dev eslint
   ```

3. **Create .eslintrc.json**
   ```bash
   npx eslint --init
   ```

4. **Skip linting if needed**
   ```json
   {
     "quality": {
       "linting": {
         "enabled": false
       }
     }
   }
   ```

---

## GitHub Integration Issues

### Can't Create GitHub Issue

**Symptoms**: GitHub issue creation fails

**Solutions**:

1. **Check GitHub CLI installed**
   ```bash
   gh --version
   ```

2. **Install GitHub CLI**
   ```bash
   # macOS
   brew install gh

   # Windows
   winget install GitHub.cli

   # Linux
   sudo apt install gh
   ```

3. **Authenticate**
   ```bash
   gh auth login
   ```

4. **Verify repo has remote**
   ```bash
   git remote -v
   # Should show GitHub URL
   ```

5. **Disable GitHub integration**
   ```json
   {
     "prd_workflow": {
       "github": {
         "enabled": false
       }
     }
   }
   ```

---

## Performance Issues

### Commands Running Slow

**Symptoms**: Commands take >30 seconds

**Solutions**:

1. **Check PRD directory size**
   ```bash
   du -sh product/prds/
   # If >100MB, archive old PRDs
   ```

2. **Archive old PRDs**
   ```bash
   /archive-prd
   # Select old completed PRDs
   ```

3. **Exclude large directories**
   ```json
   {
     "security": {
       "ignore_patterns": [
         "**/node_modules/**",
         "**/dist/**",
         "**/build/**"
       ]
     }
   }
   ```

4. **Reduce parallel features**
   ```json
   {
     "orchestration": {
       "parallel_features": 2  // Down from 3
     }
   }
   ```

---

## Common Error Messages

### "PRD ID not found"

**Cause**: PRD ID format doesn't match config

**Solution**: Check PRD ID format in PRD file matches config
```json
{
  "prd_workflow": {
    "branch_naming": {
      "prd_id_format": "PRD-{number}"  // Must match **PRD ID**: PRD-003
    }
  }
}
```

---

### "Branch already exists"

**Cause**: Feature branch wasn't deleted after previous work

**Solution**:
```bash
# Delete local branch
git branch -D feat/PRD-003-feature

# Delete remote branch
git push origin --delete feat/PRD-003-feature
```

---

### "Not a git repository"

**Cause**: Running commands outside git repo

**Solution**:
```bash
# Initialize git if needed
git init

# Or cd to git repo
cd /path/to/git/repo
```

---

### "Permission denied"

**Cause**: File permissions issue

**Solution**:
```bash
# Fix permissions
chmod -R u+w product/prds/

# Or run with sudo (not recommended)
sudo /command
```

---

## Reset & Clean Up

### Complete Reset

If everything is broken, start fresh:

```bash
# 1. Backup existing PRDs
cp -r product/prds ~/prds-backup

# 2. Remove all worktrees
git worktree list | grep -v 'main' | awk '{print $1}' | xargs -I {} git worktree remove {}
git worktree prune

# 3. Delete all feature branches
git branch | grep 'feat/' | xargs git branch -D

# 4. Reset config
cp config/default-config.json .claude/config.json

# 5. Recreate PRD directories
rm -rf product/prds
mkdir -p product/prds/{01-draft,02-review,03-ready,04-in-progress,05-complete,99-archived}

# 6. Restore PRDs
cp ~/prds-backup/* product/prds/01-draft/

# 7. Restart Claude Code
```

---

### Clean Up Worktrees

Remove all stale worktrees:

```bash
# List all worktrees
git worktree list

# Remove each worktree
git worktree remove ../worktree-name

# Prune deleted worktrees
git worktree prune

# Verify cleanup
git worktree list  # Should only show main repo
```

---

### Clean Up Branches

Remove all feature branches:

```bash
# Delete local branches
git branch | grep 'feat/' | xargs git branch -D

# Delete remote branches
git branch -r | grep 'origin/feat/' | sed 's/origin\///' | xargs -I {} git push origin --delete {}

# Fetch latest
git fetch --prune
```

---

## Getting Help

### Before Asking for Help

1. **Check this guide** (you're here!)
2. **Search existing issues**: [GitHub Issues](https://github.com/Yassinello/claude-prd-workflow/issues)
3. **Read documentation**: [Docs](.)

### When Asking for Help

Include:
- **Claude Code version**: `claude --version`
- **Plugin version**: Check `.claude-plugin/plugin.json`
- **Git version**: `git --version`
- **Operating system**: macOS/Windows/Linux
- **Error message**: Full error text
- **Steps to reproduce**: What did you do?
- **Config**: Relevant sections of `.claude/config.json`

### Where to Get Help

- **GitHub Discussions**: [Ask questions](https://github.com/Yassinello/claude-prd-workflow/discussions)
- **GitHub Issues**: [Report bugs](https://github.com/Yassinello/claude-prd-workflow/issues)
- **Email**: yassine@watchora.com

---

## Known Issues

### Issue: Large PRD Files (>1MB) Slow to Process

**Status**: Known limitation
**Workaround**: Split large PRDs into multiple smaller PRDs
**Fix**: Planned for v1.1

### Issue: Windows Git Bash Path Issues

**Status**: Known limitation
**Workaround**: Use forward slashes in config
```json
{
  "worktree": {
    "parent_directory": "../worktrees"  // Not "..\worktrees"
  }
}
```
**Fix**: Planned for v1.1

---

## Debug Mode

Enable verbose logging:

```bash
# Set environment variable
export PRD_DEBUG=1

# Run command
/review-prd

# Check logs
tail -f ~/.claude-code/logs/prd-workflow.log
```

---

**Still stuck?** [Open an issue](https://github.com/Yassinello/claude-prd-workflow/issues/new)
