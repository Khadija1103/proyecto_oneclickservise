document.addEventListener("DOMContentLoaded", function () {

    mostrarServicios();
    actualizarTotal();

});

//======================================================
// MOSTRAR SERVICIOS AGENDADOS
//======================================================

function mostrarServicios() {

    var contenedor = document.getElementById("tablaCitas");

    if (!contenedor) return;

    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    var usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    var correoUsuario = usuario ? usuario.correo : null;

    var citasFiltradas = citas.filter(function (cita) {

        return (cita.usuarioCorreo || cita.correo) === correoUsuario;

    });

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

                <p><strong>📞 Teléfono:</strong> ${cita.telefono}</p>

                <p><strong>📍 Dirección:</strong> ${cita.direccion}, ${cita.ciudad}</p>

                <p>
                    <strong>📋 Tipo:</strong> ${cita.tipo}
                    |
                    <strong>🕒 Jornada:</strong> ${cita.jornada}
                </p>

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
            cantidad + " servicio" + (cantidad !== 1 ? "s" : "") + " agendado" + (cantidad !== 1 ? "s" : "");

    }

}