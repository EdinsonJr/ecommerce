const home = document.querySelector('#home')
const products = document.querySelector('#produtoss');
const hola = document.querySelector("header");

function animarNav() {
    let scroll = window.scrollY;
    if (scroll > 80) {
        hola.classList.add("navbar-scroll");
    }
    else{
        hola.classList.remove("navbar-scroll");
    }
    if (scroll <= 450 || scroll === 0) {
        home.classList.add("principal");
    } else {
        home.classList.remove("principal")
    }
    if (scroll >= 450) {
        products.classList.add("principal")
    }
    else{
        products.classList.remove("principal")
    }
}

window.onscroll = () => animarNav();


function darkMode() {
    const dark = document.querySelector("#moon-dark");
const body = document.body;
const isDarkMode = localStorage.getItem("isDarkMode") === "true";
if (isDarkMode) {
body.classList.add("dark-mode");
}
dark.addEventListener("click", function() {
body.classList.toggle("dark-mode");
const isDarkMode = body.classList.contains("dark-mode");
localStorage.setItem("isDarkMode", isDarkMode);
});
}

function updateLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

async function peticion(){
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
        const ecommerce = await data.json();
        updateLocalStorage(products,ecommerce)
        return ecommerce;
    } catch (error) {
        console.error(error);
    }
}

function printProducts (db){
    let html='';
    for (const { id,name,category,image,price,quantity,description } of db.products) {
        
        html += `
        <div class ="description ${category} id="${id}">
        <div class="description-img">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="description-info">
                   ${quantity ? ` <div class="bx-pluss" id="${id}"> + </div>`
                                : `<div></div`}
                        <div class="precio">
                            <h3>${price}.00</h3>
                            <p class="${quantity ? "": "no-stock"}">Stock: ${quantity ? quantity: "[agotado]"}</p>

                        </div>
                           
                            ${quantity ? ` <p id="btn">${name}</p>` : `<p> </p>` }
                    </div>
                    </div>
        `;



    
    document.querySelector(".items").innerHTML = html;

    }
}
function mostrarCarritoDeCompras() {
    const iconCartHTML = document.querySelector("#icon-cart");
    const cart = document.querySelector(".cart");
    iconCartHTML.addEventListener("click",function(){
        cart.classList.toggle("cart-show");
    });
}

function printItemsCart(db) {
    let html = '';
            Object.values(db.cart).forEach((item) => {
                html += `
                <div class="items__cart">
                <div class="item__cart-img"> 
                <img src="${item.image}">
                </div>

                <div class="cart-body">
                <h3> ${item.name} </h3>
                <p>Stock: ${item.quantity} | ${item.price}.00</p>
                <p>Subtotal: ${item.price * item.cantidad}.00</p>
                <div class="cart_items_options" data-id="${item.id}">
                <i class='bx bx-minus restar'></i>
                <span>${item.cantidad} units </span>
                <i class='bx bx-plus sumar'></i>
                <i class='bx bx-trash eliminar'></i>
                </div>
                </div>

                </div>
                `

            });
            document.querySelector(".cart-products").innerHTML = html;
}

function addCartFromItems(db) {
    const itemsHtml = document.querySelector(".items");
    itemsHtml.addEventListener("click",function (e){

        if (e.target.classList.contains("bx-pluss")) {
            const itemsId = parseInt(e.target.id);
            const itemsFind = db.products.find(function (product) {
                return product.id === itemsId;
            })
            if (db.cart[itemsId]) {
                if(db.cart[itemsId].cantidad === db.cart[itemsId].quantity) return alert("Ya se nos agoto el producto ❌")
                db.cart[itemsId].cantidad += 1;
            } else {
                db.cart[itemsId]=structuredClone(itemsFind);
                db.cart[itemsId].cantidad = 1;
            }
            updateLocalStorage("cart",db.cart)
            printItemsCart(db);
            printTotal(db);
        }
    })
}

function operacionesCard(db) {
    const cartProductsHTML = document.querySelector(".cart-products");
    cartProductsHTML.addEventListener("click",function (e) {

        if (e.target.classList.contains("restar")) {
            const productId = Number(e.target.parentElement.dataset.id);
            if (db.cart[productId].cantidad === 1) {
                delete db.cart[productId];
                const responder = confirm("Estas seguro que quieres eliminar este producto 😯?");
                if(!responder) return
            }else{

                db.cart[productId].cantidad -= 1;
            }
           
        }
        if (e.target.classList.contains("sumar")) {
            const productId = Number(e.target.parentElement.dataset.id)
            if(db.cart[productId].cantidad === db.cart[productId].quantity) return alert("Ya se nos agoto el producto ❌");
            db.cart[productId].cantidad += 1;
        }
        if (e.target.classList.contains("eliminar")) {
            const productId = Number(e.target.parentElement.dataset.id);
            delete db.cart[productId]
            const responder = confirm("Estas seguro que quieres eliminar este producto 😯?");
            if(!responder) return
        }
        printItemsCart(db)
        updateLocalStorage("cart",db.cart);
        printTotal(db);
    })
}

