const interaction = document.getElementById('interaction')
const indicator = document.getElementById('indicator')
const threshold = document.getElementById('threshold')
const duplicateActionCounter = document.getElementById('duplicate-actions')

let previousClickTimeStamp
let thresholdValue = threshold.value
let duplicateActions = 0

function checkThreshold(timeStamp) {
    if (timeStamp - previousClickTimeStamp < thresholdValue) {
        indicator.style.backgroundColor = 'red'
        duplicateActions++
        duplicateActionCounter.innerHTML = duplicateActions
    }
    else {
        indicator.style.backgroundColor = 'green'
    }

    previousClickTimeStamp = timeStamp
}

const leftClicks = document.getElementById('left-clicks')
let totalLeftClicks = 0

const middleClicks = document.getElementById('middle-clicks')
let totalMiddleClicks = 0

const rightClicks = document.getElementById('right-clicks')
let totalRightClicks = 0

const forwardClicks = document.getElementById('forward-clicks')
let totalForwardClicks = 0

const backwardClicks = document.getElementById('backward-clicks')
let totalBackwardClicks = 0

interaction.addEventListener('mousedown', ev => {
    ev.preventDefault()
    ev.stopPropagation()

    checkThreshold(ev.timeStamp)

    const button = ev.button

    if (button === 0) {
        totalLeftClicks++
        leftClicks.innerHTML = totalLeftClicks
    }
    else if (button === 1) {
        totalMiddleClicks++
        middleClicks.innerHTML = totalMiddleClicks
    }
    else if (button === 2) {
        totalRightClicks++
        rightClicks.innerHTML = totalRightClicks
    }
    else if (button === 3) {
        totalBackwardClicks++
        backwardClicks.innerHTML = totalBackwardClicks
    }
    else if (button === 4) {
        totalForwardClicks++
        forwardClicks.innerHTML = totalForwardClicks
    }
})

const scrollUps = document.getElementById('scroll-ups')
let totalScrollUps = 0

const scrollDowns = document.getElementById('scroll-downs')
let totalScrollDowns = 0

interaction.addEventListener('wheel', ev => {
    ev.preventDefault()
    ev.stopPropagation()

    checkThreshold(ev.timeStamp)

    const delta = ev.wheelDeltaY

    if (delta > 0) {
        totalScrollUps++
        scrollUps.innerHTML = totalScrollUps
    }
    else if (delta < 0) {
        totalScrollDowns++
        scrollDowns.innerHTML = totalScrollDowns
    }
})

const pollingRate = document.getElementById('polling-rate')
let isPolling = true
let moveDeltas = 0
let moveCounter = 0
let previousMoveTimeStamp = 0

document.getElementById('stop-polling').addEventListener('click', ev => {
    isPolling = !isPolling
    pollingRate.innerHTML = '?'
})

interaction.addEventListener('pointermove', ev => {
    if (!isPolling) {
        return
    }

    for (const event of ev.getCoalescedEvents()) {
        const timeStamp = event.timeStamp
        moveDeltas += timeStamp - previousMoveTimeStamp
        moveCounter++
        previousMoveTimeStamp = timeStamp

        if (moveDeltas >= 200) {
            pollingRate.innerHTML = Math.round(1000 / (moveDeltas / moveCounter)) || '?'
            moveDeltas = moveCounter = 0
        }
    }
})

threshold.addEventListener('input', ev => {
    thresholdValue = threshold.value
})

window.addEventListener('contextmenu', ev => {
    ev.preventDefault()
})