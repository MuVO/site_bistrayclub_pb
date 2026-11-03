const menuButton = document.querySelector('header button[aria-label="Toggle menu"]');
if (menuButton) {
  const panel = menuButton.closest('header')?.querySelector('div.md\\:overflow-hidden');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    if (panel) {
      panel.classList.toggle('max-h-0', expanded);
      panel.classList.toggle('opacity-0', expanded);
      panel.classList.toggle('max-h-80', !expanded);
      panel.classList.toggle('opacity-100', !expanded);
    }
  });
  document.querySelectorAll('header nav a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    const panel = menuButton.closest('header')?.querySelector('div.md\\:overflow-hidden');
    panel?.classList.add('max-h-0', 'opacity-0');
    panel?.classList.remove('max-h-80', 'opacity-100');
  }));
}

const form = document.querySelector('#booking form');
if (form) {
  const inputs = form.querySelectorAll('input');
  const name = inputs[0];
  const phone = inputs[1];
  const email = inputs[2];
  const comment = form.querySelector('textarea');
  name.name = 'name';
  phone.name = 'phone';
  email.name = 'email';
  comment.name = 'comment';
  const count = form.querySelector('span.font-heading.text-3xl');
  const buttons = form.querySelectorAll('button[type="button"]');
  const submit = form.querySelector('button[type="submit"]');
  const minimum = Number(form.dataset.minPlayers);
  const priceEach = Number(form.dataset.pricePerPlayer);
  const setTotal = (players) => {
    if (count) count.textContent = String(players);
    const summary = form.querySelector('.rounded-2xl.p-6');
    const texts = summary?.querySelectorAll('span');
    if (texts?.length >= 2) {
      texts[0].textContent = `${players} × ${priceEach.toLocaleString('ru-RU')} ₽`;
      texts[1].textContent = `${(players * priceEach).toLocaleString('ru-RU')} ₽`;
    }
    if (buttons[0]) buttons[0].disabled = !minimum || players <= minimum;
  };
  let players = minimum;
  buttons[0]?.addEventListener('click', () => setTotal(players = Math.max(minimum, players - 1)));
  buttons[1]?.addEventListener('click', () => setTotal(players += 1));
  const validate = () => {
    const valid = Boolean(name?.value.trim()) && Boolean(phone?.value.trim() || email?.value.trim()) && (!email?.value.trim() || email.checkValidity());
    if (submit) submit.disabled = !valid;
    return valid;
  };
  form.addEventListener('input', validate);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) { form.reportValidity(); return; }
    const endpoint = document.documentElement.dataset.contactUrl;
    if (!endpoint) {
      showMessage('Не удалось отправить заявку онлайн. Позвоните нам, чтобы забронировать игру.', true);
      return;
    }
    if (submit) { submit.disabled = true; submit.textContent = 'Отправляем…'; }
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.value.trim(), phone: phone.value.trim(), email: email.value.trim(), comment: comment.value.trim(), players, totalPrice: players * priceEach }) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showMessage('Заявка отправлена! Мы свяжемся с вами для подтверждения брони.', false);
      form.reset(); players = minimum; setTotal(players);
    } catch {
      showMessage('Извините, сервис временно недоступен. Позвоните нам, чтобы забронировать игру.', true);
    } finally { if (submit) submit.textContent = 'Забронировать игру'; validate(); }
  });
  function showMessage(text, error) {
    let status = form.querySelector('[role="status"]');
    if (!status) { status = document.createElement('p'); status.setAttribute('role', 'status'); form.append(status); }
    status.replaceChildren(document.createTextNode(text));
    if (error && form.dataset.phoneHref) {
      const link = document.createElement('a');
      link.href = `tel:${form.dataset.phoneHref}`;
      link.textContent = ' Позвонить';
      link.className = 'underline';
      status.append(link);
    }
    status.className = error ? 'text-sm text-amber-300' : 'text-sm text-neon-green';
  }
  validate();
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  header.classList.toggle('bg-black/80', window.scrollY > 40);
  header.classList.toggle('backdrop-blur-md', window.scrollY > 40);
}, { passive: true });