function printTotal(db) {
    const sumaDenumerosCarrito = document.querySelector("#cantidad-productos-id");
    const cartTotalHTML = document.querySelector(".cart-total-info");
    let cantidadProductos = 0;
    let precioTotal = 0;
    Object.values(db.cart).forEach((item) =>{
        cantidadProductos += item.cantidad;
        precioTotal += item.cantidad * item.price
    })
    let html = `
    <div class="total-item-valor">
    <p><b> ${cantidadProductos} items</b></p>
    <p><b>$ ${precioTotal}.00</b></p> </div>
    `
    cartTotalHTML.innerHTML = html;
    sumaDenumerosCarrito.textContent = cantidadProductos;
}

function logicaCartCompra(db) {
    const btnBuy = document.querySelector('#btn-buy');
    btnBuy.addEventListener('click', function () {
        if(!Object.values(db.cart).length) return alert('Debes agregar para comprar ❓');
        const response = confirm('Estas seguro que quieres comprar ❓');
        if(!response) return;
    
        const actInventario = [];
        for (const product of db.products){
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id){
                actInventario.push({
                    ...product,
                    quantity: product.quantity - productCart.cantidad,
                    
                });
            }else{
                actInventario.push(product);
            }           
    }
    
    db.products = actInventario;
    db.cart = {};
    
    window.localStorage.setItem('products', JSON.stringify(db.products));
    window.localStorage.setItem('cart', JSON.stringify(db.cart));
    
    printProducts(db);
    printItemsCart(db);
    printTotal(db);
    
    });
}
function mixitupo (){
    mixitup(".items",{
        selectors:{
            target:'.description'
        },
        animation:{
            duration:300
        } 
            
    })
}
function modalDescription() {
    
    let pantallaModalDescripcion = `
<div class="content-modal1">
    <div class="boton-cerrar"><span>x</span></div>
    <div class="img-modal">
        <img src="${image}" alt="">
    </div>
    <h3>${name}</h3>
    <p>${description}</p>
    <div class="precio-modal1">
    <h3>${price}.00</h3>
    <p>stock: ${quantity}</p>
    
    </div>
    
</div>
`;

document.querySelector(".modal1").innerHTML = pantallaModalDescripcion;
}
window.addEventListener("load", function (){
    setTimeout(function () {
    const loading = document.querySelector(".loading");
    loading.classList.add("loading-none");
    }, 1500);
    
})
function menuAmburguesa() {
    const menuAmburguesa = document.querySelector(".tercer-hijo-svg");
    const menu = document.querySelector("#menu");
    const xMenu = document.querySelector("#x-menu");
    menuAmburguesa.addEventListener("click",function(){
        menu.classList.add("menu_regreso");
    });
    xMenu.addEventListener("click",function (){
        menu.classList.remove("menu_regreso");
    });

}
function desplamientoHomeYProducts() {
    const hogar = document.querySelector("#home");
    const productosNav = document.querySelector("#produtoss");
    hogar.addEventListener("click",function () {
        menu.classList.remove("menu_regreso");
    });
    productosNav.addEventListener("click",function () {
        menu.classList.remove("menu_regreso");
    });
}
function cerrarCarritoConX() {
    const carritoCerrar = document.querySelector("#x-carrito");
        carritoCerrar.addEventListener("click",function () {

    const cart = document.querySelector(".cart");
    carritoCerrar.addEventListener("click",function(){
        cart.classList.remove("cart-show");
    });
        });
    
}
async function main() {
    const db = {
        products: JSON.parse(localStorage.getItem('products')) ||  await peticion(),
        cart: JSON.parse(localStorage.getItem("cart")) || {},
    }
    
    printProducts(db);
    mostrarCarritoDeCompras();
    mixitupo();
    printItemsCart(db);
    addCartFromItems(db);
    operacionesCard(db);
    printTotal(db);
    logicaCartCompra(db);
    menuAmburguesa();
    desplamientoHomeYProducts();
    darkMode();
    cerrarCarritoConX();
    
}

main();








