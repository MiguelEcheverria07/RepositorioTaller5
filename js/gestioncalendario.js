import Evento from './Evento.js';

let vistaActual = 'mensual';
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const diasPorMes = {
  1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
};
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const diasSemanaAnual = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const selectHoras = document.getElementById('hora');
let fechaActual = new Date();
let divDiasMesActual = null;
let eventoEditando = null; 

document.addEventListener('DOMContentLoaded', () => {
  actualizarCalendario();
  mostrarEventosEnTabla();
  mostrarDiasDelMes(new Date().getMonth() + 1, Evento.getAllEventos());
});

function cambiarVista(vista) {
  vistaActual = vista;
  const calendario = document.getElementById('calendario');
  const formularioEvento = document.getElementById('formularioEvento');
  const listaEventos = document.getElementById('listaEventos');

  calendario.style.display = 'none';
  formularioEvento.style.display = 'none';
  listaEventos.style.display = 'none'

  if (vista === 'anual' || vista === 'mensual' || vista === 'diario') {
    calendario.style.display = 'flex';
  } else if (vista === 'formularioEvento') {
    formularioEvento.style.display = 'block';
    listaEventos.style.display = 'block';
  } 
  actualizarCalendario();
}

function actualizarCalendario() {
  const calendario = document.getElementById('calendario');
  calendario.innerHTML = '';
  const eventos = Evento.getAllEventos();

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

      const tituloMes = document.createElement('div');
      tituloMes.className = 'titulo-mes';
      tituloMes.textContent = mes;
      divMes.appendChild(tituloMes);
      divMes.appendChild(divDiasSemanaAnual.cloneNode(true));

      const divDias = document.createElement('div');
      divDias.className = 'dias-mes';

      const primerDia = obtenerDiaDeLaSemana(i + 1);
      for (let j = 0; j < primerDia; j++) {
        const divDia = document.createElement('div');
        divDia.className = 'dia dia-blanco';
        divDias.appendChild(divDia);
      }

      const diasEnMes = diasPorMes[i + 1];
      for (let dia = 1; dia <= diasEnMes; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'dia';
        divDia.textContent = dia;
        const fecha = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const eventosDelDia = eventos.filter(evento => evento.fecha === fecha);
        if (eventosDelDia.length > 0) {
          divDia.style.backgroundColor = '#ff5733';
        }
        divDias.appendChild(divDia);
      }
      divMes.appendChild(divDias);
      calendario.appendChild(divMes);
    }
  } else if (vistaActual === 'mensual') {
    const selectMes = document.createElement('select');
    selectMes.addEventListener('change', (event) => {
      const mesSeleccionado = event.target.value;
      mostrarDiasDelMes(mesSeleccionado, eventos);
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

    selectMes.value = 5;
    mostrarDiasDelMes(5, eventos);
  } else if (vistaActual === 'diario') {
    const horas = document.getElementById('horas');
    horas.innerHTML = '';

    const fecha = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(fechaActual.getDate()).padStart(2, '0')}`;
    const eventosDelDia = obtenerEventosDelDia(fecha);

    for (let i = 0; i < 24; i++) {
      const divHora = document.createElement('div');
      divHora.className = 'hora';
      divHora.textContent = `${i}:00 - ${i + 1}:00`;

      const eventosEnHora = eventosDelDia.filter(evento => {
        const [eventoHora] = evento.hora.split(':');
        return parseInt(eventoHora) === i;
      });

      if (eventosEnHora.length > 0) {
        divHora.style.backgroundColor = '#ff5733';
        divHora.innerHTML += '<br>';
        divHora.innerHTML += eventosEnHora.map(evento => evento.hora).join('<br>');
      }
      horas.appendChild(divHora);
    }
    mostrarDiaActual();
  }
}

function mostrarDiasDelMes(mesSeleccionado, eventos) {
  const diasEnMes = diasPorMes[mesSeleccionado];
  const primerDia = obtenerDiaDeLaSemana(mesSeleccionado);
  const divDias = document.createElement('div');
  divDias.className = 'dias-mes';

  const filaDiasSemana = document.createElement('div');
  filaDiasSemana.className = 'fila-dias';
  for (let i = 0; i < diasSemana.length; i++) {
    const divDiaSemana = document.createElement('div');
    divDiaSemana.className = 'dia-semana';
    divDiaSemana.textContent = diasSemana[i];
    filaDiasSemana.appendChild(divDiaSemana);
  }
  divDias.appendChild(filaDiasSemana);

  let divFila = document.createElement('div');
  divFila.className = 'fila-dias';

  for (let i = 0; i < primerDia; i++) {
    const divBlanco = document.createElement('div');
    divBlanco.className = 'dia dia-blanco';
    divFila.appendChild(divBlanco);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const divDia = document.createElement('div');
    divDia.className = 'dia';
    divDia.textContent = dia;

    const eventosDelDia = eventos.filter(evento => {
      const [eventoAnio, eventoMes, eventoDia] = evento.fecha.split('-').map(Number);
      return eventoAnio === new Date().getFullYear() && eventoMes == mesSeleccionado && eventoDia == dia;
    });
    if (eventosDelDia.length > 0) {
      divDia.style.backgroundColor = '#ff5733';
      divDia.innerHTML += '<br>'; 
      divDia.innerHTML += eventosDelDia.map(evento => {
        const horaFin = incrementarMediaHora(evento.hora);
        return `<span><br>${evento.hora} - ${horaFin}<br>${evento.descripcion}</span>`;
    }).join('');
    }

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

  const fecha = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(fechaActual.getDate()).padStart(2, '0')}`;
  const eventosDelDia = obtenerEventosDelDia(fecha);

  for (let i = 0; i < 24; i++) {
    const divHora = document.createElement('div');
    divHora.className = 'hora';
    divHora.textContent = `${i}:00 - ${i + 1}:00`;

    const eventosEnHora = eventosDelDia.filter(evento => {
      const [eventoHora] = evento.hora.split(':');
      return parseInt(eventoHora) === i;
    });

    if (eventosEnHora.length > 0) {
      divHora.style.backgroundColor = '#ff5733';
      divHora.innerHTML += '<br>';
      divHora.innerHTML += eventosEnHora.map(evento => {
          const horaFin = incrementarMediaHora(evento.hora);
          return `<span><br>${evento.hora} - ${horaFin}<br>${evento.descripcion}</span>`;
      }).join('');
  }

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

function obtenerEventosDelDia(fecha) {
  const eventos = Evento.getAllEventos();
  return eventos.filter(evento => evento.fecha === fecha);
}

function mostrarEventosEnTabla() {
  const eventos = Evento.getAllEventos();
  const tabla = document.getElementById('eventosTable');
  tabla.innerHTML = '';

  eventos.forEach(evento => {
    const fila = document.createElement('tr');
    
    const celdaFecha = document.createElement('td');
    celdaFecha.textContent = evento.fecha;
    fila.appendChild(celdaFecha);

    const celdaHora = document.createElement('td');
    celdaHora.textContent = evento.hora;
    fila.appendChild(celdaHora);

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = evento.descripcion;
    fila.appendChild(celdaDescripcion);

    const celdaParticipantes = document.createElement('td');
    celdaParticipantes.textContent = evento.participantes;
    fila.appendChild(celdaParticipantes);

    const celdaAcciones = document.createElement('td');
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => {
      editarEvento(evento);
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => {
      eliminarEvento(evento.fecha, evento.hora);
    });

    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);
    fila.appendChild(celdaAcciones);

    tabla.appendChild(fila);
  });
}

function obtenerDiaDeLaSemana(mes) {
  const añoActual = new Date().getFullYear();
  return new Date(añoActual, mes - 1, 1).getDay();
}

function incrementarMediaHora(hora) {
  let [horas, minutos] = hora.split(':').map(Number);
  minutos += 30;
  if (minutos >= 60) {
      horas += 1;
      minutos -= 60;
  }
  horas = horas < 10 ? `0${horas}` : horas;
  minutos = minutos < 10 ? `0${minutos}` : minutos;
  return `${horas}:${minutos}`;
}

for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j += 30) {
    const hora = `${String(i).padStart(2, '0')}:${String(j).padStart(2, '0')}`;
    const option = document.createElement('option');
    option.value = hora;
    option.textContent = hora;
    selectHoras.appendChild(option);
  }
}

