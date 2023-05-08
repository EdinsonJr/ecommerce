const home = document.querySelector('ul > li:nth-child(1)')
const products = document.querySelector('ul > li:nth-child(2)');
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





const dark = document.querySelector("#moon-dark");
dark.addEventListener("click", function() {
document.body.classList.toggle("dark-mode")
});



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
                    <div class="bx-plus" id="${id}"> + </div>
                        <div class="precio">
                            <h3>${price}.00</h3>
                            <p class="${quantity ? "" : "no-stock"}">Stock: ${quantity}</p>
                        </div>
                            <p id="btn">${name}</p>
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
                <p>${item.price}.00 | ${item.price * item.cantidad}</p>
                <div class="cart_items_options" data-id="${item.id}">
                <i class="restar"> - </i>
                <i class="sumar"> + </i>
                <span>${item.cantidad}</span>
                <i class="eliminar"> borrar </i>
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

        if (e.target.classList.contains("bx-plus")) {
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
    <p><b>items: ${cantidadProductos}.00</b></p>
    <p><b>precio total: ${precioTotal}.00</b></p>
    `
    cartTotalHTML.innerHTML = html;
    sumaDenumerosCarrito.textContent = cantidadProductos;
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
    document.querySelector("#btn-buy").addEventListener("click",function () {
        if(!Object.values(db.cart).length) return alert("¡ Debes comprar algo para validar ! 🧐");
        const newProducts = [];
        for (const product of db.products) {
            const productsCart = db.cart[product.id];
            if(product.id === db.cart[product?.id]){
                newProducts.push({
                    ...product,
                    quantity: product.quantity - productsCart.cantidad
                })
            }else{
                newProducts.push(product);
            }
        }
        db.products = newProducts
        db.cart = {};
        updateLocalStorage("products",db.products);
        updateLocalStorage("cart",db.cart);

        printProducts(db);
        printItemsCart(db);
        printTotal(db);
    })
}

main();


window.addEventListener("load", function (){
    setTimeout(function () {
    const loading = document.querySelector(".loading");
    loading.classList.add("loading-none");
    }, 1500);
    
})

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

