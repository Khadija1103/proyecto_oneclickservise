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

        alert("No tienes permisos para acceder a esta página.");

        window.location.href = "../../inicio/index.html";
        return;
    }

});