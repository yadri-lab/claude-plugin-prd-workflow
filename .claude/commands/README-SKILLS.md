# Skills Ajoutés - PRD Workflow

## 🎯 Skills Implémentés

### ✅ `/context` - Afficher le Contexte Actuel

**Objectif**: Savoir où tu en es après une interruption

**Utilisation**:
```bash
/context              # Vue standard
/context --verbose    # Vue détaillée avec commits récents
/context -v          # Raccourci verbose
```

**Ce que ça affiche**:
- 🌿 Branche actuelle
- 📄 PRD en cours (ID + titre)
- 📊 Progression (X/Y tâches)
- 🎯 Prochaine tâche
- 💻 Status Git (commits, fichiers modifiés)
- 📂 Location (worktree ou main)

**Cas d'usage**:
- Après une réunion
- Après une interruption
- Au début de la journée
- Avant le standup

**ROI**: 50 min/dev/jour × 5 devs = 4h/jour économisées

---

### ✅ `/cleanup` - Nettoyage Intelligent

**Objectif**: Garder un repo propre et organisé

**Utilisation**:
```bash
/cleanup                    # Nettoyage interactif
/cleanup --dry-run         # Voir ce qui serait nettoyé
/cleanup --yes             # Auto-approve (attention!)
/cleanup --branches-only   # Seulement les branches
/cleanup --worktrees-only  # Seulement les worktrees
/cleanup --files-only      # Seulement les fichiers temp
/cleanup --aggressive      # Mode agressif (unmerged old branches)
```

**Ce qu'il nettoie**:
- 🌿 Branches mergées (feat/PRD-XXX)
- 📂 Worktrees obsolètes (dans worktrees/)
- 📄 Fichiers temporaires:
  - `*.tmp.md`
  - `*_temp.md`, `*-temp.md`
  - `temp-*.md`
  - `draft-*.md`
  - `scratch-*.md`
  - `test-*.md`
  - `backup-*.md`, `*.backup.md`
  - Fichiers Vim (`.*.swp`, `.*.swo`)

**Sécurités**:
- ✅ Confirmation requise
- ✅ Branches protégées (main, master, develop)
- ✅ Seulement les branches mergées par défaut
- ✅ Fichiers temp de 1+ jour seulement
- ✅ Warnings pour PRD status mismatch

**ROI**: Hygiène projet + libération espace disque

---

## 🚀 Prochains Skills à Implémenter

### Tier 1 - Quick Wins Restants

1. **`/switch`** - Changer de PRD rapidement
   - Effort: 2 jours
   - ROI: 15 min/dev/jour

2. **`/notify`** - Notifications Slack/Discord/Teams
   - Effort: 1 jour
   - ROI: -30 min délai review

3. **`/standup`** - Génération rapport daily
   - Effort: 2 jours
   - ROI: 5 min/dev/jour

4. **`/metrics`** - Dashboard vélocité
   - Effort: 2 jours
   - ROI: Décisions data-driven

---

## 📝 Notes d'Implémentation

Les skills sont des **commandes slash** documentées dans `.claude/commands/`.

Chaque fichier `.md` contient:
- **Frontmatter**: name, description, category
- **Purpose**: Objectif du skill
- **Usage**: Exemples d'utilisation
- **Workflow**: Étapes d'exécution détaillées
- **Configuration**: Options configurables
- **Examples**: Cas d'usage réels

Les commandes slash sont **des guides** pour Claude Code, pas du code exécutable directement.
Claude les lit et implémente la logique en temps réel.

---

## 🎓 Comment Utiliser

1. **Taper la commande**: `/context` ou `/cleanup` dans Claude Code
2. **Claude lit le guide**: Il parse le fichier .md
3. **Claude exécute**: Il suit les étapes décrites
4. **Résultat**: Tu obtiens l'output attendu

---

## ⚙️ Configuration

Les skills respectent la configuration dans `.claude/config.json`:

```json
{
  "prd_workflow": {
    "context": {
      "show_progress_bar": true,
      "show_git_status": true,
      "show_next_task": true,
      "recent_commits_count": 3
    },
    "cleanup": {
      "min_temp_file_age_days": 1,
      "min_branch_age_days": 0,
      "min_worktree_age_days": 7,
      "aggressive_branch_age_days": 30,
      "auto_gc": true,
      "protected_branches": ["main", "master", "develop", "staging", "production"]
    }
  }
}
```

---

**Version**: 0.4.2  
**Date**: 2025-11-07  
**Auteur**: CTO Mindset - Pragmatic Tools
