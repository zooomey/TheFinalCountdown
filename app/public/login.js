let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let result = document.getElementById("result");
let login = document.getElementById("login");
let create = document.getElementById("create");

login.addEventListener("click", () => {
	fetch("/signin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: usernameInput.value,
			plaintextPassword: passwordInput.value,
		})
	}).then((response) => response.json())
		.then((data) => {
			if (data.status === 200) {
				var username = data.username;
				result.textContent = "Login successful. Welcome " + username + "!";
				result.classList.remove("error");
				console.log("Login successful. Welcome ", data.username);
			} else {
				result.textContent = "Login failed";
				result.classList.add("error");
			}
		}).catch(error => {
			console.log(error);
		});
});

/*
//placeholder for function to redirect to dashboard page after user signed-in

create.addEventListener("click", () => {
	fetch("/create").then(response => {

	})
	.catch(error => {
		console.log(error);
	});
});
*/
