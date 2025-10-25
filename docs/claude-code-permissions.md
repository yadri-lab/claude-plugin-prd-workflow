# Configuration des Permissions Claude Code

## 🎯 Problème : Demandes d'autorisation répétées

Par défaut, Claude Code demande l'autorisation pour :
- ✅ **Lecture** : Aucune autorisation (read_file, grep, ls)
- ⚠️ **Commandes Bash** : Autorisation requise (git, npm, etc.)
- ⚠️ **Modifications** : Autorisation requise (write, edit)

**Résultat** : Tu dois approuver chaque nouvelle commande, projet par projet.

---

## ✅ Solution 1 : Autoriser toutes les commandes Bash (Global)

### Méthode A : Via le fichier de configuration

Créer/éditer `~/.config/Claude/settings.json` :

```json
{
  "allowedTools": [
    "Bash"
  ],
  "defaultMode": "acceptEdits"
}
```

**Effet** :
- ✅ Toutes les commandes Bash autorisées sans approbation
- ✅ Toutes les modifications de fichiers acceptées automatiquement
- ✅ Fonctionne dans **tous les projets**

### Méthode B : Via la commande `/permissions`

Dans Claude Code, tape :
```
/permissions
```

Puis sélectionne :
1. **"Allow all Bash commands"**
2. **"Accept all edits for this session"**
3. Coche **"Remember for all projects"**

---

## ✅ Solution 2 : Autoriser des commandes spécifiques

Si tu veux être plus sélectif, autorise uniquement les commandes courantes :

```json
{
  "allowedTools": [
    "Bash(git)",
    "Bash(npm)",
    "Bash(node)",
    "Bash(ls)",
    "Bash(cd)",
    "Bash(mkdir)",
    "Bash(cp)",
    "Bash(mv)",
    "Bash(rm)",
    "Bash(cat)",
    "Bash(echo)",
    "Bash(find)",
    "Bash(grep)"
  ],
  "defaultMode": "acceptEdits"
}
```

**Avantage** : Plus sécurisé, mais tu devras ajouter de nouvelles commandes au fur et à mesure.

---

## ✅ Solution 3 : Mode "Bypass" (Maximum de liberté)

⚠️ **Attention** : À utiliser uniquement si tu fais confiance à 100% à Claude.

```json
{
  "defaultMode": "bypassPermissions"
}
```

**Effet** :
- ✅ **Aucune** demande d'autorisation
- ✅ Claude peut exécuter n'importe quelle commande
- ✅ Claude peut modifier n'importe quel fichier

**Risque** : Claude pourrait théoriquement exécuter des commandes destructrices (rare, mais possible).

---

## 📁 Où placer le fichier de configuration ?

### Linux/macOS
```bash
# Créer le fichier de config
mkdir -p ~/.config/Claude
nano ~/.config/Claude/settings.json
```

### Windows
```powershell
# Créer le fichier de config
mkdir $env:APPDATA\Claude
notepad $env:APPDATA\Claude\settings.json
```

### Contenu recommandé (équilibre sécurité/productivité)

```json
{
  "allowedTools": [
    "Bash"
  ],
  "defaultMode": "acceptEdits",
  "projectPermissions": {
    "*": {
      "allowedTools": ["Bash"],
      "autoApprove": true
    }
  }
}
```

**Explication** :
- `"allowedTools": ["Bash"]` → Toutes les commandes Bash autorisées
- `"defaultMode": "acceptEdits"` → Modifications de fichiers acceptées automatiquement
- `"projectPermissions": { "*": ... }` → S'applique à **tous les projets** (cross-project)

---

## 🔧 Configuration par Projet (Override)

Si tu veux des règles différentes pour un projet spécifique :

```bash
# Dans ton projet
mkdir -p .claude
nano .claude/permissions.json
```

**Exemple** : Projet open source (plus strict)
```json
{
  "allowedTools": [
    "Bash(git)",
    "Bash(npm test)",
    "Bash(npm run build)"
  ],
  "defaultMode": "default"
}
```

**Exemple** : Projet personnel (très permissif)
```json
{
  "defaultMode": "bypassPermissions"
}
```

---

## 🚀 Configuration Recommandée pour ce Plugin

Pour utiliser le **PRD Workflow Manager** sans friction :

