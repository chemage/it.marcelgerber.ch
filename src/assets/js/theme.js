(function () {
  var root = document.documentElement;

  document.getElementById("theme-toggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Keep the address out of the HTML source so scrapers don't harvest it.
  var mail = document.getElementById("contact-email");
  if (mail) {
    mail.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "mailto:" + mail.dataset.user + "@" + mail.dataset.host;
    });
  }
})();
