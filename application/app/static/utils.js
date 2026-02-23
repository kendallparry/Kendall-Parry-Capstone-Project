export function getDateString(date) {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

export function parseDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getTimeString(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function parseTimeString(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export async function loadEvents() {
    const response = await fetch('/api/events');
    const rows = await response.json();

    //group by dates
    let nextIndex = 1;
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

    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
}
