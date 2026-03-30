// // 1. getElementById
// const titulo = document.getElementById("titulo");
// console.log(titulo);

// // 2. querySelector
// const boton = document.querySelector(".cta-button");
// console.log(boton);

// // 3. querySelectorAll
// const productos = document.querySelectorAll(".product-card");
// console.log(productos);

const titulo = document.getElementById("titulo");

// Cambiar Texto - Texto Plano
titulo.textContent = "Nuevo Texto";

// HTML Interno - Interpreta el HTML
titulo.innerHTML = "<span>Hola</span>";

// Cambiar Estilos
titulo.style.color = "red";
titulo.style.fontSize = "2rem";
titulo.style.fontWeight = "bold";

// Agergar Clases
titulo.classList.add("new-class");

// Remover Clases
titulo.classList.remove("new-class");

// Alternar Clases
titulo.classList.toggle("new-class");



// Eventos
// Es una acción que pasa en la página

const boton = document.querySelector(".cta-button");

boton.addEventListener("click", function() {
    console.log("¡Click!");
})
