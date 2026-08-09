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
document.addEventListener("DOMContentLoaded", () => {

    const footer = document.getElementById("footer-container");
    if (!footer) return;

    fetch("../footer/footer_admin.html")
        .then(res => res.text())
        .then(data => {
            footer.innerHTML = data;
        })
        .catch(() => {
            fetch("../../footer/footer_admin.html")
                .then(res => res.text())
                .then(data => {
                    footer.innerHTML = data;
                });
        });

});

