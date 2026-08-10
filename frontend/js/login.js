/* =====================================================
   SWEETALERT2 - REEMPLAZO DE ALERT NATIVO
   ===================================================== */
if (typeof Swal !== "undefined") {
    window.alert = function(mensaje) {
        Swal.fire({
            text: mensaje,
            icon: "info",
            confirmButtonText: "Aceptar"
        });
    };
}
const API_URL = "http://localhost:8080"

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
        Swal.fire({text: "? Ingrese el correo electrónico.", confirmButtonText: "Aceptar"});
        return;
    }

    if (password === "") {
        Swal.fire({text: "? Ingrese la contraseña.", confirmButtonText: "Aceptar"});
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

        console.log("USUARIO RECIBIDO:", usuario); console.log("GUARDANDO USUARIO EN LOCALSTORAGE");

    localStorage.setItem(
    "usuarioLogueado",
    JSON.stringify(usuario)
);

localStorage.setItem(
    "usuario",
    JSON.stringify(usuario)
);

        Swal.fire({
    text: "? Bienvenido " + usuario.nombre,
    confirmButtonText: "Aceptar"
}).then(() => {

if (usuario.rol === "ADMINISTRADOR") {
    window.location.href = "../administrador/html/index_adm.html";
} else if (usuario.rol === "EMPLEADO") {
    window.location.href = "../empleado/index_empleado.html";
} else {
    window.location.href = "../inicio/index.html";
}
});

    })

    .catch(error => {

        console.error(error);

        Swal.fire({text: "? Correo o contraseña incorrectos.", confirmButtonText: "Aceptar"});

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

            Swal.fire({text: "? Cuenta encontrada\n\n" +
                "Nombre: " + usuario.nombre +
                "\nCorreo: " + usuario.correo, confirmButtonText: "Aceptar"});

        } else {

            Swal.fire({text: "? No existe ninguna cuenta registrada.", confirmButtonText: "Aceptar"});

        }

    })

    .catch(() => {

        Swal.fire({text: "? No fue posible consultar el servidor.", confirmButtonText: "Aceptar"});

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
    "usuarioLogueado",
    JSON.stringify(usuario)
);

localStorage.setItem(
    "usuario",
    JSON.stringify(usuario)
);

            Swal.fire({text: "? Inicio con " + red +
                "\n\nBienvenido " +
                usuario.nombre, confirmButtonText: "Aceptar"});

            window.location.href = "../inicio/index.html";

        } else {

            Swal.fire({text: "? No existe una cuenta asociada a ese correo.", confirmButtonText: "Aceptar"});

        }

    })

    .catch(() => {

        Swal.fire({text: "? No fue posible conectar con el servidor.", confirmButtonText: "Aceptar"});

    });

}