# Permissions suggérées pour PRD Workflow Manager

Ce plugin inclut des **permissions ultra-permissives** recommandées pour une expérience sans interruption avec Claude Code.

## 🎯 Objectif

Éliminer 99% des demandes d'autorisation en autorisant toutes les opérations courantes, tout en **bloquant uniquement les suppressions de données** (rm, del, git clean, etc.).

## 🚀 Installation automatique (recommandée)

Lors de l'installation du plugin via `claude plugin-install`, les permissions suggérées dans `.claude/settings.local.json` sont **automatiquement proposées** et peuvent être fusionnées avec votre configuration globale.

## ⚙️ Installation manuelle

Si vous préférez configurer manuellement ou si l'installation automatique n'a pas fonctionné:

### Option 1: Copier-coller complet (le plus simple)

```bash
# Backup de votre config actuelle
cp ~/.claude-code/settings.json ~/.claude-code/settings.json.backup

# Copier les permissions suggérées
cp ~/.claude-code/plugins/claude-prd-workflow/.claude/settings.local.json ~/.claude-code/settings.json
```

### Option 2: Fusionner avec votre config existante

Ouvrez `~/.claude-code/settings.json` et ajoutez/fusionnez le contenu de `.claude/settings.local.json`:

```json
{
  "version": "1.0.0",
  "defaultMode": "acceptEdits",
  "permissions": {
    "allow": [
      // Copiez toute la section "allow" de settings.local.json
      "Read",
      "Write",
      "Edit",
      // ... etc
    ],
    "deny": [
      // Copiez toute la section "deny" de settings.local.json
      "Bash(rm:*)",
      "Bash(rmdir:*)",
      // ... etc
    ],
    "ask": []
  }
}
```

### Option 3: Script de fusion automatique

```bash
# Depuis le répertoire du plugin
node -e "
const fs = require('fs');
const path = require('path');

const globalPath = path.join(process.env.HOME || process.env.USERPROFILE, '.claude-code/settings.json');
const localPath = '.claude/settings.local.json';

const global = JSON.parse(fs.readFileSync(globalPath, 'utf8'));
const local = JSON.parse(fs.readFileSync(localPath, 'utf8'));

// Fusion intelligente
global.defaultMode = local.defaultMode;
global.permissions = global.permissions || {};
global.permissions.allow = [...new Set([...(global.permissions.allow || []), ...local.permissions.allow])];
global.permissions.deny = [...new Set([...(global.permissions.deny || []), ...local.permissions.deny])];
global.permissions.ask = [];

fs.writeFileSync(globalPath, JSON.stringify(global, null, 2));
console.log('✅ Permissions fusionnées avec succès!');
"
```

## 📋 Ce qui est autorisé

### ✅ Opérations autorisées sans confirmation
- **Lecture/Écriture**: tous les fichiers (sauf secrets/.ssh/.aws)
- **Git**: tous les `git` sauf `clean`, `filter-branch`, `reflog expire`
- **NPM/Node**: install, publish, scripts, etc.
- **Bash**: 90+ commandes courantes (ls, cat, grep, curl, docker, etc.)
- **MCP**: tous les serveurs MCP (GitHub, Railway, filesystem, etc.)
- **Slash commands**: toutes les 20 commandes du plugin
- **Web**: recherche et fetch illimités

### ❌ Opérations bloquées (protection contre suppression)
- `rm`, `rmdir`, `del`, `Remove-Item`
- `git clean`
- `rm -rf /`, `rm -rf C:`, etc. (protection système)
- Lecture de secrets (.env.production, credentials, .ssh, .aws, etc.)
- `sudo`, `chmod 777`, `format`, `mkfs`

### ⚠️ Pas de liste "ask" = zéro confirmation
La liste `ask` est vide, donc **aucune confirmation supplémentaire** ne sera demandée pour les opérations non bloquées.

## 🔄 Redémarrage nécessaire

Après toute modification de `~/.claude-code/settings.json`:

1. **Fermez complètement Claude Code** (toutes les fenêtres)
2. Vérifiez dans le gestionnaire de tâches que le processus est terminé
3. Attendez 5 secondes
4. Rouvrez Claude Code
5. Ouvrez un nouveau terminal

Sans ce redémarrage, les nouvelles permissions ne seront pas appliquées.

## 🛡️ Sécurité

Cette configuration est **très permissive** mais:
- ✅ Bloque les suppressions accidentelles de fichiers
- ✅ Protège les secrets et credentials
- ✅ Empêche les opérations système destructrices
- ✅ Bloque sudo et élévation de privilèges

**Recommandation**: Utilisez cette configuration uniquement sur vos machines de développement personnelles. Pour des environnements partagés ou production, affinez les permissions selon vos besoins.

## 🐛 Dépannage

### Les permissions ne s'appliquent pas
- Vérifiez que le fichier est à `~/.claude-code/settings.json` (pas `~/.claude/`)
- Redémarrez complètement Claude Code
- Vérifiez la syntaxe JSON avec `node -e "JSON.parse(require('fs').readFileSync('~/.claude-code/settings.json'))"`

### J'ai encore des demandes d'autorisation
- Vérifiez que `defaultMode: "acceptEdits"` est bien défini
- Vérifiez que `ask: []` est vide
- Assurez-vous que les wildcards sont bien avec `:*` (ex: `Bash(git:*)`)

### Je veux autoriser les suppressions
Retirez ces lignes de la section `deny`:
```json
"Bash(rm:*)",
"Bash(rmdir:*)",
"Bash(del:*)",
"Bash(Remove-Item:*)",
"Bash(git clean:*)"
```

### Je veux revenir en arrière
```bash
# Restaurer votre backup
mv ~/.claude-code/settings.json.backup ~/.claude-code/settings.json
```

## 📚 Documentation officielle

- [Claude Code Settings](https://docs.claude.com/en/docs/claude-code/settings)
- [Handling Permissions](https://docs.claude.com/en/api/agent-sdk/permissions)

## 💡 Astuce

Pour vérifier rapidement vos permissions actuelles:
```bash
cat ~/.claude-code/settings.json | jq '.permissions'
```

---

**Questions?** Ouvrez une issue sur [GitHub](https://github.com/Yassinello/claude-prd-workflow/issues)



