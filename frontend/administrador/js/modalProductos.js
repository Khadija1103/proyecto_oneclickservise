// =========================
// VARIABLES GLOBALES
// =========================
let listaproductos = [];
let filtroActual = "todos";
let textoBusqueda = "";
let indiceProductoEditar = null;
let modoCatalogo = false;

// Detectar si estamos en modo catálogo (por la URL o por un ID)
if (document.getElementById("catalogoMode") !== null) {
    modoCatalogo = true;
}

// =========================
// REFERENCIAS HTML
// =========================
const contenedorproductos = document.getElementById("servicesGrid");
const contadorTotal = document.getElementById("totalCount");
const contadorVisibles = document.getElementById("visibleCount");
const buscadorproductos = document.getElementById("searchInput");

// Botones principales (solo en modo administración)
const botonAgregarProducto = document.getElementById("btnAgregarProducto");
const botonFiltroTodos = document.getElementById("filterAll");
const botonFiltroActivos = document.getElementById("filterActive");
const botonFiltroInactivos = document.getElementById("filterInactive");
const botonLimpiarFiltros = document.getElementById("clearFilters");

// Ventanas modales (solo en modo administración)
const modalAgregarProducto = document.getElementById("modalAgregarProducto");
const cerrarModalAgregar = document.getElementById("cerrarModalAgregar");
const formularioAgregarProducto = document.getElementById("formularioAgregarProducto");
const modalEditarProducto = document.getElementById("modalEditarProducto");
const cerrarModalEditar = document.getElementById("cerrarModalEditar");
const formularioEditarProducto = document.getElementById("formularioEditarProducto");

// Elementos del catálogo
const tituloCatalogo = document.getElementById("tituloCatalogo");
const subtituloCatalogo = document.getElementById("subtituloCatalogo");

// =========================
// CONFIGURACIÓN DE VALIDACIONES
// =========================
const validacionesProducto = {
    nombre: {
        regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
        min: 4,
        max: 30,
        mensaje: "El nombre debe tener entre 4 y 30 caracteres y solo letras"
    },
    descripcion: {
        regex: /^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,;:!?\-]+$/,
        min: 50,
        max: 1000,
        mensaje: "La descripción debe tener entre 50 y 1000 caracteres y solo letras o números"
    },
    precio: {
        regex: /^\d+$/,
        min: 1,
        max: 99999999,
        mensaje: "El precio solo debe contener números"
    }
};

// =========================
// FUNCIONES DE COMPRESIÓN DE IMÁGENES (NUEVO)
// =========================

function comprimirImagen(base64, calidad = 0.5, maxWidth = 500, maxHeight = 500) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensiones manteniendo proporción
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Comprimir a JPEG con calidad reducida
            const dataUrl = canvas.toDataURL('image/jpeg', calidad);
            resolve(dataUrl);
        };
        img.onerror = function() {
            resolve(base64); // Si falla, usar la original
        };
    });
}

// =========================
// FUNCIÓN PARA VERIFICAR ESPACIO EN LOCALSTORAGE
// =========================
function verificarEspacioStorage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16
        }
    }
    const limite = 5 * 1024 * 1024; // 5MB
    return {
        usado: total,
        disponible: limite - total,
        porcentaje: (total / limite) * 100
    };
}

// =========================
// FUNCIÓN PARA LIMPIAR IMÁGENES ANTIGUAS
// =========================
function limpiarImagenesAntiguas() {
    const espacio = verificarEspacioStorage();
    if (espacio.porcentaje > 75) {
        console.warn('⚠️ Almacenamiento casi lleno. Limpiando imágenes antiguas...');
        
        // Ordenar productos por fecha (los más antiguos primero)
        const productosConImagen = listaproductos.filter(s => s.imagen && s.imagen.length > 1000);
        if (productosConImagen.length > 10) {
            productosConImagen.sort((a, b) => {
                const fechaA = parseInt(a.id) || 0;
                const fechaB = parseInt(b.id) || 0;
                return fechaA - fechaB;
            });
            
            // Eliminar imágenes de los productos más antiguos (dejar solo los 10 más recientes)
            const eliminar = productosConImagen.slice(0, productosConImagen.length - 10);
            eliminar.forEach(s => {
                s.imagen = ''; // Limpiar imagen
                console.log(`🧹 Imagen eliminada del producto: ${s.nombre}`);
            });
            
            localStorage.setItem("listaproductos", JSON.stringify(listaproductos));
        }
    }
}

// =========================
// FUNCIONES DE VALIDACIÓN
// =========================

