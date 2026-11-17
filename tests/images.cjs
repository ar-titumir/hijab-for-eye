const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const base = path.resolve(__dirname, '..');
const callbacks = []; let now=0, timerId=0; const timers=new Map();
const setTimer=(fn,ms)=>{timers.set(++timerId,{fn,at:now+ms});return timerId;};
function advance(ms){now+=ms;for(const [id,t]of [...timers])if(t.at<=now){timers.delete(id);t.fn();}while(callbacks.length)callbacks.shift()();}
class Element {
  constructor() { this.attrs = {}; this.children = []; this.isConnected = true; this.style = { setProperty(k,v,p='') { this[k] = v; this[k+'Priority']=p; }, getPropertyValue(k){return this[k]||'';}, getPropertyPriority(k){return this[k+'Priority']||'';}, removeProperty(k){delete this[k];} }; this.listeners = {}; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k,v) { this.attrs[k] = v; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(k,fn) { this.listeners[k] = fn; }
  append(el) { this.children.push(el); el.parent = this; }
  attachShadow() { this.shadow = new Element(); return this.shadow; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(el => el !== this); }
  getRootNode(){return document;}
  getBoundingClientRect() { return {left:0,top:0,width:this.width,height:this.height}; }
}
const root = new Element(), photo = new Element();
photo.width = 300; photo.height = 100; photo.attrs.src = 'first.jpg';
const document = {documentElement:root, createElement:() => new Element(), querySelectorAll:() => photo.isConnected ? [photo] : [], elementFromPoint:() => photo, addEventListener() {}};
const context = vm.createContext({URL, document, Date:{now:()=>now},setTimeout:setTimer,clearTimeout:id=>timers.delete(id), window:{addEventListener(){}}, innerWidth:1000,innerHeight:1000, requestAnimationFrame:fn => callbacks.push(fn), ResizeObserver:class {observe(){} unobserve(){}}, MutationObserver:class {observe(){} disconnect(){}}});
for (const file of ['settings.js','images.js']) vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const api = context.MediaBlur, images = context.HFEImages;
assert.equal(api.qualifies(200,100,{filterBy:'width',imageThreshold:200}),false);
assert.equal(api.qualifies(201,100,{filterBy:'width',imageThreshold:200}),true);
assert.equal(api.qualifies(300,100,{filterBy:'height',imageThreshold:200}),false);
assert.equal(api.qualifies(300,100,{filterBy:'area',imageThreshold:29999}),true);
assert.equal(api.normalize({filterBy:'area',imageThreshold:1e8,eyeOpacity:-1}).imageThreshold,100000000);
let settings = {...api.defaults,images:true};
function apply() { images.apply(settings); while(callbacks.length) callbacks.shift()(); }
function buttons() { return root.children[0].shadow.children.filter(el => el.attrs['aria-label']); }
apply();
assert.equal(photo.hasAttribute('data-hfe-image-blurred'),true);
assert.equal(buttons().length,1);
assert.equal(buttons()[0].style['--opacity'],.7);
buttons()[0].listeners.click({preventDefault(){},stopPropagation(){}});
assert.equal(photo.hasAttribute('data-hfe-image-blurred'),false);
apply(); assert.equal(buttons().length,0);
photo.attrs.src = 'second.jpg'; apply();
assert.equal(buttons().length,1);
photo.width = 150; apply();
assert.equal(photo.hasAttribute('data-hfe-image-blurred'),false);
assert.equal(buttons().length,0);
settings.filterBy = 'area'; settings.imageThreshold = 10000; settings.eyeOpacity = 20; apply();
assert.equal(buttons()[0].style['--opacity'],.2);
settings.enabled = false; apply(); assert.equal(buttons().length,0);
settings.enabled = true; settings.reblurEnabled=true;settings.reblurDuration=2000;apply();
buttons()[0].listeners.click({preventDefault(){},stopPropagation(){}}); apply();
assert.equal(buttons()[0].attrs['aria-label'],'Blur image again');
assert.equal(photo.hasAttribute('data-hfe-image-blurred'),false);
advance(2001); assert.equal(buttons().length,0);assert.equal(photo.hasAttribute('data-hfe-image-blurred'),false);
photo.attrs.src='third.jpg';apply();buttons()[0].listeners.click({preventDefault(){},stopPropagation(){}});apply();
buttons()[0].listeners.click({preventDefault(){},stopPropagation(){}});apply();assert.equal(photo.hasAttribute('data-hfe-image-blurred'),true);
settings.enabled=false;apply();assert.equal(photo.style.getPropertyValue('filter'),'');
settings.enabled=true;apply();photo.isConnected = false; apply(); assert.equal(buttons().length,0);
const host=new Element(), nested=new Element();nested.width=500;nested.height=300;nested.attrs.src='sidebar.jpg';
const openRoot={host,querySelectorAll:selector=>selector==='*'?[nested]:[nested]};host.shadowRoot=openRoot;
nested.getRootNode=()=>openRoot;
document.querySelectorAll=selector=>selector==='*'?[host]:[];
document.elementFromPoint=()=>host;
nested.style.setProperty('filter','brightness(.8)','important');
settings.enabled=true;settings.filterBy='height';settings.imageThreshold=188;apply();
assert.equal(nested.hasAttribute('data-hfe-image-blurred'),true);
assert.equal(nested.style.getPropertyValue('filter'),'blur(20px)');
assert.equal(buttons().length,1);
nested.height=90;apply();assert.equal(nested.hasAttribute('data-hfe-image-blurred'),false);
assert.equal(nested.style.getPropertyValue('filter'),'brightness(.8)');
settings.imageThreshold=80;apply();assert.equal(nested.hasAttribute('data-hfe-image-blurred'),true);
console.log('PASS: thresholds, reveals, timed re-blur, source changes, resize, opacity, cleanup, dynamic open-shadow images and original-filter restoration.');
