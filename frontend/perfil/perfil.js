/* =====================================================
   SWEETALERT2 - REEMPLAZO DE ALERT NATIVO
   ===================================================== */

if (typeof Swal !== "undefined") {
    window.alert = function (mensaje) {
        Swal.fire({
            text: mensaje,
            icon: "info",
            confirmButtonText: "Aceptar"
        });
    };
}


/* =====================================================
   PERFIL - ONE CLICK SERVICE
   ===================================================== */

const API_URL = "https://oneclickservice-backend-production.up.railway.app/usuarios";


/* =====================================================
   INICIO
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    cargarPerfil();
    configurarFotoPerfil();
    configurarFormulario();
    configurarSolicitarServicio();
    configurarVolverInicio();
    configurarCerrarSesion();

});


/* =====================================================
   OBTENER USUARIO ACTUAL
   ===================================================== */

function obtenerUsuario() {

    var usuarioGuardado =
        localStorage.getItem("usuarioLogueado");

    if (!usuarioGuardado) {
        usuarioGuardado =
            localStorage.getItem("usuario");
    }

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


/* =====================================================
   OBTENER CLAVE ÃšNICA DE FOTO
   Cada usuario conserva su propia foto
   ===================================================== */

function obtenerClaveFoto(usuario) {

    if (!usuario) {
        return "fotoPerfil_default";
    }

    var id =
        usuario.idUsuario ||
        usuario.id ||
        usuario.correo ||
        usuario.email ||
        "usuario";

    return "fotoPerfil_" + String(id);
}


/* =====================================================
   CARGAR PERFIL
   ===================================================== */

function cargarPerfil() {

    var usuario = obtenerUsuario();

    if (!usuario) {

        window.location.href =
            "../inicio/login.html";

        return;
    }


    /* =================================================
       NOMBRE
       ================================================= */

    var nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario) {

        var nombreCompleto =
            (
                usuario.nombre ||
                usuario.nombres ||
                ""
            ) +
            " " +
            (
                usuario.apellido ||
                usuario.apellidos ||
                ""
            );

        nombreUsuario.textContent =
            nombreCompleto.trim() ||
            "Usuario One Click";
    }


    /* =================================================
       CAMPOS
       ================================================= */

    var campoNombre =
        document.getElementById("nombre");

    var campoApellido =
        document.getElementById("apellido");

    var campoCorreo =
        document.getElementById("correo");

    var campoTelefono =
        document.getElementById("telefono");

    var campoRol =
        document.getElementById("rol");


    if (campoNombre) {

        campoNombre.value =
            usuario.nombre ||
            usuario.nombres ||
            "";
    }


    if (campoApellido) {

        campoApellido.value =
            usuario.apellido ||
            usuario.apellidos ||
            "";
    }


    if (campoCorreo) {

        campoCorreo.value =
            usuario.correo ||
            usuario.email ||
            "";
    }


    if (campoTelefono) {

        campoTelefono.value =
            usuario.telefono ||
            "";
    }


    if (campoRol) {

        campoRol.value =
            usuario.rol ||
            "CLIENTE";
    }


    /* =================================================
       ROL
       ================================================= */

    var rol =
        String(
            usuario.rol ||
            usuario.role ||
            "CLIENTE"
        ).toUpperCase().trim();


    var badge =
        document.getElementById("rolBadge");

    var descripcion =
        document.getElementById("descripcionRol");


    if (badge) {

        badge.textContent = rol;


        if (
            rol === "ADMINISTRADOR" ||
            rol === "ADMIN"
        ) {

            badge.style.background =
                "#dc3545";

        } else if (
            rol === "EMPLEADO" ||
            rol === "EMPLOYEE"
        ) {

            badge.style.background =
                "#0d6efd";

        } else {

            badge.style.background =
                "#ff4d94";
        }
    }


    if (descripcion) {

        if (
            rol === "ADMINISTRADOR" ||
            rol === "ADMIN"
        ) {

            descripcion.textContent =
                "Administra usuarios, servicios y la plataforma.";

        } else if (
            rol === "EMPLEADO" ||
            rol === "EMPLOYEE"
        ) {

            descripcion.textContent =
                "Gestiona tu informaciÃ³n profesional y tus servicios.";

        } else {

            descripcion.textContent =
                "Gestiona tu informaciÃ³n personal y servicios.";
        }
    }


    /* =================================================
       SOLICITUDES
       ================================================= */

    var seccionSolicitudes =
        document.getElementById(
            "seccionSolicitudes"
        );

    var btnSolicitar =
        document.getElementById(
            "btnSolicitar"
        );


    if (
        rol === "ADMINISTRADOR" ||
        rol === "ADMIN"
    ) {

        if (seccionSolicitudes) {
            seccionSolicitudes.style.display =
                "none";
        }

        if (btnSolicitar) {
            btnSolicitar.style.display =
                "none";
        }

    } else {

        if (seccionSolicitudes) {
            seccionSolicitudes.style.display =
                "block";
        }

        if (btnSolicitar) {
            btnSolicitar.style.display =
                "inline-block";
        }
    }


    /* =================================================
       FOTO DEL USUARIO
       Cada usuario tiene una foto diferente
       ================================================= */

    cargarFotoUsuario(usuario);
}


