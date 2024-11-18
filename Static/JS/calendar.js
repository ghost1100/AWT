function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}
function createCalendar(month, year) {
    const calendar = document.getElementById("calendar")
    calendar.innerHTML = "";
    const monthNameDiv = document.createElement("div");
    monthNameDiv.textContent = getMonthName(month) + " " + year;
    calendar.appendChild(monthNameDiv);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(dayName => {
        const dayNameDiv = document.createElement("div");
        dayNameDiv.textContent = dayName;
        calendar.appendChild(dayNameDiv);
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const currentDate = new Date(); // Get the current date
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

        if (day == currentDay && month == currentDate.getMonth() && year === currentDate.getFullYear()) {
            dayDiv.classList.add("current-day"); // Add a class for the current day
        }

        // Add click event listener to open event form
        dayDiv.addEventListener('click', function() {
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

document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    createCalendar(currentMonth, currentYear);

    // Add close button event listener
    document.querySelector('.CloseButton').addEventListener('click', function() {
        const eventForm = document.getElementById("EventForm");
        eventForm.style.display = "none";
    });
});



function ChangeBackground(month){
    const seasons = ["Winter", "Spring", "Summer", "Autumn"];
    const season = seasons[Math.floor(month/3)];
    fetch('/get_random_image?query=${season}')
    .then(response =>{
        console.log(`Fetch Status: ${response.status}`); // Log status code
        return response.json();
    })
    .then(data => {
        if(data.image_url){
            document.body.classList.add('transition');
            if (data.image_url){
                const img = new Image();
                img.src = data.image_url;
                img.onload = () => {
                    document.body.style.backgroundImage = `url(${data.image_url})`;
                }
            }
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
        }
        else{
            console.error("Unabe to fetch image, Smoke Break!!")
        }

        })
        .catch(error => console.error("Error:",error));
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


function FetchEvents(){
    fetch('/get_calendar_events')
    .then(response => response.json())
    .then(data => {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = "";
        data.forEach(title => {
            const event = document.createElement('div');
            event.textContent = title;
            calendar.appendChild(event);
});  
})
.catch(error => console.error('Error Fetching Title:', error) )
}
window.onload = fetchEvents;
function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentMonth, currentYear);
}

const prevButton = document.createElement('button');
prevButton.textContent = '< Last Month';
prevButton.addEventListener('click', showPreviousMonth,ChangeBackground);
document.body.insertBefore(prevButton, calendar);
prevButton.classList.add('nav-button');

const nextButton = document.createElement('button');
nextButton.textContent = ' Next Month >';

nextButton.addEventListener('click', showNextMonth,ChangeBackground);
nextButton.addEventListener('click',ChangeBackground)
document.body.insertBefore(nextButton, calendar);
nextButton.classList.add('nav-button');

let currentMonth; // Declare currentMonth in the global scope
let currentYear;  // Declare currentYear in the global scope

document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    currentMonth = date.getMonth(); // Initialize currentMonth
    currentYear = date.getFullYear(); // Initialize currentYear

    createCalendar(currentMonth, currentYear);
ChangeBackground(currentMonth);
    // Add close button event listener
    document.querySelector('.CloseButton').addEventListener('click', function() {
        const eventForm = document.getElementById("EventForm");
        eventForm.style.display = "none";
   
   
   
        const form = document.getElementById("EventForm");
        const CloseButton = document.getElementById("CloseButton");
    
        fetchEvents();
    
        form.addEventListener("submit", function(event){
            event.preventDefault();
    
            const title = document.getElementById("EventTitle").value;
            const description = document.getElementById("EventDescription").value;
            const startdate = document.getElementById("StartDate").value;
            const enddate = document.getElementById("EndDate").value;
            if(!title || !startdate){
                alert("Please fill in all fields");
            }
                });             
    });

});

