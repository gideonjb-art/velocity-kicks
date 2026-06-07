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
JSON.parse(localStorage.getItem("recentlyViewed")) || [];

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
document.getElementById("cartCount");

if(!cartCount) return;

cartCount.innerText = totalItems;

}
function updateWishlistCount(){

const wishCount =
document.getElementById("wishCount");

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
document.getElementById(`modal-size-${id}`)?.value ||
document.getElementById(`size-${id}`)?.value;

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
document.getElementById("cartModal").style.display = "block";
}

window.closeCart = function(){
document.getElementById("cartModal").style.display = "none";
}

function renderCart(){

const box = document.getElementById("cartItems");

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
document.getElementById("recentlyViewedGrid");

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

let sizes = [];

if(Array.isArray(product.sizes)){
sizes = product.sizes;
}else{
sizes = String(product.sizes || "")
.split(",")
.map(s => s.trim())
.filter(Boolean);
}

const selectedSize =
prompt(
`Choose size:\n${sizes.join(", ")}`
);

if(!selectedSize) return;

cart.push({
...product,
size:selectedSize,
quantity:1
});

wishlist = wishlist.filter(
p => String(p.id) !== String(id)
);

saveCart();
saveWishlist();

renderWishlist();
renderCart();

alert(`Size ${selectedSize} moved to cart 🛒`);

};

/* WISHLIST UI */
window.openWishlist = function(){
document.getElementById("wishlistModal").style.display = "block";
renderWishlist();
}

window.closeWishlist = function(){
document.getElementById("wishlistModal").style.display = "none";
}
window.closeProduct = function(){
document.getElementById("productModal").style.display = "none";
}

