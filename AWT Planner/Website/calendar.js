function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}
function createCalendar(month, year){
const calendar = document.getElementById("calendar")
calendar.innerHTML = "";
const monthNameDiv = document.createElement("div");
    monthNameDiv.textContent = getMonthName(month) + " " + year;
    calendar.appendChild(monthNameDiv);

const daysInMonth =new Date(year, month + 1, 0  ).getDate();
const firstDay = new Date(year, month, 1).getDay();
const currentDate = new Date(); // Get the current date
const currentDay = currentDate.getDate();
//const lastDay = new Date(year, month, daysInMonth).getDay();
//const weeks = Math.ceil((firstDay + daysInMonth) / 7);
for  (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendar.appendChild(emptyDiv);

}
for   (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;
    if (day === currentDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
        dayDiv.classList.add("current-day"); // Add a class for the current day
 }
    
    dayDiv.addEventListener('click', () => {
        const event = prompt('Enter an event for ' + day + '/' + (month + 1) + '/' + year);
        if (event) {
            alert('Event for ' + day + '/' + (month + 1) + '/' + year + ': ' + event);
        
        }
    });
    calendar.appendChild(dayDiv);

} 

}

const date = new Date();
createCalendar(date.getMonth(), date.getFullYear());
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    createCalendar(currentMonth, currentYear);
}

function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentMonth, currentYear);
}

// adds in the buttons to navigate months works well.
const prevButton = document.createElement('button');
prevButton.textContent = '<';
prevButton.addEventListener('click', showPreviousMonth);
document.body.insertBefore(prevButton, calendar);

const nextButton = document.createElement('button');
nextButton.textContent = '>';
nextButton.addEventListener('click', showNextMonth);
document.body.insertBefore(nextButton, calendar);

