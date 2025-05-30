// product modal
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const productModalImg = document.getElementById('product-modal-img');
const productModalTitle = document.getElementById('product-modal-title');
const productModalDesc = document.getElementById('product-modal-desc');
const productModalPrice = document.getElementById('product-modal-price');
const productModalQty = document.getElementById('product-modal-qty');
const addToCartForm = document.getElementById('add-to-cart-form');

function openProductModal(itemElem) {
  productModalImg.src = itemElem.dataset.img;
  productModalImg.alt = itemElem.dataset.title;
  productModalTitle.textContent = itemElem.dataset.title;
  productModalDesc.textContent = itemElem.dataset.desc;
  productModalPrice.textContent = itemElem.dataset.price + ' ₽';
  productModalQty.value = 1;
  productModal.dataset.id = itemElem.dataset.id;
  productModal.dataset.title = itemElem.dataset.title;
  productModal.dataset.price = itemElem.dataset.price;
  productModal.dataset.img = itemElem.dataset.img;
  productModal.dataset.desc = itemElem.dataset.desc;
  productModal.dataset.category = itemElem.dataset.category;
  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { productModalQty.focus(); }, 100);
}
closeProductModal.onclick = () => {
  productModal.classList.remove('active');
  document.body.style.overflow = '';
};
productModal.onclick = e => {
  if (e.target === productModal) {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
document.querySelectorAll('.item').forEach(itemElem => {
  itemElem.addEventListener('click', () => openProductModal(itemElem));
  itemElem.addEventListener('keydown', e => {
    if (e.key === "Enter" || e.key === " ") openProductModal(itemElem);
  });
});

// cart with localStorage
window.cart = [];
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(window.cart));
}
function loadCart() {
  try {
    window.cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch { window.cart = []; }
  updateCartUI();
}

function showToast(msg) {
  const toast = document.getElementById('cart-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.animation = 'fadeToast 2s linear';
  setTimeout(() => {
    toast.style.display = 'none';
    toast.style.animation = '';
  }, 2000);
}
function updateCartUI() {
  const list = document.getElementById('cart-items-list');
  const totalDiv = document.getElementById('cart-total');
  const filter = document.querySelector('#cart-filter input[name="cart-filter"]:checked').value;
  list.innerHTML = '';
  let total = 0;
  let filtered = window.cart;
  if (filter !== 'all') filtered = window.cart.filter(item => item.category === filter);
  if (filtered.length === 0) {
    list.innerHTML = '<li style="text-align:center; color:#aaa;">Нет товаров в этой категории</li>';
    totalDiv.textContent = '';
    document.getElementById('checkout-btn').disabled = true;
    return;
  }
  filtered.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <div>${item.title} × ${item.qty}</div>
      <div>
        <span>${item.price * item.qty} ₽</span>
        <button class="remove-item" title="Удалить" data-id="${item.id}">&times;</button>
      </div>
    `;
    list.appendChild(li);
  });
  totalDiv.textContent = 'Итого: ' + total + ' ₽';
  document.getElementById('checkout-btn').disabled = window.cart.length === 0;
  list.querySelectorAll('.remove-item').forEach(btn => {
    btn.onclick = function() {
      const id = this.dataset.id;
      window.cart = window.cart.filter(item => item.id !== id);
      saveCart();
      updateCartUI();
    }
  });
}
addToCartForm.onsubmit = function(e) {
  e.preventDefault();
  const id = productModal.dataset.id;
  const title = productModal.dataset.title;
  const price = Number(productModal.dataset.price);
  const img = productModal.dataset.img;
  const desc = productModal.dataset.desc;
  const qty = Math.max(1, parseInt(productModalQty.value, 10) || 1);
  const category = productModal.dataset.category;
  let found = false;
  for (let item of window.cart) {
    if (item.id === id) {
      item.qty += qty;
      found = true;
      break;
    }
  }
  if (!found) {
    window.cart.push({ id, title, price, img, desc, qty, category });
  }
  saveCart();
  productModal.classList.remove('active');
  document.body.style.overflow = '';
  showToast('Товар добавлен в корзину!');
  updateCartUI();
};

document.getElementById('open-cart-btn').onclick = function() {
  document.getElementById('cart-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  updateCartUI();
};
document.getElementById('close-cart-btn').onclick = function() {
  document.getElementById('cart-modal').classList.remove('active');
  document.body.style.overflow = '';
};
document.getElementById('cart-modal').onclick = function(e) {
  if (e.target === this) {
    this.classList.remove('active');
    document.body.style.overflow = '';
  }
};
document.getElementById('clear-cart').onclick = function() {
  window.cart = [];
  saveCart();
  updateCartUI();
};
document.querySelectorAll('#cart-filter input[name="cart-filter"]').forEach(radio => {
  radio.addEventListener('change', updateCartUI);
});

// order processing with localStorage
const orderFormModal = document.getElementById('order-form-modal');
const closeOrderForm = document.getElementById('close-order-form');
const orderForm = document.getElementById('order-form');
const orderName = document.getElementById('order-name');
const orderPhone = document.getElementById('order-phone');
const orderAddress = document.getElementById('order-address');
const orderNameError = document.getElementById('order-name-error');
const orderPhoneError = document.getElementById('order-phone-error');
const orderAddressError = document.getElementById('order-address-error');
const orderSuccess = document.getElementById('order-success');
const orderFormTotal = document.querySelector('.order-form-total');

function saveOrderForm() {
  localStorage.setItem('orderForm', JSON.stringify({
    name: orderName.value,
    phone: orderPhone.value,
    address: orderAddress.value
  }));
}
function loadOrderForm() {
  try {
    const data = JSON.parse(localStorage.getItem('orderForm'));
    if (data) {
      orderName.value = data.name || '';
      orderPhone.value = data.phone || '';
      orderAddress.value = data.address || '';
    }
  } catch {}
}

document.getElementById('checkout-btn').onclick = function() {
  orderFormTotal.textContent = document.getElementById('cart-total').textContent;
  orderFormModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  orderSuccess.textContent = '';
  loadOrderForm();
};
closeOrderForm.onclick = () => {
  orderFormModal.classList.remove('active');
  document.body.style.overflow = '';
};
orderFormModal.onclick = e => {
  if (e.target === orderFormModal) {
    orderFormModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// order form validation and submission
orderForm.onsubmit = function(e) {
  e.preventDefault();
  let valid = true;
  orderNameError.textContent = '';
  orderPhoneError.textContent = '';
  orderAddressError.textContent = '';
  orderSuccess.textContent = '';

  if (orderName.value.trim().length < 2) {
    orderNameError.textContent = 'Введите имя (минимум 2 буквы)';
    valid = false;
  }
  if (!/^(\+7|8)[0-9]{10}$/.test(orderPhone.value.trim())) {
    orderPhoneError.textContent = 'Введите телефон в формате +79991234567 или 89991234567';
    valid = false;
  }
  if (orderAddress.value.trim().length < 5) {
    orderAddressError.textContent = 'Введите адрес доставки';
    valid = false;
  }

  if (!valid) return;

  saveOrderForm();
  orderSuccess.textContent = 'Заказ успешно оформлен! Спасибо!';
  window.cart = [];
  saveCart();
  updateCartUI();
  setTimeout(() => {
    orderFormModal.classList.remove('active');
    document.body.style.overflow = '';
  }, 1800);
};

orderName.oninput = saveOrderForm;
orderPhone.oninput = saveOrderForm;
orderAddress.oninput = saveOrderForm;

let mouseDownOutside = false;
let mouseUpOutside = false;
const cartModal = document.getElementById('cart-modal');

function isOutsideAll(target) {
  return !cartModal.contains(target) &&
         !productModal.contains(target) &&
         !orderFormModal.contains(target);
}

document.addEventListener('mousedown', (e) => {
  mouseDownOutside = isOutsideAll(e.target);
});

document.addEventListener('mouseup', (e) => {
  mouseUpOutside = isOutsideAll(e.target);
  if (mouseDownOutside && mouseUpOutside) {
    if (cartModal.classList.contains('active')) {
      cartModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (productModal.classList.contains('active')) {
      productModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (orderFormModal.classList.contains('active')) {
      orderFormModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  mouseDownOutside = false;
  mouseUpOutside = false;
});
