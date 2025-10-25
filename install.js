#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Installation script for claude-prd-workflow plugin
 * Copies plugin files to Claude Code plugins directory
 */

const PLUGIN_NAME = 'claude-prd-workflow';

// Determine Claude Code plugins directory based on OS
function getClaudePluginsDir() {
  const homeDir = os.homedir();

  if (process.platform === 'win32') {
    // Windows: C:\Users\username\.claude-code\plugins
    return path.join(homeDir, '.claude-code', 'plugins');
  } else if (process.platform === 'darwin') {
    // macOS: /Users/username/.claude-code/plugins
    return path.join(homeDir, '.claude-code', 'plugins');
  } else {
    // Linux: /home/username/.claude-code/plugins
    return path.join(homeDir, '.claude-code', 'plugins');
  }
}

// Recursively copy directory
function copyDir(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and other unwanted directories
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main installation function
function install() {
  console.log('\n🚀 Installing Claude PRD Workflow Manager...\n');

  try {
    const pluginsDir = getClaudePluginsDir();
    const targetDir = path.join(pluginsDir, PLUGIN_NAME);
    const sourceDir = __dirname;

    // Check if plugins directory exists
    if (!fs.existsSync(pluginsDir)) {
      console.log(`📁 Creating plugins directory: ${pluginsDir}`);
      fs.mkdirSync(pluginsDir, { recursive: true });
    }

    // Check if plugin already exists
    if (fs.existsSync(targetDir)) {
      console.log(`⚠️  Plugin already exists at: ${targetDir}`);
      console.log('   Updating...\n');

      // Backup existing config if it exists
      const configPath = path.join(targetDir, '.claude', 'config.json');
      const backupPath = path.join(targetDir, '.claude', 'config.backup.json');
      if (fs.existsSync(configPath)) {
        fs.copyFileSync(configPath, backupPath);
        console.log('   ✅ Backed up existing config to config.backup.json');
      }
    }

    // Copy plugin files
    console.log(`📦 Copying plugin files to: ${targetDir}\n`);

    const dirsTooCopy = [
      'commands',
      'agents',
      'skills',
      'templates',
      'config',
      'docs',
      '.claude-plugin'
    ];

    for (const dir of dirsTooCopy) {
      const src = path.join(sourceDir, dir);
      const dest = path.join(targetDir, dir);

      if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`   ✅ Copied ${dir}/`);
      }
    }

    // Copy root files
    const filesToCopy = ['README.md', 'LICENSE', 'CHANGELOG.md'];
    for (const file of filesToCopy) {
      const src = path.join(sourceDir, file);
      const dest = path.join(targetDir, file);

      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`   ✅ Copied ${file}`);
      }
    }

    console.log('\n✨ Installation complete!\n');
    console.log('📖 Next steps:\n');
    console.log('   1. Restart Claude Code');
    console.log('   2. Run /list-prds to verify installation');
    console.log('   3. Check the documentation: https://github.com/Yassinello/claude-prd-workflow\n');
    console.log('🎯 Quick start:\n');
    console.log('   /create-prd  - Create your first PRD');
    console.log('   /review-prd  - Review a draft PRD');
    console.log('   /code-prd    - Start development\n');

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.error('\n💡 Manual installation:');
    console.error(`   git clone https://github.com/Yassinello/claude-prd-workflow.git`);
    console.error(`   cp -r claude-prd-workflow ${getClaudePluginsDir()}/\n`);
    process.exit(1);
  }
}

// Run installation if called directly
if (require.main === module) {
  install();
}

module.exports = install;