function validarCampo(input, config, id) {
    const valor = input.value.trim();
    const errorEl = document.getElementById(`error-${id}`);
    const exitoEl = document.getElementById(`exito-${id}`);
    const iconoEl = document.getElementById(`icono-${id}`);

    let esValido = true;
    let mensajeError = "";

    if (valor.length === 0) {
        esValido = false;
        mensajeError = "Este campo es obligatorio";
    } else if (valor.length < config.min) {
        esValido = false;
        mensajeError = `Mínimo ${config.min} caracteres`;
    } else if (valor.length > config.max) {
        esValido = false;
        mensajeError = `Máximo ${config.max} caracteres`;
    } else if (!config.regex.test(valor)) {
        esValido = false;
        mensajeError = config.mensaje;
    }

    input.classList.remove("successInput", "errorInput");

    if (esValido) {
        input.classList.add("successInput");
        if (errorEl) {
            errorEl.classList.remove("visible");
            errorEl.textContent = "";
        }
        if (exitoEl) {
            exitoEl.textContent = "✓ Válido";
            exitoEl.classList.add("visible");
        }
        if (iconoEl) {
            iconoEl.textContent = "✅";
            iconoEl.classList.add("visible");
        }
    } else {
        input.classList.add("errorInput");
        if (errorEl) {
            errorEl.textContent = mensajeError || config.mensaje;
            errorEl.classList.add("visible");
        }
        if (exitoEl) {
            exitoEl.classList.remove("visible");
        }
        if (iconoEl) {
            iconoEl.textContent = "❌";
            iconoEl.classList.add("visible");
        }
    }

    return esValido;
}

// Bloquear letras en precio
function bloquearLetrasPrecio(input) {
    input.addEventListener('keypress', function(e) {
        const charCode = e.which || e.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/^\d$/.test(char)) {
            e.preventDefault();
            const errorEl = document.getElementById('error-precioAgregar');
            if (errorEl) {
                errorEl.textContent = "El precio solo permite números";
                errorEl.classList.add('visible');
            }
        }
    });
}

// Bloquear números en nombre
function bloquearNumerosNombre(input, idError) {
    input.addEventListener('keypress', function(e) {
        const charCode = e.which || e.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            const errorEl = document.getElementById(idError);
            if (errorEl) {
                errorEl.textContent = "El nombre solo permite letras";
                errorEl.classList.add('visible');
            }
        }
    });
}

// Bloquear caracteres especiales en descripción
function bloquearCaracteresEspecialesDescripcion(input, idError) {
    input.addEventListener('keypress', function(e) {
        const charCode = e.which || e.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,;:!?\-]$/.test(char)) {
            e.preventDefault();
            const errorEl = document.getElementById(idError);
            if (errorEl) {
                errorEl.textContent = "La descripción solo permite letras, números y signos de puntuación";
                errorEl.classList.add('visible');
            }
        }
    });
}

// =========================
// MENÚ
// =========================
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

if (menuBtn && menu && !modoCatalogo) {
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("activo");
    });

    document.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.classList.remove("activo");
        }
    });
}

// =========================
// CONFIGURAR VALIDACIONES EN TIEMPO REAL - AGREGAR (solo modo admin)
// =========================
if (!modoCatalogo) {
    const nombreAgregar = document.getElementById("nombreProductoAgregar");
    const descripcionAgregar = document.getElementById("descripcionProductoAgregar");
    const precioAgregar = document.getElementById("precioProductoAgregar");
    const imagenAgregar = document.getElementById("imagenProductoAgregar");

    if (nombreAgregar) {
        bloquearNumerosNombre(nombreAgregar, 'error-nombreAgregar');
        nombreAgregar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.nombre, 'nombreAgregar');
        });
        nombreAgregar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.nombre, 'nombreAgregar');
        });
    }

    if (descripcionAgregar) {
        bloquearCaracteresEspecialesDescripcion(descripcionAgregar, 'error-descripcionAgregar');
        descripcionAgregar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.descripcion, 'descripcionAgregar');
            const contador = document.getElementById("contador-descripcionAgregar");
            if (contador) {
                const length = this.value.length;
                contador.textContent = `${length} / 1000 caracteres`;
                if (length > 1000) {
                    contador.classList.add("excedido");
                } else {
                    contador.classList.remove("excedido");
                }
            }
        });
        descripcionAgregar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.descripcion, 'descripcionAgregar');
        });
    }

    if (precioAgregar) {
        bloquearLetrasPrecio(precioAgregar);
        precioAgregar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.precio, 'precioAgregar');
        });
        precioAgregar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.precio, 'precioAgregar');
        });
    }

    if (imagenAgregar) {
        imagenAgregar.addEventListener("change", function() {
            const file = this.files[0];
            const errorEl = document.getElementById("error-imagenAgregar");
            const exitoEl = document.getElementById("exito-imagenAgregar");
            const iconoEl = document.getElementById("icono-imagenAgregar");

            this.classList.remove("successInput", "errorInput");

            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    this.classList.add("errorInput");
                    if (errorEl) {
                        errorEl.textContent = "La imagen no debe superar los 2MB";
                        errorEl.classList.add("visible");
                    }
                    if (exitoEl) {
                        exitoEl.classList.remove("visible");
                    }
                    if (iconoEl) {
                        iconoEl.textContent = "❌";
                        iconoEl.classList.add("visible");
                    }
                    return;
                }
                const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
                if (!tiposPermitidos.includes(file.type)) {
                    this.classList.add("errorInput");
                    if (errorEl) {
                        errorEl.textContent = "Solo se permiten JPG, PNG o WEBP";
                        errorEl.classList.add("visible");
                    }
                    if (exitoEl) {
                        exitoEl.classList.remove("visible");
                    }
                    if (iconoEl) {
                        iconoEl.textContent = "❌";
                        iconoEl.classList.add("visible");
                    }
                    return;
                }
                this.classList.add("successInput");
                if (errorEl) {
                    errorEl.classList.remove("visible");
                    errorEl.textContent = "";
                }
                if (exitoEl) {
                    exitoEl.textContent = "✓ Imagen válida";
                    exitoEl.classList.add("visible");
                }
                if (iconoEl) {
                    iconoEl.textContent = "✅";
                    iconoEl.classList.add("visible");
                }
            } else {
                this.classList.add("errorInput");
                if (errorEl) {
                    errorEl.textContent = "Debe seleccionar una imagen";
                    errorEl.classList.add("visible");
                }
                if (exitoEl) {
                    exitoEl.classList.remove("visible");
                }
                if (iconoEl) {
                    iconoEl.textContent = "❌";
                    iconoEl.classList.add("visible");
                }
            }
        });
    }
}