```json
{
  "allowedTools": [
    "Bash(git)",
    "Bash(npm)",
    "Bash(node)",
    "Bash(mkdir)",
    "Bash(cp)",
    "Bash(mv)",
    "Bash(ls)",
    "Bash(find)",
    "Bash(grep)",
    "Bash(cat)"
  ],
  "defaultMode": "acceptEdits",
  "projectPermissions": {
    "*": {
      "allowedTools": ["Bash"],
      "autoApprove": true
    }
  }
}
```

**Pourquoi ces commandes ?**
- `git` → Pour `/code-prd` (créer branches, worktrees)
- `npm` → Pour installer dépendances dans worktrees
- `mkdir/cp/mv` → Pour organiser les PRDs
- `grep/find` → Pour chercher dans les PRDs

---

## 🎯 Workflow Recommandé

### 1. Configuration Initiale (une fois)

```bash
# Créer la config globale
cat > ~/.config/Claude/settings.json << 'EOF'
{
  "allowedTools": ["Bash"],
  "defaultMode": "acceptEdits",
  "projectPermissions": {
    "*": {
      "allowedTools": ["Bash"],
      "autoApprove": true
    }
  }
}
EOF

# Redémarrer Claude Code
```

### 2. Vérifier que ça marche

Ouvre **n'importe quel projet** et tape :
```
/create-prd
```

Claude devrait :
- ✅ Créer les dossiers sans demander
- ✅ Créer le fichier PRD sans demander
- ✅ Exécuter `git status` sans demander

### 3. Ajuster si besoin

Si tu vois encore des demandes :
```
/permissions
```

Puis coche **"Remember for all projects"** pour chaque outil.

---

## 🔒 Sécurité : Dois-je m'inquiéter ?

### Risques Faibles (Recommandé)

Autoriser `"Bash"` avec `"acceptEdits"` :
- ✅ Claude est généralement prudent
- ✅ Tu peux toujours voir les commandes avant qu'elles s'exécutent
- ✅ Git te permet de revenir en arrière si besoin
- ⚠️ Évite sur des serveurs de production

### Risques Moyens (À éviter)

Mode `"bypassPermissions"` :
- ⚠️ Claude pourrait théoriquement exécuter `rm -rf /`
- ⚠️ Aucune vérification avant exécution
- ✅ OK pour des projets sandbox/test

### Best Practice

**Environnement de développement local** :
```json
{ "allowedTools": ["Bash"], "defaultMode": "acceptEdits" }
```

**Serveur de production** :
```json
{ "defaultMode": "default" }  // Demande toujours
```

---

## 📚 Ressources

- [Documentation officielle Claude Code IAM](https://docs.claude.com/fr/docs/claude-code/iam)
- [Guide des permissions](https://docs.claude.com/fr/docs/claude-code/permissions)
- [Troubleshooting permissions](troubleshooting.md#permissions)

---

## 🎯 TL;DR (Résumé)

**Pour autoriser un maximum de commandes cross-project** :

### Option 1 : Équilibrée (Recommandée)

1. Créer `~/.config/Claude/settings.json` (Linux/macOS) ou `%APPDATA%\Claude\settings.json` (Windows) :
   ```json
   {
     "allowedTools": ["Bash"],
     "defaultMode": "acceptEdits",
     "projectPermissions": {
       "*": { "allowedTools": ["Bash"], "autoApprove": true }
     }
   }
   ```

2. Redémarrer Claude Code

**Résultat** :
- ✅ Plus de demandes pour les commandes Bash
- ✅ Plus de demandes pour les modifications de fichiers
- ✅ Fonctionne dans **tous tes projets**

### Option 2 : Mode Agressif (Maximum de liberté)

1. Créer le même fichier avec :
   ```json
   {
     "permissionMode": "bypassPermissions",
     "allowedTools": ["*"],
     "defaultMode": "bypassPermissions",
     "autoApprove": true,
     "projectPermissions": {
       "*": {
         "allowedTools": ["*"],
         "autoApprove": true,
         "bypassAllPermissions": true
       }
     },
     "security": {
       "requireApproval": false,
       "confirmDestructiveActions": false
     }
   }
   ```

2. Redémarrer Claude Code

**Résultat** :
- ✅ **AUCUNE** demande d'autorisation
- ✅ Claude peut tout faire sans approbation
- ⚠️ À utiliser uniquement en environnement de développement local

---

## 🚀 Installation Automatique (Windows)

Le fichier a été créé automatiquement à :
```
C:\Users\yassine.hamou-tahra\AppData\Roaming\Claude\settings.json
```

**Redémarre Claude Code** et profite ! 🎉

