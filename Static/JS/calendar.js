// Global variables
let currentMonth; // Current month in global scope
let currentYear;
let eventStore = new Map(); // To store events by date

// Utility: Get the name of a month based on its index
function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

// Utility: Format date as YYYY-MM-DD
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Function to add events to the store
function addEventToStore(eventData) {
    const eventDate = eventData.Start_Date; // Format: YYYY-MM-DD
    if (!eventStore.has(eventDate)) {
        eventStore.set(eventDate, []);
    }
    eventStore.get(eventDate).push(eventData);
}

// Function to delete events from the store
function deleteEventFromStore(eventDate, eventIndex) {
    if (eventStore.has(eventDate)) {
        const events = eventStore.get(eventDate);
        events.splice(eventIndex, 1); // Remove specific event
        if (events.length === 0) {
            eventStore.delete(eventDate); // Remove date if no events left
        }
    }
}
// Function to display events inside a day's div
function displayEvents(dayDiv, day, month, year) {
    const dateKey = formatDate(year, month, day);
    if (eventStore.has(dateKey)) {
        const events = eventStore.get(dateKey);
        const eventsContainer = document.createElement("div");
        eventsContainer.classList.add("events-container");

        events.forEach((event, index) => {
            const eventTitle = document.createElement("div");
            eventTitle.classList.add("event-title");
            eventTitle.textContent = event.Title;

            // Create delete button for this event
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("DeleteEvent");
            deleteButton.dataset.date = dateKey; // Bind event date
            deleteButton.dataset.index = index; // Bind event index for precise deletion
            deleteButton.textContent = "Delete";

            eventTitle.appendChild(deleteButton);
            eventsContainer.appendChild(eventTitle);
        });

        dayDiv.appendChild(eventsContainer);
    }
}

// Attach delete button listeners dynamically
function attachDeleteEventListeners() {
    document.querySelectorAll(".DeleteEvent").forEach(button => {
        button.addEventListener("click", function () {
            const eventDate = button.dataset.date;
            const eventIndex = button.dataset.index;

            // Remove event from the event store
            deleteEventFromStore(eventDate, eventIndex);

            // Send DELETE request to the backend
            fetch('/delete_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Date: eventDate })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message || "Event deleted successfully.");
                })
                .catch(error => console.error("Error deleting event:", error))
                .finally(() => {
                    createCalendar(currentMonth, currentYear); // Refresh the calendar
                });
        });
    });
}

// Function to create the calendar for a given month and year
function createCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear previous content

    // Displaying the month and year
    const monthNameDiv = document.createElement("div");
    monthNameDiv.textContent = getMonthName(month) + " " + year;
    monthNameDiv.classList.add("month-title");
    calendar.appendChild(monthNameDiv);

    // Adding day names (Sun to Sat)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(dayName => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.textContent = dayName;
        dayNameDiv.classList.add("day-name");
        calendar.appendChild(dayNameDiv);
    });

    // Calculate days in the month and the first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const currentDate = new Date();

    // Add empty divs for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-day");
        calendar.appendChild(emptyDiv);
    }

    // Adding divs for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        // Highlight the current day
        if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
            dayDiv.classList.add("current-day");
        }
        // Display events for this day
        displayEvents(dayDiv, day, month, year);

        calendar.appendChild(dayDiv);
    }
    // Attach delete event listeners to the buttons
    attachDeleteEventListeners();
}

const addEventButton = document.createElement('button');
addEventButton.textContent = 'Add Event';
addEventButton.classList.add('add-event-button');
addEventButton.addEventListener('click', () => {
    openEventForm(null,null,null);
});
document.body.appendChild(addEventButton);

// Function to display the event form
function openEventForm(day, month, year) {
    const eventForm = document.getElementById("EventForm");
    eventForm.style.display = "block";
    document.getElementById("eventday").value = day;
    document.getElementById("eventmonth").value = month + 1; // Month is zero-indexed
    document.getElementById("eventyear").value = year;
}

// Function to change the background dynamically based on the month
function changeBackground(month) {
    const seasons = ["Winter", "Spring", "Summer", "Autumn"];
    const season = seasons[Math.floor(month / 3)];

    fetch(`/get_random_image?query=${season}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.image_url) {
                const img = new Image();
                img.src = data.image_url;
                img.onload = () => {
                    document.body.style.backgroundImage = `url(${data.image_url})`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                };
            } else {
                console.error("No image URL provided by the API.");
            }
        })
        .catch(error => console.error("Error fetching image:", error));
}

// Navigation: Show Last month
function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    createCalendar(currentMonth, currentYear);
    changeBackground(currentMonth);
}

// Navigation: Show Next month
function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentMonth, currentYear);
    changeBackground(currentMonth);
}

function fetchEvents() {
    fetch('/get_calendar_events')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(event => {
                const eventDate = event.Start_Date.split("T")[0]; // Extract YYYY-MM-DD
                if (!eventStore.has(eventDate)) {
                    eventStore.set(eventDate, []);
                }
                eventStore.get(eventDate).push({
                    Title: event.Title,
                    Start_Date: event.Start_Date
                });
            });
            createCalendar(currentMonth, currentYear); // Refresh calendar with events
        })
        .catch(error => console.error("Error fetching events:", error));
}


// Main: Initialize the calendar on page load
document.addEventListener('DOMContentLoaded', function () {
    const date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    createCalendar(currentMonth, currentYear);
    fetchEvents();
    changeBackground(currentMonth);

    // Adding navigation buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = '<- Previous Month';
    prevButton.classList.add('nav-button');
    prevButton.addEventListener('click', showPreviousMonth);
    document.body.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Month ->';
    nextButton.classList.add('nav-button');
    nextButton.addEventListener('click', showNextMonth);
    document.body.appendChild(nextButton);

    // Event form close button which is repsonsible for closing the events clicking outside of it won't work.
    const closeButton = document.querySelector('.CloseButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const eventForm = document.getElementById("EventForm");
            if (eventForm) {
                eventForm.style.display = "none";
            }
        });
    }

    // Event form submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const eventForm = document.getElementById("EventForm");
            if (eventForm) {
                eventForm.style.display = "none";
            }
            const eventData = {
                Title: document.getElementById("EventTitle").value,
                Description: document.getElementById("EventDescription").value,
                Start_Date: document.getElementById("StartDate").value
            };

            // Add to the event store
            addEventToStore(eventData);

            fetch('/add_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Event added successfully:", data);
                    createCalendar(currentMonth, currentYear); // Refresh calendar
                })
                .catch(error => console.error("Error adding event:", error))
                .finally(() => {
                    eventForm.reset(); // Reset form fields
                    eventForm.style.display = "none";
                    
                });
        });
    }
});
