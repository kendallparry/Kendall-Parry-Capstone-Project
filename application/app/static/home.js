import { getTimeString, getDateString, loadEvents } from './utils.js';

async function loadUpcomingEvents() {
    const data = await loadEvents();

    // --- Convert event data to FullCalendar format ---
    const fcEvents = [];
    data.forEach(date => {
        date.items.forEach(item => {
            fcEvents.push({
                title: item.title,
                // Combine date and times to match FullCalendar format
                start: `${date.rawDate}T${item.rawStartTime}`,
                end: `${date.rawDate}T${item.rawEndTime}`,
                extendedProps: {
                    location: item.location,
                    notes: item.notes,
                    startTime: item.startTime,
                    endTime: item.endTime,
                }
            });
        });
    });


    // Sidebar initialization
    const sidebar = document.getElementById('sidebar');
    const eventsList = new FullCalendar.Calendar(sidebar, {
        headerToolbar: {
            left:'',
            center:'',
            right:'',
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

        eventMouseEnter(info){
            const { location, notes, startTime, endTime } = info.event.extendedProps;
            const tooltipContent = `
                <strong>${info.event.title}</strong><br>
                ${startTime} - ${endTime}<br>
                ${location}
                ${notes ? `<br>${notes}` : ""}
                `

            const existing = bootstrap.Tooltip.getInstance(info.el);
            if (existing) existing.dispose();            
            
            var tooltip = new Tooltip(info.el, {
                title: tooltipContent,
                html: true,
                placement: 'top',
                trigger: 'manual',
                container: 'body'
            });
            tooltip.show();
        },

        eventMouseLeave(info) {
            const tooltip = bootstrap.Tooltip.getInstance(info.el);
            if (tooltip) {
                tooltip.hide();
                tooltip.dispose();
            }
        },

        //click an event to go to the events page
        eventClick(info) {
            window.location.href = '/events';
        }
    });

    calendar.render();
    eventsList.render();
}

document.addEventListener("DOMContentLoaded", loadUpcomingEvents);