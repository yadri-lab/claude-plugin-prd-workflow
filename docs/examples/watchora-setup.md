# Watchora Project - Complete Setup Example

**Project Type**: Multi-tenant SaaS with Design System
**Team Size**: Small (1-3 developers)
**Tech Stack**: Next.js, React, TypeScript, Tailwind, shadcn/ui, Turborepo
**Deployment**: Vercel

---

## Overview

This example shows how Watchora (a real project) uses the PRD Workflow Manager plugin to build a complete SaaS platform with a design system.

**Key Features**:
- Design system as a separate Turborepo package
- Parallel development using Git worktrees
- Tight PRD workflow with quality gates
- GitHub integration for issue tracking

---

## Configuration

### `.claude/config.json`

```json
{
  "prd_workflow": {
    "enabled": true,
    "directories": {
      "draft": "product/prds/01-draft",
      "review": "product/prds/02-review",
      "ready": "product/prds/03-ready",
      "in_progress": "product/prds/04-in-progress",
      "complete": "product/prds/05-complete",
      "archived": "product/prds/99-archived"
    },
    "branch_naming": {
      "prefix": "feat",
      "prd_id_format": "PRD-{number}",
      "separator": "-",
      "pattern": "{prefix}/{prd_id}{separator}{feature_name}"
    },
    "worktree": {
      "enabled": true,
      "parent_directory": "..",
      "naming_pattern": "watchora-{feature}",
      "auto_install_dependencies": true,
      "auto_open_editor": false
    },
    "github": {
      "enabled": true,
      "create_issue_on_approval": true,
      "issue_labels": ["feature", "P0", "P1", "P2"],
      "auto_assign": true,
      "milestone_tracking": true
    },
    "review": {
      "dimensions": [
        "Clarity & Scope",
        "Technical Feasibility",
        "User Experience",
        "Dependencies & Blockers",
        "Acceptance Criteria",
        "Risk Assessment",
        "Simplification Opportunities"
      ],
      "grading_enabled": true,
      "minimum_grade": "B",
      "require_approval": true,
      "calibration_questions": true
    },
    "work_plan": {
      "enabled": true,
      "file_path": "product/WORK_PLAN.md",
      "update_on_status_change": true,
      "track_decisions": true
    }
  },
  "security": {
    "enabled": true,
    "auto_scan_on_commit": false,
    "scan_dependencies": true,
    "scan_code": true,
    "fail_on_high_severity": true
  },
  "quality": {
    "enabled": true,
    "linting": {
      "enabled": true,
      "auto_fix": true,
      "fail_on_error": true
    },
    "testing": {
      "enabled": true,
      "auto_run": false,
      "coverage_threshold": 80,
      "required_for_pr": true
    },
    "code_complexity": {
      "enabled": true,
      "max_complexity": 10,
      "warn_threshold": 7
    }
  },
  "orchestration": {
    "enabled": true,
    "parallel_features": 3,
    "dependency_resolution": true,
    "auto_merge_strategy": "squash",
    "conflict_resolution": "manual"
  }
}
```

---

## Directory Structure

```
watchora/
├── apps/
│   ├── web/                  # Main Next.js app
│   └── docs/                 # Documentation site
├── packages/
│   ├── ui/                   # Design system (PRD-003)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── package.json
│   ├── config-tailwind/
│   └── config-typescript/
├── product/
│   ├── prds/
│   │   ├── 01-draft/
│   │   ├── 02-review/
│   │   ├── 03-ready/
│   │   ├── 04-in-progress/
│   │   ├── 05-complete/
│   │   └── 99-archived/
│   ├── WORK_PLAN.md
│   └── decisions/
│       └── 001-design-system.md
└── .claude/
    └── config.json
```

---

## Real Workflow Example

### PRD-003: Design System Package

**Timeline**: 2 weeks
**Complexity**: High
**Dependencies**: None (foundation)

#### Step 1: Create Draft PRD

```bash
/create-prd
```

**Prompts**:
- **Feature Name**: Design System Package
- **Priority**: P0 (must have)
- **PRD ID**: PRD-003
- **Executive Summary**: "Create a reusable design system package (@watchora/ui) with shadcn/ui components, custom hooks, and utilities to ensure visual consistency across all Watchora apps."

**Output**: `product/prds/01-draft/251015-design-system-v1.md`

#### Step 2: Review PRD