// =========================
// CONFIGURAR VALIDACIONES EN TIEMPO REAL - EDITAR (solo modo admin)
// =========================
if (!modoCatalogo) {
    const nombreEditar = document.getElementById("nombreProductoEditar");
    const descripcionEditar = document.getElementById("descripcionProductoEditar");
    const precioEditar = document.getElementById("precioProductoEditar");
    const imagenEditar = document.getElementById("imagenProductoEditar");

    if (nombreEditar) {
        bloquearNumerosNombre(nombreEditar, 'error-nombreEditar');
        nombreEditar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.nombre, 'nombreEditar');
        });
        nombreEditar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.nombre, 'nombreEditar');
        });
    }

    if (descripcionEditar) {
        bloquearCaracteresEspecialesDescripcion(descripcionEditar, 'error-descripcionEditar');
        descripcionEditar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.descripcion, 'descripcionEditar');
            const contador = document.getElementById("contador-descripcionEditar");
            if (contador) {
                const length = this.value.length;
                contador.textContent = `${length} / 1000 caracteres`;
                if (length > 1000) {
                    contador.classList.add("excedido");
                } else {
                    contador.classList.remove("excedido");
                }
            }
        });
        descripcionEditar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.descripcion, 'descripcionEditar');
        });
    }

    if (precioEditar) {
        bloquearLetrasPrecio(precioEditar);
        precioEditar.addEventListener("input", function() {
            validarCampo(this, validacionesProducto.precio, 'precioEditar');
        });
        precioEditar.addEventListener("blur", function() {
            validarCampo(this, validacionesProducto.precio, 'precioEditar');
        });
    }

    if (imagenEditar) {
        imagenEditar.addEventListener("change", function() {
            const file = this.files[0];
            const errorEl = document.getElementById("error-imagenEditar");
            const exitoEl = document.getElementById("exito-imagenEditar");
            const iconoEl = document.getElementById("icono-imagenEditar");

            this.classList.remove("successInput", "errorInput");

            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    this.classList.add("errorInput");
                    if (errorEl) {
                        errorEl.textContent = "La imagen no debe superar los 2MB";
                        errorEl.classList.add("visible");
                    }
                    if (exitoEl) {
                        exitoEl.classList.remove("visible");
                    }
                    if (iconoEl) {
                        iconoEl.textContent = "❌";
                        iconoEl.classList.add("visible");
                    }
                    return;
                }
                const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
                if (!tiposPermitidos.includes(file.type)) {
                    this.classList.add("errorInput");
                    if (errorEl) {
                        errorEl.textContent = "Solo se permiten JPG, PNG o WEBP";
                        errorEl.classList.add("visible");
                    }
                    if (exitoEl) {
                        exitoEl.classList.remove("visible");
                    }
                    if (iconoEl) {
                        iconoEl.textContent = "❌";
                        iconoEl.classList.add("visible");
                    }
                    return;
                }
                this.classList.add("successInput");
                if (errorEl) {
                    errorEl.classList.remove("visible");
                    errorEl.textContent = "";
                }
                if (exitoEl) {
                    exitoEl.textContent = "✓ Imagen válida";
                    exitoEl.classList.add("visible");
                }
                if (iconoEl) {
                    iconoEl.textContent = "✅";
                    iconoEl.classList.add("visible");
                }
            }
        });
    }
}

// =========================
// FUNCIONES UTILITARIAS
// =========================

