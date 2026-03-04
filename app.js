/* ============================================================
   BURKINDI RESTAURANT – APP JS
   Cart · Category Tabs · Profile · Mock Checkout
   ============================================================ */

'use strict';

let cart = [];

// ── Cart Open / Close ───────────────────────────────────────
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Profile Sheet ───────────────────────────────────────────
function openProfile() {
  document.getElementById('profileSheet').classList.add('open');
  document.getElementById('profileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProfile() {
  document.getElementById('profileSheet').classList.remove('open');
  document.getElementById('profileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Checkout Sheet ──────────────────────────────────────────
function openCheckout() {
  closeCart();
  renderCheckoutItems();
  checkoutNext(1);
  setTimeout(() => {
    document.getElementById('checkoutSheet').classList.add('open');
    document.getElementById('checkoutOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 180); // slight delay so cart closes first
}
function closeCheckout() {
  document.getElementById('checkoutSheet').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckoutItems() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const el = document.getElementById('checkoutItems');
  el.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item__name">${item.name}</div>
      <span class="checkout-item__qty">x${item.qty}</span>
      <div class="checkout-item__price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');
  document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('checkoutTotal').textContent    = '$' + subtotal.toFixed(2);
}

function checkoutNext(step) {
  // Update step indicators
  [1, 2, 3].forEach(n => {
    const el = document.getElementById('cstep' + n);
    el.classList.remove('active', 'done');
    if (n < step)  el.classList.add('done');
    if (n === step) el.classList.add('active');
  });
  // Show correct panel
  [1, 2, 3].forEach(n => {
    document.getElementById('panel' + n).classList.toggle('hidden', n !== step);
  });
}

function confirmOrder() {
  closeCheckout();
  setTimeout(() => {
    document.getElementById('successModal').classList.add('open');
    cart = [];
    updateCartUI();
  }, 200);
}

// ── Add to Cart ─────────────────────────────────────────────
function addToCart(name, price, btn) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: Date.now(), name, price, qty: 1 });
  }
  btn.textContent = '✓';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '+';
    btn.classList.remove('added');
  }, 1000);
  updateCartUI();
}

// ── Qty Controls ────────────────────────────────────────────
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

// ── Render Cart + Bottom Bar ─────────────────────────────────
function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = totalQty;

  // Bottom cart bar
  const cartBar = document.getElementById('cartBar');
  if (cart.length === 0) {
    cartBar.classList.remove('visible');
  } else {
    document.getElementById('cartBarCount').textContent = totalQty === 1 ? '1 item' : `${totalQty} items`;
    document.getElementById('cartBarTotal').textContent = '$' + subtotal.toFixed(2);
    cartBar.classList.add('visible');
  }

  // Drawer
  const body    = document.getElementById('cartItems');
  const footer  = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>🛒</p>
        <p>Your cart is empty</p>
        <small>Add items from the menu above</small>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  totalEl.textContent = '$' + subtotal.toFixed(2);
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item__controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Remove one">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, +1)" aria-label="Add one">+</button>
      </div>
    </div>
  `).join('');
}

// ── Success Modal ────────────────────────────────────────────
function closeModal() {
  document.getElementById('successModal').classList.remove('open');
}
document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Category Tabs ────────────────────────────────────────────
const tabs      = document.querySelectorAll('.tab');
const cards     = document.querySelectorAll('.menu-card');
const catLabels = document.querySelectorAll('.cat-label');

tabs.forEach(tab => {
  tab.addEventListener('click', function () {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.cat;
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
    catLabels.forEach(label => {
      label.style.display = (cat === 'all' || label.dataset.catLabel === cat) ? '' : 'none';
    });
    this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

// ── Scroll shadow on header ──────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 4 ? '0 1px 12px rgba(0,0,0,0.10)' : 'none';
}, { passive: true });
