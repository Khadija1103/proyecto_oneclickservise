const API_URL = "https://on-6af233feddf64804961110ffe0c54ab2.ecs.us-east-1.on.aws";

document.addEventListener("DOMContentLoaded", function () {

    const btnLogin = document.getElementById("btnIniciarSesion");

    if (btnLogin) {
        btnLogin.addEventListener("click", iniciarSesion);
    }

    const btnOlvido = document.getElementById("btnOlvidoPassword");

    if (btnOlvido) {
        btnOlvido.addEventListener("click", recuperarPassword);
    }

    const btnGoogle = document.getElementById("btnGoogle");

    if (btnGoogle) {
        btnGoogle.addEventListener("click", loginGoogle);
    }

    const btnFacebook = document.getElementById("btnFacebook");

    if (btnFacebook) {
        btnFacebook.addEventListener("click", loginFacebook);
    }

});

// ===============================
// LOGIN CON BACKEND SPRING BOOT
// ===============================

function iniciarSesion(e) {

    if (e) {
        e.preventDefault();
    }

    const correo = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (correo === "") {
        alert("❌ Ingrese el correo electrónico.");
        return;
    }

    if (password === "") {
        alert("❌ Ingrese la contraseña.");
        return;
    }

    fetch(`${API_URL}/usuarios/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            correo: correo,
            password: password
        })

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Usuario no encontrado");
        }

        return response.json();

    })

    .then(usuario => {

        console.log("Usuario recibido:", usuario);

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        alert("✅ Bienvenido " + usuario.nombre);

        window.location.href = "../inicio/index.html";

    })

    .catch(error => {

        console.error(error);

        alert("❌ Correo o contraseña incorrectos.");

    });

}

// ===============================
// RECUPERAR CONTRASEÑA
// ===============================

function recuperarPassword(e) {

    if (e) {
        e.preventDefault();
    }

    const correo = prompt(
        "Ingrese el correo con el que se registró:"
    );

    if (correo === null) {
        return;
    }

    fetch(`${API_URL}/usuarios`)

    .then(response => response.json())

    .then(usuarios => {

        const usuario = usuarios.find(u =>
            u.correo.toLowerCase() ===
            correo.trim().toLowerCase()
        );

        if (usuario) {

            alert(
                "✅ Cuenta encontrada\n\n" +
                "Nombre: " + usuario.nombre +
                "\nCorreo: " + usuario.correo
            );

        } else {

            alert(
                "❌ No existe ninguna cuenta registrada."
            );

        }

    })

    .catch(() => {

        alert(
            "❌ No fue posible consultar el servidor."
        );

    });

}

// ===============================
// LOGIN GOOGLE
// ===============================

function loginGoogle() {

    const correo = prompt(
        "Ingrese su correo de Google:"
    );

    if (!correo) {
        return;
    }

    validarLoginSocial(correo, "Google");

}

// ===============================
// LOGIN FACEBOOK
// ===============================

function loginFacebook() {

    const correo = prompt(
        "Ingrese su correo de Facebook:"
    );

    if (!correo) {
        return;
    }

    validarLoginSocial(correo, "Facebook");

}

// ===============================
// LOGIN SOCIAL TEMPORAL
// ===============================

function validarLoginSocial(correo, red) {

    fetch(`${API_URL}/usuarios`)

    .then(response => response.json())

    .then(usuarios => {

        const usuario = usuarios.find(u =>
            u.correo.toLowerCase() ===
            correo.trim().toLowerCase()
        );

        if (usuario) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            alert(
                "✅ Inicio con " + red +
                "\n\nBienvenido " +
                usuario.nombre
            );

            window.location.href = "../inicio/index.html";

        } else {

            alert(
                "❌ No existe una cuenta asociada a ese correo."
            );

        }

    })

    .catch(() => {

        alert(
            "❌ No fue posible conectar con el servidor."
        );

    });

}