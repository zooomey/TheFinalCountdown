let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let result = document.getElementById("result");
let login = document.getElementById("login_button");
let nav = document.getElementById("SIGNIN");
let create = document.getElementById("create");
let swap_nav = document.getElementById("swap_nav");
let login_nav_text = document.getElementById("login_nav_text");

login.addEventListener("click", () => {

	if(swap_nav.className === "create_nav")
	{
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
					nav.textContent = "Welcome to The Final Countdown " + username + "!";
					result.classList.remove("error");
					console.log("Login successful. Welcome ", data.username);
				} else {
					result.textContent = "Login failed";
					result.classList.add("error");
				}
			}).catch(error => {
				console.log(error);
			});
	}

	else if (swap_nav.className === "login_nav")
	{
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
				login_nav_text.textContent = "Please verify account by signing in ";
				result.classList.remove("error");
			} else {
				result.textContent = "Account creation failed";
				result.classList.add("error");
			}
		});
	}

});
