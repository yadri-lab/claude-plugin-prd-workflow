---
name: generate-claude-md
description: Auto-generate CLAUDE.md by analyzing codebase structure and tech stack
category: Project Setup
---

# Generate CLAUDE.md Command

Auto-generate a comprehensive CLAUDE.md file that helps Claude Code understand your project.

## Purpose

Create a well-structured CLAUDE.md file by automatically detecting:
- Tech stack and framework
- Project structure and patterns
- Development commands
- Code style conventions
- Testing approach

## Workflow

### Step 1: Analyze Codebase

**Detect Tech Stack**:

```bash
# Check for framework indicators
- package.json → Node.js project
  - "next": "14.x" → Next.js 14
  - "react": "18.x" → React 18
  - "@types/node" → TypeScript

- requirements.txt → Python project
  - "fastapi" → FastAPI
  - "django" → Django

- Gemfile → Ruby project
  - "rails" → Ruby on Rails

- go.mod → Go project
```

**Detect Patterns**:
- Directory structure (src/, app/, components/, etc.)
- Testing framework (vitest, jest, pytest, etc.)
- Styling (Tailwind, CSS Modules, styled-components)
- State management (Zustand, Redux, Jotai)
- ORM/Database (Prisma, TypeORM, SQLAlchemy)

### Step 2: Extract Development Commands

```bash
# From package.json "scripts"
npm run dev → Development server
npm run build → Production build
npm run test → Run tests
npm run lint → Linting

# From Makefile
make dev
make test

# From Justfile
just dev
just build
```

### Step 3: Generate Structured CLAUDE.md

**Template Sections**:

1. **Project Overview**
   - One-line description
   - Tech stack summary

2. **Tech Stack**
   - Framework + version
   - Language + version
   - Key dependencies

3. **Architecture & Patterns**
   - Architectural pattern (MVC, Clean Architecture, etc.)
   - Data flow patterns
   - Component structure

4. **Directory Structure**
   - Key directories explained
   - File organization conventions

5. **Development Commands**
   - Common commands with descriptions
   - Test commands
   - Build commands

6. **Code Style & Conventions**
   - Component patterns
   - Naming conventions
   - Import order
   - Formatting rules

7. **Testing Approach**
   - Test framework
   - Coverage requirements
   - Test file location conventions

8. **Do NOT Edit**
   - Auto-generated files/directories
   - Build artifacts
   - Dependencies

9. **Review Process**
   - Pre-commit checklist
   - Quality gates

### Step 4: Write to CLAUDE.md

**Behavior**:
- Creates new `CLAUDE.md` in project root
- If file exists:
  - Preserves sections marked with `<!-- CUSTOM -->`
  - Updates auto-generated sections
  - Adds timestamp

**Size Validation**:
- Target: < 5KB (to avoid token waste)
- Warns if > 5KB
- Suggests removing verbose sections

### Step 5: Post-Generation Tips

```markdown
✅ CLAUDE.md generated successfully!

📄 File: /path/to/CLAUDE.md (3.2 KB)

💡 Tips:
1. Review the generated content for accuracy
2. Add custom sections with <!-- CUSTOM --> marker
3. Run `/generate-claude-md` again after major architecture changes
4. Import project-specific files with @path/to/file syntax

🔄 To regenerate:
   /generate-claude-md

📝 To edit manually:
   Open CLAUDE.md in your editor

🧪 Test it:
   Ask Claude: "What's the tech stack?" (should reference CLAUDE.md)
```

## Configuration

```json
{
  "generate_claude_md": {
    "enabled": true,
    "sections": [
      "tech_stack",
      "architecture",
      "directory_structure",
      "dev_commands",
      "code_style",
      "testing",
      "do_not_edit",
      "review_process"
    ],
    "max_size_kb": 5,
    "preserve_custom_sections": true,
    "auto_detect_framework": true
  }
}
```

## Example Output

**For a Next.js 14 + TypeScript project**:

