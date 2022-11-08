let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
//let task1 = document.getElementById("task1");
//let days = document.getElementById("estimate_days");
//let hrs = document.getElementById("estimate_hrs");
//let mins = document.getElementById("estimate_mins");

let result = document.getElementById("result");

document.getElementById("create").addEventListener("click", () => {

	//let estimate = {"days": days.value, "hrs": hrs.value, "mins": mins.value};
	//let data = {"task name": task1.value, "estimate": estimate, "total-work-hrs": 0, "completed": false};

	fetch("/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: usernameInput.value,
			plaintextPassword: passwordInput.value
		})
	}).then((response) => {
		if (response.status === 200) {
			result.textContent = "Account was created";
			result.classList.remove("error");
		} else {
			result.textContent = "Account creation failed";
			result.classList.add("error");
		}
	});
});
