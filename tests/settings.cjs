const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const context=vm.createContext({URL,screen:{width:1920,height:1080},location:{href:'https://embed.example/player',ancestorOrigins:['https://middle.example','https://www.youtube.com']}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../settings.js'),'utf8'),context);
const api=context.MediaBlur;
assert.equal(api.thresholdMax('width'),2400);assert.equal(api.thresholdMax('height'),1350);assert.equal(api.thresholdMax('area'),2592000);
assert.equal(api.pageHost(),'www.youtube.com');
for(const [min,max] of [[0,100],[12,100],[0,4000],[0,2592000]]){
  assert.equal(api.fromSlider(0,min,max),min);assert.equal(api.fromSlider(1000,min,max),max);
  let previous=min-1;for(let p=0;p<=1000;p++){const v=api.fromSlider(p,min,max);assert.ok(v>=previous);previous=v;}
  for(let p=0;p<=1000;p+=10){const v=api.fromSlider(p,min,max);assert.ok(Math.abs(api.fromSlider(api.toSlider(v,min,max),min,max)-v)<=1);}
  const values=[0,250,500,750,1000].map(p=>api.fromSlider(p,min,max));
  const increments=values.slice(1).map((v,i)=>v-values[i]);
  for(let i=1;i<increments.length;i++)assert.ok(increments[i]>increments[i-1]);
  assert.ok(values[2]<min+(max-min)/2);
}
const rules=api.normalize({...api.defaults,siteAll:false,siteOnly:true,includedSites:'youtube.com, https://Example.com/path',excludedSites:'www.youtube.com, elsewhere.com'});
assert.equal(rules.includedSites,'youtube.com, example.com');assert.equal(rules.excludedSites,'elsewhere.com');
assert.equal(api.siteAllowed('www.youtube.com',rules),true);assert.equal(api.siteAllowed('notyoutube.com',rules),false);
assert.equal(api.siteAllowed('example.com.attacker.test',rules),false);
const exclusion=api.normalize({...api.defaults,siteExclude:true,excludedSites:'youtube.com'});
assert.equal(api.siteAllowed('www.youtube.com',exclusion),false);assert.equal(api.siteAllowed('example.com',exclusion),true);
assert.equal(api.siteAllowed('example.com',api.normalize({...api.defaults,siteAll:false})),false);
assert.equal(api.disjoint('youtube.com,example.com','www.youtube.com','excluded').includedSites,'example.com');
assert.equal(api.parseSites('https://user:secret@example.com').invalid.length,1);
assert.equal(api.parseSites('file:///tmp/x').invalid.length,1);
assert.equal(api.normalize({reblurDuration:9999,videoHideDelay:-1}).reblurDuration,4000);
assert.equal(api.normalize({videoHideDelay:-1}).videoHideDelay,0);
console.log('PASS: uniform accelerating exponential scales, endpoints, round trips, display limits, top-level frame rules, site exclusivity, subdomains and invalid entries.');
