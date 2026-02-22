let events = [];
let nextIndex = 1;

async function loadEvents() {
    const response = await fetch('/api/events');
    const rows = await response.json();

    //group by dates
    const dateMap = {};
    rows.forEach(row => {
        const dateStr = getDateString(row.date);
        if (!dateMap[dateStr]) {
            dateMap[dateStr] = {
                id: nextIndex++,
                date: dateStr,
                items: []
            };
        }
        dateMap[dateStr].items.push({
            event_id: row.event_id,
            startTime: getTimeString(row.start_time),
            endTime: getTimeString(row.end_time),
            title: row.title,
            location: row.location,
            notes: row.notes
        });
    });

    events = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    fillEvents();
}

function getDateString(date) {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function parseDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTimeString(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function parseTimeString(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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

eventSubmissionButton.addEventListener("click", function(e){
    e.preventDefault();

    const title = document.querySelector('#addModal #eventTitle').value;
    const date = getDateString(document.querySelector('#addModal #eventDate').value);
    const startTime = getTimeString(document.querySelector('#addModal #startTime').value);
    const endTime = getTimeString(document.querySelector('#addModal #endTime').value);
    const location = document.querySelector('#addModal #eventLocation').value;
    const notes = document.querySelector('#addModal #eventNotes').value;

    let dateItem = events.find(e => e.date === date);
    if (!dateItem) {
        dateItem = {
            id: nextIndex++,
            date: date,
            items: []
        };
        events.push(dateItem);
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    dateItem.items.push({
        startTime: startTime,
        endTime: endTime,
        title: title,
        location: location,
        notes:notes
    });

    document.querySelector('#addModal #eventTitle').value = "";
    document.querySelector('#addModal #eventDate').value = "";
    document.querySelector('#addModal #startTime').value = "";
    document.querySelector('#addModal #endTime').value = "";
    document.querySelector('#addModal #eventLocation').value = "";
    document.querySelector('#addModal #eventNotes').value = "";

    fillEvents();
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addModal"));
    modalInstance.hide();
});

document.getElementById('pickEvent').addEventListener('input', function(){
    const selected = this.value;

    let selectedEvent;
    let selectedDateId;
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

document.getElementById('saveChanges').addEventListener('click', function() {
    const modal = document.getElementById('editModal');
    const dateId = parseInt(modal.dataset.editDateId);
    const itemIndex = parseInt(modal.dataset.editItemIndex);

    const dateItem = events.find(e => e.id === dateId);
    const newTitle = modal.querySelector('#eventTitle').value;
    const newDate = getDateString(modal.querySelector('#eventDate').value);
    const newStartTime = getTimeString(modal.querySelector('#startTime').value);
    const newEndTime = getTimeString(modal.querySelector('#endTime').value);
    const newLocation = modal.querySelector('#eventLocation').value;
    const newNotes = modal.querySelector('#eventNotes').value;

    if (dateItem.date !== newDate){
        dateItem.items.splice(itemIndex,1);
        if (dateItem.items.length === 0){
            events = events.filter(e => e.id !== dateId);
        }

        let newDateItem = events.find(e => e.date === newDate);
        if (!newDateItem){
            newDateItem = {
                id: nextIndex++,
                date: newDate,
                items: []
            };
            events.push(newDateItem);
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        newDateItem.items.push({
            startTime: newStartTime,
            endTime: newEndTime,
            title: newTitle,
            location: newLocation,
            notes: newNotes
        });
    }
    else{
        dateItem.items[itemIndex] = {
            startTime: newStartTime,
            endTime: newEndTime,
            title: newTitle,
            location: newLocation,
            notes: newNotes
        }
    }

    document.querySelector('#editModal #eventTitle').value = "";
    document.querySelector('#editModal #eventDate').value = "";
    document.querySelector('#editModal #startTime').value = "";
    document.querySelector('#editModal #endTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";
    document.getElementById('pickEvent').value = "";

    fillEvents();
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});


document.getElementById('deleteEvent').addEventListener('click', function() {
    const modal = document.getElementById('editModal');
    const dateId = parseInt(modal.dataset.editDateId);
    const itemIndex = parseInt(modal.dataset.editItemIndex);

    if (!confirm("Are you sure you want to delete this event?")){
        return;
    }

    const dateItem = events.find(e => e.id === dateId);
    dateItem.items.splice(itemIndex,1);

    if (dateItem.items.length === 0){
        events = events.filter(e => e.id !== dateId);
    }

    document.querySelector('#editModal #eventTitle').value = "";
    document.querySelector('#editModal #eventDate').value = "";
    document.querySelector('#editModal #startTime').value = "";
    document.querySelector('#editModal #endTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";
    document.getElementById('pickEvent').value = "";

    fillEvents();
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});


document.addEventListener("DOMContentLoaded", function() {
    loadEvents();
});