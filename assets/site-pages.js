(function () {
  var root = document.documentElement;
  var body = document.body;
  var themeBtn = document.getElementById("theme-btn");
  var progress = document.getElementById("page-progress");

  function icon(theme) {
    if (theme === "dark") {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>';
    }

    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z"></path></svg>';
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pc-theme", theme);
    } catch (err) {}
    if (themeBtn) {
      themeBtn.innerHTML = icon(theme);
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
      );
    }
  }

  try {
    setTheme(localStorage.getItem("pc-theme") || "dark");
  } catch (err) {
    setTheme("dark");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      body.classList.add("theme-transition");
      setTheme(nextTheme);
      setTimeout(function () {
        body.classList.remove("theme-transition");
      }, 250);
    });
  }

  document.querySelectorAll(".js-year").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  if (progress) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      progress.style.width = String(ratio * 100) + "%";
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }
})();
