const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random"

const typingArea = document.querySelector("[data-typing-area]")
const quoteSpanWraper = document.querySelector("[data-quote-span-wraper]")
const restartButton = document.querySelector("[data-restart-button]")
const timerWraper = document.querySelector("[data-timer-wraper]")
const loadingIcon = document.querySelector("[data-loading-icon]")
const typingContentWraper = document.querySelector(
  "[data-typing-content-wraper]"
)

let quote, quoteSpanArray

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
    quote = await fetchQuote()
  } catch (error) {
    console.log(error)
  }
  quoteSpanArray = quote[0].split("").map(populateQuote)
  return new Promise((r) => r())
}

function populateQuote(char) {
  const span = document.createElement("span")
  span.textContent = char
  span.classList.toggle("space", char == " ")
  return span
}

function setTypingAreaRect() {
  typingArea.style.height = quoteSpanWraper.offsetHeight + "px"
  typingArea.style.width = quoteSpanWraper.offsetWidth + "px"
}

// load

if (document.readyState === null || document.readyState === "loading") {
  document.addEventListener("load", () => typingArea.focus())
} else {
  typingArea.focus()
}
window.addEventListener("resize", setTypingAreaRect)
setTypingAreaRect()

// main

async function restart() {
  hide(restartButton, timerWraper, typingContentWraper)
  show(loadingIcon)
  await getQuoteReady()

  quoteSpanWraper.innerHTML = ""
  typingArea.value = ""
  quoteSpanArray.forEach((e, i) => {
    if (i === 0) e.classList.add("cursor")
    quoteSpanWraper.append(e)
    setTypingAreaRect()
  })

  show(restartButton, timerWraper, typingContentWraper)
  hide(loadingIcon)
  restartButton.addEventListener("click", restart, { once: true })
}

restart()
