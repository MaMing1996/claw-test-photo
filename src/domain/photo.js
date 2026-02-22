function normalizePhoto(input) {
  return {
    id: input.id,
    path: input.path,
    capturedAt: input.capturedAt,
    country: input.country || 'Unknown',
  };
}

module.exports = { normalizePhoto };
