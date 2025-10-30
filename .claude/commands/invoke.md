---
name: invoke
description: Orchestrate multiple agents for complex tasks
category: Agent Orchestration
---

# Invoke Command

Analyze task complexity and orchestrate specialized agents to generate comprehensive implementation plans.

## Purpose

For complex tasks requiring multiple perspectives:
- Auto-detect complexity from task description
- Recommend and invoke relevant specialist agents
- Generate coordinated outputs (architecture, security, tests, plan)
- Provide visibility into agent pipeline

## Usage

```bash
# Interactive mode
/invoke

# With task description
/invoke "implement Stripe payment system with webhooks"

# Skip confirmation
/invoke "..." --yes

# Custom agent selection
/invoke "..." --agents backend-architect,security-expert
```

## Workflow

### Step 1: Parse Task Description

Extract signals from user input:

```bash
TASK="$1"  # User's task description

# Extract keywords
KEYWORDS=$(echo "$TASK" | tr '[:upper:]' '[:lower:]')

# Initialize complexity score
COMPLEXITY=0
AGENTS_RECOMMENDED=()
```

### Step 2: Analyze Complexity

Score based on detected signals:

```bash
# Security-sensitive keywords
if [[ "$KEYWORDS" =~ (payment|auth|oauth|security|token|credential) ]]; then
  COMPLEXITY=$((COMPLEXITY + 3))
  AGENTS_RECOMMENDED+=("security-expert")
  echo "🔒 Security-sensitive task detected (+3)"
fi

# Third-party integration
if [[ "$KEYWORDS" =~ (stripe|api|integration|webhook|third-party) ]]; then
  COMPLEXITY=$((COMPLEXITY + 2))
  AGENTS_RECOMMENDED+=("backend-architect")
  echo "🔌 Third-party integration detected (+2)"
fi

# Async/event-driven
if [[ "$KEYWORDS" =~ (webhook|async|event|real-time|websocket) ]]; then
  COMPLEXITY=$((COMPLEXITY + 2))
  AGENTS_RECOMMENDED+=("test-automator")
  echo "⚡ Async complexity detected (+2)"
fi

# Database/schema
if [[ "$KEYWORDS" =~ (database|schema|migration|sql|table) ]]; then
  COMPLEXITY=$((COMPLEXITY + 2))
  AGENTS_RECOMMENDED+=("database-architect")
  echo "💾 Database work detected (+2)"
fi

# Multi-service
if [[ "$KEYWORDS" =~ (microservice|service|distributed) ]]; then
  COMPLEXITY=$((COMPLEXITY + 2))
  echo "🌐 Multi-service architecture detected (+2)"
fi

# Testing complexity
if [[ "$KEYWORDS" =~ (test|testing|qa) ]]; then
  COMPLEXITY=$((COMPLEXITY + 1))
  echo "🧪 Testing requirements detected (+1)"
fi

# Always include prd-implementer for task breakdown
AGENTS_RECOMMENDED+=("prd-implementer")
```

**Determine complexity level**:

```bash
if [ $COMPLEXITY -le 3 ]; then
  COMPLEXITY_LEVEL="LOW"
  echo "📊 Complexity: LOW (score: $COMPLEXITY/10)"
elif [ $COMPLEXITY -le 6 ]; then
  COMPLEXITY_LEVEL="MEDIUM"
  echo "📊 Complexity: MEDIUM (score: $COMPLEXITY/10)"
else
  COMPLEXITY_LEVEL="HIGH"
  echo "📊 Complexity: HIGH (score: $COMPLEXITY/10)"
fi
```

### Step 3: Build Agent Pipeline

**Remove duplicates and order agents**:

```bash
# Remove duplicates
AGENTS_UNIQUE=($(echo "${AGENTS_RECOMMENDED[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))

# Order: specialists first, implementer last
ORDERED_AGENTS=()

for agent in "${AGENTS_UNIQUE[@]}"; do
  if [ "$agent" != "prd-implementer" ]; then
    ORDERED_AGENTS+=("$agent")
  fi
done

# prd-implementer always goes last
ORDERED_AGENTS+=("prd-implementer")
```

### Step 4: Display Pipeline & Get Consent

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 TASK ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: [user input]
Complexity: [LOW|MEDIUM|HIGH] ([score]/10)

Signals detected:
• [signal 1] → [implication]
• [signal 2] → [implication]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 RECOMMENDED AGENT PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each agent in pipeline:]

1. [agent-name]
   Purpose: [What this agent will do]
   Estimated: [X min]
   Output: [What it produces]

2. [next-agent]
   ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~[X] min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Proceed with this pipeline?
   [Y] Yes, run all agents
   [C] Customize (pick specific agents)
   [N] No, cancel

> _
```

**Handle user response**:

```bash
read -r response

if [ "$response" = "Y" ] || [ "$response" = "y" ]; then
  echo "✅ Starting agent pipeline..."
  PROCEED=true
elif [ "$response" = "C" ] || [ "$response" = "c" ]; then
  echo ""
  echo "Available agents:"
  for i in "${!ORDERED_AGENTS[@]}"; do
    echo "  $((i+1)). ${ORDERED_AGENTS[$i]}"
  done
  echo ""
  echo "Enter agent numbers (comma-separated, e.g., 1,3,4):"
  read -r selection

  # Parse selection
  IFS=',' read -ra SELECTED <<< "$selection"
  ORDERED_AGENTS=()
  for idx in "${SELECTED[@]}"; do
    ORDERED_AGENTS+=("${ORDERED_AGENTS[$((idx-1))]}")
  done

  PROCEED=true
