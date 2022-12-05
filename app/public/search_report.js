let task_report = document.getElementById("task_report");
let session_report = document.getElementById("session_report");

let total_time = 0;

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
				var abandoned = 0;
				var todo = 0;
				var inprogress = 0;
				var completed = 0;

				//task time chart
				var time_table = document.createElement("table");
				time_table.setAttribute("width", "100%");
				session_report.appendChild(time_table);
				for (time of data.rows){total_time += parseInt(time.total);}

				var spacer = time_table.insertRow(0);
				var spacer_cell = spacer.insertCell(0);
				spacer_cell.setAttribute("style", "padding: 15px");

				var table_row = time_table.insertRow(1);
				var table_cell0 = table_row.insertCell(0);
				var table_cell1 = table_row.insertCell(1);
				table_cell0.textContent = "Task Name";
				table_cell1.textContent = "Total Work Time";
				table_cell0.setAttribute("style", "font-weight: bold");
				table_cell1.setAttribute("style", "font-weight: bold");

				for (task of data.rows){
					var time_row = time_table.insertRow(2);
					var task_cell = time_row.insertCell(0);
					var time_cell = time_row.insertCell(1);
					var seconds = parseInt(task.total);
					var hrs, mins, secs;

					if (seconds < 60){
						hrs = 0;
						mins = 0;
						secs = seconds;
					}
					else if (seconds < 3600){
						hrs = 0;
						mins = Math.round(seconds / 60);
						secs = seconds - (mins * 60);
					}
					else{
						hrs = Math.round(seconds / 3600);
						mins = Math.round((seconds - (hrs * 3600)) / 60);
						secs = seconds - (mins * 60);
					}

						task_cell.textContent = task.taskname;
						var time_div = document.createElement("div");
						time_cell.appendChild(time_div);

						var time_width;
						if (total_time === 0 || task.total === "0"){
							time_width = "";
						}
						else {
							time_width = Math.round((task.total / total_time) * 100);
						}

						if(task.abandoned){
							abandoned++;
							task_cell.setAttribute("style", "background-color: #ea8c8c; padding: 5px; border-radius: 5px 0 0 5px;");
							time_div.setAttribute("style", "background-color: #ea8c8c; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
						}
						else if (task.inprogress){
							inprogress = 0;
							task_cell.setAttribute("style", "background-color: #ffdb5b; padding: 5px; border-radius: 5px 0 0 5px;");
							time_div.setAttribute("style", "background-color: #ffdb5b; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
						}
						else if(task.completed) {
							completed++;
							task_cell.setAttribute("style", "background-color: #00B961; padding: 5px; border-radius: 5px 0 0 5px;");
							time_div.setAttribute("style", "background-color: #00B961; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
						}
						else {
							todo++;
							task_cell.setAttribute("style", "background-color: #8cb8ea; padding: 5px; border-radius: 5px 0 0 5px;");
							time_div.setAttribute("style", "background-color: #8cb8ea; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
						}

						var time_div_table = document.createElement("table");
						time_div.appendChild(time_div_table);

						var time_div_table_row = time_div_table.insertRow(0);
						var time_div_table_cell0 = time_div_table_row.insertCell(0);
						var time_div_table_cell1 = time_div_table_row.insertCell(1);
						time_div_table.setAttribute("width", "100%");
						time_div_table_cell0.textContent = hrs + " h : " + mins + " m : " + secs + " s";
						time_div_table_cell1.textContent = " (" + time_width + "%)";
						time_div_table_cell1.setAttribute("style", "text-align: right; font-style: italic");
						if (time_width == ""){
							time_div.setAttribute("style", "background-color: #fff; padding: 5px");
							time_div_table_cell1.textContent = "";
						}

				}
				//task chart
				var table = document.createElement("table");
				table.setAttribute("width", "100%");

				var row = table.insertRow(0);
				var cell0 = row.insertCell(0);
				var cell1 = row.insertCell(1);
				var cell2 = row.insertCell(2);
				var cell3 = row.insertCell(3);
				task_report.appendChild(table);

				var total = abandoned + todo + inprogress + completed;
				var abandoned_width = Math.round((abandoned / total) * 100);
				var todo_width = Math.round((todo / total) * 100);
				var inprogress_width = Math.round((inprogress / total) * 100);
				var completed_width = Math.round((completed / total) * 100);

				cell0.textContent = abandoned_width + "% Abandoned";
				cell0.setAttribute("width", abandoned_width + "%");
				cell0.setAttribute("style", "background-color: #ea8c8c; border-radius: 10px 0px 0px 10px; padding: 10px; font-weight: bold");

				cell1.textContent = todo_width + "% To-Do";
				cell1.setAttribute("width", todo_width + "%");
				cell1.setAttribute("style", "background-color: #8cb8ea; padding: 10px; font-weight: bold");

				cell2.textContent = inprogress_width + "% In-Progress";
				cell2.setAttribute("width", inprogress_width + "%");
				cell2.setAttribute("style", "background-color: #ffdb5b; padding: 10px; font-weight: bold");

				cell3.textContent = completed_width + "% Completed";
				cell3.setAttribute("width", completed_width + "%");
				cell3.setAttribute("style", "background-color: #00B961; border-radius: 0px 10px 10px 0px; padding: 10px; font-weight: bold");

			}
		}).catch ((error) => {
			console.log(error); //fetch crashed
	});
}
