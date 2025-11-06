# Validation Report: {{PRD_ID}} - {{FEATURE_NAME}}

**Date**: {{DATE}}
**Implementation Branch**: {{BRANCH_NAME}}
**Plan Reference**: [Link to plan]({{PLAN_PATH}})
**PRD Reference**: [Link to PRD]({{PRD_PATH}})

---

## ✅ Implemented Correctly

### Phase 1: Research
- ✓ Research phase completed
- ✓ Research document generated with correct structure
- ✓ Context cleared after research

### Phase 2: Planning
- ✓ Plan generated from research document
- ✓ Plan includes sub-phases with success criteria
- ✓ Context cleared after planning

### Phase 3: Implementation
- ✓ All sub-phases from plan completed
- ✓ Context managed throughout (stayed < 60%)
- ✓ Code follows patterns identified in research

### Phase 4: Validation
- ✓ This validation report generated automatically

---

## ⚠️ Deviations from Plan

### Beneficial Changes (Improvements)

**Change 1**: [Description]
- **Why**: [Justification]
- **Impact**: [Positive impact]
- **Decision**: Documented in {{LOCATION}}

**Change 2**: [Description]
- **Why**: [Justification]
- **Impact**: [Positive impact]
- **Decision**: Documented in {{LOCATION}}

### Unplanned Omissions (Scope Cuts)

**Omission 1**: [What was skipped]
- **Why**: [Reason - complexity, time, dependencies]
- **Impact**: [Effect on functionality]
- **Mitigation**: [How addressed or deferred]
- **Tracked**: [Future PRD or issue]

---

## ❌ Issues Found

### Critical (Must fix before merge)

**Issue 1**: [Description]
- **Location**: `path/to/file.ts:line`
- **Impact**: [Severity]
- **Action Required**: [Fix needed]

[If none, state: None - ready to merge]

### Non-Critical (Can address in follow-up)

**Issue 1**: [Description]
- **Location**: `path/to/file.ts:line`
- **Impact**: [Minor issue]
- **Recommendation**: [Optional improvement]
- **Priority**: [Low/Medium]

[If none, state: None]

---

## 📊 Acceptance Criteria Review

### From PRD P0 (Must Have)

- [x] **AC 1**: {{CRITERIA}}
  - **Status**: ✅ Implemented
  - **Evidence**: [File/test/demo]

- [x] **AC 2**: {{CRITERIA}}
  - **Status**: ✅ Implemented
  - **Evidence**: [File/test/demo]

- [ ] **AC 3**: {{CRITERIA}}
  - **Status**: ⚠️ Partial / ❌ Not Implemented
  - **Reason**: [Why not complete]
  - **Plan**: [How to address]

### From PRD P1 (Should Have)

- [x] **AC 1**: {{CRITERIA}}
  - **Status**: ✅ Implemented / 📦 Deferred
  - **Note**: [Context]

[Continue for all acceptance criteria...]

---

## 📈 Performance Validation

**Context Usage**:
- Research phase: {{X}}% (Target: <60%)
- Plan phase: {{X}}% (Target: <60%)
- Implementation: {{X}}% average (Target: <60%)
- Validation phase: {{X}}% (Target: <60%)

**Timing** (if applicable):
- Research phase: {{X}} minutes (Target: <2 min)
- Plan phase: {{X}} minutes (Target: <3 min)
- Validation phase: {{X}} minutes (Target: <1 min)

**Status**: ✅ Meets targets / ⚠️ Exceeds targets

---

## 🧪 Testing Status

**Unit Tests**:
- Coverage: {{X}}%
- Pass/Fail: {{X}}/{{X}}
- Status: ✅ Passing / ❌ Failing

**Integration Tests**:
- Coverage: {{X}}%
- Pass/Fail: {{X}}/{{X}}
- Status: ✅ Passing / ❌ Failing

**Manual Testing**:
- [ ] Happy path verified
- [ ] Edge cases tested
- [ ] Error handling verified
- [ ] Backward compatibility confirmed

---

## 📝 Documentation Status

- [x] README updated with new features
- [x] Command help text updated
- [x] Examples added
- [x] Migration guide provided (if breaking)
- [x] Changelog updated
- [ ] Additional docs needed: [Specify]

---

## 🎯 Recommendation

**Status**: ✅ Ready to Merge / ⚠️ Needs Minor Fixes / ❌ Not Ready

**Rationale**: [Clear explanation of recommendation]

**Confidence Level**: High / Medium / Low

**Risks**: [Any remaining risks or concerns]

---

## 📋 Next Steps

**If Ready to Merge**:
1. ✅ Create PR with this validation report
2. ✅ Request code review
3. ✅ Run `/complete-prd {{PRD_ID}}` after merge

**If Needs Fixes**:
1. ⚠️ Address critical issues listed above
2. ⚠️ Re-run validation
3. ⚠️ Update this report

**If Not Ready**:
1. ❌ Review deviations and omissions
2. ❌ Determine if scope needs adjustment
3. ❌ Consult team before proceeding

---

## 🔗 Related Artifacts

- Research: [Link to research doc]({{RESEARCH_PATH}})
- Plan: [Link to plan doc]({{PLAN_PATH}})
- PRD: [Link to PRD]({{PRD_PATH}})
- Branch: {{BRANCH_NAME}}
- Thoughts directory: `.prds/thoughts/`

---

*Generated automatically by Context Engineering workflow v0.4.0*
