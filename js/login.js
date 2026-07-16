document.addEventListener("DOMContentLoaded", function () {


    //======================================================
    // BOTÓN INICIAR SESIÓN
    //======================================================

    var btnLogin = document.getElementById("btnIniciarSesion");


    if(btnLogin){

        btnLogin.addEventListener(
            "click",
            iniciarSesion
        );

    }



    //======================================================
    // BOTÓN OLVIDÉ MI CONTRASEÑA
    //======================================================

    var btnOlvido = document.getElementById("btnOlvidoPassword");


    if(btnOlvido){

        btnOlvido.addEventListener(
            "click",
            recuperarPassword
        );

    }



    //======================================================
    // BOTÓN GOOGLE
    //======================================================

    var btnGoogle = document.getElementById("btnGoogle");


    if(btnGoogle){

        btnGoogle.addEventListener(
            "click",
            loginGoogle
        );

    }



    //======================================================
    // BOTÓN FACEBOOK
    //======================================================

    var btnFacebook = document.getElementById("btnFacebook");


    if(btnFacebook){

        btnFacebook.addEventListener(
            "click",
            loginFacebook
        );

    }


});





//======================================================
// INICIAR SESIÓN NORMAL
//======================================================


function iniciarSesion(e){


    if(e){

        e.preventDefault();

    }



    var email = document
        .getElementById("email")
        .value
        .trim();



    var password = document
        .getElementById("password")
        .value
        .trim();




    if(email === ""){


        alert(
            "❌ Ingrese el correo electrónico."
        );

        return;

    }




    if(password === ""){


        alert(
            "❌ Ingrese la contraseña."
        );

        return;

    }




    var usuarios = JSON.parse(

        localStorage.getItem("usuarios")

    ) || [];




    var usuarioEncontrado = null;




    for(var i = 0; i < usuarios.length; i++){



        if(

            usuarios[i].correo &&

            usuarios[i].correo.toLowerCase()
            === email.toLowerCase()

            &&

            usuarios[i].password === password

        ){


            usuarioEncontrado = usuarios[i];

            break;


        }


    }





    if(usuarioEncontrado){



        localStorage.setItem(

            "usuarioLogueado",

            JSON.stringify(usuarioEncontrado)

        );



        alert(

            "✅ Bienvenido " +
            usuarioEncontrado.nombres

        );



        window.location.href =
        "../inicio/index.html";



    }else{


        alert(

            "❌ Correo o contraseña incorrectos."

        );


    }



}







//======================================================
// RECUPERAR CONTRASEÑA
//======================================================


function recuperarPassword(e){


    if(e){

        e.preventDefault();

    }



    var correo = prompt(

        "Ingrese el correo con el que se registró:"

    );




    if(correo === null){

        return;

    }



    correo = correo.trim();




    if(correo === ""){


        alert(

            "❌ Debe ingresar un correo."

        );


        return;


    }




    var usuarios = JSON.parse(

        localStorage.getItem("usuarios")

    ) || [];




    var usuarioEncontrado = null;




    for(var i=0; i<usuarios.length;i++){



        if(

            usuarios[i].correo &&

            usuarios[i].correo.toLowerCase()
            === correo.toLowerCase()

        ){


            usuarioEncontrado = usuarios[i];

            break;


        }


    }




    if(usuarioEncontrado){



        alert(

            "✅ Cuenta encontrada\n\n" +

            "Nombre: " +
            usuarioEncontrado.nombres +

            "\nCorreo: " +
            usuarioEncontrado.correo +

            "\nContraseña: " +
            usuarioEncontrado.password

        );



    }else{


        alert(

            "❌ No existe ninguna cuenta registrada."

        );


    }



}







//======================================================
// LOGIN GOOGLE SIMULADO
//======================================================


function loginGoogle(){



    var correo = prompt(

        "Ingrese su correo de Google:"

    );



    if(!correo){

        return;

    }




    validarLoginSocial(

        correo,

        "Google"

    );



}







//======================================================
// LOGIN FACEBOOK SIMULADO
//======================================================


function loginFacebook(){



    var correo = prompt(

        "Ingrese su correo de Facebook:"

    );



    if(!correo){

        return;

    }




    validarLoginSocial(

        correo,

        "Facebook"

    );



}







//======================================================
// VALIDACIÓN LOGIN SOCIAL
//======================================================


function validarLoginSocial(correo, red){



    var usuarios = JSON.parse(

        localStorage.getItem("usuarios")

    ) || [];




    var usuarioEncontrado = null;




    for(var i=0;i<usuarios.length;i++){



        if(

            usuarios[i].correo &&

            usuarios[i].correo.toLowerCase()
            === correo.toLowerCase()

        ){


            usuarioEncontrado = usuarios[i];

            break;


        }


    }




    if(usuarioEncontrado){



        localStorage.setItem(

            "usuarioLogueado",

            JSON.stringify(usuarioEncontrado)

        );



        alert(

            "✅ Inicio con " + red +

            "\n\nBienvenido " +

            usuarioEncontrado.nombres

        );



        window.location.href =
        "../inicio/index.html";



    }else{



        alert(

            "❌ No existe una cuenta asociada a ese correo."

        );



    }



}