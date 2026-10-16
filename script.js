// ========================================
// NIGAR CREATION - COMPLETE STORE SCRIPT
// Compatible with your existing index.html
// ========================================

const WHATSAPP_NUMBER = "919153391672";

const products = [
  {
    id: 1,
    name: "Blush Satin Scrunchie",
    category: "Scrunchies",
    price: 99,
    oldPrice: 149,
    color: "#e8a0b4",
    label: "BESTSELLER"
  },
  {
    id: 2,
    name: "Midnight Black Scrunchie",
    category: "Scrunchies",
    price: 99,
    oldPrice: 149,
    color: "#29262c",
    label: "EVERYDAY"
  },
  {
    id: 3,
    name: "Lavender Dream Scrunchie",
    category: "Scrunchies",
    price: 119,
    oldPrice: 169,
    color: "#b5a0d7",
    label: "NEW"
  },
  {
    id: 4,
    name: "Sage Green Scrunchie",
    category: "Scrunchies",
    price: 109,
    oldPrice: 159,
    color: "#a3b9a2",
    label: ""
  },
  {
    id: 5,
    name: "Rose Garden Bow",
    category: "Bows",
    price: 129,
    oldPrice: 179,
    color: "#d9809b",
    label: "TRENDING",
    bow: true
  },
  {
    id: 6,
    name: "Classic Black Bow",
    category: "Bows",
    price: 129,
    oldPrice: 179,
    color: "#29262c",
    label: "",
    bow: true
  },
  {
    id: 7,
    name: "Pastel Party Set of 3",
    category: "Gift Sets",
    price: 249,
    oldPrice: 349,
    color: "#efc2cf",
    label: "SAVE MORE",
    set: true
  },
  {
    id: 8,
    name: "Soft Neutrals Gift Set",
    category: "Gift Sets",
    price: 299,
    oldPrice: 399,
    color: "#c8b4a2",
    label: "GIFT PICK",
    set: true
  }
];

let cart = [];
let activeCategory = "All";

const $ = id => document.getElementById(id);

const grid = $("productGrid");

const rupees = amount =>
  "₹" + Number(amount).toLocaleString("en
    category: "Scrunchies",
    price: 149,
    oldPrice: 199,
    image: "WhatsApp Image 2026-10-07 at 12.13.07 PM.jpeg",
    description: "Stylish and gentle satin scrunchies."
  },
  {
    id: 3,
    name: "Elegant Hair Accessories",
    category: "Accessories",
    price: 129,
    oldPrice: 179,
    image: "WhatsApp Image 2026-10-07 at 12.13.07 PM.jpeg",
    description: "Beautiful accessories for your daily look."
  },
  {
    id: 4,
    name: "Gift Set - Scrunchies",
    category: "Gifts",
    price: 199,
    oldPrice: 249,
    image: "WhatsApp Image 2026-10-07 at 12.13.07 PM.jpeg",
    description: "A lovely gift for someone special."
  }
];

let cart = JSON.parse(localStorage.getItem("nigarCart") || "[]");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

function saveCart() {
  localStorage.setItem("nigarCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  $$("#cart-count, .cart-count, [data-cart-count]").forEach((element) => {
    element.textContent = count;
  });
}

function findProduct(id) {
  return products.find((product) => product.id === Number(id));
}

function addToCart(id) {
  const product = findProduct(id);

  if (!product) return;

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showMessage(product.name + " added to your cart!");
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== Number(id));
  saveCart();
  renderCart();
}

