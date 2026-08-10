document.addEventListener("DOMContentLoaded", function () {

    const servicioSeleccionado = localStorage.getItem("servicioSeleccionado");
    const indiceEditar = localStorage.getItem("citaEditar");

    // No borrar el mensaje cuando venimos de editar
    if (!indiceEditar) {
        localStorage.removeItem("mensajeCita");
    }

    // Cargar profesionales primero
    cargarProfesionales();

    // Si es una edición cargar datos
    if (indiceEditar !== null) {
        cargarDatosFormulario(parseInt(indiceEditar));
        document.getElementById("servicio").readOnly = false;
    }
    // Si es una cita nueva
    else if (servicioSeleccionado) {
        const servicioInput = document.getElementById("servicio");
        servicioInput.value = servicioSeleccionado;
        servicioInput.readOnly = true;
    }

    // Fecha mínima = hoy
    const fecha = document.getElementById("fecha");
    const hoy = new Date().toISOString().split("T")[0];
    fecha.min = hoy;

    if (indiceEditar === null) {
        fecha.value = hoy;
    }

    configurarValidaciones();

    document
        .getElementById("btnConfirmar")
        .addEventListener("click", function (e) {
            e.preventDefault();
            guardarCita();
        });

});


//===================================================
// CARGAR PROFESIONALES
//===================================================

function cargarProfesionales() {

    const select = document.getElementById("profesional");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    select.innerHTML = '<option value="">Seleccionar profesional</option>';

    usuarios.forEach(function (usuario) {

        if (usuario.tipoUsuario === "empleado") {

            const option = document.createElement("option");

            option.value = usuario.nombres + " " + usuario.apellidos;
            option.textContent = usuario.nombres + " " + usuario.apellidos;

            select.appendChild(option);
        }

    });

}


//===================================================
// CARGAR DATOS AL EDITAR
//===================================================

function cargarDatosFormulario(indice) {

    const citas = JSON.parse(localStorage.getItem("citas")) || [];

    const cita = citas[indice];

    if (!cita) return;

    document.getElementById("nombre").value = cita.nombre || "";
    document.getElementById("apellido").value = cita.apellido || "";
    document.getElementById("correo").value = cita.correo || "";
    document.getElementById("telefono").value = cita.telefono || "";
    document.getElementById("direccion").value = cita.direccion || "";
    document.getElementById("ciudad").value = cita.ciudad || "";
    document.getElementById("servicio").value = cita.servicio || "";
    document.getElementById("fecha").value = cita.fecha || "";

    actualizarHorasPorJornada(cita.jornada);

    document.getElementById("hora").value = cita.hora || "";
    document.getElementById("profesional").value = cita.profesional || "";

    const tipo = document.querySelector(
        'input[name="tipo"][value="' + cita.tipo + '"]'
    );

    if (tipo) {
        tipo.checked = true;
    }

    const jornada = document.querySelector(
        'input[name="jornada"][value="' + cita.jornada + '"]'
    );

    if (jornada) {
        jornada.checked = true;
    }

} 

//===================================================
// CONFIGURAR VALIDACIONES
//===================================================

