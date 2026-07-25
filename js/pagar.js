document.addEventListener("DOMContentLoaded", function () {

    const usuario = localStorage.getItem("usuarioLogueado");

    if (!usuario) {

        alert("Debes iniciar sesión para realizar la compra.");

        window.location.href = "../inicio/login.html";

        return;
    }

});
document.addEventListener("DOMContentLoaded",function(){
cargarPago();
activarValidaciones();
configurarPago();
});

function formatoPrecio(valor){
return Number(valor).toLocaleString("es-CO",{
style:"currency",
currency:"COP",
minimumFractionDigits:0
});
}

function cargarPago(){

let carrito=JSON.parse(localStorage.getItem("carritoProductos"))||[];
let productos=document.getElementById("productosPago");
let subtotal=0;

if(!productos)return;

productos.innerHTML="";

if(carrito.length===0){
productos.innerHTML="<p>No hay productos para pagar</p>";
document.getElementById("subtotalPago").innerHTML="$0";
document.getElementById("ivaPago").innerHTML="$0";
document.getElementById("totalPago").innerHTML="$0";
return;
}

carrito.forEach(producto=>{

let cantidad=Number(producto.cantidad)||1;
let precio=Number(producto.precio)||0;

subtotal+=precio*cantidad;

productos.innerHTML+=`
<div class="producto-pago">
<img src="${producto.imagen}">
<div>
<h4>${producto.nombre}</h4>
<p>${cantidad} x ${formatoPrecio(precio)}</p>
</div>
</div>`;

});

let iva=subtotal*0.19;
let total=subtotal+iva;

document.getElementById("subtotalPago").innerHTML=formatoPrecio(subtotal);
document.getElementById("ivaPago").innerHTML=formatoPrecio(iva);
document.getElementById("totalPago").innerHTML=formatoPrecio(total);

}

function mostrarMensaje(id,texto,correcto){

let campo=document.getElementById(id);

if(!campo)return;

campo.innerHTML=texto;
campo.style.color=correcto?"green":"red";

}

function validarNombre(){

let input=document.getElementById("nombre");
let valor=input.value;

valor=valor.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ ]/g,"");

input.value=valor.trimStart();

if(valor.trim().length>=3 && valor.trim().length<=100){

input.style.border="2px solid green";

mostrarMensaje("errorNombre","✔ Nombre válido",true);

return true;

}else{

input.style.border="2px solid red";

mostrarMensaje("errorNombre","✖ Solo letras mínimo 3 caracteres",false);

return false;

}

}

function validarCorreo(){

let input=document.getElementById("correo");
let correo=input.value.trim();

let valido=/^[^\s@]+@[^\s@]+\.(com|co|net|org)$/i.test(correo);

if(valido){

input.style.border="2px solid green";

mostrarMensaje("errorCorreo","✔ Correo válido",true);

return true;

}else{

input.style.border="2px solid red";

mostrarMensaje("errorCorreo","✖ Correo inválido ejemplo@gmail.com",false);

return false;

}

}

function validarMetodo(){

let metodo=document.getElementById("metodoPago");

if(metodo.value===""){

metodo.style.border="2px solid red";

mostrarMensaje("errorMetodo","✖ Seleccione método de pago",false);

return false;

}

metodo.style.border="2px solid green";

mostrarMensaje("errorMetodo","✔ Método seleccionado",true);

return true;

}

function activarValidaciones(){

document.getElementById("nombre").addEventListener("input",validarNombre);

document.getElementById("correo").addEventListener("input",validarCorreo);

document.getElementById("metodoPago").addEventListener("change",validarMetodo);

}

function configurarPago(){

let boton=document.getElementById("btnPagar");

if(!boton)return;

boton.addEventListener("click",function(){

let nombre=validarNombre();
let correo=validarCorreo();
let metodo=validarMetodo();

if(!nombre||!correo||!metodo){
return;
}

if(confirm("✔ Datos validados correctamente\n\n¿Desea continuar con el pago?")){

abrirDatosBancarios();

}

});

}

function abrirDatosBancarios(){

let metodo=document.getElementById("metodoPago").value;

let modal=document.getElementById("modalBanco");

let banco=document.getElementById("banco");

let zonaBanco=document.getElementById("zonaBanco");

let zonaEfecty=document.getElementById("zonaEfecty");


modal.style.display="flex";


if(metodo==="Efecty"){

zonaBanco.style.display="none";
zonaEfecty.style.display="block";

}else{

zonaBanco.style.display="block";
zonaEfecty.style.display="none";


if(metodo==="Otros"){

banco.value="";
banco.readOnly=false;

}else{

banco.value=metodo;
banco.readOnly=true;

}

}

}

let cerrarBanco=document.getElementById("cerrarBanco");

if(cerrarBanco){

cerrarBanco.addEventListener("click",function(){

document.getElementById("modalBanco").style.display="none";

});

}


let confirmarBanco=document.getElementById("confirmarBanco");

if(confirmarBanco){

confirmarBanco.addEventListener("click",function(){

let metodo=document.getElementById("metodoPago").value;


if(metodo!=="Efecty"){

let banco=document.getElementById("banco").value.trim();
let cuenta=document.getElementById("tipoCuenta").value;
let numero=document.getElementById("numeroCuenta").value.trim();


if(banco===""){

alert("Ingrese el banco");
return;

}


if(cuenta===""){

alert("Seleccione tipo de cuenta");
return;

}


if(numero.length<5){

alert("Número de cuenta inválido");
return;

}

}


if(confirm("¿Confirma realizar el pago?")){


localStorage.setItem("estadoPago","Pagado");


document.getElementById("modalBanco").style.display="none";


document.getElementById("modalFinal").style.display="flex";


}


});

}


let finalizar=document.getElementById("finalizarCompra");

if(finalizar){

finalizar.addEventListener("click",function(){

localStorage.setItem("estadoPago","Pagado");
localStorage.removeItem("carritoProductos");

window.location.href="../catalogo/productos.html";

});

}