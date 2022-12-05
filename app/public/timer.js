let hourInput = document.getElementById("input_hours");
let minuteInput = document.getElementById("input_minutes");
let secondInput = document.getElementById("input_seconds");
let hourDisplay = document.getElementById("display_hours");
let minuteDisplay = document.getElementById("display_minutes");
let secondDisplay = document.getElementById("display_seconds");
let startButton = document.getElementById("timer_start");
let pauseButton = document.getElementById("timer_pause");
let stopButton = document.getElementById("timer_stop");
let breakButton = document.getElementById("timer_break");
let timerError = document.getElementById("timer_error");
let timerBreakLabel = document.getElementById("timer_break_label");
// https://www.freesoundslibrary.com/ding-ding-sound-effect/
let timerAlert = new Audio("ding-ding-sound-effect.mp3");
let isPaused, isBreak = false;
let timeLimit, timerId, actualTime, displayTime, timeDif, sessionID;

function restrictInput(input) {
	input.value = input.value.replace(/[^0-9]/, '');
}

function resetTimer() {
    document.title = "The Final Countdown";
    clearInterval(timerId);
    isPaused = false;
    hourInput.style.display = "inline";
    minuteInput.style.display = "inline";
    secondInput.style.display = "inline";
    hourDisplay.style.display = "none";
    minuteDisplay.style.display = "none";
    secondDisplay.style.display = "none";
    pauseButton.textContent = "Pause";
    startButton.style.display = "inline";
    pauseButton.style.display = "none";
    stopButton.style.display = "none";
    breakButton.style.display = "none";
    timerBreakLabel.style.display = "none";
    timerTaskName.style.display = "block";
}

hourDisplay.style.display = "none";
minuteDisplay.style.display = "none";
secondDisplay.style.display = "none";
pauseButton.style.display = "none";
stopButton.style.display = "none";
breakButton.style.display = "none";
timerBreakLabel.style.display = "none";

startButton.addEventListener("click", () => {
    restrictInput(hourInput);
    restrictInput(minuteInput);
    restrictInput(secondInput);

    let hours = Number.isNaN(Number.parseInt(hourInput.value)) ? 0 : Number.parseInt(hourInput.value);
    let minutes = Number.isNaN(Number.parseInt(minuteInput.value)) ? 0 : Number.parseInt(minuteInput.value);
    let seconds = Number.isNaN(Number.parseInt(secondInput.value)) ? 0 : Number.parseInt(secondInput.value);
    timeLimit = hours * 3600 + minutes * 60 + seconds;

    if (timeLimit != 0) {
        if (isBreak) {
            let hourString = String(Math.floor(timeLimit / 3600)).padStart(2, "0");
            let minuteString = String(Math.floor((timeLimit % 3600) / 60)).padStart(2, "0");
            let secondString = String(timeLimit % 60).padStart(2, "0");
            hourDisplay.textContent = hourString;
            minuteDisplay.textContent = minuteString;
            secondDisplay.textContent = secondString;
            document.title = `${hourString}:${minuteString}:${secondString}`;
            displayTime = 0;

            timerId = setInterval(() => {
                if (!isPaused) {
                    displayTime++;
                    timeDif = timeLimit - displayTime;
                    hourString = String(Math.floor(timeDif / 3600)).padStart(2, "0");
                    minuteString = String(Math.floor((timeDif % 3600) / 60)).padStart(2, "0");
                    secondString = String(timeDif % 60).padStart(2, "0");
                    hourDisplay.textContent = hourString;
                    minuteDisplay.textContent = minuteString;
                    secondDisplay.textContent = secondString;
                    document.title = `${hourString}:${minuteString}:${secondString}`;
                    if (timeDif === 0) {
                        timerAlert.play();
                        isPaused = true;
                        pauseButton.style.display = "none";
                        breakButton.textContent = "Work";
                        breakButton.style.display = "inline";
                    }
                } else if (timeDif === 0) {
                    if (document.title === "00:00:00") {
                        document.title = "Time Up!";
                    } else {
                        document.title = "00:00:00";
                    }
                }
            }, 1000);

            hourInput.style.display = "none";
            minuteInput.style.display = "none";
            secondInput.style.display = "none";
            hourDisplay.style.display = "inline";
            minuteDisplay.style.display = "inline";
            secondDisplay.style.display = "inline";
            startButton.style.display = "none";
            pauseButton.style.display = "inline";
            stopButton.style.display = "inline";
        } else {
            fetch("/add_session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid: cookie.id,
                    taskid: Number(taskID),
                    date: Date.now() / 1000,
                    cookie: cookie.cookie
                })
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((body) => {
                        timerError.textContent = "";
                        sessionID = body.sessionID;

                        let hourString = String(Math.floor(timeLimit / 3600)).padStart(2, "0");
                        let minuteString = String(Math.floor((timeLimit % 3600) / 60)).padStart(2, "0");
                        let secondString = String(timeLimit % 60).padStart(2, "0");
                        hourDisplay.textContent = hourString;
                        minuteDisplay.textContent = minuteString;
                        secondDisplay.textContent = secondString;
                        document.title = `${hourString}:${minuteString}:${secondString}`;
                        displayTime = 0;

                        timerId = setInterval(() => {
                            if (!isPaused) {
                                displayTime++;
                                timeDif = timeLimit - displayTime;
                                hourString = String(Math.floor(timeDif / 3600)).padStart(2, "0");
                                minuteString = String(Math.floor((timeDif % 3600) / 60)).padStart(2, "0");
                                secondString = String(timeDif % 60).padStart(2, "0");
                                hourDisplay.textContent = hourString;
                                minuteDisplay.textContent = minuteString;
                                secondDisplay.textContent = secondString;
                                document.title = `${hourString}:${minuteString}:${secondString}`;
                                if (timeDif === 0) {
                                    timerAlert.play();
                                    isPaused = true;
                                    pauseButton.style.display = "none";
                                    breakButton.textContent = "Break";
                                    breakButton.style.display = "inline";
                                } else if (timeDif % 60 === 0) {
                                    fetch("/update_session", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
																						taskid: Number(taskID),
                                            sessionid: sessionID,
                                            seconds: displayTime,
                                            date: Date.now() / 1000,
                                            cookie: cookie.cookie,
                                            userid: cookie.id
                                        })
                                    }).then((response) => {
                                        if (response.status !== 200) {
                                            isPaused = true;
                                            pauseButton.textContent = "Resume";
                                            timerError.textContent = "Error connecting to server";
                                        }
                                    }).catch((error) => {
                                        isPaused = true;
                                        pauseButton.textContent = "Resume";
                                        timerError.textContent = "Error connecting to server";
                                    });
                                }
                            } else if (timeDif === 0) {
                                if (document.title === "00:00:00") {
                                    document.title = "Time Up!";
                                } else {
                                    document.title = "00:00:00";
                                }
                            }
                        }, 1000);

                        hourInput.style.display = "none";
                        minuteInput.style.display = "none";
                        secondInput.style.display = "none";
                        hourDisplay.style.display = "inline";
                        minuteDisplay.style.display = "inline";
                        secondDisplay.style.display = "inline";
                        startButton.style.display = "none";
                        pauseButton.style.display = "inline";
                        stopButton.style.display = "inline";
                    });
                } else {
                    timerError.textContent = "Error connecting to server";
                }
            }).catch((error) => {
                timerError.textContent = "Error connecting to server";
            });
        }
    }
});

