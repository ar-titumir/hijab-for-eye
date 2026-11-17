const controls = Object.fromEntries(Object.keys(MediaBlur.defaults).map(key => [key, document.getElementById(key)]));
const status = document.getElementById('status');
let writes = Promise.resolve();
let updateId = 0;
function render() {
  for (const kind of ['video', 'image']) {
    const control = controls[`${kind}Strength`];
    document.getElementById(`${kind}Value`).textContent = `${control.value}%`;
    control.setAttribute('aria-valuetext', `${control.value} percent blur`);
  }
  status.textContent = controls.enabled.checked ? 'Settings saved on this device' : 'Blur paused · strengths remembered';
}
function save() {
  const settings = Object.fromEntries(Object.entries(controls).map(([key, control]) => [key,
    control.type === 'checkbox' ? control.checked : Number(control.value)]));
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
  for (const [key, control] of Object.entries(controls)) {
    if (control.type === 'checkbox') control.checked = settings[key];
    else control.value = settings[key];
    control.disabled = false;
  }
  render();
}).catch(() => { status.textContent = 'Could not load settings. Reopen this popup to retry.'; });
