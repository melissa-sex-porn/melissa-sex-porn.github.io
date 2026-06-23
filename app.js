const videoGrid = document.getElementById('videoGrid');
const shortsGrid = document.getElementById('shortsGrid');
const resultCount = document.getElementById('resultCount');
const shortsSection = document.getElementById('shortsSection');

function renderVideos(items) {
  videoGrid.innerHTML = items.map(video => {
    return `
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
    `;
  }).join('');

  resultCount.textContent = `${items.length} videos`;
}

function renderShorts(items) {
  shortsGrid.innerHTML = items.map(video => {
    return `
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
    `;
  }).join('');
}

function updateView() {
  const visibleShorts = videos.filter(video => video.type === 'short');
  const visibleVideos = videos.filter(video => video.type === 'video');
  renderVideos(visibleVideos);
  renderShorts(visibleShorts.slice(0, 5));
  shortsSection.style.display = visibleShorts.length ? 'block' : 'none';
}

updateView();
