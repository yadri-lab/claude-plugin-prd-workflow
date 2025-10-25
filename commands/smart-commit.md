# Smart Commit

AI-powered Git commit with automatic message generation following best practices.

**Module**: Git (standalone, works without PRDs)
**Usage**: Lightweight projects, quick commits, side projects

---

## Instructions

You are tasked with creating an intelligent Git commit that follows best practices and generates a clear, meaningful commit message.

### Steps

1. **Analyze current changes**:
   ```bash
   git status
   git diff --staged
   ```

   If nothing staged, show:
   ```bash
   git diff
   ```

2. **Understand the changes**:
   - What files were modified?
   - What is the nature of the changes? (feat, fix, docs, refactor, style, test, chore)
   - What is the scope? (component, module, file)
   - Are there breaking changes?

3. **Generate commit message** following [Conventional Commits](https://www.conventionalcommits.org/):

   ```
   <type>(<scope>): <description>

   [optional body]

   [optional footer]
   ```

   **Types**:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Formatting, whitespace, etc.
   - `refactor`: Code restructuring
   - `perf`: Performance improvements
   - `test`: Adding or updating tests
   - `build`: Build system or dependencies
   - `ci`: CI/CD changes
   - `chore`: Maintenance tasks

   **Guidelines**:
   - Use imperative mood ("add" not "added")
   - Keep first line under 72 characters
   - Be specific and clear
   - Focus on "why" not "what" in the body
   - Reference issues if applicable (#123)

4. **Show proposed commit message** to user for confirmation

5. **Stage files if needed**:
   ```bash
   # If not all changes staged, ask user:
   # "Stage all changes? (y/n)"
   # If yes:
   git add .
   ```

6. **Create the commit**:
   ```bash
   git commit -m "$(cat <<'EOF'
   <generated commit message>
   EOF
   )"
   ```

7. **Confirm success**:
   ```bash
   git log -1 --oneline
   ```

### Examples

#### Example 1: Feature Addition

Changes detected:
- `src/components/UserProfile.tsx`: New file
- `src/pages/profile.tsx`: Modified to use new component

Generated commit:
```
feat(profile): Add UserProfile component with avatar support

- Create reusable UserProfile component
- Add avatar upload and preview functionality
- Integrate component into profile page
- Add unit tests for UserProfile

Closes #42
```

#### Example 2: Bug Fix

Changes detected:
- `src/utils/formatDate.ts`: Fix timezone handling

Generated commit:
```
fix(utils): Correct timezone handling in formatDate

Previously formatDate() was using local timezone instead of UTC,
causing dates to display incorrectly for users in different timezones.

Now explicitly converts to UTC before formatting.

Fixes #87
```

#### Example 3: Documentation

Changes detected:
- `README.md`: Updated installation instructions

Generated commit:
```
docs(readme): Update installation instructions for v2.0

- Add prerequisites section
- Include troubleshooting steps
- Update examples for new API
```

### Configuration

The command respects `git.smart_commit` configuration:

```json
{
  "git": {
    "smart_commit": {
      "enabled": true,
      "ai_message_generation": true,
      "conventional_commits": true,
      "emoji": false
    }
  }
}
```

### Options

User can provide hints or context:

```
/smart-commit This fixes the login bug
/smart-commit Add new payment integration
/smart-commit [type: docs] Update API documentation
```

### Error Handling

- **No changes**: "No changes to commit. Make changes and try again."
- **Merge conflict**: "Resolve merge conflicts before committing."
- **Detached HEAD**: "Warning: You're in detached HEAD state. Create a branch first?"

### Best Practices Applied

- ✅ Conventional Commits format
- ✅ Clear, concise messages
- ✅ Proper type and scope
- ✅ Reference to issues/PRs when applicable
- ✅ Breaking changes flagged with `!` or `BREAKING CHANGE:`
- ✅ Multi-line messages for complex changes

---

## Related Commands

- `/smart-pr` - Create pull request with AI-generated description
- `/plugin-version` - Check plugin version
- `/quality-check` - Run quality checks before committing

---

**Plugin**: claude-prd-workflow
**Category**: Git Workflow (Standalone)
**Version**: 2.0.0
**Requires**: Git 2.0+
