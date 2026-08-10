document.addEventListener("DOMContentLoaded", function () {

    mostrarServicios();
    actualizarTotal();
    mostrarMensajeConfirmacion();

});

//======================================================
// MOSTRAR MENSAJE
//======================================================

function mostrarMensajeConfirmacion() {

    var mensaje = localStorage.getItem("mensajeCita");

    if (!mensaje) return;

    var contenedor = document.createElement("div");

    contenedor.id = "mensajeFlotante";

    if (mensaje.toLowerCase().includes("guardada")) {

        contenedor.className = "mensaje-exito";

    } else if (mensaje.toLowerCase().includes("editada")) {

        contenedor.className = "mensaje-info";

    } else if (mensaje.toLowerCase().includes("eliminada")) {

        contenedor.className = "mensaje-error";

    } else {

        contenedor.className = "mensaje-info";

    }

    var icono = "✅";

    if (mensaje.toLowerCase().includes("editada")) {

        icono = "✏️";

    }

    if (mensaje.toLowerCase().includes("eliminada")) {

        icono = "🗑️";

    }

    contenedor.innerHTML = `
        <span class="icono-mensaje">${icono}</span>
        <span class="texto-mensaje">${mensaje}</span>
        <button class="btn-cerrar-mensaje" onclick="cerrarMensaje()">✖</button>
    `;

    document.body.appendChild(contenedor);

    setTimeout(function () {

        cerrarMensaje();

    }, 5000);

}


//======================================================
// CERRAR MENSAJE
//======================================================

function cerrarMensaje() {

    var mensaje = document.getElementById("mensajeFlotante");

    if (!mensaje) return;

    mensaje.style.animation = "slideOutRight .5s forwards";

    setTimeout(function () {

        mensaje.remove();

        localStorage.removeItem("mensajeCita");

    }, 500);

}  
//======================================================
// MOSTRAR SERVICIOS
//======================================================

function mostrarServicios() {

    var contenedor = document.getElementById("tablaCitas");

    if (!contenedor) return;

    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    // Usuario logueado
    var usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    var correoUsuario = usuario ? usuario.correo : null;

    // Filtrar únicamente las citas del usuario
  // Corregir citas antiguas que no tienen usuarioCorreo
for (var i = 0; i < citas.length; i++) {

    if (!citas[i].usuarioCorreo) {

        citas[i].usuarioCorreo = correoUsuario;

    }

}

// Guardar los cambios
localStorage.setItem("citas", JSON.stringify(citas));

// Filtrar únicamente las citas del usuario
var citasFiltradas = citas.filter(function(cita){

    return cita.usuarioCorreo === correoUsuario;

});;

    if (citasFiltradas.length === 0) {

        contenedor.innerHTML = `
            <div class="sin-citas">
                <span class="icono-sin-citas">📅</span>
                <h2>No hay servicios agendados</h2>
                <p>Cuando agendes un servicio aparecerá aquí.</p>
            </div>
        `;

        return;

    }

    var html = "";

    citasFiltradas.forEach(function (cita) {

        // Índice real dentro del arreglo "citas"
        var indexOriginal = citas.findIndex(function (item) {

            return item === cita;

        });

        var servicioInfo = listaServicios.find(function (servicio) {

            return servicio.nombre &&
                   cita.servicio &&
                   servicio.nombre.trim().toLowerCase() ===
                   cita.servicio.trim().toLowerCase();

        });

        var imagen = servicioInfo
            ? servicioInfo.imagen
            : "../assets/img/persona.png";

        var precio = servicioInfo
            ? Number(servicioInfo.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            })
            : (cita.precio || "");

        var estado = cita.estado || "Pendiente";

        var claseEstado = "estado-pendiente";

        if (estado === "Confirmada") {

            claseEstado = "estado-confirmada";

        } else if (estado === "Cancelada") {

            claseEstado = "estado-cancelada";

        } else if (estado === "Completada") {

            claseEstado = "estado-completada";

        }

        html += `

        <div class="cita-card">

            <div style="position:absolute;top:15px;right:15px;">

                <span class="estado-cita ${claseEstado}">
                    ${estado}
                </span>

            </div>

            <div class="imgBox">

                <img src="${imagen}"
                     alt="${cita.servicio}"
                     onerror="this.src='../assets/img/persona.png'">

            </div>

            <h3>${cita.servicio}</h3>

            <div style="display:flex;justify-content:center;margin-bottom:18px;">

                <div class="badge-servicio">

                    ${precio}

                </div>

            </div>

            <div class="info">

                <p><strong>👤 Cliente:</strong> ${cita.nombre} ${cita.apellido}</p>

                <p><strong>📅 Fecha:</strong> ${cita.fecha} - ${cita.hora}</p>

                <p><strong>👨‍🔧 Profesional:</strong> ${cita.profesional}</p>

                <p><strong>📧 Correo:</strong> ${cita.correo}</p>

                <p><strong>📱 Teléfono:</strong> ${cita.telefono}</p>

                <p><strong>📍 Dirección:</strong> ${cita.direccion}, ${cita.ciudad}</p>

                <p>

                    <strong>📋 Tipo:</strong> ${cita.tipo}

                    |

                    <strong>🕒 Jornada:</strong> ${cita.jornada}

                </p>

            </div>

            <div class="botones">

                <button
                    class="btn-editar"
                    onclick="editarCita(${indexOriginal})">

                    ✏️ Editar

                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarCita(${indexOriginal})">

                    🗑️ Eliminar

                </button>

            </div>

        </div>

        `;

    });

    contenedor.innerHTML = html;

}
//======================================================
// ACTUALIZAR TOTAL
//======================================================

function actualizarTotal() {

    var citas = JSON.parse(localStorage.getItem("citas")) || [];

    var usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    var correoUsuario = usuario ? usuario.correo : null;

    var cantidad = citas.filter(function (cita) {

        return (cita.usuarioCorreo || cita.correo) === correoUsuario;

    }).length;

    var total = document.getElementById("totalCitas");

    if (total) {

        total.textContent =
            cantidad + " cita" + (cantidad !== 1 ? "s" : "") + " agendada" + (cantidad !== 1 ? "s" : "");

    }

}


//======================================================
// EDITAR CITA
//======================================================

function editarCita(index) {

    var citas = JSON.parse(localStorage.getItem("citas")) || [];

    if (!citas[index]) {

        alert("❌ No se encontró la cita.");
        return;

    }

    localStorage.setItem("citaEditar", index);

    window.location.href = "Agendar_Cita.html";

}


//======================================================
// ELIMINAR CITA
//======================================================

function eliminarCita(index) {

    var citas = JSON.parse(localStorage.getItem("citas")) || [];

    if (!citas[index]) {

        alert("❌ La cita no existe.");
        return;

    }

    var cita = citas[index];

    if (!confirm(
        "🗑️ ¿Desea eliminar esta cita?\n\n" +
        "Servicio: " + cita.servicio + "\n" +
        "Fecha: " + cita.fecha + "\n" +
        "Hora: " + cita.hora
    )) {

        return;

    }

    citas.splice(index, 1);

    localStorage.setItem("citas", JSON.stringify(citas));

    localStorage.setItem(
        "mensajeCita",
        "🗑️ La cita fue eliminada correctamente."
    );

    mostrarServicios();

    actualizarTotal();

    mostrarMensajeConfirmacion();

}


//======================================================
// EXPORTAR FUNCIONES
//======================================================

window.editarCita = editarCita;
window.eliminarCita = eliminarCita;
window.cerrarMensaje = cerrarMensaje;
