---
name: claude-md-generator
description: Analyzes codebase and generates structured CLAUDE.md file
model: haiku
temperature: 0.3
---

# CLAUDE.md Generator Skill

Analyzes project structure, tech stack, and patterns to generate a comprehensive CLAUDE.md file.

## Purpose

Auto-detect project characteristics and create a well-structured CLAUDE.md that helps Claude Code understand the project context.

## Capabilities

### 1. Tech Stack Detection

**Detection Methods**:

```bash
# Node.js/JavaScript/TypeScript
package.json:
  - dependencies.next → Next.js
  - dependencies.react → React
  - devDependencies.typescript → TypeScript
  - dependencies["@types/node"] → TypeScript

# Python
requirements.txt or pyproject.toml:
  - fastapi → FastAPI
  - django → Django
  - flask → Flask

# Ruby
Gemfile:
  - gem "rails" → Ruby on Rails

# Go
go.mod:
  - module declaration → Go project

# Rust
Cargo.toml:
  - [package] → Rust project
```

### 2. Framework Detection

**Next.js Version**:
```typescript
// Check package.json version
"next": "14.0.4" → Next.js 14 (App Router era)
"next": "13.4.0" → Next.js 13 (App Router beta)
"next": "12.x" → Next.js 12 (Pages Router)

// Check directory structure
app/ directory exists → App Router
pages/ directory only → Pages Router
```

**React Patterns**:
```typescript
// State Management
dependencies.zustand → Zustand
dependencies.redux → Redux
dependencies.jotai → Jotai
dependencies.recoil → Recoil

// Styling
dependencies.tailwindcss → Tailwind CSS
dependencies["styled-components"] → styled-components
*.module.css files → CSS Modules
```

### 3. Architecture Pattern Detection

**Indicators**:
- `src/app/` → Next.js App Router
- `src/pages/` + `src/components/` → Pages Router or standard React
- `src/features/` → Feature-based architecture
- `src/domain/` → Domain-Driven Design
- `src/modules/` → Modular architecture
- `src/server/` + `src/client/` → Client-Server split

### 4. Testing Framework Detection

```bash
# Test frameworks
package.json dependencies:
  - vitest → Vitest
  - jest → Jest
  - @testing-library/react → React Testing Library
  - cypress → Cypress
  - playwright → Playwright

# Test file patterns
- **/*.test.ts → Jest/Vitest pattern
- **/*.spec.ts → Spec pattern
- __tests__/ directories → Colocated tests
- tests/ directory → Centralized tests
```

### 5. Development Commands Extraction

```typescript
// From package.json "scripts"
{
  "scripts": {
    "dev": "next dev",           → Development server
    "build": "next build",       → Production build
    "test": "vitest",            → Run tests
    "lint": "eslint .",          → Linting
    "typecheck": "tsc --noEmit"  → Type checking
  }
}

// From Makefile
parse:
  dev: → make dev
  test: → make test

// From Justfile
parse:
  dev: → just dev
```

### 6. Code Style Detection

**Formatting**:
```bash
# Check for config files
.prettierrc → Prettier
.eslintrc.js → ESLint
.editorconfig → EditorConfig

# Infer from existing code
Sample 10 files:
  - Indentation: tabs vs spaces, width
  - Quotes: single vs double
  - Semicolons: present vs omitted
  - Trailing commas: yes vs no
```

**Naming Conventions**:
```typescript
// Analyze existing files
components/UserProfile.tsx → PascalCase for components
utils/getUserById.ts → camelCase for utilities
constants/API_URL.ts → UPPER_SNAKE_CASE for constants
```

## CLAUDE.md Generation Algorithm

