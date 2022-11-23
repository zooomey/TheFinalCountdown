let todo = document.getElementById("todo");
let inprogress = document.getElementById("inprogress");
let done = document.getElementById("done");

  if (userID){
    fetch("/search/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userid: userID,
				cookie: cookie.cookie
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data.status === 200) {
					//console.log(data.rows[0]);

          // INSERT TASKS INTO TO-DO / IN-PROGRESS / COMPLETED DIVS

        }
        else {
          //console.log("status: ", data.status);
        }
      });
  }
