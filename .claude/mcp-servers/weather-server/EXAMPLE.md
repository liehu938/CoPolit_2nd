# Example: Using the Weather MCP Server

This example shows how to use the weather MCP server to answer weather-related questions.

## Setup

1. Install dependencies:
```bash
cd .claude/mcp-servers/weather-server
npm install
```

2. Make sure `.claude/claude.json` is configured (it's already set up)

## Example Prompts

### Simple Weather Query
**User**: "Brief me on New York weather today"

**Claude's Process**:
1. Recognizes a weather query
2. Calls the `get_us_weather` tool with city="New York", state="NY"
3. Receives real forecast data from National Weather Service
4. Responds with: "Here's the weather forecast for New York, NY today..."

### Multiple Cities
**User**: "Compare the weather in Los Angeles, CA and Miami, FL"

**Claude's Process**:
1. Calls `get_us_weather` with city="Los Angeles", state="CA"
2. Calls `get_us_weather` with city="Miami", state="FL"
3. Compares and presents both forecasts

### Conditional Planning
**User**: "What should I wear when visiting Chicago tomorrow?"

**Claude's Process**:
1. Calls `get_us_weather` with city="Chicago", state="IL"
2. Sees the temperature and conditions
3. Makes a clothing recommendation based on actual weather data

## Key Advantages

✅ **Real Data**: Fetches actual weather from the National Weather Service
✅ **No API Key**: Uses a free public government API
✅ **Seamless**: Claude automatically knows when to use it
✅ **Accurate**: Uses the official US weather service
✅ **Extensible**: Easy to add more tools to the server

## How MCP Works Here

```
┌─────────────────────────────────────────────────┐
│  User: "Brief me on New York weather today"    │
└──────────────┬──────────────────────────────────┘
               │
               ▼
        ┌──────────────────┐
        │  Claude Agent    │
        │  (AI Model)      │
        └────────┬─────────┘
                 │
         ┌───────▼────────┐
         │  MCP Protocol  │
         │  (Communication)
         └────────┬───────┘
                  │
        ┌─────────▼────────────────┐
        │  Weather MCP Server      │
        │  (Your .claude/ folder)  │
        └────────┬────────────────┘
                 │
       ┌─────────▼──────────────┐
       │ National Weather       │
       │ Service API (Free)     │
       └────────┬──────────────┘
                │
       ┌────────▼─────────────────────┐
       │ Real Weather Data Returned   │
       │ (Temperature, Conditions)    │
       └─────────────────────────────┘
                 │
       ┌─────────▼──────────────────────────────┐
       │ Claude formats and presents            │
       │ answer to user                         │
       └────────────────────────────────────────┘
```

## Next Steps

1. **Try it out**: Run your Claude client with this config
2. **Extend it**: Add more weather tools or other services
3. **Learn**: Review `server.js` to understand MCP server structure
4. **Customize**: Modify the tools to fit your needs

## Common Use Cases

- Travel planning ("What's the weather in Denver next week?")
- Outfit suggestions ("What should I wear in Boston tomorrow?")
- Event planning ("Will it rain during the outdoor event in Seattle?")
- Activity recommendations ("Good day for hiking in the mountains?")
