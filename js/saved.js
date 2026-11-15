function savedIds() {
  return JSON.parse(localStorage.getItem('saved-spots')) ?? [];
}

export function isSaved(spot) {
  return savedIds().includes(spot.id);
}

export function toggleSaved(spot) {
  const ids = savedIds();
  const saved = !ids.includes(spot.id);

  localStorage.setItem('saved-spots', JSON.stringify(saved ? [...ids, spot.id] : ids.filter((id) => id !== spot.id)));
  return saved;
}