```python
def generate_claude_md(project_root):
    # Step 1: Detect tech stack
    tech_stack = detect_tech_stack(project_root)
    # {
    #   framework: "Next.js 14.0.4",
    #   language: "TypeScript 5.3.2",
    #   styling: "Tailwind CSS",
    #   state: "Zustand",
    #   database: "PostgreSQL (Prisma)",
    #   testing: "Vitest"
    # }

    # Step 2: Analyze directory structure
    structure = analyze_directory_structure(project_root)
    # {
    #   "src/app": "Next.js App Router pages",
    #   "src/components": "React components",
    #   "src/lib": "Utilities and config",
    #   ...
    # }

    # Step 3: Extract commands
    commands = extract_dev_commands(project_root)
    # [
    #   {"cmd": "npm run dev", "desc": "Start dev server"},
    #   {"cmd": "npm run build", "desc": "Production build"},
    #   ...
    # ]

    # Step 4: Detect code style
    style = detect_code_style(project_root)
    # {
    #   indent: "2 spaces",
    #   quotes: "single",
    #   semicolons: true,
    #   componentPattern: "Functional with hooks"
    # }

    # Step 5: Detect testing approach
    testing = detect_testing_setup(project_root)
    # {
    #   framework: "Vitest",
    #   location: "__tests__/ colocated",
    #   coverage: "80% minimum"
    # }

    # Step 6: Generate markdown
    claude_md = render_template(
        tech_stack=tech_stack,
        structure=structure,
        commands=commands,
        style=style,
        testing=testing
    )

    # Step 7: Validate size
    if len(claude_md) > 5000:  # 5KB limit
        warn("CLAUDE.md is > 5KB, consider condensing")

    # Step 8: Write to file
    write_file(project_root + "/CLAUDE.md", claude_md)

    return claude_md
```

## Template Rendering

**Section Order**:
1. Project Overview (1-2 lines)
2. Tech Stack (bulleted list)
3. Architecture & Patterns
4. Directory Structure (tree)
5. Development Commands (code block)
6. Code Style & Conventions
7. Testing Approach
8. Do NOT Edit (warnings)
9. Review Process (checklist)

**Formatting Rules**:
- Use bullet points, not paragraphs
- Code blocks for commands and examples
- Tree structure for directories
- Tables for comparisons
- Checklists for processes

## Custom Section Preservation

**Markers**:
```markdown
<!-- CUSTOM -->
Your custom content here...
This will be preserved on regeneration.
<!-- /CUSTOM -->
```

**Behavior**:
- When regenerating, extract all `<!-- CUSTOM -->` blocks
- Generate new CLAUDE.md from scratch
- Re-insert custom blocks at original positions
- Preserve user modifications

## Size Optimization

**If > 5KB**:

1. **Remove Verbosity**:
   - Shorten descriptions
   - Remove redundant examples
   - Condense directory tree

2. **Use References**:
   ```markdown
   ## Architecture
   See @docs/architecture.md for details
   ```

3. **Prioritize Sections**:
   - Keep: Tech Stack, Commands, Code Style
   - Optional: Testing details, full directory tree

## Error Handling

**No package.json found**:
```markdown
⚠️ No package.json detected

This doesn't look like a Node.js project.

Supported project types:
  - Node.js (package.json)
  - Python (requirements.txt, pyproject.toml)
  - Ruby (Gemfile)
  - Go (go.mod)
  - Rust (Cargo.toml)

Would you like to:
  [1] Generate minimal CLAUDE.md anyway
  [2] Specify project type manually
  [3] Cancel

>
```

**Ambiguous Framework**:
```markdown
🤔 Multiple frameworks detected:
  - Next.js 14 (app/ directory)
  - Vite (vite.config.ts)

Which is primary? [1/2]
>
```

## Success Criteria

- ✅ Tech stack correctly detected (100% accuracy for major frameworks)
- ✅ All development commands extracted
- ✅ File size < 5KB
- ✅ Custom sections preserved on regeneration
- ✅ Markdown is valid and well-formatted

## Related Skills

- `project-analyzer` - Codebase structure analysis
- `tech-stack-detector` - Framework and library detection
- `code-style-analyzer` - Convention detection

---

**Skill**: claude-md-generator
**Model**: haiku (fast, pattern-based)
**Temperature**: 0.3 (consistent output)
**Version**: 2.6.0
