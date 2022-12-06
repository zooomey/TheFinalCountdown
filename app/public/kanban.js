
function refreshKanban() {
  if (cookie){
    fetch("/search/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userid: cookie.id,
				cookie: cookie.cookie
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data.status === 200) {
          let abandoned = document.getElementById('1');
          abandoned.textContent = "";
          let todo = document.getElementById('2');
          todo.textContent = "";
          let inprogress = document.getElementById('3')
          inprogress.textContent = "";
          let completed = document.getElementById('4')
          completed.textContent = "";

          // INSERT TASKS INTO TO-DO / IN-PROGRESS / COMPLETED DIVS
          for (task of data.rows) {
            if(task.abandoned){
              var li = document.createElement("li");
              var x = abandoned.appendChild(li);
              li.setAttribute("class", "drag-item " + task.taskid + " abandoned");
            }
            else if(task.inprogress) {
              var li = document.createElement("li");
              var x = inprogress.appendChild(li);
              li.setAttribute("class", "drag-item " + task.taskid + " inprogress");
            }
            else if(task.completed) {
              var li = document.createElement("li");
              var x = completed.appendChild(li);
              li.setAttribute("class", "drag-item " + task.taskid + " completed");
            }
            else {
              var li = document.createElement("li");
              var x = todo.appendChild(li);
              li.setAttribute("class", "drag-item " + task.taskid + " todo");
            }

            var table = document.createElement("table");
            var task_box = x.appendChild(table);
            task_box.setAttribute("width", "100%");
            var task_box_row = task_box.insertRow(0);
            var task_box_name = task_box_row.insertCell(0);
            var task_box_delete = task_box_row.insertCell(1);
            task_box_name.textContent = task.taskname;
            var img = document.createElement("img");
            task_box_delete.appendChild(img);
            task_box_delete.setAttribute("style", "text-align: right");
            img.setAttribute("src", "img/delete.png");
            img.setAttribute("class", "delete_img");
            img.setAttribute("onclick", "delete_task(" + task.taskid + ");");
            x.setAttribute("id", task.taskid);
          }
        }
        else {
          console.log("status: ", data.status);
        }
      });
  }
}

dragula([
  document.getElementById('1'),
  document.getElementById('2'),
  document.getElementById('3'),
  document.getElementById('4')
])

.on('drag', function(el) {
  // add 'is-moving' class to element being dragged
  el.classList.add('is-moving');
})
.on('dragend', function(el) {
  // remove 'is-moving' class from element after dragging has stopped
  el.classList.remove('is-moving');
  // add the 'is-moved' class for 600ms then remove it
  window.setTimeout(function() {
    el.classList.add('is-moved');
    //console.log("MOVED : taskid ", el.classList[1], " status: ", el.parentElement.id); //taskid
    fetch("/update_tasks", { //send updates
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userid: cookie.id,
        cookie: cookie.cookie,
        taskid: el.classList[1],
        status: el.parentElement.id
      })
    }).then((response) => {
        refreshReport();
        refreshTaskList();
      });

    window.setTimeout(function() {
      el.classList.remove('is-moved');
    }, 600);
  }, 100);
});

if (alreadySignedIn) {
    refreshKanban();
}

function delete_task(taskID){
  fetch("/delete_task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userid: cookie.id,
      cookie: cookie.cookie,
      taskid: taskID
    })
  }).then((response) => {
      refreshReport();
      refreshTaskList();
      refreshKanban();
    });
}