```bash
/review-prd
```

**Review Process**:
1. Plugin lists draft PRDs (found 1: PRD-003)
2. Moves to `02-review/`
3. Analyzes with 7-dimension framework
4. Generates calibration questions:
   - "Should the design system support dark mode from day 1?"
   - "What's the migration path for existing components?"
   - "How will we version the package?"
5. Updates PRD with Q&A
6. Grades: **B+** (threshold: B)
7. Approves and moves to `03-ready/`
8. Creates GitHub issue #12

**Output**: Issue created at `https://github.com/watchora/watchora/issues/12`

#### Step 3: Start Development

```bash
/code-prd
```

**Process**:
1. Lists ready PRDs (found 1: PRD-003)
2. Creates branch `feat/PRD-003-design-system`
3. Creates worktree:
   ```bash
   git worktree add ../watchora-design-system feat/PRD-003-design-system
   cd ../watchora-design-system
   npm install
   ```
4. Moves PRD to `04-in-progress/`
5. Provides implementation context

**You're now working in**: `../watchora-design-system/`

#### Step 4: Guided Implementation

```bash
/work-prd
```

**Task Breakdown** (10 tasks):

**Task 1: Package Setup** (30m)
```bash
# Files to create/modify
packages/ui/package.json
packages/ui/tsconfig.json
packages/ui/tailwind.config.ts
```

**Task 2: shadcn/ui Integration** (1h)
```bash
npx shadcn-ui@latest init
```

**Task 3: Button Component** (2h)
```typescript
// packages/ui/src/components/Button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Task 4-7: Additional Components** (8h total)
- Card
- Input
- Select
- Dialog

**Task 8: Custom Hooks** (2h)
```typescript
// packages/ui/src/hooks/use-toast.ts
export function useToast() {
  // Implementation
}
```

**Task 9: Tests** (3h)
```typescript
// packages/ui/src/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

**Task 10: Documentation** (1h)
- Storybook stories
- README.md
- Usage examples

**Progress Tracking**: `.claude/prd-003-progress.json`
```json
{
  "prd_id": "PRD-003",
  "total_tasks": 10,
  "completed_tasks": 10,
  "progress_percentage": 100,
  "last_updated": "2025-10-15T14:30:00Z"
}
```

#### Step 5: Quality Checks

**Security Audit**:
```bash
/security-audit
```

**Output**:
- ✅ No vulnerabilities in dependencies
- ✅ No secrets detected
- ✅ No ESLint security warnings

**Quality Check**:
```bash
/quality-check
```

**Output**:
- ✅ Linting: 0 errors
- ✅ TypeScript: 0 errors
- ✅ Tests: 24 passing (87% coverage)
- ✅ Complexity: Average 3.2 (max 10)
- **Grade**: A

#### Step 6: Create Pull Request

```bash
git add .
git commit -m "feat(PRD-003): Add design system package with shadcn/ui components"
git push -u origin feat/PRD-003-design-system
gh pr create --title "feat(PRD-003): Design System Package" --body "$(cat <<'EOF'
## Summary

Implements PRD-003: Design System Package with reusable UI components.

## Changes

### Added
- `@watchora/ui` package with shadcn/ui integration
- 5 core components: Button, Card, Input, Select, Dialog
- Custom hooks: `useToast`, `useMediaQuery`
- Tailwind config with design tokens
- Storybook documentation

### Test Coverage
- **87%** (target: 80%) ✅
- 24 tests passing

## Quality Checks
- [x] `/security-audit` passed (no issues)
- [x] `/quality-check` passed (grade: A)
- [x] Linting: 0 errors
- [x] TypeScript: 0 errors
- [x] Tests: All passing

## Screenshots
[Storybook screenshots]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**PR Link**: `https://github.com/watchora/watchora/pull/13`

#### Step 7: Merge & Cleanup

After review and approval:

```bash
# Switch back to main repo
cd ../watchora

# Merge (done via GitHub UI with squash merge)

# Cleanup worktree
git worktree remove ../watchora-design-system
git branch -d feat/PRD-003-design-system
git pull origin main

# Move PRD to complete
mv product/prds/04-in-progress/251015-design-system-v1.md product/prds/05-complete/

# Update work plan
/list-prds
```

**Work Plan Updated**:
```markdown
## ✅ Complete (1)
- **PRD-003**: Design System Package (Completed: 2025-10-15)
```

