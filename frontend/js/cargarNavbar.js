//======================================================
// CARGAR NAVBAR
//======================================================

document.addEventListener("DOMContentLoaded", function () {
    cargarNavbar();
});


//======================================================
// INSERTAR NAVBAR
//======================================================

function cargarNavbar() {

    fetch("../navbar/navbar.html")
        .then(function (res) {

            if (!res.ok) {
                throw new Error("Error navbar: " + res.status);
            }

            return res.text();

        })
        .then(function (html) {

            var navbarExistente =
                document.querySelector("header");

            if (navbarExistente) {
                navbarExistente.remove();
            }

            document.body.insertAdjacentHTML(
                "afterbegin",
                html
            );

            console.log("Navbar cargado");

            ajustarBotonesSegunSesion();

            //==============================================
            // ACTIVAR DROPDOWNS DE BOOTSTRAP
            //==============================================

            var dropdowns =
                document.querySelectorAll(".dropdown-toggle");

            dropdowns.forEach(function (dropdown) {

                if (typeof bootstrap !== "undefined") {
                    new bootstrap.Dropdown(dropdown);
                }

            });


            //==============================================
            // CARGAR MINI CARRITO DEL NAVBAR
            //==============================================

            mostrarCarritoNavbar();

        })
        .catch(function (error) {

            console.error(
                "Error cargando navbar:",
                error
            );

        });
}


//======================================================
// OBTENER USUARIO
//======================================================

function obtenerUsuario() {

    var usuarioGuardado =
        localStorage.getItem("usuarioLogueado");

    if (!usuarioGuardado) {
        return null;
    }

    try {

        return JSON.parse(usuarioGuardado);

    } catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

        return null;
    }
}


//======================================================
// AJUSTAR NAVBAR SEGUN USUARIO
//======================================================

function ajustarBotonesSegunSesion() {

    var usuario =
        obtenerUsuario();


    //==============================================
    // MI CUENTA
    //==============================================

    var linkMiCuenta =
        document.getElementById("linkMiCuenta");

    var textoMiCuenta =
        document.getElementById("textoMiCuenta");

    var iconoMiCuenta =
        document.getElementById("iconoMiCuenta");


    if (usuario) {

        if (textoMiCuenta) {

            textoMiCuenta.textContent =
                usuario.nombres || "Mi cuenta";
        }

        if (linkMiCuenta) {

            linkMiCuenta.href =
                "../perfil/perfil.html";
        }

        if (iconoMiCuenta) {

            iconoMiCuenta.className =
                "bi bi-person";
        }

    } else {

        if (textoMiCuenta) {

            textoMiCuenta.textContent =
                "Iniciar sesion";
        }

        if (linkMiCuenta) {

            linkMiCuenta.href =
                "../inicio/login.html";
        }

        if (iconoMiCuenta) {

            iconoMiCuenta.className =
                "bi bi-box-arrow-in-right";
        }
    }


    //==============================================
    // SALIR / REGISTRARSE
    //==============================================

    var linkSalir =
        document.getElementById("linkSalir");

    var textoSalir =
        document.getElementById("textoSalir");

    var iconoSalir =
        document.getElementById("iconoSalir");


    if (usuario) {

        if (textoSalir) {

            textoSalir.textContent =
                "Salir";
        }

        if (linkSalir) {

            linkSalir.href = "#";

            linkSalir.onclick =
                function (event) {

                    event.preventDefault();

                    cerrarSesion();
                };
        }

        if (iconoSalir) {

            iconoSalir.className =
                "bi bi-box-arrow-right";
        }

    } else {

        if (textoSalir) {

            textoSalir.textContent =
                "Registrarse";
        }

        if (linkSalir) {

            linkSalir.href =
                "../inicio/registro.html";
        }

        if (iconoSalir) {

            iconoSalir.className =
                "bi bi-person-plus";
        }
    }


    //==============================================
    // MOSTRAR CARRITO
    //==============================================

    var navCarrito =
        document.getElementById("navCarrito");


    if (navCarrito) {

        navCarrito.style.display = "";
    }


    //==============================================
    // CERRAR SESION
    //==============================================

    var linkCerrarSesion =
        document.getElementById("linkCerrarSesion");


    if (linkCerrarSesion) {

        linkCerrarSesion.onclick =
            function (event) {

                event.preventDefault();

                cerrarSesion();
            };
    }
}


//======================================================
// CERRAR SESION
//======================================================

