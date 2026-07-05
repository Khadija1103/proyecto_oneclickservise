document.addEventListener("DOMContentLoaded", function() {
    cargarListaCitas();
});

var metodoSeleccionado = "efectivo";
var indiceCitaPago = null;
var citaActual = null;

function cargarListaCitas() {
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    var select = document.getElementById("selectCita");
    
    select.innerHTML = '<option value="">-- Seleccionar cita --</option>';
    
    for (var i = 0; i < citas.length; i++) {
        var cita = citas[i];
        if (cita.estado !== "Confirmada") {
            var option = document.createElement("option");
            option.value = i;
            option.textContent = cita.nombre + " " + cita.apellido + " - " + cita.servicio + " - " + cita.fecha;
            select.appendChild(option);
        }
    }
}

function cargarCitaSeleccionada() {
    var select = document.getElementById("selectCita");
    var index = parseInt(select.value);
    
    if (isNaN(index) || index < 0) {
        document.getElementById("cardResumen").style.display = "none";
        document.getElementById("cardPago").style.display = "none";
        return;
    }
    
    indiceCitaPago = index;
    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    citaActual = citas[index];
    
    mostrarResumen(citaActual);
    document.getElementById("cardResumen").style.display = "block";
    document.getElementById("cardPago").style.display = "block";
    mostrarFormularioPago();
    
    // 🔥 ESPERAR UN POCO PARA QUE EL DOM SE ACTUALICE Y LUEGO CALCULAR EL TOTAL
    setTimeout(function() {
        calcularTotal();
    }, 100);
}

function mostrarResumen(cita) {
    var container = document.getElementById("cardResumen");
    var listaServicios = JSON.parse(localStorage.getItem("listaServicios")) || [];
    var servicioInfo = listaServicios.find(function(s) {
        return s.nombre === cita.servicio;
    });

    var precio = servicioInfo ? 
        Number(servicioInfo.precio).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }) : 
        cita.precio || "N/A";

    var iniciales = cita.nombre.charAt(0) + cita.apellido.charAt(0);

    container.innerHTML = `
        <div class="cliente">
            <div class="avatar">${iniciales}</div>
            <div class="info">
                <h3>${cita.nombre} ${cita.apellido}</h3>
                <p><i class="bi bi-envelope"></i> ${cita.correo}</p>
                <p><i class="bi bi-phone"></i> ${cita.telefono}</p>
            </div>
        </div>
        <div class="detalle">
            <div class="item">
                <i class="bi bi-tag"></i>
                <div>
                    <div class="label">Servicio</div>
                    <div class="valor">${cita.servicio}</div>
                </div>
            </div>
            <div class="item">
                <i class="bi bi-calendar3"></i>
                <div>
                    <div class="label">Fecha</div>
                    <div class="valor">${cita.fecha} - ${cita.hora}</div>
                </div>
            </div>
            <div class="item">
                <i class="bi bi-person"></i>
                <div>
                    <div class="label">Profesional</div>
                    <div class="valor">${cita.profesional}</div>
                </div>
            </div>
            <div class="item">
                <i class="bi bi-cash-stack"></i>
                <div>
                    <div class="label">Monto</div>
                    <div class="valor" id="precioMostrar">${precio}</div>
                </div>
            </div>
        </div>
    `;
}

function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;
    var botones = document.querySelectorAll(".btn-metodo");
    for (var i = 0; i < botones.length; i++) {
        botones[i].classList.remove("active");
    }
    document.querySelector('.btn-metodo[data-metodo="' + metodo + '"]').classList.add("active");
    mostrarFormularioPago();
    
    // 🔥 ACTUALIZAR TOTAL DESPUÉS DE CAMBIAR EL MÉTODO
    setTimeout(function() {
        calcularTotal();
    }, 100);
}

