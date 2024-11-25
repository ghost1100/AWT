let currentMonth; // Declare in global scope
let currentYear; 

function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

function createCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const monthNameDiv = document.createElement("div");
    monthNameDiv.textContent = getMonthName(month) + " " + year;
    calendar.appendChild(monthNameDiv);
//trying to add a line space between month name and the table will come back to this later!!
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(dayName => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.textContent = dayName;
        calendar.appendChild(dayNameDiv);
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Create empty divs for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        calendar.appendChild(emptyDiv);
    }

    // Create day divs for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;

        if (day === currentDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
            dayDiv.classList.add("current-day");
        }

        // Add click event listener to open event form
        dayDiv.addEventListener('click', function () {
            OpenEventForm(day, month, year);
        });

        calendar.appendChild(dayDiv);
    }
}

function OpenEventForm(day, month, year) {
    const eventForm = document.getElementById("EventForm");
    eventForm.style.display = "block";
    document.getElementById("eventday").value = day;
    document.getElementById("eventmonth").value = month;
    document.getElementById("eventyear").value = year;
}

function ChangeBackground(month) {
    const seasons = ["Winter", "Spring", "Summer", "Autumn"];
    const season = seasons[Math.floor(month / 3)];

    fetch(`/get_random_image?query=${season}`)
        .then(response => {
            console.log(`Fetch Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.image_url) {
                document.body.classList.add('transition');
                const img = new Image();
                img.src = data.image_url;
                img.onload = () => {
                    document.body.style.backgroundImage = `url(${data.image_url})`;
                };
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
            } else {
                console.error("Unable to fetch image.");
            }
        })
        .catch(error => console.error("Error:", error));
}

function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    createCalendar(currentMonth, currentYear);
    ChangeBackground(currentMonth);
}

function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentMonth, currentYear);
    ChangeBackground(currentMonth);
}

document.addEventListener('DOMContentLoaded', function () {
    const date = new Date();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    createCalendar(currentMonth, currentYear);
    ChangeBackground(currentMonth);

    // Create navigation buttons
    const calendar = document.getElementById("calendar");

    // Create Previous Month Button
    const prevButton = document.createElement('button');
    prevButton.textContent = '<- Previous Month';
    prevButton.addEventListener('click', showPreviousMonth);
    document.body.appendChild(prevButton); 
    prevButton.classList.add('nav-button');
    prevButton.style.margin = '10px';  
    prevButton.style.display = 'block'; 

    // Create Next Month Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Month ->';
    nextButton.addEventListener('click', showNextMonth);
    document.body.appendChild(nextButton); 
    nextButton.classList.add('nav-button');
    nextButton.style.margin = '10px';  
    nextButton.style.display = 'block'; 

    // Close Button
    const closeButton = document.querySelector('.CloseButton');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            const eventForm = document.getElementById("EventForm");
            if (eventForm) {
                eventForm.style.display = "none";
            }


            //Create Eventlistener for Form Submisson
            document.getElementById('eventForm').addEventListener("submit",function(event){
                event.preventDefault();
                //Collecting the data from the form
                const EventTitle = document.getElementById("EventTitle").value;
                const EventDescription = document.getElementById("EventDescription").value
                const StartDate = document.getElementById("StartDate").value;
                const EndDate = document.getElementById("EndDate").value;

                //Creating an object to send it to the back end.. app.py
                const Event = {
                    "Title": EventTitle,
                    "Description": EventDescription,
                    "Start_Date": StartDate,
                    "End_Date": EndDate
                };
                //Sending the data to the backend using fetch API
                fetch('/add_event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(Event)
                        })
                        .then(data =>{
                            console.log("Event Saved Successfully: ",data)
                        .then(response => response.json())
                        .then(data => console.log("Resonse From Server: ",data))
                        .catch(error => console.error('Error: ', error))
                        .finally(() => {
                            // Clear the form fields after submission
                            document.getElementById("EventTitle").value = "";
                            document.getElementById("EventDescription").value = "";
                            document.getElementById("StartDate").value = "";
                            document.getElementById("EndDate").value = "";
                            });

            })
        });
          }
        )}
    
    });
