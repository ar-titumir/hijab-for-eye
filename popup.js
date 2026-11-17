const $ = id => document.getElementById(id);
const ranges = {
  videoStrength:[0,100,'%'],imageStrength:[0,100,'%'],eyeSize:[12,100,' px'],eyeOpacity:[0,100,'%',true],
  reblurSize:[12,100,' px'],reblurOpacity:[0,100,'%',true],reblurDuration:[0,4000,' ms'],
  videoEyeSize:[12,100,' px'],videoEyeOpacity:[0,100,'%',true],videoPanelOpacity:[0,100,'%',true],videoHideDelay:[0,4000,' ms'],imageThreshold:[0,1,' px']
};
const flags = Object.keys(MediaBlur.defaults).filter(key=>typeof MediaBlur.defaults[key]==='boolean');
const modes=[...document.querySelectorAll('[name="filterBy"]')];
let state={...MediaBlur.defaults}, ready=false, currentHost='', writes=Promise.resolve(), updateId=0;
function render() {
  ranges.imageThreshold=[0,MediaBlur.thresholdMax(state.filterBy),state.filterBy==='area'?' px²':' px'];
  for(const [key,[min,max,unit,reverse]] of Object.entries(ranges)) {
    $(key).value=MediaBlur.toSlider(state[key],min,max,reverse);
    $(key).disabled=!ready;
    const text=state[key].toLocaleString()+unit;
    $(key+'Value').textContent=text; $(key).setAttribute('aria-valuetext',text);
  }
  for(const key of flags) {$(key).checked=state[key];$(key).disabled=!ready;}
  $('siteOnly').disabled=!ready||state.siteAll;
  $('siteAll').disabled=!ready||state.siteOnly;
  $('siteExclude').disabled=!ready||state.siteOnly;
  for(const radio of modes) {radio.checked=radio.value===state.filterBy;radio.disabled=!ready;}
  for(const key of ['includedSites','excludedSites']) {
    if(document.activeElement!==$(key)) $(key).value=state[key];
    $(key).disabled=!ready||(key==='includedSites'?!state.siteOnly:!state.siteExclude);
  }
  const a=MediaBlur.parseSites(state.includedSites).sites,b=MediaBlur.parseSites(state.excludedSites).sites;
  const included=currentHost&&a.some(site=>MediaBlur.matches(currentHost,site)), excluded=currentHost&&b.some(site=>MediaBlur.matches(currentHost,site));
  $('includeCurrent').disabled=!ready||!currentHost||!state.siteOnly||!!included;
  $('removeIncluded').disabled=!ready||!included||!state.siteOnly;
  $('excludeCurrent').disabled=!ready||!currentHost||!state.siteExclude||!!excluded;
  $('removeExcluded').disabled=!ready||!excluded||!state.siteExclude;
  $('reblurOptions').hidden=!state.reblurEnabled;
  $('thresholdHint').textContent=`Displayed ${state.filterBy==='area'?'width × height':state.filterBy}. Maximum ${ranges.imageThreshold[1].toLocaleString()}${ranges.imageThreshold[2]} = display ${state.filterBy==='area'?'area':state.filterBy} × 1.25.`;
  $('currentSite').textContent=currentHost ? `This tab: ${currentHost} · ${MediaBlur.siteAllowed(currentHost,state)?'included':'not included'}` : 'Current tab is not an accessible website.';
}
function save() {
  render(); const id=++updateId, snapshot={...state}; $('status').textContent='Applying…';
  writes=writes.catch(()=>{}).then(()=>chrome.storage.local.set(snapshot));
  writes.then(()=>{if(id===updateId)$('status').textContent='Settings saved on this device';}).catch(()=>{if(id===updateId)$('status').textContent='Could not save. Adjust a setting to retry.';});
}
for(const [key,spec] of Object.entries(ranges)) $(key).addEventListener('input',()=>{
  const [min,max,,reverse]=ranges[key];state[key]=MediaBlur.fromSlider($(key).value,min,max,reverse);save();
});
for(const key of flags) $(key).addEventListener('change',()=>{state[key]=$(key).checked;if(key==='siteOnly'&&state.siteOnly){state.siteAll=false;state.siteExclude=false;}save();});
for(const radio of modes) radio.addEventListener('change',()=>{
  if(!radio.checked)return;const oldArea=state.filterBy==='area';state.filterBy=radio.value;
  if(oldArea!==(state.filterBy==='area'))state.imageThreshold=oldArea?Math.round(Math.sqrt(state.imageThreshold)):state.imageThreshold**2;
  state.imageThreshold=Math.min(MediaBlur.thresholdMax(state.filterBy),state.imageThreshold);save();
});
function updateList(key,text) {
  const parsed=MediaBlur.parseSites(text);
  if(parsed.invalid.length){$('siteMessage').textContent='Invalid site: '+parsed.invalid.join(', ');return false;}
  state[key]=parsed.sites.join(', ');
  const other=key==='includedSites'?'excludedSites':'includedSites', previous=state[other];
  Object.assign(state,MediaBlur.disjoint(state.includedSites,state.excludedSites,key==='includedSites'?'included':'excluded'));
  $('siteMessage').textContent=previous!==state[other]?'Overlapping sites were removed from the other list.':'';
  $(key).value=state[key];$(other).value=state[other];save();return true;
}
for(const key of ['includedSites','excludedSites'])$(key).addEventListener('change',()=>updateList(key,$(key).value));
for(const [button,key,remove] of [['includeCurrent','includedSites',false],['removeIncluded','includedSites',true],['excludeCurrent','excludedSites',false],['removeExcluded','excludedSites',true]])$(button).addEventListener('click',()=>{
  let sites=MediaBlur.parseSites(state[key]).sites;
  sites=remove?sites.filter(site=>!MediaBlur.matches(currentHost,site)):[...sites,currentHost];updateList(key,sites.join(', '));
});
chrome.storage.local.get(MediaBlur.defaults).then(saved=>{
  state=MediaBlur.normalize(saved);state.imageThreshold=Math.min(MediaBlur.thresholdMax(state.filterBy),state.imageThreshold);ready=true;render();$('status').textContent='Settings saved on this device';
  if(state.imageThreshold!==saved.imageThreshold)save();
}).catch(()=>{$('status').textContent='Could not load settings. Reopen this popup to retry.';});
chrome.tabs.query({active:true,currentWindow:true}).then(tabs=>{
  try{const url=new URL(tabs[0]?.url);if(['http:','https:'].includes(url.protocol))currentHost=url.hostname;}catch{}
  render();
}).catch(()=>render());