function renderWishlist(){

const box = document.getElementById("wishlistItems");

if(wishlist.length === 0){

box.innerHTML = `
<div style="
text-align:center;
padding:40px;
">

<img
src="images/logo.png"
style="
width:120px;
opacity:.8;
margin-bottom:15px;
"
>

<h3>Your Wishlist Is Empty</h3>

<p style="color:#888;">
Save sneakers you love and revisit them anytime.
</p>

<button onclick="discoverMore()">
Discover More
</button>

</div>
`;

return;
}

box.innerHTML = wishlist.map(item => `

<div style="
display:flex;
gap:15px;
align-items:center;
background:#111;
padding:12px;
margin:12px 0;
border-radius:15px;
">

<img
src="${item.image}"
alt="${item.name}"
style="
width:90px;
height:90px;
object-fit:cover;
border-radius:12px;
"
onerror="this.src='https://via.placeholder.com/300'"
>

<div style="flex:1;">

<h4 style="margin:0 0 5px;">
${item.name}
</h4>

<p style="
margin:0 0 10px;
color:#D4AF37;
">
KES ${item.price}
</p>

<button onclick="moveToCart('${item.id}')">
Move To Cart
</button>

<button
onclick="removeFromWishlist('${item.id}')"
style="
background:#222;
color:#ff4d4d;
margin-left:10px;
">
Remove
</button>

</div>

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
function renderProducts() {
  const grid = document.getElementById("productGrid");
  
  let filteredProducts = [...products];
  
  // BRAND FILTER
  if (activeBrand) {
    filteredProducts = filteredProducts.filter(product =>
      (product.brand || "")
        .trim()
        .toLowerCase() === activeBrand.toLowerCase()
    );
  }
  
  // CATEGORY FILTER
  if (currentCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => {
      const category = (p.category || "").toLowerCase();
      return category.includes(currentCategory);
    });
  }
  
  // SEARCH FILTER
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        category.includes(searchQuery)
      );
    });
  }
  
  // EMPTY STATE
  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div style="
        padding: 60px 40px;
        background: rgba(255,255,255,0.02);
        border-radius: 32px;
        text-align: center;
        grid-column: 1/-1;
        border: 1px solid rgba(255,255,255,0.05);
      ">
        <i class="fas fa-search" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
        <h3 style="margin-bottom: 10px;">No Products Found</h3>
        <p style="opacity: 0.6;">Try adjusting your search or filter</p>
      </div>
    `;
    return;
  }
  
  // RENDER PREMIUM PRODUCT CARDS
  grid.innerHTML = filteredProducts.map(p => `
    <div class="product-card reveal" data-brand="${p.brand}" data-category="${p.category}" onclick='event.stopPropagation(); openProduct("${p.id}")'>
      
      <div class="product-image-container">
        <img
          src="${p.image || 'https://via.placeholder.com/400'}"
          class="product-img"
          loading="lazy"
          onclick='event.stopPropagation(); openImageViewer("${p.image}")'
          onerror="this.src='https://via.placeholder.com/400'"
        >
        
        <!-- BADGES -->
        ${p.stock <= 0 ? '<div class="product-badge">SOLD OUT</div>' : 
          p.stock < 5 ? '<div class="product-badge hot">🔥 LOW STOCK</div>' :
          '<div class="product-badge">NEW</div>'}
        
        <!-- QUICK ACTION BUTTONS -->
        <div class="product-actions">
          <button class="action-btn" onclick='event.stopPropagation(); addToWishlist("${p.id}")' title="Add to Wishlist">
            ♡
          </button>
          <button class="action-btn" onclick='event.stopPropagation(); quickAddToCart("${p.id}")' title="Quick Add">
            🛒
          </button>
        </div>
      </div>
      
      <div class="product-info">
        <div class="product-brand">${p.brand || 'VELOCITY'}</div>
        <h3 class="product-title">${p.name || "Unnamed Product"}</h3>
        
        <div class="price-row">
          <span class="product-price">KES ${(p.price || 0).toLocaleString()}</span>
          ${p.original_price ? `<span class="product-price original">KES ${p.original_price.toLocaleString()}</span>` : ''}
        </div>
        
        <div class="size-select-wrapper">
          <select id="size-${p.id}" class="size-select" onclick='event.stopPropagation()'>
            <option value="">Select Size</option>
            ${Array.isArray(p.sizes) 
              ? p.sizes.map(size => `<option value="${size}">${size}</option>`).join("")
              : (p.sizes || "")
                  .split(",")
                  .filter(size => size.trim() !== "")
                  .map(size => `<option value="${size.trim()}">${size.trim()}</option>`)
                  .join("")}
          </select>
        </div>
        
        <div class="product-buttons">
          <button class="btn-cart" onclick='event.stopPropagation(); addToCart("${p.id}")' ${p.stock <= 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <i class="fas fa-shopping-bag"></i> ${p.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button class="btn-wishlist" onclick='event.stopPropagation(); addToWishlist("${p.id}")'>
            ♡
          </button>
        </div>
        
        <div class="stock-indicator ${p.stock > 0 ? (p.stock < 5 ? 'low-stock' : 'in-stock') : 'out-of-stock'}">
          <i class="fas ${p.stock > 0 ? (p.stock < 5 ? 'fa-exclamation-triangle' : 'fa-check-circle') : 'fa-times-circle'}"></i>
          ${p.stock > 0 ? (p.stock < 5 ? `Only ${p.stock} left!` : `${p.stock} in stock`) : 'Out of stock'}
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


//  (only listen for specific events):
let isUpdating = false;
window.supabaseClient
.channel('products-channel')
.on(
'postgres_changes',
{ event: 'UPDATE', schema: 'public', table: 'products' },
(payload) => {
    if (!isUpdating) {
        isUpdating = true;
        setTimeout(() => {
            loadProducts();
            isUpdating = false;
        }, 1000);
    }
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
  }      
];

window.discoverMore = function(){

closeWishlist();

document
.getElementById("products")
.scrollIntoView({
behavior:"smooth"
});

}

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

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (
    !mobileMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    mobileMenu.classList.remove("show");
  }
});
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
  });
});
// Add to your script.js
document.querySelectorAll('.faq-item h3').forEach(question => {
  question.addEventListener('click', () => {
    const parent = question.parentElement;
    parent.classList.toggle('active');
  });
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Quick add to cart (uses first available size)
window.quickAddToCart = function(productId) {
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) return;
  
  // Get first available size
  let sizes = [];
  if (Array.isArray(product.sizes)) sizes = product.sizes;
  else if (product.sizes) sizes = product.sizes.split(",").map(s => s.trim()).filter(Boolean);
  
  if (sizes.length === 0) {
    alert("Please select a size");
    return;
  }
  
  const selectedSize = sizes[0];
  
  let existing = cart.find(item => 
    String(item.id) === String(product.id) && item.size === selectedSize
  );
  
  if (existing) {
    existing.quantity += 1;
  } else {
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
  showToast(`✓ Added ${product.name} (${selectedSize})`);
  
  // Animate the button
  const btn = event.target;
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = "✓ Added!";
    btn.style.background = "#4CAF50";
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
    }, 1000);
  }
};

function showToast(message, isError = false) {
  // Remove existing toast
  const existingToast = document.getElementById("velocity-toast");
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement("div");
  toast.id = "velocity-toast";
  toast.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      gap: 12px;
    ">
      <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="font-size: 20px;"></i>
      <span>${message}</span>
    </div>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${isError ? 'rgba(255, 68, 68, 0.95)' : 'rgba(0, 0, 0, 0.95)'};
    backdrop-filter: blur(12px);
    color: ${isError ? 'white' : '#D4AF37'};
    padding: 14px 24px;
    border-radius: 60px;
    font-weight: 600;
    z-index: 200000;
    border: 1px solid ${isError ? 'rgba(255, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.3)'};
    font-size: 0.9rem;
    white-space: nowrap;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 10);
  
  // Remove after 2.5 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


// ============================================
// EMAILJS CONTACT FORM - SEND EMAILS DIRECTLY
// ============================================

// Initialize EmailJS with your Public Key
// SIGN UP FOR FREE AT: https://www.emailjs.com/
(function() {
    emailjs.init("pSbc4J-Y5u5ln_13i"); // Replace with your EmailJS public key
})();

// Get form element
const contactForm = document.getElementById('quickContactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        // Validate form
        if (!name || !email || !message) {
            showFormMessage('error', 'Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('error', 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('sendEmailBtn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Prepare email template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'jabesgideon@gmail.com', // Where emails will be sent
            reply_to: email
        };
        
        // Send email using EmailJS
        // REPLACE WITH YOUR SERVICE ID & TEMPLATE ID
        emailjs.send('service_jn94vcs', 'template_c9ku097', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showFormMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                showFormMessage('error', 'Failed to send message. Please try again or WhatsApp us.');
            })
            .finally(function() {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show messages
function showFormMessage(type, message) {
    const formCard = document.querySelector('.contact-form-card');
    const existingMessage = document.querySelector('.form-message');
    
    // Remove existing message if any
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <p>${message}</p>
    `;
    
    // Insert after form
    const form = document.getElementById('quickContactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv) messageDiv.remove();
    }, 5000);
}

