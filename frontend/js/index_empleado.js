// ============================================
// PANEL DEL EMPLEADO
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    cargarDatosEmpleado();
    configurarNavegacion();
    configurarCerrarSesion();

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

    var usuario;

    try {

        usuario =
            JSON.parse(usuarioGuardado);

    } catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("token");

        window.location.href =
            "../inicio/login.html";

        return;
    }

    var nombreEmpleado =
        document.getElementById("nombreEmpleado");

    if (nombreEmpleado) {

        nombreEmpleado.textContent =
            usuario.nombres ||
            usuario.nombre ||
            usuario.nombreCompleto ||
            "Empleado";

    }

}


// ============================================
// NAVEGACIÓN
// ============================================

function configurarNavegacion() {

    var botones =
        document.querySelectorAll(
            ".hero-buttons a, .empleado-card"
        );

    botones.forEach(function (boton) {

        var texto =
            boton.textContent
                .trim()
                .toLowerCase();


        if (texto.includes("mi perfil")) {

            boton.href =
                "../perfil/perfil.html";

        }


        else if (texto.includes("mis citas")) {

            boton.href =
                "../carrito/Citas/_agendadas.html";

        }


        else if (texto.includes("mis servicios")) {

            boton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    mostrarMensaje(
                        "Mis servicios",
                        "La sección de servicios del empleado todavía no está creada.",
                        "info"
                    );

                }
            );

        }

    });

}


// ============================================
// MENSAJE
// ============================================

function mostrarMensaje(
    titulo,
    texto,
    icono
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            title: titulo,
            text: texto,
            icon: icono,
            confirmButtonText: "Aceptar"

        });

    } else {

        alert(
            titulo + "\n\n" + texto
        );

    }

}


// ============================================
// CERRAR SESIÓN
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

                if (
                    confirm(
                        "¿Está seguro de que desea cerrar sesión?"
                    )
                ) {

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

    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");

    window.location.href =
        "../inicio/index.html";

}


// ============================================
// EXPORTAR
// ============================================

window.cerrarSesionEmpleado =
    cerrarSesionEmpleado;
