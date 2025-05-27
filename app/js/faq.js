  document.querySelectorAll('#faq .faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      item.classList.toggle('active');
    });

    question.parentElement.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.classList.toggle('active');
      }
    });
  });