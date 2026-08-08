document.addEventListener("DOMContentLoaded", () => {

const formulario = document.getElementById("formTrabaja");

if(!formulario){
console.error("No existe el formulario formTrabaja");
return;
}

const descripcion=document.getElementById("descripcion");
const contador=document.getElementById("contadorDescripcion");

const mensajeExito=document.getElementById("mensajeExito");
const mensajeError=document.getElementById("mensajeError");

const API_URL="http://localhost:8080/api/postulaciones";


// CONTADOR DESCRIPCIÓN

if(descripcion && contador){

descripcion.addEventListener("input",()=>{

contador.textContent=
`${descripcion.value.length} / 1000`;

});

}



// MOSTRAR ERROR

function mostrarError(id,mensaje){

const elemento=document.getElementById(id);

if(elemento){
elemento.textContent=mensaje;
}

}



// LIMPIAR ERRORES

function limpiarErrores(){

document.querySelectorAll(".mensaje-error")
.forEach(error=>{
error.textContent="";
});

}



// VALIDAR CORREO

function validarCorreos(){

const correo=document.getElementById("correo")?.value.trim();
const confirmar=document.getElementById("confirmarCorreo")?.value.trim();


if(correo!==confirmar){

mostrarError(
"error-confirmarCorreo",
"Los correos no coinciden"
);

return false;

}

return true;

}



// VALIDAR DIAS

function validarDias(){

const dias=[
"lunes",
"martes",
"miercoles",
"jueves",
"viernes",
"sabado",
"domingo"
];


const seleccionado=dias.some(dia=>{

const elemento=document.getElementById(dia);

return elemento && elemento.checked;

});


if(!seleccionado){

mostrarError(
"error-dias",
"Seleccione mínimo un día disponible"
);

return false;

}


return true;

}



// VALIDAR HORARIO

function validarHorario(){

const inicio=document.getElementById("horaInicio")?.value;
const fin=document.getElementById("horaFin")?.value;


if(!inicio || !fin){

mostrarError(
"error-horario",
"Seleccione el horario"
);

return false;

}


if(inicio>=fin){

mostrarError(
"error-horario",
"La hora final debe ser mayor que la inicial"
);

return false;

}


return true;

}




// ENVIO FORMULARIO

formulario.addEventListener("submit",async(e)=>{

e.preventDefault();


limpiarErrores();


if(!validarCorreos()) return;

if(!validarDias()) return;

if(!validarHorario()) return;



const boton=document.getElementById("btnEnviar");


if(boton){

boton.disabled=true;

boton.innerHTML=
`
<span class="spinner-border spinner-border-sm"></span>
Enviando...
`;

}



const formData=new FormData();



const campos=[

"nombre",
"apellido",
"tipoDocumento",
"documento",
"fechaNacimiento",
"correo",
"telefono",
"ciudad",
"direccion",
"profesion",
"especialidad",
"categoria",
"experiencia",
"disponibilidad",
"descripcion",
"servicios",
"precioMinimo",
"precioMaximo",
"horaInicio",
"horaFin",
"referencia1",
"telefonoReferencia1",
"referencia2",
"telefonoReferencia2"

];



campos.forEach(campo=>{

const elemento=document.getElementById(campo);

if(elemento){

formData.append(
campo,
elemento.value
);

}

});




// DIAS DISPONIBLES

const diasSeleccionados=[];


[
"lunes",
"martes",
"miercoles",
"jueves",
"viernes",
"sabado",
"domingo"

].forEach(dia=>{

const check=document.getElementById(dia);

if(check && check.checked){

diasSeleccionados.push(dia);

}

});


formData.append(
"diasDisponibles",
diasSeleccionados.join(",")
);




// ACEPTACIONES

[
"aceptaDatos",
"aceptaInformacion",
"aceptaTerminos"

].forEach(id=>{

const check=document.getElementById(id);

if(check){

formData.append(
id,
check.checked
);

}

});




// ARCHIVOS

[
"fotoPerfil",
"hojaVida",
"certificados",
"portafolio"

].forEach(id=>{


const input=document.getElementById(id);


if(input && input.files.length>0){


Array.from(input.files)
.forEach(file=>{

formData.append(
id,
file
);

});


}


});




try{


const respuesta=await fetch(
API_URL,
{
method:"POST",
body:formData
}
);



if(!respuesta.ok){

throw new Error(
"Error enviando información"
);

}



if(mensajeExito){

mensajeExito.classList.remove("d-none");

}


if(mensajeError){

mensajeError.classList.add("d-none");

}


formulario.reset();


if(contador){

contador.textContent="0 / 1000";

}



}catch(error){


console.error(
"Error:",
error
);



if(mensajeError){

mensajeError.classList.remove("d-none");

}



if(mensajeExito){

mensajeExito.classList.add("d-none");

}



}finally{


if(boton){

boton.disabled=false;

boton.innerHTML=
`
<i class="bi bi-send-fill"></i>
Enviar postulación
`;

}


}



});


});



