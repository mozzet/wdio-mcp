---
name: set-up-mcp
description: Configures the wdio-mcp server in ~/.gemini/config/mcp_config.json with the current repository's working directory.
---
# Set Up MCP Skill

This skill provides instructions and automated tooling to register or update the `wdio-mcp` Model Context Protocol (MCP) server in your global Gemini configuration file (`~/.gemini/config/mcp_config.json`).

By registering this server, Gemini agents can access and control browser and mobile automations directly using WebdriverIO and Appium.

## Automated Configuration

The skill includes an automated utility script to update or insert the `wdio-mcp` configuration in the correct JSON file.

### How to Run

To run the configuration script using the current working directory:

```bash
node .agents/skills/set-up-mcp/scripts/setup.cjs
```

### Customizing the Server Options

By default, the script preserves your existing `command` and `args` in the configuration file if `wdio-mcp` is already present. If it is not present, it defaults to:
- **Command:** `npm`
- **Args:** `["run", "--silent", "start"]`

You can override these values by passing options to the script:

- `--command`: Define a custom executor (e.g., `npm`, `node`, `pnpm`).
- `--args`: Pass a comma-separated list of arguments.

#### Examples

1. **Standard `npm run --silent start` configuration (Recommended):**
   ```bash
   node .agents/skills/set-up-mcp/scripts/setup.cjs
   ```

2. **Custom startup arguments (e.g., using `npm -y start` or direct node execution):**
   ```bash
   node .agents/skills/set-up-mcp/scripts/setup.cjs --command npm --args "-y,start"
   ```

3. **Direct execution of the built Javascript server:**
   ```bash
   node .agents/skills/set-up-mcp/scripts/setup.cjs --command node --args "lib/server.js"
   ```

## Manual Configuration

If you prefer to configure the server manually, follow these steps:

1. Locate your Gemini MCP configuration file. The standard paths on macOS are:
   - **Primary:** `~/.gemini/config/mcp_config.json`
   - **Alternative:** `~/.gemini/antigravity/mcp_config.json`

2. Open the file and find the `"mcpServers"` object.

3. Add or update the `"wdio-mcp"` block to point to the absolute path of this repository under `"cwd"`.

   ```json
   {
     "mcpServers": {
       "wdio-mcp": {
         "command": "npm",
         "args": [
           "run",
           "--silent",
           "start"
         ],
         "cwd": "/Users/mozzet/workspace/wdio-mcp"
       }
     }
   }
   ```

## Verification

To verify that the configuration was applied successfully:

1. Open your configuration file (`~/.gemini/config/mcp_config.json`).
2. Verify that the `cwd` field of the `wdio-mcp` server matches your repository directory (e.g., `/Users/mozzet/workspace/wdio-mcp`).
3. Verify the command and arguments are correct.
