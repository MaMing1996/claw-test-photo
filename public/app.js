const timeGroupsEl = document.getElementById('time-groups');
const locationGroupsEl = document.getElementById('location-groups');
const buttons = document.querySelectorAll('[data-g]');

function cardTemplate(group) {
  const covers = group.cover.map(p => `<img src="${p.path}" alt="cover" />`).join('');
  return `
    <article class="card">
      <div class="title">${group.key}</div>
      <div class="count">${group.count} 张</div>
      <div class="cover-stack">${covers}</div>
    </article>
  `;
}

async function loadTime(granularity = 'month') {
  const data = await fetch(`/api/groups/time?granularity=${granularity}`).then(r => r.json());
  timeGroupsEl.innerHTML = data.map(cardTemplate).join('');
}

async function loadLocation() {
  const data = await fetch('/api/groups/location').then(r => r.json());
  locationGroupsEl.innerHTML = data.map(cardTemplate).join('');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTime(btn.dataset.g);
  });
});

loadTime('month');
loadLocation();
