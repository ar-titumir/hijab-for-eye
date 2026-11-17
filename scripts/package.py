"""Build an installable ZIP with manifest.json at its root (Python stdlib only)."""
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8-sig'))
version = manifest['version']
files = {'manifest.json', 'popup.html', 'popup.js', 'popup.css', 'settings.js',
         'README.md', 'PRIVACY.md', 'CHANGELOG.md', 'RELEASE_NOTES.md', 'LICENSE'}
for group in manifest['content_scripts']:
    files.update(group['js'])
    files.update(group['css'])
files.update(manifest['icons'].values())
out = root.parent / f'hijab-for-eye-v{version}.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in sorted(files):
        archive.write(root / name, name)
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    assert 'manifest.json' in archive.namelist()
    assert json.loads(archive.read('manifest.json'))['version'] == version
print(f'Validated: {out}')
