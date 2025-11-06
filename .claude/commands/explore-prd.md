---
name: explore-prd
description: Early-stage feature exploration before full PRD
category: PRD Management
version: 2.0.0
---

# Explore PRD Command

Lightweight feature exploration for early-stage ideas before committing to full PRD.

## Purpose

Validate feature ideas quickly without full PRD overhead:
- **Quick feasibility assessment** (product approaches, tech, business)
- **Inspirations & best practices** from the industry
- **Direct recommendation** with clear reasoning
- **Persistent record** in `.prds/thoughts/explorations/`

**Use case**: "I have a vague idea - should we build it and how?"

---

## Workflow

### Step 1: Immediate 360° Exploration

Start with a complete exploration without asking preliminary questions. Go straight to the analysis.

```markdown
💡 **EXPLORATION: {{FEATURE_IDEA}}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 APPROCHES PRODUIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche A: {{NOM}}** (ex: "MVP Quick Win")

Scope fonctionnel:
- ✅ {{FEATURE_INCLUSE_1}}
- ✅ {{FEATURE_INCLUSE_2}}
- ✅ {{FEATURE_INCLUSE_3}}
- ❌ {{OUT_OF_SCOPE_1}}
- ❌ {{OUT_OF_SCOPE_2}}

Impact Tech: {{SIMPLE/MOYEN/COMPLEXE}}
- Backend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Frontend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Infrastructure: {{AUCUN/LEGER/LOURD}}

Impact Business: {{SCORE}}/10
- Users touchés: {{POURCENTAGE}}% ({{PERSONAS}})
- Valeur délivrée: {{DESCRIPTION_CONCRETE}}
- Time to market: {{DUREE}}

Risques:
- ⚠️ {{RISQUE_PRINCIPAL}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche B: {{NOM}}** (ex: "Solution Complète")

Scope fonctionnel:
- ✅ {{FEATURE_INCLUSE_1}}
- ✅ {{FEATURE_INCLUSE_2}}
- ✅ {{FEATURE_INCLUSE_3}}
- ✅ {{FEATURE_BONUS_1}}
- ✅ {{FEATURE_BONUS_2}}

Impact Tech: {{SIMPLE/MOYEN/COMPLEXE}}
- Backend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Frontend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Infrastructure: {{AUCUN/LEGER/LOURD}}

Impact Business: {{SCORE}}/10
- Users touchés: {{POURCENTAGE}}% ({{PERSONAS}})
- Valeur délivrée: {{DESCRIPTION_CONCRETE}}
- Time to market: {{DUREE}}

Risques:
- ⚠️ {{RISQUE_PRINCIPAL}}
- ⚠️ {{RISQUE_SECONDAIRE}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche C: {{NOM}}** (ex: "Approche Hybride/Phased")

Scope fonctionnel:
- Phase 1: {{FEATURES_PHASE_1}}
- Phase 2: {{FEATURES_PHASE_2}}
- Phase 3 (optionnel): {{FEATURES_PHASE_3}}

Impact Tech: {{SIMPLE/MOYEN/COMPLEXE}}
- Backend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Frontend: {{DESCRIPTION}} (~{{ESTIMATION}})
- Infrastructure: {{AUCUN/LEGER/LOURD}}

Impact Business: {{SCORE}}/10
- Users touchés: {{POURCENTAGE}}% ({{PERSONAS}})
- Valeur délivrée: {{DESCRIPTION_CONCRETE}}
- Time to market: {{DUREE_TOTALE}}

Risques:
- ⚠️ {{RISQUE_PRINCIPAL}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMANDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Approche recommandée: {{LETTRE}} - {{NOM}}**

Pourquoi cette approche:
1. {{RAISON_PRINCIPALE}} (driver #1)
2. {{RAISON_SECONDAIRE}}
3. {{RAISON_TERTIAIRE}}

vs Approche {{AUTRE_LETTRE}}: {{POURQUOI_PAS_CELLE_LA}}
vs Approche {{AUTRE_LETTRE}}: {{POURQUOI_PAS_CELLE_LA}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 INSPIRATIONS & BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Use WebSearch to research how this problem is solved in the industry]

**Dans l'industrie**:
- {{COMPANY_1}}: {{LEUR_APPROCHE}}
  → Learning: {{CE_QUON_PEUT_EN_TIRER}}

- {{COMPANY_2}}: {{LEUR_APPROCHE}}
  → Learning: {{CE_QUON_PEUT_EN_TIRER}}

- {{COMPANY_3}}: {{LEUR_APPROCHE}}
  → Learning: {{CE_QUON_PEUT_EN_TIRER}}

**Best Practices identifiées**:
- ✅ {{BEST_PRACTICE_1}}
- ✅ {{BEST_PRACTICE_2}}
- ✅ {{BEST_PRACTICE_3}}

**Anti-patterns à éviter**:
- ❌ {{ANTI_PATTERN_1}}
- ❌ {{ANTI_PATTERN_2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ÉVALUATION TECHNIQUE (Approche {{LETTRE}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recherche codebase**:
- `{{FICHIER_1}}` - {{CE_QU_ON_PEUT_REUTILISER}}
- `{{FICHIER_2}}` - {{PATTERN_SIMILAIRE}}
- `{{FICHIER_3}}` - {{INTEGRATION_POINT}}
- Gap: {{CE_QUI_MANQUE}}

**Stack & Dépendances**:
- Existant: {{CE_QUON_A_DEJA}}
- À ajouter: {{NOUVELLES_DEPS}} {{#if RISQUE}}({{RISQUE_ASSOCIE}}){{/if}}

**Breakdown technique**:
1. {{TACHE_1}} - {{COMPLEXITE}} - {{ESTIMATION}}
2. {{TACHE_2}} - {{COMPLEXITE}} - {{ESTIMATION}}
3. {{TACHE_3}} - {{COMPLEXITE}} - {{ESTIMATION}}
4. {{TACHE_4}} - {{COMPLEXITE}} - {{ESTIMATION}}
5. {{TACHE_5}} - {{COMPLEXITE}} - {{ESTIMATION}}

**Bloquants**: {{OUI/NON}}
{{#if OUI}}
- 🚫 {{BLOQUANT_1}} - {{COMMENT_MITIGER}}
- 🚫 {{BLOQUANT_2}} - {{COMMENT_MITIGER}}
{{/if}}

**Estimation totale**: {{X_JOURS_SEMAINES}}
**Faisabilité**: ✅ Feasible / ⚠️ Challenging / ❌ Blocked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 SYNTHÈSE & PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Décision**: 🟢 GO / 🟡 EXPLORE MORE / 🔴 DROP

{{#if GO}}
**Mon avis**: {{TON_FEELING_PERSONNEL_HONEST}}

Points forts:
- ✅ {{CE_QUI_ME_CONVAINC_1}}
- ✅ {{CE_QUI_ME_CONVAINC_2}}
- ✅ {{CE_QUI_ME_CONVAINC_3}}

Points de vigilance:
- ⚠️ {{CE_QUI_MINQUIETE_1}}
- ⚠️ {{CE_QUI_MINQUIETE_2}}

**Prochaine étape**: `/create-prd` avec cette exploration comme base

**Priorité suggérée**: {{P0/P1/P2}}
- P0 si: {{CONDITIONS_POUR_P0}}
- P1 si: {{CONDITIONS_POUR_P1}}

**Conseil**: {{UN_CONSEIL_CONCRET_POUR_LA_SUITE}}
{{/if}}

{{#if EXPLORE_MORE}}
**Mon avis**: {{TON_FEELING_PERSONNEL_HONEST}}

Ce qui est clair:
- ✅ {{CE_QUI_EST_SUR}}

Ce qui manque:
- ❓ {{QUESTION_OUVERTE_1}}
- ❓ {{QUESTION_OUVERTE_2}}

**Actions à faire avant de décider**:
1. {{ACTION_1}} ({{QUI}} / {{QUAND}})
2. {{ACTION_2}} ({{QUI}} / {{QUAND}})

**Critères de décision**:
- Si {{CONDITION_1}}, alors GO
- Si {{CONDITION_2}}, alors DROP

**Conseil**: {{COMMENT_DEBLOQUER_LA_SITUATION}}
{{/if}}

{{#if DROP}}
**Mon avis**: {{TON_FEELING_PERSONNEL_HONEST}}

Pourquoi drop:
- ❌ {{RAISON_PRINCIPALE}}
- ❌ {{RAISON_SECONDAIRE}}

Alternatives considérées:
- {{ALTERNATIVE_1}}: {{POURQUOI_PAS}}
- {{ALTERNATIVE_2}}: {{POURQUOI_PAS}}

**Ce qu'on pourrait revisiter**:
Si {{CONDITION_FUTURE}}, on pourrait reconsidérer cette idée.

**Leçon retenue**: {{CE_QUON_APPREND_DE_CETTE_EXPLORATION}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 2: Save Exploration Document

```bash
# Generate filename
EXPLORATION_ID=$(date +%Y%m%d-%H%M%S)
FEATURE_SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | cut -c1-50)
EXPLORATION_FILE=".prds/thoughts/explorations/${EXPLORATION_ID}-${FEATURE_SLUG}.md"