function convertirImagenBase64(archivo) {
    return new Promise((resolve) => {
        if (!archivo) {
            resolve("../../assets/img/persona.png");
            return;
        }
        const lector = new FileReader();
        lector.onload = function(e) {
            resolve(e.target.result);
        };
        lector.readAsDataURL(archivo);
    });
}

function formatearPrecio(precio) {
    return Number(precio).toLocaleString(
        "es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }
    );
}

function actualizarContadores() {
    if (contadorTotal && !modoCatalogo) contadorTotal.textContent = listaproductos.length;
    const productosVisibles = document.querySelectorAll(".service-card");
    if (contadorVisibles && !modoCatalogo) contadorVisibles.textContent = productosVisibles.length;
}

function activarBotonFiltro(botonSeleccionado) {
    if (modoCatalogo) return;
    document.querySelectorAll(".btn-filter").forEach(boton => {
        boton.classList.remove("active");
    });
    if (botonSeleccionado) botonSeleccionado.classList.add("active");
}

// =========================
// VALIDAR FORMULARIO AGREGAR (solo modo admin)
// =========================
function validarFormularioAgregar() {
    if (modoCatalogo) return true;
    
    const nombreInput = document.getElementById("nombreProductoAgregar");
    const descripcionInput = document.getElementById("descripcionProductoAgregar");
    const precioInput = document.getElementById("precioProductoAgregar");
    const imagenInput = document.getElementById("imagenProductoAgregar");

    const nombreValido = validarCampo(nombreInput, validacionesProducto.nombre, 'nombreAgregar');
    const descripcionValido = validarCampo(descripcionInput, validacionesProducto.descripcion, 'descripcionAgregar');
    const precioValido = validarCampo(precioInput, validacionesProducto.precio, 'precioAgregar');

    const errorImagen = document.getElementById("error-imagenAgregar");
    const exitoImagen = document.getElementById("exito-imagenAgregar");
    const iconoImagen = document.getElementById("icono-imagenAgregar");

    if (!imagenInput.files || imagenInput.files.length === 0) {
        imagenInput.classList.add("errorInput");
        if (errorImagen) {
            errorImagen.textContent = "Debe seleccionar una imagen";
            errorImagen.classList.add("visible");
        }
        if (exitoImagen) {
            exitoImagen.classList.remove("visible");
        }
        if (iconoImagen) {
            iconoImagen.textContent = "❌";
            iconoImagen.classList.add("visible");
        }
        return false;
    } else {
        const file = imagenInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            imagenInput.classList.add("errorInput");
            if (errorImagen) {
                errorImagen.textContent = "La imagen no debe superar los 2MB";
                errorImagen.classList.add("visible");
            }
            if (exitoImagen) {
                exitoImagen.classList.remove("visible");
            }
            if (iconoImagen) {
                iconoImagen.textContent = "❌";
                iconoImagen.classList.add("visible");
            }
            return false;
        }
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (!tiposPermitidos.includes(file.type)) {
            imagenInput.classList.add("errorInput");
            if (errorImagen) {
                errorImagen.textContent = "Solo se permiten JPG, PNG o WEBP";
                errorImagen.classList.add("visible");
            }
            if (exitoImagen) {
                exitoImagen.classList.remove("visible");
            }
            if (iconoImagen) {
                iconoImagen.textContent = "❌";
                iconoImagen.classList.add("visible");
            }
            return false;
        }
        imagenInput.classList.remove("errorInput");
        imagenInput.classList.add("successInput");
        if (errorImagen) {
            errorImagen.classList.remove("visible");
            errorImagen.textContent = "";
        }
        if (exitoImagen) {
            exitoImagen.textContent = "✓ Imagen válida";
            exitoImagen.classList.add("visible");
        }
        if (iconoImagen) {
            iconoImagen.textContent = "✅";
            iconoImagen.classList.add("visible");
        }
    }

    return nombreValido && descripcionValido && precioValido;
}

// =========================
// VALIDAR FORMULARIO EDITAR (solo modo admin)
// =========================
function validarFormularioEditar() {
    if (modoCatalogo) return true;
    
    const nombreInput = document.getElementById("nombreProductoEditar");
    const descripcionInput = document.getElementById("descripcionProductoEditar");
    const precioInput = document.getElementById("precioProductoEditar");

    const nombreValido = validarCampo(nombreInput, validacionesProducto.nombre, 'nombreEditar');
    const descripcionValido = validarCampo(descripcionInput, validacionesProducto.descripcion, 'descripcionEditar');
    const precioValido = validarCampo(precioInput, validacionesProducto.precio, 'precioEditar');

    return nombreValido && descripcionValido && precioValido;
}

