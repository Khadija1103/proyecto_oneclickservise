document.addEventListener("DOMContentLoaded", () => {

    mostrarServicios();
    actualizarTotal();

    // ==========================
    // MENSAJE DE GUARDADO / EDICIÓN
    // ==========================
    const mensaje = localStorage.getItem("mensajeCita");

    if (mensaje) {
        alert(mensaje);
        localStorage.removeItem("mensajeCita");
    }

});


// ============================================
// MOSTRAR SERVICIOS AGENDADOS
// ============================================
function mostrarServicios() {

    const contenedor = document.getElementById("tablaCitas");
    if (!contenedor) return;

    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    const listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];

    if (citas.length === 0) {

        contenedor.innerHTML = `
            <div class="sin-citas">
                <h2>📅 No hay servicios agendados</h2>
                <p>Cuando agendes un servicio aparecerá aquí.</p>
            </div>
        `;
        return;
    }

    let html = "";

    citas.forEach((cita, index) => {

        const servicioInfo = listaServicios.find(s =>
            s.nombre &&
            cita.servicio &&
            s.nombre.trim().toLowerCase() === cita.servicio.trim().toLowerCase()
        );

        const imagen = servicioInfo?.imagen || "../img/user.png";

        const precio = servicioInfo?.precio
            ? Number(servicioInfo.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            })
            : "";

        html += `
        <div class="cita-card">

            <div class="imgBox">
                <img src="${imagen}" alt="${cita.servicio || ''}">
            </div>

            <h3>${cita.servicio || 'Servicio'}</h3>

            <div class="badge-servicio">
                ${precio}
            </div>

            <div class="info">

                <p><strong>Cliente:</strong> ${cita.nombre || ''} ${cita.apellido || ''}</p>
                <p><strong>📧 Correo:</strong> ${cita.correo || ''}</p>
                <p><strong>📱 Teléfono:</strong> ${cita.telefono || ''}</p>
                <p><strong>🏠 Dirección:</strong> ${cita.direccion || ''}</p>
                <p><strong>🏙 Ciudad:</strong> ${cita.ciudad || ''}</p>
                <p><strong>📋 Tipo:</strong> ${cita.tipo || ''}</p>
                <p><strong>🌞 Jornada:</strong> ${cita.jornada || ''}</p>
                <p><strong>📅 Fecha:</strong> ${cita.fecha || ''}</p>
                <p><strong>🕒 Hora:</strong> ${cita.hora || ''}</p>
                <p><strong>👨‍🔧 Profesional:</strong> ${cita.profesional || ''}</p>

            </div>

        </div>
        `;
    });

    contenedor.innerHTML = html;
}


// ============================================
// TOTAL DE SERVICIOS
// ============================================
function actualizarTotal() {

    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    const total = document.getElementById("totalCitas");

    if (!total) return;

    const cantidad = citas.length;

    total.textContent = `${cantidad} servicio${cantidad !== 1 ? "s" : ""}`;
}