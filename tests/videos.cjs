const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const base = path.resolve(__dirname, '..'), callbacks = [];
let now=0, timerId=0;const timers=new Map(), events={};
const setTimer=(fn,ms)=>{timers.set(++timerId,{fn,at:now+ms});return timerId;};
function advance(ms){now+=ms;for(const [id,t]of [...timers])if(t.at<=now){timers.delete(id);t.fn();}}
function fireDoc(type,event){for(const fn of events[type]||[])fn(event);}
class Element {
  constructor() {
    this.attrs = {}; this.children = []; this.isConnected = true; this.listeners = {};
    this.style = { setProperty(k,v) { this[k] = v; }, removeProperty(k) { delete this[k]; } };
  }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k,v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(k,fn) { (this.listeners[k] ||= []).push(fn); }
  removeEventListener(k,fn) { this.listeners[k] = this.listeners[k].filter(f => f !== fn); }
  fire(k, extra={}) { for (const fn of this.listeners[k] || []) fn({preventDefault(){},stopPropagation(){},...extra}); }
  append(...els) { for(const el of els) { this.children.push(el); el.parent = this; } }
  attachShadow() { return this.shadow = new Element(); }
  remove() { if(this.parent) this.parent.children = this.parent.children.filter(el => el !== this); }
  contains(el){return this===el||this.children.some(child=>child.contains(el));}
  focus() { this.focused = true; }
  getBoundingClientRect() { return {left:0,right:640,top:0,width:640,height:360}; }
}
const root = new Element(), first = new Element(), second = new Element();
first.attrs.src = 'first.mp4'; second.attrs.src = 'second.mp4';
const videos = [first,second];
const document = {documentElement:root, createElement:() => new Element(), querySelectorAll:() => videos.filter(v => v.isConnected), addEventListener(k,fn){(events[k]||=[]).push(fn);}};
const context = vm.createContext({URL,document,setTimeout:setTimer,clearTimeout:id=>timers.delete(id),window:{addEventListener(){}},innerWidth:1200,innerHeight:800,requestAnimationFrame:fn => callbacks.push(fn),ResizeObserver:class {observe(){} unobserve(){}},MutationObserver:class {observe(){}}});
for(const file of ['settings.js','videos.js']) vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const api = context.MediaBlur;
let settings = {...api.defaults};
function apply() {context.HFEVideos.apply(settings); while(callbacks.length) callbacks.shift()();}
function controls() {return root.children[0].shadow.children.filter(el => el.className === 'control');}
apply();
assert.equal(controls().length,2);
const control = controls()[0], eye = control.children[0], panel = control.children[1];
const range = panel.children[0].children[0], output = panel.children[1], reset = panel.children[2];
assert.equal(panel.hidden,true); eye.fire('click'); assert.equal(panel.hidden,false);
assert.equal(control.style.top,'8px'); assert.equal(control.style.left,'320px');
range.value=String(api.toSlider(23,0,100)); range.fire('input');
assert.equal(first.style['--hfe-video-local-radius'],'9.200000000000001px');
assert.equal(output.textContent,'23%'); assert.equal(second.attrs['data-hfe-video-override'],undefined);
settings.videoStrength=80; apply(); assert.equal(range.value,String(api.toSlider(23,0,100)));
assert.equal(controls()[1].children[1].children[0].children[0].value,String(api.toSlider(80,0,100)));
range.value='0'; range.fire('input'); assert.equal(first.style['--hfe-video-local-radius'],'0px');
settings.videoEyeSize=60; settings.videoEyeOpacity=25; settings.videoPanelOpacity=40; apply();
assert.equal(control.style['--eye-size'],'60px'); assert.equal(control.style['--eye-opacity'],.25); assert.equal(control.style['--panel-opacity'],.4);
settings.enabled=false; apply(); assert.equal(control.hidden,true);
settings.enabled=true; apply(); assert.equal(control.hidden,false); assert.equal(range.value,'0');
reset.fire('click'); assert.equal(first.attrs['data-hfe-video-override'],undefined); assert.equal(range.value,String(api.toSlider(80,0,100)));
range.value=String(api.toSlider(10,0,100)); range.fire('input'); first.fire('loadstart'); assert.equal(first.attrs['data-hfe-video-override'],undefined);
range.value=String(api.toSlider(20,0,100)); range.fire('input'); first.attrs.src='new.mp4'; apply(); assert.equal(range.value,String(api.toSlider(80,0,100)));
control.fire('keydown',{key:'Escape'}); assert.equal(panel.hidden,true); assert.equal(eye.focused,true);
eye.fire('click');assert.equal(panel.hidden,false);
fireDoc('pointermove',{clientX:100,clientY:100});advance(5000);assert.equal(panel.hidden,false);
fireDoc('pointermove',{clientX:900,clientY:700});advance(1499);assert.equal(panel.hidden,false);advance(1);assert.equal(panel.hidden,true);
eye.fire('click');fireDoc('pointerdown',{composedPath:()=>[]});assert.equal(panel.hidden,true);
first.isConnected=false; apply(); assert.equal(controls().length,1);
assert.equal(api.normalize({videoEyeSize:100,videoEyeOpacity:-5,videoPanelOpacity:200}).videoEyeSize,100);
assert.equal(api.normalize({videoEyeOpacity:-5}).videoEyeOpacity,0);
assert.equal(api.normalize({videoPanelOpacity:200}).videoPanelOpacity,100);
console.log('PASS: independent per-video blur, zero override, global changes, reset, source/load reset, pause, size/opacity, keyboard close, cleanup and bounds.');
