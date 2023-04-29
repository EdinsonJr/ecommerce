const hola = document.querySelector("header");

function animarNav() {
    let scroll = window.scrollY
    if (scroll > 80) {
        hola.classList.add("navbar-scroll")
    }
    else{
        hola.classList.remove("navbar-scroll")
    }
}

window.onscroll = () => animarNav();