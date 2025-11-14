# Changelog v0.4.3 - Worktree Hybrides

**Date**: 2025-01-14
**Type**: Feature Release
**Focus**: Worktree management, flexible workflows, intelligent sync

## 🎯 Objectif

Améliorer la parallélisation du développement avec des worktrees permanents ("fixes") pour hotfix et debug, tout en gardant la flexibilité de travailler sur Main pour les petits changements rapides.

## ✨ Nouveautés

### 1. Commande `/worktree` (Nouveau)

Gestion centralisée des worktrees fixes avec sync intelligent.

**Commandes**:
- `/worktree setup` - Setup initial des worktrees hotfix/ et debug/
- `/worktree sync` - Sync intelligent avec main
- `/worktree status` - État détaillé de tous les worktrees
- `/worktree list` - Liste tous les worktrees
- `/worktree prune` - Cleanup des worktrees obsolètes

**Features**:
- ✅ Worktrees permanents: `worktrees/hotfix/` et `worktrees/debug/`
- ✅ Sync intelligent (Option C hybride)
- ✅ Lock files pour éviter collisions
- ✅ Auto-sync avant chaque utilisation

**Seuils de sync intelligent**:
- 0 commits: ✅ Rien à faire
- 1-10 commits: 🔄 Sync silencieux automatique
- 10-50 commits: ⚠️ Propose sync avec preview
- 50+ commits: ❌ Force sync (obligatoire)

### 2. `/ship` avec Support Worktree (Amélioré)

Quick fixes flexibles: Main ou worktree au choix.

**Nouveau comportement**:
- **Défaut**: Travaille sur Main (rapide, simple)
- **Option `--worktree`**: Utilise worktree hotfix/ (isolation)
- **Smart warnings**: Détecte quand fix devient trop gros
- **Migration**: `--to-worktree` pour migrer de Main vers worktree

**Nouvelles options**:
- `--worktree` - Force worktree isolation
- `--to-worktree` - Migre fix actuel vers worktree
- `--complete` - Termine et merge
- `--abort` - Annule fix
- `--status` - Status du fix en cours
- `--pause` - Met en pause
- `--resume` - Reprend fix pausé

**Smart warnings** (sur Main):
- Files: > 5 fichiers modifiés
- Lines: > 100 lignes changées
- Time: > 30 minutes écoulées
→ Suggère migration vers worktree

**Gestion collisions**:
- UN seul fix à la fois dans worktree hotfix/
- Si occupé: propose d'utiliser Main ou de finir fix en cours
- Pas de worktree-2 ou complications

### 3. `/debugging` avec Support Worktree (Amélioré)

Debugging flexible: read-only sur Main ou avec modifs en worktree.

**Nouveau comportement**:
- **Défaut**: Investigation sur Main (read-only)
- **Option `--worktree`**: Worktree debug/ si modifs nécessaires
- **Migration**: `--to-worktree` si besoin de tester un fix
- **Session management**: Documentation structurée

**Nouvelles options**:
- `--worktree` - Force worktree pour debug
- `--to-worktree` - Migre session vers worktree
- `--resolve` - Résout et documente
- `--abort` - Annule session
- `--status` - Status session en cours
- `--pause` - Pause session
- `--resume` - Reprend session
- `--list` - Liste sessions passées

**Documentation automatique**:
- Session docs: `.prds/debug-sessions/YYYY-MM-DD-{issue}.md`
- Hypothèses testées
- Root cause identifiée
- Solution et prévention

### 4. `/hotfix` (Nouveau - Alias)

Alias simple pour `/ship --worktree` - toujours en worktree.

**Usage**:
```bash
/hotfix "Fix X"  ≡  /ship "Fix X" --worktree
```

**Quand utiliser**:
- Préférence pour worktree par défaut
- Refactors ou multi-fichiers
- Plus court à taper

### 5. Infrastructure de Sync Intelligent

**Fichiers créés**:
- `.claude/config-worktrees.json` - Configuration centralisée
- `.claude/scripts/worktree-sync.sh` - Logique de sync réutilisable
- `.claude-lock` - Lock files dans worktrees

**Auto-sync au démarrage**:
- Vérifie divergence avec main
- Applique stratégie intelligente
- Preview des changements si > 10 commits
- Force sync si > 50 commits

**Protection**:
- Skip sync si worktree locked (fix en cours)
- Détecte uncommitted changes
- Warning si parking branch diverge

## 🔄 Modifications

### Commandes Modifiées

| Commande | Avant | Après |
|----------|-------|-------|
| `/ship` | Main uniquement | Main ou worktree (--worktree) |
| `/debugging` | Pas de worktree | Main ou worktree (--worktree) |
| `/context` | N/A | Détecte worktrees fixes |
| `/cleanup` | N/A | Intégration /worktree prune |

### Configuration

**Nouveau fichier**: `.claude/config-worktrees.json`

```json
{
  "worktrees": {
    "hotfix": { "path": "worktrees/hotfix", ... },
    "debug": { "path": "worktrees/debug", ... }
  },
  "sync": {
    "strategy": "intelligent",
    "thresholds": { ... }
  },
  "warnings": { ... }
}
```

## 📋 Workflow Mis à Jour

### Scenario 1: Quick Fix Simple

```bash
# Sur Main (défaut)
$ /ship "Fix typo"
# Rapide, simple

$ /ship --complete
✅ Done
```

