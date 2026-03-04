# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# BURKINDI RESTAURANT — PROJECT MEMORY
> Claude: Read this file at the start of every session for this project.

## Business Info
- **Name:** Burkindi Restaurant
- **Address:** 492 Clinton Ave, Newark, NJ 07108
- **Phone:** (973) 732-3310
- **Also on:** DoorDash, Uber Eats (for reference only — site is standalone, NO links to those platforms)
- **Order type:** Pickup only (online order → pay in person or Phase 2 payment integration)

---

## Site Stack & File Layout

Pure HTML / CSS / JS — no framework, no build step.

```
burkindi Resturant/
├── index.html       ← single page, all sections inline
├── style.css        ← all styles (mobile-first)
├── app.js           ← all JS (cart, tabs, order flow)
└── client/
    └── img/         ← drop food images here (exact filenames below)
```

> **Path discrepancy to be aware of:** `index.html` links to `css/style.css` and `js/app.js`, but the actual files live at `style.css` and `app.js` (project root). To resolve: either move the files into `css/` and `js/` subdirectories or update the `<link>` and `<script>` tags in `index.html` to point to the root.

**To run locally:** open `index.html` in a browser directly, or use VS Code Live Server.

---

## Code Architecture

### `index.html` — Structure
Single-page layout with these sections in order:
1. **Header** — sticky, logo + nav + cart button (`#cartToggle`)
2. **Hero** — full-height with `frontstore.png` bg, CTA buttons
3. **How It Works** — 4-step pickup strip
4. **Menu** (`#menu`) — category tab bar + `#menuGrid` of `.menu-card` elements
5. **About** (`#about`) — dark section with `frontstore.png` again
6. **Footer** — address, hours, quick links
7. **Cart Drawer** — slides up from bottom (`#cartDrawer` + `#cartOverlay`)
8. **Success Modal** (`#successModal`) — shown after `placeOrder()`

Each `.menu-card` has `data-cat="dibi|poissons|pintade|sauces|traditional|sides|drinks"` for tab filtering. Cards call `addToCart(name, price, btn)` inline via `onclick`.

### `app.js` — State & Logic
- `cart` array: `[{ id, name, price, qty }]` — lives in module scope, no persistence
- **`addToCart(name, price, btn)`** — finds existing by name or pushes new entry, triggers 1.2s button feedback, calls `updateCartUI()`
- **`changeQty(id, delta)`** — mutates qty, removes item if qty ≤ 0, calls `updateCartUI()`
- **`updateCartUI()`** — rerenders `#cartItems` innerHTML and updates badge count / subtotal
- **`placeOrder()`** — clears cart, closes drawer, shows success modal (no backend in Phase 1)
- Tab filtering: hides/shows `.menu-card` elements by matching `data-cat`; re-triggers CSS `cardIn` animation on show via reflow trick (`card.offsetHeight`)

### `style.css` — Design Tokens
All colors/spacing use CSS custom properties defined in `:root`. Key tokens:
- `--brand: #E8480A` (orange-red), `--accent: #F5A623` (gold)
- `--font-head: 'Syne'`, `--font-body: 'DM Sans'` (Google Fonts)
- `--radius-full: 100px` for pill shapes throughout
- Responsive breakpoints: `540px` (2-col grid, about side-by-side) and `680px` (wider padding)
- `.menu-card` is horizontal row on mobile, switches to vertical card at `≥540px`

### Image Fallback Pattern
Every `<img>` in the menu has `onerror="this.parentElement.classList.add('no-img')"`. When triggered, CSS hides the `<img>` and shows `.img-placeholder` (an emoji). This means the site is fully functional without food photos.

---

## Image Naming Convention
- Drop into `client/img/` using the exact filenames below
- Format: `.png` preferred, `.jpg` accepted
- Two fixed images: `logo.png` and `frontstore.png`

### Full Image Filename Reference
| Category | Image Filename | Price |
|----------|---------------|-------|
| Dibi | dibi-rizgras.png | $37 |
| Dibi | dibi-attieke.png | $37 |
| Dibi | dibi-alloco.png | $37 |
| Dibi | dibi-waki.png | $37 |
| Poissons | poissons-simple.png | $25 |
| Poissons | poissons-attieke.png | $35 |
| Poissons | poissons-alloco.png | $35 |
| Poissons | poissons-rizgras.png | $35 |
| Pintade | pintade-simple.png | $27 |
| Pintade | pintade-attieke.png | $35 |
| Pintade | pintade-alloco.png | $35 |
| Pintade | poulet-grille.png | $35 |
| Sauces | sauce-feuille.png | $24 |
| Sauces | sauce-tomate.png | $24 |
| Sauces | sauce-gombo.png | $24 |
| Sauces | sauce-arachide.png | $24 |
| Traditional | spinach.png | $25 |
| Traditional | gombo.png | $25 |
| Traditional | arachide.png | $25 |
| Traditional | to-gombo.png | $25 |
| Sides | rizgras.png | $13 |
| Sides | alloco.png | $10 |
| Drinks | ginger-juice.png | $7 |
| Drinks | bissap-juice.png | $7 |
| Drinks | deguet.png | $7 |

---

## Menu Categories (Tabs on site)
Tab `data-cat` values: `all`, `dibi`, `poissons`, `pintade`, `sauces`, `traditional`, `sides`, `drinks`

Most liked: Dibi with Riz Gras (#1 badge), Poissons with Attieke (#2 badge), Dibi with Alloco (#3)

---

## Phase 2 (Not built yet)
- Payment integration (Stripe recommended)
- Real order submission → email or backend
- Admin panel to update menu
- Estimated pickup time

---

## Key Rules
- NO DoorDash/Uber Eats links or badges — standalone site only
- Site is mobile-first — test on phone viewport first
- Cart state is in-memory only (resets on page refresh) — Phase 1 by design
- 1K+ ratings credibility is already surfaced in hero and about sections
