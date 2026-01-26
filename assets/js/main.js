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
  }),
);

interaction.addEventListener("mousedown", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

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
      button.elements.minDownDownDelta.textContent = delta.toFixed(2);
      button.minDownDownDelta = delta;
    }

    console.log(
      `%c${button.name.padEnd(8)} | Down - Down Δ | ${delta
        .toFixed(2)
        .padStart(8)} ms`,
      "color: black; background-color: white",
    );
  }

  button.first = false;

  button.elements.totalDown.textContent = ++button.totalDown;
  button.lastDownTimeStamp = ev.timeStamp;
});

interaction.addEventListener("mouseup", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const button = buttons[ev.button];
  const delta = ev.timeStamp - button.lastDownTimeStamp;

  if (delta < button.minDownUpDelta) {
    button.elements.minDownUpDelta.textContent = delta.toFixed(2);
    button.minDownUpDelta = delta;
  }

  console.log(
    `%c${button.name.padEnd(8)} | Down - Up   Δ | ${delta
      .toFixed(2)
      .padStart(8)} ms`,
    "color: white; background-color: black",
  );

  button.elements.totalUp.textContent = ++button.totalUp;
});

let totalScrollUp = 0;
let totalScrollDown = 0;
let totalScrollLeft = 0;
let totalScrollRight = 0;

interaction.addEventListener("wheel", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  if (ev.deltaY < 0) {
    scrollUp.textContent = ++totalScrollUp;
  } else if (ev.deltaY > 0) {
    scrollDown.textContent = ++totalScrollDown;
  }

  if (ev.deltaX < 0) {
    scrollLeft.textContent = ++totalScrollLeft;
  } else if (ev.deltaX > 0) {
    scrollRight.textContent = ++totalScrollRight;
  }
});

let counts = 0;
let lastRefresh = performance.now();

function handlePointerUpdate(ev) {
  counts += ev.getCoalescedEvents().length;
  const delta = ev.timeStamp - lastRefresh;

  if (delta >= 500) {
    reportRate.textContent = Math.round((counts * 1000) / delta);
    counts = 0;
    lastRefresh = ev.timeStamp;
  }
}

const supportsPointerLock = "requestPointerLock" in Element.prototype;
const supportsPointerRawUpdate = "onpointerrawupdate" in window;
let supportsUnadjustedMovement = true;

const unadjustedMovementNote = `Your browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock#browser_compatibility">unadjustedMovement</a>.`;
const pointerRawUpdateNote = `Your browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerrawupdate_event#browser_compatibility">pointerrawupdate</a>.`;

function generateNote() {
  const notes = [];

  if (!supportsPointerRawUpdate) {
    notes.push(pointerRawUpdateNote);
  }

  if (!supportsUnadjustedMovement) {
    notes.push(unadjustedMovementNote);
  }

  if (notes.length > 0) {
    notes.push("Expect reduced accuracy.");
  }

  return notes.join("<br />");
}

if (supportsPointerLock) {
  lockCursor.addEventListener("click", async () => {
    try {
      await document.body.requestPointerLock({ unadjustedMovement: true });
    } catch {
      supportsUnadjustedMovement = false;
      note.innerHTML = generateNote();
      document.body.requestPointerLock();
    }
  });

  let pointerEvent = "pointerrawupdate";
  if (!supportsPointerRawUpdate) {
    pointerEvent = "pointermove";
    note.innerHTML = generateNote();
  }

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === document.body) {
      document.addEventListener(pointerEvent, handlePointerUpdate);
      instructions.textContent =
        "Quickly move the mouse in circles. Press ESC to stop measuring.";
    } else {
      document.removeEventListener(pointerEvent, handlePointerUpdate);
      instructions.textContent = "Click here to measure the report rate.";
      reportRate.textContent = "-";
    }
  });
} else {
  instructions.innerHTML = `Unable to measure the report rate. Your browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock#browser_compatibility">requestPointerLock()</a>.`;
}

threshold.addEventListener("input", () => {
  thresholdValue = threshold.value;
});

window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
});
