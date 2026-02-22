const http = require('http');
const fs = require('fs');
const path = require('path');
const { groupByTime, groupByCountry } = require('./domain/grouping');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

const photos = [
  { id: '1', path: 'https://picsum.photos/id/1015/400/300', capturedAt: '2026-02-22T10:00:00+01:00', country: 'Germany' },
  { id: '2', path: 'https://picsum.photos/id/1025/400/300', capturedAt: '2026-02-22T08:00:00+01:00', country: 'Germany' },
  { id: '3', path: 'https://picsum.photos/id/1035/400/300', capturedAt: '2026-02-21T11:00:00+01:00', country: 'France' },
  { id: '4', path: 'https://picsum.photos/id/1045/400/300', capturedAt: '2026-01-01T10:00:00+01:00', country: 'France' },
  { id: '5', path: 'https://picsum.photos/id/1055/400/300', capturedAt: '2025-12-31T23:00:00+01:00' },
  { id: '6', path: 'https://picsum.photos/id/1065/400/300', capturedAt: '2025-12-30T20:00:00+01:00' }
];

function sendJson(res, obj) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function serveFile(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : 'application/javascript';
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/groups/time') {
    const granularity = url.searchParams.get('granularity') || 'month';
    return sendJson(res, groupByTime(photos, granularity));
  }

  if (url.pathname === '/api/groups/location') {
    return sendJson(res, groupByCountry(photos));
  }

  const target = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(publicDir, target);
  return serveFile(req, res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
