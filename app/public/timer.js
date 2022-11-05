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
let isPaused = false;
let timeLimit, timerId, actualTime, displayTime;

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
        let hourString = String(Math.floor(timeLimit / 3600)).padStart(2, "0");
        let minuteString = String(Math.floor((timeLimit % 3600) / 60)).padStart(2, "0");
        let secondString = String(timeLimit % 60).padStart(2, "0");
        hourDisplay.textContent = hourString;
        minuteDisplay.textContent = minuteString;
        secondDisplay.textContent = secondString;
        document.title = `${hourString}:${minuteString}:${secondString}`;
        actualTime = 0;
        displayTime = 0;

        timerId = setInterval(() => {
            actualTime++;
            if (!isPaused) {
                displayTime++;
                let timeDif = timeLimit - displayTime;
                hourString = String(Math.floor(timeDif / 3600)).padStart(2, "0");
                minuteString = String(Math.floor((timeDif % 3600) / 60)).padStart(2, "0");
                secondString = String(timeDif % 60).padStart(2, "0");
                hourDisplay.textContent = hourString;
                minuteDisplay.textContent = minuteString;
                secondDisplay.textContent = secondString;
                document.title = `${hourString}:${minuteString}:${secondString}`;
                if (displayTime === timeLimit) {
                    // Play sound here?
                    isPaused = true;
                    pauseButton.style.display = "none";
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
    }
});

pauseButton.addEventListener("click", () => {
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = "Pause";
    } else {
        isPaused = true;
        pauseButton.textContent = "Resume";
    }
});

stopButton.addEventListener("click", () => {
    resetTimer();
    // POST task name, display time, actual time, stopped
});

finishButton.addEventListener("click", () => {
    resetTimer();
    // POST task name, display time, actual time, finished
});