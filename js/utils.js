export function formateTime(seconds) {
  let minutes = parseInt(seconds / 60)
  seconds = "0" + parseInt(seconds % 60)
  seconds = seconds.slice(seconds.length - 2)
  return `${minutes}:${seconds}`
}
