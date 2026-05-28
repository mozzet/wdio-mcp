#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse arguments
const argsInput = process.argv.slice(2);
let customCommand = null;
let customArgs = null;

for (let i = 0; i < argsInput.length; i++) {
  if (argsInput[i] === '--command' && argsInput[i + 1]) {
    customCommand = argsInput[i + 1];
    i++;
  } else if (argsInput[i] === '--args' && argsInput[i + 1]) {
    customArgs = argsInput[i + 1].split(',');
    i++;
  }
}

// Define targets
const homeDir = os.homedir();
const configPaths = [
  path.join(homeDir, '.gemini', 'config', 'mcp_config.json'),
  path.join(homeDir, '.gemini', 'mcp_config.json')
];

const currentDir = process.cwd();

let mcpConfigPath = configPaths[0];
let existingConfigPath = configPaths.find(p => fs.existsSync(p));
if (existingConfigPath) {
  mcpConfigPath = existingConfigPath;
}

console.log(`Target config path: ${mcpConfigPath}`);
console.log(`Current directory: ${currentDir}`);

let config = { mcpServers: {} };

if (fs.existsSync(mcpConfigPath)) {
  try {
    const rawContent = fs.readFileSync(mcpConfigPath, 'utf8');
    if (rawContent.trim()) {
      config = JSON.parse(rawContent);
    }
  } catch (err) {
    console.error(`Warning: Failed to parse existing config file: ${err.message}`);
    console.error('Will initialize a new configuration structure.');
  }
}

if (!config.mcpServers) {
  config.mcpServers = {};
}

const existingWdio = config.mcpServers['wdio-mcp'] || {};
const command = customCommand || existingWdio.command || 'npm';
const args = customArgs || existingWdio.args || ['run', '--silent', 'start'];

config.mcpServers['wdio-mcp'] = {
  command: command,
  args: args,
  cwd: currentDir
};

try {
  const dir = path.dirname(mcpConfigPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2), 'utf8');
  console.log('Successfully updated wdio-mcp configuration!');
  console.log(JSON.stringify(config.mcpServers['wdio-mcp'], null, 2));
} catch (err) {
  console.error(`Error: Failed to write to config file: ${err.message}`);
  process.exit(1);
}
