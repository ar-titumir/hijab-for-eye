const controls = Object.fromEntries(Object.keys(MediaBlur.defaults).filter(key => key !== 'filterBy').map(key => [key, document.getElementById(key)]));
const modes = [...document.querySelectorAll('[name="filterBy"]')];
let filterBy = 'width';
const status = document.getElementById('status');
let writes = Promise.resolve();
let updateId = 0;
function render() {
  for (const key of ['videoEyeSize', 'videoEyeOpacity', 'videoPanelOpacity']) {
    document.getElementById(`${key}Value`).textContent = `${controls[key].value}${key === 'videoEyeSize' ? ' px' : '%'}`;
  }
  for (const kind of ['video', 'image']) {
    const control = controls[`${kind}Strength`];
    document.getElementById(`${kind}Value`).textContent = `${control.value}%`;
    control.setAttribute('aria-valuetext', `${control.value} percent blur`);
  }
  const area = filterBy === 'area';
  controls.imageThreshold.max = area ? '4000000' : '4000';
  const text = `${Number(controls.imageThreshold.value).toLocaleString()} ${area ? 'px²' : 'px'}`;
  document.getElementById('thresholdValue').textContent = text;
  controls.imageThreshold.setAttribute('aria-valuetext', text);
  document.getElementById('thresholdHint').textContent = area ? 'Displayed width × height, in square pixels.' : `Displayed image ${filterBy} in pixels.`;
  document.getElementById('eyeValue').textContent = `${controls.eyeOpacity.value}%`;
  status.textContent = controls.enabled.checked ? 'Settings saved on this device' : 'Blur paused · strengths remembered';
}
function save() {
  const settings = { filterBy, ...Object.fromEntries(Object.entries(controls).map(([key, control]) => [key,
    control.type === 'checkbox' ? control.checked : Number(control.value)])) };
  render();
  status.textContent = 'Applying…';
  const id = ++updateId;
  writes = writes.catch(() => {}).then(() => chrome.storage.local.set(settings));
  writes.then(() => { if (id === updateId) render(); }).catch(() => {
    if (id === updateId) status.textContent = 'Could not save. Adjust a control to retry.';
  });
}
for (const control of Object.values(controls)) {
  control.addEventListener(control.type === 'checkbox' ? 'change' : 'input', save);
}
chrome.storage.local.get(MediaBlur.defaults).then(saved => {
  const settings = MediaBlur.normalize(saved);
  filterBy = settings.filterBy;
  controls.imageThreshold.max = filterBy === 'area' ? '4000000' : '4000';
  for (const radio of modes) { radio.checked = radio.value === filterBy; radio.disabled = false; }
  for (const [key, control] of Object.entries(controls)) {
    if (control.type === 'checkbox') control.checked = settings[key];
    else control.value = settings[key];
    control.disabled = false;
  }
  render();
}).catch(() => { status.textContent = 'Could not load settings. Reopen this popup to retry.'; });
for (const radio of modes) radio.addEventListener('change', () => {
  if (!radio.checked) return;
  const oldArea = filterBy === 'area';
  const value = Number(controls.imageThreshold.value);
  filterBy = radio.value;
  const area = filterBy === 'area';
  controls.imageThreshold.max = area ? '4000000' : '4000';
  if (oldArea !== area) controls.imageThreshold.value = area ? Math.min(4000000, value ** 2) : Math.round(Math.sqrt(value));
  save();
});
