// Defining addTask globally
function addTask() {
    const inputBox = document.getElementById("input-box");
    const listContainer = document.getElementById("list-container");

    if (!inputBox.value.trim()) {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");
    li.textContent = inputBox.value;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);

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