pauseButton.addEventListener("click", () => {
    if (isPaused) {
        if (isBreak) {
            isPaused = false;
            pauseButton.textContent = "Pause";
        } else {
            fetch("/update_session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
										taskid: Number(taskID),
                    sessionid: sessionID,
                    seconds: displayTime,
                    date: Date.now() / 1000,
                    cookie: cookie.cookie,
                    userid: cookie.id
                })
            }).then((response) => {
                if (response.status === 200) {
                    isPaused = false;
                    pauseButton.textContent = "Pause";
                    timerError.textContent = "";
                } else {
                    timerError.textContent = "Error connecting to server";
                }
            }).catch((error) => {
                timerError.textContent = "Error connecting to server";
            });
        }
    } else {
        isPaused = true;
        pauseButton.textContent = "Resume";
    }
});

stopButton.addEventListener("click", () => {
    fetch("/update_session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
						taskid: Number(taskID),
            sessionid: sessionID,
            seconds: displayTime,
            date: Date.now() / 1000,
            cookie: cookie.cookie,
            userid: cookie.id
        })
    }).then((response) => {
        if (response.status === 200) {
            resetTimer();
            timerError.textContent = "";
        } else {
            isPaused = true;
            pauseButton.textContent = "Resume";
            timerError.textContent = "Error connecting to server";
        }
				refreshReport();
	      refreshKanban();
    }).catch((error) => {
        isPaused = true;
        pauseButton.textContent = "Resume";
        timerError.textContent = "Error connecting to server";
    });
});

breakButton.addEventListener("click", () => {
    if (!isBreak) {
        fetch("/update_session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionid: sessionID,
                seconds: displayTime,
                date: Date.now() / 1000,
                cookie: cookie.cookie,
                userid: cookie.id
            })
        }).then((response) => {
            if (response.status === 200) {
                hourInput.value = "";
                minuteInput.value = "05";
                secondInput.value = "00";
                isBreak = true;
                resetTimer();
                timerBreakLabel.style.display = "block";
                timerTaskName.style.display = "none";
                timerError.textContent = "";
            } else {
                timerError.textContent = "Error connecting to server";
            }
        }).catch((error) => {
            timerError.textContent = "Error connecting to server";
        });
    } else {
        hourInput.value = "";
        minuteInput.value = "25";
        secondInput.value = "00";
        isBreak = false;
        resetTimer();
    }
})
