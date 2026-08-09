/* =====================================================
   SWEETALERT2 - REEMPLAZO DE ALERT NATIVO
   ===================================================== */
if (typeof Swal !== "undefined") {
    window.alert = function(mensaje) {
        Swal.fire({
            text: mensaje,
            icon: "info",
            confirmButtonText: "Aceptar"
        });
    };
}
// ==========================================
// PROTEGER PÁGINAS DEL ADMINISTRADOR
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../../login/login.html";
        return;
    }

    if (usuario.rol !== "ADMINISTRADOR") {

        Swal.fire({text: "No tienes permisos para acceder a esta página.", confirmButtonText: "Aceptar"});

        window.location.href = "../../inicio/index.html";
        return;
    }

});

