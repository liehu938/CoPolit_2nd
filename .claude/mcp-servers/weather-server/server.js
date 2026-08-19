import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
  name: "weather-server",
  version: "1.0.0",
});

// Define the tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_coordinates",
      description:
        "Convert a US city and state to latitude and longitude coordinates using geocoding",
      inputSchema: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name (e.g., 'New York', 'Los Angeles')",
          },
          state: {
            type: "string",
            description: "State abbreviation (e.g., 'NY', 'CA')",
          },
        },
        required: ["city", "state"],
      },
    },
    {
      name: "get_us_weather",
      description:
        "Get current weather forecast for given latitude and longitude using the National Weather Service API",
      inputSchema: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            description: "Latitude coordinate (e.g., 40.7128 for New York)",
          },
          longitude: {
            type: "number",
            description: "Longitude coordinate (e.g., -74.0060 for New York)",
          },
          city: {
            type: "string",
            description: "City name for display purposes",
          },
          state: {
            type: "string",
            description: "State abbreviation for display purposes",
          },
        },
        required: ["latitude", "longitude", "city", "state"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_coordinates") {
    return handleGetCoordinates(request.params.arguments);
  } else if (request.params.name === "get_us_weather") {
    return handleGetWeather(request.params.arguments);
  } else {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

// Tool 1: Convert city/state to coordinates
async function handleGetCoordinates(args) {
  const { city, state } = args;

  try {
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const query = `${city}, ${state}, USA`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "weather-mcp-server/1.0",
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Could not find coordinates for ${city}, ${state}. Please verify the city name and state abbreviation.`,
          },
        ],
      };
    }

    const result = data[0];
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    return {
      content: [
        {
          type: "text",
          text: `Coordinates for ${city}, ${state}: Latitude ${latitude}, Longitude ${longitude}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error finding coordinates: ${error.message}`,
        },
      ],
    };
  }
}

// Tool 2: Get weather using coordinates
async function handleGetWeather(args) {
  const { latitude, longitude, city, state } = args;

  try {
    // Step 1: Get points from NWS using coordinates
    const pointsResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );

    if (!pointsResponse.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Could not find weather data for coordinates ${latitude}, ${longitude}. This location might not be in the US.`,
          },
        ],
      };
    }

    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties.forecast;

    // Step 2: Get the forecast
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Step 3: Format the weather data
    const periods = forecastData.properties.periods.slice(0, 4); // Get next 4 periods
    let weatherText = `Weather for ${city}, ${state} (${latitude}, ${longitude}):\n\n`;

    periods.forEach((period) => {
      weatherText += `${period.name}: ${period.temperature}°${period.temperatureUnit}, ${period.shortForecast}, Wind: ${period.windSpeed} ${period.windDirection}\n`;
    });

    return {
      content: [
        {
          type: "text",
          text: weatherText,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching weather: ${error.message}`,
        },
      ],
    };
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
