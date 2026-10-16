// Static server for site-dist mounted at /ui/ (as on luismatute.me). Port from argv.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../../site-dist/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 3102);
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  if (!path.startsWith('/ui/')) return res.writeHead(404).end();
  let file = normalize(join(root, path.slice(4)));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  if (statSync(file, { throwIfNoEntry: false })?.isDirectory())
    file = join(file, 'index.html');
  if (!statSync(file, { throwIfNoEntry: false }))
    return res.writeHead(404).end();
  res.writeHead(200, {
    'content-type': types[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1');