/* =====================================================
   CARGAR FOTO DEL USUARIO
   ===================================================== */

function cargarFotoUsuario(usuario) {

    var fotoPerfil =
        document.getElementById("fotoPerfil");

    if (!fotoPerfil) {
        return;
    }


    var claveFoto =
        obtenerClaveFoto(usuario);


    var fotoGuardada =
        localStorage.getItem(claveFoto);


    if (fotoGuardada) {

        fotoPerfil.src =
            fotoGuardada;

        return;
    }


    if (usuario.fotoPerfil) {

        fotoPerfil.src =
            usuario.fotoPerfil;

        return;
    }


    /* Foto por defecto */

    fotoPerfil.src =
        "../assets/img/logo.png";
}


/* =====================================================
   CAMBIAR FOTO DE PERFIL
   ===================================================== */

function configurarFotoPerfil() {

    var inputFoto =
        document.getElementById("inputFoto");

    var fotoPerfil =
        document.getElementById("fotoPerfil");


    if (
        !inputFoto ||
        !fotoPerfil
    ) {

        return;
    }


    var usuario =
        obtenerUsuario();


    if (!usuario) {
        return;
    }


    /* Cargar foto correspondiente al usuario */

    cargarFotoUsuario(usuario);


    /* =================================================
       SELECCIONAR NUEVA FOTO
       ================================================= */

    inputFoto.addEventListener(
        "change",
        function (event) {

            var archivo =
                event.target.files[0];


            if (!archivo) {
                return;
            }


            /* VALIDAR TIPO */

            if (
                !archivo.type.startsWith("image/")
            ) {

                alert(
                    "Selecciona un archivo de imagen."
                );

                inputFoto.value = "";

                return;
            }


            /* VALIDAR TAMAÃ‘O */

            if (
                archivo.size >
                2 * 1024 * 1024
            ) {

                alert(
                    "La imagen no puede superar los 2 MB."
                );

                inputFoto.value = "";

                return;
            }


            /* LEER IMAGEN */

            var lector =
                new FileReader();


            lector.onload =
                function (e) {

                    var imagenBase64 =
                        e.target.result;


                    /* Mostrar foto */

                    fotoPerfil.src =
                        imagenBase64;


                    /* Clave individual */

                    var claveFoto =
                        obtenerClaveFoto(usuario);


                    /* Guardar foto individual */

                    localStorage.setItem(
                        claveFoto,
                        imagenBase64
                    );


                    /* Actualizar usuario */

                    usuario.fotoPerfil =
                        imagenBase64;


                    localStorage.setItem(
                        "usuarioLogueado",
                        JSON.stringify(usuario)
                    );


                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(usuario)
                    );


                    if (
                        typeof Swal !== "undefined"
                    ) {

                        Swal.fire({
                            text: "Foto de perfil actualizada correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar"
                        });
                    }
                };


            lector.onerror =
                function () {

                    alert(
                        "No se pudo cargar la imagen."
                    );
                };


            lector.readAsDataURL(archivo);

        }
    );
}


/* =====================================================
   ACTUALIZAR PERFIL
   ===================================================== */

