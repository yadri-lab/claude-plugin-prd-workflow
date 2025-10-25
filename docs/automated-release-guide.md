# Guide de Release Automatisé

Le plugin utilise **GitHub Actions** pour automatiser la publication sur npm et la création de releases GitHub.

## 🎯 Workflow Automatisé

Quand tu push un tag Git, **2 workflows se déclenchent automatiquement** :

1. **`.github/workflows/publish-npm.yml`** → Publie sur npm
2. **`.github/workflows/create-release.yml`** → Crée la GitHub Release

```
git tag v1.1.0
git push origin v1.1.0
    ↓
GitHub Actions détecte le tag
    ↓
┌─────────────────────┐     ┌──────────────────────┐
│ Publish to npm      │     │ Create GitHub Release│
│ - Vérifie version   │     │ - Extrait changelog  │
│ - npm publish       │     │ - Crée la release    │
│ - Provenance        │     │ - Auto release notes │
└─────────────────────┘     └──────────────────────┘
    ↓                           ↓
✅ Publié sur npm          ✅ Release sur GitHub
```

---

## 📋 Setup Initial (À FAIRE UNE SEULE FOIS)

### Étape 1 : Ajouter le NPM_TOKEN aux secrets GitHub

1. **Générer un token npm** (si pas déjà fait) :
   - Aller sur https://www.npmjs.com/settings/tokens
   - Cliquer "Generate New Token" → "Classic Token"
   - Sélectionner **"Automation"** (pour CI/CD)
   - Copier le token (commence par `npm_...`)

2. **Ajouter le token aux secrets GitHub** :
   - Aller sur https://github.com/Yassinello/claude-prd-workflow/settings/secrets/actions
   - Cliquer "New repository secret"
   - **Name**: `NPM_TOKEN`
   - **Secret**: Coller le token npm
   - Cliquer "Add secret"

3. **Vérifier** :
   - Le secret `NPM_TOKEN` doit apparaître dans la liste
   - ✅ Setup terminé !

---

## 🚀 Comment Faire une Release (Workflow Simplifié)

### Option 1 : Avec npm version (Recommandé)

```bash
# 1. Faire vos modifications de code
git add .
git commit -m "feat: Add new feature"

# 2. Mettre à jour CHANGELOG.md
code CHANGELOG.md
# Ajouter une section ## [1.1.0] - 2025-XX-XX

# 3. Bump version (crée automatiquement le tag)
npm version minor  # 1.0.0 → 1.1.0
# ou
npm version patch  # 1.0.0 → 1.0.1

# 4. Push le tag
git push origin --tags

# 5. Push le code
git push origin main

# ✅ C'est tout ! GitHub Actions fait le reste :
#    - Publie sur npm automatiquement
#    - Crée la GitHub Release automatiquement
```

### Option 2 : Manuellement (si tu préfères)

```bash
# 1. Éditer package.json manuellement
# "version": "1.1.0"

# 2. Commit
git add .
git commit -m "chore: Bump version to 1.1.0"

# 3. Créer le tag
git tag v1.1.0

# 4. Push
git push origin main
git push origin v1.1.0

# ✅ GitHub Actions publie automatiquement
```

---

## 📊 Vérifier que ça fonctionne

### Après avoir pushé le tag :

1. **GitHub Actions** :
   - Aller sur https://github.com/Yassinello/claude-prd-workflow/actions
   - Tu devrais voir 2 workflows en cours :
     - ✅ "Publish to npm"
     - ✅ "Create GitHub Release"
   - Attendre qu'ils soient verts (1-2 minutes)

2. **npm** :
   ```bash
   npm view claude-prd-workflow version
   # Devrait afficher la nouvelle version
   ```

3. **GitHub Release** :
   - Aller sur https://github.com/Yassinello/claude-prd-workflow/releases
   - La nouvelle release devrait apparaître

---

## 🔍 Que Fait Chaque Workflow ?

### `publish-npm.yml`

1. **Vérifie la version** : Compare `package.json` avec le tag (doit matcher)
2. **Publie sur npm** : `npm publish --provenance --access public`
3. **Provenance** : Ajoute la preuve que le package vient bien de ce repo GitHub (sécurité)
4. **Summary** : Affiche un résumé avec le lien npm

**Échec possible** :
- ❌ Version mismatch : `package.json` dit "1.0.0" mais tag est "v1.1.0"
- ❌ Version déjà publiée : npm refuse si version existe déjà
- ❌ Token invalide : Le `NPM_TOKEN` est expiré ou invalide

### `create-release.yml`

1. **Extrait le changelog** : Lit `CHANGELOG.md` et trouve la section pour cette version
2. **Crée la release** : Utilise `softprops/action-gh-release`
3. **Auto release notes** : GitHub génère automatiquement les notes depuis les commits
4. **Summary** : Affiche le changelog

---

## ⚠️ Important : Règles à Respecter

### ✅ À FAIRE

- **Toujours** mettre à jour `CHANGELOG.md` avant de créer un tag
- **Toujours** incrémenter la version dans `package.json`
- **Toujours** utiliser un tag au format `v1.2.3` (avec le "v")
- **Toujours** vérifier que `package.json` version = tag version

