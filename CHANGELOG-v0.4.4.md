# Changelog - v0.4.4

**Date**: 2025-01-14
**Type**: Feature Enhancement
**Focus**: Automatic Context Detection for Worktree Commands

---

## 🎯 What's New

### Automatic Context Detection

Run `/ship`, `/debugging`, and `/hotfix` **directly from worktree directories** - no need to orchestrate from Main!

#### The Problem (v0.4.3)
```bash
# ❌ Old workflow - required orchestration from Main
~/watchora$ /ship "Fix bug" --worktree
# Then: cd worktrees/hotfix/ to work
# Then: cd back to Main for /ship --complete
```

**Pain point**: Developers with dedicated Cursor windows on worktrees had to constantly switch back to Main for orchestration.

#### The Solution (v0.4.4)
```bash
# ✅ New workflow - works from anywhere!
~/watchora/worktrees/hotfix$ /ship "Fix bug"
# Auto-detects worktree context
# Works in current directory
# /ship --complete works from here too!
```

**Benefit**: Stay in your worktree window the entire workflow - no more directory switching!

---

## 🔥 Key Features

### 1. Context Detection Script

**File**: `.claude/scripts/context-detection.sh`

Automatically detects:
- `MAIN` - Running from main repository
- `WORKTREE_HOTFIX` - Running from worktrees/hotfix/
- `WORKTREE_DEBUG` - Running from worktrees/debug/
- `UNKNOWN` - Other locations

```bash
detect_execution_context() {
  # Detects current context based on pwd
  # Handles Windows and Unix paths
  # Returns context type
}
```

### 2. Updated Commands

#### `/ship` - Automatic Worktree Mode

```bash
# From Main
~/watchora$ /ship "Fix" --worktree  # Explicit flag
~/watchora$ /ship "Fix"              # Works on Main

# From Worktree (NEW!)
~/watchora/worktrees/hotfix$ /ship "Fix"  # Auto-detects worktree!
```

**Behavior**:
- Detects if running from `worktrees/hotfix/`
- Automatically enables worktree mode
- No `--worktree` flag needed
- All operations stay in current directory

#### `/debugging` - Automatic Worktree Mode

```bash
# From Main
~/watchora$ /debugging "Issue" --worktree  # Explicit flag
~/watchora$ /debugging "Issue"              # Read-only on Main

# From Worktree (NEW!)
~/watchora/worktrees/debug$ /debugging "Issue"  # Auto-detects worktree!
```

**Behavior**:
- Detects if running from `worktrees/debug/`
- Automatically enables worktree mode
- No `--worktree` flag needed
- Session works in current directory

#### `/hotfix` - Seamless from Anywhere

```bash
# From Main
~/watchora$ /hotfix "Fix"  # Always uses worktree

# From Worktree (NEW!)
~/watchora/worktrees/hotfix$ /hotfix "Fix"  # Even simpler!
```

**Benefit**: `/hotfix` now works seamlessly whether called from Main or worktree.

---

## 📋 Files Changed

### New Files (1)
- `.claude/scripts/context-detection.sh` - Context detection logic

### Modified Files (3)
- `.claude/commands/ship.md` - Added context detection docs, version 0.4.4
- `.claude/commands/debugging.md` - Added context detection docs, version 0.4.4
- `.claude/commands/hotfix.md` - Updated with new workflow, version 0.4.4

### Configuration Files (2)
- `package.json` - Version bump to 0.4.4
- `CHANGELOG.md` - Added v0.4.4 entry

---

## 🔄 Migration Guide

### For Users with Dedicated Worktree Windows

**Before (v0.4.3)**:
```bash
# Window 1: Main (for orchestration)
~/watchora$ /ship "Fix" --worktree
~/watchora$ /ship --complete

# Window 2: Worktree (for coding only)
~/watchora/worktrees/hotfix$ # Just code here
```

**After (v0.4.4)**:
```bash
# Window 1: Main (for merges, PRDs)
~/watchora$ # Use for other tasks

# Window 2: Worktree (for everything!)
~/watchora/worktrees/hotfix$ /ship "Fix"      # Start here
~/watchora/worktrees/hotfix$ # Code here
~/watchora/worktrees/hotfix$ /ship --complete # Complete here
```

### Backward Compatibility

**100% backward compatible!**

All v0.4.3 workflows still work:
```bash
# These all still work exactly the same
~/watchora$ /ship "Fix"                    # Main workflow
~/watchora$ /ship "Fix" --worktree         # Explicit worktree
~/watchora$ /debugging "Issue"             # Main investigation
~/watchora$ /debugging "Issue" --worktree  # Explicit worktree
```

---

## 💡 Use Cases

### Use Case 1: Dedicated Worktree Window

**Setup**:
```bash
# One-time: Open Cursor on worktree
cd ~/watchora/worktrees/hotfix/
code .
```

**Workflow**:
```bash
# All commands in worktree window
~/watchora/worktrees/hotfix$ /ship "Fix auth"
~/watchora/worktrees/hotfix$ # Code...
~/watchora/worktrees/hotfix$ /ship --complete

# Ready for next fix immediately
~/watchora/worktrees/hotfix$ /ship "Fix UI"
```

