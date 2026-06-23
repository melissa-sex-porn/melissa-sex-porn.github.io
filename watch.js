const params = new URLSearchParams(window.location.search);
const videoId = params.get('id');
const showShorts = params.get('shorts') === '1';

const watchTitle = document.getElementById('watchTitle');
const watchCategory = document.getElementById('watchCategory');
const watchStats = document.getElementById('watchStats');
const watchDescription = document.getElementById('watchDescription');
const videoDuration = document.getElementById('videoDuration');
const videoBadge = document.getElementById('videoBadge');
const relatedList = document.getElementById('relatedList');
const moreShorts = document.getElementById('moreShorts');

const watchVideo = document.getElementById('watchVideo');
const selectedVideo = videoId
  ? videos.find(video => video.id === videoId)
  : videos.find(video => showShorts ? video.type === 'short' : video.type === 'video');

if (!selectedVideo) {
  document.body.innerHTML = '<div class="error-screen"><h1>Video not found</h1><p>Return to the browse page to pick another video.</p><a class="btn primary" href="index.html">Back to browse</a></div>';
} else {
  // Redirect short types to the shorts feed (shorts should only be watched via the feed)
  if (selectedVideo.type === 'short') {
    window.location.href = `shorts.html#${selectedVideo.id}`;
  }
  watchTitle.textContent = selectedVideo.title;
  watchCategory.textContent = selectedVideo.type === 'short' ? 'Shorts' : selectedVideo.category;
  watchStats.textContent = `${selectedVideo.creator}`;
  watchDescription.textContent = selectedVideo.description;
  videoDuration.dataset.videoId = selectedVideo.id;
  videoDuration.textContent = selectedVideo.duration || '--:--';
  videoBadge.textContent = selectedVideo.type === 'short' ? 'Short' : selectedVideo.category;

  if (watchVideo && selectedVideo.src) {
    watchVideo.src = selectedVideo.src;
    watchVideo.setAttribute('poster', selectedVideo.poster || '');
    watchVideo.play().catch(() => {});
  }

  const relatedVideos = videos
    .filter(video => video.id !== selectedVideo.id)
    .filter(video => video.category === selectedVideo.category || video.type === selectedVideo.type)
    .slice(0, 4);

  relatedList.innerHTML = relatedVideos.map(video => `
    <a class="related-card" href="watch.html?id=${video.id}">
      <div>
        <strong>${video.title}</strong>
        <p>${video.creator}</p>
      </div>
      <span class="video-duration" data-id="${video.id}">${video.duration || '--:--'}</span>
    </a>
  `).join('');

  const extraShorts = videos
    .filter(video => video.type === 'short' && video.id !== selectedVideo.id)
    .slice(0, 3);

  moreShorts.innerHTML = extraShorts.map(video => `
    <a class="related-card" href="watch.html?id=${video.id}">
      <div>
        <strong>${video.title}</strong>
        <p>${video.creator}</p>
      </div>
      <span class="video-duration" data-id="${video.id}">${video.duration || '--:--'}</span>
    </a>
  `).join('');
}