# Save exploration
cat > "$EXPLORATION_FILE" <<EOF
# Exploration: ${FEATURE_NAME}

**Date**: $(date +%Y-%m-%d)
**Status**: {{STATUS}}

[Full exploration content here]
EOF

echo "✅ Exploration saved: $EXPLORATION_FILE"
```

---

## Key Principles

### 1. **Approaches First**
Go straight to product approaches - this is what matters most. Don't ask preliminary questions.

### 2. **Strong Recommendation**
Make a clear choice and justify it. Compare explicitly with other approaches.

### 3. **Industry Research**
Use WebSearch to find how others solve this problem. Learn from best practices and anti-patterns.

### 4. **Tech Eval on Winner**
Only do deep technical evaluation on the recommended approach. Don't waste time on rejected options.

### 5. **Personal Take**
Be honest about your feeling. Share concerns, enthusiasm, doubts. This is valuable context.

### 6. **No Questions**
Don't end with questions to the user. Give a complete perspective and let them react naturally.

---

## Output Example

```markdown
💡 EXPLORATION: Support du Dark Mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 APPROCHES PRODUIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche A: CSS Variables Only**
Scope fonctionnel:
- ✅ Toggle dark/light dans settings
- ✅ Persistance localStorage
- ❌ Auto-detect système
- ❌ Per-component customization