function mostrarFormularioPago() {
    var container = document.getElementById("formularioPago");
    var html = "";
    var precioMostrar = document.getElementById("precioMostrar");
    var precioTexto = precioMostrar ? precioMostrar.textContent : "$0";

    switch(metodoSeleccionado) {
        case "efectivo":
            html = `
                <div class="campo">
                    <label>💰 Monto en efectivo</label>
                    <input type="text" id="montoEfectivo" value="${precioTexto}" readonly style="background:#f5f5f5;">
                </div>
                <div class="campo">
                    <label>💵 Con cuanto paga</label>
                    <input type="number" id="conCuantoPaga" placeholder="Ingrese el monto con el que paga" min="0" step="1000">
                </div>
                <div class="campo" id="cambioContainer" style="display:none;">
                    <label>🔄 Cambio</label>
                    <input type="text" id="cambioMostrar" readonly style="background:#f5f5f5; color:#28a745; font-weight:bold;">
                </div>
                <div class="campo">
                    <label>👤 Recibe</label>
                    <input type="text" id="nombreRecibe" placeholder="Nombre de quien recibe el pago">
                </div>
            `;
            break;

        case "tarjeta":
            html = `
                <div class="campo">
                    <label>💳 Número de tarjeta</label>
                    <input type="text" id="numTarjeta" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="row">
                    <div class="campo">
                        <label>📅 Fecha expiración</label>
                        <input type="text" id="fechaExp" placeholder="MM/AA" maxlength="5">
                    </div>
                    <div class="campo">
                        <label>🔒 CVV</label>
                        <input type="password" id="cvv" placeholder="***" maxlength="4">
                    </div>
                </div>
                <div class="campo">
                    <label>👤 Titular</label>
                    <input type="text" id="titular" placeholder="Nombre del titular">
                </div>
                <div class="campo">
                    <label>🏦 Banco emisor</label>
                    <select id="bancoEmisor">
                        <option value="">Seleccionar banco</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="davivienda">Davivienda</option>
                        <option value="bbva">BBVA</option>
                        <option value="caja_social">Caja Social</option>
                        <option value="occidente">Banco de Occidente</option>
                        <option value="citi">Citibank</option>
                        <option value="colpatria">Colpatria</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📝 Cuotas</label>
                    <select id="cuotas">
                        <option value="1">1 cuota</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                    </select>
                </div>
            `;
            break;

        case "transferencia":
            html = `
                <div class="campo">
                    <label>🏦 Banco destino</label>
                    <select id="bancoTransferencia">
                        <option value="">Seleccionar banco</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="davivienda">Davivienda</option>
                        <option value="bbva">BBVA</option>
                        <option value="caja_social">Caja Social</option>
                        <option value="occidente">Banco de Occidente</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📋 Número de cuenta</label>
                    <input type="text" id="numCuenta" placeholder="Número de cuenta">
                </div>
                <div class="campo">
                    <label>👤 Titular de la cuenta</label>
                    <input type="text" id="titularCuenta" placeholder="Nombre del titular">
                </div>
                <div class="campo">
                    <label>📝 Comprobante de pago</label>
                    <input type="text" id="comprobante" placeholder="Número de comprobante">
                </div>
                <div class="campo">
                    <label>📅 Fecha de transferencia</label>
                    <input type="date" id="fechaTransferencia">
                </div>
            `;
            break;

        case "nequi":
            html = `
                <div class="campo">
                    <label>📱 Número de Nequi</label>
                    <input type="text" id="numNequi" placeholder="300 123 4567" maxlength="10">
                </div>
                <div class="campo">
                    <label>👤 Nombre del titular</label>
                    <input type="text" id="titularNequi" placeholder="Nombre completo">
                </div>
                <div class="campo">
                    <label>💳 Código de verificación</label>
                    <input type="text" id="codigoNequi" placeholder="Código de 6 dígitos" maxlength="6">
                </div>
            `;
            break;

        case "daviplata":
            html = `
                <div class="campo">
                    <label>📱 Número de Daviplata</label>
                    <input type="text" id="numDaviplata" placeholder="300 123 4567" maxlength="10">
                </div>
                <div class="campo">
                    <label>👤 Nombre del titular</label>
                    <input type="text" id="titularDaviplata" placeholder="Nombre completo">
                </div>
                <div class="campo">
                    <label>💳 Código de verificación</label>
                    <input type="text" id="codigoDaviplata" placeholder="Código de 6 dígitos" maxlength="6">
                </div>
            `;
            break;

        case "pse":
            html = `
                <div class="campo">
                    <label>🏦 Banco</label>
                    <select id="bancoPSE">
                        <option value="">Seleccionar banco</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="davivienda">Davivienda</option>
                        <option value="bbva">BBVA</option>
                        <option value="caja_social">Caja Social</option>
                        <option value="occidente">Banco de Occidente</option>
                        <option value="citi">Citibank</option>
                        <option value="colpatria">Colpatria</option>
                        <option value="falabella">Banco Falabella</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📋 Número de cuenta</label>
                    <input type="text" id="numCuentaPSE" placeholder="Número de cuenta">
                </div>
                <div class="campo">
                    <label>👤 Titular</label>
                    <input type="text" id="titularPSE" placeholder="Nombre del titular">
                </div>
                <div class="campo">
                    <label>📝 Tipo de cuenta</label>
                    <select id="tipoCuentaPSE">
                        <option value="ahorros">Cuenta de ahorros</option>
                        <option value="corriente">Cuenta corriente</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📅 Fecha de pago</label>
                    <input type="date" id="fechaPSE">
                </div>
            `;
            break;

        case "efecty":
            html = `
                <div class="campo">
                    <label>📍 Punto Efecty</label>
                    <select id="puntoEfecty">
                        <option value="">Seleccionar punto</option>
                        <option value="exito">Éxito</option>
                        <option value="carulla">Carulla</option>
                        <option value="surtimax">Surtimax</option>
                        <option value="olimpica">Olímpica</option>
                        <option value="ara">ARA</option>
                        <option value="d1">D1</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📋 Código de referencia</label>
                    <input type="text" id="codigoEfecty" placeholder="Código de referencia Efecty">
                </div>
                <div class="campo">
                    <label>👤 Persona que realiza el pago</label>
                    <input type="text" id="nombreEfecty" placeholder="Nombre completo">
                </div>
                <div class="campo">
                    <label>📅 Fecha de pago</label>
                    <input type="date" id="fechaEfecty">
                </div>
            `;
            break;

        case "bancolombia":
            html = `
                <div class="campo">
                    <label>🏦 Tipo de cuenta</label>
                    <select id="tipoCuentaBancolombia">
                        <option value="ahorros">Cuenta de ahorros</option>
                        <option value="corriente">Cuenta corriente</option>
                    </select>
                </div>
                <div class="campo">
                    <label>📋 Número de cuenta</label>
                    <input type="text" id="numCuentaBancolombia" placeholder="Número de cuenta">
                </div>
                <div class="campo">
                    <label>👤 Titular</label>
                    <input type="text" id="titularBancolombia" placeholder="Nombre del titular">
                </div>
                <div class="campo">
                    <label>📝 Comprobante</label>
                    <input type="text" id="comprobanteBancolombia" placeholder="Número de comprobante">
                </div>
                <div class="campo">
                    <label>📅 Fecha de pago</label>
                    <input type="date" id="fechaBancolombia">
                </div>
            `;
            break;
    }

    container.innerHTML = html;

    // Eventos específicos
    if (metodoSeleccionado === "efectivo") {
        var conCuanto = document.getElementById("conCuantoPaga");
        if (conCuanto) {
            conCuanto.addEventListener("input", function() {
                calcularCambio();
            });
        }
    }

    // Formatear tarjeta
    if (metodoSeleccionado === "tarjeta") {
        var numTarjeta = document.getElementById("numTarjeta");
        if (numTarjeta) {
            numTarjeta.addEventListener("input", function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 16) {
                    this.value = this.value.slice(0, 16);
                }
                var formatted = this.value.replace(/(.{4})/g, '$1 ').trim();
                this.value = formatted;
            });
        }
        var fechaExp = document.getElementById("fechaExp");
        if (fechaExp) {
            fechaExp.addEventListener("input", function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
                if (this.value.length >= 2) {
                    this.value = this.value.slice(0, 2) + '/' + this.value.slice(2);
                }
            });
        }
        var cvv = document.getElementById("cvv");
        if (cvv) {
            cvv.addEventListener("input", function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
            });
        }
    }

    // Solo números para teléfonos
    var camposTelefono = ["numNequi", "numDaviplata"];
    for (var i = 0; i < camposTelefono.length; i++) {
        var input = document.getElementById(camposTelefono[i]);
        if (input) {
            input.addEventListener("input", function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
    }

    // Solo números para códigos
    var camposCodigo = ["codigoNequi", "codigoDaviplata", "codigoEfecty"];
    for (var i = 0; i < camposCodigo.length; i++) {
        var input = document.getElementById(camposCodigo[i]);
        if (input) {
            input.addEventListener("input", function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
                }
            });
        }
    }
}

