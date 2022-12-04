//let userID = document.getElementById("userid");
let button = document.getElementById("generate");
let test = document.getElementById("test");
let id;

if (document.cookie){
	var cookie = document.cookie;
	var name = cookie.replace('session=', '');
	cookie = JSON.parse(name);
	name = cookie.username;
	id = cookie.id;

	userID.textContent = name; // change header
}

button.addEventListener("click", () => {
		var data = {"userid": id};
		button.remove();

    fetch("/search/tasks", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((response) => response.json())
			.then((data) => { //get TASKS
				var num = data.rows.length;
				var report = document.getElementById("report");

				if(num == 0){
					report_title.textContent = "We can't generate a report if there's no user data! Try again after you get some work done. "
				}
				else{
					alert("blehhhh");
				}

				if (num > 0)
				{
					report_title.textContent = "Tasks:";

					for (var i=0; i < num; i++)
					{
						var div = document.createElement("div");
						var table = document.createElement("table");

						var newDiv = report.appendChild(div);
						var newtable = div.appendChild(table);
						newtable.setAttribute("id", i);
						var name = table.insertRow(0);
						var taskname = name.insertCell(0);
						taskname.textContent = "Task Name: ";
						var name_text = name.insertCell(1);
						name_text.textContent = data.rows[i].taskname;

						var descrip = table.insertRow(1);
						var descrip_text = descrip.insertCell(0);
						descrip_text.textContent = "Description: ";
						var description_text = descrip.insertCell(1);
						description_text.textContent = data.rows[i].description;

						var hours = table.insertRow(2);
						var workhours = hours.insertCell(0);
						workhours.textContent = "Description: ";
						var hours_text = hours.insertCell(1);
						hours_text.textContent = data.rows[i].total;

						var complete = table.insertRow(3);
						var completed_status = complete.insertCell(0);
						completed_status.textContent = "Completed Status: ";
						var complete_text = complete.insertCell(1);
						complete_text.textContent = data.rows[i].completed;

						var abandoned = table.insertRow(4);
						var abandoned_status = abandoned.insertCell(0);
						abandoned_status.textContent = "Abandoned Status: ";
						var abandoned_text = abandoned.insertCell(1);
						abandoned_text.textContent = data.rows[i].abandoned;
					}
				}
			}).catch ((error) => {
				console.log(error); //fetch crashed*/
		});

		fetch("/search/sessions", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((response) => response.json())
				.then((data) => { //get SESSIONS
					var num = data.rows.length;
					var sessions = document.getElementById("sessions");

					if (num > 0)
					{
						sessions_title.textContent = "Sessions:";

						for (var i=0; i < num; i++)
						{
							var div = document.createElement("div");
							var table = document.createElement("table");

							var newDiv = sessions.appendChild(div);
							var newtable = newDiv.appendChild(table);
							newtable.setAttribute("id", "session_" + i);

							var date = newtable.insertRow(0);
							var session_date = date.insertCell(0);
							session_date.textContent = "Session Date: ";
							var session_timestamp = date.insertCell(1);
							session_timestamp.textContent = data.rows[i].finished;

							var total = newtable.insertRow(1);
							var total_hrs = total.insertCell(0);
							total_hrs.textContent = "Total Work Hours: ";
							// TEMPORARY display in hours
							var total_in_hrs = total.insertCell(1);
							var total_in_secs = parseInt(data.rows[i].finished);
							var total_hrs = ((total_in_secs / 60) / 60);
							total_in_hrs.textContent = total_hrs;
						}
					}

				}).catch ((error) => {
					console.log(error); //fetch crashed*/
			});
});
