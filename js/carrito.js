// ============================================
// CARRITO DE PRODUCTOS
// ============================================

let carrito = JSON.parse(
    localStorage.getItem("carritoProductos")
) || [];

const contenedorCarrito = document.getElementById("contenedorCarrito");
const cantidadServicios = document.getElementById("cantidadServicios");

const subtotalHTML = document.getElementById("subtotal");
const tarifaHTML = document.getElementById("tarifa");
const totalHTML = document.getElementById("total");

// ============================================
// FORMATO PRECIO
// ============================================

function formatoPrecio(valor){

    return Number(valor).toLocaleString("es-CO",{
        style:"currency",
        currency:"COP",
        minimumFractionDigits:0
    });

}

// ============================================
// CARGAR CARRITO
// ============================================

function cargarCarrito(){

    carrito = JSON.parse(
        localStorage.getItem("carritoProductos")
    ) || [];

    mostrarCarrito();

}

// ============================================
// MOSTRAR CARRITO
// ============================================

function mostrarCarrito(){

    if(!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if(carrito.length === 0){

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

    carrito.forEach((producto,index)=>{

        contenedorCarrito.innerHTML += `

        <div class="tarjeta tarjeta-servicio">

            <img
                src="${producto.imagen}"
                class="imagen-servicio"
                alt="${producto.nombre}">

            <div class="info-servicio">

                <h5 class="nombre-servicio">

                    ${producto.nombre}

                </h5>

                <p class="descripcion-servicio">

                    ${producto.descripcion}

                </p>

                <span class="etiqueta-servicio">

                    <i class="bi bi-box"></i>

                    Producto

                </span>

            </div>

            <div class="precio-servicio">

                <strong class="texto-precio">

                    ${formatoPrecio(producto.precio)}

                </strong>

            </div>

            <div class="control-cantidad">

                <button
                    class="boton-cantidad"
                    onclick="restarCantidad(${index})">

                    −

                </button>

                <input
                    class="numero-cantidad"
                    value="${producto.cantidad}"
                    readonly>

                <button
                    class="boton-cantidad"
                    onclick="sumarCantidad(${index})">

                    +

                </button>

            </div>

            <button
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
// CANTIDAD
// ============================================

function sumarCantidad(index){

    carrito[index].cantidad++;

    guardarCarrito();

}

function restarCantidad(index){

    if(carrito[index].cantidad > 1){

        carrito[index].cantidad--;

    }

    guardarCarrito();

}

// ============================================
// ELIMINAR PRODUCTO
// ============================================

function eliminarProducto(index){

    carrito.splice(index,1);

    guardarCarrito();

}

// ============================================
// GUARDAR CARRITO
// ============================================

function guardarCarrito(){

    localStorage.setItem(
        "carritoProductos",
        JSON.stringify(carrito)
    );

    mostrarCarrito();

    // Actualiza el mini carrito del navbar
    if(window.mostrarCarritoNavbar){

        window.mostrarCarritoNavbar();

    }

}

// ============================================
// ACTUALIZAR RESUMEN
// ============================================

function actualizarResumen(){

    let subtotal = 0;
    let cantidad = 0;

    carrito.forEach(producto => {

        subtotal +=
            Number(producto.precio) *
            Number(producto.cantidad);

        cantidad +=
            Number(producto.cantidad);

    });

    const tarifa = subtotal * 0.19;
    const total = subtotal + tarifa;

    if(cantidadServicios){

        cantidadServicios.textContent = cantidad;

    }

    if(subtotalHTML){

        subtotalHTML.textContent =
            formatoPrecio(subtotal);

    }

    if(tarifaHTML){

        tarifaHTML.textContent =
            formatoPrecio(tarifa);

    }

    if(totalHTML){

        totalHTML.textContent =
            formatoPrecio(total);

    }

}  

// ============================================
// VACIAR CARRITO
// ============================================

function vaciarCarrito(){

    carrito = [];

    localStorage.removeItem("carritoProductos");

    mostrarCarrito();

    if(window.mostrarCarritoNavbar){

        window.mostrarCarritoNavbar();

    }

}





// ============================================
// VALIDAR LOGIN ANTES DE PAGAR
// ============================================

const btnPagar = document.getElementById("btnPagarProductos");

if(btnPagar){

    btnPagar.addEventListener("click", function(e){

        e.preventDefault();

       const usuario = localStorage.getItem("usuarioLogueado");

        console.log("Usuario logueado:", usuario);

        if(!usuario){

            alert("⚠ Debes iniciar sesión para realizar el pago.");

            window.location.href="../inicio/login.html";

            return;

        }

        window.location.href="../pago/pagar.html";

    });

}

// ============================================
// INICIO
// ============================================

document.addEventListener("DOMContentLoaded",()=>{

    cargarCarrito();

    const btnPagar =
        document.getElementById("btnPagarProductos");

    if(btnPagar){

        btnPagar.addEventListener("click",function(e){

            e.preventDefault();

            validarPago();

        });

    }

});



// ============================================
// EXPORTAR FUNCIONES
// ============================================

window.sumarCantidad = sumarCantidad;
window.restarCantidad = restarCantidad;
window.eliminarProducto = eliminarProducto;
window.vaciarCarrito = vaciarCarrito;