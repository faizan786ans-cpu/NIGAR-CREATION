"use strict";

document.addEventListener("DOMContentLoaded", function () {

  // NIGAR CREATION PRODUCT CATALOGUE
  // Demo prices hain; publish karne se pehle apni actual prices update karna.

  const products = [
    {
      id: 1,
      name: "Classic Satin Scrunchies",
      category: "Satin",
      price: 99,
      oldPrice: 149,
      color: "#d78aa5",
      bg: "#f8e4ec",
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Blush Pink Scrunchie",
      category: "Satin",
      price: 49,
      oldPrice: 69,
      color: "#e9a6bd",
      bg: "#fff0f5",
      badge: "POPULAR"
    },
    {
      id: 3,
      name: "Elegant Black Scrunchie",
      category: "Satin",
      price: 49,
      oldPrice: 69,
      color: "#393039",
      bg: "#eee8ec",
      badge: ""
    },
    {
      id: 4,
      name: "Rose Bow Scrunchie",
      category: "Bow",
      price: 79,
      oldPrice: 119,
      color: "#c96e91",
      bg: "#f9e4ec",
      badge: "NEW"
    },
    {
      id: 5,
      name: "Pastel Satin Combo",
      category: "Combo",
      price: 149,
      oldPrice: 199,
      color: "#d7a0b4",
      bg: "#f6e8ed",
      badge: "VALUE PACK"
    },
    {
      id: 6,
      name: "Lavender Dream Scrunchie",
      category: "Satin",
      price: 49,
      oldPrice: 69,
      color: "#a998d2",
      bg: "#eee9fa",
      badge: ""
    },
    {
      id: 7,
      name: "Peach Satin Scrunchie",
      category: "Satin",
      price: 49,
      oldPrice: 69,
      color: "#e9a17e",
      bg: "#fff0e6",
      badge: ""
    },
    {
      id: 8,
      name: "Pretty Bow Combo",
      category: "Combo",
      price: 199,
      oldPrice: 249,
      color: "#bc7893",
      bg: "#f6e7ed",
      badge: "COMBO"
    }
  ];

  const $ = id => document.getElementById(id);

  const productGrid = $("productGrid");

  if (!productGrid) {
    console.error(
      "Nigar Creation: productGrid nahi mila. index.html mein id='productGrid' check karein."
    );
    return;
  }

  let activeCategory = "All";
  let searchTerm = "";
  let cart = [];

  try {
    const savedCart = JSON.parse(localStorage.getItem("nigarCart") || "[]");
    if (Array.isArray(savedCart)) {
      cart = savedCart.filter(item =>
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    }
  } catch (error) {
    cart = [];
  }

  function renderProducts() {
    let filtered = products.filter(product => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    const sortSelect = $("sortSelect");

    if (sortSelect && sortSelect.value === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortSelect && sortSelect.value === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (!filtered.length) {
      productGrid.innerHTML =
        '<div class="empty-products">No products found. Try another search. ♡</div>';
      return;
    }

    productGrid.innerHTML = filtered.map(product => `
      <article class="product-card">
        <div class="product-image"
             style="--product-color:${product.color};--product-bg:${product.bg}">
          ${product.badge
            ? <span class="product-badge">${product.badge}</span>
            : ""}
          <div class="product-art" aria-label="${product.name} illustration"></div>
        </div>

        <div class="product-info">
          <p class="product-category">${product.category} Collection</p>
          <h3 class="product-title">${product.name}</h3>

          <div class="product-price">
            <span class="current-price">₹${product.price}</span>
            <span class="old-price">₹${product.oldPrice}</span>
          </div>

          <button class="add-to-cart" data-add="${product.id}">
            ADD TO BAG +
          </button>
        </div>
      </article>
    `).join("");
  }

  function saveCart() {
    try {
      localStorage.setItem("nigarCart", JSON.stringify(cart));
    } catch (error) {
      console.warn("Cart browser mein save nahi ho saka.");
    }
  }

  function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    if ($("cartCount")) $("cartCount").textContent = count;
    if ($("drawerCount")) $("drawerCount").textContent = count;

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    if ($("subtotal")) {
      $("subtotal").textContent = "₹" + total;
    }

    const cartItems = $("cartItems");

    if (cartItems) {
      if (!cart.length) {
        cartItems.innerHTML =
          '<p class="empty-cart">Your bag is waiting for something lovely. ♡</p>';
      } else {
        cartItems.innerHTML = cart.map(item => {
          const product = products.find(p => p.id === item.id);
          if (!product) return "";

          return `
            <div class="cart-item">
              <div>
                <h4>${product.name}</h4>
                <p>₹${product.price} × ${item.quantity}</p>

                <div class="quantity-controls">
                  <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
                  <span>${item.quantity}</span>
                  <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
                </div>
              </div>

              <button class="remove-item" data-remove="${product.id}">
                Remove
              </button>
            </div>
          `;
        }).join("");
      }
    }

    saveCart();
  }

  function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id: id, quantity: 1 });
    }

    updateCart();
    openCart();
  }

  function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }

    updateCart();
  }

  function openCart() {
    if ($("cartDrawer")) $("cartDrawer").classList.add("open");
    if ($("overlay")) $("overlay").classList.add("visible");
  }

  function closeCart() {
    if ($("cartDrawer")) $("cartDrawer").classList.remove("open");
    if ($("overlay")) $("overlay").classList.remove("visible");
  }

  function openCheckout() {
    if (!cart.length) {
      alert("Your shopping bag is empty. Please add a product first.");
      return;
    }

    const dialog = $("checkoutDialog");

    if (dialog && typeof dialog.showModal === "function") {
      closeCart();
      dialog.showModal();
    } else {
      sendWhatsAppOrder();
    }
  }

  function sendWhatsAppOrder() {
    if (!cart.length) {
      alert("Please add a product to your bag first.");
      return;
    }

    const name = $("customerName")?.value.trim() || "";
    const phone = $("customerPhone")?.value.trim() || "";
    const address = $("customerAddress")?.value.trim() || "";

    if (!name || !phone || !address) {
      alert("Please enter your name, phone number and delivery address.");
      return;
    }

    let message = "Hello Nigar Creation! I want to place an order.\n\n";
    message += "Name: " + name + "\n";
    message += "Phone: " + phone + "\n";
    message += "Address: " + address + "\n\n";
    message += "Order details:\n";

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);

      if (product) {
        message += product.name +
          " × " + item.quantity +
          " = ₹" + (product.price * item.quantity) + "\n";
      }
    });

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    message += "\nSubtotal: ₹" + total;
    message += "\nPlease confirm availability and delivery charges.";

    window.open(
      "https://wa.me/919153391672?text=" + encodeURIComponent(message),
      "_blank"
    );
  }

  // Product buttons
  productGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(Number(button.dataset.add));
  });

  // Cart quantity and removal buttons
  if ($("cartItems")) {
    $("cartItems").addEventListener("click", function (event) {
      const plus = event.target.closest("[data-plus]");
      const minus = event.target.closest("[data-minus]");
      const remove = event.target.closest("[data-remove]");

      if (plus) changeQuantity(Number(plus.dataset.plus), 1);
      if (minus) changeQuantity(Number(minus.dataset.minus), -1);

      if (remove) {
        cart = cart.filter(item => item.id !== Number(remove.dataset.remove));
        updateCart();
      }
    });
  }

  // Search
  if ($("searchInput")) {
    $("searchInput").addEventListener("input", function (event) {
      searchTerm = event.target.value.trim();
      renderProducts();
    });
  }

  // Sorting
  if ($("sortSelect")) {
    $("sortSelect").addEventListener("change", renderProducts);
  }

  // Categories
  if ($("categoryTabs")) {
    $("categoryTabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      activeCategory = button.dataset.category;

      document.querySelectorAll(".filter-button").forEach(tab => {
        tab.classList.toggle("active", tab === button);
      });

      renderProducts();
    });
  }

  // Category cards
  document.querySelectorAll(".category-card[data-category]").forEach(card => {
    card.addEventListener("click", function () {
      activeCategory = card.dataset.category;

      document.querySelectorAll(".filter-button").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.category === activeCategory);
      });

      renderProducts();
    });
  });

  // Search toggle
  if ($("searchToggle")) {
    $("searchToggle").addEventListener("click", function () {
      if ($("searchBox")) {
        $("searchBox").classList.toggle("open");
        if ($("searchBox").classList.contains("open") && $("searchInput")) {
          $("searchInput").focus();
        }
      }
    });
  }

  // Mobile menu
  if ($("menuToggle") && $("mainNav")) {
    $("menuToggle").addEventListener("click", function () {
      $("mainNav").classList.toggle("open");
    });

    $("mainNav").querySelectorAll("a").forEach(link => {
      link.addEventListener("click", function () {
        $("mainNav").classList.remove("open");
      });
    });
  }

  // Cart drawer
  if ($("cartToggle")) {
    $("cartToggle").addEventListener("click", openCart);
  }

  if ($("closeCart")) {
    $("closeCart").addEventListener("click", closeCart);
  }

  if ($("continueShopping")) {
    $("continueShopping").addEventListener("click", closeCart);
  }

  if ($("overlay")) {
    $("overlay").addEventListener("click", closeCart);
  }

  // Checkout
  if ($("checkoutButton")) {
    $("checkoutButton").addEventListener("click", openCheckout);
  }

  if ($("closeCheckout") && $("checkoutDialog")) {
    $("closeCheckout").addEventListener("click", function () {
      $("checkoutDialog").close();
    });
  }

  if ($("checkoutForm")) {
    $("checkoutForm").addEventListener("submit", function (event) {
      event.preventDefault();
      sendWhatsAppOrder();
    });
  }

  // Footer year
  if ($("year")) {
    $("year").textContent = new Date().getFullYear();
  }

  // Initial render
  renderProducts();
  updateCart();

  console.log("Nigar Creation: products successfully loaded.");
});