else
  echo "❌ Pipeline cancelled"
  exit 0
fi
```

### Step 5: Execute Agent Pipeline

For each agent in pipeline:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AGENT [N]/[TOTAL]: [agent-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Invoke agent using Task tool with appropriate subagent_type]

Example for backend-architect:
```

```bash
# Create agent output directory if needed
mkdir -p .claude/agents

# Invoke agent (using Task tool)
echo "🔄 Analyzing task..."
echo "🔄 Generating architecture..."
echo "🔄 Defining API contracts..."

# Simulate agent execution
# In real implementation, use Task tool:
# Task(subagent_type="backend-architect", prompt="...")

echo ""
echo "✅ Complete ([time]s)"
echo ""
echo "📄 Output: .claude/agents/backend-architect-output.md"
echo ""
echo "Key decisions:"
echo "• [Decision 1]"
echo "• [Decision 2]"
echo ""
echo "Continue to next agent? (y/n)"
read -r cont

if [ "$cont" != "y" ]; then
  echo "⏸️  Pipeline paused"
  echo "📋 Partial outputs saved in .claude/agents/"
  exit 0
fi
```

**Agent-specific configurations**:

| Agent | Purpose | Estimated Time | Output |
|-------|---------|----------------|--------|
| backend-architect | Design APIs, architecture, data flow | 5 min | Architecture doc + API contracts |
| security-expert | Security review, threat model, compliance | 3 min | Security checklist + mitigations |
| database-architect | Schema design, migrations, indexes | 4 min | Schema + migration plan |
| test-automator | Test strategy, mocking, edge cases | 2 min | Test plan + test cases |
| prd-implementer | Task breakdown, phased plan | 4 min | Implementation plan (20-30 tasks) |

### Step 6: Pipeline Summary

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PIPELINE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  Total time: [X]m [Y]s

📋 Outputs generated:
   • Architecture: .claude/agents/backend-architect-output.md
   • Security: .claude/agents/security-expert-output.md
   • Database: .claude/agents/database-architect-output.md
   • Tests: .claude/agents/test-automator-output.md
   • Implementation Plan: .claude/agents/implementation-plan.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Next steps:
   1. Review outputs in .claude/agents/
   2. Create PRD from plan (optional): /create-prd
   3. Start implementation: /code-prd

Or run: cat .claude/agents/implementation-plan.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Integration with /code-prd

The `/code-prd` command can auto-invoke this pipeline:

```bash
/code-prd PRD-007

→ 📊 Analyzing PRD-007 complexity...
   Detected: OAuth (security-sensitive), 3 providers (high)

→ 💡 RECOMMENDATION
   This PRD would benefit from agent analysis.

   ❓ Run /invoke pipeline first? (Y/n)
```

If user accepts, runs `/invoke` with PRD context, then continues with implementation.

## Configuration

Uses config from `.claude/config.json`:

```json
{
  "agents": {
    "orchestrator": {
      "enabled": true,
      "show_pipeline": true,
      "require_consent": false
    },
    "backend_architect": {
      "enabled": true
    },
    "security_expert": {
      "enabled": true
    },
    "test_automator": {
      "enabled": true
    },
    "prd_implementer": {
      "enabled": true
    }
  }
}
```

## Options

```bash
# Interactive (prompts for task)
/invoke

# Direct task
/invoke "build real-time chat with WebSocket"

# Skip confirmation (auto-proceed)
/invoke "..." --yes

# Custom agents (override recommendations)
/invoke "..." --agents backend-architect,security-expert

# Quiet mode (minimal output)
/invoke "..." --quiet
```

## Examples

### Example 1: Payment System

```bash
/invoke "implement Stripe payment system with webhooks"

→ Complexity: HIGH (8/10)
→ Recommended: backend-architect, security-expert, test-automator, prd-implementer
→ Estimated: 14 min

Results:
• Architecture with webhook queue (Redis)
• Security: PCI compliance checklist
• Tests: Webhook mocking strategy
• Plan: 28 tasks, 18-24 hours
```

### Example 2: Simple CRUD

```bash
/invoke "add user profile edit page"

→ Complexity: LOW (2/10)
→ Recommended: prd-implementer
→ Estimated: 4 min

Results:
• Plan: 8 tasks, 4-6 hours
```

### Example 3: Real-time Feature

```bash
/invoke "add real-time notifications with WebSocket"

→ Complexity: MEDIUM (6/10)
→ Recommended: backend-architect, test-automator, prd-implementer
→ Estimated: 11 min

Results:
• Architecture: WebSocket server design
• Tests: Connection handling, reconnection tests
• Plan: 22 tasks, 12-16 hours
```

## Success Criteria

- ✅ Correct complexity detection (matches actual task difficulty)
- ✅ Relevant agent recommendations (no unnecessary agents)
- ✅ Complete outputs from all agents
- ✅ Clear next steps provided
- ✅ Total time < estimated time

## Target Metrics

- **Agent accuracy**: 90% of recommendations accepted by users
- **Time accuracy**: Actual time within 20% of estimate
- **Output quality**: All outputs actionable and specific

## Related

- Config: `.claude/config.json` (agents section)
- Integration: `/code-prd` (auto-suggests /invoke for complex PRDs)
- Agents: backend-architect, security-expert, test-automator, prd-implementer

---

Plugin: claude-prd-workflow
Category: Agent Orchestration
Version: 0.3.1
Requires: Agent subsystem enabled
