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
// Selecciona todos los elementos de preguntas

const items = document.querySelectorAll(".item");

items.forEach(item => {

    item.addEventListener("click", () => {

        items.forEach(i => {

            if(i !== item){

                i.classList.remove("activo");

            }

        });

        item.classList.toggle("activo");

    });

});



// Menú lateral

const menuBtn = document.getElementById("menuBtn");

const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {

    menu.classList.toggle("activo");

});

