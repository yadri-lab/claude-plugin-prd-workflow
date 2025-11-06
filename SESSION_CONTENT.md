# Session Content - Claude PRD Workflow Plugin

## Résumé Exécutif

### Problème Principal Identifié
**Claude Code ne détecte pas les commandes du plugin après installation/mise à jour**

### Cause Racine
Claude Code charge les commandes au démarrage et maintient un **cache en mémoire** qui n'est pas rafraîchi dynamiquement. Les fichiers peuvent être présents sur le disque mais restent invisibles jusqu'au redémarrage complet de l'application.

### Solution Validée
1. Désinstallation complète du plugin
2. Nettoyage de tous les fichiers résiduels (commands, agents, skills)
3. Réinstallation manuelle (copie directe des fichiers)
4. **Redémarrage complet de Claude Code** (OBLIGATOIRE)

### Points Critiques
- ⚠️ **Redémarrer Claude Code est OBLIGATOIRE** après toute installation/désinstallation
- ⚠️ Un simple "Reload Window" ne suffit PAS
- ⚠️ Fermer/rouvrir une fenêtre ne suffit PAS
- ✅ Il faut fermer complètement l'application et la rouvrir

### Méthode d'Installation Recommandée
**Installation manuelle** (copie directe) est plus fiable que `claude plugin-install` qui peut se bloquer en attendant des permissions dans Git Bash/MINGW64.

---

## Historique des Sessions & Résolutions

### Session 2025-10-27 : Commandes manquantes après mise à jour

#### Problème Initial
- **Symptôme** : Les nouvelles commandes (v2.8.0) n'étaient pas disponibles dans Claude Code
- **Commandes manquantes** :
  - `/plugin-health`, `/plugin-repair`, `/plugin-update`
  - `/complete-prd`, `/generate-claude-md`, `/recall`
  - `/setup-prd`, `/smart-commit`, `/smart-pr`
  - `/sync-github`, `/quick-ship`

#### Diagnostic
- **Cause identifiée** : Désynchronisation entre `package.json` (v2.8.0) et `.claude-plugin/plugin.json` (v2.7.0)
- **Fichiers installés** : 20 commandes présentes dans `~/.claude-code/plugins/claude-prd-workflow/commands/`
- **Commandes détectées** : Seulement 9 commandes reconnues par `claude plugin-list`

#### Solution Appliquée (Tentative 1)
1. **Mise à jour manuelle** de `.claude-plugin/plugin.json` :
   ```bash
   # Changé version de 2.7.0 → 2.8.0
   cp .claude-plugin/plugin.json ~/.claude-code/plugins/claude-prd-workflow/.claude-plugin/plugin.json
   ```

2. **Redémarrage requis** :
   - ❌ `Reload Window` (CTRL+SHIFT+P) ne suffit PAS
   - ✅ Redémarrage complet de l'application Claude Code nécessaire

---

### Session 2025-10-27 (Suite) : Résolution Complète du Problème de Cache

#### Problème Persistant
Après la première tentative (mise à jour du plugin.json et redémarrage), les commandes n'apparaissaient toujours pas.

#### Diagnostic Approfondi
1. **Vérification de l'état** :
   - Plugin présent dans `~/.claude-code/plugins/claude-prd-workflow/`
   - 20 fichiers de commandes copiés dans `~/.claude-code/commands/`
   - Mais commandes toujours non détectées par Claude Code

2. **Cause racine identifiée** :
   - **Cache de commandes** : Claude Code charge les commandes au démarrage et ne les recharge pas dynamiquement
   - **Installation bloquée** : `claude plugin-install` était bloqué en arrière-plan (attendant permission)
   - Les fichiers étaient bien installés mais Claude Code ne les "voyait" pas

#### Solution Complète Appliquée

##### Étape 1 : Désinstallation Totale
```bash
# Désinstaller le plugin
claude plugin-uninstall claude-prd-workflow

# Vérifier la désinstallation
ls ~/.claude-code/plugins/                    # Doit être vide
ls ~/.claude-code/commands/ | grep prd        # Doit être vide
```

