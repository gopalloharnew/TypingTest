const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random"

const typingArea = document.querySelector("[data-typing-area]")
const quoteSpanWraper = document.querySelector("[data-quote-span-wraper]")
const restartButton = document.querySelector("[data-restart-button]")

let quote, quoteSpanArray

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
  await getQuoteReady()

  quoteSpanWraper.innerHTML = ""
  quoteSpanArray.forEach((e, i) => {
    if (i === 0) e.classList.add("cursor")
    quoteSpanWraper.append(e)
    setTypingAreaRect()
  })
}

restart()
restartButton.addEventListener("click", restart)
