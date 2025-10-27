# {Feature Name}

**PRD**: #{PRD-XXX}
**Issue**: Closes #{issue-number}
**Type**: Feature | Bug Fix | Refactor | Docs | Chore

## Summary

{1-2 sentence description of what this PR does}

## Changes

### Added
- {What new functionality was added}
- {List all major additions}

### Changed
- {What existing functionality was modified}

### Removed
- {What was removed (if applicable)}

## Testing

### Test Plan

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] Manual testing performed

### Test Coverage

**Coverage**: {XX}% (target: 80%)

**Files Covered**:
- `src/file1.ts` - {XX}%
- `src/file2.ts` - {XX}%

### Manual Testing Steps

1. {Step 1}
2. {Step 2}
3. {Verify expected result}

## Quality Checks

- [ ] `/security-audit` passed (no high-severity issues)
- [ ] `/quality-check` passed (grade: {X})
- [ ] Linting: 0 errors
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing

## Screenshots / Demo

{If UI changes, add screenshots or GIF}

**Before**:
{Screenshot}

**After**:
{Screenshot}

## Performance Impact

{Describe any performance implications}

- Bundle size: {X KB} → {Y KB} ({+/-Z KB})
- Load time impact: {Negligible | +XXms | -XXms}

## Security Considerations

{Any security implications?}

- [ ] No secrets in code
- [ ] Input validation added
- [ ] Authentication/authorization handled
- [ ] XSS/CSRF protection in place

## Breaking Changes

{List any breaking changes}

- [ ] No breaking changes
- OR: {Describe breaking changes and migration path}

## Documentation

- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Storybook stories added (if UI component)
- [ ] CHANGELOG.md updated

## Deployment Notes

{Any special deployment considerations?}

- [ ] Database migrations included
- [ ] Environment variables added (see `.env.example`)
- [ ] Feature flags configured

## Rollback Plan

{How to rollback if issues occur in production?}

1. {Rollback step 1}
2. {Rollback step 2}

## Checklist

- [ ] PR title follows convention: `feat(PRD-XXX): Description`
- [ ] Branch name follows convention: `feat/PRD-XXX-feature-name`
- [ ] Code reviewed by self
- [ ] All acceptance criteria met
- [ ] Tests passing in CI
- [ ] No merge conflicts

## Additional Notes

{Any other context reviewers should know}

---

**Ready for review** ✅

/cc @{reviewer1} @{reviewer2}