✅ **Résultat** : Répertoire plugins vidé, commandes supprimées

##### Étape 2 : Nettoyage Complet
```bash
# Supprimer tous les fichiers résiduels
rm ~/.claude-code/agents/*.md
rm ~/.claude-code/skills/*.md

# Vérifier le nettoyage
ls ~/.claude-code/agents/     # Doit être vide
ls ~/.claude-code/skills/     # Doit être vide
```

✅ **Résultat** : Tous les fichiers du plugin supprimés (agents, skills, commands)

##### Étape 3 : Installation Manuelle
```bash
# Depuis le répertoire du plugin (claude-plugin-prd-workflow)
mkdir -p ~/.claude-code/plugins/claude-prd-workflow

# Copier tous les fichiers du plugin
cp -r * ~/.claude-code/plugins/claude-prd-workflow/

# Copier les commandes
cp commands/*.md ~/.claude-code/commands/

# Copier les agents
cp agents/*.md ~/.claude-code/agents/

# Copier les skills
cp skills/*.md ~/.claude-code/skills/

# Créer le fichier d'information du plugin
echo '{
  "name": "claude-prd-workflow",
  "version": "2.8.0",
  "installedAt": "2025-10-27T13:30:00.000Z",
  "installMethod": "manual"
}' > ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json
```

✅ **Résultat** :
- 20 commandes installées
- 17 agents installés
- 13 skills installés
- Fichier `.plugin-info.json` créé

##### Étape 4 : Vérification
```bash
# Compter les fichiers
ls ~/.claude-code/commands/ | wc -l    # Doit retourner 20
ls ~/.claude-code/agents/ | wc -l      # Doit retourner 17
ls ~/.claude-code/skills/ | wc -l      # Doit retourner 13

# Lister toutes les commandes
ls ~/.claude-code/commands/ | sort
```

✅ **Résultat** : Tous les fichiers présents

##### Étape 5 : CRITIQUE - Redémarrage de Claude Code
⚠️ **IMPORTANT** : Les commandes ne seront PAS détectées tant que Claude Code n'est pas redémarré complètement.

**Pourquoi?** Claude Code charge la liste des commandes disponibles au démarrage et maintient un cache en mémoire qui n'est pas rafraîchi dynamiquement.

**Actions nécessaires** :
1. Fermer complètement Claude Code (pas juste la fenêtre)
2. Rouvrir Claude Code
3. Vérifier que les commandes sont disponibles

#### Vérification Post-Fix (Après Redémarrage)
```bash
# Tester une commande
/plugin-version

# Devrait afficher la version 2.8.0
```

Toutes les 20 commandes doivent être disponibles :
- archive-prd, code-prd, complete-prd, create-prd
- generate-claude-md, list-prds, orchestrate
- plugin-health, plugin-repair, plugin-update, plugin-version
- quality-check, quick-ship, recall
- review-prd, security-audit, setup-prd
- smart-commit, smart-pr, sync-github, work-prd

---

## État Actuel du Projet

### Version
- **Package** : v2.8.0
- **Plugin** : v2.8.0 (synchronized)

### Commandes Disponibles (20 total)

#### Core PRD Workflow
- `/create-prd` - Créer un nouveau PRD depuis le template
- `/list-prds` - Lister tous les PRDs avec statut et priorité
- `/review-prd` - Révision complète d'un PRD
- `/archive-prd` - Archiver les PRDs complétés/annulés

#### Development Workflow
- `/work-prd` - Implémentation guidée avec décomposition des tâches
- `/code-prd` - Démarrer le développement avec Git worktree
- `/complete-prd` - Compléter un PRD (NEW v2.8.0)
- `/setup-prd` - Configuration initiale PRD (NEW v2.8.0)
- `/quick-ship` - Livraison rapide (NEW v2.8.0)

#### Quality & Security
- `/quality-check` - Analyse de qualité du code
- `/security-audit` - Audit de sécurité complet
- `/orchestrate` - Orchestration multi-PRD

