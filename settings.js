const HFE_DEFAULTS = Object.freeze({ enabled:true, videos:true, images:false, videoStrength:50, imageStrength:50, filterBy:'width', imageThreshold:200, eyeSize:44, eyeOpacity:70, reblurEnabled:false, reblurSize:36, reblurOpacity:70, reblurDuration:2000, videoEyeSize:36, videoEyeOpacity:70, videoPanelOpacity:90, videoHideDelay:1500, siteAll:true, siteOnly:false, siteExclude:false, includedSites:'', excludedSites:'' });
globalThis.MediaBlur = Object.freeze({
  defaults:HFE_DEFAULTS,
  curve(position) { return Math.expm1(4 * Math.max(0,Math.min(1,position))) / Math.expm1(4); },
  uncurve(value) { return Math.log1p(Math.max(0,Math.min(1,value)) * Math.expm1(4)) / 4; },
  fromSlider(position,min,max,reverse=false) {
    const p = Number(position)/1000;
    return Math.round(min+(max-min)*(reverse ? 1-this.curve(1-p) : this.curve(p)));
  },
  toSlider(value,min,max,reverse=false) {
    const p = Math.max(0,Math.min(1,(value-min)/(max-min)));
    return Math.round(1000*(reverse ? 1-this.uncurve(1-p) : this.uncurve(p)));
  },
  thresholdMax(mode,display=globalThis.screen) {
    const width = display?.width || 1920, height = display?.height || 1080;
    return Math.round(1.25*(mode==='area' ? width*height : mode==='height' ? height : width));
  },
  qualifies(width,height,settings) {
    return width>0 && height>0 && (settings.filterBy==='area' ? width*height : settings.filterBy==='height' ? height : width)>settings.imageThreshold;
  },
  parseSites(text) {
    const sites=[], invalid=[];
    for(const part of String(text||'').split(/[\s,;]+/).filter(Boolean)) {
      try {
        const url = new URL(part.includes('://') ? part : `https://${part.replace(/^\*\./,'')}`);
        if(!['http:','https:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw Error();
        const host=url.hostname.toLowerCase().replace(/\.$/,'');
        if(!sites.includes(host)) sites.push(host);
      } catch { invalid.push(part); }
    }
    return {sites,invalid};
  },
  matches(host,domain) { return host===domain || host.endsWith(`.${domain}`); },
  disjoint(included,excluded,prefer='included') {
    const a=this.parseSites(included).sites, b=this.parseSites(excluded).sites;
    const overlap=(x,y)=>this.matches(x,y)||this.matches(y,x);
    return prefer==='excluded' ? {includedSites:a.filter(x=>!b.some(y=>overlap(x,y))).join(', '),excludedSites:b.join(', ')} : {includedSites:a.join(', '),excludedSites:b.filter(y=>!a.some(x=>overlap(x,y))).join(', ')};
  },
  siteAllowed(host,settings) {
    host=host.toLowerCase().replace(/\.$/,'');
    if(settings.siteOnly) return this.parseSites(settings.includedSites).sites.some(site=>this.matches(host,site));
    if(!settings.siteAll && !settings.siteExclude) return false;
    return !settings.siteExclude || !this.parseSites(settings.excludedSites).sites.some(site=>this.matches(host,site));
  },
  pageHost() {
    // Chromium exposes the top-level origin to child frames without reading page content.
    const origins=globalThis.location?.ancestorOrigins;
    try { return new URL(origins?.length ? origins[origins.length-1] : globalThis.location.href).hostname; }
    catch { return globalThis.location?.hostname || ''; }
  },
  normalize(raw={}) {
    const result={...this.defaults};
    for(const key of Object.keys(result)) if(typeof result[key]==='boolean' && typeof raw[key]==='boolean') result[key]=raw[key];
    const limits={videoStrength:[0,100],imageStrength:[0,100],eyeSize:[12,100],eyeOpacity:[0,100],reblurSize:[12,100],reblurOpacity:[0,100],reblurDuration:[0,4000],videoEyeSize:[12,100],videoEyeOpacity:[0,100],videoPanelOpacity:[0,100],videoHideDelay:[0,4000],imageThreshold:[0,1000000000]};
    for(const [key,[min,max]] of Object.entries(limits)) if(typeof raw[key]==='number' && Number.isFinite(raw[key])) result[key]=Math.round(Math.max(min,Math.min(max,raw[key])));
    if(['width','height','area'].includes(raw.filterBy)) result.filterBy=raw.filterBy;
    Object.assign(result,this.disjoint(raw.includedSites,raw.excludedSites));
    if(result.siteOnly) {result.siteAll=false;result.siteExclude=false;}
    return result;
  }
});