function calcularTotal() {
    var precioMostrar = document.getElementById("precioMostrar");
    var montoTotal = document.getElementById("montoTotal");
    
    console.log("🔍 Calculando total...");
    console.log("🔍 precioMostrar:", precioMostrar);
    console.log("🔍 montoTotal:", montoTotal);
    
    if (precioMostrar && montoTotal) {
        var precioTexto = precioMostrar.textContent;
        console.log("🔍 precioTexto:", precioTexto);
        montoTotal.textContent = precioTexto;
        console.log("🔍 Total actualizado:", montoTotal.textContent);
    } else {
        console.log("❌ Elementos no encontrados");
    }
}

function calcularCambio() {
    var conCuanto = document.getElementById("conCuantoPaga");
    var cambioContainer = document.getElementById("cambioContainer");
    var cambioMostrar = document.getElementById("cambioMostrar");
    var precioMostrar = document.getElementById("precioMostrar");

    if (!conCuanto || !cambioContainer || !cambioMostrar || !precioMostrar) return;

    var total = parseFloat(precioMostrar.textContent.replace(/[^0-9]/g, ''));
    var paga = parseFloat(conCuanto.value);

    if (paga > 0 && paga >= total) {
        var cambio = paga - total;
        cambioContainer.style.display = "block";
        cambioMostrar.value = "$" + cambio.toLocaleString("es-CO");
    } else {
        cambioContainer.style.display = "none";
    }
}

