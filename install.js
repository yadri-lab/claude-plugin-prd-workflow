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

// Get Claude Code base directory
function getClaudeBaseDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.claude-code');
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
      'bin',
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

    // Create .plugin-info.json with version metadata
    const packageJsonPath = path.join(sourceDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const pluginInfo = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        installedAt: new Date().toISOString(),
        repository: packageJson.repository?.url || 'https://github.com/Yassinello/claude-prd-workflow',
        homepage: packageJson.homepage || 'https://github.com/Yassinello/claude-prd-workflow#readme'
      };

      const pluginInfoPath = path.join(targetDir, '.plugin-info.json');
      fs.writeFileSync(pluginInfoPath, JSON.stringify(pluginInfo, null, 2));
      console.log(`   ✅ Created .plugin-info.json (v${packageJson.version})`);
    }

    // Install commands, agents, and skills to global Claude Code directories
    console.log('\n📋 Installing to Claude Code global directories...\n');

    const claudeBaseDir = getClaudeBaseDir();

    // Copy commands to ~/.claude-code/commands/
    const commandsSrc = path.join(sourceDir, 'commands');
    const commandsDest = path.join(claudeBaseDir, 'commands');
    if (fs.existsSync(commandsSrc)) {
      if (!fs.existsSync(commandsDest)) {
        fs.mkdirSync(commandsDest, { recursive: true });
      }
      const commandFiles = fs.readdirSync(commandsSrc).filter(f => f.endsWith('.md'));
      for (const file of commandFiles) {
        fs.copyFileSync(
          path.join(commandsSrc, file),
          path.join(commandsDest, file)
        );
      }
      console.log(`   ✅ Installed ${commandFiles.length} slash commands to ${commandsDest}`);
    }

    // Copy agents to ~/.claude-code/agents/
    const agentsSrc = path.join(sourceDir, 'agents');
    const agentsDest = path.join(claudeBaseDir, 'agents');
    if (fs.existsSync(agentsSrc)) {
      if (!fs.existsSync(agentsDest)) {
        fs.mkdirSync(agentsDest, { recursive: true });
      }
      const agentFiles = fs.readdirSync(agentsSrc).filter(f => f.endsWith('.md'));
      for (const file of agentFiles) {
        fs.copyFileSync(
          path.join(agentsSrc, file),
          path.join(agentsDest, file)
        );
      }
      console.log(`   ✅ Installed ${agentFiles.length} AI agents to ${agentsDest}`);
    }

    // Copy skills to ~/.claude-code/skills/
    const skillsSrc = path.join(sourceDir, 'skills');
    const skillsDest = path.join(claudeBaseDir, 'skills');
    if (fs.existsSync(skillsSrc)) {
      if (!fs.existsSync(skillsDest)) {
        fs.mkdirSync(skillsDest, { recursive: true });
      }
      const skillFiles = fs.readdirSync(skillsSrc).filter(f => f.endsWith('.md'));
      for (const file of skillFiles) {
        fs.copyFileSync(
          path.join(skillsSrc, file),
          path.join(skillsDest, file)
        );
      }
      console.log(`   ✅ Installed ${skillFiles.length} skills to ${skillsDest}`);
    }

    console.log('\n✨ Installation complete!\n');

    // Run automatic health check
    console.log('🏥 Running automatic health check...\n');
    try {
      const healthCheckPath = path.join(targetDir, 'bin', 'check-health.js');
      if (fs.existsSync(healthCheckPath)) {
        const { runHealthCheck } = require(healthCheckPath);
        const healthResults = runHealthCheck();

        const hasErrors = Object.values(healthResults).some(r => r.status === 'error');
        if (hasErrors) {
          console.log('\n⚠️  Health check detected issues. Run: node bin/repair.js\n');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not run health check:', error.message);
    }

    console.log('\n📖 Next steps:\n');
    console.log('   1. Restart Claude Code');
    console.log('   2. Run /plugin-health to verify installation');
    console.log('   3. Run /list-prds to check available commands');
    console.log('   4. Check the documentation: https://github.com/Yassinello/claude-prd-workflow\n');
    console.log('🎯 Quick start:\n');
    console.log('   /create-prd      - Create your first PRD');
    console.log('   /review-prd      - Review a draft PRD');
    console.log('   /code-prd        - Start development');
    console.log('   /plugin-health   - Run health check\n');

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
