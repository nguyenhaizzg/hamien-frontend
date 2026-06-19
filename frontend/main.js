document.addEventListener('DOMContentLoaded', function() {
    loadOutstanding();
    loadNewArrivals();
});
function loadOutstanding() {
    fetch('https://Nguyenhai.pythonanywhere.com/api/products/outstanding')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('outstanding-grid');
            if (!grid) return;

            grid.innerHTML = data.map(p => {
                const safeData = JSON.stringify({
                    name: p.name, price: p.price, code: p.code, imgs: [p.image_url_1, p.image_url_2]
                }).replace(/'/g, "&apos;");

                return `
                  <div class="product-card" onclick='openProduct(${safeData})' style="cursor:pointer">
                    <div class="product-thumb">
                      <div class="img-box">
                        <img src="${p.image_url_1}" alt="${p.name}"/>
                      </div>
                      <div class="product-quick">
                        <button class="product-qbtn" onclick="event.stopPropagation(); addToCartFromCard(this)">THÊM VÀO GIỎ</button>
                        <button class="product-qbtn" onclick="event.stopPropagation(); addToWishlistFromCard(this)">YÊU THÍCH</button>
                      </div>
                    </div>
                    <div class="product-info">
                      <h4>${p.name}</h4>
                      <div class="product-price">${p.price}</div>
                    </div>
                  </div>
                `;
            }).join('');
        })
        .catch(error => console.error("Lỗi khi kết nối Database (Sản phẩm nổi bật):", error));
}
function loadNewArrivals() {
    fetch('https://Nguyenhai.pythonanywhere.com/api/products/new')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('new-arrival-grid');
            if (!grid) return;
            
            grid.innerHTML = data.map(p => {
                const safeData = JSON.stringify({
                    name: p.name, price: p.price, code: p.code, imgs: [p.image_url_1, p.image_url_2]
                }).replace(/'/g, "&apos;");

                return `
                  <div class="product-card" onclick='openProduct(${safeData})' style="cursor:pointer">
                    <div class="product-thumb">
                      <div class="img-box">
                        <img src="${p.image_url_1}" alt="${p.name}"/>
                      </div>
                      <div class="product-quick">
                        <button class="product-qbtn" onclick="event.stopPropagation(); addToCartFromCard(this)">THÊM VÀO GIỎ</button>
                        <button class="product-qbtn" onclick="event.stopPropagation(); addToWishlistFromCard(this)">YÊU THÍCH</button>
                      </div>
                    </div>
                    <div class="product-info">
                      <h4>${p.name}</h4>
                      <div class="product-price">${p.price}</div>
                    </div>
                  </div>
                `;
            }).join('');
        })
        .catch(error => console.error("Lỗi khi kết nối Database (Sản phẩm mới):", error));
}