function getNombreMetodo(metodo) {
    var nombres = {
        "efectivo": "Efectivo",
        "tarjeta": "Tarjeta de Crédito/Débito",
        "transferencia": "Transferencia Bancaria",
        "nequi": "Nequi",
        "daviplata": "Daviplata",
        "pse": "PSE",
        "efecty": "Efecty",
        "bancolombia": "Bancolombia"
    };
    return nombres[metodo] || metodo;
}

function validarCamposPago() {
    var errores = [];

    switch(metodoSeleccionado) {
        case "efectivo":
            var conCuanto = document.getElementById("conCuantoPaga");
            var nombreRecibe = document.getElementById("nombreRecibe");
            var precioMostrar = document.getElementById("precioMostrar");
            var total = parseFloat(precioMostrar.textContent.replace(/[^0-9]/g, ''));
            var paga = parseFloat(conCuanto.value);

            if (!conCuanto.value || conCuanto.value <= 0) {
                errores.push("💰 Ingrese el monto con el que paga");
            } else if (paga < total) {
                errores.push("💰 El monto es insuficiente. Faltan $" + (total - paga).toLocaleString("es-CO"));
            }
            if (!nombreRecibe || nombreRecibe.value.trim() === "") {
                errores.push("👤 Ingrese el nombre de quien recibe el pago");
            }
            break;

        case "tarjeta":
            var numTarjeta = document.getElementById("numTarjeta");
            var fechaExp = document.getElementById("fechaExp");
            var cvv = document.getElementById("cvv");
            var titular = document.getElementById("titular");
            var bancoEmisor = document.getElementById("bancoEmisor");

            if (!numTarjeta.value || numTarjeta.value.replace(/\s/g, '').length < 16) {
                errores.push("💳 Ingrese un número de tarjeta válido (16 dígitos)");
            }
            if (!fechaExp.value || fechaExp.value.length < 5) {
                errores.push("📅 Ingrese una fecha de expiración válida (MM/AA)");
            }
            if (!cvv.value || cvv.value.length < 3) {
                errores.push("🔒 Ingrese el CVV de la tarjeta");
            }
            if (!titular.value || titular.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular");
            }
            if (!bancoEmisor.value) {
                errores.push("🏦 Seleccione el banco emisor");
            }
            break;

        case "transferencia":
            var banco = document.getElementById("bancoTransferencia");
            var numCuenta = document.getElementById("numCuenta");
            var titularCuenta = document.getElementById("titularCuenta");
            var comprobante = document.getElementById("comprobante");
            var fechaTransferencia = document.getElementById("fechaTransferencia");

            if (!banco.value) {
                errores.push("🏦 Seleccione un banco");
            }
            if (!numCuenta.value || numCuenta.value.length < 5) {
                errores.push("📋 Ingrese un número de cuenta válido");
            }
            if (!titularCuenta.value || titularCuenta.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular de la cuenta");
            }
            if (!comprobante.value || comprobante.value.length < 5) {
                errores.push("📝 Ingrese el número de comprobante");
            }
            if (!fechaTransferencia.value) {
                errores.push("📅 Seleccione la fecha de transferencia");
            }
            break;

        case "nequi":
            var numNequi = document.getElementById("numNequi");
            var titularNequi = document.getElementById("titularNequi");
            var codigoNequi = document.getElementById("codigoNequi");

            if (!numNequi.value || numNequi.value.length < 10) {
                errores.push("📱 Ingrese un número de Nequi válido (10 dígitos)");
            }
            if (!titularNequi.value || titularNequi.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular");
            }
            if (!codigoNequi.value || codigoNequi.value.length < 6) {
                errores.push("💳 Ingrese el código de verificación (6 dígitos)");
            }
            break;

        case "daviplata":
            var numDaviplata = document.getElementById("numDaviplata");
            var titularDaviplata = document.getElementById("titularDaviplata");
            var codigoDaviplata = document.getElementById("codigoDaviplata");

            if (!numDaviplata.value || numDaviplata.value.length < 10) {
                errores.push("📱 Ingrese un número de Daviplata válido (10 dígitos)");
            }
            if (!titularDaviplata.value || titularDaviplata.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular");
            }
            if (!codigoDaviplata.value || codigoDaviplata.value.length < 6) {
                errores.push("💳 Ingrese el código de verificación (6 dígitos)");
            }
            break;

        case "pse":
            var bancoPSE = document.getElementById("bancoPSE");
            var numCuentaPSE = document.getElementById("numCuentaPSE");
            var titularPSE = document.getElementById("titularPSE");
            var fechaPSE = document.getElementById("fechaPSE");

            if (!bancoPSE.value) {
                errores.push("🏦 Seleccione un banco");
            }
            if (!numCuentaPSE.value || numCuentaPSE.value.length < 5) {
                errores.push("📋 Ingrese un número de cuenta válido");
            }
            if (!titularPSE.value || titularPSE.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular");
            }
            if (!fechaPSE.value) {
                errores.push("📅 Seleccione la fecha de pago");
            }
            break;

        case "efecty":
            var puntoEfecty = document.getElementById("puntoEfecty");
            var codigoEfecty = document.getElementById("codigoEfecty");
            var nombreEfecty = document.getElementById("nombreEfecty");
            var fechaEfecty = document.getElementById("fechaEfecty");

            if (!puntoEfecty.value) {
                errores.push("📍 Seleccione un punto Efecty");
            }
            if (!codigoEfecty.value || codigoEfecty.value.length < 5) {
                errores.push("📋 Ingrese el código de referencia Efecty");
            }
            if (!nombreEfecty.value || nombreEfecty.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre de quien realiza el pago");
            }
            if (!fechaEfecty.value) {
                errores.push("📅 Seleccione la fecha de pago");
            }
            break;

        case "bancolombia":
            var numCuentaBancolombia = document.getElementById("numCuentaBancolombia");
            var titularBancolombia = document.getElementById("titularBancolombia");
            var comprobanteBancolombia = document.getElementById("comprobanteBancolombia");
            var fechaBancolombia = document.getElementById("fechaBancolombia");

            if (!numCuentaBancolombia.value || numCuentaBancolombia.value.length < 5) {
                errores.push("📋 Ingrese un número de cuenta válido");
            }
            if (!titularBancolombia.value || titularBancolombia.value.trim().length < 3) {
                errores.push("👤 Ingrese el nombre del titular");
            }
            if (!comprobanteBancolombia.value || comprobanteBancolombia.value.length < 5) {
                errores.push("📝 Ingrese el número de comprobante");
            }
            if (!fechaBancolombia.value) {
                errores.push("📅 Seleccione la fecha de pago");
            }
            break;
    }

    return errores;
}

