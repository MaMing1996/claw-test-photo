function sortByCapturedAtDesc(photos) {
  return [...photos].sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
}

function keyByGranularity(iso, granularity) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (granularity === 'year') return `${y}`;
  if (granularity === 'month') return `${y}-${m}`;
  return `${y}-${m}-${day}`;
}

function groupByTime(photos, granularity = 'day') {
  const map = new Map();

  for (const p of photos) {
    const key = keyByGranularity(p.capturedAt, granularity);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  const result = [];
  for (const [key, items] of map.entries()) {
    const sorted = sortByCapturedAtDesc(items);
    result.push({
      key,
      photos: sorted,
      cover: sorted.slice(0, 3),
      count: sorted.length,
    });
  }

  return result.sort((a, b) => (a.key < b.key ? 1 : -1));
}

function groupByCountry(photos) {
  const map = new Map();

  for (const p of photos) {
    const key = p.country || 'Unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  const result = [];
  for (const [key, items] of map.entries()) {
    const sorted = sortByCapturedAtDesc(items);
    result.push({
      key,
      photos: sorted,
      cover: sorted.slice(0, 3),
      count: sorted.length,
    });
  }

  return result.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

module.exports = {
  groupByTime,
  groupByCountry,
};
