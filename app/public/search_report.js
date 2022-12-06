let task_report = document.getElementById("task_report");
let session_report = document.getElementById("session_report");
let totals_estimate = document.getElementById("totals_estimate");
let totals_work = document.getElementById("totals_work");

let total_time, estimate_seconds, work_seconds;

function refreshReport(){
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
					task_report.remove();
					session_report.remove();
					div = document.createElement("div");
					task_report = report.appendChild(div);
					session_report = report.appendChild(div);
					task_report.setAttribute("id", "task_report");
					session_report.setAttribute("id", "session_report");
					total_time = 0;
					estimate_seconds = 0;
					work_seconds = 0;
					var abandoned = 0;
					var todo = 0;
					var inprogress = 0;
					var completed = 0;

					//task chart
					var table = document.createElement("table");
					table.setAttribute("width", "100%");

					var row = table.insertRow(0);
					var cell0 = row.insertCell(0);
					var cell1 = row.insertCell(1);
					var cell2 = row.insertCell(2);
					var cell3 = row.insertCell(3);
					task_report.appendChild(table);

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
					var table_cell2 = table_row.insertCell(2);
					table_cell0.textContent = "Task Name";
					table_cell1.textContent = "Estimate";
					table_cell2.textContent = "Total Work Time";
					table_cell0.setAttribute("style", "font-weight: bold");
					table_cell1.setAttribute("style", "font-weight: bold");
					table_cell2.setAttribute("style", "font-weight: bold");

					for (task of data.rows){
						var time_row = time_table.insertRow(2);
						var task_cell = time_row.insertCell(0);
						var estimate_cell = time_row.insertCell(1);
						var time_cell = time_row.insertCell(2);
						var seconds = parseInt(task.total);
						var ConvertedTime = [];
						var ConvertedEstimate = [];
						var ConvertedWork = [];
						var EstimateTask = [];
						var hrs, mins, secs, workhrs, workmins, worksecs;

						ConvertedTime = convertSeconds(seconds);
						hrs = ConvertedTime['hrs'];
						mins = ConvertedTime['mins'];
						secs = ConvertedTime['secs'];

							task_cell.textContent = task.taskname + " ";

							var time_div = document.createElement("div");
							time_cell.appendChild(time_div);
							time_cell.setAttribute("style", "white-space: nowrap");

							var time_width;
							if (total_time === 0 || task.total === "0"){
								time_width = "";
							}
							else {
								time_width = ((task.total / total_time) * 100).toFixed(2);
							}

							if(task.abandoned){
								abandoned++;
								task_cell.setAttribute("style", "background-color: #ea8c8c; padding: 5px; border-radius: 5px 0 0 5px;");
								estimate_cell.setAttribute("style", "background-color: #ea8c8c; padding: 5px; font-style: italic");
								time_div.setAttribute("style", "background-color: #ea8c8c; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
							}
							else if (task.inprogress){
								inprogress++;
								task_cell.setAttribute("style", "background-color: #ffdb5b; padding: 5px; border-radius: 5px 0 0 5px;");
								estimate_cell.setAttribute("style", "background-color: #ffdb5b; padding: 5px; font-style: italic");
								time_div.setAttribute("style", "background-color: #ffdb5b; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
							}
							else if(task.completed) {
								completed++;
								task_cell.setAttribute("style", "background-color: #00B961; padding: 5px; border-radius: 5px 0 0 5px;");
								estimate_cell.setAttribute("style", "background-color: #00B961; padding: 5px; font-style: italic");
								time_div.setAttribute("style", "background-color: #00B961; padding: 5px; border-radius: 0 10px 10px 0; width: " + time_width + "%");
								var star = document.createElement("img");
								task_cell.appendChild(star);
								star.setAttribute("src", "img/star.png");
								star.setAttribute("height", "15px");
							}
							else {
								todo++;
								task_cell.setAttribute("style", "background-color: #8cb8ea; padding: 5px; border-radius: 5px 0 0 5px;");
								estimate_cell.setAttribute("style", "background-color: #8cb8ea; padding: 5px; font-style: italic");
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
							var total = abandoned + todo + inprogress + completed;
							var abandoned_width = ((abandoned / total) * 100).toFixed(1);
							var todo_width = ((todo / total) * 100).toFixed(1);
							var inprogress_width = ((inprogress / total) * 100).toFixed(1);
							var completed_width = ((completed / total) * 100).toFixed(1);
							if (total == 0){
								abandoned_width = 0;
								todo_width = 0;
								inprogress_width = 0;
								completed_width = 0;
							}

							EstimateTask = convertSeconds(Number(task.estimate));
							hrs = EstimateTask['hrs'];
							mins = EstimateTask['mins'];
							secs = EstimateTask['secs'];
							estimate_cell.textContent = hrs + " h : " + mins + " m : " + secs + " s";


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

							estimate_seconds += Number(task.estimate);
							work_seconds += Number(task.total);

					}
					ConvertedEstimate = convertSeconds(estimate_seconds);
					hrs = ConvertedEstimate['hrs'];
					mins = ConvertedEstimate['mins'];
					secs = ConvertedEstimate['secs'];

					totals_estimate.textContent = hrs + " h : " + mins + " m : " + secs + " s";

					ConvertedWork = convertSeconds(work_seconds);
					hrs = ConvertedWork['hrs'];
					mins = ConvertedWork['mins'];
					secs = ConvertedWork['secs'];

					totals_work.textContent = hrs + " h : " + mins + " m : " + secs + " s";
				}
			}).catch ((error) => {
				console.log(error); //fetch crashed
		});
	}
}

if (alreadySignedIn) {
    refreshReport();
}

function convertSeconds(seconds){
	var ConvertedTime = new Object();

	ConvertedTime['hrs'] = Math.floor(seconds / 3600);
	ConvertedTime['mins'] = Math.floor((seconds % 3600) / 60);
	ConvertedTime['secs'] = seconds % 60;

	return ConvertedTime;
}