Impact Tech: Simple
- Backend: Aucun
- Frontend: CSS vars + toggle (~1j)
- Infrastructure: LocalStorage seulement

Impact Business: 7/10
- Users touchés: 60% (night workers, dev users)
- Valeur délivrée: Confort visuel
- Time to market: 3 jours

Risques:
- ⚠️ Pas d'auto-detect (attendu par users modernes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche B: Full Theme System**
Scope fonctionnel:
- ✅ Dark/Light/Auto modes
- ✅ Détection préférence système
- ✅ Per-user persistence (DB)
- ✅ API pour themes custom futurs

Impact Tech: Complexe
- Backend: User preferences API (~2j)
- Frontend: Theme context + provider (~3j)
- Infrastructure: DB schema change + migration

Impact Business: 8/10
- Users touchés: 60% + future custom themes
- Valeur délivrée: Expérience premium
- Time to market: 2 semaines

Risques:
- ⚠️ Over-engineering pour feature de confort
- ⚠️ Migration DB users existants

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approche C: CSS + System Detection**
Scope fonctionnel:
- ✅ Dark/Light/Auto modes
- ✅ Détection préférence système
- ✅ Persistance localStorage
- ❌ Custom themes

Impact Tech: Moyen
- Backend: Aucun
- Frontend: CSS vars + media query hook (~2j)
- Infrastructure: LocalStorage + system API

Impact Business: 8/10
- Users touchés: 60% avec meilleure UX
- Valeur délivrée: Confort + respect préfs OS
- Time to market: 1 semaine

