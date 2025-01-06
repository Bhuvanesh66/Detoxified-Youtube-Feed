async function searchVideos() {
  const searchInput = document.querySelector("#searchInput");
  const videosGrid = document.querySelector("#videosGrid");
  const loading = document.querySelector("#loading");
  const videoPlayer = document.querySelector("#videoPlayer");

  if (!searchInput.value.trim()) 
    return;



  // Hide video player when starting new search
  videoPlayer.style.display = "none";

  loading.style.display = "block";

  videosGrid.innerHTML = "";


  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchInput.value }),
    });

    const data = await response.json();

    if (data.videos) {

      displayVideos(data.videos);
    }
  } 
  catch (error) {
    console.error("Error fetching videos:", error);
    videosGrid.innerHTML = "<p>Error fetching videos. Please try again.</p>";
  } 
  finally {
    loading.style.display = "none";
  }
}

function playVideo(video) {
  const player = document.querySelector("#player");

  const videoPlayer = document.querySelector("#videoPlayer");
  const videoTitle = document.querySelector("#videoTitle");
  const videoDetails = document.querySelector("#videoDetails");
  const videoDescription = document.getElementById("videoDescription");



  // Set video details
  player.src = `https://www.youtube.com/embed/${video.id}`;

  videoTitle.textContent = video.title;

  videoDetails.textContent = `${video.channelTitle} • ${formatDate(
    video.publishedAt
  )}`;
  videoDescription.textContent = video.description;


  // Show video player

  videoPlayer.style.display = 'block';
  // Scroll to video player
  videoPlayer.scrollIntoView({ behavior: 'smooth' });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: 'numeric',
  });
}

function displayVideos(videos) {
  const videosGrid = document.getElementById("videosGrid");
  videosGrid.innerHTML = '';

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

// Add event listener for Enter key 
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.querySelector(".alert-user").remove();
      searchVideos();
    }
  });

// Add event listener click for the search 
document.querySelector('button').addEventListener('click' , function(){
  document.querySelector(".alert-user").remove();
  searchVideos();
})