//  source: https://www.educative.io/answers/how-to-create-a-simple-to-do-list-with-html-css-and-js
let button = document.getElementById("push");
let tasks = document.getElementById("tasks");

button.addEventListener("click", () => {
    if(document.querySelector('#newtask input').value.length == 0){
        alert("Enter A Task Name!");
    }

    else{
        document.querySelector('#tasks').innerHTML += `
            <div class="task">
                <span id="taskname">
                    ${document.querySelector('#newtask input').value}
                </span>
                <span id="estimate">
                    ${document.querySelector('#newtask select').value}
                </span>
                <button class="delete" id="deletebutton">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;

        //TODO: get rid of innerHTML
        //deleting tasks

        fetch("/add_task", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
                userid : username,// get username
                taskname : document.querySelector('#newtask input').value,
                description : "test", // do we need descriptions?
                total : 0,
                estimate: 0,
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data.status === 200) {
                    console.log("Task addition successful.");
				} else {
                    console.log("Task addition failed");
				}
			}).catch(error => {
				console.log(error);
			});

        var current_tasks = document.querySelectorAll(".delete");
        for(var i=0; i<current_tasks.length; i++){
            current_tasks[i].onclick = function(){
                this.parentNode.remove();
            }
        }
    }

});
