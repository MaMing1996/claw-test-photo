const { groupByTime, groupByCountry } = require('./domain/grouping');

const sample = [
  { id: '1', path: 'a.jpg', capturedAt: '2026-02-22T10:00:00+01:00', country: 'Germany' },
  { id: '2', path: 'b.jpg', capturedAt: '2026-02-22T08:00:00+01:00', country: 'Germany' },
  { id: '3', path: 'c.jpg', capturedAt: '2026-01-01T10:00:00+01:00', country: 'France' },
  { id: '4', path: 'd.jpg', capturedAt: '2025-12-31T23:00:00+01:00' },
];

console.log('=== Group by month ===');
console.log(groupByTime(sample, 'month').map(g => ({ key: g.key, count: g.count, cover: g.cover.map(c => c.id) })));

console.log('=== Group by country ===');
console.log(groupByCountry(sample).map(g => ({ key: g.key, count: g.count, cover: g.cover.map(c => c.id) })));
