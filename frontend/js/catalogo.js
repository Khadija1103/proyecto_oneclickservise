let contenedorServicios;
let inputBusqueda;
let totalServicios;
let serviciosVisibles;

let listaServicios = [];
let textoBusqueda = "";

// ================= MENÚ =================
document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("activo");
        });
    }

    // ELEMENTOS DOM
    contenedorServicios = document.getElementById("servicesGrid");
    inputBusqueda = document.getElementById("searchInput");
    totalServicios = document.getElementById("totalCount");
    serviciosVisibles = document.getElementById("visibleCount");

    // cargar servicios
    const serviciosGuardados = localStorage.getItem("listaServicios");

    listaServicios = serviciosGuardados
        ? JSON.parse(serviciosGuardados)
        : [];

    renderizarServicios();
    actualizarContadores();

    // buscador
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", function () {
            textoBusqueda = this.value.trim();
            renderizarServicios();
        });
    }
});


// ================= FORMATO PRECIO =================
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });
}


// ================= RENDER =================
function renderizarServicios() {

    if (!contenedorServicios) return;

    contenedorServicios.innerHTML = "";

    const serviciosActivos = listaServicios.filter(servicio => {

        const coincideBusqueda =
            servicio.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
            servicio.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase());

        return servicio.activo && coincideBusqueda;
    });

    // contador visibles
    if (serviciosVisibles) {
        serviciosVisibles.textContent = serviciosActivos.length;
    }

    // contador total
    if (totalServicios) {
        totalServicios.textContent = listaServicios.filter(s => s.activo).length;
    }

    // sin resultados
    if (serviciosActivos.length === 0) {
        contenedorServicios.innerHTML = `
            <div class="no-results">
                <h3>No hay servicios disponibles</h3>
            </div>
        `;
        return;
    }

    // render cards
    serviciosActivos.forEach(servicio => {

        contenedorServicios.innerHTML += `
        <div class="service-card">

            <div class="service-img-container">
                <img src="${servicio.imagen}" alt="${servicio.nombre}">
            </div>

            <h3 class="service-card-title">
                ${servicio.nombre}
            </h3>

            <p class="service-card-desc">
                ${servicio.descripcion}
            </p>

            <div class="service-card-price">
                ${formatearPrecio(servicio.precio)}
            </div>

            <button class="btn" onclick="irACita('${servicio.nombre}')">
                Solicitar servicio
            </button>

        </div>
        `;
    });
}


// ================= CONTADORES =================
function actualizarContadores() {

    const activos = listaServicios.filter(s => s.activo).length;

    if (totalServicios) totalServicios.textContent = activos;
    if (serviciosVisibles) serviciosVisibles.textContent = activos;
}


// ================= REDIRECCIÓN =================
function irACita(nombreServicio) {

    localStorage.setItem("servicioSeleccionado", nombreServicio);

    window.location.href = "../carrito/Agendar_Cita.html";
}