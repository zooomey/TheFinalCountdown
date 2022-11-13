let NAV_title = document.getElementById("NAV_title");
let login_button = document.getElementById("login_button");

swap_nav.addEventListener("click", () => {

	if(swap_nav.className === "create_nav")
	{
			NAV_title.textContent= "Create a new account";
			login_button.textContent = "Create Account";
			login_nav_text.textContent = "Already have an account? Log in ";
			swap_nav.setAttribute("class", "login_nav");
	}
	else //(swap_nav.className === "login_nav")
	{
			NAV_title.textContent= "Log in";
			login_button.textContent = "Log in";
			login_nav_text.textContent = "Need an account? Create an account ";
			swap_nav.setAttribute("class", "create_nav");
	}
});
