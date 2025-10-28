# Version Reset: v2.8.0 → v0.3.0

**Date**: October 28, 2025  
**Status**: Active  
**Decision**: Reset version numbering to better reflect project maturity

---

## 🤔 Why Reset the Version?

After reaching **v2.8.0 in just 2 days** of development, we realized our version numbering was **inflated** and didn't accurately reflect the plugin's maturity.

### The Problem

- ❌ **v2.8.0 suggests stability** - but we're still rapidly iterating
- ❌ **Fast version increments** - v0.1 → v2.8 in 48 hours = unsustainable
- ❌ **Breaking changes expected** - users deserve clear signals
- ❌ **Not battle-tested** - no external teams using it yet

### The Solution

Reset to **v0.3.0** to honestly communicate:
- ✅ **This is beta software** - expect breaking changes
- ✅ **v0.x signals "in development"** - industry standard
- ✅ **v1.0 is a meaningful milestone** - when truly stable
- ✅ **Clearer expectations** - users know what they're getting

---

## 📊 Version Philosophy

### v0.x (Beta) - Current Phase
**Characteristics**:
- Active development and experimentation
- Breaking changes are expected between minor versions
- Feature additions and workflow refinements
- Documentation evolves with the product
- Used primarily by maintainers and early adopters

**What to expect**:
- ⚠️ Folder structures may change (like 02-review removal)
- ⚠️ Command workflows may be redesigned
- ⚠️ Configuration formats may evolve
- ✅ Migration guides provided for breaking changes
- ✅ Rapid bug fixes and improvements

### v1.0 (Stable) - Future Milestone
**Criteria for v1.0**:
1. **External adoption** - Used by multiple teams beyond maintainers
2. **Stable workflow** - No breaking changes for 6+ months
3. **Complete documentation** - All features fully documented
4. **Battle-tested** - Proven in production across different project types
5. **External contributors** - Community involvement
6. **Integration maturity** - Works with common toolchains (CI/CD, etc.)

**Timeline**: When ready, not rushed. Could be 3-12 months.

### Post v1.0 (Mature)
- Semantic versioning strictly followed
- Breaking changes only in major versions
- Long-term support for stable releases
- Backward compatibility prioritized

---

## 🗺️ Roadmap to v1.0

### Phase 1: Foundation (v0.1-v0.5) ← **We are here (v0.3)**
- ✅ Core commands working
- ✅ Basic workflow established
- 🔄 Refining folder structure
- 🔄 Adding essential features (auto-assignment, progress tracking)
- 🔄 Fixing workflow pain points

### Phase 2: Refinement (v0.6-v0.9)
- Workflow stabilization (fewer breaking changes)
- Team collaboration features
- Advanced integrations (Jira, Linear, etc.)
- Performance optimizations
- Comprehensive testing

### Phase 3: Maturity (v0.10-v0.99)
- External beta testers
- Real-world usage feedback
- Documentation polish
- Migration tools for older versions
- Long-running stability period (6+ months)

### Phase 4: v1.0 Release
- Feature freeze and polish
- Final breaking changes resolved
- Commitment to semantic versioning
- Long-term support announced

---

## 📋 What Changed in v0.3.0?

This version reset comes with significant improvements:

### Breaking Changes
1. **Folder structure simplified**:
   - Removed `02-review/` (review is a process, not a state)
   - Renumbered all subsequent folders

2. **Workflow separation**:
   - `/setup-prd` now moves to Ready (not In-Progress)
   - `/code-prd` moves Ready → In-Progress on first run
   - Clear separation between setup and implementation

3. **Review behavior**:
   - No longer moves files automatically
   - Updates metadata only
   - User explicitly runs `/setup-prd` when ready

### New Features
- Auto-assignment to current GitHub user
- Progress tracking with checkpoints
- Dependency validation before starting work

See [CHANGELOG.md](../CHANGELOG.md) for complete details.

---

## 🔄 npm dist-tags Strategy

To help users choose the right version:

```bash
# Latest (current)
npm install -g claude-prd-workflow@latest  # → v0.3.0

# Legacy (for existing v2.x users)
npm install -g claude-prd-workflow@legacy  # → v2.8.0
```

### dist-tags
- `latest` → v0.3.0+ (active development)
- `legacy` → v2.8.0 (frozen, security fixes only)

Users on v2.8.0 can stay there until they're ready to migrate. We'll provide security fixes for v2.8.0 for the next 3 months.

---

## 🤝 For Users

### If you're on v2.8.0 or earlier

**Option 1: Migrate to v0.3.0 (Recommended)**
- Follow [MIGRATION_v2_to_v0.md](./MIGRATION_v2_to_v0.md)
- Benefits from latest features and fixes
- Actively supported

**Option 2: Stay on v2.8.0**
- Run: `npm install -g claude-prd-workflow@legacy`
- Security fixes until January 2026
- No new features
- Eventually must migrate

### If you're new

Just install normally:
```bash
npm install -g claude-prd-workflow
```

You'll get v0.3.0 automatically.

---

## 💡 Lessons Learned

### What went wrong with v2.8?
1. **Too excited about features** - Bumped minor version for every feature
2. **No version policy** - Didn't define what warrants a version bump
3. **Ignored project maturity** - Version didn't match reality

### What we're doing differently
1. **Slower version increments** - Major features = minor bump
2. **Clear criteria for v1.0** - Won't rush to "stable"
3. **Honest about beta status** - v0.x clearly signals work-in-progress
4. **Better communication** - This document exists!

---

## 📞 Questions?

- **"Will there be more breaking changes?"** - Yes, but we'll provide migration guides and clear documentation
- **"When will v1.0 be ready?"** - When it's truly stable, not before. Quality > speed.
- **"Can I stay on v2.8?"** - Yes, but v0.3+ is actively developed
- **"How do I migrate?"** - See [MIGRATION_v2_to_v0.md](./MIGRATION_v2_to_v0.md)

---

**Maintained by**: Yassine Hamou-Tahra  
**Last Updated**: 2025-10-28  
**Status**: Active
