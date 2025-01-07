// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

// Warning handlers
process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    return;
  }
  console.warn(warning.name, warning.message);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate YouTube API key
if (!process.env.YOUTUBE_API_KEY) {
  console.error("ERROR: YouTube API key is not set in .env file");
  process.exit(1);
}

// Initialize YouTube API
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// Search endpoint
app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Invalid input",
        message: "Search query is required and must be a string",
      });
    }

    const sanitizedQuery = query.trim();

    if (sanitizedQuery.length === 0) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Search query cannot be empty",
      });
    }

    // Search for videos with enhanced details
    const searchResponse = await youtube.search.list({
      part: "snippet",
      q: `${sanitizedQuery} -shorts`,
      type: "video",
      maxResults: 36,
      videoDuration: "medium",
      safeSearch: "moderate",
    });

    if (!searchResponse.data || !searchResponse.data.items) {
      throw new Error("Invalid response from YouTube API");
    }

    // Get video IDs for additional details
    const videoIds = searchResponse.data.items.map((item) => item.id.videoId);

    // Get additional video details
    const videoDetailsResponse = await youtube.videos.list({
      part: "statistics,contentDetails",
      id: videoIds.join(","),
    });

    // Combine search results with additional details
    const videos = searchResponse.data.items.map((item, index) => {
      const details = videoDetailsResponse.data.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        statistics: details ? details.statistics : null,
        duration: details ? details.contentDetails.duration : null,
      };
    });

    res.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while processing your request",
    });
  }
});

// Function to try different ports
const startServer = (initialPort) => {
  const server = app
    .listen(initialPort)
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(
          `Port ${initialPort} is busy, trying ${initialPort + 1}...`
        );
        startServer(initialPort + 1);
      } else {
        console.error("Server error:", err);
      }
    })
    .on("listening", () => {
      const addr = server.address();
      console.log(`Server running on port ${addr.port}`);
    });
};

// Start server with initial port
const PORT = process.env.PORT || 3000;
startServer(PORT);
