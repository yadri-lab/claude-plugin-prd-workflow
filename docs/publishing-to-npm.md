# Publishing to npm

This guide explains how to publish the claude-prd-workflow plugin to npm.

## Prerequisites

1. **npm account**: Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **Verified email**: Verify your npm email address
3. **Two-factor authentication**: Recommended for security

## First-Time Setup

### 1. Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA enabled)

### 2. Verify Login

```bash
npm whoami
# Should show your npm username
```

## Publishing a New Version

### 1. Update Version Number

Edit `package.json`:
```json
{
  "version": "1.0.1"  // Increment version
}
```

Or use npm version:
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

### 2. Update CHANGELOG.md

Add release notes for the new version.

### 3. Test Package Locally

```bash
# Test installation script
node install.js

# Or test the full package
npm pack
# This creates claude-prd-workflow-1.0.1.tgz
# Test with: npm install -g ./claude-prd-workflow-1.0.1.tgz
```

### 4. Publish to npm

```bash
# Dry run (see what would be published)
npm publish --dry-run

# Publish for real
npm publish
```

### 5. Verify Publication

```bash
# Check on npm
npm view claude-prd-workflow

# Test installation
npm install -g claude-prd-workflow
```

### 6. Create Git Tag

```bash
# Tag the release
git tag v1.0.1
git push origin v1.0.1

# Create GitHub release
gh release create v1.0.1 --title "v1.0.1" --notes "See CHANGELOG.md"
```

## Publishing with Organization Scope

If you want to publish as `@yassinello/claude-prd-workflow` or `@claude-plugins/claude-prd-workflow`:

### Option 1: User Scope (@yassinello)

1. **Update package.json**:
```json
{
  "name": "@yassinello/claude-prd-workflow"
}
```

2. **Publish as public package**:
```bash
npm publish --access public
```

### Option 2: Organization Scope (@claude-plugins)

1. **Create npm organization**:
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Click "Add Organization"
   - Enter name: `claude-plugins`

2. **Update package.json**:
```json
{
  "name": "@claude-plugins/claude-prd-workflow"
}
```

3. **Publish under organization**:
```bash
npm publish --access public
```

## Automation with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then add `NPM_TOKEN` to GitHub secrets:
1. Generate token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Add to GitHub: Settings > Secrets > New repository secret
3. Name: `NPM_TOKEN`, Value: your token

## Troubleshooting

### Error: "You must verify your email"

```bash
# Resend verification email
npm profile enable-2fa auth-only
```

### Error: "Package name taken"

Try:
- `@yassinello/claude-prd-workflow`
- `claude-code-prd-workflow`
- `prd-workflow-manager`

### Error: "403 Forbidden"

```bash
# Re-login
npm logout
npm login
```

## Best Practices

1. **Semantic Versioning**: Follow [semver.org](https://semver.org/)
   - Patch: Bug fixes (1.0.0 -> 1.0.1)
   - Minor: New features (1.0.0 -> 1.1.0)
   - Major: Breaking changes (1.0.0 -> 2.0.0)

2. **Test Before Publishing**:
   ```bash
   npm pack
   npm install -g ./claude-prd-workflow-*.tgz
   # Test the plugin
   npm uninstall -g claude-prd-workflow
   ```

3. **Update README**: Ensure installation instructions are current

4. **Changelog**: Document all changes in CHANGELOG.md

5. **Git Tag**: Tag releases for version tracking

## Current Status

- ✅ `package.json` created
- ✅ `install.js` script created
- ✅ `.npmignore` configured
- ⏳ Ready to publish (awaiting npm login)

## Quick Publish Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test locally: `npm pack` → `npm install -g ./claude-prd-workflow-*.tgz`
- [ ] Commit changes: `git add . && git commit -m "chore: Bump version to X.Y.Z"`
- [ ] Login: `npm login`
- [ ] Publish: `npm publish`
- [ ] Tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
- [ ] Create GitHub release
- [ ] Test install: `npm install -g claude-prd-workflow`

---

**Need help?** Check [npm documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish)
