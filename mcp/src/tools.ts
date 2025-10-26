/**
 * PRD Workflow Tools
 *
 * Tools allow Claude to perform actions on PRDs
 */

export function getPRDTools() {
  return [
    {
      name: "get_prd",
      description: "Fetch a complete PRD by its ID (e.g., PRD-003)",
      inputSchema: {
        type: "object",
        properties: {
          prd_id: {
            type: "string",
            description: "PRD ID (e.g., PRD-003)",
          },
        },
        required: ["prd_id"],
      },
    },
    {
      name: "list_prds",
      description: "List all PRDs with optional filters by status or priority",
      inputSchema: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["draft", "review", "ready", "in-progress", "complete"],
            description: "Filter by PRD status",
          },
          priority: {
            type: "string",
            enum: ["P0", "P1", "P2", "P3"],
            description: "Filter by priority level",
          },
        },
      },
    },
    {
      name: "get_acceptance_criteria",
      description: "Fetch only the acceptance criteria section from a PRD",
      inputSchema: {
        type: "object",
        properties: {
          prd_id: {
            type: "string",
            description: "PRD ID (e.g., PRD-003)",
          },
        },
        required: ["prd_id"],
      },
    },
    {
      name: "get_tech_stack",
      description: "Fetch only the tech stack decisions from a PRD",
      inputSchema: {
        type: "object",
        properties: {
          prd_id: {
            type: "string",
            description: "PRD ID (e.g., PRD-003)",
          },
        },
        required: ["prd_id"],
      },
    },
    {
      name: "update_prd_status",
      description: "Update a PRD's status (moves it to a different directory)",
      inputSchema: {
        type: "object",
        properties: {
          prd_id: {
            type: "string",
            description: "PRD ID (e.g., PRD-003)",
          },
          new_status: {
            type: "string",
            enum: ["draft", "review", "ready", "in-progress", "complete"],
            description: "New status for the PRD",
          },
        },
        required: ["prd_id", "new_status"],
      },
    },
  ];
}
