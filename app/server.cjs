const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
};

// Only the public application bundle is served, even when previewing source files.
function createServer(base = __dirname) {
  const root = path.resolve(base);
  return http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end('Method not allowed');
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); return res.end('Bad request'); }
    if (pathname.includes('\0') || pathname.includes('\\')) {
      res.writeHead(400); return res.end('Bad request');
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const allowed = ['index.html', 'styles.css', 'domain.js', 'services.js', 'app.js', 'assets/zhihui-kezhi.png'];
    if (!allowed.includes(relative)) { res.writeHead(404); return res.end('Not found'); }
    fs.readFile(path.join(root, relative), (err, data) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {
        'Content-Type': types[path.extname(relative)] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
  const base = process.argv.includes('--dist') ? path.join(__dirname, 'dist') : __dirname;
  createServer(base).listen(port, '127.0.0.1', () => console.log(`Kezhi workspace: http://127.0.0.1:${port}`));
}
module.exports = { createServer };
