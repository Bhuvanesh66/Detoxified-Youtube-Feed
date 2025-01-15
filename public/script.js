
const BACKEND_URL = "https://detoxified-youtube-feed-56np.onrender.com"; // Replacing backend url of my local host with your actual Render URL

async function searchVideos() {
  const searchInput = document.querySelector("#searchInput");
  const videosGrid = document.querySelector("#videosGrid");
  const loading = document.querySelector("#loading");
  const videoPlayer = document.querySelector("#videoPlayer");

  if (!searchInput.value.trim()) {
    videosGrid.innerHTML =
      "<p class='error-message'>Please enter a search term</p>";
    return;
  }

  videoPlayer.style.display = "none";
  loading.style.display = "block";
  videosGrid.innerHTML = "";

  try {
    const response = await fetch(`${BACKEND_URL}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ query: searchInput.value }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        //if the error data is not in JSON format
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.videos && Array.isArray(data.videos)) {
      if (data.videos.length === 0) {
        videosGrid.innerHTML = "<p class='error-message'>No videos found</p>";
      } else {
        displayVideos(data.videos);
      }
    } else {
      throw new Error(
        "Invalid response format: 'videos' property not found or not an array"
      );
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    videosGrid.innerHTML = `<p class='error-message'>Error fetching videos: ${
      error.message || "Please try again"
    }</p>`;
  } finally {
    loading.style.display = "none";
  }
}

function playVideo(video) {
  if (!video || !video.id) return;

  const player = document.querySelector("#player");
  const videoPlayer = document.querySelector("#videoPlayer");
  const videoTitle = document.querySelector("#videoTitle");
  const videoDetails = document.querySelector("#videoDetails");
  const videoDescription = document.getElementById("videoDescription");

  // Set video details
  player.src = `https://www.youtube.com/embed/${video.id}`;
  videoTitle.textContent = video.title || "Untitled";
  videoDetails.textContent = `${
    video.channelTitle || "Unknown Channel"
  } • ${formatDate(video.publishedAt)}`;
  videoDescription.textContent =
    video.description || "No description available";

  // Show video player
  videoPlayer.style.display = "block";
  // Scroll to video player
  videoPlayer.scrollIntoView({ behavior: "smooth" });
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
}

function displayVideos(videos) {
  const videosGrid = document.getElementById("videosGrid");
  videosGrid.innerHTML = "";

  videos.forEach((video) => {
    if (!video) return;

    const videoCard = document.createElement("div");
    videoCard.className = "video-card";
    videoCard.onclick = () => playVideo(video);

    const thumbnail = video.thumbnail || "placeholder-image.jpg";
    const title = video.title || "Untitled";
    const channelTitle = video.channelTitle || "Unknown Channel";

    videoCard.innerHTML = `
      <img 
        class="thumbnail" 
        src="${thumbnail}" 
        alt="${title}"
        onerror="this.src='placeholder-image.jpg'"
      >
      <div class="video-info">
        <div class="video-card-title">${title}</div>
        <div class="channel-name">${channelTitle}</div>
      </div>
    `;
    videosGrid.appendChild(videoCard);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector("button");

  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const alertUser = document.querySelector(".alert-user");
        if (alertUser) {
          alertUser.remove();
        }
        searchVideos();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      const alertUser = document.querySelector(".alert-user");
      if (alertUser) {
        alertUser.remove();
      }
      searchVideos();
    });
  }
});
