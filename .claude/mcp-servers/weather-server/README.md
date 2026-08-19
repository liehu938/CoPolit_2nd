# Weather MCP Server

This is an example MCP (Model Context Protocol) server that fetches real-time weather information for US cities.

## Overview

This server provides a tool called `get_us_weather` that queries the **National Weather Service (NWS) API**, a free public API maintained by the US government that requires no authentication.

## Features

- **Free & Public**: Uses the National Weather Service API (no API key needed)
- **Real Data**: Fetches actual current weather forecasts for US cities
- **Simple Integration**: One tool that takes city and state as input
- **MCP Compatible**: Works with Claude and other MCP-compatible clients

## Installation

```bash
cd .claude/mcp-servers/weather-server
npm install
```

## Usage with Claude

### Configuration

The MCP server is configured in `.claude/claude.json`:

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

### Example Prompts

Once configured, Claude will automatically have access to the weather tool. Try prompts like:

```
"Brief me on New York weather today"
"What's the weather forecast for Los Angeles, California?"
"Tell me the current conditions in Seattle, WA"
"Compare weather in Chicago, IL and Miami, FL"
```

### Tool Parameters

The `get_us_weather` tool accepts:

- **city** (required): City name (e.g., "New York", "Los Angeles")
- **state** (required): State abbreviation (e.g., "NY", "CA")

### Example Output

```
Weather for New York, NY:

Today: 72°F, Mostly sunny, Wind: 10 mph from the west
Tonight: 62°F, Clear skies, Wind: 5 mph from the northwest
Tomorrow: 75°F, Partly cloudy, Wind: 8 mph from the south
Tomorrow Night: 65°F, Mostly clear, Wind: 3 mph from the south
```

## How It Works

1. **User asks about weather** (e.g., "Brief me on New York weather today")
2. **Claude recognizes** the weather tool is needed
3. **Claude calls** `get_us_weather` with city="New York" and state="NY"
4. **Server queries** the National Weather Service API
5. **Server returns** formatted weather data
6. **Claude presents** the information to the user

## API Used

- **National Weather Service (weather.gov)**
  - Endpoint: `https://api.weather.gov/points/{city},{state}`
  - Free, public, no authentication required
  - Provides accurate US weather forecasts

## Troubleshooting

- **"Could not find coordinates"**: Verify the city name and state abbreviation
- **No data returned**: The city/state combination might not be recognized by NWS
- **Connection error**: Ensure internet connectivity to weather.gov

## Further Customization

You can extend this server to add:
- Multiple weather services (weather.com, openweathermap)
- Alerts and warnings
- Historical weather data
- Air quality information
- Severe weather tracking
