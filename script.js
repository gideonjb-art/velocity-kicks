/* SUPABASE */
if (!window.supabaseClient) {

window.supabaseClient = window.supabase.createClient(
"https://wylhbyrpmotecjdtjrae.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU"
);

}
/* =========================
CART + WISHLIST SYSTEM
========================= */ 

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.map(item => ({
...item,
quantity: Number(item.quantity) || 1
}));
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let recentlyViewed =
JSON.parse(localStorage.Item("recentlyViewed")) || [];

/* SAVE FUNCTIONS */
function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
}

function saveWishlist(){
localStorage.setItem("wishlist", JSON.stringify(wishlist));
updateWishlistCount();
}

function saveRecentlyViewed(){

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(recentlyViewed)
  );

}

/* COUNTERS */
function updateCartCount(){

let totalItems = cart.reduce((sum, item) => {

return sum + (Number(item.quantity) || 1);

}, 0);

const cartCount =
document.ElementById("cartCount");

if(!cartCount) return;

cartCount.innerText = totalItems;

}
function updateWishlistCount(){

const wishCount =
document.ElementById("wishCount");

if(!wishCount) return;

wishCount.innerText = wishlist.length;

}


/* =========================
CART FUNCTIONS
========================= */
window.addToCart = function(id){

const product = products.find(
p => String(p.id) === String(id)
);

if(!product) return;

const selectedSize =
document.ElementById(`modal-size-${id}`)?.value ||
document.ElementById(`size-${id}`)?.value;

if(!selectedSize){
alert("Please select a shoe size");
return;
}

let existing = cart.find(item =>
String(item.id) === String(id) &&
item.size === selectedSize
);

if(existing){

existing.quantity += 1;

}else{

cart.push({
id: product.id,
name: product.name,
price: Number(product.price),
image: product.image,
size: selectedSize,
quantity: 1
});

}

saveCart();
renderCart();

alert(`Added Size ${selectedSize} to cart`);

};


window.openCart = function(){
renderCart();
document.ElementById("cartModal").style.display = "block";
}

window.closeCart = function(){
document.ElementById("cartModal").style.display = "none";
}