function configurarValidaciones() {

    //==========================
    // NOMBRE
    //==========================
    const nombre = document.getElementById("nombre");

    nombre.addEventListener("keypress", function (e) {

        const letra = String.fromCharCode(e.which || e.keyCode);

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(letra)) {
            e.preventDefault();
            mostrarError("nombre", "Solo letras");
        }

    });

    nombre.addEventListener("input", function () {

        if (this.value.trim() === "") {
            mostrarError("nombre", "Campo obligatorio");
        }
        else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(this.value)) {
            mostrarExito("nombre");
        }
        else {
            mostrarError("nombre", "Mínimo 3 letras");
        }

    });


    //==========================
    // APELLIDO
    //==========================

    const apellido = document.getElementById("apellido");

    apellido.addEventListener("keypress", function (e) {

        const letra = String.fromCharCode(e.which || e.keyCode);

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(letra)) {
            e.preventDefault();
            mostrarError("apellido", "Solo letras");
        }

    });

    apellido.addEventListener("input", function () {

        if (this.value.trim() === "") {
            mostrarError("apellido", "Campo obligatorio");
        }
        else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(this.value)) {
            mostrarExito("apellido");
        }
        else {
            mostrarError("apellido", "Mínimo 3 letras");
        }

    });


    //==========================
    // CORREO
    //==========================

    const correo = document.getElementById("correo");

    correo.addEventListener("input", function () {

        if (this.value.trim() === "") {
            mostrarError("correo", "Campo obligatorio");
        }
        else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
            mostrarExito("correo");
        }
        else {
            mostrarError("correo", "Correo inválido");
        }

    });


    //==========================
    // TELÉFONO
    //==========================

    const telefono = document.getElementById("telefono");

    telefono.addEventListener("keypress", function (e) {

        const codigo = e.which || e.keyCode;

        if (codigo < 48 || codigo > 57) {
            e.preventDefault();
        }

    });

    telefono.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, "");

        if (this.value.length > 10) {
            this.value = this.value.substring(0, 10);
        }

        if (this.value === "") {
            mostrarError("telefono", "Campo obligatorio");
        }
        else if (/^\d{7,10}$/.test(this.value)) {
            mostrarExito("telefono");
        }
        else {
            mostrarError("telefono", "Debe tener entre 7 y 10 dígitos");
        }

    });


    //==========================
    // DIRECCIÓN
    //==========================

    const direccion = document.getElementById("direccion");

    direccion.addEventListener("input", function () {

        if (this.value.trim() === "") {
            mostrarError("direccion", "Campo obligatorio");
        }
        else if (this.value.trim().length >= 5) {
            mostrarExito("direccion");
        }
        else {
            mostrarError("direccion", "Mínimo 5 caracteres");
        }

    });


    //==========================
    // CIUDAD
    //==========================

    const ciudad = document.getElementById("ciudad");

    ciudad.addEventListener("keypress", function (e) {

        const letra = String.fromCharCode(e.which || e.keyCode);

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(letra)) {
            e.preventDefault();
        }

    });

    ciudad.addEventListener("input", function () {

        if (this.value.trim() === "") {
            mostrarError("ciudad", "Campo obligatorio");
        }
        else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(this.value)) {
            mostrarExito("ciudad");
        }
        else {
            mostrarError("ciudad", "Solo letras");
        }

    });


    //==========================
    // FECHA
    //==========================

    document.getElementById("fecha").addEventListener("change", function () {

        if (this.value === "") {
            mostrarError("fecha", "Seleccione una fecha");
        }
        else {
            mostrarExito("fecha");
        }

    });


    //==========================
    // HORA
    //==========================

    document.getElementById("hora").addEventListener("change", function () {

        if (this.value === "") {
            mostrarError("hora", "Seleccione una hora");
        }
        else {
            mostrarExito("hora");
            validarHoraConJornada();
        }

    });


    //==========================
    // PROFESIONAL
    //==========================

    document.getElementById("profesional").addEventListener("change", function () {

        if (this.value === "") {
            mostrarError("profesional", "Seleccione un profesional");
        }
        else {
            mostrarExito("profesional");
        }

    });


    //==========================
    // TIPO
    //==========================

    document.querySelectorAll('input[name="tipo"]').forEach(function (radio) {

        radio.addEventListener("change", function () {
            mostrarExito("tipo");
        });

    });


    //==========================
    // JORNADA
    //==========================

    document.querySelectorAll('input[name="jornada"]').forEach(function (radio) {

        radio.addEventListener("change", function () {

            actualizarHorasPorJornada(this.value);

            mostrarExito("jornada");

            validarHoraConJornada();

        });

    });

}
//===================================================
// ACTUALIZAR HORAS SEGÚN LA JORNADA
//===================================================

function actualizarHorasPorJornada(jornada) {

    var selectHora = document.getElementById("hora");

    var horasAM = [
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM"
    ];

    var horasPM = [
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM"
    ];

    var horaActual = selectHora.value;

    selectHora.innerHTML = '<option value="">Seleccionar hora</option>';

    var horas = (jornada === "AM") ? horasAM : horasPM;

    for (var i = 0; i < horas.length; i++) {

        var option = document.createElement("option");
        option.value = horas[i];
        option.textContent = horas[i];

        selectHora.appendChild(option);

    }

    // Mantener la hora si existe (al editar)

    for (var j = 0; j < selectHora.options.length; j++) {

        if (selectHora.options[j].value === horaActual) {

            selectHora.value = horaActual;
            break;

        }

    }

}


//===================================================
// VALIDAR HORA SEGÚN JORNADA
//===================================================

function validarHoraConJornada() {

    var jornada = document.querySelector('input[name="jornada"]:checked');

    if (!jornada) return;

    var hora = document.getElementById("hora").value;

    if (hora === "") return;

    if (jornada.value === "AM" && hora.includes("PM")) {

        mostrarError("hora", "La hora no corresponde a la jornada AM");

        return;

    }

    if (jornada.value === "PM" && hora.includes("AM")) {

        mostrarError("hora", "La hora no corresponde a la jornada PM");

        return;

    }

    mostrarExito("hora");

}


//===================================================
// MOSTRAR ERROR
//===================================================

function mostrarError(id, mensaje) {

    var input = document.getElementById(id);

    if (input) {

        input.classList.remove("successInput");
        input.classList.add("errorInput");

    }

    var error = document.getElementById("error-" + id);

    if (error) {

        error.textContent = mensaje;
        error.classList.add("visible");

    }

    var exito = document.getElementById("exito-" + id);

    if (exito) {

        exito.classList.remove("visible");

    }

}


//===================================================
// MOSTRAR ÉXITO
//===================================================

function mostrarExito(id) {

    var input = document.getElementById(id);

    if (input) {

        input.classList.remove("errorInput");
        input.classList.add("successInput");

    }

    var error = document.getElementById("error-" + id);

    if (error) {

        error.textContent = "";
        error.classList.remove("visible");

    }

    var exito = document.getElementById("exito-" + id);

    if (exito) {

        exito.classList.add("visible");

    }

}


//===================================================
// LIMPIAR VALIDACIONES
//===================================================

function limpiarErrores() {

    var inputs = document.querySelectorAll(".errorInput, .successInput");

    for (var i = 0; i < inputs.length; i++) {

        inputs[i].classList.remove("errorInput");
        inputs[i].classList.remove("successInput");

    }

    var errores = document.querySelectorAll(".mensaje-error");

    for (var j = 0; j < errores.length; j++) {

        errores[j].textContent = "";
        errores[j].classList.remove("visible");

    }

    var exitos = document.querySelectorAll(".mensaje-exito");

    for (var k = 0; k < exitos.length; k++) {

        exitos[k].classList.remove("visible");

    }

}

//===================================================
// GUARDAR CITA
//===================================================

function guardarCita() {

    var indiceEditar = localStorage.getItem("citaEditar");

    var nombre = document.getElementById("nombre").value.trim();
    var apellido = document.getElementById("apellido").value.trim();
    var correo = document.getElementById("correo").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var direccion = document.getElementById("direccion").value.trim();
    var ciudad = document.getElementById("ciudad").value.trim();
    var servicio = document.getElementById("servicio").value.trim();
    var fecha = document.getElementById("fecha").value;
    var hora = document.getElementById("hora").value;
    var profesional = document.getElementById("profesional").value;

    if (servicio === "") {
        servicio = localStorage.getItem("servicioSeleccionado") || "";
    }

    var tipo = document.querySelector('input[name="tipo"]:checked');
    var jornada = document.querySelector('input[name="jornada"]:checked');

    limpiarErrores();

    var valido = true;

    if (nombre === "") {
        mostrarError("nombre", "Campo obligatorio");
        valido = false;
    }

    if (apellido === "") {
        mostrarError("apellido", "Campo obligatorio");
        valido = false;
    }

    if (correo === "") {
        mostrarError("correo", "Campo obligatorio");
        valido = false;
    }

    if (telefono === "") {
        mostrarError("telefono", "Campo obligatorio");
        valido = false;
    }

    if (direccion === "") {
        mostrarError("direccion", "Campo obligatorio");
        valido = false;
    }

    if (ciudad === "") {
        mostrarError("ciudad", "Campo obligatorio");
        valido = false;
    }

    if (servicio === "") {
        mostrarError("servicio", "Seleccione un servicio");
        valido = false;
    }

    if (fecha === "") {
        mostrarError("fecha", "Seleccione una fecha");
        valido = false;
    }

    if (hora === "") {
        mostrarError("hora", "Seleccione una hora");
        valido = false;
    }

    if (profesional === "") {
        mostrarError("profesional", "Seleccione un profesional");
        valido = false;
    }

    if (!tipo) {
        mostrarError("tipo", "Seleccione el tipo");
        valido = false;
    }

    if (!jornada) {
        mostrarError("jornada", "Seleccione la jornada");
        valido = false;
    }

    if (!valido) {
        return;
    }

    //====================================
    // OBTENER INFORMACIÓN DEL SERVICIO
    //====================================

    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    var servicioInfo = listaServicios.find(function(s) {
        return s.nombre &&
               s.nombre.trim().toLowerCase() === servicio.trim().toLowerCase();
    });

    //====================================
    // USUARIO LOGUEADO
    //====================================

    var usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    var usuarioCorreo = usuario ? usuario.correo : correo;

    //====================================
    // CREAR OBJETO
    //====================================

    var cita = {

        nombre: nombre,
        apellido: apellido,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        ciudad: ciudad,

        servicio: servicio,

        tipo: tipo.value,
        jornada: jornada.value,

        fecha: fecha,
        hora: hora,

        profesional: profesional,

        imagen: servicioInfo ? servicioInfo.imagen : "../assets/img/persona.png",

        precio: servicioInfo
            ? Number(servicioInfo.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            })
            : "",

        estado: "Pendiente",

        usuarioCorreo: usuarioCorreo

    };

    //====================================
    // GUARDAR
    //====================================

    var citas = JSON.parse(localStorage.getItem("citas")) || [];

    if (indiceEditar !== null) {

        citas[parseInt(indiceEditar)] = cita;

        localStorage.setItem(
            "mensajeCita",
            "✅ La cita fue editada correctamente."
        );

        localStorage.removeItem("citaEditar");

    } else {

        citas.push(cita);

        localStorage.setItem(
            "mensajeCita",
            "✅ La cita fue guardada correctamente."
        );

    }

    localStorage.setItem("citas", JSON.stringify(citas));

    localStorage.removeItem("servicioSeleccionado");

    window.location.href = "GestionarCitas.html";

}