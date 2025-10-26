#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { runHealthCheck } = require('./check-health.js');

/**
 * Repair script for claude-prd-workflow plugin
 * Automatically fixes common installation issues
 */

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

async function runRepair() {
  console.log('\n🔧 Running repair tool for claude-prd-workflow...\n');

  // Step 1: Run health check
  log('📋 Step 1: Running diagnostic check...', 'blue');
  const results = runHealthCheck();

  const hasErrors = Object.values(results).some(r => r.status === 'error');
  const hasWarnings = Object.values(results).some(r => r.status === 'warning');

  if (!hasErrors && !hasWarnings) {
    log('\n✅ No issues found! Plugin is working correctly.', 'green');
    return;
  }

  // Step 2: Attempt repair
  console.log('\n' + '='.repeat(60));
  log('\n🔨 Step 2: Attempting automatic repair...\n', 'blue');

  // Reinstall the plugin
  log('🔄 Reinstalling plugin...', 'yellow');

  try {
    const installScript = path.join(__dirname, '..', 'install.js');
    const install = require(installScript);

    log('   Running install.js...', 'cyan');
    await install();

    log('\n✅ Reinstallation complete!', 'green');
  } catch (error) {
    log(`\n❌ Automatic repair failed: ${error.message}`, 'red');
    log('\n💡 Manual repair steps:', 'yellow');
    log('   1. cd to plugin directory', 'reset');
    log('   2. Run: node install.js', 'reset');
    log('   3. Restart Claude Code', 'reset');
    log('   4. Run: node bin/check-health.js', 'reset');
    process.exit(1);
  }

  // Step 3: Verify repair
  console.log('\n' + '='.repeat(60));
  log('\n🏥 Step 3: Verifying repair...\n', 'blue');

  const verifyResults = runHealthCheck();
  const stillHasErrors = Object.values(verifyResults).some(r => r.status === 'error');

  if (stillHasErrors) {
    log('\n⚠️  Some issues remain. Please try:', 'yellow');
    log('   1. Restart Claude Code', 'reset');
    log('   2. Run: node bin/check-health.js', 'reset');
    log('   3. If issues persist, please report at:', 'reset');
    log('      https://github.com/Yassinello/claude-prd-workflow/issues', 'cyan');
  } else {
    log('\n✅ Repair successful! All systems operational.', 'green');
    log('\n💡 Important: Restart Claude Code to see the changes.', 'yellow');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Run repair if called directly
if (require.main === module) {
  runRepair().catch(error => {
    console.error('❌ Repair tool failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runRepair };