function showPage(page) {
  document.getElementById('page-home').style.display    = page === 'home'    ? 'block' : 'none';
  document.getElementById('page-danhmuc').style.display = page === 'danhmuc' ? 'block' : 'none';

  document.getElementById('nav-home').classList.toggle('nav-active',    page === 'home');
  document.getElementById('nav-danhmuc').classList.toggle('nav-active', page === 'danhmuc');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function dmToggle(el) {
  const group  = el.closest('.dm-cat-group');
  const isOpen = group.classList.contains('open');

  document.querySelectorAll('.dm-cat-group').forEach(g => g.classList.remove('open'));
  if (!isOpen) group.classList.add('open');
}

/* ──────────────────────────────────────────────
   3. HERO SLIDER TRANG CHỦ
   ────────────────────────────────────────────── */
let current = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let timer    = setInterval(() => changeSlide(1), 4000);

function goSlide(n) {
  if(slides.length === 0) return;
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = n;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  clearInterval(timer);
  timer = setInterval(() => changeSlide(1), 4000);
}

function changeSlide(dir) {
  if(slides.length === 0) return;
  goSlide((current + dir + slides.length) % slides.length);
}

/* ──────────────────────────────────────────────────────
   4. TRANG CHI TIẾT SẢN PHẨM (Modal)
   ────────────────────────────────────────────────────── */

const relatedProducts = [
  { name: 'Áo Dệt Kim Avon Top RR26DK26',    price: '380.000đ', code: 'RR26DK26' },
  { name: 'Váy Quần Veres Skort RR26VQ06',   price: '520.000đ', code: 'RR26VQ06' },
  { name: 'Áo Thun Nữ Boa Top RR26AT11',     price: '330.000đ', code: 'RR26AT11' },
  { name: 'Set Áo và Quần Nữ Hella RR26SQ11',price: '690.000đ', code: 'RR26SQ11' },
];

let currentProduct = null; // Biến lưu trữ sản phẩm đang mở để gửi ảnh sang giỏ hàng
let pmQtyVal = 1;

// Mở modal sản phẩm
function openProduct(data) {
  currentProduct = data; // Lưu lại toàn bộ data (bao gồm cả mảng ảnh imgs)
  const modal = document.getElementById('product-modal');

  document.getElementById('pm-name').textContent    = data.name  || 'Tên Sản Phẩm';
  document.getElementById('pm-bc-name').textContent = data.name  || 'Tên Sản Phẩm';
  document.getElementById('pm-price').innerHTML     = data.price || '0đ';
  document.getElementById('pm-code').textContent     = data.code   || '';

  // ── LẤY ẢNH CHUẨN XÁC ──
  const defaultImgSrc = (data.imgs && data.imgs.length > 0 && data.imgs[0] !== "") ? data.imgs[0] : (data.imgFallback || '');
  const placeholder = `<svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;

  const mainBox = document.getElementById('pm-main-img-box');
  if (mainBox) {
    mainBox.innerHTML = defaultImgSrc
      ? `<img src="${defaultImgSrc}" alt="${data.name}" style="width:100%;height:100%;object-fit:contain;display:block;"/>`
      : placeholder;
  }

  [0, 1].forEach(i => {
    const thumbBox = document.getElementById('pm-thumb-' + i);
    if (thumbBox) {
      let srcToUse = '';
      if (i === 0) {
        srcToUse = defaultImgSrc; 
      } else {
        srcToUse = (data.imgs && data.imgs[i]) ? data.imgs[i] : '';
      }

      thumbBox.innerHTML = srcToUse
        ? `<img src="${srcToUse}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;"/>`
        : placeholder;
    }
  });

  pmQtyVal = 1;
  document.getElementById('pm-qty-num').textContent = '1';

  document.querySelectorAll('.pm-size-btn').forEach(b => b.classList.remove('active'));
  const firstSize = document.querySelector('.pm-size-btn');
  if (firstSize) firstSize.classList.add('active');
  document.getElementById('pm-size-selected').textContent = firstSize ? firstSize.textContent : 'XS';
  
  document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));

  document.querySelectorAll('.pm-thumb').forEach(t => t.classList.remove('active'));
  const firstThumb = document.querySelector('.pm-thumb');
  if (firstThumb) firstThumb.classList.add('active');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.scrollTop = 0;
}

function closeProduct() {
  document.getElementById('product-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('product-modal').addEventListener('click', function(e) {
  if (e.target === this) closeProduct();
});

function pmSelectSize(btn) {
  document.querySelectorAll('.pm-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pm-size-selected').textContent = btn.textContent;
}

function pmQty(dir) {
  pmQtyVal = Math.max(1, pmQtyVal + dir);
  document.getElementById('pm-qty-num').textContent = pmQtyVal;
}

function pmSelectThumb(el, idx) {
  document.querySelectorAll('.pm-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const thumbBox = document.getElementById('pm-thumb-' + idx);
  const mainBox  = document.getElementById('pm-main-img-box');
  if (thumbBox && mainBox) {
    mainBox.innerHTML = thumbBox.innerHTML;
  }
}

function pmSwitchTab(tabEl, contentId) {
  const isActive = tabEl.classList.contains('active'); 
  document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));
  if (!isActive) {
    tabEl.classList.add('active');
    const content = document.getElementById(contentId);
    if (content) content.classList.add('active');
  }
}

/* ──────────────────────────────────────────────────────
   5. MODAL ĐĂNG NHẬP / ĐĂNG KÝ
   ────────────────────────────────────────────────────── */

function openAuth(type) {
  document.getElementById('auth-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('auth-login').style.display    = type === 'login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = type === 'register' ? 'block' : 'none';
}

function closeAuth() {
  document.getElementById('auth-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuth(type) {
  document.getElementById('auth-login').style.display    = type === 'login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = type === 'register' ? 'block' : 'none';
  document.querySelector('.auth-panel').scrollTop = 0;
}

document.getElementById('auth-modal').addEventListener('click', function(e) {
  if (e.target === this) closeAuth();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('auth-modal').classList.contains('open')) {
      closeAuth();
    } else {
      closeProduct();
    }
  }
});

function togglePw(inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  iconEl.textContent = isHidden ? '🙈' : '👁';
}

/* ──────────────────────────────────────────────────────────
   6. YÊU THÍCH & GIỎ HÀNG
   ────────────────────────────────────────────────────────── */

let wishlistItems = []; 
let cartItems     = []; 

function updateBadges() {
  const wEl = document.getElementById('wishlist-count');
  const cEl = document.getElementById('cart-count');
  const wCount = wishlistItems.length;
  const cCount = cartItems.reduce((s, i) => s + i.qty, 0);

  if (wEl) {
    wEl.textContent = wCount;
    const wBtn = wEl.closest('.hdr-icon-btn'); 
    if (wCount > 0) wBtn.classList.add('has-items');
    else wBtn.classList.remove('has-items');
  }

  if (cEl) {
    cEl.textContent = cCount;
    const cBtn = cEl.closest('.hdr-icon-btn'); 
    if (cCount > 0) cBtn.classList.add('has-items');
    else cBtn.classList.remove('has-items');
  }
}

function popBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 350);
}

let toastTimer = null;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('app-toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast) return;
  msgEl.textContent = msg;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ══ YÊU THÍCH ══

function addToWishlistFromCard(btn) {
  const product = _getProductFromCard(btn.closest('.product-card') || btn.closest('.dm-card'));
  if (!product) return;
  addToWishlist(product);
}

function addToWishlistFromModal() {
  if (!currentProduct) return;
  addToWishlist(currentProduct);
  const btn = document.querySelector('.pm-wishlist-btn i');
  if (btn) btn.className = 'fa-solid fa-heart';
  document.querySelector('.pm-wishlist-btn').style.color = 'var(--red)';
}

function addToWishlist(product) {
  const exists = wishlistItems.find(p => p.code === product.code && p.name === product.name);
  if (exists) {
    showToast(`"${product.name.substring(0,30)}..." đã có trong yêu thích`, 'info');
    return;
  }
  wishlistItems.push(product);
  updateBadges();
  popBadge('wishlist-count');
  showToast(`Đã thêm vào yêu thích`);
  renderWishlist();
}

function removeFromWishlist(code, name) {
  wishlistItems = wishlistItems.filter(p => !(p.code === code && p.name === name));
  updateBadges();
  renderWishlist();
  showToast('Đã xoá khỏi yêu thích', 'info');
}

function renderWishlist() {
  const grid  = document.getElementById('wl-grid');
  const empty = document.getElementById('wl-empty');
  if (!grid) return;

  if (wishlistItems.length === 0) {
    empty.style.display = 'block';
    grid.innerHTML = '';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = wishlistItems.map((p, i) => {
    // Render ảnh thật nếu có, nếu không thì hiện icon mặc định
    const imgSrc = (p.imgs && p.imgs[0]) ? p.imgs[0] : (p.imgFallback || '');
    const imgHtml = imgSrc 
      ? `<img src="${imgSrc}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"/>`
      : `<svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;

    return `
    <div class="wl-card">
      <div class="wl-thumb" onclick='openProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
        <div class="img-box" style="height:100%">
          ${imgHtml}
        </div>
        <button class="wl-remove-btn" title="Xoá khỏi yêu thích"
          onclick="event.stopPropagation(); removeFromWishlist('${p.code}','${p.name.replace(/'/g,"\\'")}')">✕</button>
      </div>
      <div class="wl-name">${p.name}</div>
      <div class="wl-price">${p.price}</div>
      <button class="wl-add-cart-btn"
        onclick='addToCartDirect(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
             Thêm Vào Giỏ
      </button>
    </div>
  `}).join('');
}

