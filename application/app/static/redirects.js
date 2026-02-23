const logoButton = document.getElementById("logoButton");
logoButton.addEventListener('click', function() {
    window.location.href = '/';
})

const settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener('click', function() {
    window.location.href = '/settings';
})

const eventsButton = document.getElementById("eventsButton");
if (eventsButton != null){
    eventsButton.addEventListener('click', function() {
        window.location.href = '/events';
    })
}

const resourcesButton = document.getElementById("resourcesButton");
if (resourcesButton != null){
    resourcesButton.addEventListener('click', function() {
        window.location.href = '/resources';
    })
}