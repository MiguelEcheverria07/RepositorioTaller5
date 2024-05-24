// Variables globales
let vistaActual = 'mensual'; // Ahora la vista predeterminada es 'mensual'
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const diasPorMes = {
  1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
};
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const diasSemanaAnual = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
let fechaActual = new Date();

// Función para cambiar la vista del calendario
function cambiarVista(vista) {
  vistaActual = vista;
  // Actualizar la vista del calendario
  actualizarCalendario();
}

// Función para obtener el día de la semana del primer día del mes
function obtenerDiaDeLaSemana(mes) {
  const añoActual = new Date().getFullYear();
  return new Date(añoActual, mes - 1, 1).getDay();
}

// Función para actualizar el contenido del calendario según la vista actual
function actualizarCalendario() {
  const calendario = document.getElementById('calendario');
  calendario.innerHTML = '';

  if (vistaActual === 'anual') {
    const divDiasSemanaAnual = document.createElement('div');
    divDiasSemanaAnual.className = 'fila-dias-semana';
    for (let i = 0; i < diasSemanaAnual.length; i++) {
      const divDiaSemanaAnual = document.createElement('div');
      divDiaSemanaAnual.className = 'dia-semana';
      divDiaSemanaAnual.textContent = diasSemanaAnual[i];
      divDiasSemanaAnual.appendChild(divDiaSemanaAnual);
    }

    for (let i = 0; i < meses.length; i++) {
      const mes = meses[i];
      const divMes = document.createElement('div');
      divMes.className = 'mes';

      // Título del mes
      const tituloMes = document.createElement('div');
      tituloMes.className = 'titulo-mes';
      tituloMes.textContent = mes;
      divMes.appendChild(tituloMes);

      // Contenedor de días de la semana
      divMes.appendChild(divDiasSemanaAnual.cloneNode(true)); // Clonar días de la semana

      // Contenedor de días
      const divDias = document.createElement('div');
      divDias.className = 'dias-mes';

      const primerDia = obtenerDiaDeLaSemana(i + 1);

      for (let j = 0; j < primerDia; j++) {
        const divDia = document.createElement('div');
        divDia.className = 'dia dia-blanco';
        divDias.appendChild(divDia);
      }

      // Crear días
      const diasEnMes = diasPorMes[i + 1];
      for (let dia = 1; dia <= diasEnMes; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'dia';
        divDia.textContent = dia;
        divDias.appendChild(divDia);
      }

      divMes.appendChild(divDias);
      calendario.appendChild(divMes);
    }
  } else if (vistaActual === 'mensual') {
    const selectMes = document.createElement('select');
    selectMes.addEventListener('change', (event) => {
      const mesSeleccionado = event.target.value;
      mostrarDiasDelMes(mesSeleccionado);
    });
    for (let i = 0; i < meses.length; i++) {
      const mes = meses[i];
      const option = document.createElement('option');
      option.value = i + 1;
      option.textContent = mes;
      selectMes.appendChild(option);
    }
    const divMes = document.createElement('div');
    divMes.className = 'mes';
    divMes.appendChild(selectMes);
    calendario.appendChild(divMes);

    // Seleccionar mayo por defecto
    selectMes.value = 5;
    mostrarDiasDelMes(5);
  } else if (vistaActual === 'diario') {
    mostrarDiaActual();
  }
}

let divDiasMesActual = null;

function mostrarDiasDelMes(mesSeleccionado) {
  const diasEnMes = diasPorMes[mesSeleccionado];
  const primerDia = obtenerDiaDeLaSemana(mesSeleccionado);
  const divDias = document.createElement('div');
  divDias.className = 'dias-mes';

  // Crear la fila de días de la semana
  const filaDiasSemana = document.createElement('div');
  filaDiasSemana.className = 'fila-dias';
  for (let i = 0; i < diasSemana.length; i++) {
    const divDiaSemana = document.createElement('div');
    divDiaSemana.className = 'dia-semana';
    divDiaSemana.textContent = diasSemana[i];
    filaDiasSemana.appendChild(divDiaSemana);
  }
  divDias.appendChild(filaDiasSemana);

  // Crear una fila para los días
  let divFila = document.createElement('div');
  divFila.className = 'fila-dias';

  // Añadir días en blanco al principio
  for (let i = 0; i < primerDia; i++) {
    const divBlanco = document.createElement('div');
    divBlanco.className = 'dia dia-blanco';
    divFila.appendChild(divBlanco);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const divDia = document.createElement('div');
    divDia.className = 'dia';
    divDia.textContent = dia;
    divFila.appendChild(divDia);
    if ((dia + primerDia) % 7 === 0) {
      divDias.appendChild(divFila);
      divFila = document.createElement('div');
      divFila.className = 'fila-dias';
    }
  }
  if (divFila.childElementCount > 0) {
    divDias.appendChild(divFila);
  }
  // Verificar si divDiasMesActual es hijo del calendario antes de intentar eliminarlo
  if (divDiasMesActual && divDiasMesActual.parentNode === calendario) {
    calendario.removeChild(divDiasMesActual);
  }
  calendario.appendChild(divDias);
  divDiasMesActual = divDias;
}


function mostrarDiaActual() {
  const calendario = document.getElementById('calendario');
  calendario.innerHTML = '';

  const diaSemana = diasSemana[fechaActual.getDay()];
  const diaMes = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()];

  const tituloDia = document.createElement('div');
  tituloDia.className = 'titulo-dia';
  tituloDia.textContent = `${diaSemana}, ${diaMes} de ${mes}`;
  calendario.appendChild(tituloDia);

  const horas = document.createElement('div');
  horas.className = 'horas';
  for (let i = 0; i < 24; i++) {
    const divHora = document.createElement('div');
    divHora.className = 'hora';
    divHora.textContent = `${i}:00 - ${i + 1}:00`;
    horas.appendChild(divHora);
  }
  calendario.appendChild(horas);

  const divNavegacion = document.createElement('div');
  divNavegacion.className = 'navegacion-dias';

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = 'Día anterior';
  btnAnterior.addEventListener('click', () => {
    fechaActual.setDate(fechaActual.getDate() - 1);
    mostrarDiaActual();
  });

  const btnSiguiente = document.createElement('button');
  btnSiguiente.textContent = 'Día siguiente';
  btnSiguiente.addEventListener('click', () => {
    fechaActual.setDate(fechaActual.getDate() + 1);
    mostrarDiaActual();
  });

  divNavegacion.appendChild(btnAnterior);
  divNavegacion.appendChild(btnSiguiente);

  calendario.appendChild(divNavegacion);
}

actualizarCalendario();

document.getElementById('btnAnual').addEventListener('click', () => cambiarVista('anual'));
document.getElementById('btnMensual').addEventListener('click', () => cambiarVista('mensual'));
document.getElementById('btnDiario').addEventListener('click', () => cambiarVista('diario'));
