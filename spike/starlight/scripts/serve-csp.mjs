import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? '');
const policy = process.argv[3] ?? 'a';
const port = Number(process.argv[4] ?? process.env.PORT ?? 4179);
if (!root) {
  console.error('usage: node scripts/serve-csp.mjs <dist> <a|b> [port]');
  process.exit(1);
}

const policies = {
  a: "script-src 'self'; style-src 'self'",
  b: "script-src 'self' 'wasm-unsafe-eval'; style-src 'self'",
};
const csp = policies[policy];
if (!csp) {
  console.error('policy must be a or b');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.pagefind': 'application/octet-stream',
  '.pf_meta': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function fileFor(urlPath) {
  const stripped = urlPath.replace(/^\/ui\/?/, '/');
  const decoded = decodeURIComponent(stripped.split('?')[0]);
  const safe = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const relative = safe.replace(/^[/\\]+/, '');
  let path = join(root, relative);
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path) && existsSync(`${path}.html`)) path = `${path}.html`;
  if (!path.startsWith(root + sep) && path !== root) return null;
  return existsSync(path) && statSync(path).isFile() ? path : null;
}

const server = createServer((req, res) => {
  const path = fileFor(req.url ?? '/');
  if (!path) {
    res.writeHead(404, { 'content-security-policy': csp });
    res.end('not found');
    return;
  }
  const headers = {
    'content-security-policy': csp,
    'content-type': types[extname(path)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  };
  res.writeHead(200, headers);
  createReadStream(path).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`serving ${root} at http://127.0.0.1:${port}/ui/`);
  console.log(csp);
});
