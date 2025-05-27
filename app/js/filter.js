// catalog categories
  document.querySelectorAll('#category-filter input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const val = this.value;
      document.querySelectorAll('.item').forEach(item => {
        if (item.dataset.category === val) {
          item.classList.add('show');
        } else {
          item.classList.remove('show');
        }
      });
    });
  });
  window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.item').forEach(item => {
      if (item.dataset.category === 'burgers') {
        item.classList.add('show');
      } else {
        item.classList.remove('show');
      }
    });
    document.getElementById('cat-burgers').checked = true;
    loadCart();
    loadOrderForm();
  });