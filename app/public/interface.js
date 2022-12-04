var addtasks = document.getElementById('addtasks');
var info_1 = document.getElementById('info_1');
var faq = document.getElementById('faq');
var kanban = document.getElementById('kanban');
var report = document.getElementById('report');

var home_icon = document.getElementById('home_icon');
var timer_icon = document.getElementById('timer_icon');
var add_icon = document.getElementById('add_icon');
var report_icon = document.getElementById('report_icon');
var kanban_icon = document.getElementById('kanban_icon');
var help_icon = document.getElementById('help_icon');

let close_info = document.getElementById("close_info");
let close_faq = document.getElementById("close_faq");
let close_add = document.getElementById("close_add");
let close_timer = document.getElementById("close_timer");
let close_kanban = document.getElementById("close_kanban");
let close_report = document.getElementById("close_report");

var show_faq = true;
var show_info = true;
var show_add = false;
var show_report = false;
var show_timer = false;
var show_kanban = false;

//*********************************************************

if (alreadySignedIn) {
    refreshTaskList();
} else {
    addtasks.style.display = "none";
		timer.style.display = "none";
		report.style.display = "none";
		kanban.style.display = "none";
		show_add = false;
		show_timer = false;
		show_report = false;
		show_timer = false;
		show_kanban = false;
}

//*********************************************************

close_info.addEventListener("click", () => {
	show_info = false;
	info_1.style.display = "none";
	});
close_faq.addEventListener("click", () => {
	show_faq = false;
	faq.style.display = "none";
	});
close_add.addEventListener("click", () => {
	show_add = false;
	addtasks.style.display = "none";
	});
close_timer.addEventListener("click", () => {
	show_timer = false;
	timer.style.display = "none";
	});
close_kanban.addEventListener("click", () => {
	show_kanban = false;
	kanban.style.display = "none";
	});
close_report.addEventListener("click", () => {
	show_report = false;
	report.style.display = "none";
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
	if (alreadySignedIn) {
		if (show_timer){
	    timer.style.display = "none";
	    show_timer = false;
	  }
	  else{
	    timer.style.display = "block";
	    show_timer = true;
	  }
	}
});

add_icon.addEventListener("click", () => {
	if (alreadySignedIn) {
	  if (show_add){
	    addtasks.style.display = "none";
	    show_add = false;
	  }
	  else{
	    addtasks.style.display = "block";
	    show_add = true;
	  }
	}
});

kanban_icon.addEventListener("click", () => {
	  if (show_kanban){
	    kanban.style.display = "none";
	    show_kanban = false;
	  }
	  else{
	    kanban.style.display = "flex";
	    show_kanban = true;
	  }
});

report_icon.addEventListener("click", () => {
	if (alreadySignedIn) {
		if (show_report){
			report.style.display = "none";
			show_report = false;
		}
		else{
			report.style.display = "block";
			show_report = true;
		}
	}
});

help_icon.addEventListener("click", () => {
  if (show_faq){
    faq.style.display = "none";
		info_1.style.display = "none";
    show_faq = false;
		show_info = false;
  }
  else{
    faq.style.display = "block";
		info_1.style.display = "block";
    show_faq = true;
		show_info = true;
  }
});
