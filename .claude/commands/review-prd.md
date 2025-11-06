---
name: review-prd
description: Conduct comprehensive PRD review with product and technical analysis
category: PRD Management
version: 2.0.0
---

# Review PRD Command

Comprehensive PRD review following product-first, then technical approach.

## Purpose

Review and validate PRDs before development starts, ensuring:
- **Product validation** - Right problem, right solution, right scope
- **Technical feasibility** - Can build it, how to build it, what are the risks
- **Clear decision** - GO/ITERATE/KILL with honest assessment

## Workflow

### Step 1: List & Select PRD

Scan draft PRDs and display selection:

```markdown
📋 **PRDs Available for Review (01-draft/)**

| # | PRD File | Feature Name | Priority | Grade |
|---|----------|--------------|----------|-------|
| 1 | PRD-007-oauth2.md | OAuth2 Integration | P0 | Not reviewed |
| 2 | PRD-008-dark-mode.md | Dark Mode | P1 | C |

Which PRD would you like to review? (1-2 or filename)
```

---

### Step 2: Complete Review Analysis

**Output the complete review in one comprehensive response:**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PRD-XXX: {{FEATURE_NAME}}**

Priority: {{P0/P1/P2}} | Owner: {{WHO}} | Effort: {{ESTIMATION}}