// Auto-save to localStorage (optional - saves draft)
const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');

if (nameInput && emailInput && messageInput) {
    // Load saved draft
    if (localStorage.getItem('contact_draft_name')) {
        nameInput.value = localStorage.getItem('contact_draft_name');
        emailInput.value = localStorage.getItem('contact_draft_email');
        messageInput.value = localStorage.getItem('contact_draft_message');
    }
    
    // Save draft on input
    const saveDraft = () => {
        localStorage.setItem('contact_draft_name', nameInput.value);
        localStorage.setItem('contact_draft_email', emailInput.value);
        localStorage.setItem('contact_draft_message', messageInput.value);
    };
    
    nameInput.addEventListener('input', saveDraft);
    emailInput.addEventListener('input', saveDraft);
    messageInput.addEventListener('input', saveDraft);
}
// ============================================
// M-PESA PAYMENT FUNCTION
// ============================================
window.initiateMpesaPayment = async function(phone, amount, orderDetails) {
    console.log("initiateMpesaPayment called with:", phone, amount);

    try {
        const payload = {
            phone: String(phone),
            amount: Number(amount),
            orderDetails: orderDetails || {}
        };

        console.log("Sending payload:", JSON.stringify(payload));

        const response = await fetch(
            "https://wylhbyrpmotecjdtjrae.supabase.co/functions/v1/mpesa-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU"
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await response.text();
        console.log("Edge function raw response:", text);

        const data = JSON.parse(text);
        return data;

    } catch (error) {
        console.error("Payment initiation error:", error);
        return { success: false, error: error.message || "Failed to fetch" };
    }
};


// ============================================
// SIMPLE CHECKOUT FUNCTION - ADD AT END OF FILE
// ============================================

// Make sure cart functions are available
window.checkoutCart = function() {
    console.log("checkoutCart called");
    
    if (typeof cart === 'undefined' || cart.length === 0) {
        showToast("Your cart is empty", true);
        return;
    }
    
    // Calculate total
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get phone input from cart modal
    const phoneInput = document.getElementById('mpesaPhone');
    const payBtn = document.getElementById('checkoutMpesaBtn');
    const statusDiv = document.getElementById('cartPaymentStatus');
    
    // Check if elements exist
    if (!phoneInput || !payBtn) {
        console.error("Payment elements not found");
        showToast("Payment system error. Please refresh the page.", true);
        return;
    }
    
    // Scroll to payment section in cart modal
    const paymentSection = document.querySelector('#cartModal .payment-form-container');
    if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show message asking for phone
    if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = "📱 Enter your M-Pesa phone number above and click 'Pay with M-Pesa'";
        statusDiv.style.backgroundColor = '#1a2a3a';
        statusDiv.style.color = '#D4AF37';
    }
    
    // Highlight the phone input
    phoneInput.style.border = '2px solid #D4AF37';
    phoneInput.focus();
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
        phoneInput.style.border = '1px solid #333';
    }, 3000);
};

