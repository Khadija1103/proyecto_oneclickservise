// ============================================
// 1. VARIABLES GLOBALES (LISTA VACÍA POR AHORA)
// ============================================
// esta lista se llenará con lo que traiga la API
let listaServicios = []; 

let filtroActual = 'todos'; 
let textoBusqueda = '';

// ============================================
// 2. REFERENCIAS AL DOM (HTML)
// ============================================
const servicesGrid = document.getElementById("servicesGrid");
const searchInput = document.getElementById("searchInput");
const totalCount = document.getElementById("totalCount");
const visibleCount = document.getElementById("visibleCount");

const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterInactive = document.getElementById("filterInactive");
const clearFilters = document.getElementById("clearFilters");

// ============================================
// 3. CONEXIÓN CON LA API (DEJADA VACÍA PARA EL MOMENTO)
// ============================================
async function cargarServiciosDesdeAPI() {
    try {
        // ---------------------------------------------------------
        // TODO: Cuando llegue el momento, hacer el fetch aquí:
        // const respuesta = await fetch("TU_URL_DE_LA_API");
        // listaServicios = await respuesta.json();
        // ---------------------------------------------------------

        // Por ahora, dejamos la lista vacía o puedes descomentar estas líneas de abajo
        // para probar el diseño en el navegador antes de conectar la API real:
        /*
        listaServicios = [
            { id: 1, nombre: "Limpieza General", descripcion: "Limpieza profunda de oficinas y casas.", activo: true },
            { id: 2, nombre: "Plomería", descripcion: "Reparación de tuberías y fugas de agua.", activo: true },
            { id: 3, nombre: "Electricidad", descripcion: "Instalaciones eléctricas y reparación de cortos.", activo: false }
        ];
        */

        // Ejecuta el dibujo en pantalla
        renderizarServicios();

    } catch (error) {
        console.error("Error al cargar los servicios:", error);
    }
}

// ============================================
// 4. ACCIÓN: CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
// ============================================
window.cambiarEstadoServicio = async function(id, estadoActual) {
    try {
        const nuevoEstado = !estadoActual;

        // ---------------------------------------------------------
        // TODO: Cuando llegue el momento, hacer la petición PUT/PATCH aquí:
        // await fetch(`TU_URL_DE_LA_API/${id}`, { ... });
        // ---------------------------------------------------------

        // Cambio lógico local para ver el efecto visual inmediatamente:
        const servicio = listaServicios.find(s => s.id === id);
        if (servicio) {
            servicio.activo = nuevoEstado;
            renderizarServicios(); // Redibuja la interfaz
        }

    } catch (error) {
        console.error("Error al cambiar el estado:", error);
    }
};

// ============================================
// 5. FUNCIÓN DE RENDERIZADO (DIBUJAR EN HTML)
// ============================================
function renderizarServicios() {
    // Filtros en tiempo real (Buscador + Botones de estado)
    const serviciosFiltrados = listaServicios.filter(servicio => {
        const nombre = servicio.nombre ? servicio.nombre.toLowerCase() : '';
        const descripcion = servicio.descripcion ? servicio.descripcion.toLowerCase() : '';
        const buscar = textoBusqueda.toLowerCase();

        const coincideTexto = nombre.includes(buscar) || descripcion.includes(buscar);
        
        const coincideFiltro = filtroActual === 'todos' || 
                               (filtroActual === 'activos' && servicio.activo) || 
                               (filtroActual === 'inactivos' && !servicio.activo);
        
        return coincideTexto && coincideFiltro;
    });

    // Limpiar el contenedor
    servicesGrid.innerHTML = "";

    // Mensaje si no hay servicios cargados o encontrados
    if (serviciosFiltrados.length === 0) {
        servicesGrid.innerHTML = `<p class="text-center w-100 text-muted">No hay servicios disponibles en este momento.</p>`;
    }

    // Crear las tarjetas dinámicamente
    serviciosFiltrados.forEach(servicio => {
        const card = document.createElement("div");
        
        // Mantenemos las clases dinámicas para que el CSS de Oscar le aplique los estilos correctos según el estado
        card.className = `service-card ${servicio.activo ? 'card-activo' : 'card-inactivo'}`;
        
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h3>
                        ${servicio.nombre}
                    </h3>
                    <p class="text-muted">${servicio.descripcion || 'Sin descripción disponible'}</p>
                    <span class="badge ${servicio.activo ? 'bg-success' : 'bg-danger'}">
                        ${servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div>
                    <button class="btn ${servicio.activo ? 'btn-outline-danger' : 'btn-outline-success'}" 
                            onclick="cambiarEstadoServicio(${servicio.id}, ${servicio.activo})">
                        <i class="bi ${servicio.activo ? 'bi-x-circle' : 'bi-check-circle'}"></i> 
                        ${servicio.activo ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            </div>
        `;
        servicesGrid.appendChild(card);
    });

    // Actualizar contadores del HTML de Oscar
    totalCount.textContent = listaServicios.length;
    visibleCount.textContent = serviciosFiltrados.length;
}

// ============================================
// 6. ESCUCHADORES DE EVENTOS (LISTENERS)
// ============================================
searchInput.addEventListener("input", (e) => {
    textoBusqueda = e.target.value;
    renderizarServicios();
});

filterAll.addEventListener("click", () => { filtroActual = 'todos'; renderizarServicios(); });
filterActive.addEventListener("click", () => { filtroActual = 'activos'; renderizarServicios(); });
filterInactive.addEventListener("click", () => { filtroActual = 'inactivos'; renderizarServicios(); });

clearFilters.addEventListener("click", () => {
    searchInput.value = '';
    textoBusqueda = '';
    filtroActual = 'todos';
    renderizarServicios();
});

// Arrancar la carga apenas abra la vista
document.addEventListener("DOMContentLoaded", cargarServiciosDesdeAPI);