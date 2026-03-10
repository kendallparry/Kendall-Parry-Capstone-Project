import { getTimeString, getDateString, loadEvents } from './utils.js';

async function loadUpcomingEvents() {
    const data = await loadEvents();

    //load sidebar events list
    const upcomingUl = document.querySelector('#upcoming ul');
    upcomingUl.innerHTML = '';
    data.forEach(date => {
        const dateLi = document.createElement('li');
        dateLi.textContent = date.date;
        upcomingUl.appendChild(dateLi);

        const itemsUl = document.createElement('ul');
        date.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.title}`;
            itemsUl.appendChild(li);
        });
        upcomingUl.appendChild(itemsUl);
    });

    // //load main events list
    // const ul = document.querySelector('#eventsList ul');
    // ul.innerHTML = '';

    // data.forEach(date => {
    //     const dateLi = document.createElement('li');
    //     dateLi.textContent = date.date;
    //     ul.appendChild(dateLi);

    //     const itemsUl = document.createElement('ul');
    //     date.items.forEach(item => {
    //         const li = document.createElement('li');
    //         li.textContent = `${item.startTime} - ${item.endTime} -- ${item.title}`;
    //         itemsUl.appendChild(li);
    //     });
    //     ul.appendChild(itemsUl);
    // });

    // --- Convert your data format to FullCalendar events ---
    const fcEvents = [];
    data.forEach(date => {
        date.items.forEach(item => {
            fcEvents.push({
                title: item.title,
                // Combine date string + time strings, e.g. "2025-06-15T14:00:00"
                start: `${date.rawDate}T${item.rawStartTime}`,
                end: `${date.rawDate}T${item.rawEndTime}`,
            });
        });
    });

    // --- Initialize FullCalendar ---
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',    // month grid; swap for 'timeGridWeek' or 'listWeek'
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: fcEvents,
        height: 'auto',

        // Optional: click an event to show details
        eventClick(info) {
            
        }
    });

    calendar.render();

}

document.addEventListener("DOMContentLoaded", loadUpcomingEvents);