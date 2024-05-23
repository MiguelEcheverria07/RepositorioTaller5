function iniciarSesion() {
    /* 
    general - 123
    administrador - 123
    */
    var usuario = document.getElementById("usuario").value;
    var password = document.getElementById("password").value;
    if (usuario == "general" && password == "123") {
        window.location.href = "menugeneral.html";
    } else if (usuario == "administrador" && password == "123") {
        window.location.href = "menuadministrador.html";
    } else {
        alert("Usuario o contraseña errado");
        nuevo();
    }
}

function nuevo() {
    usuario.value = "";
    password.value = "";
    usuario.focus();
}