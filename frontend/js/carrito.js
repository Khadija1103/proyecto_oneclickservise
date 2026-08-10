// ============================================
// CARRITO DE PRODUCTOS
// ============================================

let carrito = JSON.parse(
    localStorage.getItem("carritoProductos")
) || [];


// ============================================
// ELEMENTOS DEL HTML
// ============================================

const contenedorCarrito =
    document.getElementById("contenedorCarrito");

const cantidadServicios =
    document.getElementById("cantidadServicios");

const subtotalHTML =
    document.getElementById("subtotal");

const tarifaHTML =
    document.getElementById("tarifa");

const totalHTML =
    document.getElementById("total");


// ============================================
// FORMATO DE PRECIO
// ============================================

function formatoPrecio(valor) {

    return Number(valor).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

}


// ============================================
// CARGAR CARRITO
// ============================================

function cargarCarrito() {

    try {

        carrito = JSON.parse(
            localStorage.getItem("carritoProductos")
        ) || [];

    } catch (error) {

        console.error(
            "Error leyendo el carrito:",
            error
        );

        carrito = [];

    }

    mostrarCarrito();

}


// ============================================
// MOSTRAR CARRITO
// ============================================

function mostrarCarrito() {

    if (!contenedorCarrito) {
        return;
    }

    contenedorCarrito.innerHTML = "";


    if (carrito.length === 0) {

        contenedorCarrito.innerHTML = `
            <div class="mensaje-vacio">

                <i class="bi bi-cart-x"></i>

                <h3>Tu carrito está vacío</h3>

                <p>
                    Agrega productos desde el catálogo.
                </p>

            </div>
        `;

        actualizarResumen();

        return;
    }


    carrito.forEach(function (producto, index) {

        const cantidad =
            Number(producto.cantidad) || 1;

        const precio =
            Number(producto.precio) || 0;


        contenedorCarrito.innerHTML += `

            <div class="tarjeta tarjeta-servicio">

                <img
                    src="${producto.imagen || ""}"
                    class="imagen-servicio"
                    alt="${producto.nombre || "Producto"}">

                <div class="info-servicio">

                    <h5 class="nombre-servicio">
                        ${producto.nombre || "Producto"}
                    </h5>

                    <p class="descripcion-servicio">
                        ${producto.descripcion || ""}
                    </p>

                    <span class="etiqueta-servicio">

                        <i class="bi bi-box"></i>

                        Producto

                    </span>

                </div>


                <div class="precio-servicio">

                    <strong class="texto-precio">
                        ${formatoPrecio(precio)}
                    </strong>

                </div>


                <div class="control-cantidad">

                    <button
                        type="button"
                        class="boton-cantidad"
                        onclick="restarCantidad(${index})">

                        −

                    </button>


                    <input
                        type="text"
                        class="numero-cantidad"
                        value="${cantidad}"
                        readonly>


                    <button
                        type="button"
                        class="boton-cantidad"
                        onclick="sumarCantidad(${index})">

                        +

                    </button>

                </div>


                <button
                    type="button"
                    class="boton-eliminar"
                    onclick="eliminarProducto(${index})">

                    <i class="bi bi-trash"></i>

                </button>

            </div>

        `;

    });


    actualizarResumen();

}


// ============================================
// SUMAR CANTIDAD
// ============================================

function sumarCantidad(index) {

    if (!carrito[index]) {
        return;
    }

    const cantidadActual =
        Number(carrito[index].cantidad) || 1;

    carrito[index].cantidad =
        cantidadActual + 1;

    guardarCarrito();

}


// ============================================
// RESTAR CANTIDAD
// ============================================

function restarCantidad(index) {

    if (!carrito[index]) {
        return;
    }

    const cantidadActual =
        Number(carrito[index].cantidad) || 1;


    if (cantidadActual > 1) {

        carrito[index].cantidad =
            cantidadActual - 1;

    }


    guardarCarrito();

}


// ============================================
// ELIMINAR PRODUCTO
// ============================================

function eliminarProducto(index) {

    if (
        index < 0 ||
        index >= carrito.length
    ) {
        return;
    }

    carrito.splice(index, 1);

    guardarCarrito();

}


// ============================================
// GUARDAR CARRITO
// ============================================

function guardarCarrito() {

    localStorage.setItem(
        "carritoProductos",
        JSON.stringify(carrito)
    );


    mostrarCarrito();


    if (
        typeof window.mostrarCarritoNavbar ===
        "function"
    ) {

        window.mostrarCarritoNavbar();

    }

}


// ============================================
// ACTUALIZAR RESUMEN
// ============================================

function actualizarResumen() {

    let subtotal = 0;
    let cantidad = 0;


    carrito.forEach(function (producto) {

        const precio =
            Number(producto.precio) || 0;

        const cantidadProducto =
            Number(producto.cantidad) || 0;


        subtotal +=
            precio * cantidadProducto;


        cantidad +=
            cantidadProducto;

    });


    const tarifa =
        subtotal * 0.19;

    const total =
        subtotal + tarifa;


    if (cantidadServicios) {

        cantidadServicios.textContent =
            cantidad;

    }


    if (subtotalHTML) {

        subtotalHTML.textContent =
            formatoPrecio(subtotal);

    }


    if (tarifaHTML) {

        tarifaHTML.textContent =
            formatoPrecio(tarifa);

    }


    if (totalHTML) {

        totalHTML.textContent =
            formatoPrecio(total);

    }

}


// ============================================
// VACIAR CARRITO
// ============================================

function vaciarCarrito() {

    carrito = [];

    localStorage.removeItem(
        "carritoProductos"
    );


    mostrarCarrito();


    if (
        typeof window.mostrarCarritoNavbar ===
        "function"
    ) {

        window.mostrarCarritoNavbar();

    }

}


// ============================================
// PAGAR PRODUCTOS
// ============================================

function pagarProductos() {

    const usuario =
        localStorage.getItem(
            "usuarioLogueado"
        );


    // ----------------------------------------
    // USUARIO NO LOGUEADO
    // ----------------------------------------

    if (!usuario) {

        alert(
            "Debes iniciar sesión para realizar el pago."
        );


        window.location.href =
            "../inicio/login.html";


        return;

    }


    // ----------------------------------------
    // CARRITO VACÍO
    // ----------------------------------------

    if (
        !carrito ||
        carrito.length === 0
    ) {

        alert(
            "Tu carrito está vacío."
        );


        return;

    }


    // ----------------------------------------
    // IR A PAGAR
    // ----------------------------------------

    window.location.href =
        "pagar.html";

}


// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarCarrito();


        const btnPagar =
            document.getElementById(
                "btnPagarProductos"
            );


        if (btnPagar) {

            btnPagar.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    pagarProductos();

                }
            );

        }

    }
);


// ============================================
// EXPORTAR FUNCIONES
// ============================================

window.sumarCantidad =
    sumarCantidad;

window.restarCantidad =
    restarCantidad;

window.eliminarProducto =
    eliminarProducto;

window.vaciarCarrito =
    vaciarCarrito;

window.pagarProductos =
    pagarProductos;

