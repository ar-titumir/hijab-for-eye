// Tracks displayed dimensions without wrapping images or changing page layout.
globalThis.HFEImages = (() => {
  const entries = new Map(), revealed = new WeakMap();
  let settings, shadow, pending = false;
  const selector = 'img, input[type="image"], svg image';
  const source = el => el.currentSrc || el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('xlink:href') || '';
  const resize = new ResizeObserver(() => schedule());
  function schedule() {
    if (pending || !shadow) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }
  function makeButton(el) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Reveal image');
    button.title = 'Reveal image';
    button.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
    button.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation();
      revealed.set(el, source(el));
      el.removeAttribute('data-hfe-image-blurred');
      button.remove();
      entries.get(el).button = null;
    });
    shadow.append(button);
    return button;
  }
  function update() {
    for (const entry of entries.values()) if (entry.button) entry.button.style.pointerEvents = 'none';
    for (const [el, entry] of entries) if (!el.isConnected) {
      entry.button?.remove(); el.removeAttribute('data-hfe-image-blurred');
      resize.unobserve(el); entries.delete(el);
    }
    for (const el of document.querySelectorAll(selector)) if (!entries.has(el)) {
      entries.set(el, {button:null}); resize.observe(el);
    }
    for (const [el, entry] of entries) {
      const rect = el.getBoundingClientRect();
      const blur = settings.enabled && settings.images && settings.imageStrength > 0 && MediaBlur.qualifies(rect.width, rect.height, settings) && revealed.get(el) !== source(el);
      if (!blur) {
        el.removeAttribute('data-hfe-image-blurred'); entry.button?.remove(); entry.button = null; continue;
      }
      if (!el.hasAttribute('data-hfe-image-blurred')) el.setAttribute('data-hfe-image-blurred', '');
      const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
      // Temporarily disable our own buttons for hit-testing the underlying image.
      const visible = x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight && document.elementFromPoint(x, y) === el;
      if (!visible) { entry.button?.remove(); entry.button = null; continue; }
      if (!entry.button) entry.button = makeButton(el);
      entry.button.style.pointerEvents = 'none';
      entry.button.style.left = `${x}px`; entry.button.style.top = `${y}px`;
      entry.button.style.setProperty('--opacity', settings.eyeOpacity / 100);
    }
    for (const entry of entries.values()) if (entry.button) entry.button.style.pointerEvents = '';
  }
  function start() {
    if (shadow || !document.documentElement) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483647!important;';
    shadow = overlay.attachShadow({mode:'closed'});
    const style = document.createElement('style');
    style.textContent = 'button{all:initial;box-sizing:border-box;position:fixed;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:#141823;color:white;border:1px solid #aeb9ce;display:grid;place-items:center;cursor:pointer;pointer-events:auto;opacity:var(--opacity,.7);box-shadow:0 2px 12px #0008}button:hover,button:focus-visible{opacity:1;outline:2px solid #bac7ff;outline-offset:3px}svg{fill:none;stroke:currentColor;stroke-width:1.8;pointer-events:none}';
    shadow.append(style); document.documentElement.append(overlay);
    new MutationObserver(records => {
      if (records.some(record => record.target !== overlay)) schedule();
    }).observe(document.documentElement, {subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','sizes','href','xlink:href','style','class','width','height','hidden']});
    document.addEventListener('load', schedule, true);
    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
  }
  return { apply(next) { settings = next; start(); schedule(); } };
})();
