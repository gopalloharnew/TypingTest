import { formateTime, hide, show } from "./utils.js"

const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random"

const typingArea = document.querySelector("[data-typing-area]")
const quoteSpanWraper = document.querySelector("[data-quote-span-wraper]")
const restartButton = document.querySelector("[data-restart-button]")
const timerWraper = document.querySelector("[data-timer-wraper]")
const timerSpan = document.querySelector("[data-timer-span]")
const loadingIcon = document.querySelector("[data-loading-icon]")
const resultWraper = document.querySelector("[data-result-wraper]")
const errorElement = document.querySelector("[data-error]")
const typingContentWraper = document.querySelector(
  "[data-typing-content-wraper]"
)

let quote, quoteSpanArray, testStart, testStartTime, testEndTime, mistakes

// handle quote
async function fetchQuote() {
  let data
  try {
    let response = await fetch(RANDOM_QUOTE_API_URL)
    data = await response.json()
  } catch (error) {
    return false
  }
  return [data.content, data.author]
}

async function getQuoteReady() {
  try {
    quote = await fetchQuote()
    if (quote === false) {
      return "Failed"
    }
  } catch (error) {
    console.log(error)
    return "Failed"
  }

  quoteSpanArray = quote[0].split("").map(populateQuote)
  return new Promise((r) => r("Fetched"))
}

function populateQuote(char) {
  const span = document.createElement("span")
  span.textContent = char
  if (char == " ") {
    span.classList.add("space")
  }
  return span
}

// typingArea
function setTypingAreaRect() {
  typingArea.style.height = quoteSpanWraper.offsetHeight + "px"
  typingArea.style.width = quoteSpanWraper.offsetWidth + "px"
}

function reset() {
  hide(
    restartButton,
    timerWraper,
    typingContentWraper,
    resultWraper,
    errorElement
  )
  show(loadingIcon)
  quoteSpanWraper.innerHTML = ""
  typingArea.value = ""
  quote = ["", ""]
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
  mistakes = 0
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

function showResult(timeTaken) {
  hide(typingContentWraper)
  let accuracy = (100 - (mistakes / quoteSpanArray.length) * 100).toFixed(1)
  if (accuracy < 0) accuracy = 0
  let speed = parseInt(
    ((quoteSpanArray.length * 12) / timeTaken) * (accuracy / 100)
  )

  document.querySelector("[data-result-author]").textContent = quote[1]
  document.querySelector("[data-result-speed]").textContent = speed + " wpm"
  document.querySelector("[data-result-accuracy]").textContent = accuracy + "%"
  document.querySelector("[data-result-time-taken]").textContent =
    formateTime(timeTaken)
  setTimeout(() => {
    show(resultWraper)
  }, 250)
}

function typingAreaInput() {
  let typedLength = typingArea.value.length
  if (!testStart && typedLength == 1) startTest()
  if (
    quoteSpanArray[typedLength - 1] !== undefined &&
    typingArea.value[typedLength - 1] !=
      quoteSpanArray[typedLength - 1].textContent
  ) {
    mistakes++
  }
  typingLoop()
  if (testStart && typedLength >= quoteSpanArray.length) endTest()
}

// load

window.addEventListener("resize", setTypingAreaRect)
setTypingAreaRect()
typingArea.addEventListener("paste", (e) => e.preventDefault())

// main

async function restart() {
  reset()
  let quoteResponse = await getQuoteReady()
  if (quoteResponse === "Failed") {
    show(restartButton, errorElement)
    hide(loadingIcon)
  } else {
    quoteSpanArray.forEach((e, i) => {
      if (i === 0) e.classList.add("cursor")
      quoteSpanWraper.append(e)
      setTypingAreaRect()
    })

    typingArea.addEventListener("input", typingAreaInput)
    typingArea.focus()

    show(restartButton, timerWraper, typingContentWraper)
    hide(loadingIcon)
  }
  restartButton.addEventListener("click", restart, { once: true })
}

restart()
