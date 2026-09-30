(() => {
  const dictionary = window.NEZUMIMARU_TRANSLATIONS || {};
  const saved = () => { try { return localStorage.getItem('nezumimaru-language'); } catch { return null; } };
  let language = new URLSearchParams(location.search).get('lang') || saved() || 'ja';
  if (!['ja', 'en'].includes(language)) language = 'ja';
  try { localStorage.setItem('nezumimaru-language', language); } catch {}
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const excluded = 'script,style,textarea,input,[data-no-translate]';
  const translate = value => language === 'en' ? (dictionary[value] || value) : value;
  window.nezumimaruTranslate = translate;
  document.querySelectorAll('option:not([value])').forEach(option => option.setAttribute('value', option.textContent));
  const header = document.querySelector('body > header');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'language-switch';
  button.dataset.noTranslate = '';
  if (header) header.append(button);

  function updateText(node) {
    if (node.parentElement?.closest(excluded)) return;
    let entry = originals.get(node);
    if (!entry || node.nodeValue !== entry.last) entry = {original: node.nodeValue};
    const key = entry.original.trim();
    const replacement = language === 'en' && dictionary[key] ? entry.original.match(/^\s*/)[0] + dictionary[key] + entry.original.match(/\s*$/)[0] : entry.original;
    if (node.nodeValue !== replacement) node.nodeValue = replacement;
    entry.last = replacement;
    originals.set(node, entry);
  }
  function updateAttributes(element) {
    if (element.closest(excluded)) return;
    const entries = attributes.get(element) || {};
    for (const key of ['alt', 'title', 'aria-label', 'placeholder']) {
      // Form placeholders are translated separately; entered values are never changed.
      if (!element.hasAttribute(key)) continue;
      const current = element.getAttribute(key);
      let entry = entries[key];
      if (!entry || current !== entry.last) entry = {original: current};
      const replacement = translate(entry.original);
      if (current !== replacement) element.setAttribute(key, replacement);
      entry.last = replacement;
      entries[key] = entry;
    }
    attributes.set(element, entries);
  }
  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) { updateText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    updateAttributes(root);
    root.querySelectorAll('[alt],[title],[aria-label],[placeholder]').forEach(updateAttributes);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) updateText(walker.currentNode);
  }
  const observer = new MutationObserver(records => {
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(scan);
      else if (record.type === 'characterData') updateText(record.target);
      else updateAttributes(record.target);
    }
    observe();
  });
  function observe() { observer.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['alt','title','aria-label','placeholder']}); }
  function apply() {
    observer.disconnect();
    document.documentElement.lang = language;
    scan(document.body);
    scan(document.querySelector('title'));
    // Unlike text nodes, input/textarea placeholders are safe to translate.
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(element => {
      const original = element.dataset.originalPlaceholder || element.getAttribute('placeholder');
      element.dataset.originalPlaceholder = original;
      element.setAttribute('placeholder', translate(original));
    });
    button.textContent = language === 'en' ? '日本語' : 'ENGLISH';
    button.lang = language === 'en' ? 'ja' : 'en';
    button.setAttribute('aria-label', language === 'en' ? '日本語に切り替える' : 'Switch to English');
    document.dispatchEvent(new CustomEvent('site-language-change', {detail: language}));
    observe();
  }
  button.addEventListener('click', () => {
    language = language === 'en' ? 'ja' : 'en';
    try { localStorage.setItem('nezumimaru-language', language); } catch {}
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
    apply();
  });
  if (header && 'ResizeObserver' in window) new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)).observe(header);
  apply();
})();
