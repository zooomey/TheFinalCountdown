var home_icon = document.getElementById('home_icon');
var timer_icon = document.getElementById('timer_icon');
var addtasks = document.getElementById('addtasks');
var add_icon = document.getElementById('add_icon');
var info_1 = document.getElementById('info_1');
var help_icon = document.getElementById('help_icon');
var kanban_icon = document.getElementById('kanban_icon');
var kanban = document.getElementById('kanban');
var report_icon = document.getElementById('report_icon');
var faq = document.getElementById('faq');

let close_info = document.getElementById("close_info");
let close_faq = document.getElementById("close_faq");
let close_add = document.getElementById("close_add");
let close_timer = document.getElementById("close_timer");
let close_kanban = document.getElementById("close_kanban");

var show_faq = true;
var show_add = true;
var show_newtask = true;
var show_timer = true;
var show_kanban = true;
var show_info = true;
//*********************************************************

close_info.addEventListener("click", () => {
	show_info = false;
	info_1.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
	});
close_faq.addEventListener("click", () => {
	show_faq = false;
	faq.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
	});
close_add.addEventListener("click", () => {
	show_add = false;
	addtasks.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
	});
close_timer.addEventListener("click", () => {
	show_timer = false;
	timer.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
	});
close_kanban.addEventListener("click", () => {
	show_kanban = false;
	kanban.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
	});



//*********************************************************

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


home_icon.addEventListener("click", () => {
  window.location.replace("index.html");
});

timer_icon.addEventListener("click", () => {
});

add_icon.addEventListener("click", () => {
  if (show_newtask){
    addtasks.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
    show_newtask = false;
  }
  else{
    addtasks.removeAttribute("style");
    show_newtask = true;
  }
});


kanban_icon.addEventListener("click", () => {
  if (show_kanban){
    kanban.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
    show_kanban = false;
  }
  else{
    kanban.removeAttribute("style");
    show_kanban = true;
  }
});


report_icon.addEventListener("click", () => {
});


help_icon.addEventListener("click", () => {
  if (show_faq){
    faq.setAttribute("style", "height: 0px; overflow: hidden; margin: 0; padding: 0; border: 0");
    show_faq = false;
  }
  else{
    faq.removeAttribute("style");
    show_faq = true;
  }
});
