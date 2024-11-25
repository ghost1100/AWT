let currentMonth; // Declare in global scope
let currentYear; 

// Utility: Get the name of a month based on its index
function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

// Utility: Create a calendar for a given/current month and year
function createCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear the previous calendar content

    // Displaying the months names and year
    const monthNameDiv = document.createElement("div");
    monthNameDiv.textContent = getMonthName(month) + " " + year;
    monthNameDiv.classList.add("month-title"); // For styling
    calendar.appendChild(monthNameDiv);

    // Spacer for better visuals
    const spacer = document.createElement("div");
    spacer.style.marginBottom = "10px";
    calendar.appendChild(spacer);

    // Adding the day names (Sunday to Saturday)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(dayName => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.textContent = dayName;
        dayNameDiv.classList.add("day-name"); // For styling
        calendar.appendChild(dayNameDiv);
    });

    // Calculates days in the current month and first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const currentDate = new Date();

    // Add empty divs for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-day"); // For styling
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

        // Add click event to open the event form
        dayDiv.addEventListener('click', function () {
            openEventForm(day, month, year);
        });

        calendar.appendChild(dayDiv);
    }
}

// Function to display the event form
function openEventForm(day, month, year) {
    const eventForm = document.getElementById("EventForm");
    eventForm.style.display = "block";
    document.getElementById("eventday").value = day;
    document.getElementById("eventmonth").value = month;
    document.getElementById("eventyear").value = year;
}

// Function to change the background based on the month
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

// Main: Initialize the calendar on page load using the dom content loaded.
document.addEventListener('DOMContentLoaded', function () {
    const date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    createCalendar(currentMonth, currentYear);
    changeBackground(currentMonth);

    // Adding the navigation buttons to the page
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

    // Event form submission implementing the server logic here 
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const eventData = {
                Title: document.getElementById("EventTitle").value,
                Description: document.getElementById("EventDescription").value,
                Start_Date: document.getElementById("StartDate").value,
                End_Date: document.getElementById("EndDate").value
            };

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
                })
                .catch(error => console.error("Error adding event:", error))
                .finally(() => {
                    eventForm.reset(); // Reset form fields
                });
        });
    }
});
