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
    console.log(scroll);
}

window.onscroll = () => animarNav();


const dark = document.querySelector("#moon-dark");
dark.addEventListener("click", function() {
document.body.classList.toggle("dark-mode")
});

async function peticion(){
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
        const ecommerce = await data.json();
        return ecommerce;
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const ecomme = await peticion()
    let html='';
    for (const { id,name,category,image,price,quantity } of ecomme) {
        
        html += `
        <div class ="description ${category} id="${id}">
        <div class="description-img">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="description-info">
                    <div class="bx-plus"> + </div>
                        <div class="precio">
                            <h3>${price}.00</h3>
                            <p>Stock: ${quantity}</p>
                        </div>
                            <p>${name}</p>
                    </div>
                    </div>
        `
        
    }
    
    document.querySelector(".items").innerHTML = html;

    mixitup(".items",{
        selectors:{
            target:'.description'
        },
        animation:{
            duration:300
        } 
            
    })
}

main();


window.addEventListener("load", function (){
    setTimeout(function () {
    const loading = document.querySelector(".loading");
    loading.classList.add("loading-none");
    }, 1500);
    
})