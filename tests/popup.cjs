const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'popup.html'),'utf8');
class Control {
  constructor(type=''){this.type=type;this.value='';this.checked=false;this.disabled=true;this.events={};}
  addEventListener(type,fn){this.events[type]=fn;} setAttribute(key,value){this[key]=value;}
  fire(type){this.events[type]?.();}
}
const controls={};for(const match of html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)){controls[match[1]]=new Control(match[0].match(/type="([^"]+)"/)?.[1]||'');}
const radios=['width','height','area'].map(value=>{const r=new Control('radio');r.value=value;return r;});
const saved=[];
const context=vm.createContext({URL,screen:{width:1920,height:1080},document:{getElementById:id=>controls[id],querySelectorAll:()=>radios,activeElement:null},chrome:{storage:{local:{get:async defaults=>({...defaults}),set:async value=>saved.push({...value})}},tabs:{query:async()=>[{url:'https://www.youtube.com/watch?v=test'}]}}});
for(const file of ['settings.js','popup.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 await tick();assert.equal(controls.siteOnly.disabled,true);assert.equal(controls.siteExclude.disabled,false);
 controls.siteAll.checked=false;controls.siteAll.fire('change');assert.equal(controls.siteOnly.disabled,false);
 controls.siteOnly.checked=true;controls.siteOnly.fire('change');assert.equal(controls.siteAll.disabled,true);assert.equal(controls.siteExclude.disabled,true);
 controls.includeCurrent.fire('click');await tick();assert.equal(saved.at(-1).includedSites,'www.youtube.com');
 assert.equal(controls.removeIncluded.disabled,false);controls.removeIncluded.fire('click');await tick();assert.equal(saved.at(-1).includedSites,'');
 controls.includedSites.value='youtube.com';controls.includedSites.fire('change');
 controls.siteOnly.checked=false;controls.siteOnly.fire('change');controls.siteAll.checked=true;controls.siteAll.fire('change');
 controls.siteExclude.checked=true;controls.siteExclude.fire('change');controls.excludeCurrent.fire('click');await tick();
 assert.equal(saved.at(-1).includedSites,'');assert.equal(saved.at(-1).excludedSites,'www.youtube.com');
 controls.reblurEnabled.checked=true;controls.reblurEnabled.fire('change');assert.equal(controls.reblurOptions.hidden,false);
 controls.reblurDuration.value='1000';controls.reblurDuration.fire('input');await tick();assert.equal(saved.at(-1).reblurDuration,4000);
 controls.eyeOpacity.value='500';controls.eyeOpacity.fire('input');await tick();assert.ok(saved.at(-1).eyeOpacity>50);
 controls.imageThreshold.value='1000';controls.imageThreshold.fire('input');await tick();assert.equal(saved.at(-1).imageThreshold,2400);
 radios[2].checked=true;radios[2].fire('change');controls.imageThreshold.value='1000';controls.imageThreshold.fire('input');await tick();assert.equal(saved.at(-1).imageThreshold,2592000);
 console.log('PASS: popup startup, site checkbox rules, current-tab add/remove, disjoint edits, conditional re-blur settings and mapped slider storage.');
})().catch(error=>{console.error(error);process.exitCode=1;});