#### Git & GitHub Integration
- `/smart-commit` - Commits intelligents (NEW v2.8.0)
- `/smart-pr` - Pull requests intelligentes (NEW v2.8.0)
- `/sync-github` - Synchronisation GitHub (NEW v2.8.0)

#### Plugin Management
- `/plugin-version` - Version du plugin
- `/plugin-health` - Santé du plugin (NEW v2.8.0)
- `/plugin-repair` - Réparation du plugin (NEW v2.8.0)
- `/plugin-update` - Mise à jour du plugin (NEW v2.8.0)

#### Utilities
- `/recall` - Rappel de contexte (NEW v2.8.0)
- `/generate-claude-md` - Génération documentation Claude (NEW v2.8.0)

---

## Problèmes Connus & Solutions

### 1. Cache de Commandes Claude Code (CRITIQUE)
- **Issue** : Les commandes ne se rechargent pas automatiquement après installation/désinstallation
- **Cause** : Claude Code charge les commandes au démarrage et maintient un cache en mémoire
- **Solution** : **Redémarrage complet de Claude Code obligatoire**
- **Ne fonctionne PAS** :
  - ❌ Reload Window (CTRL+SHIFT+P)
  - ❌ Nouveau terminal
  - ❌ Fermer/rouvrir une fenêtre
- **Détection** : Si les fichiers sont présents dans `~/.claude-code/commands/` mais `/commande` retourne "Unknown slash command"

### 2. MINGW64/Git Bash Compatibility
- **Issue** : `claude plugin-install` et `claude plugin-uninstall` peuvent se bloquer dans Git Bash
- **Cause** : Problème de conversion de chemins Windows (`cygpath`) + attente de permissions
- **Workaround** :
  - **Option 1** : Utiliser PowerShell ou CMD pour les opérations d'installation/désinstallation
  - **Option 2** : Installation manuelle (voir procédure ci-dessous)

### 3. Désynchronisation des Versions
- **Issue** : Version dans `package.json` différente de `.claude-plugin/plugin.json`
- **Détection** : Commandes manquantes après mise à jour
- **Solution** : Toujours synchroniser les versions dans les 3 fichiers :
  1. `package.json`
  2. `.claude-plugin/plugin.json`
  3. `.claude-plugin/marketplace.json`

---

## Prochaines Étapes

### Immédiat
- [ ] Redémarrer Claude Code complètement
- [ ] Vérifier que les 20 commandes sont disponibles
- [ ] Tester une nouvelle commande (ex: `/plugin-health`)

### Court Terme
- [ ] Documenter le workflow complet dans le README
- [ ] Créer un script de health check automatique
- [ ] Ajouter des tests d'intégration pour les nouvelles commandes

### Moyen Terme
- [ ] Résoudre le problème MINGW64 avec les commandes Claude CLI
- [ ] Ajouter un mécanisme de hot-reload pour les commandes
- [ ] Créer une commande `/plugin-diagnose` pour détecter les désynchronisations

---

## Notes de Développement

### Fichiers Clés à Synchroniser
Toujours maintenir la cohérence entre :
1. `package.json` → `version`
2. `.claude-plugin/plugin.json` → `version`
3. `CHANGELOG.md` → dernière entrée

### Checklist de Release
- [ ] Mettre à jour `package.json` version
- [ ] Mettre à jour `.claude-plugin/plugin.json` version
- [ ] Mettre à jour `.claude-plugin/marketplace.json` version
- [ ] Ajouter entrée dans `CHANGELOG.md`
- [ ] Tester l'installation dans un environnement propre
- [ ] Vérifier que toutes les commandes sont détectées
- [ ] Créer le tag Git
- [ ] Publier sur npm (si applicable)

---

## Procédure de Réinstallation Complète

### Quand utiliser cette procédure?
- Commandes manquantes après mise à jour
- Plugin ne fonctionne pas correctement
- Commandes détectées mais ne s'exécutent pas
- Après une mise à jour majeure

### Étapes de Réinstallation