function procesarPago() {
    if (!citaActual) {
        alert("❌ Seleccione una cita primero");
        return;
    }

    if (citaActual.estado === "Confirmada") {
        alert("⚠️ Esta cita ya fue pagada");
        return;
    }

    var errores = validarCamposPago();
    if (errores.length > 0) {
        alert("❌ " + errores.join("\n"));
        return;
    }

    var total = document.getElementById("montoTotal").textContent;
    var metodoNombre = getNombreMetodo(metodoSeleccionado);

    var comprador = prompt("👤 ¿Quién realiza el pago? (Nombre completo)");
    if (!comprador || comprador.trim() === "") {
        alert("❌ Debe ingresar el nombre del comprador");
        return;
    }

    var email = prompt("📧 Correo electrónico del comprador:");
    if (!email || email.trim() === "" || !email.includes("@")) {
        alert("❌ Debe ingresar un correo electrónico válido");
        return;
    }

    var telefono = prompt("📱 Teléfono del comprador:");
    if (!telefono || telefono.trim() === "" || telefono.replace(/\D/g, '').length < 7) {
        alert("❌ Debe ingresar un teléfono válido (mínimo 7 dígitos)");
        return;
    }

    var confirmar = confirm(
        "💳 Confirmar transacción\n\n" +
        "Comprador: " + comprador + "\n" +
        "Email: " + email + "\n" +
        "Teléfono: " + telefono + "\n" +
        "Monto: " + total + "\n" +
        "Método: " + metodoNombre + "\n\n" +
        "¿Desea confirmar el pago?"
    );

    if (!confirmar) return;

    var citas = JSON.parse(localStorage.getItem("citas")) || [];
    citaActual.estado = "Confirmada";
    citaActual.metodoPago = metodoSeleccionado;
    citaActual.fechaPago = new Date().toLocaleString();
    citaActual.comprador = comprador;
    citaActual.emailComprador = email;
    citaActual.telefonoComprador = telefono;
    citas[indiceCitaPago] = citaActual;
    localStorage.setItem("citas", JSON.stringify(citas));

    mostrarModalExito(comprador, email, telefono);
}

function mostrarModalExito(comprador, email, telefono) {
    var modal = document.getElementById("modalConfirmacion");
    var detalles = document.getElementById("modalDetalles");
    var metodoNombre = getNombreMetodo(metodoSeleccionado);
    var total = document.getElementById("montoTotal").textContent;

    detalles.innerHTML = `
        <p><strong>Cliente:</strong> ${citaActual.nombre} ${citaActual.apellido}</p>
        <p><strong>Servicio:</strong> ${citaActual.servicio}</p>
        <p><strong>Monto:</strong> ${total}</p>
        <p><strong>Método de pago:</strong> ${metodoNombre}</p>
        <p><strong>Comprador:</strong> ${comprador}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Fecha de pago:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="color:#28a745; font-weight:bold;">✅ Transacción exitosa</p>
    `;

    modal.style.display = "flex";
}

function cerrarModal() {
    var modal = document.getElementById("modalConfirmacion");
    modal.style.display = "none";
    window.location.href = "GestionarCitas.html";
}