function cerrarSesion() {

    var confirmar =
        confirm(
            "Esta seguro de que desea cerrar sesion?"
        );


    if (!confirmar) {
        return;
    }


    //==============================================
    // IMPORTANTE:
    // NO BORRAR carritoProductos
    //==============================================

    localStorage.removeItem(
        "usuarioLogueado"
    );

    localStorage.removeItem(
        "token"
    );


    //==============================================
    // EL CARRITO SE CONSERVA
    // PERO SE MUESTRA EN CERO
    //==============================================

    var lista =
        document.getElementById("listaProductos");

    var contador =
        document.getElementById("contadorCarrito");

    var subtotal =
        document.getElementById("subtotalCarrito");


    if (lista) {

        lista.innerHTML =
            '<div class="carrito-vacio">' +
            '<i class="bi bi-cart-x"></i>' +
            '<p>No hay productos en el carrito</p>' +
            '</div>';
    }


    if (contador) {

        contador.textContent =
            "0";
    }


    if (subtotal) {

        subtotal.textContent =
            "$0";
    }


    //==============================================
    // IR AL INDEX
    //==============================================

    window.location.href =
        "../inicio/index.html";
}


//======================================================
// MOSTRAR MINI CARRITO EN NAVBAR
//======================================================

function mostrarCarritoNavbar() {

    var lista =
        document.getElementById("listaProductos");

    var contador =
        document.getElementById("contadorCarrito");

    var subtotal =
        document.getElementById("subtotalCarrito");


    if (!lista) {

        console.log(
            "No existe listaProductos"
        );

        return;
    }


    //==============================================
    // COMPROBAR SESION
    //==============================================

    var usuario =
        obtenerUsuario();


    //==============================================
    // SIN SESION
    //==============================================

    if (!usuario) {

        lista.innerHTML =
            '<div class="carrito-vacio">' +
            '<i class="bi bi-cart-x"></i>' +
            '<p>No hay productos en el carrito</p>' +
            '</div>';


        if (contador) {

            contador.textContent =
                "0";
        }


        if (subtotal) {

            subtotal.textContent =
                "$0";
        }


        return;
    }


    //==============================================
    // OBTENER CARRITO
    //==============================================

    var carrito = [];


    try {

        carrito =
            JSON.parse(
                localStorage.getItem(
                    "carritoProductos"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Error leyendo carrito:",
            error
        );

        carrito = [];
    }


    lista.innerHTML = "";


    //==============================================
    // CARRITO VACIO
    //==============================================

    if (
        !Array.isArray(carrito) ||
        carrito.length === 0
    ) {

        lista.innerHTML =
            '<div class="carrito-vacio">' +
            '<i class="bi bi-cart-x"></i>' +
            '<p>No hay productos en el carrito</p>' +
            '</div>';


        if (contador) {

            contador.textContent =
                "0";
        }


        if (subtotal) {

            subtotal.textContent =
                "$0";
        }


        return;
    }


    //==============================================
    // CALCULAR TOTAL
    //==============================================

    var total = 0;

    var cantidadTotal = 0;


    carrito.forEach(
        function (producto) {

            var nombre =
                producto.nombre || "Producto";

            var imagen =
                producto.imagen || "";

            var precio =
                Number(producto.precio) || 0;

            var cantidad =
                Number(producto.cantidad) || 0;


            total =
                total +
                (precio * cantidad);


            cantidadTotal =
                cantidadTotal +
                cantidad;


            lista.innerHTML +=
                '<div class="producto-carrito-navbar">' +

                '<img ' +
                'src="' + imagen + '" ' +
                'class="imagen-producto-navbar" ' +
                'alt="' + nombre + '">' +

                '<div class="info-producto-navbar">' +

                '<strong class="nombre-producto-navbar">' +
                nombre +
                '</strong>' +

                '<span class="cantidad-producto-navbar">' +
                cantidad +
                ' x $' +
                precio.toLocaleString("es-CO") +
                '</span>' +

                '</div>' +

                '</div>';
        }
    );


    //==============================================
    // ACTUALIZAR CONTADOR
    //==============================================

    if (contador) {

        contador.textContent =
            cantidadTotal;
    }


    //==============================================
    // ACTUALIZAR SUBTOTAL
    //==============================================

    if (subtotal) {

        subtotal.textContent =
            "$" +
            total.toLocaleString("es-CO");
    }
}


//======================================================
// EXPORTAR FUNCIONES
//======================================================

window.cargarNavbar =
    cargarNavbar;

window.cerrarSesion =
    cerrarSesion;

window.mostrarCarritoNavbar =
    mostrarCarritoNavbar;