```markdown
# Project Context

**Generated**: 2025-10-26 by claude-prd-workflow v2.6.0
**Last Updated**: Auto-updated on codebase changes

## Tech Stack

- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript 5.3.2
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: Zustand 4.4
- **Database**: PostgreSQL (Prisma ORM 5.7)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## Architecture

- **Pattern**: Server Components + Client Islands
- **Data Fetching**: React Server Components (RSC)
- **API**: tRPC for type-safe endpoints
- **Auth**: NextAuth.js v5 (Auth.js)
- **File Structure**: Feature-based modules

## Directory Structure

\```
src/
  ├── app/          # Next.js App Router pages & layouts
  │   ├── (auth)/   # Auth group (login, signup)
  │   ├── (dashboard)/ # Dashboard group
  │   └── api/      # API routes (tRPC)
  │
  ├── components/   # React components
  │   ├── ui/       # shadcn/ui primitives
  │   └── features/ # Feature-specific components
  │
  ├── lib/          # Utilities & config
  │   ├── db/       # Prisma client & queries
  │   ├── trpc/     # tRPC setup
  │   └── utils.ts  # Shared utilities
  │
  ├── stores/       # Zustand state stores
  └── types/        # TypeScript type definitions
\```

## Development Commands

\```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint + Prettier
npm run typecheck  # TypeScript type checking
npm run test       # Run Vitest tests
npm run test:ui    # Vitest UI mode
npm run db:migrate # Run Prisma migrations
npm run db:studio  # Open Prisma Studio
\```

## Code Style

**Components**:
- ✅ Functional components with hooks (no class components)
- ✅ Server Components by default
- ✅ Add "use client" only when needed (state, effects, browser APIs)

**Naming**:
- Components: `PascalCase` (UserProfile.tsx)
- Functions: `camelCase` (getUserById)
- Constants: `UPPER_SNAKE_CASE` (API_BASE_URL)
- Files: `kebab-case` for non-components (user-utils.ts)

**Imports**:
\```typescript
// Use @ alias for src/ imports
import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/db/queries'

// Group imports:
// 1. External (react, next)
// 2. Internal (@/...)
// 3. Relative (./...)
\```

**Exports**:
- Named exports preferred over default
- Exception: Next.js pages (require default export)

**Formatting** (automated via Prettier):
- 2 spaces indentation
- Single quotes
- Semicolons required
- Trailing commas

## Testing

**Framework**: Vitest + React Testing Library

**Conventions**:
- Unit tests: `__tests__/` folders co-located with code
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/` (Playwright)

**Coverage**: Minimum 80% for new code

**Example**:
\```typescript
// src/components/Button/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
\```

## Do NOT Edit

These are auto-generated or managed by tools:
- `node_modules/` - Dependencies (managed by npm)
- `.next/` - Next.js build cache
- `dist/` or `build/` - Production build output
- `*.generated.ts` - Auto-generated code
- `prisma/migrations/` - Database migrations (use Prisma CLI)
- `.vercel/` - Vercel deployment cache

## Review Process

Before committing, ensure:

1. ✅ **Linting**: `npm run lint` - No errors
2. ✅ **Type Check**: `npm run typecheck` - No errors
3. ✅ **Tests**: `npm run test` - All pass
4. ✅ **Code Style**: Follows conventions above
5. ✅ **New Components**: Have corresponding tests
6. ✅ **Documentation**: Update if API changes
7. ✅ **Performance**: No console.logs in production code

---

<!-- CUSTOM -->
Add project-specific instructions below (they will be preserved on regeneration):
<!-- /CUSTOM -->
\```

## Best Practices

1. **Keep It Concise**
   - Target: < 5KB
   - Use bullet points, not paragraphs
   - Link to external docs for details

2. **Update Regularly**
   - Run `/generate-claude-md` after major changes
   - Review generated content for accuracy
   - Keep tech stack versions updated

3. **Custom Sections**
   - Wrap custom content with `<!-- CUSTOM -->` markers
   - These sections preserved on regeneration
   - Use for project-specific guidelines

4. **Import Strategy**
   - Reference other docs: `@README.md`
   - Import package.json: `@package.json`
   - Max import depth: 5 levels

## Success Criteria

- ✅ CLAUDE.md generated successfully
- ✅ File size < 5KB
- ✅ All sections populated with accurate info
- ✅ Claude Code can reference it in conversations
- ✅ Team members understand project from reading it

## Related

- Command: `/init` (Claude Code built-in)
- Skill: `claude-md-generator` (invoked automatically)
- Docs: Best practices for CLAUDE.md structure

---

**Plugin**: claude-prd-workflow
**Category**: Project Setup
**Version**: 0.4.2
**Requires**: Git repo with package.json or similar