---

## Parallel Development Example

Watchora often develops multiple features simultaneously using worktrees.

### Scenario: 3 Features in Parallel

**Active Worktrees**:
```bash
git worktree list
# /c/Users/user/watchora                  abc1234 [main]
# /c/Users/user/watchora-design-system    def5678 [feat/PRD-003-design-system]
# /c/Users/user/watchora-auth             ghi9012 [feat/PRD-004-auth-system]
# /c/Users/user/watchora-dashboard        jkl3456 [feat/PRD-005-dashboard]
```

**Orchestration**:
```bash
/orchestrate
```

**Output**:
```markdown
## Active Features (3)

1. **PRD-003**: Design System (40% complete)
   - Branch: feat/PRD-003-design-system
   - Worktree: ../watchora-design-system
   - Status: On track

2. **PRD-004**: Authentication (15% complete)
   - Branch: feat/PRD-004-auth-system
   - Worktree: ../watchora-auth
   - Status: Blocked (waiting for PRD-003)

3. **PRD-005**: Dashboard (0% complete)
   - Branch: feat/PRD-005-dashboard
   - Worktree: ../watchora-dashboard
   - Status: Not started (depends on PRD-003, PRD-004)

## Dependency Graph
PRD-003 (Design System)
  ├── PRD-004 (Auth) - BLOCKED
  └── PRD-005 (Dashboard) - BLOCKED

## Recommendation
Focus on completing PRD-003 to unblock PRD-004 and PRD-005.
```

---

## Integration with Existing Tools

### Vercel Deployment

Watchora uses Vercel for deployment. PRs automatically trigger preview deployments.

**GitHub Actions** (`.github/workflows/pr-checks.yml`):
```yaml
name: PR Checks
on: [pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build
```

### Linear Integration (Optional)

If using Linear for project management:

```json
{
  "github": {
    "enabled": true,
    "create_issue_on_approval": false
  },
  "linear": {
    "enabled": true,
    "create_issue_on_approval": true,
    "project_id": "WATCH",
    "team_id": "engineering"
  }
}
```

---

## Lessons Learned

### What Worked Well ✅

1. **Git Worktrees**: Eliminated context switching between features
2. **PRD Review**: Caught scope creep early (dark mode deferred to v2)
3. **Calibration Questions**: Revealed missing versioning strategy
4. **Quality Gates**: Prevented merge with low test coverage
5. **Work Plan**: Clear visibility into progress

### Challenges & Solutions ❌ → ✅

**Challenge 1**: Worktree dependency installation slow
**Solution**: Enabled `auto_install_dependencies: true` in config

**Challenge 2**: Forgot to update work plan manually
**Solution**: Enabled `update_on_status_change: true`

**Challenge 3**: PRD scope kept growing during implementation
**Solution**: Stricter review with `minimum_grade: "B"` (was C)

---

## Metrics

**Before Plugin** (3 months):
- Features completed: 8
- Average cycle time: 12 days
- Failed PRs: 4 (missing tests, scope issues)
- Context switching: ~15 times/week

**After Plugin** (3 months):
- Features completed: 14 (+75%)
- Average cycle time: 7 days (-42%)
- Failed PRs: 0 (quality gates work!)
- Context switching: ~3 times/week (-80%)
- PRD review time: 20 min/PRD
- Implementation time saved: ~3 hours/PRD (clear tasks)

---

## Tips for Similar Projects

1. **Start with tight quality gates** - You can always loosen later
2. **Use worktrees aggressively** - Parallel work is a game-changer
3. **Keep PRDs lightweight** - 2-3 pages max, not 10
4. **Review every PRD** - 20 minutes upfront saves 3 hours later
5. **Track decisions** - Architecture Decision Records (ADRs) in `product/decisions/`
6. **Automate quality checks** - CI/CD integration is essential
7. **Use calibration questions** - They expose what you haven't thought about

---

## Next Steps for Watchora

**Upcoming PRDs**:
- **PRD-006**: Multi-tenant Architecture (P0, depends on PRD-003, PRD-004)
- **PRD-007**: Billing Integration (P1)
- **PRD-008**: Admin Dashboard (P1, depends on PRD-003, PRD-006)
- **PRD-009**: Email Notifications (P2)

**Backlog**:
- Dark mode support (deferred from PRD-003)
- Mobile app (Q2 2026)
- API v2 (Q3 2026)
