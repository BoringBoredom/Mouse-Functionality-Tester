let thresholdValue = threshold.value;

const buttons = ["left", "middle", "right", "backward", "forward"].map(
  (button) => ({
    name: button.charAt(0).toUpperCase() + button.slice(1),
    elements: {
      totalDown: document.querySelector(`.down > .${button}`),
      totalUp: document.querySelector(`.up > .${button}`),
      totalDoubleDown: document.querySelector(`.double > .${button}`),
      minDownDownDelta: document.querySelector(`.down-down-delta > .${button}`),
      minDownUpDelta: document.querySelector(`.down-up-delta > .${button}`),
    },
    totalDown: 0,
    totalUp: 0,
    totalDoubleDown: 0,
    minDownDownDelta: Infinity,
    minDownUpDelta: Infinity,
    lastDownTimeStamp: 0,
    first: true,
  })
);

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

let totalScrollUp = 0;
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

let counts = 0;
let lastRefresh = performance.now();

interaction.addEventListener("pointermove", (ev) => {
  counts += ev.getCoalescedEvents().length;
  const delta = ev.timeStamp - lastRefresh;

  if (delta >= 1000) {
    pollingRate.textContent = Math.round((counts * 1000) / delta);
    counts = 0;
    lastRefresh = ev.timeStamp;
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
