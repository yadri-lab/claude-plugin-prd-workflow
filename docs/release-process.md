# Release Process

Ce guide explique comment publier une nouvelle version du plugin sur **GitHub** et **npm** simultanément.

## Workflow de mise à jour

```
Code modifié → Bump version → Commit → Tag → Push → npm publish → GitHub release
```

**Important** : npm et GitHub sont **indépendants**. Une mise à jour sur GitHub ne met PAS automatiquement à jour npm. Il faut publier sur les deux.

---

## Processus complet (étape par étape)

### 1. Faire vos modifications

Éditez les fichiers, ajoutez des features, corrigez des bugs, etc.

```bash
# Exemple : éditer un fichier
code commands/review-prd.md

# Tester localement
```

### 2. Mettre à jour le CHANGELOG.md

Ajoutez vos changements dans `CHANGELOG.md` :

```markdown
## [1.1.0] - 2025-11-01

### Added
- New command `/clone-prd` to duplicate existing PRDs
- Support for custom review dimensions

### Fixed
- Bug in worktree creation on Windows
- Typo in quality-check agent

### Changed
- Updated minimum test coverage to 75%
```

### 3. Incrémenter la version

**Option A : Manuellement**

Éditez `package.json` :
```json
{
  "version": "1.1.0"  // Changez ici
}
```

**Option B : Avec npm (recommandé)**

```bash
# Patch (1.0.0 → 1.0.1) - Pour bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - Pour nouvelles features
npm version minor

# Major (1.0.0 → 2.0.0) - Pour breaking changes
npm version major
```

La commande `npm version` fait automatiquement :
- ✅ Met à jour `package.json`
- ✅ Crée un commit git
- ✅ Crée un tag git

### 4. Commit (si pas fait par npm version)

Si vous avez édité manuellement :

```bash
git add .
git commit -m "chore: Bump version to 1.1.0"
```

### 5. Créer le tag Git

```bash
# Si npm version n'a pas créé le tag
git tag v1.1.0

# Ou avec un message détaillé
git tag -a v1.1.0 -m "Release v1.1.0 - New clone-prd command"
```

### 6. Push vers GitHub

```bash
# Push le code
git push origin main

# Push le tag (important !)
git push origin v1.1.0

# Ou push tous les tags en même temps
git push origin --tags
```

### 7. Publier sur npm

```bash
# Vérifier ce qui sera publié
npm publish --dry-run

# Publier
npm publish
```

**Important** : npm publie la version dans `package.json`. Si vous oubliez de bump la version, npm refusera avec une erreur "version already exists".

### 8. Créer la release GitHub

**Option A : Via interface GitHub**
1. Aller sur https://github.com/Yassinello/claude-prd-workflow/releases
2. Cliquer "Draft a new release"
3. Choisir le tag `v1.1.0`
4. Titre : `v1.1.0 - New clone-prd command`
5. Description : Copier depuis CHANGELOG.md
6. Publier

**Option B : Via GitHub CLI (plus rapide)**

```bash
gh release create v1.1.0 \
  --title "v1.1.0 - New clone-prd command" \
  --notes "$(cat <<'EOF'
## What's New

### Added
- New command `/clone-prd` to duplicate existing PRDs
- Support for custom review dimensions

### Fixed
- Bug in worktree creation on Windows
- Typo in quality-check agent

**Full Changelog**: https://github.com/Yassinello/claude-prd-workflow/blob/main/CHANGELOG.md
EOF
)"
```

---

## Vérification

Après publication, vérifier :

### Sur npm
```bash
npm view claude-prd-workflow version
# Devrait afficher : 1.1.0

# Tester l'installation
npm install -g claude-prd-workflow@latest
```

### Sur GitHub
- Release visible : https://github.com/Yassinello/claude-prd-workflow/releases
- Tag visible : https://github.com/Yassinello/claude-prd-workflow/tags

---

## Cas particuliers

### Hotfix urgent (bug critique)

