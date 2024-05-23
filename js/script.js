document.addEventListener('DOMContentLoaded', () => {
    const viewAnnual = document.getElementById('view-annual');
    const viewMonthly = document.getElementById('view-monthly');
    const viewDaily = document.getElementById('view-daily');
    const calendarView = document.getElementById('calendar-view');
    const eventModal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.close');
    const eventForm = document.getElementById('event-form');

    let events = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let currentDay = new Date().getDate();

    viewAnnual.addEventListener('click', displayAnnualView);
    viewMonthly.addEventListener('click', () => displayMonthlyView(currentMonth, currentYear));
    viewDaily.addEventListener('click', () => displayDailyView(currentDay, currentMonth, currentYear));

    closeModal.addEventListener('click', () => eventModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });

    eventForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newEvent = {
            date: event.target.date.value,
            time: event.target.time.value,
            description: event.target.description.value,
            participants: event.target.participants.value,
        };
        events.push(newEvent);
        eventModal.style.display = 'none';
        displayMonthlyView(currentMonth, currentYear); // Refresh view
    });

    function displayAnnualView() {
        calendarView.innerHTML = '<h2>Vista Anual</h2>';
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let html = '<div class="annual-view">';
        for (let month = 0; month < 12; month++) {
            html += `<div class="month" onclick="displayMonthlyView(${month}, ${currentYear})">${months[month]}</div>`;
        }
        html += '</div>';
        calendarView.innerHTML = html;
    }

    function displayMonthlyView(month, year) {
        currentMonth = month;
        currentYear = year;
        calendarView.innerHTML = '<h2>Vista Mensual</h2>';
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let html = '<div class="monthly-view">';
        for (let day = 1; day <= daysInMonth; day++) {
            let dayEvents = events.filter(event => {
                let eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day;
            });
            html += `<div class="day" onclick="displayDailyView(${day}, ${month}, ${year})">${day}${dayEvents.length ? '<span class="event-count"> (' + dayEvents.length + ')</span>' : ''}</div>`;
        }
        html += '</div>';
        calendarView.innerHTML = html;
    }

    function displayDailyView(day, month, year) {
        currentDay = day;
        currentMonth = month;
        currentYear = year;
        calendarView.innerHTML = '<h2>Vista Diaria</h2>';
        let html = '<div class="daily-view">';
        for (let hour = 0; hour < 24; hour++) {
            let hourString = hour < 10 ? '0' + hour + ':00' : hour + ':00';
            let halfHourString = hour < 10 ? '0' + hour + ':30' : hour + ':30';
            let fullHourEvents = events.filter(event => {
                let eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day && event.time === hourString;
            });
            let halfHourEvents = events.filter(event => {
                let eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day && event.time === halfHourString;
            });
            html += `<div class="hour">${hourString}${fullHourEvents.length ? ' (' + fullHourEvents.length + ')' : ''}</div>`;
            html += `<div class="hour">${halfHourString}${halfHourEvents.length ? ' (' + halfHourEvents.length + ')' : ''}</div>`;
        }
        html += '</div>';
        calendarView.innerHTML = html;
    }

    // Display the default view
    displayMonthlyView(currentMonth, currentYear);
});
