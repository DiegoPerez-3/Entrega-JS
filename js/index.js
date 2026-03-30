// Lógica para la página principal de la tienda

// Selección de elementos
const botonesAgregar = document.querySelectorAll(".product-actions button:nth-child(2)");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonesMas = document.querySelectorAll(".product-actions button:nth-child(3)");
const botonesMenos = document.querySelectorAll(".product-actions button:nth-child(1)");

// Escuchadores de eventos para los botones de compra
botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
});

botonesMas.forEach(boton => {
    boton.addEventListener("click", (e) => modificarCantidad(e, 1));
});

botonesMenos.forEach(boton => {
    boton.addEventListener("click", (e) => modificarCantidad(e, -1));
});

function agregarAlCarrito(e) {
    modificarCantidad(e, 1);
    
    const productoCard = e.target.closest(".product-card");
    const nombre = productoCard.querySelector("h3").textContent;
    alert(`¡${nombre} se agregó correctamente!`);
}

function modificarCantidad(e, cambio) {
    const botonClickeado = e.target;
    const productoCard = botonClickeado.closest(".product-card");

    const nombre = productoCard.querySelector("h3").textContent;
    const precioTexto = productoCard.querySelector(".product-price").textContent;
    const precio = Number(precioTexto.replace("$", "").replace(".", ""));
    const imagenSrc = productoCard.querySelector("img").src;

    const index = carrito.findIndex(item => item.nombre === nombre);

    if (index !== -1) {
        carrito[index].cantidad += cambio;
        
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
    } else if (cambio > 0) {
        const producto = {
            nombre,
            precio,
            imagen: imagenSrc,
            cantidad: 1
        };
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    actualizarBotones();
}

// Función para mostrar la cantidad actual en los botones
function actualizarBotones() {
    const cards = document.querySelectorAll(".product-card");
    
    cards.forEach(card => {
        const nombre = card.querySelector("h3").textContent;
        const btn = card.querySelector(".add-to-cart-btn");
        const productoEnCarrito = carrito.find(item => item.nombre === nombre);
        
        if (productoEnCarrito) {
            btn.textContent = `${productoEnCarrito.cantidad} Agregado${productoEnCarrito.cantidad > 1 ? "s" : ""}`;
            btn.style.color = "var(--accent-color)";
            btn.style.fontWeight = "bold";
        } else {
            btn.textContent = "Agregar al carrito";
            btn.style.color = "var(--primary-color)";
            btn.style.fontWeight = "normal";
        }
    });
}

// Actualización del indicador visual de la navbar
function actualizarContadorCarrito() {
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
        let totalItems = 0;
        carrito.forEach(item => {
            totalItems += item.cantidad;
        });
        cartCount.textContent = totalItems;
    }
}

// Inicialización de la vista
actualizarContadorCarrito();
actualizarBotones();