// =========================
// RENDERIZAR productos
// =========================
function renderizarproductos() {
    if (!contenedorproductos) return;
    contenedorproductos.innerHTML = "";

    let productosFiltrados;

    if (modoCatalogo) {
        // Modo CATÁLOGO: solo mostrar productos activos
        productosFiltrados = listaproductos.filter(producto => {
            const coincideBusqueda =
                producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase());
            return producto.activo === true && coincideBusqueda;
        });
    } else {
        // Modo ADMINISTRACIÓN: mostrar según filtros
        productosFiltrados = listaproductos.filter(producto => {
            const coincideBusqueda =
                producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase());

            let coincideFiltro = true;
            if (filtroActual === "activos") coincideFiltro = producto.activo;
            if (filtroActual === "inactivos") coincideFiltro = !producto.activo;
            return coincideBusqueda && coincideFiltro;
        });
    }

    // Actualizar contadores
    if (contadorTotal && !modoCatalogo) contadorTotal.textContent = listaproductos.length;
    if (contadorVisibles && !modoCatalogo) contadorVisibles.textContent = productosFiltrados.length;

    // Mostrar mensaje si no hay resultados
    if (productosFiltrados.length === 0) {
        const mensaje = modoCatalogo ? 
            "📋 No hay productos disponibles en el catálogo." :
            "📋 No se encontraron productos. Intenta cambiar el filtro o agregar uno nuevo.";
        
        contenedorproductos.innerHTML = `
            <div class="mensajeSinproductos" style="grid-column:1/-1;text-align:center;padding:40px;">
                <h3>📋 ${mensaje}</h3>
                ${modoCatalogo ? '<p>Pronto tendremos nuevos productos disponibles.</p>' : '<p>Intenta cambiar el filtro o agregar uno nuevo.</p>'}
            </div>
        `;
        return;
    }

    // Renderizar cada producto
    productosFiltrados.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col-lg-6 col-md-6 col-12";

        if (modoCatalogo) {
            // MODO CATÁLOGO - Solo mostrar información, sin botones de administración
            tarjeta.innerHTML = `
                <div class="service-card card-activo catalogo-card">
                    <div class="row align-items-center">
                        <div class="col-4 text-center">
                            <div class="service-img-container">
                                <img src="${producto.imagen}" alt="${producto.nombre}">
                            </div>
                        </div>
                        <div class="col-8">
                            <h3 class="service-card-title">${producto.nombre}</h3>
                            <p class="service-card-desc">${producto.descripcion}</p>
                            <div class="service-card-price">${formatearPrecio(producto.precio)}</div>
                            <div class="mt-3">
                                <span class="badge bg-success">✅ Disponible</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // MODO ADMINISTRACIÓN - Mostrar con botones de edición y estado
            const iconoToggle = producto.activo ?
                '<i class="bi bi-toggle-on toggle-icon active"></i>' :
                '<i class="bi bi-toggle-off toggle-icon inactive"></i>';

            tarjeta.innerHTML = `
                <div class="service-card ${producto.activo ? "card-activo" : "card-inactivo"}">
                    <div class="row align-items-center">
                        <div class="col-4 text-center">
                            <div class="service-img-container">
                                <img src="${producto.imagen}" alt="${producto.nombre}">
                            </div>
                        </div>
                        <div class="col-8">
                            <h3 class="service-card-title">${producto.nombre}</h3>
                            <p class="service-card-desc">${producto.descripcion}</p>
                            <div class="service-card-price">${formatearPrecio(producto.precio)}</div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                               <div class="estado" onclick="cambiarEstado('${producto.id}')">
                                    <span class="me-2">${producto.activo ? "Activo" : "Inactivo"}</span>
                                    ${iconoToggle}
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm rounded-3"
                                        onclick="abrirModalEditarProducto('${producto.id}')">
                                        <i class="bi bi-pencil-square"></i> Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        contenedorproductos.appendChild(tarjeta);
    });
}

