const timeGroupsEl = document.getElementById('time-groups');
const locationGroupsEl = document.getElementById('location-groups');
const buttons = document.querySelectorAll('[data-g]');
const detailSection = document.getElementById('detail');
const overviewSection = document.getElementById('overview');
const overviewLocationSection = document.getElementById('overview-location');
const detailTitle = document.getElementById('detail-title');
const detailGrid = document.getElementById('detail-grid');
const backBtn = document.getElementById('back-btn');

function cardTemplate(group, type) {
  const covers = group.cover.map(p => `<img src="${p.path}" alt="cover" />`).join('');
  return `
    <article class="card" data-type="${type}" data-key="${group.key}">
      <div class="title">${group.key}</div>
      <div class="count">${group.count} 张</div>
      <div class="cover-stack">${covers}</div>
    </article>
  `;
}

function photoTemplate(photo) {
  return `
    <article class="photo-item">
      <img src="${photo.path}" alt="photo-${photo.id}" />
      <div class="photo-meta">
        <div>${new Date(photo.capturedAt).toLocaleString()}</div>
        <div>${photo.country || 'Unknown'}</div>
      </div>
    </article>
  `;
}

function showDetail(type, key, photos) {
  overviewSection.classList.add('hidden');
  overviewLocationSection.classList.add('hidden');
  detailSection.classList.remove('hidden');
  const label = type === 'time' ? `时间分类：${key}` : `地点分类：${key}`;
  detailTitle.textContent = `${label}（共 ${photos.length} 张）`;
  detailGrid.innerHTML = photos.map(photoTemplate).join('');
}

function hideDetail() {
  detailSection.classList.add('hidden');
  overviewSection.classList.remove('hidden');
  overviewLocationSection.classList.remove('hidden');
}

let currentTimeGroups = [];
let currentLocationGroups = [];

async function loadTime(granularity = 'month') {
  const data = await fetch(`/api/groups/time?granularity=${granularity}`).then(r => r.json());
  currentTimeGroups = data;
  timeGroupsEl.innerHTML = data.map(g => cardTemplate(g, 'time')).join('');
}

async function loadLocation() {
  const data = await fetch('/api/groups/location').then(r => r.json());
  currentLocationGroups = data;
  locationGroupsEl.innerHTML = data.map(g => cardTemplate(g, 'location')).join('');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hideDetail();
    loadTime(btn.dataset.g);
  });
});

timeGroupsEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const key = card.dataset.key;
  const group = currentTimeGroups.find(g => g.key === key);
  if (group) showDetail('time', key, group.photos);
});

locationGroupsEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const key = card.dataset.key;
  const group = currentLocationGroups.find(g => g.key === key);
  if (group) showDetail('location', key, group.photos);
});

backBtn.addEventListener('click', hideDetail);

loadTime('month');
loadLocation();
