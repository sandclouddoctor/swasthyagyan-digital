/* SwasthyaGyan Digital — shared site behavior */
(function () {
  // ---- Theme ----
  var THEMES = ["grove", "clinic", "sage"];
  var saved = null;
  try { saved = localStorage.getItem("sg-theme"); } catch (e) {}
  if (THEMES.indexOf(saved) === -1) saved = "grove";
  document.documentElement.setAttribute("data-theme", saved);

  function applyTheme(t) {
    if (THEMES.indexOf(t) === -1) return;
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("sg-theme", t); } catch (e) {}
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.theme === t ? "true" : "false");
    });
  }
  window.__sgApplyTheme = applyTheme;

  function initHeader() {
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.theme === saved ? "true" : "false");
      b.addEventListener("click", function () { applyTheme(b.dataset.theme); });
    });
    var toggle = document.querySelector(".menu-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () { links.classList.toggle("open"); });
    }
  }

  // ---- Reveal on scroll ----
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (e) {
      e.textContent = new Date().getFullYear();
    });
  }

  function init() { initHeader(); initReveal(); initYear(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