**En une phrase**: {{LE_PROBLEME_ET_LA_SOLUTION}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PRODUCT REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Le problème utilisateur**

Qui: {{USER_PERSONA}} ({{PERCENTAGE}}% de la base)
Pain: {{DESCRIPTION_DU_PAIN_POINT}}
Fréquence: {{DAILY_WEEKLY_MONTHLY_RARE}}
Workaround actuel: {{COMMENT_ILS_FONT_AUJOURDHUI}}

Evidence:
• {{SOURCE_1}} (ex: "15 tickets support/mois")
• {{SOURCE_2}} (ex: "Top 3 user research")
• {{SOURCE_3}} (ex: "5 churned users cited this")

❓ Challenge: {{LE_PROBLEME_EST_IL_REEL_ET_URGENT}}
Mon avis: {{VALIDATED_ASSUMED_WEAK}}

**2. La solution proposée**

Approche PRD: {{RESUME_EN_2_PHRASES}}

Scope IN:
• {{FEATURE_1}} - Pourquoi essentiel: {{RAISON}}
• {{FEATURE_2}} - Pourquoi essentiel: {{RAISON}}
• {{FEATURE_3}} - Pourquoi essentiel: {{RAISON}}

Scope OUT:
• {{NOT_FEATURE}} - Pourquoi exclu: {{RAISON}}

**3. Alternatives & Simplifications**

Alternative A: {{NOM}} (ex: "Buy vs Build")
→ Quoi: {{DESCRIPTION}}
→ Effort: {{COMPARISON_VS_PRD}} (ex: "2 jours vs 2 semaines")
→ Value: {{SAME_LESS_MORE}}
→ Trade-off: {{CE_QUON_SACRIFIE}}
→ Mon avis: {{POURQUOI_OUI_OU_NON}}

Alternative B: {{NOM}} (ex: "Manual process")
→ Quoi: {{DESCRIPTION}}
→ Effort: {{COMPARISON_VS_PRD}}
→ Value: {{SAME_LESS_MORE}}
→ Trade-off: {{CE_QUON_SACRIFIE}}
→ Mon avis: {{POURQUOI_OUI_OU_NON}}

Alternative C: {{NOM}} (ex: "Phased approach")
→ Quoi: {{DESCRIPTION}}
→ Effort: {{COMPARISON_VS_PRD}}
→ Value: {{SAME_LESS_MORE}}
→ Trade-off: {{CE_QUON_SACRIFIE}}
→ Mon avis: {{POURQUOI_OUI_OU_NON}}

Recommandation: {{GARDER_PRD_OU_QUELLE_ALTERNATIVE}}

**4. Challenge composante par composante**

{{COMPOSANTE_1}} (ex: "Admin dashboard"):
→ Nécessité: ✅ Essential / ⚠️ Nice-to-have / ❌ Bloat
→ Utilisé par: {{PERCENTAGE}}% des users / {{FREQUENCY}}
→ Effort: {{ESTIMATION}}
→ Impact si retiré: {{DESCRIPTION}}
→ Verdict: {{KEEP_DEFER_REMOVE}}

{{COMPOSANTE_2}}:
→ Nécessité: ✅ Essential / ⚠️ Nice-to-have / ❌ Bloat
→ Utilisé par: {{PERCENTAGE}}% des users / {{FREQUENCY}}
→ Effort: {{ESTIMATION}}
→ Impact si retiré: {{DESCRIPTION}}
→ Verdict: {{KEEP_DEFER_REMOVE}}

{{COMPOSANTE_3}}:
→ Nécessité: ✅ Essential / ⚠️ Nice-to-have / ❌ Bloat
→ Utilisé par: {{PERCENTAGE}}% des users / {{FREQUENCY}}
→ Effort: {{ESTIMATION}}
→ Impact si retiré: {{DESCRIPTION}}
→ Verdict: {{KEEP_DEFER_REMOVE}}

Scope optimisé:
• Keep (v1): {{LISTE}}
• Defer (v2): {{LISTE}}
• Remove: {{LISTE}}

Impact: {{TIME_SAVED}} / {{RISK_REDUCED}} / {{VALUE_PRESERVED}}

**5. User Experience & Journey**

Current UX: {{COMMENT_CEST_MAINTENANT}}
Proposed UX: {{COMMENT_CA_DEVIENT}}

User journey:
1. {{STEP_1}} - Pain point actuel: {{DESCRIPTION}}
2. {{STEP_2}} - Pain point actuel: {{DESCRIPTION}}
3. {{STEP_3}} - Pain point actuel: {{DESCRIPTION}}

Après cette feature:
→ {{WHAT_IMPROVES}}
→ {{WHAT_STAYS_PAINFUL}}

Friction points:
• {{FRICTION_1}} - Severity: {{HIGH_MEDIUM_LOW}}
• {{FRICTION_2}} - Severity: {{HIGH_MEDIUM_LOW}}

**6. Success Metrics & Acceptance**

Comment on mesure le succès:
• Metric 1: {{NOM}} - Target: {{VALUE}} - Actuel: {{BASELINE}}
• Metric 2: {{NOM}} - Target: {{VALUE}} - Actuel: {{BASELINE}}
• Metric 3: {{NOM}} - Target: {{VALUE}} - Actuel: {{BASELINE}}

Acceptance criteria:
✅ Fonctionnel ({{COUNT}}): {{EXEMPLES}}
✅ Performance: {{TARGETS}} (ex: "< 200ms response")
✅ Edge cases ({{COUNT}}): {{EXEMPLES}}
⚠️ Manquants: {{GAPS}}

**7. Strategic & Competitive Context**

Strategic fit:
• Company strategy: {{DESCRIPTION}}
• Alignment: ✅ Strong / ⚠️ Weak / ❌ Misaligned
• Reasoning: {{POURQUOI}}

Competitive landscape:
• Competitor A: {{LEUR_SOLUTION}} - Learning: {{INSIGHT}}
• Competitor B: {{LEUR_SOLUTION}} - Learning: {{INSIGHT}}
• Our position: {{UNIQUE_PARITY_LAGGING}}

Timing:
• Build now: {{POURQUOI_MAINTENANT}}
• Defer 3-6 months: {{IMPACT_SI_ON_ATTEND}}

**Product Score: {{X}}/10**

Strengths:
• {{STRENGTH_1}}
• {{STRENGTH_2}}

Weaknesses:
• {{WEAKNESS_1}}
• {{WEAKNESS_2}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 TECHNICAL REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Architecture & Design**

Current architecture:
• Pattern: {{DESCRIPTION}} (ex: "REST API + React SPA")
• Files: {{RELEVANT_PATHS}}
• Tech stack: {{CURRENT_STACK}}

Proposed changes:
• Pattern: {{NOUVEAU_PATTERN}}
• Integration points: {{WHERE_IT_PLUGS}}
• Alignment: ✅ Cohérent / ⚠️ Diverge / ❌ Conflictuel

Justification: {{POURQUOI_CETTE_EVAL}}

**2. Codebase Analysis**

Recherche codebase:
• `{{FILE_1}}` - {{FUNCTIONALITY}} - Reusable: {{YES_NO}}
• `{{FILE_2}}` - {{PATTERN}} - Applicable: {{YES_NO}}
• `{{FILE_3}}` - {{INTEGRATION_POINT}} - Ready: {{YES_NO}}

Gaps:
• {{MISSING_1}} - Effort to create: {{ESTIMATION}}
• {{MISSING_2}} - Effort to create: {{ESTIMATION}}

Similar features:
• Feature X ({{PATH}}) - Approach: {{DESCRIPTION}}
  → What worked: {{LEARNINGS}}
  → What to avoid: {{ANTI_PATTERNS}}

**3. Implementation Breakdown**

Backend (~{{TOTAL_ESTIMATION}}):

Task 1: {{DESCRIPTION}}
→ Complexity: Simple / Medium / Complex
→ Risk: {{WHAT_COULD_GO_WRONG}}
→ Dependencies: {{WHAT_IT_NEEDS}}
→ Estimation: {{TIME}}

Task 2: {{DESCRIPTION}}
→ Complexity: Simple / Medium / Complex
→ Risk: {{WHAT_COULD_GO_WRONG}}
→ Dependencies: {{WHAT_IT_NEEDS}}
→ Estimation: {{TIME}}

Frontend (~{{TOTAL_ESTIMATION}}):

Task 1: {{DESCRIPTION}}
→ Complexity: Simple / Medium / Complex
→ Risk: {{WHAT_COULD_GO_WRONG}}
→ Dependencies: {{WHAT_IT_NEEDS}}
→ Estimation: {{TIME}}

Task 2: {{DESCRIPTION}}
→ Complexity: Simple / Medium / Complex
→ Risk: {{WHAT_COULD_GO_WRONG}}
→ Dependencies: {{WHAT_IT_NEEDS}}
→ Estimation: {{TIME}}

Infrastructure & DevOps (~{{TOTAL_ESTIMATION}}):

Task 1: {{DESCRIPTION}}
→ Complexity: Simple / Medium / Complex
→ Risk: {{WHAT_COULD_GO_WRONG}}
→ Dependencies: {{WHAT_IT_NEEDS}}
→ Estimation: {{TIME}}

Testing & QA (~{{TOTAL_ESTIMATION}}):
• Unit tests: {{SCENARIOS}} - {{TIME}}
• Integration tests: {{SCENARIOS}} - {{TIME}}
• E2E tests: {{CRITICAL_FLOWS}} - {{TIME}}

Total realistic estimation: {{TOTAL}} ({{CONFIDENCE_LEVEL}}% confidence)

**4. Dependencies & Blockers**

Technical dependencies:
• {{DEP_1}} - Status: {{READY_IN_PROGRESS_BLOCKED}}
  → Impact if not ready: {{DESCRIPTION}}

• {{DEP_2}} - Status: {{READY_IN_PROGRESS_BLOCKED}}
  → Impact if not ready: {{DESCRIPTION}}

Team dependencies:
• {{TEAM_EXPERTISE}} - Available: {{YES_NO}}
• {{EXTERNAL_TEAM}} - Needed for: {{WHAT}}

Hard blockers: {{NONE_OR_LIST}}
Soft dependencies: {{NONE_OR_LIST}}

**5. Tech Stack & Debt**

New dependencies:
• {{LIBRARY_1}} - {{VERSION}} - Risk: {{MAINTENANCE_SECURITY}}
• {{LIBRARY_2}} - {{VERSION}} - Risk: {{MAINTENANCE_SECURITY}}

Breaking changes: {{YES_NO}}
{{#if YES}}
• {{CHANGE_1}} - Affects: {{WHAT}} - Migration: {{EFFORT}}
• {{CHANGE_2}} - Affects: {{WHAT}} - Migration: {{EFFORT}}
{{/if}}

Tech debt:
• Created: {{DESCRIPTION}} - Severity: {{HIGH_MEDIUM_LOW}}
• Paid: {{DESCRIPTION}} - Value: {{HIGH_MEDIUM_LOW}}
• Net impact: 🟢 Positive / 🟡 Neutral / 🔴 Negative

**6. Quality, Performance & Security**

Performance:
• Expected impact: {{DESCRIPTION}}
• SLA targets: {{REQUIREMENTS}} (ex: "p95 < 500ms")
• Load concerns: {{IF_ANY}}
• Monitoring: {{WHAT_TO_TRACK}}

Security:
• New attack surface: {{DESCRIPTION}}
• Data sensitivity: {{LEVEL}} (Public / Internal / PII / Financial)
• Auth/Authz: {{REQUIREMENTS}}
• Compliance: {{IF_APPLICABLE}} (GDPR, SOC2, etc.)

Scalability:
• Current limit: {{DESCRIPTION}}
• After this: {{NEW_LIMIT}}
• Bottlenecks: {{IF_ANY}}

**7. Risk Assessment**

Technical risks:

Risk 1: {{DESCRIPTION}}
→ Likelihood: High / Medium / Low
→ Impact: High / Medium / Low
→ Mitigation: {{HOW_TO_REDUCE}}

Risk 2: {{DESCRIPTION}}
→ Likelihood: High / Medium / Low
→ Impact: High / Medium / Low
→ Mitigation: {{HOW_TO_REDUCE}}

Unknowns:
• {{UNKNOWN_1}} - How to derisk: {{APPROACH}}
• {{UNKNOWN_2}} - How to derisk: {{APPROACH}}

**Technical Score: {{X}}/10**

Mon feeling technique:
{{2_3_PHRASES_HONEST_SUR_FAISABILITE_ET_RISQUES}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SYNTHÈSE & DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Grade Final: {{A-F}}** (Product: {{X}}/10 | Technical: {{Y}}/10)

**Mon feeling global**:

{{3_4_PHRASES_HONEST_SUR_LE_PRD_GLOBAL}}

**3 Challenges Critiques**:

1️⃣ KILL Challenge: Devrait-on construire ça?
→ Problème validé: {{YES_NO}} - {{EVIDENCE}}
→ Alternatives meilleures: {{YES_NO}} - {{LESQUELLES}}
→ Strategic fit: {{STRONG_WEAK}}
→ **Mon verdict**: ✅ Build / ⚠️ Reconsider / ❌ Kill
→ **Pourquoi**: {{REASONING}}

2️⃣ TIMING Challenge: Maintenant ou plus tard?
→ Urgency: {{HIGH_MEDIUM_LOW}} - {{POURQUOI}}
→ Team capacity: {{AVAILABLE_TIGHT_BLOCKED}}
→ Dependencies ready: {{YES_NO}}
→ Opportunity cost: {{QUOI_DAUTRE}}
→ **Mon verdict**: 🚀 Now / ⏸️ Defer Q{{X}} / 📋 Backlog
→ **Pourquoi**: {{REASONING}}

3️⃣ SCOPE Challenge: Tout ou partie?
→ MVP viable: {{YES_NO}} - {{DESCRIPTION}}
→ Effort saved: {{PERCENTAGE}}% / {{TIME}}
→ Value preserved: {{PERCENTAGE}}%
→ **Mon verdict**: 💯 Full scope / 📦 MVP first / 🎯 Phased
→ **Pourquoi**: {{REASONING}}

**Blockers** (must fix avant /setup-prd):

🔴 {{BLOCKER_1}}
→ Action: {{SPECIFIC_FIX}}
→ Owner: {{WHO_SHOULD_FIX}}

🔴 {{BLOCKER_2}}
→ Action: {{SPECIFIC_FIX}}
→ Owner: {{WHO_SHOULD_FIX}}

**Recommendations** (pour améliorer le grade):

🟡 {{REC_1}}
→ Impact grade: {{CURRENT}} → {{AFTER}}
→ Effort: {{ESTIMATION}}
→ Worth it: {{YES_NO}} - {{POURQUOI}}

🟡 {{REC_2}}
→ Impact grade: {{CURRENT}} → {{AFTER}}
→ Effort: {{ESTIMATION}}
→ Worth it: {{YES_NO}} - {{POURQUOI}}

**ROI Summary**:

Effort: {{TOTAL_ESTIMATION}} ({{CONFIDENCE}}% confidence)
Value: {{HIGH_MEDIUM_LOW}}
Risk: {{HIGH_MEDIUM_LOW}}
ROI: 🟢 Excellent / 🟡 Good / 🔴 Poor

**Next Steps**:

{{#if GRADE_A_B}}
✅ **Ready for development**

Recommended priority: {{P0_P1_P2}} - {{JUSTIFICATION}}

Actions:
1. /setup-prd PRD-XXX (creates branch + moves to ready/)
2. {{ANY_PREP_WORK}}
3. /code-prd PRD-XXX (start implementation)

Expected delivery: {{TIMELINE}}
{{/if}}

{{#if GRADE_C_D}}
⚠️ **Needs iteration**

Fix blockers:
1. {{BLOCKER_1}} - ETA: {{QUAND}}
2. {{BLOCKER_2}} - ETA: {{QUAND}}

Then: /review-prd PRD-XXX again

Expected grade after fixes: {{LETTER}}
{{/if}}

{{#if GRADE_F}}
❌ **Major issues - Reconsider**

Options:
A) Kill this PRD - {{POURQUOI_TUER}}
B) Complete rewrite - {{CE_QUI_DOIT_CHANGER}}
C) Merge with PRD-YYY - {{POURQUOI_MERGER}}

Recommendation: {{WHICH_OPTION}} - {{REASONING}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3: Update PRD Metadata

Add/update review metadata in PRD frontmatter:

```yaml
review_status: Reviewed
review_date: 2025-01-06
review_grade: A-
reviewer: Claude
last_review: 2025-01-06
product_score: 8
technical_score: 9
```

**No automatic file movement** - PRD stays in draft until user runs `/setup-prd`.

---

## Key Principles

### 1. **Product First, Then Technical**
Validate we're building the right thing before diving into how to build it.

### 2. **User-Centric Analysis**
Start with user pain, journey, and success metrics. Not abstract requirements.

### 3. **Challenge Everything**
- Problem validation with evidence
- Alternatives comparison
- Component-by-component necessity
- Scope optimization

### 4. **Deep Technical Review**
- Codebase research
- Architecture alignment
- Detailed breakdown with risks
- Performance, security, scalability

### 5. **Honest Assessment**
Share your real feeling throughout. No sugarcoating.

### 6. **Integrated Gate**
KILL/SKIP/SHRINK questions integrated in final synthesis, not blocking upfront.

### 7. **Actionable Next Steps**
Clear path forward based on grade and verdict.

---

## Output Example

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PRD-007: OAuth2 Integration**

Priority: P0 | Owner: Backend Team | Effort: 2 weeks

**En une phrase**: Users can't login with Google/GitHub, forcing email/password only - we'll add OAuth2 support for major providers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 PRODUCT REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Le problème utilisateur**

Qui: New users (100% signup flow)
Pain: Forced to create another password, remember it, deal with reset emails
Fréquence: Every signup (blocking)
Workaround actuel: Manual email/password creation (12% drop-off)

Evidence:
• 47 support tickets in Q4 2024 about password reset
• User research: 73% prefer social login
• 12% drop-off at signup vs industry 4% with OAuth

❓ Challenge: C'est un vrai problème urgent qui bloque l'acquisition
Mon avis: Validated - Strong evidence from support + research + metrics

**2. La solution proposée**

Approche PRD: Add OAuth2 with Google, GitHub, Microsoft providers using Passport.js

Scope IN:
• Google OAuth - Pourquoi essentiel: 68% of users have Google account
• GitHub OAuth - Pourquoi essentiel: Developer product, 85% have GitHub
• Microsoft OAuth - Pourquoi essentiel: Enterprise users request it
• Account linking - Pourquoi essentiel: Users may have both email + OAuth

Scope OUT:
• Twitter/Facebook OAuth - Pourquoi exclu: Low demand (<5% requests)
• Profile sync - Pourquoi exclu: Privacy concerns, v2 feature

**3. Alternatives & Simplifications**

Alternative A: Auth0 / Clerk (Buy vs Build)
→ Quoi: Use managed auth service instead of building OAuth
→ Effort: 2 days integration vs 2 weeks build
→ Value: Same user experience + more providers
→ Trade-off: $300/month cost, less control, vendor lock-in
→ Mon avis: Worth considering for speed, but recurring cost is concern

Alternative B: Google-only first (MVP)
→ Quoi: Ship only Google OAuth in v1, add others in v2
→ Effort: 3 days vs 2 weeks (-78%)
→ Value: Covers 68% of use cases
→ Trade-off: GitHub users (dev persona) still forced to password
→ Mon avis: Good MVP but GitHub is critical for our dev audience

Alternative C: Email magic links (no password)
→ Quoi: Skip OAuth, use passwordless email links
→ Effort: 1 week
→ Value: Solves password problem differently
→ Trade-off: Still requires email input, slower UX
→ Mon avis: Doesn't solve "one-click signup" need

Recommandation: Alternative B (Google-only MVP) then add GitHub in v1.1

**4. Challenge composante par composante**

Google OAuth:
→ Nécessité: ✅ Essential
→ Utilisé par: 68% potential / Every signup
→ Effort: 2 days
→ Impact si retiré: MVP not viable
→ Verdict: Keep

GitHub OAuth:
→ Nécessité: ✅ Essential
→ Utilisé par: 85% of dev users / Every signup
→ Effort: 1 day (after Google pattern)
→ Impact si retiré: Dev persona not served
→ Verdict: Keep but could defer to v1.1 (1 week after v1.0)

Microsoft OAuth:
→ Nécessité: ⚠️ Nice-to-have
→ Utilisé par: 15% enterprise / Infrequent
→ Effort: 1 day
→ Impact si retiré: Enterprise signup still works (email)
→ Verdict: Defer to v2

Account linking:
→ Nécessité: ⚠️ Nice-to-have
→ Utilisé par: <5% edge case / Rare
→ Effort: 3 days (complex)
→ Impact si retiré: Users create new account (minor friction)
→ Verdict: Defer to v2

Scope optimisé:
• Keep (v1.0): Google OAuth only
• Keep (v1.1 - 1 week later): GitHub OAuth
• Defer (v2): Microsoft OAuth, Account linking

Impact: 5 days vs 2 weeks (-64%) / Lower risk / 68% → 95% coverage in v1.1

**5. User Experience & Journey**

Current UX: Email → Password → Confirm email → Login
Proposed UX: "Sign in with Google" → Done

User journey:
1. Land on signup page - Pain point actuel: See another form to fill
2. Enter email/password - Pain point actuel: Password fatigue, typos
3. Check email for confirmation - Pain point actuel: Delays, spam folder
4. Click link, return to app - Pain point actuel: Multi-step friction

Après cette feature:
→ One-click signup (1 step vs 4)
→ No password to remember
→ No email confirmation needed (OAuth verifies email)

Friction points:
• OAuth consent screen - Severity: Low (one-time, standard UX)
• Account exists with email - Severity: Medium (need clear error message)

**6. Success Metrics & Acceptance**

Comment on mesure le succès:
• Signup conversion: Target: 96% - Actuel: 88% (+8pts)
• Google auth usage: Target: 60% of new signups - Actuel: 0%
• Password reset tickets: Target: <10/month - Actuel: 47/month

Acceptance criteria:
✅ Fonctionnel (8):
  - User can signup with Google
  - User can login with Google
  - Email verified automatically via OAuth
  - Profile picture synced from Google
  - User can logout and re-login
  - Error handling for denied consent
  - Error handling for existing email
  - Works on mobile browsers

✅ Performance: OAuth flow < 3s end-to-end
✅ Edge cases (4):
  - User denies consent
  - OAuth provider down
  - Email already exists
  - OAuth returns no email

⚠️ Manquants:
  - Account linking criteria (deferred to v2)
  - Multi-provider same email (deferred to v2)

**7. Strategic & Competitive Context**

Strategic fit:
• Company strategy: Reduce friction in user acquisition
• Alignment: ✅ Strong
• Reasoning: Directly supports Q1 goal of 30% signup improvement

Competitive landscape:
• Linear: Google + GitHub only - Learning: Minimal providers work fine
• Notion: Google + Apple + SSO - Learning: Consumer + enterprise mix
• Vercel: GitHub-first (developer tool) - Learning: Match to audience
• Our position: Lagging (no OAuth at all)

Timing:
• Build now: Signup conversion is Q1 OKR, already behind competitors
• Defer 3-6 months: Continue losing 12% signups, support burden remains

**Product Score: 9/10**

Strengths:
• Clear validated problem with strong evidence
• Well-scoped solution (removed Microsoft, account linking)
• Measurable success criteria with baselines
• Strategic alignment excellent

Weaknesses:
• Could start even smaller (Google-only v1.0, add GitHub in v1.1)
• Alternative A (Auth0) not fully explored for cost/benefit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 TECHNICAL REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Architecture & Design**

Current architecture:
• Pattern: Express.js REST API + Passport.js local strategy
• Files: `src/auth/`, `src/middleware/auth.js`
• Tech stack: Node.js 18, Express 4.x, Passport.js, PostgreSQL

Proposed changes:
• Pattern: Add Passport OAuth2 strategies (Google, GitHub)
• Integration points: Existing auth middleware, user model
• Alignment: ✅ Cohérent

Justification: Passport.js already in use, adding strategies is natural extension

**2. Codebase Analysis**

Recherche codebase:
• `src/auth/passport-config.js` - Local strategy setup - Reusable: Yes
• `src/models/User.js` - User model - Applicable: Needs oauth fields
• `src/middleware/auth.js` - JWT middleware - Ready: Yes

Gaps:
• OAuth callback routes - Effort to create: 2 hours
• OAuth provider configs - Effort to create: 1 hour
• User model migration (oauth_provider, oauth_id) - Effort: 1 hour

Similar features:
• Email verification flow (`src/auth/verify.js`) - Approach: Similar callback pattern
  → What worked: Clear error messages, redirect handling
  → What to avoid: Complex state management (keep OAuth stateless)

**3. Implementation Breakdown**

Backend (~4 days):

Task 1: Add OAuth fields to User model + migration
→ Complexity: Simple
→ Risk: Migration rollback if issues
→ Dependencies: None
→ Estimation: 2 hours

Task 2: Setup Passport Google OAuth strategy
→ Complexity: Medium
→ Risk: Credential management, callback URL config
→ Dependencies: Google Cloud Console setup
→ Estimation: 4 hours

Task 3: Setup Passport GitHub OAuth strategy
→ Complexity: Medium
→ Risk: GitHub app registration, scope confusion
→ Dependencies: GitHub OAuth app
→ Estimation: 3 hours

Task 4: Implement OAuth callback routes + error handling
→ Complexity: Medium
→ Risk: State parameter validation, CSRF
→ Dependencies: Tasks 2-3
→ Estimation: 4 hours

Task 5: Update login/signup flows to support OAuth
→ Complexity: Simple
→ Risk: Breaking existing auth
→ Dependencies: All above
→ Estimation: 3 hours

Frontend (~2 days):

Task 1: Add OAuth buttons to signup/login pages
→ Complexity: Simple
→ Risk: UX consistency with existing design
→ Dependencies: Design system
→ Estimation: 3 hours

Task 2: Handle OAuth redirects and loading states
→ Complexity: Medium
→ Risk: Browser popup blockers, mobile compatibility
→ Dependencies: None
→ Estimation: 4 hours

Task 3: Error handling UI for OAuth failures
→ Complexity: Simple
→ Risk: None
→ Dependencies: None
→ Estimation: 2 hours

Infrastructure & DevOps (~1 day):

Task 1: Setup OAuth app credentials (Google, GitHub)
→ Complexity: Simple
→ Risk: Credential leakage, wrong env
→ Dependencies: Access to Google Cloud, GitHub
→ Estimation: 2 hours

Task 2: Add callback URLs to allowed origins
→ Complexity: Simple
→ Risk: CORS issues in production
→ Dependencies: None
→ Estimation: 1 hour

Task 3: Update environment variables, secrets management
→ Complexity: Simple
→ Risk: Production secret rotation
→ Dependencies: DevOps access
→ Estimation: 2 hours

Testing & QA (~2 days):
• Unit tests: OAuth strategy mocks (8 scenarios) - 4 hours
• Integration tests: Full OAuth flow (4 providers × 2 states) - 6 hours
• E2E tests: Signup/login with OAuth (3 critical flows) - 4 hours

Total realistic estimation: 9 days (70% confidence)

**4. Dependencies & Blockers**

Technical dependencies:
• Google Cloud Console access - Status: Ready (DevOps has access)
  → Impact if not ready: Can't create OAuth credentials

• GitHub OAuth app registration - Status: Ready (can self-register)
  → Impact if not ready: GitHub flow blocked, Google still works

Team dependencies:
• DevOps for secret management - Available: Yes
• Design for OAuth button design - Needed for: UI consistency

Hard blockers: None
Soft dependencies: Design approval for button UX

**5. Tech Stack & Debt**

New dependencies:
• passport-google-oauth20 - v2.0.0 - Risk: Well-maintained (50k weekly downloads)
• passport-github2 - v0.1.12 - Risk: Low activity, consider passport-github instead

Breaking changes: No

Tech debt:
• Created: OAuth provider abstraction not implemented (hardcoded per provider)
  - Severity: Low (only 2 providers, acceptable)
• Paid: Removes custom password reset flow complexity
  - Value: Medium (less maintenance, fewer bugs)
• Net impact: 🟢 Positive (debt paid > debt created)

**6. Quality, Performance & Security**

Performance:
• Expected impact: OAuth redirect adds 1-2s (external provider latency)
• SLA targets: Total auth flow < 3s (acceptable for signup)
• Load concerns: None (OAuth offloads auth to Google/GitHub)
• Monitoring: Track OAuth success rate, provider latency

Security:
• New attack surface: OAuth callback, state parameter validation
• Data sensitivity: OAuth tokens (store encrypted), user email (PII)
• Auth/Authz: Passport handles token validation, use state param for CSRF
• Compliance: GDPR - OAuth providers are processors, privacy policy update needed

Scalability:
• Current limit: DB writes for user creation
• After this: Same (OAuth just changes auth method, not scaling)
• Bottlenecks: None

**7. Risk Assessment**

Technical risks:

Risk 1: OAuth provider outage blocks all signups
→ Likelihood: Low (Google/GitHub 99.9% uptime)
→ Impact: High (no fallback to email signup)
→ Mitigation: Keep email/password option, don't force OAuth-only

Risk 2: Credential leakage in logs or errors
→ Likelihood: Medium (common OAuth mistake)
→ Impact: High (account takeover)
→ Mitigation: Sanitize logs, use secrets manager, code review

Risk 3: State parameter bypass (CSRF)
→ Likelihood: Low (Passport handles this)
→ Impact: High (session hijacking)
→ Mitigation: Test with CSRF tools, security review

Unknowns:
• Mobile browser OAuth popup behavior - How to derisk: Test on iOS Safari, Android Chrome
• Production OAuth callback URL whitelisting - How to derisk: Staging environment test first

**Technical Score: 8/10**

Mon feeling technique:
Straightforward implementation using existing Passport.js infrastructure. Main risks are OAuth security (state param, credential management) but Passport handles most of it. 9-day estimate is realistic with testing. The passport-github2 dependency is slightly concerning (low activity) but it's the recommended library. Overall, low technical risk.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SYNTHÈSE & DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Grade Final: A-** (Product: 9/10 | Technical: 8/10)

**Mon feeling global**:

Excellent PRD with strong user validation and clear business case. The scope challenge revealed we can ship even smaller (Google-only v1.0) which is smarter than the current 2-provider plan. Technical implementation is low-risk since we're already using Passport.js. Main watch-outs are OAuth security best practices and the passport-github2 dependency. This is a textbook "high-value, low-risk" feature that should be prioritized.

**3 Challenges Critiques**:

1️⃣ KILL Challenge: Devrait-on construire ça?
→ Problème validé: Yes - 12% signup drop-off, 47 support tickets, user research
→ Alternatives meilleures: No - Auth0 costs recurring $, magic links don't solve one-click
→ Strategic fit: Strong (Q1 OKR alignment)
→ **Mon verdict**: ✅ Build
→ **Pourquoi**: Clear ROI (8pt conversion improvement), validated pain, strategic priority

2️⃣ TIMING Challenge: Maintenant ou plus tard?
→ Urgency: High - Q1 OKR dependency, competitive gap
→ Team capacity: Available - Backend team has bandwidth
→ Dependencies ready: Yes - All technical deps accessible
→ Opportunity cost: Low - Other Q1 work not blocked
→ **Mon verdict**: 🚀 Now (Q1 2025)
→ **Pourquoi**: Perfect timing for Q1 goals, no blockers, high impact

3️⃣ SCOPE Challenge: Tout ou partie?
→ MVP viable: Yes - Google-only covers 68% of signups
→ Effort saved: 64% (5 days vs 14 days)
→ Value preserved: 68% in v1.0, 95% after v1.1 (1 week later)
→ **Mon verdict**: 📦 MVP first (Google → GitHub → Microsoft)
→ **Pourquoi**: Ship Google in week 1, validate, add GitHub week 2. Lower risk, faster feedback.

**Blockers** (must fix avant /setup-prd):

🔴 Scope reduction needed
→ Action: Remove Microsoft OAuth and Account Linking from v1
→ Owner: Product owner to update PRD scope section

🔴 Privacy policy update for OAuth
→ Action: Legal review for Google/GitHub as data processors
→ Owner: Legal team + Product owner

**Recommendations** (pour améliorer le grade):

🟡 Consider Auth0/Clerk alternative
→ Impact grade: A- → A (reduces engineering maintenance)
→ Effort: 2 days evaluation + cost analysis
→ Worth it: Maybe - Should evaluate $300/month vs 9 days eng time

🟡 Add monitoring/alerting for OAuth success rate
→ Impact grade: A- → A (better observability)
→ Effort: 3 hours
→ Worth it: Yes - Critical to catch provider issues early

**ROI Summary**:

Effort: 5 days MVP + 1 day v1.1 = 6 days (85% confidence)
Value: High (+8pt conversion = ~$50k ARR impact)
Risk: Low (proven libraries, small scope)
ROI: 🟢 Excellent

**Next Steps**:

✅ **Ready for development**

Recommended priority: P0 (Q1 OKR critical)

Actions:
1. Product owner updates scope (remove Microsoft, Account linking) - 30 min
2. Legal review for privacy policy - 1 day
3. /setup-prd PRD-007 (creates branch + moves to ready/)
4. /code-prd PRD-007 (start implementation)

Expected delivery: Week 1 (Google OAuth), Week 2 (GitHub OAuth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Configuration

Uses these config settings:
```json
{
  "prd_workflow": {
    "directories": {
      "draft": "product/prds/01-draft",
      "ready": "product/prds/02-ready"
    },
    "review": {
      "output_format": "comprehensive",
      "grading_enabled": true,
      "minimum_grade": "C"
    }
  }
}
```

---

## Success Criteria

- ✅ Product validation complete (problem, solution, alternatives, scope)
- ✅ Technical feasibility assessed (architecture, breakdown, risks)
- ✅ Clear grade (A-F) with honest assessment
- ✅ 3 critical challenges answered (KILL/TIMING/SCOPE)
- ✅ Actionable next steps based on grade
- ✅ User has clear understanding of PRD quality and readiness

---

## Tips

- **Be thorough in product review** - Most PRD failures are building wrong thing
- **Challenge assumptions** - Ask for evidence, not opinions
- **Research the codebase** - Real files, real patterns, real gaps
- **Be honest** - Share your real feeling, don't sugarcoat
- **Think ROI** - Effort vs Value vs Risk
- **Suggest optimizations** - Smaller scope, phased approach, alternatives

---

**Version**: 2.0.0
**Plugin**: claude-prd-workflow v0.4.0
**Category**: PRD Management
