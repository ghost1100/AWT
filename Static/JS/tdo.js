// Defining addTask globally
function addTask() {
    const inputBox = document.getElementById("input-box");
    const dueDateInput = document.getElementById("due-date-picker");
    const listContainer = document.getElementById("list-container");

    const task = inputBox.value.trim(); // Ensure task text is not empty
    const dueDate = dueDateInput.value;

    if (!task) {
        alert("Please enter a task");
        return;
    }



    //preparing the tasks for the API.
    const taskData = {
        Description: task,
        DueDate: dueDate || null,
        Status: false // Default status is Unchecked
    };




    // Saving tasks to DB.
    fetch('/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Event added successfully") {
                inputBox.value = "";
                dueDateInput.value = "";
                loadTasks(); // Reload tasks after adding
            } else {
                console.error(data.error || "Failed to add task");
            }
        })
        .catch(err => console.error("Error:", err));
}






// Save and load functions inside DOMContentLoaded problem with this is that page needs to be refreshed before showing the added tasks...
document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById("list-container");

    function loadTasks() {
        // Get tasks from flask
        fetch('/show_task')
            .then(response => response.json())
            .then(tasks => {
                listContainer.innerHTML = ""; // Clear current tasks or tasks that are already added 
                tasks.forEach(task => {
                    let li = document.createElement("li");
                    li.textContent = task.Description + (task.DueDate ? `\n DueDate: ${task.DueDate}` : "");
                    li.dataset.id = task.TaskID; // Store TaskID for reference
                    if (task.Status) {
                        li.classList.add("checked");
                    }

                    let span = document.createElement("span");
                    span.innerHTML = "\u00d7" + " ";
                    li.appendChild(span);

                    listContainer.appendChild(li);
                });
            })
            .catch(err => console.error("Error loading tasks:", err));
    }

    listContainer.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            const li = e.target;
            const taskId = li.dataset.id;
            const newStatus = !li.classList.contains("checked");

            // Update task status in the backend
            fetch('/update_task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ TaskID: taskId, Status: newStatus })
                
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Task updated successfully") {
                        li.classList.toggle("checked");
                    } else {
                        console.error(data.error || "Failed to update task");
                    }
                })
                .catch(err => console.error("Error:", err));
        } else if (e.target.tagName === "SPAN") {
            const li = e.target.parentElement;
            const taskId = li.dataset.id;

            // Delete task from the backend
            fetch('/delete_task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ TaskID: taskId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Task deleted successfully") {
                        li.remove();
                    } else {
                        console.error(data.error || "Failed to delete task");
                    }
                })
                .catch(err => console.error("Error:", err));
        }
    });

    loadTasks(); // Load tasks on page reload
});

// Added a function to handle errors
function handleError(error) {
    console.error("Error:", error);
}

// Added a function to handle successful responses
function handleSuccess(data) {
    if (data.message === "Event added successfully") {
        const inputBox = document.getElementById("input-box");
        const dueDateInput = document.getElementById("due-date-picker");
        inputBox.value = "";
        dueDateInput.value = "";
        loadTasks(); // Reload tasks after adding
    } else {
        console.error(data.error || "Failed to add task");
    }
}

// Modified the addTask function to use the new functions
function addTask() {
    const inputBox = document.getElementById("input-box");
    const dueDateInput = document.getElementById("due-date-picker");
    const listContainer = document.getElementById("list-container");

    const task = inputBox.value.trim(); // Ensure task text is not empty
    const dueDate = dueDateInput.value;

    if (!task) {
        alert("Please enter a task");
        return;
    }

    // Prepare task data for API
    const taskData = {
        Description: task,
        DueDate: dueDate || null,
        Status: false // Default status is unchecked
    };

    // API call to save task to the database
    fetch('/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => handleSuccess(data))
        .catch(err => handleError(err));
}