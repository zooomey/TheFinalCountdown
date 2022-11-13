let hourInput = document.getElementById("input_hours");
let minuteInput = document.getElementById("input_minutes");
let secondInput = document.getElementById("input_seconds");
let hourDisplay = document.getElementById("display_hours");
let minuteDisplay = document.getElementById("display_minutes");
let secondDisplay = document.getElementById("display_seconds");
let startButton = document.getElementById("timer_start");
let pauseButton = document.getElementById("timer_pause");
let stopButton = document.getElementById("timer_stop");
let finishButton = document.getElementById("timer_finish");
let timerError = document.getElementById("timer_error");
// https://www.freesoundslibrary.com/ding-ding-sound-effect/
let timerAlert = new Audio("ding-ding-sound-effect.mp3");
let isPaused = false;
let timeLimit, timerId, actualTime, displayTime, timeDif, sessionID;

function restrictInput(input) {
	input.value = input.value.replace(/[^0-9]/, '');
}

function resetTimer() {
    // Return page title to previous value here
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
    finishButton.style.display = "none";
}

function updateSession(finished) {
    return fetch("/update_session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionid: sessionID,
            seconds: displayTime,
            finished: finished
        })
    }).then((response) => {
        if (response.status === 200) {
            console.log(true);
            return true;
        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    });
}

hourDisplay.style.display = "none";
minuteDisplay.style.display = "none";
secondDisplay.style.display = "none";
pauseButton.style.display = "none";
stopButton.style.display = "none";
finishButton.style.display = "none";

startButton.addEventListener("click", () => {
    restrictInput(hourInput);
    restrictInput(minuteInput);
    restrictInput(secondInput);

    let hours = Number.isNaN(Number.parseInt(hourInput.value)) ? 0 : Number.parseInt(hourInput.value);
    let minutes = Number.isNaN(Number.parseInt(minuteInput.value)) ? 0 : Number.parseInt(minuteInput.value);
    let seconds = Number.isNaN(Number.parseInt(secondInput.value)) ? 0 : Number.parseInt(secondInput.value);
    timeLimit = hours * 3600 + minutes * 60 + seconds;

    if (timeLimit != 0) {
        fetch("/add_session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Where are we getting userID from?
                // taskID should come from task.js
                // Placeholders
                userid: 4,
                taskid: 1
            })
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((body) => {
                    timerError.textContent = "";
                    sessionID = body.sessionID;
                    let titleFlash = false;

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
                            } else if (timeDif % 60 === 0) {
                                fetch("/update_session", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        sessionid: sessionID,
                                        seconds: displayTime,
                                        finished: false
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
                    finishButton.style.display = "inline";
                });
            } else {
                timerError.textContent = "Error connecting to server";
            }
        }).catch((error) => {
            timerError.textContent = "Error connecting to server";
        });
    }
});

pauseButton.addEventListener("click", () => {
    if (isPaused) {
        fetch("/update_session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionid: sessionID,
                seconds: displayTime,
                finished: false
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
            sessionid: sessionID,
            seconds: displayTime,
            finished: false
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
    }).catch((error) => {
        isPaused = true;
        pauseButton.textContent = "Resume";
        timerError.textContent = "Error connecting to server";
    });
});

finishButton.addEventListener("click", () => {
    fetch("/update_session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionid: sessionID,
            seconds: displayTime,
            finished: true
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
    }).catch((error) => {
        isPaused = true;
        pauseButton.textContent = "Resume";
        timerError.textContent = "Error connecting to server";
    });
});