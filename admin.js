const supabaseClient = window.supabase.createClient(
"https://wylhbyrpmotecjdtjrae.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU"
);

let products = [];
let currentEditId = null;

/* IMAGE PREVIEW */
document.getElementById("imageFile")
.addEventListener("change", function(e){

const file = e.target.files[0];
const img = document.getElementById("previewImg");

if(file){

img.src = URL.createObjectURL(file);
img.style.display = "block";

}else{

img.style.display = "none";

}

});

/* LOAD PRODUCTS */
async function loadProducts(){

const table = document.getElementById("productTable");

table.innerHTML = `
<tr>
<td colspan="5" style="text-align:center;">
Loading...
</td>
</tr>
`;

const { data, error } = await supabaseClient
.from("products")
.select("*")
.order("id", { ascending:false });

if(error){

console.error(error);

table.innerHTML = `
<tr>
<td colspan="5" style="text-align:center;color:red;">
Failed to load products
</td>
</tr>
`;

return;

}

products = data || [];

if(products.length === 0){

table.innerHTML = `
<tr>
<td colspan="5" style="text-align:center;">
No products yet
</td>
</tr>
`;

return;

}

table.innerHTML = "";

products.forEach(product => {

table.innerHTML += `

<tr>

<td>
<img src="${product.image}">
</td>

<td>${product.name}</td>

<td>${product.brand || "-"}</td>

<td>KES ${product.price}</td>

<td>${product.stock}</td>

<td>

<button class="action-btn edit-btn"
onclick="editProduct('${product.id}')">
Edit
</button>

<button class="action-btn delete-btn"
onclick="deleteProduct('${product.id}')">
Delete
</button>

</td>

</tr>

`;

});

}

/* ADD PRODUCT */
async function addProduct(){

const btn = document.getElementById("addBtn");

btn.innerText = "Saving...";
btn.disabled = true;

try {

const name = document.getElementById("prodName").value.trim();
const price = document.getElementById("prodPrice").value;
const stock = document.getElementById("prodStock").value;

const sizes = document
.getElementById("prodSizes")
.value
.trim();

const category = document.getElementById("prodCategory").value;
 const brand =
document.getElementById("prodBrand").value;
const file = document.getElementById("imageFile").files[0];

 let imageUrl = null;

// IF NEW IMAGE IS UPLOADED
if(file){

  const fileName = Date.now() + "-" + file.name.replace(/\s/g,"");

  const { error: uploadError } = await supabaseClient.storage
    .from("products")
    .upload(fileName, file);

  if(uploadError){
    alert(uploadError.message);
    btn.innerText = "Save Product";
    btn.disabled = false;
    return;
  }

  imageUrl = `https://wylhbyrpmotecjdtjrae.supabase.co/storage/v1/object/public/products/${fileName}`;
}
 

const fileName = Date.now() + "-" + file.name.replace(/\s/g,"");

const { error: uploadError } = await supabaseClient.storage
.from("products")
.upload(fileName, file);

if(uploadError){
alert(uploadError.message);
btn.innerText = "Save Product";
btn.disabled = false;
return;
}

const imageUrl =
`https://wylhbyrpmotecjdtjrae.supabase.co/storage/v1/object/public/products/${fileName}`;

const productData = {
name,
price: Number(price),
stock: Number(stock),
sizes,
category,
brand: brand || null,
image: imageUrl
};

let error;

if(currentEditId){

({ error } = await supabaseClient
.from("products")
.update(productData)
.eq("id", currentEditId));

currentEditId = null;

}else{

({ error } = await supabaseClient
.from("products")
.insert([productData]));

}

if(error){
alert(error.message);
btn.innerText = "Save Product";
btn.disabled = false;
return;
}

alert("Product saved successfully");

clearInputs();
await loadProducts();

} catch(err){
console.error(err);
alert("Unexpected error");
}

btn.innerText = "Save Product";
btn.disabled = false;

}


/* EDIT PRODUCT */
window.editProduct = function(id){

const product = products.find(
p => String(p.id) === String(id)
);

if(!product) return;

document.getElementById("prodName").value =
product.name;

document.getElementById("prodPrice").value =
product.price;

document.getElementById("prodStock").value =
product.stock;
  
  document.getElementById("prodSizes").value =
product.sizes || "";

document.getElementById("prodCategory").value =
product.category;

  document.getElementById("prodBrand").value =
product.brand || "";

document.getElementById("previewImg").src =
product.image;

document.getElementById("previewImg").style.display =
"block";

currentEditId = id;

window.scrollTo({
top:0,
behavior:"smooth"
});

};

/* DELETE PRODUCT */
window.deleteProduct = async function(id){

const confirmDelete =
confirm("Delete this product?");

if(!confirmDelete) return;

await supabaseClient
.from("products")
.delete()
.eq("id", id);

loadProducts();

};

/* LOAD ORDERS */
async function loadOrders(){

const { data, error } = await supabaseClient
.from("orders")
.select("*")
.order("id",{ascending:false});

if(error){
console.error(error);
return;
}

const table =
document.getElementById("ordersTable");

table.innerHTML = "";

(data || []).forEach(order => {

table.innerHTML += `

<tr>

<td>${order.product}</td>

<td>${order.size}</td>

<td>
<span class="badge ${order.status}">
${order.status}
</span>
</td>

</tr>

`;

});

}

/* CLEAR FORM */
function clearInputs(){

document.getElementById("prodName").value = "";

document.getElementById("prodPrice").value = "";

document.getElementById("prodStock").value = "";

document.getElementById("imageFile").value = "";

document.getElementById("previewImg").style.display =
"none";

document.getElementById("prodCategory").selectedIndex = 0;

  document.getElementById("prodBrand").selectedIndex = 0;

  document.getElementById("prodSizes").value = "";

}

/* INIT */
loadProducts();
loadOrders();

