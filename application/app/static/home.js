import { getTimeString, getDateString, loadEvents } from './utils.js';

const eventsButton = document.getElementById("events");
eventsButton.addEventListener('click', function() {
    window.location.href = '/events';
})

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

    //load main events list
    const ul = document.querySelector('#eventsList ul');
    ul.innerHTML = '';

    data.forEach(date => {
        const dateLi = document.createElement('li');
        dateLi.textContent = date.date;
        ul.appendChild(dateLi);

        const itemsUl = document.createElement('ul');
        date.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.startTime} - ${item.endTime} -- ${item.title}`;
            itemsUl.appendChild(li);
        });
        ul.appendChild(itemsUl);
    });
}

document.addEventListener("DOMContentLoaded", loadUpcomingEvents);