// ══ GIỎ HÀNG ══

function addToCart() {
  if (!currentProduct) return;
  const size  = document.getElementById('pm-size-selected')?.textContent || 'XS';
  const color = document.getElementById('pm-color-selected')?.textContent || '';
  addToCartDirect(currentProduct, size, color, pmQtyVal);
}

function addToCartDirect(product, size = 'XS', color = '', qty = 1) {
  const idx = cartItems.findIndex(i => i.name === product.name && i.size === size && i.color === color);
  if (idx >= 0) {
    cartItems[idx].qty += qty;
  } else {
    cartItems.push({ ...product, size, color, qty });
  }
  updateBadges();
  popBadge('cart-count');
  showToast(`Đã thêm vào giỏ hàng`);
  renderCart();
}

function cartChangeQty(idx, dir) {
  cartItems[idx].qty = Math.max(1, cartItems[idx].qty + dir);
  updateBadges();
  renderCart();
}

function removeFromCart(idx) {
  cartItems.splice(idx, 1);
  updateBadges();
  renderCart();
  showToast('Đã xoá khỏi giỏ hàng', 'info');
}

function parsePrice(priceStr) {
  return parseInt((priceStr || '0').replace(/[^\d]/g, '')) || 0;
}

function formatPrice(num) {
  return num.toLocaleString('vi-VN') + 'đ';
}