// =========================
// CONFIGURAR MODO CATÁLOGO
// =========================
function configurarModoCatalogo() {
    if (modoCatalogo) {
        // Cambiar título y subtítulo
        if (tituloCatalogo) tituloCatalogo.textContent = "🌟 Nuestros productos";
        if (subtituloCatalogo) subtituloCatalogo.textContent = "Encuentra el producto que necesitas";
        
        // Ocultar elementos de administración
        if (botonAgregarProducto) botonAgregarProducto.style.display = "none";
        if (botonFiltroTodos) botonFiltroTodos.style.display = "none";
        if (botonFiltroActivos) botonFiltroActivos.style.display = "none";
        if (botonFiltroInactivos) botonFiltroInactivos.style.display = "none";
        if (botonLimpiarFiltros) botonLimpiarFiltros.style.display = "none";
        
        // Ocultar contadores de administración
        if (contadorTotal && contadorTotal.parentElement) {
            contadorTotal.parentElement.style.display = "none";
        }
        if (contadorVisibles && contadorVisibles.parentElement) {
            contadorVisibles.parentElement.style.display = "none";
        }
        
        // Agregar estilos de catálogo
        const style = document.createElement('style');
        style.textContent = `
            .catalogo-card {
                border: 2px solid #28a745 !important;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.1);
                transition: transform 0.3s, box-shadow 0.3s;
            }
            .catalogo-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(40, 167, 69, 0.2);
            }
            .catalogo-card .service-card-title {
                color: #28a745;
            }
            .catalogo-card .badge {
                font-size: 0.9rem;
                padding: 0.5rem 1rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// =========================
// VENTANA AGREGAR PRODUCTO (solo modo admin)
// =========================
if (!modoCatalogo && botonAgregarProducto) {
    botonAgregarProducto.addEventListener("click", () => {
        if (formularioAgregarProducto) {
            formularioAgregarProducto.reset();
            document.querySelectorAll("#formularioAgregarProducto .successInput, #formularioAgregarProducto .errorInput")
                .forEach(el => el.classList.remove("successInput", "errorInput"));
            document.querySelectorAll("#formularioAgregarProducto .mensaje-error, #formularioAgregarProducto .mensaje-exito")
                .forEach(el => el.classList.remove("visible"));
            document.querySelectorAll("#formularioAgregarProducto .icono-validacion")
                .forEach(el => el.classList.remove("visible"));
            
            const contador = document.getElementById("contador-descripcionAgregar");
            if (contador) {
                contador.textContent = "0 / 1000 caracteres";
                contador.classList.remove("excedido");
            }
            
            const mensaje = document.getElementById("mensajeAgregar");
            if (mensaje) {
                mensaje.style.display = "none";
                mensaje.className = "";
                mensaje.textContent = "";
            }
        }
        if (modalAgregarProducto) modalAgregarProducto.classList.add("activo");
    });
}

if (!modoCatalogo && cerrarModalAgregar) {
    cerrarModalAgregar.addEventListener("click", () => {
        if (modalAgregarProducto) modalAgregarProducto.classList.remove("activo");
    });
}

// =========================
// GUARDAR NUEVO PRODUCTO (MODIFICADO CON COMPRESIÓN)
// =========================
if (!modoCatalogo && formularioAgregarProducto) {
    formularioAgregarProducto.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        if (!validarFormularioAgregar()) {
            const mensaje = document.getElementById("mensajeAgregar");
            if (mensaje) {
                mensaje.textContent = "❌ Por favor, corrija los campos marcados en rojo";
                mensaje.className = "error";
                mensaje.style.display = "block";
            }
            return;
        }

        const archivoImagen = document.getElementById("imagenProductoAgregar").files[0];
        const nombreProducto = document.getElementById("nombreProductoAgregar").value.trim();
        const descripcionProducto = document.getElementById("descripcionProductoAgregar").value.trim();
        const precioProducto = document.getElementById("precioProductoAgregar").value;
        
        // Obtener imagen Base64 original
        let imagenBase64 = await convertirImagenBase64(archivoImagen);
        
        // COMPRIMIR LA IMAGEN - Esto reduce el tamaño drásticamente
        imagenBase64 = await comprimirImagen(imagenBase64, 0.5, 500, 500);
        
        // Calcular tamaño de la imagen comprimida
        const tamañoKB = Math.round(imagenBase64.length / 1024);

        const nuevoProducto = {
            id: Date.now().toString(),
            imagen: imagenBase64,
            nombre: nombreProducto,
            descripcion: descripcionProducto,
            precio: Number(precioProducto),
            activo: true
        };

        const mensajeConfirmacion = `¿Desea guardar este producto?\n\n` +
            `📋 Nombre: ${nuevoProducto.nombre}\n` +
            `📝 Descripción: ${nuevoProducto.descripcion.substring(0, 50)}...\n` +
            `💰 Precio: ${formatearPrecio(nuevoProducto.precio)}\n` +
            `📷 Tamaño imagen: ${tamañoKB} KB (comprimida)`;

        if (!confirm(mensajeConfirmacion)) {
            return;
        }

        // Verificar espacio antes de guardar
        const espacio = verificarEspacioStorage();
        if (espacio.porcentaje > 80) {
            alert('⚠️ El almacenamiento está casi lleno. Se limpiarán imágenes antiguas.');
            limpiarImagenesAntiguas();
        }

        listaproductos.push(nuevoProducto);
        localStorage.setItem("listaproductos", JSON.stringify(listaproductos));

        const mensaje = document.getElementById("mensajeAgregar");
        if (mensaje) {
            mensaje.textContent = `✅ Producto guardado correctamente (Imagen: ${tamañoKB} KB)`;
            mensaje.className = "exito";
            mensaje.style.display = "block";
        }

        renderizarproductos();
        formularioAgregarProducto.reset();

        setTimeout(() => {
            if (modalAgregarProducto) modalAgregarProducto.classList.remove("activo");
            if (mensaje) {
                mensaje.style.display = "none";
                mensaje.className = "";
                mensaje.textContent = "";
            }
        }, 1500);
    });
}

// =========================
// ABRIR MODAL EDITAR (solo modo admin)
// =========================
window.abrirModalEditarProducto = function(idProducto) {
    if (modoCatalogo) return;

    indiceProductoEditar = listaproductos.findIndex(producto => producto.id.toString() === idProducto.toString());
    if (indiceProductoEditar === -1) return;

    const producto = listaproductos[indiceProductoEditar];
    const nombreInput = document.getElementById("nombreProductoEditar");
    const descripcionInput = document.getElementById("descripcionProductoEditar");
    const precioInput = document.getElementById("precioProductoEditar");
    const imagenInput = document.getElementById("imagenProductoEditar");
    const idInput = document.getElementById("idProductoEditar");

    if (idInput) idInput.value = producto.id;
    if (nombreInput) nombreInput.value = producto.nombre;
    if (descripcionInput) descripcionInput.value = producto.descripcion;
    if (precioInput) precioInput.value = producto.precio;
    if (imagenInput) imagenInput.value = "";

    document.querySelectorAll("#formularioEditarProducto .successInput, #formularioEditarProducto .errorInput")
        .forEach(el => el.classList.remove("successInput", "errorInput"));
    document.querySelectorAll("#formularioEditarProducto .mensaje-error, #formularioEditarProducto .mensaje-exito")
        .forEach(el => el.classList.remove("visible"));
    document.querySelectorAll("#formularioEditarProducto .icono-validacion")
        .forEach(el => el.classList.remove("visible"));

    const contador = document.getElementById("contador-descripcionEditar");
    if (contador && descripcionInput) {
        const length = descripcionInput.value.length;
        contador.textContent = `${length} / 1000 caracteres`;
        if (length > 1000) {
            contador.classList.add("excedido");
        } else {
            contador.classList.remove("excedido");
        }
    }

    if (nombreInput) validarCampo(nombreInput, validacionesProducto.nombre, 'nombreEditar');
    if (descripcionInput) validarCampo(descripcionInput, validacionesProducto.descripcion, 'descripcionEditar');
    if (precioInput) validarCampo(precioInput, validacionesProducto.precio, 'precioEditar');

    const mensaje = document.getElementById("mensajeEditar");
    if (mensaje) {
        mensaje.style.display = "none";
        mensaje.className = "";
        mensaje.textContent = "";
    }

    if (modalEditarProducto) modalEditarProducto.classList.add("activo");
};

if (!modoCatalogo && cerrarModalEditar) {
    cerrarModalEditar.addEventListener("click", () => {
        if (modalEditarProducto) modalEditarProducto.classList.remove("activo");
    });
}

// =========================
// GUARDAR EDICIÓN (MODIFICADO CON COMPRESIÓN)
// =========================
if (!modoCatalogo && formularioEditarProducto) {
    formularioEditarProducto.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        if (indiceProductoEditar === null) return;

        if (!validarFormularioEditar()) {
            const mensaje = document.getElementById("mensajeEditar");
            if (mensaje) {
                mensaje.textContent = "❌ Por favor, corrija los campos marcados en rojo";
                mensaje.className = "error";
                mensaje.style.display = "block";
            }
            return;
        }

        const producto = listaproductos[indiceProductoEditar];
        producto.nombre = document.getElementById("nombreProductoEditar").value.trim();
        producto.descripcion = document.getElementById("descripcionProductoEditar").value.trim();
        producto.precio = Number(document.getElementById("precioProductoEditar").value);

        const nuevaImagen = document.getElementById("imagenProductoEditar").files[0];
        if (nuevaImagen) {
            let imagenBase64 = await convertirImagenBase64(nuevaImagen);
            // COMPRIMIR LA IMAGEN NUEVA
            imagenBase64 = await comprimirImagen(imagenBase64, 0.5, 500, 500);
            producto.imagen = imagenBase64;
        }

        const mensajeConfirmacion = `¿Desea guardar los cambios del producto?\n\n` +
            `📋 Nombre: ${producto.nombre}\n` +
            `📝 Descripción: ${producto.descripcion.substring(0, 50)}...\n` +
            `💰 Precio: ${formatearPrecio(producto.precio)}`;

        if (!confirm(mensajeConfirmacion)) {
            return;
        }

        localStorage.setItem("listaproductos", JSON.stringify(listaproductos));

        const mensaje = document.getElementById("mensajeEditar");
        if (mensaje) {
            mensaje.textContent = "✅ Producto actualizado correctamente";
            mensaje.className = "exito";
            mensaje.style.display = "block";
        }

        renderizarproductos();
        if (modalEditarProducto) modalEditarProducto.classList.remove("activo");
        indiceProductoEditar = null;

        setTimeout(() => {
            if (mensaje) {
                mensaje.style.display = "none";
                mensaje.className = "";
                mensaje.textContent = "";
            }
        }, 1500);
    });
}

// =========================
// BUSCADOR
// =========================
if (buscadorproductos) {
    buscadorproductos.addEventListener("input", function() {
        textoBusqueda = this.value.trim();
        renderizarproductos();
    });
}

// =========================
// FILTROS (solo modo admin)
// =========================
if (!modoCatalogo) {
    if (botonFiltroTodos) {
        botonFiltroTodos.addEventListener("click", () => {
            filtroActual = "todos";
            activarBotonFiltro(botonFiltroTodos);
            renderizarproductos();
        });
    }

    if (botonFiltroActivos) {
        botonFiltroActivos.addEventListener("click", () => {
            filtroActual = "activos";
            activarBotonFiltro(botonFiltroActivos);
            renderizarproductos();
        });
    }

    if (botonFiltroInactivos) {
        botonFiltroInactivos.addEventListener("click", () => {
            filtroActual = "inactivos";
            activarBotonFiltro(botonFiltroInactivos);
            renderizarproductos();
        });
    }

    if (botonLimpiarFiltros) {
        botonLimpiarFiltros.addEventListener("click", () => {
            textoBusqueda = "";
            filtroActual = "todos";
            if (buscadorproductos) buscadorproductos.value = "";
            activarBotonFiltro(botonFiltroTodos);
            renderizarproductos();
        });
    }
}

// =========================
// CAMBIAR ESTADO PRODUCTO (solo modo admin)
// =========================
window.cambiarEstado = function(idProducto) {
    if (modoCatalogo) return;
    
    const producto = listaproductos.find(producto => producto.id.toString() === idProducto.toString());
    if (!producto) return;

    const estadoActual = producto.activo ? "Activo" : "Inactivo";
    const nuevoEstado = producto.activo ? "Inactivo" : "Activo";

    if (confirm(`⚠️ ¿Desea cambiar el estado del producto "${producto.nombre}"?\n\n` +
            `Estado actual: ${estadoActual}\n` +
            `Nuevo estado: ${nuevoEstado}`)) {

        producto.activo = !producto.activo;
        localStorage.setItem("listaproductos", JSON.stringify(listaproductos));
        
        alert(`✅ Producto "${producto.nombre}" ahora está ${producto.activo ? "Activo" : "Inactivo"}`);
        renderizarproductos();
    }
};

// =========================
// CERRAR MODALES CLICK FUERA (solo modo admin)
// =========================
if (!modoCatalogo) {
    window.addEventListener("click", (evento) => {
        if (evento.target === modalAgregarProducto) {
            if (modalAgregarProducto) modalAgregarProducto.classList.remove("activo");
        }
        if (evento.target === modalEditarProducto) {
            if (modalEditarProducto) modalEditarProducto.classList.remove("activo");
        }
    });
}

// =========================
// INICIALIZACIÓN
// =========================
document.addEventListener("DOMContentLoaded", () => {
    // Configurar modo catálogo si es necesario
    configurarModoCatalogo();
    
    if (!modoCatalogo) {
        activarBotonFiltro(botonFiltroTodos);
    }

    // Cargar datos desde localStorage
    const guardados = localStorage.getItem("listaproductos");

    if (guardados) {
        listaproductos = JSON.parse(guardados);
        
        // Verificar y limpiar si es necesario
        if (!modoCatalogo) {
            limpiarImagenesAntiguas();
        }
    } else {
        listaproductos = [];
        localStorage.setItem("listaproductos", JSON.stringify(listaproductos));
    }

    renderizarproductos();
    actualizarContadores();
    
    // Mostrar información de almacenamiento
    if (!modoCatalogo) {
        const espacio = verificarEspacioStorage();
        console.log(`✅ Sistema de productos inicializado - Modo: ADMINISTRACIÓN`);
        console.log(`📊 Total de productos: ${listaproductos.length}`);
        console.log(`📊 productos activos: ${listaproductos.filter(s => s.activo).length}`);
        console.log(`💾 Espacio usado: ${Math.round(espacio.usado / 1024 / 1024)} MB de 5 MB`);
        console.log(`💾 Porcentaje: ${Math.round(espacio.porcentaje)}%`);
        
        if (espacio.porcentaje > 80) {
            console.warn('⚠️ Almacenamiento casi lleno!');
        }
    } else {
        console.log(`✅ Sistema de productos inicializado - Modo: CATÁLOGO`);
        console.log(`📊 Total de productos: ${listaproductos.length}`);
        console.log(`📊 productos activos: ${listaproductos.filter(s => s.activo).length}`);
    }
});

// =========================
// EXPONER FUNCIONES GLOBALES
// =========================
window.abrirModalEditarProducto = abrirModalEditarProducto;
window.cambiarEstado = cambiarEstado;
window.comprimirImagen = comprimirImagen;
window.verificarEspacioStorage = verificarEspacioStorage;