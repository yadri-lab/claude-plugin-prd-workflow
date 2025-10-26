#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Health check script for claude-prd-workflow plugin
 * Verifies installation and reports any issues
 */

const PLUGIN_NAME = 'claude-prd-workflow';

// Get Claude Code directories
function getClaudeBaseDir() {
  return path.join(os.homedir(), '.claude-code');
}

function getPluginDir() {
  return path.join(getClaudeBaseDir(), 'plugins', PLUGIN_NAME);
}

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

function checkDirectory(dirPath, name) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    if (files.length > 0) {
      log(`   ✅ ${name}: ${files.length} files found`, 'green');
      return { status: 'ok', count: files.length };
    } else {
      log(`   ⚠️  ${name}: Directory exists but empty`, 'yellow');
      return { status: 'warning', count: 0 };
    }
  } else {
    log(`   ❌ ${name}: Directory not found`, 'red');
    return { status: 'error', count: 0 };
  }
}

function checkPluginInfo() {
  const pluginInfoPath = path.join(getPluginDir(), '.plugin-info.json');
  if (fs.existsSync(pluginInfoPath)) {
    const info = JSON.parse(fs.readFileSync(pluginInfoPath, 'utf8'));
    log(`   ✅ Plugin version: ${info.version}`, 'green');
    log(`   📅 Installed: ${new Date(info.installedAt).toLocaleDateString()}`, 'cyan');
    return { status: 'ok', info };
  } else {
    log(`   ⚠️  Plugin info file not found`, 'yellow');
    return { status: 'warning', info: null };
  }
}

function runHealthCheck() {
  console.log('\n🏥 Running health check for claude-prd-workflow...\n');

  const results = {
    plugin: { status: 'unknown' },
    commands: { status: 'unknown', count: 0 },
    agents: { status: 'unknown', count: 0 },
    skills: { status: 'unknown', count: 0 },
    info: { status: 'unknown' }
  };

  // Check plugin directory
  log('📁 Checking plugin installation...', 'blue');
  const pluginDir = getPluginDir();
  if (fs.existsSync(pluginDir)) {
    log(`   ✅ Plugin directory found: ${pluginDir}`, 'green');
    results.plugin.status = 'ok';
  } else {
    log(`   ❌ Plugin directory not found: ${pluginDir}`, 'red');
    results.plugin.status = 'error';
    log('\n💡 Run: node install.js', 'yellow');
    return results;
  }

  // Check plugin info
  log('\n📋 Checking plugin metadata...', 'blue');
  results.info = checkPluginInfo();

  // Check commands
  log('\n📝 Checking slash commands...', 'blue');
  const commandsDir = path.join(getClaudeBaseDir(), 'commands');
  results.commands = checkDirectory(commandsDir, 'Global commands');

  // Check agents
  log('\n🤖 Checking AI agents...', 'blue');
  const agentsDir = path.join(getClaudeBaseDir(), 'agents');
  results.agents = checkDirectory(agentsDir, 'Global agents');

  // Check skills
  log('\n⚡ Checking skills...', 'blue');
  const skillsDir = path.join(getClaudeBaseDir(), 'skills');
  results.skills = checkDirectory(skillsDir, 'Global skills');

  // Summary
  console.log('\n' + '='.repeat(60));
  log('\n📊 HEALTH CHECK SUMMARY\n', 'cyan');

  const hasErrors = Object.values(results).some(r => r.status === 'error');
  const hasWarnings = Object.values(results).some(r => r.status === 'warning');

  if (!hasErrors && !hasWarnings) {
    log('✅ All systems operational!', 'green');
    log('\n🎯 You can now use the following commands:', 'cyan');
    log('   /create-prd  - Create a new PRD', 'reset');
    log('   /list-prds   - List all PRDs', 'reset');
    log('   /review-prd  - Review a PRD', 'reset');
    log('   /code-prd    - Start development', 'reset');
    log('\n💡 Tip: Restart Claude Code if commands are not visible', 'yellow');
  } else if (hasErrors) {
    log('❌ Installation has errors', 'red');
    log('\n🔧 To fix:', 'yellow');
    log('   1. Run: node install.js', 'reset');
    log('   2. Restart Claude Code', 'reset');
    log('   3. Run: node bin/check-health.js', 'reset');
  } else if (hasWarnings) {
    log('⚠️  Installation has warnings', 'yellow');
    log('\n💡 Plugin is installed but may not be fully functional', 'reset');
    log('   Run: node install.js to reinstall', 'reset');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  return results;
}

// Run health check if called directly
if (require.main === module) {
  const results = runHealthCheck();
  const hasErrors = Object.values(results).some(r => r.status === 'error');
  process.exit(hasErrors ? 1 : 0);
}

module.exports = { runHealthCheck };
