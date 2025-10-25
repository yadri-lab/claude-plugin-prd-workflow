---
name: documentation
description: Documentation generation and maintenance for code and features
category: Development Tools
---

# Documentation Skill

Provides expertise in creating and maintaining comprehensive documentation including README files, API documentation, code comments, and user guides.

## 1. README Files

### Project README Template

```markdown
# Project Name

One-line description of what this project does.

## Features

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

## Installation

\`\`\`bash
# Clone repository
git clone https://github.com/username/project.git
cd project

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

## Usage

\`\`\`typescript
import { Component } from '@project/core';

const instance = new Component({
  option: 'value'
});

instance.doSomething();
\`\`\`

## Configuration

See [Configuration Guide](docs/configuration.md) for detailed options.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | string | `http://localhost:3000` | API endpoint |
| `timeout` | number | `5000` | Request timeout (ms) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Architecture

See [Architecture Decision Records](docs/adr/) for design decisions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [Author Name](https://github.com/username)
```

---

## 2. API Documentation

### JSDoc/TSDoc Comments

**Function Documentation**:
```typescript
/**
 * Fetches a user by their unique identifier.
 *
 * @param userId - The unique identifier of the user
 * @param options - Optional configuration
 * @param options.includeDeleted - Whether to include soft-deleted users
 * @returns A promise that resolves to the user object
 * @throws {UserNotFoundError} When user doesn't exist
 * @throws {DatabaseError} When database query fails
 *
 * @example
 * ```typescript
 * const user = await getUser('123');
 * console.log(user.name);
 * ```
 *
 * @example
 * ```typescript
 * // Include soft-deleted users
 * const user = await getUser('123', { includeDeleted: true });
 * ```
 */
export async function getUser(
  userId: string,
  options?: { includeDeleted?: boolean }
): Promise<User> {
  // Implementation
}
```

**Interface Documentation**:
```typescript
/**
 * Configuration options for the API client.
 *
 * @public
 */
export interface ApiClientConfig {
  /**
   * Base URL for all API requests.
   * @default 'https://api.example.com'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * @default 5000
   */
  timeout?: number;

  /**
   * Custom headers to include in all requests.
   */
  headers?: Record<string, string>;

  /**
   * Retry configuration for failed requests.
   */
  retry?: {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Delay between retries in milliseconds */
    delay: number;
  };
}
```

---

### TypeDoc Generation

**Install**:
```bash
npm install --save-dev typedoc
```

**typedoc.json**:
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "excludePrivate": true,
  "excludeProtected": false,
  "excludeExternals": true,
  "readme": "README.md",
  "theme": "default",
  "plugin": ["typedoc-plugin-markdown"]
}
```

**Generate**:
```bash
npx typedoc
```

---

## 3. Storybook (Component Documentation)

### Component Story

**Button.stories.tsx**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Primary UI component for user interaction.
 *
 * ## Usage
 *
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Default button with primary variant.
 */
export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

/**
 * Secondary button for less prominent actions.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/**
 * Button in loading state with spinner.
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};

/**
 * All size variants.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

---

## 4. Architecture Decision Records (ADR)

### ADR Template

**docs/adr/001-use-typescript.md**:
```markdown
# ADR-001: Use TypeScript for Type Safety

## Status

Accepted

## Context

We need to choose between JavaScript and TypeScript for our codebase.
Our team has varying levels of experience with both languages.

## Decision

We will use TypeScript for all new code.

## Rationale

### Pros
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Easier to refactor large codebases

### Cons
- **Learning Curve**: Team needs to learn TypeScript
- **Build Step**: Requires compilation
- **Verbosity**: More code to write

### Alternatives Considered

1. **JavaScript**: Simpler, no build step, but no type safety
2. **Flow**: Similar to TypeScript but less popular
3. **JSDoc**: Type annotations in comments (chosen for legacy code)

## Consequences

- All new files must be `.ts` or `.tsx`
- Existing JavaScript files can be migrated gradually
- CI pipeline will include TypeScript type checking
- Team will undergo TypeScript training

## Implementation

1. Install TypeScript: `npm install --save-dev typescript`
2. Create `tsconfig.json` with strict mode
3. Setup ESLint for TypeScript
4. Migrate one file per PR

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Team discussion](https://github.com/org/repo/discussions/42)
```

---

## 5. Migration Guides

### Version Migration Template

**docs/migration/v1-to-v2.md**:
```markdown
# Migration Guide: v1.x to v2.0

## Breaking Changes

### 1. API Endpoints Renamed

**Before (v1)**:
\`\`\`typescript
await client.get('/user/profile');
\`\`\`

**After (v2)**:
\`\`\`typescript
await client.get('/users/me');
\`\`\`

### 2. Button Component Props Changed

**Before (v1)**:
\`\`\`tsx
<Button type="primary" />
\`\`\`

**After (v2)**:
\`\`\`tsx
<Button variant="primary" />
\`\`\`

**Migration**:
\`\`\`bash
# Automated codemod
npx @company/codemods v1-to-v2
\`\`\`

### 3. Authentication Method Updated

**Before (v1)**: API key in query parameter
\`\`\`typescript
fetch('https://api.example.com/data?apiKey=xxx');
\`\`\`

**After (v2)**: Bearer token in header
\`\`\`typescript
fetch('https://api.example.com/data', {
  headers: { Authorization: 'Bearer xxx' }
});
\`\`\`

## Deprecated (Still Works in v2, Removed in v3)

- `getUserProfile()` → Use `getUser()` instead
- `Button type` prop → Use `variant` prop

## New Features

### Dark Mode Support

\`\`\`tsx
import { ThemeProvider } from '@company/ui';

<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
\`\`\`

## Step-by-Step Migration

1. **Update dependencies**
   \`\`\`bash
   npm install @company/ui@^2.0.0
   \`\`\`

2. **Run automated codemod**
   \`\`\`bash
   npx @company/codemods v1-to-v2 src/
   \`\`\`

3. **Update API endpoints** (see Breaking Changes #1)

4. **Test thoroughly**
   \`\`\`bash
   npm test
   \`\`\`

5. **Update environment variables**
   - Rename `API_KEY` to `AUTH_TOKEN`

## Rollback Plan

If issues occur:
1. Revert to v1.x: `npm install @company/ui@^1.0.0`
2. Remove v2-specific code
3. Restart application

## Timeline

- v1.x support ends: December 31, 2025
- v2.0 released: January 1, 2025
- Migrate by: June 30, 2025 (6 months)

## Support

- [GitHub Discussions](https://github.com/org/repo/discussions)
- [Discord](https://discord.gg/xxx)
- Email: support@company.com
```

---

## 6. Code Comments

### When to Comment

**DO Comment**:
```typescript
// ✅ Explain WHY (non-obvious reasoning)
// Use debounce to prevent excessive API calls during typing
const debouncedSearch = debounce(search, 300);

// ✅ Explain complex algorithms
// Boyer-Moore string search: O(n/m) average case
function boyerMooreSearch(text: string, pattern: string) {}

// ✅ Warn about gotchas
// WARNING: This modifies the array in-place
function sortInPlace(arr: number[]) {}

// ✅ Mark TODOs with context
// TODO(alice): Refactor to use React Query after v3.0 release
```

**DON'T Comment**:
```typescript
// ❌ Obvious comments
// Get user by ID
function getUserById(id: string) {}

// ❌ Comments that duplicate code
// Increment counter
counter++;

// ❌ Commented-out code (use git instead)
// const oldFunction = () => {};
```

---

## 7. Changelog

### CHANGELOG.md Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dark mode support for all components

### Changed
- Improved Button component performance (20% faster)

### Fixed
- Fixed Input component not accepting numeric values

## [2.0.0] - 2025-01-15

### Added
- New `Select` component with search functionality
- TypeScript support (100% type coverage)
- Storybook documentation for all components

### Changed
- **BREAKING**: Renamed `Button type` prop to `variant`
- **BREAKING**: API endpoints now use `/v2/` prefix
- Updated all dependencies to latest versions

### Deprecated
- `getUserProfile()` function (use `getUser()` instead)

### Removed
- **BREAKING**: Removed `LegacyButton` component
- Removed support for Node.js 14

### Fixed
- Fixed memory leak in `useWebSocket` hook
- Fixed accessibility issues in modal component

### Security
- Updated axios to fix CVE-2023-45857

## [1.5.0] - 2024-12-01

### Added
- Added loading states to all buttons
- Added error boundaries for crash recovery

### Fixed
- Fixed modal not closing on Escape key

[Unreleased]: https://github.com/org/repo/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/org/repo/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/org/repo/releases/tag/v1.5.0
```

---

## 8. User Guides

### Feature Documentation Template

**docs/features/rss-monitoring.md**:
```markdown
# RSS Feed Monitoring

Monitor RSS feeds for new articles and receive notifications.

## Overview

The RSS Monitoring feature allows you to:
- Add multiple RSS feeds
- Check feeds automatically every 15 minutes
- Filter articles by keywords
- Receive notifications for new articles

## Setup

### 1. Add RSS Feed

Navigate to **Settings → RSS Feeds** and click **Add Feed**.

![Add RSS Feed](../images/add-feed.png)

**Required Fields**:
- Feed URL (e.g., `https://example.com/feed.xml`)
- Feed Name (e.g., "Tech News")

**Optional**:
- Check interval (default: 15 minutes)
- Keywords to filter (comma-separated)

### 2. Configure Notifications

Choose notification channels:
- [ ] Email
- [ ] Slack
- [ ] Discord

## Usage

### View New Articles

New articles appear in the **Feed** tab.

Click an article to:
- Read full content
- Mark as read
- Save for later
- Share

### Filter Articles

Use the search bar to filter by:
- Title
- Content
- Source

**Example**: Search "React" to find all React-related articles.

## FAQ

**Q: How often are feeds checked?**
A: Every 15 minutes by default (configurable).

**Q: Can I import OPML files?**
A: Yes, go to Settings → Import → Upload OPML.

**Q: Are old articles deleted?**
A: Articles older than 30 days are archived.

## Troubleshooting

### Feed not updating

1. Check feed URL is valid: [Feed Validator](https://validator.w3.org/feed/)
2. Verify feed is publicly accessible (not behind login)
3. Check logs: Settings → Logs → RSS Errors

### Missing notifications

1. Verify notification settings enabled
2. Check spam folder (for email)
3. Test notification: Settings → Notifications → Test

## API Reference

See [RSS API Documentation](../api/rss.md) for programmatic access.
```

---

## Documentation Checklist

- [ ] README with quickstart
- [ ] API documentation (JSDoc/TypeDoc)
- [ ] Component documentation (Storybook)
- [ ] Architecture decisions (ADR)
- [ ] Migration guides (for breaking changes)
- [ ] Changelog (keep a changelog format)
- [ ] User guides (for features)
- [ ] Troubleshooting section
- [ ] FAQ
- [ ] Contributing guidelines

---

## Related

- Commands: `/create-prd` (uses templates)
- Agents: `prd-reviewer`, `prd-implementer`
- Skills: `code-quality`