function configurarFormulario() {

    var formulario =
        document.getElementById("formPerfil");


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            var usuarioActual =
                obtenerUsuario();


            if (!usuarioActual) {

                alert(
                    "No se encontrÃ³ la sesiÃ³n del usuario."
                );

                return;
            }


            var campoNombre =
                document.getElementById("nombre");

            var campoApellido =
                document.getElementById("apellido");

            var campoCorreo =
                document.getElementById("correo");

            var campoTelefono =
                document.getElementById("telefono");


            var usuarioActualizado = {

                idUsuario:
                    usuarioActual.idUsuario,

                nombre:
                    campoNombre
                        ? campoNombre.value.trim()
                        : "",

                apellido:
                    campoApellido
                        ? campoApellido.value.trim()
                        : "",

                correo:
                    campoCorreo
                        ? campoCorreo.value.trim()
                        : "",

                telefono:
                    campoTelefono
                        ? campoTelefono.value.trim()
                        : "",

                rol:
                    usuarioActual.rol,

                password:
                    usuarioActual.password,

                fotoPerfil:
                    usuarioActual.fotoPerfil ||
                    null
            };


            try {

                var respuesta =
                    await fetch(
                        API_URL +
                        "/" +
                        usuarioActual.idUsuario,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    usuarioActualizado
                                )
                        }
                    );


                if (respuesta.ok) {

                    var usuarioGuardado =
                        await respuesta.json();


                    /* Mantener foto individual */

                    var claveFoto =
                        obtenerClaveFoto(
                            usuarioGuardado
                        );


                    var fotoActual =
                        localStorage.getItem(
                            claveFoto
                        );


                    if (fotoActual) {

                        usuarioGuardado.fotoPerfil =
                            fotoActual;
                    }


                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(
                            usuarioGuardado
                        )
                    );


                    localStorage.setItem(
                        "usuarioLogueado",
                        JSON.stringify(
                            usuarioGuardado
                        )
                    );


                    Swal.fire({

                        text:
                            "Perfil actualizado correctamente.",

                        icon:
                            "success",

                        confirmButtonText:
                            "Aceptar"

                    });


                    cargarPerfil();


                } else {

                    Swal.fire({

                        text:
                            "No se pudo actualizar el perfil.",

                        icon:
                            "error",

                        confirmButtonText:
                            "Aceptar"

                    });
                }


            } catch (error) {

                console.error(
                    "Error actualizando perfil:",
                    error
                );


                Swal.fire({

                    text:
                        "Error de conexiÃ³n con el servidor.",

                    icon:
                        "error",

                    confirmButtonText:
                        "Aceptar"

                });
            }

        }
    );
}


/* =====================================================
   SOLICITAR SERVICIO
   ===================================================== */

function configurarSolicitarServicio() {

    var btnSolicitar =
        document.getElementById(
            "btnSolicitar"
        );


    if (!btnSolicitar) {
        return;
    }


    btnSolicitar.addEventListener(
        "click",
        function () {

            window.location.href =
                "../servicios/servicios.html";

        }
    );
}


/* =====================================================
   VOLVER AL INICIO SEGÃšN EL ROL
   ===================================================== */

function configurarVolverInicio() {

    var botonVolver =
        document.getElementById(
            "btnVolverInicio"
        );


    if (!botonVolver) {
        return;
    }


    botonVolver.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            var usuario =
                obtenerUsuario();


            if (!usuario) {

                window.location.href =
                    "../inicio/index.html";

                return;
            }


            var rol =
                String(
                    usuario.rol ||
                    usuario.role ||
                    ""
                ).toLowerCase().trim();


            /* ADMINISTRADOR */

            if (
                rol === "administrador" ||
                rol === "admin"
            ) {

                window.location.href =
                    "../administrador/html/index_adm.html";

                return;
            }


            /* EMPLEADO */

            if (
                rol === "empleado" ||
                rol === "employee"
            ) {

                window.location.href =
                    "../empleado/index_empleado.html";

                return;
            }


            /* CLIENTE */

            window.location.href =
                "../inicio/index.html";

        }
    );
}


/* =====================================================
   CERRAR SESIÃ“N
   ===================================================== */

function configurarCerrarSesion() {

    var btnCerrar =
        document.getElementById(
            "btnCerrar"
        );


    if (!btnCerrar) {
        return;
    }


    btnCerrar.addEventListener(
        "click",
        function () {

            function cerrar() {

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


            if (
                typeof Swal !== "undefined"
            ) {

                Swal.fire({

                    title:
                        "Â¿Cerrar sesiÃ³n?",

                    text:
                        "Vas a salir de tu cuenta.",

                    icon:
                        "question",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "SÃ­, cerrar sesiÃ³n",

                    cancelButtonText:
                        "Cancelar",

                    reverseButtons:
                        true

                }).then(
                    function (resultado) {

                        if (
                            resultado.isConfirmed
                        ) {

                            cerrar();
                        }
                    }
                );

            } else {

                if (
                    confirm(
                        "Â¿EstÃ¡ seguro de que desea cerrar sesiÃ³n?"
                    )
                ) {

                    cerrar();
                }
            }
        }
    );
}


/* =====================================================
   EXPORTAR FUNCIONES
   ===================================================== */

window.cargarPerfil =
    cargarPerfil;

window.configurarVolverInicio =
    configurarVolverInicio;

window.configurarFotoPerfil =
    configurarFotoPerfil;





