const API_URL = "https://ec-c094f9e61f034e029869900306b99827.ecs.us-east-1.on.aws";

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario");

    if (!formulario) {
        console.error("No existe el formulario");
        return;
    }

    formulario.addEventListener("submit", e => {

        e.preventDefault();

        limpiarErrores();

        let valido = true;

        const nombre = document.getElementById("nombres").value.trim();
        const apellido = document.getElementById("apellidos").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const documento = document.getElementById("documento").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmar = document.getElementById("confirmPassword").value.trim();
        const terminos = document.getElementById("terminos").checked;

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(nombre)) {
            mostrarError("nombres", "Nombre inválido");
            valido = false;
        }

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(apellido)) {
            mostrarError("apellidos", "Apellido inválido");
            valido = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            mostrarError("correo", "Correo inválido");
            valido = false;
        }

        if (!/^\d{5,15}$/.test(documento)) {
            mostrarError("documento", "Documento inválido");
            valido = false;
        }

        if (!validarPassword(password)) {
            mostrarError(
                "password",
                "Debe tener 8 caracteres, mayúscula, minúscula, número y símbolo"
            );
            valido = false;
        }

        if (password !== confirmar) {
            mostrarError(
                "confirmPassword",
                "Las contraseñas no coinciden"
            );
            valido = false;
        }

        if (!terminos) {
            mostrarError(
                "terminos",
                "Debe aceptar los términos"
            );
            valido = false;
        }

        if (!valido) {
            return;
        }

        const usuario = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: documento,
            password: password,
            rol: "CLIENTE"
        };

        fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })

        .then(res => {

            if (!res.ok) {
                throw new Error("Error servidor");
            }

            return res.json();

        })

        .then(data => {

            console.log(data);

            alert("✅ Usuario registrado correctamente");

            window.location.href = "login.html";

        })

        .catch(error => {

            console.error(error);

            alert("❌ No se pudo registrar el usuario");

        });

    });

});

function validarPassword(password) {

    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password)
    );

}

function mostrarError(id, mensaje) {

    const campo = document.getElementById(id);

    if (campo) {
        campo.classList.add("errorInput");
    }

    const error = document.getElementById("error-" + id);

    if (error) {
        error.textContent = mensaje;
        error.style.display = "block";
    }

}

function limpiarErrores() {

    document.querySelectorAll(".errorInput")
        .forEach(campo => {
            campo.classList.remove("errorInput");
        });

    document.querySelectorAll(".mensaje-error")
        .forEach(error => {
            error.textContent = "";
            error.style.display = "none";
        });

}