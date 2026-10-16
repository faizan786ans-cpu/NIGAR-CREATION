const products = [
  {
    id: 1,
    name: "Scrunchies Single Piece",
    price: 49,
    image: "images/Scrunchies single piece.jpeg"
  },
  {
    id: 2,
    name: "Scrunchie + Bow Combo",
    price: 79,
    image: "images/WhatsApp Image 2026-10-16 at 7.59.57 PM.jpeg"
  },
  {
    id: 3,
    name: "Ribbon Bow Single Layer",
    price: 49,
    image: "images/Ribbon bow single layer.jpeg"
  },
  {
    id: 4,
    name: "Scrunchies Set of 5",
    price: 199,
    image: "images/Scrunchies set of 5.jpeg"
  },
  {
    id: 5,
    name: "Satin Pearl Three Layer Hair Bow",
    price: 99,
    image: "images/Satin pearl three layer.jpeg"
  }
];

let cart = JSON.parse(localStorage.getItem("nigarCart") || "[]");

function saveCart() {
  localStorage.setItem("nigarCart", JSON.stringify(cart));
}

function renderProducts() {
  document.getElementById("product-list").innerHTML = products.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}"
        onerror="this.onerror=null;this.src='https://placehold.co/500x500/fff4f6/a83f62?text=Nigar+Creation'">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-price">₹${p.price}</p>
        <button class="add-button" onclick="addToCart(${p.id})">ADD TO CART</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const p = products.find(item => item.id === id);
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...p, quantity: 1 });
  }

  saveCart();
  renderCart();

  document.getElementById("cart-panel").classList.add("active");
  document.getElementById("cart-overlay").classList.add("active");
}

function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent = ₹${total};
  document.getElementById("total").textContent = ₹${total};
  document.getElementById("checkout-total").textContent = ₹${total};
  document.getElementById("shipping").textContent =
    total ? "Calculated before payment" : "₹0";

  document.getElementById("cart-items").innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price * item.quantity}</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${item.id},-1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id},1)">+</button>
            <button class="remove-button" onclick="removeItem(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join("")
    : "<p>Your cart is empty. Add a product!</p>";
}

function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("active");
  document.getElementById("cart-overlay").classList.toggle("active");
}

function goToCheckout() {
  if (!cart.length) {
    alert("Please add a product first.");
    return;
  }

  document.getElementById("cart-panel").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");

  const checkout = document.getElementById("checkout");
  checkout.classList.add("visible");
  document.getElementById("checkout-total").textContent = ₹${getTotal()};
  checkout.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("checkout-form").addEventListener("submit", function(e) {
  e.preventDefault();

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  alert(
    "Order total: ₹" + getTotal() +
    "\nOnline payment is not connected yet. Razorpay setup is the next step."
  );
});

renderProducts();
renderCart();
