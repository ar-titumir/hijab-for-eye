// Filter eligible images, including dynamically inserted images in open shadow roots.
globalThis.HFEImages = (() => {
  const entries=new Map(), revealed=new WeakMap(), observers=new Map();
  let settings, shadow, overlay, pending=false, dirty=true;
  const selector='img, input[type="image"], svg image';
  const source=el=>[el.currentSrc||'',el.getAttribute('src')||'',el.getAttribute('srcset')||'',el.getAttribute('href')||el.getAttribute('xlink:href')||''].join('|');
  const resize=new ResizeObserver(()=>schedule());
  function schedule(rescan=false){dirty=dirty||rescan;if(pending||!shadow)return;pending=true;requestAnimationFrame(()=>{pending=false;update();});}
  function observe(root){
    if(observers.has(root))return;
    const observer=new MutationObserver(records=>{if(records.some(r=>r.target!==overlay))schedule(records.some(r=>r.type==='childList'));});
    observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','sizes','href','xlink:href','style','class','width','height','hidden']});observers.set(root,observer);
  }
  function scan(root=document){
    observe(root===document?document.documentElement:root);
    for(const el of root.querySelectorAll(selector))if(!entries.has(el)){entries.set(el,{button:null,timer:null,applied:null});resize.observe(el);}
    for(const el of root.querySelectorAll('*'))if(el.shadowRoot)scan(el.shadowRoot);
  }
  function restore(el,entry){
    if(entry.applied!==null){
      if(el.style.getPropertyValue('filter')===entry.applied){
        if(entry.previous)el.style.setProperty('filter',entry.previous,entry.priority);else el.style.removeProperty('filter');
      }
      entry.applied=null;
    }
    el.removeAttribute('data-hfe-image-blurred');
  }
  function blurImage(el,entry){
    const filter=`blur(${settings.imageStrength*.4}px)`;
    const current=el.style.getPropertyValue('filter');
    if(entry.applied===null||current!==entry.applied){entry.previous=current;entry.priority=el.style.getPropertyPriority('filter');}
    if(current!==filter||el.style.getPropertyPriority('filter')!=='important')el.style.setProperty('filter',filter,'important');
    entry.applied=filter;
    if(!el.hasAttribute('data-hfe-image-blurred'))el.setAttribute('data-hfe-image-blurred','');
  }
  function clearButton(entry){entry.button?.remove();entry.button=null;}
  function makeButton(el,entry){
    const button=document.createElement('button');button.type='button';
    button.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();clearTimeout(entry.timer);
      const record=revealed.get(el), isRevealed=record?.signature===source(el);
      if(isRevealed)revealed.delete(el);
      else {revealed.set(el,{signature:source(el),at:Date.now()});restore(el,entry);}
      clearButton(entry);schedule();
    });shadow.append(button);return button;
  }
  function update(){
    for(const entry of entries.values())if(entry.button)entry.button.style.pointerEvents='none';
    for(const [el,entry]of entries)if(!el.isConnected){clearTimeout(entry.timer);clearButton(entry);restore(el,entry);resize.unobserve(el);entries.delete(el);}
    for(const [root,observer]of observers)if(root.host&&!root.host.isConnected){observer.disconnect();observers.delete(root);}
    if(dirty){dirty=false;scan();}
    for(const [el,entry]of entries){
      const rect=el.getBoundingClientRect(), record=revealed.get(el);
      const isRevealed=record?.signature===source(el);
      const eligible=settings.enabled&&settings.images&&settings.imageStrength>0&&MediaBlur.qualifies(rect.width,rect.height,settings);
      if(eligible&&!isRevealed)blurImage(el,entry);else restore(el,entry);
      const remaining=isRevealed?settings.reblurDuration-(Date.now()-record.at):0;
      const reblur=eligible&&isRevealed&&settings.reblurEnabled&&remaining>0;
      clearTimeout(entry.timer);entry.timer=null;
      if(reblur)entry.timer=setTimeout(()=>schedule(),remaining+1);
      if(!eligible||(isRevealed&&!reblur)){clearButton(entry);continue;}
      const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
      const hit=document.elementFromPoint(x,y),root=el.getRootNode();
      const visible=x>=0&&y>=0&&x<=innerWidth&&y<=innerHeight&&(hit===el||hit===root.host);
      if(!visible){clearButton(entry);continue;}
      if(!entry.button)entry.button=makeButton(el,entry);
      const button=entry.button;
      const mode=reblur?'Blur image again':'Reveal image';
      if(button.title!==mode){
        button.title=mode;button.setAttribute('aria-label',mode);
        button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'+(reblur?'<path d="m3 3 18 18"/>':'')+'</svg>';
      }
      button.style.pointerEvents='none';button.style.left=`${x}px`;button.style.top=`${y}px`;
      button.style.setProperty('--opacity',(reblur?settings.reblurOpacity:settings.eyeOpacity)/100);
      button.style.setProperty('--size',`${reblur?settings.reblurSize:settings.eyeSize}px`);
    }
    for(const entry of entries.values())if(entry.button)entry.button.style.pointerEvents='';
  }
  function start(){
    if(shadow||!document.documentElement)return;
    overlay=document.createElement('div');overlay.style.cssText='all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483647!important;';
    shadow=overlay.attachShadow({mode:'closed'});
    const style=document.createElement('style');
    style.textContent='button{all:initial;box-sizing:border-box;position:fixed;transform:translate(-50%,-50%);width:var(--size,44px);height:var(--size,44px);border-radius:50%;background:#141823;color:white;border:1px solid #aeb9ce;display:grid;place-items:center;cursor:pointer;pointer-events:auto;opacity:var(--opacity,.7);box-shadow:0 2px 12px #0008}button:hover,button:focus-visible{opacity:1;outline:2px solid #bac7ff;outline-offset:3px}svg{width:70%;height:70%;fill:none;stroke:currentColor;stroke-width:1.8;pointer-events:none}';
    shadow.append(style);document.documentElement.append(overlay);
    document.addEventListener('load',()=>schedule(true),true);document.addEventListener('scroll',()=>schedule(),true);
    document.addEventListener('yt-navigate-finish',()=>schedule(true));document.addEventListener('yt-page-data-updated',()=>schedule(true));
    window.addEventListener('resize',()=>schedule(true));
  }
  return {apply(next){settings=next;start();schedule(true);}};
})();
