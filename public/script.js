



const YOUTUBE_API_KEY = "AIzaSyDFLsIj-DrPyi9BVwrZy_zPeU3TyYcRAsA";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function playVideo(video) {
  const player = document.querySelector("#player");
  const videoPlayer = document.querySelector("#videoPlayer");
  const videoTitle = document.querySelector("#videoTitle");
  const videoDetails = document.querySelector("#videoDetails");
  const videoDescription = document.getElementById("videoDescription");

  player.src = `https://www.youtube.com/embed/${video.id}`;
  videoTitle.textContent = video.title;
  videoDetails.textContent = `${video.channelTitle} • ${formatDate(video.publishedAt)}`;
  videoDescription.textContent = video.description;

  videoPlayer.style.display = "block";
  videoPlayer.scrollIntoView({ behavior: "smooth" });
}

function displayVideos(videos) {
  const videosGrid = document.getElementById("videosGrid");
  videosGrid.innerHTML = "";

  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.className = "video-card";
    videoCard.onclick = () => playVideo(video);

    videoCard.innerHTML = `
      <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}">
      <div class="video-info">
        <div class="video-card-title">${video.title}</div>
        <div class="channel-name">${video.channelTitle}</div>
      </div>
    `;
    videosGrid.appendChild(videoCard);
  });
}

async function searchVideos() {
  const searchInput = document.querySelector("#searchInput");
  const videosGrid = document.querySelector("#videosGrid");
  const loading = document.querySelector("#loading");
  const videoPlayer = document.querySelector("#videoPlayer");

  if (!searchInput.value.trim()) return;

  videoPlayer.style.display = "none";
  loading.style.display = "block";
  videosGrid.innerHTML = "";

  try {
    // First API call to search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchInput.value + ' -shorts')}&type=video&maxResults=36&videoDuration=medium&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items) {
      throw new Error("No results found");
    }

    // Get video IDs for detailed information
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Second API call to get video details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    // Combine the data
    const videos = searchData.items.map((item, index) => {
      const details = detailsData.items[index];
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

    displayVideos(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    videosGrid.innerHTML = "<p style='color: white;'>Error fetching videos. Please try again.</p>";
  } finally {
    loading.style.display = "none";
  }
}

// Event Listeners
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (document.querySelector(".alert-user")) {
      document.querySelector(".alert-user").remove();
    }
    searchVideos();
  }
});

document.querySelector("button").addEventListener("click", function () {
  if (document.querySelector(".alert-user")) {
    document.querySelector(".alert-user").remove();
  }
  searchVideos();
});