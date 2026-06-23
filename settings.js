// Simple settings helper: persists safeMode in localStorage and updates the toggle
(function(){
  const toggle = document.getElementById('safeModeToggle');
  if (!toggle) return;

  function readSafeMode() {
    return localStorage.getItem('safeMode') === 'true';
  }

  function writeSafeMode(value) {
    localStorage.setItem('safeMode', value ? 'true' : 'false');
    // Notify other windows/tabs
    try { window.dispatchEvent(new Event('storage')); } catch(e){}
  }

  // Initialize toggle state
  toggle.checked = readSafeMode();

  toggle.addEventListener('change', () => {
    writeSafeMode(toggle.checked);
  });

  // Keep UI in sync if storage changes elsewhere
  window.addEventListener('storage', (e) => {
    if (!e || e.key === 'safeMode' || e.key === null) {
      toggle.checked = readSafeMode();
    }
  });
})();

// Initialize small dropdown behavior for .menu-dropdown buttons
(function(){
  const dropdowns = Array.from(document.querySelectorAll('.menu-dropdown'));
  if (!dropdowns.length) return;

  dropdowns.forEach(dd => {
    const btn = dd.querySelector('.menu-btn');
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', e => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // toggle
      btn.setAttribute('aria-expanded', String(!expanded));
      e.stopPropagation();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    dropdowns.forEach(dd => {
      const btn = dd.querySelector('.menu-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
