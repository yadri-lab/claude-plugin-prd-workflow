# Worktree Workflow Guide - v0.4.3

Guide complet pour utiliser les worktrees hybrides avec flexibilité et efficacité.

## 🎯 Philosophie

**Principe**: Start simple (Main), scale up (Worktree) when needed.

- 🚀 **Main** pour quick fixes rapides
- 🛡️ **Worktree** pour isolation quand nécessaire
- 🔄 **Migration** facile si le fix grossit
- 🎨 **Choix** à chaque étape

## 📦 Setup Initial (Une fois)

```bash
# Créer les worktrees permanents
$ /worktree setup

✅ worktrees/hotfix/ created
✅ worktrees/debug/ created
✅ Configuration initialized
```

**Résultat**:
```
claude-plugin-prd-workflow/
├── worktrees/
│   ├── hotfix/     (permanent, pour /ship --worktree)
│   └── debug/      (permanent, pour /debugging --worktree)
└── .claude/
    └── config-worktrees.json
```

## 🎨 Arbre de Décision

### Quand utiliser Main vs Worktree ?

```
Nouveau fix à faire
      │
      ├─── Petit fix ? (< 5 fichiers, < 100 lignes, < 30 min)
      │    │
      │    └─── OUI → /ship "Fix X" (Main)
      │         │
      │         ├─── Reste petit → /ship --complete
      │         └─── Devient gros → /ship --to-worktree
      │
      └─── Gros fix ? (refactor, multi-fichiers)
           │
           └─── OUI → /ship "Fix X" --worktree
                      ou /hotfix "Fix X"
```

### Quand utiliser Main vs Worktree pour Debug ?

```
Bug à investiguer
      │
      ├─── Investigation read-only ? (logs, code reading)
      │    │
      │    └─── OUI → /debugging "Issue" (Main)
      │         │
      │         ├─── Pas de fix → /debugging --resolve
      │         └─── Besoin fix → /debugging --to-worktree
      │
      └─── Reproduction / Fix nécessaire ?
           │
           └─── OUI → /debugging "Issue" --worktree
```

## 🚀 Workflows par Scenario

### Scenario 1: Quick Fix Ultra-Rapide

**Contexte**: Typo, petit changement évident

```bash
# Sur Main
$ /ship "Fix typo in error message"

✅ Quick fix on Main
📝 Branch: quickship/fix-typo

# Modification: 1 fichier, 2 lignes
# Pas de warning

$ /ship --complete

✅ Committed
✅ PR merged
🧹 Done!
```

**Durée**: 2-5 minutes
**Localisation**: Main uniquement

### Scenario 2: Fix qui Commence Petit, Devient Gros

**Contexte**: Fix commence simple mais révèle plus de work

```bash
# Commence sur Main
$ /ship "Fix dark mode issues"

✅ Working on Main

# Après 15 minutes...
# 6 fichiers modifiés, 120 lignes

⚠️  LARGE FIX DETECTED
- 6 files changed
- 120 lines modified
- 18 minutes elapsed

💡 Suggest migration to worktree

$ /ship --to-worktree

🔄 Migrating to worktree...

✅ Moved to worktrees/hotfix/
📂 Branch: hotfix/fix-dark-mode
💻 Open: code worktrees/hotfix/

# Continue tranquillement dans worktree

$ /ship --complete

✅ Done from worktree!
```

**Durée**: 30-60 minutes
**Localisation**: Main → Worktree (migration)

### Scenario 3: Gros Fix Direct en Worktree

**Contexte**: Refactor ou changement multi-fichiers dès le départ

```bash
# Direct en worktree
$ /ship "Refactor authentication module" --worktree

🔍 Checking worktree hotfix/...
🔄 Syncing (3 commits behind)...
✅ Synced with main

✅ Started in worktrees/hotfix/
📝 Branch: hotfix/refactor-auth
🔒 Locked worktree

# Ou version courte:
$ /hotfix "Refactor authentication module"

# Développement isolé
# Pas de limites

$ /ship --complete

✅ Done!
```

**Durée**: 1-4 heures
**Localisation**: Worktree uniquement

### Scenario 4: Debugging Read-Only

**Contexte**: Investigation sans modifications de code

```bash
# Sur Main
$ /debugging "OAuth timeout in production"

🔍 Debugging on Main (read-only)
📝 Session: .prds/debug-sessions/2025-01-14-oauth-timeout.md

# Investigation:
# - Lecture logs
# - Analyse code
# - Check config

# Trouvé: Config issue
$ /debugging --resolve

💬 Status?
2. Resolved without fix (config issue)

✅ Documented
Root cause: Redis TTL too short
Solution: Updated prod config
```

