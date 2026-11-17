// Overrides stay in this page's memory and never enter extension storage.
globalThis.HFEVideos = (() => {
  const entries = new Map();
  let settings, host, shadow, pending = false;
  let pointer = null;
  let keyboardMode = false;
  function closePanel(entry) {
    clearTimeout(entry.hideTimer); entry.hideTimer = null;
    if(entry.panel) { entry.panel.hidden = true; entry.eye.setAttribute('aria-expanded','false'); }
  }
  function scheduleHide(video,entry) {
    clearTimeout(entry.hideTimer); entry.hideTimer=null;
    if(!entry.panel || entry.panel.hidden)return;
    const rect=video.getBoundingClientRect();
    const inside=pointer && pointer.x>=rect.left && pointer.x<=rect.right && pointer.y>=rect.top && pointer.y<=rect.top+rect.height;
    const focused=keyboardMode && shadow.activeElement && entry.wrapper.contains(shadow.activeElement);
    if(inside||entry.hovered||focused)return;
    entry.hideTimer=setTimeout(()=>closePanel(entry),settings.videoHideDelay);
  }
  const source = video => `${video.currentSrc || ''}|${video.getAttribute('src') || ''}`;
  const resize = new ResizeObserver(schedule);
  function schedule() {
    if (pending || !shadow) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }
  function clearOverride(video, entry) {
    entry.value = null;
    video.removeAttribute('data-hfe-video-override');
    video.style.removeProperty('--hfe-video-local-radius');
    if (entry.range) syncPanel(entry);
  }
  function syncPanel(entry) {
    const value = entry.value ?? settings.videoStrength;
    entry.range.value = String(MediaBlur.toSlider(value,0,100));
    entry.range.setAttribute('aria-valuetext', `${value} percent blur for this video`);
    entry.output.textContent = `${value}%`;
    entry.reset.disabled = entry.value === null;
  }
  function createControl(video, entry) {
    const wrapper = document.createElement('div'); wrapper.className = 'control';
    const eye = document.createElement('button'); eye.className = 'eye'; eye.type = 'button';
    eye.setAttribute('aria-label', 'Adjust blur for this video'); eye.setAttribute('aria-expanded', 'false');
    eye.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
    const panel = document.createElement('div'); panel.className = 'panel'; panel.hidden = true;
    const label = document.createElement('label'); label.textContent = 'This video only';
    const range = document.createElement('input'); range.type = 'range'; range.min = '0'; range.max = '1000'; range.step = '1';
    range.setAttribute('aria-label', 'Blur strength for this video');
    const output = document.createElement('output');
    const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'reset'; reset.textContent = 'Use global setting';
    label.append(range); panel.append(label, output, reset); wrapper.append(eye, panel); shadow.append(wrapper);
    Object.assign(entry, {wrapper, eye, panel, range, output, reset});
    eye.addEventListener('click', event => {
      for(const other of entries.values())if(other!==entry)closePanel(other);
      event.preventDefault(); event.stopPropagation(); panel.hidden = !panel.hidden;
      eye.setAttribute('aria-expanded', String(!panel.hidden));
      scheduleHide(video,entry);
    });
    wrapper.addEventListener('pointerenter',()=>{entry.hovered=true;scheduleHide(video,entry);});
    wrapper.addEventListener('pointerleave',()=>{entry.hovered=false;scheduleHide(video,entry);});
    wrapper.addEventListener('focusin',()=>scheduleHide(video,entry));
    wrapper.addEventListener('focusout',()=>setTimeout(()=>scheduleHide(video,entry),0));
    wrapper.addEventListener('keydown', event => {
      keyboardMode = true;
      scheduleHide(video,entry);
      event.stopPropagation();
      if (event.key === 'Escape') { closePanel(entry); eye.focus(); }
    });
    for (const type of ['click', 'pointerdown', 'pointerup', 'keyup']) wrapper.addEventListener(type, event => event.stopPropagation());
    range.addEventListener('input', event => {
      event.stopPropagation();
      entry.value = MediaBlur.fromSlider(Number(range.value),0,100);
      video.style.setProperty('--hfe-video-local-radius', `${entry.value * .4}px`);
      video.setAttribute('data-hfe-video-override', ''); syncPanel(entry);
    });
    reset.addEventListener('click', () => clearOverride(video, entry));
    syncPanel(entry);
  }
  function update() {
    for (const [video, entry] of entries) if (!video.isConnected) {
      closePanel(entry);
      clearOverride(video,entry); entry.wrapper?.remove(); resize.unobserve(video);
      video.removeEventListener('loadstart',entry.onLoad); video.removeEventListener('emptied',entry.onLoad);
      entries.delete(video);
    }
    for (const video of document.querySelectorAll('video')) if (!entries.has(video)) {
      const entry = {value:null, source:source(video)};
      entry.onLoad = () => { closePanel(entry); clearOverride(video,entry); entry.source = source(video); schedule(); };
      entries.set(video,entry); resize.observe(video);
      video.addEventListener('loadstart',entry.onLoad); video.addEventListener('emptied',entry.onLoad);
    }
    for (const [video, entry] of entries) {
      const current = source(video);
      if (current !== entry.source) { closePanel(entry); clearOverride(video,entry); entry.source = current; }
      const rect = video.getBoundingClientRect();
      const size = settings.videoEyeSize;
      const visible = settings.enabled && settings.videos && rect.width >= size + 16 && rect.height >= size + 16 && rect.top + size + 8 > 0 && rect.top + 8 < innerHeight && rect.right > 0 && rect.left < innerWidth;
      if (!visible) { closePanel(entry); if (entry.wrapper) entry.wrapper.hidden = true; continue; }
      if (!entry.wrapper) createControl(video, entry);
      entry.wrapper.hidden = false;
      entry.wrapper.style.left = `${rect.left + rect.width / 2}px`;
      entry.wrapper.style.top = `${rect.top + 8}px`;
      entry.wrapper.style.setProperty('--eye-size', `${size}px`);
      entry.wrapper.style.setProperty('--eye-opacity', settings.videoEyeOpacity / 100);
      entry.wrapper.style.setProperty('--panel-opacity', settings.videoPanelOpacity / 100);
      entry.wrapper.style.setProperty('--panel-active-opacity', settings.videoPanelOpacity === 0 ? 1 : settings.videoPanelOpacity / 100);
      entry.wrapper.style.setProperty('--panel-width', `${Math.max(100,Math.min(220,rect.width - 16))}px`);
      syncPanel(entry);
    }
  }
  function start() {
    if (shadow || !document.documentElement) return;
    host = document.createElement('div');
    host.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483646!important;';
    shadow = host.attachShadow({mode:'closed'});
    const style = document.createElement('style');
    style.textContent = ':host{color-scheme:dark}.control{position:fixed;transform:translateX(-50%);display:flex;align-items:center;flex-direction:column;gap:6px;pointer-events:none;font:12px system-ui;color:white}.control[hidden],[hidden]{display:none!important}button{font:inherit;color:inherit;cursor:pointer}.eye{display:grid;place-items:center;width:var(--eye-size);height:var(--eye-size);padding:4px;border-radius:50%;border:1px solid #b9c6ed;background:#141823;opacity:var(--eye-opacity);pointer-events:auto}.eye:hover,.eye:focus-visible{opacity:1}svg{width:80%;height:80%;fill:none;stroke:currentColor;stroke-width:1.8}.panel{box-sizing:border-box;width:var(--panel-width);padding:12px;background:#141823;border:1px solid #8091c4;border-radius:10px;opacity:var(--panel-opacity);pointer-events:auto;box-shadow:0 4px 16px #0006}.panel:hover,.panel:focus-within{opacity:var(--panel-active-opacity)}label{display:block}input{display:block;width:100%;margin:12px 0;accent-color:#8ca0ff}output{display:inline-block;min-width:40px}.reset{background:transparent;border:0;text-decoration:underline;padding:4px;font-size:11px}.reset:disabled{opacity:.5;cursor:default}:focus-visible{outline:2px solid #bac7ff;outline-offset:2px}';
    shadow.append(style); document.documentElement.append(host);
    new MutationObserver(records => {
      if (records.some(record => record.target !== host)) schedule();
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','style','class','width','height','hidden']});
    document.addEventListener('scroll',schedule,true); window.addEventListener('resize',schedule);
    document.addEventListener('pointermove',event=>{
      keyboardMode = false;
      pointer={x:event.clientX,y:event.clientY};
      for(const [video,entry]of entries) {
        const rect=video.getBoundingClientRect();
        const inside=pointer.x>=rect.left&&pointer.x<=rect.right&&pointer.y>=rect.top&&pointer.y<=rect.top+rect.height;
        if(inside||entry.lastInside!==inside){entry.lastInside=inside;scheduleHide(video,entry);}
      }
    },true);
    document.addEventListener('pointerdown',event=>{
      keyboardMode = false;
      if(!event.composedPath().includes(host))for(const entry of entries.values())closePanel(entry);
    },true);
    document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboardMode=true;},true);
    document.addEventListener('pointerout',event=>{
      if(!event.relatedTarget){pointer=null;for(const [video,entry]of entries){entry.hovered=false;scheduleHide(video,entry);}}
    });
    document.addEventListener('fullscreenchange', () => {
      const fullscreen = document.fullscreenElement;
      (fullscreen && fullscreen.tagName !== 'VIDEO' ? fullscreen : document.documentElement).append(host);
      schedule();
    });
  }
  return {apply(next) {settings = next; start(); schedule();for(const [video,entry]of entries)scheduleHide(video,entry);}};
})();
