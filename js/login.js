document.addEventListener("DOMContentLoaded", function() {
    var btnLogin = document.getElementById("btnIniciarSesion");
    if (btnLogin) {
        btnLogin.addEventListener("click", iniciarSesion);
    }

    // Si ya está logueado, redirigir al inicio
    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    if (usuarioLogueado) {
        window.location.href = "index.html";
    }
});

function iniciarSesion() {
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("❌ Complete todos los campos");
        return;
    }

    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    var usuarioEncontrado = null;

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === email && usuarios[i].password === password) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
        alert("✅ Bienvenido " + usuarioEncontrado.nombres);
        window.location.href = "index.html";
    } else {
        alert("❌ Credenciales incorrectas. Verifique email y contraseña.");
    }
}