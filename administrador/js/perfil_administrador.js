document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedorTarjetas");
    const totalUsuariosSpan = document.getElementById("totalUsuarios");

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    console.log("Usuarios:", usuarios);

    // =========================
    // MENÚ HAMBURGUESA
    // =========================
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");
    const menuOverlay = document.getElementById("menuOverlay");

    function cerrarMenu() {
        if (menu) menu.classList.remove("activo");
        if (menuOverlay) menuOverlay.classList.remove("activo");
    }

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.classList.toggle("activo");
            if (menuOverlay) menuOverlay.classList.toggle("activo");
        });

        if (menuOverlay) {
            menuOverlay.addEventListener("click", cerrarMenu);
        }

        menu.querySelectorAll("a").forEach(a => a.addEventListener("click", cerrarMenu));

        document.addEventListener("click", function (e) {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                cerrarMenu();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") cerrarMenu();
        });
    }

    // =========================
    // TOTAL USUARIOS
    // =========================
    if (totalUsuariosSpan) {
        totalUsuariosSpan.textContent = usuarios.length;
    }

    // =========================
    // BOTÓN AGREGAR
    // =========================
    const agregarBtn = document.getElementById("agregarPerfil");

    if (agregarBtn) {
        agregarBtn.addEventListener("click", function () {
            if (confirm("➕ ¿Desea agregar un nuevo usuario?")) {
                localStorage.removeItem("usuarioEditar");
                window.location.href = "perfil.html";
            }
        });
    }

    // =========================
    // LIMPIAR CONTENEDOR
    // =========================
    contenedor.innerHTML = "";

    // =========================
    // SIN USUARIOS
    // =========================
    if (usuarios.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-datos">
                <p>📋 No hay usuarios registrados</p>
                <p class="sub">Haz clic en "Agregar Usuario"</p>
            </div>
        `;
        return;
    }

    // =========================
    // MOSTRAR USUARIOS
    // =========================
    usuarios.forEach(function (u, index) {

        const card = document.createElement("div");
        card.classList.add("tarjeta");

        const fotoUrl = u.foto && u.foto.length > 100
            ? u.foto
            : "../../assets/img/logo.png";

        // BADGE
        let badgeHtml = "";

        if (u.tipoUsuario === "empleado") {
            badgeHtml = `<span class="badge empleado">👔 Empleado</span>`;
        } else if (u.tipoUsuario === "cliente") {
            badgeHtml = `<span class="badge cliente">👤 Cliente</span>`;
        } else {
            badgeHtml = `<span class="badge">❓ Sin tipo</span>`;
        }

        // SERVICIO
        let servicioHtml = "";

        if (u.tipoUsuario === "empleado" && u.servicio) {

            const servicios = {
                limpieza: "🧹 Limpieza",
                seguridad: "🔒 Seguridad",
                mantenimiento: "🔧 Mantenimiento",
                jardineria: "🌿 Jardinería",
                cocina: "🍳 Cocina",
                recepcion: "📋 Recepción",
                mensajeria: "📦 Mensajería",
                transporte: "🚗 Transporte",
                otro: "📌 Otro"
            };

            servicioHtml = `
                <p><strong>🔧 Servicio:</strong> ${servicios[u.servicio] || u.servicio}</p>
            `;
        }

        card.innerHTML = `
            <div class="imgBox">
                <img src="${fotoUrl}" class="fotoUsuario"
                     alt="${u.nombres}"
                     onerror="this.src='../../assets/img/logo.png'">
            </div>

            <div class="info">
                <h3>${u.nombres || ""} ${u.apellidos || ""}</h3>

                ${badgeHtml}

                <p><strong>📄 Documento:</strong> ${u.documento || ""}</p>
                <p><strong>📋 Tipo Doc:</strong> ${u.tipoDocumento || ""}</p>
                <p><strong>📧 Correo:</strong> ${u.correo || ""}</p>
                <p><strong>📱 Celular:</strong> ${u.celular || ""}</p>
                <p><strong>🏠 Dirección:</strong> ${u.direccion || ""}</p>
                <p><strong>🏙️ Ciudad:</strong> ${u.ciudad || ""}</p>

                ${servicioHtml}
            </div>

            <div class="acciones">
                <button class="editar">✏️ Editar</button>
                <button class="eliminar">🗑️ Eliminar</button>
            </div>
        `;

        // =========================
        // EDITAR
        // =========================
        card.querySelector(".editar").addEventListener("click", function () {

            if (confirm(`✏️ ¿Editar a ${u.nombres}?`)) {
                localStorage.setItem("usuarioEditar", index);
                window.location.href = "perfil.html";
            }
        });

        // =========================
        // ELIMINAR
        // =========================
        card.querySelector(".eliminar").addEventListener("click", function () {

            if (confirm(`⚠️ ¿Eliminar a ${u.nombres}?`)) {

                if (confirm("❌ Esta acción no se puede deshacer")) {

                    usuarios.splice(index, 1);
                    localStorage.setItem("usuarios", JSON.stringify(usuarios));

                    alert("Usuario eliminado");
                    location.reload();
                }
            }
        });

        contenedor.appendChild(card);
    });

    // =========================
    // RESUMEN
    // =========================
    console.log("Total:", usuarios.length);
    console.log("Clientes:", usuarios.filter(u => u.tipoUsuario === "cliente").length);
    console.log("Empleados:", usuarios.filter(u => u.tipoUsuario === "empleado").length);
});