// Also add a direct handler for the pay button
function setupMpesaButton() {
    const payBtn = document.getElementById('checkoutMpesaBtn');
    if (!payBtn) return;
    
    // Remove any existing listeners
    const newPayBtn = payBtn.cloneNode(true);
    payBtn.parentNode.replaceChild(newPayBtn, payBtn);
    
    newPayBtn.addEventListener('click', async function() {
        console.log("Pay button clicked");
        
        const phoneInput = document.getElementById('mpesaPhone');
        const statusDiv = document.getElementById('cartPaymentStatus');
        const phone = phoneInput ? phoneInput.value.trim() : '';
        
        if (!phone) {
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.innerHTML = "❌ Please enter your M-Pesa phone number";
                statusDiv.style.backgroundColor = '#3a1a1a';
                statusDiv.style.color = '#ff6b6b';
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 3000);
            }
            return;
        }
        
        // Calculate total from cart
        let total = 0;
        if (typeof cart !== 'undefined') {
            total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        if (total === 0) {
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.innerHTML = "❌ Your cart is empty";
                statusDiv.style.backgroundColor = '#3a1a1a';
                statusDiv.style.color = '#ff6b6b';
            }
            return;
        }
        
        // Format phone
        let formattedPhone = phone;
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }
        
        console.log("Processing payment for:", formattedPhone, "Amount:", total);
        
        // Update button to loading state
        newPayBtn.disabled = true;
        newPayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = "⏳ Sending STK Push to your phone...";
            statusDiv.style.backgroundColor = '#1a2a3a';
            statusDiv.style.color = '#D4AF37';
        }
        
        // Check if payment function exists
        if (typeof window.initiateMpesaPayment !== 'function') {
            console.error("initiateMpesaPayment not found");
            if (statusDiv) {
                statusDiv.innerHTML = "❌ Payment system not loaded. Please refresh the page.";
                statusDiv.style.backgroundColor = '#3a1a1a';
                statusDiv.style.color = '#ff6b6b';
            }
            newPayBtn.disabled = false;
            newPayBtn.innerHTML = 'Pay with M-Pesa';
            return;
        }
        
        // Prepare order
        const orderDetails = {
            items: cart.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            total: total
        };
        
        try {
            const result = await window.initiateMpesaPayment(formattedPhone, total, orderDetails);
            console.log("Payment result:", result);
            
            if (result.success) {
                if (statusDiv) {
                    statusDiv.innerHTML = "✅ Check your phone! Enter your M-Pesa PIN to complete payment.";
                    statusDiv.style.backgroundColor = '#1a3a1a';
                    statusDiv.style.color = '#4CAF50';
                }
                showToast("Check your phone for M-Pesa prompt");
                
                // Poll for payment status
                pollPaymentStatusCart(result.checkoutRequestID);
            } else {
                if (statusDiv) {
                    statusDiv.innerHTML = `❌ ${result.error}`;
                    statusDiv.style.backgroundColor = '#3a1a1a';
                    statusDiv.style.color = '#ff6b6b';
                }
                newPayBtn.disabled = false;
                newPayBtn.innerHTML = 'Pay with M-Pesa';
            }
        } catch (error) {
            console.error("Payment error:", error);
            if (statusDiv) {
                statusDiv.innerHTML = `❌ Network error: ${error.message}`;
                statusDiv.style.backgroundColor = '#3a1a1a';
                statusDiv.style.color = '#ff6b6b';
            }
            newPayBtn.disabled = false;
            newPayBtn.innerHTML = 'Pay with M-Pesa';
        }
    });
}

