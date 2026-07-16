//======================================================
// CARGAR NAVBAR
//======================================================

document.addEventListener("DOMContentLoaded", function () {

    cargarNavbar();

});




//======================================================
// INSERTAR NAVBAR
//======================================================

function cargarNavbar() {


    fetch("../navbar/navbar.html")


    .then(function (res) {


        if (!res.ok) {

            throw new Error("Error navbar: " + res.status);

        }


        return res.text();


    })


    .then(function (html) {



        var navbarExistente =
            document.querySelector("header");



        if (navbarExistente) {

            navbarExistente.remove();

        }




        document.body.insertAdjacentHTML(
            "afterbegin",
            html
        );



        console.log("✅ Navbar cargado");



        ajustarBotonesSegunSesion();

        //==============================================
        // ACTIVAR DROPDOWNS DE BOOTSTRAP
        //==============================================

        var dropdowns =
        document.querySelectorAll(".dropdown-toggle");

        dropdowns.forEach(function(drop){

        new bootstrap.Dropdown(drop);

        });


        //==============================================
        // CARGAR MINI CARRITO DEL NAVBAR
        //==============================================


        setTimeout(function(){


            if(window.mostrarCarritoNavbar){


                window.mostrarCarritoNavbar();



                console.log(
                    "✅ Mini carrito actualizado"
                );


            }else{


                console.log(
                    "❌ No existe mostrarCarritoNavbar"
                );


            }



        },300);



    })



    .catch(function(err){


        console.error(
            "❌ Error cargando navbar:",
            err
        );


    });


}








//======================================================
// AJUSTAR NAVBAR SEGÚN USUARIO
//======================================================

function ajustarBotonesSegunSesion(){



    var usuarioGuardado =
        localStorage.getItem("usuarioLogueado");



    var usuario =
        usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;





    console.log(
        "Usuario:",
        usuario ? usuario.nombres : "No logueado"
    );






    //==============================================
    // MI CUENTA
    //==============================================


    var linkMiCuenta =
        document.getElementById("linkMiCuenta");


    var textoMiCuenta =
        document.getElementById("textoMiCuenta");


    var iconoMiCuenta =
        document.getElementById("iconoMiCuenta");




    if(linkMiCuenta && textoMiCuenta){



        if(usuario){



            textoMiCuenta.textContent =
                usuario.nombres || "Mi cuenta";



            linkMiCuenta.href =
                "../perfil/perfil.html";



            if(iconoMiCuenta){

                iconoMiCuenta.className =
                "bi bi-person";

            }



        }else{



            textoMiCuenta.textContent =
                "Iniciar sesión";



            linkMiCuenta.href =
                "../inicio/login.html";



            if(iconoMiCuenta){

                iconoMiCuenta.className =
                "bi bi-box-arrow-in-right";

            }



        }



    }







    //==============================================
    // SALIR / REGISTRO
    //==============================================



    var linkSalir =
        document.getElementById("linkSalir");



    var textoSalir =
        document.getElementById("textoSalir");



    var iconoSalir =
        document.getElementById("iconoSalir");




    if(linkSalir && textoSalir){



        if(usuario){



            textoSalir.textContent =
                "Salir";



            linkSalir.href="#";



            linkSalir.onclick=function(e){


                e.preventDefault();


                cerrarSesion();


            };



            if(iconoSalir){

                iconoSalir.className =
                "bi bi-box-arrow-right";

            }




        }else{



            textoSalir.textContent =
                "Registrarse";



            linkSalir.href =
                "../inicio/registro.html";



            if(iconoSalir){

                iconoSalir.className =
                "bi bi-person-plus";

            }


        }


    }







    //==============================================
    // MOSTRAR CARRITO
    //==============================================


    var navCarrito =
        document.getElementById("navCarrito");



    if(navCarrito){



        if(usuario){


            navCarrito.style.display="";


        }else{


            navCarrito.style.display="none";


        }


    }







    //==============================================
    // CERRAR SESIÓN
    //==============================================



    var linkCerrarSesion =
        document.getElementById("linkCerrarSesion");



    if(linkCerrarSesion){



        linkCerrarSesion.onclick=function(e){


            e.preventDefault();


            cerrarSesion();


        };


    }




}








//======================================================
// CERRAR SESIÓN
//======================================================

function cerrarSesion(){


    if(confirm(
        "¿Está seguro de que desea cerrar sesión?"
    )){


        localStorage.removeItem(
            "usuarioLogueado"
        );


        localStorage.removeItem(
            "token"
        );



        window.location.href =
            "../inicio/index.html";


    }


}

//======================================================
// MOSTRAR MINI CARRITO EN NAVBAR
//======================================================

function mostrarCarritoNavbar(){


    var lista = document.getElementById("listaProductos");

    var contador = document.getElementById("contadorCarrito");

    var subtotal = document.getElementById("subtotalCarrito");



    if(!lista){

        console.log("❌ No existe listaProductos");

        return;

    }



    var carrito = JSON.parse(
        localStorage.getItem("carritoProductos")
    ) || [];



    lista.innerHTML = "";



    if(carrito.length === 0){


        lista.innerHTML = `

        <div class="carrito-vacio">

            <i class="bi bi-cart-x"></i>

            <p>
            No hay productos en el carrito
            </p>

        </div>

        `;


        if(contador)
            contador.textContent = "0";


        if(subtotal)
            subtotal.textContent = "$0";


        return;

    }





    var total = 0;

    var cantidad = 0;



    carrito.forEach(function(producto){



        total += Number(producto.precio) *
                 Number(producto.cantidad);



        cantidad += Number(producto.cantidad);




       lista.innerHTML += `

<div class="producto-navbar">


    <img 
        src="${producto.imagen}"
        class="imagen-producto-navbar"
        alt="${producto.nombre}">


    <div class="info-producto-navbar">


        <strong class="nombre-producto-navbar">

            ${producto.nombre}

        </strong>


        <span class="cantidad-producto-navbar">

            ${producto.cantidad} x 
            $${Number(producto.precio).toLocaleString("es-CO")}

        </span>


    </div>


</div>

`;


    });





    if(contador){

        contador.textContent = cantidad;

    }




    if(subtotal){

        subtotal.textContent =
        "$" + total.toLocaleString("es-CO");

    }



    console.log("✅ Mini carrito cargado");


}




//======================================================
// EXPORTAR
//======================================================

window.cargarNavbar =
    cargarNavbar;


window.cerrarSesion =
    cerrarSesion;