const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const base = require('node:path').resolve(__dirname, '..') + '/';
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(delayed = false) {
  const attrs = {}, styles = {};
  const root = { style: { setProperty: (k,v) => styles[k] = v }, setAttribute: (k,v) => attrs[k] = v, removeAttribute: k => delete attrs[k] };
  const document = { documentElement: delayed ? null : root };
  let change, resolve, mutation;
  const context = vm.createContext({ document, HFEImages: { apply() {} },
    MutationObserver: class { constructor(fn) { mutation = fn; } observe() {} disconnect() {} },
    chrome: { storage: { local: { get: () => new Promise(r => resolve = r) }, onChanged: { addListener: fn => change = fn } } }
  });
  for (const file of ['settings.js','content.js']) vm.runInContext(fs.readFileSync(base + file, 'utf8'), context);
  return {attrs, styles, document, root, change, resolve, mutation};
}
(async () => {
  const x = setup();
  x.resolve({enabled:true, videos:true, images:true, videoStrength:75, imageStrength:25});
  await tick();
  assert.equal(x.styles['--media-blur-video-radius'], '30px');
  assert.equal(x.styles['--media-blur-image-radius'], '10px');
  assert.equal(x.attrs['data-media-blur-images'], 'on');
  x.change({videoStrength:{newValue:0}}, 'local');
  assert.equal(x.attrs['data-media-blur-videos'], undefined);
  assert.equal(x.attrs['data-media-blur-images'], 'on');
  x.change({enabled:{newValue:false}}, 'local');
  assert.equal(x.attrs['data-media-blur-images'], undefined);
  x.change({enabled:{newValue:true}}, 'sync');
  assert.equal(x.attrs['data-media-blur-images'], undefined);
  x.change({enabled:{newValue:true}, imageStrength:{newValue:300}}, 'local');
  assert.equal(x.styles['--media-blur-image-radius'], '40px');
  const y = setup(true);
  y.change({videos:{newValue:false}}, 'local');
  y.resolve({enabled:true,videos:true,images:true,videoStrength:60,imageStrength:80});
  await tick();
  y.document.documentElement = y.root;
  y.mutation();
  assert.equal(y.attrs['data-media-blur-videos'], undefined);
  assert.equal(y.attrs['data-media-blur-images'], 'on');
  assert.equal(y.styles['--media-blur-image-radius'], '32px');
  const manifest = JSON.parse(fs.readFileSync(base + 'manifest.json'));
  for (const script of manifest.content_scripts) for (const file of [...script.js,...script.css]) assert.ok(fs.existsSync(base+file));
  for (const file of ['settings.js','images.js','content.js','popup.js']) new vm.Script(fs.readFileSync(base+file,'utf8'));
  assert.ok(fs.existsSync(base+manifest.action.default_popup));
  console.log('PASS: independent strengths, category isolation, master pause, zero, storage area isolation, bounds, concurrent startup changes, delayed DOM, syntax and manifest resources.');
})().catch(e => { console.error(e); process.exitCode = 1; });
