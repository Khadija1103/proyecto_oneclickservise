// ============================================
// PANEL DEL EMPLEADO
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    cargarDatosEmpleado();

    configurarCerrarSesion();

    configurarNavegacion();

});


// ============================================
// CARGAR DATOS DEL EMPLEADO
// ============================================

function cargarDatosEmpleado() {

    var usuarioGuardado =
        localStorage.getItem("usuarioLogueado");


    if (!usuarioGuardado) {

        window.location.href =
            "../inicio/login.html";

        return;
    }


    var usuario = null;


    try {

        usuario =
            JSON.parse(usuarioGuardado);

    } catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

        localStorage.removeItem(
            "usuarioLogueado"
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "../inicio/login.html";

        return;
    }


    var nombreEmpleado =
        document.getElementById(
            "nombreEmpleado"
        );


    if (nombreEmpleado) {

        nombreEmpleado.textContent =
            usuario.nombres ||
            usuario.nombre ||
            usuario.nombreCompleto ||
            "Empleado";

    }

}


// ============================================
// CONFIGURAR NAVEGACIÓN
// ============================================

function configurarNavegacion() {

    var botonesHero =
        document.querySelectorAll(
            ".hero-buttons a"
        );


    var tarjetas =
        document.querySelectorAll(
            ".empleado-card"
        );


    // ========================================
    // BOTONES DEL HERO
    // ========================================

    if (botonesHero.length > 0) {

        botonesHero.forEach(
            function (boton) {

                var texto =
                    boton.textContent
                        .trim()
                        .toLowerCase();


                if (
                    texto.includes("mi perfil")
                ) {

                    boton.href =
                        "../perfil/perfil.html";

                }


                else if (
                    texto.includes("mis citas")
                ) {

                    boton.href =
                        "../carrito/Citas/_agendadas.html";

                }

            }
        );

    }


    // ========================================
    // TARJETAS
    // ========================================

    if (tarjetas.length > 0) {

        tarjetas.forEach(
            function (tarjeta) {

                var texto =
                    tarjeta.textContent
                        .trim()
                        .toLowerCase();


                // --------------------------------
                // MI PERFIL
                // --------------------------------

                if (
                    texto.includes("mi perfil")
                ) {

                    tarjeta.href =
                        "../perfil/perfil.html";

                }


                // --------------------------------
                // MIS CITAS
                // --------------------------------

                else if (
                    texto.includes("mis citas")
                ) {

                    tarjeta.href =
                        "../carrito/Citas/_agendadas.html";

                }


                // --------------------------------
                // MIS SERVICIOS
                // --------------------------------

                else if (
                    texto.includes("mis servicios")
                ) {

                    tarjeta.href =
                        "../administrador/html/admin-servicios.html";

                    tarjeta.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            mostrarMensajeServicios();

                        }
                    );

                }

            }
        );

    }

}


// ============================================
// MENSAJE SERVICIOS
// ============================================

function mostrarMensajeServicios() {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            title: "Mis servicios",

            text:
                "La gestión de servicios del empleado todavía no tiene una página propia.",

            icon: "info",

            confirmButtonText: "Entendido"

        });

    } else {

        alert(
            "La gestión de servicios del empleado todavía no tiene una página propia."
        );

    }

}


// ============================================
// CONFIGURAR CERRAR SESIÓN
// ============================================

function configurarCerrarSesion() {

    var boton =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (!boton) {

        return;

    }


    boton.addEventListener(
        "click",
        function () {

            if (
                typeof Swal !== "undefined"
            ) {

                Swal.fire({

                    title: "¿Cerrar sesión?",

                    text:
                        "Vas a salir del panel del empleado.",

                    icon: "question",

                    showCancelButton: true,

                    confirmButtonText:
                        "Sí, cerrar sesión",

                    cancelButtonText:
                        "Cancelar",

                    reverseButtons: true

                }).then(
                    function (resultado) {

                        if (
                            resultado.isConfirmed
                        ) {

                            cerrarSesionEmpleado();

                        }

                    }
                );

            } else {

                var confirmar =
                    confirm(
                        "¿Está seguro de que desea cerrar sesión?"
                    );


                if (confirmar) {

                    cerrarSesionEmpleado();

                }

            }

        }
    );

}


// ============================================
// CERRAR SESIÓN
// ============================================

function cerrarSesionEmpleado() {

    localStorage.removeItem(
        "usuario"
    );

    localStorage.removeItem(
        "usuarioLogueado"
    );

    localStorage.removeItem(
        "token"
    );


    window.location.href =
        "../inicio/index.html";

}


// ============================================
// EXPORTAR
// ============================================

window.cerrarSesionEmpleado =
    cerrarSesionEmpleado;