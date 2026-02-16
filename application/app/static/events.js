let events = [
    {
        id:1,
        date: 'Saturday, February 7',
        items:[
            {time: '10:00am - 12:00pm', title: 'Sketch & Improv Auditions', location:'Jones 203', notes:''},
            {time: '4:30pm - 6:00pm', title: 'Improv Callbacks', location:'Jones 203', notes:''},
        ]
    }, 
    {
        id:2,
        date: 'Sunday, February 8',
        items:[
            {time: '10:00am - 12:00pm', title: 'Sketch Callbacks', location:'Jones 203', notes:''},
            {time: '4:00pm - 5:30pm', title: 'Improv Practice', location:'Jones 203', notes:''},
        ]
    }
];

let nextIndex = 3;

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
            event.textContent = `${item.time} -- ${item.title}`;
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
            option.value = `${date.date} ${item.time} -- ${item.title}`;
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
    const date = document.querySelector('#addModal #eventDate').value;
    const time = document.querySelector('#addModal #eventTime').value;
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
        events.sort((a,b) => a.date.localeCompare(b.date)); //TODO sort better
    }

    dateItem.items.push({
        time: time,
        title: title,
        location: location,
        notes:notes
    });

    document.querySelector('#addModal #eventTitle').value = "";
    document.querySelector('#addModal #eventDate').value = "";
    document.querySelector('#addModal #eventTime').value = "";
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
            const eventString = `${date.date} ${item.time} -- ${item.title}`;
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
        modal.querySelector('#eventDate').value = selectedDate;
        modal.querySelector('#eventTime').value = selectedEvent.time;
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
    const newDate = modal.querySelector('#eventDate').value;
    const newTime = modal.querySelector('#eventTime').value;
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
            events.sort((a,b) => a.date.localeCompare(b.date)); //TODO sort better
        }

        newDateItem.items.push({
            time: newTime,
            title: newTitle,
            location: newLocation,
            notes: newNotes
        });
    }
    else{
        dateItem.items[itemIndex] = {
            time: newTime,
            title: newTitle,
            location: newLocation,
            notes: newNotes
        }
    }

    document.querySelector('#editModal #eventTitle').value = "";
    document.querySelector('#editModal #eventDate').value = "";
    document.querySelector('#editModal #eventTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";

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
    document.querySelector('#editModal #eventTime').value = "";
    document.querySelector('#editModal #eventLocation').value = "";
    document.querySelector('#editModal #eventNotes').value = "";

    fillEvents();
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});


document.addEventListener("DOMContentLoaded", function() {
    fillEvents();
});