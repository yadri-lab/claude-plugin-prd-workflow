# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of PRD Workflow Manager seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues. This helps protect users while a fix is being developed.

### 2. Report Privately

Report security vulnerabilities by opening a **private security advisory**:

1. Go to the [Security tab](https://github.com/Yassinello/claude-prd-workflow/security)
2. Click "Report a vulnerability"
3. Fill out the advisory form with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

Alternatively, you can:
- Open a GitHub Discussion marked as "Security"
- Create an issue with the label `security` (for non-critical issues only)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - **Critical**: 1-3 days
  - **High**: 1-2 weeks
  - **Medium**: 2-4 weeks
  - **Low**: Next regular release

### 4. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will confirm the vulnerability and determine its severity
- We will release a fix as soon as possible
- We will publicly disclose the vulnerability after a fix is released
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using PRD Workflow Manager:

### Configuration Security

**1. Never commit secrets**
```bash
# ❌ DON'T
{
  "github": {
    "token": "ghp_your_token_here"  // Never hardcode tokens!
  }
}

# ✅ DO
{
  "github": {
    "token": "${GITHUB_TOKEN}"  // Use environment variables
  }
}
```

**2. Use `.gitignore`**
```gitignore
# Always ignore sensitive config
.claude/config.json
.env
.env.local
*.key
*.pem
```

**3. Rotate tokens regularly**
- GitHub tokens: Every 90 days
- API keys: Every 60 days
- Webhooks: After each project

### Command Security

**Security Audit** (`/security-audit`):
- Runs automatically on commits (enterprise preset)
- Scans for:
  - Dependency vulnerabilities
  - Hardcoded secrets
  - OWASP Top 10 violations
  - Insecure code patterns

**Always run before PR**:
```bash
/security-audit
# Must pass with 0 high-severity issues
```

### Git Worktree Security

When using Git worktrees:

**1. Isolate credentials**
```bash
# Each worktree should have its own .env
../project-feature-a/.env  # Separate credentials
../project-feature-b/.env  # Separate credentials
```

**2. Clean up worktrees**
```bash
# Remove worktrees when done
git worktree remove ../project-feature-a
```

**3. Don't share worktrees**
- Each developer should have their own worktrees
- Don't commit worktree paths to version control

## Known Security Considerations

### Git Worktrees & File Permissions

**Issue**: Git worktrees may inherit parent directory permissions

**Mitigation**:
- Set proper permissions on worktree directories
- Use `umask 077` for sensitive projects
- Review `.git/worktrees/` permissions

### Configuration File Security

**Issue**: `.claude/config.json` may contain sensitive settings

**Mitigation**:
- Always add `.claude/config.json` to `.gitignore`
- Use environment variables for secrets
- Review config files before committing

### Third-Party Integrations

**Issue**: MCP servers and integrations may have their own security considerations

**Mitigation**:
- Only use trusted MCP servers
- Review MCP server permissions
- Keep MCP servers updated
- Use least-privilege access

## Security Features

PRD Workflow Manager includes built-in security features:

### 1. Automated Security Scans
- **npm/yarn audit**: Dependency vulnerability scanning
- **git-secrets**: Prevents committing credentials
- **ESLint Security**: Detects insecure code patterns
- **OWASP Top 10**: Checks for common vulnerabilities

### 2. Quality Gates
- Blocks PR merge if security issues found
- Requires 0 high-severity issues
- Configurable thresholds

### 3. Audit Logging
- All security scans are logged
- Results stored in `.claude/security-audit-*.json`
- Review logs regularly

## Vulnerability Disclosure

When we fix a security vulnerability:

1. **Private Fix**: Develop fix in private
2. **Release**: Deploy patched version
3. **Advisory**: Publish security advisory
4. **Credit**: Credit the reporter (if they agree)
5. **Notification**: Notify users via GitHub Releases

## Security Hall of Fame

We recognize security researchers who responsibly disclose vulnerabilities:

- *No vulnerabilities reported yet*

Thank you for helping keep PRD Workflow Manager secure! 🔒

---

**Last Updated**: 2025-10-25
**Version**: 1.0.0