Risques:
- ⚠️ Pas de sync cross-device

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMANDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Approche recommandée: C - CSS + System Detection**

Pourquoi cette approche:
1. Sweet spot entre simplicité et UX moderne (respect préfs OS)
2. Déploiement rapide sans backend (1 semaine)
3. 90% de la valeur de B pour 30% du coût

vs Approche A: Auto-detect est devenu un standard attendu
vs Approche B: Over-engineering, on n'a pas besoin de custom themes maintenant

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 INSPIRATIONS & BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Dans l'industrie**:
- GitHub: prefers-color-scheme + localStorage persistence
  → Learning: Respect OS preference by default, let users override

- Vercel: Smooth transitions entre themes + pas de flash
  → Learning: Set theme class before render pour éviter flash

- Linear: Auto/Light/Dark avec icon sun/moon élégant
  → Learning: UX du toggle est important (pas juste checkbox)

**Best Practices identifiées**:
- ✅ Utiliser prefers-color-scheme media query
- ✅ Persister le choix utilisateur pour override
- ✅ Smooth transition CSS (200-300ms)
- ✅ Tester le contraste WCAG AA minimum

**Anti-patterns à éviter**:
- ❌ Flash of wrong theme au chargement
- ❌ Oublier focus states en dark mode
- ❌ Hard-coder les couleurs au lieu de variables

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ÉVALUATION TECHNIQUE (Approche C)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recherche codebase**:
- `src/styles/variables.css` - CSS vars déjà en place
- `src/components/Settings.tsx` - Où ajouter le toggle
- `src/hooks/useLocalStorage.ts` - Hook réutilisable
- Gap: Hook pour media query, toggle component

**Stack & Dépendances**:
- Existant: CSS variables, React hooks
- À ajouter: Aucune (natif browser API)

**Breakdown technique**:
1. CSS dark theme variables - Simple - 3h
2. useTheme hook + media query - Simple - 4h
3. Toggle component + integration - Simple - 4h
4. localStorage persistence - Simple - 2h
5. Testing tous components - Moyen - 1j

**Bloquants**: Non

**Estimation totale**: 2-3 jours dev + 1j QA
**Faisabilité**: ✅ Feasible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 SYNTHÈSE & PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Décision**: 🟢 GO

**Mon avis**: C'est une feature no-brainer à ce stade. Le ROI est excellent
(60% users concernés, 3 jours de dev) et c'est devenu une attente baseline
pour tout produit moderne en 2025.

Points forts:
- ✅ Quick win avec impact immédiat sur satisfaction users
- ✅ Zéro risque technique (CSS + browser API natif)
- ✅ Pattern bien documenté dans l'industrie

Points de vigilance:
- ⚠️ Bien tester le flash au chargement (script inline avant React)
- ⚠️ Penser aux screenshots/docs qui utilisent le light theme

**Prochaine étape**: `/create-prd` avec cette exploration comme base

**Priorité suggérée**: P1
- P0 si: on a un redesign majeur en cours (profiter du momentum)
- P1 sinon: high value, low effort, mais pas bloquant

**Conseil**: Commence par auditer toutes les couleurs hard-codées dans
le CSS actuel. C'est souvent là que ça coince. Et prévois 2-3h de plus
pour peaufiner les transitions et l'UX du toggle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Tips

- **Be direct**: No preliminary questions. Start exploring immediately.
- **Be opinionated**: Make a clear recommendation with honest reasoning.
- **Research the industry**: Use WebSearch to find how others solve this.
- **Be honest in synthesis**: Share your real feeling about the idea.
- **Focus on the winner**: Deep tech eval only on recommended approach.

---

## Configuration

Uses:
- `context_engineering.thoughts_directory` from config
- WebSearch for industry research

---

## Examples

**Basic exploration**:
```bash
/explore-prd "Add dark mode support"
```

**Feature with context**:
```bash
/explore-prd "Real-time collaboration like Google Docs"
```

**Strategic exploration**:
```bash
/explore-prd "AI-powered code suggestions"
```

---

**Version**: 2.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Category**: Context Engineering
