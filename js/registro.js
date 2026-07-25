document.addEventListener("DOMContentLoaded", function() {
    var btnRegistro = document.getElementById("btnRegistrar");
    if (btnRegistro) {
        btnRegistro.addEventListener("click", registrarUsuario);
    }

    // Si ya está logueado, redirigir al inicio
    var usuarioLogueado = localStorage.getItem("usuarioLogueado");
    if (usuarioLogueado) {
        window.location.href = "index.html";
    }

    // ============================================
    // VALIDACIONES EN TIEMPO REAL
    // ============================================
    
    // NOMBRES - Solo letras
    var nombresInput = document.getElementById("nombres");
    nombresInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("nombres", "Solo letras");
        }
    });
    nombresInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("nombres", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,30}$/.test(this.value)) {
            mostrarExito("nombres");
        } else {
            mostrarError("nombres", "Mínimo 3 caracteres");
        }
    });

    // APELLIDOS - Solo letras
    var apellidosInput = document.getElementById("apellidos");
    apellidosInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("apellidos", "Solo letras");
        }
    });
    apellidosInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("apellidos", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,30}$/.test(this.value)) {
            mostrarExito("apellidos");
        } else {
            mostrarError("apellidos", "Mínimo 3 caracteres");
        }
    });

    // CORREO - @ y .com
    var correoInput = document.getElementById("correo");
    correoInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("correo", "Campo obligatorio");
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
            mostrarExito("correo");
        } else {
            mostrarError("correo", "Debe tener @ y .com");
        }
    });

    // DOCUMENTO - Solo números
    var documentoInput = document.getElementById("documento");
    documentoInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        if (charCode < 48 || charCode > 57) {
            e.preventDefault();
            mostrarError("documento", "Solo números");
        }
    });
    documentoInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.trim() === "") {
            mostrarError("documento", "Campo obligatorio");
        } else if (this.value.length >= 5) {
            mostrarExito("documento");
        } else {
            mostrarError("documento", "Mínimo 5 dígitos");
        }
    });

    // CIUDAD - Solo letras
    var ciudadInput = document.getElementById("ciudad");
    ciudadInput.addEventListener("keypress", function(e) {
        var charCode = e.which || e.keyCode;
        var char = String.fromCharCode(charCode);
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]$/.test(char)) {
            e.preventDefault();
            mostrarError("ciudad", "Solo letras");
        }
    });
    ciudadInput.addEventListener("input", function() {
        if (this.value.trim() === "") {
            mostrarError("ciudad", "Campo obligatorio");
        } else if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(this.value)) {
            mostrarExito("ciudad");
        } else {
            mostrarError("ciudad", "Mínimo 3 caracteres");
        }
    });

    // CONTRASEÑA - SEGURA (Mayúscula, minúscula, número, símbolo, 8+ caracteres)
    var passwordInput = document.getElementById("password");
    passwordInput.addEventListener("input", function() {
        var valor = this.value;
        if (valor === "") {
            mostrarError("password", "Campo obligatorio");
        } else if (validarContrasenaSegura(valor)) {
            mostrarExito("password");
            // Mostrar requisitos cumplidos
            mostrarRequisitosCumplidos();
        } else {
            mostrarError("password", "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo");
            mostrarRequisitosPassword(valor);
        }
    });

    // CONFIRMAR CONTRASEÑA
    var confirmPasswordInput = document.getElementById("confirmPassword");
    confirmPasswordInput.addEventListener("input", function() {
        var password = document.getElementById("password").value;
        if (this.value.trim() === "") {
            mostrarError("confirmPassword", "Campo obligatorio");
        } else if (this.value === password && validarContrasenaSegura(password)) {
            mostrarExito("confirmPassword");
        } else {
            mostrarError("confirmPassword", "Las contraseñas no coinciden");
        }
    });

    // TÉRMINOS
    var terminosCheck = document.getElementById("terminos");
    terminosCheck.addEventListener("change", function() {
        if (this.checked) {
            var errorDiv = document.getElementById("error-terminos");
            if (errorDiv) {
                errorDiv.classList.remove("visible");
                errorDiv.textContent = "";
            }
        }
    });
});

// ============================================
// FUNCIÓN PARA VALIDAR CONTRASEÑA SEGURA
// ============================================
function validarContrasenaSegura(password) {
    // Mínimo 8 caracteres
    if (password.length < 8) return false;
    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) return false;
    // Al menos una minúscula
    if (!/[a-z]/.test(password)) return false;
    // Al menos un número
    if (!/[0-9]/.test(password)) return false;
    // Al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|]/.test(password)) return false;
    return true;
}

// ============================================
// MOSTRAR REQUISITOS DE CONTRASEÑA
// ============================================
function mostrarRequisitosPassword(password) {
    var mensajes = [];
    if (password.length < 8) mensajes.push("❌ Mínimo 8 caracteres");
    else mensajes.push("✅ Mínimo 8 caracteres");
    
    if (!/[A-Z]/.test(password)) mensajes.push("❌ Al menos 1 mayúscula");
    else mensajes.push("✅ Al menos 1 mayúscula");
    
    if (!/[a-z]/.test(password)) mensajes.push("❌ Al menos 1 minúscula");
    else mensajes.push("✅ Al menos 1 minúscula");
    
    if (!/[0-9]/.test(password)) mensajes.push("❌ Al menos 1 número");
    else mensajes.push("✅ Al menos 1 número");
    
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|]/.test(password)) mensajes.push("❌ Al menos 1 símbolo");
    else mensajes.push("✅ Al menos 1 símbolo");
    
    var errorDiv = document.getElementById("error-password");
    if (errorDiv) {
        errorDiv.textContent = mensajes.join(" | ");
        errorDiv.classList.add("visible");
        errorDiv.style.fontSize = "12px";
    }
}