function renderCart() {
  const empty   = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');
  const list    = document.getElementById('cart-items-list');
  if (!list) return;

  if (cartItems.length === 0) {
    empty.style.display   = 'block';
    content.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  content.style.display = 'block';

  list.innerHTML = cartItems.map((item, i) => {
    const unitPrice  = parsePrice(item.price);
    const totalPrice = unitPrice * item.qty;
    
    // Đọc ra link ảnh thật của sản phẩm
    const imgSrc = (item.imgs && item.imgs[0]) ? item.imgs[0] : (item.imgFallback || '');
    const imgHtml = imgSrc 
      ? `<img src="${imgSrc}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;"/>`
      : `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-img">
            <div class="img-box" style="height:100%">
              ${imgHtml}
            </div>
          </div>
          <div class="cart-item-detail">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">
              Size: ${item.size}${item.color ? ' · ' + item.color : ''}
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${i})">Xoá</button>
          </div>
        </div>
        <div class="cart-item-price">${item.price}</div>
        <div>
          <div class="cart-qty">
            <button class="cart-qty-btn" onclick="cartChangeQty(${i},-1)">−</button>
            <div class="cart-qty-num">${item.qty}</div>
            <button class="cart-qty-btn" onclick="cartChangeQty(${i},1)">+</button>
          </div>
        </div>
        <div class="cart-item-total">${formatPrice(totalPrice)}</div>
      </div>
    `;
  }).join('');

  const subtotal = cartItems.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const ship     = subtotal >= 500000 ? 'Miễn phí' : formatPrice(30000);
  const shipNum  = subtotal >= 500000 ? 0 : 30000;
  const total    = subtotal + shipNum;

  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('cart-ship').textContent     = ship;
  document.getElementById('cart-total').textContent    = formatPrice(total);
}

function applyCoupon() {
  const code = document.getElementById('coupon-input')?.value?.trim().toUpperCase();
  if (code === 'RUBIES10') {
    showToast('Áp dụng mã RUBIES10 thành công! Giảm 10%');
  } else {
    showToast('Mã giảm giá không hợp lệ', 'info');
  }
}

const _origShowPage = showPage;
showPage = function(page) {
  // Thêm 'page-bosuutap' vào danh sách mảng pages
  const pages = ['page-home','page-danhmuc','page-wishlist','page-cart', 'page-bosuutap'];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById('page-' + page);
  if (target) target.style.display = 'block';

  // Thêm 'nav-bosuutap' vào danh sách nav
  ['nav-home','nav-danhmuc', 'nav-bosuutap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('nav-active');
  });
  
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('nav-active');

  if (page === 'wishlist') renderWishlist();
  if (page === 'cart')     renderCart();
  if (page === 'bosuutap') closeCollection();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ─────────────────────────────────────────────
   THÊM VÀO GIỎ TỪ CARD HOVER (QUICK ADD MODAL)
   ───────────────────────────────────────────── */

function _getProductFromCard(card) {
  if (!card) return null;
  const imgEl = card.querySelector('.product-thumb img, .dm-thumb img');
  const imgFallback = imgEl ? imgEl.getAttribute('src') : '';

  const attr = card.getAttribute('onclick') || '';
  const m = attr.match(/openProduct\((\{.*?\})\)/);
  if (m) { 
    try { 
      let data = JSON.parse(m[1]); 
      data.imgFallback = imgFallback; 
      return data;
    } catch(e) {} 
  }

  const n = card.querySelector('.product-info h4, .dm-name');
  const p = card.querySelector('.product-price, .dm-price');
  const name = n ? n.textContent.trim() : 'Sản phẩm';
  return { 
    name, 
    price: p ? p.textContent.trim() : '0đ', 
    code: name.match(/RR\w+/)?.[0] || '',
    imgFallback: imgFallback
  };
}

let qaProduct = null;
let qaQtyVal = 1;

function openQuickAdd(product) {
  qaProduct = product;
  qaQtyVal = 1;
  document.getElementById('qa-qty-num').textContent = '1';
  
  document.querySelectorAll('.qa-size-btn').forEach(b => b.classList.remove('active'));
  const firstSize = document.querySelector('.qa-size-btn');
  if (firstSize) firstSize.classList.add('active');
  document.getElementById('qa-size-selected').textContent = 'XS';
  
  document.getElementById('qa-name').textContent = product.name;
  document.getElementById('quick-add-modal').classList.add('open');
}

function closeQuickAdd() {
  document.getElementById('quick-add-modal').classList.remove('open');
}

function qaSelectSize(btn) {
  document.querySelectorAll('.qa-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('qa-size-selected').textContent = btn.textContent;
}

function qaQty(dir) {
  qaQtyVal = Math.max(1, qaQtyVal + dir);
  document.getElementById('qa-qty-num').textContent = qaQtyVal;
}

function confirmQuickAdd() {
  if (!qaProduct) return;
  const size = document.getElementById('qa-size-selected').textContent;
  addToCartDirect(qaProduct, size, '', qaQtyVal);
  closeQuickAdd();
}

document.getElementById('quick-add-modal').addEventListener('click', function(e) {
  if (e.target === this) closeQuickAdd();
});

function addToCartFromCard(btn) {
  const product = _getProductFromCard(btn.closest('.product-card'));
  if (!product) return;
  openQuickAdd(product);
}

function addToCartFromDmCard(btn) {
  const product = _getProductFromCard(btn.closest('.dm-card'));
  if (!product) return;
  openQuickAdd(product);
}
/* ─────────────────────────────────────────────
   XỬ LÝ MỞ / ĐÓNG CHI TIẾT BỘ SƯU TẬP
   ───────────────────────────────────────────── */
function openCollection(colId) {
  // 1. Ẩn lưới danh sách 5 BST
  document.getElementById('bst-list-view').style.display = 'none';
  // 2. Hiện khu vực chi tiết
  document.getElementById('bst-detail-view').style.display = 'block';
  
  // 3. Ẩn tất cả các section chi tiết trước
  document.querySelectorAll('.collection-block').forEach(block => {
    block.style.display = 'none';
  });
  
  // 4. Chỉ hiện section có ID tương ứng được click
  const activeBlock = document.getElementById(colId);
  if (activeBlock) {
    activeBlock.style.display = 'block';
  }

  // Cuộn lên đầu
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCollection() {
  // Hiện lại lưới danh sách
  document.getElementById('bst-list-view').style.display = 'block';
  // Ẩn khu vực chi tiết
  document.getElementById('bst-detail-view').style.display = 'none';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function closeCollection() {
  // Hiện lại lưới danh sách
  document.getElementById('bst-list-view').style.display = 'block';
  // Ẩn khu vực chi tiết
  document.getElementById('bst-detail-view').style.display = 'none';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
/* ---> (Đã xóa dấu ngoặc thừa ở đây) <--- */


/* ─────────────────────────────────────────────
   NỘI DUNG VÀ XỬ LÝ TRANG TRỢ GIÚP / CHÍNH SÁCH
   ───────────────────────────────────────────── */
const helpContent = {

  /* ══════════════════════════════
     VỀ CHÚNG TÔI
     ══════════════════════════════ */
  'about': {
    title: 'Về HẠ MIÊN',
    body: `
      <div class="help-section">
        <h2 class="help-h2">Câu Chuyện Thương Hiệu</h2>
        <p>HẠ MIÊN được thành lập năm 2020 với khát vọng mang đến cho người phụ nữ Việt Nam những bộ trang phục vừa thanh lịch, vừa gần gũi và phù hợp với nhịp sống hiện đại.</p>
        <p>Tên thương hiệu <strong>HẠ MIÊN</strong> mang ý nghĩa "giấc ngủ mùa hạ" — gợi lên vẻ đẹp nhẹ nhàng, thuần khiết và bình yên của người phụ nữ trong từng khoảnh khắc cuộc sống.</p>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Tầm Nhìn & Sứ Mệnh</h2>
        <p>Chúng tôi tin rằng mỗi người phụ nữ đều xứng đáng được mặc đẹp mỗi ngày — không chỉ trong những dịp đặc biệt mà ngay cả trong những buổi sáng bình thường nhất.</p>
        <p>Sứ mệnh của HẠ MIÊN là tạo ra những sản phẩm thời trang chất lượng cao, thiết kế tinh tế, giá cả hợp lý — để phong cách không còn là đặc quyền của số ít.</p>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Cam Kết Chất Lượng</h2>
        <ul class="help-list">
          <li>100% sản phẩm được kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.</li>
          <li>Chất liệu vải được chọn lọc kỹ càng: mềm mại, thoáng mát, thân thiện với da.</li>
          <li>Đường may tỉ mỉ, form dáng chuẩn, phù hợp với vóc dáng người Việt.</li>
          <li>Màu sắc bền đẹp qua nhiều lần giặt nhờ công nghệ nhuộm vải hiện đại.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Hệ Thống Cửa Hàng</h2>
        <div class="help-store-list">
          <div class="help-store-item">
            <strong>HẠ MIÊN — Hà Nội</strong>
            <span>25 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
            <span>Giờ mở cửa: 8:30 – 21:30 (Tất cả các ngày)</span>
          </div>
          <div class="help-store-item">
            <strong>HẠ MIÊN — TP. Hồ Chí Minh</strong>
            <span>112 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh</span>
            <span>Giờ mở cửa: 8:30 – 21:30 (Tất cả các ngày)</span>
          </div>
          <div class="help-store-item">
            <strong>HẠ MIÊN — Đà Nẵng</strong>
            <span>48 Trần Phú, Hải Châu, Đà Nẵng</span>
            <span>Giờ mở cửa: 8:30 – 21:00 (Tất cả các ngày)</span>
          </div>
        </div>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Liên Hệ</h2>
        <ul class="help-list">
          <li>Hotline: <strong>0337 473 458</strong> (8:00 – 21:00, Thứ 2 – Chủ Nhật)</li>
          <li>Email: <strong>support@hamien.vn</strong></li>
          <li>Facebook: <strong>facebook.com/hamien.vn</strong></li>
          <li>Instagram: <strong>@hamien.official</strong></li>
        </ul>
      </div>
    `
  },

  /* ══════════════════════════════
     CHĂM SÓC KHÁCH HÀNG
     ══════════════════════════════ */
  'care': {
    title: 'Chăm Sóc Khách Hàng',
    body: `
      <div class="help-section">
        <h2 class="help-h2">Hướng Dẫn Đặt Hàng</h2>
        <ol class="help-ol">
          <li>Chọn sản phẩm yêu thích, chọn size và số lượng.</li>
          <li>Nhấn <strong>"Thêm vào giỏ hàng"</strong> rồi vào mục <strong>Giỏ Hàng</strong> để kiểm tra.</li>
          <li>Nhấn <strong>"Thanh Toán Ngay"</strong> và điền thông tin giao hàng.</li>
          <li>Chọn phương thức thanh toán phù hợp và xác nhận đơn hàng.</li>
          <li>Bạn sẽ nhận được email/SMS xác nhận đơn hàng trong vòng 5 phút.</li>
        </ol>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Hướng Dẫn Chọn Size</h2>
        <p>Để chọn được size phù hợp nhất, vui lòng đo các số đo cơ thể và đối chiếu với bảng size của từng sản phẩm:</p>
        <div class="help-table-wrap">
          <table class="help-table">
            <thead><tr><th>Size</th><th>Ngực (cm)</th><th>Eo (cm)</th><th>Hông (cm)</th><th>Chiều cao (cm)</th></tr></thead>
            <tbody>
              <tr><td>XS</td><td>76 – 80</td><td>60 – 64</td><td>84 – 88</td><td>150 – 155</td></tr>
              <tr><td>S</td><td>80 – 84</td><td>64 – 68</td><td>88 – 92</td><td>155 – 160</td></tr>
              <tr><td>M</td><td>84 – 88</td><td>68 – 72</td><td>92 – 96</td><td>158 – 163</td></tr>
              <tr><td>L</td><td>88 – 92</td><td>72 – 76</td><td>96 – 100</td><td>160 – 165</td></tr>
              <tr><td>XL</td><td>92 – 96</td><td>76 – 80</td><td>100 – 104</td><td>163 – 168</td></tr>
            </tbody>
          </table>
        </div>
        <p class="help-note">Nếu bạn nằm ở ngưỡng giữa 2 size, hãy chọn size lớn hơn để mặc thoải mái hơn.</p>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Phương Thức Vận Chuyển</h2>
        <ul class="help-list">
          <li><strong>Nội thành Hà Nội & TP.HCM:</strong> Giao hàng trong 1 – 2 ngày làm việc.</li>
          <li><strong>Các tỉnh thành khác:</strong> Giao hàng trong 3 – 5 ngày làm việc.</li>
          <li><strong>Miễn phí vận chuyển</strong> cho đơn hàng từ 500.000đ.</li>
          <li>Đơn hàng dưới 500.000đ: phí vận chuyển 30.000đ – 40.000đ tùy khu vực.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Phương Thức Thanh Toán</h2>
        <ul class="help-list">
          <li>Thanh toán khi nhận hàng (COD).</li>
          <li>Chuyển khoản ngân hàng.</li>
          <li>Ví điện tử: MoMo, ZaloPay, VNPay.</li>
          <li>Thẻ tín dụng / thẻ ghi nợ (Visa, Mastercard, JCB).</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Chương Trình Khách Hàng Thân Thiết</h2>
        <p>Tham gia chương trình thành viên HẠ MIÊN để nhận nhiều ưu đãi hấp dẫn:</p>
        <ul class="help-list">
          <li><strong>Hạng Bạc:</strong> Tích lũy từ 1.000.000đ — Giảm 5% mọi đơn hàng.</li>
          <li><strong>Hạng Vàng:</strong> Tích lũy từ 5.000.000đ — Giảm 10% + ưu tiên xem BST mới.</li>
          <li><strong>Hạng Kim Cương:</strong> Tích lũy từ 15.000.000đ — Giảm 15% + quà tặng sinh nhật.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Liên Hệ Hỗ Trợ</h2>
        <ul class="help-list">
          <li>Hotline: <strong>0337 473 458</strong> (8:00 – 21:00 hàng ngày)</li>
          <li>Email: <strong>support@hamien.vn</strong> — Phản hồi trong vòng 24 giờ</li>
          <li>Chat trực tiếp qua fanpage Facebook của HẠ MIÊN</li>
        </ul>
      </div>
    `
  },

  /* ══════════════════════════════
     CHÍNH SÁCH
     ══════════════════════════════ */
  'policy': {
    title: 'Chính Sách',
    body: `
      <div class="help-section">
        <h2 class="help-h2">Chính Sách Đổi & Trả Hàng</h2>
        <p>HẠ MIÊN hỗ trợ đổi/trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng với các điều kiện sau:</p>
        <ul class="help-list">
          <li>Sản phẩm chưa qua sử dụng, còn nguyên tem mác, không bị dơ bẩn hoặc hư hỏng.</li>
          <li>Hỗ trợ đổi size / đổi màu <strong>1 lần</strong> cho mỗi đơn hàng.</li>
          <li>Khi đổi, khách hàng chịu phí vận chuyển 2 chiều.</li>
          <li>Nếu sản phẩm bị lỗi do nhà sản xuất, HẠ MIÊN chịu toàn bộ phí vận chuyển.</li>
          <li>Sản phẩm sale, hàng tặng kèm không áp dụng chính sách đổi/trả.</li>
        </ul>
        <p class="help-note">HẠ MIÊN không hoàn tiền trực tiếp. Giá trị đổi trả sẽ được chuyển thành voucher mua hàng.</p>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Chính Sách Bảo Hành</h2>
        <ul class="help-list">
          <li>Bảo hành <strong>30 ngày</strong> đối với lỗi kỹ thuật từ nhà sản xuất (đứt chỉ, bung cúc, hỏng khóa kéo).</li>
          <li>Không áp dụng bảo hành cho các hư hỏng do sử dụng sai cách hoặc do giặt/ủi không đúng hướng dẫn.</li>
          <li>Liên hệ hotline hoặc đến trực tiếp cửa hàng để được hỗ trợ bảo hành.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Chính Sách Bảo Mật Thông Tin</h2>
        <ul class="help-list">
          <li>HẠ MIÊN cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng.</li>
          <li>Thông tin của bạn chỉ được sử dụng để xử lý đơn hàng và cải thiện trải nghiệm mua sắm.</li>
          <li>Chúng tôi không chia sẻ, bán hoặc trao đổi thông tin khách hàng với bên thứ ba vì mục đích thương mại.</li>
          <li>Bạn có quyền yêu cầu xóa thông tin cá nhân bất kỳ lúc nào bằng cách liên hệ với chúng tôi.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Chính Sách Khách Hàng Thân Thiết</h2>
        <ul class="help-list">
          <li>Mỗi <strong>10.000đ</strong> chi tiêu tích lũy được <strong>1 điểm</strong>.</li>
          <li><strong>100 điểm</strong> = giảm 10.000đ cho đơn hàng tiếp theo.</li>
          <li>Điểm có hiệu lực trong <strong>12 tháng</strong> kể từ ngày tích lũy.</li>
          <li>Điểm không áp dụng cho sản phẩm đang giảm giá hoặc combo ưu đãi.</li>
          <li>Đăng ký thành viên hoàn toàn miễn phí tại website hoặc tại cửa hàng.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Hướng Dẫn Bảo Quản Sản Phẩm</h2>
        <ul class="help-list">
          <li>Giặt tay hoặc giặt máy chế độ nhẹ với nước lạnh (dưới 30°C).</li>
          <li>Không dùng chất tẩy mạnh, không giặt chung với đồ màu đậm.</li>
          <li>Phơi trong bóng mát, tránh ánh nắng trực tiếp để giữ màu bền đẹp.</li>
          <li>Ủi ở nhiệt độ thấp (dưới 110°C) hoặc ủi mặt trái vải.</li>
          <li>Bảo quản nơi thoáng mát, tránh ẩm mốc.</li>
        </ul>
      </div>

      <div class="help-section">
        <h2 class="help-h2">Các Câu Hỏi Thường Gặp</h2>
        <div class="help-faq">
          <div class="faq-item">
            <div class="faq-q">Tôi có thể đổi size sau khi đặt hàng không?</div>
            <div class="faq-a">Có, bạn có thể đổi size trong vòng 7 ngày sau khi nhận hàng, miễn là sản phẩm chưa qua sử dụng và còn nguyên tem mác.</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Đơn hàng của tôi mất bao lâu để giao?</div>
            <div class="faq-a">Nội thành Hà Nội & TP.HCM: 1–2 ngày. Tỉnh thành khác: 3–5 ngày làm việc.</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Tôi muốn hủy đơn hàng thì làm thế nào?</div>
            <div class="faq-a">Liên hệ hotline <strong>0337 473 458</strong> trong vòng 2 giờ sau khi đặt hàng để được hỗ trợ hủy. Sau khi hàng đã được giao cho đơn vị vận chuyển, chúng tôi không thể hủy đơn.</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Sản phẩm có giống hình ảnh trên website không?</div>
            <div class="faq-a">HẠ MIÊN cam kết hình ảnh trên website phản ánh trung thực nhất màu sắc và kiểu dáng sản phẩm. Màu sắc thực tế có thể chênh lệch nhẹ do điều kiện ánh sáng và thiết bị hiển thị.</div>
          </div>
        </div>
      </div>
    `
  }
};

function openHelp(key) {
  showPage('help');

  const data = helpContent[key];
  if(data) {
    document.getElementById('help-title').textContent = data.title;
    document.getElementById('help-body').innerHTML = data.body;
    document.getElementById('help-bc').textContent = data.title;
  }

  // Active trạng thái ở menu sidebar
  document.querySelectorAll('.help-link').forEach(link => link.classList.remove('active'));
  const activeLink = document.getElementById('link-' + key);
  if(activeLink) activeLink.classList.add('active');
}

showPage = function(page) {
  // Bổ sung 'page-checkout' vào mảng
  const pages = ['page-home','page-danhmuc','page-wishlist','page-cart', 'page-bosuutap', 'page-help', 'page-checkout'];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById('page-' + page);
  if (target) target.style.display = 'block';

  ['nav-home','nav-danhmuc', 'nav-bosuutap', 'nav-help', 'nav-checkout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('nav-active');
  });
  
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('nav-active');

  if (page === 'wishlist') renderWishlist();
  if (page === 'cart')     renderCart();
  if (page === 'checkout') renderCheckout(); // Kích hoạt nạp dữ liệu thanh toán
  if (page === 'bosuutap') closeCollection();
  if (page === 'danhmuc')  filterCategory('ao', 'Áo');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const categoryData = {
  'ao': [
    { name: "Áo kiểu nữ họa tiết hoa cổ V phối nơ", price: "350.000đ", code: "RR26AK46", img: "web_img/San_Pham_Ban_Chay/ao/ao-nu.webp" },
    { name: "Áo sơ mi lụa tơ phối ren cao cấp", price: "480.000đ", code: "RR26AS09", img: "web_img/San_Pham_Ban_Chay/ao/ao-kieu-nu-org.webp" }
  ],
  'dam': [
    { name: "Đầm hồng xô thêu dáng xòe tiểu thư", price: "700.000đ", code: "RR26QN09", img: "web_img/San_Pham_Ban_Chay/dam_hong/dam-hong-xo-theu-dang-xoe-phoi-dang-ten-kk188-07.webp" },
    { name: "Đầm trắng hoa nhí dáng xòe dài viền ren", price: "800.000đ", code: "RR26AK45", img: "web_img/San_Pham_Ban_Chay/dam_trang/dam-trang-hoa-nhi-dang-xoe-dai-vien-ren-hl34-27.webp" },
    { name: "Đầm tơ in hoa dáng xòe phối nút tinh tế", price: "600.000đ", code: "RR26VN01", img: "web_img/San_Pham_Moi/dam-to-in-hoa-dang-xoe-phoi-nut-hl34-25.webp" }
  ],
  'chanvay': [
    { name: "Chân váy dáng xòe linen thêu hoa", price: "460.000đ", code: "RR26QN11", img: "web_img/San_Pham_Ban_Chay/chan_vay/chan-vay-dang-xoe-linen-theu-cv11-39.webp" },
    { name: "Chân váy tơ màu xanh dáng xòe dài thướt tha", price: "380.000đ", code: "RR26SQ11", img: "web_img/San_Pham_Moi/chan-vay-to-mau-xanh-dang-xoe-dai-cv10-38.webp" }
  ],
  'quan': [
    { name: "Quần Ngắn Nữ Gami Shorts Năng Động", price: "580.000đ", code: "RR26QN15", img: "web_img/San_Pham_Ban_Chay/chan_vay/chan_vay_org.webp" }
  ]
};

function filterCategory(key, name) {
  // Thay đổi tiêu đề và trạng thái CSS
  const titleEl = document.getElementById('dm-category-title');
  if (titleEl) titleEl.textContent = name;

  document.querySelectorAll('.dm-sidebar .dm-cat-parent').forEach(el => el.classList.remove('active'));
  const activeSidebarItem = document.getElementById('cat-' + key);
  if (activeSidebarItem) activeSidebarItem.classList.add('active');

  const gridEl = document.getElementById('dm-products-grid');
  if (!gridEl) return;

  // Gọi đến API số 1 với tham số category_id tương ứng
  fetch(`https://Nguyenhai.pythonanywhere.com/api/products?category=${key}`)
    .then(response => response.json())
    .then(products => {
      // 1. Lưu dữ liệu thô vào biến toàn cục
        currentCategoryProducts = products; 
        
        // 2. Reset ô Dropdown về trạng thái Mặc định mỗi khi chuyển danh mục
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'default';
        
        // 3. Gọi hàm vẽ giao diện
        renderCategoryGrid(currentCategoryProducts);
    })
    .catch(err => console.error("Lỗi kết nối:", err));
}

// Biến toàn cục để lưu trữ mảng sản phẩm hiện tại của danh mục
let currentCategoryProducts = [];

// Hàm 1: Tiền xử lý dữ liệu - Xóa dấu chấm và chữ 'đ' để ép kiểu về số nguyên
function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/\./g, '').replace('đ', ''), 10);
}

// Hàm 2: Hàm thực thi sắp xếp khi người dùng chọn Dropdown
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    
    // Tạo một bản sao của mảng dữ liệu để không làm xáo trộn mảng gốc
    let sortedProducts = [...currentCategoryProducts];

    if (sortValue === 'asc') {
        // Tăng dần
        sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortValue === 'desc') {
        // Giảm dần
        sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    // Đưa mảng đã sắp xếp vào hàm vẽ giao diện
    renderCategoryGrid(sortedProducts);
}

// Hàm 3: Hàm vẽ giao diện (Tách ra từ đoạn code cũ của bạn để tái sử dụng)
function renderCategoryGrid(productsList) {
    const gridEl = document.getElementById('dm-products-grid');
    if (!gridEl) return;

    if (productsList.length === 0) {
        gridEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--gray); padding: 60px 0;">Hiện tại mục này đang được cập nhật sản phẩm mới.</div>`;
        return;
    }

    gridEl.innerHTML = productsList.map(p => {
        // Lấy tất cả ảnh có sẵn
        const safeData = JSON.stringify({
            name: p.name, price: p.price, code: p.code, imgs: [p.image_url_1, p.image_url_2].filter(url => url) 
        }).replace(/'/g, "&apos;");

        return `
          <div class="dm-card" onclick='openProduct(${safeData})'>
            <div class="dm-thumb">
              <div class="img-box" style="height:100%">
                <img src="${p.image_url_1}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;"/>
              </div>
            </div>
            <div class="dm-info">
              <h4>${p.name}</h4>
              <div class="dm-price">${p.price}</div>
            </div>
          </div>
        `;
    }).join('');
}
function renderCheckout() {
  const list = document.getElementById('checkout-items-list');
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = '<p style="font-size:13px; color:var(--gray); margin-bottom: 20px;">Chưa có sản phẩm nào để thanh toán.</p>';
    document.getElementById('checkout-subtotal').textContent = '0đ';
    document.getElementById('checkout-ship').textContent = '0đ';
    document.getElementById('checkout-total').textContent = '0đ';
    return;
  }

  // Đổ dữ liệu từ Giỏ Hàng sang Thanh toán (Bao gồm cả Ảnh)
  list.innerHTML = cartItems.map(item => {
    const unitPrice  = parsePrice(item.price);
    const totalPrice = unitPrice * item.qty;
    
    const imgSrc = (item.imgs && item.imgs[0]) ? item.imgs[0] : (item.imgFallback || '');
    const imgHtml = imgSrc 
      ? `<img src="${imgSrc}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;"/>`
      : `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;

    return `
      <div class="checkout-item">
        <div class="checkout-item-img">
          <div class="img-box" style="height:100%; padding:0; border:1px solid var(--border); border-radius:4px; overflow:hidden;">
            ${imgHtml}
          </div>
          <div class="checkout-item-qty">${item.qty}</div>
        </div>
        <div class="checkout-item-info">
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-meta">Size: ${item.size}</div>
        </div>
        <div class="checkout-item-price">${formatPrice(totalPrice)}</div>
      </div>
    `;
  }).join('');

  // Tính lại tổng tiền
  const subtotal = cartItems.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const shipNum  = subtotal >= 500000 ? 0 : 30000;
  const ship     = shipNum === 0 ? 'Miễn phí' : formatPrice(shipNum);
  const total    = subtotal + shipNum;

  document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkout-ship').textContent     = ship;
  document.getElementById('checkout-total').textContent    = formatPrice(total);
}

function placeOrder() {
  if (cartItems.length === 0) {
    showToast('Giỏ hàng trống!', 'info');
    return;
  }
  
  // Xác thực Form
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const address = document.getElementById('co-address').value.trim();

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ!', 'info');
    return;
  }

  // Nếu hoàn thành -> Báo thành công, xóa giỏ hàng và về trang chủ
  showToast('ĐẶT HÀNG THÀNH CÔNG! HẠ MIÊN sẽ liên hệ sớm nhất.', 'success');
  
  cartItems = [];
  updateBadges();
  renderCart();
  
  setTimeout(() => {
    showPage('home');
  }, 2000);
}