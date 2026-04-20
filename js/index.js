// Lógica para la página principal de la tienda
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = []; // Array para guardar los peluches que traigamos del JSON

// Función para obtener los productos desde nuestro archivo local JSON
async function obtenerProductos() {
    try {
        // Hacemos el pedido a nuestro archivo con fetch
        const response = await fetch('./data/productos.json');
        productos = await response.json();
        
        // Una vez que tenemos los datos, los mostramos en la tienda
        mostrarProductos(productos);
    } catch (error) {
        console.error("Hubo un error al cargar los peluches:", error);
    }
}

// Función para renderizar los peluches en el HTML
function mostrarProductos(listaProductos) {
    const contenedor = document.querySelector(".products-grid");
    contenedor.innerHTML = ""; // Limpiamos por las dudas

    listaProductos.forEach(prod => {
        const article = document.createElement("article");
        article.classList.add("product-card");
        article.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${prod.imagen}" alt="${prod.nombre}">
            </div>
            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <p class="product-price">$${prod.precio.toLocaleString('es-AR')}</p>
                <div class="product-actions" data-product-id="${prod.id}">
                    <button class="quantity-btn minus-btn">-</button>
                    <button class="add-to-cart-btn">Agregar al carrito</button>
                    <button class="quantity-btn plus-btn">+</button>
                </div>
            </div>
        `;
        contenedor.appendChild(article);
    });

    // Una vez creados los elementos, les agregamos los eventos
    asignarEventos();
    // Y actualizamos el estado visual de los botones
    actualizarBotones();
}

// Función para asignar los eventos a los botones recién creados
function asignarEventos() {
    const botonesAgregar = document.querySelectorAll(".add-to-cart-btn");
    const botonesMas = document.querySelectorAll(".plus-btn");
    const botonesMenos = document.querySelectorAll(".minus-btn");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    botonesMas.forEach(boton => {
        boton.addEventListener("click", (e) => modificarCantidad(e, 1));
    });

    botonesMenos.forEach(boton => {
        boton.addEventListener("click", (e) => modificarCantidad(e, -1));
    });
}

function agregarAlCarrito(e) {
    modificarCantidad(e, 1);
}

function modificarCantidad(e, cambio) {
    const botonClickeado = e.target;
    const productoCard = botonClickeado.closest(".product-card");

    const nombre = productoCard.querySelector("h3").textContent;
    const precioTexto = productoCard.querySelector(".product-price").textContent;
    const precio = Number(precioTexto.replace("$", "").replace(".", "").replace(/\s/g, ""));
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

    // Notificaciones con Toastify
    if (cambio > 0) {
        if (index === -1) {
            Toastify({
                text: `¡${nombre} se agregó correctamente!`,
                duration: 3000,
                gravity: "top",
                position: "right",
                offset: { y: 90 },
                style: {
                    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
                    borderRadius: "10px",
                    fontWeight: "bold"
                }
            }).showToast();
        } else {
            Toastify({
                text: `Sumaste un ${nombre}`,
                duration: 1500,
                gravity: "top",
                position: "right",
                offset: { y: 90 },
                style: { background: "#a1887f", borderRadius: "8px" }
            }).showToast();
        }
    } else if (cambio < 0) {
        Toastify({
            text: `Restaste un ${nombre}`,
            duration: 1500,
            gravity: "top",
            position: "right",
            offset: { y: 90 },
            style: { background: "#ef5350", borderRadius: "8px" }
        }).showToast();
    }
}

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

// Inicialización de la aplicación
actualizarContadorCarrito();
obtenerProductos();