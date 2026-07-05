document.addEventListener("DOMContentLoaded", function() {
    mostrarServicios();
    actualizarTotal();
    mostrarMensajeConfirmacion();
});

function mostrarMensajeConfirmacion() {
    var mensaje = localStorage.getItem("mensajeCita");
    if (!mensaje) {
        return;
    }

    var contenedor = document.createElement("div");
    contenedor.id = "mensajeFlotante";

    var esExito = mensaje.includes("correctamente") || mensaje.includes("✅");
    var esEliminacion = mensaje.includes("eliminada");

    if (esExito) {
        contenedor.className = "mensaje-exito";
    } else if (esEliminacion) {
        contenedor.className = "mensaje-error";
    } else {
        contenedor.className = "mensaje-info";
    }

    var icono = "✅";
    if (mensaje.includes("editada")) icono = "✏️";
    if (mensaje.includes("eliminada")) icono = "🗑️";

    contenedor.innerHTML = '<span class="icono-mensaje">' + icono + '</span><span class="texto-mensaje">' + mensaje + '</span><button class="btn-cerrar-mensaje" onclick="cerrarMensaje()">✕</button>';

    document.body.appendChild(contenedor);

    setTimeout(function() {
        cerrarMensaje();
    }, 5000);
}

function cerrarMensaje() {
    var mensaje = document.getElementById("mensajeFlotante");
    if (mensaje) {
        mensaje.style.animation = "slideOutRight 0.5s ease forwards";
        setTimeout(function() {
            mensaje.remove();
            localStorage.removeItem("mensajeCita");
        }, 500);
    }
}

function mostrarServicios() {
    var contenedor = document.getElementById("tablaCitas");
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    // 🔥 OBTENER USUARIO LOGUEADO
    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    var usuario = usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
    var correoUsuario = usuario ? usuario.correo : null;

    // 🔥 FILTRAR CITAS SOLO DEL USUARIO LOGUEADO
    var citasFiltradas = citas;
    if (correoUsuario) {
        citasFiltradas = citas.filter(function(cita) {
            var correoCita = cita.usuarioCorreo || cita.correo;
            return correoCita === correoUsuario;
        });
    }

    if (citasFiltradas.length === 0) {
        contenedor.innerHTML = '<div class="sin-citas"><span class="icono-sin-citas">📅</span><h2>No hay servicios agendados</h2><p>Cuando agendes un servicio aparecerá aquí.</p></div>';
        return;
    }

    var html = "";

    for (var i = 0; i < citasFiltradas.length; i++) {
        var cita = citasFiltradas[i];
        var indexOriginal = citas.indexOf(cita);

        var servicioInfo = null;
        for (var j = 0; j < listaServicios.length; j++) {
            if (listaServicios[j].nombre.trim().toLowerCase() === cita.servicio.trim().toLowerCase()) {
                servicioInfo = listaServicios[j];
                break;
            }
        }

        var imagen = servicioInfo ? servicioInfo.imagen : "../assets/img/persona.png";

        var precio = servicioInfo ? Number(servicioInfo.precio).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }) : cita.precio || "N/A";

        var estado = cita.estado || "Pendiente";
        var claseEstado = "estado-pendiente";

        if (estado === "Pendiente") {
            claseEstado = "estado-pendiente";
        } else if (estado === "Confirmada") {
            claseEstado = "estado-confirmada";
        } else if (estado === "Cancelada") {
            claseEstado = "estado-cancelada";
        } else if (estado === "Completada") {
            claseEstado = "estado-completada";
        }

        // 🔥 BOTÓN PAGAR ELIMINADO - SOLO EDITAR Y ELIMINAR
        html += '<div class="cita-card">';
        html += '<div style="position: absolute; top: 15px; right: 15px;"><span class="estado-cita ' + claseEstado + '">' + estado + '</span></div>';
        html += '<div class="imgBox"><img src="' + imagen + '" alt="' + cita.servicio + '" onerror="this.src=\'../assets/img/persona.png\'"></div>';
        html += '<h3>' + cita.servicio + '</h3>';
        html += '<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 18px;"><div class="badge-servicio">' + precio + '</div></div>';
        html += '<div class="info">';
        html += '<p><strong>👤 Cliente:</strong> ' + cita.nombre + ' ' + cita.apellido + '</p>';
        html += '<p><strong>📅 Fecha:</strong> ' + cita.fecha + ' - ' + cita.hora + '</p>';
        html += '<p><strong>👨‍💼 Profesional:</strong> ' + cita.profesional + '</p>';
        html += '<p><strong>📧 Correo:</strong> ' + cita.correo + '</p>';
        html += '<p><strong>📞 Teléfono:</strong> ' + cita.telefono + '</p>';
        html += '<p><strong>📍 Dirección:</strong> ' + cita.direccion + ', ' + cita.ciudad + '</p>';
        html += '<p><strong>📋 Tipo:</strong> ' + (cita.tipo || "N/A") + ' | <strong>🕐 Jornada:</strong> ' + (cita.jornada || "N/A") + '</p>';
        html += '</div>';
        html += '<div class="botones">';
        html += '<button class="btn-editar" onclick="editarCita(' + indexOriginal + ')">✏️ Editar</button>';
        html += '<button class="btn-eliminar" onclick="eliminarCita(' + indexOriginal + ')">🗑️ Eliminar</button>';
        html += '</div>';
        html += '</div>';
    }

    contenedor.innerHTML = html;
}

function actualizarTotal() {
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    
    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    var usuario = usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
    var correoUsuario = usuario ? usuario.correo : null;
    
    var citasFiltradas = citas.filter(function(cita) {
        var correoCita = cita.usuarioCorreo || cita.correo;
        return correoCita === correoUsuario;
    });
    
    var totalElement = document.getElementById("totalCitas");
    if (totalElement) {
        totalElement.textContent = citasFiltradas.length + " cita" + (citasFiltradas.length !== 1 ? 's' : '') + " agendadas";
    }
}

function editarCita(index) {
    if (confirm("✏️ ¿Desea editar esta cita?")) {
        localStorage.setItem("citaEditar", index);
        window.location.href = "Agendar_Cita.html";
    }
}

function eliminarCita(index) {
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var cita = citas[index];

    if (!cita) {
        return;
    }

    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    var usuario = usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
    var correoUsuario = usuario ? usuario.correo : null;
    var correoCita = cita.usuarioCorreo || cita.correo;

    if (correoCita !== correoUsuario) {
        alert("❌ No tienes permiso para eliminar esta cita");
        return;
    }

    if (confirm("🗑️ ¿Está seguro de eliminar la cita de " + cita.nombre + " " + cita.apellido + "?\n\nServicio: " + cita.servicio + "\nFecha: " + cita.fecha + " - " + cita.hora)) {
        citas.splice(index, 1);
        localStorage.setItem("citas", JSON.stringify(citas));
        localStorage.setItem("mensajeCita", "eliminada");
        window.location.reload();
    }
}

window.editarCita = editarCita;
window.eliminarCita = eliminarCita;
window.cerrarMensaje = cerrarMensaje;