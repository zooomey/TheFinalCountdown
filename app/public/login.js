let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let result = document.getElementById("result");
let login = document.getElementById("login_button");
let nav = document.getElementById("SIGNIN");
let signout = document.getElementById("SIGNOUT");
let create = document.getElementById("create");
let swap_nav = document.getElementById("swap_nav");
let login_nav_text = document.getElementById("login_nav_text");
let closebtn = document.getElementById("closebtn");
var alreadySignedIn = false;


if (document.cookie){ // stay signed in
	var cookie = document.cookie;
	var name = cookie.replace('session=', '');
	cookie = JSON.parse(name);
	name = cookie.username;

	nav.textContent = "Welcome to The Final Countdown " + name + "!"; // change header
	nav.removeAttribute('onclick');

	if (name) {
		var l = document.createElement('a');
		signout.appendChild(l);
		//l.setAttribute('href', ''); // <======= load sign out / goodbye page
		l.setAttribute('style', 'font-size: 15px');
		l.textContent = " (SIGN OUT) ";

		alreadySignedIn = true;
	}
}


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
				cookie: document.cookie
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data.status === 200) {
					var username = data.username;
					var cookie = JSON.stringify({id: data.userID, username: username, cookie: data.cookie});

					document.cookie = `session=${cookie}`;

					result.textContent = "Login successful. Welcome " + username + "!";
					nav.textContent = "Welcome to The Final Countdown " + username + "!";
					nav.removeAttribute('onclick');

					var dash = document.createElement('a');
					nav.appendChild(dash);
					//dash.setAttribute('href', ''); // <======= load user dashboard / kanban

					result.classList.remove("error");
					console.log("Login successful. Welcome ", data.username);

					if (alreadySignedIn !== true){
						var l = document.createElement('a');
						signout.appendChild(l);
						//l.setAttribute('href', ''); // <======= load sign out / goodbye page
						l.setAttribute('style', 'font-size: 15px;');
						l.textContent = " (SIGN OUT) ";
					}

					location.reload();

					//document.getElementById("addtasks").style.display = "block";
					refreshTaskList();

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


signout.addEventListener("click", () => {
	console.log("SIGNING OUT");
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete cookie

	nav.textContent = "SIGN IN";
	signout.textContent = "";
});


closebtn.addEventListener("click", () => {
	clearCredentials();
});


swap_nav.addEventListener("click", () => {
	clearCredentials();
});


function clearCredentials() {
	usernameInput.value = "";
	passwordInput.value = "";
}
