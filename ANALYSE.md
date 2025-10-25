# Analyse multidimensionnelle — PRD Workflow Manager

**Date**: 2025-10-25  
**Portée**: Synthèse de la finalité, évaluation 360° de la codebase (structure, docs, config, sécurité/qualité, DevOps/CI, UX commandes, extensibilité, compatibilité), et plan d’amélioration concret.

---

## Finalité du projet
- **But**: Outiller, dans Claude Code, tout le cycle de vie des PRD de l’idée à l’archive: création, revue 7 dimensions avec notation, approbation, branche + worktree, mise en œuvre guidée, contrôles sécurité/qualité, orchestration multi‑PRD.
- **Livrables clés**: commandes (/create-prd, /review-prd, /code-prd, /work-prd, /security-audit, /quality-check, /orchestrate, /list-prds, /archive-prd), agents spécialisés, configuration flexible.

## Flux global
1. Créer → 2. Revoir (7D + grade) → 3. Approuver → 4. Coder (branche + worktree) → 5. Travailler (guidage + validation) → 6. Sécurité/Qualité → 7. Terminer/Merger → 8. Archiver.

---

## Points forts
- **Architecture**: Répertoire clair par rôle (`commands/`, `agents/`, `skills/`, `templates/`, `config/`).
- **Méthodologie**: Revue 7D détaillée, implémentation guidée avec checkpoints, support Git worktree.
- **Configuration**: `config/default-config.json` riche (chemins, nommage branches, worktree, sécurité, qualité, orchestration, agents, notifications).
- **Documentation de base**: `README`, getting started, configuration, best practices, troubleshooting présents.

---

## Écarts et incohérences
- **Schéma JSON incomplet**: `config/schema.json` ne couvre pas toutes les sections de `config/default-config.json` (manquent: `github`, `review`, `work_plan`, `orchestration`, `agents`, `notifications`).
- **Docs référencées manquantes**: `docs/commands-reference.md`, `docs/agents-guide.md`, `docs/skills-reference.md`, et les `docs/examples/*` sont absents mais référencés.
- **Presets**: `config/presets/` est vide malgré les références.
- **Templates**: seul `templates/prd-template.md` existe (pas de PR/issue/ADR/release notes).
- **Tests & CI**: aucun test ni workflow pour valider schémas et liens docs.
- **Windows/DX**: peu de guidance spécifique (Git Bash vs PowerShell, CRLF, chemins `parent_directory`).

---

## Analyse par dimensions
- **Architecture**
  - + Modulaire, extensible; séparation nette commandes/agents/skills.
  - ↗ Ajouter un index des commandes/agents avec liens croisés dans `docs`.

- **Documentation**
  - + Onboarding solide via `README` et guides existants.
  - − Liens cassés vers références/agents/skills et exemples.

- **Configuration & validation**
  - + Puissante et bien documentée.
  - − Validation lacunaire: le schéma ne reflète pas 100% des options.

- **Sécurité & qualité**
  - + Intentions claires (npm audit, eslint, couverture, complexité).
  - − Pas d’automatisation reproductible à l’intégration.

- **DevOps/CI**
  - − Aucun workflow GitHub pour valider JSON/Markdown.

- **UX des commandes**
  - + `/work-prd` très aboutie (détection, reprise, breakdown, qualité par phase).
  - ↗ Ajouter exemples concrets d’entrées/sorties et cas d’échec.

- **Extensibilité**
  - ↗ Utilitaires utiles: clone/split/merge/export de PRD; intégrations outils (Jira/Notion/Slack).

- **Compatibilité Windows**
  - ↗ Documenter shell recommandé, chemins, CRLF, `git worktree` sous Windows.

---

## Améliorations prioritaires (roadmap)

### Quick wins (≤2h)
- Étendre `config/schema.json` pour couvrir toutes les sections réellement utilisées.
- Créer des squelettes pour `docs/commands-reference.md`, `docs/agents-guide.md`, `docs/skills-reference.md`.
- Ajouter 3 presets dans `config/presets/` (startup, enterprise, open-source).

### Priorité 1
- Templates GitHub: `ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE.md`.
- Workflows CI: validation schéma JSON + vérification des liens Markdown.
- Deux exemples concrets dans `docs/examples/` (SaaS, e‑commerce).

### Priorité 2
- Compléter les références (sections détaillées, FAQ, erreurs fréquentes).
- Quick reference + diagrammes Mermaid (flux PRD, dépendances).

