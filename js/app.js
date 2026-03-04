/* ============================================================
   BURKINDI RESTAURANT – APP JS
   Cart · Category Tabs · Order Flow
   ============================================================ */

'use strict';

let cart = []; // [{ id, name, price, qty }]

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

// ── Add to Cart ────────────────────────────────────────────
function addToCart(name, price, btn) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: Date.now(), name, price, qty: 1 });
  }

  // Button feedback: show ✓ briefly
  btn.textContent = '✓';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '+';
    btn.classList.remove('added');
  }, 1000);

  updateCartUI();
}

// ── Qty Controls ───────────────────────────────────────────
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

// ── Render Cart + Bottom Bar ────────────────────────────────
function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Header badge
  document.getElementById('cartCount').textContent = totalQty;

  // ── Bottom cart bar (DoorDash-style) ──
  const cartBar = document.getElementById('cartBar');
  if (cart.length === 0) {
    cartBar.classList.remove('visible');
  } else {
    document.getElementById('cartBarCount').textContent =
      totalQty === 1 ? '1 item' : `${totalQty} items`;
    document.getElementById('cartBarTotal').textContent = '$' + subtotal.toFixed(2);
    cartBar.classList.add('visible');
  }

  // ── Drawer body ──
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

// ── Place Order ────────────────────────────────────────────
function placeOrder() {
  if (cart.length === 0) return;
  closeCart();
  document.getElementById('successModal').classList.add('open');
  cart = [];
  updateCartUI();
}

function closeModal() {
  document.getElementById('successModal').classList.remove('open');
}
document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Category Tabs ──────────────────────────────────────────
const tabs  = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.menu-card');
const catLabels = document.querySelectorAll('.cat-label');

tabs.forEach(tab => {
  tab.addEventListener('click', function () {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const cat = this.dataset.cat;

    // Show/hide cards
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide category section labels
    catLabels.forEach(label => {
      label.style.display =
        (cat === 'all' || label.dataset.catLabel === cat) ? '' : 'none';
    });

    // Scroll tabs into view so active tab is visible
    this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

// ── Scroll shadow on header ─────────────────────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 4) {
    header.style.boxShadow = '0 1px 12px rgba(0,0,0,0.10)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });
