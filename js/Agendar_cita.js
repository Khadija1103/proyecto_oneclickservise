document.addEventListener("DOMContentLoaded", function() {

    var servicioSeleccionado = localStorage.getItem("servicioSeleccionado");
    var indiceEditar = localStorage.getItem("citaEditar");

    localStorage.removeItem("mensajeCita");

    if (indiceEditar === null && servicioSeleccionado) {
        var servicioInput = document.getElementById("servicio");
        servicioInput.value = servicioSeleccionado;
        servicioInput.readOnly = true;
    }

    if (indiceEditar !== null) {
        cargarDatosFormulario(indiceEditar);
        document.getElementById("servicio").readOnly = false;
    }

    var fecha = document.getElementById("fecha");
    var hoy = new Date().toISOString().split("T")[0];
    fecha.min = hoy;
    fecha.value = hoy;

    cargarProfesionales();

    configurarValidaciones();

    document.getElementById("btnConfirmar").addEventListener("click", function(e) {
        e.preventDefault();
        guardarCita();
    });

});

function cargarProfesionales() {
    var select = document.getElementById("profesional");
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    select.innerHTML = '<option value="">Seleccionar profesional</option>';

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].tipoUsuario === "empleado") {
            var nombreCompleto = usuarios[i].nombres + " " + usuarios[i].apellidos;
            var option = document.createElement("option");
            option.value = nombreCompleto;
            option.textContent = nombreCompleto;
            select.appendChild(option);
        }
    }
}

function cargarDatosFormulario(indice) {
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var cita = citas[indice];

    if (!cita) return;

    document.getElementById("nombre").value = cita.nombre || "";
    document.getElementById("apellido").value = cita.apellido || "";
    document.getElementById("correo").value = cita.correo || "";
    document.getElementById("telefono").value = cita.telefono || "";
    document.getElementById("direccion").value = cita.direccion || "";
    document.getElementById("ciudad").value = cita.ciudad || "";
    document.getElementById("servicio").value = cita.servicio || "";
    document.getElementById("fecha").value = cita.fecha || "";
    document.getElementById("hora").value = cita.hora || "";

    var select = document.getElementById("profesional");
    select.value = cita.profesional || "";

    if (select.value !== cita.profesional) {
        var options = select.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === cita.profesional) {
                options[i].selected = true;
                break;
            }
        }
    }

    var tipo = document.querySelector('input[name="tipo"][value="' + cita.tipo + '"]');
    if (tipo) tipo.checked = true;

    var jornada = document.querySelector('input[name="jornada"][value="' + cita.jornada + '"]');
    if (jornada) {
        jornada.checked = true;
        actualizarHorasPorJornada(cita.jornada);
    }
}

// ============================================
// CONFIGURAR VALIDACIONES
// ============================================
function configurarValidaciones() {

    // NOMBRE - Solo letras
    var nombreInput = document.getElementById("nombre");
    nombreInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("nombre", "Solo letras");
        }
    });
    nombreInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("nombre", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(this.value)) {
            mostrarExito("nombre");
        } else {
            mostrarError("nombre", "Mínimo 3 caracteres");
        }
    });

    // APELLIDO - Solo letras
    var apellidoInput = document.getElementById("apellido");
    apellidoInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("apellido", "Solo letras");
        }
    });
    apellidoInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("apellido", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(this.value)) {
            mostrarExito("apellido");
        } else {
            mostrarError("apellido", "Mínimo 3 caracteres");
        }
    });

    // CORREO - @ y .com
    var correoInput = document.getElementById("correo");
    correoInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("correo", "Campo obligatorio");
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
            mostrarExito("correo");
        } else {
            mostrarError("correo", "Debe tener @ y .com");
        }
    });

    // TELÉFONO - Solo números 7-10 dígitos
    var telefonoInput = document.getElementById("telefono");
    telefonoInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        if (charCode < 48 || charCode > 57) {
            e.preventDefault();
            mostrarError("telefono", "Solo números");
        }
    });
    telefonoInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
        if (this.value.trim() === "") {
            mostrarError("telefono", "Campo obligatorio");
        } else if (/^\d{7,10}$/.test(this.value)) {
            mostrarExito("telefono");
        } else {
            mostrarError("telefono", "Mínimo 7 dígitos");
        }
    });

    // CIUDAD - Solo letras
    var ciudadInput = document.getElementById("ciudad");
    ciudadInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("ciudad", "Solo letras");
        }
    });
    ciudadInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("ciudad", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(this.value)) {
            mostrarExito("ciudad");
        } else {
            mostrarError("ciudad", "Mínimo 3 caracteres");
        }
    });

    // DIRECCIÓN - Mínimo 5 caracteres
    var direccionInput = document.getElementById("direccion");
    direccionInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("direccion", "Campo obligatorio");
        } else if (this.value.trim().length >= 5) {
            mostrarExito("direccion");
        } else {
            mostrarError("direccion", "Mínimo 5 caracteres");
        }
    });

    // JORNADA - Actualizar horas
    var radiosJornada = document.querySelectorAll('input[name="jornada"]');
    for (var i = 0; i < radiosJornada.length; i++) {
        radiosJornada[i].addEventListener("change", function() {
            actualizarHorasPorJornada(this.value);
            validarHoraConJornada();
        });
    }

    // FECHA
    var fechaInput = document.getElementById("fecha");
    fechaInput.addEventListener("change", function() {
        if (this.value === "") {
            mostrarError("fecha", "Seleccione una fecha");
        } else {
            mostrarExito("fecha");
        }
    });

    // HORA
    var horaSelect = document.getElementById("hora");
    horaSelect.addEventListener("change", function() {
        if (this.value === "") {
            mostrarError("hora", "Seleccione una hora");
        } else {
            mostrarExito("hora");
        }
    });

    // PROFESIONAL
    var profesionalSelect = document.getElementById("profesional");
    profesionalSelect.addEventListener("change", function() {
        if (this.value === "") {
            mostrarError("profesional", "Seleccione un profesional");
        } else {
            mostrarExito("profesional");
        }
    });

    // TIPO
    var radiosTipo = document.querySelectorAll('input[name="tipo"]');
    for (var i = 0; i < radiosTipo.length; i++) {
        radiosTipo[i].addEventListener("change", function() {
            var seleccionado = document.querySelector('input[name="tipo"]:checked');
            if (seleccionado) {
                mostrarExito("tipo");
            }
        });
    }
}

// ============================================
// ACTUALIZAR HORAS SEGÚN JORNADA
// ============================================
function actualizarHorasPorJornada(jornada) {
    var selectHora = document.getElementById("hora");
    var horasAM = ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
    var horasPM = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];
    
    var horasDisponibles = jornada === "AM" ? horasAM : horasPM;
    var valorActual = selectHora.value;
    
    selectHora.innerHTML = '<option value="">Seleccionar hora</option>';
    
    for (var i = 0; i < horasDisponibles.length; i++) {
        var option = document.createElement("option");
        option.value = horasDisponibles[i];
        option.textContent = horasDisponibles[i];
        selectHora.appendChild(option);
    }
    
    var existe = false;
    for (var i = 0; i < selectHora.options.length; i++) {
        if (selectHora.options[i].value === valorActual) {
            existe = true;
            break;
        }
    }
    
    if (existe) {
        selectHora.value = valorActual;
    }
}

function validarHoraConJornada() {
    var jornadaSeleccionada = document.querySelector('input[name="jornada"]:checked');
    var hora = document.getElementById("hora").value;
    
    if (!jornadaSeleccionada || !hora) return;
    
    var esAM = jornadaSeleccionada.value === "AM";
    var esHorarioAM = hora.includes("AM");
    var esHorarioPM = hora.includes("PM");
    
    if (esAM && esHorarioPM) {
        mostrarError("hora", "Seleccionó AM pero la hora es PM");
    } else if (!esAM && esHorarioAM) {
        mostrarError("hora", "Seleccionó PM pero la hora es AM");
    } else {
        mostrarExito("hora");
    }
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
function mostrarError(id, mensaje) {
    var campo = document.getElementById(id);
    if (campo) {
        campo.classList.add("errorInput");
        campo.classList.remove("successInput");
    }
    
    var errorDiv = document.getElementById("error-" + id);
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.add("visible");
    }
    
    var exitoDiv = document.getElementById("exito-" + id);
    if (exitoDiv) {
        exitoDiv.classList.remove("visible");
    }
}

function mostrarExito(id) {
    var campo = document.getElementById(id);
    if (campo) {
        campo.classList.remove("errorInput");
        campo.classList.add("successInput");
    }
    
    var errorDiv = document.getElementById("error-" + id);
    if (errorDiv) {
        errorDiv.classList.remove("visible");
        errorDiv.textContent = "";
    }
    
    var exitoDiv = document.getElementById("exito-" + id);
    if (exitoDiv) {
        exitoDiv.classList.add("visible");
    }
}

function limpiarErrores() {
    var campos = document.querySelectorAll(".errorInput, .successInput");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("errorInput", "successInput");
    }
    
    var errores = document.querySelectorAll(".mensaje-error");
    for (var i = 0; i < errores.length; i++) {
        errores[i].classList.remove("visible");
        errores[i].textContent = "";
    }
    
    var exitos = document.querySelectorAll(".mensaje-exito");
    for (var i = 0; i < exitos.length; i++) {
        exitos[i].classList.remove("visible");
    }
}

