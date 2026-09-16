// Formspreeで発行されたURLを設定すると送信できるようになります。
const FORM_ENDPOINT = '';
const toggle = document.querySelector('.motion-toggle');
toggle?.addEventListener('click', () => {
 const paused = document.querySelector('.marquee').classList.toggle('is-paused');
 toggle.setAttribute('aria-pressed', String(paused));
 toggle.textContent = paused ? 'スクロールを再開' : 'スクロールを停止';
});
const form = document.querySelector('#contact-form');
if (form) {
 const ready = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(FORM_ENDPOINT);
 const status = document.querySelector('#form-status');
 if (ready) {
  form.action = FORM_ENDPOINT;
  document.querySelector('#contact-fields').disabled = false;
  status.textContent = '必須項目をご入力のうえ、送信してください。';
 }
 const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
 const validate = () => boxes[0].setCustomValidity(boxes.some(b=>b.checked) ? '' : '制作物のイメージを1つ以上選んでください。');
 boxes.forEach(box=>box.addEventListener('change',validate));
 validate();
 form.addEventListener('submit', event => {
  if (!ready) {event.preventDefault();return;}
  validate();
  if (!form.reportValidity()) event.preventDefault();
 });
}