function mostrarRequisitosCumplidos() {
    var errorDiv = document.getElementById("error-password");
    if (errorDiv) {
        errorDiv.textContent = "✅ Contraseña segura";
        errorDiv.classList.add("visible");
        errorDiv.style.color = "#28a745";
        errorDiv.style.fontSize = "13px";
    }
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
function mostrarError(id, mensaje) {
    var campo = document.getElementById(id);
    if (campo) {
        campo.classList.add("errorInput");
        campo.classList.remove("successInput");
    }
    
    var errorDiv = document.getElementById("error-" + id);
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.add("visible");
        errorDiv.style.color = "#dc3545";
        errorDiv.style.fontSize = "13px";
    }
    
    var exitoDiv = document.getElementById("exito-" + id);
    if (exitoDiv) {
        exitoDiv.classList.remove("visible");
    }
}

function mostrarExito(id) {
    var campo = document.getElementById(id);
    if (campo) {
        campo.classList.remove("errorInput");
        campo.classList.add("successInput");
    }
    
    var errorDiv = document.getElementById("error-" + id);
    if (errorDiv) {
        errorDiv.classList.remove("visible");
        errorDiv.textContent = "";
    }
    
    var exitoDiv = document.getElementById("exito-" + id);
    if (exitoDiv) {
        exitoDiv.classList.add("visible");
    }
}

function limpiarErrores() {
    var campos = document.querySelectorAll(".errorInput, .successInput");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("errorInput", "successInput");
    }
    
    var errores = document.querySelectorAll(".mensaje-error");
    for (var i = 0; i < errores.length; i++) {
        errores[i].classList.remove("visible");
        errores[i].textContent = "";
    }
    
    var exitos = document.querySelectorAll(".mensaje-exito");
    for (var i = 0; i < exitos.length; i++) {
        exitos[i].classList.remove("visible");
    }
}

// ============================================
// REGISTRAR USUARIO
// ============================================
function registrarUsuario() {
    var nombres = document.getElementById("nombres").value.trim();
    var apellidos = document.getElementById("apellidos").value.trim();
    var correo = document.getElementById("correo").value.trim();
    var tipoDocumento = document.getElementById("tipoDocumento").value;
    var documento = document.getElementById("documento").value.trim();
    var ciudad = document.getElementById("ciudad").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document.getElementById("confirmPassword").value.trim();
    var terminos = document.getElementById("terminos").checked;

    limpiarErrores();
    var formularioValido = true;

    // VALIDACIONES
    if (nombres === "") {
        mostrarError("nombres", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,30}$/.test(nombres)) {
        mostrarError("nombres", "Solo letras (3 a 30 caracteres)");
        formularioValido = false;
    }

    if (apellidos === "") {
        mostrarError("apellidos", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,30}$/.test(apellidos)) {
        mostrarError("apellidos", "Solo letras (3 a 30 caracteres)");
        formularioValido = false;
    }

    if (correo === "") {
        mostrarError("correo", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError("correo", "Debe tener @ y .com");
        formularioValido = false;
    }

    if (documento === "") {
        mostrarError("documento", "Campo obligatorio");
        formularioValido = false;
    } else if (documento.length < 5) {
        mostrarError("documento", "Mínimo 5 dígitos");
        formularioValido = false;
    }

    if (ciudad === "") {
        mostrarError("ciudad", "Campo obligatorio");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/.test(ciudad)) {
        mostrarError("ciudad", "Solo letras");
        formularioValido = false;
    }

    // 🔥 VALIDACIÓN DE CONTRASEÑA SEGURA
    if (password === "") {
        mostrarError("password", "Campo obligatorio");
        formularioValido = false;
    } else if (!validarContrasenaSegura(password)) {
        mostrarError("password", "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo");
        formularioValido = false;
    }

    if (confirmPassword === "") {
        mostrarError("confirmPassword", "Campo obligatorio");
        formularioValido = false;
    } else if (confirmPassword !== password) {
        mostrarError("confirmPassword", "Las contraseñas no coinciden");
        formularioValido = false;
    }

    if (!terminos) {
        mostrarError("terminos", "Debe aceptar los términos y condiciones");
        formularioValido = false;
    }

    if (!formularioValido) {
        var primerError = document.querySelector(".errorInput");
        if (primerError) {
            primerError.focus();
            primerError.select();
        }
        return;
    }

    // VERIFICAR SI EL CORREO YA EXISTE
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo) {
            alert("❌ Este correo ya está registrado");
            document.getElementById("correo").focus();
            return;
        }
    }

    // GUARDAR USUARIO
    var nuevoUsuario = {
        nombres: nombres,
        apellidos: apellidos,
        correo: correo,
        tipoDocumento: tipoDocumento,
        documento: documento,
        ciudad: ciudad,
        password: password,
        fechaRegistro: new Date().toLocaleString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Registro exitoso. Ahora puede iniciar sesión.");
    window.location.href = "login.html";
}