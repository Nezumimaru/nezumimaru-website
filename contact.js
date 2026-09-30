const form = document.querySelector('#inquiry');
const fields = document.querySelector('#fields');
const review = document.querySelector('#review');
const data = document.querySelector('#review-data');
let confirming = false;
form.addEventListener('submit', event => {
  if (confirming) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  data.replaceChildren();
  const labels = {name:'お名前',email:'メールアドレス',message:'ご相談内容'};
  for (const [key,value] of new FormData(form)) {
    if (key.startsWith('_')) continue;
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = labels[key] || key;
    dd.textContent = String(value).trim() || '未記入';
    if (String(value).trim() && !['ご相談の種類','個人情報の取り扱いへの同意'].includes(key)) dd.dataset.noTranslate = '';
    data.append(dt,dd);
  }
  fields.hidden = true;
  review.hidden = false;
  confirming = true;
  document.querySelector('#review-title').focus();
});
document.querySelector('#edit-button').addEventListener('click', () => {
  confirming = false;
  fields.hidden = false;
  review.hidden = true;
  form.elements.namedItem('name').focus();
});
