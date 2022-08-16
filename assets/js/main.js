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
      duplicateActionCounter.innerText = ++duplicateActions;
   }
   else {
      indicator.style.backgroundColor = "green";
   }

   previousClickTimeStamp = timeStamp;
}

const leftClicks = document.getElementById("left-clicks");
let totalLeftClicks = 0;

const middleClicks = document.getElementById("middle-clicks");
let totalMiddleClicks = 0;

const rightClicks = document.getElementById("right-clicks");
let totalRightClicks = 0;

const forwardClicks = document.getElementById("forward-clicks");
let totalForwardClicks = 0;

const backwardClicks = document.getElementById("backward-clicks");
let totalBackwardClicks = 0;

interaction.addEventListener("mousedown", ev => {
   ev.preventDefault();
   ev.stopPropagation();

   checkThreshold(ev.timeStamp);

   const button = ev.button;

   switch (button) {
      case 0:
         leftClicks.innerText = ++totalLeftClicks;
         break;
      case 1:
         middleClicks.innerText = ++totalMiddleClicks;
         break;
      case 2:
         rightClicks.innerText = ++totalRightClicks;
         break;
      case 3:
         backwardClicks.innerText = ++totalBackwardClicks;
         break;
      case 4:
         forwardClicks.innerText = ++totalForwardClicks;
         break;
   }
});

const scrollUps = document.getElementById("scroll-ups");
let totalScrollUps = 0;

const scrollDowns = document.getElementById("scroll-downs");
let totalScrollDowns = 0;

interaction.addEventListener("wheel", ev => {
   ev.preventDefault();
   ev.stopPropagation();

   checkThreshold(ev.timeStamp);

   const delta = ev.wheelDeltaY;

   if (delta > 0) {
      scrollUps.innerText = ++totalScrollUps;
   }
   else if (delta < 0) {
      scrollDowns.innerText = ++totalScrollDowns;
   }
});

const pollingRate = document.getElementById("polling-rate");
let isPolling = true;
let moveDeltas = 0;
let moveCounter = 0;
let previousMoveTimeStamp = 0;

function displayPollingRate(ev) {
   ev.getCoalescedEvents().forEach(event => {
      const timeStamp = event.timeStamp;
      moveDeltas += timeStamp - previousMoveTimeStamp;
      moveCounter++;
      previousMoveTimeStamp = timeStamp;

      if (moveDeltas >= 200) {
         pollingRate.innerText = Math.round(1000 / (moveDeltas / moveCounter)) || "?";
         moveDeltas = moveCounter = 0;
      }
   });
}

document.getElementById("stop-polling").addEventListener("click", () => {
   if (isPolling) {
      interaction.removeEventListener("pointermove", displayPollingRate);
   }
   else {
      interaction.addEventListener("pointermove", displayPollingRate);
   }

   isPolling = !isPolling;
   pollingRate.innerText = "?";
});

interaction.addEventListener("pointermove", displayPollingRate);

threshold.addEventListener("input", () => {
   thresholdValue = threshold.value;
});

window.addEventListener("contextmenu", ev => {
   ev.preventDefault();
});