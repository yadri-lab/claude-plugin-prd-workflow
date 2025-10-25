# Smart Pull Request

AI-powered pull request creation with automatic summary and description generation.

**Module**: Git (standalone, works without PRDs)
**Usage**: Lightweight projects, open source contributions, quick PRs

---

## Instructions

You are tasked with creating an intelligent pull request with a clear summary, description, and testing checklist.

### Steps

1. **Verify Git state**:
   ```bash
   git status
   git branch --show-current
   ```

   Requirements:
   - Must be on a feature branch (not main/master)
   - Branch should have commits
   - Optionally: branch should be pushed to remote

2. **Analyze commits** since branch diverged from main:
   ```bash
   # Get base branch (main or master)
   BASE_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')

   # Get all commits in this branch
   git log $BASE_BRANCH..HEAD --oneline

   # Get diff summary
   git diff $BASE_BRANCH...HEAD --stat

   # Get full diff for analysis
   git diff $BASE_BRANCH...HEAD
   ```

3. **Generate PR content**:

   **Title**: Clear, concise (50-72 chars)
   - Use conventional commit format: `<type>: <description>`
   - Examples:
     - `feat: Add user authentication with OAuth2`
     - `fix: Resolve memory leak in data processing`
     - `docs: Update API documentation with new endpoints`

   **Summary**: 2-4 bullet points of main changes

   **Description**: Include:
   - What changed and why
   - Implementation approach
   - Any design decisions made
   - Breaking changes (if any)
   - Screenshots/demos (if UI changes)

   **Test Plan**: Checklist of how to test the changes

4. **Push branch if needed**:
   ```bash
   # Check if branch is pushed
   git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null

   # If not pushed:
   git push -u origin HEAD
   ```

5. **Create PR using GitHub CLI**:
   ```bash
   gh pr create \
     --title "PR Title" \
     --body "$(cat <<'EOF'
   ## Summary
   - Main change 1
   - Main change 2
   - Main change 3

   ## Description

   [Detailed description]

   ## Test Plan

   - [ ] Test step 1
   - [ ] Test step 2
   - [ ] Test step 3

   ## Related Issues

   Closes #123

   ---

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

6. **Return PR URL** to user

### Example Output

#### Example 1: New Feature PR

```
✅ Pull Request Created!

Title: feat: Add dark mode support across all pages

URL: https://github.com/user/repo/pull/42

Summary:
- Implemented dark mode theming system
- Added theme toggle component in header
- Persisted theme preference to localStorage
- Updated all components to support both themes

Changes: 23 files changed, 847 insertions(+), 123 deletions(-)
```

#### Example 2: Bug Fix PR

```
✅ Pull Request Created!

Title: fix: Correct timezone handling in date formatter

URL: https://github.com/user/repo/pull/87

Summary:
- Fixed timezone bug causing incorrect date display
- Added tests for timezone edge cases
- Updated documentation with timezone handling notes

Changes: 3 files changed, 45 insertions(+), 12 deletions(-)
```

### Generated PR Template

```markdown
## Summary

- Bullet point summary of main changes
- Keep it concise and scannable
- Focus on user-visible or high-level changes

## Description

### What changed?

[Detailed explanation of the changes]

### Why?

[Rationale and context for the changes]

### How?

[Implementation approach and key decisions]

### Breaking Changes

[If any, list breaking changes and migration path]

## Screenshots/Demo

[If UI changes, include before/after screenshots or demo GIF]

## Test Plan

Manually tested:
- [ ] Feature works as expected
- [ ] No regressions in existing functionality
- [ ] Error cases handled properly
- [ ] UI is responsive (if applicable)
- [ ] Works across browsers (if web app)

Automated tests:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)

## Related Issues

Closes #123
Relates to #456

## Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
- [ ] No console warnings/errors
- [ ] Reviewed own code changes

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Configuration

Respects `git.smart_pr` configuration:

```json
{
  "git": {
    "smart_pr": {
      "enabled": true,
      "ai_summary_generation": true,
      "auto_link_issues": true,
      "template": "default"
    }
  }
}
```

### Options

User can provide context:

```
/smart-pr
/smart-pr This PR adds the new payment integration
/smart-pr [closes: #42, #43] Fixes login and signup bugs
```

### Error Handling

- **Not on feature branch**: "Create a feature branch first. You're on main/master."
- **No commits**: "No commits to create PR from. Make commits first."
- **Not pushed**: "Branch not pushed. Push first? (Will do automatically)"
- **PR already exists**: "PR already exists: [URL]"
- **GitHub CLI not available**: "Install GitHub CLI: https://cli.github.com/"

### Best Practices

- ✅ Clear, descriptive title
- ✅ Structured summary and description
- ✅ Comprehensive test plan
- ✅ Links to related issues
- ✅ Screenshots for UI changes
- ✅ Breaking changes highlighted
- ✅ Checklist for reviewers

### Integration

Works seamlessly with:
- **Conventional Commits**: Parses commit messages to generate PR title
- **Issue Linking**: Auto-detects issue references in commits
- **Semantic Release**: Compatible with semantic versioning
- **GitHub Actions**: Can trigger CI/CD workflows

---

## Related Commands

- `/smart-commit` - Create intelligent commit with AI-generated message
- `/quality-check` - Run quality checks before creating PR
- `/security-audit` - Run security scan before creating PR

---

**Plugin**: claude-prd-workflow
**Category**: Git Workflow (Standalone)
**Version**: 2.0.0
**Requires**: Git 2.0+, GitHub CLI (gh)
