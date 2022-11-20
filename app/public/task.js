//  source: https://www.educative.io/answers/how-to-create-a-simple-to-do-list-with-html-css-and-js
let button = document.getElementById("push");
let tasks = document.getElementById("tasks")
let todo = document.getElementById("todo")

button.addEventListener("click", () => {
    if(document.querySelector('#newtask input').value.length == 0){
        alert("Enter A Task Name!");
    }

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

        //deleting tasks

        var current_tasks = document.querySelectorAll(".delete");
        for(var i=0; i<current_tasks.length; i++){
            current_tasks[i].onclick = function(){
                this.parentNode.remove();
            }
        }
    }

});
