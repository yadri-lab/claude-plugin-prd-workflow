---
name: git-workflow
description: Git operations including branching, merging, worktrees, and conflict resolution
category: Development Tools
---

# Git Workflow Skill

Provides Git expertise for common and advanced Git operations including branching strategies, worktrees, merge strategies, and conflict resolution.

## Capabilities

### 1. Branch Management

**Create Feature Branch**:
```bash
# Ensure on main and up-to-date
git checkout main
git pull origin main

# Create and checkout branch
git checkout -b feat/PRD-003-design-system

# Or create without checkout (for worktrees)
git branch feat/PRD-003-design-system
```

**Branch Naming Conventions**:
- `feat/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks
- `docs/*` - Documentation changes
- `refactor/*` - Code refactoring

**List and Manage Branches**:
```bash
# List all branches
git branch --all

# List branches with last commit
git branch -v

# Delete merged branch
git branch -d feat/old-feature

# Force delete unmerged branch
git branch -D feat/abandoned-feature

# Delete remote branch
git push origin --delete feat/old-feature
```

---

### 2. Git Worktree Management

**Why Worktrees?**
- Work on multiple features in parallel without branch switching
- Isolate dependencies per feature
- Run multiple dev servers simultaneously
- Keep clean commit history per feature

**Create Worktree**:
```bash
# Create worktree in parallel directory
git worktree add ../acmecorp-design-system feat/PRD-003-design-system

# Or create new branch in worktree
git worktree add ../acmecorp-new-feature -b feat/new-feature
```

**List Worktrees**:
```bash
git worktree list

# Output:
# /c/Users/user/acmecorp         abc123 [main]
# /c/Users/user/acmecorp-design  def456 [feat/PRD-003-design-system]
# /c/Users/user/acmecorp-rss     ghi789 [feat/PRD-008-rss-monitoring]
```

**Remove Worktree**:
```bash
# After merging PR, clean up worktree
git worktree remove ../acmecorp-design-system

# Or if directory deleted manually
git worktree prune
```

**Navigate Between Worktrees**:
```bash
# Each worktree is independent
cd ../acmecorp-design-system
git status  # Shows feat/PRD-003-design-system branch

cd ../acmecorp-rss
git status  # Shows feat/PRD-008-rss-monitoring branch
```

---

### 3. Commit Best Practices

**Conventional Commits**:
```bash
# Format: <type>(<scope>): <description>
#
# <body>
#
# <footer>

git commit -m "feat(PRD-003): Add Button component

- Implemented Button with variants (primary, secondary, outline)
- Added size props (sm, md, lg)
- Included loading state and icon support
- Achieved 92% test coverage

Closes #42"
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Amend Last Commit**:
```bash
# Fix typo in last commit message
git commit --amend -m "feat(PRD-003): Add Button component (fixed typo)"

# Add forgotten file to last commit
git add forgotten-file.ts
git commit --amend --no-edit
```

---

### 4. Merge Strategies

**Merge (Default)**:
```bash
git checkout main
git merge feat/PRD-003-design-system
# Creates merge commit
```
**Pros**: Preserves full history
**Cons**: Messy history with many branches

**Squash Merge** (Recommended for PRs):
```bash
git checkout main
git merge --squash feat/PRD-003-design-system
git commit -m "feat(PRD-003): Add design system

Complete implementation of design system v1.0
- 8 core components
- TypeScript types
- Storybook documentation
- 87% test coverage

Closes #42"
```
**Pros**: Clean history (one commit per feature)
**Cons**: Loses granular commit history

**Rebase** (For keeping feature branch up-to-date):
```bash
git checkout feat/PRD-003-design-system
git rebase main
# Replay feature commits on top of latest main
```
**Pros**: Linear history
**Cons**: Rewrites history (don't rebase public branches)

**Fast-Forward** (When no divergence):
```bash
git checkout main
git merge --ff-only feat/simple-change
# Only works if main hasn't advanced
```

---

### 5. Conflict Resolution

**When Conflicts Occur**:
```bash
git merge feat/PRD-003-design-system
# Auto-merging src/components/Header.tsx
# CONFLICT (content): Merge conflict in src/components/Header.tsx
```

**Resolve Conflicts**:
```bash
# 1. Check conflicted files
git status

# 2. Open conflicted file
code src/components/Header.tsx

# 3. Look for conflict markers
# <<<<<<< HEAD
# Current branch code
# =======
# Incoming branch code
# >>>>>>> feat/PRD-003-design-system

# 4. Edit to resolve (keep one or merge both)

# 5. Mark as resolved
git add src/components/Header.tsx

# 6. Complete merge
git merge --continue

# Or if rebase
git rebase --continue
```

**Abort Merge/Rebase**:
```bash
# If conflicts too complex, abort
git merge --abort
# or
git rebase --abort
```

**Use Theirs/Ours**:
```bash
# Keep incoming version (theirs)
git checkout --theirs src/components/Header.tsx

# Keep current version (ours)
git checkout --ours src/components/Header.tsx

git add src/components/Header.tsx
git merge --continue
```

---

### 6. Stash Management

**Save Work in Progress**:
```bash
# Stash all changes
git stash

# Stash with message
git stash save "WIP: Button component"

# Stash including untracked files
git stash -u
```

**Apply Stashed Changes**:
```bash
# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Apply and remove from stash
git stash pop
```

**Clear Stashes**:
```bash
# Drop specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```

---

### 7. Cherry-Pick

**Apply Specific Commit from Another Branch**:
```bash
# Get commit hash from other branch
git log feat/other-feature --oneline

# Cherry-pick that commit
git cherry-pick abc1234

# Cherry-pick range
git cherry-pick abc1234..def5678
```

---

### 8. Reset and Revert

**Reset** (Rewrite history - use with caution):
```bash
# Soft reset (keep changes staged)
git reset --soft HEAD~1

# Mixed reset (keep changes unstaged)
git reset HEAD~1

# Hard reset (discard changes)
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard abc1234
```

**Revert** (Create new commit that undoes - safe for public branches):
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert abc1234

# Revert range
git revert abc1234..def5678
```

---

### 9. Interactive Rebase

**Clean Up Commit History**:
```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Editor opens with:
# pick abc1234 feat: Add Button
# pick def5678 fix: Button styling
# pick ghi9012 chore: Lint fixes

# Change to:
# pick abc1234 feat: Add Button
# squash def5678 fix: Button styling
# squash ghi9012 chore: Lint fixes

# Save and close editor
# Result: All 3 commits squashed into one
```

**Commands**:
- `pick`: Keep commit as-is
- `squash`: Combine with previous commit
- `fixup`: Combine with previous, discard message
- `reword`: Change commit message
- `edit`: Stop to amend commit
- `drop`: Remove commit

---

### 10. Remote Management

**Add/Remove Remotes**:
```bash
# Add remote
git remote add upstream https://github.com/original/repo.git

# List remotes
git remote -v

# Remove remote
git remote remove upstream

# Rename remote
git remote rename origin old-origin
```

**Fetch and Pull**:
```bash
# Fetch all remotes
git fetch --all

# Pull with rebase
git pull --rebase origin main

# Pull specific branch
git pull origin feat/other-feature
```

**Push**:
```bash
# Push and set upstream
git push -u origin feat/PRD-003-design-system

# Force push (after rebase)
git push --force-with-lease

# Push all branches
git push --all
```

---

## Common Workflows

### Start New Feature (with Worktree)
```bash
# 1. Ensure main is up-to-date
cd /path/to/main/repo
git checkout main
git pull origin main

# 2. Create branch (without checkout)
git branch feat/PRD-003-design-system

# 3. Create worktree
git worktree add ../project-design-system feat/PRD-003-design-system

# 4. Navigate to worktree
cd ../project-design-system

# 5. Verify
git branch --show-current  # Should show feat/PRD-003-design-system
git status

# 6. Start coding!
```

### Complete Feature (Cleanup Worktree)
```bash
# 1. Push final changes
git push origin feat/PRD-003-design-system

# 2. Create PR (via gh CLI or web)
gh pr create --title "feat(PRD-003): Design System v1.0" --body "..."

# 3. After PR merged, delete branch
git push origin --delete feat/PRD-003-design-system

# 4. Navigate back to main repo
cd ../main-repo

# 5. Remove worktree
git worktree remove ../project-design-system

# 6. Delete local branch
git branch -d feat/PRD-003-design-system

# 7. Update main
git checkout main
git pull origin main
```

### Sync Feature Branch with Main
```bash
# In worktree or feature branch
git fetch origin
git rebase origin/main

# If conflicts, resolve then
git rebase --continue

# Force push (safe with --force-with-lease)
git push --force-with-lease
```

---

## Best Practices

1. **Commit often**: Small, atomic commits are better than large commits
2. **Write good messages**: Explain WHY, not WHAT (code shows what)
3. **Pull before push**: Avoid conflicts by staying up-to-date
4. **Use branches**: Never commit directly to main
5. **Review before push**: Use `git diff` and `git log` to check changes
6. **Protect main**: Set up branch protection rules
7. **Tag releases**: Use semantic versioning (v1.0.0, v1.1.0)

---

## Troubleshooting

**Accidentally committed to wrong branch**:
```bash
# Create new branch with current changes
git branch feat/correct-branch

# Reset current branch (remove commit)
git reset --hard HEAD~1

# Checkout correct branch
git checkout feat/correct-branch
```

**Need to undo last push**:
```bash
# Create revert commit (safe)
git revert HEAD
git push

# Or force push previous commit (dangerous)
git reset --hard HEAD~1
git push --force-with-lease
```

**Corrupted worktree**:
```bash
# Remove and recreate
git worktree remove ../corrupted-worktree --force
git worktree add ../new-worktree feat/branch-name
```

---

## Related

- Commands: `/code-prd` (uses worktree creation)
- Agents: `orchestrator` (uses merge strategies)