function renderCart(){

const box = document.ElementById("cartItems");

if(cart.length === 0){

box.innerHTML = `
<div id="emptyCart" style="
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height:100%;
opacity:0.7;
text-align:center;
">

<img
src="images/logo.png"
alt="Velocity Kicks Logo"
style="
width:160px;
max-width:80%;
margin-bottom:20px;
object-fit:contain;
"
>

<p style="
color:#aaa;
font-size:1rem;
">
Your cart is empty
</p>

</div>
`;

return;

}

let total = 0;

box.innerHTML = cart.map((item, i) => {

total += item.price * item.quantity;

return `
<div style="display:flex;gap:10px;align-items:center;background:#111;padding:10px;margin:10px 0;border-radius:10px;">

<img src="${item.image}"
style="width:70px;height:70px;object-fit:cover;border-radius:10px;" />

<div style="flex:1;">
<h4>${item.name}</h4>
<p>KES ${item.price}</p>

<p style="font-size:0.85rem;color:#D4AF37;">
Size: ${item.size}
</p>

<div style="display:flex;align-items:center;gap:10px;margin-top:5px;">

<button onclick="changeQty(${i}, -1)">-</button>

<span>${item.quantity}</span>

<button onclick="changeQty(${i}, 1)">+</button>

</div>
</div>

<button
onclick="removeFromCart(${i})"
style="
width:auto;
padding:6px 10px;
font-size:0.8rem;
background:#222;
color:#ff4d4d;
border-radius:8px;
">
✕
</button>

</div>
`;
}).join("");

box.innerHTML += `
<div style="
background:#0f0f0f;
padding:20px;
border-top:1px solid rgba(255,255,255,0.1);
margin-top:20px;
border-radius:15px;
">

<h2 style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
">
<span>Total</span>
<span style="color:#D4AF37;">
KES ${total}
</span>
</h2>

<button
onclick="checkoutCart()"
style="
padding:15px;
font-size:1rem;
border-radius:12px;
font-weight:bold;
">
Checkout • KES ${total}
</button>

</div>
`;

}
window.checkoutCart = function(){

if(cart.length === 0){
alert("Your cart is empty");
return;
}

let message = "*VELOCITY KICKS ORDER* 🛒\n\n";

let total = 0;

cart.forEach(item => {

const subtotal = item.price * item.quantity;

total += subtotal;

message += `
👟 ${item.name}
📏 Size: ${item.size}
Qty: ${item.quantity}
KES ${subtotal}

`;

});

message += `\nTOTAL: KES ${total}`;

window.open(
`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
"_blank"
);

};

/* =========================
WISHLIST FUNCTIONS
========================= */

window.addToWishlist = function(id){

const product = products.find(p => String(p.id) === String(id));
if(!product) return;

const exists = wishlist.find(i => String(i.id) === String(id));

if(exists){
alert("Already in wishlist ❤️");
return;
}

wishlist.push(product);
saveWishlist();

alert("Added to wishlist ❤️");

};

window.removeFromWishlist = function(id){
wishlist = wishlist.filter(i => String(i.id) !== String(id));
saveWishlist();
renderWishlist();
/* =========================
   RECENTLY VIEWED UI
========================= */

function renderRecentlyViewed(){

const container =
document.ElementById("recentlyViewedGrid");

if(!container) return;

/* EMPTY */
if(recentlyViewed.length === 0){

container.innerHTML = `
<p style="
color:#888;
padding:20px;
text-align:center;
width:100%;
">
No recently viewed products
</p>
`;

return;

}

/* RENDER */
container.innerHTML = recentlyViewed.map(product => `

<div
onclick="openProduct('${product.id}')"
style="
background:#111;
border-radius:15px;
overflow:hidden;
min-width:180px;
cursor:pointer;
transition:0.3s;
"
>

<img
src="${product.image}"
alt="${product.name}"
style="
width:100%;
height:180px;
object-fit:cover;
"
onerror="this.src='https://via.placeholder.com/300'"
>

<div style="padding:12px;">

<h4 style="
margin:0 0 8px;
font-size:0.95rem;
">
${product.name}
</h4>

<p style="
margin:0;
color:#D4AF37;
font-weight:bold;
">
KES ${product.price}
</p>

</div>

</div>

`).join("");

}  
};

 window.moveToCart = function(id){

const product = wishlist.find(
p => String(p.id) === String(id)
);

if(!product) return;

cart.push({
...product,
quantity:1
});

wishlist = wishlist.filter(
p => String(p.id) !== String(id)
);

saveCart();
saveWishlist();

renderWishlist();
renderCart();

alert("Moved to cart 🛒");

}; 

/* WISHLIST UI */
window.openWishlist = function(){
document.ElementById("wishlistModal").style.display = "block";
renderWishlist();
}

window.closeWishlist = function(){
document.ElementById("wishlistModal").style.display = "none";
}
window.closeProduct = function(){
document.ElementById("productModal").style.display = "none";
}
function renderWishlist(){

const box = document.ElementById("wishlistItems");

if(wishlist.length === 0){
box.innerHTML = "<p>No wishlist items</p>";
return;
}

box.innerHTML = wishlist.map(item => `
<div style="background:#111;padding:10px;margin:10px 0;border-radius:10px;">
<h4>${item.name}</h4>
<p>KES ${item.price}</p>

<button onclick="moveToCart('${item.id}')">Move to Cart</button>
<button onclick="removeFromWishlist('${item.id}')">Remove</button>

</div>
`).join("");

}

/* INIT COUNTS */
function initShop(){
updateCartCount();
updateWishlistCount();
}

let products = [];
let currentCategory = "all";
let searchQuery = "";
const phoneNumber = "254798566993";

/* LOAD PRODUCTS */
async function loadProducts(){
document.getElementById("productGrid").innerHTML = `
<div class="skeleton-grid">

${Array(8).fill(`
<div class="skeleton-card">

<div class="skeleton-image"></div>

<div class="skeleton-line"></div>

<div class="skeleton-line short"></div>

<div class="skeleton-line"></div>

</div>
`).join("")}

</div>
`;
try{

const { data, error } = await window.supabaseClient
.from("products")
.select("*")
.order("id",{ascending:false});

if(error){
console.error("window.supabaseClient Error:", error);

document.getElementById("productGrid").innerHTML = `
<div style="
padding:40px;
background:#111;
border-radius:20px;
text-align:center;
grid-column:1/-1;
">
<h3>Failed To Load Products</h3>
<p style="opacity:.7;">
Check window.supabaseClient permissions or table names
</p>
</div>
`;

return;
}

products = data || [];

console.log("Loaded Products:", products);

renderProducts();

}catch(err){

console.error("Unexpected Error:", err);

}

}

/* FILTER PRODUCTS */
function filterProducts(category, button){

currentCategory = category;

document.querySelectorAll(".category-btn").forEach(btn=>{
btn.classList.remove("active");
});

button.classList.add("active");

renderProducts();

}
 window.openImageViewer = function(imageSrc){ 

document.getElementById("viewerImage").src = imageSrc;

document.getElementById("imageViewer").style.display = "flex";

}

window.closeImageViewer = function(){

document.getElementById("imageViewer").style.display = "none";

}

/* SEARCH PRODUCTS */
function searchProducts(){

const input = document.getElementById("searchInput");

searchQuery = input.value.trim().toLowerCase();

renderProducts();

}

/* RENDER PRODUCTS */
function renderProducts(){

const grid = document.getElementById("productGrid");
  
let filteredProducts = [...products];
 /* BRAND FILTER */

if(activeBrand){

  filteredProducts = filteredProducts.filter(product =>

    (product.brand || "")
      .trim()
      .toLowerCase() === activeBrand.toLowerCase()

  );

} 

/* CATEGORY FILTER */
if(currentCategory !== "all"){

filteredProducts = filteredProducts.filter(p => {

const category = (p.category || "").toLowerCase();

return category.includes(currentCategory);

});

}

/* SEARCH FILTER */
if(searchQuery){

filteredProducts = filteredProducts.filter(p => {

const name = (p.name || "").toLowerCase();

const category = (p.category || "").toLowerCase();

return (
name.includes(searchQuery) ||
category.includes(searchQuery)
);

});

}

/* EMPTY STATE */
if(filteredProducts.length === 0){

grid.innerHTML = `
<div style="
padding:40px;
background:#111;
border-radius:20px;
text-align:center;
grid-column:1/-1;
">
<h3>No Products Found</h3>
<p style="opacity:.7;">
Try another search
</p>
</div>
`;

return;

}


/* DISPLAY PRODUCTS */
grid.innerHTML = filteredProducts.map(p => `
<div class="product-card reveal"
     data-brand="${p.brand}"
     data-category="${p.category}">


<img
src="${p.image || 'https://via.placeholder.com/300'}"
class="product-img"
loading="lazy"
onclick='event.stopPropagation(); openImageViewer("${p.image}")'
style="cursor:pointer;"
onerror="this.src='https://via.placeholder.com/300'"
>

<div class="product-info">

<h3
onclick='event.stopPropagation(); openProduct("${p.id}")'
style="cursor:pointer;"
>
${p.name || "Unnamed Product"}
</h3>

<p class="product-price">
KES ${p.price || 0}
</p>
<p style="
color:${p.stock > 0 ? '#4CAF50' : '#ff4d4d'};
font-size:0.9rem;
margin-top:5px;
">
${p.stock > 0
? `${p.stock} in stock`
: 'Out of stock'}
</p>

<select
id="size-${p.id}"
class="size-select"
>

<option value="">Select Size</option>

${
Array.isArray(p.sizes)
? p.sizes.map(size => `
<option value="${size}">
${size}
</option>
`).join("")
: (p.sizes || "")
.split(",")
.filter(size => size.trim() !== "")
.map(size => `
<option value="${size.trim()}">
${size.trim()}
</option>
`)
.join("")
}

</select>

<div style="display:flex; gap:10px;">

<button
onclick='event.stopPropagation(); orderProduct("${p.id}")'
${p.stock <= 0 ? 'disabled' : ''}
style="
opacity:${p.stock <= 0 ? '0.5' : '1'};
cursor:${p.stock <= 0 ? 'not-allowed' : 'pointer'};
"
>
${p.stock <= 0 ? 'Out Of Stock' : 'Order'}
</button>

<button onclick='event.stopPropagation(); addToCart("${p.id}")'>
🛒
</button>

<button
onclick='event.stopPropagation(); addToWishlist("${p.id}")'
style="background:#222;color:#D4AF37;"
>
♡
</button>

</div>


</div>

</div>

`).join("");
revealOnScroll();

}
/* ORDER PRODUCT */
window.orderProduct = async function(productId){

const product = products.find(
p => String(p.id) === String(productId)
);
 if(product.stock <= 0){
alert("Product out of stock");
return;
} 

if(!product){
alert("Product not found");
return;
}

const size =
document.getElementById(`modal-size-${productId}`)?.value ||
document.getElementById(`size-${productId}`)?.value;

if(!size || size === "Select Size"){
alert("Select size first");
return;
}

try{

const { error } = await window.supabaseClient
.from("orders")
.insert([{
product: product.name,
product_id: productId,
size: size,
price: product.price,
status: "pending"
}]);

if(error){
console.error(error);
alert("Error placing order");
return;
}

const msg = `*NEW ORDER* 🛒
👟 ${product.name}
📏 Size: ${size}
💰 KES ${product.price}
Location: Nairobi`;

window.open(
`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
"_blank"
);

}catch(err){

console.error(err);
alert("Unexpected order error");

}
 await window.supabaseClient
