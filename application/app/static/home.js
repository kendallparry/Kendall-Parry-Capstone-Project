import { getTimeString, getDateString, loadEvents } from './utils.js';

async function loadUpcomingEvents() {
    const data = await loadEvents();

    // //load sidebar events list
    // const upcomingUl = document.querySelector('#upcoming ul');
    // upcomingUl.innerHTML = '';

    // data.forEach(date => {
    //     const dateLi = document.createElement('li');
    //     dateLi.textContent = date.date;
    //     upcomingUl.appendChild(dateLi);

    //     const itemsUl = document.createElement('ul');
    //     date.items.forEach(item => {
    //         const li = document.createElement('li');
    //         li.textContent = `${item.startTime} ${item.title}`;
    //         itemsUl.appendChild(li);
    //     });
    //     upcomingUl.appendChild(itemsUl);
    // });

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

    // --- Convert event data to FullCalendar format ---
    const fcEvents = [];
    data.forEach(date => {
        date.items.forEach(item => {
            fcEvents.push({
                title: item.title,
                // Combine date and times to match FullCalendar format
                start: `${date.rawDate}T${item.rawStartTime}`,
                end: `${date.rawDate}T${item.rawEndTime}`,
            });
        });
    });


    // Sidebar initialization
    const sidebar = document.getElementById('sidebar');
    const eventsList = new FullCalendar.Calendar(sidebar, {
        headerToolbar: {
            
        },
        initialView: 'listMonth',
        events: fcEvents,
        height: 'auto',
    });
    
    

    // Calendar initialization
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
        },
        events: fcEvents,
        height: 'auto',

        // Optional: click an event to show details
        eventClick(info) {
            
        }
    });

    calendar.render();
    eventsList.render();
}

document.addEventListener("DOMContentLoaded", loadUpcomingEvents);