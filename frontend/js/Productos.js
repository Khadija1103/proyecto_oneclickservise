// ============================================
// CATÁLOGO DE PRODUCTOS
// ============================================

let contenedorProductos;
let inputBusqueda;
let totalProductos;
let productosVisibles;

let listaProductos = [];
let textoBusqueda = "";

// ============================================
// INICIO
// ============================================
document.addEventListener("DOMContentLoaded", () => {

    contenedorProductos = document.getElementById("servicesGrid");
    inputBusqueda = document.getElementById("searchInput");
    totalProductos = document.getElementById("totalCount");
    productosVisibles = document.getElementById("visibleCount");

    // Cargar productos del administrador
    listaProductos = JSON.parse(localStorage.getItem("listaproductos")) || [];

    renderizarProductos();
    actualizarContadores();

    // Buscador
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", function () {
            textoBusqueda = this.value.trim();
            renderizarProductos();
        });
    }

});

// ============================================
// FORMATO PRECIO
// ============================================
function formatearPrecio(precio) {

    return Number(precio).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

}

// ============================================
// RENDER PRODUCTOS
// ============================================
function renderizarProductos() {

    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";

    const productos = listaProductos.filter(producto => {

        const coincideBusqueda =

            producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||

            producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase());

        return producto.activo === true && coincideBusqueda;

    });

    if (totalProductos)
        totalProductos.textContent = listaProductos.filter(p => p.activo).length;

    if (productosVisibles)
        productosVisibles.textContent = productos.length;

    // Sin productos
    if (productos.length === 0) {

        contenedorProductos.innerHTML = `

        <div class="no-results">

            <h3>📦 No hay productos disponibles.</h3>

            <p>Agrega productos desde el panel de administración.</p>

        </div>

        `;

        return;

    }

    // Render tarjetas
    productos.forEach(producto => {

        contenedorProductos.innerHTML += `

        <div class="service-card">

            <div class="service-img-container">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}">

            </div>

            <h3 class="service-card-title">

                ${producto.nombre}

            </h3>

            <p class="service-card-desc">

                ${producto.descripcion}

            </p>

            <div class="service-card-price">

                ${formatearPrecio(producto.precio)}

            </div>

            <button
                class="btn"
                onclick="agregarAlCarrito('${producto.id}')">

                <i class="bi bi-cart-plus"></i>

                Agregar al carrito

            </button>

        </div>

        `;

    });

}

// ============================================
// CONTADORES
// ============================================
function actualizarContadores() {

    const activos = listaProductos.filter(p => p.activo).length;

    if (totalProductos)
        totalProductos.textContent = activos;

    if (productosVisibles)
        productosVisibles.textContent = activos;

}

// ============================================
// AGREGAR AL CARRITO
// ============================================
function agregarAlCarrito(idProducto) {

    const producto = listaProductos.find(
        p => p.id == idProducto
    );

    if (!producto) return;

    let carrito = JSON.parse(
        localStorage.getItem("carritoProductos")
    ) || [];

    const existe = carrito.find(
        p => p.id == producto.id
    );

    if (existe) {

        existe.cantidad++;

    } else {

        carrito.push({

            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            imagen: producto.imagen,
            precio: Number(producto.precio),
            cantidad: 1

        });

    }

    localStorage.setItem(
        "carritoProductos",
        JSON.stringify(carrito)
    );

    alert("✅ Producto agregado al carrito.");

    // Si deseas ir directamente al carrito, descomenta la siguiente línea:
    // window.location.href = "../carrito/carrito.html";

}

// ============================================
// RECARGAR PRODUCTOS SI CAMBIAN
// ============================================
window.addEventListener("storage", function () {

    listaProductos = JSON.parse(localStorage.getItem("listaproductos")) || [];

    renderizarProductos();

    actualizarContadores();

});

// ============================================
// EXPONER FUNCIONES
// ============================================
window.agregarAlCarrito = agregarAlCarrito;