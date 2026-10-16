// NIGAR CREATION - WEBSITE SCRIPT

const products = [
  {
    id: 1,
    name: "Single Piece Scrunchie",
    category: "Scrunchies",
    price: 49,
    image: "images/Scrunchies single piece.jpeg"
  },
  {
    id: 2,
    name: "Scrunchie + Bow Combo",
    category: "Gift Sets",
    price: 79,
    image: "images/WhatsApp Image 2026-10-16 at 7.59.57 PM.jpeg"
  },
  {
    id: 3,
    name: "Ribbon Bow",
    category: "Bows",
    price: 49,
    image: "images/Ribbon bow single layer.jpeg"
  },
  {
    id: 4,
    name: "Scrunchies Set of 5",
    category: "Gift Sets",
    price: 199,
    image: "images/Scrunchies set of 5.jpeg"
  },
  {
    id: 5,
    name: "Satin Pearl Three-Layer Hair Bow",
    category: "Bows",
    price: 99,
    image: "images/Satin pearl three layer.jpeg"
  }
];

let cart = [];
let activeCategory = "All";

const grid = document.getElementById("productGrid");

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// DISPLAY PRODUCTS
function renderProducts() {
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  let list = products.filter(product => {
    const categoryMatch =
      activeCategory === "All" ||
      product.category === activeCategory ||
      (activeCategory === "Scrunchies" &&
        product.name.toLowerCase().includes("scrunchie")) ||
      (activeCategory === "Bows" &&
        product.name.toLowerCase().includes("bow"));

    const searchMatch =
      product.name.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  if (sortSelect && sortSelect.value === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sortSelect && sortSelect.value === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (list.length === 0) {
    grid.innerHTML =
      '<p style="padding:20px;">No products found.</p>';
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/400x400/fff1f5/292329?text=Nigar+Creation';"
      >

      <h3>${product.name}</h3>

      <p class="price">${money(product.price)}</p>

      <button
        type="button"
        onclick="addToCart(${product.id})"
      >
        ADD TO BAG
      </button>
    </article>
  `).join("");
}

// ADD PRODUCT TO CART
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: id,
      qty: 1
    });
  }

  renderCart();
  showToast("Added to your bag!");
}

// CHANGE QUANTITY
function changeQty(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

// REMOVE PRODUCT
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

// DISPLAY CART
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const cartCount = document.getElementById("cartCount");
  const drawerCount = document.getElementById("drawerCount");
  const subtotalElement = document.getElementById("subtotal");
  const cartItems = document.getElementById("cartItems");
  const checkoutButton = document.getElementById("checkoutButton");

  if (cartCount) cartCount.textContent = count;
  if (drawerCount) drawerCount.textContent = (${count});
  if (subtotalElement) subtotalElement.textContent = money(subtotal);

  if (checkoutButton) {
    checkoutButton.disabled = count === 0;
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="empty-cart">Your bag is waiting for something lovely. ♡</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-item">
        <img
          src="${product.image}"
          alt="${product.name}"
          style="width:60px;height:60px;object-fit:contain;"
        >

        <div>
          <h4>${product.name}</h4>
          <p>${money(product.price)} each</p>

          <button type="button"
            onclick="changeQty(${product.id}, -1)">−</button>

          <span>${item.qty}</span>

          <button type="button"
            onclick="changeQty(${product.id}, 1)">+</button>
        </div>

        <div>
          <strong>${money(product.price * item.qty)}</strong>
          <button type="button"
            onclick="removeItem(${product.id})">×</button>
        </div>
      </div>
    `;
  }).join("");
}

// OPEN AND CLOSE CART
function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");

  if (drawer) drawer.classList.add("open");
  if (overlay) {
    overlay.classList.add("active");
    overlay.classList.add("show");
  }
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");

  if (drawer) drawer.classList.remove("open");

  if (overlay) {
    overlay.classList.remove("active");
    overlay.classList.remove("show");
  }
}

// NOTIFICATION
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// CATEGORY BUTTONS
document.querySelectorAll("#categoryTabs button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#categoryTabs button").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    activeCategory = button.dataset.category || "All";

    renderProducts();
  });
});

// SEARCH
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

// SORT
const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", renderProducts);
}

// HEADER BUTTONS
const cartToggle = document.getElementById("cartToggle");
if (cartToggle) cartToggle.addEventListener("click", openCart);

const closeCartButton = document.getElementById("closeCart");
if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCart);
}

const overlay = document.getElementById("overlay");
if (overlay) overlay.addEventListener("click", closeCart);

// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    mainNav.classList.toggle("show");
  });
}

// SEARCH BUTTON
const searchToggle = document.getElementById("searchToggle");

if (searchToggle && searchInput) {
  searchToggle.addEventListener("click", () => {
    searchInput.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    searchInput.focus();
  });
}

// CHECKOUT PREVIEW
const checkoutButton = document.getElementById("checkoutButton");
const checkoutDialog = document.getElementById("checkoutDialog");

if (checkoutButton && checkoutDialog) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length > 0) {
      closeCart();
      checkoutDialog.showModal();
    }
  });
}

// ORDER FORM
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(checkoutForm);
    const message = document.getElementById("checkoutMessage");

    if (message) {
      message.textContent =
        "Order preview ready for " +
        formData.get("name") +
        ". This is a demo only; your order has not been submitted.";
    }
  });
}

// CURRENT YEAR
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// INITIALIZE WEBSITE
renderProducts();
renderCart();
