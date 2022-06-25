import { formateTime } from "./utils.js"

const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random"

const typingArea = document.querySelector("[data-typing-area]")
const quoteSpanWraper = document.querySelector("[data-quote-span-wraper]")
const restartButton = document.querySelector("[data-restart-button]")
const timerWraper = document.querySelector("[data-timer-wraper]")
const timerSpan = document.querySelector("[data-timer-span]")
const loadingIcon = document.querySelector("[data-loading-icon]")
const typingContentWraper = document.querySelector(
  "[data-typing-content-wraper]"
)

let quote, quoteSpanArray, testStart, testStartTime, testEndTime

function hide(...items) {
  items.forEach((item) => {
    item.classList.add("hide")
  })
}

function show(...items) {
  items.forEach((item) => {
    item.classList.remove("hide")
  })
}

async function fetchQuote() {
  let response = await fetch(RANDOM_QUOTE_API_URL)
  let data = await response.json()
  return [data.content, data.author]
}

async function getQuoteReady() {
  try {
    // quote = await fetchQuote()
  } catch (error) {
    console.log(error)
  }

  // for testing purpose
  quote = [
    "Friendship is held to be the severest test of character. It is easy, we think, to be loyal to a family and clan, whose blood is in your own veins.",
    "someone",
  ]

  quoteSpanArray = quote[0].split("").map(populateQuote)
  return new Promise((r) => r())
}

function populateQuote(char) {
  const span = document.createElement("span")
  span.textContent = char
  if (char == " ") {
    span.classList.add("space")
  }
  return span
}

function setTypingAreaRect() {
  typingArea.style.height = quoteSpanWraper.offsetHeight + "px"
  typingArea.style.width = quoteSpanWraper.offsetWidth + "px"
}

function reset() {
  hide(restartButton, timerWraper, typingContentWraper)
  show(loadingIcon)
  quoteSpanWraper.innerHTML = ""
  typingArea.value = ""
  timerSpan.textContent = formateTime(0)
  testStart = false
}

function paintTimer() {
  let currentTime = new Date()
  timerSpan.textContent = formateTime((currentTime - testStartTime) / 1000)
  if (testStart) {
    window.requestAnimationFrame(paintTimer)
  }
}

function startTest() {
  testStart = true
  testStartTime = new Date()
  window.requestAnimationFrame(paintTimer)
}

function endTest() {
  testStart = false
  testEndTime = new Date()
  let timeTaken = (testEndTime - testStartTime) / 1000
  showResult(timeTaken)
  timerSpan.textContent = formateTime(timeTaken)
}

function typingLoop() {
  for (let i = 0; i < quoteSpanArray.length; i++) {
    const quoteSpan = quoteSpanArray[i]
    const quoteLetter = quoteSpan.textContent
    const inputLetter = typingArea.value[i]

    quoteSpan.classList.toggle("cursor", i === typingArea.value.length)

    if (i >= typingArea.value.length) {
      quoteSpan.classList.remove("correct")
      quoteSpan.classList.remove("incorrect")
    } else {
      quoteSpan.classList.toggle("correct", quoteLetter === inputLetter)
      quoteSpan.classList.toggle("incorrect", quoteLetter !== inputLetter)
    }
  }
}

function showResult(timeTaken) {}

function typingAreaInput() {
  if (!testStart && typingArea.value.length == 1) startTest()
  if (testStart && typingArea.value.length >= quoteSpanArray.length) endTest()
  typingLoop()
}

// load

if (document.readyState === null || document.readyState === "loading") {
  document.addEventListener("load", () => typingArea.focus())
} else {
  typingArea.focus()
}
window.addEventListener("resize", setTypingAreaRect)
setTypingAreaRect()
// typingArea.addEventListener("paste", (e) => e.preventDefault())

// main

async function restart() {
  reset()
  await getQuoteReady()

  quoteSpanArray.forEach((e, i) => {
    if (i === 0) e.classList.add("cursor")
    quoteSpanWraper.append(e)
    setTypingAreaRect()
  })

  typingArea.addEventListener("input", typingAreaInput)

  show(restartButton, timerWraper, typingContentWraper)
  hide(loadingIcon)
  restartButton.addEventListener("click", restart, { once: true })
}

restart()