function changeQuantity(id, change) {
  const item = cart.find((product) => product.id === Number(id));

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function renderCart() {
  const containers = [
    $("#cart-items"),
    $("#cartItems"),
    $(".cart-items")
  ].filter(Boolean);

  const html = cart.length
    ? cart.map((item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${escapeHTML(item.name)}</strong>
            <p>${formatPrice(item.price)} × ${item.quantity}</p>
          </div>

          <div class="cart-item-actions">
            <button type="button"
              onclick="changeQuantity(${item.id}, -1)">−</button>

            <span>${item.quantity}</span>

            <button type="button"
              onclick="changeQuantity(${item.id}, 1)">+</button>

            <button type="button"
              onclick="removeFromCart(${item.id})"
              aria-label="Remove item">✕</button>
          </div>
        </div>
      `).join("")
    : '<p class="empty-cart">Your cart is empty. Start shopping!</p>';

  containers.forEach((container) => {
    container.innerHTML = html;
  });

  const total = formatPrice(getCartTotal());

  ["#cart-total", "#cartTotal", ".cart-total"].forEach((selector) => {
    $$(selector).forEach((element) => {
      element.textContent = total;
    });
  });

  updateCartCount();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function renderProducts(list = products) {
  const container =
    $("#product-grid") ||
    $("#products-grid") ||
    $("#products") ||
    $(".product-grid");

  if (!container) return;

  container.innerHTML = list.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          class="product-image"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="product-badge">Popular</span>
      </div>

      <div class="product-details">
        <p class="product-category">${escapeHTML(product.category)}</p>
        <h3>${escapeHTML(product.name)}</h3>
        <p class="product-description">${escapeHTML(product.description)}</p>

        <div class="product-pricing">
          <strong>${formatPrice(product.price)}</strong>
          <del>${formatPrice(product.oldPrice)}</del>
        </div>

        <button
          class="add-to-cart-btn"
          type="button"
          onclick="addToCart(${product.id})">
          Add to Cart
        </button>

        <button
          class="buy-now-btn"
          type="button"
          onclick="buyNow(${product.id})">
          Order on WhatsApp
        </button>
      </div>
    </article>
  `).join("");
}

function buyNow(id) {
  const product = findProduct(id);

  if (!product) return;

  const message =
    Hello ${STORE_NAME}!\n\n +
    I want to order:\n${product.name}\n +
    Price: ${formatPrice(product.price)}\n\n +
    Please share the ordering and delivery details.;

  openWhatsApp(message);
}

function checkoutWhatsApp() {
  if (!cart.length) {
    showMessage("Your cart is empty!");
    return;
  }

  const orderLines = cart.map((item) =>
    ${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}
  );

  const message =
    Hello ${STORE_NAME}!\n\n +
    I would like to place an order:\n\n +
    orderLines.join("\n") +
    \n\nTotal: ${formatPrice(getCartTotal())} +
    \n\nPlease confirm availability, delivery charges and payment details.;

  openWhatsApp(message);
}

function openWhatsApp(message) {
  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

function showMessage(message) {
  let toast = $("#store-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "store-toast";
    toast.style.cssText = `
      position:fixed;
      bottom:24px;
      left:50%;
      transform:translateX(-50%);
      background:#242124;
      color:white;
      padding:13px 20px;
      border-radius:10px;
      z-index:99999;
      box-shadow:0 5px 20px rgba(0,0,0,.2);
      max-width:90%;
      text-align:center;
      font-size:14px;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.nigarToastTimer);

  window.nigarToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

function searchProducts(query) {
  const term = query.trim().toLowerCase();

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );

  renderProducts(filtered);
}

function sortProducts(sortType) {
  let list = [...products];

  if (sortType === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortType === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts(list);
}

function filterProducts(category) {
  if (!category || category === "all") {
    renderProducts(products);
    return;
  }

  renderProducts(
    products.filter((product) =>
      product.category.toLowerCase() === category.toLowerCase()
    )
  );
}

function setupStoreEvents() {
  $$("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.addToCart);
    });
  });

  const searchInput =
    $("#product-search") ||
    $("#searchInput") ||
    $(".search-input");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchProducts(event.target.value);
    });
  }

  const sortSelect = $("#sort-products") || $("#sortProducts");

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      sortProducts(event.target.value);
    });
  }

  $$("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      filterProducts(button.dataset.category);
    });
  });

  const checkoutButton =
    $("#checkout-button") ||
    $("#checkoutBtn") ||
    $(".checkout-button");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", checkoutWhatsApp);
  }

  $$("[data-open-cart], #cart-button, #cartButton").forEach((button) => {
    button.addEventListener("click", () => {
      const cartSection = $("#cart-section") || $("#cartSection");

      if (cartSection) {
        cartSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        showMessage("Add products to your cart, then use checkout.");
      }
    });
  });

  $$("[data-whatsapp]").forEach((button) => {
    button.addEventListener("click", () => {
      openWhatsApp("Hello Nigar Creation! I would like to know more about your products.");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  setupStoreEvents();
  updateCartCount();
});
