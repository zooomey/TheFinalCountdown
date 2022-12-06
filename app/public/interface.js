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

//show info & hide faq by default
let show_faq = false;
let show_info = true;
//*********************************************************

if (!alreadySignedIn) {
    addtasks.style.display = "none";
		timer.style.display = "none";
		report.style.display = "none";
		kanban.style.display = "none";
}

//*********************************************************

close_info.addEventListener("click", () => {
	info_1.style.display = "none";
  show_info = false;
	});
close_faq.addEventListener("click", () => {
	faq.style.display = "none";
  show_faq = false;
	});
close_add.addEventListener("click", () => {
	addtasks.style.display = "none";
	});
close_timer.addEventListener("click", () => {
	timer.style.display = "none";
	});
close_kanban.addEventListener("click", () => {
	kanban.style.display = "none";
	});
close_report.addEventListener("click", () => {
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
  refreshKanban();
  refreshReport();
  refreshTaskList();
  timer.style.display = "block";
  addtasks.style.display = "block";
  report.style.display = "block";
  kanban.style.display = "flex";
  faq.style.display = "none";
  info_1.style.display = "none";
  show_faq = false;
  show_info = false;
});

timer_icon.addEventListener("click", () => {
	if (alreadySignedIn) {
	    timer.style.display = "block";
	}
});

add_icon.addEventListener("click", () => {
	if (alreadySignedIn) {
	    addtasks.style.display = "block";
	}
	else{
	    addtasks.style.display = "none";
	}
});

kanban_icon.addEventListener("click", () => {
	    kanban.style.display = "flex";
});

report_icon.addEventListener("click", () => {
	if (alreadySignedIn) {
			report.style.display = "block";
		}
		else{
			report.style.display = "none";
		}
});

help_icon.addEventListener("click", () => {
  faq.style.display = "block";
  info_1.style.display = "block";
  kanban.style.display = "none";
  report.style.display = "none";
  timer.style.display = "none";
  addtasks.style.display = "none";
  show_faq = true;
  show_info = true;
});
