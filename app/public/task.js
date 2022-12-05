let addButton = document.getElementById("push");
let tasks = document.getElementById("tasks");
let taskNameInput = document.getElementById("task_name");
let taskDescInput = document.getElementById("task_desc");
let timer = document.getElementById("timer");
let timerTaskName = document.getElementById("timer_task_name");
let estimateInput = document.getElementById("estimate");
let tasksError = document.getElementById("add_tasks_error");

// For use in timer.js
let taskID;

//console.log("ID: ", cookie.id);
//console.log("COOKIE: ", cookie.cookie);

function refreshTaskList() {
    tasksError.style.display = "none";
    fetch("/search/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: cookie.id,
            cookie: cookie.cookie
        })
    }).then((response) => {
        if (response.status === 200) {
            response.json().then((body) => {
                while (tasks.firstChild) {
                    tasks.firstChild.remove();
                }
                for (task of body.rows) {
                    if (!task.abandoned) {//task.inprogress) {
                        let taskDiv = document.createElement("div");
                        taskDiv.className = "task";
                        let taskName = document.createElement("span");
                        taskName.textContent = task.taskname;
                        taskName.setAttribute("style", "font-weight: bold");
                        taskDiv.appendChild(taskName);
                        let taskDescription = document.createElement("span");
                        taskDiv.appendChild(taskDescription);
                        taskDescription.textContent = " : " + task.description;
                        taskDiv.id = task.taskid;
                        let startButton = document.createElement("button");
                        startButton.textContent = "Start";
                        startButton.style.marginLeft = "auto";
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
                        abandonButton.textContent = "X";
                        abandonButton.style.marginLeft = "20px";
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
                                    tasksError.style.display = "inline";
                                }
                            });
                        });
                        tasks.appendChild(taskDiv);
                    }
                }
            });
        } else {
            tasksError.style.display = "inline";
        }
    })
}

if (alreadySignedIn) {
    refreshTaskList();
} else {
    document.getElementById("addtasks").style.display = "none";
}

addButton.addEventListener("click", () => {
    if (taskNameInput.value.length === 0) {
        alert("Enter A Task Name!");
    } else if (taskNameInput.value.length > 40) {
        alert("Enter A Shorter Task Name!");
    } else {
        fetch("/add_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: cookie.id,
                taskname: taskNameInput.value,
                description: taskDescInput.value,
                estimate: estimateInput.value,
                cookie: cookie.cookie
            })
        }).then((response) => {
            if (response.status === 200) {
                taskNameInput.value = "";
                taskDescInput.value = "";
                refreshTaskList();
                refreshKanban();
                refreshReport();
            } else {
                tasksError.style.display = "inline";
            }
        }).catch((error) => {
            tasksError.style.display = "inline";
        })
    }
});