### Scenario 2: Fix qui Grossit

```bash
# Commence sur Main
$ /ship "Fix dark mode"

# Après 20 min, warning...
⚠️  LARGE FIX DETECTED

# Migre vers worktree
$ /ship --to-worktree

# Continue en isolation
$ /ship --complete
```

### Scenario 3: Refactor Direct en Worktree

```bash
# Direct en worktree
$ /ship "Refactor auth" --worktree
# ou
$ /hotfix "Refactor auth"

# Isolation complète
$ /ship --complete
```

### Scenario 4: Debugging Read-Only

```bash
# Investigation sur Main
$ /debugging "Check API 500"

# Trouve issue (config)
$ /debugging --resolve
✅ Documented
```

### Scenario 5: Debugging avec Fix

```bash
# Debug en worktree
$ /debugging "Memory leak" --worktree

# Trouve bug, teste fix
$ /debugging --resolve
✅ PR created
```

## 🎨 Structure Mise à Jour

```
claude-plugin-prd-workflow/
├── .claude/
│   ├── commands/
│   │   ├── worktree.md         (NEW)
│   │   ├── hotfix.md           (NEW)
│   │   ├── ship.md             (UPDATED - worktree support)
│   │   └── debugging.md        (UPDATED - worktree support)
│   ├── scripts/
│   │   └── worktree-sync.sh    (NEW)
│   └── config-worktrees.json   (NEW)
│
├── worktrees/                  (NEW - created by /worktree setup)
│   ├── hotfix/                 (permanent worktree)
│   │   ├── .claude-lock        (lock file)
│   │   └── ...
│   ├── debug/                  (permanent worktree)
│   │   ├── .claude-lock        (lock file)
│   │   └── ...
│   └── prd-XXX/                (existing PRD worktrees)
│
└── .prds/
    └── debug-sessions/         (NEW - debug docs)
```

## 🚀 Migration depuis v0.4.2

### Étape 1: Setup Initial

```bash
# Une seule fois
$ /worktree setup

# Crée:
# - worktrees/hotfix/
# - worktrees/debug/
# - Configuration
```

### Étape 2: Utilisation

```bash
# Ancien workflow (v0.4.2):
$ /ship "Fix X"  # Toujours sur Main

# Nouveau workflow (v0.4.3):
$ /ship "Fix X"           # Main (petit fix)
$ /ship "Fix X" --worktree  # Worktree (gros fix)
$ /hotfix "Fix X"          # Worktree (alias)
```

### Étape 3: Maintenance

```bash
# Routine matinale
$ /worktree sync

# Vérifier statut
$ /worktree status
```

## 📊 Bénéfices

### Parallélisation Maximale

```
Fenêtre 1 (Main)           → Merge, review, petits fixes
Fenêtre 2 (worktrees/hotfix) → Fix moyen en cours
Fenêtre 3 (worktrees/debug)  → Debug session
Fenêtre 4 (worktrees/prd-007) → Feature PRD
```

**4 contextes simultanés sans confusion !**

### Flexibilité

- 🎯 Petit fix → Main (rapide)
- 🎯 Fix moyen → Main puis migration si grossit
- 🎯 Gros fix → Worktree direct
- 🐛 Debug read-only → Main
- 🐛 Debug avec fix → Worktree

### Simplicité

- ✅ UN fix à la fois par worktree = pas de confusion
- ✅ Collision → Options claires
- ✅ Sync automatique → Toujours à jour
- ✅ Main propre → Jamais de commits accidentels

## ⚙️ Configuration

### Seuils Recommandés

**.claude/config-worktrees.json**:

```json
{
  "sync": {
    "thresholds": {
      "silent_sync_max_commits": 10,
      "warn_sync_max_commits": 50,
      "force_sync_min_commits": 100
    }
  },
  "warnings": {
    "files_threshold": 5,
    "lines_threshold": 100,
    "time_threshold_minutes": 30
  }
}
```

### Personnalisation

Ajustez selon votre workflow:
- Augmenter `files_threshold` si travaillez sur beaucoup de fichiers
- Réduire `time_threshold_minutes` si voulez warnings plus tôt
- Changer `sync.strategy` entre "intelligent", "aggressive", ou "lazy"

## 🐛 Bug Fixes

- N/A (nouvelle feature)

## 📚 Documentation

### Nouveaux Docs

- `/worktree` command guide
- `/hotfix` alias guide
- Worktree workflow guide
- Sync strategy explanation

### Docs Mis à Jour

- `/ship` - Added worktree options
- `/debugging` - Added worktree options
- Setup guides
- Best practices

## 🔜 Prochaines Étapes (v0.5.0)

Améliorations potentielles:
- Git hooks automatiques (pre-commit sur Main)
- Auto-suggest worktree basé sur keywords
- Metrics sur usage worktrees
- Integration avec /context
- Worktree templates customisables

## 👥 Contributeurs

- @yassinello - Design & Implementation

## 📝 Notes

Cette release améliore significativement la parallélisation du workflow de développement tout en gardant la simplicité pour les petits changements rapides.

**Principe clé**: Start simple (Main), scale up (Worktree) when needed.

---

**Version**: 0.4.3
**Date**: 2025-01-14
**Plugin**: claude-prd-workflow
**Compatible avec**: Claude Code, Cursor
