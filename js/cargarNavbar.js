document.addEventListener("DOMContentLoaded", function() {
    cargarNavbar();
});

function cargarNavbar() {

    fetch("../navbar/navbar.html")
        .then(function(res) {
            if (!res.ok) throw new Error("Error navbar: " + res.status);
            return res.text();
        })
        .then(function(html) {

            var navbarExistente = document.querySelector("header");
            if (navbarExistente) {
                navbarExistente.remove();
            }

            document.body.insertAdjacentHTML("afterbegin", html);

            console.log("✅ Navbar cargado");

            ajustarBotonesSegunSesion();

        })
        .catch(function(err) {
            console.error("❌ Error cargando navbar:", err);
        });

}

function ajustarBotonesSegunSesion() {

    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    var usuario = usuarioLogueado ? JSON.parse(usuarioLogueado) : null;

    console.log("🔍 Usuario logueado:", usuario ? "SI - " + usuario.nombres : "NO");

    // ============================================
    // 1. "Mi cuenta" / "Iniciar sesión"
    // ============================================
    var linkMiCuenta = document.getElementById("linkMiCuenta");
    var textoMiCuenta = document.getElementById("textoMiCuenta");
    var iconoMiCuenta = document.getElementById("iconoMiCuenta");

    if (linkMiCuenta && textoMiCuenta) {
        if (usuario) {
            textoMiCuenta.textContent = usuario.nombres || 'Mi cuenta';
            if (iconoMiCuenta) iconoMiCuenta.className = 'bi bi-person';
            linkMiCuenta.href = '../perfil/perfil.html';
            console.log("✅ Mi cuenta → " + usuario.nombres);
        } else {
            textoMiCuenta.textContent = 'Iniciar sesión';
            if (iconoMiCuenta) iconoMiCuenta.className = 'bi bi-box-arrow-in-right';
            linkMiCuenta.href = '../inicio/login.html';
            console.log("✅ Mi cuenta → Iniciar sesión");
        }
    }

    // ============================================
    // 2. "Salir" / "Registrarse"
    // ============================================
    var linkSalir = document.getElementById("linkSalir");
    var textoSalir = document.getElementById("textoSalir");
    var iconoSalir = document.getElementById("iconoSalir");

    if (linkSalir && textoSalir) {
        if (usuario) {
            textoSalir.textContent = 'Salir';
            if (iconoSalir) iconoSalir.className = 'bi bi-box-arrow-right';
            linkSalir.href = '#';
            linkSalir.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
            };
            console.log("✅ Salir → Salir");
        } else {
            textoSalir.textContent = 'Registrarse';
            if (iconoSalir) iconoSalir.className = 'bi bi-person-plus';
            linkSalir.href = '../inicio/registro.html';
            linkSalir.onclick = null;
            console.log("✅ Salir → Registrarse");
        }
    }

    // ============================================
    // 3. Carrito (mostrar/ocultar)
    // ============================================
    var navCarrito = document.getElementById("navCarrito");
    if (navCarrito) {
        if (usuario) {
            navCarrito.style.display = '';
            console.log("✅ Carrito → Mostrar");
        } else {
            navCarrito.style.display = 'none';
            console.log("✅ Carrito → Ocultar");
        }
    }

    // ============================================
    // 4. Cerrar sesión desde el dropdown
    // ============================================
    var linkCerrarSesion = document.getElementById("linkCerrarSesion");
    if (linkCerrarSesion) {
        if (usuario) {
            linkCerrarSesion.style.display = '';
            linkCerrarSesion.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
            };
        } else {
            linkCerrarSesion.style.display = 'none';
        }
    }

    console.log("✅ Ajuste de botones completado");
}

function cerrarSesion() {
    if (confirm("¿Está seguro de que desea cerrar sesión?")) {
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("token");
        window.location.href = "../inicio/index.html";
    }
}

window.cargarNavbar = cargarNavbar;
window.cerrarSesion = cerrarSesion;