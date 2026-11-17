const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const base = path.resolve(__dirname, '..');
const callbacks = [];
class Element {
  constructor() { this.attrs = {}; this.children = []; this.isConnected = true; this.style = { setProperty(k,v) { this[k] = v; } }; this.listeners = {}; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k,v) { this.attrs[k] = v; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(k,fn) { this.listeners[k] = fn; }
  append(el) { this.children.push(el); el.parent = this; }
  attachShadow() { this.shadow = new Element(); return this.shadow; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(el => el !== this); }
  getBoundingClientRect() { return {left:0,top:0,width:this.width,height:this.height}; }
}
const root = new Element(), photo = new Element();
photo.width = 300; photo.height = 100; photo.attrs.src = 'first.jpg';
const document = {documentElement:root, createElement:() => new Element(), querySelectorAll:() => photo.isConnected ? [photo] : [], elementFromPoint:() => photo, addEventListener() {}};
const context = vm.createContext({document, window:{addEventListener(){}}, innerWidth:1000,innerHeight:1000, requestAnimationFrame:fn => callbacks.push(fn), ResizeObserver:class {observe(){} unobserve(){}}, MutationObserver:class {observe(){}}});
for (const file of ['settings.js','images.js']) vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const api = context.MediaBlur, images = context.HFEImages;
assert.equal(api.qualifies(200,100,{filterBy:'width',imageThreshold:200}),false);
assert.equal(api.qualifies(201,100,{filterBy:'width',imageThreshold:200}),true);
assert.equal(api.qualifies(300,100,{filterBy:'height',imageThreshold:200}),false);
assert.equal(api.qualifies(300,100,{filterBy:'area',imageThreshold:29999}),true);
assert.equal(api.normalize({filterBy:'area',imageThreshold:1e8,eyeOpacity:-1}).imageThreshold,4000000);
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
settings.enabled = true; apply(); photo.isConnected = false; apply(); assert.equal(buttons().length,0);
console.log('PASS: strict threshold, width/height/area, bounds, reveal, replacement source, resized images, opacity, pause and removed-image cleanup.');
