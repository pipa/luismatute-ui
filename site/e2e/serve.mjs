// Static server for site-dist mounted at /ui/ (as on luismatute.me).
// Port: argv[2], else E2E_PORT, else 4174 (the site suite's default).
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../../site-dist/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? process.env.E2E_PORT ?? 4174);
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  if (!path.startsWith('/ui/')) return res.writeHead(404).end();
  let file = normalize(join(root, path.slice(4)));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  if (statSync(file, { throwIfNoEntry: false })?.isDirectory())
    file = join(file, 'index.html');
  if (!statSync(file, { throwIfNoEntry: false })) {
    // Like astro preview and the static host: misses get 404.html, status 404.
    const nf = join(root, '404.html');
    if (!statSync(nf, { throwIfNoEntry: false }))
      return res.writeHead(404).end();
    res.writeHead(404, { 'content-type': 'text/html' });
    return createReadStream(nf).pipe(res);
  }
  res.writeHead(200, {
    'content-type': types[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1');