**Benefit**: Never leave worktree window!

### Use Case 2: Quick Context Switching

```bash
# Main window - merge PRD
~/watchora$ /code-prd PRD-123

# Meanwhile in worktree window - quick fix
~/watchora/worktrees/hotfix$ /ship "Fix typo"
~/watchora/worktrees/hotfix$ /ship --complete

# Back to Main window - continue PRD
~/watchora$ # PRD work unaffected
```

**Benefit**: Parallel work without interference!

### Use Case 3: Debugging Sessions

```bash
# Worktree window for debugging
~/watchora/worktrees/debug$ /debugging "Memory leak"
~/watchora/worktrees/debug$ # Add logging, reproduce, test
~/watchora/worktrees/debug$ /debugging --resolve

# Immediately start next session
~/watchora/worktrees/debug$ /debugging "Performance issue"
```

**Benefit**: Seamless debugging workflow!

---

## 🔧 Technical Details

### Context Detection Algorithm

```bash
# 1. Get current directory
current_dir=$(pwd)

# 2. Normalize path (handle Windows/Unix)
current_dir=$(realpath "$current_dir")

# 3. Check for worktree patterns
if [[ "$current_dir" == *"/worktrees/hotfix"* ]]; then
  echo "WORKTREE_HOTFIX"
elif [[ "$current_dir" == *"/worktrees/debug"* ]]; then
  echo "WORKTREE_DEBUG"
elif [ "$current_dir" == "$git_root" ]; then
  echo "MAIN"
fi
```

### Integration Points

Commands use context detection to:
1. Determine default behavior (Main vs Worktree)
2. Skip unnecessary directory switches
3. Execute all operations in current context
4. Return to parking branch (not Main) after completion

---

## 📊 Impact

### Before v0.4.4
- ⚠️ Orchestration required from Main
- ⚠️ Constant directory switching
- ⚠️ Two-window workflow was awkward

### After v0.4.4
- ✅ Commands work from anywhere
- ✅ Stay in worktree window
- ✅ Natural two-window workflow

---

## 🎬 Examples

### Example 1: Simple Fix from Worktree

```bash
# Cursor window: worktrees/hotfix/
$ pwd
~/watchora/worktrees/hotfix

$ /ship "Fix typo in login"

🔍 Detected: Running from worktree hotfix/
🎯 Auto-enabling worktree mode
✅ Started in current directory
📝 Branch: hotfix/fix-typo-login

# Code...

$ /ship --complete
✅ Merged to main
📍 Still in: worktrees/hotfix/
```

### Example 2: Debugging from Worktree

```bash
# Cursor window: worktrees/debug/
$ pwd
~/watchora/worktrees/debug

$ /debugging "OAuth timeout"

🔍 Detected: Running from worktree debug/
🎯 Auto-enabling worktree mode
✅ Started in current directory
📝 Branch: debug/oauth-timeout

# Investigate, add logging, test...

$ /debugging --resolve
✅ PR created
📍 Still in: worktrees/debug/
```

### Example 3: Multiple Fixes in Sequence

```bash
# All from worktree window
~/watchora/worktrees/hotfix$ /ship "Fix A"
~/watchora/worktrees/hotfix$ /ship --complete

~/watchora/worktrees/hotfix$ /ship "Fix B"
~/watchora/worktrees/hotfix$ /ship --complete

~/watchora/worktrees/hotfix$ /ship "Fix C"
~/watchora/worktrees/hotfix$ /ship --complete

# Never left the worktree!
```

---

## ⚠️ Breaking Changes

**None!** This is a pure enhancement with full backward compatibility.

---

## 🐛 Bug Fixes

None - this is a feature-only release.

---

## 📝 Documentation Updates

All command documentation updated with:
- New "Context Detection" sections
- New "Workflow: From Worktree Directly" sections
- Updated examples showing both workflows
- Version bumps to 0.4.4

---

## 🔮 Future Improvements

Potential enhancements for v0.4.5+:
- Visual indicator in prompt showing current context
- Auto-sync optimization for worktree context
- Support for custom worktree locations
- Context-aware command suggestions

---

## 👥 Credits

**Requested by**: @yassinello
**Problem**: "J'aimerais pouvoir lancer les hotfix depuis une autre fenetre cursor qui est ouverte sur le worktree hotfix"
**Implemented by**: Claude Code
**Date**: 2025-01-14

---

## 📦 Installation

```bash
# Update to v0.4.4
npm install -g claude-prd-workflow@0.4.4

# Or latest
npm install -g claude-prd-workflow@latest
```

---

## 🔗 Related

- **v0.4.3**: Hybrid worktree system introduction
- **v0.4.2**: Critical bug fixes
- **v0.4.1**: Command cleanup

---

**Status**: ✅ Ready for deployment
**Version**: 0.4.4
**Type**: Feature Enhancement
**Breaking Changes**: None
