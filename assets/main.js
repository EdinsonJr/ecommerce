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


