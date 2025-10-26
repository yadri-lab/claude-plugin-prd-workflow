#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

/**
 * Update script for claude-prd-workflow plugin
 * Safely updates plugin to latest version from GitHub
 */

const PLUGIN_NAME = 'claude-prd-workflow';
const REPO_URL = 'https://github.com/Yassinello/claude-prd-workflow';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getPluginDir() {
  return path.join(os.homedir(), '.claude-code', 'plugins', PLUGIN_NAME);
}

function getPluginInfo() {
  const pluginInfoPath = path.join(getPluginDir(), '.plugin-info.json');
  if (fs.existsSync(pluginInfoPath)) {
    return JSON.parse(fs.readFileSync(pluginInfoPath, 'utf8'));
  }
  return null;
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, '.git'));
}

async function updateViaGit(pluginDir) {
  try {
    log('   Checking git status...', 'cyan');

    // Check if there are uncommitted changes
    const status = execSync('git status --porcelain', { cwd: pluginDir, encoding: 'utf8' });
    if (status.trim()) {
      log('   ⚠️  Warning: You have uncommitted changes', 'yellow');
      log('   Stashing changes...', 'cyan');
      execSync('git stash', { cwd: pluginDir });
    }

    log('   Fetching latest version from GitHub...', 'cyan');
    execSync('git fetch origin', { cwd: pluginDir, stdio: 'inherit' });

    log('   Pulling latest changes...', 'cyan');
    execSync('git pull origin main', { cwd: pluginDir, stdio: 'inherit' });

    // Restore stashed changes if any
    if (status.trim()) {
      log('   Restoring stashed changes...', 'cyan');
      try {
        execSync('git stash pop', { cwd: pluginDir });
      } catch (error) {
        log('   ⚠️  Could not restore stashed changes automatically', 'yellow');
        log('   Run: git stash pop', 'yellow');
      }
    }

    return true;
  } catch (error) {
    log(`   ❌ Git update failed: ${error.message}`, 'red');
    return false;
  }
}

async function updateViaDownload(pluginDir) {
  log('   ⚠️  Plugin is not a git repository', 'yellow');
  log('   Manual update required:', 'yellow');
  log('   1. Backup your config: cp -r .claude ~/.claude-backup', 'reset');
  log(`   2. Remove plugin: rm -rf ${pluginDir}`, 'reset');
  log('   3. Clone latest: git clone https://github.com/Yassinello/claude-prd-workflow', 'reset');
  log('   4. Run: node install.js', 'reset');
  log('   5. Restore config if needed', 'reset');
  return false;
}

async function runUpdate() {
  console.log('\n🔄 Updating claude-prd-workflow plugin...\n');

  const pluginDir = getPluginDir();

  // Check if plugin is installed
  if (!fs.existsSync(pluginDir)) {
    log('❌ Plugin not found. Install it first:', 'red');
    log('   git clone https://github.com/Yassinello/claude-prd-workflow', 'reset');
    log('   cd claude-prd-workflow', 'reset');
    log('   node install.js', 'reset');
    process.exit(1);
  }

  // Get current version
  const currentInfo = getPluginInfo();
  if (currentInfo) {
    log(`📦 Current version: ${currentInfo.version}`, 'blue');
  } else {
    log('⚠️  Could not determine current version', 'yellow');
  }

  console.log('\n' + '='.repeat(60));
  log('\n🔍 Checking for updates...\n', 'blue');

  // Update based on installation method
  let updateSuccess = false;
  if (isGitRepo(pluginDir)) {
    updateSuccess = await updateViaGit(pluginDir);
  } else {
    updateSuccess = await updateViaDownload(pluginDir);
  }

  if (!updateSuccess) {
    process.exit(1);
  }

  // Reinstall to update global commands/agents/skills
  console.log('\n' + '='.repeat(60));
  log('\n🔨 Reinstalling to update global files...\n', 'blue');

  try {
    const installScript = path.join(pluginDir, 'install.js');
    if (fs.existsSync(installScript)) {
      log('   Running install.js...', 'cyan');

      // Change to plugin directory and run install
      const install = require(installScript);
      if (typeof install === 'function') {
        await install();
      } else {
        execSync('node install.js', { cwd: pluginDir, stdio: 'inherit' });
      }
    } else {
      log('   ❌ install.js not found', 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`   ❌ Reinstallation failed: ${error.message}`, 'red');
    process.exit(1);
  }

  // Get new version
  const newInfo = getPluginInfo();

  console.log('\n' + '='.repeat(60));
  log('\n✅ Update complete!\n', 'green');

  if (newInfo && currentInfo && newInfo.version !== currentInfo.version) {
    log(`📦 Updated: ${currentInfo.version} → ${newInfo.version}`, 'green');
  } else if (newInfo) {
    log(`📦 Version: ${newInfo.version}`, 'green');
  }

  log('\n💡 Important:', 'yellow');
  log('   1. Restart Claude Code to see the changes', 'reset');
  log('   2. Run /plugin-health to verify the update', 'reset');
  log('   3. Check CHANGELOG.md for what\'s new', 'reset');

  console.log('\n' + '='.repeat(60) + '\n');
}

// Run update if called directly
if (require.main === module) {
  runUpdate().catch(error => {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runUpdate };