// ============================================
// GUARDAR CITA
// ============================================
function guardarCita() {

    var indiceEditar = localStorage.getItem("citaEditar");

    var nombre = document.getElementById("nombre").value.trim();
    var apellido = document.getElementById("apellido").value.trim();
    var correo = document.getElementById("correo").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var direccion = document.getElementById("direccion").value.trim();
    var ciudad = document.getElementById("ciudad").value.trim();
    var servicio = document.getElementById("servicio").value.trim();

    if (servicio === "") {
        servicio = localStorage.getItem("servicioSeleccionado") || "";
    }

    var fecha = document.getElementById("fecha").value;
    var hora = document.getElementById("hora").value;
    var profesional = document.getElementById("profesional").value;

    var tipoSeleccionado = document.querySelector('input[name="tipo"]:checked');
    var jornadaSeleccionada = document.querySelector('input[name="jornada"]:checked');

    limpiarErrores();

    var formularioValido = true;

    // ============================================
    // VALIDACIONES
    // ============================================
    if (nombre === "") {
        mostrarError("nombre", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(nombre)) {
        mostrarError("nombre", "Solo letras (3 a 15 caracteres)");
        formularioValido = false;
    } else {
        mostrarExito("nombre");
    }

    if (apellido === "") {
        mostrarError("apellido", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,15}$/.test(apellido)) {
        mostrarError("apellido", "Solo letras (3 a 15 caracteres)");
        formularioValido = false;
    } else {
        mostrarExito("apellido");
    }

    if (correo === "") {
        mostrarError("correo", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError("correo", "Debe tener @ y .com");
        formularioValido = false;
    } else {
        mostrarExito("correo");
    }

    if (telefono === "") {
        mostrarError("telefono", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^\d{7,10}$/.test(telefono)) {
        mostrarError("telefono", "Solo números (7 a 10 dígitos)");
        formularioValido = false;
    } else {
        mostrarExito("telefono");
    }

    if (direccion === "") {
        mostrarError("direccion", "Campo obligatorio");
        formularioValido = false;
    } else if (direccion.length < 5) {
        mostrarError("direccion", "Mínimo 5 caracteres");
        formularioValido = false;
    } else {
        mostrarExito("direccion");
    }

    if (ciudad === "") {
        mostrarError("ciudad", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(ciudad)) {
        mostrarError("ciudad", "Solo letras");
        formularioValido = false;
    } else {
        mostrarExito("ciudad");
    }

    if (servicio === "") {
        mostrarError("servicio", "Campo obligatorio");
        formularioValido = false;
    } else {
        mostrarExito("servicio");
    }

    if (fecha === "") {
        mostrarError("fecha", "Seleccione una fecha");
        formularioValido = false;
    } else {
        mostrarExito("fecha");
    }

    if (hora === "") {
        mostrarError("hora", "Seleccione una hora");
        formularioValido = false;
    }

    if (profesional === "") {
        mostrarError("profesional", "Seleccione un profesional");
        formularioValido = false;
    } else {
        mostrarExito("profesional");
    }

    if (!tipoSeleccionado) {
        mostrarError("tipo", "Seleccione tipo de servicio");
        formularioValido = false;
    } else {
        mostrarExito("tipo");
    }

    if (!jornadaSeleccionada) {
        mostrarError("jornada", "Seleccione jornada");
        formularioValido = false;
    } else {
        mostrarExito("jornada");
    }

    // VALIDAR JORNADA vs HORA
    if (jornadaSeleccionada && hora) {
        var esAM = jornadaSeleccionada.value === "AM";
        var esHorarioAM = hora.includes("AM");
        var esHorarioPM = hora.includes("PM");
        
        if (esAM && esHorarioPM) {
            mostrarError("hora", "Seleccionó AM pero la hora es PM");
            formularioValido = false;
        } else if (!esAM && esHorarioAM) {
            mostrarError("hora", "Seleccionó PM pero la hora es AM");
            formularioValido = false;
        } else if (hora !== "") {
            mostrarExito("hora");
        }
    }

    if (!formularioValido) {
        var primerError = document.querySelector(".errorInput");
        if (primerError) {
            primerError.focus();
            primerError.select();
        }
        return;
    }

    // ============================================
    // CREAR CITA
    // ============================================
    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    var servicioEncontrado = null;
    for (var i = 0; i < listaServicios.length; i++) {
        if (listaServicios[i].nombre === servicio) {
            servicioEncontrado = listaServicios[i];
            break;
        }
    }

    // Obtener usuario logueado
    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    var usuario = usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
    var correoUsuario = usuario ? usuario.correo : correo;

    var cita = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        ciudad: ciudad,
        servicio: servicio,
        tipo: tipoSeleccionado.value,
        jornada: jornadaSeleccionada.value,
        fecha: fecha,
        hora: hora,
        profesional: profesional,
        imagen: servicioEncontrado ? servicioEncontrado.imagen : "",
        precio: servicioEncontrado ? Number(servicioEncontrado.precio).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }) : "",
        estado: "Pendiente",
        usuarioCorreo: correoUsuario
    };

    var citas = JSON.parse(localStorage.getItem("citas")) || [];

    if (indiceEditar !== null) {
        citas[indiceEditar] = cita;
        localStorage.removeItem("citaEditar");
        localStorage.setItem("mensajeCita", "editada");
    } else {
        citas.push(cita);
        localStorage.setItem("mensajeCita", "guardada");
    }

    localStorage.setItem("citas", JSON.stringify(citas));
    localStorage.removeItem("servicioSeleccionado");

    window.location.href = "GestionarCitas.html";
}