(() => {
  let settings = { ...MediaBlur.defaults };
  const changedDuringLoad = new Set();
  let loading = true;

  function apply() {
    const root = document.documentElement;
    if (!root) return;
    HFEImages.apply(settings);
    HFEVideos.apply(settings);
    if (settings.enabled && settings.videos) root.setAttribute('data-hfe-video-controls', 'on');
    else root.removeAttribute('data-hfe-video-controls');
    for (const [kind, strength] of [['videos', 'videoStrength'], ['images', 'imageStrength']]) {
      const singular = kind === 'videos' ? 'video' : 'image';
      root.style.setProperty(`--media-blur-${singular}-radius`, `${settings[strength] * 0.4}px`);
      if (settings.enabled && settings[kind] && settings[strength] > 0) {
        root.setAttribute(`data-media-blur-${kind}`, 'on');
      } else {
        root.removeAttribute(`data-media-blur-${kind}`);
      }
    }
  }

  if (!document.documentElement) {
    const observer = new MutationObserver(() => {
      if (document.documentElement) { observer.disconnect(); apply(); }
    });
    observer.observe(document, { childList: true });
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const key of Object.keys(MediaBlur.defaults)) {
      if (Object.hasOwn(changes, key)) {
        settings[key] = changes[key].newValue ?? MediaBlur.defaults[key];
        if (loading) changedDuringLoad.add(key);
      }
    }
    settings = MediaBlur.normalize(settings);
    apply();
  });
  chrome.storage.local.get(MediaBlur.defaults).then(saved => {
    const merged = MediaBlur.normalize(saved);
    for (const key of changedDuringLoad) merged[key] = settings[key];
    settings = merged;
    loading = false;
    apply();
  }).catch(() => { loading = false; apply(); });
})();