```bash
# 1. Fix le bug
# 2. Bump patch version
npm version patch  # 1.1.0 → 1.1.1

# 3. Push immédiatement
git push origin main --tags

# 4. Publish npm immédiatement
npm publish

# 5. GitHub release (peut attendre)
gh release create v1.1.1 --title "v1.1.1 - Hotfix" --notes "Fixed critical bug in /work-prd"
```

### Prérelease (beta/alpha)

```bash
# Version beta
npm version 1.2.0-beta.1

# Publish avec tag beta
npm publish --tag beta

# Les gens installent avec
npm install -g claude-prd-workflow@beta
```

### Rollback (annuler une version)

**Attention** : On ne peut pas supprimer une version npm après 72h.

```bash
# Dans les 72h
npm unpublish claude-prd-workflow@1.1.0

# Après 72h : publier une nouvelle version fixée
npm version 1.1.1
npm publish
```

---

## Checklist de release

Avant de publier, vérifier :

- [ ] Tests passent (si vous en avez)
- [ ] CHANGELOG.md à jour
- [ ] Version incrémentée dans package.json
- [ ] Commit créé
- [ ] Tag créé (v1.x.x)
- [ ] Push vers GitHub (code + tag)
- [ ] npm publish réussi
- [ ] GitHub release créée
- [ ] Installation testée : `npm install -g claude-prd-workflow@latest`
- [ ] Plugin fonctionne : `/list-prds` dans Claude Code

---

## Automatisation (futur)

### Option 1 : Script bash

Créer `scripts/release.sh` :

```bash
#!/bin/bash
set -e

echo "🚀 Release process starting..."

# 1. Version bump
echo "📝 Current version: $(node -p "require('./package.json').version")"
read -p "New version (e.g., 1.1.0): " VERSION

# 2. Update version
npm version $VERSION --no-git-tag-version

# 3. Update CHANGELOG (manuel)
echo "⏸️  Update CHANGELOG.md then press enter..."
read

# 4. Commit & tag
git add .
git commit -m "chore: Release v$VERSION"
git tag v$VERSION

# 5. Push
git push origin main --tags

# 6. npm publish
npm publish

# 7. GitHub release
gh release create v$VERSION --title "v$VERSION" --notes-file RELEASE_NOTES.md

echo "✅ Release v$VERSION complete!"
```

Utilisation :
```bash
chmod +x scripts/release.sh
./scripts/release.sh
```

### Option 2 : GitHub Actions (automatique)

Créer `.github/workflows/publish.yml` :

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

Avec ce workflow :
1. Tu push un tag : `git push origin v1.1.0`
2. GitHub Actions publie automatiquement sur npm
3. GitHub Actions crée automatiquement la release

**Setup** :
1. Aller dans Settings > Secrets > Actions
2. Ajouter `NPM_TOKEN` avec ton token npm

---

## Résumé rapide

**Workflow le plus simple** :

```bash
# 1. Coder vos changements
# 2. Mettre à jour CHANGELOG.md

# 3. Tout en une commande
npm version minor && git push origin main --tags && npm publish

# 4. Créer GitHub release
gh release create $(git describe --tags) --title "Release $(git describe --tags)" --notes "See CHANGELOG.md"
```

---

## Questions fréquentes

### Q : Si je push sur GitHub, npm est automatiquement mis à jour ?
**R** : Non. GitHub et npm sont complètement indépendants. Il faut publier sur les deux.

### Q : Dans quel ordre publier ?
**R** : L'ordre recommandé est :
1. Push vers GitHub (code + tag)
2. Puis npm publish
3. Puis GitHub release

Comme ça, si npm publish échoue, vous pouvez corriger avant de créer la release GitHub.

### Q : Que se passe-t-il si j'oublie de publier sur npm ?
**R** : Les gens qui installent via npm auront l'ancienne version. Ils pourront quand même cloner depuis GitHub pour avoir la dernière version.

### Q : Peut-on automatiser complètement ?
**R** : Oui avec GitHub Actions (voir section Automatisation ci-dessus).

---

**Need help?** Open an issue: https://github.com/Yassinello/claude-prd-workflow/issues
