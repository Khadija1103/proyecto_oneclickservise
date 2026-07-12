// ============================================
// CARRITO DE PRODUCTOS DESDE ADMIN
// ============================================


let productosAdmin = JSON.parse(
    localStorage.getItem("listaproductos")
) || [];


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
// CARGAR PRODUCTOS DEL ADMIN
// ============================================

function cargarProductosAdmin(){


    // Si el carrito está vacío toma los productos activos del administrador

    if(carrito.length === 0){


        carrito = productosAdmin
        .filter(producto => producto.activo === true)
        .map(producto => ({


            id: producto.id,
            imagen: producto.imagen,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidad:1


        }));



        localStorage.setItem(
            "carritoProductos",
            JSON.stringify(carrito)
        );


    }



    mostrarCarrito();

}




// ============================================
// MOSTRAR CARRITO
// ============================================

function mostrarCarrito(){


    if(!contenedorCarrito) return;


    contenedorCarrito.innerHTML="";



    if(carrito.length === 0){


        contenedorCarrito.innerHTML=`

        <div class="mensaje-vacio">

            <h3>🛒 Tu carrito está vacío</h3>

            <p>
            No hay productos disponibles.
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
// ELIMINAR
// ============================================

function eliminarProducto(index){


    carrito.splice(index,1);


    guardarCarrito();


}





// ============================================
// GUARDAR
// ============================================

function guardarCarrito(){


    localStorage.setItem(
        "carritoProductos",
        JSON.stringify(carrito)
    );


    mostrarCarrito();


}




// ============================================
// RESUMEN
// ============================================

function actualizarResumen(){


    let subtotal=0;

    let cantidad=0;



    carrito.forEach(producto=>{


        subtotal += producto.precio * producto.cantidad;

        cantidad += producto.cantidad;


    });



    let tarifa = subtotal * 0.19;

    let total = subtotal + tarifa;



    if(cantidadServicios)
        cantidadServicios.textContent=cantidad;


    if(subtotalHTML)
        subtotalHTML.textContent=formatoPrecio(subtotal);


    if(tarifaHTML)
        tarifaHTML.textContent=formatoPrecio(tarifa);


    if(totalHTML)
        totalHTML.textContent=formatoPrecio(total);



}





// ============================================
// INICIO
// ============================================


document.addEventListener("DOMContentLoaded",()=>{


    cargarProductosAdmin();


});





window.sumarCantidad=sumarCantidad;
window.restarCantidad=restarCantidad;
window.eliminarProducto=eliminarProducto;