(function(){
  function formatDuration(seconds) {
    if (!isFinite(seconds) || seconds <= 0) return '--:--';
    const s = Math.round(seconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    return `${mins}:${String(secs).padStart(2,'0')}`;
  }

  function updateDomDurations(id, formatted) {
    document.querySelectorAll(`[data-video-id="${id}"]`).forEach(el => {
      el.textContent = formatted;
    });
    document.querySelectorAll(`.video-duration[data-id="${id}"]`).forEach(el => {
      el.textContent = formatted;
    });
  }

  function computeAllDurations() {
    if (!window.videos || !window.videos.length) return;

    window.videos.forEach(video => {
      if (video.duration) return;
      
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.muted = true;
      vid.playsInline = true;
      vid.crossOrigin = 'anonymous';
      
      // Append to body FIRST before setting src
      vid.style.position = 'absolute';
      vid.style.left = '-9999px';
      vid.style.width = '1px';
      vid.style.height = '1px';
      vid.style.visibility = 'hidden';
      document.body.appendChild(vid);

      let resolved = false;

      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          vid.src = '';
          vid.removeEventListener('loadedmetadata', onLoaded);
          vid.removeEventListener('error', onError);
          vid.removeEventListener('canplay', onCanPlay);
          setTimeout(() => vid.remove(), 100);
        }
      };

      const onLoaded = () => {
        if (resolved) return;
        resolved = true;
        const d = vid.duration;
        const formatted = formatDuration(d);
        video.duration = formatted;
        try { updateDomDurations(video.id, formatted); } catch(e){}
        cleanup();
      };

      const onCanPlay = () => {
        if (resolved) return;
        // Try to get duration on canplay as well
        const d = vid.duration;
        if (isFinite(d) && d > 0) {
          onLoaded();
        }
      };

      const onError = () => {
        if (resolved) return;
        resolved = true;
        const placeholder = '--:--';
        video.duration = placeholder;
        try { updateDomDurations(video.id, placeholder); } catch(e){}
        cleanup();
      };

      vid.addEventListener('loadedmetadata', onLoaded, {once:true});
      vid.addEventListener('canplay', onCanPlay, {once:true});
      vid.addEventListener('error', onError, {once:true});

      // Set src AFTER appending
      vid.src = video.src;

      // Timeout fallback
      setTimeout(() => {
        if (!resolved && isFinite(vid.duration) && vid.duration > 0) {
          onLoaded();
        } else {
          cleanup();
        }
      }, 3000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', computeAllDurations);
  } else {
    computeAllDurations();
  }
})();