.from("products")
.update({
stock: Math.max(product.stock - 1, 0)
})
.eq("id", productId); 

};

/* RIPPLE EFFECT */
document.addEventListener("click", function(e){

if(e.target.classList.contains("ripple-btn")){

const circle = document.createElement("span");

const rect = e.target.getBoundingClientRect();

circle.style.left = e.clientX - rect.left + "px";
circle.style.top = e.clientY - rect.top + "px";

e.target.appendChild(circle);

setTimeout(() => {
circle.remove();
}, 600);

}

});

/* REVEAL ON SCROLL */
function revealOnScroll(){

const reveals = document.querySelectorAll(".reveal");

const trigger = window.innerHeight * 0.85;

reveals.forEach(el => {

const top = el.getBoundingClientRect().top;

if(top < trigger){
el.classList.add("active");
}

});

}

let revealTimeout;

window.addEventListener("scroll", () => {

clearTimeout(revealTimeout);

revealTimeout = setTimeout(() => {
revealOnScroll();
}, 50);

});

/* INIT */
window.addEventListener("load", () => {
loadProducts();
initShop();
revealOnScroll();
renderRecentlyViewed();

document.querySelectorAll(".reveal").forEach(el => {
el.classList.add("active");
});

});

/* REMOVE SPLASH */
let realtimeTimeout;