**Durée**: 15-60 minutes
**Localisation**: Main uniquement

### Scenario 5: Debugging avec Reproduction & Fix

**Contexte**: Bug complexe nécessitant reproduction et fix

```bash
# En worktree
$ /debugging "Memory leak in WebSocket handler" --worktree

🔍 Checking worktree debug/...
🔄 Syncing...
✅ Synced

✅ Started in worktrees/debug/
📝 Branch: debug/memory-leak-websocket
📄 Session doc created

# Investigation:
# - Reproduction du bug
# - Tests hypothèses
# - Debug logging
# - Fix implementation

$ /debugging --resolve

💬 Status?
1. Resolved with fix

✅ Committed fix
📤 PR #236 created
📝 Session documented
🧹 Worktree cleaned up
```

**Durée**: 1-4 heures
**Localisation**: Worktree uniquement

### Scenario 6: Deux Fixes Urgents en Parallèle

**Contexte**: Fix en cours dans worktree, nouveau fix urgent arrive

```bash
# Fix 1 déjà en cours dans worktree
$ /ship "Fix A" --worktree
# En cours de travail...

# Fix 2 urgent arrive
$ /ship "Critical bug B" --worktree

❌ Fix already in progress in worktrees/hotfix/

Current: hotfix/fix-a
Options:
1. Complete current
2. Work on Main (quick)
3. Abort current

# Choix 2: Fix urgent sur Main
$ /ship "Critical bug B"

✅ Working on Main

# Fix rapide, pas de blocage
$ /ship --complete

✅ Done!

# Retour au fix 1
$ cd worktrees/hotfix/
$ /ship --complete

✅ Done!
```

**Durée**: Variable
**Localisation**: Worktree + Main en parallèle

### Scenario 7: Long Debug avec Pause

**Contexte**: Investigation longue avec interruption

```bash
# Debug session en worktree
$ /debugging "Complex race condition" --worktree

✅ Started investigation

# Après 2 heures, meeting...
$ /debugging --pause

💾 Paused
🔄 Returned to parking branch

# Lendemain matin
$ /debugging --resume

📋 Paused sessions:
1. debug/complex-race-condition (2h ago)

Resume: 1

✅ Resumed
Continue debugging!

# Trouve solution
$ /debugging --resolve

✅ Done!
```

**Durée**: Multiple sessions
**Localisation**: Worktree avec pause/resume

## 🔄 Routine Quotidienne

### Morning Routine

```bash
# 1. Sync worktrees avec main
$ /worktree sync

🔄 Syncing all worktrees...

worktrees/hotfix/: ✅ Synced (3 commits)
worktrees/debug/: ✅ Already up-to-date

# 2. Check status
$ /worktree status

📊 Worktree Status
hotfix: 🔓 IDLE
debug: 🔓 IDLE

# 3. Ready to work!
```

### Evening Cleanup

```bash
# Check pour worktrees obsolètes
$ /worktree prune

# Ou laisser auto-cleanup faire son travail
```

## 📊 Matrice de Décision

| Type de Tâche | Durée | Fichiers | Commande | Localisation |
|---------------|-------|----------|----------|--------------|
| Typo | < 5 min | 1-2 | `/ship "Fix"` | Main |
| Small fix | < 30 min | 2-5 | `/ship "Fix"` | Main |
| Medium fix | 30-60 min | 5-10 | `/ship "Fix"` → `--to-worktree` | Main → Worktree |
| Large fix | > 1h | 10+ | `/ship "Fix" --worktree` | Worktree |
| Refactor | > 1h | Any | `/hotfix "Refactor"` | Worktree |
| Quick debug | < 30 min | 0 | `/debugging "Issue"` | Main |
| Complex debug | > 1h | Any | `/debugging "Issue" --worktree` | Worktree |

## 🎓 Best Practices

### ✅ DO

- ✅ Start simple (Main) pour quick fixes
- ✅ Migrate vers worktree si fix grossit
- ✅ Use worktree direct pour refactors
- ✅ Sync worktrees chaque matin
- ✅ Use `/hotfix` si préférence worktree
- ✅ Documenter debug sessions

### ❌ DON'T

- ❌ Forcer worktree pour petits fixes
- ❌ Ignorer smart warnings sur Main
- ❌ Oublier de sync avant gros travail
- ❌ Laisser worktree locked longtemps
- ❌ Skip documentation de debug

