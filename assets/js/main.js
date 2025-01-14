const interaction = document.getElementById("interaction");
const threshold = document.getElementById("threshold");

let thresholdValue = threshold.value;

const buttons = [
  {
    name: "Left",
    elements: {
      totalDown: document.querySelector(".left.down"),
      totalUp: document.querySelector(".left.up"),
      totalDoubleDown: document.querySelector(".left.double"),
      minDownDownDelta: document.querySelector(".left.down-down.delta"),
      minDownUpDelta: document.querySelector(".left.down-up.delta"),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: 999999,
    minDownUpDelta: 999999,
    lastDownTimeStamp: 0,
    first: true,
  },
  {
    name: "Middle",
    elements: {
      totalDown: document.querySelector(".middle.down"),
      totalUp: document.querySelector(".middle.up"),
      totalDoubleDown: document.querySelector(".middle.double"),
      minDownDownDelta: document.querySelector(".middle.down-down.delta"),
      minDownUpDelta: document.querySelector(".middle.down-up.delta"),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: 999999,
    minDownUpDelta: 999999,
    lastDownTimeStamp: 0,
    first: true,
  },
  {
    name: "Right",
    elements: {
      totalDown: document.querySelector(".right.down"),
      totalUp: document.querySelector(".right.up"),
      totalDoubleDown: document.querySelector(".right.double"),
      minDownDownDelta: document.querySelector(".right.down-down.delta"),
      minDownUpDelta: document.querySelector(".right.down-up.delta"),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: 999999,
    minDownUpDelta: 999999,
    lastDownTimeStamp: 0,
    first: true,
  },
  {
    name: "Backward",
    elements: {
      totalDown: document.querySelector(".backward.down"),
      totalUp: document.querySelector(".backward.up"),
      totalDoubleDown: document.querySelector(".backward.double"),
      minDownDownDelta: document.querySelector(".backward.down-down.delta"),
      minDownUpDelta: document.querySelector(".backward.down-up.delta"),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: 999999,
    minDownUpDelta: 999999,
    lastDownTimeStamp: 0,
    first: true,
  },
  {
    name: "Forward",
    elements: {
      totalDown: document.querySelector(".forward.down"),
      totalUp: document.querySelector(".forward.up"),
      totalDoubleDown: document.querySelector(".forward.double"),
      minDownDownDelta: document.querySelector(".forward.down-down.delta"),
      minDownUpDelta: document.querySelector(".forward.down-up.delta"),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: 999999,
    minDownUpDelta: 999999,
    lastDownTimeStamp: 0,
    first: true,
  },
];

function handleMousedown(ev) {
  const button = buttons[ev.button];

  if (!button.first) {
    const delta = ev.timeStamp - button.lastDownTimeStamp;

    if (delta < thresholdValue) {
      button.elements.totalDoubleDown.textContent = ++button.totalDoubleDown;

      if (button.totalDoubleDown === 1) {
        button.elements.totalDoubleDown.classList.add("warning");
      }
    }

    if (delta < button.minDownDownDelta) {
      button.elements.minDownDownDelta.textContent = delta.toFixed(1);
      button.minDownDownDelta = delta;
    }

    console.log(
      `%c${button.name.padEnd(8)} | Down - Down Δ | ${delta
        .toFixed(1)
        .padStart(7)} ms`,
      "color: black; background-color: white"
    );
  }

  button.first = false;

  button.elements.totalDown.textContent = ++button.totalDown;
  button.lastDownTimeStamp = ev.timeStamp;
}

function handleMouseup(ev) {
  const button = buttons[ev.button];
  const delta = ev.timeStamp - button.lastDownTimeStamp;

  if (delta < button.minDownUpDelta) {
    button.elements.minDownUpDelta.textContent = delta.toFixed(1);
    button.minDownUpDelta = delta;
  }

  console.log(
    `%c${button.name.padEnd(8)} | Down - Up   Δ | ${delta
      .toFixed(1)
      .padStart(7)} ms`,
    "color: white; background-color: black"
  );

  button.elements.totalUp.textContent = ++button.totalUp;
}

interaction.addEventListener("mousedown", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  handleMousedown(ev);
});

interaction.addEventListener("mouseup", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  handleMouseup(ev);
});

const scrollUp = document.getElementById("scroll-up");
let totalScrollUp = 0;

const scrollDown = document.getElementById("scroll-down");
let totalScrollDown = 0;

interaction.addEventListener("wheel", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  if (ev.wheelDeltaY > 0) {
    scrollUp.textContent = ++totalScrollUp;
  } else if (ev.wheelDeltaY < 0) {
    scrollDown.textContent = ++totalScrollDown;
  }
});

const pollingRate = document.getElementById("polling-rate");
let moveDeltas = 0;
let moveCounter = 0;
let previousMoveTimeStamp = 0;

interaction.addEventListener("pointermove", (ev) => {
  for (const event of ev.getCoalescedEvents()) {
    moveDeltas += event.timeStamp - previousMoveTimeStamp;
    moveCounter++;
    previousMoveTimeStamp = event.timeStamp;

    if (moveDeltas >= 1000) {
      pollingRate.textContent = Math.round(1000 / (moveDeltas / moveCounter));
      moveDeltas = moveCounter = 0;
    }
  }
});

threshold.addEventListener("input", () => {
  thresholdValue = threshold.value;
});

window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
});