window.supabaseClient
.channel('products-channel')
.on(
'postgres_changes',
{ event: '*', schema: 'public', table: 'products' },
() => {

clearTimeout(realtimeTimeout);

realtimeTimeout = setTimeout(loadProducts, 500);

}
)
.subscribe();
window.changeQty = function(index, change){

if(!cart[index]) return;

cart[index].quantity += change;

// remove if 0
if(cart[index].quantity <= 0){
cart.splice(index, 1);
}

saveCart();
renderCart();

};
window.removeFromCart = function(index){

cart.splice(index, 1);

saveCart();
renderCart();

};
function renderRecentlyViewed(){

const container =
document.getElementById("recentlyViewedGrid");

if(!container) return;

container.innerHTML =
recentlyViewed.map(product => `

<div
onclick="openProduct('${product.id}')"
style="
background:#111;
border-radius:15px;
overflow:hidden;
cursor:pointer;
min-width:180px;
"
>

<img
src="${product.image}"
style="
width:100%;
height:180px;
object-fit:cover;
"
>

<div style="padding:10px;">
<h4>${product.name}</h4>
<p style="color:#D4AF37;">
KES ${product.price}
</p>
</div>

</div>

`).join("");

}
window.openProduct = function(id){

const product = products.find(
p => String(p.id) === String(id)
);

if(!product) return;
  /* =========================
   RECENTLY VIEWED
========================= */

// REMOVE IF ALREADY EXISTS
recentlyViewed = recentlyViewed.filter(
  item => String(item.id) !== String(product.id)
);

// ADD TO START
recentlyViewed.unshift(product);

// LIMIT TO 6 ITEMS
recentlyViewed = recentlyViewed.slice(0, 6);

// SAVE
saveRecentlyViewed();
renderRecentlyViewed();

document.getElementById("productDetails").innerHTML = `

<div style="
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:1fr 1fr;
gap:40px;
align-items:center;
">

<div>

<img
src="${product.image || 'https://via.placeholder.com/500'}"
onerror="this.src='https://via.placeholder.com/500'"
style="
width:100%;
border-radius:20px;
max-height:420px;
object-fit:cover;
"
/>

</div>

<div>

<h1 style="font-size:2rem;">
${product.name}
</h1>

<p style="
color:#D4AF37;
font-size:2rem;
font-weight:bold;
">
KES ${product.price}
</p>

<p style="
opacity:.8;
line-height:1.8;
margin:20px 0;
">
Premium sneaker from Velocity Kicks.
High quality comfort and modern streetwear style.
</p>

<select
id="modal-size-${product.id}"
class="size-select"
>

<option value="">Select Size</option>

${
Array.isArray(product.sizes)
? product.sizes.map(size => `
<option value="${size}">
${size}
</option>
`).join("")
: (product.sizes || "")
.split(",")
.filter(size => size.trim() !== "")
.map(size => `
<option value="${size.trim()}">
${size.trim()}
</option>
`)
.join("")
}

</select>

<div style="display:flex;gap:15px;">

<button
onclick="orderProduct('${product.id}')"
${product.stock <= 0 ? 'disabled' : ''}
style="
flex:1;
padding:15px;
font-size:1rem;
opacity:${product.stock <= 0 ? '0.5' : '1'};
cursor:${product.stock <= 0 ? 'not-allowed' : 'pointer'};
"
>
${product.stock <= 0 ? 'Out Of Stock' : 'Order Now'}
</button>

<button
onclick="addToCart('${product.id}')"
style="
flex:1;
padding:15px;
background:#222;
color:#D4AF37;
font-size:1rem;
"
>
🛒 Add To Cart
</button>

</div>

</div>

</div>
`;



/* RELATED PRODUCTS */

const relatedProducts = products
.filter(p =>
p.category === product.category &&
String(p.id) !== String(product.id)
)
.slice(0,4);

if(relatedProducts.length > 0){

const relatedHTML = relatedProducts.map(item => `

<div
onclick="openProduct('${item.id}')"
style="
background:#111;
border-radius:15px;
overflow:hidden;
cursor:pointer;
transition:0.3s;
min-width:180px;
"
>

<img
src="${item.image}"
loading="lazy"
style="
width:100%;
height:180px;
object-fit:cover;
"
/>

<div style="padding:10px;">

<h4 style="margin:0 0 5px;">
${item.name}
</h4>

<p style="
color:#D4AF37;
margin:0;
">
KES ${item.price}
</p>

</div>

</div>

`).join("");

document.getElementById("productDetails").innerHTML += `

<div style="margin-top:50px;">

<h2 style="margin-bottom:20px;">
Related Products
</h2>

<div style="
display:flex;
gap:15px;
overflow-x:auto;
padding-bottom:10px;
">

${relatedHTML}

</div>

</div>
`;

}

document.getElementById("productModal").style.display = "block";

};


