const interaction = document.getElementById("interaction");
const indicator = document.getElementById("indicator");
const threshold = document.getElementById("threshold");
const duplicateActionCounter = document.getElementById("duplicate-actions");

let previousClickTimeStamp;
let thresholdValue = threshold.value;
let duplicateActions = 0;

function checkThreshold(timeStamp) {
  if (timeStamp - previousClickTimeStamp < thresholdValue) {
    indicator.style.backgroundColor = "red";
    duplicateActionCounter.textContent = ++duplicateActions;
  } else {
    indicator.style.backgroundColor = "green";
  }

  previousClickTimeStamp = timeStamp;
}

const leftClicksDown = document.getElementById("left-clicks-down");
let totalLeftClicksDown = 0;

const middleClicksDown = document.getElementById("middle-clicks-down");
let totalMiddleClicksDown = 0;

const rightClicksDown = document.getElementById("right-clicks-down");
let totalRightClicksDown = 0;

const forwardClicksDown = document.getElementById("forward-clicks-down");
let totalForwardClicksDown = 0;

const backwardClicksDown = document.getElementById("backward-clicks-down");
let totalBackwardClicksDown = 0;

interaction.addEventListener("mousedown", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  checkThreshold(ev.timeStamp);

  const button = ev.button;

  switch (button) {
    case 0:
      leftClicksDown.textContent = ++totalLeftClicksDown;
      break;
    case 1:
      middleClicksDown.textContent = ++totalMiddleClicksDown;
      break;
    case 2:
      rightClicksDown.textContent = ++totalRightClicksDown;
      break;
    case 3:
      backwardClicksDown.textContent = ++totalBackwardClicksDown;
      break;
    case 4:
      forwardClicksDown.textContent = ++totalForwardClicksDown;
      break;
  }
});

const leftClicksUp = document.getElementById("left-clicks-up");
let totalLeftClicksUp = 0;

const middleClicksUp = document.getElementById("middle-clicks-up");
let totalMiddleClicksUp = 0;

const rightClicksUp = document.getElementById("right-clicks-up");
let totalRightClicksUp = 0;

const forwardClicksUp = document.getElementById("forward-clicks-up");
let totalForwardClicksUp = 0;

const backwardClicksUp = document.getElementById("backward-clicks-up");
let totalBackwardClicksUp = 0;

interaction.addEventListener("mouseup", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const button = ev.button;

  switch (button) {
    case 0:
      leftClicksUp.textContent = ++totalLeftClicksUp;
      break;
    case 1:
      middleClicksUp.textContent = ++totalMiddleClicksUp;
      break;
    case 2:
      rightClicksUp.textContent = ++totalRightClicksUp;
      break;
    case 3:
      backwardClicksUp.textContent = ++totalBackwardClicksUp;
      break;
    case 4:
      forwardClicksUp.textContent = ++totalForwardClicksUp;
      break;
  }
});

const scrollUps = document.getElementById("scroll-ups");
let totalScrollUps = 0;

const scrollDowns = document.getElementById("scroll-downs");
let totalScrollDowns = 0;

interaction.addEventListener("wheel", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const delta = ev.wheelDeltaY;

  if (delta > 0) {
    scrollUps.textContent = ++totalScrollUps;
  } else if (delta < 0) {
    scrollDowns.textContent = ++totalScrollDowns;
  }
});

const pollingRate = document.getElementById("polling-rate");
let isPolling = true;
let moveDeltas = 0;
let moveCounter = 0;
let previousMoveTimeStamp = 0;

function displayPollingRate(ev) {
  for (const event of ev.getCoalescedEvents()) {
    const timeStamp = event.timeStamp;
    moveDeltas += timeStamp - previousMoveTimeStamp;
    moveCounter++;
    previousMoveTimeStamp = timeStamp;

    if (moveDeltas >= 1000) {
      pollingRate.textContent =
        Math.round(1000 / (moveDeltas / moveCounter)) || "?";
      moveDeltas = moveCounter = 0;
    }
  }
}

document.getElementById("stop-polling").addEventListener("click", () => {
  if (isPolling) {
    interaction.removeEventListener("pointermove", displayPollingRate);
  } else {
    interaction.addEventListener("pointermove", displayPollingRate);
  }

  isPolling = !isPolling;
  pollingRate.textContent = "?";
});

interaction.addEventListener("pointermove", displayPollingRate);

threshold.addEventListener("input", () => {
  thresholdValue = threshold.value;
});

window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
});
