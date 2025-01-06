// process.removeAllListeners("warning");
// process.on("warning", (warning) => {

//   if (
//     warning.name === "DeprecationWarning" &&
//     warning.message.includes("punycode")
//   ) {
//     return;
//   }
//   console.warn(warning.name, warning.message);
// });

// const express = require("express");

// const cors = require("cors");

// const { google } = require("googleapis");

 


// const app = express();

// // Middleware

// app.use(cors());

// app.use(express.json());

// // YouTube API key (Set directly here)
// const YOUTUBE_API_KEY = "AIzaSyDFLsIj-DrPyi9BVwrZy_zPeU3TyYcRAsA";


// // Validate API key
// if (!YOUTUBE_API_KEY) {
//   console.error("ERROR: YouTube API key is not set.");

//   process.exit(1);
// }

// // Initialize YouTube API
// const youtube = google.youtube({
//   version: "v3",
//   auth: YOUTUBE_API_KEY,
// });

// // Search endpoint
// app.post("/api/search", async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query || typeof query !== "string") {

//       return res.status(400).json({
//         error: "Invalid input",
//         message: "Search query is required and must be a string",
//       });
//     }

//     const sanitizedQuery = query.trim();

//     if (sanitizedQuery.length === 0) {
//       return res.status(400).json({
//         error: "Invalid input",
//         message: "Search query cannot be empty",
//       });
//     }

//     // Search for videos with enhanced details
//     const searchResponse = await youtube.search.list({
//       part: "snippet",
//       q: `${sanitizedQuery} -shorts`,
//       type: "video",
//       maxResults: 36,
//       videoDuration: "medium",
//       safeSearch: "moderate",
//     });

//     if (!searchResponse.data || !searchResponse.data.items) {
      
//       throw new Error("Invalid response from YouTube API");
//     }



//     // Get video IDs for additional details
//     const videoIds = searchResponse.data.items.map((item) => item.id.videoId);

    

//     // Get additional video details
//     const videoDetailsResponse = await youtube.videos.list({
//       part: "statistics,contentDetails",
//       id: videoIds.join(","),
//     });

//     // Combine search results with additional details
//     const videos = searchResponse.data.items.map((item, index) => {
//       const details = videoDetailsResponse.data.items[index];
//       return {
//         id: item.id.videoId,
//         title: item.snippet.title,
//         description: item.snippet.description,
//         thumbnail: item.snippet.thumbnails.high.url,
//         channelTitle: item.snippet.channelTitle,
//         publishedAt: item.snippet.publishedAt,
//         statistics: details ? details.statistics : null,
//         duration: details ? details.contentDetails.duration : null,
//       };
//     });

//     res.json({
//       success: true,
//       videos,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message: "An error occurred while processing your request",
//     });
//   }
// });


// const PORT = process.env.PORT || 3000;



// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




//  from old script.js for reference

// async function searchVideos() {
//   const searchInput = document.querySelector("#searchInput");
//   const videosGrid = document.querySelector("#videosGrid");
//   const loading = document.querySelector("#loading");
//   const videoPlayer = document.querySelector("#videoPlayer");

//   if (!searchInput.value.trim()) return;


//   // Hide video player when starting new search
//   videoPlayer.style.display = "none";
//   loading.style.display = "block";
//   videosGrid.innerHTML = "";

//   try {
//     const response = await fetch("http://localhost:3000/api/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: searchInput.value }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     if (data.videos) {
//       displayVideos(data.videos);
//     }
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     videosGrid.innerHTML =
//       "<p style='color: white;'>Error fetching videos. Please try again.</p>";
//   } finally {
//     loading.style.display = "none";
//   }
// }
// function playVideo(video) {
//   const player = document.querySelector("#player");

//   const videoPlayer = document.querySelector("#videoPlayer");
//   const videoTitle = document.querySelector("#videoTitle");
//   const videoDetails = document.querySelector("#videoDetails");
//   const videoDescription = document.getElementById("videoDescription");

//   // Set video details
//   player.src = `https://www.youtube.com/embed/${video.id}`;

//   videoTitle.textContent = video.title;

//   videoDetails.textContent = `${video.channelTitle} • ${formatDate(
//     video.publishedAt
//   )}`;
//   videoDescription.textContent = video.description;

//   // Show video player


//   videoPlayer.style.display = "block";
//   // Scroll to video player
//   videoPlayer.scrollIntoView({ behavior: "smooth" });
// }

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }


// function displayVideos(videos) {
//   const videosGrid = document.getElementById("videosGrid");
//   videosGrid.innerHTML = "";

//   videos.forEach((video) => {
//     const videoCard = document.createElement("div");
//     videoCard.className = "video-card";
//     videoCard.onclick = () => playVideo(video);

//     videoCard.innerHTML = `
//                     <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}">
//                     <div class="video-info">
//                         <div class="video-card-title">${video.title}</div>
//                         <div class="channel-name">${video.channelTitle}</div>
//                     </div>
//                 `;
//     videosGrid.appendChild(videoCard);
//   });
// }


// // Add event listener for Enter key
// document
//   .getElementById("searchInput")
//   .addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//       document.querySelector(".alert-user").remove();
//       searchVideos();
//     }
//   });


// // Add event listener click for the search
// document.querySelector("button").addEventListener("click", function () {
//   document.querySelector(".alert-user").remove();
//   searchVideos();
// });



// YouTube API Configuration