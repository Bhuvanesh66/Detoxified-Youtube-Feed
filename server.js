require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

// Updated CORS configuration
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5501",
      "http://localhost:5501",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Enable pre-flight requests for all routes
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
      part: "statistics,contentDetails",
      id: videoIds.join(","),
    });

    const videos = searchResponse.data.items
      .map((item, index) => {
        const details = videoDetailsResponse.data.items[index];

        try {
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail:
              item.snippet.thumbnails.high?.url ||
              item.snippet.thumbnails.default?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            statistics: details ? details.statistics : null,
            duration: details ? details.contentDetails.duration : null,
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
      error: "Internal server error",
      message: "An error occurred while processing your request",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