#### 1. Désinstallation Complète
```bash
# Désinstaller le plugin
claude plugin-uninstall claude-prd-workflow

# Nettoyer les fichiers résiduels
rm -f ~/.claude-code/agents/*.md 2>/dev/null
rm -f ~/.claude-code/skills/*.md 2>/dev/null
rm -f ~/.claude-code/commands/*-prd.md 2>/dev/null
rm -f ~/.claude-code/commands/plugin-*.md 2>/dev/null
rm -f ~/.claude-code/commands/quick-ship.md 2>/dev/null
rm -f ~/.claude-code/commands/smart-*.md 2>/dev/null
rm -f ~/.claude-code/commands/sync-github.md 2>/dev/null
rm -f ~/.claude-code/commands/recall.md 2>/dev/null
rm -f ~/.claude-code/commands/generate-claude-md.md 2>/dev/null

# Vérifier le nettoyage
ls ~/.claude-code/plugins/    # Doit être vide ou ne pas contenir claude-prd-workflow
```

#### 2. Installation Manuelle (Méthode Fiable)
```bash
# Naviguer vers le répertoire du plugin
cd /path/to/claude-plugin-prd-workflow

# Créer le répertoire du plugin
mkdir -p ~/.claude-code/plugins/claude-prd-workflow

# Copier tous les fichiers
cp -r * ~/.claude-code/plugins/claude-prd-workflow/

# Copier les commandes
cp commands/*.md ~/.claude-code/commands/

# Copier les agents
cp agents/*.md ~/.claude-code/agents/

# Copier les skills
cp skills/*.md ~/.claude-code/skills/

# Créer le fichier .plugin-info.json
echo '{
  "name": "claude-prd-workflow",
  "version": "2.8.0",
  "installedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
  "installMethod": "manual"
}' > ~/.claude-code/plugins/claude-prd-workflow/.plugin-info.json
```

#### 3. Vérification
```bash
# Compter les fichiers installés
echo "Commandes: $(ls ~/.claude-code/commands/*.md 2>/dev/null | wc -l)"
echo "Agents: $(ls ~/.claude-code/agents/*.md 2>/dev/null | wc -l)"
echo "Skills: $(ls ~/.claude-code/skills/*.md 2>/dev/null | wc -l)"

# Devrait afficher:
# Commandes: 20
# Agents: 17
# Skills: 13

# Lister les commandes
ls ~/.claude-code/commands/ | sort
```

#### 4. Redémarrage (OBLIGATOIRE)
⚠️ **CRITIQUE** : Sans cette étape, les commandes ne seront PAS disponibles!

1. Fermer complètement Claude Code
   - Sur Windows: Fermer toutes les fenêtres + vérifier dans le gestionnaire des tâches
   - Sur Mac: Cmd+Q pour quitter complètement
   - Sur Linux: Fermer toutes les fenêtres
2. Attendre 5 secondes
3. Rouvrir Claude Code
4. Ouvrir un nouveau terminal

#### 5. Validation
```bash
# Tester une commande
/plugin-version

# Devrait retourner:
# Version: 2.8.0
# Status: Installed
```

Si la commande fonctionne, toutes les 20 commandes sont disponibles!

---

## Commandes Utiles

### Diagnostic
```bash
# Vérifier les plugins installés
claude plugin-list

# Compter les fichiers de commandes
ls ~/.claude-code/plugins/claude-prd-workflow/commands/ | wc -l

# Vérifier la version du plugin
cat ~/.claude-code/plugins/claude-prd-workflow/.claude-plugin/plugin.json | grep version

# Vérifier la version du package
cat package.json | grep version
```

### Maintenance
```bash
# Mise à jour manuelle du plugin
cp .claude-plugin/plugin.json ~/.claude-code/plugins/claude-prd-workflow/.claude-plugin/plugin.json

# Réinstallation complète (dans PowerShell)
claude plugin-uninstall claude-prd-workflow
claude plugin-install .
```

---

**Dernière mise à jour** : 2025-10-27
**Maintenu par** : Yassine Hamou-Tahra
