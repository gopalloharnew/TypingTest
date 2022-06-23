const html = document.querySelector("html")
const themeButton = document.querySelector("[data-theme-button]")

let theme =
  localStorage.getItem("theme") ??
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light")

html.dataset.theme = theme

themeButton.addEventListener("click", () => {
  theme = theme === "Dark" ? "Light" : "Dark"
  localStorage.setItem("theme", theme)
  html.dataset.theme = theme
})
