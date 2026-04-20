// Lógica de la página del carrito

// Selección de elementos del DOM
const cartBody = document.querySelector("#cart-body");
const contenedorTotal = document.querySelector("#total-cart");
const cartContainer = document.querySelector(".cart-container");
const emptyMsg = document.querySelector("#empty-cart");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Renderizado inicial
function renderizarCarrito(){
    // Limpiamos el cuerpo de la tabla para reconstruir
    cartBody.innerHTML = "";
    let total = 0;

    // Validación de estado vacío
    if (carrito.length === 0) {
        if (cartContainer) cartContainer.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "block";
        
        if (contenedorTotal) contenedorTotal.innerText = "$0";
        actualizarContadorCarrito();
        return;
    }

    // Mostrar contenido si el carrito tiene productos
    if (cartContainer) cartContainer.style.display = "block";
    if (emptyMsg) emptyMsg.style.display = "none";

    // Generar las filas de la tabla
    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const row = document.createElement("tr");
        row.classList.add("cart-row");
        row.innerHTML = `
            <td data-label="Producto">
                <div class="cart-item-info">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="cart-item-img">
                    <span class="cart-item-title">${producto.nombre}</span>
                </div>
            </td>
            <td data-label="Precio">$${producto.precio.toLocaleString()}</td>
            <td data-label="Cantidad">
                <div class="cart-quantity-controls">
                    <button class="quantity-btn minus-btn" data-id="${index}">-</button>
                    <span class="cart-quantity-val">${producto.cantidad}</span>
                    <button class="quantity-btn plus-btn" data-id="${index}">+</button>
                </div>
            </td>
            <td data-label="Subtotal">$${subtotal.toLocaleString()}</td>
            <td>
                <button class="remove-btn" title="Eliminar" data-id="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        cartBody.appendChild(row);
    });

    // Actualizar resumen de compra
    if (contenedorTotal) {
        contenedorTotal.innerText = `$${total.toLocaleString()}`;
    }
    actualizarContadorCarrito();

    // Vinculación de eventos a los botones generados
    const botonesEliminar = document.querySelectorAll(".remove-btn");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });

    const botonesMas = document.querySelectorAll(".plus-btn");
    botonesMas.forEach(boton => {
        boton.addEventListener("click", sumarCantidad);
    });

    const botonesMenos = document.querySelectorAll(".minus-btn");
    botonesMenos.forEach(boton => {
        boton.addEventListener("click", restarCantidad);
    });
}

// Función para actualizar indicador de la navbar
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

// Funciones de control del carrito
function eliminarDelCarrito(e) {
    const index = e.target.closest(".remove-btn").getAttribute("data-id");
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

function sumarCantidad(e) {
    const index = e.target.getAttribute("data-id");
    carrito[index].cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

function restarCantidad(e) {
    const index = e.target.getAttribute("data-id");
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

// Selección del botón de finalizar compra
const btnFinish = document.querySelector("#finish-purchase");

if (btnFinish) {
    btnFinish.addEventListener("click", () => {
        // SweetAlert2 para finalizar la compra
        Swal.fire({
            title: "¡Gracias por tu compra!",
            text: "Tus nuevos amigos de peluche están preparándose para el viaje.",
            icon: "success",
            confirmButtonText: "¡Qué alegría!",
            confirmButtonColor: "#ff9a9e",
            background: "#fff5f5",
            backdrop: `
                rgba(255,192,203,0.4)
                url("../img/confetti.gif")
                left top
                no-repeat
            `
        }).then((result) => {
            if (result.isConfirmed) {
                // Vaciar el carrito después de la compra
                carrito = [];
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderizarCarrito();
            }
        });
    });
}

// Inicialización
renderizarCarrito();
actualizarContadorCarrito();
