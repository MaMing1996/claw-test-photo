const test = require('node:test');
const assert = require('node:assert/strict');
const { groupByTime, groupByCountry } = require('../src/domain/grouping');

const photos = [
  { id: '1', path: 'a.jpg', capturedAt: '2026-02-22T10:00:00+01:00', country: 'Germany' },
  { id: '2', path: 'b.jpg', capturedAt: '2026-02-22T08:00:00+01:00', country: 'Germany' },
  { id: '3', path: 'c.jpg', capturedAt: '2026-01-01T10:00:00+01:00', country: 'France' },
  { id: '4', path: 'd.jpg', capturedAt: '2025-12-31T23:00:00+01:00' },
  { id: '5', path: 'e.jpg', capturedAt: '2025-12-30T23:00:00+01:00' },
];

test('groupByTime: month groups and cover uses latest photos', () => {
  const groups = groupByTime(photos, 'month');

  assert.equal(groups[0].key, '2026-02');
  assert.equal(groups[0].count, 2);
  assert.deepEqual(groups[0].cover.map(p => p.id), ['1', '2']);

  const dec = groups.find(g => g.key === '2025-12');
  assert.ok(dec);
  assert.equal(dec.count, 2);
  assert.deepEqual(dec.cover.map(p => p.id), ['4', '5']);
});

test('groupByTime: day granularity creates per-day keys', () => {
  const groups = groupByTime(photos, 'day');
  const keys = groups.map(g => g.key);

  assert.ok(keys.includes('2026-02-22'));
  assert.ok(keys.includes('2026-01-01'));
  assert.ok(keys.includes('2025-12-31'));
});

test('groupByCountry: missing country goes to Unknown', () => {
  const groups = groupByCountry(photos);
  const unknown = groups.find(g => g.key === 'Unknown');

  assert.ok(unknown);
  assert.equal(unknown.count, 2);
  assert.deepEqual(unknown.cover.map(p => p.id), ['4', '5']);
});

test('groupByCountry: groups sorted by count desc', () => {
  const groups = groupByCountry(photos);
  assert.equal(groups[0].key, 'Germany');
  assert.equal(groups[0].count, 2);
});
