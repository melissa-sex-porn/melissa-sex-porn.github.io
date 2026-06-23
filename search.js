const searchInput = document.getElementById('searchInput');
const videoCount = document.getElementById('videoCount');
const shortsCount = document.getElementById('shortsCount');
const searchMessage = document.getElementById('searchMessage');
const videoGrid = document.getElementById('searchVideoGrid');
const shortsGrid = document.getElementById('searchShortsGrid');

function normalize(text) {
  return String(text).toLowerCase();
}

function matchesQuery(video, query) {
  if (!query) return true;
  const normalized = normalize(query);
  return [video.title, video.creator, video.category, video.type, video.description]
    .some(field => normalize(field).includes(normalized));
}

function renderVideos(items) {
  videoGrid.innerHTML = items.map(video => `
    <a class="video-card-link" href="watch.html?id=${video.id}">
      <article class="video-card">
        <div class="video-thumb">
          ${video.src ? `<video class="video-thumb-preview" src="${video.src}" muted loop playsinline preload="metadata"></video>` : ''}
          <span class="video-duration" data-id="${video.id}">${video.duration || '--:--'}</span>
        </div>
        <div class="video-card-content">
          <h3 class="video-title">${video.title}</h3>
          <div class="video-meta">
            <span><i class="fas fa-user"></i> ${video.creator}</span>
          </div>
        </div>
      </article>
    </a>
  `).join('');
}

function renderShorts(items) {
  shortsGrid.innerHTML = items.map(video => `
    <a class="short-card" href="shorts.html?id=${video.id}">
      <div class="short-thumb">
        <video class="short-thumb-preview" src="${video.src}" muted loop playsinline preload="metadata"></video>
        <div class="short-thumb-label">
          <small>SHORT</small>
          <span class="video-duration" data-id="${video.id}">${video.duration || '--:--'}</span>
        </div>
      </div>
      <div class="short-copy">
        <h3>${video.title}</h3>
        <p>${video.creator}</p>
      </div>
    </a>
  `).join('');
}

const params = new URLSearchParams(window.location.search);
const query = params.get('search')?.trim() || '';
searchInput.value = query;

if (!query) {
  searchMessage.textContent = 'Search using the box above to find videos and reels.';
  videoCount.textContent = '0 results';
  shortsCount.textContent = '0 results';
  videoGrid.innerHTML = '<div class="shorts-empty"><h2>No search query entered.</h2><p>Type a keyword and press enter to search the library.</p></div>';
  shortsGrid.innerHTML = '<div class="shorts-empty"><p>Use the search box above to show matching shorts.</p></div>';
} else {
  const matches = videos.filter(video => matchesQuery(video, query));
  const videoResults = matches.filter(video => video.type === 'video');
  const shortResults = matches.filter(video => video.type === 'short');

  searchMessage.textContent = `Results for "${query}"`;
  videoCount.textContent = `${videoResults.length} result${videoResults.length === 1 ? '' : 's'}`;
  shortsCount.textContent = `${shortResults.length} result${shortResults.length === 1 ? '' : 's'}`;

  if (videoResults.length) {
    renderVideos(videoResults);
  } else {
    videoGrid.innerHTML = '<div class="shorts-empty"><h2>No videos found.</h2><p>Try a different keyword.</p></div>';
  }

  if (shortResults.length) {
    renderShorts(shortResults);
  } else {
    shortsGrid.innerHTML = '<div class="shorts-empty"><h2>No shorts found.</h2><p>Try a different keyword.</p></div>';
  }
}
