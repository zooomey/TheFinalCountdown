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

//*********************************************************

function openNav() {
  document.getElementById("mySidenav").style.width = "450px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//*********************************************************

var gridDiv = document.getElementById('gridDiv');
new Sortable(gridDiv, {
  animation: 150,
  ghostClass: 'blue-background-class'
});

//*********************************************************

var home_icon = document.getElementById('home_icon');

home_icon.addEventListener("click", () => {
  window.location.replace("index.html");
});


var timer_icon = document.getElementById('timer_icon');

timer_icon.addEventListener("click", () => {
});


var addtasks = document.getElementById('addtasks');
var add_icon = document.getElementById('add_icon');
var show_newtask = true;

add_icon.addEventListener("click", () => {
  if (show_newtask === true){
    addtasks.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
    show_newtask = false;
  }
  else{
    addtasks.removeAttribute("style");
    show_newtask = true;
  }
});


var report_icon = document.getElementById('report_icon');

report_icon.addEventListener("click", () => {
});


var info_1 = document.getElementById('info_1');
var help_icon = document.getElementById('help_icon');
var show_info = true;

help_icon.addEventListener("click", () => {
  if (show_info === true){
    info_1.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
    show_info = false;
  }
  else{
    info_1.removeAttribute("style");
    show_info = true;
  }
});
