#!/usr/bin/env node

/**
 * Update version metadata in all plugin files
 * Run this automatically before publishing via prepublishOnly script
 */

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const VERSION = packageJson.version;

console.log(`\n🔄 Updating version metadata to ${VERSION}...\n`);

// Directories containing markdown files
const DIRS = [
  '.claude/commands',
  '.claude/agents',
  '.claude/skills'
];

/**
 * Update version in a single markdown file
 */
function updateVersionInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Pattern 1: "Version: X.X.X" (standalone line)
  const pattern1 = /^Version:\s+\d+\.\d+\.\d+(?:\s+.*)?$/gm;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, (match) => {
      // Preserve any text after the version (e.g., "Version: 2.6.0 (Unified Cursor + Claude Code)")
      const suffix = match.match(/\d+\.\d+\.\d+(.*)$/)?.[1] || '';
      return `Version: ${VERSION}${suffix}`;
    });
    updated = true;
  }

  // Pattern 2: "**Version**: X.X.X" (bold markdown)
  const pattern2 = /\*\*Version\*\*:\s+\d+\.\d+\.\d+/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, `**Version**: ${VERSION}`);
    updated = true;
  }

  // Pattern 3: "version: X.X.X" (lowercase)
  const pattern3 = /^version:\s+\d+\.\d+\.\d+/gm;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, `version: ${VERSION}`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Process all directories
let totalUpdated = 0;
let totalFiles = 0;

DIRS.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);

  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(dirPath, f));

  let dirUpdated = 0;

  files.forEach(file => {
    totalFiles++;
    if (updateVersionInFile(file)) {
      dirUpdated++;
      totalUpdated++;
    }
  });

  console.log(`✅ ${dir}: ${dirUpdated}/${files.length} files updated`);
});

console.log(`\n✨ Version update complete!`);
console.log(`   Total: ${totalUpdated}/${totalFiles} files updated to v${VERSION}\n`);

// Exit with error if no files were found
if (totalFiles === 0) {
  console.error('❌ No markdown files found! Check directory structure.\n');
  process.exit(1);
}
