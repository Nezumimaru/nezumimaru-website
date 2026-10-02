const hero = document.querySelector('.hero-art');
const portrait = document.querySelector('#about .portrait');
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (hero) {
  const track = document.createElement('div');
  track.className = 'hero-track';
  const group = document.createElement('div');
  group.className = 'hero-group';
  while (hero.firstChild) group.append(hero.firstChild);
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('img').forEach(img => { img.alt = ''; img.removeAttribute('fetchpriority'); });
  track.append(group, copy);
  hero.append(track);
  hero.classList.add('has-motion');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'motion-toggle';
  let paused = false;
  const update = () => {
    hero.classList.toggle('is-paused', paused || document.hidden || preference.matches);
    button.hidden = preference.matches;
    button.textContent = paused ? '▶ 動きを再開' : 'Ⅱ 動きを止める';
    button.setAttribute('aria-label', paused ? 'トップのイラストの動きを再開する' : 'トップのイラストの動きを止める');
  };
  button.addEventListener('click', () => { paused = !paused; update(); });
  document.querySelector('.hero-foot').append(button);
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  update();
}
if (portrait && 'IntersectionObserver' in window && !preference.matches) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      portrait.classList.add('portrait-arrived');
      observer.disconnect();
    }
  }, {threshold: 0.2, rootMargin: '0px 0px -60px 0px'});
  portrait.classList.add('portrait-waiting');
  observer.observe(portrait);
  preference.addEventListener('change', () => {
    if (preference.matches) {
      portrait.classList.remove('portrait-waiting');
      observer.disconnect();
    }
  });
}
