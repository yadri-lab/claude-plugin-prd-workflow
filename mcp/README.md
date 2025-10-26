# @claude-prd/mcp

Model Context Protocol (MCP) server for PRD Workflow Manager.

Exposes your PRDs as resources and tools that Claude Code can access directly during conversations.

## Features

**Tools** (Actions Claude can perform):
- `get_prd` - Fetch a complete PRD by ID
- `list_prds` - List all PRDs with optional filters
- `get_acceptance_criteria` - Fetch just the acceptance criteria
- `get_tech_stack` - Fetch just the tech stack decisions
- `update_prd_status` - Move a PRD to a different status

**Resources** (Content Claude can read):
- `prd://PRD-003` - Individual PRD documents
- `prds://all` - List of all PRDs
- `prds://status/ready` - PRDs filtered by status

## Installation

### 1. Install the MCP server

```bash
npm install -g @claude-prd/mcp
```

### 2. Configure Claude Code

Add to your Claude Code configuration file (`~/.config/claude-code/config.json` or equivalent):

```json
{
  "mcpServers": {
    "prd-workflow": {
      "command": "npx",
      "args": ["@claude-prd/mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "prd-workflow": {
      "command": "claude-prd-mcp"
    }
  }
}
```

### 3. Restart Claude Code

The MCP server will start automatically when Claude Code launches.

## Usage Examples

Once configured, Claude Code can directly access your PRDs:

**Example 1: Check acceptance criteria**
```
User: "What are the acceptance criteria for PRD-003?"

Claude internally calls:
  → get_acceptance_criteria({ prd_id: "PRD-003" })

Response:
  {
    "prd_id": "PRD-003",
    "acceptance_criteria": [
      "P0: All components render without errors",
      "P0: Storybook stories for each component",
      "P1: Accessibility audit passes WCAG AA"
    ]
  }
```

**Example 2: List ready PRDs**
```
User: "Show me all P0 PRDs that are ready for development"

Claude internally calls:
  → list_prds({ priority: "P0", status: "ready" })

Response:
  [
    { "id": "PRD-004", "name": "Landing Page", "priority": "P0", "status": "ready", "grade": "B+" },
    { "id": "PRD-007", "name": "User Auth", "priority": "P0", "status": "ready", "grade": "A" }
  ]
```

**Example 3: Move PRD to different status**
```
User: "Move PRD-003 to in-progress"

Claude internally calls:
  → update_prd_status({ prd_id: "PRD-003", new_status: "in-progress" })

Response:
  "PRD PRD-003 moved to in-progress"
```

## Directory Structure

The MCP server expects PRDs to be organized in this structure:

```
product/prds/
  ├── 01-draft/        # PRDs being written
  ├── 02-review/       # PRDs under review
  ├── 03-ready/        # Ready for development
  ├── 04-in-progress/  # Currently being developed
  └── 05-complete/     # Finished features
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Test Locally

```bash
# In the mcp directory
npm run build
node dist/index.js
```

## Troubleshooting

**MCP server not showing up in Claude Code**
- Restart Claude Code after updating config
- Check config file syntax (valid JSON)
- Verify `@claude-prd/mcp` is installed: `npm list -g @claude-prd/mcp`

**Error: "PRD not found"**
- Ensure PRDs are in the expected directory structure
- PRD must have `**PRD ID**: PRD-XXX` or `# PRD-XXX:` in content

**Tools not working**
- Check MCP server logs in Claude Code
- Verify PRD files are valid markdown with proper metadata

## License

MIT - See LICENSE file in main repository

## Links

- [Main Plugin Repository](https://github.com/Yassinello/claude-prd-workflow)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Code Docs](https://docs.claude.com/claude-code)
