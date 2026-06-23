const shortsContainer = document.getElementById('shortsContainer');
const shortsHint = document.getElementById('shortsHint');
let shorts = window.videos.filter(video => video.type === 'short');
const applySafeFilterToShorts = () => {
  const safeMode = localStorage.getItem('safeMode') === 'true';
  return shorts.filter(v => (safeMode ? v.safe === true : v.safe !== true));
};
let filteredShorts = applySafeFilterToShorts();
let currentIndex = 0;
let touchStartY = 0;

function findIndexById(id) {
  return filteredShorts.findIndex(v => v.id === id);
}

function getShort(index) {
  return filteredShorts[(index + filteredShorts.length) % filteredShorts.length];
}

function updateShortUrl(video) {
  const url = new URL(window.location.href);
  url.searchParams.set('id', video.id);
  url.hash = '';
  window.history.replaceState(null, '', url);
}

function renderShort(index) {
  const video = getShort(index);
  if (!video) {
    shortsContainer.innerHTML = '<div class="shorts-empty"><h2>No reels found.</h2><p>Update your search or add more shorts.</p></div>';
    shortsHint.textContent = '';
    return;
  }

  shortsContainer.innerHTML = `
    <div class="shorts-item">
      <video id="activeShortVideo" class="shorts-video" src="${video.src}" playsinline preload="metadata" controls></video>
      <a class="shorts-close" href="index.html" aria-label="Back to home"><i class="fas fa-arrow-left"></i></a>
      <div class="shorts-overlay">
        <div class="shorts-label">SHORT</div>
        <h2>${video.title}</h2>
        <p>${video.description}</p>
        <div class="shorts-meta">
          <span><i class="fas fa-user"></i> ${video.creator}</span>
          <span class="video-duration" data-id="${video.id}">${video.duration || '--:--'}</span>
        </div>
      </div>
    </div>
  `;

  const videoEl = document.getElementById('activeShortVideo');
  if (videoEl) {
    videoEl.muted = false;
    videoEl.play().catch(() => {});
    videoEl.addEventListener('ended', () => showNext());
  }
}

function showShort(index) {
  currentIndex = (index + filteredShorts.length) % filteredShorts.length;
  const video = getShort(currentIndex);
  updateShortUrl(video);
  renderShort(currentIndex);
}

function showNext() {
  showShort(currentIndex + 1);
}

function showPrevious() {
  showShort(currentIndex - 1);
}

function handleKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    showNext();
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    showPrevious();
  }
}

function handleTouchStart(event) {
  touchStartY = event.changedTouches[0].clientY;
}

function handleTouchEnd(event) {
  const touchEndY = event.changedTouches[0].clientY;
  const distance = touchStartY - touchEndY;
  if (distance > 60) {
    showNext();
  } else if (distance < -60) {
    showPrevious();
  }
}

  if (shorts.length === 0) {
  shortsContainer.innerHTML = '<div class="shorts-empty"><h2>No shorts available yet.</h2><p>Add short videos to start the reel experience.</p></div>';
  shortsHint.textContent = '';
} else {
  // Prefer ?id= links, fall back to legacy hash links
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get('id');
  const hashId = location.hash ? location.hash.slice(1) : null;
  const targetId = queryId || hashId;
  const startIndex = targetId ? findIndexById(targetId) : -1;
  showShort(startIndex >= 0 ? startIndex : 0);

  window.addEventListener('storage', () => {
    filteredShorts = applySafeFilterToShorts();
    if (filteredShorts.length === 0) {
      shortsContainer.innerHTML = '<div class="shorts-empty"><h2>No reels found.</h2><p>Adjust your Safe Mode or add more shorts.</p></div>';
      shortsHint.textContent = '';
      return;
    }
    currentIndex = 0;
    showShort(currentIndex);
  });

  window.addEventListener('hashchange', () => {
    const id = location.hash ? location.hash.slice(1) : null;
    if (id) {
      const idx = findIndexById(id);
      if (idx >= 0) showShort(idx);
    }
  });

  document.body.addEventListener('keydown', handleKeydown);
  shortsContainer.addEventListener('touchstart', handleTouchStart);
  shortsContainer.addEventListener('touchend', handleTouchEnd);
}