function closeProduct(){
document.getElementById("productModal").style.display = "none";
}
function filterBrand(brand){

  document
    .getElementById('products')
    .scrollIntoView({
      behavior:'smooth'
    });

  const products =
    document.querySelectorAll('.product-card');

  products.forEach(product => {

    if(product.dataset.brand === brand){

      product.style.display = 'block';

    } else {

      product.style.display = 'none';

    }

  });

}
// Brand data with their shoe types
const brandTypesData = [
  { 
    name: "Nike", 
    logo: "images/nike-logo.jfif"
  },
  { 
    name: "Adidas", 
    logo: "images/Adidas-logo.jfif"
  },
  { 
    name: "New Balance", 
    logo: "images/nb-logo.jfif"
  },
  {
    name: "Puma",
    logo: "images/Puma-logo.jpg"
   },
   {
     name: "Clarks",
     logo: "images/clarks-logo.jfif"
   },
  {
    name: "Jordan",
    logo: "images/jordan-logo.jfif"
];


// Build the scrollable brand row
function buildBrandScrollRow() {
  const container = document.getElementById('brandScrollRow');
  if (!container) return;
  
  container.innerHTML = brandTypesData.map(brand => `
    <div class="brand-chip" data-brand="${brand.name}" onclick="selectBrand('${brand.name}')">
      <img src="${brand.logo}" alt="${brand.name}" onerror="this.src='https://placehold.co/60'">
      <span>${brand.name}</span>
    </div>
  `).join('');
}

// Select a brand
let activeBrand = null;

window.selectBrand = function(brandName){

  document
    .getElementById("products")
    .scrollIntoView({
      behavior:"smooth"
    });

  // Click same brand again = show all products
  if(activeBrand === brandName){

    activeBrand = null;

    document.querySelectorAll(".brand-chip")
      .forEach(chip => chip.classList.remove("active"));

    renderProducts();

    return;
  }

  activeBrand = brandName;

  document.querySelectorAll(".brand-chip")
    .forEach(chip => {

      chip.classList.remove("active");

      if(chip.dataset.brand === brandName){
        chip.classList.add("active");
      }

    });

  renderProducts();
};

  // SET NEW ACTIVE BRAND
  activeBrand = brandName;

  // UPDATE ACTIVE STYLES
  document.querySelectorAll('.brand-chip')
    .forEach(chip => {

      chip.classList.remove('active');

      if(chip.getAttribute('data-brand') === brandName){
        chip.classList.add('active');
      }

    });

  // OPEN PANEL
  renderBrandTypesPanel(brandName);

};
  


