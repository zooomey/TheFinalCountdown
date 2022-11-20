<<<<<<< HEAD
//  source: https://www.educative.io/answers/how-to-create-a-simple-to-do-list-with-html-css-and-js
let button = document.getElementById("push");
let tasks = document.getElementById("tasks")
let todo = document.getElementById("todo")
=======
let addButton = document.getElementById("push");
let tasks = document.getElementById("tasks");
let taskInput = document.getElementById("taskinput");
let timer = document.getElementById("timer");
let timerTaskName = document.getElementById("timer_task_name");
>>>>>>> 901981b401fbed4ab436ffe57e3048eacd342f72

// Placeholder
let userID = 2;
// For use in timer.js
let taskID;

<<<<<<< HEAD
    else{
        document.querySelector('#todo').innerHTML += `
            <div class="task" draggable="true">
                <span id="taskname">
                    ${document.querySelector('#newtask input').value}
                </span>
                <button class="delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;

        //TODO: get rid of innerHTML
=======
function refreshTaskList() {
    fetch("/search/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userID
        })
    }).then((response) => {
        if (response.status === 200) {
            response.json().then((body) => {
                while (tasks.firstChild) {
                    tasks.firstChild.remove();
                }
                for (task of body.rows) {
                    if (!task.completed && !task.abandoned) {
                        let taskDiv = document.createElement("div");
                        taskDiv.className = "task";
                        let taskName = document.createElement("span");
                        taskName.textContent = task.taskname;
                        taskDiv.appendChild(taskName);
                        taskDiv.id = task.taskid;
                        let startButton = document.createElement("button");
                        startButton.textContent = "Start";
                        taskDiv.appendChild(startButton);
                        startButton.addEventListener("click", () => {
                            taskID = startButton.parentElement.id;
                            timerTaskName.textContent = taskName.textContent;
                            // Defined in timer.js
                            hourInput.value = "";
                            minuteInput.value = "25";
                            secondInput.value = "00";
                            timer.style.display = "block";
                        });
                        let abandonButton = document.createElement("button");
                        abandonButton.textContent = "Abandon";
                        taskDiv.appendChild(abandonButton);
                        abandonButton.addEventListener("click", () => {
                            fetch("/close_task", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    taskID: abandonButton.parentElement.id,
                                    status: "abandoned"
                                })
                            }).then((response) => {
                                if (response.status === 200) {
                                    refreshTaskList();
                                } else {
                                    // Error
                                }
                            });
                        });
                        let deleteButton = document.createElement("button");
                        deleteButton.textContent = "Delete";
                        taskDiv.appendChild(deleteButton);
                        deleteButton.addEventListener("click", () => {
                            fetch("/delete_task", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    taskID: deleteButton.parentElement.id
                                })
                            }).then((response) => {
                                if (response.status === 200) {
                                    refreshTaskList();
                                } else {
                                    // Error
                                }
                            });
                        });
                        tasks.appendChild(taskDiv);
                    }
                }
            });
        } else {
            // Error
        }
    })
}
>>>>>>> 901981b401fbed4ab436ffe57e3048eacd342f72

refreshTaskList();

addButton.addEventListener("click", () => {
    if (taskInput.value.length === 0) {
        alert("Enter A Task Name!");
    } else if (taskInput.value.length > 40) {
        alert("Enter A Shorter Task Name!");
    } else {
        fetch("/add_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: userID,
                taskname: taskInput.value,
                description: ""
            })
        }).then((response) => {
            if (response.status === 200) {
                taskInput.value = "";
                refreshTaskList();
            } else {
                // Error
            }
        })
    }
});
