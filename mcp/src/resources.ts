/**
 * PRD Workflow Resources
 *
 * Resources expose PRD content for reading via URI patterns
 */

const fs = require("fs-extra");
const path = require("path");

export async function getPRDResources() {
  const resources: any[] = [];

  const statusDirs = {
    draft: "product/prds/01-draft",
    review: "product/prds/02-review",
    ready: "product/prds/03-ready",
    "in-progress": "product/prds/04-in-progress",
    complete: "product/prds/05-complete",
  };

  // Add individual PRD resources
  for (const [statusName, dir] of Object.entries(statusDirs)) {
    const files = await fs.readdir(dir).catch(() => []);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");

        // Extract PRD ID
        const idMatch = content.match(/\*\*PRD ID\*\*: (PRD-\d+)/) || content.match(/# (PRD-\d+):/);

        if (idMatch) {
          const prdId = idMatch[1];

          resources.push({
            uri: `prd://${prdId}`,
            name: `${prdId} - PRD Document`,
            description: `Full PRD content for ${prdId} (Status: ${statusName})`,
            mimeType: "text/markdown",
          });
        }
      }
    }
  }

  // Add aggregate resources
  resources.push(
    {
      uri: "prds://all",
      name: "All PRDs",
      description: "List of all PRDs across all statuses",
      mimeType: "application/json",
    },
    {
      uri: "prds://status/draft",
      name: "Draft PRDs",
      description: "PRDs in draft status",
      mimeType: "application/json",
    },
    {
      uri: "prds://status/review",
      name: "Review PRDs",
      description: "PRDs under review",
      mimeType: "application/json",
    },
    {
      uri: "prds://status/ready",
      name: "Ready PRDs",
      description: "PRDs ready for development",
      mimeType: "application/json",
    },
    {
      uri: "prds://status/in-progress",
      name: "In-Progress PRDs",
      description: "PRDs currently being developed",
      mimeType: "application/json",
    },
    {
      uri: "prds://status/complete",
      name: "Complete PRDs",
      description: "Completed PRDs",
      mimeType: "application/json",
    }
  );

  return resources;
}

export async function readPRDResource(uri: string) {
  // Handle individual PRD resources (prd://PRD-003)
  if (uri.startsWith("prd://")) {
    const prdId = uri.replace("prd://", "");

    const statusDirs = [
      "product/prds/01-draft",
      "product/prds/02-review",
      "product/prds/03-ready",
      "product/prds/04-in-progress",
      "product/prds/05-complete",
    ];

    for (const dir of statusDirs) {
      const files = await fs.readdir(dir).catch(() => []);

      for (const file of files) {
        if (file.endsWith(".md")) {
          const content = await fs.readFile(path.join(dir, file), "utf-8");

          if (content.includes(`**PRD ID**: ${prdId}`) || content.includes(`# ${prdId}:`)) {
            return {
              contents: [
                {
                  uri,
                  mimeType: "text/markdown",
                  text: content,
                },
              ],
            };
          }
        }
      }
    }

    throw new Error(`PRD ${prdId} not found`);
  }

  // Handle aggregate resources (prds://all, prds://status/*)
  if (uri === "prds://all") {
    return await listAllPRDs();
  }

  if (uri.startsWith("prds://status/")) {
    const status = uri.replace("prds://status/", "");
    return await listPRDsByStatus(status);
  }

  throw new Error(`Unknown resource URI: ${uri}`);
}

async function listAllPRDs() {
  const prds: any[] = [];

  const statusDirs = {
    draft: "product/prds/01-draft",
    review: "product/prds/02-review",
    ready: "product/prds/03-ready",
    "in-progress": "product/prds/04-in-progress",
    complete: "product/prds/05-complete",
  };

  for (const [statusName, dir] of Object.entries(statusDirs)) {
    const files = await fs.readdir(dir).catch(() => []);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");

        const idMatch = content.match(/\*\*PRD ID\*\*: (PRD-\d+)/) || content.match(/# (PRD-\d+):/);
        const nameMatch = content.match(/# (PRD-\d+): (.+)/);
        const priorityMatch = content.match(/\*\*Priority\*\*: (P\d)/);
        const gradeMatch = content.match(/\*\*Grade\*\*: ([A-F][+-]?)/);

        if (idMatch || nameMatch) {
          const prdId = idMatch?.[1] || nameMatch?.[1];
          const prdName = nameMatch?.[2] || "Unknown";
          const prdPriority = priorityMatch?.[1] || "P2";
          const prdGrade = gradeMatch?.[1] || null;

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
    contents: [
      {
        uri: "prds://all",
        mimeType: "application/json",
        text: JSON.stringify(prds, null, 2),
      },
    ],
  };
}

async function listPRDsByStatus(status: string) {
  const prds: any[] = [];

  const statusDirs: Record<string, string> = {
    draft: "product/prds/01-draft",
    review: "product/prds/02-review",
    ready: "product/prds/03-ready",
    "in-progress": "product/prds/04-in-progress",
    complete: "product/prds/05-complete",
  };

  const dir = statusDirs[status];

  if (!dir) {
    throw new Error(`Invalid status: ${status}`);
  }

  const files = await fs.readdir(dir).catch(() => []);

  for (const file of files) {
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(dir, file), "utf-8");

      const idMatch = content.match(/\*\*PRD ID\*\*: (PRD-\d+)/) || content.match(/# (PRD-\d+):/);
      const nameMatch = content.match(/# (PRD-\d+): (.+)/);
      const priorityMatch = content.match(/\*\*Priority\*\*: (P\d)/);
      const gradeMatch = content.match(/\*\*Grade\*\*: ([A-F][+-]?)/);

      if (idMatch || nameMatch) {
        const prdId = idMatch?.[1] || nameMatch?.[1];
        const prdName = nameMatch?.[2] || "Unknown";
        const prdPriority = priorityMatch?.[1] || "P2";
        const prdGrade = gradeMatch?.[1] || null;

        prds.push({
          id: prdId,
          name: prdName,
          status,
          priority: prdPriority,
          grade: prdGrade,
        });
      }
    }
  }

  return {
    contents: [
      {
        uri: `prds://status/${status}`,
        mimeType: "application/json",
        text: JSON.stringify(prds, null, 2),
      },
    ],
  };
}
