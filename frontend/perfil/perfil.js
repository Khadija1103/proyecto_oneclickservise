// =====================================================
// PERFIL - ONE CLICK SERVICE
// =====================================================

const API_URL = "https://on-6af233feddf64804961110ffe0c54ab2.ecs.us-east-1.on.aws/usuarios";

// =====================================================
// INICIO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();
});

// =====================================================
// CARGAR PERFIL
// =====================================================

function cargarPerfil() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../login/login.html";
        return;
    }

    document.getElementById("nombreUsuario").textContent =
        `${usuario.nombre} ${usuario.apellido}`;

    document.getElementById("nombre").value =
        usuario.nombre || "";

    document.getElementById("apellido").value =
        usuario.apellido || "";

    document.getElementById("correo").value =
        usuario.correo || "";

    document.getElementById("telefono").value =
        usuario.telefono || "";

    document.getElementById("rol").value =
        usuario.rol || "CLIENTE";

    // ==========================
    // Rol superior
    // ==========================

    const badge = document.getElementById("rolBadge");
    const descripcion = document.getElementById("descripcionRol");

    if (badge) {
        badge.textContent = usuario.rol;

        if (usuario.rol === "ADMINISTRADOR") {
            badge.style.background = "#dc3545";
        } else {
            badge.style.background = "#ff4d94";
        }
    }

    if (descripcion) {

        if (usuario.rol === "ADMINISTRADOR") {

            descripcion.textContent =
                "Administra usuarios, servicios y la plataforma.";

        } else {

            descripcion.textContent =
                "Gestiona tu información personal y servicios.";

        }

    }

    // ==========================
    // Mostrar / ocultar secciones
    // ==========================

    const seccionSolicitudes =
        document.getElementById("seccionSolicitudes");

    const btnSolicitar =
        document.getElementById("btnSolicitar");

    if (usuario.rol === "ADMINISTRADOR") {

        if (seccionSolicitudes) {
            seccionSolicitudes.style.display = "none";
        }

        if (btnSolicitar) {
            btnSolicitar.style.display = "none";
        }

    } else {

        if (seccionSolicitudes) {
            seccionSolicitudes.style.display = "block";
        }

        if (btnSolicitar) {
            btnSolicitar.style.display = "inline-block";
        }

    }

    // ==========================
    // Foto de perfil
    // ==========================

    if (usuario.fotoPerfil) {
        document.getElementById("fotoPerfil").src =
            usuario.fotoPerfil;
    }

}

// =====================================================
// CAMBIAR FOTO
// =====================================================

const inputFoto = document.getElementById("inputFoto");

if (inputFoto) {

    inputFoto.addEventListener("change", function () {

        const archivo = this.files[0];

        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = function (e) {

            const foto = e.target.result;

            document.getElementById("fotoPerfil").src = foto;

            const usuario =
                JSON.parse(localStorage.getItem("usuario"));

            usuario.fotoPerfil = foto;

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

        };

        lector.readAsDataURL(archivo);

    });

}

// =====================================================
// ACTUALIZAR PERFIL
// =====================================================

const formulario = document.getElementById("formPerfil");

if (formulario) {

    formulario.addEventListener("submit", async function (e) {

        e.preventDefault();

        const usuarioActual =
            JSON.parse(localStorage.getItem("usuario"));

        const usuarioActualizado = {

            idUsuario: usuarioActual.idUsuario,

            nombre:
                document.getElementById("nombre").value,

            apellido:
                document.getElementById("apellido").value,

            correo:
                document.getElementById("correo").value,

            telefono:
                document.getElementById("telefono").value,

            rol:
                usuarioActual.rol,

            password:
                usuarioActual.password,

            fotoPerfil:
                usuarioActual.fotoPerfil || null

        };

        try {

            const respuesta = await fetch(
                `${API_URL}/${usuarioActual.idUsuario}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuarioActualizado)
                }
            );

            if (respuesta.ok) {

                const usuarioGuardado =
                    await respuesta.json();

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(usuarioGuardado)
                );

                alert("Perfil actualizado correctamente");

                cargarPerfil();

            } else {

                alert("No se pudo actualizar el perfil.");

            }

        } catch (error) {

            console.error(error);

            alert("Error de conexión con el servidor.");

        }

    });

}

// =====================================================
// CERRAR SESIÓN
// =====================================================

const btnCerrar = document.getElementById("btnCerrar");

if (btnCerrar) {

    btnCerrar.addEventListener("click", () => {

        localStorage.removeItem("usuario");

        window.location.href =
            "../login/login.html";

    });

}

// =====================================================
// SOLICITAR SERVICIO
// =====================================================

const btnSolicitar = document.getElementById("btnSolicitar");

if (btnSolicitar) {

    btnSolicitar.addEventListener("click", () => {

        window.location.href =
            "../servicios/servicios.html";

    });

}