document.querySelectorAll<HTMLFormElement>('form[data-inquiry]').forEach((form) => {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');
  if (!button || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    const data = new FormData(form);
    const newsletter = data.get('interest') === 'Newsletter opt-in request';
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Submission rejected');
      status.textContent = newsletter
        ? 'Your request for email updates was received.'
        : 'Your inquiry was received. We’ll be in touch within one business day.';
      form.reset();
      form.querySelectorAll('.challenge-chip.active').forEach((chip) => {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      });
    } catch {
      status.textContent = 'Your request could not be sent. Try again or email admin@benzeneconsulting.in.';
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
});
