const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const ignored = new Set(['.git', 'node_modules', 'dist', 'test-results', 'playwright-report']);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const files = walk(root);
const errors = [];
for (const file of files) {
  const relative = path.relative(root, file);
  if (/(?:^|[\\/])(?:\.env(?:\..*)?|\.wrangler|credentials[^\\/]*|~\$[^\\/]*)$/.test(relative)) errors.push(`Private/local file: ${relative}`);
  if (/\.(?:md|js|cjs|ts|json|yml|html|css)$/.test(file)) {
    const source = fs.readFileSync(file, 'utf8');
    if (/[A-Z]:[\\/]Users[\\/]/i.test(source)) errors.push(`Personal absolute path: ${relative}`);
    if (/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(source)) errors.push(`Credential-like content: ${relative}`);
    if (file.endsWith('.md')) {
      for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
        const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
        if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) errors.push(`Broken local link: ${relative} -> ${target}`);
      }
    }
  }
  if (/\.(?:js|cjs)$/.test(file)) {
    const checked = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (checked.status !== 0) errors.push(`JavaScript syntax: ${relative}\n${checked.stderr}`);
  }
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'deliverables/manifest.json'), 'utf8'));
for (const entry of manifest) {
  const file = path.join(root, 'deliverables', entry.file);
  if (!fs.existsSync(file)) { errors.push(`Missing deliverable: ${entry.file}`); continue; }
  const data = fs.readFileSync(file);
  if (data.length !== entry.bytes || crypto.createHash('sha256').update(data).digest('hex') !== entry.sha256) errors.push(`Changed deliverable: ${entry.file}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS: ${files.length} project files; local Markdown links, JavaScript syntax and ${manifest.length} original deliverable hashes verified.`);
