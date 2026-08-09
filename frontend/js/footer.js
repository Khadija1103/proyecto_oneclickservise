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

  fetch("../footer/footer.html")
    .then(res => res.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
    });

});
console.log("Hola footer");


