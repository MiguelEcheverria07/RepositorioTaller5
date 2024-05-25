class Evento {
    constructor(fecha, hora, descripcion, participantes) {
        this.fecha = fecha;
        this.hora = hora;
        this.descripcion = descripcion;
        this.participantes = participantes;
    }

    static getAllEventos() {
        const eventos = localStorage.getItem('eventos');
        return eventos ? JSON.parse(eventos) : [];
    }

    static saveEvento(evento) {
        const eventos = Evento.getAllEventos();
        eventos.push(evento);
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }

    static deleteEvento(fecha, hora) {
        let eventos = Evento.getAllEventos();
        eventos = eventos.filter(evento => evento.fecha !== fecha || evento.hora !== hora);
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }

    static updateEvento(originalFecha, originalHora, updatedEvento) {
        let eventos = Evento.getAllEventos();
        const index = eventos.findIndex(evento => evento.fecha === originalFecha && evento.hora === originalHora);
        if (index !== -1) {
            eventos[index] = updatedEvento;
            localStorage.setItem('eventos', JSON.stringify(eventos));
        }
    }
}

export default Evento;
