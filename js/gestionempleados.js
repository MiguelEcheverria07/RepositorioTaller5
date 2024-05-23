function guardar() {

    var empleados = JSON.parse(localStorage.getItem("empleados") || "[]");
    var cedula = document.getElementById("cedula");
    var nombres = document.getElementById("nombres");
    var apellidos = document.getElementById("apellidos");
    var salario = document.getElementById("salario");
    var empleado = new Empleado(cedula.value, nombres.value, apellidos.value, salario.value);
    empleados.push(empleado);
    localStorage.setItem("empleados", JSON.stringify(empleados));
    nuevo();
}

function consultar() {
    var empleados = JSON.parse(localStorage.getItem("empleados") || "[]");
    var cedula = document.getElementById("cedula");
    var nombres = document.getElementById("nombres");
    var apellidos = document.getElementById("apellidos");
    var salario = document.getElementById("salario");
    for (let i = 0; i < empleados.length; i++) {
        if (empleados[i].cedula == cedula.value) {
            nombres.value = empleados[i].nombres;
            apellidos.value = empleados[i].apellidos;
            salario.value = empleados[i].salario;
            break;
        }
    }
}

function actualizar() {
    var empleados = JSON.parse(localStorage.getItem("empleados") || "[]");
    var cedula = document.getElementById("cedula");
    var nombres = document.getElementById("nombres");
    var apellidos = document.getElementById("apellidos");
    var salario = document.getElementById("salario");

    for (let i = 0; i < empleados.length; i++) {
        if (empleados[i].cedula == cedula.value) {
            empleados[i].nombres = nombres.value;
            empleados[i].apellidos = apellidos.value;
            empleados[i].salario = salario.value;
            break;
        }
    }
    localStorage.setItem("empleados", JSON.stringify(empleados));
}
    

function eliminar() {
    var empleados = JSON.parse(localStorage.getItem("empleados") || "[]");
    var cedula = document.getElementById("cedula");

    for (let i = 0; i < empleados.length; i++) {
        if (empleados[i].cedula == cedula.value) {
            empleados.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("empleados", JSON.stringify(empleados));
}

function listar() {
    var empleados = JSON.parse(localStorage.getItem("empleados") || "[]");
    console.log(empleados);
}

function nuevo() {
    var cedula = document.getElementById("cedula");
    var nombres = document.getElementById("nombres");
    var apellidos = document.getElementById("apellidos");
    var salario = document.getElementById("salario");
    cedula.value = "";
    nombres.value = "";
    apellidos.value = "";
    salario.value = "";
    cedula.focus();
}