## 🔧 Configuration Avancée

### Ajuster les Seuils

**.claude/config-worktrees.json**:

```json
{
  "warnings": {
    "files_threshold": 5,        // Warning si > 5 fichiers
    "lines_threshold": 100,      // Warning si > 100 lignes
    "time_threshold_minutes": 30 // Warning après 30 min
  },
  "sync": {
    "thresholds": {
      "silent_sync_max_commits": 10,  // Sync auto < 10 commits
      "warn_sync_max_commits": 50,    // Demande si 10-50 commits
      "force_sync_min_commits": 100   // Force sync si > 100
    }
  }
}
```

### Personnalisation par Profil

**Profil "Aggressive Worktree"** (toujours isolé):
```json
{
  "warnings": {
    "files_threshold": 2,
    "lines_threshold": 50,
    "time_threshold_minutes": 15
  }
}
```

**Profil "Lazy Sync"** (sync moins fréquent):
```json
{
  "sync": {
    "thresholds": {
      "silent_sync_max_commits": 20,
      "warn_sync_max_commits": 100,
      "force_sync_min_commits": 200
    }
  }
}
```

## 🐛 Troubleshooting

### Worktree Locked mais Aucun Fix en Cours

```bash
$ /ship "Fix X" --worktree

❌ Locked

# Solution:
$ cd worktrees/hotfix/
$ git status
# Si rien en cours:
$ git checkout hotfix
$ rm .claude-lock

# Ou:
$ /ship --abort  # Force cleanup
```

### Worktree Très Derrière Main

```bash
$ /worktree sync

⚠️  50+ commits behind!

# Force sync
$ /worktree sync --force
```

### Migration Échoue

```bash
$ /ship --to-worktree

❌ Failed

# Vérifier:
1. Uncommitted changes? → Commit first
2. Worktree locked? → Finish current fix
3. Worktree not setup? → /worktree setup
```

## 📚 Référence Rapide

### Commandes Principales

| Commande | Action |
|----------|--------|
| `/worktree setup` | Setup initial |
| `/worktree sync` | Sync tous les worktrees |
| `/worktree status` | Status détaillé |
| `/ship "Fix"` | Quick fix sur Main |
| `/ship "Fix" --worktree` | Fix en worktree |
| `/ship --to-worktree` | Migrer vers worktree |
| `/ship --complete` | Terminer fix |
| `/hotfix "Fix"` | Alias `/ship --worktree` |
| `/debugging "Issue"` | Debug sur Main |
| `/debugging "Issue" --worktree` | Debug en worktree |

### Raccourcis

```bash
# Setup rapide
alias wt-setup="/worktree setup"
alias wt-sync="/worktree sync"
alias wt-status="/worktree status"

# Fixes
alias fix="/ship"
alias fixw="/ship --worktree"
alias hf="/hotfix"

# Debug
alias dbg="/debugging"
alias dbgw="/debugging --worktree"
```

## 🎉 Exemples Réels

### Exemple 1: Journée Typique

```bash
# Matin
$ /worktree sync
✅ All synced

# Fix 1 (petit)
$ /ship "Fix login typo"
$ /ship --complete
✅ Done (5 min)

# Fix 2 (moyen, devient gros)
$ /ship "Fix dark mode"
# ... travail ...
⚠️  Large fix detected
$ /ship --to-worktree
# ... continue ...
$ /ship --complete
✅ Done (45 min)

# Bug investigation
$ /debugging "API timeout"
# ... investigation ...
$ /debugging --resolve
✅ Config issue, documented

# Gros refactor
$ /hotfix "Refactor auth system"
# ... travail ...
$ /ship --complete
✅ Done (2h)
```

**Total**: 4 tâches, 3h de travail, 0 conflits

### Exemple 2: Urgence Production

```bash
# Refactor en cours dans worktree
$ /hotfix "Refactor API"
# En cours...

# BUG URGENT PRODUCTION!
$ /ship "Critical security fix" --worktree

❌ Worktree busy!

# Option: Main pour urgent
$ /ship "Critical security fix"

✅ On Main
# Fix rapide
$ /ship --complete
✅ Merged! (10 min)

# Retour au refactor
$ cd worktrees/hotfix/
$ /ship --complete
✅ Done
```

**Résultat**: Urgent fix sans interrompre long refactor

---

**Version**: 0.4.3
**Plugin**: claude-prd-workflow
**Last Updated**: 2025-01-14
