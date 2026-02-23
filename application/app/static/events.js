import { getTimeString, getDateString, parseDateString, parseTimeString, loadEvents } from './utils.js';

let events = [];
let nextIndex = 1;

async function refresh() {
    events = await loadEvents();
    fillEvents();
}

function fillEvents(){
    const eventsList = document.querySelector("#eventsList ul");
    eventsList.innerHTML = "";
    events.forEach(date => {
        const dateItem = document.createElement('li');
        dateItem.textContent = date.date;
        eventsList.appendChild(dateItem);

        const itemsList = document.createElement('ul');
        date.items.forEach((item, index) => {
            const event = document.createElement('li');
            event.textContent = `${item.startTime} - ${item.endTime} -- ${item.title}`;
            event.dataset.dateId = date.id;
            event.dataset.itemIndex = index;
            itemsList.appendChild(event);
        });
        eventsList.appendChild(itemsList);
    });

    updateEvents();
}

function updateEvents(){
    const datalist = document.getElementById("datalistOptions");
    datalist.innerHTML = '';

    events.forEach(date =>{
        date.items.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = `${date.date} ${item.startTime} - ${item.endTime} -- ${item.title}`;
            option.dataset.dateId = date.id;
            option.dataset.itemIndex = index;
            datalist.appendChild(option);
        });
    })
} 
const eventSubmissionButton = document.getElementById("eventSubmission");

eventSubmissionButton.addEventListener("click", async function(e){
    e.preventDefault();

    const title = document.querySelector('#addModal #eventTitle').value;
    const date = document.querySelector('#addModal #eventDate').value;
    const start_time = document.querySelector('#addModal #startTime').value;
    const end_time = document.querySelector('#addModal #endTime').value;
    const location = document.querySelector('#addModal #eventLocation').value;
    const notes = document.querySelector('#addModal #eventNotes').value;

    await fetch('/api/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, date, start_time, end_time, location, notes })
    });
    
    document.querySelector('#addModal #eventTitle').value = "";
    document.querySelector('#addModal #eventDate').value = "";
    document.querySelector('#addModal #startTime').value = "";
    document.querySelector('#addModal #endTime').value = "";
    document.querySelector('#addModal #eventLocation').value = "";
    document.querySelector('#addModal #eventNotes').value = "";

    await refresh();
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addModal"));
    modalInstance.hide();
});

document.getElementById('pickEvent').addEventListener('input', function(){
    const selected = this.value;

    let selectedEvent;
    let selectedDateId;
    let selectedDate;
    let selectedItemIndex;

    events.forEach(date => {
        date.items.forEach((item, index) => {
            const eventString = `${date.date} ${item.startTime} - ${item.endTime} -- ${item.title}`;
            if (eventString === selected) {
                selectedEvent = item;
                selectedDateId = date.id;
                selectedItemIndex = index;
                selectedDate = date.date;
            }
        });
    });

    if (selectedEvent) {
        const modal = document.getElementById('editModal');
        modal.querySelector('#eventTitle').value = selectedEvent.title;
        modal.querySelector('#eventDate').value = parseDateString(selectedDate);
        modal.querySelector('#startTime').value = parseTimeString(selectedEvent.startTime);
        modal.querySelector('#endTime').value = parseTimeString(selectedEvent.endTime);
        modal.querySelector('#eventLocation').value = selectedEvent.location;
        modal.querySelector('#eventNotes').value = selectedEvent.notes;

        modal.dataset.editDateId = selectedDateId;
        modal.dataset.editItemIndex = selectedItemIndex;
    }
});

document.getElementById('saveChanges').addEventListener('click', async function() {
    const modal = document.getElementById('editModal');
    const dateId = parseInt(modal.dataset.editDateId);
    const itemIndex = parseInt(modal.dataset.editItemIndex);
    event_id = events.find(e=> e.id === dateId).items[itemIndex].event_id;

    await fetch(`/api/events/${event_id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: modal.querySelector('#eventTitle').value,
            date: modal.querySelector('#eventDate').value,
            start_time: modal.querySelector('#startTime').value,
            end_time: modal.querySelector('#endTime').value,
            location: modal.querySelector('#eventLocation').value,
            notes: modal.querySelector('#eventNotes').value
        })
    });

    document.querySelector('#editModal #eventTitle').value = "";
    document.querySelector('#editModal #eventDate').value = "";
    document.querySelector('#editModal #startTime').value = "";
    document.querySelector('#editModal #endTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";
    document.getElementById('pickEvent').value = "";

    await refresh();
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});


document.getElementById('deleteEvent').addEventListener('click', async function() {
    const modal = document.getElementById('editModal');
    const dateId = parseInt(modal.dataset.editDateId);
    const itemIndex = parseInt(modal.dataset.editItemIndex);
    event_id = events.find(e=> e.id === dateId).items[itemIndex].event_id;

    if (!confirm("Are you sure you want to delete this event?")){
        return;
    }

    await fetch(`/api/events/${event_id}`, { method: 'DELETE' });

    document.querySelector('#editModal #eventTitle').value = "";
    document.querySelector('#editModal #eventDate').value = "";
    document.querySelector('#editModal #startTime').value = "";
    document.querySelector('#editModal #endTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";
    document.getElementById('pickEvent').value = "";

    await refresh();
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});


document.addEventListener("DOMContentLoaded", function() {
    refresh();
});