// Poll payment status
function pollPaymentStatusCart(checkoutID) {
    let attempts = 0;
    const maxAttempts = 30;
    
    const interval = setInterval(async () => {
        attempts++;
        
        try {
            const { data, error } = await window.supabaseClient
                .from('payments')
                .select('status, mpesa_receipt, amount')
                .eq('checkout_request_id', checkoutID)
                .single();
            
            if (data && data.status === 'paid') {
                clearInterval(interval);
                const statusDiv = document.getElementById('cartPaymentStatus');
                if (statusDiv) {
                    statusDiv.innerHTML = `✅ PAYMENT SUCCESSFUL!<br>Receipt: ${data.mpesa_receipt}<br>Amount: KES ${data.amount}<br>Thank you for shopping!`;
                    statusDiv.style.backgroundColor = '#1a3a1a';
                    statusDiv.style.color = '#4CAF50';
                }
                
                // Clear cart
                if (typeof cart !== 'undefined') {
                    cart = [];
                    saveCart();
                    if (typeof renderCart === 'function') renderCart();
                }
                
                showToast(`✅ Payment successful! Receipt: ${data.mpesa_receipt}`);
                
                // Reset button
                const payBtn = document.getElementById('checkoutMpesaBtn');
                if (payBtn) {
                    payBtn.disabled = false;
                    payBtn.innerHTML = 'Pay with M-Pesa';
                }
                
                // Close cart after delay
                setTimeout(() => {
                    document.getElementById('cartModal').style.display = 'none';
                }, 3000);
                
            } else if (data && data.status === 'failed') {
                clearInterval(interval);
                const statusDiv = document.getElementById('cartPaymentStatus');
                if (statusDiv) {
                    statusDiv.innerHTML = "❌ Payment failed. Please try again.";
                    statusDiv.style.backgroundColor = '#3a1a1a';
                    statusDiv.style.color = '#ff6b6b';
                }
                const payBtn = document.getElementById('checkoutMpesaBtn');
                if (payBtn) {
                    payBtn.disabled = false;
                    payBtn.innerHTML = 'Pay with M-Pesa';
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                const statusDiv = document.getElementById('cartPaymentStatus');
                if (statusDiv) {
                    statusDiv.innerHTML = "⏰ Payment timeout. Check your M-Pesa messages.";
                    statusDiv.style.backgroundColor = '#3a3a1a';
                    statusDiv.style.color = '#ffaa00';
                }
                const payBtn = document.getElementById('checkoutMpesaBtn');
                if (payBtn) {
                    payBtn.disabled = false;
                    payBtn.innerHTML = 'Pay with M-Pesa';
                }
            }
        } catch (error) {
            console.error("Polling error:", error);
        }
    }, 1000);
}

// Show toast message
function showToast(message, isError = false) {
    const existingToast = document.getElementById("velocity-toast");
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement("div");
    toast.id = "velocity-toast";
    toast.innerHTML = `<div style="display: flex; align-items: center; gap: 12px;">
        <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="font-size: 20px;"></i>
        <span>${message}</span>
    </div>`;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${isError ? 'rgba(255, 68, 68, 0.95)' : 'rgba(0, 0, 0, 0.95)'};
        backdrop-filter: blur(12px);
        color: ${isError ? 'white' : '#D4AF37'};
        padding: 14px 24px;
        border-radius: 60px;
        font-weight: 600;
        z-index: 200000;
        border: 1px solid ${isError ? 'rgba(255, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.3)'};
        font-size: 0.9rem;
        white-space: nowrap;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.opacity = "1"; toast.style.transform = "translateX(-50%) translateY(0)"; }, 10);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupMpesaButton, 500);
});

// Also setup when cart opens
const originalOpenCartFunction = window.openCart;
window.openCart = function() {
    if (originalOpenCartFunction) originalOpenCartFunction();
    setTimeout(setupMpesaButton, 100);
};

// ============================================
// PREMIUM FAQ ACCORDION DROPDOWN
// ============================================
function initPremiumFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Restructure FAQ items to have answer div if not already present
  faqItems.forEach(item => {
    const h3 = item.querySelector('h3');
    const p = item.querySelector('p');
    
    // If the answer is not wrapped, wrap it
    if (p && !item.querySelector('.faq-answer')) {
      const answerDiv = document.createElement('div');
      answerDiv.className = 'faq-answer';
      answerDiv.innerHTML = p.outerHTML;
      p.remove();
      item.appendChild(answerDiv);
    }
    
    // Add click event
    h3.style.cursor = 'pointer';
    h3.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = item.classList.contains('active');
      
      // Close all other items (optional: keeps only one open)
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPremiumFaq);
} else {
  initPremiumFaq();
}
