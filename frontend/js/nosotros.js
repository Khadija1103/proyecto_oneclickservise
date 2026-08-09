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
/* MENU */

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

menu.classList.toggle("activo");

});

}



//====================================
// TRABAJA CON NOSOTROS
//====================================


document.addEventListener("click",(e)=>{


if(e.target.id==="btnTrabajaMenu"){


e.preventDefault();



const modal =
document.getElementById("modalTrabaja");



if(modal){


const ventana =
bootstrap.Modal.getOrCreateInstance(modal);


ventana.show();



}else{


console.log(
"No existe modalTrabaja"
);


}



}



});

