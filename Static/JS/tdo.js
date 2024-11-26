// Defining addTask globally
function addTask() {
    const inputBox = document.getElementById("input-box");
    const dueDateInput = document.getElementById("due-date-picker");
    const listContainer = document.getElementById("list-container");

const task = inputBox.value.trim(); // idk if this is neceseray
const dueDate = dueDateInput.value;

    if (!inputBox.value.trim()) {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");
    if (!dueDate){
        li.textContent = inputBox.value;
    }else{
        li.textContent = inputBox.value +"\n DueDate: "+ dueDate;
    }
    let span = document.createElement("span");
    span.innerHTML = "\u00d7" + " ";
    li.appendChild(span);

    listContainer.appendChild(li);
    dueDateInput.value="";
    inputBox.value = "";
    saveData();
}

// Save and load functions inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById("list-container");

    function saveData() {
        localStorage.setItem("data", listContainer.innerHTML);
    }

    function showTask() {
        listContainer.innerHTML = localStorage.getItem("data") || "";
    }

    showTask();

    listContainer.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
            saveData();
        }
    });
});
