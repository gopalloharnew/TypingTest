export function formateTime(seconds) {
  let minutes = parseInt(seconds / 60)
  seconds = "0" + parseInt(seconds % 60)
  seconds = seconds.slice(seconds.length - 2)
  return `${minutes}:${seconds}`
}

export function hide(...items) {
  items.forEach((item) => {
    item.classList.add("hide")
  })
}

export function show(...items) {
  items.forEach((item) => {
    item.classList.remove("hide")
  })
}