// Initialize the brand row when page loads
document.addEventListener('DOMContentLoaded', function() {
  buildBrandScrollRow();
  // Optional: Auto-select first brand

});
/* NAVBAR SHRINK ON SCROLL */

const navbar = document.getElementById("navbar");

let scrollTimeout;

window.addEventListener("scroll", () => {

  /* SHRINK IMMEDIATELY */
  navbar.classList.add("shrink");

  /* RESET TIMER */
  clearTimeout(scrollTimeout);

  /* EXPAND WHEN SCROLLING STOPS */
  scrollTimeout = setTimeout(() => {

    navbar.classList.remove("shrink");

  }, 220);

});
/* =========================
   PANEL + NAVIGATION SYSTEM
========================= */

function closeAllPanels(){

  // CART
  const cartModal =
    document.getElementById("cartModal");

  if(cartModal){
    cartModal.style.display = "none";
  }

  // WISHLIST
  const wishlistModal =
    document.getElementById("wishlistModal");

  if(wishlistModal){
    wishlistModal.style.display = "none";
  }

  // PRODUCT MODAL
  const productModal =
    document.getElementById("productModal");

  if(productModal){
    productModal.style.display = "none";
  }

}

/* =========================
   HOME
========================= */

window.openHome = function(){

  closeAllPanels();

  document
    .getElementById("home")
    .scrollIntoView({
      behavior:"smooth"
    });

};

/* =========================
   CONTACT
========================= */

window.openContact = function(){

  closeAllPanels();

  document
    .getElementById("contact")
    .scrollIntoView({
      behavior:"smooth"
    });

};

/* =========================
   CART
========================= */

window.openCart = function(){

  // CLOSE EVERYTHING FIRST
  closeAllPanels();

  // RENDER CART
  renderCart();

  // OPEN CART
  document.getElementById("cartModal")
    .style.display = "block";

};

window.closeCart = function(){

  document.getElementById("cartModal")
    .style.display = "none";

};

/* =========================
   WISHLIST
========================= */

window.openWishlist = function(){

  // CLOSE EVERYTHING FIRST
  closeAllPanels();

  // RENDER WISHLIST
  renderWishlist();

  // OPEN WISHLIST
  document.getElementById("wishlistModal")
    .style.display = "block";

};

window.closeWishlist = function(){

  document.getElementById("wishlistModal")
    .style.display = "none";

};

/* =========================
   PRODUCT MODAL
========================= */

window.closeProduct = function(){

  document.getElementById("productModal")
    .style.display = "none";

};