function editarEvento(evento) {
  eventoEditando = { ...evento }; 
  document.getElementById('fecha').value = evento.fecha;
  document.getElementById('hora').value = evento.hora;
  document.getElementById('descripcion').value = evento.descripcion;
  document.getElementById('participantes').value = evento.participantes;
  document.getElementById('formularioEvento').style.display = 'block';
}

function eliminarEvento(fecha, hora) {
  Evento.deleteEvento(fecha, hora);
  mostrarEventosEnTabla();
  actualizarCalendario();
}

actualizarCalendario();

document.getElementById('btnAnual').addEventListener('click', () => cambiarVista('anual'));
document.getElementById('btnMensual').addEventListener('click', () => cambiarVista('mensual'));
document.getElementById('btnDiario').addEventListener('click', () => cambiarVista('diario'));
document.getElementById('btnCrearEvento').addEventListener('click', () => {
  document.getElementById('calendario').style.display = 'none';
  document.getElementById('formularioEvento').style.display = 'block';
  listaEventos.style.display = 'inline-block';
});

document.getElementById('eventoForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const descripcionInput = document.getElementById('descripcion');
  var descripcion = descripcionInput.value;
  var participantesInput = document.getElementById('participantes');
  var participantes = participantesInput.value;

  if (eventoEditando) {
    const updatedEvento = new Evento(fecha, hora, descripcion, participantes);
    Evento.updateEvento(eventoEditando.fecha, eventoEditando.hora, updatedEvento);
    eventoEditando = null; 
  } else {
    const nuevoEvento = new Evento(fecha, hora, descripcion, participantes);
    Evento.saveEvento(nuevoEvento);
  }

  descripcionInput.value = "";
  participantesInput.value = "";
  descripcionInput.focus();

  actualizarCalendario();
  mostrarEventosEnTabla();
});