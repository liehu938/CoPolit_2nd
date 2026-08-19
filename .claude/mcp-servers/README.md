# MCP Servers Directory

This folder contains MCP (Model Context Protocol) servers that extend Claude's capabilities with external tools and data sources.

## Structure

```
mcp-servers/
├── weather-server/          # Example weather information MCP server
│   ├── package.json        # Node.js dependencies
│   ├── server.js           # MCP server implementation
│   ├── README.md           # Server documentation
│   └── EXAMPLE.md          # Usage examples
└── [future servers...]
```

## Weather Server Example

The `weather-server` demonstrates how to build an MCP server that:
- Fetches real data from public APIs (National Weather Service)
- Exposes tools that Claude can use automatically
- Handles user queries without requiring API keys
- Provides formatted, useful responses

### Quick Start

```bash
cd weather-server
npm install
```

Then use Claude with prompts like:
- "Brief me on New York weather today"
- "What's the forecast for Los Angeles, CA?"
- "Should I bring an umbrella to Chicago tomorrow?"

## Configuration

All MCP servers are configured in `../.claude/claude.json`:

```json
{
  "mcpServers": {
    "weather-server": {
      "command": "node",
      "args": [".claude/mcp-servers/weather-server/server.js"]
    }
  }
}
```

## Building Your Own MCP Server

Each MCP server should have:
- **package.json**: Dependencies (include `@modelcontextprotocol/sdk`)
- **server.js**: Main implementation with tool definitions
- **README.md**: Documentation for the server
- **EXAMPLE.md**: Usage examples (optional)

See the weather-server for a complete example!
