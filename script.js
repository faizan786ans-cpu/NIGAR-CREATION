const products = [
  {id:1,name:"Blush Satin Scrunchie",category:"Scrunchies",price:99,oldPrice:149,color:"#e8a0b4",label:"BESTSELLER"},
  {id:2,name:"Midnight Black Scrunchie",category:"Scrunchies",price:99,oldPrice:149,color:"#29262c",label:"EVERYDAY"},
  {id:3,name:"Lavender Dream Scrunchie",category:"Scrunchies",price:119,oldPrice:169,color:"#b5a0d7",label:"NEW"},
  {id:4,name:"Sage Green Scrunchie",category:"Scrunchies",price:109,oldPrice:159,color:"#a3b9a2",label:""},
  {id:5,name:"Rose Garden Bow",category:"Bows",price:129,oldPrice:179,color:"#d9809b",label:"TRENDING",bow:true},
  {id:6,name:"Classic Black Bow",category:"Bows",price:129,oldPrice:179,color:"#29262c",label:""},
  {id:7,name:"Pastel Party Set of 3",category:"Gift Sets",price:249,oldPrice:349,color:"#efc2cf",label:"SAVE MORE",set:true},
  {id:8,name:"Soft Neutrals Gift Set",category:"Gift Sets",price:299,oldPrice:399,color:"#c8b4a2",label:"GIFT PICK",set:true}
];
let cart = [];
let activeCategory = "All";
const grid = document.getElementById("productGrid");
const rupees = n => "₹" + n.toLocaleString("en-IN");

function productVisual(p) {
  if (p.set) return `<div class="fabric" style="background:${p.color};position:absolute;left:calc(50% - 65px);top:calc(50% - 35px);width:90px;height:90px"></div><div class="fabric" style="background:#d99caf;position:absolute;left:calc(50% - 4px);top:calc(50% - 5px);width:82px;height:82px"></div><div class="fabric" style="background:#b3c4a9;position:absolute;left:calc(50% - 25px);top:calc(50% + 20px);width:72px;height:72px"></div>`;
  return `<div class="fabric ${p.bow ? "bow" : ""}" style="background:${p.color}"></div>`;
}
function renderProducts() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  let list = products.filter(p => (activeCategory === "All" || p.category === activeCategory) && p.name.toLowerCase().includes(q));
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") list.sort((a,b)=>a.price-b.price);
  if (sort === "high") list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-image" style="background:linear-gradient(145deg,#fbf4f5,#f4e5e9)">
        ${p.label ? `<span class="badge">${p.label}</span>` : ""}
        ${productVisual(p)}
        <button class="quick-add" onclick="addToCart(${p.id})">＋ ADD TO BAG</button>
      </div>
      <div class="product-info"><div class="category">${p.category}</div><h3>${p.name}</h3>
        <div class="price-row"><span class="price">${rupees(p.price)}</span><span class="old-price">${rupees(p.oldPrice)}</span><span class="rating">★★★★★</span></div>
      </div>
    </article>`).join("") : `<div class="no-results">No products found. Try another search. ♡</div>`;
}
function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.qty++; else cart.push({id,qty:1});
  renderCart(); showToast("Added to your bag ♡");
}
function changeQty(id,delta) {
  const item = cart.find(i=>i.id===id); if(!item)return;
  item.qty += delta; if(item.qty <= 0) cart = cart.filter(i=>i.id!==id);
  renderCart();
}
function removeItem(id){cart=cart.filter(i=>i.id!==id);renderCart();}
function renderCart() {
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerCount").textContent=`(${count})`;
  document.getElementById("subtotal").textContent=rupees(subtotal);
  document.getElementById("checkoutButton").disabled=count===0;
  const el=document.getElementById("cartItems");
  el.innerHTML = cart.length ? cart.map(i=>{
    const p=products.find(p=>p.id===i.id);
    return `<div class="cart-item"><div class="cart-thumb" style="background:${p.color}">✿</div><div><h4>${p.name}</h4><small>${rupees(p.price)} each</small><div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Increase quantity">+</button></div></div><div><b>${rupees(p.price*i.qty)}</b><button class="remove-item" onclick="removeItem(${p.id})" aria-label="Remove item">×</button></div></div>`;
  }).join("") : `<div class="empty-cart">Your bag is waiting for something lovely. ♡</div>`;
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show");document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");document.body.style.overflow="";}
let toastTimer;
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}

document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{if(cart.length){closeCart();document.getElementById("checkoutDialog").showModal();}});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("show"));
document.getElementById("searchToggle").addEventListener("click",()=>{document.getElementById("searchBox").scrollIntoView({behavior:"smooth",block:"center"});document.getElementById("searchInput").focus();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.querySelectorAll("#categoryTabs button").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("#categoryTabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeCategory=btn.dataset.category;renderProducts();}));
document.getElementById("checkoutForm").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.target);const msg=document.getElementById("checkoutMessage");msg.textContent=`Demo order preview ready for ${data.get("name")}. No order has been placed and no payment has been taken. Connect a backend and payment provider before accepting real orders.`;});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
