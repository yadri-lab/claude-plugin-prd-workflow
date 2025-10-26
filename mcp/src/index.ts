#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getPRDTools } from "./tools.js";
import { getPRDResources, readPRDResource } from "./resources.js";

/**
 * PRD Workflow MCP Server
 *
 * Exposes PRDs via Model Context Protocol for live access from Claude Code.
 *
 * Usage:
 * Add to your Claude Code config:
 * {
 *   "mcpServers": {
 *     "prd-workflow": {
 *       "command": "npx",
 *       "args": ["@claude-prd/mcp"]
 *     }
 *   }
 * }
 */

const server = new Server(
  {
    name: "prd-workflow",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * List available tools
 * Tools allow Claude to perform actions on PRDs
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: getPRDTools(),
  };
});

/**
 * Handle tool calls
 * Execute PRD operations requested by Claude
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_prd":
        return await handleGetPRD(args);
      case "list_prds":
        return await handleListPRDs(args);
      case "get_acceptance_criteria":
        return await handleGetAcceptanceCriteria(args);
      case "get_tech_stack":
        return await handleGetTechStack(args);
      case "update_prd_status":
        return await handleUpdatePRDStatus(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * List available resources
 * Resources expose PRD content for reading
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: await getPRDResources(),
  };
});

/**
 * Read resource content
 * Return full PRD markdown or filtered data
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    return await readPRDResource(uri);
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error reading resource: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

/**
 * Tool Handlers
 */

async function handleGetPRD(args: any) {
  const { prd_id } = args;

  if (!prd_id) {
    throw new Error("prd_id is required");
  }

  const fs = require("fs-extra");
  const path = require("path");
  const yaml = require("yaml");

  // Search for PRD in all directories
  const prdDirs = [
    "product/prds/01-draft",
    "product/prds/02-review",
    "product/prds/03-ready",
    "product/prds/04-in-progress",
    "product/prds/05-complete",
  ];

  for (const dir of prdDirs) {
    const files = await fs.readdir(dir).catch(() => []);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");

        // Check if this is the PRD we're looking for
        if (content.includes(`**PRD ID**: ${prd_id}`) || content.includes(`# ${prd_id}:`)) {
          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        }
      }
    }
  }

  throw new Error(`PRD ${prd_id} not found`);
}

async function handleListPRDs(args: any) {
  const { status, priority } = args || {};

  const fs = require("fs-extra");
  const path = require("path");

  const prds: any[] = [];

  const statusDirs = {
    draft: "product/prds/01-draft",
    review: "product/prds/02-review",
    ready: "product/prds/03-ready",
    "in-progress": "product/prds/04-in-progress",
    complete: "product/prds/05-complete",
  };

  for (const [statusName, dir] of Object.entries(statusDirs)) {
    if (status && status !== statusName) continue;

    const files = await fs.readdir(dir).catch(() => []);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");

        // Extract metadata
        const idMatch = content.match(/\*\*PRD ID\*\*: (PRD-\d+)/);
        const nameMatch = content.match(/# (PRD-\d+): (.+)/);
        const priorityMatch = content.match(/\*\*Priority\*\*: (P\d)/);
        const gradeMatch = content.match(/\*\*Grade\*\*: ([A-F][+-]?)/);

        if (idMatch || nameMatch) {
          const prdId = idMatch?.[1] || nameMatch?.[1];
          const prdName = nameMatch?.[2] || "Unknown";
          const prdPriority = priorityMatch?.[1] || "P2";
          const prdGrade = gradeMatch?.[1] || null;

          if (priority && priority !== prdPriority) continue;

          prds.push({
            id: prdId,
            name: prdName,
            status: statusName,
            priority: prdPriority,
            grade: prdGrade,
          });
        }
      }
    }
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(prds, null, 2),
      },
    ],
  };
}

async function handleGetAcceptanceCriteria(args: any) {
  const { prd_id } = args;

  if (!prd_id) {
    throw new Error("prd_id is required");
  }

  const prdContent = await handleGetPRD({ prd_id });
  const content = prdContent.content[0].text;

  // Extract acceptance criteria section
  const acMatch = content.match(/## Acceptance Criteria\n\n([\s\S]*?)(?=\n## |$)/);

  if (!acMatch) {
    throw new Error(`No acceptance criteria found in ${prd_id}`);
  }

  const criteria = acMatch[1].trim();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          prd_id,
          acceptance_criteria: criteria.split("\n").filter((line) => line.trim()),
        }, null, 2),
      },
    ],
  };
}

async function handleGetTechStack(args: any) {
  const { prd_id } = args;

  if (!prd_id) {
    throw new Error("prd_id is required");
  }

  const prdContent = await handleGetPRD({ prd_id });
  const content = prdContent.content[0].text;

  // Extract tech stack section
  const techMatch = content.match(/## Tech Stack\n\n([\s\S]*?)(?=\n## |$)/);

  if (!techMatch) {
    throw new Error(`No tech stack found in ${prd_id}`);
  }

  const techStack = techMatch[1].trim();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          prd_id,
          tech_stack: techStack.split("\n").filter((line) => line.trim()),
        }, null, 2),
      },
    ],
  };
}

async function handleUpdatePRDStatus(args: any) {
  const { prd_id, new_status } = args;

  if (!prd_id || !new_status) {
    throw new Error("prd_id and new_status are required");
  }

  const fs = require("fs-extra");
  const path = require("path");

  const statusDirs = {
    draft: "product/prds/01-draft",
    review: "product/prds/02-review",
    ready: "product/prds/03-ready",
    "in-progress": "product/prds/04-in-progress",
    complete: "product/prds/05-complete",
  };

  // Find current PRD file
  let currentFile: string | null = null;
  let currentDir: string | null = null;
  let currentContent: string | null = null;

  for (const [statusName, dir] of Object.entries(statusDirs)) {
    const files = await fs.readdir(dir).catch(() => []);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");

        if (content.includes(`**PRD ID**: ${prd_id}`) || content.includes(`# ${prd_id}:`)) {
          currentFile = file;
          currentDir = dir;
          currentContent = content;
          break;
        }
      }
    }

    if (currentFile) break;
  }

  if (!currentFile || !currentDir || !currentContent) {
    throw new Error(`PRD ${prd_id} not found`);
  }

  const targetDir = statusDirs[new_status as keyof typeof statusDirs];

  if (!targetDir) {
    throw new Error(`Invalid status: ${new_status}`);
  }

  // Move file to new directory
  const sourcePath = path.join(currentDir, currentFile);
  const targetPath = path.join(targetDir, currentFile);

  await fs.move(sourcePath, targetPath, { overwrite: true });

  return {
    content: [
      {
        type: "text",
        text: `PRD ${prd_id} moved to ${new_status}`,
      },
    ],
  };
}

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("PRD Workflow MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
