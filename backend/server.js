require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

// Updated CORS configuration
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], //changed port to 5500
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);

// Enable pre-flight requests
app.options("*", cors());

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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

    const videoIds = searchResponse.data.items
      .filter((item) => item && item.id && item.id.videoId)
      .map((item) => item.id.videoId);

    if (videoIds.length === 0) {
      return res.json({
        success: true,
        videos: [],
      });
    }

    const videoDetailsResponse = await youtube.videos.list({
      part: "statistics,contentDetails,snippet",
      id: videoIds.join(","),
    });

    const videos = videoDetailsResponse.data.items
      .map((details) => {
        const searchItem = searchResponse.data.items.find(
          (item) => item.id.videoId === details.id
        );

        if (!searchItem) {
          return null;
        }

        try {
          return {
            id: details.id,
            title: searchItem.snippet.title,
            description: searchItem.snippet.description,
            thumbnail:
              searchItem.snippet.thumbnails.high?.url ||
              searchItem.snippet.thumbnails.default?.url,
            channelTitle: searchItem.snippet.channelTitle,
            publishedAt: searchItem.snippet.publishedAt,
            statistics: details.statistics,
            duration: details.contentDetails.duration,
          };
        } catch (error) {
          console.error("Error processing video item:", error);
          return null;
        }
      })
      .filter((video) => video !== null);

    res.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Server error",
      message:
        error.message || "An error occurred while processing your request",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is accepting requests from: http://localhost:5500`);
});