### Priorité 3
- Nouvelles commandes utilitaires (`/clone-prd`, `/split-prd`, `/export-prd`).
- Intégrations (Slack notifications; Jira/Notion selon besoin).

---

## Propositions concrètes (extraits prêts à l’emploi)

### 1) Élargir le schéma de configuration (extrait minimal)
```json
{
  "properties": {
    "prd_workflow": {
      "type": "object",
      "properties": {
        "github": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "create_issue_on_approval": { "type": "boolean" },
            "issue_labels": { "type": "array", "items": { "type": "string" } },
            "auto_assign": { "type": "boolean" },
            "milestone_tracking": { "type": "boolean" }
          }
        },
        "review": {
          "type": "object",
          "properties": {
            "dimensions": { "type": "array", "items": { "type": "string" } },
            "grading_enabled": { "type": "boolean" },
            "minimum_grade": { "type": "string" },
            "require_approval": { "type": "boolean" },
            "calibration_questions": { "type": "boolean" }
          }
        },
        "work_plan": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "file_path": { "type": "string" },
            "update_on_status_change": { "type": "boolean" },
            "track_decisions": { "type": "boolean" }
          }
        }
      }
    },
    "orchestration": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "parallel_features": { "type": "integer", "minimum": 1 },
        "dependency_resolution": { "type": "boolean" },
        "auto_merge_strategy": { "type": "string", "enum": ["merge", "squash", "rebase"] },
        "conflict_resolution": { "type": "string", "enum": ["manual", "auto"] }
      }
    },
    "agents": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": { "enabled": { "type": "boolean" } }
      }
    },
    "notifications": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "slack": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "webhook_url": { "type": "string" }
          }
        }
      }
    }
  }
}
```

### 2) Presets de configuration
```json
// config/presets/startup.json
{
  "prd_workflow": {
    "review": { "grading_enabled": true, "minimum_grade": "C", "calibration_questions": true },
    "worktree": { "enabled": true, "auto_install_dependencies": true }
  },
  "security": { "auto_scan_on_commit": false, "fail_on_high_severity": false },
  "quality": { "testing": { "coverage_threshold": 70 } }
}
```
```json
// config/presets/enterprise.json
{
  "prd_workflow": {
    "review": { "grading_enabled": true, "minimum_grade": "B", "require_approval": true }
  },
  "security": { "auto_scan_on_commit": true, "fail_on_high_severity": true },
  "quality": { "testing": { "coverage_threshold": 90 }, "code_complexity": { "max_complexity": 10 } }
}
```
```json
// config/presets/open-source.json
{
  "prd_workflow": { "github": { "enabled": true, "auto_assign": false } },
  "notifications": { "enabled": false }
}
```

### 3) Squelettes docs manquantes (exemples)
```markdown
<!-- docs/commands-reference.md -->
# Commands Reference
- /create-prd — scaffold PRD
- /review-prd — 7D review + grading
- /code-prd — branch + worktree
- /work-prd — guidance + validation
- /security-audit, /quality-check, /orchestrate, /list-prds, /archive-prd
```
```markdown
<!-- docs/agents-guide.md -->
# Agents Guide
- prd-reviewer — méthode 7D, critères
- prd-implementer — découpage des tâches
- orchestrator — dépendances, parallélisation
- security-expert, quality-assurance, devops-engineer — quand et comment
```

### 4) Workflow CI minimal
```yaml
# .github/workflows/validate.yml
name: Validate Docs & Config
on: [pull_request, push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm i -g ajv-cli markdown-link-check
      - run: ajv validate -s config/schema.json -d config/default-config.json
      - run: find docs -name "*.md" -maxdepth 2 -type f -print0 | xargs -0 -n1 markdown-link-check -q
```

### 5) Templates GitHub (extraits)
```markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug report
about: Report a problem
---
Steps to reproduce:
Expected:
Actual:
Env:
```
```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Summary
- What, why

## Checklist
- [ ] Docs updated
- [ ] Config valid (ajv)
- [ ] Links valid
```

---

## Notes Windows
- Préciser le shell recommandé (Git Bash vs PowerShell) dans les docs.
- Documenter `git worktree` avec chemins Windows, et la gestion CRLF.
- Ajouter une sous‑section Troubleshooting Windows (droits, PATH Git, terminal Claude Code).

---

## Validation après implémentation
- `ajv validate -s config/schema.json -d config/default-config.json` pour le schéma.
- Vérification des liens Markdown (p.ex. `markdown-link-check`).
- Contrôle manuel des workflows `/review-prd` → `/code-prd` → `/work-prd` sur un PRD d’exemple.