### ❌ À NE PAS FAIRE

- ❌ Ne **JAMAIS** push un tag si `package.json` n'est pas à jour
- ❌ Ne **JAMAIS** réutiliser un tag existant
- ❌ Ne **JAMAIS** push un tag sans commit correspondant

---

## 🐛 Dépannage

### Problème 1 : Workflow échoue avec "version mismatch"

**Erreur** :
```
❌ Error: package.json version (1.0.0) does not match tag version (1.1.0)
```

**Solution** :
```bash
# 1. Supprimer le tag local et distant
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0

# 2. Mettre à jour package.json
npm version 1.1.0 --no-git-tag-version

# 3. Commit
git add package.json
git commit -m "chore: Bump version to 1.1.0"

# 4. Recréer le tag
git tag v1.1.0
git push origin main --tags
```

### Problème 2 : npm publish échoue avec "403 Forbidden"

**Cause** : Token npm invalide ou expiré

**Solution** :
1. Régénérer le token sur https://www.npmjs.com/settings/tokens
2. Mettre à jour le secret `NPM_TOKEN` sur GitHub
3. Re-trigger le workflow :
   ```bash
   # Supprimer et recréer le tag
   git tag -d v1.1.0
   git push origin :refs/tags/v1.1.0
   git tag v1.1.0
   git push origin v1.1.0
   ```

### Problème 3 : "version already published"

**Cause** : La version existe déjà sur npm

**Solution** :
```bash
# Incrémenter encore la version
npm version patch  # 1.1.0 → 1.1.1
git push origin --tags
```

### Problème 4 : Workflow ne se déclenche pas

**Vérifier** :
1. Le tag commence bien par "v" : `v1.1.0` ✅ pas `1.1.0` ❌
2. Le tag a bien été pushé : `git push origin v1.1.0`
3. Les workflows sont dans `.github/workflows/` (pas ailleurs)

---

## 🧪 Tester Sans Publier

### Dry-run local

Avant de push un tag, tester localement :

```bash
# Vérifier ce qui serait publié
npm pack
ls -lh claude-prd-workflow-*.tgz

# Vérifier le contenu
tar -tzf claude-prd-workflow-*.tgz

# Nettoyer
rm claude-prd-workflow-*.tgz
```

### Test avec prerelease

Pour tester le workflow sans publier de version stable :

```bash
# Créer une version beta
npm version 1.1.0-beta.1

# Push
git push origin --tags

# GitHub Actions publiera sur npm avec tag "beta"
# Les gens doivent installer avec : npm install -g claude-prd-workflow@beta
```

---

## 📝 Exemple Complet de Release

Voici un exemple complet de A à Z :

```bash
# ========== Vous avez codé une nouvelle feature ==========

# 1. Voir l'état actuel
git status
npm view claude-prd-workflow version  # Actuellement : 1.0.0

# 2. Mettre à jour le CHANGELOG
code CHANGELOG.md
# Ajouter :
# ## [1.1.0] - 2025-11-15
# ### Added
# - New command /clone-prd

# 3. Commit les changements
git add .
git commit -m "feat: Add clone-prd command"

# 4. Bump version (crée le tag automatiquement)
npm version minor
# Output: v1.1.0

# 5. Vérifier
git log --oneline -1  # Devrait montrer "1.1.0"
git tag -l            # Devrait montrer v1.1.0

# 6. Push tout
git push origin main
git push origin v1.1.0

# ========== GitHub Actions travaille ==========
# Attendre 1-2 minutes

# 7. Vérifier sur GitHub Actions
# https://github.com/Yassinello/claude-prd-workflow/actions

# 8. Vérifier sur npm
npm view claude-prd-workflow version
# Output: 1.1.0 ✅

# 9. Vérifier sur GitHub
# https://github.com/Yassinello/claude-prd-workflow/releases
# La release v1.1.0 devrait être là ✅

# 10. Tester l'installation
npm install -g claude-prd-workflow@latest
# Devrait installer 1.1.0 ✅

# ========== FIN ==========
```

---

## 🎉 Avantages de l'Automatisation

### Avant (manuel)
```bash
git push
npm publish                    # ❌ Tu peux oublier
gh release create v1.1.0       # ❌ Tu peux oublier
```

### Après (automatique)
```bash
git push origin v1.1.0
# ✅ npm publish automatique
# ✅ GitHub release automatique
# ✅ Impossible d'oublier !
```

### Bénéfices
- 🎯 **Zéro oubli** : Impossible d'oublier npm publish
- 🔒 **Sécurisé** : npm provenance prouve que le package vient de GitHub
- 📊 **Traçable** : Tout est loggé dans GitHub Actions
- ⚡ **Rapide** : 1-2 minutes au lieu de 5-10 minutes manuelles
- 🤖 **Cohérent** : Toujours le même process, zéro erreur humaine

---

## 📚 Ressources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)

---

**Besoin d'aide ?** Ouvrir une issue : https://github.com/Yassinello/claude-prd-workflow/issues
